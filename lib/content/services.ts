import { compareFlagshipThenAlpha, isFlagshipModuleSlug } from "@/lib/nav-modules";
import { BASE_MODULE_PAGES, isLabModuleSlug } from "./modules";

export type ServiceItem = {
  href: string;
  slug: string;
  title: string;
  description: string;
  flagship?: boolean;
  category: ServiceCategoryId;
};

export type ServiceCategoryId =
  | "flagship"
  | "serp"
  | "monitoring"
  | "content"
  | "semantics"
  | "tech"
  | "tools";

export type ServiceCategory = {
  id: ServiceCategoryId;
  title: string;
  lead: string;
};

/** Краткое описание блока на /services/ — только SEO-модули, без «Компания» и «Тарифы». */
export const SERVICES_INTRO =
  "SEO-модули платформы Титло: на каждой странице — описание и демо. Полный доступ — в личном кабинете после регистрации.";

export const SERVICE_CATEGORIES: readonly ServiceCategory[] = [
  {
    id: "flagship",
    title: "Флагман",
    lead: "Главный модуль платформы — сравнение посадочной с ТОПом.",
  },
  {
    id: "serp",
    title: "Выдача и конкуренты",
    lead: "Кто в топе, какой характер запроса и что править на странице.",
  },
  {
    id: "monitoring",
    title: "Мониторинг",
    lead: "Позиции, доступность, мета, ссылки и сроки доменов.",
  },
  {
    id: "content",
    title: "Контент и текст",
    lead: "Качество текста, риск «Баден-Баден», HTML и длина.",
  },
  {
    id: "semantics",
    title: "Семантика",
    lead: "Ядро, кластеры, списки и генерация фраз.",
  },
  {
    id: "tech",
    title: "Техника",
    lead: "Краул, индексация, DNS и HTTP-заголовки.",
  },
  {
    id: "tools",
    title: "Утилиты",
    lead: "UTM, ROI и быстрые помощники в работе.",
  },
] as const;

const CATEGORY_BY_SLUG: Record<string, ServiceCategoryId> = {
  "analiz-relevantnosti": "flagship",
  "analiz-konkurentov": "serp",
  "tipy-saitov-v-vydache": "serp",
  "geo-lokalizaciya-kommerciya": "serp",
  "sbor-poiskovykh-podskazok": "serp",
  "monitoring-pozicii-sayta": "monitoring",
  "monitoring-saytov": "monitoring",
  "proverka-meta-tegov-online": "monitoring",
  "otslezhivanie-ssylok": "monitoring",
  "otslezhivanie-sroka-registratsii-domenov": "monitoring",
  "analiz-teksta": "content",
  "proverka-teksta-esenin": "content",
  "html-redaktor": "content",
  "podschet-dliny-teksta": "content",
  "vydelenie-unikalnykh-slov-v-tekste": "content",
  "klasterizator-klyuchevykh-slov": "semantics",
  generator_slov: "semantics",
  "sravnenie-spiskov-klyuchevykh-fraz": "semantics",
  "udalenie-dublikatov": "semantics",
  "audit-sajta": "tech",
  "proverka-indeksacii": "tech",
  "zapisi-domena": "tech",
  "http-headers": "tech",
  "utm-metki": "tools",
  "kalkulyator-roi": "tools",
  "generator-paroley": "tools",
};

function shortTitle(title: string): string {
  return title
    .replace(/\s*—\s*.+$/, "")
    .replace(/\s*\(.+\)$/, "")
    .trim();
}

function shortDescription(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= 110) return clean;
  return `${clean.slice(0, 107).replace(/\s+\S*$/, "")}…`;
}

/** Карточки модулей для каталога /services/ (источник — modules.ts, без LAB *-v2/*-v3). */
export const SERVICE_ITEMS: ServiceItem[] = BASE_MODULE_PAGES.filter(
  (module) => !isLabModuleSlug(module.slug)
)
  .map((module) => ({
    href: module.path,
    slug: module.slug,
    title: shortTitle(module.h1 || module.title),
    description: shortDescription(module.description || module.lead),
    flagship: isFlagshipModuleSlug(module.slug) || undefined,
    category: CATEGORY_BY_SLUG[module.slug] ?? "tools",
  }))
  .sort((a, b) =>
    compareFlagshipThenAlpha(
      { slug: a.slug, label: a.title },
      { slug: b.slug, label: b.title }
    )
  );

export function serviceItemsByCategory(categoryId: ServiceCategoryId): ServiceItem[] {
  return SERVICE_ITEMS.filter((item) => item.category === categoryId);
}
