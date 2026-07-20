import { LK_URL } from "@/lib/site";

export const SEARCH_SUGGESTIONS_DEMO_MODULE = "sbor-poiskovykh-podskazok" as const;

export const SEARCH_SUGGESTIONS_DEMO_MAX_RUNS = 2;

export const SEARCH_SUGGESTIONS_SAMPLE_SEED = "ремонт фасада";

export function buildSearchSuggestionsRegisterUrl(): string {
  const u = new URL(`${LK_URL}/register`);
  u.searchParams.set("module", SEARCH_SUGGESTIONS_DEMO_MODULE);
  u.searchParams.set("from", "demo");
  return u.toString();
}

export const SEARCH_SUGGESTIONS_CABINET_FEATURES = [
  "В кабинете: список фраз, Яндекс и Google в одном запуске",
  "В кабинете: режимы «фраза», пробел, русский/английский алфавит, цифры",
  "В кабинете: пресеты «рядом», «купить», вопросы, отзывы",
  "В кабинете: стоп-слова, глубина сбора 2–3, регионы, история и выгрузка таблицы",
  "В кабинете лимиты — проверки / сохранения: Бесплатный 3 / 0 · Оптимальный 300 / 10 · Ультимат 1 500 / 20 · Максимум 2 400 / 50",
] as const;

/** Что реально есть в демо-отчёте (не путать с кабинетом). */
export const SEARCH_SUGGESTIONS_DEMO_FEATURES = [
  "1 исходная фраза",
  "1 поисковая система на запуск",
  "Только режим «фраза»",
  "До 20 подсказок в таблице",
] as const;
