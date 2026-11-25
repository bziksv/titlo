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
  TEXT_UNIQUENESS_FAQ,
  TEXT_UNIQUENESS_HERO,
  TEXT_UNIQUENESS_STATS,
} from "@/lib/content/proverka-unikalnosti-teksta-page";
import {
  ESENIN_TEXT_CHECK_FAQ,
  ESENIN_TEXT_CHECK_HERO,
  ESENIN_TEXT_CHECK_INSIGHTS,
  ESENIN_TEXT_CHECK_INSIGHTS_GRID,
  ESENIN_TEXT_CHECK_INSIGHTS_HIGHLIGHT,
  ESENIN_TEXT_CHECK_PLAIN,
  ESENIN_TEXT_CHECK_SCREENSHOTS,
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
      "До 10 000 страниц за проверку на тарифе Максимум",
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

export const TEXT_UNIQUENESS_V2_SOURCE: ClassicV3Source = {
  hero: TEXT_UNIQUENESS_HERO,
  stats: TEXT_UNIQUENESS_STATS,
  steps: [
    {
      step: "01",
      title: "Текст",
      text: "Вставьте текст. В кабинете — от 200 символов, с историей проверок по тарифу.",
    },
    {
      step: "02",
      title: "Режим",
      text: "Поиск совпадений по выдаче или сравнение с указанными страницами.",
    },
    {
      step: "03",
      title: "Отчёт",
      text: "Процент уникальности, источники и совпавшие фрагменты — чтобы править точечно.",
    },
  ],
  techLayers: [
    {
      id: "web",
      title: "Выдача",
      short: "Поиск фрагментов",
      text: "Характерные куски текста ищутся в выдаче, затем сверяются с найденными страницами.",
    },
    {
      id: "url",
      title: "Свои URL",
      short: "Список страниц",
      text: "Сравнение только с указанными адресами, без обхода выдачи.",
    },
    {
      id: "hist",
      title: "История",
      short: "По тарифу",
      text: "Готовые проверки хранятся в кабинете: Бесплатный без истории, дальше 10 / 20 / 50.",
    },
  ],
  grid: [
    { title: "Два режима", text: "Поиск в интернете или сверка с конкретными страницами." },
    { title: "Фрагменты", text: "В отчёте видно, какие куски текста уже встречаются." },
    { title: "Лимит", text: "Зонд выдачи или одна страница — одна проверка в месячном лимите." },
  ],
  highlight: {
    title: "Уникальность до публикации",
    lead: "Совпадения видны до того, как текст уйдёт в индекс.",
    bullets: ["Выдача и свои URL", "Совпавшие фрагменты", "История по тарифу"],
  },
  insightsMeta: {
    eyebrow: "Уникальность",
    title: "Процент и источники",
    lead: "Текст сравнивается по фрагментам, а не «на глаз».",
  },
  screenshots: [
    {
      src: "/modules/assets/uniqueness-shot-modes.png",
      caption: "Параметры анализа: текст, URL или пакет",
    },
    {
      src: "/modules/assets/uniqueness-shot-mode.png",
      caption: "Проверка уникальности включена, виден лимит",
    },
    {
      src: "/modules/assets/uniqueness-shot-text.png",
      caption: "Текст в редакторе перед проверкой",
    },
  ],
  plain: {
    title: "Зачем проверять уникальность в Титло",
    lead: "Один текст — процент уникальности, источники и фрагменты для правки.",
    items: [
      { title: "Выдача", text: "Поиск характерных фрагментов и сверка с найденными страницами." },
      { title: "Свои URL", text: "Сравнение с конкурентом или со своей старой версией." },
      { title: "Лимиты", text: "Проверки и слоты истории — по тарифу, обновление раз в месяц." },
    ],
  },
  faq: TEXT_UNIQUENESS_FAQ,
  options: ["Поиск в интернете", "Сравнение с URL", "История", "Фрагменты"],
};

export const SEO_CHECKLIST_V2_SOURCE: ClassicV3Source = {
  hero: {
    badge: "План SEO-работ",
    title: "SEO-чеклист",
    lead: "Один сайт — один план. Задачи по этапам, роли в команде, заметки к пунктам, учёт времени и выгрузка в PDF.",
    sub: "этапы · роли · таймер · PDF",
  },
  stats: [
    { value: "12 этапов", label: "в системном шаблоне, от онбординга до отчёта" },
    { value: "Роли", label: "ответственный, PM, аудитор и участники" },
    { value: "Таймер", label: "старт и стоп на задаче, учёт времени" },
    { value: "PDF", label: "план можно отдать клиенту" },
  ],
  steps: [
    {
      step: "01",
      title: "Проект",
      text: "Сайт и название чеклиста. Шаблон сразу раскладывает этапы и задачи.",
    },
    {
      step: "02",
      title: "Команда",
      text: "Ответственный, PM и аудитор видят один план. Задачу можно отдать участнику.",
    },
    {
      step: "03",
      title: "Работа",
      text: "Статус, срок, заметки и таймер на пункте. Готовый план выгружается в PDF.",
    },
  ],
  techLayers: [
    {
      id: "tpl",
      title: "Шаблон",
      short: "Свои этапы",
      text: "Системный шаблон или свой: этапы, задачи и подпункты.",
    },
    {
      id: "roles",
      title: "Роли",
      short: "Один проект",
      text: "Ответственный ведёт задачи, PM и аудитор смотрят тот же чеклист.",
    },
    {
      id: "time",
      title: "Время",
      short: "Таймер",
      text: "На задаче есть старт и стоп. Сводка — в учёте времени.",
    },
  ],
  grid: [
    { title: "Хроника", text: "Заметки по задачам собираются в одну ленту, непрочитанные видны отдельно." },
    { title: "Мои задачи", text: "Ближайшие пункты по всем проектам, без обхода каждого сайта." },
    { title: "Шаблоны", text: "Повторный чеклист для нового сайта собирается из готового шаблона." },
  ],
  highlight: {
    title: "План, а не таблица в чате",
    lead: "Статус, срок и кто делает пункт — в одном проекте.",
    bullets: ["Этапы из шаблона", "Роли команды", "PDF для клиента"],
  },
  insightsMeta: {
    eyebrow: "Чеклист",
    title: "Ход работ по сайту",
    lead: "Сколько пунктов закрыто и что ещё в работе.",
  },
  screenshots: [
    {
      src: "/modules/assets/checklist-shot-projects.png",
      caption: "Список чеклистов: прогресс, роли и шаблон",
    },
    {
      src: "/modules/assets/checklist-shot-board.png",
      caption: "Проект: этапы, задачи, таймер и PDF",
    },
    {
      src: "/modules/assets/checklist-shot-tasks.png",
      caption: "Задачи этапа: статус, срок, ответственный, заметки",
    },
  ],
  plain: {
    title: "Зачем SEO-чеклист в Титло",
    lead: "Работы по сайту не разъезжаются по чатам и таблицам.",
    items: [
      { title: "План", text: "Этапы и задачи появляются из шаблона, прогресс виден на карточке проекта." },
      { title: "Команда", text: "У проекта есть ответственный, PM и аудитор. Участник видит свои задачи." },
      { title: "След", text: "Заметки, таймер и PDF остаются у проекта, а не в переписке." },
    ],
  },
  faq: [
    {
      q: "Это проверка сайта?",
      a: "Нет. Чеклист — план работ: кто что делает по сайту. Технические ошибки собирает аудит сайта, позиции — мониторинг.",
    },
    {
      q: "Откуда берутся задачи?",
      a: "Из шаблона. Есть системный шаблон с этапами вроде онбординга и доступов. Свой шаблон можно собрать и применять к новым сайтам.",
    },
    {
      q: "Как посмотреть модуль без регистрации?",
      a: "Кнопка «Демо кабинет» в шапке этой страницы открывает чеклист в демо-доступе: проекты, задачи и шаблоны.",
    },
    {
      q: "Можно отдать план клиенту?",
      a: "Да. У проекта есть выгрузка в PDF. Внутри кабинета клиентский доступ не обязателен: PDF уходит файлом.",
    },
  ],
  options: ["Шаблоны", "Роли", "Таймер", "PDF"],
};

export const SEO_REPORTS_V2_SOURCE: ClassicV3Source = {
  hero: {
    badge: "Отчёт клиенту",
    title: "SEO-отчёты",
    lead: "Отчёт за период по сайту: визиты, позиции, закрытые задачи чеклиста и план. Клиент открывает его по ссылке и видит сравнение с прошлым периодом.",
    sub: "Метрика · позиции · чеклист · ссылка клиенту",
  },
  stats: [
    { value: "Месяц", label: "отчёт за выбранный период и сравнение с прошлым" },
    { value: "Ссылка", label: "клиент смотрит отчёт без входа в кабинет" },
    { value: "Шаблоны", label: "только SEO, SEO и реклама, комплексный" },
    { value: "Пакет", label: "отчёты за прошлый месяц сразу по нескольким сайтам" },
  ],
  steps: [
    {
      step: "01",
      title: "Проект",
      text: "Сайт, шаблон отчёта и подключения: Метрика, мониторинг позиций, Вебмастер и Search Console.",
    },
    {
      step: "02",
      title: "Сбор",
      text: "Генерация за период подтягивает трафик, позиции и закрытые задачи чеклиста.",
    },
    {
      step: "03",
      title: "Клиент",
      text: "Готовый отчёт открывается по ссылке: сравнение периодов, выводы и согласование.",
    },
  ],
  techLayers: [
    {
      id: "src",
      title: "Источники",
      short: "Метрика и позиции",
      text: "Цифры берутся из подключённых кабинетов и мониторинга, а не из ручной таблицы.",
    },
    {
      id: "cmp",
      title: "Сравнение",
      short: "Два периода",
      text: "Рядом текущий период и предыдущий: визиты, отказы, TOP-10.",
    },
    {
      id: "link",
      title: "Клиент",
      short: "Публичная ссылка",
      text: "Отчёт можно открыть без кабинета. При необходимости ставится PIN.",
    },
  ],
  grid: [
    { title: "Белый лейбл", text: "На обложке — название агентства, менеджер и контакты." },
    { title: "Чеклист", text: "В отчёт попадают закрытые за период задачи и план работ." },
    { title: "Шаблоны", text: "Набор разделов задаётся шаблоном: SEO, реклама или комплекс." },
  ],
  highlight: {
    title: "Отчёт, который можно отправить",
    lead: "Не скриншот таблицы: клиент листает разделы и видит динамику.",
    bullets: ["Сравнение периодов", "Позиции и трафик", "Ссылка без входа в кабинет"],
  },
  insightsMeta: {
    eyebrow: "Отчёт",
    title: "Что ушло клиенту",
    lead: "Период, источники и выводы в одном документе.",
  },
  screenshots: [
    {
      src: "/modules/assets/reports-shot-projects.png",
      caption: "Проекты отчётов и подключённые источники",
    },
    {
      src: "/modules/assets/reports-shot-project.png",
      caption: "Проект: генерация отчёта и что ещё не подключено",
    },
    {
      src: "/modules/assets/reports-shot-client.png",
      caption: "Отчёт для клиента: сравнение периодов, визиты и TOP-10",
    },
  ],
  plain: {
    title: "Зачем SEO-отчёты в Титло",
    lead: "Цифры месяца собираются в документ, который можно отдать клиенту.",
    items: [
      { title: "Период", text: "Отчёт за выбранные даты и сравнение с предыдущим отрезком той же длины." },
      { title: "Источники", text: "Метрика, позиции, чеклист. Что не подключено — видно до генерации." },
      { title: "Клиент", text: "Ссылка на отчёт. Демо-пример на сайте собран на вымышленных данных." },
    ],
  },
  faq: [
    {
      q: "Откуда цифры в отчёте?",
      a: "Из подключённых источников: Яндекс Метрика, мониторинг позиций, чеклист работ. Разделы без подключения в отчёт не подставляются.",
    },
    {
      q: "Клиент должен регистрироваться?",
      a: "Нет. Готовый отчёт открывается по ссылке. Если нужно, на ссылку ставится PIN.",
    },
    {
      q: "Как посмотреть без регистрации?",
      a: "Кнопка «Демо кабинет» в шапке открывает список проектов. Пример готового отчёта на демо-данных — кнопка «Создать демо-отчёт» внутри проекта.",
    },
    {
      q: "Можно сразу по нескольким сайтам?",
      a: "Да. На списке проектов есть пакетная генерация отчётов за прошлый месяц.",
    },
  ],
  options: ["Метрика", "Позиции", "Чеклист", "Ссылка клиенту"],
};

export const WORDSTAT_V2_SOURCE: ClassicV3Source = {
  hero: {
    badge: "Семантика",
    title: "Подбор слов Wordstat",
    lead: "По вашим фразам собираются запросы, в которых эти слова уже есть, и частота. Список можно вставить из таблицы и сразу разложить по группам.",
    sub: "Частота · группы · расширение списка",
  },
  stats: [
    { value: "1 фраза", label: "одна проверенная фраза — один запрос к месячному лимиту" },
    { value: "Группы", label: "фразы из блока и строки «группа: фраза» из таблицы" },
    { value: "До 2 000", label: "сколько запросов сохранить по каждой вашей фразе" },
    { value: "50–30 000", label: "запросов в месяц: бесплатный тариф и тариф «Максимум»" },
  ],
  steps: [
    {
      step: "01",
      title: "Фразы",
      text: "Список своих фраз. Группа задаётся строкой с решёткой или двумя столбцами из таблицы.",
    },
    {
      step: "02",
      title: "Сбор",
      text: "По каждой фразе сохраняются запросы, где она уже есть, и частота. Похожие запросы включаются отдельно.",
    },
    {
      step: "03",
      title: "Список",
      text: "Группы, поиск, сортировка по частоте и выгрузка в Excel. Лишнее можно убрать из списка.",
    },
  ],
  techLayers: [
    {
      id: "seed",
      title: "Ваши фразы",
      short: "Что проверяем",
      text: "Каждая строка — фраза, по которой ищем запросы. Фразы длиннее 400 символов и длиннее 7 слов пропускаются.",
    },
    {
      id: "freq",
      title: "Частота",
      short: "Сколько ищут",
      text: "Частота считается по выбранным регионам и устройствам. По умолчанию — Россия и все устройства.",
    },
    {
      id: "cap",
      title: "Лимит",
      short: "Запросы в месяц",
      text: "Бесплатно — 50 запросов в месяц, Оптимальный — 5 000, Ультимат — 12 000, Максимум — 30 000.",
    },
  ],
  grid: [
    { title: "Группы", text: "Строка «# Потолки» собирает фразы ниже в одну группу. «# Окна: пластиковые окна» — группа и фраза в одной строке." },
    { title: "Таблица", text: "Два столбца копируются из Excel, LibreOffice, Numbers или Google Таблиц: между ними уже стоит табуляция." },
    { title: "Расширение", text: "Можно взять запросы ещё и по найденным фразам. Глубина задаёт потолок, а не точный прогноз числа фраз." },
  ],
  highlight: {
    title: "Ядро с частотой, без ручного Wordstat",
    lead: "Фразы, группы и частота в одном списке. Сбор идёт в фоне: страницу можно закрыть.",
    bullets: ["Частота по регионам", "Группы из таблицы", "Поиск по всему списку"],
  },
  insightsMeta: {
    eyebrow: "Список",
    title: "Что получается на выходе",
    lead: "Фразы по группам, частота и откуда взялась каждая строка.",
  },
  screenshots: [
    {
      src: "/modules/assets/wordstat-shot-projects.png",
      caption: "Проекты: сайт, группы и сколько фраз уже собрано",
    },
    {
      src: "/modules/assets/wordstat-shot-form.png",
      caption: "Фразы, что брать из Wordstat, регион и устройства",
    },
    {
      src: "/modules/assets/wordstat-shot-phrases.png",
      caption: "Группы и фразы с частотой",
    },
  ],
  plain: {
    title: "Зачем подбор слов в Титло",
    lead: "Список фраз превращается в частотное ядро с группами, без копирования из Wordstat по одной строке.",
    items: [
      { title: "Фразы", text: "Свои запросы, группы и вставка двух столбцов из таблицы." },
      { title: "Частота", text: "Запросы, где уже есть ваша фраза, и сколько их ищут." },
      { title: "Список", text: "Группы, поиск, сортировка и выгрузка. Скриншоты на странице — вымышленный пример." },
    ],
  },
  faq: [
    {
      q: "Что считается одним запросом?",
      a: "Одна проверенная фраза — один запрос к месячному лимиту. Число сохранённых хвостов на это не влияет: от 1 до 2 000 на фразу расходует один запрос.",
    },
    {
      q: "Как разложить фразы по группам?",
      a: "Строка «# Потолки» — заголовок для фраз ниже. Строка «# Окна: пластиковые окна» — и группа, и фраза. Из таблицы копируются два столбца: название группы и фраза.",
    },
    {
      q: "Похожие запросы собираются сразу?",
      a: "Нет. По умолчанию сохраняются запросы, где есть ваша фраза. Похожие включаются отдельной галочкой.",
    },
    {
      q: "Сколько запросов в месяц?",
      a: "Бесплатный тариф — 50, Оптимальный — 5 000, Ультимат — 12 000, Максимум — 30 000. Остаток виден в кабинете.",
    },
    {
      q: "Как посмотреть без регистрации?",
      a: "Кнопка «Демо кабинет» в шапке открывает модуль с вымышленным примером: группы и фразы про окна и потолки.",
    },
  ],
  options: ["Частота", "Группы", "Регион", "Выгрузка"],
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
  screenshots: ESENIN_TEXT_CHECK_SCREENSHOTS,
  plain: ESENIN_TEXT_CHECK_PLAIN,
  faq: ESENIN_TEXT_CHECK_FAQ,
  options: ["6 категорий", "HTML / URL", "Автосохранение", "Подсветка"],
};
