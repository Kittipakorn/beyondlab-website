import { aboutStats, tutors } from "./data";

export function AboutTutors() {
  return (
    <section className="border-y border-gray-200 bg-[#FAFAFA] px-5 py-24 sm:px-8" id="about">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4F8CFF]">About BeyondLab</p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-6xl">ติวโดยรุ่นพี่ที่ผ่านสนามจริง</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {aboutStats.map(([value, label]) => (
            <div
              key={label}
              className="rounded-[24px] border border-gray-200 bg-white p-7 shadow-[0_16px_50px_rgba(17,17,17,0.04)]"
            >
              <p className="text-4xl font-black tracking-[-0.05em] text-[#111111]">{value}</p>
              <p className="mt-2 text-sm leading-6 text-gray-500">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {tutors.map((tutor) => (
            <div
              key={tutor.name}
              className="rounded-[24px] border border-gray-200 bg-white p-7 shadow-[0_18px_60px_rgba(17,17,17,0.05)]"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black tracking-[-0.04em]">{tutor.name}</h3>
                <span className="text-sm font-semibold text-[#4F8CFF]">{tutor.handle}</span>
              </div>
              <p className="mt-1 text-sm font-medium text-gray-500">{tutor.role}</p>
              <ul className="mt-5 grid gap-2">
                {tutor.credentials.map((credential) => (
                  <li key={credential} className="flex items-start gap-2 text-sm leading-6 text-gray-600">
                    <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[#4F8CFF]" />
                    {credential}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
