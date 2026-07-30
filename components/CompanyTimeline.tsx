import Link from "next/link";
import type { TimelineItem } from "@/lib/content/about";

type Props = {
  items: TimelineItem[];
  linkLabel?: string;
  /** Пропустить publicCopy, если текст уже нормализован */
  transformDescription?: (text: string) => string;
};

function yearFromDate(date: string): string | null {
  const m = date.match(/(20\d{2}|19\d{2})/);
  return m ? m[1] : null;
}

function dateWithoutYear(date: string, year: string | null): string {
  if (!year) return date;
  return date.replace(new RegExp(`\\s*${year}\\s*`), " ").replace(/,\s*$/, "").trim();
}

export function CompanyTimeline({
  items,
  linkLabel = "Подробнее →",
  transformDescription,
}: Props) {
  return (
    <ol className="relative mt-8 list-none pl-0">
      <div
        className="absolute bottom-3 left-[0.6875rem] top-3 w-px bg-gradient-to-b from-brand-500 via-brand-200 to-brand-100"
        aria-hidden
      />
      {items.map((item, index) => {
        const year = yearFromDate(item.date);
        const description = transformDescription
          ? transformDescription(item.description)
          : item.description;
        const isLast = index === items.length - 1;

        return (
          <li key={item.href} className={`relative flex gap-4 sm:gap-5 ${isLast ? "" : "pb-8"}`}>
            <div className="relative z-10 flex w-6 shrink-0 flex-col items-center pt-5">
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm ring-2 ring-brand-500"
                aria-hidden
              >
                <span className="h-2.5 w-2.5 rounded-full bg-brand-600" />
              </span>
            </div>

            <article className="group min-w-0 flex-1 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                {year ? (
                  <span className="inline-flex rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold tracking-wide text-brand-700">
                    {year}
                  </span>
                ) : null}
                <time className="text-sm font-medium text-brand-600">
                  {dateWithoutYear(item.date, year)}
                </time>
              </div>

              {item.title ? (
                <h3 className="mt-2 text-lg font-semibold leading-snug text-slate-900">
                  {item.title}
                </h3>
              ) : null}

              <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>

              <Link
                href={item.href}
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600 transition group-hover:text-brand-700"
              >
                {linkLabel}
              </Link>
            </article>
          </li>
        );
      })}
    </ol>
  );
}
