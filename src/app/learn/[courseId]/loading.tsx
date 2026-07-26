export default function CourseLoading() {
  return (
    <section
      className="bg-[#f7f3ed] px-5 py-8 sm:px-8 sm:py-10"
      aria-label="กำลังโหลดบทเรียน"
      aria-busy="true"
    >
      <div className="mx-auto max-w-7xl animate-pulse motion-reduce:animate-none">
        <div className="h-5 w-28 rounded-full bg-[#eadfce]" />
        <div className="mt-5 h-9 w-64 rounded-xl bg-[#ded2c6]" />
        <div className="mt-3 h-4 w-full max-w-xl rounded-full bg-[#eadfce]" />

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="overflow-hidden rounded-[28px] border border-[#ded2c6] bg-white shadow-[0_18px_55px_rgba(62,46,30,.10)]">
            <div className="aspect-video bg-[#292725]" />
            <div className="p-5 sm:p-7">
              <div className="h-3 w-20 rounded-full bg-[#eadfce]" />
              <div className="mt-3 h-7 w-3/5 rounded-lg bg-[#ded2c6]" />
              <div className="mt-5 h-4 w-full rounded-full bg-[#eee6de]" />
              <div className="mt-2 h-4 w-4/5 rounded-full bg-[#eee6de]" />
            </div>
          </article>

          <aside className="h-[480px] rounded-[28px] border border-[#eadfce] bg-white shadow-[0_18px_50px_rgba(62,46,30,.08)]" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
