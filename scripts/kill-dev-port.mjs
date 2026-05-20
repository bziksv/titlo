#!/usr/bin/env node
/** Освобождает порт dev-сервера (по умолчанию 3001). macOS / Linux. */

import { execSync } from "node:child_process";

function resolvePort() {
  const candidates = [process.env.PORT, process.argv[2], "3001"];
  for (const raw of candidates) {
    if (raw == null || raw === "") continue;
    const s = String(raw).trim();
    if (/^\d+$/.test(s)) return s;
  }
  return "3001";
}

const port = resolvePort();

function listPids() {
  try {
    const out = execSync(`lsof -nP -iTCP:${port} -sTCP:LISTEN -t`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    return out
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((p) => Number(p))
      .filter((n) => Number.isFinite(n));
  } catch {
    return [];
  }
}

const pids = listPids();
if (!pids.length) {
  console.log(`Порт ${port} свободен.`);
  process.exit(0);
}

for (const pid of pids) {
  try {
    process.kill(pid, "SIGTERM");
    console.log(`Остановлен процесс ${pid} (порт ${port})`);
  } catch {
    try {
      process.kill(pid, "SIGKILL");
      console.log(`Остановлен процесс ${pid} (SIGKILL, порт ${port})`);
    } catch {
      /* уже завершён */
    }
  }
}
