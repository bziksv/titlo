import { countNonEmptyLines, processDedupList, type DedupProcessOptions } from "@/lib/demo/dedup-process";
import type { DedupDemoResult, DedupDemoRunBody } from "@/lib/demo/types";
import { LK_URL } from "@/lib/site";

export const DEDUP_DEMO_MODULE = "udalenie-dublikatov" as const;

/** Лимит в демо на маркетинге */
export const DEMO_MAX_CHARS = 20_000;

export const DEMO_MAX_LINES = 1_000;

export const DEMO_MAX_RUNS_PER_DAY = 10;

/** Опции, доступные в демо (остальное — только кабинет) */
export const DEMO_ALLOWED_OPTIONS: (keyof DedupProcessOptions)[] = [
  "removeExtraSpace",
  "trim",
  "replaceTabWithSpace",
  "removeEmptyRows",
  "lowerCase",
  "removeDuplicates",
  "replaceUmlaut",
];

export const DEMO_LOCKED_FEATURES = [
  "case_insensitive",
  "sort",
  "char_filters",
  "presets",
  "compare",
  "file_upload",
  "unlimited",
] as const;

export function buildRegisterUrl(guestId?: string): string {
  const u = new URL(`${LK_URL}/register`);
  u.searchParams.set("module", DEDUP_DEMO_MODULE);
  u.searchParams.set("from", "demo");
  if (guestId) u.searchParams.set("guest", guestId);
  return u.toString();
}

function pickDemoOptions(body: DedupDemoRunBody): DedupProcessOptions {
  const o = body.options ?? {};
  return {
    removeExtraSpace: !!o.removeExtraSpace,
    trim: !!o.trim,
    replaceTabWithSpace: !!o.replaceTabWithSpace,
    removeEmptyRows: !!o.removeEmptyRows,
    lowerCase: !!o.lowerCase,
    removeDuplicates: o.removeDuplicates !== false,
    replaceUmlaut: !!o.replaceUmlaut,
  };
}

export function buildDedupDemoResponse(
  body: DedupDemoRunBody,
  remaining: number,
  guestId?: string
): DedupDemoResult {
  const options = pickDemoOptions(body);
  const { text, metrics } = processDedupList(body.text, options);

  return {
    demo: true,
    module: DEDUP_DEMO_MODULE,
    remaining,
    limits: {
      max_chars: DEMO_MAX_CHARS,
      max_lines: DEMO_MAX_LINES,
      max_runs_per_day: DEMO_MAX_RUNS_PER_DAY,
    },
    result: {
      text,
      metrics,
      locked: [...DEMO_LOCKED_FEATURES],
    },
    upgrade: {
      register_url: buildRegisterUrl(guestId),
      login_url: `${LK_URL}/login`,
    },
  };
}

export function validateDedupDemoBody(
  body: unknown
): { ok: true; data: DedupDemoRunBody } | { ok: false; message: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, message: "Неверное тело запроса" };
  }

  const { text, options } = body as DedupDemoRunBody;
  if (typeof text !== "string") {
    return { ok: false, message: "Поле text обязательно" };
  }
  if (!text.trim()) {
    return { ok: false, message: "Вставьте список для обработки" };
  }
  if (text.length > DEMO_MAX_CHARS) {
    return {
      ok: false,
      message: `В демо до ${DEMO_MAX_CHARS.toLocaleString("ru-RU")} символов. В кабинете — без этого лимита.`,
    };
  }

  const lines = text.split(/[\r\n]+/).filter((l) => l.trim() !== "").length;
  if (lines > DEMO_MAX_LINES) {
    return {
      ok: false,
      message: `В демо до ${DEMO_MAX_LINES.toLocaleString("ru-RU")} непустых строк. В кабинете — больше.`,
    };
  }

  if (options && typeof options === "object") {
    const blocked = ["caseInsensitiveDedup", "sortAlphabetically", "removeStartingChars", "removeEndingChars"] as const;
    for (const key of blocked) {
      if ((options as Record<string, unknown>)[key]) {
        return { ok: false, message: "Эта опция доступна в личном кабинете после регистрации." };
      }
    }
  }

  return { ok: true, data: { text, options } };
}

export function countLinesForDisplay(text: string): number {
  return countNonEmptyLines(text);
}
