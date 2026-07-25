type ProtectedToolBarProps = {
  username: string;
  email: string;
  role: string;
  returnTo: "/grader" | "/ide";
  backendUrl: string;
};

type UserMenuProps = ProtectedToolBarProps & {
  dark?: boolean;
};

export function UserMenu({
  username,
  email,
  role,
  returnTo,
  backendUrl,
  dark = false,
}: UserMenuProps) {
  const userInitial = username.charAt(0).toUpperCase();

  return (
    <details className="group relative">
      <summary
        aria-label={`เมนูผู้ใช้ ${username}`}
        className={`flex h-8 sm:h-11 cursor-pointer list-none items-center gap-1 sm:gap-2 rounded-lg sm:rounded-xl border p-1 sm:py-1.5 sm:pl-1.5 sm:pr-3 text-xs sm:text-sm font-semibold shadow-sm transition [&::-webkit-details-marker]:hidden ${
          dark
            ? "border-[#364152] bg-[#202936] text-white hover:border-[#ea721f]"
            : "border-[#dfd2c1] bg-white text-[#303030] hover:border-[#ea721f]"
        }`}
      >
        <span
          aria-hidden="true"
          className="flex h-6 w-6 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-md sm:rounded-lg bg-[#fff1e6] text-xs sm:text-sm font-bold text-[#d55d11]"
        >
          {userInitial}
        </span>
        <span className="hidden max-w-32 truncate sm:inline lg:max-w-48">
          {username}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          className="hidden sm:block size-4 text-[#857a71] transition group-open:rotate-180"
        >
          <path
            d="m6 8 4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </summary>

      <div className={`absolute right-0 z-50 mt-2 w-64 rounded-2xl border p-3 shadow-[0_18px_50px_rgba(0,0,0,0.2)] ${
        dark
          ? "border-[#364152] bg-[#202936]"
          : "border-[#eadfce] bg-white"
      }`}>
        <div className={`border-b px-2 pb-3 ${dark ? "border-[#364152]" : "border-[#f0e7dc]"}`}>
          <p className={`text-xs ${dark ? "text-[#9ca8b8]" : "text-[#857a71]"}`}>
            เข้าสู่ระบบในชื่อ
          </p>
          <p className={`mt-1 truncate text-sm font-semibold ${dark ? "text-white" : "text-[#303030]"}`}>
            {username}
          </p>
          <p className={`mt-1 truncate text-xs ${dark ? "text-[#9ca8b8]" : "text-[#857a71]"}`}>
            {email}
          </p>
        </div>
        <div className="pt-2 space-y-2">
          <a
            href="/account"
            className={`flex w-full items-center justify-center rounded-xl border px-4 py-2 text-xs font-bold transition ${
              dark
                ? "border-blue-500/40 bg-blue-950/40 text-blue-200 hover:bg-blue-900/60"
                : "border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100"
            }`}
          >
            บัญชีของฉัน
          </a>
          {role === "admin" && (
            <a
              href="/admin"
              className={`flex w-full items-center justify-center rounded-xl border px-4 py-2 text-xs font-bold transition ${
                dark
                  ? "border-purple-500/40 bg-purple-950/40 text-purple-200 hover:bg-purple-900/60"
                  : "border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100"
              }`}
            >
              Admin Portal (แอดมิน)
            </a>
          )}
        </div>
        <form
          action={`/api/auth/logout?returnTo=${encodeURIComponent(returnTo)}`}
          method="post"
          className="pt-2"
        >
          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-xl bg-[#ea721f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#d85f13]"
          >
            ออกจากระบบ
          </button>
        </form>
      </div>
    </details>
  );
}

export function ProtectedToolBar(props: ProtectedToolBarProps) {
  return (
    <div className="border-b border-[#eadfce] bg-white/70 px-5 py-3 backdrop-blur sm:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <p className="text-sm font-semibold text-[#5c5148]">
          {props.returnTo === "/ide" ? "IDE Playground" : "BeyondLab Grader"}
        </p>
        <UserMenu {...props} />
      </div>
    </div>
  );
}
