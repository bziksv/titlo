import { LK_URL } from "@/lib/site";

export const KEYWORD_GEN_DEMO_MODULE = "generator_slov" as const;

export function buildKeywordGenRegisterUrl(): string {
  const u = new URL(`${LK_URL}/register`);
  u.searchParams.set("module", KEYWORD_GEN_DEMO_MODULE);
  u.searchParams.set("from", "demo");
  return u.toString();
}

export function buildKeywordGenCabinetUrl(): string {
  return `${LK_URL}/keyword-generator`;
}

export function buildKeywordGenIdeasUrl(): string {
  return `${LK_URL}/ideas`;
}

export const KEYWORD_GEN_CABINET_FEATURES = [
  "До 5 списков слов, операторы «» и [], стоп-слова «+», разбивка по длине фразы",
  "Сохранение и копирование результата",
  "Связка с кластеризатором, анализом конкурентов и другими SEO-модулями",
] as const;

export const KEYWORD_GEN_UPGRADE_HINT =
  "После регистрации — полный комбинатор в кабинете и соседние SEO-модули.";
