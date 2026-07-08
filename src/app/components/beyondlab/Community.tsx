import Image from "next/image";
import { contactChannels } from "./data";

export function Community() {
  return (
    <section className="px-5 py-12 sm:px-8" id="contact">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold text-[#ea721f]">Contact</p>
            <h2 className="mt-2 pt-1 text-2xl font-semibold leading-tight text-[#303030] sm:text-3xl">
              คุยกับ BeyondLab ได้จากช่องทางที่สะดวก
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#555]">
              สอบถามคอร์สเรียน ปรึกษาโปรเจกต์ ดู QuizFlow หรือติดตามอัปเดตของ BeyondLab ได้จากช่องทางเหล่านี้
            </p>
          </div>
          <div className="grid gap-4">
            {contactChannels.map((channel) =>
              channel.href ? (
                <a
                  key={channel.label}
                  href={channel.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 rounded-[20px] bg-white p-4 shadow-[0_12px_30px_rgba(48,48,48,0.07)] transition hover:-translate-y-0.5"
                >
                  {channel.logo ? (
                    <Image
                      src={channel.logo}
                      alt={`${channel.label} logo`}
                      width={44}
                      height={44}
                      className="h-11 w-11 flex-none object-contain"
                    />
                  ) : (
                    <span className="grid h-11 w-11 flex-none place-items-center rounded-2xl bg-[#fff4df] text-sm font-semibold text-[#ea721f]">
                      Web
                    </span>
                  )}
                  <div className="flex-1">
                    <span className="text-base font-semibold text-[#303030]">{channel.label}</span>
                    <p className="mt-1 text-sm text-[#555]">{channel.description}</p>
                  </div>
                  <span className="text-sm font-semibold text-[#ea721f]">↗</span>
                </a>
              ) : (
                <div
                  key={channel.label}
                  className="flex items-center gap-4 rounded-[20px] border border-dashed border-[#f0dfc8] bg-white p-4"
                >
                  {channel.logo ? (
                    <Image
                      src={channel.logo}
                      alt={`${channel.label} logo`}
                      width={44}
                      height={44}
                      className="h-11 w-11 flex-none object-contain opacity-40 grayscale"
                    />
                  ) : (
                    <span className="grid h-11 w-11 flex-none place-items-center rounded-2xl bg-[#FAFAFA] text-sm font-semibold text-[#8b958e]">
                      Web
                    </span>
                  )}
                  <div className="flex-1">
                    <span className="text-lg font-semibold text-[#8b958e]">{channel.label}</span>
                    <p className="mt-1 text-sm text-[#8b958e]">{channel.description}</p>
                  </div>
                  <span className="rounded-full border border-[#f0dfc8] bg-white px-3 py-1 text-xs font-semibold text-[#8b958e]">
                    เร็วๆ นี้
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
