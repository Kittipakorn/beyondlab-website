"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowIcon, CloseIcon, ExpandIcon } from "./icons";
import type { PortfolioCategory, PortfolioCategoryItem } from "./data";

const VISIBLE_LIMIT = 3;

function PortfolioCard({
  item,
  onImageClick,
}: {
  item: PortfolioCategoryItem;
  onImageClick: (item: PortfolioCategoryItem) => void;
}) {
  const content = (
    <>
      {item.image && (
        <div className="relative aspect-[16/9] overflow-hidden">
          {item.href ? (
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 95vw"
              className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <button
              type="button"
              aria-label={`ขยายรูป ${item.title}`}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onImageClick(item);
              }}
              className="group/image relative block h-full w-full cursor-zoom-in"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 95vw"
                className="object-cover object-top transition duration-500 group-hover/image:scale-[1.03]"
              />
              <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#303030] opacity-0 shadow-[0_8px_20px_rgba(48,48,48,0.18)] transition group-hover/image:opacity-100">
                <ExpandIcon />
              </span>
            </button>
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent" />
        </div>
      )}
      <div className={`flex flex-col p-5 ${item.image ? "min-h-[205px]" : "min-h-[300px]"}`}>
        <span className="inline-flex w-fit items-center rounded-lg border border-[#f6c37f] bg-[#fff4df] px-3 py-1 text-xs font-semibold text-[#ea721f]">
          {item.badge}
        </span>
        <h2 className="mt-3 text-xl font-semibold leading-snug text-[#303030]">{item.title}</h2>
        {item.description && (
          <p className="mt-3 text-sm leading-6 text-gray-600">{item.description}</p>
        )}
        {item.href && (
          <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-[#ea721f]">
            {item.href.startsWith("http") ? "เปิดโปรดักต์" : "ดูรายละเอียด"}
            <span className="transition group-hover:translate-x-0.5">
              <ArrowIcon />
            </span>
          </span>
        )}
      </div>
    </>
  );

  const className =
    "group block h-full overflow-hidden rounded-[22px] bg-white shadow-[0_12px_34px_rgba(48,48,48,0.07)] transition hover:-translate-y-0.5";

  if (!item.href) {
    return <article className={className}>{content}</article>;
  }

  if (item.href.startsWith("http")) {
    return (
      <a href={item.href} target="_blank" rel="noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={item.href} className={className}>
      {content}
    </Link>
  );
}

export function PortfolioCategorySection({ category }: { category: PortfolioCategory }) {
  const [expanded, setExpanded] = useState(false);
  const [lightboxItem, setLightboxItem] = useState<PortfolioCategoryItem | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasOverflow = category.items.length > VISIBLE_LIMIT;
  const showGrid = !hasOverflow || expanded;

  useEffect(() => {
    if (!lightboxItem) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxItem(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxItem]);

  const scrollByPage = (direction: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: "smooth" });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      el.scrollLeft += event.deltaY !== 0 ? event.deltaY : event.deltaX;
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [showGrid]);

  return (
    <section>
      <div className="mb-5">
        <p className="text-sm font-semibold text-[#ea721f]">{category.title}</p>
      </div>

      {showGrid ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {category.items.map((item) => (
            <PortfolioCard key={item.title} item={item} onImageClick={setLightboxItem} />
          ))}
        </div>
      ) : (
        <div className="relative">
          <div
            ref={scrollRef}
            className="-mx-5 flex gap-5 overflow-x-auto px-5 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {category.items.map((item) => (
              <div key={item.title} className="w-[85%] flex-none sm:w-[45%] lg:w-[31%]">
                <PortfolioCard item={item} onImageClick={setLightboxItem} />
              </div>
            ))}
          </div>

          <button
            type="button"
            aria-label="เลื่อนดูก่อนหน้า"
            onClick={() => scrollByPage(-1)}
            className="absolute left-1 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#f0dfc8] bg-white text-[#303030] shadow-[0_10px_24px_rgba(48,48,48,0.12)] transition hover:-translate-x-0.5 sm:flex"
          >
            <ArrowIcon className="h-4 w-4 rotate-180" />
          </button>
          <button
            type="button"
            aria-label="เลื่อนดูถัดไป"
            onClick={() => scrollByPage(1)}
            className="absolute right-1 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#f0dfc8] bg-white text-[#303030] shadow-[0_10px_24px_rgba(48,48,48,0.12)] transition hover:translate-x-0.5 sm:flex"
          >
            <ArrowIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      {hasOverflow && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#f0dfc8] bg-white px-4 text-sm font-semibold text-[#303030] shadow-[0_10px_24px_rgba(48,48,48,0.07)] transition hover:-translate-y-0.5"
          >
            {expanded ? "ย่อกลับ" : "ดูทั้งหมด"}
            <ArrowIcon className={`h-4 w-4 transition-transform ${expanded ? "-rotate-90" : "rotate-90"}`} />
          </button>
        </div>
      )}

      {lightboxItem?.image && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightboxItem(null)}
        >
          <button
            type="button"
            aria-label="ปิด"
            onClick={() => setLightboxItem(null)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
          <div
            className="relative h-[80vh] w-full max-w-4xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={lightboxItem.image}
              alt={lightboxItem.title}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
