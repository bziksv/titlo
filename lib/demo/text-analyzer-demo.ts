import type { TextAnalyzerDemoResult, TextAnalyzerDemoRunBody } from "@/lib/demo/types";
import { LK_URL } from "@/lib/site";

export const TEXT_ANALYZER_DEMO_MODULE = "analiz-teksta" as const;

export const DEMO_MAX_CHARS = 3000;
export const DEMO_MIN_CHARS = 100;
export const FULL_MAX_CHARS = 38_600;
export const DEMO_MAX_RUNS_PER_DAY = 5;

export function buildRegisterUrl(guestId?: string): string {
  const u = new URL(`${LK_URL}/register`);
  u.searchParams.set("module", TEXT_ANALYZER_DEMO_MODULE);
  u.searchParams.set("from", "demo");
  if (guestId) u.searchParams.set("guest", guestId);
  return u.toString();
}

function isValidHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateTextAnalyzerDemoBody(
  body: unknown
): { ok: true; data: TextAnalyzerDemoRunBody } | { ok: false; message: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, message: "Неверное тело запроса" };
  }

  const raw = body as TextAnalyzerDemoRunBody;
  const mode = raw.mode === "url" ? "url" : "text";

  if (mode === "url") {
    const url = typeof raw.url === "string" ? raw.url.trim() : "";
    if (!url) {
      return { ok: false, message: "Укажите URL страницы для анализа" };
    }
    if (!isValidHttpUrl(url)) {
      return { ok: false, message: "URL страницы должен быть корректным" };
    }
  } else {
    const text = typeof raw.text === "string" ? raw.text : "";
    if (!text.trim()) {
      return { ok: false, message: "Вставьте текст для анализа" };
    }
    if (text.length < DEMO_MIN_CHARS) {
      return {
        ok: false,
        message: `В демо минимум ${DEMO_MIN_CHARS} символов (в кабинете — от 200).`,
      };
    }
    if (text.length > DEMO_MAX_CHARS) {
      return {
        ok: false,
        message: `В демо до ${DEMO_MAX_CHARS.toLocaleString("ru-RU")} символов. Полный лимит ${FULL_MAX_CHARS.toLocaleString("ru-RU")} — в кабинете.`,
      };
    }
  }

  if (raw.exclude_stop_words !== undefined && typeof raw.exclude_stop_words !== "boolean") {
    return { ok: false, message: "Поле exclude_stop_words должно быть boolean" };
  }
  if (raw.no_index !== undefined && typeof raw.no_index !== "boolean") {
    return { ok: false, message: "Поле no_index должно быть boolean" };
  }
  if (raw.hidden_text !== undefined && typeof raw.hidden_text !== "boolean") {
    return { ok: false, message: "Поле hidden_text должно быть boolean" };
  }
  if (raw.compare_competitor !== undefined && typeof raw.compare_competitor !== "boolean") {
    return { ok: false, message: "Поле compare_competitor должно быть boolean" };
  }

  const competitorUrl = typeof raw.competitor_url === "string" ? raw.competitor_url.trim() : "";
  if (raw.compare_competitor) {
    if (!competitorUrl) {
      return { ok: false, message: "Укажите URL страницы конкурента" };
    }
    if (!isValidHttpUrl(competitorUrl)) {
      return { ok: false, message: "URL конкурента должен быть корректным" };
    }
    if (mode === "url") {
      const pageUrl = typeof raw.url === "string" ? raw.url.trim() : "";
      if (pageUrl && pageUrl.replace(/\/$/, "") === competitorUrl.replace(/\/$/, "")) {
        return { ok: false, message: "URL конкурента должен отличаться от URL вашей страницы" };
      }
    }
  }

  return {
    ok: true,
    data: {
      mode,
      text: mode === "text" ? raw.text : undefined,
      url: mode === "url" ? raw.url?.trim() : undefined,
      exclude_stop_words: raw.exclude_stop_words,
      no_index: raw.no_index,
      hidden_text: raw.hidden_text,
      compare_competitor: raw.compare_competitor,
      competitor_url: competitorUrl || undefined,
    },
  };
}
