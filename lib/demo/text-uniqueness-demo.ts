import { LK_URL } from "@/lib/site";

export const TEXT_UNIQUENESS_DEMO_MODULE = "proverka-unikalnosti-teksta" as const;

export const TEXT_UNIQUENESS_DEMO_MAX_RUNS = 5;

export const TEXT_UNIQUENESS_SAMPLE_URL = "https://titlo.ru/about/";

export const TEXT_UNIQUENESS_SAMPLE_TEXT =
  "Сервис базируется в городе Воронеж и начало свою работу в 2015 году. Проверка уникальности сравнивает фрагменты текста со страницей и показывает совпадения.";

export function buildTextUniquenessRegisterUrl(): string {
  const u = new URL(`${LK_URL}/register`);
  u.searchParams.set("module", TEXT_UNIQUENESS_DEMO_MODULE);
  u.searchParams.set("from", "demo");
  return u.toString();
}

export const TEXT_UNIQUENESS_CABINET_FEATURES = [
  "Поиск совпадений по выдаче, а не только с одним URL",
  "Сравнение сразу с несколькими страницами",
  "Источники, доля пересечения и совпавшие фрагменты",
  "История проверок на платных тарифах",
  "Лимиты: Бесплатный 3 / 0 · Оптимальный 300 / 10 · Ультимат 1 500 / 20 · Максимум 2 400 / 50",
] as const;
