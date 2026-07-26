"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CourseLesson, R2Course } from "@/lib/r2Course";

type LearningWorkspaceProps = {
  course: R2Course;
  studentName: string;
  studentEmail: string;
};

function PlayIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="m9 7 8 5-8 5V7Z" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

function CheckIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="m5 12 4.5 4.5L19 7" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
      <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 20h14" />
    </svg>
  );
}

export function LearningWorkspace({ course, studentName, studentEmail }: LearningWorkspaceProps) {
  const lessons = useMemo(
    () => course.modules.flatMap((module) => module.lessons),
    [course.modules],
  );
  const [selectedLessonId, setSelectedLessonId] = useState(lessons[0]?.id ?? "");
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState("");
  const [videoRequestVersion, setVideoRequestVersion] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoShellRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const resumeTimeRef = useRef(0);
  const resumePlaybackRef = useRef(false);
  const consecutivePlaybackErrorsRef = useRef(0);
  const storageKey = `beyondlab-course-progress:${course.id}`;

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      const parsed = saved ? JSON.parse(saved) : [];
      if (Array.isArray(parsed)) {
        setCompletedLessonIds(parsed.filter((value): value is string => typeof value === "string"));
      }
    } catch {
      // The lesson player remains usable when storage is unavailable or corrupted.
    }
  }, [storageKey]);

  const selectedLesson =
    lessons.find((lesson) => lesson.id === selectedLessonId) ?? lessons[0];
  const activeLessonId = selectedLesson?.id ?? "";

  useEffect(() => {
    if (!activeLessonId) return;

    const controller = new AbortController();
    setVideoLoading(true);
    setVideoError("");

    fetch(`/api/proxy/videos/${encodeURIComponent(activeLessonId)}`, {
      credentials: "include",
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = (await response.json().catch(() => null)) as
          | { url?: unknown; message?: unknown }
          | null;

        if (!response.ok || typeof data?.url !== "string") {
          const message =
            typeof data?.message === "string"
              ? data.message
              : "ไม่สามารถขอสิทธิ์ดูวิดีโอได้";
          throw new Error(message);
        }

        return data.url;
      })
      .then((url) => {
        if (!controller.signal.aborted) setVideoUrl(url);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setVideoUrl("");
        setVideoError(
          error instanceof Error
            ? error.message
            : "ไม่สามารถโหลดวิดีโอได้ กรุณาลองใหม่",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setVideoLoading(false);
      });

    return () => controller.abort();
  }, [activeLessonId, videoRequestVersion]);
  const completedSet = new Set(completedLessonIds);
  const progress = lessons.length
    ? Math.round((completedLessonIds.filter((id) => lessons.some((lesson) => lesson.id === id)).length / lessons.length) * 100)
    : 0;

  function selectLesson(lesson: CourseLesson) {
    resumeTimeRef.current = 0;
    resumePlaybackRef.current = false;
    consecutivePlaybackErrorsRef.current = 0;
    setSelectedLessonId(lesson.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function requestFreshVideoUrl() {
    setVideoRequestVersion((version) => version + 1);
  }

  function handleVideoError() {
    const video = videoRef.current;
    if (video) {
      resumeTimeRef.current = Number.isFinite(video.currentTime)
        ? video.currentTime
        : 0;
      resumePlaybackRef.current = !video.paused;
    }

    consecutivePlaybackErrorsRef.current += 1;
    if (consecutivePlaybackErrorsRef.current <= 1) {
      requestFreshVideoUrl();
      return;
    }

    setVideoError("วิดีโอหยุดทำงาน กรุณากดโหลดใหม่อีกครั้ง");
  }

  function handleVideoReady() {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = playbackRate;
    if (resumeTimeRef.current <= 0) return;

    video.currentTime = resumeTimeRef.current;
    resumeTimeRef.current = 0;
    if (resumePlaybackRef.current) {
      resumePlaybackRef.current = false;
      void video.play().catch(() => undefined);
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === videoShellRef.current);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  async function toggleFullscreen() {
    if (!videoShellRef.current) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    await videoShellRef.current.requestFullscreen();
  }

  function toggleCompleted() {
    if (!selectedLesson) return;
    setCompletedLessonIds((current) => {
      const next = current.includes(selectedLesson.id)
        ? current.filter((id) => id !== selectedLesson.id)
        : [...current, selectedLesson.id];
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // Progress still works for the current session if local storage is blocked.
      }
      return next;
    });
  }

  if (!selectedLesson) {
    return (
      <section className="mx-auto grid min-h-[65dvh] max-w-7xl place-items-center px-5 py-16 sm:px-8">
        <div className="rounded-[28px] border border-[#eadfce] bg-white p-8 text-center shadow-[0_18px_50px_rgba(62,46,30,.08)]">
          <h1 className="text-2xl font-bold text-[#292725]">ยังไม่มีบทเรียนในคอร์สนี้</h1>
          <p className="mt-2 text-base leading-7 text-[#71675f]">คอร์สนี้ยังไม่มีบทเรียน กรุณากลับมาใหม่อีกครั้งในภายหลัง</p>
        </div>
      </section>
    );
  }

  const selectedIsComplete = completedSet.has(selectedLesson.id);

  return (
    <section className="bg-[#f7f3ed] px-5 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <Link href="/learn" className="mb-5 inline-flex min-h-11 items-center gap-2 rounded-xl px-1 text-sm font-bold text-[#655d56] transition hover:text-[#c65018] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ea721f] focus-visible:ring-offset-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true"><path d="M19 12H5m5 5-5-5 5-5" /></svg>
          คอร์สของฉัน
        </Link>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c65018]">BeyondLab Classroom</p>
            <h1 className="mt-2 text-3xl font-bold leading-tight text-[#292725] sm:text-4xl">{course.title}</h1>
            {course.description ? <p className="mt-3 max-w-3xl text-base leading-7 text-[#6e645d]">{course.description}</p> : null}
            {course.instructor ? <p className="mt-2 text-sm font-semibold text-[#514942]">ผู้สอน {course.instructor}</p> : null}
          </div>
          <div className="w-full rounded-2xl border border-[#eadfce] bg-white p-4 shadow-[0_10px_30px_rgba(62,46,30,.06)] lg:max-w-xs">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-[#3f3934]">ความคืบหน้าบนอุปกรณ์นี้</span>
              <span className="font-bold tabular-nums text-[#c65018]">{progress}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#ede2d7]" role="progressbar" aria-label="ความคืบหน้าของคอร์ส" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
              <div className="h-full rounded-full bg-[#ea721f] transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="min-w-0 overflow-hidden rounded-[28px] border border-[#ded2c6] bg-white shadow-[0_18px_55px_rgba(62,46,30,.10)]">
            <div ref={videoShellRef} className="relative aspect-video w-full bg-[#171513] fullscreen:h-screen fullscreen:w-screen fullscreen:aspect-auto">
              {videoUrl ? (
                <video
                  ref={videoRef}
                  key={videoUrl}
                  src={videoUrl}
                  crossOrigin="anonymous"
                  controls
                  controlsList="nodownload nofullscreen"
                  disablePictureInPicture
                  playsInline
                  preload="metadata"
                  onContextMenu={(event) => event.preventDefault()}
                  onError={handleVideoError}
                  onLoadedMetadata={handleVideoReady}
                  onRateChange={(event) => {
                    setPlaybackRate(event.currentTarget.playbackRate);
                  }}
                  onPlaying={() => {
                    consecutivePlaybackErrorsRef.current = 0;
                  }}
                  className="learn-video h-full w-full"
                  aria-label={`วิดีโอบทเรียน ${selectedLesson.title}`}
                >
                  เบราว์เซอร์นี้ไม่รองรับการเล่นวิดีโอ
                </video>
              ) : null}
              {videoUrl ? (
                <div
                  className="pointer-events-none absolute inset-0 z-10 flex select-none items-center justify-center overflow-hidden"
                  aria-hidden="true"
                >
                  <div className="rotate-[-22deg] whitespace-nowrap text-sm font-bold tracking-[0.14em] text-white/[0.10] sm:text-lg">
                    BeyondLab · {studentName} · {studentEmail}
                  </div>
                </div>
              ) : null}
              {videoUrl ? (
                <button
                  type="button"
                  onClick={() => void toggleFullscreen()}
                  className="absolute right-3 top-3 z-20 grid h-10 w-10 cursor-pointer place-items-center rounded-xl bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-label={isFullscreen ? "ออกจากเต็มจอ" : "เปิดเต็มจอ"}
                  title={isFullscreen ? "ออกจากเต็มจอ" : "เปิดเต็มจอ"}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
                    {isFullscreen ? (
                      <path d="M9 4H4v5m11-5h5v5M9 20H4v-5m11 5h5v-5" />
                    ) : (
                      <path d="M4 9V4h5m6-0h5v5M4 15v5h5m6 0h5v-5" />
                    )}
                  </svg>
                </button>
              ) : null}
              {videoLoading ? (
                <div className="absolute inset-0 grid place-items-center bg-[#171513] text-white" role="status">
                  <span className="flex items-center gap-3 text-sm font-bold">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white motion-reduce:animate-none" />
                    กำลังขอสิทธิ์ดูวิดีโอ
                  </span>
                </div>
              ) : null}
              {!videoLoading && videoError ? (
                <div className="absolute inset-0 grid place-items-center bg-[#171513] p-6 text-center text-white" role="alert">
                  <div>
                    <p className="text-base font-bold">{videoError}</p>
                    <button
                      type="button"
                      onClick={() => {
                        consecutivePlaybackErrorsRef.current = 0;
                        requestFreshVideoUrl();
                      }}
                      className="mt-4 inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl bg-[#ea721f] px-5 text-sm font-bold text-white transition hover:bg-[#cf5d12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#171513]"
                    >
                      โหลดวิดีโอใหม่
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="p-5 sm:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c65018]">กำลังเรียน</p>
                  <h2 className="mt-2 text-2xl font-bold leading-snug text-[#292725]">{selectedLesson.title}</h2>
                  {selectedLesson.duration ? <p className="mt-2 text-sm font-medium text-[#776d65]">ความยาว {selectedLesson.duration}</p> : null}
                </div>
                <button type="button" onClick={toggleCompleted} aria-pressed={selectedIsComplete} className={`inline-flex min-h-12 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ea721f] focus-visible:ring-offset-2 ${selectedIsComplete ? "border border-emerald-700 bg-emerald-50 text-emerald-800 hover:bg-emerald-100" : "bg-[#ea721f] text-white hover:bg-[#cf5d12]"}`}>
                  <CheckIcon />
                  {selectedIsComplete ? "เรียนจบแล้ว" : "ทำเครื่องหมายว่าเรียนจบ"}
                </button>
              </div>
              {selectedLesson.description ? <p className="mt-5 max-w-3xl text-base leading-7 text-[#655d56]">{selectedLesson.description}</p> : null}
              {selectedLesson.resources.length ? (
                <div className="mt-7 border-t border-[#eee2d7] pt-6">
                  <h3 className="text-base font-bold text-[#292725]">เอกสารประกอบบทเรียน</h3>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {selectedLesson.resources.map((resource) => (
                      <a key={resource.url} href={resource.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#ded2c6] bg-[#fbf8f4] px-4 text-sm font-bold text-[#504841] transition hover:border-[#ea721f] hover:text-[#c65018] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ea721f] focus-visible:ring-offset-2">
                        <DownloadIcon />
                        {resource.label}
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </article>

          <aside className="overflow-hidden rounded-[28px] border border-[#ded2c6] bg-white shadow-[0_18px_50px_rgba(62,46,30,.08)] lg:sticky lg:top-24" aria-label="สารบัญคอร์ส">
            <div className="border-b border-[#eee2d7] px-5 py-5">
              <h2 className="text-lg font-bold text-[#292725]">เนื้อหาทั้งหมด</h2>
              <p className="mt-1 text-sm text-[#776d65]">{lessons.length} บทเรียน</p>
            </div>
            <div className="max-h-[66dvh] overflow-y-auto overscroll-contain p-3">
              {course.modules.map((module, moduleIndex) => (
                <section key={module.id} className="mb-5 last:mb-0" aria-labelledby={`module-${module.id}`}>
                  <h3 id={`module-${module.id}`} className="px-3 pb-2 pt-1 text-xs font-bold uppercase tracking-[0.12em] text-[#796d63]">
                    Module {moduleIndex + 1} · {module.title}
                  </h3>
                  <div className="space-y-1">
                    {module.lessons.map((lesson, lessonIndex) => {
                      const active = selectedLesson.id === lesson.id;
                      const complete = completedSet.has(lesson.id);
                      return (
                        <button key={lesson.id} type="button" onClick={() => selectLesson(lesson)} aria-current={active ? "true" : undefined} className={`flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ea721f] ${active ? "bg-[#fff0df] text-[#a9440a]" : "text-[#433d38] hover:bg-[#f8f3ed]"}`}>
                          <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${complete ? "bg-emerald-100 text-emerald-800" : active ? "bg-[#ea721f] text-white" : "bg-[#eee7df] text-[#6f655d]"}`}>
                            {complete ? <CheckIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-xs font-semibold text-current/70">บทที่ {lessonIndex + 1}</span>
                            <span className="mt-0.5 block text-sm font-bold leading-5">{lesson.title}</span>
                          </span>
                          {lesson.duration ? <span className="shrink-0 text-xs font-medium tabular-nums text-[#80756d]">{lesson.duration}</span> : null}
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
