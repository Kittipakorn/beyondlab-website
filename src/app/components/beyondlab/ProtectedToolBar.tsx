type ProtectedToolBarProps = {
  username: string;
  email: string;
  returnTo: "/grader" | "/ide";
  backendUrl: string;
};

type UserMenuProps = ProtectedToolBarProps & {
  dark?: boolean;
};

export function UserMenu({
  username,
  email,
  returnTo,
  backendUrl,
  dark = false,
}: UserMenuProps) {
  const userInitial = username.charAt(0).toUpperCase();

  return (
    <details className="group relative">
      <summary
        aria-label={`เมนูผู้ใช้ ${username}`}
        className={`flex h-11 cursor-pointer list-none items-center gap-2 rounded-xl border py-1.5 pl-1.5 pr-3 text-sm font-semibold shadow-sm transition [&::-webkit-details-marker]:hidden ${
          dark
            ? "border-[#364152] bg-[#202936] text-white hover:border-[#ea721f]"
            : "border-[#dfd2c1] bg-white text-[#303030] hover:border-[#ea721f]"
        }`}
      >
        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#fff1e6] font-bold text-[#d55d11]"
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
          className="size-4 text-[#857a71] transition group-open:rotate-180"
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
        <form
          action={`${backendUrl}/auth/logout?returnTo=${returnTo}`}
          method="post"
          className="pt-3"
        >
          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-xl bg-[#ea721f] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#d85f13]"
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
