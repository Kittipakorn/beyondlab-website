import Image from "next/image";
import Link from "next/link";
import { Logo } from "./Logo";
import { contactChannels, navItems } from "./data";

export function Footer() {
  return (
    <footer className="border-t border-[#f0dfc8] bg-white px-5 py-14 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Link href="/">
            <Logo />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-gray-500">
            ห้องทดลองของคนที่อยากก้าวข้ามขีดจำกัด เริ่มจากคอร์สเรียน รับปรึกษา
            และโปรเจกต์ที่ต่อยอดเป็นผลงานจริง
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">เมนู</p>
          <div className="mt-4 grid gap-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-semibold text-gray-500 transition hover:text-[#ea721f]"
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
                  className="flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#ea721f]"
                >
                  {channel.logo ? (
                    <Image src={channel.logo} alt="" width={16} height={16} className="h-4 w-4 object-contain" />
                  ) : (
                    <span className="grid h-4 w-4 place-items-center rounded bg-[#fff4df] text-[8px] font-semibold text-[#ea721f]">
                      W
                    </span>
                  )}
                  {channel.label}
                </a>
              ) : (
                <span key={channel.label} className="flex items-center gap-2 text-sm font-semibold text-gray-400">
                  {channel.logo ? (
                    <Image
                      src={channel.logo}
                      alt=""
                      width={16}
                      height={16}
                      className="h-4 w-4 object-contain opacity-40 grayscale"
                    />
                  ) : (
                    <span className="grid h-4 w-4 place-items-center rounded bg-gray-100 text-[8px] font-semibold text-gray-400">
                      W
                    </span>
                  )}
                  {channel.label} · เร็วๆ นี้
                </span>
              )
            )}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-7xl border-t border-[#f0dfc8] pt-6 text-xs text-gray-400">
        © {new Date().getFullYear()} BeyondLab. All rights reserved.
      </div>
    </footer>
  );
}
