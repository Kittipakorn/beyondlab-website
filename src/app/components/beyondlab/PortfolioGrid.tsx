"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowIcon, CloseIcon, ExpandIcon } from "./icons";
import type { PortfolioCategoryItem } from "./data";

export function PortfolioCard({
  item,
  onImageClick,
}: {
  item: PortfolioCategoryItem;
  onImageClick?: (item: PortfolioCategoryItem) => void;
}) {
  const content = (
    <>
      {item.image ? (
        <div className="relative aspect-[16/9] overflow-hidden bg-[#f3ede6]">
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(min-width: 1280px) 280px, (min-width: 768px) 33vw, 100vw"
            className="object-cover object-top transition duration-300 group-hover:scale-[1.02] motion-reduce:transition-none"
          />
          {!item.href && onImageClick ? (
            <button
              type="button"
              aria-label={`ขยายรูป ${item.title}`}
              onClick={() => onImageClick(item)}
              className="absolute inset-0 cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ea721f]"
            >
              <span className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-[#303030] opacity-0 shadow-[0_8px_20px_rgba(48,48,48,.18)] transition group-hover:opacity-100 group-focus-within:opacity-100">
                <ExpandIcon />
              </span>
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-4">
        <span className="inline-flex w-fit items-center rounded-lg border border-[#f6c37f] bg-[#fff4df] px-2.5 py-1 text-[11px] font-semibold text-[#c65018]">
          {item.badge}
        </span>
        <h2 className="mt-2.5 line-clamp-2 text-lg font-semibold leading-snug text-[#303030]">{item.title}</h2>
        {item.description ? <p className="mt-2 line-clamp-3 text-sm leading-5 text-[#6e645d]">{item.description}</p> : null}
        {item.href ? (
          <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-[#c65018]">
            {item.href.startsWith("http") ? "เปิดโปรเจกต์" : "ดูรายละเอียด"}<ArrowIcon />
          </span>
        ) : null}
      </div>
    </>
  );

  const className = "group flex h-full flex-col overflow-hidden rounded-[18px] border border-[#eadfce] bg-white shadow-[0_9px_26px_rgba(48,48,48,.06)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(48,48,48,.10)]";

  if (!item.href) return <article className={className}>{content}</article>;
  if (item.href.startsWith("http")) {
    return <a href={item.href} target="_blank" rel="noreferrer" className={className}>{content}</a>;
  }
  return <Link href={item.href} className={className}>{content}</Link>;
}

export function PortfolioGrid({ items }: { items: PortfolioCategoryItem[] }) {
  const [lightboxItem, setLightboxItem] = useState<PortfolioCategoryItem | null>(null);

  useEffect(() => {
    if (!lightboxItem) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxItem(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxItem]);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => <PortfolioCard key={item.title} item={item} onImageClick={setLightboxItem} />)}
      </div>

      {lightboxItem?.image ? (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/80 p-4" role="dialog" aria-modal="true" aria-label={`รูป ${lightboxItem.title}`} onClick={() => setLightboxItem(null)}>
          <button type="button" aria-label="ปิด" onClick={() => setLightboxItem(null)} className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20">
            <CloseIcon className="h-5 w-5" />
          </button>
          <div className="relative h-[80vh] w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <Image src={lightboxItem.image} alt={lightboxItem.title} fill sizes="90vw" className="object-contain" />
          </div>
        </div>
      ) : null}
    </>
  );
}
