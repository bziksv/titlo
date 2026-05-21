const BASE = (process.env.BASE_URL ?? "http://127.0.0.1:3001").replace(/\/$/, "");
const PATH = "/klasterizator-klyuchevykh-slov/";

const MUST_HAVE = [
  "Кластеризатор ключевых слов",
  "Где пригодится",
  "Что проверяет сервис",
  "Кластеризатор простым языком",
];

const MUST_NOT = [
  "Пошаговая инструкция использования платформы",
  "Попробуем распределить ключевые запросы",
  "страхование авто",
  "/modules/assets/f5f7ea00a608485c.png",
  "/modules/assets/3394e6d2c092d9f8.png",
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
