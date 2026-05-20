"use client";

import { useRef, type CSSProperties } from "react";
import { RELEVANCE_TECH_LAYERS, RELEVANCE_TECH_SECTION } from "@/lib/content/analiz-relevantnosti-page";
import { useParallaxOffset } from "@/lib/hooks/useParallaxOffset";

const CARD_SPEEDS = [0.05, 0.09, 0.13, 0.17] as const;

type Layer = (typeof RELEVANCE_TECH_LAYERS)[number];

function TechLayerCard({ layer, speed }: { layer: Layer; speed: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const y = useParallaxOffset(ref, speed);

  return (
    <li
      ref={ref}
      className="list-none will-change-transform rounded-2xl border border-white/15 bg-brand-800/90 p-6 shadow-lg shadow-black/10 backdrop-blur-sm"
      style={{ transform: `translate3d(0, ${y}px, 0)` }}
    >
      <div className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 font-mono text-sm font-bold">
          {layer.id}
        </span>
        <div className="min-w-0">
          <h3 className="text-lg font-bold">{layer.title}</h3>
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-brand-200/90">{layer.short}</p>
          <p className="mt-2 text-sm leading-relaxed text-brand-100">{layer.text}</p>
          {layer.detail && (
            <p className="mt-3 text-sm leading-relaxed text-white/80">{layer.detail}</p>
          )}
        </div>
      </div>
    </li>
  );
}

/** Как устроена технология — parallax сетки, декора и карточек без второй колонки */
export function RelevanceTechSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridY = useParallaxOffset(sectionRef, 0.24);
  const orbY = useParallaxOffset(sectionRef, 0.38);
  const tileY = useParallaxOffset(sectionRef, -0.14);

  const gridStyle: CSSProperties = {
    backgroundImage: `
      linear-gradient(to right, rgba(255,255,255,0.45) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.45) 1px, transparent 1px)
    `,
    backgroundSize: "48px 48px",
    transform: `translate3d(0, ${gridY}px, 0)`,
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-brand-800 py-16 text-white md:py-20"
      aria-labelledby="relevance-tech-title"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] will-change-transform" aria-hidden style={gridStyle} />

      <div
        className="pointer-events-none absolute -right-16 top-[8%] h-56 w-56 rounded-full border-2 border-white/15 bg-brand-500/20 will-change-transform md:right-[6%] md:h-72 md:w-72"
        aria-hidden
        style={{ transform: `translate3d(0, ${orbY}px, 0)` }}
      />
      <div
        className="pointer-events-none absolute -left-10 bottom-[18%] h-40 w-40 rotate-12 rounded-3xl border border-white/10 bg-brand-600/25 will-change-transform md:left-[4%] md:h-48 md:w-48"
        aria-hidden
        style={{ transform: `translate3d(0, ${tileY}px, 0) rotate(12deg)` }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-200">
          {RELEVANCE_TECH_SECTION.eyebrow}
        </p>
        <h2 id="relevance-tech-title" className="mt-2 max-w-3xl text-2xl font-bold md:text-3xl lg:text-4xl">
          {RELEVANCE_TECH_SECTION.title}
        </h2>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-brand-100">{RELEVANCE_TECH_SECTION.lead}</p>

        <ol className="mt-12 grid gap-5 md:grid-cols-2">
          {RELEVANCE_TECH_LAYERS.map((layer, i) => (
            <TechLayerCard key={layer.id} layer={layer} speed={CARD_SPEEDS[i] ?? 0.1} />
          ))}
        </ol>

        <p className="mt-10 max-w-3xl border-t border-white/15 pt-8 text-sm leading-relaxed text-brand-100/90">
          {RELEVANCE_TECH_SECTION.footer}
        </p>
      </div>
    </section>
  );
}
