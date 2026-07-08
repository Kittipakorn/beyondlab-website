export function InteractiveTerminal() {
  return (
    <section className="border-y border-gray-200 bg-[#FAFAFA] px-5 py-24 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4F8CFF]">Judge Terminal</p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-6xl">
            ทุกโจทย์ต้องกลายเป็น Accepted
          </h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-gray-600">
            ฝึกทำโจทย์ compile และ submit ซ้ำ ๆ จนคุ้นเคยกับบรรยากาศห้องแข่งจริง
            เพราะทักษะเกิดจากการลงมือแก้โจทย์ซ้ำ ๆ ไม่ใช่แค่ฟังทฤษฎี
          </p>
        </div>
        <div className="rounded-[24px] border border-gray-200 bg-[#0d1117] p-6 font-mono text-sm text-gray-200 shadow-[0_30px_90px_rgba(17,17,17,0.18)]">
          <p className="text-gray-500">/ beyondlab judge</p>
          <p className="mt-6">&gt; g++ solution.cpp -o solution</p>
          <p className="mt-2 text-emerald-300">&gt; ✓ compiled</p>
          <p className="mt-6">&gt; submit solution.cpp</p>
          <p className="mt-2 text-emerald-300">&gt; ✓ Accepted</p>
          <p className="mt-6">&gt; join beyondlab</p>
          <p className="mt-2 text-emerald-300">&gt; ✓ contest mode activated</p>
        </div>
      </div>
    </section>
  );
}
