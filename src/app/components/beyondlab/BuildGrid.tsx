import { buildCards } from "./data";

export function BuildGrid() {
  return (
    <section className="px-5 py-24 sm:px-8" id="courses">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4F8CFF]">What You'll Build</p>
            <h2 className="mt-4 max-w-2xl text-4xl font-black tracking-[-0.05em] sm:text-6xl">
              ห้องแล็บสำหรับคนที่อยากสร้างจริง
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-gray-600">
            BeyondLab เปลี่ยนการเรียนเขียนโปรแกรมให้เป็น practice ของนักสร้าง:
            คิดเป็นระบบ ใช้ AI เป็น และส่งผลงานจริงออกไปสู่โลก
          </p>
        </div>
        <div className="grid gap-5 lg:grid-cols-4">
          {buildCards.map((item, index) => (
            <div
              key={item.title}
              className={`group min-h-[300px] rounded-[24px] border border-gray-200 bg-gradient-to-br ${item.gradient} p-7 shadow-[0_18px_60px_rgba(17,17,17,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(17,17,17,0.09)] ${index === 1 ? "lg:col-span-2" : ""}`}
            >
              <div className="mb-12 h-12 w-12 rounded-2xl border border-gray-200 bg-white shadow-sm transition group-hover:scale-105">
                <div className="m-3 h-6 w-6 rounded-lg bg-[linear-gradient(135deg,#111111,#4F8CFF)]" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">{item.meta}</p>
              <h3 className="mt-4 text-2xl font-black tracking-[-0.04em]">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
