import { appendLkSetCookies } from "@/lib/lk-api";

/** Серверный прокси на кабинет для demo API (анализ текста — только Laravel). */
export async function proxyCabinetDemoPost(
  cabinetPath: string,
  incoming: Request
): Promise<Response> {
  const base = (
    process.env.CABINET_DEMO_API_URL ??
    process.env.LK_API_BASE_URL ??
    "http://127.0.0.1:3002"
  ).replace(/\/$/, "");

  const url = `${base}/${cabinetPath.replace(/^\/+/, "")}`;
  const headers = new Headers();
  const contentType = incoming.headers.get("Content-Type");
  if (contentType) headers.set("Content-Type", contentType);
  headers.set("Accept", "application/json");

  const cookie = incoming.headers.get("Cookie");
  if (cookie) headers.set("Cookie", cookie);

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers,
      body: await incoming.text(),
      cache: "no-store",
    });
  } catch {
    return new Response(JSON.stringify({ error: "cabinet_unavailable" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = await res.text();
  const outHeaders = new Headers();
  const ct = res.headers.get("Content-Type");
  if (ct) outHeaders.set("Content-Type", ct);
  appendLkSetCookies(res, outHeaders);

  return new Response(body, { status: res.status, headers: outHeaders });
}
