/**
 * Редакторские оверрайды v2 по модулям (концепция «Центр управления»).
 * Подмешиваются в buildModuleV2Config поверх классики.
 */
import type {
  ModuleV2Act,
  ModuleV2FooterUi,
  ModuleV2HeroUi,
  ModuleV2Metric,
  ModuleV2OrbitNode,
  ModuleV2PainGain,
  ModuleV2SectionCopy,
} from "@/lib/content/module-v2/types";

import { RELEVANCE_SCREENSHOTS } from "@/lib/content/analiz-relevantnosti-page";
import { COMPETITOR_SCREENSHOTS } from "@/lib/content/analiz-konkurentov-page";
import { SITE_MON_SCREENSHOTS } from "@/lib/content/monitoring-saytov-page";
import { META_MON_SCREENSHOTS } from "@/lib/content/proverka-meta-tegov-page";
import { WORD_GEN_SCREENSHOTS } from "@/lib/content/generator-slov-page";
import { TEXT_LENGTH_SCREENSHOTS } from "@/lib/content/podschet-dliny-teksta-page";
import { PW_GEN_SCREENSHOTS } from "@/lib/content/generator-paroley-page";
import { LIST_COMPARE_SCREENSHOTS } from "@/lib/content/sravnenie-spiskov-page";
import { DEDUP_SCREENSHOTS } from "@/lib/content/udalenie-dublikatov-page";
import { UTM_SCREENSHOTS } from "@/lib/content/utm-metki-page";
import { ROI_CALC_SCREENSHOTS } from "@/lib/content/kalkulyator-roi-page";
import { HTTP_HEADERS_SCREENSHOTS } from "@/lib/content/http-headers-page";
import { HTML_EDITOR_SCREENSHOTS } from "@/lib/content/html-redaktor-page";
import { UNIQUE_WORDS_SCREENSHOTS } from "@/lib/content/vydelenie-unikalnykh-slov-page";
import { LINK_TRACK_SCREENSHOTS } from "@/lib/content/otslezhivanie-ssylok-page";
import { DOMAIN_REG_SCREENSHOTS } from "@/lib/content/otslezhivanie-sroka-registratsii-domenov-page";
import { TEXT_ANAL_SCREENSHOTS } from "@/lib/content/analiz-teksta-page";
import { CLUSTER_SCREENSHOTS } from "@/lib/content/klasterizator-klyuchevykh-slov-page";
import { SITE_AUDIT_SCREENSHOTS } from "@/lib/content/audit-sajta-page";
import { PHRASE_COMMERCE_SCREENSHOTS } from "@/lib/content/geo-lokalizaciya-kommerciya-page";
import { DOMAIN_RECORDS_SCREENSHOTS } from "@/lib/content/zapisi-domena-page";
import { SITE_TYPES_SCREENSHOTS } from "@/lib/content/tipy-saitov-v-vydache-page";
import { ESENIN_TEXT_CHECK_SCREENSHOTS } from "@/lib/content/proverka-teksta-esenin-page";

const S0 = "/modules/assets/3d7d72c85b4af88c.jpg";
const S1 = "/modules/assets/518ec5eeb1bee67f.jpg";
const S2 = S1;

export type ModuleV2Override = {
  eyebrow?: string;
  headline?: string;
  lead?: string;
  cta?: string;
  painGain?: Partial<ModuleV2PainGain>;
  acts?: readonly ModuleV2Act[];
  metrics?: readonly ModuleV2Metric[];
  orbit?: readonly ModuleV2OrbitNode[];
  hubTitle?: string;
  storySection?: Partial<ModuleV2SectionCopy>;
  metricSection?: Partial<ModuleV2SectionCopy>;
  optionsSection?: Partial<ModuleV2SectionCopy>;
  orbitSection?: Partial<ModuleV2SectionCopy & { hubTitle?: string }>;
  heroUi?: Partial<ModuleV2HeroUi>;
  footerUi?: Partial<ModuleV2FooterUi>;
  showSearchEngines?: boolean;
  videos?: readonly { id: string; title: string; description: string }[];
};

function act(
  n: string,
  title: string,
  lead: string,
  image: string,
  imageAlt: string,
  points: readonly string[],
  imageFocus?: string
): ModuleV2Act {
  return { act: n, title, lead, image, imageAlt, points, imageFocus };
}

function m(value: string, unit: string, note: string): ModuleV2Metric {
  return { value, unit, note };
}

const ORBIT = {
  relevance: { label: "Анализ релевантности", href: "/analiz-relevantnosti/", role: "ТОП и правки текста" },
  competitors: { label: "Анализ конкурентов", href: "/analiz-konkurentov/", role: "Кто в выдаче по фразам" },
  positions: { label: "Мониторинг позиций", href: "/monitoring-pozicii-sayta/", role: "Динамика по ключам" },
  meta: { label: "Мониторинг мета-тегов", href: "/proverka-meta-tegov-online/", role: "Title и description" },
  siteMon: { label: "Мониторинг сайтов", href: "/monitoring-saytov/", role: "Uptime и доступность" },
  links: { label: "Отслеживание ссылок", href: "/otslezhivanie-ssylok/", role: "Донор и анкор" },
  http: { label: "HTTP headers", href: "/http-headers/", role: "Ответ сервера по URL" },
  cluster: { label: "Кластеризатор", href: "/klasterizator-klyuchevykh-slov/", role: "Группировка ядра" },
  wordGen: { label: "Генератор слов", href: "/generator_slov/", role: "Комбинации фраз" },
  textAn: { label: "Анализ текста", href: "/analiz-teksta/", role: "Статистика и тошнота" },
} as const;

function orbit(...nodes: ModuleV2OrbitNode[]): readonly ModuleV2OrbitNode[] {
  return nodes;
}

export const MODULE_V2_OVERRIDES: Record<string, ModuleV2Override> = {
  "analiz-relevantnosti": {
    eyebrow: "Сравнение с ТОПом",
    headline: "Релевантность страницы — в одном отчёте",
    cta: "Запустить анализ релевантности",
    showSearchEngines: true,
    painGain: {
      painTitle: "Без сравнения с ТОПом",
      pains: [
        "Страницу сверяют с выдачей вручную — вкладка за вкладкой",
        "Переспам и пробелы по словам замечают уже после публикации",
        "Облака и списки для копирайтера собирают отдельно",
      ],
      gainTitle: "С отчётом Титло",
      gains: [
        "URL, регион и ТОП‑10/20 в одной форме",
        "Облака слов и рекомендации: добавить, убрать, усилить",
        "Повторный анализ после правок — в истории проекта",
      ],
    },
    acts: [
      act(
        "01",
        "Укажите URL и запрос",
        "Посадочная и ключевая фраза — с них начинается сравнение с выдачей.",
        RELEVANCE_SCREENSHOTS[0].src,
        RELEVANCE_SCREENSHOTS[0].caption,
        ["Регион поиска", "ТОП‑10 или ТОП‑20", "Исключение своих доменов"]
      ),
      act(
        "02",
        "Сравните с лидерами ниши",
        "Снимаем ТОП и сопоставляем ваш текст, мета и ссылки с конкурентами.",
        RELEVANCE_SCREENSHOTS[1].src,
        RELEVANCE_SCREENSHOTS[1].caption,
        ["Текстовые облака", "Зоны: текст · ссылки · мета", "Пересечение с ТОПом"],
        "65% top"
      ),
      act(
        "03",
        "Передайте правки в работу",
        "Список «добавить / убрать / усилить» — готовое ТЗ копирайтеру или в CMS.",
        RELEVANCE_SCREENSHOTS[2].src,
        RELEVANCE_SCREENSHOTS[2].caption,
        ["Экспорт словосочетаний", "Повтор после правок", "Связка с мониторингом позиций"]
      ),
    ],
    metrics: [
      m("ТОП", "10/20", "сравнение с выдачей"),
      m("3", "зоны", "текст · ссылки · мета"),
      m("TLP", "экспорт", "списки для копирайтера"),
      m("∞", "проектов", "в личном кабинете"),
    ],
    orbit: orbit(ORBIT.competitors, ORBIT.positions, ORBIT.cluster, ORBIT.http),
    hubTitle: "Анализ релевантности",
    storySection: {
      eyebrow: "Как работает",
      title: "От URL до списка правок — три шага",
      lead: "Не оценка ради оценки: сценарий заканчивается конкретными правками на странице.",
    },
    metricSection: {
      eyebrow: "Цифры",
      title: "Что входит в один анализ",
      lead: "ТОП, три зоны сравнения и экспорт TLP — без отдельных сервисов для облаков и мета.",
    },
    optionsSection: {
      eyebrow: "В отчёте",
      title: "Что получите после проверки",
      lead: "Облака, рекомендации и выгрузка списков — то, что видно в кабинете.",
    },
    orbitSection: {
      eyebrow: "Рядом в кабинете",
      title: "С чем сочетается релевантность",
      lead: "С анализом конкурентов, мониторингом позиций и кластеризацией ядра.",
    },
    heroUi: { keysFooter: "Запрос · URL", dynamicsFooter: "Отчёт · TLP" },
    footerUi: {
      finalTitle: "Запустить анализ релевантности",
      finalLead: "Сравните посадочную с выдачей до правок в CMS — отчёт и история в проекте.",
      faqTitle: "Частые вопросы про анализ релевантности",
    },
  },

  "analiz-konkurentov": {
    eyebrow: "Центр разведки по выдаче",
    headline: "Карта конкурентов по вашим ключам",
    cta: "Собрать матрицу конкурентов",
    showSearchEngines: true,
    painGain: {
      painTitle: "Без карты ниши",
      pains: [
        "ТОП по каждой фразе снимаете вручную — десятки вкладок",
        "Мета и вложенность конкурентов — в разных таблицах",
        "Стратегию строите на устаревшем срезе выдачи",
      ],
      gainTitle: "С анализом Титло",
      gains: [
        "Список ключей → сводная матрица доменов по региону",
        "Мета, вложенность и % в ТОП — в одном отчёте",
        "Экспорт для приоритетов в SEO и ТЗ",
      ],
    },
    acts: [
      act("01", "Загрузите семантику", "Фразы из файла или вставкой — ядро проекта в одном поле.", COMPETITOR_SCREENSHOTS[0]?.src ?? S0, "Список ключевых фраз", ["ТОП‑10/20", "Регион", "Пакетная проверка"]),
      act("02", "Снимите выдачу", "По каждому ключу — реальные URL из поиска, не «похожие сайты».", COMPETITOR_SCREENSHOTS[1]?.src ?? S1, "Матрица конкурентов", ["Домены в ТОПе", "Метатеги", "Вложенность страниц"], "65% top"),
      act("03", "Примите решения", "Кто доминирует, где разрыв по мета и структуре — для стратегии и правок.", COMPETITOR_SCREENSHOTS[2]?.src ?? S1, COMPETITOR_SCREENSHOTS[2]?.caption ?? "Сравнение посадочных", ["% в ТОП", "Экспорт", "Связка с релевантностью"]),
    ],
    metrics: [m("ТОП", "10/20", "по каждому ключу"), m("4", "среза", "ТОП · мета · вложенность · %"), m("∞", "ключей", "в одной проверке"), m("0", "₽", "старт в кабинете")],
    orbit: orbit(ORBIT.relevance, ORBIT.positions, ORBIT.meta, ORBIT.cluster),
    hubTitle: "Анализ конкурентов",
    storySection: { title: "От списка фраз до карты ниши" },
    heroUi: { keysFooter: "Ключи · регион", dynamicsFooter: "Матрица · экспорт" },
  },

  "monitoring-saytov": {
    eyebrow: "Доступность сайта",
    headline: "Uptime и алерты — до жалобы клиента",
    cta: "Настроить мониторинг сайта",
    painGain: {
      painTitle: "Без проверки по расписанию",
      pains: [
        "О падении узнаёте от клиента или случайного захода",
        "Uptime считают вручную по логам хостинга",
        "Нет единого лога инцидентов и отчёта для заказчика",
      ],
      gainTitle: "В Титло",
      gains: [
        "Проверки HTTP/HTTPS по расписанию и вручную",
        "Email и Telegram при сбое — до эскалации",
        "Лог, PDF и публичная ссылка на статистику",
      ],
    },
    acts: [
      act(
        "01",
        "Добавьте проект",
        "URL, интервал и таймаут — в одной форме. На Free интервал 60 мин.; на платных — чаще.",
        SITE_MON_SCREENSHOTS[1].src,
        SITE_MON_SCREENSHOTS[1].caption,
        ["URL и интервал", "Таймаут", "Фраза в HTML"]
      ),
      act(
        "02",
        "Смотрите статус и лог",
        "Таблица проектов: HTTP-код, доступность %, ручная проверка. В статистике — KPI и история.",
        SITE_MON_SCREENSHOTS[0].src,
        SITE_MON_SCREENSHOTS[0].caption,
        ["Таблица проектов", "Uptime %", "Лог проверок"]
      ),
      act(
        "03",
        "Отчёт и алерт",
        "PDF для архива, публичная ссылка клиенту, оповещение в Telegram или на почту при сбое.",
        SITE_MON_SCREENSHOTS[2].src,
        SITE_MON_SCREENSHOTS[2].caption,
        ["PDF-отчёт", "Публичная ссылка", "Telegram · email"]
      ),
    ],
    metrics: [
      m("24", "/7", "проверки по расписанию"),
      m("PDF", "· ссылка", "отчёт для клиента"),
      m("2", "канала", "email · telegram"),
      m("N", "сайтов", "в одном кабинете"),
    ],
    storySection: {
      eyebrow: "Как работает",
      title: "От URL до алерта",
      lead: "Проект и интервал → проверки cron и вручную → лог, PDF и оповещение при сбое.",
      midCta: {
        title: "Нужны проекты, лог и PDF?",
        lead: "На странице — разовая проверка. В кабинете: расписание, история, отчёт и публичная ссылка.",
      },
    },
    orbitSection: {
      eyebrow: "Рядом в кабинете",
      title: "С чем стыкуется мониторинг сайтов",
      lead: "Доступность рядом с HTTP-заголовками, мета-тегами и позициями в выдаче.",
    },
    footerUi: {
      finalTitle: "Настроить мониторинг в кабинете",
      finalLead: "Проекты, лог, PDF и оповещения — после регистрации.",
      faqTitle: "Частые вопросы про мониторинг сайтов",
    },
    orbit: orbit(ORBIT.http, ORBIT.meta, ORBIT.positions, ORBIT.links),
    hubTitle: "Мониторинг сайтов",
    optionsSection: { title: "Что проверяет модуль" },
    heroUi: { keysFooter: "Проект · URL", dynamicsFooter: "Uptime · алерт" },
  },

  "proverka-meta-tegov-online": {
    eyebrow: "SEO и разметка",
    headline: "Мониторинг мета-тегов вашего сайта с автоматическими проверками и историей изменений",
    cta: "Проверить мета-теги",
    painGain: {
      painTitle: "Без автоматизации",
      pains: [
        "Ручной контроль title и description на сотнях страниц",
        "Необходимость координировать работу команды специалистов",
        "Сложно отследить, как изменения сниппета повлияли на CTR и позицию",
      ],
      gainTitle: "В Титло",
      gains: [
        "До 500 страниц за один сбор данных",
        "Снимки версий в истории проверок",
        "Уведомления об изменениях",
      ],
    },
    acts: [
      act(
        "01",
        "Вставьте список URL",
        "Вставьте до 500 адресов страниц вашего сайта или сайтов конкурентов. Отметьте поля, содержимое которых необходимо собрать.",
        META_MON_SCREENSHOTS[0].src,
        META_MON_SCREENSHOTS[0].caption,
        ["URL построчно", "Поля с мета-информацией", "Тайм-аут между обращениями"]
      ),
      act(
        "02",
        "Получите данные",
        "Содержимое тегов в удобной таблице с подсветкой ошибок и фильтрами.",
        META_MON_SCREENSHOTS[1].src,
        META_MON_SCREENSHOTS[1].caption,
        ["Подсветка ошибок", "Фильтры"]
      ),
      act(
        "03",
        "Сравните снимки",
        "Сравнивайте снимки для оценки эффективности разных версий тегов.",
        META_MON_SCREENSHOTS[2].src,
        META_MON_SCREENSHOTS[2].caption,
        ["Сравнение версий", "Фильтр изменений", "Экспорт"]
      ),
    ],
    metrics: [
      m("500", "URL", "в одной проверке"),
      m("6+", "полей", "title · H1 · canonical…"),
      m("Δ", "снимков", "сравнение результатов проверок"),
      m("1", "сутки", "Автоматический запуск проверки"),
    ],
    storySection: {
      eyebrow: "Как это работает",
      title: "От списка URL до сравнения снимков",
      lead: "Список страниц → снимок тегов → сравнение с прошлой проверкой, если разметка изменилась.",
      midCta: {
        title: "Открыть панель",
        lead: "Бесплатный старт после регистрации.",
      },
    },
    orbitSection: {
      eyebrow: "Рядом в кабинете",
      title: "Мониторинг мета-тегов в связке с другими модулями сервиса",
      lead: "Текстовая релевантность, анализ конкурентов и мониторинг позиций.",
    },
    footerUi: {
      finalTitle: "Собрать мета-теги в кабинете",
      finalLead: "Регистрация в личном кабинете.",
      faqTitle: "Частые вопросы про мониторинг мета-тегов",
      videoLead: "Короткие уроки по интерфейсу и сценарию.",
    },
    orbit: orbit(ORBIT.relevance, ORBIT.competitors, ORBIT.positions, ORBIT.http),
    hubTitle: "Мониторинг мета-тегов",
    heroUi: { keysFooter: "URL · список", dynamicsFooter: "Снимок · сравнение" },
  },

  "generator_slov": {
    eyebrow: "Комбинации фраз",
    headline: "Семантика из блоков — за минуту",
    cta: "Собрать комбинации фраз",
    painGain: {
      painTitle: "Без комбинатора",
      pains: [
        "Сотни склеек «услуга + город» вручную в таблице",
        "Стоп-слова и порядок слов правят отдельно",
        "Ошибки в скобках [] ломают выгрузку в частотность",
      ],
      gainTitle: "В Титло",
      gains: [
        "Несколько блоков → все пересечения автоматически",
        "Длина фразы, стоп-слова «+», порядок в []",
        "Список готов для частотности и кластеризации",
      ],
    },
    acts: [
      act(
        "01",
        "Разбейте на блоки",
        "Услуга, объект, гео — по смыслу, не одной простынёй. Синонимы — в одном блоке.",
        WORD_GEN_SCREENSHOTS[0].src,
        WORD_GEN_SCREENSHOTS[0].caption,
        ["До 5 блоков", "Синонимы в блоке", "По слову на строку"]
      ),
      act(
        "02",
        "Задайте правила",
        "Длина фразы, порядок в [], стоп-слова и минус-вхождения — в опциях под списками.",
        WORD_GEN_SCREENSHOTS[3]?.src ?? WORD_GEN_SCREENSHOTS[1].src,
        WORD_GEN_SCREENSHOTS[3]?.caption ?? WORD_GEN_SCREENSHOTS[1].caption,
        ["«» и []", "Стоп-слова «+»", "Разбивка по длине"]
      ),
      act(
        "03",
        "Заберите список фраз",
        "Скопируйте результат — дальше в частотность, кластеризатор или анализ конкурентов.",
        WORD_GEN_SCREENSHOTS[2].src,
        WORD_GEN_SCREENSHOTS[2].caption,
        ["Копирование списка", "Кластеризатор", "Анализ конкурентов"]
      ),
    ],
    metrics: [
      m("∞", "фраз", "на бесплатном тарифе"),
      m("5", "блоков", "списков слов"),
      m("4", "опции", "длина · порядок · стоп"),
      m("1", "клик", "готовое ядро"),
    ],
    storySection: {
      eyebrow: "Как работает",
      title: "От блоков до списка фраз",
      lead: "Списки слов → правила комбинаций → готовое ядро для частотности и кластеризации.",
      midCta: {
        title: "Попробовать комбинатор?",
        lead: "На этой странице — без лимитов. Полный модуль и соседние SEO-инструменты — в кабинете.",
      },
    },
    orbitSection: {
      eyebrow: "Рядом в кабинете",
      title: "С чем стыкуется генератор слов",
      lead: "После комбинаций — кластеризатор, анализ конкурентов, релевантность и мониторинг позиций.",
    },
    footerUi: {
      finalTitle: "Собрать комбинации в кабинете",
      finalLead: "Блоки, операторы и копирование результата — после регистрации.",
      faqTitle: "Частые вопросы про генератор слов",
    },
    orbit: orbit(ORBIT.cluster, ORBIT.competitors, ORBIT.relevance, ORBIT.positions),
    hubTitle: "Генератор слов",
    heroUi: { keysFooter: "Блоки · опции", dynamicsFooter: "Фразы · копирование" },
  },

  "podschet-dliny-teksta": {
    eyebrow: "Символы и слова",
    headline: "Подсчёт длины текста — с пробелами и без",
    cta: "Подсчитать текст",
    painGain: {
      painTitle: "Без единого счётчика",
      pains: [
        "В Word, Docs и ТЗ — разные цифры по символам",
        "Title и description меряют «на глаз» до выкладки",
        "Нет быстрой сверки объёма с лимитом площадки",
      ],
      gainTitle: "В Титло",
      gains: [
        "Символы с пробелами и без, слова, строки — сразу",
        "Длина title, description и H1 с рекомендуемыми лимитами",
        "Структура: предложения, абзацы, время чтения",
      ],
    },
    acts: [
      act(
        "01",
        "Вставьте текст",
        "Статья, карточка или фрагмент — до 38 600 символов. По желанию title, description и H1.",
        TEXT_LENGTH_SCREENSHOTS[0].src,
        TEXT_LENGTH_SCREENSHOTS[0].caption,
        ["С пробелами / без", "Слова · строки", "SEO-мета"]
      ),
      act(
        "02",
        "Смотрите отчёт",
        "Длина title, description и H1 плюс предложения, абзацы и время чтения.",
        TEXT_LENGTH_SCREENSHOTS[1].src,
        TEXT_LENGTH_SCREENSHOTS[1].caption,
        ["Title · Description · H1", "Структура", "Время чтения"]
      ),
      act(
        "03",
        "Сверьте с лимитами",
        "Сразу видно, укладываются ли title и description в рекомендуемые лимиты.",
        TEXT_LENGTH_SCREENSHOTS[2].src,
        TEXT_LENGTH_SCREENSHOTS[2].caption,
        ["До 60 / 160", "H1", "Без Excel"]
      ),
    ],
    metrics: [
      m("38 600", "символов", "за одну проверку"),
      m("2", "режима", "с пробелами · без"),
      m("3", "SEO-поля", "title · description · H1"),
      m("0 с", "задержка", "подсчёт сразу"),
    ],
    storySection: {
      eyebrow: "Как работает",
      title: "От вставки текста до отчёта",
      lead: "Вставили текст → счётчики и SEO-лимиты → сверка с ТЗ или сниппетом.",
      midCta: {
        title: "Нужен подсчёт без лимитов демо?",
        lead: "В демо уже есть текст и SEO-поля. В кабинете — тот же отчёт без суточного лимита на сайте.",
      },
    },
    orbitSection: {
      eyebrow: "Рядом в кабинете",
      title: "С чем стыкуется подсчёт длины",
      lead: "После объёма — анализ текста, релевантность, генератор слов и кластеризатор.",
    },
    footerUi: {
      finalTitle: "Подсчитать длину текста",
      finalLead: "Символы, слова и SEO-лимиты — в кабинете после регистрации.",
      faqTitle: "Частые вопросы про подсчёт длины текста",
    },
    orbit: orbit(ORBIT.textAn, ORBIT.relevance, ORBIT.wordGen, ORBIT.cluster),
    hubTitle: "Подсчёт длины",
    heroUi: { keysFooter: "Текст · ввод", dynamicsFooter: "Счётчики · лимиты" },
  },

  "generator-paroley": {
    eyebrow: "Доступы и пароли",
    headline: "Надёжный пароль — за один клик",
    cta: "Сгенерировать пароль",
    painGain: {
      painTitle: "Без генератора",
      pains: [
        "Один пароль на десяток сервисов",
        "«Qwerty» и даты рождения в рабочих доступах",
        "Нет общей политики длины и символов для команды",
      ],
      gainTitle: "В Титло",
      gains: [
        "Пресет или своя политика: длина до 50 и набор символов",
        "До пяти вариантов за клик — копирование сразу",
        "История с комментарием в кабинете",
      ],
    },
    acts: [
      act(
        "01",
        "Задайте политику",
        "Пресет «надёжный», «буквы» или «PIN» — либо вручную: цифры, регистр, спецсимволы и длина.",
        PW_GEN_SCREENSHOTS[0].src,
        PW_GEN_SCREENSHOTS[0].caption,
        ["Пресеты: надёжный · буквы · PIN", "До 50 символов", "Сохранение в историю"]
      ),
      act(
        "02",
        "Сгенерируйте варианты",
        "До пяти разных цепочек за клик — скопируйте нужную или сохраните в историю.",
        PW_GEN_SCREENSHOTS[1].src,
        PW_GEN_SCREENSHOTS[1].caption,
        ["Копировать", "Сохранить в историю", "Новая генерация"]
      ),
      act(
        "03",
        "Сохраните в историю",
        "Комментарий без логина и названия сервиса — пометка, понятная только вам.",
        PW_GEN_SCREENSHOTS[2].src,
        PW_GEN_SCREENSHOTS[2].caption,
        ["Комментарий к паролю", "Копирование из истории", "Удаление записи"]
      ),
    ],
    metrics: [
      m("50", "симв.", "максимальная длина"),
      m("4", "набора", "цифры · Aa · спец"),
      m("5", "вариантов", "за один клик"),
      m("∞", "история", "сохранения в кабинете"),
    ],
    storySection: {
      eyebrow: "Как работает",
      title: "От политики до истории доступов",
      lead: "Пресет или свои правила → варианты пароля → сохранение с пометкой в кабинете.",
    },
    orbitSection: {
      eyebrow: "Рядом в кабинете",
      title: "С чем стыкуется генератор паролей",
      lead: "Рядом с HTTP-заголовками, мониторингом сайтов и инструментами для доступов команды.",
    },
    footerUi: {
      finalTitle: "Сгенерировать пароль в кабинете",
      finalLead: "Пресеты, пять вариантов за клик и история с комментарием — после регистрации.",
      faqTitle: "Частые вопросы про генератор паролей",
    },
    orbit: orbit(ORBIT.http, ORBIT.siteMon, { label: "HTML-редактор", href: "/html-redaktor/", role: "Вёрстка и доступы" }, { label: "UTM метки", href: "/utm-metki/", role: "Кампании" }),
    hubTitle: "Генератор паролей",
    heroUi: { keysFooter: "Политика · длина", dynamicsFooter: "Варианты · история" },
  },

  "sravnenie-spiskov-klyuchevykh-fraz": {
    eyebrow: "Два списка · четыре режима",
    headline: "Сравнение списков ключевых фраз",
    cta: "Сравнить списки фраз",
    painGain: {
      painTitle: "Без быстрой сверки",
      pains: [
        "Два ядра сверяют в Excel вручную — и всё равно путают регистр и дубли",
        "Не видно сразу: что общее, что только у клиента, что только у вас",
        "Перед созвоном снова собирают отчёт построчно",
      ],
      gainTitle: "В Титло",
      gains: [
        "Пересечение, только A, только B или объединение — одним прогоном",
        "Опции: trim, без учёта регистра, сортировка А→Я",
        "KPI и готовый список — копирование или файл",
      ],
    },
    acts: [
      act(
        "01",
        "Загрузите списки",
        "Ядро агентства и список клиента — или два среза проекта. Построчно или из .txt.",
        LIST_COMPARE_SCREENSHOTS[0].src,
        LIST_COMPARE_SCREENSHOTS[0].caption,
        ["Вставка · файл", "Счётчик фраз", "Поменять местами"]
      ),
      act(
        "02",
        "Выберите режим",
        "Пересечение, только A, только B или объединение — плюс регистр и сортировка.",
        LIST_COMPARE_SCREENSHOTS[1].src,
        LIST_COMPARE_SCREENSHOTS[1].caption,
        ["Пресеты", "Без учёта регистра", "Сортировка А→Я"]
      ),
      act(
        "03",
        "Заберите результат",
        "KPI по спискам и пересечению, готовый список — копирование или файл.",
        LIST_COMPARE_SCREENSHOTS[2].src,
        LIST_COMPARE_SCREENSHOTS[2].caption,
        ["KPI", "Копировать", "Скачать"]
      ),
    ],
    metrics: [
      m("2", "списка", "за один прогон"),
      m("4", "режима", "пересечение · A · B · свод"),
      m("3 000", "символов", "лимит демо на список"),
      m("0 с", "задержка", "сверка сразу"),
    ],
    storySection: {
      eyebrow: "Как работает",
      title: "От двух списков до результата",
      lead: "Вставили A и B → выбрали режим → KPI и список для копирования или файла.",
      midCta: {
        title: "Нужна сверка без лимита демо?",
        lead: "В демо — до 3 000 символов на список. В кабинете — те же четыре режима без лимита по символам.",
      },
    },
    orbitSection: {
      eyebrow: "Рядом в кабинете",
      title: "С чем стыкуется сравнение списков",
      lead: "После сверки — удаление дубликатов, генератор слов, кластеризатор и мониторинг позиций.",
    },
    footerUi: {
      finalTitle: "Сравнить списки фраз",
      finalLead: "Четыре режима, KPI и выгрузка — в кабинете после регистрации.",
      faqTitle: "Частые вопросы про сравнение списков",
    },
    orbit: orbit(
      { label: "Удаление дубликатов", href: "/udalenie-dublikatov/", role: "Чистка перед сверкой" },
      ORBIT.wordGen,
      ORBIT.cluster,
      ORBIT.positions
    ),
    hubTitle: "Сравнение списков",
    heroUi: { keysFooter: "Список A · B", dynamicsFooter: "Сверка · результат" },
  },

  "udalenie-dublikatov": {
    eyebrow: "Чистка списков",
    headline: "Удаление дубликатов из списка фраз и URL",
    cta: "Очистить список",
    painGain: {
      painTitle: "Без быстрой чистки",
      pains: [
        "Одинаковые фразы с разным регистром и пробелами остаются в ядре",
        "Повторы раздувают мониторинг и выгрузки",
        "В Excel снова чистят вручную перед сдачей клиенту",
      ],
      gainTitle: "В Титло",
      gains: [
        "Исходник и результат рядом — сразу видно, что ушло",
        "Пробелы, дубли, регистр, ё→е и сортировка — нужные галочки",
        "KPI: было / стало, сколько дублей и пустых снято",
      ],
    },
    acts: [
      act(
        "01",
        "Вставьте список",
        "Ключи из Excel, отчёта или .txt — построчно. Рядом сразу виден результат после обработки.",
        DEDUP_SCREENSHOTS[0].src,
        DEDUP_SCREENSHOTS[0].caption,
        ["Исходник · результат", "Пресеты", "Автообработка"]
      ),
      act(
        "02",
        "Настройте фильтры",
        "Пробелы, пустые строки, дубли, регистр, ё→е и сортировка — нужные галочки перед прогоном.",
        DEDUP_SCREENSHOTS[1].src,
        DEDUP_SCREENSHOTS[1].caption,
        ["9+ опций", "Без учёта регистра", "Сортировка А→Я"]
      ),
      act(
        "03",
        "Смотрите KPI",
        "Было / стало, сколько дублей и пустых снято — чистый список готов к копированию.",
        DEDUP_SCREENSHOTS[2].src,
        DEDUP_SCREENSHOTS[2].caption,
        ["Было · стало", "Снято дублей", "Пустые убраны"]
      ),
    ],
    metrics: [
      m("9+", "фильтров", "пробелы · дубли · регистр"),
      m("2", "пресета", "только дубли · SEO-список"),
      m("KPI", "сводка", "было · стало · снято"),
      m("0 с", "задержка", "очистка сразу"),
    ],
    storySection: {
      eyebrow: "Как работает",
      title: "От сырого списка до уникальных строк",
      lead: "Вставили список → выбрали фильтры → KPI и чистый результат рядом.",
      midCta: {
        title: "Нужны все фильтры без лимита демо?",
        lead: "В демо — базовые фильтры и KPI. В кабинете — полный набор опций и списки без лимита демо на сайте.",
      },
    },
    orbitSection: {
      eyebrow: "Рядом в кабинете",
      title: "С чем стыкуется удаление дубликатов",
      lead: "После чистки — сравнение списков, генератор слов, кластеризатор и мониторинг позиций.",
    },
    footerUi: {
      finalTitle: "Очистить список",
      finalLead: "Фильтры, KPI и чистый результат — в кабинете после регистрации.",
      faqTitle: "Частые вопросы про удаление дубликатов",
    },
    orbit: orbit(
      { label: "Сравнение списков", href: "/sravnenie-spiskov-klyuchevykh-fraz/", role: "Сверка двух ядер" },
      ORBIT.wordGen,
      ORBIT.cluster,
      ORBIT.positions
    ),
    hubTitle: "Удаление дубликатов",
    heroUi: { keysFooter: "Список · ввод", dynamicsFooter: "KPI · результат" },
  },

  "utm-metki": {
    eyebrow: "Разметка рекламы",
    headline: "Генератор UTM — страница, метки, готовая ссылка",
    cta: "Собрать UTM-ссылку",
    painGain: {
      painTitle: "Без единого конструктора",
      pains: [
        "В блокноте теряют «?» и «&» — ссылка в объявлении битая",
        "У коллег разные значения source и medium — отчёт разъезжается",
        "Шаблоны площадок ищут в справке, а не в форме",
      ],
      gainTitle: "В Титло",
      gains: [
        "Посадочная и шаблон Директ / Ads / VK / myTarget",
        "source, medium, campaign — с быстрыми значениями и макросами",
        "Готовая ссылка одной кнопкой — без ручной склейки query",
      ],
    },
    acts: [
      act(
        "01",
        "Укажите страницу",
        "Адрес посадочной и шаблон площадки — Директ, Ads, VK или вручную.",
        UTM_SCREENSHOTS[0].src,
        UTM_SCREENSHOTS[0].caption,
        ["Целевая страница", "Шаблоны", "Несколько URL"]
      ),
      act(
        "02",
        "Заполните метки",
        "utm_source, utm_medium и utm_campaign — с подсказками и быстрыми значениями.",
        UTM_SCREENSHOTS[1].src,
        UTM_SCREENSHOTS[1].caption,
        ["source · medium", "campaign", "Макросы"]
      ),
      act(
        "03",
        "Скопируйте ссылку",
        "Готовый URL с кодированием параметров — в объявление или рассылку.",
        UTM_SCREENSHOTS[2].src,
        UTM_SCREENSHOTS[2].caption,
        ["Готовая ссылка", "Копировать", "Без опечаток"]
      ),
    ],
    metrics: [
      m("5", "полей", "стандарт UTM"),
      m("4", "шаблона", "Директ · Ads · VK · myTarget"),
      m("1", "ссылка", "на выходе"),
      m("0", "установок", "в браузере"),
    ],
    storySection: {
      eyebrow: "Как работает",
      title: "От посадочной до ссылки в объявлении",
      lead: "Выбрали страницу и шаблон → заполнили метки → скопировали готовый URL.",
      midCta: {
        title: "Собрать ссылку прямо здесь?",
        lead: "На странице — полный генератор без лимитов. В кабинете — тот же конструктор рядом с ROI, мета-тегами и мониторингом.",
      },
    },
    orbitSection: {
      eyebrow: "Рядом в кабинете",
      title: "С чем стыкуется генератор UTM",
      lead: "После разметки — ROI кампании, позиции, HTML посадочной и мета-теги.",
    },
    footerUi: {
      finalTitle: "Собрать UTM-ссылку",
      finalLead: "Шаблоны площадок и готовый URL — без регистрации на этой странице.",
      faqTitle: "Частые вопросы про UTM-метки",
    },
    orbit: orbit(
      { label: "Калькулятор ROI", href: "/kalkulyator-roi/", role: "Окупаемость кампаний" },
      ORBIT.positions,
      { label: "HTML-редактор", href: "/html-redaktor/", role: "Посадочные" },
      ORBIT.meta
    ),
    hubTitle: "UTM метки",
    heroUi: { keysFooter: "Страница · шаблон", dynamicsFooter: "Ссылка · копировать" },
  },

  "kalkulyator-roi": {
    eyebrow: "Окупаемость рекламы",
    headline: "ROI кампании — до запуска и по факту",
    cta: "Посчитать ROI",
    painGain: {
      painTitle: "Без модели в цифрах",
      pains: [
        "Бюджет согласуют «на глаз» — без ROI и маржи",
        "Маркетинг и финансы считают в разных таблицах",
        "Нет быстрого сценария «что если вырастет CPA»",
      ],
      gainTitle: "В Титло",
      gains: [
        "Факт РК и прогноз трафика — в одном модуле",
        "ROI, CTR, CPC, CPA и метрики воронки сразу",
        "Сценарии для согласования бюджета с руководством",
      ],
    },
    acts: [
      act(
        "01",
        "Введите данные РК",
        "Стоимость кампании и доход — минимум для ROI. Показы, клики, заявки и продажи — для CTR, CPC и CPA.",
        ROI_CALC_SCREENSHOTS[0].src,
        ROI_CALC_SCREENSHOTS[0].caption,
        ["Стоимость и доход", "Воронка: показы → продажи", "Округление до сотых"]
      ),
      act(
        "02",
        "Смотрите метрики",
        "ROI, CTR, CTC, CPC, CPA и средние чеки — без формул в Excel. Сразу видно, где теряется воронка.",
        ROI_CALC_SCREENSHOTS[1].src,
        ROI_CALC_SCREENSHOTS[1].caption,
        ["ROI %", "Стоимости этапов", "Средний чек"]
      ),
      act(
        "03",
        "Спрогнозируйте бюджет",
        "Вкладка прогноза: бюджет, CPC, конверсия и чек — ожидаемые клики и продажи. Ползунки для сценариев «что если».",
        ROI_CALC_SCREENSHOTS[2].src,
        ROI_CALC_SCREENSHOTS[2].caption,
        ["Прогноз кликов", "Прогноз продаж", "Сценарии конверсии"]
      ),
    ],
    metrics: [
      m("ROI", "%", "окупаемость вложений"),
      m("10+", "метрик", "из одной формы"),
      m("2", "режима", "факт · прогноз"),
      m("0", "₽", "старт на Free"),
    ],
    storySection: {
      eyebrow: "Как работает",
      title: "От вводных РК до ROI и прогноза",
      lead: "Цифры из рекламного кабинета → метрики воронки → сценарий бюджета на следующий запуск.",
      midCta: {
        title: "Нужен тот же калькулятор в кабинете?",
        lead: "Расчёт и прогноз без лимитов на странице. В кабинете — рядом UTM, семантика, мониторинг и анализ конкурентов.",
      },
    },
    orbitSection: {
      eyebrow: "Рядом в кабинете",
      title: "С чем стыкуется калькулятор ROI",
      lead: "После модели окупаемости — UTM для атрибуции, позиции и доступность лендинга.",
    },
    footerUi: {
      finalTitle: "Посчитать ROI в кабинете",
      finalLead: "Факт кампании, прогноз трафика и соседние маркетинговые модули — после регистрации.",
      faqTitle: "Частые вопросы про калькулятор ROI",
    },
    orbit: orbit(
      { label: "UTM метки", href: "/utm-metki/", role: "Разметка трафика" },
      ORBIT.positions,
      ORBIT.competitors,
      { label: "Мониторинг сайтов", href: "/monitoring-saytov/", role: "Лендинг жив" }
    ),
    hubTitle: "Калькулятор ROI",
    heroUi: { keysFooter: "Вводные · бюджет", dynamicsFooter: "ROI · прогноз" },
  },

  "http-headers": {
    eyebrow: "Ответ сервера",
    headline: "HTTP-заголовки — код, кэш и HTML в одном отчёте",
    cta: "Проверить заголовки",
    painGain: {
      painTitle: "Без единой проверки",
      pains: [
        "В DevTools смотрят заголовки по одной вкладке",
        "Список из десятков URL гоняют в терминале вручную",
        "Коллеге сложно передать снимок ответа сервера",
      ],
      gainTitle: "В Титло",
      gains: [
        "Один URL — код, таблица заголовков и HTML",
        "Пакет до 500 адресов — коды ответа с паузой между запросами",
        "Публичная ссылка на результат и выгрузка для команды",
      ],
    },
    acts: [
      act(
        "01",
        "Укажите URL",
        "Один адрес — полный отчёт: код ответа, заголовки и HTML страницы.",
        HTTP_HEADERS_SCREENSHOTS[0].src,
        HTTP_HEADERS_SCREENSHOTS[0].caption,
        ["Один URL", "Публичная ссылка", "HTML страницы"]
      ),
      act(
        "02",
        "Снимите ответ",
        "Таблица заголовков и превью HTML — без DevTools на каждой вкладке.",
        HTTP_HEADERS_SCREENSHOTS[1].src,
        HTTP_HEADERS_SCREENSHOTS[1].caption,
        ["HTTP Code", "Cache-Control", "HSTS · XFO"]
      ),
      act(
        "03",
        "Проверьте пакет",
        "До 500 URL построчно, пауза между запросами — массовая проверка кодов ответа.",
        HTTP_HEADERS_SCREENSHOTS[2].src,
        HTTP_HEADERS_SCREENSHOTS[2].caption,
        ["До 500 URL", "Пауза мс", "Сводка кодов"]
      ),
    ],
    metrics: [
      m("1", "URL", "полный отчёт"),
      m("500", "URL", "коды в пакете"),
      m("0", "установок", "всё в браузере"),
      m("HTML", "превью", "вместе с headers"),
    ],
    storySection: {
      eyebrow: "Как работает",
      title: "От URL до таблицы заголовков",
      lead: "Ввели адрес → увидели код и заголовки → при необходимости прогнали пакет и отдали результат команде.",
      midCta: {
        title: "Нужен пакет до 500 URL?",
        lead: "В демо на сайте — один URL за запуск. Полный отчёт по ссылке, пакетная проверка и выгрузка — в кабинете после регистрации.",
      },
    },
    orbitSection: {
      eyebrow: "Рядом в кабинете",
      title: "С чем стыкуется проверка заголовков",
      lead: "После ответа сервера — мониторинг сайтов, мета-теги, релевантность и отслеживание ссылок.",
    },
    footerUi: {
      finalTitle: "Проверить HTTP-заголовки",
      finalLead: "Один URL в демо без регистрации. Пакет и выгрузка — в кабинете.",
      faqTitle: "Частые вопросы про HTTP-заголовки",
    },
    orbit: orbit(ORBIT.siteMon, ORBIT.meta, ORBIT.relevance, ORBIT.links),
    hubTitle: "HTTP headers",
    heroUi: { keysFooter: "URL · пакет", dynamicsFooter: "Ответ · HTML" },
  },

  "html-redaktor": {
    eyebrow: "Вёрстка и контент",
    headline: "Визуальный HTML-редактор — код рядом",
    cta: "Открыть редактор",
    painGain: {
      painTitle: "Без удобного редактора",
      pains: [
        "В блокноте нет превью — ломают теги и кавычки",
        "В CMS правят «вслепую», код смотрят только после публикации",
        "Одинаковые блоки FAQ и CTA собирают заново каждый раз",
      ],
      gainTitle: "В Титло",
      gains: [
        "Визуал и HTML рядом — правка с любой стороны",
        "Копирование разметки одной кнопкой, счётчик символов",
        "Готовые пресеты и свои шаблоны — без IDE",
      ],
    },
    acts: [
      act(
        "01",
        "Правьте рядом",
        "Визуальный редактор слева, HTML справа — правки сразу видны в разметке.",
        HTML_EDITOR_SCREENSHOTS[0].src,
        HTML_EDITOR_SCREENSHOTS[0].caption,
        ["Рядом · код снизу", "Превью", "Счётчик символов"]
      ),
      act(
        "02",
        "Смотрите код",
        "Режим «код снизу»: подсветка тегов, копирование HTML одной кнопкой.",
        HTML_EDITOR_SCREENSHOTS[1].src,
        HTML_EDITOR_SCREENSHOTS[1].caption,
        ["Подсветка", "Копировать HTML", "Без установок"]
      ),
      act(
        "03",
        "Вставьте пресет",
        "Посадочная, FAQ, CTA, таблица — готовые блоки или свой сохранённый шаблон.",
        HTML_EDITOR_SCREENSHOTS[2].src,
        HTML_EDITOR_SCREENSHOTS[2].caption,
        ["7 готовых", "Свои пресеты", "Shift — в конец"]
      ),
    ],
    metrics: [
      m("2", "режима", "рядом · код снизу"),
      m("7", "пресетов", "готовые блоки"),
      m("20", "проектов", "в кабинете"),
      m("0", "установок", "всё в браузере"),
    ],
    storySection: {
      eyebrow: "Как работает",
      title: "От черновика до HTML для CMS",
      lead: "Открыли редактор → поправили визуал или код → скопировали фрагмент или сохранили в проект.",
      midCta: {
        title: "Нужны проекты и свои пресеты?",
        lead: "В демо — визуал, HTML и готовые блоки без лимита. Сохранение, проекты и публичная ссылка — в кабинете после регистрации.",
      },
    },
    orbitSection: {
      eyebrow: "Рядом в кабинете",
      title: "С чем стыкуется HTML-редактор",
      lead: "После вёрстки блока — длина текста, мета-теги, релевантность и анализ текста.",
    },
    footerUi: {
      finalTitle: "Открыть HTML-редактор",
      finalLead: "Визуал и код рядом, пресеты и копирование — в демо без регистрации.",
      faqTitle: "Частые вопросы про HTML-редактор",
    },
    orbit: orbit(
      { label: "Подсчёт длины текста", href: "/podschet-dliny-teksta/", role: "Символы и SEO-поля" },
      ORBIT.meta,
      ORBIT.relevance,
      ORBIT.textAn
    ),
    hubTitle: "HTML-редактор",
    heroUi: { keysFooter: "Визуал · HTML", dynamicsFooter: "Пресеты · копия" },
  },

  "vydelenie-unikalnykh-slov-v-tekste": {
    eyebrow: "Центр уникальности",
    headline: "Уникальные слова — на виду",
    cta: "Выделить уникальные слова",
    painGain: {
      painTitle: "Сравнение двух текстов вручную",
      pains: [
        "Не видно, что есть только в вашей статье",
        "Копирайт и SEO спорят без цифр",
        "Долго готовить отчёт по дублям контента",
      ],
      gainTitle: "С модулем выделения",
      gains: [
        "Два текста → уникальные формулировки",
        "Наглядная разметка в отчёте",
        "Быстрая сверка с конкурентом или ТЗ",
      ],
    },
    acts: [
      act("01", "Вставьте тексты", "Ваш материал и эталон — статья конкурента или старая версия.", UNIQUE_WORDS_SCREENSHOTS[0]?.src ?? S0, "Два поля", ["Любой объём", "Без файлов", "Мгновенно"]),
      act("02", "Увидьте разницу", "Слова и фразы, которые встречаются только с одной стороны.", UNIQUE_WORDS_SCREENSHOTS[1]?.src ?? S1, "Подсветка", ["Уникальные блоки", "Повторы", "Копирование"], "65% top"),
      act("03", "Усильте контент", "Добавьте недостающую лексику — к релевантности и анализу текста.", UNIQUE_WORDS_SCREENSHOTS[1]?.src ?? S1, "Следующий шаг", ["Анализ текста", "Релевантность", "Подсчёт длины"]),
    ],
    metrics: [m("2", "текста", "за сравнение"), m("100", "%", "наглядность"), m("∞", "прогонов", "Free"), m("SEO", "уникальность", "лексика")],
    orbit: orbit(ORBIT.textAn, ORBIT.relevance, { label: "Подсчёт длины текста", href: "/podschet-dliny-teksta/", role: "Объём" }, ORBIT.competitors),
    hubTitle: "Уникальные слова",
    heroUi: { keysFooter: "Текст A · B", dynamicsFooter: "Уникальные · отчёт" },
  },

  "otslezhivanie-ssylok": {
    eyebrow: "Донор и анкор",
    headline: "Ссылки на месте — до просадки в отчётах",
    cta: "Открыть отслеживание ссылок",
    showSearchEngines: false,
    painGain: {
      painTitle: "Без ежедневной проверки доноров",
      pains: [
        "Десятки страниц открывают вручную — и всё равно что-то пропускают",
        "Ссылку сняли или сменили анкор — узнаёте поздно",
        "nofollow и noindex появляются незаметно",
      ],
      gainTitle: "В Титло",
      gains: [
        "Проект: донор, URL, анкор, контроль nofollow и noindex",
        "Проверка раз в сутки и сводка проблемных ссылок",
        "Telegram и email, когда размещение сломалось",
      ],
    },
    acts: [
      act(
        "01",
        "Добавьте ссылки",
        "Списком или построчно: донор, URL на ваш сайт, анкор, контроль nofollow и noindex.",
        LINK_TRACK_SCREENSHOTS[0].src,
        LINK_TRACK_SCREENSHOTS[0].caption,
        ["Список ::", "Таблица", "Анкор"]
      ),
      act(
        "02",
        "Смотрите статусы",
        "Найдена / не найдена, nofollow и noindex — фильтры и правка прямо в таблице.",
        LINK_TRACK_SCREENSHOTS[1].src,
        LINK_TRACK_SCREENSHOTS[1].caption,
        ["Статус", "nofollow · noindex", "Проверка"]
      ),
      act(
        "03",
        "Ловите проблемные",
        "Сводка проекта: сколько ссылок всего и сколько уже с ошибкой донора или размещения.",
        LINK_TRACK_SCREENSHOTS[2].src,
        LINK_TRACK_SCREENSHOTS[2].caption,
        ["Всего", "Проблемных", "Привязка к позициям"]
      ),
    ],
    metrics: [
      m("1", "сутки", "проверка по расписанию"),
      m("2", "формата", "список и таблица"),
      m("N", "ссылок", "в одном проекте"),
      m("2", "канала", "Telegram · email"),
    ],
    storySection: {
      eyebrow: "Как работает",
      title: "От списка ссылок до алерта",
      lead: "Добавили доноров → ежедневная проверка → статусы в таблице и оповещение при сбое.",
      midCta: {
        title: "Нужны проекты, история и оповещения?",
        lead: "В демо на странице — разовая проверка. В кабинете уже есть проект demo-shop.ru: таблица ссылок и сводка проблемных.",
      },
    },
    orbitSection: {
      eyebrow: "Рядом в кабинете",
      title: "С чем стыкуется отслеживание ссылок",
      lead: "После проверки доноров — HTTP-заголовки, мета-теги, позиции и доступность сайта.",
    },
    footerUi: {
      finalTitle: "Открыть отслеживание ссылок",
      finalLead: "Проекты, ежедневная проверка и оповещения — после регистрации.",
      faqTitle: "Частые вопросы про отслеживание ссылок",
    },
    orbit: orbit(ORBIT.http, ORBIT.meta, ORBIT.positions, ORBIT.siteMon),
    hubTitle: "Отслеживание ссылок",
    heroUi: { keysFooter: "донор · анкор", dynamicsFooter: "статус · алерт" },
  },

  "otslezhivanie-sroka-registratsii-domenov": {
    eyebrow: "Срок и DNS",
    headline: "Срок регистрации доменов — до просрочки, не после",
    cta: "Добавить домены",
    painGain: {
      painTitle: "Без единого списка доменов",
      pains: [
        "Сроки клиентов размазаны по кабинетам регистраторов",
        "О просрочке узнаёте, когда сайт или почта уже лежат",
        "Смену DNS после переезда замечаете случайно",
      ],
      gainTitle: "В Титло",
      gains: [
        "Список доменов: дата окончания и дни до продления",
        "Сводка: в порядке, требуют внимания, истекают ≤ 30 дней",
        "Telegram и email при смене срока или DNS",
      ],
    },
    acts: [
      act(
        "01",
        "Добавьте домены",
        "Один адрес или список. После сохранения проверка срока и DNS стартует сама.",
        DOMAIN_REG_SCREENSHOTS[2].src,
        DOMAIN_REG_SCREENSHOTS[2].caption,
        ["Домен или список", "Оповещения DNS", "Срок регистрации"]
      ),
      act(
        "02",
        "Смотрите сроки в таблице",
        "Дата окончания, DNS и сколько дней осталось — без захода в регистратор.",
        DOMAIN_REG_SCREENSHOTS[0].src,
        DOMAIN_REG_SCREENSHOTS[0].caption,
        ["Срок и DNS", "Последняя проверка", "Уведомления"]
      ),
      act(
        "03",
        "Ловите риски заранее",
        "Сводка: сколько доменов в порядке и какие истекают в ближайшие 30 дней.",
        DOMAIN_REG_SCREENSHOTS[1].src,
        DOMAIN_REG_SCREENSHOTS[1].caption,
        ["В порядке", "Требуют внимания", "≤ 30 дней"]
      ),
    ],
    metrics: [
      m("1", "сутки", "проверка по расписанию"),
      m("N", "доменов", "в одном списке"),
      m("30", "дней", "зона риска"),
      m("2", "канала", "Telegram · email"),
    ],
    storySection: {
      eyebrow: "Как работает",
      title: "От списка доменов до напоминания",
      lead: "Добавили домены → таблица со сроками → сводка рисков и оповещения до продления.",
      midCta: {
        title: "Нужны список, история и оповещения?",
        lead: "В демо на странице — разовая проверка одного домена. В кабинете уже есть titlo.ru и demo-shop.ru: сроки, DNS и сводка.",
      },
    },
    orbitSection: {
      eyebrow: "Рядом в кабинете",
      title: "С чем стыкуется срок регистрации",
      lead: "После срока домена — доступность сайта, HTTP-заголовки, ссылки и позиции.",
    },
    footerUi: {
      finalTitle: "Добавить домены в кабинете",
      finalLead: "Список, проверка раз в сутки и оповещения — после регистрации.",
      faqTitle: "Частые вопросы про срок регистрации доменов",
    },
    orbit: orbit(ORBIT.siteMon, ORBIT.http, ORBIT.links, ORBIT.positions),
    hubTitle: "Срок регистрации",
    heroUi: { keysFooter: "Домены · список", dynamicsFooter: "Срок · алерт" },
  },

  "analiz-teksta": {
    eyebrow: "Центр качества текста",
    headline: "Тошнота и вода — в цифрах",
    cta: "Проанализировать текст",
    painGain: {
      painTitle: "«Плохой текст» без метрик",
      pains: [
        "Тошнота и водность — на ощущениях редактора",
        "Нет единого листа для SEO и копирайта",
        "Сравнение с нормой ниши откладывается",
      ],
      gainTitle: "С анализом текста",
      gains: [
        "Статистика слов, знаков, предложений",
        "Показатели тошноты и заспамленности",
        "Список слов для правок перед публикацией",
      ],
    },
    acts: [
      act("01", "Вставьте материал", "Статья, описание товара или лендинг — целиком.", TEXT_ANAL_SCREENSHOTS[0]?.src ?? S0, "Текст на входе", ["Любой объём", "Без регистрации файла", "Мгновенный отчёт"]),
      act("02", "Изучите метрики", "Тошнота, вода, частотность — в одной панели.", TEXT_ANAL_SCREENSHOTS[4]?.src ?? S1, "Показатели", ["Слова · знаки", "Список лемм", "Пороги"], "65% top"),
      act("03", "Отдайте на правки", "Конкретные зоны риска — копирайтеру или в релевантность.", TEXT_ANAL_SCREENSHOTS[1]?.src ?? S1, "Правки", ["Уникальные слова", "Подсчёт длины", "Релевантность"]),
    ],
    metrics: [
      m("10+", "метрик", "тошнота · вода · Ципф"),
      m("3", "зоны", "текст · ссылки · вместе"),
      m("∞", "проверок", "в личном кабинете"),
      m("1", "лист", "для SEO и копирайта"),
    ],
    orbit: orbit(ORBIT.relevance, { label: "Подсчёт длины", href: "/podschet-dliny-teksta/", role: "Объём" }, { label: "Уникальные слова", href: "/vydelenie-unikalnykh-slov-v-tekste/", role: "Сверка" }, ORBIT.wordGen),
    hubTitle: "Анализ текста",
    heroUi: { keysFooter: "Текст · ввод", dynamicsFooter: "Метрики · список" },
  },

  "klasterizator-klyuchevykh-slov": {
    eyebrow: "Группировка ядра",
    headline: "Кластеры по выдаче — не по словам в Excel",
    cta: "Запустить кластеризацию",
    showSearchEngines: true,
    painGain: {
      painTitle: "Без парсинга ТОПа",
      pains: [
        "Тысячи фраз сортируют вручную неделями",
        "Связи по URL в выдаче не видны из таблицы",
        "Структура сайта отстаёт от реального ядра",
      ],
      gainTitle: "В Титло",
      gains: [
        "Группы по пересечению URL в выдаче — Soft / Hard",
        "Classic и pro, ручной редактор и релевантные URL",
        "CSV / XLS и проекты — сразу в работу и мониторинг",
      ],
    },
    acts: [
      act(
        "01",
        "Загрузите ядро",
        "Список из Wordstat, генератора или файла клиента — регион, Soft/Hard и режим classic или pro.",
        CLUSTER_SCREENSHOTS[0].src,
        CLUSTER_SCREENSHOTS[0].caption,
        ["Фразы построчно", "Soft / Hard", "Classic · Pro"]
      ),
      act(
        "02",
        "Смотрите кластеры",
        "Группы по пересечению URL в выдаче — сводка, таблица и выгрузка CSV / XLS.",
        CLUSTER_SCREENSHOTS[1].src,
        CLUSTER_SCREENSHOTS[1].caption,
        ["Сводка", "Таблица кластеров", "CSV · XLS"]
      ),
      act(
        "03",
        "Доработайте вручную",
        "Перенос фраз между группами, релевантные URL и структура под посадочные.",
        CLUSTER_SCREENSHOTS[2].src,
        CLUSTER_SCREENSHOTS[2].caption,
        ["Ручной редактор", "Релевантность URL", "Группы"]
      ),
    ],
    metrics: [
      m("2", "режима", "classic · pro"),
      m("ТОП", "выдача", "основа связей"),
      m("CSV", "· XLS", "экспорт кластеров"),
      m("Soft", "· Hard", "строгость групп"),
    ],
    storySection: {
      eyebrow: "Как работает",
      title: "От списка фраз до структуры сайта",
      lead: "Ядро и регион → парсинг ТОПа → кластеры. Дальше — ручная правка и выгрузка в ТЗ.",
      midCta: {
        title: "Нужны Hard, частотность и большие ядра?",
        lead: "В демо — до 10 фраз. В кабинете: проекты, частотность, конкуренты по фразам, CSV/XLS и ручной редактор.",
      },
    },
    orbitSection: {
      eyebrow: "Рядом в кабинете",
      title: "С чем стыкуется кластеризатор",
      lead: "После кластеров — генератор слов, конкуренты, релевантность и позиции по ключам.",
    },
    footerUi: {
      finalTitle: "Кластеризовать ядро в кабинете",
      finalLead: "Большие списки, Hard/Soft, проекты и экспорт — после регистрации.",
      faqTitle: "Частые вопросы про кластеризатор",
    },
    orbit: orbit(ORBIT.wordGen, ORBIT.competitors, ORBIT.relevance, ORBIT.positions),
    hubTitle: "Кластеризатор",
    heroUi: { keysFooter: "Ядро · регион", dynamicsFooter: "Кластеры · CSV" },
  },

  "audit-sajta": {
    eyebrow: "Технический и SEO-аудит",
    headline: "Аудит сайта: технические и SEO-ошибки в одном отчёте",
    cta: "Запустить проверку в кабинете",
    showSearchEngines: false,
    painGain: {
      painTitle: "Без единого аудита",
      pains: [
        "Ошибки ищут по частям в разных сервисах",
        "Клиенту непонятно, что чинить в первую очередь",
        "Повторную проверку сравнивать не с чем",
      ],
      gainTitle: "С аудитом Титло",
      gains: [
        "Одна проверка — техника и SEO вместе",
        "Сравнение с прошлой проверкой и отметка «исправлено»",
        "Ссылка на отчёт без входа в кабинет",
      ],
    },
    hubTitle: "Аудит",
    storySection: {
      eyebrow: "Как работает",
      title: "Как проходит проверка",
      lead: "Указали сайт — получили список ошибок по важности и отчёт для команды или клиента.",
    },
    metricSection: {
      eyebrow: "Цифры",
      title: "Лимиты и приоритеты",
      lead: "Сколько страниц можно обойти за проверку и как расставлены уровни ошибок.",
    },
    optionsSection: {
      eyebrow: "Чеклист",
      title: "Что входит в проверку",
      lead: "Кратко по пунктам. Ниже — то же самое развёрнуто по блокам.",
    },
    orbitSection: {
      eyebrow: "Рядом в кабинете",
      title: "С чем сочетается аудит",
      lead: "С мониторингом позиций, мета-тегами и проверкой доступности.",
    },
    heroUi: { keysFooter: "Сайт и лимит", dynamicsFooter: "Ошибки и ссылка" },
    footerUi: {
      finalTitle: "Запустить аудит сайта",
      finalLead: "Проверка домена и отчёты — в личном кабинете после регистрации.",
      faqTitle: "Частые вопросы про аудит сайта",
    },
    acts: [
      act(
        "01",
        "Сайт и лимит",
        "Укажите домен и сколько страниц обойти по тарифу. Sitemap и robots подхватываются сами.",
        SITE_AUDIT_SCREENSHOTS[0]?.src ?? S0,
        SITE_AUDIT_SCREENSHOTS[0]?.caption ?? "Сводка",
        ["Sitemap и robots", "До 50 000 страниц", "Очередь проверок"]
      ),
      act(
        "02",
        "Обход и приоритеты",
        "Сначала грубые ошибки, потом прочие, важные замечания, предупреждения и инфо — по страницам и кодам.",
        SITE_AUDIT_SCREENSHOTS[1]?.src ?? S1,
        SITE_AUDIT_SCREENSHOTS[1]?.caption ?? "Отчёт",
        ["Техника и SEO", "Список URL", "Код ошибки"]
      ),
      act(
        "03",
        "Отчёт и ссылка клиенту",
        "Сводка, сравнение с прошлой проверкой, «исправлено» и публичная ссылка на отчёт.",
        SITE_AUDIT_SCREENSHOTS[2]?.src ?? S1,
        SITE_AUDIT_SCREENSHOTS[2]?.caption ?? "Ссылка",
        ["Ссылка на отчёт", "Excel и Word", "Комментарии"]
      ),
    ],
    metrics: [
      m("50", "тыс.", "страниц за проверку на Максимуме"),
      m("5", "уровней", "от грубых ошибок до инфо"),
      m("100+", "проверок", "техника и SEO"),
      m("1", "ссылка", "отчёт клиенту без входа"),
    ],
  },

  "geo-lokalizaciya-kommerciya": {
    eyebrow: "Три метрики по фразе",
    headline: "Гео, локализация и коммерция — в одном прогоне",
    cta: "Проверить фразы в кабинете",
    showSearchEngines: true,
    hubTitle: "Гео и коммерция",
    painGain: {
      painTitle: "Без цифр по выдаче",
      pains: [
        "Геозависимость и коммерцию смотрят глазами по ТОПу — город за городом",
        "Региональные и федеральные фразы мешают в одном кластере",
        "Формат посадочной выбирают на глаз — до разбора конкурентов",
      ],
      gainTitle: "С проверкой в Титло",
      gains: [
        "Гео, локализация и коммерция за один прогон по списку фраз",
        "Сравнение двух регионов и фильтры по типу в таблице",
        "История и CSV — до типов сайтов и анализа конкурентов",
      ],
    },
    acts: [
      act(
        "01",
        "Укажите фразы и регион",
        "Список запросов, Яндекс или Google и город. Дальше сравниваем выдачу с контрольным регионом.",
        PHRASE_COMMERCE_SCREENSHOTS[0].src,
        PHRASE_COMMERCE_SCREENSHOTS[0].caption,
        ["До 200 фраз за прогон", "Яндекс и Google", "Сохранение в историю"]
      ),
      act(
        "02",
        "Смотрите сводку",
        "Сколько геозависимых и коммерческих, средняя локализация и коммерция — без ручного разбора ТОПа.",
        PHRASE_COMMERCE_SCREENSHOTS[1].src,
        PHRASE_COMMERCE_SCREENSHOTS[1].caption,
        ["Геозависимость", "Локализация", "Коммерция"]
      ),
      act(
        "03",
        "Разберите каждую фразу",
        "В строке — сходство городов, локализация и коммерческий срез. Фильтры и выгрузка — в кабинете.",
        PHRASE_COMMERCE_SCREENSHOTS[2].src,
        PHRASE_COMMERCE_SCREENSHOTS[2].caption,
        ["Фильтры по типу", "Копирование и CSV", "История проверок"]
      ),
    ],
    metrics: [
      m("Гео", "завис. / нет", "сравнение двух городов"),
      m("Локаль", "%", "доля местных в ТОПе"),
      m("Коммерция", "%", "магазины и услуги"),
      m("2", "региона", "основной и контрольный"),
    ],
    storySection: {
      eyebrow: "Как работает",
      title: "От фразы до решения по посадочной",
      lead: "Фразы и регионы → три метрики → понятно, нужна ли региональная страница и какой формат ближе к выдаче.",
    },
    orbitSection: {
      eyebrow: "Рядом в кабинете",
      title: "С чем стыкуется проверка фраз",
      lead: "После гео и коммерции — типы сайтов, конкуренты и релевантность без лишних прогонов.",
    },
    heroUi: { keysFooter: "Фразы · регион", dynamicsFooter: "Сводка · таблица" },
    footerUi: {
      finalTitle: "Проверить фразы в кабинете",
      finalLead: "Список фраз, обе ПС, регионы и история — после регистрации.",
      faqTitle: "Частые вопросы про гео и коммерцию фраз",
    },
    orbit: orbit(ORBIT.competitors, ORBIT.relevance, ORBIT.cluster, ORBIT.positions),
  },

  "tipy-saitov-v-vydache": {
    eyebrow: "Срез выдачи по типам",
    headline: "Типы сайтов в топе — кто занимает выдачу",
    cta: "Разобрать выдачу в кабинете",
    showSearchEngines: true,
    hubTitle: "Типы сайтов",
    painGain: {
      painTitle: "Без среза по типам",
      pains: [
        "ТОП открывают вручную — и всё равно спорят, «магазин это или контент»",
        "Формат посадочной выбирают на глаз до разбора конкурентов",
        "Нет короткого отчёта клиенту: доли агрегаторов, магазинов, контента",
      ],
      gainTitle: "В Титло",
      gains: [
        "Вердикт и доли девяти типов за один прогон",
        "Таблица: домен, тип и URL — с фильтром и CSV",
        "История проверок на платных тарифах",
      ],
    },
    acts: [
      act(
        "01",
        "Укажите фразы",
        "Список запросов, глубина ТОПа, Яндекс и/или Google и регион. В демо уже есть готовый разбор.",
        SITE_TYPES_SCREENSHOTS[0].src,
        SITE_TYPES_SCREENSHOTS[0].caption,
        ["Фразы", "ТОП-3…30", "Яндекс · Google"]
      ),
      act(
        "02",
        "Смотрите вердикт",
        "Коммерция / инфо / смесь и доли девяти типов — без ручного разбора ТОПа.",
        SITE_TYPES_SCREENSHOTS[1].src,
        SITE_TYPES_SCREENSHOTS[1].caption,
        ["Вердикт", "9 типов", "Доли %"]
      ),
      act(
        "03",
        "Разберите домены",
        "В строке — домен, тип и URL. Фильтр по типу и выгрузка CSV — в кабинете.",
        SITE_TYPES_SCREENSHOTS[2].src,
        SITE_TYPES_SCREENSHOTS[2].caption,
        ["Таблица выдачи", "Фильтр", "CSV"]
      ),
    ],
    metrics: [
      m("9", "типов", "от агрегаторов до контента"),
      m("2", "ПС", "Яндекс и Google"),
      m("до 30", "поз.", "глубина в кабинете"),
      m("1", "вердикт", "коммерция · инфо · смесь"),
    ],
    storySection: {
      eyebrow: "Как работает",
      title: "От фразы до вердикта по формату",
      lead: "Фразы и глубина → съём выдачи → вердикт, доли типов и таблица доменов.",
      midCta: {
        title: "Нужны список фраз, обе ПС и история?",
        lead: "В демо — одна фраза и готовый разбор. В кабинете — список фраз, Яндекс и Google, глубина до 30 и CSV.",
      },
    },
    orbitSection: {
      eyebrow: "Рядом в кабинете",
      title: "С чем стыкуется срез типов",
      lead: "После типов — гео и коммерция фраз, конкуренты, релевантность и позиции.",
    },
    footerUi: {
      finalTitle: "Разобрать выдачу в кабинете",
      finalLead: "Список фраз, обе ПС, глубина до 30, история и CSV — после регистрации.",
      faqTitle: "Частые вопросы про типы сайтов в выдаче",
    },
    orbit: orbit(
      { label: "Гео и коммерция", href: "/geo-lokalizaciya-kommerciya/", role: "Три метрики по фразе" },
      ORBIT.competitors,
      ORBIT.relevance,
      ORBIT.positions
    ),
    heroUi: { keysFooter: "Фразы · ПС", dynamicsFooter: "9 типов · вердикт" },
  },

  "zapisi-domena": {
    eyebrow: "Регистрация и DNS",
    headline: "Записи домена: срок, NS и соседи по IP",
    cta: "Проверить домен в кабинете",
    showSearchEngines: false,
    hubTitle: "Записи домена",
    painGain: {
      painTitle: "Без одной карточки",
      pains: [
        "WHOIS в одном сервисе, dig — в терминале, соседи по IP — в третьем окне",
        "После переноса хостинга непонятно, что реально сменилось",
        "Нет снимка «как было» для клиента или команды",
      ],
      gainTitle: "В Титло",
      gains: [
        "Срок, DNS и соседи по IP — одним запуском",
        "История снимков и сравнение «до / после»",
        "Из отчёта — в мониторинг срока или доступности",
      ],
    },
    storySection: {
      eyebrow: "Как работает",
      title: "От домена до карточки DNS",
      lead: "Один запуск — регистрация, DNS и IP. Сохраняете снимок и сравниваете «до / после» переноса.",
      midCta: {
        title: "Нужны история и полный список соседей?",
        lead: "В кабинете — все DNS-типы, полный список сайтов на IP, сравнение снимков и кнопки в мониторинг срока или доступности.",
      },
    },
    orbitSection: {
      eyebrow: "Рядом в кабинете",
      title: "С чем стыкуются записи домена",
      lead: "Из карточки — в срок регистрации или мониторинг доступности, без повторного ввода домена.",
    },
    footerUi: {
      finalTitle: "Проверить домен в кабинете",
      finalLead: "Полный DNS, соседи по IP, история и сравнение — после регистрации.",
      faqTitle: "Частые вопросы про записи домена",
    },
    heroUi: { keysFooter: "Домен", dynamicsFooter: "Срок · DNS · соседи" },
    acts: [
      act(
        "01",
        "Введите домен",
        "example.ru или URL страницы — модуль нормализует хост и снимает регистрацию с DNS одним запуском.",
        DOMAIN_RECORDS_SCREENSHOTS[0].src,
        DOMAIN_RECORDS_SCREENSHOTS[0].caption,
        ["WHOIS", "DNS A / MX / NS / TXT", "История"]
      ),
      act(
        "02",
        "Сводка, WHOIS и DNS",
        "Срок и дни до окончания, серверы имён, таблица записей с фильтром по типу — без ручного dig по каждому.",
        DOMAIN_RECORDS_SCREENSHOTS[1].src,
        DOMAIN_RECORDS_SCREENSHOTS[1].caption,
        ["Срок", "WHOIS", "DNS-таблица"]
      ),
      act(
        "03",
        "IP и соседи",
        "Кто ещё на том же адресе: список, «показать все» и выгрузка. Дальше — в мониторинг срока или доступности.",
        DOMAIN_RECORDS_SCREENSHOTS[2].src,
        DOMAIN_RECORDS_SCREENSHOTS[2].caption,
        ["Соседи по IP", "Скачать", "В мониторинг"]
      ),
    ],
    orbit: orbit(
      { label: "Срок регистрации", href: "/otslezhivanie-sroka-registratsii-domenov/", role: "Оповещения об истечении" },
      ORBIT.siteMon,
      ORBIT.http,
      { label: "Индексация", href: "/proverka-indeksacii/", role: "Есть ли в поиске" }
    ),
  },

  "sbor-poiskovykh-podskazok": {
    eyebrow: "Хвост из подсказок",
    headline: "Сбор поисковых подсказок Яндекс и Google",
    cta: "Собрать подсказки в кабинете",
    showSearchEngines: true,
    hubTitle: "Подсказки",
    painGain: {
      painTitle: "Без автосбора по алфавиту",
      pains: [
        "Буквы и цифры в строке поиска кликают вручную — и всё равно что-то пропускают",
        "Яндекс и Google снимают в разных вкладках, списки потом склеивают",
        "Нет истории сборов и готовой таблицы для кластеризатора",
      ],
      gainTitle: "В Титло",
      gains: [
        "Фразы, алфавит, пресеты и обе ПС — в одном запуске",
        "Таблица с уровнем, типом и числом слов — сразу к выгрузке",
        "История сборов на платных тарифах — без повторного клика по буквам",
      ],
    },
    acts: [
      act(
        "01",
        "Исходные фразы",
        "В кабинете — список исходных фраз. В демо — одна фраза, чтобы увидеть формат результата.",
        S0,
        "Исходные фразы для сбора подсказок",
        ["Список фраз", "1 фраза = 1 лимит", "Яндекс · Google"]
      ),
      act(
        "02",
        "ПС и режимы",
        "Яндекс и/или Google. Алфавит, цифры, пресеты «купить» / «рядом» / вопросы и стоп-слова — в кабинете.",
        S1,
        "Режимы сбора подсказок",
        ["Алфавит · цифры", "Пресеты", "Стоп-слова"]
      ),
      act(
        "03",
        "Сбор и таблица",
        "Подсказки с уровнем, типом и числом слов. При глубине 2+ найденные фразы снова идут в сбор.",
        S2,
        "Таблица подсказок и выгрузка",
        ["Уровень · тип", "Глубина 2–3", "CSV · история"]
      ),
    ],
    metrics: [
      m("2", "ПС", "Яндекс и Google"),
      m("А–Я", "алфавит", "кириллица · латиница · цифры"),
      m("2–3", "глубина", "подсказки из подсказок"),
      m("CSV", "выгрузка", "таблица для ядра и ТЗ"),
    ],
    storySection: {
      eyebrow: "Как работает",
      title: "От фразы до таблицы подсказок",
      lead: "Фразы и режимы → сбор по алфавиту и пресетам → таблица и выгрузка в кластеризатор.",
      midCta: {
        title: "Нужны алфавит, пресеты и история?",
        lead: "В демо — одна фраза и режим «фраза». В кабинете — список фраз, обе ПС, алфавит, пресеты, глубина и CSV.",
      },
    },
    orbitSection: {
      eyebrow: "Рядом в кабинете",
      title: "С чем стыкуется сбор подсказок",
      lead: "После хвоста — генератор слов, кластеризатор, конкуренты и релевантность.",
    },
    footerUi: {
      finalTitle: "Собрать подсказки в кабинете",
      finalLead: "Алфавит, пресеты, обе ПС, история и выгрузка — после регистрации.",
      faqTitle: "Частые вопросы про сбор поисковых подсказок",
    },
    orbit: orbit(ORBIT.wordGen, ORBIT.cluster, ORBIT.competitors, ORBIT.relevance),
    heroUi: { keysFooter: "Фраза · режимы", dynamicsFooter: "Таблица · CSV" },
  },

  "proverka-indeksacii": {
    eyebrow: "Центр индексации",
    headline: "Индексация и сниппеты Яндекс и Google",
    cta: "Проверить индексацию в кабинете",
    showSearchEngines: true,
    hubTitle: "Индексация",
    storySection: { title: "От списка URL до сниппетов" },
    heroUi: { keysFooter: "URL · ПС", dynamicsFooter: "Статус · сниппет" },
  },

  "proverka-teksta-esenin": {
    eyebrow: "Риск «Баден-Баден»",
    headline: "Проверка текста Есенин — риск до публикации",
    cta: "Проверить текст в кабинете",
    showSearchEngines: false,
    painGain: {
      painTitle: "Без разбора до публикации",
      pains: [
        "Переспам и штампы замечают уже после индексации",
        "Автору пишут «перепишите целиком» — без конкретных мест",
        "Частотность смотрят отдельно, риск переоптимизации — «на глаз»",
      ],
      gainTitle: "В Титло",
      gains: [
        "Шесть категорий риска с итоговым баллом и уровнем",
        "Подсветка в тексте и подсказки — правки прямо в отчёте",
        "HTML-редактор, задания и до 20 000 символов в кабинете",
      ],
    },
    acts: [
      act(
        "01",
        "Задание и текст",
        "Имя проверки, HTML-редактор или URL — черновик до 20 000 символов.",
        ESENIN_TEXT_CHECK_SCREENSHOTS[0].src,
        ESENIN_TEXT_CHECK_SCREENSHOTS[0].caption,
        ["Задание", "HTML · текст", "URL"]
      ),
      act(
        "02",
        "Подсветка проблем",
        "Цветом — риски в тексте, красный «!» — подсказка при наведении или клике.",
        ESENIN_TEXT_CHECK_SCREENSHOTS[1].src,
        ESENIN_TEXT_CHECK_SCREENSHOTS[1].caption,
        ["Повторы", "Стилистика", "Подсказки"]
      ),
      act(
        "03",
        "Отчёт по рискам",
        "Шесть вкладок, параметры справа и правки с повторной проверкой.",
        ESENIN_TEXT_CHECK_SCREENSHOTS[2].src,
        ESENIN_TEXT_CHECK_SCREENSHOTS[2].caption,
        ["6 категорий", "Параметры", "Проверить снова"]
      ),
    ],
    metrics: [
      m("6", "категорий", "риска в отчёте"),
      m("20 000", "символов", "за проверку"),
      m("3", "версии", "автосохранения"),
      m("1", "лимит", "за запуск"),
    ],
    storySection: {
      eyebrow: "Как работает",
      title: "От текста до правок по рискам",
      lead: "Вставили текст → увидели подсветку → правите и проверяете снова.",
      midCta: {
        title: "Посмотреть готовый разбор?",
        lead: "В демо кабинета уже есть текст про ремонт фасада — баллы, подсветка и параметры без нового запуска.",
      },
    },
    orbitSection: {
      eyebrow: "Рядом в кабинете",
      title: "С чем стыкуется проверка Есенин",
      lead: "После разбора текста — частотность, релевантность посадочной, вёрстка и мета-теги.",
    },
    footerUi: {
      finalTitle: "Проверить текст в кабинете",
      finalLead: "Сводный отчёт — в демо на сайте. Редактор, шесть вкладок и правки — после регистрации.",
      faqTitle: "Частые вопросы про проверку текста Есенин",
    },
    orbit: orbit(
      { label: "Анализ текста", href: "/analiz-teksta/", role: "Частотность и облака" },
      { label: "Релевантность", href: "/analiz-relevantnosti/", role: "Посадочная vs ТОП" },
      { label: "HTML-редактор", href: "/html-redaktor/", role: "Вёрстка текста" },
      { label: "Мета-теги", href: "/proverka-meta-tegov/", role: "Title · description" }
    ),
    hubTitle: "Есенин",
    heroUi: { keysFooter: "Текст · HTML", dynamicsFooter: "6 вкладок · балл" },
  },
};
