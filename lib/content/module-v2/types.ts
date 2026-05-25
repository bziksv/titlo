import type { ModulePlainContent } from "@/components/module-landings/ModulePlainSection";

/** Конфиг лендинга v2 «Центр управления» (общий для модулей). */

export type ModuleV2Concept = {
  eyebrow: string;
  headline: string;
  lead: string;
  cta: string;
};

export type ModuleV2PainGain = {
  painTitle: string;
  pains: readonly string[];
  gainTitle: string;
  gains: readonly string[];
};

export type ModuleV2Act = {
  act: string;
  title: string;
  lead: string;
  image: string;
  imageAlt: string;
  imageFocus?: string;
  points: readonly string[];
};

export type ModuleV2Metric = { value: string; unit: string; note: string };

export type ModuleV2OrbitNode = { label: string; href: string; role: string };

export type ModuleV2SectionCopy = {
  eyebrow: string;
  title: string;
  lead: string;
};

export type ModuleV2HeroUi = {
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

export type ModuleV2FooterUi = {
  idPrefix: string;
  finalTitle: string;
  finalLead: string;
  /** Публичный URL модуля (без -v2) */
  classicHref: string;
  faqTitle: string;
  videoTitle?: string;
  videoLead?: string;
  /** URL *-v2 / *-v3 — иначе публичная страница */
  isLabRoute?: boolean;
};

export type ModuleV2OrbitUi = ModuleV2SectionCopy & { hubTitle: string };

/** Виджет «Попробовать бесплатно» на публичном v2-лендинге */
export type ModuleV2DemoWidget = "text-analyzer" | "text-length" | "competitor-analysis" | "duplicates";

export type ModuleV2PageConfig = {
  slug: string;
  baseSlug: string;
  concept: ModuleV2Concept;
  heroUi: ModuleV2HeroUi;
  painGain: ModuleV2PainGain;
  acts: readonly ModuleV2Act[];
  storySection: ModuleV2SectionCopy;
  metrics: readonly ModuleV2Metric[];
  metricSection: ModuleV2SectionCopy;
  orbit: readonly ModuleV2OrbitNode[];
  orbitSection: ModuleV2OrbitUi;
  options: readonly string[];
  optionsSection: ModuleV2SectionCopy;
  plain: ModulePlainContent;
  videos: readonly { id: string; title: string; description: string }[];
  faq: readonly { q: string; a: string }[];
  footerUi: ModuleV2FooterUi;
  /** Секция демо после metric wall (если задано) */
  demoWidget?: ModuleV2DemoWidget;
};
