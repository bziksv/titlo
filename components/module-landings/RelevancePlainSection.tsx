import { RELEVANCE_PLAIN } from "@/lib/content/analiz-relevantnosti-page";

/** Термины простым языком — одна сетка 2×2, без второго ряда «простынь» */
export function RelevancePlainSection() {
  return (
    <section className="mt-20" aria-labelledby="relevance-plain-title">
      <h2 id="relevance-plain-title" className="text-2xl font-bold text-slate-900">
        {RELEVANCE_PLAIN.title}
      </h2>
      <p className="mt-3 max-w-2xl text-slate-600">{RELEVANCE_PLAIN.lead}</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {RELEVANCE_PLAIN.items.map((item, i) => (
          <article
            key={item.id}
            className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6"
          >
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 font-mono text-sm font-bold text-brand-700"
              aria-hidden
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
              {"bullets" in item ? (
                <ul className="mt-3 space-y-2">
                  {item.bullets.map((line) => (
                    <li key={line} className="flex gap-2 text-sm text-slate-600">
                      <span className="font-bold text-brand-600" aria-hidden>
                        →
                      </span>
                      {line}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
