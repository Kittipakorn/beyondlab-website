"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import type { CourseItem } from "@/app/components/beyondlab/data";
import { CourseCard } from "@/app/components/courses/CourseCard";
import { CoursePageHeader } from "@/app/components/courses/CoursePageHeader";
import { CoursePageShell } from "@/app/components/courses/CoursePageShell";
import { ArrowIcon } from "@/app/components/beyondlab/icons";

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <circle cx="11" cy="11" r="7" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function normalizeSearch(value: string) {
  return value.trim().toLocaleLowerCase("th");
}

export function CourseCatalog({ courses }: { courses: CourseItem[] }) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = normalizeSearch(deferredQuery);
  const filteredCourses = normalizedQuery
    ? courses.filter((course) =>
        normalizeSearch([
          course.title,
          course.subtitle,
          course.description,
          course.label,
          course.audience,
          course.format,
          ...course.points,
        ].join(" ")).includes(normalizedQuery),
      )
    : courses;

  return (
    <CoursePageShell>
        <CoursePageHeader
          eyebrow="BeyondLab Courses"
          title="ค้นหาคอร์สที่เหมาะกับคุณ"
          description="เรียนรู้ตั้งแต่พื้นฐาน ฝึกคิดอย่างเป็นระบบ และลงมือสร้างทักษะที่นำไปใช้ได้จริง"
          rightSlot={
            <div className="w-full lg:ml-auto">
              <label htmlFor="course-search" className="mb-2 block text-sm font-bold text-[#514942]">
                ค้นหาคอร์ส
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#8a7e75]">
                  <SearchIcon />
                </span>
                <input
                  id="course-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="เช่น C++, พื้นฐาน, มือใหม่"
                  className="h-11 w-full rounded-xl border border-[#ddcfc2] bg-white pl-12 pr-4 text-base text-[#292725] outline-none transition placeholder:text-[#a49a91] focus:border-[#ea721f] focus:ring-4 focus:ring-[#ea721f]/10"
                />
              </div>
            </div>
          }
        />

        <section className="mt-8" aria-labelledby="course-results-title">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c65018]">Course catalog</p>
              <h2 id="course-results-title" className="mt-1 text-2xl font-bold text-[#292725]">คอร์สทั้งหมด</h2>
            </div>
            <p className="text-sm font-semibold text-[#776d65]" aria-live="polite">
              พบ {filteredCourses.length} คอร์ส
            </p>
          </div>

          {filteredCourses.length > 0 ? (
            <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.title}
                  title={course.title}
                  image={course.image}
                  subtitle={course.subtitle}
                  meta={[course.label, course.duration, `ผู้เรียน ${course.students}`]}
                  features={course.points}
                  audience={course.audience}
                  price={course.price}
                  statusLabel={course.status === "open" ? "เปิดรับสมัคร" : "เร็วๆ นี้"}
                  statusTone={course.status === "open" ? "dark" : "light"}
                  actionHref={course.href}
                  actionLabel={course.status === "open" ? "สมัครเรียน" : "เร็วๆ นี้"}
                  actionExternal={course.status === "open"}
                />
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-[26px] border border-dashed border-[#d9cbbb] bg-white px-5 py-12 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#fff0e5] text-[#c65018]"><SearchIcon /></span>
              <h3 className="mt-4 text-lg font-bold text-[#292725]">ไม่พบคอร์สที่ค้นหา</h3>
              <p className="mt-2 text-sm text-[#776d65]">ลองใช้ชื่อคอร์ส หัวข้อ หรือระดับผู้เรียนที่ต่างออกไป</p>
              <button type="button" onClick={() => setQuery("")} className="mt-5 min-h-11 rounded-xl border border-[#d9cbbb] bg-white px-5 text-sm font-bold text-[#514942] transition hover:border-[#c65018] hover:text-[#c65018]">
                ล้างคำค้นหา
              </button>
            </div>
          )}

          <div className="mt-10 text-center">
            <p className="text-sm text-[#776d65]">ลงทะเบียนแล้วและต้องการกลับไปเรียนต่อ?</p>
            <Link href="/learn" className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#d9cbbb] bg-white px-5 text-sm font-bold text-[#514942] transition hover:border-[#c65018] hover:text-[#c65018]">
              ไปที่คอร์สของฉัน<ArrowIcon />
            </Link>
          </div>
        </section>
    </CoursePageShell>
  );
}
