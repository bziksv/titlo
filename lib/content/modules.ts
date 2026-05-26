import { getModuleV1ModulePages } from "@/lib/content/module-v1/pages";
import {
  getModuleV2ModulePages,
  registerModuleV2GetBase,
} from "@/lib/content/module-v2/registry";
import {
  getModuleV3ModulePages,
  registerModuleV3GetBase,
} from "@/lib/content/module-v3/registry";

export type ModulePage = {
  slug: string;
  path: string;
  title: string;
  h1: string;
  description: string;
  lead: string;
  features?: string[];
  /** YouTube embed URL с live-лендинга */
  videos?: string[];
};

/** Базовые страницы модулей (без универсальных *-v2/*-v3 — они добавляются ниже). */
export const BASE_MODULE_PAGES: ModulePage[] = [
  {
    slug: "analiz-relevantnosti",
    path: "/analiz-relevantnosti/",
    title: "Анализ релевантности страницы",
    h1: "Анализ релевантности страницы",
    description:
      "Анализ релевантности страниц сайта: плотность ключей, текстовые облака, сравнение с конкурентами.",
    lead:
      "Поисковые системы уделяют особое внимание текстовому содержанию страницы и мета-тегам. Сервис показывает, каких слов не хватает или где переспам, чтобы приблизиться к ТОП-10.",
    features: [
      "Текстовые облака страницы и конкурентов",
      "Рекомендации по улучшению релевантности",
      "Экспорт списков словосочетаний (TLP)",
    ],
  },
  {
    slug: "analiz-konkurentov",
    path: "/analiz-konkurentov/",
    title: "Анализ конкурентов по ключевым словам",
    h1: "Анализ конкурентов по ключевым словам",
    description: "SEO-аналитика сайтов конкурентов по поисковым запросам и регионам.",
    lead:
      "Соберите список ключевых слов и проанализируйте 10–20 релевантных ресурсов в ТОПе: позиции, метатеги, вложенность страниц.",
    features: ["Анализ по регионам", "Топ конкурентов по вашим фразам", "Сравнение метатегов"],
  },
  {
    slug: "monitoring-pozicii-sayta",
    path: "/monitoring-pozicii-sayta/",
    title: "Мониторинг позиций сайта",
    h1: "Мониторинг позиций сайта",
    description: "Проверка позиций в Яндекс и Google по ключевым словам онлайн.",
    lead:
      "Быстрая проверка позиций с учётом устройства, языка и гео. Проекты и большие объёмы проверок в месяц — на платных тарифах.",
    features: ["Яндекс и Google", "Десктопная выдача", "Анализ ТОП-100 и конкуренты"],
  },
  {
    slug: "monitoring-pozicii-v2",
    path: "/monitoring-pozicii-v2/",
    title: "Мониторинг позиций — центр управления выдачей",
    h1: "Где вы в выдаче — по ключам",
    description:
      "Новая концепция лендинга: панель мониторинга, три акта от ядра до отчёта, боль vs решение, экосистема модулей.",
    lead:
      "Позиции по ключам, история срезов и отчёт для клиента — в одной панели, не классический модульный лендинг.",
    features: ["Яндекс и Google", "Десктоп · mobile в разработке", "Анализ ТОП-100 и конкуренты"],
  },
  {
    slug: "monitoring-pozicii-v3",
    path: "/monitoring-pozicii-v3/",
    title: "Мониторинг позиций — пульс позиций (LAB v3)",
    h1: "Пульс позиций",
    description:
      "Экспериментальный иммерсивный лендинг: scroll-pin, потоки ключей, сцены хаос→порядок, максимум анимации.",
    lead: "Лабораторная подача модуля — не классика и не v2.",
    features: ["Яндекс и Google", "Десктоп · mobile в разработке", "Анализ ТОП-100 и конкуренты"],
  },
  {
    slug: "monitoring-saytov",
    path: "/monitoring-saytov/",
    title: "Мониторинг корректной работы сайтов",
    h1: "Мониторинг корректной работы сайтов",
    description: "Сервис проверки доступности и корректности работы сайта или страниц.",
    lead:
      "Автоматический контроль метрик и доступности: уведомления на почту и в Telegram при сбоях.",
    features: [
      "Лог проверок и PDF-отчёт",
      "Публичная ссылка на статистику",
      "Telegram на Free · email на платных",
    ],
  },
  {
    slug: "proverka-meta-tegov-online",
    path: "/proverka-meta-tegov-online/",
    title: "Мониторинг мета-тегов",
    h1: "Мониторинг мета-тегов",
    description: "Проверка title, description, canonical, H1–H3 и отслеживание изменений.",
    lead:
      "Фиксируйте мета-теги и получайте уведомления при изменениях. Сравнение с сохранённой версией.",
    features: ["До 500 URL", "История изменений"],
  },
  {
    slug: "generator_slov",
    path: "/generator_slov/",
    title: "Генератор ключевых слов",
    h1: "Генератор ключевых слов",
    description: "Генератор словосочетаний из двух колонок для SEO и контекста.",
    lead:
      "Скрещивание запросов и генерация фраз из двух списков — для семантики и контекстной рекламы.",
    features: ["Несколько блоков слов", "Комбинации за минуту"],
  },
  {
    slug: "podschet-dliny-teksta",
    path: "/podschet-dliny-teksta/",
    title: "Подсчет длины текста",
    h1: "Подсчет длины текста",
    description: "Подсчёт символов, слов, с пробелами и без.",
    lead:
      "Мгновенный подсчёт символов с пробелами и без, количества слов в тексте.",
    features: ["До 38 600 символов", "Мгновенный отчёт"],
  },
  {
    slug: "generator-paroley",
    path: "/generator-paroley/",
    title: "Генератор паролей",
    h1: "Генератор паролей",
    description: "Надёжные пароли в несколько кликов.",
    lead: "Генерация взломостойких паролей из букв, цифр и спецсимволов.",
    features: ["До 50 символов", "История генерации"],
  },
  {
    slug: "sravnenie-spiskov-klyuchevykh-fraz",
    path: "/sravnenie-spiskov-klyuchevykh-fraz/",
    title: "Сравнение списков ключевых фраз",
    h1: "Сравнение списков ключевых фраз",
    description: "Поиск совпадающих ключевых фраз в двух списках.",
    lead:
      "Сравните два списка фраз и найдите пересечения — удобно при кластеризации и чистке семантики.",
    features: ["2 столбца · 4 режима", "Копирование и выгрузка"],
  },
  {
    slug: "udalenie-dublikatov",
    path: "/udalenie-dublikatov/",
    title: "Удаление дубликатов",
    h1: "Удаление дубликатов",
    description: "Удаление повторяющихся слов и строк из текста и списков.",
    lead: "Уберите дубликаты из текста или списка ключевых фраз за один проход.",
    features: ["9+ фильтров очистки", "Списки построчно"],
  },
  {
    slug: "utm-metki",
    path: "/utm-metki/",
    title: "Генератор UTM меток",
    h1: "Генератор UTM меток",
    description: "Создание UTM-меток для Яндекс, Google, VK, myTarget.",
    lead:
      "Соберите корректные UTM-метки для рекламных кампаний: campaign, source, medium и другие параметры.",
    features: ["Яндекс · Google · VK", "Подсказки по площадкам"],
  },
  {
    slug: "kalkulyator-roi",
    path: "/kalkulyator-roi/",
    title: "Калькулятор ROI",
    h1: "Калькулятор ROI",
    description: "Расчёт окупаемости инвестиций в интернет-маркетинг.",
    lead:
      "ROI — ключевой показатель кампании. Калькулятор помогает быстро оценить эффективность вложений.",
    features: ["ROI и метрики РК", "Прогноз трафика"],
  },
  {
    slug: "http-headers",
    path: "/http-headers/",
    title: "Проверка HTTP-заголовков",
    h1: "Проверка HTTP-заголовков",
    description: "Проверка HTTP-заголовков ответа страницы.",
    lead:
      "Просмотр заголовков ответа сервера — полезно для диагностики, кэширования и безопасности.",
    features: ["Пакетная проверка URL", "Выгрузка в CSV"],
  },
  {
    slug: "html-redaktor",
    path: "/html-redaktor/",
    title: "HTML-редактор",
    h1: "HTML-редактор",
    description: "Визуальное оформление текста и преобразование в HTML.",
    lead:
      "Оформите текст для сайта и получите HTML-код. Можно сохранять промежуточные версии.",
    features: ["Визуальное редактирование", "Экспорт HTML", "До 20 проектов"],
  },
  {
    slug: "vydelenie-unikalnykh-slov-v-tekste",
    path: "/vydelenie-unikalnykh-slov-v-tekste/",
    title: "Выделение уникальных слов в тексте",
    h1: "Выделение уникальных слов в тексте",
    description: "Список уникальных слов и словосочетаний из текста или списка фраз.",
    lead:
      "Быстро получите уникальные слова из текста или из списка ключевых фраз.",
    features: ["Слова и словоформы", "Экспорт CSV"],
  },
  {
    slug: "otslezhivanie-ssylok",
    path: "/otslezhivanie-ssylok/",
    title: "Отслеживание ссылок",
    h1: "Отслеживание ссылок",
    description: "Контроль размещённых ссылок, индексации и атрибутов nofollow/noindex.",
    lead:
      "Ежедневная проверка ссылок на страницах: уведомление, если ссылка пропала или изменились условия.",
    features: ["Индексация в Яндекс и Google", "Проверка nofollow / noindex"],
  },
  {
    slug: "otslezhivanie-sroka-registratsii-domenov",
    path: "/otslezhivanie-sroka-registratsii-domenov/",
    title: "Отслеживание срока регистрации доменов",
    h1: "Отслеживание срока регистрации доменов",
    description: "Уведомления об окончании регистрации домена и смене DNS.",
    lead:
      "Следите за сроком регистрации доменов и изменениями DNS — уведомления на почту и в Telegram.",
    features: ["DNS и дата регистрации", "Email и Telegram"],
  },
  {
    slug: "analiz-teksta",
    path: "/analiz-teksta/",
    title: "Анализ текста",
    h1: "Анализ текста",
    description: "Качество текста, облака слов, морфология, закон Ципфа.",
    lead:
      "Повышение качества и информативности контента перед публикацией: облака, повторы, морфологический разбор.",
    features: ["Облака слов", "Анализ по закону Ципфа", "Морфология"],
  },
  {
    slug: "klasterizator-klyuchevykh-slov",
    path: "/klasterizator-klyuchevykh-slov/",
    title: "Кластеризатор ключевых слов",
    h1: "Кластеризатор ключевых слов",
    description: "Автоматическая кластеризация семантического ядра.",
    lead:
      "Автоматическая группировка большого семантического ядра — экономия времени SEO-специалиста.",
    features: ["Высокая скорость обработки", "Автономный парсинг"],
  },
];

const baseBySlug = new Map(BASE_MODULE_PAGES.map((m) => [m.slug, m]));

export function getBaseModuleBySlug(slug: string): ModulePage | undefined {
  return baseBySlug.get(slug);
}

/** Полный список после инициализации v2/v3 (лениво, без цикла import). */
let modulePagesCache: ModulePage[] | null = null;

export function getModulePages(): ModulePage[] {
  if (!modulePagesCache) {
    const v1Pages = getModuleV1ModulePages(getBaseModuleBySlug);
    const v2Pages = getModuleV2ModulePages(getBaseModuleBySlug);
    const labSlugs = new Set([...v1Pages, ...v2Pages].map((m) => m.slug));
    const base = BASE_MODULE_PAGES.filter((m) => !labSlugs.has(m.slug));
    modulePagesCache = [
      ...base,
      ...v1Pages,
      ...v2Pages,
      ...getModuleV3ModulePages(getBaseModuleBySlug),
    ];
  }
  return modulePagesCache;
}

/** @deprecated используйте getModulePages(); оставлено для совместимости */
export const MODULE_PAGES: ModulePage[] = BASE_MODULE_PAGES;

const bySlug = new Map<string, ModulePage>();

function ensureBySlug() {
  if (bySlug.size === 0) {
    for (const m of getModulePages()) bySlug.set(m.slug, m);
  }
}

export function getModuleBySlug(slug: string): ModulePage | undefined {
  ensureBySlug();
  return bySlug.get(slug);
}

/** LAB: *-v1, *-v2, *-v3 — noindex, не в sitemap, robots disallow. Публичные URL = v2. */
export function isLabModuleSlug(slug: string): boolean {
  return slug.endsWith("-v1") || slug.endsWith("-v2") || slug.endsWith("-v3");
}

export function getAllModuleSlugs(): string[] {
  return getModulePages().map((m) => m.slug);
}

export function getPublicModuleSlugs(): string[] {
  return getModulePages().filter((m) => !isLabModuleSlug(m.slug)).map((m) => m.slug);
}

registerModuleV2GetBase(getBaseModuleBySlug);
registerModuleV3GetBase(getBaseModuleBySlug);
