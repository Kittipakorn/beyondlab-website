"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowIcon, CloseIcon, MenuIcon } from "./icons";
import { Logo } from "./Logo";
import { navItems } from "./data";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200/70 bg-white/80 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-gray-500 transition hover:text-[#111111]"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/#community"
            className="hidden h-10 items-center gap-2 rounded-full border border-gray-200 bg-[#111111] px-4 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(17,17,17,0.16)] transition hover:-translate-y-0.5 hover:bg-black sm:inline-flex"
          >
            ติดต่อเรา
            <ArrowIcon />
          </Link>
          <button
            type="button"
            aria-label={open ? "ปิดเมนู" : "เปิดเมนู"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 text-[#111111] transition hover:border-gray-300 md:hidden"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-gray-200 bg-white px-5 py-4 sm:px-8 md:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-base font-medium text-gray-600 transition hover:bg-[#FAFAFA] hover:text-[#111111]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/#community"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#111111] px-4 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(17,17,17,0.16)] sm:hidden"
            >
              ติดต่อเรา
              <ArrowIcon />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
