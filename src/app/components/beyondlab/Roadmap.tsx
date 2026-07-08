import { roadmapItems } from "./data";

export function Roadmap() {
  return (
    <section className="px-5 py-10 sm:px-8" id="roadmap">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-28 lg:h-fit">
          <p className="text-sm font-semibold text-[#ea721f]">BeyondLab Flow</p>
          <h2 className="mt-3 text-4xl font-semibold leading-tight text-[#303030] sm:text-5xl">
            เลือกเส้นทาง แล้วต่อยอดให้เป็นผลงาน
          </h2>
          <p className="mt-5 max-w-md text-base leading-8 text-[#555]">
            จะเริ่มจากคอร์สเรียน ปรึกษาโปรเจกต์ หรือดูตัวอย่างงาน ก็สามารถเชื่อมต่อกันเป็นเส้นทางเดียวได้
          </p>
        </div>
        <div className="relative">
          <div className="absolute left-5 top-4 h-[calc(100%-2rem)] w-px bg-[#f0c07f]" />
          {roadmapItems.map(([step, title, text]) => (
            <div
              key={step}
              className="relative mb-5 grid gap-4 rounded-[28px] bg-white p-6 pl-16 shadow-[0_16px_38px_rgba(48,48,48,0.08)] transition hover:-translate-y-0.5"
            >
              <div className="absolute left-0 top-6 grid h-10 w-10 place-items-center rounded-2xl bg-[#ea721f] text-xs font-semibold text-white">
                {step}
              </div>
              <h3 className="text-2xl font-semibold text-[#303030]">{title}</h3>
              <p className="text-sm leading-6 text-[#555]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
