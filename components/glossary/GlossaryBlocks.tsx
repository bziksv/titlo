import type { GlossaryBlock } from "@/lib/content/glossary";
import { RichText } from "./RichText";

const pClass = "text-base leading-relaxed text-slate-600 md:text-[1.0625rem]";

export function GlossaryBlocks({ blocks }: { blocks: readonly GlossaryBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return (
              <p key={i} className={pClass}>
                <RichText text={b.text} />
              </p>
            );
          case "ul":
            return (
              <ul key={i} className="space-y-3 pt-1">
                {b.items.map((item, j) => (
                  <li key={j} className="flex gap-3 text-slate-700">
                    <span className="font-bold text-brand-600" aria-hidden>
                      ✓
                    </span>
                    <span className="leading-relaxed">
                      <RichText text={item} />
                    </span>
                  </li>
                ))}
              </ul>
            );
          case "steps":
            return (
              <ol key={i} className="space-y-5 pt-1">
                {b.items.map((s, j) => (
                  <li key={j} className="flex gap-4">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                      {j + 1}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900">{s.title}</h3>
                      <p className="mt-1 leading-relaxed text-slate-600">
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
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                    <caption className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left font-semibold text-slate-900">
                      {b.caption}
                    </caption>
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        {b.head.map((h, j) => (
                          <th key={j} scope="col" className={`px-4 py-2.5 font-semibold ${j === 1 || j === 2 ? "text-right" : ""}`}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {b.rows.map((row, r) => (
                        <tr key={r}>
                          {row.map((cell, c) => (
                            <td
                              key={c}
                              className={`px-4 py-2.5 ${c === 0 ? "font-medium text-slate-900" : "text-slate-600"} ${
                                c === 1 || c === 2 ? "whitespace-nowrap text-right tabular-nums" : ""
                              }`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {b.note ? <figcaption className="mt-3 text-sm leading-relaxed text-slate-500">{b.note}</figcaption> : null}
              </figure>
            );
        }
      })}
    </div>
  );
}
