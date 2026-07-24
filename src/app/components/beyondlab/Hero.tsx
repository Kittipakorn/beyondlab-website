import Link from "next/link";
import Image from "next/image";
import { ArrowIcon } from "./icons";
import { mentorStats } from "./data";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-5 pb-8 pt-8 sm:px-8 sm:pb-12 sm:pt-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[linear-gradient(180deg,#fff7ec,rgba(255,247,236,0))]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
        <div className="relative">
          <div className="mb-5 flex flex-wrap items-center gap-2 text-xs font-semibold text-[#303030]">
            {["Learning", "Building", "Sharing"].map((item) => (
              <span key={item} className="rounded-full border border-[#f0dfc8] bg-white px-4 py-2 shadow-[0_10px_24px_rgba(48,48,48,0.05)]">
                {item}
              </span>
            ))}
          </div>
          <p className="mb-3 text-base font-semibold text-[#ea721f] sm:text-lg">
            ห้องทดลองของคนที่อยากก้าวข้ามขีดจำกัด
          </p>
          <h1 className="max-w-4xl text-4xl font-semibold leading-[1.04] text-[#303030] sm:text-5xl lg:text-[64px]">
            BeyondLab
            <span className="mt-2 block text-2xl leading-tight text-[#5c5148] sm:text-3xl lg:text-4xl">
              เรียนรู้ ทดลอง และสร้างผลงานจริง
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#454545] sm:text-base">
            พื้นที่สำหรับคนที่อยากเรียนรู้สายเทคแบบลงมือทำจริง ผ่านคอร์สพื้นฐาน
            การปรึกษาโปรเจกต์ เดโม เครื่องมือ และบริการที่ช่วยให้ไอเดียกลายเป็นผลงานที่จับต้องได้
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/#services"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#303030] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(48,48,48,0.18)] transition hover:-translate-y-0.5 sm:w-auto"
            >
              ดูบริการ
              <ArrowIcon />
            </Link>
            <Link
              href="/#courses"
              className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-[#eeeeee] bg-white px-5 text-sm font-semibold text-[#303030] shadow-[0_10px_24px_rgba(48,48,48,0.07)] transition hover:-translate-y-0.5 sm:w-auto"
            >
              ดูคอร์สเรียน
            </Link>
          </div>
          <div className="mt-5 flex flex-wrap">
            {mentorStats.map((stat) => (
              <div
                key={stat.label}
                className="relative w-1/2 px-4 py-2 text-center sm:w-1/4 sm:after:absolute sm:after:right-0 sm:after:top-1/2 sm:after:h-14 sm:after:w-px sm:after:-translate-y-1/2 sm:after:bg-[#f0dfc8] sm:last:after:hidden"
              >
                <p className="text-2xl font-semibold leading-none text-[#303030]">{stat.value}</p>
                <p className="mx-auto mt-2 max-w-[8rem] text-[11px] leading-4 text-[#666]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative w-full max-w-md mx-auto">
          {/* ส่วนของรูปภาพที่มีการเฟดจางโดยใช้ CSS Mask */}
          <div className="relative aspect-[802/732] w-full bg-transparent [mask-image:linear-gradient(to_top,rgba(0,0,0,0)_0%,rgba(0,0,0,0.25)_12%,rgba(0,0,0,0.85)_45%,rgba(0,0,0,1)_60%)] [-webkit-mask-image:linear-gradient(to_top,rgba(0,0,0,0)_0%,rgba(0,0,0,0.25)_12%,rgba(0,0,0,0.85)_45%,rgba(0,0,0,1)_60%)]">
            <Image
              src="/hero-tutors-v2.png"
              alt="BeyondLab Tutors"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 95vw"
              className="object-contain"
            />
          </div>
          
          {/* ป้ายชื่อลอยแบบมินิมอล อยู่นอกเฟดเพื่อให้อ่านได้คมชัด 100% */}
          <div className="absolute left-[2%] top-[55%] z-20 rounded-xl bg-white/90 px-3 py-1.5 shadow-[0_8px_20px_rgba(48,48,48,0.08)] border border-[#f0dfc8]/50 backdrop-blur-sm transition hover:scale-105">
            <p className="text-[11px] font-bold text-[#303030] leading-none">พี่โม</p>
            <p className="text-[9px] text-[#ea721f] font-bold leading-none mt-1">CEDT Chula</p>
          </div>

          <div className="absolute right-[2%] top-[48%] z-20 rounded-xl bg-white/90 px-3 py-1.5 shadow-[0_8px_20px_rgba(48,48,48,0.08)] border border-[#f0dfc8]/50 backdrop-blur-sm transition hover:scale-105">
            <p className="text-[11px] font-bold text-[#303030] leading-none">พี่มิคค์</p>
            <p className="text-[9px] text-[#ea721f] font-bold leading-none mt-1">CEDT Chula</p>
          </div>
        </div>
      </div>
    </section>
  );
}
