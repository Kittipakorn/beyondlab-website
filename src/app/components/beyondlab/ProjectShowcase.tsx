import Link from "next/link";
import { ArrowIcon } from "./icons";
import { portfolioPreview } from "./data";

export function ProjectShowcase() {
  return (
    <section className="px-5 py-12 sm:px-8" id="projects">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 grid gap-4 lg:grid-cols-[0.8fr_1fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold text-[#ea721f]">Projects</p>
            <h2 className="mt-2 text-3xl font-semibold leading-tight text-[#303030] sm:text-4xl">
              โปรเจกต์ เดโม และกรณีศึกษาจากการลงมือทำ
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-[#555]">
            พื้นที่นี้ใช้รวมตัวอย่างสิ่งที่ BeyondLab ทดลอง สอน และต่อยอด เพื่อให้เห็นกระบวนการจากไอเดียไปสู่ผลงานจริง
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {portfolioPreview.map((item) => {
            const cardClassName =
              "block overflow-hidden rounded-[22px] bg-white shadow-[0_12px_30px_rgba(48,48,48,0.07)] transition" +
              (item.href ? " hover:-translate-y-0.5" : "");

            const content = (
              <>
                <div className="flex items-center justify-between bg-[#fff4df] px-5 py-3">
                  <span className="text-xs font-semibold text-[#8b5a2b]">BeyondLab projects</span>
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ea721f]" />
                </div>
                <div className="min-h-[180px] bg-white p-5">
                  <span
                    className={`inline-flex items-center rounded-lg border px-3 py-1 text-xs font-semibold ${
                      item.badge === "เร็วๆ นี้"
                        ? "border-[#f0dfc8] bg-white text-[#8b8178]"
                        : "border-[#f6c37f] bg-[#fff4df] text-[#ea721f]"
                    }`}
                  >
                    {item.badge}
                  </span>
                  <h3 className="mt-3 text-xl font-semibold text-[#303030]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#555]">{item.text}</p>
                  {item.href && (
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#ea721f]">
                      ดูรายละเอียด
                      <ArrowIcon />
                    </span>
                  )}
                </div>
              </>
            );

            return item.href ? (
              <Link key={item.title} href={item.href} className={cardClassName}>
                {content}
              </Link>
            ) : (
              <div key={item.title} className={cardClassName}>
                {content}
              </div>
            );
          })}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/portfolio"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#f0dfc8] bg-white px-4 text-sm font-semibold text-[#303030] shadow-[0_10px_24px_rgba(48,48,48,0.07)] transition hover:-translate-y-0.5"
          >
            ดูโปรเจกต์ทั้งหมด
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
