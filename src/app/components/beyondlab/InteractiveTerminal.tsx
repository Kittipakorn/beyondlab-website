export function InteractiveTerminal() {
  return (
    <section className="border-y border-gray-200 bg-[#FAFAFA] px-5 py-24 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4F8CFF]">Interactive Terminal</p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-6xl">
            ทุกบทเรียนต้องกลายเป็น action
          </h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-gray-600">
            สร้าง deploy เรียนรู้ และเข้าคอมมูนิตี้แบบต่อเนื่อง เพราะ momentum ของนักสร้างเกิดจากการลงมือทำซ้ำ ๆ
          </p>
        </div>
        <div className="rounded-[24px] border border-gray-200 bg-[#0d1117] p-6 font-mono text-sm text-gray-200 shadow-[0_30px_90px_rgba(17,17,17,0.18)]">
          <p className="text-gray-500">/ beyondlab terminal</p>
          <p className="mt-6">&gt; create project</p>
          <p className="mt-2 text-emerald-300">&gt; ✓ deployed</p>
          <p className="mt-6">&gt; learn ai</p>
          <p className="mt-2 text-emerald-300">&gt; ✓ workflow unlocked</p>
          <p className="mt-6">&gt; join beyondlab</p>
          <p className="mt-2 text-emerald-300">&gt; ✓ builder mode activated</p>
        </div>
      </div>
    </section>
  );
}
