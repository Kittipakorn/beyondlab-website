import Link from "next/link";
import { ArrowIcon } from "./icons";
import { portfolioPreview, type PortfolioCategoryItem } from "./data";
import { PortfolioCard } from "./PortfolioGrid";

export function ProjectShowcase() {
  return (
    <section className="px-5 py-12 sm:px-8" id="projects">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 grid gap-4 lg:grid-cols-[0.8fr_1fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold text-[#ea721f]">Projects</p>
            <h2 className="mt-2 pt-1 text-2xl font-semibold leading-tight text-[#303030] sm:text-3xl">
              ผลงานและกรณีศึกษา
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-[#555]">
            พื้นที่นี้ใช้รวมตัวอย่างสิ่งที่ BeyondLab ทดลอง สอน และต่อยอด เพื่อให้เห็นกระบวนการจากไอเดียไปสู่ผลงานจริง
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {portfolioPreview.map((item) => (
            <PortfolioCard
              key={item.title}
              item={{
                title: item.title,
                description: item.text,
                badge: item.badge,
                href: item.href,
                image: item.image,
              } satisfies PortfolioCategoryItem}
            />
          ))}
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
