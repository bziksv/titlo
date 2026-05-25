import type { ModulePlainContent } from "@/components/module-landings/ModulePlainSection";
import type { ModulePage } from "@/lib/content/modules";
import type { ClassicV3Source } from "@/lib/content/module-v3/build-config";
import { MODULE_V2_ENRICHMENT } from "@/lib/content/module-v2/enrichment";
import { MODULE_V2_OVERRIDES, type ModuleV2Override } from "@/lib/content/module-v2/overrides";
import { MODULE_V2_SECTION_ENRICHMENT } from "@/lib/content/module-v2/sections-enrichment";
import { MODULE_V2_VIDEOS } from "@/lib/content/module-v2/videos-by-slug";
import type {
  ModuleV2Act,
  ModuleV2DemoWidget,
  ModuleV2FooterUi,
  ModuleV2HeroUi,
  ModuleV2Metric,
  ModuleV2OrbitNode,
  ModuleV2PageConfig,
  ModuleV2PainGain,
  ModuleV2SectionCopy,
} from "@/lib/content/module-v2/types";

const DEFAULT_SHOT = "/modules/assets/3d7d72c85b4af88c.jpg";
const DEFAULT_SHOT_ALT = "/modules/assets/518ec5eeb1bee67f.jpg";

/** Публичные v2-лендинги с демо-виджетом (как в classic landing) */
const DEMO_WIDGET_BY_BASE: Partial<Record<string, ModuleV2DemoWidget>> = {
  "analiz-teksta": "text-analyzer",
  "analiz-konkurentov": "competitor-analysis",
  "podschet-dliny-teksta": "text-length",
  "udalenie-dublikatov": "duplicates",
};

const DEFAULT_ORBIT: readonly ModuleV2OrbitNode[] = [
  { label: "Анализ релевантности", href: "/analiz-relevantnosti/", role: "ТОП и релевантность страницы" },
  { label: "Анализ конкурентов", href: "/analiz-konkurentov/", role: "Кто в выдаче по фразам" },
  { label: "Мониторинг позиций", href: "/monitoring-pozicii-sayta/", role: "Позиции по ключам" },
  { label: "HTTP headers", href: "/http-headers/", role: "Технический аудит URL" },
];

export type ModuleV2BuildOpts = ModuleV2Override;

function splitHeadline(h1: string): string {
  const words = h1.trim().split(/\s+/);
  if (words.length <= 4) return h1;
  return words.slice(0, Math.ceil(words.length / 2)).join(" ");
}

function buildMetrics(stats: ClassicV3Source["stats"]): readonly ModuleV2Metric[] {
  return stats.slice(0, 4).map((s, i) => {
    const t = s.value.trim();
    const slash = t.match(/^([^/]+)\/(.+)$/);
    if (slash) {
      return { value: slash[1], unit: slash[2], note: s.label.toLowerCase().slice(0, 40) };
    }
    if (/^\d+/.test(t)) {
      const m = /^(\d+)\s*(.*)$/.exec(t);
      return {
        value: m?.[1] ?? t,
        unit: m?.[2]?.trim() || "—",
        note: s.label.toLowerCase().slice(0, 40),
      };
    }
    return { value: t, unit: "—", note: s.label.toLowerCase().slice(0, 40) || `параметр ${i + 1}` };
  });
}

function buildActs(
  source: ClassicV3Source,
  shots: readonly { src: string; caption: string }[]
): readonly ModuleV2Act[] {
  const imgs = shots.length ? shots : [{ src: DEFAULT_SHOT, caption: "Интерфейс" }];
  return source.steps.slice(0, 3).map((step, i) => ({
    act: /^\d+$/.test(step.step) ? step.step.padStart(2, "0") : step.step || String(i + 1).padStart(2, "0"),
    title: step.title,
    lead: step.text,
    image: imgs[i % imgs.length]?.src ?? DEFAULT_SHOT,
    imageAlt: imgs[i % imgs.length]?.caption ?? step.title,
    imageFocus: i === 1 ? "65% top" : undefined,
    points:
      source.techLayers[i] && source.techLayers[i].short
        ? ([source.techLayers[i].short, source.techLayers[i].title].filter(Boolean).slice(0, 3) as string[])
        : (source.options?.slice(0, 3) ?? []),
  }));
}

function normalizePlain(plain: ClassicV3Source["plain"]): ModulePlainContent {
  return {
    title: plain.title,
    lead: plain.lead,
    items: plain.items.map((item, i) => {
      const raw = item as { id?: string; title: string; text?: string; bullets?: readonly string[] };
      const id = raw.id ?? `p-${i}`;
      if (raw.bullets?.length) {
        return { id, title: raw.title, bullets: raw.bullets };
      }
      return { id, title: raw.title, text: raw.text ?? "" };
    }),
  };
}

function buildPanelChips(source: ClassicV3Source, features: string[] | undefined) {
  const fromStats = source.stats.slice(0, 3).map((s, i) => ({
    label: s.value.length > 12 ? `${s.value.slice(0, 10)}…` : s.value,
    tone: (["emerald", "sky", "amber"] as const)[i % 3],
  }));
  if (fromStats.length >= 2) return fromStats;
  return (features ?? []).slice(0, 3).map((f, i) => ({
    label: f.length > 14 ? `${f.slice(0, 12)}…` : f,
    tone: (["emerald", "sky", "amber"] as const)[i % 3],
  }));
}

function mergeSection(
  base: ModuleV2SectionCopy,
  patch?: Partial<ModuleV2SectionCopy>
): ModuleV2SectionCopy {
  return patch ? { ...base, ...patch } : base;
}

function mergeOverride(
  baseSlug: string,
  opts?: ModuleV2BuildOpts
): ModuleV2Override {
  const preset = MODULE_V2_OVERRIDES[baseSlug];
  const enrich = MODULE_V2_ENRICHMENT[baseSlug];
  const sections = MODULE_V2_SECTION_ENRICHMENT[baseSlug];
  return {
    ...preset,
    ...enrich,
    ...sections,
    ...opts,
    painGain: { ...preset?.painGain, ...enrich?.painGain, ...opts?.painGain },
    heroUi: { ...preset?.heroUi, ...enrich?.heroUi, ...opts?.heroUi },
    storySection: { ...preset?.storySection, ...enrich?.storySection, ...opts?.storySection },
    metricSection: {
      ...preset?.metricSection,
      ...enrich?.metricSection,
      ...sections?.metricSection,
      ...opts?.metricSection,
    },
    optionsSection: {
      ...preset?.optionsSection,
      ...enrich?.optionsSection,
      ...sections?.optionsSection,
      ...opts?.optionsSection,
    },
    orbitSection: { ...preset?.orbitSection, ...enrich?.orbitSection, ...opts?.orbitSection },
    footerUi: { ...preset?.footerUi, ...enrich?.footerUi, ...sections?.footerUi, ...opts?.footerUi },
  };
}

export function buildModuleV2Config(
  baseSlug: string,
  module: ModulePage,
  source: ClassicV3Source,
  opts?: ModuleV2BuildOpts
): ModuleV2PageConfig {
  const o = mergeOverride(baseSlug, opts);

  const slug = `${baseSlug}-v2`;
  const shots = source.screenshots?.length
    ? source.screenshots
    : [{ src: DEFAULT_SHOT, caption: module.title }, { src: DEFAULT_SHOT_ALT, caption: "Отчёт" }];

  const defaultPainGain: ModuleV2PainGain = {
    painTitle: "Без единого инструмента",
    pains: [
      "Задача размазана по таблицам и сторонним сервисам",
      "Повторные проверки — вручную, без истории",
      "Сложно показать результат клиенту или команде",
    ],
    gainTitle: "В Датагоне",
    gains: [
      "Один проект — данные модуля в кабинете",
      "Повторные запуски с датами и выгрузкой",
      "Связка с другими SEO-модулями платформы",
    ],
  };

  const painGain: ModuleV2PainGain = { ...defaultPainGain, ...o.painGain };

  const storyBase: ModuleV2SectionCopy = {
    eyebrow: "Три акта",
    title: "От ввода до отчёта — один сценарий",
    lead: "Прокрутите сюжет или выберите этап — навигация синхронизирована со скроллом.",
  };

  const metricBase: ModuleV2SectionCopy = {
    eyebrow: "Цифры без маркетингового шума",
    title: "Параметры модуля в одном взгляде",
    lead: "Лимиты и возможности — как в кабинете, без лишних обещаний.",
  };

  const optionsBase: ModuleV2SectionCopy = {
    eyebrow: "Параметры",
    title: "Что учитывается в работе модуля",
    lead: "Настройки и ограничения — в одном блоке перед FAQ.",
  };

  const hub = o.hubTitle ?? module.h1.split(" ").slice(0, 3).join(" ");

  const heroUi: ModuleV2HeroUi = {
    classicHref: `/${baseSlug}/`,
    storyAnchor: `module-v2-story-${baseSlug}`,
    idPrefix: `module-v2-${baseSlug}`,
    showSearchEngines: false,
    panelChips: buildPanelChips(source, module.features),
    keysFooter: "Проект · задача",
    dynamicsFooter: "Результат · отчёт",
    ctaHint: "Email → регистрация и модуль в личном кабинете.",
    ...o.heroUi,
  };

  const videosFromClassic = MODULE_V2_VIDEOS[baseSlug];
  const videos =
    o.videos ??
    videosFromClassic ??
    [];

  const shortTitle = module.title.replace(/\s*\(LAB.*\)$/i, "").trim();

  const footerUi: ModuleV2FooterUi = {
    idPrefix: heroUi.idPrefix,
    finalTitle: `Запустите «${shortTitle}»`,
    finalLead: "",
    classicHref: heroUi.classicHref,
    faqTitle: `Вопросы: ${shortTitle}`,
    videoTitle: videos.length ? `Видео: ${shortTitle}` : undefined,
    videoLead: videos.length ? "Короткие уроки по интерфейсу и типовым сценариям." : undefined,
    ...o.footerUi,
  };

  return {
    slug,
    baseSlug,
    concept: {
      eyebrow: o.eyebrow ?? "Центр управления · LAB v2",
      headline: o.headline ?? splitHeadline(source.hero.title || module.h1),
      lead: o.lead ?? source.hero.lead,
      cta: o.cta ?? "Открыть в кабинете",
    },
    heroUi,
    painGain,
    acts: o.acts ?? buildActs(source, shots),
    storySection: mergeSection(storyBase, o.storySection),
    metrics: o.metrics ?? buildMetrics(source.stats),
    metricSection: mergeSection(metricBase, o.metricSection),
    orbit:
      o.orbit ??
      DEFAULT_ORBIT.filter((n) => !n.href.includes(`/${baseSlug}/`)).slice(0, 4),
    orbitSection: {
      hubTitle: hub,
      eyebrow: o.orbitSection?.eyebrow ?? "Экосистема",
      title: o.orbitSection?.title ?? `${hub} — узел, не остров`,
      lead:
        o.orbitSection?.lead ??
        "Связанные модули Датагона — переход без смены платформы и повторного входа.",
    },
    options: source.options ?? module.features ?? [],
    optionsSection: mergeSection(optionsBase, o.optionsSection),
    plain: normalizePlain(source.plain),
    videos,
    faq: source.faq,
    footerUi,
    demoWidget: DEMO_WIDGET_BY_BASE[baseSlug],
  };
}
