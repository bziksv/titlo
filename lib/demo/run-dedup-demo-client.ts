import type { DedupDemoResult, DedupDemoRunBody, DemoErrorBody } from "@/lib/demo/types";
import { DEDUP_DEMO_MODULE } from "@/lib/demo/dedup-demo";

const LK_PATH = `api/demo/${DEDUP_DEMO_MODULE}/run`;
const LOCAL_PATH = `/api/demo/${DEDUP_DEMO_MODULE}/run`;

export async function runDedupDemo(
  body: DedupDemoRunBody
): Promise<{ ok: true; data: DedupDemoResult } | { ok: false; status: number; error: DemoErrorBody }> {
  const endpoints = [`/api/lk/${LK_PATH}`, LOCAL_PATH];

  for (const path of endpoints) {
    const res = await fetch(path, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });

    if (res.status === 404 || res.status === 502) continue;

    const json = (await res.json()) as DedupDemoResult | DemoErrorBody;
    if (!res.ok) {
      return { ok: false, status: res.status, error: json as DemoErrorBody };
    }
    return { ok: true, data: json as DedupDemoResult };
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
