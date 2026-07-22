/** Лимиты как в ЛК (tariff_settings) — править вручную или через sync с кабинетом. */
export type TariffPlan = {
  id: string;
  name: string;
  /** @deprecated Используйте pricePerDay — оставлено для обратной совместимости */
  price: string;
  /** Стоимость тарифа в рублях за календарный день (как в ЛК) */
  pricePerDay: number;
  priceNote?: string;
  tagline: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
};

export const TARIFF_DISCOUNT_NOTE =
  "Итоговая сумма зависит от периода оплаты. Скидки при оплате на 3 месяца — 10%, на 6 месяцев — 20%, на 12 месяцев — 35%.";

export const TARIFF_PLANS: TariffPlan[] = [
  {
    id: "Free",
    name: "Бесплатный",
    price: "0 ₽",
    pricePerDay: 0,
    tagline: "Попробовать платформу и утилиты",
    highlighted: false,
    features: [],
  },
  {
    id: "Optimal",
    name: "Оптимальный",
    price: "65 ₽",
    pricePerDay: 65,
    tagline: "Фрилансер или небольшой проект",
    highlighted: false,
    features: [],
  },
  {
    id: "Ultimate",
    name: "Ультимат",
    price: "129 ₽",
    pricePerDay: 129,
    tagline: "Агентство и несколько клиентов",
    highlighted: true,
    badge: "Популярный",
    features: [],
  },
  {
    id: "Maximum",
    name: "Максимум",
    price: "194 ₽",
    pricePerDay: 194,
    tagline: "Крупные объёмы и много проектов",
    highlighted: false,
    features: [],
  },
];

/** Подписи как в ЛК /tariff (единицы в скобках). */
export const TARIFF_COMPARE_ROWS = [
  { label: "Анализатор Релевантности Страницы (проверки)", key: "relevance" as const },
  { label: "Анализ текста страницы (проверки / сохранения)", key: "text" as const },
  { label: "Анализ конкурентов (проверки)", key: "competitors" as const },
  { label: "Типы сайтов в выдаче (проверки / сохранения)", key: "siteTypes" as const },
  { label: "Записи домена (проверки / сохранения)", key: "domainRecords" as const },
  { label: "Сбор поисковых подсказок (проверки / сохранения)", key: "searchSuggestions" as const },
  {
    label: "Проверка фраз на ГЕОзависимость, локализацию и коммерциализацию (проверки / сохранения)",
    key: "phraseCommerce" as const,
  },
  { label: "Проверка текста Есенин (проверки)", key: "eseninTextCheck" as const },
  { label: "Проверка индексации и сниппетов (проверки / сохранения)", key: "indexCheck" as const },
  { label: "Кластеризатор (проверки)", key: "cluster" as const },
  { label: "Мониторинг сайтов на доступность (проекты)", key: "sites" as const },
  { label: "Мониторинг сайтов: оповещения", key: "sitesAlerts" as const },
  { label: "Мониторинг позиций (проверки)", key: "positions" as const },
  { label: "Отслеживание срока регистрации доменов (проекты)", key: "domains" as const },
  { label: "Отслеживание срока регистрации доменов: оповещения", key: "domainsAlerts" as const },
  { label: "Мониторинг Мета-Тегов (проекты / страницы)", key: "meta" as const },
  { label: "Отслеживание размещенных ссылок на сайтах (проекты / ссылки)", key: "links" as const },
  { label: "Отслеживание ссылок: оповещения", key: "linksAlerts" as const },
  { label: "Аудит сайта (страниц/краул)", key: "siteAudit" as const },
  { label: "Аудит сайта (краулов/мес)", key: "siteAuditCrawls" as const },
] as const;

export const TARIFF_COMPARE: Record<string, Record<string, string>> = {
  relevance: { Free: "3", Optimal: "600", Ultimate: "1 500", Maximum: "2 400" },
  text: { Free: "3 / 0", Optimal: "600 / 10", Ultimate: "1 500 / 20", Maximum: "2 400 / 50" },
  competitors: { Free: "3", Optimal: "300", Ultimate: "1 500", Maximum: "2 400" },
  siteTypes: { Free: "3 / 0", Optimal: "300 / 10", Ultimate: "1 500 / 20", Maximum: "2 400 / 50" },
  domainRecords: { Free: "20 / 5", Optimal: "600 / 30", Ultimate: "2 000 / 50", Maximum: "5 000 / 100" },
  searchSuggestions: { Free: "3 / 0", Optimal: "300 / 10", Ultimate: "1 500 / 20", Maximum: "2 400 / 50" },
  phraseCommerce: { Free: "3 / 0", Optimal: "300 / 10", Ultimate: "1 500 / 20", Maximum: "2 400 / 50" },
  eseninTextCheck: { Free: "5", Optimal: "100", Ultimate: "300", Maximum: "700" },
  indexCheck: { Free: "5 / 5", Optimal: "600 / 30", Ultimate: "1 500 / 50", Maximum: "2 400 / 100" },
  cluster: { Free: "50", Optimal: "5 000", Ultimate: "12 000", Maximum: "30 000" },
  positions: { Free: "50", Optimal: "20 000", Ultimate: "50 000", Maximum: "120 000" },
  sites: { Free: "1", Optimal: "10", Ultimate: "30", Maximum: "100" },
  sitesAlerts: {
    Free: "telegram-only",
    Optimal: "email-telegram",
    Ultimate: "email-telegram",
    Maximum: "email-telegram",
  },
  domains: { Free: "1", Optimal: "10", Ultimate: "30", Maximum: "100" },
  domainsAlerts: {
    Free: "telegram-only",
    Optimal: "email-telegram",
    Ultimate: "email-telegram",
    Maximum: "email-telegram",
  },
  meta: { Free: "1 / 10", Optimal: "10 / 1 000", Ultimate: "20 / 2 000", Maximum: "50 / 5 000" },
  links: { Free: "1 / 20", Optimal: "10 / 200", Ultimate: "20 / 400", Maximum: "50 / 5 000" },
  linksAlerts: {
    Free: "telegram-only",
    Optimal: "email-telegram",
    Ultimate: "email-telegram",
    Maximum: "email-telegram",
  },
  siteAudit: { Free: "500", Optimal: "5 000", Ultimate: "20 000", Maximum: "50 000" },
  siteAuditCrawls: { Free: "1", Optimal: "4", Ultimate: "8", Maximum: "12" },
};
