import Link from "next/link";
import { ArrowIcon } from "./icons";
import { portfolioPreview } from "./data";

export function ProjectShowcase() {
  return (
    <section className="px-5 py-24 sm:px-8" id="portfolio-preview">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4F8CFF]">Portfolio</p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-6xl">
            ผลงานจริง สำคัญกว่าใบประกาศ
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {portfolioPreview.map((item) => {
            const cardClassName =
              "block overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-[0_22px_80px_rgba(17,17,17,0.07)] transition" +
              (item.href ? " hover:-translate-y-0.5 hover:border-gray-300" : "");

            const content = (
              <>
                <div className="flex items-center gap-2 border-b border-gray-200 bg-[#FAFAFA] px-5 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                </div>
                <div className="min-h-[180px] bg-[linear-gradient(135deg,#ffffff,#f5f7fb)] p-6">
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                      item.badge === "เร็วๆ นี้"
                        ? "border-gray-200 bg-white text-gray-400"
                        : "border-blue-100 bg-blue-50 text-[#4F8CFF]"
                    }`}
                  >
                    {item.badge}
                  </span>
                  <h3 className="mt-4 text-2xl font-black tracking-[-0.04em]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{item.text}</p>
                  {item.href && (
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#4F8CFF]">
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
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-6 text-sm font-semibold text-[#111111] shadow-sm transition hover:-translate-y-0.5 hover:border-gray-300"
          >
            ดูผลงานทั้งหมด
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
