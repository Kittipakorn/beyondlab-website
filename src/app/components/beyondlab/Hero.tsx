import Link from "next/link";
import { ArrowIcon } from "./icons";
import { TerminalVisual } from "./TerminalVisual";

export function Hero() {
  return (
    <section className="relative px-5 pb-20 pt-24 sm:px-8 sm:pb-28 sm:pt-32">
      <div className="absolute left-1/2 top-0 -z-10 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(79,140,255,0.18),transparent_62%)] blur-3xl" />
      <div className="mx-auto max-w-7xl text-center">
        <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-[#4F8CFF] shadow-[0_0_18px_rgba(79,140,255,0.9)]" />
          🧑‍💻 เรียนเขียนโปรแกรมโอลิมปิก C++
        </div>
        <h1 className="mx-auto max-w-5xl text-6xl font-black tracking-[-0.07em] text-[#111111] sm:text-7xl lg:text-[112px] lg:leading-[0.9]">
          BeyondLab
        </h1>
        <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-gray-600 sm:text-xl">
          🔥 ติวเข้มโดยพี่โม @kittmkrn_ และพี่มิก @onyou_exe วิศวะคอม (CEDT) จุฬาฯ
          ผู้แทนศูนย์ สอวน. โอลิมปิกคอมพิวเตอร์ 2 ปีซ้อน
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/#community"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#111111] px-6 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(17,17,17,0.18)] transition hover:-translate-y-0.5 sm:w-auto"
          >
            เริ่มติวกับเรา
            <ArrowIcon />
          </Link>
          <a
            href="#roadmap"
            className="inline-flex h-12 w-full items-center justify-center rounded-full border border-gray-200 bg-white px-6 text-sm font-semibold text-[#111111] shadow-sm transition hover:-translate-y-0.5 hover:border-gray-300 sm:w-auto"
          >
            ดูโรดแมป
          </a>
        </div>
        <TerminalVisual />
      </div>
    </section>
  );
}
