export function InteractiveTerminal() {
  return (
    <section className="px-5 py-8 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 rounded-[24px] bg-[#303030] p-6 text-white shadow-[0_18px_52px_rgba(48,48,48,0.15)] lg:grid-cols-[1fr_1fr] lg:items-center lg:p-8">
        <div>
          <p className="text-sm font-semibold text-[#f7c56d]">Build Something Real</p>
          <h2 className="mt-2 pt-1 text-2xl font-semibold leading-tight sm:text-3xl">
            เรียนแล้วต้องพาไปสู่ของที่จับต้องได้
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#f0e8dc]">
            BeyondLab ไม่ได้เป็นแค่หน้ารวมคอร์ส แต่เป็นพื้นที่ที่ช่วยให้คนเรียนรู้ ลองทำจริง
            ได้ feedback และต่อยอดเป็นผลงานหรือเส้นทางของตัวเอง
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {["คอร์สเรียน", "รับปรึกษา", "QuizFlow", "โปรเจกต์"].map((item) => (
            <div key={item} className="rounded-xl bg-white/10 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]">
              <p className="text-xl font-semibold text-[#f7c56d]">{item}</p>
              <p className="mt-2 text-sm leading-6 text-[#f0e8dc]">เชื่อมกับแนวทาง Learning + Building + Sharing</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
