import Link from "next/link";
import Image from "next/image";
import { ArrowIcon } from "../components/beyondlab/icons";
import { portfolioCategories } from "../components/beyondlab/data";

export const metadata = {
  title: "Projects | BeyondLab",
  description: "รวบรวมโปรเจกต์ เดโม คอร์ส และกรณีศึกษาของ BeyondLab",
};

export default function PortfolioPage() {
  return (
    <section className="px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold text-[#ea721f]">Projects</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#303030] sm:text-5xl">โปรเจกต์ของ BeyondLab</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600">
            รวมผลงาน คอร์ส โปรดักต์ และกรณีศึกษาที่ BeyondLab มีส่วนช่วยออกแบบ สอน ให้คำปรึกษา
            หรือพัฒนาเป็นเครื่องมือใช้งานจริง
          </p>
        </div>

        <div className="space-y-10">
          {portfolioCategories.map((category) => (
            <section key={category.title}>
              <div className="mb-5">
                <p className="text-sm font-semibold text-[#ea721f]">{category.title}</p>
              </div>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {category.items.map((item) => {
                  const href = "href" in item ? item.href : undefined;
                  const image = "image" in item ? item.image : undefined;
                  const content = (
                    <>
                      {image && (
                        <div className="relative aspect-[16/9] overflow-hidden">
                          <Image
                            src={image}
                            alt={item.title}
                            fill
                            sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 95vw"
                            className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                          />
                          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent" />
                        </div>
                      )}
                      <div className={`flex flex-col p-5 ${image ? "min-h-[205px]" : "min-h-[300px]"}`}>
                        <span className="inline-flex w-fit items-center rounded-lg border border-[#f6c37f] bg-[#fff4df] px-3 py-1 text-xs font-semibold text-[#ea721f]">
                          {item.badge}
                        </span>
                        <h2 className="mt-3 text-xl font-semibold leading-snug text-[#303030]">{item.title}</h2>
                        {item.description && (
                          <p className="mt-3 text-sm leading-6 text-gray-600">{item.description}</p>
                        )}
                        {href && (
                          <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-[#ea721f]">
                            {href.startsWith("http") ? "เปิดโปรดักต์" : "ดูรายละเอียด"}
                            <span className="transition group-hover:translate-x-0.5">
                              <ArrowIcon />
                            </span>
                          </span>
                        )}
                      </div>
                    </>
                  );

                  const className =
                    "group block overflow-hidden rounded-[22px] bg-white shadow-[0_12px_34px_rgba(48,48,48,0.07)] transition hover:-translate-y-0.5";

                  if (!href) {
                    return (
                      <article key={item.title} className={className}>
                        {content}
                      </article>
                    );
                  }

                  if (href.startsWith("http")) {
                    return (
                      <a key={item.title} href={href} target="_blank" rel="noreferrer" className={className}>
                        {content}
                      </a>
                    );
                  }

                  return (
                    <Link key={item.title} href={href} className={className}>
                      {content}
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
