import { contactChannels } from "./data";

export function Community() {
  return (
    <section className="px-5 py-24 sm:px-8" id="community">
      <div className="mx-auto max-w-7xl rounded-[24px] border border-gray-200 bg-white p-8 shadow-[0_24px_90px_rgba(17,17,17,0.08)] sm:p-12">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4F8CFF]">Community & Contact</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-6xl">
              ไม่ใช่แค่ห้องเรียน แต่คือ network ของนักแข่ง
            </h2>
          </div>
          <div className="grid gap-4">
            {contactChannels.map((channel) =>
              channel.href ? (
                <a
                  key={channel.label}
                  href={channel.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-2xl border border-gray-200 bg-[#FAFAFA] p-5 transition hover:border-gray-300"
                >
                  <div>
                    <span className="text-lg font-bold tracking-[-0.03em]">{channel.label}</span>
                    <p className="mt-1 text-sm text-gray-500">{channel.description}</p>
                  </div>
                  <span className="text-[#4F8CFF]">↗</span>
                </a>
              ) : (
                <div
                  key={channel.label}
                  className="flex items-center justify-between rounded-2xl border border-dashed border-gray-200 bg-[#FAFAFA] p-5"
                >
                  <div>
                    <span className="text-lg font-bold tracking-[-0.03em] text-gray-400">{channel.label}</span>
                    <p className="mt-1 text-sm text-gray-400">{channel.description}</p>
                  </div>
                  <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-400">
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
