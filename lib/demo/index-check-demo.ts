import { LK_URL } from "@/lib/site";

export const INDEX_CHECK_DEMO_MODULE = "proverka-indeksacii" as const;

export const INDEX_CHECK_DEMO_MAX_RUNS = 5;

export const INDEX_CHECK_SAMPLE_URL = "https://titlo.ru/";

export function buildIndexCheckRegisterUrl(): string {
  const u = new URL(`${LK_URL}/register`);
  u.searchParams.set("module", INDEX_CHECK_DEMO_MODULE);
  u.searchParams.set("from", "demo");
  return u.toString();
}

export const INDEX_CHECK_CABINET_FEATURES = [
  "Пакет до 500 URL — Яндекс и Google в одной таблице",
  "Сохранение title и сниппета из выдачи для анализа",
  "Выбор домена Google (google.ru, .com и др.)",
  "Опция объединения www/http/https",
  "CSV-выгрузка с title и сниппетами",
  "Лимиты: Бесплатный 5 · Оптимальный 30 · Ультимат 50 · Максимум 100",
] as const;

export const INDEX_CHECK_GOOGLE_DOMAINS = [
  "google.ru",
  "google.com",
  "google.com.ua",
  "google.by",
  "google.kz",
] as const;
