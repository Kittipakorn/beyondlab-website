"use client";

import { useEffect, useState } from "react";
import type { R2Course } from "@/lib/r2Course";
import { CourseCard } from "@/app/components/courses/CourseCard";
import { CourseCountBadge } from "@/app/components/courses/CourseCountBadge";
import { CoursePageHeader } from "@/app/components/courses/CoursePageHeader";
import { CoursePageShell } from "@/app/components/courses/CoursePageShell";

export function CourseLibrary({ courses, studentName }: { courses: R2Course[]; studentName: string }) {
  const [completedLessonsByCourse, setCompletedLessonsByCourse] = useState<Record<string, number>>({});

  useEffect(() => {
    const next: Record<string, number> = {};
    for (const course of courses) {
      try {
        const saved = window.localStorage.getItem(`beyondlab-course-progress:${course.id}`);
        const completedIds: unknown = saved ? JSON.parse(saved) : [];
        if (!Array.isArray(completedIds)) continue;
        const validLessonIds = new Set(course.modules.flatMap((module) => module.lessons.map((lesson) => lesson.id)));
        next[course.id] = new Set(completedIds.filter((id): id is string => typeof id === "string" && validLessonIds.has(id))).size;
      } catch {
        next[course.id] = 0;
      }
    }
    setCompletedLessonsByCourse(next);
  }, [courses]);

  return (
    <CoursePageShell>
        <CoursePageHeader
          eyebrow="BeyondLab Classroom"
          title="คอร์สของฉัน"
          description={`สวัสดี ${studentName} เลือกคอร์สที่ต้องการ แล้วกลับมาเรียนต่อจากจุดเดิมได้เลย`}
          rightSlot={<CourseCountBadge count={courses.length} />}
        />

        <section className="mt-6" aria-labelledby="available-courses-title">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c65018]">My learning</p>
              <h2 id="available-courses-title" className="mt-1 text-xl font-bold text-[#292725] sm:text-2xl">เลือกคอร์สเพื่อเข้าเรียน</h2>
            </div>
            <p className="hidden text-sm text-[#776d65] sm:block">ความคืบหน้าจะบันทึกบนอุปกรณ์นี้</p>
          </div>

          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.map((course, index) => {
              const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);
              const completedLessons = completedLessonsByCourse[course.id] ?? 0;
              const progress = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;

              return (
                <CourseCard
                  key={course.id}
                  title={course.title}
                  image={course.image}
                  description={course.description}
                  meta={[`${course.modules.length} โมดูล`, `${totalLessons} บทเรียน`, ...(course.instructor ? [`ผู้สอน ${course.instructor}`] : [])]}
                  statusLabel={course.status === "open" ? "พร้อมเรียน" : "เร็วๆนี้"}
                  statusTone="light"
                  actionHref={`/learn/${encodeURIComponent(course.id)}`}
                  actionLabel={progress > 0 ? "เรียนต่อ" : "เข้าเรียน"}
                  progress={{ completed: completedLessons, total: totalLessons }}
                  priority={index === 0}
                />
              );
            })}
          </div>
        </section>
    </CoursePageShell>
  );
}
