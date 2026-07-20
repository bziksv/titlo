import type { NavLink } from "@/lib/site";

/** Slug из href меню (`/analiz-relevantnosti/` → `analiz-relevantnosti`). */
function slugFromNavHref(href: string): string {
  return href.replace(/^\/+|\/+$/g, "");
}

/** LAB-версии не попадают в меню (только прямой URL + robots disallow). */
export function isLabNavHref(href: string): boolean {
  const slug = slugFromNavHref(href);
  return slug.endsWith("-v1") || slug.endsWith("-v2") || slug.endsWith("-v3");
}

/** Базовые модули в меню — один пункт на модуль, публичный URL. */
export const MODULE_NAV_BASE = [
  { slug: "analiz-relevantnosti", label: "Анализ релевантности" },
  { slug: "analiz-konkurentov", label: "Анализ конкурентов" },
  { slug: "monitoring-pozicii-sayta", label: "Мониторинг позиций сайта" },
  { slug: "monitoring-saytov", label: "Мониторинг корректной работы сайтов" },
  { slug: "proverka-meta-tegov-online", label: "Мониторинг мета-тегов" },
  { slug: "generator_slov", label: "Генератор слов" },
  { slug: "podschet-dliny-teksta", label: "Подсчет длины текста" },
  { slug: "generator-paroley", label: "Генератор паролей" },
  { slug: "sravnenie-spiskov-klyuchevykh-fraz", label: "Сравнение списков ключевых фраз" },
  { slug: "udalenie-dublikatov", label: "Удаление дубликатов" },
  { slug: "utm-metki", label: "UTM метки" },
  { slug: "kalkulyator-roi", label: "Калькулятор ROI" },
  { slug: "http-headers", label: "HTTP headers" },
  { slug: "proverka-indeksacii", label: "Проверка индексации и сниппетов" },
  { slug: "proverka-teksta-esenin", label: "Проверка текста Есенин" },
  { slug: "sbor-poiskovykh-podskazok", label: "Сбор поисковых подсказок" },
  { slug: "zapisi-domena", label: "Записи домена" },
  { slug: "tipy-saitov-v-vydache", label: "Типы сайтов в выдаче" },
  { slug: "geo-lokalizaciya-kommerciya", label: "Гео, локализация и коммерция" },
  { slug: "html-redaktor", label: "HTML-редактор" },
  { slug: "vydelenie-unikalnykh-slov-v-tekste", label: "Выделение уникальных слов в тексте" },
  { slug: "otslezhivanie-ssylok", label: "Отслеживание ссылок" },
  { slug: "otslezhivanie-sroka-registratsii-domenov", label: "Отслеживание срока регистрации доменов" },
  { slug: "analiz-teksta", label: "Анализ текста" },
  { slug: "klasterizator-klyuchevykh-slov", label: "Кластеризатор ключевых слов" },
] as const;

export function buildModuleNavLinks(): NavLink[] {
  return MODULE_NAV_BASE.map((item) => ({
    href: `/${item.slug}/`,
    label: item.label,
  })).filter((item) => !isLabNavHref(item.href));
}
