export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_10px_30px_rgba(17,17,17,0.08)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(79,140,255,0.38),transparent_42%)]" />
        <span className="relative text-sm font-black tracking-[-0.04em] text-[#111111]">B</span>
      </div>
      <span className="text-sm font-semibold tracking-[-0.02em] text-[#111111]">BeyondLab</span>
    </div>
  );
}
