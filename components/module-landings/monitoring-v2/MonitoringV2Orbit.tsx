import Link from "next/link";
import { RevealOnScroll } from "@/components/module-landings/RevealOnScroll";
import { MonitoringV2SectionHeader } from "@/components/module-landings/monitoring-v2/MonitoringV2SectionHeader";

type Node = { label: string; href: string; role: string };

const ORBIT_POSITIONS = [
  "lg:left-1/2 lg:top-0 lg:-translate-x-1/2",
  "lg:right-0 lg:top-[18%]",
  "lg:left-1/2 lg:bottom-0 lg:-translate-x-1/2",
  "lg:left-0 lg:top-[18%]",
] as const;

export function MonitoringV2Orbit({ nodes }: { nodes: readonly Node[] }) {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <RevealOnScroll>
          <MonitoringV2SectionHeader
            eyebrow="Экосистема"
            title="Мониторинг — узел, не остров"
            lead="Позиции связаны с конкурентами, релевантностью, ссылками и техникой — переход в соседний модуль без смены платформы."
          />
        </RevealOnScroll>

        {/* Desktop orbit */}
        <div className="relative mx-auto mt-16 hidden h-[400px] max-w-3xl lg:block">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-brand-200/80"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-100"
            aria-hidden
          />

          <div className="absolute left-1/2 top-1/2 z-10 flex w-52 -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-2xl border-2 border-brand-600 bg-brand-50 px-6 py-8 text-center shadow-lg">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Центр</span>
            <span className="mt-2 text-lg font-bold text-slate-900">Мониторинг позиций</span>
          </div>

          <ul className="absolute inset-0">
            {nodes.map((n, i) => (
              <li key={n.href} className={`absolute w-[220px] max-w-[42%] ${ORBIT_POSITIONS[i] ?? ""}`}>
                <Link
                  href={n.href}
                  className="group block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md"
                >
                  <span className="font-bold text-brand-700 group-hover:underline">{n.label}</span>
                  <p className="mt-1.5 text-sm leading-snug text-slate-600">{n.role}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile / tablet grid */}
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:hidden">
          <li className="col-span-full rounded-2xl border-2 border-brand-600 bg-brand-50 p-6 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Центр</span>
            <span className="mt-2 block text-xl font-bold text-slate-900">Мониторинг позиций</span>
          </li>
          {nodes.map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                className="group block h-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-300 hover:shadow-md"
              >
                <span className="font-bold text-brand-700 group-hover:underline">{n.label}</span>
                <p className="mt-2 text-sm text-slate-600">{n.role}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
