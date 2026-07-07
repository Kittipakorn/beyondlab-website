import { communityItems } from "./data";

export function Community() {
  return (
    <section className="px-5 py-24 sm:px-8" id="community">
      <div className="mx-auto max-w-7xl rounded-[24px] border border-gray-200 bg-white p-8 shadow-[0_24px_90px_rgba(17,17,17,0.08)] sm:p-12">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4F8CFF]">Community</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-6xl">
              ไม่ใช่แค่ห้องเรียน แต่คือ network ของคนสร้าง
            </h2>
          </div>
          <div className="grid gap-4">
            {communityItems.map((item) => (
              <div key={item} className="flex items-center justify-between rounded-2xl border border-gray-200 bg-[#FAFAFA] p-5">
                <span className="text-lg font-bold tracking-[-0.03em]">{item}</span>
                <span className="text-[#4F8CFF]">↗</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
