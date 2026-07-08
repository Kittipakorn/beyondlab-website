import Image from "next/image";
import { ArrowIcon } from "./icons";
import { courses } from "./data";

export function BuildGrid() {
  const course = courses[0];

  return (
    <section className="px-5 py-10 sm:px-8" id="courses">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 grid gap-3 lg:grid-cols-[0.78fr_1fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold text-[#ea721f]">Courses</p>
            <h2 className="mt-2 text-3xl font-semibold leading-tight text-[#303030] sm:text-4xl">
              คอร์สที่เปิดขายตอนนี้
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-[#555]">
            คอร์ส C++ พื้นฐานสำหรับมือใหม่ เริ่มจาก 0 จนเขียนโค้ดได้จริง
          </p>
        </div>

        <article className="overflow-hidden rounded-[24px] bg-white shadow-[0_18px_52px_rgba(48,48,48,0.1)]">
          <div className="grid gap-0 lg:grid-cols-[0.72fr_1.28fr]">
            <div className="relative bg-[#fff8ed] p-4 lg:p-5">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-[310px] overflow-hidden rounded-[20px] border border-[#f0dfc8] bg-white shadow-[0_14px_34px_rgba(48,48,48,0.09)]">
                <Image
                  src={course.image}
                  alt={`${course.title} ${course.subtitle}`}
                  fill
                  sizes="(min-width: 1024px) 34vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <div className="flex flex-col p-5 sm:p-6 lg:p-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#303030] px-2.5 py-1 text-[11px] font-semibold text-white">เปิดรับสมัคร</span>
                <span className="rounded-full bg-[#fff4df] px-2.5 py-1 text-[11px] font-semibold text-[#ea721f]">{course.duration}</span>
                <span className="rounded-full border border-[#f0dfc8] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#8b5a2b]">
                  {course.label}
                </span>
              </div>

              <div className="mt-4">
                <h3 className="text-3xl font-semibold leading-none text-[#303030] sm:text-4xl">{course.title}</h3>
                <p className="mt-2 text-lg font-semibold leading-tight text-[#5c5148] sm:text-xl">{course.subtitle}</p>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#555]">{course.description}</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#fff8ed] px-3 py-1.5 text-xs font-semibold text-[#303030]">
                  {course.audience}
                </span>
                <span className="rounded-full bg-[#fff8ed] px-3 py-1.5 text-xs font-semibold text-[#303030]">
                  {course.format}
                </span>
              </div>

              <ul className="mt-4 grid gap-2 sm:grid-cols-3">
                {course.points.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-xs leading-5 text-[#555]">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-[#ea721f]" />
                    {point}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-5">
                <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
                  <p className="text-xs font-semibold text-[#ea721f]">เพียง</p>
                  <p className="text-4xl font-semibold leading-none text-[#ff5a1f]">{course.price}</p>
                  <p className="pb-0.5 text-sm font-semibold text-[#777]">
                    จากปกติ <span className="line-through">{course.originalPrice}</span>
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <a
                    href="http://lin.ee/VbDTcyo"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#ff681f] px-5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(255,104,31,0.24)] transition hover:-translate-y-0.5 hover:bg-[#ea5b16] sm:w-auto"
                  >
                    {course.cta}
                    <ArrowIcon />
                  </a>
                  <span className="inline-flex h-9 items-center rounded-full bg-[#fff4df] px-3 text-xs font-semibold text-[#ea721f]">
                    ผู้เรียน {course.students}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
