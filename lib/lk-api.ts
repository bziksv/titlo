const LK_API_BASE = process.env.LK_API_BASE_URL ?? process.env.NEXT_PUBLIC_LK_URL ?? "https://cabinet.titlo.ru";

/** Префиксы API lk, разрешённые для BFF-прокси с маркетингового сайта */
const ALLOWED_PREFIXES = [
  "api/demo/",
  "api/public/",
  "api/public/contact",
  "sanctum/csrf-cookie",
];

export function getLkApiBase(): string {
  return LK_API_BASE.replace(/\/$/, "");
}

export function isAllowedLkPath(path: string): boolean {
  const normalized = path.replace(/^\/+/, "");
  return ALLOWED_PREFIXES.some((p) => normalized === p.replace(/\/$/, "") || normalized.startsWith(p));
}

export async function proxyToLk(
  path: string,
  init?: RequestInit,
  incomingRequest?: Request
): Promise<Response> {
  if (!isAllowedLkPath(path)) {
    return new Response(JSON.stringify({ error: "Path not allowed" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = `${getLkApiBase()}/${path.replace(/^\/+/, "")}`;
  const headers = new Headers(init?.headers);
  headers.set("Accept", headers.get("Accept") ?? "application/json");

  if (incomingRequest) {
    const cookie = incomingRequest.headers.get("Cookie");
    if (cookie) headers.set("Cookie", cookie);
    const forwarded = incomingRequest.headers.get("X-Forwarded-For");
    if (forwarded) headers.set("X-Forwarded-For", forwarded);
  }

  try {
    return await fetch(url, {
      ...init,
      headers,
      cache: "no-store",
    });
  } catch {
    return new Response(JSON.stringify({ error: "LK unavailable" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}

/** Проброс Set-Cookie из ответа lk в ответ Next */
export function appendLkSetCookies(lkResponse: Response, outHeaders: Headers): void {
  const anyHeaders = lkResponse.headers as Headers & { getSetCookie?: () => string[] };
  const list = typeof anyHeaders.getSetCookie === "function" ? anyHeaders.getSetCookie() : [];
  if (list.length > 0) {
    for (const c of list) outHeaders.append("Set-Cookie", c);
    return;
  }
  const single = lkResponse.headers.get("set-cookie");
  if (single) outHeaders.append("Set-Cookie", single);
}
