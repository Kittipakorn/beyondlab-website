import Link from "next/link";
import { ArrowIcon } from "../components/beyondlab/icons";
import { services } from "../components/beyondlab/data";

export const metadata = {
  title: "บริการ | BeyondLab",
  description: "บริการสอนเขียนโปรแกรมโอลิมปิก C++ และรับให้คำปรึกษาโดย BeyondLab",
};

export default function ServicesPage() {
  return (
    <section className="px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4F8CFF]">Services</p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-6xl">งานที่เปิดรับ</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600">
            บริการหลักของ BeyondLab พร้อมช่องทางที่จะเปิดรับเพิ่มเติมในอนาคต
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="flex min-h-[340px] flex-col rounded-[24px] border border-gray-200 bg-white p-7 shadow-[0_18px_60px_rgba(17,17,17,0.05)]"
            >
              <span
                className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${
                  service.status === "open"
                    ? "bg-blue-50 text-[#4F8CFF]"
                    : "border border-gray-200 bg-[#FAFAFA] text-gray-400"
                }`}
              >
                {service.tag}
              </span>
              <h2 className="mt-4 text-2xl font-black tracking-[-0.04em]">{service.title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">{service.description}</p>
              {service.points.length > 0 && (
                <ul className="mt-5 grid gap-2">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm leading-6 text-gray-600">
                      <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[#4F8CFF]" />
                      {point}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-auto pt-6">
                {service.status === "open" ? (
                  <Link
                    href="/#community"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#111111] px-5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5"
                  >
                    ติดต่อสอบถาม
                    <ArrowIcon />
                  </Link>
                ) : (
                  <span className="inline-flex h-11 items-center justify-center rounded-full border border-dashed border-gray-200 px-5 text-sm font-semibold text-gray-400">
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
