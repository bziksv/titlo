import type { DemoErrorBody } from "@/lib/demo/types";
import type { UniqueWordsDemoResult } from "@/lib/demo/unique-words-demo";
import { UNIQUE_WORDS_DEMO_MODULE } from "@/lib/demo/unique-words-demo";

const LK_PATH = `api/demo/${UNIQUE_WORDS_DEMO_MODULE}/run`;
const LOCAL_PATH = `/api/demo/${UNIQUE_WORDS_DEMO_MODULE}/run`;

export async function runUniqueWordsDemo(
  content: string
): Promise<{ ok: true; data: UniqueWordsDemoResult } | { ok: false; status: number; error: DemoErrorBody }> {
  const endpoints = [`/api/lk/${LK_PATH}`, LOCAL_PATH];

  for (const path of endpoints) {
    const res = await fetch(path, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ content }),
    });

    if (res.status === 404 || res.status === 502) continue;

    const json = (await res.json()) as UniqueWordsDemoResult | DemoErrorBody;
    if (!res.ok) {
      return { ok: false, status: res.status, error: json as DemoErrorBody };
    }
    return { ok: true, data: json as UniqueWordsDemoResult };
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
