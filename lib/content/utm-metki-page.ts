/** Редакторский контент лендинга «Генератор UTM меток» */

export const UTM_FEATURES = ["Яндекс · Google · VK", "Подсказки по площадкам"] as const;

export const UTM_HERO = {
  badge: "Реклама и аналитика",
  title: "Генератор UTM-меток",
  lead: "Корректные ссылки для Яндекс.Директ, Google Ads, VK и myTarget — без ошибок в utm_source, medium и campaign и без ручной сборки в блокноте.",
  sub: "utm_source · utm_medium · utm_campaign · content · term",
};

export const UTM_STATS = [
  { value: "5", label: "Основных параметров UTM" },
  { value: "4", label: "Шага до готовой ссылки" },
  { value: "Openstat", label: "Опция для обязательных меток" },
  { value: "ID", label: "Подсказки под каждую площадку" },
] as const;

export const UTM_STEPS = [
  {
    step: "01",
    title: "URL страницы",
    text: "Введите адрес посадочной, к которой нужно прикрепить метки.",
  },
  {
    step: "02",
    title: "Обязательные UTM",
    text: "source, medium, campaign — с подсказками формата для выбранной рекламной системы.",
  },
  {
    step: "03",
    title: "Дополнительно",
    text: "content и term — чтобы различать объявления, ключи и даты в одной кампании.",
  },
  {
    step: "04",
    title: "Готовая ссылка",
    text: "Кнопка «Создать URL» — скопируйте результат в кабинет или рассылку.",
  },
] as const;

export const UTM_TECH_SECTION = {
  eyebrow: "Как устроен генератор",
  title: "От полей формы до валидного URL с метками",
  lead: "Сервис подставляет идентификаторы в формате «параметр=значение» и не даёт потерять «?» и «&» в длинной ссылке.",
  footer:
    "У каждой площадки свой набор допустимых значений — подсказки у полей снимают необходимость искать справку в документации.",
} as const;

export const UTM_TECH_LAYERS = [
  {
    id: "01",
    title: "Базовый URL",
    short: "https:// · путь",
    text: "Исходная страница без меток — основа для итоговой ссылки.",
    detail: "Дальше к ней добавляются query-параметры UTM.",
  },
  {
    id: "02",
    title: "Обязательные метки",
    short: "source · medium · campaign",
    text: "Источник, тип рекламы и название кампании — минимум для аналитики.",
    detail: "Для Директа campaign часто в формате {campaign_id}.",
  },
  {
    id: "03",
    title: "Площадка",
    short: "Яндекс · Google · VK",
    text: "Подсказки и допустимые значения зависят от выбранной системы.",
    detail: "Например, source_type: search или context для Яндекса.",
  },
  {
    id: "04",
    title: "Сборка",
    short: "копирование · Openstat",
    text: "Готовый URL и опция ярлыка Openstat для обязательных меток.",
    detail: "content и term — для A/B объявлений и сегментов по дням.",
  },
] as const;

export const UTM_SLICES = [
  {
    mode: "utm_source и medium",
    color: "from-brand-500 to-brand-600",
    items: [
      "source — площадка: yandex, google, vk",
      "medium — тип оплаты: cpc, cpm, email, banner",
      "Устоявшиеся значения для отчётов",
    ],
  },
  {
    mode: "utm_campaign",
    color: "from-slate-600 to-slate-700",
    items: [
      "Произвольное имя кампании до 60 символов",
      "Динамические подстановки из кабинета",
      "Отделение одной РК от другой",
    ],
  },
  {
    mode: "content и term",
    color: "from-brand-600 to-brand-700",
    items: [
      "content — разные объявления при одинаковых UTM",
      "term — ключевое слово или дата размещения",
      "Сценарии «будни / выходные»",
    ],
  },
  {
    mode: "Openstat",
    color: "from-brand-700 to-brand-800",
    items: [
      "Галочка перед генерацией",
      "Только для обязательных меток",
      "Совместимость со старой разметкой",
    ],
  },
] as const;

export const UTM_INSIGHTS = {
  eyebrow: "Результат",
  title: "Что получает маркетолог",
  lead: "Не длинная строка с риском опечатки, а готовая ссылка для вставки в объявление и читаемая аналитика в Метрике или GA.",
  intro:
    "Одна и та же посадочная может вести разные кампании — UTM показывают, откуда пришёл трафик и какой креатив сработал.",
} as const;

export const UTM_INSIGHTS_GRID = [
  {
    title: "Готовый URL",
    text: "Скопировали ссылку — вставили в Директ, VK Ads или письмо без ручной склейки параметров.",
  },
  {
    title: "Мониторинг трафика",
    text: "Видно эффективность канала и необходимость сменить стратегию по цифрам, а не «на глаз».",
  },
  {
    title: "Источник и регион",
    text: "Пики по дням и географии — когда усиливать бюджет или отключать площадку.",
  },
  {
    title: "Честность партнёров",
    text: "Сравнение кликов CPC/CPV с реальными входами — отсев недобросовестных площадок.",
  },
] as const;

export const UTM_INSIGHTS_HIGHLIGHT = {
  title: "Подсказки под площадку",
  lead: "У поля «Показать описание» — формат метки для Яндекс, Google, VK и myTarget без переключения между вкладками справки.",
  bullets: [
    "Идентификатор всегда в виде «ключ=значение»",
    "Динамические параметры: {ad_id}, {campaign_id}",
    "Отдельные ссылки для будней и выходных через utm_content",
  ],
} as const;

export const UTM_INSIGHTS_OUTCOMES = [
  {
    label: "Контекст",
    icon: "◎",
    text: "Быстрая разметка объявлений Директа и Google с корректным medium и campaign.",
  },
  {
    label: "SMM и email",
    icon: "↑",
    text: "Единый формат ссылок для постов, рассылок и баннеров — одна отчётность.",
  },
  {
    label: "Агентство",
    icon: "✓",
    text: "Меньше правок от клиента из‑за битых UTM в длинных URL.",
  },
] as const;

export const UTM_SCREENSHOTS = [
  {
    src: "/modules/assets/14f74aef6730d37b.jpg",
    caption: "Шаг 1: адрес страницы и основные параметры",
  },
  {
    src: "/modules/assets/8d33fa86dc852fee.jpg",
    caption: "Заполнение utm_source, medium, campaign",
  },
  {
    src: "/modules/assets/c8213dee1388fbb6.jpg",
    caption: "Дополнительные метки и подсказки",
  },
  {
    src: "/modules/assets/8fc7c03dc9d02207.jpg",
    caption: "Готовый URL для копирования",
  },
] as const;

export const UTM_PLAIN = {
  title: "UTM простым языком",
  lead: "Пять параметров, которые чаще всего нужны в рекламе — без учебника по веб-аналитике.",
  items: [
    {
      id: "source",
      title: "utm_source",
      text: "Откуда трафик: yandex, google, vk — название рекламной площадки или рассылки.",
    },
    {
      id: "medium",
      title: "utm_medium",
      text: "Тип рекламы: cpc, cpm, social_cpc, email, banner — как платите за показ или клик.",
    },
    {
      id: "campaign",
      title: "utm_campaign",
      text: "Имя кампании — чтобы отличить одну РК от другой в отчётах.",
    },
    {
      id: "extra",
      title: "content и term",
      bullets: [
        "content — разные объявления при одинаковых source/medium/campaign",
        "term — ключевое слово или метка даты/сегмента",
      ],
    },
  ],
} as const;

export const UTM_ADVANTAGES = [
  {
    src: "/modules/assets/d86dcb7b11115ca9.svg",
    title: "Без опечаток",
    text: "Сервис собирает query-строку — не потеряете «&» и «=» в длинном URL.",
  },
  {
    src: "/modules/assets/6092cc028cacc0c4.svg",
    title: "Под все площадки",
    text: "Подсказки для Яндекс, Google, VK и myTarget в одной форме.",
  },
  {
    src: "/modules/assets/7a8fee0f56d8d28c.jpg",
    title: "В платформе Датагон",
    text: "Рядом ROI, мониторинг и SEO — один кабинет для маркетинга.",
  },
] as const;

export const UTM_FAQ = [
  {
    q: "Какие параметры обязательны?",
    a: "utm_source, utm_medium и utm_campaign. utm_content и utm_term — по необходимости, но сильно упрощают разбор кампаний.",
  },
  {
    q: "Как различить объявления в одной статье?",
    a: "Задайте разный utm_content, например 1 для будней и 2 для выходных — ссылки будут вести на одну страницу, но в аналитике разделятся.",
  },
  {
    q: "Что такое Openstat в генераторе?",
    a: "Опция добавляет ярлык Openstat к обязательным меткам — отметьте галочку перед созданием URL.",
  },
  {
    q: "Можно ли использовать динамические подстановки?",
    a: "Да — например {ad_id} или {campaign_id} для Яндекс.Директ, как в документации площадки.",
  },
  {
    q: "В каком формате вводить content?",
    a: "Достаточно значения, например 1t2 — сервис сформирует utm_content=1t2 автоматически.",
  },
] as const;

export const UTM_OPTIONS = [
  "Пресеты и подсказки под Яндекс.Директ",
  "Google Ads, VK, myTarget",
  "Дополнительные идентификаторы площадок",
  "Опция «Добавить ярлык Openstat»",
] as const;

export const UTM_VIDEOS = [
  {
    id: "dpScfE_Jqfg",
    title: "Генератор UTM в Датагон",
    description: "Как собрать ссылку с метками за несколько шагов.",
  },
] as const;
