import { LK_URL } from "@/lib/site";

export const UNIQUE_WORDS_DEMO_MODULE = "vydelenie-unikalnykh-slov-v-tekste" as const;

/** Лимит символов в демо (единственное ограничение) */
export const UNIQUE_WORDS_DEMO_MAX_CHARS = 3_000;

export type UniqueWordsRow = {
  word: string;
  wordForms: string;
  count: number;
  keyPhrases: string;
};

export type UniqueWordsMetrics = {
  phrases: number;
  uniqueWords: number;
  totalOccurrences: number;
};

export type UniqueWordsDemoResult = {
  result: {
    rows: UniqueWordsRow[];
    metrics: UniqueWordsMetrics;
  };
  upgrade: {
    register_url: string;
    max_chars: number;
  };
};

export function buildUniqueWordsRegisterUrl(): string {
  const u = new URL(`${LK_URL}/register`);
  u.searchParams.set("module", UNIQUE_WORDS_DEMO_MODULE);
  u.searchParams.set("from", "demo");
  return u.toString();
}

export function validateUniqueWordsContent(text: string): string | null {
  if (!text.trim()) {
    return "Вставьте список ключевых фраз.";
  }
  if (text.length > UNIQUE_WORDS_DEMO_MAX_CHARS) {
    return `В демо до ${UNIQUE_WORDS_DEMO_MAX_CHARS.toLocaleString("ru-RU")} символов. В кабинете — без лимита.`;
  }
  return null;
}

export function countNonEmptyLines(text: string): number {
  return text.split(/[\r\n]+/).filter((line) => line.trim() !== "").length;
}
