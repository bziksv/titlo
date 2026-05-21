const BASE = (process.env.BASE_URL ?? "http://127.0.0.1:3001").replace(/\/$/, "");
const PATH = "/sravnenie-spiskov-klyuchevykh-fraz/";

const MUST_HAVE = [
  "Сравнение списков ключевых фраз",
  "Четыре типа сравнения",
  "Для кластеризации и SEO",
  "Сравнение списков простым языком",
];

const MUST_NOT = [
  "Предназначение сервиса",
  "Как работать в сервисе: подробная инструкция",
  "Общие возможности сервиса анализа списков",
];

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
