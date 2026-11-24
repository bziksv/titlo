import type { TextUniquenessCompareResult } from "@/lib/demo/text-uniqueness-compare";

export type TextUniquenessDemoResponse = {
  result: TextUniquenessCompareResult;
  remaining: number;
};

type RunResult =
  | { ok: true; data: TextUniquenessDemoResponse }
  | { ok: false; status: number; error: string; message?: string; remaining?: number };

export async function runTextUniquenessDemo(body: { text: string; url: string }): Promise<RunResult> {
  const res = await fetch("/api/demo/proverka-unikalnosti-teksta/run/", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  const data = (await res.json().catch(() => ({}))) as TextUniquenessDemoResponse & {
    error?: string;
    message?: string;
    remaining?: number;
  };

  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      error: data.error ?? "error",
      message: data.message,
      remaining: data.remaining,
    };
  }

  return { ok: true, data };
}
