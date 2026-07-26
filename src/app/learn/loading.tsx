export default function LearnLoading() {
  return (
    <main
      className="min-h-[calc(100dvh-4rem)] bg-[#f7f3ed] px-5 py-8 sm:px-8 sm:py-12"
      aria-label="กำลังโหลดคอร์ส"
      aria-busy="true"
    >
      <div className="mx-auto max-w-6xl animate-pulse motion-reduce:animate-none">
        <header className="py-2 sm:py-3">
          <div className="h-3 w-40 rounded-full bg-[#eadfce]" />
          <div className="mt-3 h-8 w-48 rounded-xl bg-[#ded2c6]" />
          <div className="mt-3 h-4 w-full max-w-md rounded-full bg-[#eadfce]" />
        </header>
      </div>
    </main>
  );
}
