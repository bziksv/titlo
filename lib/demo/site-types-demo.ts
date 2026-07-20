import { LK_URL } from "@/lib/site";

export const SITE_TYPES_DEMO_MODULE = "tipy-saitov-v-vydache" as const;

export const SITE_TYPES_DEMO_MAX_RUNS = 2;

export const SITE_TYPES_SAMPLE_PHRASE = "купить диван москва";

export function buildSiteTypesRegisterUrl(): string {
  const u = new URL(`${LK_URL}/register`);
  u.searchParams.set("module", SITE_TYPES_DEMO_MODULE);
  u.searchParams.set("from", "demo");
  return u.toString();
}

export const SITE_TYPES_CABINET_FEATURES = [
  "В кабинете: список фраз и обе поисковые системы в одном запуске",
  "В кабинете: глубина до 30 позиций, регионы, свои списки доменов",
  "В кабинете: матрица по фразам, частые хосты, история и выгрузка",
  "В кабинете лимиты — проверки / сохранения: Бесплатный 3 / 0 · Оптимальный 300 / 10 · Ультимат 1 500 / 20 · Максимум 2 400 / 50",
] as const;

export const SITE_TYPES_DEMO_FEATURES = [
  "1 фраза · 1 поисковая система",
  "Глубина 10 позиций",
  "Вердикт и доли типов",
  "До 2 проверок в сутки",
] as const;
