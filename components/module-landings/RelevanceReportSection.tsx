import {
  RELEVANCE_REPORT,
  RELEVANCE_REPORT_GRID,
  RELEVANCE_REPORT_LSI,
  RELEVANCE_REPORT_OUTCOMES,
} from "@/lib/content/analiz-relevantnosti-page";

/** Блок «Что увидите в отчёте» — выделяется на slate-50, без пёстрого футера */
export function RelevanceReportSection() {
  return (
    <section className="relative mt-20 scroll-mt-8" aria-labelledby="relevance-report-title">
      <p className="text-center text-sm font-semibold uppercase tracking-widest text-brand-600">
        {RELEVANCE_REPORT.eyebrow}
      </p>
      <h2
        id="relevance-report-title"
        className="mt-2 text-center text-2xl font-bold text-slate-900 md:text-3xl"
      >
        {RELEVANCE_REPORT.title}
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">{RELEVANCE_REPORT.lead}</p>

      {/* Остров на фоне страницы: рамка brand + тень, внутри белая карточка */}
      <div className="relative mt-10 rounded-3xl bg-gradient-to-br from-brand-100/90 via-brand-50/50 to-white p-1.5 shadow-xl shadow-brand-900/10 ring-1 ring-brand-200/80">
        <article className="overflow-hidden rounded-[1.2rem] bg-white shadow-md">
          <div
            className="h-1.5 bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700"
            aria-hidden
          />

          <div className="border-b border-brand-100 bg-gradient-to-r from-brand-50 to-white px-6 py-5 md:px-10 md:py-6">
            <p className="max-w-3xl text-base font-semibold leading-snug text-brand-900 md:text-lg">
              Сравнение с ТОПом — только старт. Отчёт ведёт к правкам, LSI-семантике и росту позиций
              и трафика.
            </p>
          </div>

          <div className="p-6 md:p-8 lg:p-10">
            <ul className="grid gap-4 sm:grid-cols-2">
              {RELEVANCE_REPORT_GRID.map((item, i) => (
                <li
                  key={item.title}
                  className="rounded-xl border border-slate-200 border-l-4 border-l-brand-600 bg-slate-50/80 p-5 shadow-sm"
                >
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-brand-500">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{item.text}</p>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50/90 to-slate-50 p-6 md:p-7">
              <h3 className="text-lg font-bold text-slate-900">{RELEVANCE_REPORT_LSI.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{RELEVANCE_REPORT_LSI.lead}</p>
              <ul className="mt-4 space-y-2.5">
                {RELEVANCE_REPORT_LSI.bullets.map((line) => (
                  <li key={line} className="flex gap-2.5 text-sm text-slate-700">
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white"
                      aria-hidden
                    >
                      ✓
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 rounded-2xl bg-slate-100/80 p-5 md:p-6">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-600">
                К чему это приведёт
              </h3>
              <dl className="mt-4 grid gap-4 sm:grid-cols-3">
                {RELEVANCE_REPORT_OUTCOMES.map((row) => (
                  <div
                    key={row.label}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <dt className="flex items-center gap-3">
                      <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-lg font-bold text-white shadow-sm"
                        aria-hidden
                      >
                        {row.icon}
                      </span>
                      <span className="text-base font-bold text-slate-900">{row.label}</span>
                    </dt>
                    <dd className="mt-3 text-sm leading-relaxed text-slate-600">{row.text}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
