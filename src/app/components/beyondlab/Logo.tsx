import Image from "next/image";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-8 w-8 flex-none overflow-hidden bg-transparent">
        <Image
          src="/logo-v2.png"
          alt="BeyondLab Logo"
          fill
          sizes="32px"
          className="object-contain"
        />
      </div>
      <span className="text-sm font-semibold leading-tight text-[#303030]">BeyondLab<br />Academy</span>
    </div>
  );
}
