import { RevealOnScroll } from "@/components/module-landings/RevealOnScroll";
import { MonitoringV2CountUp } from "@/components/module-landings/monitoring-v2/MonitoringV2CountUp";
import { MonitoringV2SectionHeader } from "@/components/module-landings/monitoring-v2/MonitoringV2SectionHeader";

type Metric = { value: string; unit: string; note: string };

type MetricSection = { eyebrow: string; title: string; lead?: string };

export function MonitoringV2MetricWall({
  metrics,
  section = {
    eyebrow: "Цифры без маркетингового шума",
    title: "Параметры съёма в одном взгляде",
  },
}: {
  metrics: readonly Metric[];
  section?: MetricSection;
}) {
  return (
    <section className="overflow-x-clip border-y border-brand-900/30 bg-brand-800 py-16 text-white md:py-24">
      <div className="mx-auto min-w-0 max-w-6xl px-4">
        <RevealOnScroll>
          <MonitoringV2SectionHeader
            align="center"
            dark
            eyebrow={section.eyebrow}
            title={section.title}
            lead={section.lead}
          />
        </RevealOnScroll>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m, i) => (
            <RevealOnScroll key={`${m.value}-${m.unit}-${m.note}`} delayMs={i * 80}>
              <div
                className={[
                  "flex h-full flex-col items-center px-1 py-6 text-center sm:px-5 sm:py-8 lg:px-4 lg:py-2",
                  i > 0 ? "border-t border-white/20 sm:border-t-0" : "",
                  i % 2 === 1 ? "sm:border-l sm:border-white/20" : "",
                  i >= 2 ? "sm:border-t sm:border-white/20 lg:border-t-0" : "",
                  i > 0 ? "lg:border-l lg:border-white/20" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div className="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-0.5">
                  <MonitoringV2CountUp
                    value={m.value}
                    className="text-4xl font-bold tabular-nums text-white md:text-5xl"
                  />
                  <span className="text-base font-medium text-brand-200 md:text-lg">{m.unit}</span>
                </div>
                <p className="mt-2 max-w-[12rem] text-sm leading-relaxed text-brand-100/85">{m.note}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
