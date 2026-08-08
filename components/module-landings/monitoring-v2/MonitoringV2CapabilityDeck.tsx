"use client";

import Image from "next/image";
import { RevealOnScroll } from "@/components/module-landings/RevealOnScroll";
import { MonitoringV2SectionHeader } from "@/components/module-landings/monitoring-v2/MonitoringV2SectionHeader";

type Featured = {
  kicker: string;
  title: string;
  lead: string;
  points: readonly string[];
  image: string;
  imageAlt: string;
};

type Shot = {
  id: string;
  title: string;
  caption: string;
  image: string;
  imageAlt: string;
};

type Block = {
  id: string;
  icon: string;
  title: string;
  text: string;
};

type Section = {
  eyebrow: string;
  title: string;
  lead: string;
  featured: Featured;
  shots: readonly Shot[];
  blocks: readonly Block[];
};

function UiShot({
  src,
  alt,
  priority,
  className = "",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <figure
      className={`overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-lg ring-1 ring-slate-900/5 ${className}`}
    >
      {/* Единый кадр 16:10 (capture v5) — карточки одной высоты, object-top без зума в середину */}
      <div className="relative aspect-[16/10] w-full">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover object-top"
          sizes="(max-width: 1024px) 100vw, 720px"
          priority={priority}
        />
      </div>
    </figure>
  );
}

export function MonitoringV2CapabilityDeck({ data }: { data: Section }) {
  return (
    <section className="overflow-x-clip border-t border-slate-200 bg-gradient-to-b from-slate-50 to-white py-16 md:py-24">
      <div className="mx-auto min-w-0 max-w-6xl px-4">
        <RevealOnScroll>
          <MonitoringV2SectionHeader eyebrow={data.eyebrow} title={data.title} lead={data.lead} />
        </RevealOnScroll>

        <RevealOnScroll delayMs={80}>
          <div className="mt-12 grid items-center gap-8 rounded-3xl border border-brand-100 bg-white p-5 shadow-sm md:p-8 lg:grid-cols-[0.95fr_1.15fr] lg:gap-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
                {data.featured.kicker}
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                {data.featured.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-slate-600">{data.featured.lead}</p>
              <ul className="mt-6 space-y-3">
                {data.featured.points.map((p) => (
                  <li key={p} className="flex gap-3 text-sm leading-relaxed text-slate-700">
                    <span
                      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700"
                      aria-hidden
                    >
                      ✓
                    </span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <UiShot src={data.featured.image} alt={data.featured.imageAlt} priority />
          </div>
        </RevealOnScroll>

        <div className="mt-8 grid items-stretch gap-6 lg:grid-cols-2">
          {data.shots.map((shot, i) => (
            <RevealOnScroll key={shot.id} delayMs={100 + i * 80} className="h-full">
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <UiShot
                  src={shot.image}
                  alt={shot.imageAlt}
                  className="rounded-none border-0 shadow-none ring-0"
                />
                <div className="flex flex-1 flex-col border-t border-slate-100 px-5 py-4">
                  <h3 className="text-lg font-bold text-slate-900">{shot.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{shot.caption}</p>
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.blocks.map((block, i) => (
            <RevealOnScroll key={block.id} delayMs={60 + i * 40}>
              <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-300 hover:shadow-md md:p-6">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-lg font-bold text-brand-700 ring-1 ring-brand-100"
                  aria-hidden
                >
                  {block.icon}
                </span>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{block.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{block.text}</p>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
