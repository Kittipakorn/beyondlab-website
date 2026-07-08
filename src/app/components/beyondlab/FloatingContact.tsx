import Image from "next/image";
import { contactChannels } from "./data";

export function FloatingContact() {
  const primary =
    contactChannels.find((channel) => channel.label === "LINE Official" && channel.href) ??
    contactChannels.find((channel) => channel.href);

  if (!primary || !primary.href) return null;

  return (
    <a
      href={primary.href}
      target="_blank"
      rel="noreferrer"
      aria-label={`ติดต่อ BeyondLab ทาง ${primary.label}`}
      className="group fixed bottom-6 right-5 z-40 flex h-14 items-center gap-2 rounded-full bg-[#111111] pl-3 pr-3 text-white shadow-[0_20px_50px_rgba(17,17,17,0.35)] transition hover:-translate-y-0.5 hover:pr-5 sm:right-8"
    >
      <Image src={primary.logo} alt="" width={32} height={32} className="h-8 w-8 flex-none object-contain" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 group-hover:max-w-[8rem]">
        ทักเราเลย
      </span>
    </a>
  );
}
