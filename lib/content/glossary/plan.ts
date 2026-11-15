/**
 * Сгенерировано из docs/seo-glossary-plan.md: 20 категорий, план 660 терминов.
 * upcoming — до 12 приоритетных терминов категории (P1, затем P2); страницы есть только у опубликованных (см. index.ts).
 */
export type GlossaryCategory = { id: string; label: string; plannedCount: number; upcoming: readonly string[] };

export const GLOSSARY_CATEGORIES: readonly GlossaryCategory[] = [
  {
    id: "osnovy-seo-i-poiskovye-sistemy",
    label: "Основы SEO и поисковые системы",
    plannedCount: 76,
    upcoming: ["SEO", "Поисковая выдача", "Органический трафик", "Сниппет", "Ранжирование", "Релевантность", "Поисковый робот", "Индекс поисковой системы", "Видимость сайта", "ТОП-10", "Позиция сайта", "Внутренняя оптимизация"],
  },
  {
    id: "zaprosy-i-semantika",
    label: "Запросы и семантика",
    plannedCount: 58,
    upcoming: ["Поисковый запрос", "Ключевое слово", "Семантическое ядро", "Сбор семантики", "Частотность запроса", "Базовая частотность", "Фразовая частотность", "Точная частотность", "Операторы Wordstat", "ВЧ-запрос", "СЧ-запрос", "НЧ-запрос"],
  },
  {
    id: "klasterizatsiya-i-struktura-sayta",
    label: "Кластеризация и структура сайта",
    plannedCount: 26,
    upcoming: ["Кластеризация запросов", "Кластер", "Кластеризация по ТОПу", "Soft-кластеризация", "Hard-кластеризация", "Структура сайта", "Карта релевантности", "Посадочная страница", "Целевая страница", "Релевантный URL", "Типы сайтов в выдаче", "Middle/Moderate-кластеризация"],
  },
  {
    id: "ranzhirovanie-i-faktory",
    label: "Ранжирование и факторы",
    plannedCount: 22,
    upcoming: ["Факторы ранжирования", "Текстовые факторы", "Коммерческие факторы", "Поведенческие факторы", "E-E-A-T", "Пессимизация", "Санкции", "TF-IDF", "Внутренние факторы", "Внешние факторы", "YMYL", "Скорость загрузки как фактор"],
  },
  {
    id: "algoritmy-i-filtry-yandeksa",
    label: "Алгоритмы и фильтры Яндекса",
    plannedCount: 36,
    upcoming: ["Баден-Баден", "Минусинск", "АГС", "Фильтр за накрутку ПФ", "Переоптимизация", "Малополезный контент", "Недостаточно качественная страница", "Яндекс Метрика", "Яндекс Директ", "Матрикснет", "Палех", "Королёв"],
  },
  {
    id: "algoritmy-i-apdeyty-google",
    label: "Алгоритмы и апдейты Google",
    plannedCount: 39,
    upcoming: ["Google Panda", "Google Penguin", "RankBrain", "BERT", "Helpful Content Update", "Core Update", "Page Experience", "AI Overviews", "Knowledge Graph", "People Also Ask", "Manual Action", "Disavow"],
  },
  {
    id: "kontent-i-teksty",
    label: "Контент и тексты",
    plannedCount: 45,
    upcoming: ["SEO-текст", "ТЗ на текст", "Тошнота текста", "Водность текста", "Плотность ключевых слов", "Вхождение ключа", "Переспам", "LSI-слова", "Уникальность текста", "Дублированный контент", "Объём текста", "Символы с пробелами и без"],
  },
  {
    id: "meta-tegi-i-html-razmetka",
    label: "Мета-теги и HTML-разметка",
    plannedCount: 34,
    upcoming: ["Мета-теги", "Title", "Description", "H1", "Длина title и description", "Мета-тег robots", "noindex", "nofollow", "Canonical", "Микроразметка", "Schema.org", "Keywords"],
  },
  {
    id: "tekhnicheskiy-seo-i-indeksatsiya",
    label: "Технический SEO и индексация",
    plannedCount: 80,
    upcoming: ["Индексация", "Сканирование", "Краулинговый бюджет", "robots.txt", "Директива Disallow", "Sitemap.xml", "Переобход страниц", "Исключённые страницы", "Дубли страниц", "Битые ссылки", "Цепочка редиректов", "Внутренняя перелинковка"],
  },
  {
    id: "http-server-domeny-khosting",
    label: "HTTP, сервер, домены, хостинг",
    plannedCount: 37,
    upcoming: ["HTTP-заголовки", "Код ответа сервера", "301 редирект", "302 редирект", "404 Not Found", "Uptime", "Мониторинг доступности сайта", "Домен", "Срок регистрации домена", "WHOIS", "DNS", "200 OK"],
  },
  {
    id: "ssylki-i-vneshnyaya-optimizatsiya",
    label: "Ссылки и внешняя оптимизация",
    plannedCount: 40,
    upcoming: ["Обратная ссылка", "Ссылочная масса", "Донор", "Анкор", "Dofollow", "Линкбилдинг", "Крауд-маркетинг", "Мониторинг обратных ссылок", "Акцептор", "Безанкорная ссылка", "Анкор-лист", "rel=sponsored"],
  },
  {
    id: "povedencheskie-faktory-i-ux",
    label: "Поведенческие факторы и UX",
    plannedCount: 17,
    upcoming: ["CTR в выдаче", "Показатель отказов", "Накрутка ПФ", "Конверсия", "Время на сайте", "Глубина просмотра", "Последний клик", "Возврат в выдачу", "Юзабилити", "UX", "Целевое действие", "A/B-тест"],
  },
  {
    id: "analitika-metriki-i-utm",
    label: "Аналитика, метрики и UTM",
    plannedCount: 37,
    upcoming: ["Источник трафика", "UTM-метки", "ROI", "ROMI", "CPA", "KPI SEO", "Видимость по ядру", "Съём позиций", "Отчёт по SEO", "Веб-аналитика", "Google Analytics 4", "Визит"],
  },
  {
    id: "ppc-i-kontekstnaya-reklama-smezhnye",
    label: "PPC и контекстная реклама (смежные)",
    plannedCount: 19,
    upcoming: ["CPC", "Контекстная реклама", "CPM", "CTR рекламы", "Google Ads", "VK Реклама", "РСЯ", "Ретаргетинг", "Лид", "Лендинг", "Динамические параметры Директа", "Минус-фразы в Директе"],
  },
  {
    id: "lokalnoe-seo-i-serp-fichi",
    label: "Локальное SEO и SERP-фичи",
    plannedCount: 13,
    upcoming: ["Локальное SEO", "Геовыдача", "Яндекс Карты в выдаче", "Отзывы и рейтинг", "SERM", "Сайтлинки", "Local Pack", "NAP", "ORM", "Картинки в выдаче", "Видео в выдаче", "Карусель"],
  },
  {
    id: "e-commerce-seo",
    label: "E-commerce SEO",
    plannedCount: 10,
    upcoming: ["SEO интернет-магазина", "Карточка товара", "Категория/листинг", "Фильтры и SEO-страницы фильтров", "Маркетплейсы в выдаче", "Ассортимент как фактор", "SEO для маркетплейсов", "Товарные фиды", "Цены и наличие", "Out of stock страницы"],
  },
  {
    id: "ii-neyropoisk-i-novye-formaty",
    label: "ИИ, нейропоиск и новые форматы",
    plannedCount: 10,
    upcoming: ["GEO", "LLM", "Цитирование в нейросетях", "Промпт для SEO", "Энтити", "Topical authority", "AEO", "llms.txt", "Голосовой поиск", "Семантический поиск"],
  },
  {
    id: "chernoe-i-seroe-seo",
    label: "Чёрное и серое SEO",
    plannedCount: 17,
    upcoming: ["Дорвей", "Скрытый текст", "Кейворд-стаффинг", "Негативное SEO", "Синонимайзинг", "Генерированный текст", "Ферма ссылок", "Спам в комментариях", "Кликджекинг", "Редирект-спам", "Парковка домена", "Скликивание конкурентов"],
  },
  {
    id: "seoshnyy-zhargon",
    label: "Сеошный жаргон",
    plannedCount: 22,
    upcoming: ["Портянка", "Выпасть из индекса", "Просадка", "Шторм", "Пузомерки", "Морда", "Закупка ссылок", "Бот-трафик", "ТЗшка", "Простыня", "ГС", "МФА"],
  },
  {
    id: "instrumenty-i-servisy",
    label: "Инструменты и сервисы",
    plannedCount: 22,
    upcoming: ["Screaming Frog", "Ahrefs", "Semrush", "Serpstat", "Топвизор", "Парсер", "Netpeak Spider", "Keys.so", "Rush Analytics", "Пиксель Тулс", "Arsenkin Tools", "Мутаген"],
  },
];

export const GLOSSARY_PLANNED_TOTAL = 660;
