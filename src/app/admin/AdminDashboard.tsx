"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type TestCase = {
  input: string;
  expected: string;
};

type Problem = {
  id: number;
  title: string;
  topic: string;
  difficulty: "ง่าย" | "ปานกลาง" | "ยาก";
  accessTier: "free" | "pro";
  points: number;
  description: string;
  inputDescription: string;
  outputDescription: string;
  sampleInput: string;
  sampleOutput: string;
  tests: TestCase[];
};

type UserItem = {
  username: string;
  email: string;
  role: "admin" | "user";
  plan: "free" | "pro";
  planExpiresAt: string | null;
  createdAt: string | null;
};

type SessionUser = {
  username: string;
  email: string;
  plan: string;
  role: string;
};

export function AdminDashboard({ backendUrl }: { backendUrl: string }) {
  const [session, setSession] = useState<{
    authenticated: boolean;
    user?: SessionUser;
  } | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  const [activeTab, setActiveTab] = useState<"problems" | "users">("problems");

  // Problem State
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loadingProblems, setLoadingProblems] = useState(false);
  const [searchProblemQuery, setSearchProblemQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");

  // Problem View Mode: "list" (table view) or "form" (in-page full section editor view)
  const [problemViewMode, setProblemViewMode] = useState<"list" | "form">("list");

  // Drag and Drop State
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);

  // User State
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchUserQuery, setSearchUserQuery] = useState("");
  const [roleUpdatingUser, setRoleUpdatingUser] = useState<string | null>(null);

  // Toast State
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Form & Delete State
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Plan Modal State
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [targetUserForPlan, setTargetUserForPlan] = useState<UserItem | null>(null);
  const [customDays, setCustomDays] = useState<number>(30);
  const [planMode, setPlanMode] = useState<"extend" | "set_from_now">("extend");

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [problemToDelete, setProblemToDelete] = useState<Problem | null>(null);

  // Problem Form State
  const [formId, setFormId] = useState<number | "">("");
  const [formTitle, setFormTitle] = useState("");
  const [formTopic, setFormTopic] = useState("");
  const [formDifficulty, setFormDifficulty] = useState<"ง่าย" | "ปานกลาง" | "ยาก">("ง่าย");
  const [formAccessTier, setFormAccessTier] = useState<"free" | "pro">("free");
  const [formPoints, setFormPoints] = useState<number>(100);
  const [formDescription, setFormDescription] = useState("");
  const [formInputDesc, setFormInputDesc] = useState("");
  const [formOutputDesc, setFormOutputDesc] = useState("");
  const [formSampleInput, setFormSampleInput] = useState("");
  const [formSampleOutput, setFormSampleOutput] = useState("");
  const [formTests, setFormTests] = useState<TestCase[]>([{ input: "", expected: "" }]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // Fetch Session
  useEffect(() => {
    async function checkAuth() {
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
      } catch (err) {
        console.error("Failed to check auth session:", err);
        setSession({ authenticated: false });
      } finally {
        setLoadingSession(false);
      }
    }
    checkAuth();
  }, [backendUrl]);

  // Fetch Problems
  const fetchProblems = async () => {
    setLoadingProblems(true);
    try {
      const res = await fetch(`${backendUrl}/api/admin/problems`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setProblems(data.problems || []);
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || "ไม่สามารถดึงข้อมูลโจทย์ได้", "error");
      }
    } catch {
      showToast("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์", "error");
    } finally {
      setLoadingProblems(false);
    }
  };

  // Fetch Users
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch(`${backendUrl}/api/admin/users`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || "ไม่สามารถดึงข้อมูลผู้ใช้ได้", "error");
      }
    } catch {
      showToast("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์", "error");
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (session?.authenticated && session.user?.role === "admin") {
      fetchProblems();
      fetchUsers();
    }
  }, [session, backendUrl]);

  // Handle Form Reset / Open In-Page Editor
  const openCreateModal = () => {
    const nextId = problems.length > 0 ? Math.max(...problems.map((p) => p.id)) + 1 : 1;
    setEditingProblem(null);
    setFormId(nextId);
    setFormTitle("");
    setFormTopic("ตัวแปร");
    setFormDifficulty("ง่าย");
    setFormAccessTier("free");
    setFormPoints(100);
    setFormDescription("");
    setFormInputDesc("");
    setFormOutputDesc("");
    setFormSampleInput("");
    setFormSampleOutput("");
    setFormTests([{ input: "", expected: "" }]);
    setProblemViewMode("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openEditModal = (problem: Problem) => {
    setEditingProblem(problem);
    setFormId(problem.id);
    setFormTitle(problem.title || "");
    setFormTopic(problem.topic || "");
    setFormDifficulty(problem.difficulty || "ง่าย");
    setFormAccessTier(problem.accessTier || "free");
    setFormPoints(problem.points || 100);
    setFormDescription(problem.description || "");
    setFormInputDesc(problem.inputDescription || "");
    setFormOutputDesc(problem.outputDescription || "");
    setFormSampleInput(problem.sampleInput || "");
    setFormSampleOutput(problem.sampleOutput || "");
    setFormTests(
      Array.isArray(problem.tests) && problem.tests.length > 0
        ? problem.tests.map((t) => ({ input: t.input ?? "", expected: t.expected ?? "" }))
        : [{ input: "", expected: "" }]
    );
    setProblemViewMode("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Test case handlers
  const handleAddTestCase = () => {
    setFormTests((prev) => [...prev, { input: "", expected: "" }]);
  };

  const handleRemoveTestCase = (index: number) => {
    setFormTests((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTestCaseChange = (
    index: number,
    field: "input" | "expected",
    value: string
  ) => {
    setFormTests((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Save Problem (Create or Update)
  const handleSaveProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showToast("กรุณากรอกชื่อโจทย์", "error");
      return;
    }

    setSubmitting(true);
    const isEdit = Boolean(editingProblem);
    const url = `${backendUrl}/api/admin/problems`;
    const method = isEdit ? "PUT" : "POST";

    const payload = {
      id: isEdit && editingProblem ? editingProblem.id : Number(formId),
      newId: Number(formId),
      title: formTitle.trim(),
      topic: formTopic.trim() || "ทั่วไป",
      difficulty: formDifficulty,
      accessTier: formAccessTier,
      points: Number(formPoints) || 100,
      description: formDescription,
      inputDescription: formInputDesc,
      outputDescription: formOutputDesc,
      sampleInput: formSampleInput,
      sampleOutput: formSampleOutput,
      tests: formTests.filter((t) => t.input.trim() || t.expected.trim()),
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        showToast(data.message || (isEdit ? "แก้ไขโจทย์สำเร็จ" : "เพิ่มโจทย์สำเร็จ"));
        setProblemViewMode("list");
        fetchProblems();
      } else {
        showToast(data.error || "ไม่สามารถบันทึกโจทย์ได้", "error");
      }
    } catch {
      showToast("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Confirm Delete Problem
  const handleDeleteProblem = async () => {
    if (!problemToDelete) return;
    setSubmitting(true);
    try {
      const res = await fetch(
        `${backendUrl}/api/admin/problems?id=${problemToDelete.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || `ลบโจทย์ #${problemToDelete.id} เรียบร้อยแล้ว`);
        setIsDeleteModalOpen(false);
        setProblemToDelete(null);
        fetchProblems();
      } else {
        showToast(data.error || "ไม่สามารถลบโจทย์ได้", "error");
      }
    } catch {
      showToast("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Change User Role
  const handleRoleChange = async (username: string, newRole: "admin" | "user") => {
    if (session?.user?.username?.toLowerCase() === username.toLowerCase() && newRole === "user") {
      showToast("ไม่สามารถลดสิทธิ์ Admin ของตนเองได้", "error");
      return;
    }
    setRoleUpdatingUser(username);
    try {
      const res = await fetch(`${backendUrl}/api/admin/users/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, role: newRole }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || `เปลี่ยนสิทธิ์เป็น ${newRole} สำเร็จ`);
        fetchUsers();
      } else {
        showToast(data.error || "ไม่สามารถเปลี่ยนสิทธิ์ได้", "error");
      }
    } catch {
      showToast("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์", "error");
    } finally {
      setRoleUpdatingUser(null);
    }
  };

  // Open Plan Adjustment Modal
  const openPlanModal = (usr: UserItem) => {
    setTargetUserForPlan(usr);
    setCustomDays(30);
    setPlanMode("extend");
    setIsPlanModalOpen(true);
  };

  // Save Custom Plan
  const handleSavePlan = async (newPlan: "pro" | "free") => {
    if (!targetUserForPlan) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${backendUrl}/api/admin/users/plan`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: targetUserForPlan.username,
          plan: newPlan,
          days: customDays,
          mode: planMode,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || `อัปเดต Plan สำเร็จ`);
        setIsPlanModalOpen(false);
        setTargetUserForPlan(null);
        fetchUsers();
      } else {
        showToast(data.error || "ไม่สามารถอัปเดต Plan ได้", "error");
      }
    } catch {
      showToast("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Save Reordered Problems to Backend
  const saveProblemsOrder = async (newOrderedProblems: Problem[]) => {
    setSavingOrder(true);
    try {
      const orderedIds = newOrderedProblems.map((p) => p.id);
      const res = await fetch(`${backendUrl}/api/admin/problems/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderedIds }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || "จัดเรียงลำดับโจทย์ใหม่เรียบร้อยแล้ว");
        fetchProblems();
      } else {
        showToast(data.error || "ไม่สามารถบันทึกลำดับได้", "error");
        fetchProblems();
      }
    } catch {
      showToast("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์", "error");
      fetchProblems();
    } finally {
      setSavingOrder(false);
    }
  };

  const handleDrop = (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    const reordered = [...problems];
    const [movedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, movedItem);
    setProblems(reordered);
    setDraggedIndex(null);
    setDragOverIndex(null);
    saveProblemsOrder(reordered);
  };

  // Filtered Problems (Sorted by ID ascending to match Grader sequence)
  const filteredProblems = useMemo(() => {
    return problems
      .filter((p) => {
        const matchesSearch =
          p.title.toLowerCase().includes(searchProblemQuery.toLowerCase()) ||
          p.topic.toLowerCase().includes(searchProblemQuery.toLowerCase()) ||
          String(p.id).includes(searchProblemQuery);
        const matchesDifficulty =
          difficultyFilter === "all" || p.difficulty === difficultyFilter;
        const matchesTier = tierFilter === "all" || p.accessTier === tierFilter;

        return matchesSearch && matchesDifficulty && matchesTier;
      })
      .sort((a, b) => a.id - b.id);
  }, [problems, searchProblemQuery, difficultyFilter, tierFilter]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.username.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchUserQuery.toLowerCase())
    );
  }, [users, searchUserQuery]);

  // User Stats
  const adminCount = useMemo(() => users.filter((u) => u.role === "admin").length, [users]);
  const proCount = useMemo(() => users.filter((u) => u.plan === "pro").length, [users]);

  // Loading Screen
  if (loadingSession) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f7f3ed] text-[#292725]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#ea721f] border-t-transparent"></div>
          <p className="text-sm font-semibold text-[#71675f]">กำลังโหลดระบบแอดมิน BeyondLab...</p>
        </div>
      </div>
    );
  }

  // Access Denied Screen
  if (!session?.authenticated || session.user?.role !== "admin") {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f7f3ed] p-5 text-[#292725]">
        <div className="w-full max-w-md rounded-3xl border border-[#eadfce] bg-white p-8 text-center shadow-[0_18px_50px_rgba(62,46,30,.10)]">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-rose-50 text-rose-500 border border-rose-200">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="mt-5 text-2xl font-bold text-[#292725]">Access Denied</h1>
          <p className="mt-2 text-sm leading-relaxed text-[#71675f]">
            {session?.authenticated
              ? `บัญชี "${session.user?.username}" ของคุณยังไม่มีสิทธิ์เป็น Admin ในระบบ`
              : "กรุณาเข้าสู่ระบบด้วยบัญชีแอดมินเพื่อเข้าใช้งานส่วนนี้"}
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/grader"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[#ea721f] font-bold text-white transition hover:bg-[#d85f13] shadow-md shadow-[#ea721f]/20"
            >
              ไปหน้า Grader
            </Link>
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[#eadfce] bg-white font-semibold text-[#5c5148] transition hover:bg-[#f7f3ed]"
            >
              กลับหน้าหลัก
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f3ed] text-[#292725]">
      {/* Toast Banner */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-[100] flex items-center gap-3 rounded-2xl border px-5 py-3.5 text-sm font-semibold shadow-2xl transition-all duration-300 ${
            toast.type === "success"
              ? "border-emerald-300 bg-emerald-50 text-emerald-800"
              : "border-rose-300 bg-rose-50 text-rose-800"
          }`}
        >
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Bar */}
      <header className="sticky top-0 z-40 border-b border-[#eadfce] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative h-8 w-8 flex-none overflow-hidden">
                <Image
                  src="/logo-v2.png"
                  alt="BeyondLab Logo"
                  fill
                  sizes="32px"
                  className="object-contain"
                />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-[#292725]">
                BeyondLab <span className="text-[#ea721f]">Admin</span>
              </span>
            </Link>
            <span className="hidden rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700 sm:inline-block">
              Portal Mode
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-xl border border-[#eadfce] bg-[#faf6f0] px-3 py-1.5 text-xs font-semibold sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[#303030]">{session.user?.username}</span>
              <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] uppercase font-bold text-purple-800 border border-purple-200">
                {session.user?.role}
              </span>
            </div>
            <Link
              href="/grader"
              className="rounded-xl border border-[#eadfce] bg-white px-3.5 py-2 text-xs font-bold text-[#5c5148] transition hover:bg-[#f7f3ed]"
            >
              หน้า Grader
            </Link>
            <Link
              href="/"
              className="rounded-xl bg-[#ea721f] px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-[#ea721f]/20 transition hover:bg-[#d85f13]"
            >
              หน้าหลัก
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Navigation Tabs (Only visible when not in problem form mode) */}
        {problemViewMode === "list" && (
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#eadfce] pb-4">
            <div className="flex gap-2 rounded-2xl border border-[#eadfce] bg-white p-1.5 shadow-sm">
              <button
                onClick={() => {
                  setActiveTab("problems");
                  setProblemViewMode("list");
                }}
                className={`flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
                  activeTab === "problems"
                    ? "bg-[#ea721f] text-white shadow-md shadow-[#ea721f]/20"
                    : "text-[#71675f] hover:text-[#292725] hover:bg-[#f7f3ed]"
                }`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                จัดการโจทย์ (Problem CRUD)
                <span className={`rounded-full px-2 py-0.5 text-xs ${activeTab === "problems" ? "bg-white/20 text-white" : "bg-[#f0dfc8] text-[#5c5148]"}`}>
                  {problems.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("users");
                  setProblemViewMode("list");
                }}
                className={`flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
                  activeTab === "users"
                    ? "bg-[#ea721f] text-white shadow-md shadow-[#ea721f]/20"
                    : "text-[#71675f] hover:text-[#292725] hover:bg-[#f7f3ed]"
                }`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                จัดการผู้ใช้ & สิทธิ์ (Users & Roles)
                <span className={`rounded-full px-2 py-0.5 text-xs ${activeTab === "users" ? "bg-white/20 text-white" : "bg-[#f0dfc8] text-[#5c5148]"}`}>
                  {users.length}
                </span>
              </button>
            </div>

            {activeTab === "problems" && (
              <button
                onClick={openCreateModal}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ea721f] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-[#ea721f]/20 transition hover:bg-[#d85f13] hover:-translate-y-0.5"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                สร้างโจทย์ใหม่
              </button>
            )}
          </div>
        )}

        {/* TAB 1: PROBLEMS CRUD */}
        {activeTab === "problems" && (
          <>
            {/* VIEW MODE 1: PROBLEMS LIST TABLE */}
            {problemViewMode === "list" && (
              <div className="space-y-6">
                {/* Search and Filters */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <input
                      type="text"
                      placeholder="ค้นหาโจทย์ตามชื่อ, หัวข้อ หรือ ID..."
                      value={searchProblemQuery}
                      onChange={(e) => setSearchProblemQuery(e.target.value)}
                      className="w-full rounded-xl border border-[#eadfce] bg-white px-4 py-2.5 text-sm text-[#292725] placeholder-[#a3978c] focus:border-[#ea721f] focus:outline-none shadow-sm"
                    />
                  </div>

                  <div>
                    <select
                      value={difficultyFilter}
                      onChange={(e) => setDifficultyFilter(e.target.value)}
                      className="w-full rounded-xl border border-[#eadfce] bg-white px-4 py-2.5 text-sm text-[#292725] focus:border-[#ea721f] focus:outline-none shadow-sm"
                    >
                      <option value="all">ระดับความยาก: ทั้งหมด</option>
                      <option value="ง่าย">ง่าย</option>
                      <option value="ปานกลาง">ปานกลาง</option>
                      <option value="ยาก">ยาก</option>
                    </select>
                  </div>

                  <div>
                    <select
                      value={tierFilter}
                      onChange={(e) => setTierFilter(e.target.value)}
                      className="w-full rounded-xl border border-[#eadfce] bg-white px-4 py-2.5 text-sm text-[#292725] focus:border-[#ea721f] focus:outline-none shadow-sm"
                    >
                      <option value="all">สิทธิ์การเข้าถึง: ทั้งหมด</option>
                      <option value="free">Free Tier</option>
                      <option value="pro">Pro Tier</option>
                    </select>
                  </div>
                </div>

                {savingOrder && (
                  <div className="flex items-center justify-end text-xs font-bold text-[#ea721f] bg-[#faf6f0] border border-[#eadfce] rounded-2xl px-4 py-2.5 shadow-sm animate-pulse">
                    กำลังบันทึกลำดับใหม่...
                  </div>
                )}

                {/* Problems Table */}
                <div className="overflow-hidden rounded-2xl border border-[#eadfce] bg-white shadow-xl">
                  {loadingProblems ? (
                    <div className="p-12 text-center text-[#71675f]">
                      กำลังโหลดข้อมูลโจทย์ทั้งหมด...
                    </div>
                  ) : filteredProblems.length === 0 ? (
                    <div className="p-12 text-center text-[#71675f]">
                      ไม่พบข้อมูลโจทย์ตรงตามเงื่อนไข
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-[#303030]">
                        <thead className="border-b border-[#eadfce] bg-[#faf6f0] text-xs uppercase font-bold text-[#5c5148]">
                          <tr>
                            <th className="w-10 px-3 py-3.5 text-center">ย้าย</th>
                            <th className="px-5 py-3.5">ID</th>
                            <th className="px-5 py-3.5">ชื่อโจทย์</th>
                            <th className="px-5 py-3.5">หมวดหมู่</th>
                            <th className="px-5 py-3.5">ระดับความยาก</th>
                            <th className="px-5 py-3.5">สิทธิ์</th>
                            <th className="px-5 py-3.5">Test Cases</th>
                            <th className="px-5 py-3.5">คะแนน</th>
                            <th className="px-5 py-3.5 text-right">การจัดการ</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f0dfc8]">
                          {filteredProblems.map((prob, index) => {
                            const isDraggable = !searchProblemQuery && difficultyFilter === "all" && tierFilter === "all";
                            return (
                              <tr
                                key={prob.id}
                                draggable={isDraggable}
                                onDragStart={(e) => {
                                  if (!isDraggable) return;
                                  setDraggedIndex(index);
                                  e.dataTransfer.effectAllowed = "move";
                                }}
                                onDragOver={(e) => {
                                  if (!isDraggable) return;
                                  e.preventDefault();
                                  if (dragOverIndex !== index) setDragOverIndex(index);
                                }}
                                onDragLeave={() => setDragOverIndex(null)}
                                onDrop={() => isDraggable && handleDrop(index)}
                                onDragEnd={() => {
                                  setDraggedIndex(null);
                                  setDragOverIndex(null);
                                }}
                                className={`transition ${
                                  isDraggable ? "cursor-grab active:cursor-grabbing" : ""
                                } ${
                                  draggedIndex === index
                                    ? "opacity-30 bg-[#fff0df]"
                                    : dragOverIndex === index
                                    ? "bg-[#fff0df] border-2 border-dashed border-[#ea721f]"
                                    : "hover:bg-[#fcfaf7]"
                                }`}
                              >
                                <td className="px-3 py-4 text-center text-[#a3978c] hover:text-[#ea721f]">
                                  <svg className="mx-auto h-5 w-5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                                  </svg>
                                </td>
                                <td className="px-5 py-4 font-mono font-bold text-[#ea721f]">
                                  #{prob.id}
                                </td>
                              <td className="px-5 py-4 font-bold text-[#292725]">
                                {prob.title}
                              </td>
                              <td className="px-5 py-4 text-[#71675f]">
                                {prob.topic}
                              </td>
                              <td className="px-5 py-4">
                                <span
                                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                    prob.difficulty === "ง่าย"
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                      : prob.difficulty === "ปานกลาง"
                                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                                      : "bg-rose-50 text-rose-700 border border-rose-200"
                                  }`}
                                >
                                  {prob.difficulty}
                                </span>
                              </td>
                              <td className="px-5 py-4">
                                <span
                                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${
                                    prob.accessTier === "pro"
                                      ? "bg-purple-50 text-purple-700 border border-purple-200"
                                      : "bg-blue-50 text-blue-700 border border-blue-200"
                                  }`}
                                >
                                  {prob.accessTier}
                                </span>
                              </td>
                              <td className="px-5 py-4 font-mono text-xs text-[#5c5148]">
                                {Array.isArray(prob.tests) ? prob.tests.length : 0} ชุด
                              </td>
                              <td className="px-5 py-4 font-bold text-[#ea721f]">
                                {prob.points} pt
                              </td>
                              <td className="px-5 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => openEditModal(prob)}
                                    className="rounded-lg border border-[#eadfce] bg-white px-3 py-1.5 text-xs font-bold text-[#5c5148] transition hover:bg-[#f7f3ed] hover:border-[#ea721f]"
                                  >
                                    แก้ไขโจทย์
                                  </button>
                                  <button
                                    onClick={() => {
                                      setProblemToDelete(prob);
                                      setIsDeleteModalOpen(true);
                                    }}
                                    className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 transition hover:bg-rose-100"
                                  >
                                    ลบ
                                  </button>
                                </div>
                               </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* VIEW MODE 2: IN-PAGE EXPANDED PROBLEM EDITOR FORM */}
            {problemViewMode === "form" && (
              <div className="space-y-6">
                {/* Top Action Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#eadfce] pb-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setProblemViewMode("list")}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#eadfce] bg-white px-3.5 py-2 text-xs font-bold text-[#5c5148] transition hover:bg-[#f7f3ed]"
                    >
                      ← ย้อนกลับรายการโจทย์
                    </button>
                    <h2 className="text-xl font-bold text-[#292725]">
                      {editingProblem ? `แก้ไขโจทย์ #${editingProblem.id}: ${editingProblem.title}` : "สร้างโจทย์ใหม่"}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setProblemViewMode("list")}
                      className="rounded-xl border border-[#eadfce] bg-white px-4 py-2.5 text-xs font-semibold text-[#5c5148] transition hover:bg-[#f7f3ed]"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveProblem}
                      disabled={submitting}
                      className="rounded-xl bg-[#ea721f] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#ea721f]/20 transition hover:bg-[#d85f13] disabled:opacity-50"
                    >
                      {submitting ? "กำลังบันทึก..." : editingProblem ? "บันทึกการแก้ไข" : "สร้างโจทย์"}
                    </button>
                  </div>
                </div>

                {/* Form Container */}
                <form onSubmit={handleSaveProblem} className="space-y-8">
                  {/* Section 1: Basic Info */}
                  <div className="rounded-3xl border border-[#eadfce] bg-white p-6 sm:p-8 shadow-sm space-y-6">
                    <h3 className="text-base font-bold text-[#292725] border-b border-[#eadfce] pb-3 flex items-center gap-2">
                      <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#fff0df] text-xs font-bold text-[#ea721f]">1</span>
                      ข้อมูลพื้นฐานของโจทย์ (Basic Configuration)
                    </h3>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                      <div>
                        <label className="block text-xs font-bold uppercase text-[#5c5148]">
                          ID โจทย์ (Problem ID)
                        </label>
                        <input
                          type="number"
                          value={formId}
                          onChange={(e) => setFormId(e.target.value ? Number(e.target.value) : "")}
                          className="mt-1.5 w-full rounded-xl border border-[#eadfce] bg-white px-4 py-2.5 text-sm font-mono font-bold text-[#ea721f] focus:border-[#ea721f] focus:outline-none"
                          placeholder="1, 2, 3..."
                          required
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold uppercase text-[#5c5148]">
                          ชื่อโจทย์ (Title)
                        </label>
                        <input
                          type="text"
                          value={formTitle}
                          onChange={(e) => setFormTitle(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-[#eadfce] bg-white px-4 py-2.5 text-sm font-bold text-[#292725] focus:border-[#ea721f] focus:outline-none"
                          placeholder="เช่น ผลบวกของสองจำนวน (Two Sum)"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-[#5c5148]">
                          หมวดหมู่ / หัวข้อ (Topic)
                        </label>
                        <input
                          type="text"
                          value={formTopic}
                          onChange={(e) => setFormTopic(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-[#eadfce] bg-white px-4 py-2.5 text-sm text-[#292725] focus:border-[#ea721f] focus:outline-none"
                          placeholder="เช่น ตัวแปร, เงื่อนไข, การวนซ้ำ, Array"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-[#5c5148]">
                          ระดับความยาก (Difficulty)
                        </label>
                        <select
                          value={formDifficulty}
                          onChange={(e) => setFormDifficulty(e.target.value as any)}
                          className="mt-1.5 w-full rounded-xl border border-[#eadfce] bg-white px-4 py-2.5 text-sm font-semibold text-[#292725] focus:border-[#ea721f] focus:outline-none"
                        >
                          <option value="ง่าย">ง่าย (Easy)</option>
                          <option value="ปานกลาง">ปานกลาง (Medium)</option>
                          <option value="ยาก">ยาก (Hard)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-[#5c5148]">
                          สิทธิ์การเข้าถึง (Access Tier)
                        </label>
                        <select
                          value={formAccessTier}
                          onChange={(e) => setFormAccessTier(e.target.value as any)}
                          className="mt-1.5 w-full rounded-xl border border-[#eadfce] bg-white px-4 py-2.5 text-sm font-semibold text-[#292725] focus:border-[#ea721f] focus:outline-none"
                        >
                          <option value="free">Free Tier (ทุกคนทำได้)</option>
                          <option value="pro">Pro Tier (เฉพาะสมาชิก Pro)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-[#5c5148]">
                          คะแนน (Points)
                        </label>
                        <input
                          type="number"
                          value={formPoints}
                          onChange={(e) => setFormPoints(Number(e.target.value))}
                          className="mt-1.5 w-full rounded-xl border border-[#eadfce] bg-white px-4 py-2.5 text-sm font-bold text-[#292725] focus:border-[#ea721f] focus:outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Problem Description & Format */}
                  <div className="rounded-3xl border border-[#eadfce] bg-white p-6 sm:p-8 shadow-sm space-y-6">
                    <h3 className="text-base font-bold text-[#292725] border-b border-[#eadfce] pb-3 flex items-center gap-2">
                      <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#fff0df] text-xs font-bold text-[#ea721f]">2</span>
                      คำอธิบายและรูปแบบข้อมูล (Problem Statement & Specification)
                    </h3>

                    <div>
                      <label className="block text-xs font-bold uppercase text-[#5c5148] mb-1">
                        คำอธิบายโจทย์ (Problem Description)
                      </label>
                      <textarea
                        rows={6}
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        className="w-full rounded-xl border border-[#eadfce] bg-white p-4 text-sm text-[#292725] leading-relaxed focus:border-[#ea721f] focus:outline-none"
                        placeholder="อธิบายรายละเอียดโจทย์ปัญหานี้อย่างชัดเจน..."
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-bold uppercase text-[#5c5148] mb-1">
                          รูปแบบข้อมูลเข้า (Input Specification)
                        </label>
                        <textarea
                          rows={4}
                          value={formInputDesc}
                          onChange={(e) => setFormInputDesc(e.target.value)}
                          className="w-full rounded-xl border border-[#eadfce] bg-white p-3.5 text-sm text-[#292725] focus:border-[#ea721f] focus:outline-none"
                          placeholder="เช่น บรรทัดแรกประกอบด้วยจำนวนเต็ม N..."
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-[#5c5148] mb-1">
                          รูปแบบข้อมูลออก (Output Specification)
                        </label>
                        <textarea
                          rows={4}
                          value={formOutputDesc}
                          onChange={(e) => setFormOutputDesc(e.target.value)}
                          className="w-full rounded-xl border border-[#eadfce] bg-white p-3.5 text-sm text-[#292725] focus:border-[#ea721f] focus:outline-none"
                          placeholder="เช่น แสดงผลลัพธ์คำตอบ 1 บรรทัด..."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-bold uppercase text-[#5c5148] mb-1">
                          ตัวอย่าง ข้อมูลเข้า (Sample Input)
                        </label>
                        <textarea
                          rows={4}
                          value={formSampleInput}
                          onChange={(e) => setFormSampleInput(e.target.value)}
                          className="font-mono text-xs w-full rounded-xl border border-[#eadfce] bg-[#faf6f0] p-3.5 text-[#292725] focus:border-[#ea721f] focus:outline-none"
                          placeholder="2 3"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-[#5c5148] mb-1">
                          ตัวอย่าง ข้อมูลออก (Sample Output)
                        </label>
                        <textarea
                          rows={4}
                          value={formSampleOutput}
                          onChange={(e) => setFormSampleOutput(e.target.value)}
                          className="font-mono text-xs w-full rounded-xl border border-[#eadfce] bg-[#faf6f0] p-3.5 text-[#292725] focus:border-[#ea721f] focus:outline-none"
                          placeholder="5"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Test Cases */}
                  <div className="rounded-3xl border border-[#eadfce] bg-white p-6 sm:p-8 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-[#eadfce] pb-3">
                      <h3 className="text-base font-bold text-[#292725] flex items-center gap-2">
                        <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#fff0df] text-xs font-bold text-[#ea721f]">3</span>
                        ชุดทดสอบตรวจคำตอบ (Test Cases)
                      </h3>
                      <button
                        type="button"
                        onClick={handleAddTestCase}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#fff0df] border border-[#f5c79e] px-4 py-2 text-xs font-bold text-[#ea721f] transition hover:bg-[#ffe3c9]"
                      >
                        + เพิ่ม Test Case
                      </button>
                    </div>

                    <div className="space-y-4">
                      {formTests.map((test, index) => (
                        <div
                          key={index}
                          className="rounded-2xl border border-[#eadfce] bg-[#faf6f0] p-4 sm:p-5 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-[#ea721f]">
                              Test Case #{index + 1}
                            </span>
                            {formTests.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveTestCase(index)}
                                className="rounded-lg border border-rose-200 bg-white px-3 py-1 text-xs font-bold text-rose-600 transition hover:bg-rose-50"
                              >
                                ลบ Test Case นี้
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                              <label className="block text-[11px] font-bold uppercase text-[#71675f] mb-1">
                                Input (ข้อมูลเข้าสำหรับ Test Case นี้)
                              </label>
                              <textarea
                                rows={3}
                                placeholder="Input..."
                                value={test.input}
                                onChange={(e) => handleTestCaseChange(index, "input", e.target.value)}
                                className="font-mono text-xs w-full rounded-xl border border-[#eadfce] bg-white p-3 text-[#292725] focus:border-[#ea721f] focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold uppercase text-[#71675f] mb-1">
                                Expected Output (ผลลัพธ์ที่ถูกต้องสำหรับ Test Case นี้)
                              </label>
                              <textarea
                                rows={3}
                                placeholder="Expected Output..."
                                value={test.expected}
                                onChange={(e) => handleTestCaseChange(index, "expected", e.target.value)}
                                className="font-mono text-xs w-full rounded-xl border border-[#eadfce] bg-white p-3 text-[#292725] focus:border-[#ea721f] focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Save / Cancel Bar */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#eadfce]">
                    <button
                      type="button"
                      onClick={() => setProblemViewMode("list")}
                      className="rounded-xl border border-[#eadfce] bg-white px-6 py-3 text-sm font-semibold text-[#5c5148] transition hover:bg-[#f7f3ed]"
                    >
                      ยกเลิกและย้อนกลับ
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="rounded-xl bg-[#ea721f] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-[#ea721f]/20 transition hover:bg-[#d85f13] disabled:opacity-50"
                    >
                      {submitting
                        ? "กำลังบันทึก..."
                        : editingProblem
                        ? "บันทึกการแก้ไขโจทย์"
                        : "บันทึกสร้างโจทย์ใหม่"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}

        {/* TAB 2: USERS & ROLE ASSIGNMENT */}
        {activeTab === "users" && (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#eadfce] bg-white p-5 shadow-sm">
                <div className="text-xs font-bold uppercase text-[#71675f]">
                  ผู้ใช้ทั้งหมด
                </div>
                <div className="mt-2 text-3xl font-extrabold text-[#292725]">
                  {users.length} คน
                </div>
              </div>

              <div className="rounded-2xl border border-purple-200 bg-purple-50/60 p-5 shadow-sm">
                <div className="text-xs font-bold uppercase text-purple-700">
                  ผู้ดูแลระบบ (Admin)
                </div>
                <div className="mt-2 text-3xl font-extrabold text-purple-800">
                  {adminCount} คน
                </div>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 shadow-sm">
                <div className="text-xs font-bold uppercase text-[#d55d11]">
                  สมาชิก PRO
                </div>
                <div className="mt-2 text-3xl font-extrabold text-[#ea721f]">
                  {proCount} คน
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div>
              <input
                type="text"
                placeholder="ค้นหาผู้ใช้ตาม Username หรือ Email..."
                value={searchUserQuery}
                onChange={(e) => setSearchUserQuery(e.target.value)}
                className="w-full rounded-xl border border-[#eadfce] bg-white px-4 py-2.5 text-sm text-[#292725] placeholder-[#a3978c] focus:border-[#ea721f] focus:outline-none shadow-sm"
              />
            </div>

            {/* Users Table */}
            <div className="overflow-hidden rounded-2xl border border-[#eadfce] bg-white shadow-xl">
              {loadingUsers ? (
                <div className="p-12 text-center text-[#71675f]">
                  กำลังโหลดข้อมูลผู้ใช้ทั้งหมด...
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-12 text-center text-[#71675f]">
                  ไม่พบรายชื่อผู้ใช้ที่ค้นหา
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-[#303030]">
                    <thead className="border-b border-[#eadfce] bg-[#faf6f0] text-xs uppercase font-bold text-[#5c5148]">
                      <tr>
                        <th className="px-5 py-3.5">Username</th>
                        <th className="px-5 py-3.5">Email</th>
                        <th className="px-5 py-3.5">สถานะ Plan</th>
                        <th className="px-5 py-3.5">สิทธิ์การใช้งาน (Role)</th>
                        <th className="px-5 py-3.5">วันที่สมัคร</th>
                        <th className="px-5 py-3.5 text-right">กำหนด Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0dfc8]">
                      {filteredUsers.map((usr) => (
                        <tr
                          key={usr.username}
                          className="transition hover:bg-[#fcfaf7]"
                        >
                          <td className="px-5 py-4 font-bold text-[#292725]">
                            {usr.username}
                          </td>
                          <td className="px-5 py-4 text-[#71675f]">
                            {usr.email}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex flex-col gap-1 items-start">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${
                                    usr.plan === "pro"
                                      ? "bg-amber-100 text-amber-800 border border-amber-300 shadow-sm"
                                      : "bg-zinc-100 text-zinc-700 border border-zinc-300"
                                  }`}
                                >
                                  {usr.plan}
                                </span>
                                <button
                                  onClick={() => openPlanModal(usr)}
                                  className="rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800 transition hover:bg-amber-100"
                                >
                                  ปรับวัน PRO
                                </button>
                              </div>
                              {usr.plan === "pro" && usr.planExpiresAt && (
                                <span className="text-[10px] text-amber-700 font-semibold">
                                  หมดอายุ: {new Date(usr.planExpiresAt).toLocaleDateString("th-TH")}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`inline-block rounded-full px-3 py-1 text-xs font-extrabold uppercase ${
                                usr.role === "admin"
                                  ? "bg-purple-100 text-purple-800 border border-purple-300 shadow-sm"
                                  : "bg-zinc-100 text-zinc-700 border border-zinc-300"
                              }`}
                            >
                              {usr.role}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-xs text-[#71675f]">
                            {usr.createdAt
                              ? new Date(usr.createdAt).toLocaleDateString("th-TH")
                              : "-"}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {session.user?.username?.toLowerCase() === usr.username.toLowerCase() ? (
                                <span className="inline-block rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700">
                                  บัญชีของคุณ
                                </span>
                              ) : usr.role === "user" ? (
                                <button
                                  disabled={roleUpdatingUser === usr.username}
                                  onClick={() =>
                                    handleRoleChange(usr.username, "admin")
                                  }
                                  className="rounded-lg border border-purple-300 bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700 transition hover:bg-purple-100 disabled:opacity-50"
                                >
                                  {roleUpdatingUser === usr.username
                                    ? "กำลังตั้งค่า..."
                                    : "ตั้งเป็น ADMIN"}
                                </button>
                              ) : (
                                <button
                                  disabled={roleUpdatingUser === usr.username}
                                  onClick={() =>
                                    handleRoleChange(usr.username, "user")
                                  }
                                  className="rounded-lg border border-[#eadfce] bg-white px-3 py-1.5 text-xs font-bold text-[#5c5148] transition hover:bg-[#f7f3ed] disabled:opacity-50"
                                >
                                  {roleUpdatingUser === usr.username
                                    ? "กำลังตั้งค่า..."
                                    : "ลดสิทธิ์เป็น USER"}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* PLAN ADJUSTMENT MODAL */}
      {isPlanModalOpen && targetUserForPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl border border-[#eadfce] bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-[#eadfce] pb-4">
              <div>
                <h3 className="text-xl font-bold text-[#292725]">
                  ตั้งค่า Plan & จำนวนวัน PRO
                </h3>
                <p className="text-xs text-[#71675f] mt-0.5">
                  สำหรับผู้ใช้: <strong className="text-[#ea721f]">{targetUserForPlan.username}</strong> ({targetUserForPlan.email})
                </p>
              </div>
              <button
                onClick={() => setIsPlanModalOpen(false)}
                className="rounded-xl bg-[#f7f3ed] p-2 text-[#71675f] hover:bg-[#eadfce] hover:text-[#292725]"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-5">
              {/* Current Status Info */}
              <div className="rounded-2xl border border-[#eadfce] bg-[#faf6f0] p-4 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#71675f]">สถานะปัจจุบัน:</span>
                  <span className="font-bold uppercase text-[#ea721f]">{targetUserForPlan.plan}</span>
                </div>
                {targetUserForPlan.plan === "pro" && targetUserForPlan.planExpiresAt && (
                  <div className="flex justify-between">
                    <span className="text-[#71675f]">วันหมดอายุปัจจุบัน:</span>
                    <span className="font-semibold text-[#292725]">
                      {new Date(targetUserForPlan.planExpiresAt).toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })}
                    </span>
                  </div>
                )}
              </div>

              {/* Presets */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#5c5148] mb-2">
                  เลือกจำนวนวันที่ต้องการกำหนด (Presets)
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[
                    { label: "30 วัน (1 เดือน)", days: 30 },
                    { label: "90 วัน (3 เดือน)", days: 90 },
                    { label: "180 วัน (6 เดือน)", days: 180 },
                    { label: "365 วัน (1 ปี)", days: 365 },
                  ].map((preset) => (
                    <button
                      key={preset.days}
                      type="button"
                      onClick={() => setCustomDays(preset.days)}
                      className={`rounded-xl border py-2 text-xs font-bold transition ${
                        customDays === preset.days
                          ? "border-[#ea721f] bg-[#fff0df] text-[#ea721f] shadow-sm"
                          : "border-[#eadfce] bg-white text-[#5c5148] hover:bg-[#f7f3ed]"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Days Input */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#5c5148]">
                  หรือกรอกจำนวนวันตามต้องการ
                </label>
                <div className="mt-1.5 flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={3650}
                    value={customDays}
                    onChange={(e) => setCustomDays(Math.max(1, Number(e.target.value)))}
                    className="w-full rounded-xl border border-[#eadfce] bg-white px-3.5 py-2 text-sm font-bold text-[#292725] focus:border-[#ea721f] focus:outline-none"
                    placeholder="เช่น 7, 14, 45, 60..."
                  />
                  <span className="text-sm font-bold text-[#5c5148] shrink-0">วัน</span>
                </div>
              </div>

              {/* Mode Selection */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#5c5148] mb-2">
                  รูปแบบการคำนวณวัน
                </label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setPlanMode("extend")}
                    className={`flex flex-col items-start p-3 rounded-xl border text-left transition ${
                      planMode === "extend"
                        ? "border-[#ea721f] bg-[#fff0df] text-[#292725]"
                        : "border-[#eadfce] bg-white text-[#71675f] hover:bg-[#f7f3ed]"
                    }`}
                  >
                    <span className="text-xs font-bold">ต่ออายุสะสม (Extend)</span>
                    <span className="text-[11px] opacity-80 mt-0.5">บวกเพิ่ม {customDays} วัน จากวันหมดอายุเดิม</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPlanMode("set_from_now")}
                    className={`flex flex-col items-start p-3 rounded-xl border text-left transition ${
                      planMode === "set_from_now"
                        ? "border-[#ea721f] bg-[#fff0df] text-[#292725]"
                        : "border-[#eadfce] bg-white text-[#71675f] hover:bg-[#f7f3ed]"
                    }`}
                  >
                    <span className="text-xs font-bold">นับเริ่มใหม่ (From Today)</span>
                    <span className="text-[11px] opacity-80 mt-0.5">ตั้ง {customDays} วัน เริ่มนับตั้งแต่วันนี้</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#eadfce] pt-5">
                <button
                  type="button"
                  onClick={() => handleSavePlan("free")}
                  disabled={submitting}
                  className="w-full sm:w-auto rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-600 transition hover:bg-rose-100 disabled:opacity-50"
                >
                  ปรับเป็น FREE (ยกเลิก PRO)
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setIsPlanModalOpen(false)}
                    className="rounded-xl border border-[#eadfce] bg-white px-4 py-2.5 text-xs font-semibold text-[#5c5148] transition hover:bg-[#f7f3ed]"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSavePlan("pro")}
                    disabled={submitting}
                    className="rounded-xl bg-[#ea721f] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#ea721f]/20 transition hover:bg-[#d85f13] disabled:opacity-50"
                  >
                    {submitting ? "กำลังบันทึก..." : `บันทึก PRO (${customDays} วัน)`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && problemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-rose-200 bg-white p-6 text-center shadow-2xl sm:p-8">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-200">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-bold text-[#292725]">ยืนยันการลบโจทย์</h3>
            <p className="mt-2 text-sm text-[#71675f] leading-relaxed">
              คุณแน่ใจหรือไม่ว่าต้องการลบโจทย์{" "}
              <strong className="text-[#292725]">"{problemToDelete.title}"</strong> (ID: #{problemToDelete.id})? การกระทำนี้ไม่สามารถย้อนกลับได้
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="rounded-xl border border-[#eadfce] bg-white px-5 py-2.5 text-sm font-semibold text-[#5c5148] transition hover:bg-[#f7f3ed]"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDeleteProblem}
                disabled={submitting}
                className="rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-rose-600/20 transition hover:bg-rose-700 disabled:opacity-50"
              >
                {submitting ? "กำลังลบ..." : "ยืนยันการลบ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
