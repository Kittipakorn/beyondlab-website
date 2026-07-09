import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "./icons";
import { visibleServices } from "./data";

export function ServicesSection() {
  return (
    <section className="px-5 py-9 sm:px-8" id="services">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 grid gap-4 lg:grid-cols-[0.8fr_1fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold text-[#ea721f]">Services</p>
            <h2 className="mt-2 pt-1 text-2xl font-semibold leading-tight text-[#303030] sm:text-3xl">
              บริการที่เปิดอยู่
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-[#555]">
            ตอนนี้ BeyondLab โฟกัสคอร์สเรียน รับปรึกษา และ QuizFlow สำหรับการเรียนรู้และการลงมือทำจริง
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleServices.map((service) => (
            <article
              key={service.title}
              className="flex min-h-[350px] flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_12px_30px_rgba(48,48,48,0.07)]"
            >
              {/* ส่วนหัวภาพเด่น / Shimmer */}
              <div className="relative aspect-[2/1] w-full overflow-hidden">
                {service.image ? (
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 95vw"
                    className="object-cover object-top"
                  />
                ) : (
                  <div className="absolute inset-0 animate-shimmer" />
                )}
                {/* ไล่สีขาวเฟดกลมกลืนด้านล่าง */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
              </div>

              {/* รายละเอียดการ์ด */}
              <div className="flex flex-1 flex-col p-5">
                <span
                  className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${
                    service.status === "open"
                      ? "bg-[#fff4df] text-[#ea721f]"
                      : "border border-[#f0dfc8] bg-[#FAFAFA] text-gray-400"
                  }`}
                >
                  {service.tag}
                </span>
                <h3 className="mt-3 text-xl font-semibold text-[#303030]">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#555]">{service.description}</p>
                {service.points.length > 0 && (
                  <ul className="mt-4 grid gap-2">
                    {service.points.slice(0, 3).map((point) => (
                      <li key={point} className="flex items-start gap-2 text-sm leading-6 text-[#555]">
                        <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[#ea721f]" />
                        {point}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-auto pt-5">
                  {service.href ? (
                    service.href.startsWith("http") ? (
                      <a
                        href={service.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#303030] px-4 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                      >
                        {service.cta || "เปิดใช้งาน"}
                        <ArrowIcon />
                      </a>
                    ) : (
                      <Link
                        href={service.href}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#303030] px-4 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                      >
                        {service.cta || "เปิดใช้งาน"}
                        <ArrowIcon />
                      </Link>
                    )
                  ) : service.status === "open" ? (
                    <Link
                      href="/#contact"
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#303030] px-4 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                    >
                      ติดต่อสอบถาม
                      <ArrowIcon />
                    </Link>
                  ) : (
                    <span className="inline-flex h-10 items-center justify-center rounded-full border border-dashed border-gray-200 px-4 text-sm font-semibold text-gray-400">
                      เร็วๆ นี้
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/services"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#f0dfc8] bg-white px-4 text-sm font-semibold text-[#303030] shadow-[0_10px_24px_rgba(48,48,48,0.07)] transition hover:-translate-y-0.5"
          >
            ดูบริการทั้งหมด
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
