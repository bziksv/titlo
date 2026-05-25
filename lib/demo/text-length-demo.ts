import {
  analyzeTextExtended,
  analyzeTextSeo,
  analyzeTextSummary,
} from "@/lib/demo/text-length-analyze";
import type { TextLengthDemoResult, TextLengthDemoRunBody } from "@/lib/demo/types";
import { LK_URL } from "@/lib/site";

export const TEXT_LENGTH_DEMO_MODULE = "podschet-dliny-teksta" as const;

/** Лимит ввода в демо на маркетинге */
export const DEMO_MAX_CHARS = 2000;

/** Полный лимит в кабинете (из контента лендинга) */
export const FULL_MAX_CHARS = 38_600;

export const DEMO_MAX_RUNS_PER_DAY = 5;

export function buildRegisterUrl(guestId?: string): string {
  const u = new URL(`${LK_URL}/register`);
  u.searchParams.set("module", TEXT_LENGTH_DEMO_MODULE);
  u.searchParams.set("from", "demo");
  if (guestId) u.searchParams.set("guest", guestId);
  return u.toString();
}

export function buildTextLengthDemoResponse(
  body: TextLengthDemoRunBody,
  remaining: number,
  guestId?: string
): TextLengthDemoResult {
  const summary = analyzeTextSummary(body.text);
  const seo = analyzeTextSeo(body);
  const extended = analyzeTextExtended(body.text);

  return {
    demo: true,
    module: TEXT_LENGTH_DEMO_MODULE,
    remaining,
    limits: {
      max_chars: DEMO_MAX_CHARS,
      max_runs_per_day: DEMO_MAX_RUNS_PER_DAY,
      full_max_chars: FULL_MAX_CHARS,
    },
    result: {
      summary,
      seo,
      extended,
      locked: [],
    },
    upgrade: {
      register_url: buildRegisterUrl(guestId),
      login_url: `${LK_URL}/login`,
    },
  };
}

export function validateTextLengthDemoBody(
  body: unknown
): { ok: true; data: TextLengthDemoRunBody } | { ok: false; message: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, message: "Неверное тело запроса" };
  }
  const { text, title, description, h1 } = body as TextLengthDemoRunBody;
  if (typeof text !== "string") {
    return { ok: false, message: "Поле text обязательно" };
  }
  if (!text.trim()) {
    return { ok: false, message: "Вставьте текст для подсчёта" };
  }
  if (text.length > DEMO_MAX_CHARS) {
    return {
      ok: false,
      message: `В демо до ${DEMO_MAX_CHARS.toLocaleString("ru-RU")} символов. Полный лимит ${FULL_MAX_CHARS.toLocaleString("ru-RU")} — в кабинете.`,
    };
  }
  const optional = { title, description, h1 };
  for (const [key, val] of Object.entries(optional)) {
    if (val !== undefined && typeof val !== "string") {
      return { ok: false, message: `Поле ${key} должно быть строкой` };
    }
  }
  return { ok: true, data: { text, title, description, h1 } };
}
