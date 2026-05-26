import type { DomainInformationDemoResponse } from "@/lib/demo/types";

export type DomainInformationRunBody = {
  domain: string;
};

type RunResult =
  | { ok: true; data: DomainInformationDemoResponse }
  | { ok: false; status: number; error: string; message?: string; remaining?: number };

export async function runDomainInformationDemo(
  body: DomainInformationRunBody,
): Promise<RunResult> {
  const res = await fetch("/api/demo/otslezhivanie-sroka-registratsii-domenov/run", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  const data = (await res.json().catch(() => ({}))) as DomainInformationDemoResponse & {
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
