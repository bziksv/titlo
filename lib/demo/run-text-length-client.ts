import type { DemoErrorBody, TextLengthDemoResult, TextLengthDemoRunBody } from "@/lib/demo/types";
import { TEXT_LENGTH_DEMO_MODULE } from "@/lib/demo/text-length-demo";

const LK_PATH = `api/demo/${TEXT_LENGTH_DEMO_MODULE}/run`;
const LOCAL_PATH = `/api/demo/${TEXT_LENGTH_DEMO_MODULE}/run`;

/**
 * Сначала lk через BFF; при 404/502 — локальный demo route (пока lk не реализовал endpoint).
 */
export async function runTextLengthDemo(
  body: TextLengthDemoRunBody
): Promise<{ ok: true; data: TextLengthDemoResult } | { ok: false; status: number; error: DemoErrorBody }> {
  const endpoints = [`/api/lk/${LK_PATH}`, LOCAL_PATH];

  for (const path of endpoints) {
    const res = await fetch(path, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });

    if (res.status === 404 || res.status === 502) continue;

    const json = (await res.json()) as TextLengthDemoResult | DemoErrorBody;
    if (!res.ok) {
      return { ok: false, status: res.status, error: json as DemoErrorBody };
    }
    return { ok: true, data: json as TextLengthDemoResult };
  }

  return {
    ok: false,
    status: 503,
    error: { error: "unavailable", message: "Демо временно недоступно. Попробуйте позже или зарегистрируйтесь в кабинете." },
  };
}
