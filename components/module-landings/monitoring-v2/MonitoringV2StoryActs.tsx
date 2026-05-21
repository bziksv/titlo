"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { RevealOnScroll } from "@/components/module-landings/RevealOnScroll";
import { MonitoringV2SectionHeader } from "@/components/module-landings/monitoring-v2/MonitoringV2SectionHeader";
import { ModuleLeadCta } from "@/components/ModuleLeadCta";

type Act = {
  act: string;
  title: string;
  lead: string;
  image: string;
  imageAlt: string;
  imageFocus?: string;
  points: readonly string[];
};

function actImageClass(image: string) {
  return image.includes("518ec") ? "aspect-[1024/260] min-h-[200px]" : "aspect-[739/385] min-h-[240px]";
}

export function MonitoringV2StoryActs({ acts }: { acts: readonly Act[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const i = refs.current.indexOf(visible[0].target as HTMLElement);
          if (i >= 0) setActive(i);
        }
      },
      { rootMargin: "-30% 0px -30% 0px", threshold: [0, 0.25, 0.5] }
    );
    refs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [acts]);

  return (
    <section id="monitoring-v2-story" className="scroll-mt-20 bg-slate-50 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <MonitoringV2SectionHeader
          eyebrow="Три акта"
          title="От ядра до отчёта — один непрерывный сценарий"
          lead="Прокрутите сюжет или выберите этап — навигация синхронизирована со скроллом."
        />
      </div>

      {/* Mobile: горизонтальные табы */}
      <div className="mx-auto mt-8 max-w-6xl overflow-x-auto px-4 lg:hidden">
        <div className="flex gap-2 pb-2">
          {acts.map((a, i) => (
            <button
              key={a.act}
              type="button"
              onClick={() => refs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                active === i
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              {a.act} {a.title.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-10 grid max-w-6xl gap-10 px-4 lg:mt-14 lg:grid-cols-[minmax(0,300px)_1fr] lg:gap-16">
        <div className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
          <nav aria-label="Этапы сценария" className="relative pl-8">
            <div className="absolute bottom-2 left-[11px] top-2 w-0.5 bg-brand-100" aria-hidden />
            <div
              className="absolute left-[11px] w-0.5 bg-brand-600 transition-all duration-300"
              style={{
                top: "0.5rem",
                height: `calc(${((active + 0.5) / acts.length) * 100}% - 0.5rem)`,
              }}
              aria-hidden
            />
            <ul className="space-y-6">
              {acts.map((a, i) => (
                <li key={a.act}>
                  <button
                    type="button"
                    onClick={() => refs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" })}
                    className={`group relative block w-full text-left transition ${
                      active === i ? "opacity-100" : "opacity-45 hover:opacity-75"
                    }`}
                  >
                    <span
                      className={`absolute -left-8 top-1.5 h-3 w-3 rounded-full border-2 transition ${
                        active === i ? "border-brand-600 bg-brand-600 scale-110" : "border-slate-300 bg-white"
                      }`}
                      aria-hidden
                    />
                    <span className="font-mono text-sm text-brand-600">{a.act}</span>
                    <span className="mt-1 block text-lg font-bold text-slate-900">{a.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="space-y-20 md:space-y-28">
          {acts.map((a, i) => (
            <RevealOnScroll key={a.act} delayMs={i * 80}>
              <article
                ref={(el) => {
                  refs.current[i] = el;
                }}
                className="scroll-mt-28"
              >
                <p className="font-mono text-sm text-brand-600 lg:hidden">{a.act}</p>
                <h3 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">{a.title}</h3>
                <p className="mt-3 max-w-xl text-slate-600 leading-relaxed">{a.lead}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {a.points.map((p) => (
                    <li
                      key={p}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm"
                    >
                      {p}
                    </li>
                  ))}
                </ul>
                <figure className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl ring-1 ring-slate-900/5">
                  <div className={`relative w-full bg-slate-100 ${actImageClass(a.image)}`}>
                    <Image
                      src={a.image}
                      alt={a.imageAlt}
                      fill
                      className="object-cover p-0.5"
                      style={{ objectPosition: a.imageFocus ?? "left top" }}
                      sizes="(max-width: 1024px) 100vw, 720px"
                    />
                  </div>
                </figure>
              </article>
            </RevealOnScroll>
          ))}

          <div className="rounded-2xl border border-brand-200 bg-brand-50 p-6 md:flex md:items-center md:justify-between md:gap-8">
            <div>
              <p className="text-sm font-semibold text-brand-700">Готовы к первому срезу?</p>
              <p className="mt-1 text-slate-600">Создайте проект и загрузите ядро — проверка займёт минуты.</p>
            </div>
            <div className="mt-4 shrink-0 md:mt-0 md:min-w-[260px]">
              <ModuleLeadCta variant="card" idPrefix="monitoring-v2-acts" title="Открыть панель" hint="Бесплатный старт после регистрации." />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
