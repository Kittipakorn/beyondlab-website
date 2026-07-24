"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { highlightCode } from "../grader/GraderWorkspace";
import { FontSizeControl } from "../components/beyondlab/EditorControls";
import { UserMenu } from "../components/beyondlab/ProtectedToolBar";
import { getTextareaCaretPosition } from "../components/beyondlab/editorCaret";

const templates = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    cout << "Hello, BeyondLab!";
}`,
  python: `print("Hello, BeyondLab!")`,
};

type Language = keyof typeof templates;
const completionWords: Record<Language, string[]> = {
  cpp: ["cout", "cin", "endl", "return", "int", "string", "vector", "for", "while", "if", "else", "include", "using", "namespace"],
  python: ["print", "input", "return", "def", "for", "while", "if", "elif", "else", "import", "range", "len", "int", "str"],
};
function Glyph({ name }: { name: "back" | "play" | "reset" | "moon" | "sun" | "terminal" | "download" }) {
  const paths = {
    back: <><path d="m15 18-6-6 6-6" /><path d="M9 12h10" /></>,
    play: <path d="m8 5 11 7-11 7V5Z" />,
    reset: <><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v6h6" /></>,
    moon: <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4" /></>,
    terminal: <><path d="m7 8 4 4-4 4" /><path d="M13 16h4" /></>,
    download: <><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-5 w-5">{paths[name]}</svg>;
}

type ScratchpadIdeProps = {
  username: string;
  email: string;
  backendUrl: string;
};

export function ScratchpadIde({ username, email, backendUrl }: ScratchpadIdeProps) {
  const [language, setLanguage] = useState<Language>("cpp");
  const [code, setCode] = useState(templates.cpp);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("กด “รันโค้ด” เพื่อดูผลลัพธ์");
  const [running, setRunning] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [editorWidth, setEditorWidth] = useState(70);
  const [inputHeight, setInputHeight] = useState(50);
  const [fontSize, setFontSize] = useState(14);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const [suggestionPosition, setSuggestionPosition] = useState({ left: 64, top: 48 });
  const highlightedCodeRef = useRef<HTMLPreElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const lines = useMemo(() => code.split("\n").length, [code]);
  const suggestions = useMemo(() => {
    const prefix = code.slice(0, cursorPosition).match(/[A-Za-z_.]+$/)?.[0] ?? "";
    if (prefix.length < 2) return [];
    return completionWords[language]
      .filter((word) => word.startsWith(prefix) && word !== prefix)
      .slice(0, 5);
  }, [code, cursorPosition, language]);

  useEffect(() => setSelectedSuggestion(0), [code, cursorPosition, language]);

  function updateCursor(textarea: HTMLTextAreaElement) {
    const position = textarea.selectionStart;
    const caret = getTextareaCaretPosition(textarea, position);
    setCursorPosition(position);
    setSuggestionPosition({
      left: Math.max(56, Math.min(caret.left, textarea.clientWidth - 300)),
      top: Math.max(8, Math.min(caret.top + caret.lineHeight, textarea.clientHeight - 190)),
    });
  }

  useEffect(() => {
    const saved = window.localStorage.getItem("beyondlab-grader-theme");
    setDarkMode(saved ? saved === "dark" : true);
  }, []);

  useEffect(() => {
    document.body.classList.add("scratch-page-active");
    return () => document.body.classList.remove("scratch-page-active");
  }, []);

  function changeLanguage(next: Language) {
    setLanguage(next);
    setCode(templates[next]);
    setOutput("กด “รันโค้ด” เพื่อดูผลลัพธ์");
  }

  function handleCodeKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    const textarea = event.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
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
      const prefix = code.slice(0, start).match(/[A-Za-z_.]+$/)?.[0] ?? "";
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
    const opensBlock =
      /{\s*$/.test(beforeCursor) ||
      (language === "python" && /:\s*$/.test(beforeCursor));
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

  async function runCode() {
    setRunning(true);
    setOutput("กำลังรัน...");
    try {
      const response = await fetch("/api/proxy/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          code,
          input,
          // IDE is a standalone playground: return stdout/stderr without grader tests.
          isCustom: true,
          submit: false,
          problemId: 1,
        }),
      });
      const result = (await response.json()) as {
        status?: string;
        stdout?: string;
        stderr?: string;
        error?: string;
      };
      const compilerOutput = [result.stdout, result.stderr]
        .filter(Boolean)
        .join("\n");
      setOutput(
        result.error ??
          (compilerOutput || "โปรแกรมทำงานสำเร็จ (ไม่มี output)"),
      );
    } catch {
      setOutput("Error: ไม่สามารถเชื่อมต่อ compiler ได้");
    } finally {
      setRunning(false);
    }
  }

  function toggleTheme() {
    setDarkMode((current) => {
      window.localStorage.setItem("beyondlab-grader-theme", current ? "light" : "dark");
      return !current;
    });
  }

  function downloadCode() {
    const extension = language === "cpp" ? "cpp" : language === "python" ? "py" : "js";
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `beyondlab-playground.${extension}`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function beginResize(
    event: React.PointerEvent,
    cursor: "col-resize" | "row-resize",
    onMove: (moveEvent: PointerEvent) => void,
  ) {
    event.preventDefault();
    const oldCursor = document.body.style.cursor;
    const oldSelection = document.body.style.userSelect;
    document.body.style.cursor = cursor;
    document.body.style.userSelect = "none";
    const stop = () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", stop);
      document.body.style.cursor = oldCursor;
      document.body.style.userSelect = oldSelection;
    };
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", stop, { once: true });
  }

  return (
    <div
      className={`scratch-workspace fixed inset-0 z-[100] flex h-dvh flex-col transition-colors ${darkMode ? "scratch-dark bg-[#0c111b] text-white" : "bg-[#f4f0ea] text-[#292725]"}`}
      style={{
        "--scratch-font-size": `${fontSize}px`,
      } as React.CSSProperties}
    >
      <header className={`flex min-h-16 flex-none flex-wrap items-center justify-between gap-3 border-b px-3 py-2 sm:px-5 ${darkMode ? "border-[#2b3442] bg-[#151b25]" : "border-[#e2d8cc] bg-white"}`}>
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/grader" aria-label="กลับไปหน้า Grader" className={`grid h-11 w-11 place-items-center rounded-xl border transition ${darkMode ? "border-[#364152] hover:bg-[#222b38]" : "border-[#ded5ca] hover:bg-[#f7f2ec]"}`}>
            <Glyph name="back" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#ea721f]"><Glyph name="terminal" /> PLAYGROUND</div>
            <h1 className="truncate text-base font-bold sm:text-lg">Code Playground</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={toggleTheme} aria-label={darkMode ? "เปลี่ยนเป็นโหมดสว่าง" : "เปลี่ยนเป็นโหมดมืด"} className={`grid h-11 w-11 place-items-center rounded-xl border ${darkMode ? "border-[#364152] hover:bg-[#222b38]" : "border-[#ded5ca] bg-white hover:border-[#ea721f]"}`}>
            <Glyph name={darkMode ? "sun" : "moon"} />
          </button>
          <FontSizeControl value={fontSize} dark={darkMode} onChange={setFontSize} />
          <UserMenu
            username={username}
            email={email}
            returnTo="/ide"
            backendUrl={backendUrl}
            dark={darkMode}
          />
          <select value={language} onChange={(event) => changeLanguage(event.target.value as Language)} aria-label="เลือกภาษาโปรแกรม" className={`h-11 rounded-xl border px-3 text-sm font-bold outline-none focus:border-[#ea721f] ${darkMode ? "border-[#364152] bg-[#202936]" : "border-[#ded5ca] bg-white"}`}>
            <option value="cpp">C++ 17</option>
            <option value="python">Python 3</option>
          </select>
          <button type="button" onClick={() => { if (window.confirm("ต้องการคืนค่าโค้ดเริ่มต้นหรือไม่? โค้ดที่เขียนอยู่จะถูกแทนที่")) setCode(templates[language]); }} aria-label="คืนค่าโค้ดเริ่มต้น" className={`grid h-11 w-11 place-items-center rounded-xl border ${darkMode ? "border-[#364152] hover:bg-[#222b38]" : "border-[#ded5ca] bg-white hover:border-[#ea721f]"}`}>
            <Glyph name="reset" />
          </button>
          <button type="button" onClick={downloadCode} aria-label="ดาวน์โหลดไฟล์โค้ด" title="ดาวน์โหลดไฟล์โค้ด" className={`grid h-11 w-11 place-items-center rounded-xl border ${darkMode ? "border-[#364152] hover:bg-[#222b38]" : "border-[#ded5ca] bg-white hover:border-[#ea721f]"}`}>
            <Glyph name="download" />
          </button>
          <button type="button" onClick={runCode} disabled={running} className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#ea721f] px-4 text-sm font-bold text-white transition hover:bg-[#d85f13] disabled:cursor-wait disabled:opacity-60">
            <Glyph name="play" /> <span className="hidden sm:inline">รันโค้ด</span>
          </button>
        </div>
      </header>

      <main
        className="scratch-main-split grid min-h-0 flex-1 gap-0 p-2"
        style={{ "--scratch-editor-width": `${editorWidth}%` } as React.CSSProperties}
      >
        <section className={`scratch-editor relative min-h-[420px] overflow-hidden rounded-xl border ${darkMode ? "border-[#2d3442] bg-[#111722]" : "border-[#ded5ca] bg-[#fffdf9]"}`} aria-label="Code editor">
          <div ref={lineNumbersRef} aria-hidden="true" className={`scratch-code-font absolute inset-y-0 left-0 w-12 select-none overflow-hidden border-r px-3 py-5 text-right leading-6 ${darkMode ? "border-[#242c38] bg-[#111722] text-[#627084]" : "border-[#e2d9cf] bg-[#f6f2ed] text-[#9b9086]"}`}>
            {Array.from({ length: lines }, (_, index) => <div key={index}>{index + 1}</div>)}
          </div>
          <pre ref={highlightedCodeRef} aria-hidden="true" className="scratch-code-font pointer-events-none absolute inset-0 overflow-hidden whitespace-pre py-5 pl-16 pr-5 leading-6">{highlightCode(code, language)}</pre>
          <textarea
            value={code}
            onChange={(event) => {
              setCode(event.target.value);
              updateCursor(event.target);
            }}
            onKeyDown={handleCodeKeyDown}
            onSelect={(event) => updateCursor(event.currentTarget)}
            onScroll={(event) => {
              if (highlightedCodeRef.current) {
                highlightedCodeRef.current.scrollTop = event.currentTarget.scrollTop;
                highlightedCodeRef.current.scrollLeft = event.currentTarget.scrollLeft;
              }
              if (lineNumbersRef.current) lineNumbersRef.current.scrollTop = event.currentTarget.scrollTop;
            }}
            aria-label="พื้นที่เขียนโค้ด"
            spellCheck={false}
            className="scratch-code-font absolute inset-0 h-full w-full resize-none overflow-auto whitespace-pre bg-transparent py-5 pl-16 pr-5 leading-6 text-transparent caret-[#f28a42] outline-none selection:bg-[#f28a42]/30"
            style={{ WebkitTextFillColor: "transparent" }}
          />
          {suggestions.length > 0 ? (
            <div
              role="listbox"
              aria-label="คำแนะนำโค้ด"
              className={`absolute z-30 w-72 overflow-hidden rounded-lg border py-1 text-sm shadow-2xl ${darkMode ? "border-[#3a4558] bg-[#171d29] text-[#dbe2eb]" : "border-[#d7cec3] bg-white text-[#39332e]"}`}
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
                    const prefix = code.slice(0, cursorPosition).match(/[A-Za-z_.]+$/)?.[0] ?? "";
                    const inserted = suggestion.slice(prefix.length);
                    setCode(`${code.slice(0, cursorPosition)}${inserted}${code.slice(cursorPosition)}`);
                    setCursorPosition(cursorPosition + inserted.length);
                  }}
                  className={`flex w-full cursor-pointer items-center justify-between px-3 py-1.5 text-left font-mono ${index === selectedSuggestion ? "bg-[#38415d] text-white" : "hover:bg-black/10"}`}
                >
                  <span>{suggestion}</span>
                  <span className="text-[10px] opacity-50">keyword</span>
                </button>
              ))}
            </div>
          ) : null}
        </section>

        <div
          role="separator"
          aria-label="ปรับขนาด editor และแผง input output"
          aria-orientation="vertical"
          className="grader-resize-handle grader-resize-handle-vertical mx-0.5 hidden cursor-col-resize lg:block"
          onPointerDown={(event) => {
            const container = event.currentTarget.parentElement;
            if (!container) return;
            const bounds = container.getBoundingClientRect();
            beginResize(event, "col-resize", (moveEvent) => {
              const next = ((moveEvent.clientX - bounds.left) / bounds.width) * 100;
              setEditorWidth(Math.min(80, Math.max(40, next)));
            });
          }}
        />

        <aside
          className={`scratch-io-split grid min-h-0 gap-0 ${darkMode ? "text-[#dbe2eb]" : "text-[#39332e]"}`}
          style={{ "--scratch-input-height": `${inputHeight}%` } as React.CSSProperties}
        >
          <section className={`flex min-h-[180px] flex-col overflow-hidden rounded-xl border ${darkMode ? "border-[#2d3442] bg-[#151b25]" : "border-[#e2d8cc] bg-white"}`}>
            <label htmlFor="scratch-input" className="border-b border-inherit px-4 py-3 text-sm font-bold">ข้อมูลนำเข้า <span className="ml-1 text-xs font-normal opacity-60">stdin</span></label>
            <textarea id="scratch-input" value={input} onChange={(event) => setInput(event.target.value)} placeholder="ใส่ input ที่ต้องการทดสอบ..." className={`scratch-code-font min-h-0 flex-1 resize-none p-4 outline-none ${darkMode ? "bg-[#111722] text-white placeholder:text-[#657183]" : "bg-[#faf8f5] placeholder:text-[#9c9187]"}`} />
          </section>
          <div
            role="separator"
            aria-label="ปรับขนาดข้อมูลนำเข้าและผลลัพธ์"
            aria-orientation="horizontal"
            className="grader-resize-handle grader-resize-handle-horizontal my-0.5 hidden cursor-row-resize lg:block"
            onPointerDown={(event) => {
              const container = event.currentTarget.parentElement;
              if (!container) return;
              const bounds = container.getBoundingClientRect();
              beginResize(event, "row-resize", (moveEvent) => {
                const next = ((moveEvent.clientY - bounds.top) / bounds.height) * 100;
                setInputHeight(Math.min(75, Math.max(25, next)));
              });
            }}
          />
          <section className={`flex min-h-[180px] flex-col overflow-hidden rounded-xl border ${darkMode ? "border-[#2d3442] bg-[#151b25]" : "border-[#e2d8cc] bg-white"}`}>
            <div className="border-b border-inherit px-4 py-3 text-sm font-bold">ผลลัพธ์ <span className="ml-1 text-xs font-normal opacity-60">stdout</span></div>
            <pre aria-live="polite" className={`scratch-code-font min-h-0 flex-1 overflow-auto whitespace-pre-wrap p-4 ${output.startsWith("Error:") ? "text-[#f19a91]" : darkMode ? "text-[#a9dfb8]" : "text-[#18753c]"}`}>{output}</pre>
          </section>
        </aside>
      </main>
    </div>
  );
}
