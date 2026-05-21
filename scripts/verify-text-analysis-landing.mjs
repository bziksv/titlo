const BASE = (process.env.BASE_URL ?? "http://127.0.0.1:3001").replace(/\/$/, "");
const PATH = "/analiz-teksta/";

const MUST_HAVE = [
  "Анализ текста",
  "Где пригодится",
  "Что проверяет сервис",
  "Анализ текста простым языком",
];

const MUST_NOT = [
  "Какие задачи выполняет анализатор",
  "Как пользоваться сервисом анализа текста",
  "FAQ по анализу текста",
  "/modules/assets/deb8c7e59ef3d695.png",
  "/modules/assets/b991cbf83bd5f087.png",
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
