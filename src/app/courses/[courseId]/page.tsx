import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseCheckoutPanel } from "./CourseCheckoutPanel";
import { getSession } from "@/lib/auth";
import { getEnrolledCourseIds } from "@/lib/courseAccess";
import { getCourseById } from "@/lib/courseDb";
import { ArrowIcon } from "@/app/components/beyondlab/icons";
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ courseId: string }> }): Promise<Metadata> {
  const { courseId } = await params;
  const course = await getCourseById(courseId).catch(() => null);
  if (!course) return { title: "คอร์สไม่พบ | BeyondLab" };

  return {
    title: `${course.title} | BeyondLab`,
    description: `${course.subtitle} - ดูรายละเอียดคอร์ส สมัคร และชำระเงินได้ที่หน้าเดียว`,
  };
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path d="m4.5 10.5 3.1 3.1L15.5 5.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 fill-[#ea721f]">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z" />
    </svg>
  );
}

const courseReviews = [
  {
    name: "น้องนนท์",
    role: "นักเรียน ม.ปลาย",
    content: "เริ่มจากไม่เข้าใจ C++ เลย แต่พอเรียนตามลำดับแล้วจับทางได้เร็วขึ้น โจทย์พื้นฐานทำเองได้มั่นใจขึ้นครับ",
  },
  {
    name: "น้องมายด์",
    role: "มือใหม่ฝึกเขียนโค้ด",
    content: "ชอบที่อธิบายภาษาง่าย ไม่รีบข้ามพื้นฐาน และมีตัวอย่างให้ลองคิดตาม ทำให้ไม่กลัวการเขียนโค้ดเหมือนเดิมค่ะ",
  },
  {
    name: "น้องพี",
    role: "เตรียมสอบและทำพอร์ต",
    content: "คอร์สช่วยจัดพื้นฐานให้เป็นระบบขึ้นมาก จากที่เคยจำ syntax อย่างเดียว ตอนนี้เข้าใจวิธีคิดก่อนเขียนโค้ดแล้วครับ",
  },
];

export default async function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const session = await getSession();
  const enrolledCourseIds = session ? await getEnrolledCourseIds().catch(() => []) : [];
  const course = await getCourseById(courseId, enrolledCourseIds.includes(courseId)).catch(() => null);
  if (!course) notFound();

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";
  const isEnrolled = enrolledCourseIds.includes(course.id);

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-[#f7f3ed] px-5 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/courses"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#d9cbbb] bg-white px-4 text-sm font-bold text-[#514942] transition hover:border-[#c65018] hover:text-[#c65018]"
        >
          <ArrowIcon className="h-4 w-4 rotate-180" />
          กลับไปหน้าคอร์ส
        </Link>

        <section className="mt-6 grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="min-w-0">
            <div className="overflow-hidden rounded-[26px] border border-[#e2d7cb] bg-white shadow-[0_14px_38px_rgba(62,46,30,.07)]">
              <div className="relative aspect-[16/9] bg-[#fff3e7]">
                <Image
                  src={course.image}
                  alt={`ภาพปกคอร์ส ${course.title}`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 720px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>

            <header className="mt-7">
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex h-10 shrink-0 items-center justify-center rounded-full px-4 text-xs font-bold leading-none text-white ${course.status === "open" ? "bg-[#292725]" : "bg-[#8a7e75]"}`}>
                  {course.status === "open" ? "เปิดรับสมัคร" : "เร็วๆนี้"}
                </span>
                <span className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-[#fff4df] px-4 text-xs font-bold leading-none text-[#ea721f]">{course.label}</span>
                <span className="inline-flex h-10 shrink-0 items-center justify-center rounded-full border border-[#eadfce] bg-white px-4 text-xs font-bold leading-none tabular-nums text-[#6e645d]">{course.duration}</span>
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-[#292725] sm:text-5xl">{course.title}</h1>
              <p className="mt-3 max-w-2xl text-lg font-semibold leading-8 text-[#5c5148]">{course.subtitle}</p>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6e645d]">
                {course.description || "คอร์สสำหรับเริ่มต้นเขียน C++ แบบเป็นระบบ ปูพื้นฐานจากศูนย์ พร้อมตัวอย่าง แนวทางฝึก และพื้นที่ถามตอบหลังเรียน"}
              </p>
              <p className="mt-3 inline-flex rounded-full bg-[#fff4df] px-3 py-1.5 text-xs font-bold text-[#c65018]">
                สิทธิ์ใช้งาน 6 เดือนนับจากวันสมัคร
              </p>
            </header>

            <section className="mt-8 grid gap-4 sm:grid-cols-3" aria-label="ข้อมูลคอร์ส">
              <div className="rounded-2xl border border-[#eadfce] bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#c65018]">Level</p>
                <p className="mt-2 text-sm font-bold leading-6 text-[#292725]">{course.audience}</p>
              </div>
              <div className="rounded-2xl border border-[#eadfce] bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#c65018]">Format</p>
                <p className="mt-2 text-sm font-bold leading-6 text-[#292725]">{course.format}</p>
              </div>
              <div className="rounded-2xl border border-[#eadfce] bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#c65018]">Students</p>
                <p className="mt-2 text-sm font-bold leading-6 text-[#292725]">ผู้เรียน {course.students}</p>
              </div>
            </section>

            <section className="mt-8 rounded-[24px] border border-[#e2d7cb] bg-white p-5 shadow-[0_12px_30px_rgba(62,46,30,.05)] sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c65018]">สิ่งที่จะได้</p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {course.points.map((point) => (
                  <li key={point} className="flex gap-3 text-sm leading-6 text-[#5c5148]">
                    <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#fff0e5] text-[#c65018]">
                      <CheckIcon />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-8 rounded-[24px] border border-[#e2d7cb] bg-white p-5 shadow-[0_12px_30px_rgba(62,46,30,.05)] sm:p-6">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c65018]">Course reviews</p>
                    <span className="rounded-full bg-[#fff4df] px-2.5 py-1 text-[10px] font-bold text-[#c65018]">Mock ก่อน</span>
                  </div>
                  <h2 className="mt-2 text-xl font-bold text-[#292725]">เสียงจากผู้เรียน</h2>
                </div>
                <p className="text-sm font-semibold text-[#6e645d]">รีวิวตัวอย่างสำหรับจัดวางหน้าคอร์ส</p>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                {courseReviews.map((review) => (
                  <article key={review.name} className="rounded-2xl border border-[#eadfce] bg-[#fbf8f4] p-4">
                    <div className="flex gap-0.5">
                      {[0, 1, 2, 3, 4].map((star) => (
                        <StarIcon key={star} />
                      ))}
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[#5c5148]">&ldquo;{review.content}&rdquo;</p>
                    <div className="mt-4 border-t border-[#eadfce] pt-3">
                      <p className="text-sm font-bold text-[#292725]">{review.name}</p>
                      <p className="mt-0.5 text-xs font-semibold text-[#8a7e75]">{review.role}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24">
            <div>
              {!session ? (
                <div className="rounded-[24px] border border-[#e2d7cb] bg-white p-5 shadow-[0_14px_38px_rgba(62,46,30,.07)]">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c65018]">สรุปการสั่งซื้อ</p>
                  <h2 className="mt-2 text-lg font-bold text-[#292725]">{course.title}</h2>
                  <div className="mt-4 rounded-2xl border border-[#eadfce] bg-[#fffaf5] p-4">
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="font-semibold text-[#6e645d]">ราคาปกติ</span>
                      <span className="font-bold text-[#777] line-through">{course.originalPrice}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-4 text-sm">
                      <span className="font-semibold text-[#6e645d]">ราคา</span>
                      <span className="text-3xl font-bold leading-none text-[#ea5b16]">{course.price}</span>
                    </div>
                  </div>
                  <p className="mt-4 rounded-2xl border border-[#f0d1bb] bg-[#fff4ec] px-4 py-3 text-sm font-semibold leading-6 text-[#a84313]">
                    เข้าสู่ระบบก่อนชำระเงิน
                  </p>
                  <div className="mt-5 grid gap-2">
                    <Link
                      href={`/login?returnTo=${encodeURIComponent(`/courses/${course.id}`)}`}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#ea721f] px-4 text-sm font-bold text-white transition hover:bg-[#d96217]"
                    >
                      เข้าสู่ระบบเพื่อชำระเงิน
                      <ArrowIcon />
                    </Link>
                    <Link
                      href={`/register?returnTo=${encodeURIComponent(`/courses/${course.id}`)}`}
                      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#d9cbbb] bg-white px-4 text-sm font-bold text-[#514942] transition hover:border-[#c65018] hover:text-[#c65018]"
                    >
                      สร้างบัญชี
                    </Link>
                  </div>
                </div>
              ) : isEnrolled ? (
                <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-5 text-emerald-950">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">ซื้อแล้ว</p>
                  <h2 className="mt-2 text-lg font-bold">คอร์สนี้อยู่ในบัญชีของคุณแล้ว</h2>
                  <p className="mt-2 text-sm leading-6 text-emerald-900/80">ไม่ต้องชำระซ้ำ เข้าเรียนได้ทันที</p>
                  <Link
                    href={`/learn/${encodeURIComponent(course.id)}`}
                    className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-sm font-bold text-white transition hover:bg-emerald-800"
                  >
                    เข้าเรียน
                    <ArrowIcon />
                  </Link>
                </div>
              ) : (
                <CourseCheckoutPanel
                  courseId={course.id}
                  courseTitle={course.title}
                  priceLabel={course.price}
                  priceAmount={course.priceAmount}
                  originalPrice={course.originalPrice}
                  backendUrl={backendUrl}
                />
              )}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
