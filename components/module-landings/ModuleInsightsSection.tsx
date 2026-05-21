export type ModuleInsightsMeta = {
  eyebrow: string;
  title: string;
  lead: string;
  intro: string;
};

export type ModuleInsightsGridItem = { title: string; text: string };

export type ModuleInsightsHighlight = {
  title: string;
  lead: string;
  bullets: readonly string[];
};

export type ModuleInsightsOutcome = {
  label: string;
  icon: string;
  text: string;
};

type Props = {
  meta: ModuleInsightsMeta;
  grid: readonly ModuleInsightsGridItem[];
  highlight: ModuleInsightsHighlight;
  outcomes: readonly ModuleInsightsOutcome[];
  titleId: string;
};

/** Блок «что в отчёте / что даёт модуль» — brand-остров по эталону релевантности */
export function ModuleInsightsSection({ meta, grid, highlight, outcomes, titleId }: Props) {
  return (
    <section className="relative mt-20 scroll-mt-8" aria-labelledby={titleId}>
      <p className="text-center text-sm font-semibold uppercase tracking-widest text-brand-600">
        {meta.eyebrow}
      </p>
      <h2 id={titleId} className="mt-2 text-center text-2xl font-bold text-slate-900 md:text-3xl">
        {meta.title}
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">{meta.lead}</p>

      <div className="relative mt-10 rounded-3xl bg-gradient-to-br from-brand-100/90 via-brand-50/50 to-white p-1.5 shadow-xl shadow-brand-900/10 ring-1 ring-brand-200/80">
        <article className="overflow-hidden rounded-[1.2rem] bg-white shadow-md">
          <div className="h-1.5 bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700" aria-hidden />

          <div className="border-b border-brand-100 bg-gradient-to-r from-brand-50 to-white px-6 py-5 md:px-10 md:py-6">
            <p className="max-w-3xl text-base font-semibold leading-snug text-brand-900 md:text-lg">
              {meta.intro}
            </p>
          </div>

          <div className="p-6 md:p-8 lg:p-10">
            <ul className="grid gap-4 sm:grid-cols-2">
              {grid.map((item, i) => (
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
              <h3 className="text-lg font-bold text-slate-900">{highlight.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{highlight.lead}</p>
              <ul className="mt-4 space-y-2.5">
                {highlight.bullets.map((line) => (
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
                {outcomes.map((row) => (
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
