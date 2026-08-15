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
  "В кабинете: полный список соседей по IP",
  "В кабинете: история снимков и сравнение двух проверок",
  "В кабинете: добавить в мониторинг сайтов или срок регистрации",
  "В кабинете лимиты — проверки / сохранения: Бесплатный 20 / 5 · Оптимальный 600 / 30 · Ультимат 2 000 / 50 · Максимум 5 000 / 100",
] as const;

export const DOMAIN_RECORDS_DEMO_FEATURES = [
  "Статус и срок регистрации",
  "Сводка DNS (число записей)",
  "IP и часть соседей",
  "1 домен · 5 проверок в сутки",
] as const;

/** Блок «После регистрации» на v2-лендинге */
export const DOMAIN_RECORDS_POST_REG = {
  eyebrow: "В кабинете",
  title: "История снимков и соседние модули",
  lead: "Полный DNS и список соседей, сравнение прогонов и переход в мониторинг — в одном кабинете.",
  items: [
    {
      title: "Сравнение «до / после»",
      text: "Два снимка рядом: что сменилось в IP, NS и DNS после переноса или смены почты.",
    },
    {
      title: "В мониторинг из отчёта",
      text: "Добавить домен в срок регистрации или мониторинг доступности — без повторного ввода.",
    },
    {
      title: "Парк доменов",
      text: "История проверок по клиентам и проектам — не теряете прошлые карточки.",
    },
  ],
} as const;
