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
      className="group fixed bottom-5 right-5 z-40 flex h-12 items-center gap-2 rounded-full bg-[#303030] pl-2.5 pr-2.5 text-white shadow-[0_16px_38px_rgba(48,48,48,0.24)] transition hover:-translate-y-0.5 hover:pr-4 sm:right-8"
    >
      {primary.logo ? (
        <Image src={primary.logo} alt="" width={28} height={28} className="h-7 w-7 flex-none object-contain" />
      ) : (
        <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-white/12 text-[10px] font-semibold">
          BL
        </span>
      )}
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 group-hover:max-w-[8rem]">
        ทักเราเลย
      </span>
    </a>
  );
}
