"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type SessionData = {
  authenticated: boolean;
  user?: {
    username: string;
    email: string;
    plan: string;
    role: string;
    planExpiresAt?: string | null;
  };
};

type AccountPageClientProps = {
  username: string;
  email: string;
  backendUrl: string;
};

function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-5 right-5 z-[100] animate-slide-in">
      <div
        className={`flex items-center gap-3 rounded-2xl border px-5 py-3.5 text-sm font-semibold shadow-2xl backdrop-blur-xl ${
          type === "success"
            ? "border-emerald-300/60 bg-emerald-50/95 text-emerald-800"
            : "border-rose-300/60 bg-rose-50/95 text-rose-800"
        }`}
      >
        <span
          className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${
            type === "success" ? "bg-emerald-200" : "bg-rose-200"
          }`}
        >
          {type === "success" ? (
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </span>
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 opacity-40 hover:opacity-100 transition-opacity">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-xl bg-[#e8ddd0] ${className ?? ""}`} />
  );
}

export function AccountPageClient({
  username,
  email,
  backendUrl,
}: AccountPageClientProps) {
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    id: number;
  } | null>(null);

  // Slip upload state
  const [slipImage, setSlipImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Student code state
  const [studentEmail, setStudentEmail] = useState("");
  const [studentName, setStudentName] = useState("");
  const [requestingCode, setRequestingCode] = useState(false);

  // Accordion state for FREE plan sections
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  let toastId = 0;
  const showToast = useCallback(
    (message: string, type: "success" | "error" = "success") => {
      toastId += 1;
      setToast({ message, type, id: toastId });
    },
    [toastId]
  );

  // Fetch session
  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch(`${backendUrl}/auth/session`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setSession(data);
        } else {
          setSession({ authenticated: false });
        }
      } catch {
        setSession({ authenticated: false });
      } finally {
        setLoading(false);
      }
    }
    fetchSession();
  }, [backendUrl]);

  // Handle slip file selection
  const handleSlipFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setSlipImage(result);
    };
    reader.readAsDataURL(file);
  };

  // Upload slip
  const handleUploadSlip = async () => {
    if (!slipImage) {
      showToast("กรุณาเลือกรูปสลิปชำระเงิน", "error");
      return;
    }

    setUploading(true);
    try {
      const res = await fetch(`${backendUrl}/api/user/upload-slip`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ slipImage }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || "อัปเกรดเป็น PRO สำเร็จ! 🎉");
        setSlipImage(null);
        setExpandedSection(null);
        const sessionRes = await fetch(`${backendUrl}/auth/session`, {
          credentials: "include",
        });
        if (sessionRes.ok) {
          setSession(await sessionRes.json());
        }
      } else {
        showToast(data.error || "ไม่สามารถอัปโหลดสลิปได้", "error");
      }
    } catch {
      showToast("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์", "error");
    } finally {
      setUploading(false);
    }
  };

  // Request student code
  const handleRequestStudentCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentEmail.trim() || !studentName.trim()) {
      showToast("กรุณากรอกอีเมลและชื่อ-นามสกุลให้ครบถ้วน", "error");
      return;
    }

    setRequestingCode(true);
    try {
      const res = await fetch(`${backendUrl}/api/user/request-student-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: studentEmail.trim(),
          fullName: studentName.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || "ยืนยันสิทธิ์นักเรียนสำเร็จ! 🎉");
        setStudentEmail("");
        setStudentName("");
        setExpandedSection(null);
        const sessionRes = await fetch(`${backendUrl}/auth/session`, {
          credentials: "include",
        });
        if (sessionRes.ok) {
          setSession(await sessionRes.json());
        }
      } else {
        showToast(data.error || "ไม่สามารถขอรับสิทธิ์ได้", "error");
      }
    } catch {
      showToast("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์", "error");
    } finally {
      setRequestingCode(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f3ed]">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 pt-24 sm:pt-28">
          <div className="space-y-8">
            <div className="rounded-3xl border border-[#eadfce] bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-xl" />
                <Skeleton className="h-7 w-40" />
              </div>
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div><Skeleton className="h-4 w-20 mb-2" /><Skeleton className="h-6 w-36" /></div>
                <div><Skeleton className="h-4 w-16 mb-2" /><Skeleton className="h-6 w-52" /></div>
                <div><Skeleton className="h-4 w-14 mb-2" /><Skeleton className="h-6 w-24" /></div>
              </div>
            </div>
            <Skeleton className="h-64 rounded-3xl" />
            <Skeleton className="h-40 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  const user = session?.user;
  const isPro = user?.plan === "pro";

  return (
    <div className="min-h-screen bg-[#f7f3ed] text-[#292725]">
      {/* Toast */}
      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Page Header */}
      <div className="border-b border-[#eadfce] bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex items-center justify-between py-4 sm:py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff1e6] text-base font-bold text-[#d55d11]">
                {username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#292725]">บัญชีของฉัน</h1>
                <p className="text-xs text-[#857a71]">{user?.email || email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/grader"
                className="rounded-xl border border-[#eadfce] bg-white px-3.5 py-2 text-xs font-bold text-[#5c5148] transition hover:bg-[#f7f3ed] hover:border-[#ea721f]"
              >
                ไป Grader
              </Link>
              <Link
                href="/"
                className="rounded-xl bg-[#ea721f] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#d85f13]"
              >
                หน้าหลัก
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="space-y-6">
          {/* Section 1: Profile Info */}
          <section className="rounded-3xl border border-[#eadfce] bg-white shadow-sm transition-shadow hover:shadow-md">
            <div className="p-6 sm:p-8">
              <h2 className="text-base font-bold text-[#292725] flex items-center gap-2.5">
                <svg className="h-5 w-5 text-[#ea721f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                ข้อมูลส่วนตัว
              </h2>
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="rounded-xl bg-[#faf6f0] px-4 py-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#857a71]">Username</p>
                  <p className="mt-1 text-sm font-semibold text-[#292725]">{user?.username || username}</p>
                </div>
                <div className="rounded-xl bg-[#faf6f0] px-4 py-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#857a71]">อีเมล</p>
                  <p className="mt-1 text-sm font-semibold text-[#292725]">{user?.email || email}</p>
                </div>
                <div className="rounded-xl bg-[#faf6f0] px-4 py-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#857a71]">สถานะ</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        isPro
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${isPro ? "bg-amber-500" : "bg-blue-500"}`} />
                      {isPro ? "PRO" : "FREE"}
                    </span>
                    {user?.role === "admin" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
                {user?.role === "admin" && (
                  <div className="rounded-xl bg-[#faf6f0] px-4 py-3.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#857a71]">จัดการระบบ</p>
                    <Link
                      href="/admin"
                      className="mt-1.5 inline-flex items-center gap-1.5 rounded-lg border border-purple-300 bg-purple-50 px-3 py-1.5 text-[11px] font-bold text-purple-700 transition hover:bg-purple-100"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Admin Portal
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Section 2: Plan & Subscription */}
          <section className="rounded-3xl border border-[#eadfce] bg-white shadow-sm transition-shadow hover:shadow-md overflow-hidden">
            <div className="p-6 sm:p-8">
              <h2 className="text-base font-bold text-[#292725] flex items-center gap-2.5">
                <svg className="h-5 w-5 text-[#ea721f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                แผนการใช้งาน
              </h2>

              {isPro ? (
                <div className="mt-5 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-50/30 border border-amber-200 p-6">
                  <div className="flex items-center gap-4">
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-amber-100 text-amber-600">
                      <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-lg font-bold text-amber-800">สมาชิก PRO</p>
                      <p className="text-sm text-amber-600">คุณกำลังใช้งานสิทธิพิเศษทั้งหมดของ Pro อยู่</p>
                    </div>
                  </div>
                  {user?.planExpiresAt && (
                    <div className="mt-4 rounded-xl bg-white/70 border border-amber-100 px-4 py-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-amber-500">วันหมดอายุ</p>
                      <p className="mt-0.5 text-sm font-bold text-amber-800">
                        {new Date(user.planExpiresAt).toLocaleDateString("th-TH", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                        <span className="ml-2 text-[11px] font-semibold text-amber-500">
                          (เหลือ {Math.max(0, Math.ceil((new Date(user.planExpiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} วัน)
                        </span>
                      </p>
                    </div>
                  )}
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white/70 border border-amber-100 px-4 py-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-amber-500">โจทย์ทั้งหมด</p>
                      <p className="mt-0.5 text-sm font-bold text-amber-800">ปลดล็อกแล้ว</p>
                    </div>
                    <div className="rounded-xl bg-white/70 border border-amber-100 px-4 py-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-amber-500">ฟีเจอร์</p>
                      <p className="mt-0.5 text-sm font-bold text-amber-800">เต็มรูปแบบ</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {/* Current plan card */}
                  <div className="rounded-2xl border border-[#eadfce] bg-[#faf6f0] p-5">
                    <div className="flex items-center gap-3">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-100 text-blue-600">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </span>
                      <div>
                        <p className="text-base font-bold text-[#292725]">สมาชิก FREE</p>
                        <p className="text-xs text-[#71675f]">อัปเกรดเป็น Pro เพื่อปลดล็อกโจทย์และฟีเจอร์พิเศษ</p>
                      </div>
                    </div>
                  </div>

                  {/* Upgrade via Slip - Accordion */}
                  <div className="rounded-2xl border border-[#eadfce] overflow-hidden transition-all">
                    <button
                      onClick={() => toggleSection("upgrade")}
                      className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-[#faf6f0]"
                    >
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-600">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        </span>
                        <div>
                          <p className="text-sm font-bold text-[#292725]">อัปเกรดเป็น PRO</p>
                          <p className="text-xs text-[#71675f]">99 บาท / 30 วัน</p>
                        </div>
                      </div>
                      <svg
                        className={`h-5 w-5 text-[#857a71] transition-transform duration-300 ${
                          expandedSection === "upgrade" ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        expandedSection === "upgrade" ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="border-t border-[#eadfce] px-5 py-5 space-y-5">
                        {/* PromptPay QR */}
                        <div className="flex flex-col sm:flex-row items-start gap-5">
                          <div className="w-40 h-40 relative rounded-2xl border border-[#eadfce] overflow-hidden bg-white shrink-0 mx-auto sm:mx-0">
                            <Image
                              src="/promptpay-qr.png"
                              alt="PromptPay QR Code"
                              fill
                              sizes="160px"
                              className="object-contain p-2"
                            />
                          </div>
                          <div className="space-y-3 flex-1 w-full">
                            <div className="rounded-xl border border-[#eadfce] bg-[#faf6f0] px-4 py-3">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-[#857a71]">จำนวนเงิน</p>
                              <p className="text-xl font-bold text-[#292725]">
                                99 <span className="text-sm font-semibold text-[#71675f]">บาท</span>
                              </p>
                            </div>
                            <div className="rounded-xl border border-[#eadfce] bg-[#faf6f0] px-4 py-3">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-[#857a71]">พร้อมเพย์</p>
                              <p className="text-base font-bold text-[#292725]">098-782-4363</p>
                            </div>
                          </div>
                        </div>

                        {/* Slip Upload */}
                        <div className="space-y-3">
                          <p className="text-xs font-bold text-[#5c5148] uppercase tracking-wider">แนบสลิปชำระเงิน</p>
                          <div className="flex flex-col sm:flex-row items-start gap-3">
                            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#eadfce] bg-white px-4 py-2.5 text-sm font-semibold text-[#5c5148] transition hover:bg-[#f7f3ed] hover:border-[#ea721f]">
                              <svg className="h-5 w-5 text-[#ea721f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              เลือกรูปสลิป
                              <input type="file" accept="image/*" onChange={handleSlipFileChange} className="hidden" />
                            </label>
                            {slipImage && (
                              <button
                                onClick={handleUploadSlip}
                                disabled={uploading}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#ea721f] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#d85f13] disabled:opacity-50"
                              >
                                {uploading ? (
                                  <>
                                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    กำลังตรวจสอบ...
                                  </>
                                ) : "ยืนยันอัปเกรด"}
                              </button>
                            )}
                          </div>
                          {slipImage && (
                            <div className="relative w-40 h-40 rounded-2xl border border-[#eadfce] overflow-hidden bg-white">
                              <Image src={slipImage} alt="Slip preview" fill sizes="160px" className="object-contain" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Student Code - Accordion */}
                  <div className="rounded-2xl border border-[#eadfce] overflow-hidden transition-all">
                    <button
                      onClick={() => toggleSection("student")}
                      className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-[#faf6f0]"
                    >
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-600">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                          </svg>
                        </span>
                        <div>
                          <p className="text-sm font-bold text-[#292725]">นักเรียน ZERO TO CODE?</p>
                          <p className="text-xs text-[#71675f]">รับสิทธิ์ PRO ฟรี 6 เดือน</p>
                        </div>
                      </div>
                      <svg
                        className={`h-5 w-5 text-[#857a71] transition-transform duration-300 ${
                          expandedSection === "student" ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        expandedSection === "student" ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="border-t border-[#eadfce] px-5 py-5">
                        <p className="text-xs text-[#71675f] mb-4">
                          นักเรียนคอร์ส ZERO TO CODE สามารถรับสิทธิ์ PRO ฟรี 6 เดือน โดยกรอกอีเมลและชื่อ-นามสกุลที่ใช้ลงทะเบียนคอร์ส
                        </p>
                        <form onSubmit={handleRequestStudentCode} className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold uppercase text-[#5c5148] mb-1">อีเมลที่ใช้ลงทะเบียน</label>
                              <input
                                type="email"
                                value={studentEmail}
                                onChange={(e) => setStudentEmail(e.target.value)}
                                placeholder="name@example.com"
                                required
                                className="w-full rounded-xl border border-[#eadfce] bg-white px-4 py-2.5 text-sm text-[#292725] placeholder-[#a3978c] focus:border-[#ea721f] focus:outline-none transition"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold uppercase text-[#5c5148] mb-1">ชื่อ-นามสกุลจริง</label>
                              <input
                                type="text"
                                value={studentName}
                                onChange={(e) => setStudentName(e.target.value)}
                                placeholder="ไม่ต้องใส่คำนำหน้า"
                                required
                                className="w-full rounded-xl border border-[#eadfce] bg-white px-4 py-2.5 text-sm text-[#292725] placeholder-[#a3978c] focus:border-[#ea721f] focus:outline-none transition"
                              />
                            </div>
                          </div>
                          <button
                            type="submit"
                            disabled={requestingCode}
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
                          >
                            {requestingCode ? (
                              <>
                                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                กำลังตรวจสอบ...
                              </>
                            ) : "ยืนยันสิทธิ์นักเรียน"}
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Section 3: Quick Links */}
          <section className="rounded-3xl border border-[#eadfce] bg-white shadow-sm transition-shadow hover:shadow-md">
            <div className="p-6 sm:p-8">
              <h2 className="text-base font-bold text-[#292725] flex items-center gap-2.5">
                <svg className="h-5 w-5 text-[#ea721f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                เมนูลัด
              </h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <Link
                  href="/grader"
                  className="flex items-center gap-3 rounded-xl border border-[#eadfce] bg-[#faf6f0] px-4 py-3.5 text-sm font-semibold text-[#292725] transition hover:bg-[#f7f3ed] hover:border-[#ea721f] hover:-translate-y-0.5"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#fff1e6] text-[#d55d11]">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </span>
                  ไปยัง Grader
                </Link>
                <Link
                  href="/ide"
                  className="flex items-center gap-3 rounded-xl border border-[#eadfce] bg-[#faf6f0] px-4 py-3.5 text-sm font-semibold text-[#292725] transition hover:bg-[#f7f3ed] hover:border-[#ea721f] hover:-translate-y-0.5"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#fff1e6] text-[#d55d11]">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  IDE Playground
                </Link>
                <form action={`/api/auth/logout?returnTo=${encodeURIComponent("/")}`} method="post" className="contents">
                  <button
                    type="submit"
                    className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 hover:-translate-y-0.5"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-rose-100 text-rose-500">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </span>
                    ออกจากระบบ
                  </button>
                </form>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}