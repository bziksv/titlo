import { LK_URL } from "@/lib/site";

export const ESENIN_TEXT_CHECK_DEMO_MODULE = "proverka-teksta-esenin" as const;

export const ESENIN_TEXT_CHECK_DEMO_MAX_RUNS = 3;

export const ESENIN_TEXT_CHECK_DEMO_MAX_CHARS = 5000;

export const ESENIN_TEXT_CHECK_SAMPLE_TEXT = `Замена прокладки клапанной крышки Kia Rio — одна из типовых процедур при обслуживании мотора. Если вы заметили следы масла на двигателе или запах горелого масла под капотом, стоит проверить герметичность прокладки.

Мы подготовили пошаговую инструкцию: как снять крышку, очистить плоскость ГБЦ и установить новую прокладку без перекоса. Для Kia Rio подходят оригинальные и качественные аналоги — главное, не перетянуть болты и соблюдать момент затяжки.

Регулярная замена прокладки помогает избежать подсоса воздуха и падения компрессии. Если прокладка уже потрескалась, откладывать ремонт не стоит: масло может попасть на выхлоп и в зону ремня ГРМ.`;

export function buildEseninTextCheckRegisterUrl(): string {
  const u = new URL(`${LK_URL}/register`);
  u.searchParams.set("module", ESENIN_TEXT_CHECK_DEMO_MODULE);
  u.searchParams.set("from", "demo");
  return u.toString();
}

export const ESENIN_TEXT_CHECK_CABINET_FEATURES = [
  "До 20 000 символов за проверку и HTML-разметка",
  "Подсветка проблем по вкладкам: повторы, стилистика, запросы",
  "Редактор, правки в результатах и автосохранение до 3 версий",
  "Проверка текста и страницы по URL",
  "Лимиты: Бесплатный 5 · Оптимальный 200 · Ультимат 500 · Максимум 1000",
] as const;
