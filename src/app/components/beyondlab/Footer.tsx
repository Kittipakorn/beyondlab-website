import Link from "next/link";
import { Logo } from "./Logo";
import { contactChannels, navItems } from "./data";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 px-5 py-14 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Link href="/">
            <Logo />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-gray-500">
            ติวเขียนโปรแกรมโอลิมปิก C++ โดยพี่โมและพี่มิก วิศวะคอม (CEDT) จุฬาฯ
            ผู้แทนศูนย์ สอวน. โอลิมปิกคอมพิวเตอร์ 2 ปีซ้อน
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">เมนู</p>
          <div className="mt-4 grid gap-3">
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
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">ติดต่อ</p>
          <div className="mt-4 grid gap-3">
            {contactChannels.map((channel) =>
              channel.href ? (
                <a
                  key={channel.label}
                  href={channel.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-gray-500 transition hover:text-[#111111]"
                >
                  {channel.label}
                </a>
              ) : (
                <span key={channel.label} className="text-sm font-medium text-gray-400">
                  {channel.label} · เร็วๆ นี้
                </span>
              )
            )}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-7xl border-t border-gray-200 pt-6 text-xs text-gray-400">
        © {new Date().getFullYear()} BeyondLab. All rights reserved.
      </div>
    </footer>
  );
}
