export default function LearnLoading() {
  return (
    <section className="mx-auto min-h-[75dvh] max-w-7xl px-5 py-10 sm:px-8" aria-label="กำลังโหลดบทเรียน" aria-busy="true">
      <div className="h-8 w-56 animate-pulse rounded-xl bg-[#eadfce]" />
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="aspect-video animate-pulse rounded-[28px] bg-[#292725]" />
        <div className="h-[480px] animate-pulse rounded-[28px] border border-[#eadfce] bg-white" />
      </div>
    </section>
  );
}
