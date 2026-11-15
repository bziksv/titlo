import type { ModuleV2OrbitNode } from "@/lib/content/module-v2/types";

/**
 * Перелинковка модулей по смысловым группам (блок «С чем стыкуется»).
 * Каждый публичный модуль получает входящие ссылки минимум с двух других лендингов —
 * проверка: scripts не нужен, см. тест-скрипт в PR / `getModuleIncomingCounts()`.
 */
export const MODULE_ORBIT_CARD: Record<string, Omit<ModuleV2OrbitNode, "href">> = {
  "analiz-relevantnosti": { label: "Анализ релевантности", role: "ТОП и правки текста" },
  "analiz-konkurentov": { label: "Анализ конкурентов", role: "Кто в выдаче по фразам" },
  "monitoring-pozicii-sayta": { label: "Мониторинг позиций", role: "Динамика по ключам" },
  "monitoring-saytov": { label: "Мониторинг сайтов", role: "Uptime и доступность" },
  "proverka-meta-tegov-online": { label: "Мониторинг мета-тегов", role: "Title и description" },
  generator_slov: { label: "Генератор слов", role: "Комбинации фраз" },
  "podschet-dliny-teksta": { label: "Подсчёт длины текста", role: "Символы и слова" },
  "generator-paroley": { label: "Генератор паролей", role: "Доступы к сайтам" },
  "sravnenie-spiskov-klyuchevykh-fraz": { label: "Сравнение списков", role: "Пересечение и разница" },
  "udalenie-dublikatov": { label: "Удаление дубликатов", role: "Чистка списков" },
  "utm-metki": { label: "UTM-метки", role: "Разметка рекламы" },
  "kalkulyator-roi": { label: "Калькулятор ROI", role: "Окупаемость кампаний" },
  "http-headers": { label: "HTTP headers", role: "Ответ сервера по URL" },
  "audit-sajta": { label: "Аудит сайта", role: "Технические и SEO-ошибки" },
  "proverka-indeksacii": { label: "Проверка индексации", role: "Индекс и сниппеты" },
  "proverka-teksta-esenin": { label: "Проверка текста Есенин", role: "Риск «Баден-Баден»" },
  "sbor-poiskovykh-podskazok": { label: "Поисковые подсказки", role: "Хвост для ядра" },
  "zapisi-domena": { label: "Записи домена", role: "DNS и WHOIS" },
  "tipy-saitov-v-vydache": { label: "Типы сайтов в выдаче", role: "Кто занимает ТОП" },
  "geo-lokalizaciya-kommerciya": { label: "Гео и коммерция", role: "Тип запроса" },
  "html-redaktor": { label: "HTML-редактор", role: "Вёрстка текста" },
  "vydelenie-unikalnykh-slov-v-tekste": { label: "Уникальные слова", role: "Словарь текста" },
  "otslezhivanie-ssylok": { label: "Отслеживание ссылок", role: "Донор и анкор" },
  "otslezhivanie-sroka-registratsii-domenov": { label: "Срок регистрации доменов", role: "Напоминания о продлении" },
  "analiz-teksta": { label: "Анализ текста", role: "Тошнота и водность" },
  "klasterizator-klyuchevykh-slov": { label: "Кластеризатор", role: "Группировка ядра" },
};

/** 4 соседа на модуль: семантика · текст · позиции/конкуренты · техника · маркетинг. */
export const MODULE_RELATED: Record<string, readonly string[]> = {
  // Семантика
  "sbor-poiskovykh-podskazok": ["generator_slov", "klasterizator-klyuchevykh-slov", "udalenie-dublikatov", "geo-lokalizaciya-kommerciya"],
  generator_slov: ["sbor-poiskovykh-podskazok", "udalenie-dublikatov", "sravnenie-spiskov-klyuchevykh-fraz", "klasterizator-klyuchevykh-slov"],
  "klasterizator-klyuchevykh-slov": ["sbor-poiskovykh-podskazok", "geo-lokalizaciya-kommerciya", "tipy-saitov-v-vydache", "analiz-relevantnosti"],
  "udalenie-dublikatov": ["sravnenie-spiskov-klyuchevykh-fraz", "generator_slov", "klasterizator-klyuchevykh-slov", "vydelenie-unikalnykh-slov-v-tekste"],
  "sravnenie-spiskov-klyuchevykh-fraz": ["udalenie-dublikatov", "generator_slov", "vydelenie-unikalnykh-slov-v-tekste", "sbor-poiskovykh-podskazok"],
  "geo-lokalizaciya-kommerciya": ["tipy-saitov-v-vydache", "analiz-konkurentov", "klasterizator-klyuchevykh-slov", "monitoring-pozicii-sayta"],
  "tipy-saitov-v-vydache": ["geo-lokalizaciya-kommerciya", "analiz-konkurentov", "analiz-relevantnosti", "proverka-indeksacii"],
  // Текст и контент
  "analiz-relevantnosti": ["analiz-teksta", "analiz-konkurentov", "proverka-teksta-esenin", "monitoring-pozicii-sayta"],
  "analiz-teksta": ["proverka-teksta-esenin", "analiz-relevantnosti", "vydelenie-unikalnykh-slov-v-tekste", "podschet-dliny-teksta"],
  "proverka-teksta-esenin": ["analiz-teksta", "analiz-relevantnosti", "html-redaktor", "podschet-dliny-teksta"],
  "podschet-dliny-teksta": ["proverka-meta-tegov-online", "analiz-teksta", "html-redaktor", "vydelenie-unikalnykh-slov-v-tekste"],
  "vydelenie-unikalnykh-slov-v-tekste": ["analiz-teksta", "udalenie-dublikatov", "sravnenie-spiskov-klyuchevykh-fraz", "podschet-dliny-teksta"],
  "html-redaktor": ["proverka-teksta-esenin", "podschet-dliny-teksta", "analiz-teksta", "proverka-meta-tegov-online"],
  // Позиции и конкуренты
  "monitoring-pozicii-sayta": ["analiz-konkurentov", "analiz-relevantnosti", "proverka-indeksacii", "klasterizator-klyuchevykh-slov"],
  "analiz-konkurentov": ["monitoring-pozicii-sayta", "analiz-relevantnosti", "tipy-saitov-v-vydache", "proverka-meta-tegov-online"],
  // Техника
  "audit-sajta": ["proverka-meta-tegov-online", "http-headers", "proverka-indeksacii", "monitoring-saytov"],
  "http-headers": ["audit-sajta", "monitoring-saytov", "proverka-indeksacii", "zapisi-domena"],
  "proverka-indeksacii": ["audit-sajta", "proverka-meta-tegov-online", "monitoring-pozicii-sayta", "http-headers"],
  "proverka-meta-tegov-online": ["audit-sajta", "podschet-dliny-teksta", "proverka-indeksacii", "http-headers"],
  "monitoring-saytov": ["http-headers", "otslezhivanie-sroka-registratsii-domenov", "otslezhivanie-ssylok", "audit-sajta"],
  "zapisi-domena": ["otslezhivanie-sroka-registratsii-domenov", "monitoring-saytov", "http-headers", "generator-paroley"],
  "otslezhivanie-sroka-registratsii-domenov": ["zapisi-domena", "monitoring-saytov", "otslezhivanie-ssylok", "generator-paroley"],
  "otslezhivanie-ssylok": ["monitoring-saytov", "http-headers", "monitoring-pozicii-sayta", "analiz-konkurentov"],
  // Маркетинг и утилиты
  "utm-metki": ["kalkulyator-roi", "analiz-konkurentov", "monitoring-pozicii-sayta", "html-redaktor"],
  "kalkulyator-roi": ["utm-metki", "monitoring-pozicii-sayta", "analiz-konkurentov", "monitoring-saytov"],
  "generator-paroley": ["zapisi-domena", "monitoring-saytov", "utm-metki", "kalkulyator-roi"],
};

/** Узлы орбиты для модуля; undefined — если модуль не в карте. */
export function getRelatedOrbit(baseSlug: string): readonly ModuleV2OrbitNode[] | undefined {
  const related = MODULE_RELATED[baseSlug];
  if (!related) return undefined;
  return related.map((slug) => ({ ...MODULE_ORBIT_CARD[slug], href: `/${slug}/` }));
}

/** Сколько входящих ссылок получает каждый модуль из блока «С чем стыкуется». */
export function getModuleIncomingCounts(): Record<string, number> {
  const counts: Record<string, number> = Object.fromEntries(Object.keys(MODULE_ORBIT_CARD).map((s) => [s, 0]));
  for (const list of Object.values(MODULE_RELATED)) for (const s of list) counts[s] = (counts[s] ?? 0) + 1;
  return counts;
}
