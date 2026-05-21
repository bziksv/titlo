import { RevealOnScroll } from "@/components/module-landings/RevealOnScroll";

type PainGain = {
  painTitle: string;
  pains: readonly string[];
  gainTitle: string;
  gains: readonly string[];
};

export function MonitoringV2PainGain({ data }: { data: PainGain }) {
  return (
    <section className="border-y border-slate-200 bg-white">
      <RevealOnScroll>
        <div className="mx-auto grid max-w-6xl lg:grid-cols-2">
          <div className="relative border-b border-slate-200 bg-slate-50 px-6 py-14 md:px-10 lg:border-b-0 lg:border-r">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.35]"
              style={{
                backgroundImage: "radial-gradient(circle at 0% 0%, #cbd5e1 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
              aria-hidden
            />
            <h2 className="relative text-sm font-semibold uppercase tracking-widest text-slate-500">{data.painTitle}</h2>
            <ul className="relative mt-8 space-y-5">
              {data.pains.map((p) => (
                <li key={p} className="flex gap-4 text-slate-700">
                  <span
                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-600"
                    aria-hidden
                  >
                    −
                  </span>
                  <span className="text-base leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative bg-gradient-to-br from-brand-800 via-brand-800 to-brand-900 px-6 py-14 text-white md:px-10">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-brand-200">{data.gainTitle}</h2>
            <ul className="mt-8 space-y-5">
              {data.gains.map((g) => (
                <li key={g} className="flex gap-4">
                  <span
                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white shadow-md shadow-emerald-900/30"
                    aria-hidden
                  >
                    ✓
                  </span>
                  <span className="text-base leading-relaxed text-brand-50">{g}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
