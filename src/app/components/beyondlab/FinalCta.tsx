import Link from "next/link";
import { ArrowIcon } from "./icons";

export function FinalCta() {
  return (
    <section id="cta" className="px-5 pb-10 sm:px-8">
      <div className="mx-auto overflow-hidden rounded-[24px] border border-gray-200 bg-[#111111] px-6 py-20 text-center text-white shadow-[0_30px_100px_rgba(17,17,17,0.22)] sm:px-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-5xl font-black tracking-[-0.06em] sm:text-7xl">
            อนาคตของคุณเริ่มจากโจทย์แรก
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-300">
            เข้าร่วม BeyondLab ติวเข้มเขียนโปรแกรมโอลิมปิก C++ กับพี่โมและพี่มิก
            แล้วออกไปพร้อมพื้นฐานที่แน่นและผลงานที่พิสูจน์ได้จริง
          </p>
          <Link
            href="/#community"
            className="mt-10 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-[#111111] transition hover:-translate-y-0.5"
          >
            เริ่มติววันนี้
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
