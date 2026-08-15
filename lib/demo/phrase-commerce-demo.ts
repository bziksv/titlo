import { LK_URL } from "@/lib/site";

export const PHRASE_COMMERCE_DEMO_MODULE = "geo-lokalizaciya-kommerciya" as const;

export const PHRASE_COMMERCE_DEMO_MAX_RUNS = 2;

export const PHRASE_COMMERCE_SAMPLE_PHRASE = "купить диван москва";

export function buildPhraseCommerceRegisterUrl(): string {
  const u = new URL(`${LK_URL}/register`);
  u.searchParams.set("module", PHRASE_COMMERCE_DEMO_MODULE);
  u.searchParams.set("from", "demo");
  return u.toString();
}

export const PHRASE_COMMERCE_CABINET_FEATURES = [
  "Список фраз и обе поисковые системы в одном запуске",
  "Выбор основного и контрольного региона",
  "Полная глубина ТОПа, история проверок и выгрузка CSV",
  "Лимиты проверок / сохранений: Бесплатный 3 / 0 · Оптимальный 300 / 10 · Ультимат 1 500 / 20 · Максимум 2 400 / 50",
] as const;

export const PHRASE_COMMERCE_DEMO_FEATURES = [
  "1 фраза · 1 поисковая система",
  "Гео + локализация + коммерция",
  "Глубина 10 · два региона",
  "До 2 проверок в сутки",
] as const;
