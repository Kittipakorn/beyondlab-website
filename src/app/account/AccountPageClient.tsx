"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";

type SessionData = {
  authenticated: boolean;
  user?: {
    username: string;
    email: string;
    plan: string;
    role: string;
    firstName?: string;
    lastName?: string;
    planExpiresAt?: string | null;
  };
};

export type CourseEnrollment = {
  id: string;
  title: string;
  description?: string;
  image?: string;
  href: string;
  progress?: number;
  totalLessons?: number;
  completedLessons?: number;
};

export type PurchaseOrder = {
  id: string;
  title: string;
  purchasedAt: string;
  amount: number;
  status: "paid" | "pending" | "refunded";
  receiptHref?: string;
};

type AccountPageClientProps = {
  username: string;
  email: string;
  backendUrl: string;
  courses?: CourseEnrollment[];
  orders?: PurchaseOrder[];
};

type IconName =
  | "home"
  | "book"
  | "receipt"
  | "user"
  | "spark"
  | "code"
  | "monitor"
  | "logout"
  | "arrow"
  | "check"
  | "clock"
  | "upload"
  | "student"
  | "chevron"
  | "close";

const iconPaths: Record<IconName, ReactNode> = {
  home: <><path d="m3 11 9-7 9 7" /><path d="M5 10v10h14V10M9 20v-6h6v6" /></>,
  book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22.5v-17Z" /><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5a2.5 2.5 0 0 1 2.5 2.5v-17Z" /></>,
  receipt: <><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" /><path d="M9 8h6M9 12h6M9 16h3" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" /></>,
  spark: <><path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" /><path d="m19 15 .75 2.25L22 18l-2.25.75L19 21l-.75-2.25L16 18l2.25-.75L19 15Z" /></>,
  code: <><path d="m8 9-3 3 3 3M16 9l3 3-3 3M14 5l-4 14" /></>,
  monitor: <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></>,
  logout: <><path d="M10 5V3H4v18h6v-2" /><path d="M14 8l4 4-4 4M8 12h10" /></>,
  arrow: <><path d="M5 12h14M14 7l5 5-5 5" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  upload: <><path d="M12 16V4M7 9l5-5 5 5" /><path d="M5 14v6h14v-6" /></>,
  student: <><path d="m3 9 9-5 9 5-9 5-9-5Z" /><path d="M7 12v4c3 2 7 2 10 0v-4" /></>,
  chevron: <path d="m8 10 4 4 4-4" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
};

function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {iconPaths[name]}
    </svg>
  );
}

type AccountTab = "overview" | "courses" | "orders" | "profile";

const navItems: Array<{ id: AccountTab; label: string; icon: IconName }> = [
  { id: "overview", label: "ภาพรวม", icon: "home" },
  { id: "courses", label: "คอร์สของฉัน", icon: "book" },
  { id: "orders", label: "การซื้อ", icon: "receipt" },
  { id: "profile", label: "บัญชี", icon: "user" },
];

function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 4000);
    return () => window.clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-x-4 top-20 z-[100] flex justify-end sm:inset-x-auto sm:right-6" role="status" aria-live="polite">
      <div className={`flex w-full max-w-sm items-center gap-3 rounded-2xl border bg-white px-4 py-3 text-sm font-semibold shadow-[0_18px_50px_rgba(34,28,23,.18)] ${type === "success" ? "border-emerald-200 text-emerald-800" : "border-rose-200 text-rose-800"}`}>
        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${type === "success" ? "bg-emerald-100" : "bg-rose-100"}`}>
          <Icon name={type === "success" ? "check" : "close"} className="h-4 w-4" />
        </span>
        <span className="flex-1">{message}</span>
        <button type="button" onClick={onClose} aria-label="ปิดข้อความ" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-current opacity-60 transition hover:bg-black/5 hover:opacity-100">
          <Icon name="close" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-[#eadfd2] ${className}`} />;
}

function SectionHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c65018]">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-bold tracking-[-0.02em] text-[#23201e] sm:text-[28px]">{title}</h2>
        <p className="mt-1.5 max-w-xl text-sm leading-6 text-[#6e645d]">{description}</p>
      </div>
      {action}
    </div>
  );
}

function EmptyState({ icon, title, description, href, action }: { icon: IconName; title: string; description: string; href: string; action: string }) {
  return (
    <div className="mt-6 rounded-[24px] border border-dashed border-[#d9cbbb] bg-[#fbf8f4] px-5 py-10 text-center sm:px-10">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-[#efcaaa] bg-[#fff3e9] text-[#c65018] shadow-sm">
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <h3 className="mt-4 text-base font-bold text-[#292522]">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#766c64]">{description}</p>
      <Link href={href} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#292522] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#c65018]">
        {action}<Icon name="arrow" className="h-4 w-4" />
      </Link>
    </div>
  );
}

function formatThaiDate(value?: string | null) {
  if (!value) return "ไม่มีกำหนด";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "ไม่มีกำหนด";
  return new Intl.DateTimeFormat("th-TH", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 }).format(value);
}

export function AccountPageClient({ username, email, backendUrl, courses = [], orders = [] }: AccountPageClientProps) {
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error"; id: number } | null>(null);
  const toastId = useRef(0);
  const [slipImage, setSlipImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [studentEmail, setStudentEmail] = useState("");
  const [studentName, setStudentName] = useState("");
  const [requestingCode, setRequestingCode] = useState(false);
  const [profileUsername, setProfileUsername] = useState(username);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [expandedSection, setExpandedSection] = useState<"payment" | "student" | null>(null);
  const [activeTab, setActiveTab] = useState<AccountTab>("overview");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const cancelLogoutButtonRef = useRef<HTMLButtonElement>(null);

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    toastId.current += 1;
    setToast({ message, type, id: toastId.current });
  }, []);

  const refreshSession = useCallback(async () => {
    const response = await fetch(`${backendUrl}/auth/session`, { credentials: "include" });
    if (!response.ok) throw new Error("session");
    const nextSession = (await response.json()) as SessionData;
    setSession(nextSession);
    setProfileUsername(nextSession.user?.username ?? username);
    setFirstName(nextSession.user?.firstName ?? "");
    setLastName(nextSession.user?.lastName ?? "");
  }, [backendUrl, username]);

  useEffect(() => {
    refreshSession()
      .catch(() => setSession({ authenticated: false }))
      .finally(() => setLoading(false));
  }, [refreshSession]);

  useEffect(() => {
    if (!showLogoutConfirm) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cancelLogoutButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLoggingOut) setShowLogoutConfirm(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showLogoutConfirm, isLoggingOut]);

  const handleSlipFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      showToast("ไฟล์ต้องมีขนาดไม่เกิน 8 MB", "error");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setSlipImage(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  };

  const handleUploadSlip = async () => {
    if (!slipImage) return showToast("กรุณาเลือกรูปสลิปชำระเงิน", "error");
    setUploading(true);
    try {
      const response = await fetch(`${backendUrl}/api/user/upload-slip`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ slipImage }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "ไม่สามารถอัปโหลดสลิปได้");
      showToast(data.message || "ต่ออายุ PRO สำเร็จ");
      setSlipImage(null);
      setExpandedSection(null);
      await refreshSession();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการเชื่อมต่อ", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleRequestStudentCode = async (event: FormEvent) => {
    event.preventDefault();
    if (!studentEmail.trim() || !studentName.trim()) return showToast("กรุณากรอกข้อมูลให้ครบถ้วน", "error");
    setRequestingCode(true);
    try {
      const response = await fetch(`${backendUrl}/api/user/request-student-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: studentEmail.trim(), fullName: studentName.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "ไม่สามารถยืนยันสิทธิ์ได้");
      showToast(data.message || "ยืนยันสิทธิ์นักเรียนสำเร็จ");
      setStudentEmail("");
      setStudentName("");
      setExpandedSection(null);
      await refreshSession();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการเชื่อมต่อ", "error");
    } finally {
      setRequestingCode(false);
    }
  };

  const handleSaveProfile = async (event: FormEvent) => {
    event.preventDefault();
    const nextUsername = profileUsername.trim();
    if (!/^[a-zA-Z0-9._-]{3,32}$/.test(nextUsername)) {
      showToast("Username ต้องมี 3–32 ตัว ใช้ a-z, 0-9, จุด, ขีดกลาง หรือขีดล่าง", "error");
      return;
    }
    setSavingProfile(true);
    try {
      const response = await fetch(`${backendUrl}/api/user/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: nextUsername, firstName: firstName.trim(), lastName: lastName.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "บันทึกข้อมูลไม่สำเร็จ");
      showToast(data.message || "บันทึกข้อมูลบัญชีแล้ว");
      await refreshSession();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการเชื่อมต่อ", "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      const response = await fetch(`/api/auth/logout?returnTo=${encodeURIComponent("/")}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        credentials: "same-origin",
      });
      const data = (await response.json()) as { redirectTo?: string };
      if (!response.ok) throw new Error("ไม่สามารถออกจากระบบได้");

      window.location.replace(data.redirectTo ?? "/login");
    } catch {
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
      showToast("ออกจากระบบไม่สำเร็จ กรุณาลองอีกครั้ง", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] bg-[#f4efe9] px-4 py-10 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <Skeleton className="hidden h-[520px] lg:block" />
          <div className="space-y-5"><Skeleton className="h-20" /><Skeleton className="h-14" /><Skeleton className="h-80" /></div>
        </div>
      </div>
    );
  }

  const user = session?.user;
  const displayName = user?.username || username;
  const displayEmail = user?.email || email;
  const isPro = user?.plan?.toLowerCase() === "pro";
  const initials = displayName.trim().charAt(0).toUpperCase() || "B";

  return (
    <div className="min-h-screen bg-[#f4efe9] text-[#292522]">
      {toast ? <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToast(null)} /> : null}
      {showLogoutConfirm ? (
        <div className="fixed inset-0 z-[100] grid place-items-center px-4" role="presentation">
          <button type="button" aria-label="ยกเลิกการออกจากระบบ" disabled={isLoggingOut} onClick={() => setShowLogoutConfirm(false)} className="absolute inset-0 cursor-default bg-[#1d1916]/55 backdrop-blur-[2px] disabled:cursor-wait" />
          <div role="dialog" aria-modal="true" aria-labelledby="logout-dialog-title" aria-describedby="logout-dialog-description" className="relative w-full max-w-md rounded-[24px] border border-white/60 bg-white p-6 shadow-[0_24px_80px_rgba(30,23,18,.3)] sm:p-7">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-rose-700"><Icon name="logout" className="h-6 w-6" /></span>
            <h2 id="logout-dialog-title" className="mt-5 text-xl font-bold text-[#292522]">ออกจากระบบใช่ไหม?</h2>
            <p id="logout-dialog-description" className="mt-2 text-sm leading-6 text-[#70665f]">คุณจะต้องเข้าสู่ระบบอีกครั้งเพื่อเข้าถึงคอร์ส เครื่องมือ และข้อมูลบัญชี</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button ref={cancelLogoutButtonRef} type="button" disabled={isLoggingOut} onClick={() => setShowLogoutConfirm(false)} className="min-h-12 rounded-xl border border-[#ddd2c7] bg-white px-4 text-sm font-bold text-[#4f4741] transition hover:bg-[#f7f2ed] disabled:cursor-not-allowed disabled:opacity-50">ยกเลิก</button>
              <button type="button" disabled={isLoggingOut} onClick={handleLogout} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-rose-700 px-4 text-sm font-bold text-white transition hover:bg-rose-800 disabled:cursor-wait disabled:opacity-70">
                {isLoggingOut ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />กำลังออกจากระบบ</> : "ออกจากระบบ"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-10">
        <div className="mb-6 flex items-end justify-between gap-4 lg:mb-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c65018]">My BeyondLab</p>
              <h1 className="mt-1 text-2xl font-bold tracking-[-0.03em] sm:text-3xl">ศูนย์บัญชี</h1>
              <p className="mt-1 hidden text-sm text-[#7a7068] sm:block">จัดการคอร์ส รายการซื้อ และสิทธิ์สมาชิกของคุณ</p>
            </div>
          </div>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#292522] text-sm font-bold text-white lg:hidden">{initials}</span>
        </div>

        <nav aria-label="เมนูบัญชีบนมือถือ" role="tablist" className="mb-5 grid grid-cols-2 gap-2 rounded-2xl border border-[#e1d7cc] bg-white p-1.5 shadow-sm lg:hidden">
          {navItems.map((item) => (
            <button key={item.id} type="button" role="tab" aria-selected={activeTab === item.id} onClick={() => setActiveTab(item.id)} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold transition ${activeTab === item.id ? "bg-[#292522] text-white shadow-sm" : "text-[#665d56] hover:bg-[#f7f2ed] hover:text-[#292522]"}`}>
              <Icon name={item.icon} className="h-4 w-4" />{item.label}
            </button>
          ))}
        </nav>

        <div className="grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)] xl:gap-8">
          <aside className="hidden lg:block">
            <div className="overflow-hidden rounded-[26px] border border-[#dfd4c8] bg-white shadow-[0_18px_45px_rgba(70,52,38,.07)]">
              <div className="border-b border-[#eee5dc] p-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#292522] text-base font-bold text-white">{initials}</span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#292522]">{displayName}</p>
                    <p className="truncate text-xs text-[#857a72]">{displayEmail}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between rounded-xl bg-[#faf5ef] px-3 py-2.5">
                  <span className="text-xs font-semibold text-[#766b63]">แพ็กเกจปัจจุบัน</span>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${isPro ? "bg-emerald-100 text-emerald-800" : "bg-[#ffe7d6] text-[#a84313]"}`}>{isPro ? "PRO" : "FREE"}</span>
                </div>
              </div>

              <nav aria-label="เมนูบัญชี" role="tablist" className="space-y-1 p-3">
                {navItems.map((item) => (
                  <button key={item.id} type="button" role="tab" aria-selected={activeTab === item.id} onClick={() => setActiveTab(item.id)} className={`group relative flex min-h-12 w-full items-center gap-3 rounded-xl px-3.5 text-left text-sm font-semibold transition ${activeTab === item.id ? "bg-[#fff0e5] text-[#a84313]" : "text-[#5e554e] hover:bg-[#f8f4ef] hover:text-[#292522]"}`}>
                    <span className={`absolute inset-y-3 left-0 w-1 rounded-r-full transition ${activeTab === item.id ? "bg-[#ea721f]" : "bg-transparent"}`} />
                    <span className={`grid h-8 w-8 place-items-center rounded-lg transition ${activeTab === item.id ? "bg-white text-[#c65018] shadow-sm" : "bg-[#f5f0ea] text-[#786e66] group-hover:bg-white"}`}><Icon name={item.icon} className="h-[17px] w-[17px]" /></span>
                    <span>{item.label}</span>
                    {item.id === "courses" && courses.length > 0 ? <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[10px] font-bold tabular-nums">{courses.length}</span> : null}
                  </button>
                ))}
              </nav>

              <div className="border-t border-[#eee5dc] p-3">
                <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9a8f86]">เครื่องมือ</p>
                <Link href="/grader" className="flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-semibold text-[#5e554e] transition hover:bg-[#f8f4ef] hover:text-[#292522]"><Icon name="code" className="h-[17px] w-[17px]" />Grader<Icon name="arrow" className="ml-auto h-4 w-4 text-[#a99e96]" /></Link>
                <Link href="/ide" className="flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-semibold text-[#5e554e] transition hover:bg-[#f8f4ef] hover:text-[#292522]"><Icon name="monitor" className="h-[17px] w-[17px]" />IDE Playground<Icon name="arrow" className="ml-auto h-4 w-4 text-[#a99e96]" /></Link>
                <button type="button" onClick={() => setShowLogoutConfirm(true)} className="mt-1 flex min-h-11 w-full items-center gap-3 rounded-xl px-3.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"><Icon name="logout" className="h-[17px] w-[17px]" />ออกจากระบบ</button>
              </div>
            </div>
          </aside>

          <div role="tabpanel" className="min-w-0">
            {activeTab === "overview" ? <div className="space-y-6">
            <section className="overflow-hidden rounded-[28px] bg-[#292522] text-white shadow-[0_24px_60px_rgba(47,37,30,.13)]">
              <div className="relative grid gap-8 p-6 sm:p-8 xl:grid-cols-[1fr_310px] xl:p-10">
                <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border-[48px] border-[#ea721f]/15" />
                <div className="relative">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-xs font-semibold text-white/75"><span className={`h-2 w-2 rounded-full ${isPro ? "bg-emerald-400" : "bg-[#f2a36d]"}`} />{isPro ? "สมาชิก PRO" : "สมาชิก FREE"}</span>
                  <h2 className="mt-6 max-w-xl text-3xl font-bold leading-tight tracking-[-0.035em] sm:text-4xl">ยินดีต้อนรับกลับมา<br /><span className="text-[#f2a36d]">{displayName}</span></h2>
                  <p className="mt-4 max-w-lg text-sm leading-6 text-white/60">ทุกคอร์ส เครื่องมือ และรายการสั่งซื้อของคุณจะถูกรวมไว้ที่นี่ในที่เดียว</p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link href="/grader" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#ea721f] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#f1853c]">ฝึกเขียนโค้ด<Icon name="arrow" className="h-4 w-4" /></Link>
                    <Link href="/#courses" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/10">ดูคอร์สทั้งหมด</Link>
                  </div>
                </div>
                <div className="relative grid grid-cols-2 gap-3 self-end">
                  <button type="button" onClick={() => setActiveTab("courses")} className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 text-left transition hover:bg-white/[0.12]"><Icon name="book" className="h-5 w-5 text-[#f2a36d]" /><p className="mt-6 text-2xl font-bold tabular-nums">{courses.length}</p><p className="mt-1 text-xs text-white/55">คอร์สของฉัน</p></button>
                  <button type="button" onClick={() => setActiveTab("orders")} className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 text-left transition hover:bg-white/[0.12]"><Icon name="receipt" className="h-5 w-5 text-[#f2a36d]" /><p className="mt-6 text-2xl font-bold tabular-nums">{orders.length}</p><p className="mt-1 text-xs text-white/55">รายการสั่งซื้อ</p></button>
                  <button type="button" onClick={() => setActiveTab("profile")} className="col-span-2 flex min-h-16 items-center justify-between rounded-2xl bg-white p-4 text-left text-[#292522] transition hover:bg-[#fff7f0]"><div><p className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#8a7d74]">สถานะแพ็กเกจ</p><p className="mt-1 text-sm font-bold">{isPro ? `ใช้ได้ถึง ${formatThaiDate(user?.planExpiresAt)}` : "จัดการหรืออัปเกรดแพ็กเกจ"}</p></div><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff0e5] text-[#c65018]"><Icon name="arrow" /></span></button>
                </div>
              </div>
            </section>

            <section className="grid gap-3 sm:grid-cols-2 lg:hidden">
              <Link href="/grader" className="flex min-h-20 items-center gap-4 rounded-2xl border border-[#ded2c6] bg-white px-5 font-bold transition hover:border-[#c65018]"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#fff0e5] text-[#c65018]"><Icon name="code" /></span><span>BeyondLab Grader<span className="mt-1 block text-xs font-normal text-[#776d65]">ฝึกทำโจทย์เขียนโค้ด</span></span><Icon name="arrow" className="ml-auto h-4 w-4" /></Link>
              <Link href="/ide" className="flex min-h-20 items-center gap-4 rounded-2xl border border-[#ded2c6] bg-white px-5 font-bold transition hover:border-[#c65018]"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#fff0e5] text-[#c65018]"><Icon name="monitor" /></span><span>IDE Playground<span className="mt-1 block text-xs font-normal text-[#776d65]">ทดลองเขียนโค้ดทันที</span></span><Icon name="arrow" className="ml-auto h-4 w-4" /></Link>
            </section>
            </div> : null}

            {activeTab === "courses" ? <section className="rounded-[28px] border border-[#e2d7cb] bg-white p-5 shadow-[0_14px_40px_rgba(70,52,38,.06)] sm:p-8">
              <SectionHeading eyebrow="Learning" title="คอร์สของฉัน" description="กลับมาเรียนต่อและติดตามความคืบหน้าของทุกคอร์สได้จากที่นี่" action={<Link href="/#courses" className="inline-flex min-h-11 items-center gap-2 self-start rounded-xl border border-[#ded2c6] px-4 py-2.5 text-sm font-bold text-[#504841] transition hover:border-[#c65018] hover:text-[#c65018]">สำรวจคอร์ส<Icon name="arrow" className="h-4 w-4" /></Link>} />
              {courses.length === 0 ? <EmptyState icon="book" title="ยังไม่มีคอร์สในบัญชีนี้" description="เมื่อคุณลงทะเบียนคอร์ส คอร์สและความคืบหน้าจะปรากฏตรงนี้โดยอัตโนมัติ" href="/#courses" action="เลือกดูคอร์ส" /> : (
                <div className="mt-6 grid gap-4 xl:grid-cols-2">{courses.map((course) => <article key={course.id} className="overflow-hidden rounded-2xl border border-[#e5dbd0] bg-[#fbf8f4]"><div className="flex gap-4 p-4">{course.image ? <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#eee5dc]"><Image src={course.image} alt="" fill sizes="96px" className="object-cover" /></div> : null}<div className="min-w-0 flex-1"><h3 className="font-bold text-[#292522]">{course.title}</h3><p className="mt-1 line-clamp-2 text-xs leading-5 text-[#776d65]">{course.description}</p><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#e5d9cd]"><div className="h-full rounded-full bg-[#ea721f]" style={{ width: `${Math.min(100, Math.max(0, course.progress ?? 0))}%` }} /></div><div className="mt-2 flex items-center justify-between text-xs"><span className="text-[#776d65]">เรียนแล้ว {course.completedLessons ?? 0}/{course.totalLessons ?? 0} บท</span><Link href={course.href} className="font-bold text-[#c65018]">เรียนต่อ</Link></div></div></div></article>)}</div>
              )}
            </section> : null}

            {activeTab === "orders" ? <section className="rounded-[28px] border border-[#e2d7cb] bg-white p-5 shadow-[0_14px_40px_rgba(70,52,38,.06)] sm:p-8">
              <SectionHeading eyebrow="Billing" title="ประวัติการซื้อ" description="ตรวจสอบรายการชำระเงิน สถานะคำสั่งซื้อ และใบเสร็จของคุณ" />
              {orders.length === 0 ? <EmptyState icon="receipt" title="ยังไม่มีประวัติการซื้อ" description="รายการซื้อคอร์สหรือบริการของ BeyondLab จะถูกเก็บไว้ตรงนี้เพื่อให้ตรวจสอบย้อนหลังได้ง่าย" href="/#courses" action="ดูสินค้าและคอร์ส" /> : (
                <div className="mt-6 overflow-hidden rounded-2xl border border-[#e5dbd0]">{orders.map((order) => <div key={order.id} className="grid gap-3 border-b border-[#eee5dc] p-4 last:border-0 sm:grid-cols-[1fr_auto_auto] sm:items-center"><div><p className="font-bold">{order.title}</p><p className="mt-1 text-xs text-[#776d65]">#{order.id} · {formatThaiDate(order.purchasedAt)}</p></div><span className="text-sm font-bold tabular-nums">{formatCurrency(order.amount)}</span><span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{order.status === "paid" ? "ชำระแล้ว" : order.status === "pending" ? "รอตรวจสอบ" : "คืนเงินแล้ว"}</span></div>)}</div>
              )}
            </section> : null}

            {activeTab === "profile" ? <div className="space-y-6"><section className="rounded-[28px] border border-[#e2d7cb] bg-white p-5 shadow-[0_14px_40px_rgba(70,52,38,.06)] sm:p-8">
              <SectionHeading eyebrow="Account" title="ข้อมูลบัญชี" description="ข้อมูลสำหรับการเข้าสู่ระบบและสถานะสมาชิก BeyondLab" />
              <form onSubmit={handleSaveProfile} className="mt-6 w-full">
                <div className="space-y-5">
                  <label className="block text-sm font-bold text-[#514840]">
                    Username
                    <input type="text" autoComplete="username" required minLength={3} maxLength={32} pattern="[a-zA-Z0-9._-]+" value={profileUsername} onChange={(event) => setProfileUsername(event.target.value)} aria-describedby="profile-username-help" className="mt-2 min-h-12 w-full rounded-xl border border-[#ddcfc2] bg-white px-4 font-normal outline-none transition focus:border-[#ea721f] focus:ring-2 focus:ring-[#ea721f]/15" />
                    <span id="profile-username-help" className="mt-2 block text-xs font-normal leading-5 text-[#80756c]">3–32 ตัว: a-z, 0-9, จุด, - หรือ _</span>
                  </label>
                  <label className="block text-sm font-bold text-[#514840]">
                    อีเมล
                    <input type="email" value={displayEmail} readOnly aria-readonly="true" className="mt-2 min-h-12 w-full cursor-not-allowed rounded-xl border border-[#e3d9cf] bg-[#f1ece6] px-4 font-normal text-[#766c64] outline-none" />
                    <span className="mt-2 block text-xs font-normal leading-5 text-[#80756c]">ใช้อีเมลเดิมสำหรับเข้าสู่ระบบ</span>
                  </label>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block text-sm font-bold text-[#514840]">
                      ชื่อ
                      <input type="text" autoComplete="given-name" maxLength={80} value={firstName} onChange={(event) => setFirstName(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-[#ddcfc2] bg-white px-4 font-normal outline-none transition focus:border-[#ea721f] focus:ring-2 focus:ring-[#ea721f]/15" />
                    </label>
                    <label className="block text-sm font-bold text-[#514840]">
                      นามสกุล
                      <input type="text" autoComplete="family-name" maxLength={80} value={lastName} onChange={(event) => setLastName(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-[#ddcfc2] bg-white px-4 font-normal outline-none transition focus:border-[#ea721f] focus:ring-2 focus:ring-[#ea721f]/15" />
                    </label>
                  </div>
                </div>
                <div className="mt-6 flex flex-col gap-4 border-t border-[#e4d9ce] pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    <span className="flex items-center gap-2 font-semibold text-[#514840]"><span className={`h-2 w-2 rounded-full ${isPro ? "bg-emerald-500" : "bg-[#ea721f]"}`} />แพ็กเกจ {isPro ? "PRO" : "FREE"}</span>
                    <span className="text-[#766c64]">หมดอายุ: <strong className="text-[#514840]">{isPro ? formatThaiDate(user?.planExpiresAt) : "—"}</strong></span>
                  </div>
                  <button type="submit" disabled={savingProfile} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#ea721f] px-5 text-sm font-bold text-white transition hover:bg-[#d96217] disabled:cursor-wait disabled:opacity-60">{savingProfile ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />กำลังบันทึก</> : "บันทึกข้อมูล"}</button>
                </div>
              </form>
            </section>

            <section className="overflow-hidden rounded-[28px] border border-[#efc7a9] bg-[#fff7f0]">
              <div className="p-5 sm:p-8"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c65018]">BeyondLab Pro</p><h2 className="mt-2 text-2xl font-bold">{isPro ? "จัดการสิทธิ์ PRO" : "ปลดล็อกโจทย์ทั้งหมด"}</h2><p className="mt-1 text-sm leading-6 text-[#6e645d]">PRO ราคา 99 บาท / 30 วัน หรือรับสิทธิ์ 6 เดือนสำหรับนักเรียน ZERO TO CODE</p></div><span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#ea721f] text-white shadow-[0_10px_24px_rgba(234,114,31,.25)]"><Icon name="spark" className="h-6 w-6" /></span></div>
                <div className="mt-6 grid gap-3">
                  <div className="overflow-hidden rounded-2xl border border-[#ebd3bf] bg-white">
                    <button type="button" aria-expanded={expandedSection === "payment"} onClick={() => setExpandedSection((value) => value === "payment" ? null : "payment")} className="flex min-h-16 w-full items-center justify-between gap-4 px-4 text-left transition hover:bg-[#fffbf8]"><span className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff0e5] text-[#c65018]"><Icon name="upload" /></span><span><span className="block text-sm font-bold">อัปโหลดสลิปชำระเงิน</span><span className="block text-xs text-[#766c64]">ต่ออายุ PRO เพิ่ม 30 วัน</span></span></span><Icon name="chevron" className={`h-5 w-5 transition-transform ${expandedSection === "payment" ? "rotate-180" : ""}`} /></button>
                    {expandedSection === "payment" ? <div className="border-t border-[#eee2d7] p-4 sm:p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-start"><div className="flex-1"><p className="text-sm leading-6 text-[#6e645d]">ชำระ 99 บาทด้วย QR PromptPay จากนั้นแนบสลิปเพื่อให้ระบบตรวจสอบอัตโนมัติ</p><div className="mt-4 flex flex-wrap gap-3"><label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-[#ddcfc2] bg-white px-4 py-2.5 text-sm font-bold transition hover:border-[#c65018]"><Icon name="upload" className="h-4 w-4" />เลือกรูปสลิป<input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleSlipFileChange} className="sr-only" /></label>{slipImage ? <button type="button" onClick={handleUploadSlip} disabled={uploading} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#ea721f] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#d96217] disabled:cursor-not-allowed disabled:opacity-50">{uploading ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />กำลังตรวจสอบ</> : "ยืนยันการชำระเงิน"}</button> : null}</div></div>{slipImage ? <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-xl border border-[#e4d8cc] bg-[#f7f2ed]"><Image src={slipImage} alt="ตัวอย่างสลิปที่เลือก" fill sizes="128px" className="object-contain" /></div> : null}</div></div> : null}
                  </div>
                  <div className="overflow-hidden rounded-2xl border border-[#ebd3bf] bg-white">
                    <button type="button" aria-expanded={expandedSection === "student"} onClick={() => setExpandedSection((value) => value === "student" ? null : "student")} className="flex min-h-16 w-full items-center justify-between gap-4 px-4 text-left transition hover:bg-[#fffbf8]"><span className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><Icon name="student" /></span><span><span className="block text-sm font-bold">สิทธิ์นักเรียน ZERO TO CODE</span><span className="block text-xs text-[#766c64]">รับ PRO ฟรี 6 เดือน</span></span></span><Icon name="chevron" className={`h-5 w-5 transition-transform ${expandedSection === "student" ? "rotate-180" : ""}`} /></button>
                    {expandedSection === "student" ? <form onSubmit={handleRequestStudentCode} className="border-t border-[#eee2d7] p-4 sm:p-5"><p className="mb-4 text-sm leading-6 text-[#6e645d]">กรอกข้อมูลเดียวกับที่ใช้ลงทะเบียนคอร์ส ระบบจะตรวจสอบสิทธิ์ให้อัตโนมัติ</p><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold">อีเมลที่ลงทะเบียน<input type="email" autoComplete="email" required value={studentEmail} onChange={(event) => setStudentEmail(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-[#ddcfc2] bg-white px-4 font-normal outline-none transition focus:border-[#ea721f] focus:ring-2 focus:ring-[#ea721f]/15" placeholder="name@example.com" /></label><label className="text-sm font-bold">ชื่อ–นามสกุลจริง<input type="text" autoComplete="name" required value={studentName} onChange={(event) => setStudentName(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-[#ddcfc2] bg-white px-4 font-normal outline-none transition focus:border-[#ea721f] focus:ring-2 focus:ring-[#ea721f]/15" placeholder="ไม่ต้องใส่คำนำหน้า" /></label></div><button type="submit" disabled={requestingCode} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50">{requestingCode ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />กำลังตรวจสอบ</> : "ยืนยันสิทธิ์นักเรียน"}</button></form> : null}
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-3 sm:grid-cols-2 lg:hidden">
              <Link href="/ide" className="flex min-h-16 items-center gap-3 rounded-2xl border border-[#ded2c6] bg-white px-4 font-bold transition hover:border-[#c65018]"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff0e5] text-[#c65018]"><Icon name="monitor" /></span>IDE Playground</Link>
              <button type="button" onClick={() => setShowLogoutConfirm(true)} className="flex min-h-16 w-full items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 font-bold text-rose-700 transition hover:bg-rose-100"><span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-100"><Icon name="logout" /></span>ออกจากระบบ</button>
            </section>
            </div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
