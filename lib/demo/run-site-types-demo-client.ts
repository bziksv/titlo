import type { SiteTypesDemoResponse, SiteTypesDemoRunBody } from "@/lib/demo/types";

type RunResult =
  | { ok: true; data: SiteTypesDemoResponse }
  | { ok: false; status: number; error: string; message?: string; remaining?: number };

export async function runSiteTypesDemo(body: SiteTypesDemoRunBody): Promise<RunResult> {
  const res = await fetch("/api/demo/tipy-saitov-v-vydache/run/", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  const data = (await res.json().catch(() => ({}))) as SiteTypesDemoResponse & {
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
