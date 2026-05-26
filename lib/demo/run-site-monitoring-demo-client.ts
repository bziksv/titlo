import type { SiteMonitoringDemoResponse } from "@/lib/demo/types";

export type SiteMonitoringRunBody = {
  url: string;
  phrase?: string;
  waiting_time?: number;
};

type RunResult =
  | { ok: true; data: SiteMonitoringDemoResponse }
  | { ok: false; status: number; error: string; message?: string; remaining?: number };

export async function runSiteMonitoringDemo(body: SiteMonitoringRunBody): Promise<RunResult> {
  const res = await fetch("/api/demo/monitoring-saytov/run", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  const data = (await res.json().catch(() => ({}))) as SiteMonitoringDemoResponse & {
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
