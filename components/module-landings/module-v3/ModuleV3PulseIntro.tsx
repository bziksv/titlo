"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ModuleLeadCta } from "@/components/ModuleLeadCta";
import { SearchEngineLogos } from "@/components/SearchEngineLogos";
import { ModuleV3PulseHeroVisual } from "@/components/module-landings/module-v3/ModuleV3PulseHeroVisual";
import { MonitoringV3TypeCycle } from "@/components/module-landings/monitoring-v3/MonitoringV3TypeCycle";
import { LK_URL } from "@/lib/site";
import type { ModuleV3HeroVisual, ModuleV3Intro } from "@/lib/content/module-v3/types";
import type { ModulePage } from "@/lib/content/modules";

const FLOAT_SEED = [
  { t: 12, l: 8, n: 3 },
  { t: 28, l: 92, n: 17 },
  { t: 58, l: 72, n: 42 },
  { t: 74, l: 88, n: 8 },
  { t: 18, l: 55, n: 91 },
  { t: 42, l: 38, n: 24 },
  { t: 86, l: 22, n: 56 },
  { t: 52, l: 96, n: 12 },
];

type Props = {
  module: ModulePage;
  intro: ModuleV3Intro;
  heroVisual: ModuleV3HeroVisual;
  showEngineLogos?: boolean;
};

export function ModuleV3PulseIntro({ module, intro, heroVisual, showEngineLogos = false }: Props) {
  const floats = useMemo(() => FLOAT_SEED, []);

  return (
    <section className="module-v3-tone-hero relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-4 py-20 md:px-8 lg:px-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12] animate-v3-grid motion-reduce:opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute left-[8%] top-1/4 h-80 w-80 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="absolute right-[6%] top-1/3 h-96 w-96 rounded-full bg-violet-600/25 blur-3xl" />
        {floats.map((f) => (
          <span
            key={`${f.t}-${f.l}`}
            className="absolute font-mono text-xs text-brand-300/70 animate-v3-float"
            style={{ top: `${f.t}%`, left: `${f.l}%`, animationDelay: `${(f.n % 5) * 0.35}s` }}
          >
            #{f.n}
          </span>
        ))}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-14 xl:gap-20">
          <div className="min-w-0">
            <nav className="mb-8 flex flex-wrap items-center gap-2 text-xs text-slate-500 lg:mb-10">
              <Link href="/" className="hover:text-white">
                Главная
              </Link>
              <span>/</span>
              <Link href="/services/" className="hover:text-white">
                Модули
              </Link>
              <span>/</span>
              <span className="rounded border border-violet-400/40 bg-violet-500/20 px-2 py-0.5 font-bold text-violet-200">
                {intro.badge}
              </span>
            </nav>

            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-400">{intro.badge}</p>
            <h1 className="mt-4 text-[clamp(2.75rem,8vw,5.5rem)] font-black leading-[0.92] tracking-tighter text-white xl:text-[5.75rem]">
              {intro.title}
              <span className="block text-brand-400">{intro.titleAccent}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-400 lg:max-w-none">
              Сейчас в фокусе: <MonitoringV3TypeCycle words={intro.typeCycle} />
            </p>
            <p className="mt-4 max-w-xl text-slate-500 lg:max-w-none">{intro.lead}</p>
            {intro.sub && <p className="mt-3 max-w-xl text-sm text-slate-600 lg:max-w-none">{intro.sub}</p>}

            {module.features && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {module.features.map((f, i) => (
                  <li
                    key={f}
                    className={`rounded-full px-3 py-1 text-sm ${i === 0 ? "module-v3-chip-featured" : "module-v3-chip text-slate-300"}`}
                  >
                    {f}
                  </li>
                ))}
              </ul>
            )}

            {showEngineLogos && <SearchEngineLogos className="mt-8 opacity-90" variant="hero" />}

            <div className="module-v3-highlight-panel mt-10 w-full max-w-md rounded-2xl p-6 lg:max-w-lg">
              <ModuleLeadCta
                variant="hero"
                idPrefix={`${module.slug}-intro`}
                title={intro.cta}
                hint="Регистрация в личном кабинете."
                moduleSlug={module.slug}
              />
            </div>
            <p className="mt-4 text-sm text-slate-600">
              <a href={`${LK_URL}/login`} className="text-brand-300 hover:text-white">
                Уже есть аккаунт →
              </a>
            </p>
          </div>

          <div className="min-w-0 lg:pt-6">
            <ModuleV3PulseHeroVisual visual={heroVisual} />
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-xs text-slate-600">
        <span>Дальше по модулю</span>
        <span className="block h-8 w-px animate-bounce bg-slate-600 motion-reduce:animate-none" />
      </div>
    </section>
  );
}
