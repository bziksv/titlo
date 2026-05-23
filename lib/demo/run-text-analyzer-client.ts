import type { DemoErrorBody, TextAnalyzerDemoResult, TextAnalyzerDemoRunBody } from "@/lib/demo/types";
import { TEXT_ANALYZER_DEMO_MODULE } from "@/lib/demo/text-analyzer-demo";

const LK_PATH = `api/demo/${TEXT_ANALYZER_DEMO_MODULE}/run`;
const LOCAL_PATH = `/api/demo/${TEXT_ANALYZER_DEMO_MODULE}/run`;

export async function runTextAnalyzerDemo(
  body: TextAnalyzerDemoRunBody
): Promise<{ ok: true; data: TextAnalyzerDemoResult } | { ok: false; status: number; error: DemoErrorBody }> {
  const endpoints = [`/api/lk/${LK_PATH}`, LOCAL_PATH];

  for (const path of endpoints) {
    const res = await fetch(path, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });

    if (res.status === 404 || res.status === 502) continue;

    const json = (await res.json()) as TextAnalyzerDemoResult | DemoErrorBody;
    if (!res.ok) {
      return { ok: false, status: res.status, error: json as DemoErrorBody };
    }
    return { ok: true, data: json as TextAnalyzerDemoResult };
  }

  return {
    ok: false,
    status: 503,
    error: {
      error: "unavailable",
      message: "Демо временно недоступно. Попробуйте позже или зарегистрируйтесь в кабинете.",
    },
  };
}
