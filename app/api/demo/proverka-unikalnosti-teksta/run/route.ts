import { TEXT_UNIQUENESS_DEMO_MAX_RUNS } from "@/lib/demo/text-uniqueness-demo";
import { assertPublicHttpUrl, compareTextWithHtml } from "@/lib/demo/text-uniqueness-compare";

export const dynamic = "force-dynamic";

const COOKIE = "titlo_tu_demo";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function readRuns(cookie: string | null): number {
  if (!cookie) return 0;
  const [date, raw] = cookie.split(":");
  if (date !== today()) return 0;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function cookieHeader(runs: number): string {
  return `${COOKIE}=${today()}:${runs}; Path=/; Max-Age=172800; HttpOnly; SameSite=Lax`;
}

function json(status: number, body: unknown, runs?: number): Response {
  const headers = new Headers({ "Content-Type": "application/json" });
  if (runs !== undefined) headers.set("Set-Cookie", cookieHeader(runs));
  return new Response(JSON.stringify(body), { status, headers });
}

export async function POST(request: Request) {
  const used = readRuns(request.headers.get("cookie")?.match(new RegExp(`${COOKIE}=([^;]+)`))?.[1] ?? null);
  const remainingBefore = TEXT_UNIQUENESS_DEMO_MAX_RUNS - used;
  if (remainingBefore <= 0) {
    return json(429, {
      error: "rate_limit",
      message: "Лимит демо-проверок на сегодня исчерпан. В кабинете — поиск по выдаче, несколько URL и история.",
      remaining: 0,
    });
  }

  let body: { text?: string; url?: string } = {};
  try {
    body = (await request.json()) as { text?: string; url?: string };
  } catch {
    body = {};
  }

  const text = String(body.text ?? "").trim();
  if (text.length < 80) {
    return json(422, { error: "validation", message: "Вставьте текст хотя бы на 80 символов.", remaining: remainingBefore });
  }
  if (text.length > 1500) {
    return json(422, {
      error: "validation",
      message: "В демо — до 1 500 символов. В кабинете текст может быть длиннее.",
      remaining: remainingBefore,
    });
  }

  let url: URL;
  try {
    url = assertPublicHttpUrl(String(body.url ?? ""));
  } catch (e) {
    return json(422, { error: "validation", message: e instanceof Error ? e.message : "Некорректный адрес", remaining: remainingBefore });
  }

  let html = "";
  try {
    const res = await fetch(url.toString(), {
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
      headers: { "User-Agent": "TitloDemo/1.0", Accept: "text/html" },
    });
    if (!res.ok) {
      return json(502, { error: "fetch_failed", message: "Страница не открылась. Проверьте адрес.", remaining: remainingBefore });
    }
    html = (await res.text()).slice(0, 400_000);
  } catch {
    return json(502, { error: "fetch_failed", message: "Не удалось открыть страницу. Попробуйте другой адрес.", remaining: remainingBefore });
  }

  const runs = used + 1;
  return json(
    200,
    {
      result: compareTextWithHtml(text, html, url.toString()),
      remaining: TEXT_UNIQUENESS_DEMO_MAX_RUNS - runs,
    },
    runs
  );
}
