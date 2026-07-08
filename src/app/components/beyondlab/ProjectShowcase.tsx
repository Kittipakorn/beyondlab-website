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
          {portfolioPreview.map(([title, text]) => (
            <div
              key={title}
              className="overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-[0_22px_80px_rgba(17,17,17,0.07)]"
            >
              <div className="flex items-center gap-2 border-b border-gray-200 bg-[#FAFAFA] px-5 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
              </div>
              <div className="min-h-[180px] bg-[linear-gradient(135deg,#ffffff,#f5f7fb)] p-6">
                <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-400">
                  เร็วๆ นี้
                </span>
                <h3 className="mt-4 text-2xl font-black tracking-[-0.04em]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{text}</p>
              </div>
            </div>
          ))}
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
