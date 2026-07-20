import { TARIFF_COMPARE } from "@/lib/content/tariffs";

/** Строки «Платные модули» в карточках — порядок как в таблице сравнения / ЛК. */
export const TARIFF_CARD_MODULE_ROWS = [
  { key: "relevance", label: "Анализатор релевантности" },
  { key: "text", label: "Анализ текста" },
  { key: "competitors", label: "Анализ конкурентов" },
  { key: "siteTypes", label: "Типы сайтов в выдаче" },
  { key: "domainRecords", label: "Записи домена" },
  { key: "searchSuggestions", label: "Сбор поисковых подсказок" },
  { key: "phraseCommerce", label: "Гео / локализация / коммерция фраз" },
  { key: "eseninTextCheck", label: "Проверка текста Есенин" },
  { key: "indexCheck", label: "Проверка индексации и сниппетов" },
  { key: "cluster", label: "Кластеризатор" },
  { key: "sites", label: "Мониторинг сайтов" },
  { key: "positions", label: "Мониторинг позиций" },
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
  "Проверка заголовков HTTP",
] as const;

export function formatTariffCardModuleValue(key: string, raw: string | undefined): string | null {
  if (!raw || raw === "0") return null;

  switch (key) {
    case "relevance":
    case "competitors":
    case "eseninTextCheck":
    case "positions":
    case "cluster":
      return `${raw} проверок/мес`;
    case "text":
    case "siteTypes":
    case "domainRecords":
    case "searchSuggestions":
    case "phraseCommerce":
    case "indexCheck":
      return `${raw.replace(/\s+\/\s+/g, " / ")} (проверки / сохранения)`;
    case "sites":
    case "domains":
      return `${raw} ${raw === "1" ? "проект" : "проектов"}`;
    case "meta":
      return `${raw.replace(/\s+\/\s+/g, " / ")} (проекты / страницы)`;
    case "links":
      return `${raw.replace(/\s+\/\s+/g, " / ")} (проекты / ссылки)`;
    default:
      return raw;
  }
}

export function tariffCardModuleValue(planId: string, key: string): string | null {
  const raw = TARIFF_COMPARE[key]?.[planId];
  return formatTariffCardModuleValue(key, raw);
}
