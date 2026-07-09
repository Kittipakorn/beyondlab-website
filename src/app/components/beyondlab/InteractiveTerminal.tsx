const buildSteps = [
  {
    label: "คอร์สเรียน",
    title: "ปูพื้นให้เข้าใจจริง",
    text: "เริ่มจากหลักการสำคัญ ฝึกคิดเป็นขั้นตอน และมีโจทย์ให้ลองทำจนเห็นพัฒนาการของตัวเอง",
  },
  {
    label: "รับปรึกษา",
    title: "ช่วยจัดทางให้โปรเจกต์ไปต่อ",
    text: "คุยไอเดีย เลือกเครื่องมือ วางแผนงาน และแก้จุดติดขัดให้โปรเจกต์ชัดขึ้นทีละขั้น",
  },
  {
    label: "โปรเจกต์",
    title: "ต่อยอดเป็นชิ้นงานจริง",
    text: "เปลี่ยนสิ่งที่เรียนและลองทำให้กลายเป็นผลงานที่อธิบายได้ ใช้ต่อยอดพอร์ตหรือเส้นทางของตัวเอง",
  },
];

export function InteractiveTerminal() {
  return (
    <section className="px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[24px] bg-[#303030] text-white shadow-[0_18px_52px_rgba(48,48,48,0.15)]">
        <div className="grid gap-8 p-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:p-8">
          <div>
            <p className="text-sm font-semibold text-[#f7c56d]">Build Something Real</p>
            <h2 className="mt-2 max-w-xl pt-1 text-2xl font-semibold leading-tight sm:text-3xl">
              เรียนรู้ ทดลอง และต่อยอดเป็นผลงานจริง
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#f0e8dc]">
              BeyondLab พาคนเรียนจากความเข้าใจพื้นฐาน ไปสู่การลงมือทำ มี feedback ระหว่างทาง
              และเห็นภาพว่าจะต่อยอดสิ่งที่ทำไปใช้จริงได้อย่างไร
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {buildSteps.map((item, index) => (
              <div
                key={item.label}
                className="min-h-[210px] rounded-2xl border border-white/10 bg-white/[0.07] p-4 transition hover:-translate-y-0.5 hover:bg-white/[0.1]"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[#f7c56d]">{item.label}</p>
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-xs font-semibold text-[#f7c56d]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold leading-snug text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#f0e8dc]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
