import { tutors } from "./data";

export function TerminalVisual() {
  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div className="relative min-h-[420px] overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,#fffaf2,#ffffff)]">
        <div className="absolute left-1/2 top-10 h-64 w-64 -translate-x-1/2 rounded-full bg-[#f5efe6]" />
        <div className="absolute right-8 top-16 h-16 w-20 rotate-12 border-t-2 border-[#ea721f] opacity-70 before:absolute before:right-2 before:top-0 before:h-10 before:w-10 before:rotate-45 before:border-r-2 before:border-t-2 before:border-[#ea721f]" />
        <div className="absolute left-6 top-20 rounded-[22px] bg-[linear-gradient(90deg,#fff,#ffe3ad)] px-4 py-3 shadow-[0_14px_34px_rgba(48,48,48,0.1)]">
          <p className="text-xs font-semibold uppercase text-[#ea721f]">For</p>
          <p className="mt-1 text-xl font-semibold text-[#303030]">All Paths</p>
          <p className="text-sm text-[#555]">เรียน ปรึกษา สร้างผลงาน</p>
        </div>
        <div className="absolute bottom-36 left-1/2 h-44 w-32 -translate-x-[35%] rounded-t-full bg-[linear-gradient(180deg,#303030,#76543a)] opacity-95 shadow-[0_22px_44px_rgba(48,48,48,0.18)]" />
        <div className="absolute bottom-44 left-1/2 h-20 w-20 -translate-x-[35%] rounded-full bg-[linear-gradient(180deg,#f1d0b0,#e8b184)] shadow-[0_16px_28px_rgba(48,48,48,0.1)]">
          <div className="absolute left-4 top-10 h-2 w-2 rounded-full bg-[#303030]" />
          <div className="absolute right-4 top-10 h-2 w-2 rounded-full bg-[#303030]" />
          <div className="absolute left-7 top-16 h-1 w-10 rounded-full bg-[#8f5f45]" />
        </div>
        <div className="absolute bottom-24 left-6 right-6 grid gap-3 sm:grid-cols-2">
          {tutors.map((tutor) => (
            <div key={tutor.name} className="rounded-2xl bg-white/95 p-4 shadow-[0_14px_34px_rgba(48,48,48,0.12)]">
              <p className="text-xs font-semibold uppercase text-[#ea721f]">Mentor</p>
              <h3 className="mt-1 text-xl font-semibold text-[#303030]">{tutor.name}</h3>
              <p className="mt-1 text-sm text-[#555]">วิศวะคอม จุฬาฯ (CEDT)</p>
            </div>
          ))}
        </div>
        <div className="absolute bottom-5 left-6 right-6 grid grid-cols-3 gap-2 text-center">
          {["Learn", "Build", "Grow"].map((item) => (
            <div key={item} className="rounded-xl bg-[#fff7ef] px-3 py-3 text-xs font-semibold text-[#ea721f] shadow-[0_10px_24px_rgba(48,48,48,0.07)]">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
