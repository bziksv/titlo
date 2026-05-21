/**
 * Проверка кастомного лендинга /monitoring-pozicii-sayta/
 * BASE_URL=http://localhost:3001 node scripts/verify-monitoring-landing.mjs
 */
const BASE = (process.env.BASE_URL ?? "http://127.0.0.1:3001").replace(/\/$/, "");
const PATH = "/monitoring-pozicii-sayta/";

const MUST_HAVE = [
  "Как устроен мониторинг",
  "Режимы в одной платформе",
  "Какую информацию даёт мониторинг",
  "Мониторинг позиций простым языком",
];

const MUST_NOT = ["Проверка позиций сайта", "Принцип работы онлайн—сервиса"];

async function main() {
  const url = `${BASE}${PATH}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`FAIL ${url} → HTTP ${res.status}`);
    process.exit(1);
  }
  const html = await res.text();
  const missing = MUST_HAVE.filter((s) => !html.includes(s));
  const stale = MUST_NOT.filter((s) => html.includes(s));

  if (missing.length === 0 && stale.length === 0) {
    console.log(`OK ${url} — кастомный лендинг`);
    process.exit(0);
  }
  console.error(`FAIL ${url}`);
  if (missing.length) console.error("  нет:", missing.join(", "));
  if (stale.length) console.error("  старый скрап:", stale.join(", "));
  process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
