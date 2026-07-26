import Image from "next/image";
import Link from "next/link";

export type CourseCardProgress = {
  completed: number;
  total: number;
};

export type CourseCardProps = {
  title: string;
  image: string;
  subtitle?: string;
  description?: string;
  meta: string[];
  features?: string[];
  audience?: string;
  price?: string;
  statusLabel: string;
  statusTone?: "dark" | "light";
  actionHref: string;
  actionLabel: string;
  actionExternal?: boolean;
  progress?: CourseCardProgress;
  priority?: boolean;
};

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M5 12h14M14 7l5 5-5 5" />
    </svg>
  );
}

export function CourseCard({
  title,
  image,
  subtitle,
  description,
  meta,
  features = [],
  audience,
  price,
  statusLabel,
  statusTone = "dark",
  actionHref,
  actionLabel,
  actionExternal = false,
  progress,
  priority = false,
}: CourseCardProps) {
  const progressPercent = progress && progress.total > 0
    ? Math.min(100, Math.max(0, Math.round((progress.completed / progress.total) * 100)))
    : 0;

  const actionClassName = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#292522] px-4 text-sm font-bold text-white transition hover:bg-[#c65018] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ea721f] focus-visible:ring-offset-2";
  const action = actionExternal ? (
    <a href={actionHref} target="_blank" rel="noreferrer" className={actionClassName}>
      {actionLabel}<ArrowIcon />
    </a>
  ) : (
    <Link href={actionHref} className={actionClassName}>
      {actionLabel}<ArrowIcon />
    </Link>
  );

  return (
    <article className="group flex overflow-hidden rounded-[26px] border border-[#e2d7cb] bg-white shadow-[0_14px_38px_rgba(62,46,30,.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(62,46,30,.12)] motion-reduce:transition-none">
      <div className="flex w-full flex-col">
        <div className="relative aspect-video overflow-hidden bg-[#fff3e7]">
          <Image
            src={image}
            alt={`ภาพปกคอร์ส ${title}`}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 300px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-300 group-hover:scale-[1.02] motion-reduce:transition-none"
          />
          <span className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-bold shadow-sm ${statusTone === "dark" ? "bg-[#292522] text-white" : "border border-white/70 bg-white/90 text-[#a9440a] backdrop-blur"}`}>
            {statusLabel}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex flex-wrap gap-x-2 gap-y-1.5 text-xs font-semibold text-[#776d65]">
            {meta.map((item, index) => (
              <span key={`${item}-${index}`} className="inline-flex items-center gap-2">
                {index > 0 ? <span aria-hidden="true">•</span> : null}{item}
              </span>
            ))}
          </div>
          <h3 className="mt-3 text-xl font-bold leading-tight text-[#292725]">{title}</h3>
          {subtitle ? <p className="mt-2 text-sm font-semibold leading-6 text-[#5c5148]">{subtitle}</p> : null}
          {description ? <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#776d65]">{description}</p> : null}
          {audience ? <p className="mt-3 text-sm leading-6 text-[#776d65]">เหมาะสำหรับ {audience}</p> : null}
          {features.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {features.map((feature) => (
                <li key={feature} className="flex gap-2 text-sm leading-5 text-[#625950]"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ea721f]" />{feature}</li>
              ))}
            </ul>
          ) : null}

          {progress ? (
            <div className="mt-auto pt-5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-[#514942]">เรียนแล้ว {progress.completed}/{progress.total} บท</span>
                <span className="font-bold tabular-nums text-[#c65018]">{progressPercent}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#ede2d7]" role="progressbar" aria-label={`ความคืบหน้าคอร์ส ${title}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progressPercent}>
                <div className="h-full rounded-full bg-[#ea721f] transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          ) : null}

          <div className="mt-auto flex items-end justify-between gap-4 pt-6">
            {price ? <div><p className="text-xs font-semibold text-[#8a7e75]">ราคา</p><p className="mt-1 text-2xl font-bold text-[#ea5b16]">{price}</p></div> : null}
            {action}
          </div>
        </div>
      </div>
    </article>
  );
}
