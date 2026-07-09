import { BASE_MODULE_PAGES, isLabModuleSlug } from "./modules";

export type ServiceItem = { href: string; title: string; description: string };

/** Краткое описание блока на /services/ — только SEO-модули, без «Компания» и «Тарифы». */
export const SERVICES_INTRO =
  "SEO-модули платформы Титло: на каждой странице — описание и демо. Полный доступ — в личном кабинете после регистрации.";

/** Карточки модулей для каталога /services/ (источник — modules.ts, без LAB *-v2/*-v3). */
export const SERVICE_ITEMS: ServiceItem[] = BASE_MODULE_PAGES.filter(
  (module) => !isLabModuleSlug(module.slug),
).map((module) => ({
  href: module.path,
  title: module.title,
  description: module.description || module.lead,
}));
