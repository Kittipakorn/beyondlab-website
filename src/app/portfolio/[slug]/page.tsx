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
    description: course.description,
  };
}

export default async function PortfolioDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = pastCourses.find((item) => item.slug === slug);

  if (!course) notFound();

  return (
    <section className="px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#111111]"
        >
          <span className="rotate-180">
            <ArrowIcon />
          </span>
          กลับไปหน้าผลงาน
        </Link>

        <div className="mt-8">
          <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-[#4F8CFF]">
            {course.students} คนเรียน
          </span>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-6xl">{course.name}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">{course.description}</p>
        </div>

        <div className="mt-10 rounded-[24px] border border-dashed border-gray-200 bg-[#FAFAFA] p-7">
          <p className="text-sm leading-6 text-gray-500">
            รายละเอียดเนื้อหาคอร์ส ไฮไลต์ และภาพบรรยากาศกำลังทยอยอัปเดต ติดตามได้ทาง Instagram
            หรือช่องทางคอมมูนิตี้ของเรา
          </p>
        </div>

        <div className="mt-10">
          <Link
            href="/#community"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#111111] px-6 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(17,17,17,0.18)] transition hover:-translate-y-0.5"
          >
            สอบถามคอร์สนี้
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
