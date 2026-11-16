import type { GlossaryFaqItem } from "@/lib/content/glossary";

/** FAQ на <details>: ответы есть в HTML (для FAQPage и поиска), раскрытие без JS. */
export function GlossaryFaq({ items }: { items: readonly GlossaryFaqItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <details
          key={item.q}
          open={i === 0}
          className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm open:border-brand-200 open:shadow-md"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left font-semibold text-slate-900 hover:bg-slate-50/80 [&::-webkit-details-marker]:hidden">
            <span className="pr-4">{item.q}</span>
            {/* Плюс/минус — две полоски, отцентрованные абсолютно (не текстовый глиф: у шрифта своя базовая линия). */}
            <span
              aria-hidden
              data-faq-icon
              className="relative h-8 w-8 shrink-0 rounded-full bg-slate-100 text-slate-600 group-open:bg-brand-600 group-open:text-white"
            >
              <span className="absolute left-1/2 top-1/2 h-0.5 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current" />
              <span className="absolute left-1/2 top-1/2 h-3 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current group-open:hidden" />
            </span>
          </summary>
          <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-5 text-[1.05rem] leading-relaxed text-slate-700">{item.a}</div>
        </details>
      ))}
    </div>
  );
}
