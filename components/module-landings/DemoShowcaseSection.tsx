import type { ReactNode } from "react";

type Props = {
  title: string;
  lead: string;
  children: ReactNode;
};

/** Тёмный блок с белой карточкой демо — как у мета-тегов / ModuleV2. */
export function DemoShowcaseSection({ title, lead, children }: Props) {
  return (
    <section className="relative overflow-x-clip border-y border-brand-800/40">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#0f1a33] via-brand-800 to-brand-700"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-14 md:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-100">
            <span
              className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.8)]"
              aria-hidden
            />
            Попробовать бесплатно
          </p>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white md:text-4xl">{title}</h2>
          <p className="mt-4 text-base leading-relaxed text-brand-100/95 md:text-lg">{lead}</p>
        </div>

        <div className="relative mt-10 rounded-2xl border border-white/20 bg-white shadow-2xl shadow-brand-800/40 ring-1 ring-black/5 md:mt-12">
          <div className="h-1.5 rounded-t-2xl bg-gradient-to-r from-brand-500 via-emerald-400 to-brand-600" aria-hidden />
          {children}
        </div>
      </div>
    </section>
  );
}
