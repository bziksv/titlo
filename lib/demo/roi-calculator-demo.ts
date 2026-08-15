import { LK_URL } from "@/lib/site";

export const ROI_CALC_DEMO_MODULE = "kalkulyator-roi" as const;

export function buildRoiCalcRegisterUrl(): string {
  const u = new URL(`${LK_URL}/register`);
  u.searchParams.set("module", ROI_CALC_DEMO_MODULE);
  u.searchParams.set("from", "demo");
  return u.toString();
}

export function buildRoiCalcCabinetUrl(): string {
  return `${LK_URL}/roi-calculator`;
}

export function buildRoiCalcIdeasUrl(): string {
  return `${LK_URL}/ideas`;
}

export const ROI_CALC_CABINET_FEATURES = [
  "В кабинете: тот же ROI и прогноз трафика",
  "В кабинете: UTM, генератор слов, анализ конкурентов",
  "В кабинете: мониторинг позиций, мета-тегов и доступности",
  "В кабинете: SEO и маркетинг в одном доступе",
] as const;

export const ROI_CALC_UPGRADE_HINT =
  "Зарегистрируйтесь бесплатно — калькулятор ROI рядом с UTM, семантикой и мониторингом, без зоопарка подписок.";
