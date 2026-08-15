import Link from "next/link";
import { newsListHref } from "@/lib/content/news";

type Props = {
  page: number;
  totalPages: number;
};

function pageWindow(page: number, totalPages: number): number[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const set = new Set<number>([1, totalPages, page - 1, page, page + 1]);
  if (page <= 3) {
    set.add(2);
    set.add(3);
    set.add(4);
  }
  if (page >= totalPages - 2) {
    set.add(totalPages - 1);
    set.add(totalPages - 2);
    set.add(totalPages - 3);
  }
  return [...set].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);
}

export function NewsPagination({ page, totalPages }: Props) {
  if (totalPages <= 1) return null;

  const pages = pageWindow(page, totalPages);
  const prev = page > 1 ? newsListHref(page - 1) : null;
  const next = page < totalPages ? newsListHref(page + 1) : null;

  return (
    <nav
      className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6"
      aria-label="Страницы новостей"
    >
      {prev ? (
        <Link
          href={prev}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
          rel="prev"
        >
          ← Назад
        </Link>
      ) : (
        <span className="inline-flex px-3.5 py-2 text-sm font-semibold text-slate-300">← Назад</span>
      )}

      <ol className="flex flex-wrap items-center justify-center gap-1.5">
        {pages.map((n, i) => {
          const prevN = pages[i - 1];
          const showGap = prevN !== undefined && n - prevN > 1;
          const href = newsListHref(n);
          const active = n === page;
          return (
            <li key={n} className="flex items-center gap-1.5">
              {showGap && (
                <span className="px-1 text-sm text-slate-400" aria-hidden>
                  …
                </span>
              )}
              {active ? (
                <span
                  className="inline-flex min-w-10 items-center justify-center rounded-lg bg-brand-600 px-3 py-2 text-sm font-bold text-white"
                  aria-current="page"
                >
                  {n}
                </span>
              ) : (
                <Link
                  href={href}
                  className="inline-flex min-w-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
                >
                  {n}
                </Link>
              )}
            </li>
          );
        })}
      </ol>

      {next ? (
        <Link
          href={next}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
          rel="next"
        >
          Вперёд →
        </Link>
      ) : (
        <span className="inline-flex px-3.5 py-2 text-sm font-semibold text-slate-300">Вперёд →</span>
      )}
    </nav>
  );
}
