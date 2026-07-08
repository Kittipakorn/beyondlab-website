import Link from "next/link";
import { ArrowIcon } from "./icons";

export function FinalCta() {
  return (
    <section id="cta" className="px-5 pb-8 sm:px-8">
      <div className="mx-auto overflow-hidden rounded-[24px] bg-[linear-gradient(90deg,#fff4df,#f7c56d)] px-6 py-10 text-center text-[#303030] shadow-[0_18px_52px_rgba(48,48,48,0.12)] sm:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
            พร้อมทดลองก้าวข้ามขีดจำกัดของตัวเองหรือยัง
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#4b3b2b]">
            ทัก BeyondLab เพื่อคุยเรื่องคอร์สเรียน ปรึกษาโปรเจกต์ หรือเลือกใช้บริการที่ช่วยให้ไอเดียของคุณไปต่อได้จริง
          </p>
          <Link
            href="/#contact"
            className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#303030] px-4 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(48,48,48,0.18)] transition hover:-translate-y-0.5"
          >
            คุยกับเรา
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
