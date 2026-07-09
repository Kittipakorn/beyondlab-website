import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "./icons";
import { visibleServices } from "./data";

const serviceUnits = [
  {
    name: "BeyondLab Project Mentor",
    type: "Consulting Unit",
    promise: "ทีมช่วยวางแผนและให้คำปรึกษาโปรเจกต์",
  },
  {
    name: "BeyondLab Academy",
    type: "Learning Unit",
    promise: "สายคอร์สเรียนสำหรับเริ่มต้นและต่อยอดทักษะ",
  },
  {
    name: "QuizFlow",
    type: "Product Unit",
    promise: "เครื่องมือช่วยสร้างข้อสอบและเอกสารการสอน",
  },
];

function getUnitImage(serviceTitle: string) {
  if (serviceTitle === "คอร์สเรียน") return "/courses/zero-to-code.png";
  return null;
}

function getImageClassName(serviceTitle: string) {
  if (serviceTitle === "คอร์สเรียน" || serviceTitle === "QuizFlow") return "object-contain object-center p-3";
  return "object-cover object-top";
}

export function ServicesSection() {
  const orderedServices = [visibleServices[1], visibleServices[0], visibleServices[2]].filter(Boolean);
  const [featuredService, ...otherServices] = orderedServices;
  const [featuredUnit, ...otherUnits] = serviceUnits;

  return (
    <section className="px-5 py-9 sm:px-8" id="services">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7">
          <p className="text-sm font-semibold text-[#ea721f]">Services</p>
          <h2 className="mt-2 pt-1 text-2xl font-semibold leading-tight text-[#303030] sm:text-3xl">
            กลุ่มบริการของ BeyondLab
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <article className="flex flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_12px_30px_rgba(48,48,48,0.07)]">
            <div className="relative aspect-video overflow-hidden bg-[#fff8ed]">
              {featuredService.image && (
                <Image
                  src={featuredService.image}
                  alt={featuredService.title}
                  fill
                  sizes="(min-width: 1024px) 50vw, 95vw"
                  className="object-cover object-top"
                />
              )}
              <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white/80 to-transparent" />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-[#ea721f]">01</span>
                <span className="rounded-full bg-[#fff4df] px-3 py-1 text-xs font-semibold text-[#ea721f]">
                  {featuredUnit.type}
                </span>
              </div>
              <h3 className="mt-3 text-3xl font-semibold leading-tight text-[#303030]">
                {featuredUnit.name}
                <span className="ml-2 inline-block align-middle text-xs font-semibold text-[#8b8178]">
                  by BeyondLab
                </span>
              </h3>
              <p className="mt-2 text-sm font-semibold text-[#ea721f]">{featuredUnit.promise}</p>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#555]">{featuredService.description}</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {featuredService.points.slice(0, 2).map((point) => (
                  <div key={point} className="flex items-start gap-2 text-sm leading-6 text-[#555]">
                    <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[#ea721f]" />
                    {point}
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <Link
                  href={featuredService.href || "/#contact"}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#303030] px-4 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                >
                  {featuredService.cta || "ดูรายละเอียด"}
                  <ArrowIcon />
                </Link>
              </div>
            </div>
          </article>

          <div className="grid gap-5">
            {otherServices.map((service, index) => (
              <article
                key={service.title}
                className="grid overflow-hidden rounded-[24px] bg-white shadow-[0_12px_30px_rgba(48,48,48,0.07)] transition hover:-translate-y-0.5 sm:grid-cols-[220px_1fr]"
              >
                <div className="relative min-h-[150px] bg-[#fff8ed]">
                  {(getUnitImage(service.title) || service.image) && (
                    <Image
                      src={getUnitImage(service.title) || service.image || ""}
                      alt={service.title}
                      fill
                      sizes="(min-width: 1024px) 220px, 95vw"
                      className={getImageClassName(service.title)}
                    />
                  )}
                </div>
                <div className="flex flex-col p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-[#ea721f]">
                      {String(index + 2).padStart(2, "0")}
                    </span>
                    <span className="rounded-full bg-[#fff4df] px-3 py-1 text-xs font-semibold text-[#ea721f]">
                      {otherUnits[index].type}
                    </span>
                  </div>
                  <h3 className="mt-3 text-2xl font-semibold leading-tight text-[#303030]">
                    {otherUnits[index].name}
                    <span className="ml-2 inline-block align-middle text-xs font-semibold text-[#8b8178]">
                      by BeyondLab
                    </span>
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-[#ea721f]">{otherUnits[index].promise}</p>
                  <p className="mt-2 text-sm leading-6 text-[#555]">{service.description}</p>
                  <div className="mt-auto pt-4">
                    {service.href?.startsWith("http") ? (
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
                        href={service.href || "/#contact"}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#303030] px-4 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                      >
                        {service.cta || "ติดต่อสอบถาม"}
                        <ArrowIcon />
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
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
