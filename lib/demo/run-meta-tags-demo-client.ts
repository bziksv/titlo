import type { MetaTagsDemoResponse } from "@/lib/demo/types";

export type MetaTagsRunBody = {
  url: string;
};

type RunResult =
  | { ok: true; data: MetaTagsDemoResponse }
  | { ok: false; status: number; error: string; message?: string; remaining?: number };

export async function runMetaTagsDemo(body: MetaTagsRunBody): Promise<RunResult> {
  const res = await fetch("/api/demo/proverka-meta-tegov-online/run/", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  const data = (await res.json().catch(() => ({}))) as MetaTagsDemoResponse & {
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
