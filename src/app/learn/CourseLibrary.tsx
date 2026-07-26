"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { R2Course } from "@/lib/r2Course";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
      <path d="M5 12h14M14 7l5 5-5 5" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true">
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22.5v-17Z" />
      <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5a2.5 2.5 0 0 1 2.5 2.5v-17Z" />
    </svg>
  );
}

export function CourseLibrary({ course, studentName }: { course: R2Course; studentName: string }) {
  const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);
  const [completedLessons, setCompletedLessons] = useState(0);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(`beyondlab-course-progress:${course.id}`);
      const completedIds: unknown = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(completedIds)) return;
      const validLessonIds = new Set(course.modules.flatMap((module) => module.lessons.map((lesson) => lesson.id)));
      setCompletedLessons(new Set(completedIds.filter((id): id is string => typeof id === "string" && validLessonIds.has(id))).size);
    } catch {
      // The course remains accessible when local storage is unavailable.
    }
  }, [course.id, course.modules]);

  const progress = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <main className="min-h-[75dvh] bg-[#f7f3ed] px-5 py-7 sm:px-8 sm:py-9">
      <div className="mx-auto max-w-5xl">
        <header className="rounded-3xl border border-[#eadfce] bg-[linear-gradient(135deg,#fff_0%,#fff8f0_65%,#ffe8d2_100%)] px-5 py-5 shadow-[0_12px_36px_rgba(62,46,30,.07)] sm:px-7 sm:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c65018]">BeyondLab Classroom</p>
              <h1 className="mt-1.5 text-2xl font-bold tracking-[-0.02em] text-[#292725] sm:text-3xl">คอร์สของฉัน</h1>
              <p className="mt-1.5 max-w-xl text-sm leading-6 text-[#6e645d]">
                สวัสดี {studentName} เลือกคอร์สที่ต้องการ แล้วกลับมาเรียนต่อจากจุดเดิมได้เลย
              </p>
            </div>
            <div className="flex w-fit shrink-0 items-center gap-2.5 rounded-2xl border border-[#eadfce] bg-white/80 px-3 py-2 shadow-sm">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff0df] text-[#c65018]"><BookIcon /></span>
              <div><p className="text-[11px] font-semibold text-[#7a7068]">พร้อมเรียน</p><p className="text-base font-bold tabular-nums text-[#292725]">1 คอร์ส</p></div>
            </div>
          </div>
        </header>

        <section className="mt-6" aria-labelledby="available-courses-title">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c65018]">My learning</p>
              <h2 id="available-courses-title" className="mt-1 text-xl font-bold text-[#292725] sm:text-2xl">เลือกคอร์สเพื่อเข้าเรียน</h2>
            </div>
            <p className="hidden text-sm text-[#776d65] sm:block">ความคืบหน้าจะบันทึกบนอุปกรณ์นี้</p>
          </div>

          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <article className="group max-w-sm overflow-hidden rounded-3xl border border-[#ded2c6] bg-white shadow-[0_12px_36px_rgba(62,46,30,.07)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(62,46,30,.11)] motion-reduce:transition-none">
              <Link href={`/learn/${encodeURIComponent(course.id)}`} className="flex h-full flex-col rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ea721f] focus-visible:ring-offset-4" aria-label={`เข้าเรียนคอร์ส ${course.title}`}>
                <div className="relative aspect-[16/9] overflow-hidden bg-[#eee5dc]">
                  <Image src="/courses/zero-to-code.png" alt={`ภาพปกคอร์ส ${course.title}`} fill priority sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-300 group-hover:scale-[1.02] motion-reduce:transition-none" />
                  <span className="absolute left-3 top-3 rounded-full border border-white/70 bg-white/90 px-2.5 py-1 text-[11px] font-bold text-[#a9440a] shadow-sm backdrop-blur">พร้อมเรียน</span>
                </div>
                <div className="flex flex-col p-5">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold text-[#776d65]">
                    <span>{course.modules.length} โมดูล</span><span aria-hidden="true">•</span><span>{totalLessons} บทเรียน</span>
                    {course.instructor ? <><span aria-hidden="true">•</span><span>ผู้สอน {course.instructor}</span></> : null}
                  </div>
                  <h3 className="mt-2 text-xl font-bold leading-tight text-[#292725] sm:text-2xl">{course.title}</h3>
                  {course.description ? <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6e645d]">{course.description}</p> : null}
                  <div className="mt-auto pt-4">
                    <div className="flex items-center justify-between text-sm"><span className="font-semibold text-[#514942]">เรียนแล้ว {completedLessons}/{totalLessons} บท</span><span className="font-bold tabular-nums text-[#c65018]">{progress}%</span></div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#ede2d7]" role="progressbar" aria-label={`ความคืบหน้าคอร์ส ${course.title}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><div className="h-full rounded-full bg-[#ea721f] transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${progress}%` }} /></div>
                  </div>
                  <span className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#292522] px-4 text-sm font-bold text-white transition group-hover:bg-[#c65018] sm:w-auto">
                    {progress > 0 ? "เรียนต่อ" : "เข้าเรียน"}<ArrowIcon />
                  </span>
                </div>
              </Link>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
