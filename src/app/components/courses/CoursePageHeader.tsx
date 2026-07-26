"use client";

import type { ReactNode } from "react";

type CoursePageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  rightSlot: ReactNode;
};

export function CoursePageHeader({
  eyebrow,
  title,
  description,
  rightSlot,
}: CoursePageHeaderProps) {
  return (
    <header data-course-page-header className="py-2 sm:py-3">
      <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c65018]">{eyebrow}</p>
          <h1 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-[#292725] sm:text-3xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6e645d]">{description}</p>
        </div>
        <div className="flex min-h-[70px] items-end">{rightSlot}</div>
      </div>
    </header>
  );
}
