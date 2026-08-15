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
      "Сравнение посадочной с ТОПом: текстовые облака, переспам, рекомендации и экспорт TLP.",
    lead:
      "Сравниваем посадочную с ТОПом Яндекса и Google: пробелы в тексте, переспам и список правок — до изменений в CMS.",
    features: [
      "Текстовые облака страницы и конкурентов",
      "Рекомендации: добавить, убрать, усилить",
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
    h1: "Проверка позиций сайта по ключевым запросам",
    description: "Проверка позиций в Яндекс и Google по ключевым словам онлайн.",
    lead:
      "Яндекс и Google, регион, история срезов и отчёт для клиента — в одной панели, без ручного обхода выдачи.",
    features: ["Анализ ТОП-100", "Анализ конкурентов"],
  },
  {
    slug: "monitoring-pozicii-v2",
    path: "/monitoring-pozicii-v2/",
    title: "Мониторинг позиций — LAB v2",
    h1: "Проверка позиций сайта по ключевым запросам",
    description:
      "Лендинг мониторинга позиций: панель, шаги от проекта до отчёта, сравнение с ручным съёмом.",
    lead:
      "Яндекс и Google, регион, история срезов и отчёт для клиента — в одной панели, без ручного обхода выдачи.",
    features: ["Анализ ТОП-100", "Анализ конкурентов"],
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
    title: "Мониторинг сайтов",
    h1: "Uptime и алерты — до жалобы клиента",
    description:
      "Проверки HTTP/HTTPS по расписанию, uptime, лог инцидентов, PDF и публичная ссылка. Telegram на Free; email на платных.",
    lead:
      "HTTP/HTTPS по расписанию, uptime и алерты — до жалобы клиента. В кабинете: лог, PDF и публичная ссылка.",
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
    h1: "Мета-теги по URL — и что изменилось с прошлой проверки",
    description:
      "Title, description, canonical и H1 по списку URL: снимки, сравнение с прошлой проверкой и уведомления при изменениях. До 500 адресов за прогон.",
    lead:
      "Title, description, canonical и H1 по списку страниц. Сохраняете проверку — при следующем запуске видно, что поменялось, без ручного обхода каждой страницы.",
    features: ["До 500 URL", "Снимки и сравнение", "Автопроверка", "Уведомления"],
  },
  {
    slug: "generator_slov",
    path: "/generator_slov/",
    title: "Генератор ключевых слов",
    h1: "Генератор ключевых слов",
    description: "Комбинатор ключевых фраз из блоков слов: синонимы, стоп-слова, операторы «» и [].",
    lead:
      "Несколько списков слов → готовые фразы для ядра, частотности и контекста — без ручной склейки в таблице.",
    features: ["Несколько блоков слов", "Комбинации за минуту"],
  },
  {
    slug: "podschet-dliny-teksta",
    path: "/podschet-dliny-teksta/",
    title: "Подсчет длины текста",
    h1: "Подсчёт длины текста — с пробелами и без",
    description:
      "Подсчёт символов с пробелами и без, слов, длины title, description и H1. До 38 600 символов за проверку.",
    lead:
      "Символы с пробелами и без, слова и длина title / description / H1 — сразу после вставки текста.",
    features: ["До 38 600 символов", "Мгновенный отчёт"],
  },
  {
    slug: "generator-paroley",
    path: "/generator-paroley/",
    title: "Генератор паролей",
    h1: "Генератор паролей",
    description: "Случайные пароли до 50 символов: пресеты, пять вариантов за клик, история в кабинете.",
    lead: "Пресет или своя политика — цифры, буквы, спецсимволы. До пяти вариантов за клик и история с комментарием.",
    features: ["До 50 символов", "История генерации"],
  },
  {
    slug: "sravnenie-spiskov-klyuchevykh-fraz",
    path: "/sravnenie-spiskov-klyuchevykh-fraz/",
    title: "Сравнение списков ключевых фраз",
    h1: "Сравнение списков ключевых фраз",
    description:
      "Сравнение двух списков фраз: пересечение, только A, только B или объединение. KPI, копирование и выгрузка.",
    lead:
      "Два списка фраз: пересечение, только A, только B или объединение — без ручной сверки в Excel.",
    features: ["2 столбца · 4 режима", "Копирование и выгрузка"],
  },
  {
    slug: "udalenie-dublikatov",
    path: "/udalenie-dublikatov/",
    title: "Удаление дубликатов",
    h1: "Удаление дубликатов из списка фраз и URL",
    description:
      "Удаление дубликатов, пустых строк и лишних пробелов из списка. KPI было/стало, фильтры регистра и сортировки.",
    lead:
      "Уберите повторы, лишние пробелы и пустые строки из списка фраз или URL — с KPI «было / стало».",
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
    h1: "ROI кампании — до запуска и по факту",
    description:
      "ROI, CTR, CPC, CPA и прогноз трафика по бюджету — без Excel. Демо на сайте; в кабинете — тот же калькулятор рядом с UTM и SEO-модулями.",
    lead:
      "Факт РК или прогноз по бюджету: ROI, CTR, CPC, CPA и ещё метрики воронки — без Excel и ручных формул.",
    features: ["ROI и метрики РК", "Прогноз трафика", "Два режима", "Без Excel"],
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
    slug: "audit-sajta",
    path: "/audit-sajta/",
    title: "Аудит сайта — технический и SEO",
    h1: "Аудит сайта",
    description:
      "Обход сайта: технические ошибки, SEO-дубли, битые ссылки, robots и sitemap, отчёт со ссылкой для клиента.",
    lead:
      "Обходим сайт и собираем недоступные страницы, битые ссылки, дубли title и description. Можно сравнить с прошлой проверкой и отправить клиенту ссылку — без входа в кабинет.",
    features: [
      "До 50 000 страниц за проверку (по тарифу)",
      "Технические и SEO-ошибки в одном отчёте",
      "Ссылка на отчёт для клиента",
      "Расписание и выгрузка в Excel / Word",
    ],
  },
  {
    slug: "proverka-indeksacii",
    path: "/proverka-indeksacii/",
    title: "Проверка индексации и сниппетов (Яндекс и Google)",
    h1: "Проверка индексации и сниппетов (Яндекс и Google)",
    description: "Массовая проверка индексации URL в Яндексе и Google с сохранением title и сниппета.",
    lead:
      "Загрузите список страниц — сервис покажет, проиндексированы ли они, и сохранит title со сниппетом из выдачи для анализа.",
    features: ["Яндекс и Google", "Сниппеты из выдачи", "Пакет до 500 URL", "Лимиты по тарифу"],
  },
  {
    slug: "proverka-teksta-esenin",
    path: "/proverka-teksta-esenin/",
    title: "Проверка текста Есенин",
    h1: "Проверка текста Есенин",
    description:
      "Оценка SEO-риска «Баден-Баден»: повторы, стилистика, запросы, водность и удобочитаемость. Демо на сайте — сводный отчёт; в кабинете — полный интерфейс с HTML-редактором и 6 вкладками риска.",
    lead:
      "Локальный анализ SEO-текста с подсветкой проблем и итоговым баллом риска. На сайте — демо; в личном кабинете — расширенный интерфейс: HTML, вкладки рисков, правки в отчёте и автосохранение.",
    features: ["Риск «Баден-Баден»", "HTML и URL", "Автосохранение версий", "Лимиты по тарифу"],
  },
  {
    slug: "sbor-poiskovykh-podskazok",
    path: "/sbor-poiskovykh-podskazok/",
    title: "Сбор поисковых подсказок",
    h1: "Сбор поисковых подсказок Яндекс и Google",
    description:
      "Сбор подсказок Яндекс и Google: алфавит, пресеты, глубина и выгрузка таблицы. Хвост для ядра и кластеризации — без ручного клика по буквам.",
    lead:
      "Хвост из подсказок Яндекса и Google: алфавит, пресеты и выгрузка — без ручного клика по буквам.",
    features: ["Яндекс и Google", "Алфавит и пресеты", "История и выгрузка", "Лимиты по тарифу"],
  },
  {
    slug: "zapisi-domena",
    path: "/zapisi-domena/",
    title: "Записи домена",
    h1: "Записи домена: срок, NS и соседи по IP",
    description:
      "Срок регистрации, DNS (A, MX, NS, TXT) и сайты на том же IP — одним отчётом. В кабинете: история снимков, сравнение и переход в мониторинг.",
    lead:
      "Срок домена, DNS и кто сидит на том же IP — один отчёт вместо WHOIS, dig и сторонних «соседей».",
    features: ["Регистрация и DNS", "Соседи по IP", "История и сравнение", "Лимиты по тарифу"],
  },
  {
    slug: "tipy-saitov-v-vydache",
    path: "/tipy-saitov-v-vydache/",
    title: "Типы сайтов в выдаче",
    h1: "Типы сайтов в топе — кто занимает выдачу",
    description:
      "Срез ТОПа по типам: агрегаторы, магазины, контент. Вердикт, доли и таблица доменов — Яндекс и Google.",
    lead:
      "Срез ТОПа по типам: агрегаторы, магазины, контент — понять, какой формат ближе к выдаче.",
    features: ["9 типов сайтов", "Яндекс и Google", "Вердикт по выдаче", "Лимиты по тарифу"],
  },
  {
    slug: "geo-lokalizaciya-kommerciya",
    path: "/geo-lokalizaciya-kommerciya/",
    title: "Гео, локализация и коммерция фраз",
    h1: "Геозависимость, локализация и коммерция фраз",
    description:
      "Три метрики по фразе: геозависимость, локализация и коммерция. Демо на сайте; в кабинете — список фраз, регионы и история.",
    lead:
      "По фразе видно, зависит ли выдача от региона, насколько она местная и насколько коммерческая — до ТЗ на посадочную и анализа конкурентов.",
    features: ["Геозависимость", "Локализация", "Коммерция", "Лимиты по тарифу"],
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
    h1: "Ссылки на месте — до просадки в отчётах",
    description:
      "Контроль размещённых ссылок: донор, анкор, nofollow и noindex. Проверка раз в сутки и оповещения при сбое.",
    lead:
      "Донор, анкор, nofollow и noindex — проверка раз в сутки. Узнаёте о снятии ссылки до просадки в отчётах.",
    features: ["Контроль nofollow и noindex", "Telegram и email"],
  },
  {
    slug: "otslezhivanie-sroka-registratsii-domenov",
    path: "/otslezhivanie-sroka-registratsii-domenov/",
    title: "Отслеживание срока регистрации доменов",
    h1: "Срок регистрации доменов — до просрочки, не после",
    description:
      "Список доменов: дата окончания регистрации, DNS и напоминания до продления. Telegram и email при изменениях.",
    lead:
      "Список доменов: дата окончания, DNS и дни до продления. Напоминание до просрочки — пока сайт и почта ещё работают.",
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
    h1: "Кластеры по выдаче — не по словам в Excel",
    description:
      "Группировка семантического ядра по пересечению URL в выдаче: Soft/Hard, classic и pro, ручной редактор, CSV и XLS.",
    lead:
      "Группы по пересечению URL в выдаче — Soft/Hard, classic и pro. Вместо недель сортировки в Excel.",
    features: ["Soft / Hard", "Classic · Pro", "Ручной редактор", "CSV · XLS"],
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
