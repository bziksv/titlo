/** Редакторский контент лендинга «Мониторинг мета-тегов» */

export const META_MON_FEATURES = ["До 500 URL", "История изменений"] as const;

export const META_MON_HERO = {
  badge: "SEO и разметка",
  title: "Мониторинг мета-тегов",
  lead: "Title, description, canonical, noindex и H1 по списку страниц — с историей изменений и уведомлениями, когда разметка на сайте поменялась.",
  sub: "title · description · canonical · noindex · H1",
};

export const META_MON_STATS = [
  { value: "500", label: "Страниц в одной проверке" },
  { value: "6+", label: "Полей в отчёте" },
  { value: "CTR", label: "Контроль сниппета" },
  { value: "Δ", label: "Сравнение с прошлой версией" },
] as const;

export const META_MON_STEPS = [
  {
    step: "01",
    title: "Список URL",
    text: "До 500 адресов вида https://site.com/page — свой сайт или конкуренты.",
  },
  {
    step: "02",
    title: "Проверка",
    text: "Сервис снимает мета-теги и заголовки с каждой страницы.",
  },
  {
    step: "03",
    title: "Отчёт",
    text: "Title, description, keywords, canonical, noindex, H1 — в таблице по URL.",
  },
  {
    step: "04",
    title: "Мониторинг",
    text: "Сохраните снимок — при следующем прогоне увидите, что изменилось.",
  },
] as const;

export const META_MON_TECH_SECTION = {
  eyebrow: "Как устроен мониторинг",
  title: "От URL до снимка разметки страницы",
  lead: "Парсинг head и видимых заголовков — единый отчёт для аудита SEO без ручного просмотра каждой страницы в DevTools.",
  footer:
    "Мета-теги не видны пользователю на странице, но формируют сниппет в поиске и влияют на индексацию — их нужно контролировать пакетно.",
} as const;

export const META_MON_TECH_LAYERS = [
  {
    id: "01",
    title: "Запрос",
    short: "URL · пакет",
    text: "Одна страница или список до 500 URL за прогон.",
    detail: "Удобно для разделов каталога и посадочных.",
  },
  {
    id: "02",
    title: "Сбор",
    short: "head · H1",
    text: "Title, meta description, keywords, link canonical, robots noindex.",
    detail: "Плюс главный заголовок H1 в теле страницы.",
  },
  {
    id: "03",
    title: "Анализ текста",
    short: "слова · Ципф",
    text: "В модуле — подсчёт символов, слов и плотность по зонам.",
    detail: "Связка мета-тегов и контента на странице.",
  },
  {
    id: "04",
    title: "История",
    short: "проекты · diff",
    text: "Сохранённые проверки и сравнение с предыдущим снимком.",
    detail: "Поймать случайную смену title после релиза.",
  },
] as const;

export const META_MON_SLICES = [
  {
    mode: "Title и Description",
    color: "from-brand-500 to-brand-600",
    items: [
      "Заголовок вкладки и сниппет в поиске",
      "Длина под лимиты Google и Яндекса",
      "CTR — «обложка» страницы для клика",
    ],
  },
  {
    mode: "Canonical и noindex",
    color: "from-slate-600 to-slate-700",
    items: [
      "Канонический URL при дублях",
      "Закрытие служебных страниц от индекса",
      "Контроль после переездов",
    ],
  },
  {
    mode: "Keywords и H1",
    color: "from-brand-600 to-brand-700",
    items: [
      "Meta keywords — для роботов",
      "H1 — главный заголовок на странице",
      "Согласованность с title",
    ],
  },
  {
    mode: "Пакет и проекты",
    color: "from-brand-700 to-brand-800",
    items: [
      "До 500 URL за раз",
      "Список проектов в кабинете",
      "Переход к анализу текста страницы",
    ],
  },
] as const;

export const META_MON_INSIGHTS = {
  eyebrow: "Результат",
  title: "Что покажет проверка",
  lead: "Таблица по URL — не абстрактный «сайт в порядке», а конкретные title и description для правок.",
  intro:
    "Дополняет Search Console и Метрику: базовая техническая SEO-разметка в одном месте платформы Датагон.",
} as const;

export const META_MON_INSIGHTS_GRID = [
  {
    title: "Title",
    text: "Тема страницы для роботов и название вкладки браузера.",
  },
  {
    title: "Description",
    text: "Текст сниппета — часто берётся поисковиком из meta description.",
  },
  {
    title: "Canonical",
    text: "Какой URL считать основным при дублях контента.",
  },
  {
    title: "Noindex",
    text: "Страницы, закрытые от индексации — не попадут в кэш поиска.",
  },
] as const;

export const META_MON_INSIGHTS_HIGHLIGHT = {
  title: "История изменений",
  lead: "Сохраните проверку — при следующем запуске увидите diff по title, description и другим полям.",
  bullets: [
    "Поймать смену мета после выкладки CMS",
    "Сверка с ТЗ копирайтера по длине title",
    "Аудит конкурента — снимок на дату",
  ],
} as const;

export const META_MON_INSIGHTS_OUTCOMES = [
  {
    label: "SEO",
    icon: "◎",
    text: "Единый чеклист разметки перед релизом раздела сайта.",
  },
  {
    label: "Контент",
    icon: "↑",
    text: "Title и description для людей, не только для роботов — выше CTR.",
  },
  {
    label: "Агентство",
    icon: "✓",
    text: "Отчёт клиенту по 500 URL без ручного копирования из браузера.",
  },
] as const;

/** Скрины LK: форма URL (мониторинг), анализ текста (noindex/title), отчёт, проекты. Оригиналы redbox upload — 404. */
export const META_MON_SCREENSHOTS = [
  {
    src: "/modules/assets/956daf9669b58ce5.png",
    caption: "Добавление проекта и URL для проверки",
  },
  {
    src: "/modules/assets/474da29ee76c785b.jpg",
    caption: "Отслеживание noindex, title и alt в анализе",
  },
  {
    src: "/modules/assets/0d20bf0152839075.jpg",
    caption: "Плотность слов и зоны текста в отчёте",
  },
  {
    src: "/modules/assets/518ec5eeb1bee67f.jpg",
    caption: "Сводка по проектам мониторинга",
  },
] as const;

export const META_MON_PLAIN = {
  title: "Мета-теги простым языком",
  lead: "Что проверяет модуль и зачем это SEO-специалисту и редактору.",
  items: [
    {
      id: "what",
      title: "Зачем мета",
      text: "Подсказывают поисковику тему страницы и текст сниппета. Пользователь на сайте их не видит, в выдаче — да.",
    },
    {
      id: "title",
      title: "Title и Description",
      text: "«Обложка» в поиске: от заголовка и описания зависит, кликнут ли на ссылку.",
    },
    {
      id: "tech",
      title: "Canonical и noindex",
      text: "Canonical — главный URL при дублях. Noindex — «не индексировать эту страницу».",
    },
    {
      id: "how",
      title: "Как пользоваться",
      bullets: [
        "Вставить до 500 URL",
        "Дождаться отчёта",
        "Сохранить проект для мониторинга изменений",
      ],
    },
  ],
} as const;

export const META_MON_ADVANTAGES = [
  {
    src: "/modules/assets/d86dcb7b11115ca9.svg",
    title: "До 500 страниц",
    text: "Пакетная проверка раздела или всего каталога за один прогон.",
  },
  {
    src: "/modules/assets/6092cc028cacc0c4.svg",
    title: "История и diff",
    text: "Видно, когда title или description изменились без ручной сверки.",
  },
  {
    src: "/modules/assets/a02422b314d1741d.png",
    title: "В платформе Датагон",
    text: "Рядом анализ текста, релевантность и HTTP-заголовки.",
  },
] as const;

export const META_MON_FAQ = [
  {
    q: "Сколько URL можно проверить?",
    a: "До 500 адресов в одной отправке — укажите полные URL с https://.",
  },
  {
    q: "Какие поля в отчёте?",
    a: "Title, description, keywords, canonical, noindex, H1 — и при необходимости анализ текста страницы.",
  },
  {
    q: "Зачем мониторинг, если есть Вебмастер?",
    a: "Свой снимок по вашему списку URL, история в кабинете Датагон и связка с другими SEO-модулями.",
  },
  {
    q: "Нужно ли забивать keywords?",
    a: "Не обязательно для ранжирования, но модуль покажет, если тег задан — для аудита legacy-разметки.",
  },
  {
    q: "Как не переспамить мета?",
    a: "Ориентир на читателя: релевантный title и description, без лишних тегов в коде — модуль помогает найти перебор.",
  },
] as const;

export const META_MON_OPTIONS = [
  "Title, Description, Keywords",
  "Canonical и noindex",
  "H1 на странице",
  "Анализ текста и плотность слов",
] as const;

export const META_MON_VIDEOS = [
  {
    id: "VzRp5vZ26Fc",
    title: "Мониторинг мета-тегов в Датагон",
    description: "Как отправить URL и прочитать отчёт.",
  },
] as const;
