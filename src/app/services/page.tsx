import Link from "next/link";
import { ArrowIcon } from "../components/beyondlab/icons";
import { visibleServices } from "../components/beyondlab/data";

export const metadata = {
  title: "บริการ | BeyondLab",
  description: "บริการคอร์สเรียน รับปรึกษา และ QuizFlow ของ BeyondLab",
};

export default function ServicesPage() {
  return (
    <section className="px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold text-[#ea721f]">Services</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#303030] sm:text-5xl">งานที่เปิดรับ</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600">
            บริการหลักของ BeyondLab ที่เปิดรับและใช้งานได้ตอนนี้
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {visibleServices.map((service) => (
            <div
              key={service.title}
              className="flex min-h-[290px] flex-col rounded-[22px] bg-white p-5 shadow-[0_12px_34px_rgba(48,48,48,0.07)]"
            >
              <span
                className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${
                  service.status === "open"
                    ? "bg-[#fff4df] text-[#ea721f]"
                    : "border border-[#f0dfc8] bg-[#FAFAFA] text-gray-400"
                }`}
              >
                {service.tag}
              </span>
              <h2 className="mt-3 text-xl font-semibold">{service.title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">{service.description}</p>
              {service.points.length > 0 && (
                <ul className="mt-4 grid gap-2">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm leading-6 text-gray-600">
                      <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[#ea721f]" />
                      {point}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-auto pt-6">
                {service.href ? (
                  <a
                    href={service.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#303030] px-4 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5"
                  >
                    เปิดใช้งาน
                    <ArrowIcon />
                  </a>
                ) : service.status === "open" ? (
                  <Link
                    href="/#contact"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#303030] px-4 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5"
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
          ))}
        </div>
      </div>
    </section>
  );
}
