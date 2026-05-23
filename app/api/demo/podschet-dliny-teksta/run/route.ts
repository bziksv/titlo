import {
  bumpModuleRun,
  guestCookieHeaders,
  readGuestRuns,
  remainingRuns,
} from "@/lib/demo/guest-session";
import {
  buildTextLengthDemoResponse,
  DEMO_MAX_RUNS_PER_DAY,
  TEXT_LENGTH_DEMO_MODULE,
  validateTextLengthDemoBody,
} from "@/lib/demo/text-length-demo";
import type { DemoErrorBody } from "@/lib/demo/types";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, { error: "invalid_json", message: "Ожидается JSON" });
  }

  const parsed = validateTextLengthDemoBody(body);
  if (!parsed.ok) {
    return jsonError(422, { error: "validation", message: parsed.message });
  }

  const { guestId, state, isNewGuest } = await readGuestRuns();
  const before = remainingRuns(state, TEXT_LENGTH_DEMO_MODULE, DEMO_MAX_RUNS_PER_DAY);

  if (before <= 0) {
    const err: DemoErrorBody = {
      error: "rate_limit",
      message: "Лимит демо на сегодня исчерпан. Зарегистрируйтесь для полного доступа.",
      remaining: 0,
    };
    const headers = guestCookieHeaders(guestId, state, isNewGuest);
    return jsonError(429, err, headers);
  }

  const { nextState, remaining, allowed } = bumpModuleRun(
    state,
    TEXT_LENGTH_DEMO_MODULE,
    DEMO_MAX_RUNS_PER_DAY
  );

  if (!allowed) {
    return jsonError(
      429,
      {
        error: "rate_limit",
        message: "Лимит демо на сегодня исчерпан.",
        remaining: 0,
      },
      guestCookieHeaders(guestId, nextState, isNewGuest)
    );
  }

  const data = buildTextLengthDemoResponse(parsed.data, remaining, guestId);
  const headers = guestCookieHeaders(guestId, nextState, isNewGuest);
  headers.set("Content-Type", "application/json");
  return new Response(JSON.stringify(data), { status: 200, headers });
}

function jsonError(status: number, body: DemoErrorBody, extraHeaders?: Headers) {
  const headers = extraHeaders ?? new Headers();
  headers.set("Content-Type", "application/json");
  return new Response(JSON.stringify(body), { status, headers });
}
