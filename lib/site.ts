export const LK_URL = process.env.NEXT_PUBLIC_LK_URL ?? "https://cabinet.titlo.ru";

/** Бренд после ребрендинга RedBox → Датагон */
export const SITE = {
  name: "Датагон",
  nameLatin: "Datagon",
  title: "Инструменты для SEO специалиста | Датагон",
  description:
    "Платформа Датагон для анализа и отслеживания сайта. Мониторинг, релевантность, позиции и другие инструменты для SEO и маркетинга.",
  phone: "+7-960-134-03-03",
  email: "info@titlo.ru",
  supportHours: "Пн–Пт, 9:30–19:00",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://titlo.ru",
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

import { buildModuleNavLinks } from "@/lib/nav-modules";

export type NavLink = { href: string; label: string; badge?: string };

export const NAV_COMPANY: NavLink[] = [
  { href: "/about/", label: "О компании" },
  { href: "/news/", label: "Новости" },
];

/** Только публичные URL модулей; *-v1 / *-v2 / *-v3 в меню нет */
export const NAV_MODULES: NavLink[] = buildModuleNavLinks();

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
