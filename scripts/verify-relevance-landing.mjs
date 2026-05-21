/**
 * Проверка, что на /analiz-relevantnosti/ отдаётся кастомный лендинг, а не скрап ModuleLanding.
 * BASE_URL=https://datagon.ru node scripts/verify-relevance-landing.mjs
 */
const BASE = (process.env.BASE_URL ?? "http://127.0.0.1:3001").replace(/\/$/, "");
const PATH = "/analiz-relevantnosti/";

const MUST_HAVE = [
  "Как устроена технология",
  "Что увидите в отчёте",
  "От запроса до списка правок",
];

const MUST_NOT = ["Инструкция по работе с модулем", "Принцип работы сервиса"];

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
  if (missing.length) console.error("  нет в HTML:", missing.join(", "));
  if (stale.length) console.error("  остался старый скрап:", stale.join(", "));
  console.error("\nНа сервере после git pull: rm -rf .next && npm run build && pm2 restart datagon-site");
  console.error("Проверка локально на VPS: curl -s http://127.0.0.1:3001/analiz-relevantnosti/ | grep 'Как устроена'");
  process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
