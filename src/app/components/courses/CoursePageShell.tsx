"use client";

import type { ReactNode } from "react";

export function CoursePageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-[#f7f3ed] px-5 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-6xl">{children}</div>
    </div>
  );
}
