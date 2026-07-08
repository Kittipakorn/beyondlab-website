import { portfolioCategories } from "../components/beyondlab/data";

export const metadata = {
  title: "ผลงาน | BeyondLab",
  description: "รวบรวมผลงาน ผลการแข่งขัน และกิจกรรมของนักเรียน BeyondLab",
};

export default function PortfolioPage() {
  return (
    <section className="px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4F8CFF]">Portfolio</p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-6xl">ผลงานของ BeyondLab</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600">
            หน้านี้กำลังอยู่ระหว่างรวบรวมผลการแข่งขัน คอร์สที่เคยสอน และภาพกิจกรรมของนักเรียน BeyondLab
            ติดตามอัปเดตได้ทาง Instagram หรือช่องทางคอมมูนิตี้ของเรา
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {portfolioCategories.map((category) => (
            <div
              key={category.title}
              className="rounded-[24px] border border-gray-200 bg-white p-7 shadow-[0_18px_60px_rgba(17,17,17,0.05)]"
            >
              <span className="inline-flex items-center rounded-full border border-gray-200 bg-[#FAFAFA] px-3 py-1 text-xs font-semibold text-gray-400">
                เร็วๆ นี้
              </span>
              <h2 className="mt-4 text-2xl font-black tracking-[-0.04em]">{category.title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">{category.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
