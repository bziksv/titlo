/**
 * ClassicV3Source для модулей, у которых раньше был только «синий» classic hero.
 * Нужен, чтобы публичный URL отдавал ModuleV2Landing (как у релевантности).
 */
import type { ClassicV3Source } from "@/lib/content/module-v3/build-config";
import {
  SITE_AUDIT_FAQ,
  SITE_AUDIT_FEATURES,
  SITE_AUDIT_HERO,
  SITE_AUDIT_CAPABILITIES,
  SITE_AUDIT_OPTIONS,
  SITE_AUDIT_SCREENSHOTS,
  SITE_AUDIT_STATS,
} from "@/lib/content/audit-sajta-page";
import {
  PHRASE_COMMERCE_FAQ,
  PHRASE_COMMERCE_HERO,
  PHRASE_COMMERCE_SCREENSHOTS,
  PHRASE_COMMERCE_STATS,
  PHRASE_COMMERCE_STEPS,
  PHRASE_COMMERCE_WHY,
} from "@/lib/content/geo-lokalizaciya-kommerciya-page";
import {
  SITE_TYPES_FAQ,
  SITE_TYPES_HERO,
  SITE_TYPES_SCREENSHOTS,
  SITE_TYPES_STATS,
  SITE_TYPES_STEPS,
  SITE_TYPES_WHY,
} from "@/lib/content/tipy-saitov-v-vydache-page";
import {
  DOMAIN_RECORDS_FAQ,
  DOMAIN_RECORDS_HERO,
  DOMAIN_RECORDS_SCREENSHOTS,
  DOMAIN_RECORDS_STATS,
  DOMAIN_RECORDS_STEPS,
  DOMAIN_RECORDS_WHY,
} from "@/lib/content/zapisi-domena-page";
import {
  SEARCH_SUGGESTIONS_FAQ,
  SEARCH_SUGGESTIONS_HERO,
  SEARCH_SUGGESTIONS_STATS,
  SEARCH_SUGGESTIONS_STEPS,
  SEARCH_SUGGESTIONS_WHY,
} from "@/lib/content/sbor-poiskovykh-podskazok-page";
import {
  INDEX_CHECK_FAQ,
  INDEX_CHECK_HERO,
  INDEX_CHECK_STATS,
} from "@/lib/content/proverka-indeksacii-page";
import {
  ESENIN_TEXT_CHECK_FAQ,
  ESENIN_TEXT_CHECK_HERO,
  ESENIN_TEXT_CHECK_INSIGHTS,
  ESENIN_TEXT_CHECK_INSIGHTS_GRID,
  ESENIN_TEXT_CHECK_INSIGHTS_HIGHLIGHT,
  ESENIN_TEXT_CHECK_PLAIN,
  ESENIN_TEXT_CHECK_STATS,
  ESENIN_TEXT_CHECK_STEPS,
} from "@/lib/content/proverka-teksta-esenin-page";

const SHOT_A = "/modules/assets/3d7d72c85b4af88c.jpg";
const SHOT_B = "/modules/assets/518ec5eeb1bee67f.jpg";

function layersFromWhy(
  items: readonly { title: string; text: string }[]
): ClassicV3Source["techLayers"] {
  return items.slice(0, 4).map((item, i) => ({
    id: `L${i + 1}`,
    title: item.title,
    short: item.title,
    text: item.text,
  }));
}

function layersFromFeatures(
  items: readonly { title: string; text: string }[]
): ClassicV3Source["techLayers"] {
  return items.slice(0, 4).map((item, i) => ({
    id: `F${i + 1}`,
    title: item.title,
    short: item.title,
    text: item.text,
  }));
}

function plainFromWhy(
  title: string,
  lead: string,
  items: readonly { title: string; text: string }[]
): ClassicV3Source["plain"] {
  return {
    title,
    lead,
    items: items.map((item) => ({ title: item.title, text: item.text })),
  };
}

function shots(caption: string): ClassicV3Source["screenshots"] {
  return [
    { src: SHOT_A, caption },
    { src: SHOT_B, caption: "Отчёт в кабинете" },
  ];
}

export const SITE_AUDIT_V2_SOURCE: ClassicV3Source = {
  hero: SITE_AUDIT_HERO,
  stats: SITE_AUDIT_STATS,
  steps: [
    {
      step: "01",
      title: "Сайт и лимит",
      text: "Укажите домен и сколько страниц обойти по тарифу. Sitemap и robots подхватываются сами.",
    },
    {
      step: "02",
      title: "Обход и приоритеты",
      text: "Сначала грубые ошибки, потом прочие, важные замечания, предупреждения и инфо — по страницам и кодам.",
    },
    {
      step: "03",
      title: "Отчёт и ссылка клиенту",
      text: "Сводка, сравнение с прошлой проверкой, «исправлено» и публичная ссылка на отчёт.",
    },
  ],
  techLayers: layersFromFeatures(SITE_AUDIT_FEATURES),
  grid: SITE_AUDIT_FEATURES.map((f) => ({ title: f.title, text: f.text })),
  highlight: {
    title: "Техника и SEO в одной проверке",
    lead: "Один обход вместо разрозненных сканеров: приоритеты ошибок и удобная передача отчёта клиенту.",
    bullets: [
      "До 50 000 страниц за проверку на тарифе Максимум",
      "Посадочные из мониторинга позиций учитываются в аудите",
      "Публичная ссылка на отчёт без входа в кабинет",
    ],
  },
  insightsMeta: {
    eyebrow: "Аудит",
    title: "Что проверяем",
    lead: "Технические ошибки, SEO-дубли, каннибализация, ссылка на отчёт и статусы правок.",
  },
  screenshots: SITE_AUDIT_SCREENSHOTS,
  plain: {
    title: SITE_AUDIT_CAPABILITIES.title,
    lead: SITE_AUDIT_CAPABILITIES.lead,
    items: SITE_AUDIT_CAPABILITIES.items.map((item) => ({
      id: item.id,
      title: item.title,
      bullets: [...item.bullets],
    })),
  },
  faq: SITE_AUDIT_FAQ,
  options: [...SITE_AUDIT_OPTIONS],
};

export const PHRASE_COMMERCE_V2_SOURCE: ClassicV3Source = {
  hero: PHRASE_COMMERCE_HERO,
  stats: PHRASE_COMMERCE_STATS,
  steps: PHRASE_COMMERCE_STEPS.slice(0, 3).map((s) => ({
    step: s.step,
    title: s.title,
    text: s.text,
  })),
  techLayers: layersFromWhy(PHRASE_COMMERCE_WHY.items),
  grid: PHRASE_COMMERCE_WHY.items.map((i) => ({ title: i.title, text: i.text })),
  highlight: {
    title: PHRASE_COMMERCE_WHY.title,
    lead: PHRASE_COMMERCE_WHY.lead,
    bullets: PHRASE_COMMERCE_WHY.items.slice(0, 3).map((i) => i.title),
  },
  insightsMeta: {
    eyebrow: "Три метрики",
    title: "Гео, локализация и коммерция",
    lead: "По фразе — до ТЗ на посадочную и разбора конкурентов.",
  },
  screenshots: PHRASE_COMMERCE_SCREENSHOTS,
  plain: plainFromWhy(PHRASE_COMMERCE_WHY.title, PHRASE_COMMERCE_WHY.lead, PHRASE_COMMERCE_WHY.items),
  faq: PHRASE_COMMERCE_FAQ,
  options: ["Яндекс и Google", "Два региона", "История проверок", "Выгрузка CSV"],
};

export const SITE_TYPES_V2_SOURCE: ClassicV3Source = {
  hero: SITE_TYPES_HERO,
  stats: SITE_TYPES_STATS,
  steps: SITE_TYPES_STEPS.slice(0, 3).map((s) => ({
    step: s.step,
    title: s.title,
    text: s.text,
  })),
  techLayers: layersFromWhy(SITE_TYPES_WHY.items),
  grid: SITE_TYPES_WHY.items.map((i) => ({ title: i.title, text: i.text })),
  highlight: {
    title: SITE_TYPES_WHY.title,
    lead: SITE_TYPES_WHY.lead,
    bullets: SITE_TYPES_WHY.items.slice(0, 3).map((i) => i.title),
  },
  insightsMeta: {
    eyebrow: "Срез выдачи",
    title: "Кто занимает топ по типам",
    lead: "Вердикт и доли девяти типов — без ручного разбора ТОПа.",
  },
  screenshots: SITE_TYPES_SCREENSHOTS,
  plain: plainFromWhy(SITE_TYPES_WHY.title, SITE_TYPES_WHY.lead, SITE_TYPES_WHY.items),
  faq: SITE_TYPES_FAQ,
  options: ["9 типов", "Яндекс и Google", "Вердикт", "История"],
};

export const DOMAIN_RECORDS_V2_SOURCE: ClassicV3Source = {
  hero: DOMAIN_RECORDS_HERO,
  stats: DOMAIN_RECORDS_STATS,
  steps: DOMAIN_RECORDS_STEPS.slice(0, 3).map((s) => ({
    step: s.step,
    title: s.title,
    text: s.text,
  })),
  techLayers: layersFromWhy(DOMAIN_RECORDS_WHY.items),
  grid: DOMAIN_RECORDS_WHY.items.map((i) => ({ title: i.title, text: i.text })),
  highlight: {
    title: DOMAIN_RECORDS_WHY.title,
    lead: DOMAIN_RECORDS_WHY.lead,
    bullets: DOMAIN_RECORDS_WHY.items.slice(0, 3).map((i) => i.title),
  },
  insightsMeta: {
    eyebrow: "Срок · DNS · IP",
    title: "Регистрация и DNS одним отчётом",
    lead: "Срок, NS, A/MX/TXT и сайты на том же IP.",
  },
  screenshots: DOMAIN_RECORDS_SCREENSHOTS,
  plain: plainFromWhy(DOMAIN_RECORDS_WHY.title, DOMAIN_RECORDS_WHY.lead, DOMAIN_RECORDS_WHY.items),
  faq: DOMAIN_RECORDS_FAQ,
  options: ["Срок", "DNS", "Соседи по IP", "История"],
};

export const SEARCH_SUGGESTIONS_V2_SOURCE: ClassicV3Source = {
  hero: SEARCH_SUGGESTIONS_HERO,
  stats: SEARCH_SUGGESTIONS_STATS,
  steps: SEARCH_SUGGESTIONS_STEPS.slice(0, 3).map((s) => ({
    step: s.step,
    title: s.title,
    text: s.text,
  })),
  techLayers: layersFromWhy(SEARCH_SUGGESTIONS_WHY.items),
  grid: SEARCH_SUGGESTIONS_WHY.items.map((i) => ({ title: i.title, text: i.text })),
  highlight: {
    title: SEARCH_SUGGESTIONS_WHY.title,
    lead: SEARCH_SUGGESTIONS_WHY.lead,
    bullets: SEARCH_SUGGESTIONS_WHY.items.slice(0, 3).map((i) => i.title),
  },
  insightsMeta: {
    eyebrow: "Подсказки",
    title: "Хвост из подсказок Яндекс и Google",
    lead: "Алфавит, пресеты и выгрузка — без ручного клика по буквам.",
  },
  screenshots: shots("Поисковые подсказки"),
  plain: plainFromWhy(
    SEARCH_SUGGESTIONS_WHY.title,
    SEARCH_SUGGESTIONS_WHY.lead,
    SEARCH_SUGGESTIONS_WHY.items
  ),
  faq: SEARCH_SUGGESTIONS_FAQ,
  options: ["Яндекс и Google", "Алфавит", "Пресеты", "CSV"],
};

export const INDEX_CHECK_V2_SOURCE: ClassicV3Source = {
  hero: INDEX_CHECK_HERO,
  stats: INDEX_CHECK_STATS,
  steps: [
    {
      step: "01",
      title: "Список URL",
      text: "Загрузите до 500 адресов — пакетная проверка в Яндексе и/или Google.",
    },
    {
      step: "02",
      title: "Индекс и сниппет",
      text: "Статус в индексе плюс title и текст сниппета из выдачи, если страница найдена.",
    },
    {
      step: "03",
      title: "История и CSV",
      text: "Сохранённые проверки в кабинете и выгрузка для отчёта клиенту.",
    },
  ],
  techLayers: [
    {
      id: "idx",
      title: "Две ПС",
      short: "Яндекс + Google",
      text: "1 URL × 1 поисковая система = 1 проверка в лимите тарифа.",
    },
    {
      id: "snip",
      title: "Сниппеты",
      short: "Title и текст",
      text: "Сохраняем фрагмент из выдачи для анализа формулировок.",
    },
    {
      id: "pack",
      title: "Пакет",
      short: "До 500 URL",
      text: "Массовый запуск с учётом остатка месячного лимита.",
    },
  ],
  grid: [
    { title: "Яндекс и Google", text: "Две проверки за один URL при выборе обеих ПС." },
    { title: "Сниппеты", text: "Title и описание из выдачи — не только «в индексе / нет»." },
    { title: "Пакет до 500", text: "Список страниц за один запуск в кабинете." },
  ],
  highlight: {
    title: "Индексация с контекстом",
    lead: "Не бинарный чекер: видно, как страница выглядит в выдаче.",
    bullets: ["site: и сниппеты", "До 500 URL", "История по тарифу"],
  },
  insightsMeta: {
    eyebrow: "Индексация",
    title: "Статус и сниппет",
    lead: "Массовая проверка URL в Яндексе и Google.",
  },
  screenshots: shots("Проверка индексации"),
  plain: {
    title: "Зачем проверять индексацию в Титло",
    lead: "Список URL → статус в индексе и сниппеты для отчёта.",
    items: [
      { title: "Две ПС", text: "Яндекс и Google в одном модуле." },
      { title: "Сниппеты", text: "Title и текст из выдачи сохраняются." },
      { title: "Лимиты", text: "Проверки и слоты истории — по тарифу." },
    ],
  },
  faq: INDEX_CHECK_FAQ,
  options: ["Яндекс", "Google", "До 500 URL", "CSV"],
};

export const ESENIN_V2_SOURCE: ClassicV3Source = {
  hero: ESENIN_TEXT_CHECK_HERO,
  stats: ESENIN_TEXT_CHECK_STATS,
  steps: ESENIN_TEXT_CHECK_STEPS.slice(0, 3).map((s) => ({
    step: s.step,
    title: s.title,
    text: s.text,
  })),
  techLayers: ESENIN_TEXT_CHECK_INSIGHTS_GRID.slice(0, 4).map((g, i) => ({
    id: `E${i + 1}`,
    title: g.title,
    short: g.title,
    text: g.text,
  })),
  grid: ESENIN_TEXT_CHECK_INSIGHTS_GRID.map((g) => ({ title: g.title, text: g.text })),
  highlight: {
    title: ESENIN_TEXT_CHECK_INSIGHTS_HIGHLIGHT.title,
    lead: ESENIN_TEXT_CHECK_INSIGHTS_HIGHLIGHT.lead,
    bullets: [...ESENIN_TEXT_CHECK_INSIGHTS_HIGHLIGHT.bullets],
  },
  insightsMeta: {
    eyebrow: ESENIN_TEXT_CHECK_INSIGHTS.eyebrow,
    title: ESENIN_TEXT_CHECK_INSIGHTS.title,
    lead: ESENIN_TEXT_CHECK_INSIGHTS.lead,
  },
  screenshots: shots("Проверка Есенин"),
  plain: ESENIN_TEXT_CHECK_PLAIN,
  faq: ESENIN_TEXT_CHECK_FAQ,
  options: ["6 категорий", "HTML / URL", "Автосохранение", "Подсветка"],
};
