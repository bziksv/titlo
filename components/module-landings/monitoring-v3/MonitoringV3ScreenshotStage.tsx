"use client";

import Image from "next/image";
import { MonitoringV3SceneGrid } from "@/components/module-landings/monitoring-v3/MonitoringV3SceneGrid";
import { MonitoringV3SectionHeader } from "@/components/module-landings/monitoring-v3/MonitoringV3SectionHeader";

type Shot = { src: string; caption: string };
type Section = { eyebrow: string; title: string; lead: string };

export function MonitoringV3ScreenshotStage({
  shots,
  section,
}: {
  shots: readonly Shot[];
  section: Section;
}) {
  const [a, b] = shots;

  return (
    <section className="monitoring-v3-tone-slate relative overflow-hidden py-24 md:py-32">
      <MonitoringV3SceneGrid />
      <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-[min(100%,720px)] -translate-x-1/2 rounded-full bg-brand-500/12 blur-3xl" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <MonitoringV3SectionHeader
            eyebrow={section.eyebrow}
            title={section.title}
            lead={section.lead}
            align="center"
            className="mx-auto lg:mx-0 lg:text-left"
          />

          <div className="monitoring-v3-browser-frame relative mx-auto w-full max-w-2xl lg:max-w-none">
            <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3 rounded-t-2xl">
              <span className="h-3 w-3 rounded-full bg-red-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="ml-3 flex-1 truncate rounded-md bg-black/30 px-3 py-1 font-mono text-xs text-slate-500">
                cabinet.titlo.ru · мониторинг
              </span>
            </div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-b-2xl border border-white/15 border-t-0 bg-[#0a0f1a] shadow-2xl shadow-brand-900/40">
              {a && (
                <div className="absolute inset-0 animate-v3-carousel-a">
                  <Image src={a.src} alt={a.caption} fill className="object-cover object-left-top" sizes="(max-width: 1024px) 100vw, 960px" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-4 py-4">
                    <p className="text-sm text-slate-300">{a.caption}</p>
                  </div>
                </div>
              )}
              {b && (
                <div className="absolute inset-0 animate-v3-carousel-b">
                  <Image src={b.src} alt={b.caption} fill className="object-cover object-left-top" sizes="(max-width: 1024px) 100vw, 960px" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-950/95 to-transparent px-4 py-4">
                    <p className="text-sm text-white">{b.caption}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-400 animate-pulse motion-reduce:animate-none" />
              <span className="h-2 w-2 rounded-full bg-white/20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
