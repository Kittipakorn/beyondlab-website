import { proofItems } from "./data";

export function SocialProof() {
  return (
    <section className="border-y border-gray-200 bg-[#FAFAFA] px-5 py-10 sm:px-8" id="about">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
        {proofItems.map(([value, label]) => (
          <div
            key={value}
            className="rounded-[24px] border border-gray-200 bg-white p-7 shadow-[0_16px_50px_rgba(17,17,17,0.04)]"
          >
            <p className="text-4xl font-black tracking-[-0.05em] text-[#111111]">{value}</p>
            <p className="mt-2 text-sm leading-6 text-gray-500">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
