export function CourseCountBadge({ count }: { count: number }) {
  return (
    <div className="flex w-fit items-center gap-2.5 rounded-2xl border border-[#eadfce] bg-white/80 px-3 py-2 shadow-sm lg:ml-auto">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff0df] text-[#c65018]" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22.5v-17Z" />
          <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5a2.5 2.5 0 0 1 2.5 2.5v-17Z" />
        </svg>
      </span>
      <div>
        <p className="text-[11px] font-semibold text-[#7a7068]">พร้อมเรียน</p>
        <p className="text-base font-bold tabular-nums text-[#292725]">{count} คอร์ส</p>
      </div>
    </div>
  );
}
