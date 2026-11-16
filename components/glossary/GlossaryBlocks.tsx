import type { GlossaryBlock, GlossaryCalloutVariant } from "@/lib/content/glossary";
import { RichText } from "./RichText";

/** Абзацы и списки ограничены ~70 символами в строке — так текст легче читать. */
export const proseClass = "max-w-[70ch] text-base leading-relaxed text-slate-600 md:text-[1.0625rem]";

const CALLOUT: Record<GlossaryCalloutVariant, { label: string; box: string; badge: string; icon: React.ReactNode }> = {
  important: {
    label: "Важно",
    box: "border-brand-200 bg-brand-50/70",
    badge: "bg-brand-600 text-white",
    icon: (
      <svg focusable="false" viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
        <path d="M10 2.5a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-3 0V4A1.5 1.5 0 0 1 10 2.5Zm0 11.5a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5Z" />
      </svg>
    ),
  },
  tip: {
    label: "Совет",
    box: "border-emerald-200 bg-emerald-50/70",
    badge: "bg-emerald-600 text-white",
    icon: (
      <svg focusable="false" viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
        <path d="M10 2a6 6 0 0 0-3.6 10.8c.4.3.6.8.6 1.2v.5h6V14c0-.4.2-.9.6-1.2A6 6 0 0 0 10 2Zm-2.5 14h5v.5A1.5 1.5 0 0 1 11 18H9a1.5 1.5 0 0 1-1.5-1.5V16Z" />
      </svg>
    ),
  },
  mistake: {
    label: "Ошибка",
    box: "border-rose-200 bg-rose-50/70",
    badge: "bg-rose-600 text-white",
    icon: <CrossIcon className="h-3.5 w-3.5" />,
  },
};

function CrossIcon({ className }: { className: string }) {
  return (
    <svg focusable="false" viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}

function CheckIcon({ className }: { className: string }) {
  return (
    <svg focusable="false" viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3.5 8.5l3 3 6-7" />
    </svg>
  );
}

/** «**Заголовок.** текст» → заголовок карточки + текст (если формат другой — весь текст в теле). */
function splitLead(item: string): { lead?: string; rest: string } {
  const m = item.match(/^\*\*(.+?)\*\*\s*([\s\S]*)$/);
  return m ? { lead: m[1].replace(/[.:]$/, ""), rest: m[2] } : { rest: item };
}

export function GlossaryBlocks({ blocks }: { blocks: readonly GlossaryBlock[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return (
              <p key={i} className={proseClass}>
                <RichText text={b.text} />
              </p>
            );
          case "ul":
            if (b.style === "cards" || b.style === "mistakes") {
              const bad = b.style === "mistakes";
              return (
                <ul key={i} className="grid gap-3 pt-1 sm:grid-cols-2">
                  {b.items.map((item, j) => {
                    const { lead, rest } = splitLead(item);
                    return (
                      <li
                        key={j}
                        className={`flex gap-3 rounded-xl border p-4 ${bad ? "border-rose-100 bg-rose-50/40" : "border-slate-200 bg-slate-50/70"}`}
                      >
                        <span
                          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                            bad ? "bg-rose-100 text-rose-600" : "bg-brand-100 text-brand-700"
                          }`}
                        >
                          {bad ? <CrossIcon className="h-3 w-3" /> : <CheckIcon className="h-3.5 w-3.5" />}
                        </span>
                        <span className="min-w-0 text-[0.95rem] leading-relaxed text-slate-600">
                          {lead ? <strong className="block text-slate-900">{lead}</strong> : null}
                          {lead ? " " : null}
                          <RichText text={rest} />
                        </span>
                      </li>
                    );
                  })}
                </ul>
              );
            }
            return (
              <ul key={i} className="max-w-[70ch] space-y-3 pt-1">
                {b.items.map((item, j) => (
                  <li key={j} className="flex gap-3 text-slate-700">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                      <CheckIcon className="h-3 w-3" />
                    </span>
                    <span className="leading-relaxed">
                      <RichText text={item} />
                    </span>
                  </li>
                ))}
              </ul>
            );
          case "callout": {
            const c = CALLOUT[b.variant];
            // A div, not the aside element: Titlo's relevance analyzer strips links with
            // /<a.*?>.*?<\/a>/, which also matches an "aside" opening tag and swallows
            // all text up to the next closing link tag.
            return (
              <div key={i} role="note" className={`max-w-[70ch] rounded-xl border p-4 md:p-5 ${c.box}`}>
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-900">
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full ${c.badge}`}>{c.icon}</span>
                  {c.label}
                </p>{" "}
                <p className="mt-2 leading-relaxed text-slate-700">
                  <RichText text={b.text} />
                </p>
              </div>
            );
          }
          case "compare":
            return (
              <div key={i} className={`grid gap-3 pt-1 ${b.items.length > 1 ? "sm:grid-cols-2" : ""}`}>
                {b.items.map((it, j) => (
                  <div key={j} className={`rounded-xl border p-4 md:p-5 ${j % 2 ? "border-amber-200 bg-amber-50/60" : "border-sky-200 bg-sky-50/60"}`}>
                    <p className={`text-sm font-bold ${j % 2 ? "text-amber-800" : "text-sky-800"}`}>{it.title}</p>{" "}
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-slate-700">
                      <RichText text={it.text} />
                    </p>
                  </div>
                ))}
              </div>
            );
          case "flow":
            return (
              <figure key={i} className="pt-1">
                <ol className="flex flex-col items-stretch gap-2 sm:flex-row">
                  {b.steps.map((st, j) => (
                    <li key={j} className="flex flex-1 flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                      {j > 0 ? (
                        <span className="flex justify-center text-brand-400 sm:px-1" aria-hidden>
                          <svg focusable="false" viewBox="0 0 24 24" className="h-5 w-5 rotate-90 sm:rotate-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M13 6l6 6-6 6" />
                          </svg>
                        </span>
                      ) : null}
                      <div className="h-full flex-1 rounded-xl border border-brand-200 bg-white p-4 text-center shadow-sm">
                        <span
                          aria-hidden
                          data-num={j + 1}
                          className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white before:content-[attr(data-num)]"
                        />
                        <p className="mt-2 font-semibold text-slate-900">{st.label}</p>{" "}
                        <p className="mt-1 text-sm leading-snug text-slate-500">{st.note}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                {b.caption ? <figcaption className="mt-3 text-sm text-slate-500">{b.caption}</figcaption> : null}
              </figure>
            );
          case "steps":
            return (
              <ol key={i} className="grid gap-3 pt-1">
                {b.items.map((s, j) => (
                  <li key={j} className="relative flex gap-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4 md:p-5">
                    <span
                      aria-hidden
                      data-num={j + 1}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white shadow-sm before:content-[attr(data-num)]"
                    />
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900">{s.title}</h3>{" "}
                      <p className="mt-1 max-w-[70ch] leading-relaxed text-slate-600">
                        <RichText text={s.text} />
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            );
          case "table":
            return (
              <figure key={i} className="pt-1">
                {/* Подсказка — CSS-контентом, чтобы не попадать в текст страницы. */}
                <p aria-hidden className="mb-2 text-xs text-slate-500 after:content-['Таблицу_можно_прокрутить_вбок_→'] md:hidden" />
                <div className="relative">
                <div className="overflow-x-auto rounded-xl border border-slate-200" tabIndex={0} aria-label={b.caption}>
                  <table className={`w-full ${b.compact ? "" : "min-w-[640px] "}border-collapse text-left text-sm`}>
                    <caption className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left font-semibold text-slate-900">
                      {b.caption}
                    </caption>
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        {b.head.map((h, j) => (
                          <th key={j} scope="col" className={`px-4 py-2.5 font-semibold ${!b.textOnly && (j === 1 || j === 2) ? "text-right" : ""}`}>
                            {h}{" "}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {b.rows.map((row, r) => (
                        <tr key={r} className="hover:bg-slate-50/70">
                          {row.map((cell, c) => (
                            <td
                              key={c}
                              className={`px-4 py-2.5 ${c === 0 ? "font-medium text-slate-900" : "text-slate-600"} ${
                                b.textOnly ? "align-top" : c === 1 || c === 2 ? "whitespace-nowrap text-right tabular-nums" : ""
                              }`}
                            >
                              {cell}{" "}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <span aria-hidden className="pointer-events-none absolute inset-y-px right-px w-12 rounded-r-xl bg-gradient-to-l from-white via-white/70 to-transparent md:hidden" />
                </div>
                {b.note ? <figcaption className="mt-3 text-sm leading-relaxed text-slate-500">{b.note}</figcaption> : null}
              </figure>
            );
        }
      })}
    </div>
  );
}
