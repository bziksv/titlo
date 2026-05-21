/**
 * Контент v2 — концепция «Центр управления выдачей» (не клон структуры классики).
 * Тексты модулей — из monitoring-pozicii-page.ts.
 */
export {
  MONITORING_STATS as MONITORING_V2_STATS,
  MONITORING_TECH_LAYERS as MONITORING_V2_TECH_LAYERS,
  MONITORING_MODES as MONITORING_V2_MODES,
  MONITORING_INSIGHTS_HIGHLIGHT as MONITORING_V2_INSIGHTS_HIGHLIGHT,
  MONITORING_SCREENSHOTS as MONITORING_V2_SCREENSHOTS,
  MONITORING_PLAIN as MONITORING_V2_PLAIN,
  MONITORING_VIDEOS as MONITORING_V2_VIDEOS,
  MONITORING_FAQ as MONITORING_V2_FAQ,
  MONITORING_OPTIONS as MONITORING_V2_OPTIONS,
} from "./monitoring-pozicii-page";

/** Главная идея страницы — отчёт и контроль позиций, не «описание модуля». */
export const MONITORING_V2_CONCEPT = {
  eyebrow: "Центр управления выдачей",
  headline: "Где вы в выдаче — по ключам",
  lead: "Не таблица ради таблицы. Позиции по ядру, история срезов и отчёт для клиента — в одной панели.",
  cta: "Открыть панель мониторинга",
} as const;

export const MONITORING_V2_PAIN_GAIN = {
  painTitle: "Без единой картины",
  pains: [
    "Проверяете ТОП вручную — фраза за фразой, регион за регионом",
    "Трафик растёт, а позиции по money-запросам падают — замечаете поздно",
    "Отчёт заказчику собираете в Excel из десяти вкладок",
  ],
  gainTitle: "С панелью Датагон",
  gains: [
    "Один проект — все ключи, Яндекс и Google, десктопная выдача",
    "История срезов: видно, когда началась просадка и какой URL в выдаче",
    "XLS, PDF — отчёт уходит клиенту без ночной сборки",
  ],
} as const;

/** Три акта сюжета (scroll-story). */
export const MONITORING_V2_ACTS = [
  {
    act: "01",
    title: "Соберите ядро в проекте",
    lead: "Домен, регион, список запросов — всё в одном кабинете. Частотность Wordstat рядом с позицией.",
    image: "/modules/assets/3d7d72c85b4af88c.jpg",
    imageAlt: "Список ключей и настройки проверки",
    points: ["До 100 глубины проверки", "Поддомены в одном проекте", "Группы и цели по фразам"],
  },
  {
    act: "02",
    title: "Проверьте позиции по запросам",
    lead: "По каждой фразе — номер позиции и URL страницы в десктопной проверке, без ручного обхода выдачи.",
    image: "/modules/assets/3d7d72c85b4af88c.jpg",
    imageAlt: "Проверка позиций по региону",
    imageFocus: "65% top",
    points: ["Яндекс и Google", "Регион и язык", "Релевантный URL в выдаче"],
  },
  {
    act: "03",
    title: "Отдайте отчёт за минуту",
    lead: "Сводка по ТОП‑3/10/30/100 и динамика — то, что ждёт клиент или руководитель. Не сырой экспорт.",
    image: "/modules/assets/518ec5eeb1bee67f.jpg",
    imageAlt: "Динамика позиций и сводка",
    points: ["Сравнение срезов по датам", "Видимость конкурентов", "Выгрузка XLS · PDF"],
  },
] as const;

/** Метрики — редакционная стена, не 4 одинаковые колонки. */
export const MONITORING_V2_METRIC_WALL = [
  { value: "100", unit: "позиций", note: "глубина проверки" },
  { value: "2", unit: "ПС", note: "Яндекс и Google" },
  { value: "500", unit: "проверок", note: "в месяц на Free после регистрации" },
  { value: "ПК", unit: "сейчас", note: "десктопная выдача · mobile в разработке" },
] as const;

export const MONITORING_V2_OPTIONS_SECTION = {
  eyebrow: "Параметры съёма",
  title: "Что учитывается в каждой проверке",
  lead: "Регион, язык и глубина — десктопная проверка без ручного обхода выдачи.",
} as const;

/** Связанные модули — орбита вокруг мониторинга. */
export const MONITORING_V2_ORBIT = [
  { label: "Мои конкуренты", href: "/analiz-konkurentov/", role: "Кто в ТОПе по вашим фразам" },
  { label: "Анализ ТОП‑100", href: "/analiz-relevantnosti/", role: "Лидеры выдачи по запросу" },
  { label: "Отслеживание ссылок", href: "/otslezhivanie-ssylok/", role: "Ссылки рядом с позициями" },
  { label: "HTTP headers", href: "/http-headers/", role: "Технический аудит URL" },
] as const;
