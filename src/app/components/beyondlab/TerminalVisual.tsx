export function TerminalVisual() {
  return (
    <div className="relative mx-auto mt-16 w-full max-w-5xl animate-float">
      <div className="absolute -inset-10 rounded-[44px] bg-[radial-gradient(circle_at_50%_0%,rgba(79,140,255,0.18),transparent_52%)] blur-2xl" />
      <div className="relative overflow-hidden rounded-[24px] border border-gray-200 bg-white/88 shadow-[0_30px_100px_rgba(17,17,17,0.14)] backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-gray-200 bg-[#FAFAFA]/80 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="text-xs font-medium text-gray-400">beyondlab.official</div>
        </div>
        <div className="grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="border-b border-gray-200 p-5 sm:p-8 lg:border-b-0 lg:border-r">
            <div className="rounded-2xl border border-gray-200 bg-[#0d1117] p-5 font-mono text-sm text-gray-200 shadow-inner">
              <p>
                <span className="text-[#4F8CFF]">beyondlab</span> g++ solution.cpp
              </p>
              <p className="mt-3 text-emerald-300">✓ compiled</p>
              <p className="mt-6">
                <span className="text-[#4F8CFF]">beyondlab</span> submit solution.cpp
              </p>
              <p className="mt-3 text-emerald-300">✓ Accepted</p>
              <p className="mt-6">
                <span className="text-[#4F8CFF]">beyondlab</span> join beyondlab
              </p>
              <p className="mt-3 text-emerald-300">✓ contest mode activated</p>
            </div>
          </div>
          <div className="grid gap-4 bg-[linear-gradient(135deg,#fff,rgba(79,140,255,0.06))] p-5 sm:p-8">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_18px_50px_rgba(17,17,17,0.07)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Solve streak</span>
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#4F8CFF]">Live</span>
              </div>
              <div className="mt-7 flex items-end gap-2">
                {[42, 58, 46, 72, 66, 88, 76].map((height, index) => (
                  <div
                    key={index}
                    className="flex-1 rounded-t-lg bg-gradient-to-t from-[#4F8CFF] to-[#B9D2FF]"
                    style={{ height }}
                  />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_18px_50px_rgba(17,17,17,0.06)]">
                <p className="text-3xl font-bold tracking-[-0.04em] text-[#111111]">C++</p>
                <p className="mt-1 text-sm text-gray-500">ภาษาหลักที่ใช้ติว</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_18px_50px_rgba(17,17,17,0.06)]">
                <p className="text-3xl font-bold tracking-[-0.04em] text-[#111111]">สอวน.</p>
                <p className="mt-1 text-sm text-gray-500">มาตรฐานเนื้อหาที่ใช้ติว</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
