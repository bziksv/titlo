import { TARIFF_COMPARE } from "@/lib/content/tariffs";

/** Строки «Платные модули» в карточках — один порядок и высота на всех тарифах. */
export const TARIFF_CARD_MODULE_ROWS = [
  { key: "relevance", label: "Анализатор релевантности" },
  { key: "text", label: "Анализ текста" },
  { key: "competitors", label: "Анализ конкурентов" },
  { key: "indexCheck", label: "Проверка индексации" },
  { key: "eseninTextCheck", label: "Проверка текста Есенин" },
  { key: "cluster", label: "Кластеризатор" },
  { key: "positions", label: "Мониторинг позиций" },
  { key: "sites", label: "Мониторинг сайтов" },
  { key: "domains", label: "Срок регистрации доменов" },
  { key: "meta", label: "Мета-теги" },
  { key: "links", label: "Отслеживание ссылок" },
] as const;

export const TARIFF_CARD_UTILS = [
  "Генератор слов",
  "Генератор паролей",
  "Подсчёт длины текста",
  "Сравнение списков ключевых фраз",
  "Выделение уникальных слов",
  "HTML-редактор",
  "Удаление дубликатов",
  "UTM-метки",
  "Калькулятор ROI",
] as const;

export function formatTariffCardModuleValue(key: string, raw: string | undefined): string | null {
  if (!raw || raw === "0") return null;

  switch (key) {
    case "relevance":
    case "text":
    case "competitors":
      return `${raw} запросов/мес`;
    case "indexCheck":
    case "eseninTextCheck":
    case "positions":
      return `${raw} проверок/мес`;
    case "cluster":
      return `${raw} усл. запросов/мес`;
    case "sites":
    case "domains":
      return `${raw} ${raw === "1" ? "проект" : "проектов"}`;
    case "meta":
    case "links":
      return raw.replace(/\s+\/\s+/g, " / ");
    default:
      return raw;
  }
}

export function tariffCardModuleValue(planId: string, key: string): string | null {
  const raw = TARIFF_COMPARE[key]?.[planId];
  return formatTariffCardModuleValue(key, raw);
}
