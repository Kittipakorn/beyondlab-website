"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontSizeControl } from "../components/beyondlab/EditorControls";
import { UserMenu } from "../components/beyondlab/ProtectedToolBar";
import { getTextareaCaretPosition } from "../components/beyondlab/editorCaret";

const starterCode = `#include <bits/stdc++.h>
using namespace std;

int main() {
    cout << "Hello, BeyondLab!";
}`;
const pythonStarterCode = `print("Hello, BeyondLab!")`;

const cppCompletionWords = [
  "cout", "cin", "endl", "return", "int", "string", "vector", "for", "while",
  "if", "else", "include", "using", "namespace",
];

type RunState = "idle" | "running" | "passed" | "failed";
type Submission = { id: string; code: string; status: "passed" | "failed"; score: number; createdAt: string };
type TestCaseResult = {
  id: number;
  status: "passed" | "failed" | "tle" | "rte";
  input: string;
  expected: string;
  actual: string;
  stderr?: string;
  executionTime?: number;
};
type Problem = {
  id: number;
  title: string;
  topic: string;
  difficulty: "ง่าย" | "ปานกลาง" | "ยาก";
  accessTier: "free" | "pro";
  points: number;
  description?: string;
  inputDescription?: string;
  outputDescription?: string;
  sampleInput?: string;
  sampleOutput?: string;
  testCaseCount: number;
  solved: boolean;
  passedCount: number;
  locked: boolean;
};

const placeholderProblem: Problem = {
  id: 1,
  title: "กำลังโหลดโจทย์...",
  topic: "BeyondLab Grader",
  difficulty: "ง่าย",
  accessTier: "free",
  points: 0,
  description: "",
  inputDescription: "",
  outputDescription: "",
  sampleInput: "",
  sampleOutput: "",
  testCaseCount: 0,
  solved: false,
  passedCount: 0,
  locked: true,
};

const cppKeywords = new Set([
  "alignas", "alignof", "and", "asm", "auto", "break", "case", "catch", "class",
  "const", "constexpr", "continue", "default", "delete", "do", "else", "enum",
  "explicit", "export", "extern", "false", "for", "friend", "goto", "if",
  "inline", "namespace", "new", "noexcept", "not", "nullptr", "operator", "or",
  "private", "protected", "public", "register", "reinterpret_cast", "return",
  "sizeof", "static", "struct", "switch", "template", "this", "throw", "true",
  "try", "typedef", "typename", "union", "using", "virtual", "volatile", "while"
]);

const cppTypes = new Set([
  "bool", "char", "double", "float", "int", "long", "short", "signed",
  "string", "unsigned", "void", "wchar_t", "std", "cin", "cout", "endl"
]);

export function highlightCpp(source: string) {
  const tokenPattern =
    /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|^\s*#\s*[a-zA-Z]+|<[a-zA-Z0-9_.\/]+>|\b(?:alignas|alignof|and|asm|auto|break|case|catch|class|const|constexpr|continue|default|delete|do|else|enum|explicit|export|extern|false|for|friend|goto|if|inline|namespace|new|noexcept|not|nullptr|operator|or|private|protected|public|register|reinterpret_cast|return|sizeof|static|struct|switch|template|this|throw|true|try|typedef|typename|union|using|virtual|volatile|while)\b|\b(?:bool|char|double|float|int|long|short|signed|string|unsigned|void|wchar_t|std|cin|cout|endl)\b|\b(?:0[xX][\da-fA-F]+|\d+(?:\.\d+)?)\b)/gm;

  return source.split(tokenPattern).map((token, index) => {
    if (!token) return null;

    let color = "syntax-plain";
    if (/^(\/\/|\/\*)/.test(token)) color = "syntax-comment";
    else if (/^["']/.test(token)) color = "syntax-string";
    else if (/^\s*#/.test(token) || /^<.*>$/.test(token)) color = "syntax-preprocessor";
    else if (cppTypes.has(token)) color = "syntax-type";
    else if (/^(?:0[xX][\da-fA-F]+|\d+(?:\.\d+)?)$/.test(token)) color = "syntax-number";
    else if (cppKeywords.has(token)) color = "syntax-keyword";

    return <span key={`${index}-${token.slice(0, 8)}`} className={color}>{token}</span>;
  });
}

export function highlightCode(source: string, language: "cpp" | "python" | "javascript") {
  if (language === "cpp") return highlightCpp(source);

  const tokenPattern =
    language === "python"
      ? /(#[^\n]*|"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:and|as|assert|async|await|break|class|continue|def|del|elif|else|except|False|finally|for|from|global|if|import|in|is|lambda|None|nonlocal|not|or|pass|raise|return|True|try|while|with|yield)\b|\b(?:print|input|len|range|int|str|float|list|dict|set|self)\b|\b\d+(?:\.\d+)?\b)/gm
      : /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|export|extends|false|finally|for|from|function|if|import|in|instanceof|let|new|null|of|return|static|super|switch|this|throw|true|try|typeof|var|void|while|with|yield)\b|\b(?:console|log|Math|JSON|Array|String|Number|Boolean)\b|\b\d+(?:\.\d+)?\b)/gm;

  return source.split(tokenPattern).map((token, index) => {
    if (!token) return null;
    let color = "syntax-plain";
    if (/^(#|\/\/|\/\*|'''|""")/.test(token)) color = "syntax-comment";
    else if (/^["'`]/.test(token)) color = "syntax-string";
    else if (/^\d/.test(token)) color = "syntax-number";
    else if (
      language === "python"
        ? /^(and|as|assert|async|await|break|class|continue|def|del|elif|else|except|False|finally|for|from|global|if|import|in|is|lambda|None|nonlocal|not|or|pass|raise|return|True|try|while|with|yield)$/.test(token)
        : /^(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|export|extends|false|finally|for|from|function|if|import|in|instanceof|let|new|null|of|return|static|super|switch|this|throw|true|try|typeof|var|void|while|with|yield)$/.test(token)
    ) color = "syntax-keyword";
    else if (
      language === "python"
        ? /^(print|input|len|range|int|str|float|list|dict|set|self)$/.test(token)
        : /^(console|log|Math|JSON|Array|String|Number|Boolean)$/.test(token)
    ) color = "syntax-type";
    return <span key={`${index}-${token.slice(0, 8)}`} className={color}>{token}</span>;
  });
}

function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: "play" | "send" | "check" | "clock" | "chevron" | "terminal" | "lightbulb" | "reset" | "menu" | "search" | "book" | "close" | "sun" | "moon" | "download" | "upload";
  className?: string;
}) {
  const paths: Record<string, React.ReactNode> = {
    play: <path d="m8 5 11 7-11 7V5Z" />,
    send: <><path d="m22 2-7 20-4-9-9-4 20-7Z" /><path d="M22 2 11 13" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    terminal: <><path d="m7 8 4 4-4 4" /><path d="M13 16h4" /></>,
    lightbulb: <><path d="M9 18h6" /><path d="M10 22h4" /><path d="M8.5 14.5A6 6 0 1 1 15.5 14.5c-.9.7-1.5 1.6-1.5 2.5h-4c0-.9-.6-1.8-1.5-2.5Z" /></>,
    reset: <><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v6h6" /></>,
    menu: <><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /></>,
    close: <><path d="m6 6 12 12" /><path d="m18 6-12 12" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.42 1.42" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></>,
    moon: <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />,
    download: <><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></>,
    upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m17 8-5-5-5 5" /><path d="M12 3v12" /></>,
  };

  const path = paths[name];
  if (!path) return null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {path}
    </svg>
  );
}

type GraderWorkspaceProps = {
  username: string;
  email: string;
  backendUrl: string;
};

export function GraderWorkspace({
  username,
  email,
  backendUrl,
}: GraderWorkspaceProps) {
  const [code, setCode] = useState(starterCode);
  const [language, setLanguage] = useState<"cpp" | "python">("cpp");
  const [activeTab, setActiveTab] = useState<"problem" | "submissions">("problem");
  const [consoleTab, setConsoleTab] = useState<"result" | "custom">("custom");
  const [runState, setRunState] = useState<RunState>("idle");
  const [testResults, setTestResults] = useState<TestCaseResult[]>([]);
  const [compileError, setCompileError] = useState<string | null>(null);
  const [customOutput, setCustomOutput] = useState<{ stdout: string; stderr: string; status?: string } | null>(null);
  const [selectedTestCase, setSelectedTestCase] = useState<TestCaseResult | null>(null);
  const [customInput, setCustomInput] = useState("");
  const [selectedProblem, setSelectedProblem] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(290);
  const [problemWidth, setProblemWidth] = useState(40);
  const [consoleHeight, setConsoleHeight] = useState(240);
  const [fontSize, setFontSize] = useState(14);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [problemsError, setProblemsError] = useState("");
  const [problemsLoading, setProblemsLoading] = useState(true);
  const [problemsReloadKey, setProblemsReloadKey] = useState(0);
  const [userPlan, setUserPlan] = useState<"free" | "pro">("free");
  const [planExpiresAt, setPlanExpiresAt] = useState<string | null>(null);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [studentEmail, setStudentEmail] = useState("");
  const [studentFullName, setStudentFullName] = useState("");
  const [requestingStudentCode, setRequestingStudentCode] = useState(false);
  const [studentFormError, setStudentFormError] = useState("");
  const [studentFormSuccess, setStudentFormSuccess] = useState("");

  const [showSlipForm, setShowSlipForm] = useState(false);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);
  const [uploadingSlip, setUploadingSlip] = useState(false);
  const [slipError, setSlipError] = useState("");
  const [slipSuccess, setSlipSuccess] = useState("");
  const [copiedPromptPay, setCopiedPromptPay] = useState(false);

  function handleCopyPromptPay() {
    navigator.clipboard.writeText("0987824363");
    setCopiedPromptPay(true);
    setTimeout(() => setCopiedPromptPay(false), 2000);
  }

  function handleSlipFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setSlipError("ขนาดไฟล์ต้องไม่เกิน 5 MB");
      return;
    }
    setSlipError("");
    setSlipSuccess("");
    const reader = new FileReader();
    reader.onload = (e) => {
      setSlipPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function handleUploadSlip(event: React.FormEvent) {
    event.preventDefault();
    if (!slipPreview) {
      setSlipError("กรุณาเลือกไฟล์สลิปชำระเงินก่อนส่ง");
      return;
    }
    setUploadingSlip(true);
    setSlipError("");
    setSlipSuccess("");
    try {
      const response = await fetch(`/api/proxy/user/upload-slip`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slipImage: slipPreview }),
      });
      const data = await response.json();
      if (response.ok && data?.success) {
        setSlipSuccess(data.message || "อัปโหลดสลิปสำเร็จ! เปิดใช้งานสมาชิก PRO เรียบร้อยแล้ว");
        setUserPlan("pro");
        if (data?.planExpiresAt) setPlanExpiresAt(data.planExpiresAt);
        setTimeout(() => {
          setUpgradeModalOpen(false);
        }, 1800);
      } else {
        setSlipError(data?.error || "ไม่สามารถอัปโหลดสลิปได้");
      }
    } catch {
      setSlipError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    } finally {
      setUploadingSlip(false);
    }
  }

  async function handleRequestStudentCode(event: React.FormEvent) {
    event.preventDefault();
    if (!studentEmail.trim() || !studentFullName.trim()) return;
    setRequestingStudentCode(true);
    setStudentFormError("");
    setStudentFormSuccess("");
    try {
      const response = await fetch(`/api/proxy/user/request-student-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: studentEmail.trim(), fullName: studentFullName.trim() }),
      });
      const data = await response.json();
      if (response.ok && data?.success) {
        setStudentFormSuccess(data.message || "ยืนยันสิทธิ์สำเร็จ! ได้รับสิทธิ์สมาชิก PRO ฟรี 6 เดือนเรียบร้อยแล้ว");
        setUserPlan("pro");
        if (data?.planExpiresAt) setPlanExpiresAt(data.planExpiresAt);
        setTimeout(() => {
          setUpgradeModalOpen(false);
        }, 1800);
      } else {
        setStudentFormError(data?.error || "ไม่สามารถยืนยันสิทธิ์ได้");
      }
    } catch {
      setStudentFormError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    } finally {
      setRequestingStudentCode(false);
    }
  }

  function formatExpireDate(dateString: string | null) {
    try {
      const date = dateString ? new Date(dateString) : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return null;
    }
  }



  async function handleUpgradePro() {
    setUpgrading(true);
    try {
      const response = await fetch(`/api/proxy/user/upgrade-pro`, {
        method: "POST",
      });
      const data = await response.json();
      if (response.ok && data?.success) {
        setUserPlan("pro");
        if (data?.planExpiresAt) setPlanExpiresAt(data.planExpiresAt);
        const problemRes = await fetch(`/api/proxy/problems`);
        if (problemRes.ok) {
          const problemResult = await problemRes.json();
          if (problemResult?.problems?.length) setProblems(problemResult.problems);
          if (problemResult?.planExpiresAt) setPlanExpiresAt(problemResult.planExpiresAt);
        }
        setUpgradeModalOpen(false);
      } else {
        alert("เกิดข้อผิดพลาดในการอัปเกรดสมาชิก กรุณาลองใหม่อีกครั้ง");
      }
    } catch {
      alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    } finally {
      setUpgrading(false);
    }
  }
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [suggestionPosition, setSuggestionPosition] = useState({ left: 64, top: 48 });
  const highlightedCodeRef = useRef<HTMLPreElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const lineCount = useMemo(() => code.split("\n").length, [code]);
  const suggestions = useMemo(() => {
    const prefix = code.slice(0, cursorPosition).match(/[A-Za-z_]+$/)?.[0] ?? "";
    if (prefix.length < 2) return [];
    return cppCompletionWords
      .filter((word) => word.startsWith(prefix) && word !== prefix)
      .slice(0, 5);
  }, [code, cursorPosition]);

  useEffect(() => setSelectedSuggestion(0), [code, cursorPosition]);

  function updateCursor(textarea: HTMLTextAreaElement) {
    const position = textarea.selectionStart;
    const caret = getTextareaCaretPosition(textarea, position);
    setCursorPosition(position);
    setSuggestionPosition({
      left: Math.max(56, Math.min(caret.left, textarea.clientWidth - 300)),
      top: Math.max(8, Math.min(caret.top + caret.lineHeight, textarea.clientHeight - 190)),
    });
  }
  const filteredProblems = useMemo(
    () => problems.filter((problem) => problem.title.includes(query) || problem.topic.includes(query)),
    [problems, query],
  );
  const activeProblem = problems.find((problem) => problem.id === selectedProblem) ?? problems[0] ?? placeholderProblem;
  const solvedProblemCount = problems.filter((problem) => problem.solved).length;

  function reconcilePassedSubmission(problemId: number, history: Submission[]) {
    if (!history.some((submission) => submission.status === "passed")) return;
    setProblems((current) => current.map((problem) => (
      problem.id === problemId
        ? { ...problem, solved: true, passedCount: Math.max(1, problem.passedCount) }
        : problem
    )));
  }

  useEffect(() => {
    setProblemsLoading(true);
    setProblemsError("");
    fetch(`/api/proxy/health`)
      .then(async (response) => {
        if (!response.ok) throw new Error("เซิร์ฟเวอร์ยังไม่พร้อมใช้งาน");
        return response;
      })
      .then(() => fetch(`/api/proxy/problems`))
      .then(async (response) => {
        const result = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(result?.message || "สัญญาณขาดหาย สงสัยพี่มิคค์เดินเตะปลั๊กไฟ\nพักหน้าจอสักครู่ แล้วค่อยมาลองใหม่อีกครั้งนะ");
        }
        return result;
      })
      .then((result) => {
        if (result?.plan) setUserPlan(result.plan);
        if (result?.planExpiresAt) setPlanExpiresAt(result.planExpiresAt);
        if (result?.problems?.length) setProblems(result.problems);
      })
      .catch((error: unknown) => {
        setProblemsError(
          error instanceof Error
            ? error.message
            : "สัญญาณขาดหาย สงสัยพี่มิคค์เดินเตะปลั๊กไฟ\nพักหน้าจอสักครู่ แล้วค่อยมาลองใหม่อีกครั้งนะ",
        );
      })
      .finally(() => setProblemsLoading(false));
  }, [backendUrl, problemsReloadKey]);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("beyondlab-grader-theme");
    setDarkMode(savedTheme ? savedTheme === "dark" : true);
  }, []);

  useEffect(() => {
    if (problemsLoading || problemsError) return;
    fetch(`/api/proxy/submissions?problemId=${selectedProblem}`)
      .then((response) => response.ok ? response.json() : null)
      .then((result) => {
        const history = (result?.submissions ?? []) as Submission[];
        setSubmissions(history);
        reconcilePassedSubmission(selectedProblem, history);
      })
      .catch(() => {});
  }, [backendUrl, selectedProblem, problemsLoading, problemsError]);

  useEffect(() => {
    document.body.classList.add("grader-page-active");
    return () => document.body.classList.remove("grader-page-active");
  }, []);

  function toggleTheme() {
    setDarkMode((current) => {
      const next = !current;
      window.localStorage.setItem("beyondlab-grader-theme", next ? "dark" : "light");
      return next;
    });
  }

  function downloadCode() {
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = language === "python" ? "main.py" : "main.cpp";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function loadSubmissionCode(submission: Submission) {
    setCode(submission.code);
    setCursorPosition(submission.code.length);
    setActiveTab("problem");
  }

  async function evaluate(submit = false) {
    if (activeProblem?.locked) return;
    setRunState("running");
    setCompileError(null);
    setConsoleTab("result");
    setSelectedTestCase(null);
    try {
      const response = await fetch(`/api/proxy/compile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          code,
          input: customInput,
          submit,
          problemId: selectedProblem,
          isCustom: false,
        }),
      });
      const result = (await response.json()) as {
        status?: string;
        error?: string;
        stderr?: string;
        stdout?: string;
        testResults?: TestCaseResult[];
      };

      if (!response.ok || result.error) {
        setRunState("failed");
        setCompileError(result.error || result.stderr || "เกิดข้อผิดพลาดในการประมวลผล");
        return;
      }

      if (result.status === "Compile Error") {
        setRunState("failed");
        setCompileError(result.stderr || "Compile Error");
        setTestResults([]);
        return;
      }

      const isPassed = result.status === "Success";
      setRunState(isPassed ? "passed" : "failed");
      setTestResults(result.testResults ?? []);

      if (submit && response.ok) {
        const history = await fetch(`/api/proxy/submissions?problemId=${selectedProblem}`);
        if (history.ok) {
          const submissionHistory = ((await history.json()).submissions ?? []) as Submission[];
          setSubmissions(submissionHistory);
          reconcilePassedSubmission(selectedProblem, submissionHistory);
        }
        const problemResponse = await fetch(`/api/proxy/problems`);
        if (problemResponse.ok) {
          const problemResult = await problemResponse.json();
          if (problemResult?.plan === "pro") setUserPlan("pro");
          if (problemResult?.problems?.length) setProblems(problemResult.problems);
        }
      }
    } catch {
      setRunState("failed");
      setCompileError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    }
  }

  async function runCustomInput() {
    if (activeProblem?.locked) return;
    setRunState("running");
    setCompileError(null);
    try {
      const response = await fetch(
        `/api/proxy/compile`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language,
            code,
            input: customInput,
            submit: false,
            problemId: selectedProblem,
            isCustom: true,
          }),
        },
      );
      const result = await response.json();
      if (result.status === "Compile Error") {
        setCompileError(result.stderr || "Compile Error");
        setCustomOutput({ stdout: "", stderr: result.stderr || "", status: "Compile Error" });
      } else {
        setCustomOutput({
          stdout: result.stdout || "",
          stderr: result.stderr || "",
          status: result.status,
        });
      }
      setRunState("idle");
    } catch {
      setCompileError("เชื่อมต่อระบบคอมไพเลอร์ไม่ได้");
      setRunState("idle");
    }
  }

  function handleCodeKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    const textarea = event.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const closingPair: Record<string, string> = { "(": ")", "[": "]", "{": "}", "\"": "\"", "'": "'", "`": "`" };
    if (closingPair[event.key]) {
      event.preventDefault();
      const pair = `${event.key}${closingPair[event.key]}`;
      setCode(`${code.slice(0, start)}${pair}${code.slice(end)}`);
      requestAnimationFrame(() => {
        textarea.setSelectionRange(start + 1, start + 1);
        setCursorPosition(start + 1);
      });
      return;
    }
    if (suggestions.length > 0 && event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedSuggestion((value) => (value + 1) % suggestions.length);
      return;
    }
    if (suggestions.length > 0 && event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedSuggestion((value) => (value - 1 + suggestions.length) % suggestions.length);
      return;
    }

    if (event.key === "Tab" || (event.key === "Enter" && suggestions.length > 0)) {
      event.preventDefault();
      const prefix = code.slice(0, start).match(/[A-Za-z_]+$/)?.[0] ?? "";
      const completion = suggestions[selectedSuggestion];
      const inserted = completion ? completion.slice(prefix.length) : "\t";
      setCode(`${code.slice(0, start)}${inserted}${code.slice(end)}`);
      requestAnimationFrame(() =>
        {
          const cursor = start + inserted.length;
          textarea.setSelectionRange(cursor, cursor);
          setCursorPosition(cursor);
        },
      );
      return;
    }

    if (event.key !== "Enter") return;
    event.preventDefault();
    const lineStart = code.lastIndexOf("\n", start - 1) + 1;
    const lineEndIndex = code.indexOf("\n", start);
    const lineEnd = lineEndIndex === -1 ? code.length : lineEndIndex;
    const beforeCursor = code.slice(lineStart, start);
    const afterCursor = code.slice(start, lineEnd);
    const indentation = (beforeCursor.match(/^[\t ]*/)?.[0] ?? "").replace(
      / {4}/g,
      "\t",
    );
    const opensBlock = /{\s*$/.test(beforeCursor);
    const closesBlock = /^\s*}/.test(afterCursor);
    const inserted =
      opensBlock && closesBlock
        ? `\n${indentation}\t\n${indentation}`
        : `\n${indentation}${opensBlock ? "\t" : ""}`;
    setCode(`${code.slice(0, start)}${inserted}${code.slice(end)}`);
    requestAnimationFrame(() => {
      const cursor =
        opensBlock && closesBlock
          ? start + 1 + indentation.length + 1
          : start + inserted.length;
      textarea.setSelectionRange(cursor, cursor);
      setCursorPosition(cursor);
    });
  }

  function beginResize(
    event: React.PointerEvent,
    cursor: "col-resize" | "row-resize",
    onMove: (moveEvent: PointerEvent) => void,
  ) {
    event.preventDefault();
    const previousCursor = document.body.style.cursor;
    const previousSelection = document.body.style.userSelect;
    document.body.style.cursor = cursor;
    document.body.style.userSelect = "none";

    const stop = () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", stop);
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousSelection;
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", stop, { once: true });
  }

  return (
    <div
      className={`grader-workspace fixed inset-0 z-[100] flex h-dvh min-w-0 overflow-hidden bg-[#f7f3ed] ${darkMode ? "grader-dark" : ""}`}
      style={{ "--grader-code-font-size": `${fontSize}px` } as React.CSSProperties}
    >
      {sidebarOpen && (
        <button
          type="button"
          aria-label="ปิดรายการโจทย์"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-20 cursor-default bg-black/45 lg:hidden"
        />
      )}

      <aside
        className={`grader-sidebar grader-sidebar-resizable fixed inset-y-0 left-0 z-30 flex w-[290px] flex-col border-r border-[#e4dace] bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${sidebarCollapsed ? "grader-sidebar-collapsed" : ""} ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ "--grader-sidebar-width": `${sidebarCollapsed ? 76 : sidebarWidth}px` } as React.CSSProperties}
        aria-label="รายการโจทย์"
      >
        <div className={`flex h-16 flex-none items-center border-b border-[#eee6dc] px-3 ${sidebarCollapsed ? "lg:justify-center" : "justify-between"}`}>
          <Link href="/" className="flex min-h-11 items-center gap-2 rounded-lg px-2 text-base font-bold text-[#292725]">
            <Image src="/logo-v2.png" alt="BeyondLab" width={24} height={24} className={`grader-logo h-6 w-6 object-contain ${darkMode ? "grader-logo-dark" : ""}`} priority />
            <span className={sidebarCollapsed ? "lg:hidden" : ""}>BeyondLab <span className="font-semibold text-[#d85f13]">Grader</span></span>
          </Link>
          <button
            type="button"
            aria-label="ปิดรายการโจทย์"
            onClick={() => setSidebarOpen(false)}
            className="grid h-11 w-11 place-items-center rounded-lg text-[#72685f] hover:bg-[#f6f1eb] lg:hidden"
          >
            <Icon name="close" />
          </button>
          {!sidebarCollapsed && (
            <button
              type="button"
              aria-label="ย่อ sidebar"
              aria-expanded="true"
              onClick={() => setSidebarCollapsed(true)}
              className="hidden h-11 w-11 place-items-center rounded-lg text-[#72685f] transition hover:bg-[#f6f1eb] lg:grid"
            >
              <Icon name="chevron" className="h-5 w-5 rotate-180" />
            </button>
          )}
        </div>

        {sidebarCollapsed && (
          <button
            type="button"
            aria-label="ขยาย sidebar"
            aria-expanded="false"
            onClick={() => setSidebarCollapsed(false)}
            className="mx-auto mt-3 hidden h-11 w-11 place-items-center rounded-xl border border-[#e1d8ce] text-[#72685f] transition hover:border-[#ea721f] hover:text-[#c65412] lg:grid"
          >
            <Icon name="chevron" className="h-5 w-5" />
          </button>
        )}

        <div className={`flex-none p-4 ${sidebarCollapsed ? "lg:hidden" : ""}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="grader-course-label text-xs font-semibold text-[#8a7e74]">คลังโจทย์</p>
              <p className="grader-course-title mt-1 text-lg font-bold text-[#292725]">โจทย์เขียนโปรแกรม</p>
            </div>
            <span className="rounded-full bg-[#fff0df] px-2.5 py-1 text-xs font-bold text-[#c65412]">{solvedProblemCount}/{problems.length}</span>
          </div>
          <div className="grader-progress mt-4 h-1.5 overflow-hidden rounded-full bg-[#eee8e1]">
            <div className="h-full rounded-full bg-[#ea721f]" style={{ width: `${problems.length ? (solvedProblemCount / problems.length) * 100 : 0}%` }} />
          </div>
          <label className="relative mt-4 block">
            <span className="sr-only">ค้นหาโจทย์</span>
            <Icon name="search" className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-[#998e84]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ค้นหาโจทย์หรือหัวข้อ"
              className="h-11 w-full rounded-xl border border-[#e1d8ce] bg-[#faf8f5] pl-10 pr-3 text-sm outline-none placeholder:text-[#a69b91] focus:border-[#ea721f]"
            />
          </label>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
          {filteredProblems.map((problem) => {
            const isProProblem = problem.accessTier === "pro";
            const showProYellowBg = isProProblem && userPlan !== "pro";
            return (
              <button
                key={problem.id}
                type="button"
                onClick={() => {
                  setSelectedProblem(problem.id);
                  setSidebarOpen(false);
                  setRunState("idle");
                }}
                aria-current={selectedProblem === problem.id ? "page" : undefined}
                title={sidebarCollapsed ? problem.title : undefined}
                className={`grader-problem-item ${showProYellowBg ? "grader-pro-problem" : ""} mb-1 flex min-h-[66px] w-full cursor-pointer items-center gap-3 rounded-xl px-3 text-left transition ${sidebarCollapsed ? "lg:min-h-14 lg:justify-center lg:px-0" : ""} ${selectedProblem === problem.id ? "bg-[#fff1e3]" : "hover:bg-[#f7f3ee]"}`}
              >
                <span
                  data-solved={problem.solved}
                  data-active={selectedProblem === problem.id}
                  className={`grader-problem-number grid h-8 w-8 flex-none place-items-center rounded-lg text-xs font-bold ${problem.solved ? "bg-[#dff5e7] text-[#18753c]" : selectedProblem === problem.id ? "bg-white text-[#c65412]" : "bg-[#f1ede8] text-[#7b7067]"}`}
                >
                  {problem.solved ? <Icon name="check" className="h-4 w-4" /> : String(problem.id).padStart(2, "0")}
                </span>
                <span className={`min-w-0 flex-1 ${sidebarCollapsed ? "lg:hidden" : ""}`}>
                  <span className="flex items-center gap-1.5 min-w-0">
                    <span className={`grader-problem-title truncate text-sm font-bold ${selectedProblem === problem.id ? "text-[#c65412]" : "text-[#393531]"}`}>{problem.title}</span>
                    {isProProblem && (
                      <span className="grader-pro-label flex-none text-xs font-extrabold text-[#eab308] uppercase leading-none">
                        PRO
                      </span>
                    )}
                  </span>
                  <span className="grader-problem-meta mt-1 flex items-center gap-2 text-xs text-[#887d73]">
                    {problem.topic}
                    <span aria-hidden="true">·</span>
                    <span className={problem.difficulty === "ยาก" ? "text-[#b83a2f]" : problem.difficulty === "ปานกลาง" ? "text-[#9a6815]" : "text-[#287548]"}>{problem.difficulty}</span>
                    <span className="text-[#607089]">ผ่านแล้ว {problem.passedCount} คน</span>
                  </span>
                </span>
              </button>
            );
          })}
          {filteredProblems.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-[#887d73]">ไม่พบโจทย์ที่ค้นหา</p>
          )}
        </nav>
        <div className="grader-sidebar-footer flex-none border-t border-[#eee6dc] p-3">
          <Link
            href="/ide"
            title={sidebarCollapsed ? "Code Playground" : undefined}
            className={`grader-ide-link flex min-h-12 items-center gap-3 rounded-xl border border-[#e1d8ce] bg-[#faf8f5] px-3 text-sm font-bold text-[#4d4640] transition hover:border-[#ea721f] hover:text-[#c65412] ${sidebarCollapsed ? "lg:justify-center lg:px-0" : ""}`}
          >
            <Icon name="terminal" className="h-5 w-5" />
            <span className={sidebarCollapsed ? "lg:hidden" : ""}>Code Playground</span>
            <Icon name="chevron" className={`ml-auto h-4 w-4 ${sidebarCollapsed ? "lg:hidden" : ""}`} />
          </Link>
        </div>
      </aside>
      <div
        role="separator"
        aria-label="ปรับความกว้าง sidebar"
        aria-orientation="vertical"
        className="grader-resize-handle grader-resize-handle-vertical hidden w-1.5 flex-none cursor-col-resize lg:block"
        onPointerDown={(event) => beginResize(event, "col-resize", (moveEvent) => {
          setSidebarCollapsed(false);
          setSidebarWidth(Math.min(420, Math.max(220, moveEvent.clientX)));
        })}
      />

      <div className="flex min-w-0 flex-1 flex-col">
      <header className="grader-header flex-none border-b border-[#eadfce] bg-white px-3 py-2 sm:px-4">
        <div className="flex min-h-12 flex-wrap items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="เปิดรายการโจทย์"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(true)}
              className="grid h-11 w-11 flex-none place-items-center rounded-xl border border-[#e5dbce] text-[#514a44] hover:border-[#ea721f] lg:hidden"
            >
              <Icon name="menu" />
            </button>
            <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-[#fff0df] text-sm font-bold text-[#d85f13]">
              {String(activeProblem.id).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-medium text-[#766b61]">
                <span className="hidden sm:inline">แบบฝึกหัดพื้นฐาน</span>
                <Icon name="chevron" className="h-3.5 w-3.5" />
                <span className="truncate">{activeProblem.topic}</span>
              </div>
              <h1 className="max-w-[180px] truncate text-base font-bold text-[#292725] sm:max-w-none sm:text-lg">{activeProblem.title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {userPlan === "free" ? (
              <button
                type="button"
                onClick={() => setUpgradeModalOpen(true)}
                className={`grader-theme-toggle flex h-11 cursor-pointer items-center justify-center rounded-xl border px-3.5 text-xs font-bold transition ${
                  darkMode
                    ? "border-[#364152] bg-[#1c2430] text-[#e6ebf2] hover:border-[#ea721f] hover:text-[#f4a46d]"
                    : "border-[#ded6cc] bg-white text-[#514a44] hover:border-[#ea721f] hover:text-[#d85f13]"
                }`}
              >
                <span>อัปเกรดเป็น PRO</span>
              </button>
            ) : (
              <div
                className={`flex h-11 items-center gap-1.5 rounded-xl border px-3 text-xs font-bold ${
                  darkMode
                    ? "border-[#eab308]/30 bg-[#eab308]/10 text-[#facc15]"
                    : "border-[#fde68a] bg-[#fffbeb] text-[#b45309]"
                }`}
                title={planExpiresAt ? `วันหมดอายุสิทธิ์ PRO: ${new Date(planExpiresAt).toLocaleString("th-TH")}` : undefined}
              >
                <span className="font-extrabold text-[#eab308]">PRO</span>
                <span className="text-[11px] font-semibold opacity-90">
                  exp: {formatExpireDate(planExpiresAt)}
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={darkMode ? "เปลี่ยนเป็นโหมดสว่าง" : "เปลี่ยนเป็นโหมดมืด"}
              title={darkMode ? "โหมดสว่าง" : "โหมดมืด"}
              className="grader-theme-toggle grid h-11 w-11 flex-none cursor-pointer place-items-center rounded-xl border border-[#ded6cc] bg-white text-[#514a44] transition hover:border-[#ea721f] hover:text-[#d85f13]"
            >
              <Icon name={darkMode ? "sun" : "moon"} className="h-5 w-5" />
            </button>
            <FontSizeControl value={fontSize} dark={darkMode} onChange={setFontSize} />
            <UserMenu
              username={username}
              email={email}
              returnTo="/grader"
              backendUrl={backendUrl}
              dark={darkMode}
            />
            <button
              type="button"
              onClick={() => evaluate(true)}
              disabled={runState === "running" || activeProblem.locked}
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-[#ea721f] px-4 text-sm font-bold text-white shadow-[0_8px_20px_rgba(234,114,31,.25)] transition hover:bg-[#d85f13] disabled:cursor-wait disabled:opacity-60"
            >
              <Icon name="send" className="h-4 w-4" />
              {activeProblem.locked ? "สำหรับ Pro" : "ส่งคำตอบ"}
            </button>
          </div>
        </div>
      </header>

      <div
        className="grader-main-split grid min-h-0 min-w-0 flex-1 gap-0 overflow-x-hidden overflow-y-auto p-2 lg:overflow-hidden"
        style={{ "--grader-problem-width": `${problemWidth}%` } as React.CSSProperties}
      >
        <section className="grader-problem overflow-hidden rounded-xl border border-[#e5dbce] bg-white shadow-[0_12px_36px_rgba(62,46,30,.06)] lg:min-h-0 lg:overflow-y-auto">
          <div className="flex h-14 items-end border-b border-[#eee6dc] px-5" role="tablist" aria-label="รายละเอียดโจทย์">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "problem"}
              onClick={() => setActiveTab("problem")}
              className={`h-full cursor-pointer border-b-2 px-1 text-sm font-bold transition ${activeTab === "problem" ? "border-[#ea721f] text-[#d85f13]" : "border-transparent text-[#83786e] hover:text-[#35312d]"}`}
            >
              รายละเอียดโจทย์
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "submissions"}
              onClick={() => setActiveTab("submissions")}
              className={`ml-6 h-full cursor-pointer border-b-2 px-1 text-sm font-bold transition ${activeTab === "submissions" ? "border-[#ea721f] text-[#d85f13]" : "border-transparent text-[#83786e] hover:text-[#35312d]"}`}
            >
              การส่งของฉัน
            </button>
          </div>

          {activeTab === "problem" ? (
            <article className="space-y-7 p-5 text-[15px] leading-7 text-[#544d47] sm:p-7">
              {problemsError ? (
                <div role="alert" className="flex min-h-[360px] flex-col items-center justify-center text-center">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#fff0df] text-[#d85f13]" aria-hidden="true">
                    <Icon name="terminal" className="h-7 w-7" />
                  </span>
                  <h2 className="mt-5 text-xl font-bold text-[#292725]">เซิร์ฟเวอร์มีปัญหา</h2>
                  <p className="mt-2 max-w-sm whitespace-pre-line text-sm leading-6 text-[#81766c]">{problemsError}</p>
                  <button type="button" onClick={() => setProblemsReloadKey((current) => current + 1)} className="mt-6 flex min-h-11 cursor-pointer items-center justify-center rounded-xl bg-[#ea721f] px-6 text-sm font-bold text-white shadow-[0_8px_20px_rgba(234,114,31,.25)] transition hover:bg-[#d85f13] active:scale-95">
                    ลองใหม่อีกครั้ง
                  </button>
                </div>
              ) : problemsLoading ? (
                <div role="status" className="flex min-h-[360px] items-center justify-center text-sm font-semibold text-[#81766c]">
                  กำลังเตรียมโจทย์...
                </div>
              ) : activeProblem.locked ? (
                <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#fff0df] text-[#d85f13]" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <h2 className="mt-5 text-xl font-bold text-[#292725]">โจทย์สำหรับสมาชิก Pro</h2>
                  <p className="mt-2 max-w-sm text-sm text-[#81766c]">
                    อัปเกรดเป็น Pro เพื่ออ่านรายละเอียด รันโค้ด และส่งคำตอบ
                  </p>
                  <button
                    type="button"
                    onClick={() => setUpgradeModalOpen(true)}
                    className="mt-6 flex h-11 cursor-pointer items-center justify-center rounded-xl bg-[#ea721f] px-6 text-sm font-bold text-white shadow-[0_8px_20px_rgba(234,114,31,.25)] transition hover:bg-[#d85f13] active:scale-95"
                  >
                    อัปเกรดเป็น PRO
                  </button>
                </div>
              ) : (
                <>
              <div>
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#e9f8ef] px-3 py-1 text-xs font-bold text-[#227a45]">{activeProblem.difficulty}</span>
                  <span className="rounded-full bg-[#f4f1ed] px-3 py-1 text-xs font-semibold text-[#71675f]">{activeProblem.points} คะแนน</span>
                  <span className="rounded-full bg-[#eef2f8] px-3 py-1 text-xs font-semibold text-[#607089]">
                    ผ่านแล้ว {activeProblem.passedCount} คน
                  </span>
                </div>
                <h2 className="text-xl font-bold text-[#292725]">โจทย์</h2>
                <p className="mt-2">{activeProblem.description}</p>
              </div>
              <div>
                <h2 className="font-bold text-[#292725]">ข้อมูลนำเข้า</h2>
                <p className="mt-1">{activeProblem.inputDescription}</p>
              </div>
              <div>
                <h2 className="font-bold text-[#292725]">ข้อมูลส่งออก</h2>
                <p className="mt-1">{activeProblem.outputDescription}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="overflow-hidden rounded-xl border border-[#e7ded4]">
                  <div className="flex items-center justify-between bg-[#f8f5f1] px-4 py-2 text-xs font-bold text-[#71675f]">
                    ตัวอย่างข้อมูลนำเข้า
                    <span className="font-mono font-normal">stdin</span>
                  </div>
                    <pre className="whitespace-pre-wrap px-4 py-3 font-mono text-sm text-[#292725]">{activeProblem.sampleInput}</pre>
                </div>
                <div className="overflow-hidden rounded-xl border border-[#e7ded4]">
                  <div className="flex items-center justify-between bg-[#f8f5f1] px-4 py-2 text-xs font-bold text-[#71675f]">
                    ตัวอย่างผลลัพธ์
                    <span className="font-mono font-normal">stdout</span>
                  </div>
                  <pre className="whitespace-pre-wrap px-4 py-3 font-mono text-sm text-[#292725]">{activeProblem.sampleOutput}</pre>
                </div>
              </div>
                </>
              )}
            </article>
          ) : (
            <div className="p-7">
              {submissions.length > 0 ? (
                <div className="space-y-3">
                  {submissions.map((submission) => (
                    <button key={submission.id} type="button" onClick={() => setSelectedSubmission(submission)}
                      className="w-full rounded-xl border border-[#e8dfd5] p-5 text-left transition hover:border-[#ea721f]">
                      <p className="text-xs font-semibold text-[#81766c]">{new Date(submission.createdAt).toLocaleString("th-TH")}</p>
                      <p className={`mt-2 font-bold ${submission.status === "passed" ? "text-[#18753c]" : "text-[#b83a2f]"}`}>
                        {submission.status === "passed" ? `ผ่านทุก test case · ${submission.score}/100` : "คำตอบยังไม่ถูกต้อง · 0/100"}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-[#c45211]">กดเพื่อดูโค้ด</p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <Icon name="terminal" className="mx-auto h-8 w-8 text-[#b8ada3]" />
                  <p className="mt-3 font-semibold text-[#5e554e]">ยังไม่มีประวัติการส่ง</p>
                  <p className="mt-1 text-sm text-[#8a8077]">กด “ส่งคำตอบ” เมื่อต้องการให้ระบบตรวจ</p>
                </div>
              )}
            </div>
          )}
        </section>

        <div
          role="separator"
          aria-label="ปรับขนาดรายละเอียดโจทย์และ editor"
          aria-orientation="vertical"
          className="grader-resize-handle grader-resize-handle-vertical mx-0.5 hidden cursor-col-resize lg:block"
          onPointerDown={(event) => {
            const container = event.currentTarget.parentElement;
            if (!container) return;
            const bounds = container.getBoundingClientRect();
            beginResize(event, "col-resize", (moveEvent) => {
              const next = ((moveEvent.clientX - bounds.left) / bounds.width) * 100;
              setProblemWidth(Math.min(68, Math.max(24, next)));
            });
          }}
        />

        <section className="grader-code-panel overflow-hidden rounded-xl border shadow-[0_18px_44px_rgba(18,24,34,.12)] lg:min-h-0">
          <div className="grader-code-toolbar flex min-h-14 flex-wrap items-center justify-between gap-3 border-b px-4">
            <div className="grader-code-title flex items-center gap-2 text-sm font-bold">
              <Icon name="terminal" className="h-4 w-4 text-[#f28a42]" />
              {language === "python" ? "main.py" : "main.cpp"}
              <span className="h-2 w-2 rounded-full bg-[#f28a42]" title="มีการแก้ไข" />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="คืนค่าโค้ดเริ่มต้น"
                onClick={() => {
                  if (window.confirm("ต้องการคืนค่าโค้ดเริ่มต้นหรือไม่? โค้ดที่เขียนอยู่จะถูกแทนที่")) {
                    setCode(starterCode);
                    setRunState("idle");
                  }
                }}
                className="grader-code-control grid h-11 w-11 cursor-pointer place-items-center rounded-lg transition"
              >
                <Icon name="reset" className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="ดาวน์โหลดไฟล์โค้ด"
                title={`ดาวน์โหลด ${language === "python" ? "main.py" : "main.cpp"}`}
                onClick={downloadCode}
                className="grader-code-control grid h-11 w-11 cursor-pointer place-items-center rounded-lg transition"
              >
                <Icon name="download" className="h-4 w-4" />
              </button>
              <select
                aria-label="เลือกภาษาโปรแกรม"
                className="grader-code-select h-10 cursor-pointer rounded-lg border px-3 text-sm font-semibold outline-none focus:border-[#f28a42]"
                value={language}
                onChange={(event) => {
                  const nextLanguage = event.target.value as "cpp" | "python";
                  setLanguage(nextLanguage);
                  setCode(nextLanguage === "python" ? pythonStarterCode : starterCode);
                  setCompileError(null);
                  setRunState("idle");
                }}
              >
                <option value="cpp">C++ 17</option>
                <option value="python">Python 3</option>
              </select>
            </div>
          </div>

          <div className="grader-code-surface relative min-h-[430px]">
            <div
              ref={lineNumbersRef}
              aria-hidden="true"
              className="grader-code-font grader-line-numbers pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-12 select-none overflow-hidden border-r px-3 py-5 text-right font-mono leading-6"
            >
              {Array.from({ length: lineCount }, (_, index) => <div key={index}>{index + 1}</div>)}
            </div>
            <pre
              ref={highlightedCodeRef}
              aria-hidden="true"
              className="grader-code-font pointer-events-none absolute inset-0 overflow-hidden whitespace-pre py-5 pl-16 pr-5 font-mono leading-6"
            >
              {highlightCpp(code)}
            </pre>
            <textarea
              value={code}
              onChange={(event) => {
                setCode(event.target.value);
                updateCursor(event.target);
                setRunState("idle");
              }}
              onKeyDown={handleCodeKeyDown}
              onSelect={(event) => updateCursor(event.currentTarget)}
              onScroll={(event) => {
                if (highlightedCodeRef.current) {
                  highlightedCodeRef.current.scrollTop = event.currentTarget.scrollTop;
                  highlightedCodeRef.current.scrollLeft = event.currentTarget.scrollLeft;
                }
                if (lineNumbersRef.current) {
                  lineNumbersRef.current.scrollTop = event.currentTarget.scrollTop;
                }
              }}
              aria-label="พื้นที่เขียนโค้ด"
              spellCheck={false}
              className="grader-code-font absolute inset-0 min-h-[430px] w-full resize-none overflow-auto whitespace-pre bg-transparent py-5 pl-16 pr-5 font-mono leading-6 text-transparent caret-[#f28a42] outline-none selection:bg-[#f28a42]/30"
              style={{ WebkitTextFillColor: "transparent" }}
            />
            {suggestions.length > 0 ? (
              <div
                role="listbox"
                aria-label="คำแนะนำโค้ด"
                className="absolute z-30 w-72 overflow-hidden rounded-lg border border-[#3a4558] bg-[#171d29] py-1 text-sm text-[#dbe2eb] shadow-2xl"
                style={{ left: suggestionPosition.left, top: suggestionPosition.top }}
              >
                {suggestions.map((suggestion, index) => (
                  <button
                    type="button"
                    role="option"
                    aria-selected={index === selectedSuggestion}
                    key={suggestion}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      const prefix = code.slice(0, cursorPosition).match(/[A-Za-z_]+$/)?.[0] ?? "";
                      const inserted = suggestion.slice(prefix.length);
                      setCode(`${code.slice(0, cursorPosition)}${inserted}${code.slice(cursorPosition)}`);
                      setCursorPosition(cursorPosition + inserted.length);
                    }}
                    className={`flex w-full cursor-pointer items-center justify-between px-3 py-1.5 text-left font-mono ${index === selectedSuggestion ? "bg-[#38415d] text-white" : "hover:bg-white/10"}`}
                  >
                    <span>{suggestion}</span>
                    <span className="text-[10px] opacity-50">keyword</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div
            className="grader-console relative border-t"
            style={{ "--grader-console-height": `${consoleHeight}px` } as React.CSSProperties}
          >
            <div
              role="separator"
              aria-label="ปรับความสูง editor และผลการรัน"
              aria-orientation="horizontal"
              className="grader-resize-handle grader-resize-handle-horizontal absolute inset-x-0 top-0 z-20 h-1.5 cursor-row-resize"
              onPointerDown={(event) => {
                const panel = event.currentTarget.closest(".grader-code-panel");
                if (!panel) return;
                const bounds = panel.getBoundingClientRect();
                beginResize(event, "row-resize", (moveEvent) => {
                  setConsoleHeight(Math.min(bounds.height - 180, Math.max(96, bounds.bottom - moveEvent.clientY)));
                });
              }}
            />
            <div className="grader-console-tabs flex h-12 items-center justify-between border-b px-4">
              <div className="flex h-full items-center gap-5">
                <button
                  type="button"
                  onClick={() => setConsoleTab("custom")}
                  className={`h-full cursor-pointer border-b-2 text-xs font-bold transition ${
                    consoleTab === "custom"
                      ? "border-[#ea721f] " + (darkMode ? "text-white" : "text-[#d85f13]")
                      : "border-transparent " + (darkMode ? "text-[#8f9aaa] hover:text-white" : "text-[#746a61] hover:text-[#35312d]")
                  }`}
                >
                  ผลการรัน
                </button>
                <button
                  type="button"
                  onClick={() => setConsoleTab("result")}
                  className={`h-full cursor-pointer border-b-2 text-xs font-bold transition ${
                    consoleTab === "result"
                      ? "border-[#ea721f] " + (darkMode ? "text-white" : "text-[#d85f13]")
                      : "border-transparent " + (darkMode ? "text-[#8f9aaa] hover:text-white" : "text-[#746a61] hover:text-[#35312d]")
                  }`}
                >
                  ผลการตรวจ
                </button>
              </div>
              {consoleTab === "custom" ? (
                <button
                  type="button"
                  onClick={runCustomInput}
                  disabled={runState === "running" || activeProblem.locked}
                  className="group relative inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-[#22c55e] to-[#16a34a] px-4 py-1.5 text-xs font-bold text-white shadow-[0_4px_14px_rgba(34,197,94,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:from-[#47d77d] hover:to-[#15803d] hover:shadow-[0_6px_20px_rgba(34,197,94,0.5)] active:translate-y-0 active:scale-95 disabled:cursor-wait disabled:opacity-50"
                >
                  <Icon name="play" className="h-3.5 w-3.5 fill-white text-white transition-transform duration-200 group-hover:scale-110" />
                  <span className="text-white font-bold">{runState === "running" ? "กำลังรัน..." : "รันโค้ด"}</span>
                </button>
              ) : null}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              {consoleTab === "custom" ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="custom-input" className={`text-xs font-bold ${darkMode ? "text-[#aeb7c4]" : "text-[#4a423a]"}`}>ข้อมูลนำเข้า</label>
                    <textarea
                      id="custom-input"
                      value={customInput}
                      onChange={(event) => setCustomInput(event.target.value)}
                      placeholder="กรอกข้อมูลนำเข้า (ถ้ามี)"
                      className={`grader-console-input mt-2 min-h-20 w-full resize-y rounded-xl border p-3 font-mono text-sm outline-none transition focus:border-[#ea721f] ${
                        darkMode ? "border-[#303947] bg-[#111722] text-[#e9edf3]" : "border-[#ded6cc] bg-white text-[#292725]"
                      }`}
                    />
                  </div>
                  <div className={`rounded-xl border p-3 text-xs ${
                    darkMode ? "border-[#303947] bg-[#111722]" : "border-[#ded6cc] bg-white"
                  }`}>
                    <p className={`font-bold ${darkMode ? "text-[#aeb7c4]" : "text-[#4a423a]"}`}>ผลลัพธ์ (Stdout):</p>
                    <pre className={`mt-1 font-mono whitespace-pre-wrap ${
                      customOutput?.stdout
                        ? (darkMode ? "text-[#76d69a]" : "text-[#15803d]")
                        : (darkMode ? "text-[#748092]" : "text-[#8c827a]")
                    }`}>
                      {customOutput?.stdout ? customOutput.stdout : "(ยังไม่มีผลลัพธ์)"}
                    </pre>
                    {customOutput?.stderr ? (
                      <>
                        <p className={`mt-2 font-bold ${darkMode ? "text-[#f19a91]" : "text-[#b91c1c]"}`}>ข้อผิดพลาด (Stderr):</p>
                        <pre className={`mt-1 font-mono whitespace-pre-wrap ${darkMode ? "text-[#f19a91]" : "text-[#b91c1c]"}`}>{customOutput.stderr}</pre>
                      </>
                    ) : null}
                  </div>
                </div>
              ) : runState === "idle" ? (
                <div className="flex min-h-[155px] flex-col items-center justify-center text-center">
                  <Icon name="send" className={`h-7 w-7 ${darkMode ? "text-[#596676]" : "text-[#9e948a]"}`} />
                  <p className={`mt-3 text-sm font-semibold ${darkMode ? "text-[#aeb7c4]" : "text-[#514a44]"}`}>พร้อมตรวจคำตอบของคุณ</p>
                  <p className={`mt-1 text-xs ${darkMode ? "text-[#748092]" : "text-[#8c827a]"}`}>กด “ส่งคำตอบ” เพื่อดูผลการตรวจ</p>
                </div>
              ) : runState === "running" ? (
                <div className={`flex min-h-[155px] items-center justify-center gap-3 text-sm font-semibold ${darkMode ? "text-[#dbe2eb]" : "text-[#393531]"}`} role="status">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#596676] border-t-[#ea721f]" />
                  กำลังตรวจคำตอบ...
                </div>
              ) : compileError ? (
                <div className={`rounded-xl border p-4 ${
                  darkMode ? "border-[#713c3c] bg-[#2f1e20] text-[#f19a91]" : "border-[#fecaca] bg-[#fef2f2] text-[#b91c1c]"
                }`}>
                  <div className="flex items-center gap-2 font-bold">
                    <Icon name="close" className="h-5 w-5" />
                    <span>เกิดข้อผิดพลาดในการรันโค้ด (Compile / Runtime Error)</span>
                  </div>
                  <pre className={`mt-3 max-h-48 overflow-auto rounded-lg p-3 font-mono text-xs whitespace-pre-wrap ${
                    darkMode ? "bg-[#1a1315] text-[#f8b4ab]" : "bg-white border border-[#fca5a5] text-[#991b1b]"
                  }`}>{compileError}</pre>
                </div>
              ) : (
                <div aria-live="polite">
                  <div className={`flex items-center gap-3 rounded-xl border p-3 ${
                    runState === "passed"
                      ? (darkMode ? "border-[#285f41] bg-[#142b21] text-[#76d69a]" : "border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d]")
                      : (darkMode ? "border-[#713c3c] bg-[#2f1e20] text-[#f19a91]" : "border-[#fecaca] bg-[#fef2f2] text-[#b91c1c]")
                  }`}>
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-current/10">
                      <Icon name={runState === "passed" ? "check" : "close"} className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-bold">
                        {runState === "passed"
                          ? "ผ่านทุก test case"
                          : `คำตอบยังไม่ถูกต้อง (${testResults.filter((t) => t.status === "passed").length} / ${testResults.length || activeProblem?.testCaseCount || 0} ผ่าน)`}
                      </p>
                      <p className="text-xs opacity-80">
                        {runState === "passed"
                          ? "ทำได้ดีมาก! พร้อมส่งคำตอบแล้ว"
                          : "ลองตรวจสอบโค้ดและการคำนวณอีกครั้ง"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {(testResults.length > 0
                      ? testResults
                      : Array.from({ length: activeProblem?.testCaseCount || 0 }, (_, index) => ({
                          id: index + 1,
                          status: runState === "passed" ? ("passed" as const) : ("failed" as const),
                          input: "",
                          expected: "",
                          actual: "",
                        }))
                    ).map((test) => {
                      const isPassed = test.status === "passed";
                      const statusLabel =
                        test.status === "passed"
                          ? "ผ่าน"
                          : test.status === "tle"
                          ? "Time Limit"
                          : test.status === "rte"
                          ? "Runtime Err"
                          : "ไม่ผ่าน";
                      return (
                        <div
                          key={test.id}
                          className={`rounded-lg border px-3 py-2 text-left ${
                            darkMode
                              ? "border-[#303947] bg-[#111722]"
                              : "border-[#ded6cc] bg-white"
                          }`}
                        >
                          <p className={`text-[11px] font-semibold ${
                            darkMode ? "text-[#748092]" : "text-[#746a61]"
                          }`}>TEST {test.id}</p>
                          <p className={`text-xs font-bold ${
                            isPassed
                              ? (darkMode ? "text-[#76d69a]" : "text-[#15803d]")
                              : (darkMode ? "text-[#f19a91]" : "text-[#b91c1c]")
                          }`}>
                            {statusLabel}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
      </div>
      {selectedSubmission ? (
        <div className="fixed inset-0 z-[200] grid place-items-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-label="โค้ดจากประวัติการส่ง">
          <div className={`flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl shadow-2xl ${darkMode ? "bg-[#1a2230] text-[#e9edf3]" : "bg-white text-[#292725]"}`}>
            <div className={`flex items-center justify-between border-b px-5 py-4 ${darkMode ? "border-[#303b4d]" : "border-[#e8dfd5]"}`}>
              <div>
                <h2 className="font-bold">โค้ดจากประวัติการส่ง</h2>
                <p className={`mt-1 text-xs ${darkMode ? "text-[#9aa8bb]" : "text-[#81766c]"}`}>{new Date(selectedSubmission.createdAt).toLocaleString("th-TH")}</p>
              </div>
              <button type="button" onClick={() => setSelectedSubmission(null)} className={`rounded-lg px-3 py-2 text-sm font-bold ${darkMode ? "text-[#b7c2d1] hover:bg-[#273246]" : "text-[#71675f] hover:bg-[#f4f1ed]"}`}>ปิด</button>
            </div>
            <pre className={`grader-code-font min-h-0 flex-1 overflow-auto p-5 text-sm leading-6 ${
              darkMode
                ? "grader-dark bg-[#111722] text-[#e9edf3]"
                : "bg-[#f8fafc] text-[#1e293b] border-y border-[#e2e8f0]"
            }`}>{highlightCpp(selectedSubmission.code)}</pre>
            <div className={`flex justify-end gap-3 border-t px-5 py-4 ${darkMode ? "border-[#303b4d]" : "border-[#e8dfd5]"}`}>
              <button type="button" onClick={() => setSelectedSubmission(null)} className={`rounded-xl border px-4 py-2 text-sm font-bold ${darkMode ? "border-[#45536a] text-[#b7c2d1]" : "border-[#ded6cc] text-[#71675f]"}`}>ปิด</button>
              <button type="button" onClick={() => { loadSubmissionCode(selectedSubmission); setSelectedSubmission(null); }} className="rounded-xl bg-[#ea721f] px-4 py-2 text-sm font-bold text-white">ใช้โค้ดนี้</button>
            </div>
          </div>
        </div>
      ) : null}
      {upgradeModalOpen ? (
        <div className="fixed inset-0 z-[200] grid place-items-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto" role="dialog" aria-modal="true" aria-label="อัปเกรดสมาชิก PRO">
          <div className={`relative w-full max-w-md overflow-hidden rounded-2xl p-6 shadow-2xl transition-all ${
            darkMode ? "bg-[#182232] text-white border border-[#2d3a4e]" : "bg-white text-[#292725] border border-[#e8dfd5]"
          }`}>
            <button
              type="button"
              onClick={() => setUpgradeModalOpen(false)}
              className={`absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition cursor-pointer z-10 ${
                darkMode ? "bg-[#253246] text-[#9aa8bb] hover:bg-[#32435d] hover:text-white" : "bg-[#f4f1ed] text-[#71675f] hover:bg-[#e8dfd5] hover:text-black"
              }`}
              aria-label="ปิด"
            >
              ✕
            </button>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#ea721f]/10 text-[#ea721f]">
                <Icon name="lightbulb" className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-xl font-extrabold">อัปเกรดเป็น BeyondLab PRO</h2>
              <p className={`mt-1 text-xs ${darkMode ? "text-[#9aa8bb]" : "text-[#71675f]"}`}>
                ปลดล็อกโจทย์โปรแกรมมิ่งทุกระดับชั้น เรียนรู้อย่างไร้ขีดจำกัด
              </p>
            </div>

            {/* Pricing Info & Slip Upload */}
            <div className={`mt-4 rounded-xl border p-3.5 text-center transition-all ${
              darkMode ? "border-[#2e3c50] bg-[#111722]" : "border-[#ded6cc] bg-[#faf8f5]"
            }`}>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-2xl font-black text-[#ea721f]">99.-</span>
                <span className={`text-xs font-semibold ${darkMode ? "text-[#9aa8bb]" : "text-[#71675f]"}`}>/ 30 วัน</span>
              </div>
              <p className={`mt-1 text-[11px] font-medium ${darkMode ? "text-[#7c8b9e]" : "text-[#8a7e74]"}`}>
                ชำระเงินผ่าน QR Code / PromptPay
              </p>

              <button
                type="button"
                onClick={() => {
                  if (!showSlipForm) {
                    setShowStudentForm(false);
                  }
                  setShowSlipForm(!showSlipForm);
                }}
                className="mt-2.5 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#ea721f] px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-[#d66113] cursor-pointer"
              >
                <Icon name="upload" className="h-3.5 w-3.5" />
                {showSlipForm ? "ซ่อนช่องอัปโหลดสลิป" : "อัปโหลดสลิปชำระเงิน"}
              </button>

              {showSlipForm && (
                <form onSubmit={handleUploadSlip} className="mt-3 border-t border-current/15 pt-3 text-left">
                  <div className={`mb-3 rounded-xl border p-3 text-center ${
                    darkMode ? "border-[#2e3c50] bg-[#17202d]" : "border-[#e2d9cd] bg-white"
                  }`}>
                    <p className="text-xs font-extrabold text-[#ea721f]">สแกน QR Code ชำระเงิน 99.- บาท</p>
                    <div className="my-2.5 flex justify-center">
                      <img
                        src="https://promptpay.io/0987824363/99.png"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020101021129370016A000000677010111011300669878243635802TH53037645402995408TH";
                        }}
                        alt="PromptPay QR Code 99 THB"
                        className="h-36 w-36 rounded-xl border border-current/10 bg-white p-1.5 shadow-sm"
                      />
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <p className={`text-[11px] font-bold ${darkMode ? "text-white" : "text-[#292725]"}`}>
                        พร้อมเพย์: <span className="font-mono text-[#ea721f]">098-782-4363</span>
                      </p>
                      <button
                        type="button"
                        onClick={handleCopyPromptPay}
                        className="rounded-md bg-[#ea721f]/15 px-2 py-0.5 text-[10px] font-extrabold text-[#ea721f] hover:bg-[#ea721f]/25 cursor-pointer"
                      >
                        {copiedPromptPay ? "คัดลอกแล้ว! ✓" : "คัดลอกเบอร์"}
                      </button>
                    </div>
                    <p className={`mt-1 text-[10px] ${darkMode ? "text-[#7c8b9e]" : "text-[#8a7e74]"}`}>
                      ระบบจะตรวจสอบสลิปอัตโนมัติ
                    </p>
                  </div>

                  <label className={`block text-[11px] font-semibold ${darkMode ? "text-[#9aa8bb]" : "text-[#71675f]"}`}>
                    แนบไฟล์สลิปการโอนเงิน (JPG, PNG)
                  </label>

                  <div className="mt-1.5">
                    {slipPreview ? (
                      <div className="relative overflow-hidden rounded-xl border border-[#ea721f]/40 p-2 text-center">
                        <img src={slipPreview} alt="Slip preview" className="mx-auto max-h-36 rounded-lg object-contain" />
                        <div className="mt-2 flex items-center justify-center gap-3">
                          <label className="cursor-pointer text-[11px] font-bold text-[#ea721f] underline hover:opacity-80">
                            เปลี่ยนรูป
                            <input type="file" accept="image/*" onChange={handleSlipFileChange} className="hidden" />
                          </label>
                          <button
                            type="button"
                            onClick={() => setSlipPreview(null)}
                            className="cursor-pointer text-[11px] font-bold text-[#ef4444] underline hover:opacity-80"
                          >
                            ลบรูป
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed py-2.5 px-3 text-center transition hover:border-[#ea721f] ${
                        darkMode ? "border-[#303d52] bg-[#17202d]" : "border-[#dcd3c7] bg-white"
                      }`}>
                        <Icon name="upload" className="h-4 w-4 text-[#ea721f]" />
                        <span className="mt-1 text-[11px] font-bold">คลิกหรือลากไฟล์สลิปมาวางที่นี่</span>
                        <span className={`mt-0.5 text-[9.5px] ${darkMode ? "text-[#7c8b9e]" : "text-[#8a7e74]"}`}>
                          รองรับไฟล์ภาพ JPG, PNG (ไม่เกิน 5 MB)
                        </span>
                        <input type="file" accept="image/*" onChange={handleSlipFileChange} className="hidden" />
                      </label>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={uploadingSlip || !slipPreview}
                    className="mt-3 h-9 w-full cursor-pointer rounded-xl bg-[#ea721f] text-xs font-bold text-white transition hover:bg-[#d66113] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {uploadingSlip ? "กำลังส่งสลิป..." : "ยืนยันส่งสลิปชำระเงิน"}
                  </button>

                  {slipError && <p className="mt-1.5 text-center text-[11px] font-semibold text-[#ef4444]">{slipError}</p>}
                  {slipSuccess && <p className="mt-1.5 text-center text-[11px] font-semibold text-[#22c55e]">{slipSuccess}</p>}
                </form>
              )}
            </div>

            {/* Zero to Code Student Promotion */}
            <div className={`mt-3 rounded-xl border p-3.5 transition-colors ${
              darkMode
                ? "border-[#22c55e]/30 bg-[#22c55e]/10 text-[#4ade80]"
                : "border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d]"
            }`}>
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold">
                  นักเรียน Zero to Code รับฟรี 6 เดือน
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (!showStudentForm) {
                      setShowSlipForm(false);
                    }
                    setShowStudentForm(!showStudentForm);
                  }}
                  className="text-xs font-extrabold underline cursor-pointer hover:opacity-80"
                >
                  {showStudentForm ? "ซ่อน" : "ยืนยันรับสิทธิ์ PRO"}
                </button>
              </div>

              {showStudentForm && (
                <form onSubmit={handleRequestStudentCode} className="mt-3 space-y-2.5 border-t border-current/20 pt-3 text-left">
                  <div className="rounded-lg bg-black/10 p-2.5 text-[11px] font-medium leading-relaxed">
                    <p className="font-bold">ขั้นตอนการรับสิทธิ์:</p>
                    <p className="mt-0.5">
                      1. หากยังไม่ได้ทำแบบประเมินคอร์ส{" "}
                      <a
                        href={process.env.NEXT_PUBLIC_STUDENT_FORM_URL ?? "https://forms.gle/ugWPdQQ9LrWYxe9w7"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold underline hover:opacity-80"
                      >
                        กรอกแบบประเมินคอร์ส (Feedback Form) ที่นี่
                      </a>
                    </p>
                    <p className="mt-0.5">2. กรอกอีเมลและชื่อ-นามสกุลจริงล่างนี้เพื่อยืนยันรับสิทธิ์</p>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold opacity-90">
                      อีเมลที่กรอกในแบบประเมิน
                    </label>
                    <input
                      type="email"
                      value={studentEmail}
                      onChange={(event) => {
                        setStudentEmail(event.target.value);
                        setStudentFormError("");
                      }}
                      placeholder="name@example.com"
                      required
                      className={`mt-1 h-9 w-full rounded-lg border px-3 text-xs outline-none transition focus:border-[#ea721f] ${
                        darkMode
                          ? "border-[#2e3c50] bg-[#111722] text-white placeholder:text-[#556477]"
                          : "border-[#ded6cc] bg-white text-[#292725] placeholder:text-[#a3978c]"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold opacity-90">
                      ชื่อ-นามสกุลจริง (ไม่ต้องใส่คำนำหน้า นาย/นาง/นางสาว)
                    </label>
                    <input
                      type="text"
                      value={studentFullName}
                      onChange={(event) => {
                        setStudentFullName(event.target.value);
                        setStudentFormError("");
                      }}
                      placeholder="สมชาย ใจดี"
                      required
                      className={`mt-1 h-9 w-full rounded-lg border px-3 text-xs outline-none transition focus:border-[#ea721f] ${
                        darkMode
                          ? "border-[#2e3c50] bg-[#111722] text-white placeholder:text-[#556477]"
                          : "border-[#ded6cc] bg-white text-[#292725] placeholder:text-[#a3978c]"
                      }`}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={requestingStudentCode || !studentEmail.trim() || !studentFullName.trim()}
                    className="h-9 w-full cursor-pointer rounded-lg bg-[#22c55e] text-xs font-bold text-white transition hover:bg-[#16a34a] disabled:opacity-50"
                  >
                    {requestingStudentCode ? "กำลังยืนยันสิทธิ์..." : "ยืนยันรับสิทธิ์ PRO ฟรี 6 เดือน"}
                  </button>
                  {studentFormError && <p className="text-[11px] font-semibold text-[#ef4444]">{studentFormError}</p>}
                  {studentFormSuccess && <p className="text-[11px] font-semibold text-[#22c55e]">{studentFormSuccess}</p>}
                </form>
              )}
            </div>



            {/* Modal close handles via top-right close button */}
          </div>
        </div>
      ) : null}
    </div>
  );
}
