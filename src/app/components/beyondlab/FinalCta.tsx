import { ArrowIcon } from "./icons";

export function FinalCta() {
  return (
    <section id="cta" className="px-5 pb-10 sm:px-8">
      <div className="mx-auto overflow-hidden rounded-[24px] border border-gray-200 bg-[#111111] px-6 py-20 text-center text-white shadow-[0_30px_100px_rgba(17,17,17,0.22)] sm:px-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-5xl font-black tracking-[-0.06em] sm:text-7xl">
            อนาคตของคุณเริ่มจากหนึ่งโปรเจกต์
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-300">
            เข้าสู่ BeyondLab ใช้ AI เป็นพลังเสริม และออกไปพร้อมหลักฐานว่าคุณสร้างสิ่งที่จินตนาการได้จริง
          </p>
          <a
            href="#courses"
            className="mt-10 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-[#111111] transition hover:-translate-y-0.5"
          >
            เริ่มสร้างวันนี้
            <ArrowIcon />
          </a>
        </div>
      </div>
    </section>
  );
}
