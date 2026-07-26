import Link from "next/link";
import { CourseCountBadge } from "@/app/components/courses/CourseCountBadge";
import { CoursePageHeader } from "@/app/components/courses/CoursePageHeader";
import { CoursePageShell } from "@/app/components/courses/CoursePageShell";

export function EmptyCourseLibrary({ studentName }: { studentName: string }) {
  return (
    <CoursePageShell>
        <CoursePageHeader
          eyebrow="BeyondLab Classroom"
          title="คอร์สของฉัน"
          description={`สวัสดี ${studentName} คอร์สที่ได้รับสิทธิ์จะแสดงอยู่ที่หน้านี้`}
          rightSlot={<CourseCountBadge count={0} />}
        />

        <section className="mt-6 rounded-3xl border border-dashed border-[#d9cbbb] bg-white px-5 py-10 text-center" aria-labelledby="empty-courses-title">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#fff0df] text-[#c65018]" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22.5v-17Z" /><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5a2.5 2.5 0 0 1 2.5 2.5v-17Z" /></svg>
          </span>
          <h2 id="empty-courses-title" className="mt-4 text-xl font-bold text-[#292725]">ยังไม่มีคอร์สที่เข้าเรียนได้</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#71675f]">เมื่อบัญชีนี้ได้รับสิทธิ์ คอร์สจะปรากฏที่นี่โดยอัตโนมัติ</p>
          <Link href="/courses" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#292522] px-5 text-sm font-bold text-white transition hover:bg-[#c65018] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ea721f] focus-visible:ring-offset-2">ดูคอร์สที่เปิดสอน</Link>
        </section>
    </CoursePageShell>
  );
}
