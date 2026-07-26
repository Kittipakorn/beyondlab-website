"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CloseIcon, MenuIcon } from "./icons";
import { Logo } from "./Logo";
import { navItems } from "./data";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<{
    authenticated: boolean;
    user?: { username: string; email: string; plan: string; role: string };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/proxy/auth/session", { credentials: "same-origin" })
      .then((res) => (res.ok ? res.json() : { authenticated: false }))
      .then((data) => setSession(data))
      .catch(() => setSession({ authenticated: false }))
      .finally(() => setLoading(false));
  }, []);

  const displayName = session?.user?.username || "";

  return (
    <nav className="sticky top-0 z-50 border-b border-[#f0dfc8]/90 bg-white/88 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-lg px-2 py-2 text-sm font-semibold text-[#5c5148] transition hover:text-[#ea721f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ea721f] focus-visible:ring-offset-2"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {loading ? (
            <div className="h-8 w-20 animate-pulse rounded-2xl bg-[#f0dfc8]" />
          ) : session?.authenticated && session.user ? (
            <Link
              href="/account"
              className="flex h-11 items-center gap-2 rounded-2xl border border-[#ea721f]/30 bg-[#fff1e6] px-4 text-sm font-semibold text-[#d55d11] transition hover:bg-[#ffe4d0] shadow-sm"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#ea721f] text-xs font-bold text-white">
                {displayName.charAt(0).toUpperCase()}
              </span>
              <span className="hidden max-w-40 truncate sm:inline">{displayName}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex h-11 items-center gap-2 rounded-2xl bg-[#303030] px-4 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(48,48,48,0.18)] transition hover:-translate-y-0.5 hover:bg-[#1f1f1f]"
            >
              เข้าสู่ระบบ
            </Link>
          )}
          <button
            type="button"
            aria-label={open ? "ปิดเมนู" : "เปิดเมนู"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-2xl border border-[#f0dfc8] bg-white text-[#303030] transition hover:border-[#ea721f] md:hidden"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-[#f0dfc8] bg-white px-5 py-4 sm:px-8 md:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-3 text-base font-semibold text-[#5c5148] transition hover:text-[#ea721f]"
              >
                {item.label}
              </Link>
            ))}
            {session?.authenticated && session.user ? (
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#fff1e6] px-4 text-sm font-semibold text-[#d55d11] border border-[#ea721f]/30"
              >
                {displayName} — บัญชีของฉัน
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#303030] px-4 text-sm font-semibold text-white"
              >
                เข้าสู่ระบบ
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
