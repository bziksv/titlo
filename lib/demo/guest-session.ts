import { cookies } from "next/headers";

const GUEST_COOKIE = "datagon_demo_guest";
const RUNS_COOKIE = "datagon_demo_runs";

export type GuestRunState = Record<string, { count: number; day: string }>;

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function parseRunState(raw: string | undefined): GuestRunState {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as GuestRunState;
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export async function readGuestRuns(): Promise<{ guestId: string; state: GuestRunState; isNewGuest: boolean }> {
  const jar = await cookies();
  let guestId = jar.get(GUEST_COOKIE)?.value;
  const isNewGuest = !guestId;
  if (!guestId) guestId = crypto.randomUUID();

  const state = parseRunState(jar.get(RUNS_COOKIE)?.value);
  return { guestId, state, isNewGuest };
}

export function countRunsForModule(state: GuestRunState, module: string): number {
  const day = todayKey();
  const entry = state[module];
  if (!entry || entry.day !== day) return 0;
  return entry.count;
}

export function bumpModuleRun(
  state: GuestRunState,
  module: string,
  maxPerDay: number
): { nextState: GuestRunState; remaining: number; allowed: boolean } {
  const day = todayKey();
  const prev = state[module];
  const count = !prev || prev.day !== day ? 0 : prev.count;
  if (count >= maxPerDay) {
    return { nextState: state, remaining: 0, allowed: false };
  }
  const nextCount = count + 1;
  const nextState: GuestRunState = {
    ...state,
    [module]: { day, count: nextCount },
  };
  return { nextState, remaining: maxPerDay - nextCount, allowed: true };
}

export function guestCookieHeaders(
  guestId: string,
  runState: GuestRunState,
  isNewGuest: boolean
): Headers {
  const h = new Headers();
  const opts = {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax" as const,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };
  if (isNewGuest) {
    h.append("Set-Cookie", `${GUEST_COOKIE}=${guestId}; Path=${opts.path}; Max-Age=${opts.maxAge}; SameSite=${opts.sameSite}; HttpOnly${opts.secure ? "; Secure" : ""}`);
  }
  h.append(
    "Set-Cookie",
    `${RUNS_COOKIE}=${encodeURIComponent(JSON.stringify(runState))}; Path=${opts.path}; Max-Age=${opts.maxAge}; SameSite=${opts.sameSite}; HttpOnly${opts.secure ? "; Secure" : ""}`
  );
  return h;
}

/** Сброс счётчика при смене суток (для отображения remaining без списания) */
export function remainingRuns(state: GuestRunState, module: string, maxPerDay: number): number {
  const used = countRunsForModule(state, module);
  return Math.max(0, maxPerDay - used);
}
