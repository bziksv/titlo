import type { EseninTextCheckDemoResponse, EseninTextCheckDemoRunBody } from "@/lib/demo/types";

type RunResult =
  | { ok: true; data: EseninTextCheckDemoResponse }
  | { ok: false; status: number; error: string; message?: string; remaining?: number };

export async function runEseninTextCheckDemo(body: EseninTextCheckDemoRunBody): Promise<RunResult> {
  const res = await fetch("/api/demo/proverka-teksta-esenin/run/", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  const data = (await res.json().catch(() => ({}))) as EseninTextCheckDemoResponse & {
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
