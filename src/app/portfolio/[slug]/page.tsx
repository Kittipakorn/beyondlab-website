import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowIcon } from "../../components/beyondlab/icons";
import { pastCourses } from "../../components/beyondlab/data";

export function generateStaticParams() {
  return pastCourses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = pastCourses.find((item) => item.slug === slug);
  if (!course) return {};
  return {
    title: `${course.name} | ผลงาน BeyondLab`,
    description: course.description || `${course.name} | BeyondLab`,
  };
}

export default async function PortfolioDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = pastCourses.find((item) => item.slug === slug);

  if (!course) notFound();

  return (
    <section className="px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#ea721f]"
        >
          <span className="rotate-180">
            <ArrowIcon />
          </span>
          กลับไปหน้าผลงาน
        </Link>

        <div className="mt-8">
          <span className="inline-flex items-center rounded-full bg-[#fff4df] px-3 py-1 text-xs font-semibold text-[#ea721f]">
            ผู้เรียน {course.students}
          </span>
          <h1 className="mt-3 text-3xl font-semibold text-[#303030] sm:text-5xl">{course.name}</h1>
          {course.description && (
            <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">{course.description}</p>
          )}
        </div>

        <div className="mt-8 rounded-[22px] border border-dashed border-[#f0dfc8] bg-white p-5">
          <p className="text-sm leading-6 text-gray-500">
            รายละเอียดเนื้อหาคอร์ส ไฮไลต์ และภาพบรรยากาศกำลังทยอยอัปเดต ติดตามได้ทาง Instagram
            หรือช่องทางติดต่อของเรา
          </p>
        </div>

        <div className="mt-10">
          <Link
            href="/#contact"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#303030] px-4 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(48,48,48,0.16)] transition hover:-translate-y-0.5"
          >
            สอบถามคอร์สนี้
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
