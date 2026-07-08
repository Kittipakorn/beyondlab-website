import Link from "next/link";
import { ArrowIcon } from "../components/beyondlab/icons";
import { pastCourses, portfolioCategories } from "../components/beyondlab/data";

export const metadata = {
  title: "Projects | BeyondLab",
  description: "รวบรวมโปรเจกต์ เดโม คอร์ส และกรณีศึกษาของ BeyondLab",
};

export default function PortfolioPage() {
  return (
    <section className="px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold text-[#ea721f]">Projects</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#303030] sm:text-5xl">โปรเจกต์ของ BeyondLab</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600">
            หน้านี้กำลังอยู่ระหว่างรวบรวมเดโม คอร์ส โปรเจกต์ และกรณีศึกษาของ BeyondLab เพิ่มเติม
            ติดตามอัปเดตได้ทาง Instagram หรือช่องทางติดต่อของเรา
          </p>
        </div>

        <div className="mb-8">
          <p className="text-sm font-semibold text-[#ea721f]">คอร์สที่เคยสอน</p>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {pastCourses.map((course) => (
              <Link
                key={course.name}
                href={`/portfolio/${course.slug}`}
                className="group flex flex-col rounded-[22px] bg-white p-5 shadow-[0_12px_34px_rgba(48,48,48,0.07)] transition hover:-translate-y-0.5"
              >
                <span className="inline-flex w-fit items-center rounded-full bg-[#fff4df] px-3 py-1 text-xs font-semibold text-[#ea721f]">
                  ผู้เรียน {course.students}
                </span>
                <h2 className="mt-3 text-xl font-semibold text-[#303030]">{course.name}</h2>
                <p className="mt-3 text-sm leading-6 text-gray-600">{course.description}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#ea721f]">
                  ดูรายละเอียด
                  <span className="transition group-hover:translate-x-0.5">
                    <ArrowIcon />
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {portfolioCategories.map((category) => (
            <div
              key={category.title}
              className="rounded-[22px] bg-white p-5 shadow-[0_12px_34px_rgba(48,48,48,0.07)]"
            >
              <span className="inline-flex items-center rounded-full border border-gray-200 bg-[#FAFAFA] px-3 py-1 text-xs font-semibold text-gray-400">
                เร็วๆ นี้
              </span>
              <h2 className="mt-3 text-xl font-semibold">{category.title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">{category.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
