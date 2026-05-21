export const LK_URL = process.env.NEXT_PUBLIC_LK_URL ?? "https://lk.redbox.su";

/** Бренд после ребрендинга RedBox → Датагон */
export const SITE = {
  name: "Датагон",
  nameLatin: "Datagon",
  title: "Инструменты для SEO специалиста | Датагон",
  description:
    "Платформа Датагон для анализа и отслеживания сайта. Мониторинг, релевантность, позиции и другие инструменты для SEO и маркетинга.",
  phone: "+7-960-134-03-03",
  email: "info@redbox.su",
  supportHours: "Пн–Пт, 9:30–19:00",
  siteUrl: "https://redbox.su",
  /** Первый год в подвале: © {since} – {текущий} */
  copyrightSince: 2023,
} as const;

/** © 2023 – 2026 Датагон (конечный год — из текущей даты) */
export function getCopyrightText(name: string = SITE.name): string {
  const year = new Date().getFullYear();
  const since = SITE.copyrightSince;
  const years = year > since ? `${since} – ${year}` : String(year);
  return `© ${years} ${name}`;
}

export type NavLink = { href: string; label: string; badge?: string };

export const NAV_COMPANY: NavLink[] = [
  { href: "/about/", label: "О компании" },
  { href: "/news/", label: "Новости" },
];

export const NAV_MODULES: NavLink[] = [
  { href: "/analiz-relevantnosti/", label: "Анализ релевантности" },
  { href: "/analiz-konkurentov/", label: "Анализ конкурентов" },
  { href: "/monitoring-pozicii-sayta/", label: "Мониторинг позиций сайта" },
  {
    href: "/monitoring-pozicii-v2/",
    label: "Мониторинг позиций сайта",
    badge: "NEW",
  },
  { href: "/monitoring-saytov/", label: "Мониторинг корректной работы сайтов" },
  { href: "/proverka-meta-tegov-online/", label: "Мониторинг мета-тегов" },
  { href: "/generator_slov/", label: "Генератор слов" },
  { href: "/podschet-dliny-teksta/", label: "Подсчет длины текста" },
  { href: "/generator-paroley/", label: "Генератор паролей" },
  { href: "/sravnenie-spiskov-klyuchevykh-fraz/", label: "Сравнение списков ключевых фраз" },
  { href: "/udalenie-dublikatov/", label: "Удаление дубликатов" },
  { href: "/utm-metki/", label: "UTM метки" },
  { href: "/kalkulyator-roi/", label: "Калькулятор ROI" },
  { href: "/http-headers/", label: "HTTP headers" },
  { href: "/html-redaktor/", label: "HTML-редактор" },
  { href: "/vydelenie-unikalnykh-slov-v-tekste/", label: "Выделение уникальных слов в тексте" },
  { href: "/otslezhivanie-ssylok/", label: "Отслеживание ссылок" },
  { href: "/otslezhivanie-sroka-registratsii-domenov/", label: "Отслеживание срока регистрации доменов" },
  { href: "/analiz-teksta/", label: "Анализ текста" },
  { href: "/klasterizator-klyuchevykh-slov/", label: "Кластеризатор ключевых слов" },
];

export const HOME_MODULES = [
  {
    href: "/analiz-relevantnosti/",
    title: "Анализ релевантности страницы",
    description:
      'С помощью модуля «Анализ релевантности» вы узнаете, каких слов не хватает на странице (или вы переспамили ключами), чтобы попасть в ТОП-10.',
  },
  {
    href: "/analiz-teksta/",
    title: "Анализ текста",
    description:
      "Сервис поможет повысить качество и информативность материала для продвижения в поиске.",
  },
  {
    href: "/analiz-konkurentov/",
    title: "Анализ конкурентов по ключевым словам",
    description:
      "Определение топ сайтов по вашим фразам, анализ вложенности страницы, тегов и др.",
  },
  {
    href: "/klasterizator-klyuchevykh-slov/",
    title: "Кластеризатор ключевых слов",
    description: "Автоматическая кластеризация большого семантического ядра.",
  },
  {
    href: "/monitoring-pozicii-sayta/",
    title: "Мониторинг позиций сайта",
    description: "Быстрая проверка позиций по ключевым запросам в Яндекс и Google.",
  },
  {
    href: "/proverka-meta-tegov-online/",
    title: "Мониторинг мета-тегов",
    description: "Бесплатный онлайн-сервис для мониторинга мета-тегов.",
  },
  {
    href: "/monitoring-saytov/",
    title: "Мониторинг сайтов",
    description: "Отслеживание корректной работы сайта или страниц.",
  },
  {
    href: "/otslezhivanie-ssylok/",
    title: "Отслеживание ссылок",
    description:
      "Ежедневная проверка ссылки на странице; уведомление, если ссылка исчезла или условия не выполняются.",
  },
] as const;
