import { ArrowIcon } from "./icons";
import { Logo } from "./Logo";
import { navItems } from "./data";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200/70 bg-white/80 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Logo />
        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-gray-500 transition hover:text-[#111111]"
            >
              {item.label}
            </a>
          ))}
        </div>
        <a
          href="#cta"
          className="inline-flex h-10 items-center gap-2 rounded-full border border-gray-200 bg-[#111111] px-4 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(17,17,17,0.16)] transition hover:-translate-y-0.5 hover:bg-black"
        >
          เริ่มสร้าง
          <ArrowIcon />
        </a>
      </div>
    </nav>
  );
}
