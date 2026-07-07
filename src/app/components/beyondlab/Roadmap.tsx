import { roadmapItems } from "./data";

export function Roadmap() {
  return (
    <section className="border-y border-gray-200 bg-[#FAFAFA] px-5 py-24 sm:px-8" id="roadmap">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-28 lg:h-fit">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4F8CFF]">Learning Roadmap</p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-6xl">
            จากบรรทัดแรกสู่ระบบที่สร้างอนาคต
          </h2>
        </div>
        <div className="relative">
          <div className="absolute left-5 top-4 h-[calc(100%-2rem)] w-px bg-gray-200" />
          {roadmapItems.map(([step, title, text]) => (
            <div
              key={step}
              className="relative mb-5 grid gap-5 rounded-[24px] border border-gray-200 bg-white p-6 pl-16 shadow-[0_16px_50px_rgba(17,17,17,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(17,17,17,0.08)]"
            >
              <div className="absolute left-0 top-6 grid h-10 w-10 place-items-center rounded-full border border-gray-200 bg-white text-xs font-black text-[#4F8CFF] shadow-sm">
                {step}
              </div>
              <h3 className="text-2xl font-black tracking-[-0.04em]">{title}</h3>
              <p className="text-sm leading-6 text-gray-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
