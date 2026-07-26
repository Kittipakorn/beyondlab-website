export default function LearnLoading() {
  return (
    <main
      className="min-h-[75dvh] bg-[#f7f3ed] px-5 py-7 sm:px-8 sm:py-9"
      aria-label="กำลังโหลดคอร์ส"
      aria-busy="true"
    >
      <div className="mx-auto max-w-5xl animate-pulse motion-reduce:animate-none">
        <header className="rounded-3xl border border-[#eadfce] bg-white px-5 py-5 shadow-[0_12px_36px_rgba(62,46,30,.07)] sm:px-7 sm:py-6">
          <div className="h-3 w-40 rounded-full bg-[#eadfce]" />
          <div className="mt-3 h-8 w-48 rounded-xl bg-[#ded2c6]" />
          <div className="mt-3 h-4 w-full max-w-md rounded-full bg-[#eadfce]" />
        </header>

        <section className="mt-6" aria-hidden="true">
          <div className="h-3 w-24 rounded-full bg-[#eadfce]" />
          <div className="mt-2 h-7 w-56 rounded-lg bg-[#ded2c6]" />

          <div className="mt-4 max-w-sm overflow-hidden rounded-3xl border border-[#ded2c6] bg-white shadow-[0_12px_36px_rgba(62,46,30,.07)]">
            <div className="aspect-[16/9] bg-[#e3d8cd]" />
            <div className="p-5">
              <div className="h-3 w-44 rounded-full bg-[#eadfce]" />
              <div className="mt-3 h-7 w-52 rounded-lg bg-[#ded2c6]" />
              <div className="mt-3 h-4 w-full rounded-full bg-[#eee6de]" />
              <div className="mt-2 h-4 w-3/4 rounded-full bg-[#eee6de]" />
              <div className="mt-5 h-2 w-full rounded-full bg-[#eadfce]" />
              <div className="mt-4 h-11 w-28 rounded-xl bg-[#ded2c6]" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
