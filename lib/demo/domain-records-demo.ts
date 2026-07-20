import { LK_URL } from "@/lib/site";

export const DOMAIN_RECORDS_DEMO_MODULE = "zapisi-domena" as const;

export const DOMAIN_RECORDS_DEMO_MAX_RUNS = 5;

export const DOMAIN_RECORDS_SAMPLE_DOMAIN = "titlo.ru";

export function buildDomainRecordsRegisterUrl(): string {
  const u = new URL(`${LK_URL}/register`);
  u.searchParams.set("module", DOMAIN_RECORDS_DEMO_MODULE);
  u.searchParams.set("from", "demo");
  return u.toString();
}

export const DOMAIN_RECORDS_CABINET_FEATURES = [
  "В кабинете: полная карточка регистрации и все типы DNS",
  "В кабинете: соседи по адресу без усечения списка",
  "В кабинете: история снимков и сравнение двух проверок",
  "В кабинете: добавить в мониторинг сайтов или срок регистрации",
  "В кабинете лимиты — проверки / сохранения: Бесплатный 20 / 5 · Оптимальный 600 / 30 · Ультимат 2 000 / 50 · Максимум 5 000 / 100",
] as const;

export const DOMAIN_RECORDS_DEMO_FEATURES = [
  "Статус и срок регистрации",
  "Сводка DNS (число записей)",
  "Адрес и часть соседей",
  "1 домен · 5 проверок в сутки",
] as const;
