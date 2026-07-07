import { projects } from "./data";

export function ProjectShowcase() {
  return (
    <section className="px-5 py-24 sm:px-8" id="projects">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4F8CFF]">Student Projects</p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-6xl">
            ผลงานจริง สำคัญกว่าใบประกาศ
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map(([title, text], index) => (
            <div
              key={title}
              className={`overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-[0_22px_80px_rgba(17,17,17,0.07)] ${index === 0 ? "lg:col-span-2" : ""}`}
            >
              <div className="flex items-center gap-2 border-b border-gray-200 bg-[#FAFAFA] px-5 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
              </div>
              <div className="min-h-[220px] bg-[linear-gradient(135deg,#ffffff,#f5f7fb)] p-6">
                <div className="mb-8 grid grid-cols-3 gap-3">
                  <div className="col-span-2 h-24 rounded-2xl border border-gray-200 bg-white shadow-sm" />
                  <div className="h-24 rounded-2xl border border-gray-200 bg-[#111111]" />
                  <div className="h-16 rounded-2xl border border-gray-200 bg-blue-50" />
                  <div className="col-span-2 h-16 rounded-2xl border border-gray-200 bg-white shadow-sm" />
                </div>
                <h3 className="text-2xl font-black tracking-[-0.04em]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
