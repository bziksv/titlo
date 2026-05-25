import { LK_URL } from "@/lib/site";

export const LIST_COMPARE_DEMO_MODULE = "sravnenie-spiskov-klyuchevykh-fraz" as const;

/** Лимит символов в каждом списке (единственное ограничение демо) */
export const LIST_COMPARE_DEMO_MAX_CHARS = 3_000;

export function buildListCompareRegisterUrl(): string {
  const u = new URL(`${LK_URL}/register`);
  u.searchParams.set("module", LIST_COMPARE_DEMO_MODULE);
  u.searchParams.set("from", "demo");
  return u.toString();
}

export function validateListLength(text: string, label: string): string | null {
  if (text.length > LIST_COMPARE_DEMO_MAX_CHARS) {
    return `${label}: в демо до ${LIST_COMPARE_DEMO_MAX_CHARS.toLocaleString("ru-RU")} символов. В кабинете — без лимита.`;
  }
  return null;
}
