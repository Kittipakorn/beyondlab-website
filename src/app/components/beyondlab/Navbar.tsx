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
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";
    fetch(`${backendUrl}/auth/session`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : { authenticated: false }))
      .then((data) => setSession(data))
      .catch(() => setSession({ authenticated: false }))
      .finally(() => setLoading(false));
  }, []);

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
              className="px-2 py-2 text-sm font-semibold text-[#5c5148] transition hover:text-[#ea721f]"
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
                {session.user.username.charAt(0).toUpperCase()}
              </span>
              <span className="hidden sm:inline">{session.user.username}</span>
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
                {session.user.username} — บัญชีของฉัน
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