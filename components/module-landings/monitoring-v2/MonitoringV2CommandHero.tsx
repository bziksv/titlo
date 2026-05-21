import Link from "next/link";
import { ParallaxMonoScene } from "@/components/module-landings/ParallaxMonoScene";
import { MonitoringV2CommandHeroPanel } from "@/components/module-landings/monitoring-v2/MonitoringV2CommandHeroPanel";
import { ModuleLeadCta } from "@/components/ModuleLeadCta";
import { SearchEngineLogos } from "@/components/SearchEngineLogos";
import { LK_URL } from "@/lib/site";
import type { ModulePage } from "@/lib/content/modules";

type Concept = {
  eyebrow: string;
  headline: string;
  lead: string;
  cta: string;
};

type ActPreview = { act: string; title: string };
type Shots = readonly { src: string; caption: string }[];

const DEFAULT_PANEL_CHIPS = [
  { label: "ТОП‑100", tone: "emerald" },
  { label: "2 ПС", tone: "sky" },
  { label: "Desktop", tone: "amber" },
] as const;

export type MonitoringV2HeroUi = {
  classicHref: string;
  storyAnchor: string;
  idPrefix: string;
  showSearchEngines?: boolean;
  panelChips?: readonly { label: string; tone: "emerald" | "sky" | "amber" }[];
  keysFooter?: string;
  dynamicsFooter?: string;
  labBadge?: string;
  ctaHint?: string;
};

type Props = {
  module: ModulePage;
  concept: Concept;
  shots: Shots;
  acts: readonly ActPreview[];
  heroUi?: Partial<MonitoringV2HeroUi>;
};

function HeroActStrip({ acts, storyAnchor }: { acts: readonly ActPreview[]; storyAnchor: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-2">
        {acts.map((a) => (
          <a
            key={a.act}
            href={`#${storyAnchor}`}
            className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-sm backdrop-blur-md transition hover:border-brand-400/40 hover:bg-brand-500/20"
          >
            <span className="font-mono text-xs font-bold text-brand-300">{a.act}</span>
            <span className="max-w-[12rem] truncate text-slate-300 group-hover:text-white sm:max-w-none">
              {a.title}
            </span>
          </a>
        ))}
      </div>
      <p className="text-xs text-slate-500">скролл — три акта сценария</p>
      <span className="block h-7 w-px animate-bounce bg-brand-400/80 motion-reduce:animate-none" aria-hidden />
    </div>
  );
}

/** Hero v2: текст и h1 в SSR; панель со скринами — отдельный client-чанк. */
export function MonitoringV2CommandHero({ module, concept, shots, acts, heroUi }: Props) {
  const ui: MonitoringV2HeroUi = {
    classicHref: "/monitoring-pozicii-sayta/",
    storyAnchor: "monitoring-v2-story",
    idPrefix: "monitoring-v2-command",
    showSearchEngines: true,
    panelChips: DEFAULT_PANEL_CHIPS,
    keysFooter: "Проект · ключи",
    dynamicsFooter: "Динамика · отчёт",
    ...heroUi,
  };
  const panelChips = ui.panelChips ?? DEFAULT_PANEL_CHIPS;

  return (
    <section className="relative min-h-[min(92vh,900px)] overflow-hidden bg-[#070d1a] text-white">
      <ParallaxMonoScene align="right" />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(ellipse 58% 50% at 72% 40%, rgba(47, 93, 224, 0.2), transparent 68%),
            radial-gradient(ellipse 42% 38% at 12% 75%, rgba(30, 63, 158, 0.14), transparent 62%)`,
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-[#070d1a]" aria-hidden />

      <div className="relative z-10 mx-auto flex min-h-[min(92vh,900px)] max-w-6xl min-w-0 flex-col px-4 pb-16 pt-8 md:pt-12">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-400" aria-label="Хлебные крошки">
          <Link href="/" className="hover:text-white">
            Главная
          </Link>
          <span aria-hidden>/</span>
          <Link href="/services/" className="hover:text-white">
            Модули
          </Link>
          <span aria-hidden>/</span>
          {ui.labBadge ? (
            <>
              <span className="rounded bg-violet-500/25 px-2 py-0.5 text-xs font-bold text-violet-200">
                {ui.labBadge}
              </span>
              <span className="hidden text-slate-600 sm:inline" aria-hidden>
                ·
              </span>
              <Link href={ui.classicHref} className="text-slate-500 hover:text-slate-300">
                основная версия
              </Link>
            </>
          ) : null}
        </nav>

        <div className="mt-10 grid min-w-0 flex-1 items-center gap-12 lg:grid-cols-[1fr_1.12fr] lg:gap-10">
          <div className="min-w-0 max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">{concept.eyebrow}</p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight md:text-5xl lg:text-[3.25rem]">
              {concept.headline}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-300">{concept.lead}</p>

            {module.features && module.features.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {module.features.map((f) => (
                  <li
                    key={f}
                    className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-sm text-slate-200 backdrop-blur-sm"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            )}

            {ui.showSearchEngines && <SearchEngineLogos className="mt-8" variant="hero" />}

            <div className="mt-10 max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-1 backdrop-blur-sm">
              <ModuleLeadCta
                variant="hero"
                idPrefix={ui.idPrefix}
                title={concept.cta}
                hint={ui.ctaHint ?? "Email → регистрация в личном кабинете."}
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              <Link href="/tarify/" className="text-brand-200 hover:text-white">
                Тарифы
              </Link>
              <a href={`${LK_URL}/login`} className="text-slate-400 hover:text-white">
                Вход в кабинет →
              </a>
            </div>
          </div>

          <MonitoringV2CommandHeroPanel
            shots={shots}
            panelChips={panelChips}
            keysFooter={ui.keysFooter}
            dynamicsFooter={ui.dynamicsFooter}
          />
        </div>

        <div className="mt-10 md:mt-6">
          <HeroActStrip acts={acts} storyAnchor={ui.storyAnchor} />
        </div>
      </div>
    </section>
  );
}
