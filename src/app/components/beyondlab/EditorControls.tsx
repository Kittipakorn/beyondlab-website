"use client";

type FontSizeControlProps = {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  dark?: boolean;
};

export function FontSizeControl({ value, min = 12, max = 22, onChange, dark = false }: FontSizeControlProps) {
  return (
    <div className={`grader-font-controls hidden items-center rounded-xl border sm:flex ${dark ? "border-[#364152] bg-[#202936]" : "border-[#ded6cc] bg-white"}`} aria-label="ปรับขนาดตัวอักษร">
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} aria-label="ลดขนาดตัวอักษร" className={`grid h-11 w-10 cursor-pointer place-items-center text-sm font-bold transition hover:text-[#ea721f] ${dark ? "text-[#dce4ee]" : "text-[#514a44]"}`}>A-</button>
      <span className={`w-8 text-center text-xs font-bold ${dark ? "text-[#9ca8b8]" : "text-[#83786e]"}`}>{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} aria-label="เพิ่มขนาดตัวอักษร" className={`grid h-11 w-10 cursor-pointer place-items-center text-base font-bold transition hover:text-[#ea721f] ${dark ? "text-[#dce4ee]" : "text-[#514a44]"}`}>A+</button>
    </div>
  );
}
