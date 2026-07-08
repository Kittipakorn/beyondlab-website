import { aboutStats, tutors } from "./data";

export function AboutTutors() {
  return (
    <section className="bg-transparent px-5 py-8 sm:px-8" id="about">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 grid gap-4 lg:grid-cols-[0.8fr_1fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold text-[#ea721f]">About BeyondLab</p>
            <h2 className="mt-2 text-3xl font-semibold leading-tight text-[#303030] sm:text-4xl">พื้นที่เรียนรู้ ทดลอง และลงมือทำ</h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-[#555]">
            BeyondLab ช่วยให้มือใหม่ คนทำพอร์ต และคนอยากทำโปรเจกต์ เริ่มจากไอเดียแล้วค่อย ๆ เปลี่ยนเป็นผลงานจริง
            ผ่านการเรียนรู้ การปรึกษา และการทดลองสร้าง
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {aboutStats.map(([value, label]) => (
            <div
              key={label}
              className="rounded-[22px] bg-white p-5 shadow-[0_12px_30px_rgba(48,48,48,0.07)]"
            >
              <p className="text-2xl font-semibold text-[#303030]">{value}</p>
              <p className="mt-2 text-sm leading-6 text-[#555]">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {tutors.map((tutor) => (
            <div
              key={tutor.name}
              className="rounded-[22px] bg-white p-5 shadow-[0_12px_30px_rgba(48,48,48,0.07)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-xl font-semibold text-[#303030]">{tutor.name}</h3>
                <span className="rounded-full bg-[#fff4df] px-3 py-1 text-sm font-semibold text-[#ea721f]">{tutor.handle}</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-[#555]">{tutor.role}</p>
              <ul className="mt-4 grid gap-2">
                {tutor.credentials.map((credential) => (
                  <li key={credential} className="flex items-start gap-3 text-sm leading-6 text-[#555]">
                    <span className="mt-2 h-2 w-2 flex-none rounded-full bg-[#ea721f]" />
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
