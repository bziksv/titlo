#!/usr/bin/env bash
# Маркетинг :3001 + кабинет :3002 (два терминала в одном — кабинет в фоне)
set -euo pipefail

DATAGON_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CABINET_ROOT="${CABINET_ROOT:-$DATAGON_ROOT/../cabinet.datagon.ru}"
FRESH=0

if [[ "${1:-}" == "--fresh" ]]; then
  FRESH=1
fi

if [[ ! -d "$CABINET_ROOT" ]] || [[ ! -f "$CABINET_ROOT/scripts/dev-serve.sh" ]]; then
  echo "Не найден кабинет: $CABINET_ROOT" >&2
  echo "Задайте CABINET_ROOT=/path/to/cabinet.datagon.ru" >&2
  exit 1
fi

cleanup() {
  if [[ -n "${CABINET_PID:-}" ]] && kill -0 "$CABINET_PID" 2>/dev/null; then
    kill "$CABINET_PID" 2>/dev/null || true
  fi
  bash "$CABINET_ROOT/scripts/dev-fpm.sh" stop 2>/dev/null || true
  bash "$CABINET_ROOT/scripts/dev-local.sh" stop 2>/dev/null || true
  lsof -ti :3002 -sTCP:LISTEN 2>/dev/null | xargs kill -9 2>/dev/null || true
}
trap cleanup EXIT INT TERM

# Старые вкладки Chrome/Cursor держат :3002 — php -S однопоточный и «висит»
lsof -ti :3002 2>/dev/null | xargs kill -9 2>/dev/null || true
sleep 1

echo "→ Кабинет http://localhost:3002 (nginx+php-fpm, параллельные запросы)"
(
  cd "$CABINET_ROOT"
  export PATH="/opt/homebrew/opt/php@7.4/bin:/opt/homebrew/opt/php@7.4/sbin:${PATH:-}"
  bash scripts/dev-local.sh detach
) &
CABINET_PID=$!

sleep 2
if ! curl -sS --max-time 12 -o /dev/null http://127.0.0.1:3002/login 2>/dev/null; then
  echo "Кабинет на :3002 пока не отвечает — см. /tmp/cabinet-dev.log" >&2
  bash "$CABINET_ROOT/scripts/cabinet-diagnose.sh" 2>/dev/null || true
fi

echo "→ Маркетинг http://localhost:3001"
cd "$DATAGON_ROOT"
npm run dev:stop
if [[ "$FRESH" -eq 1 ]]; then
  rm -rf .next
fi
exec npm run dev
