const BASE = (process.env.BASE_URL ?? "http://127.0.0.1:3001").replace(/\/$/, "");
const PATH = "/http-headers/";

const MUST_HAVE = [
  "Проверка HTTP-заголовков",
  "Что проверяем в ответе",
  "Пакетная проверка",
  "HTTP-заголовки простым языком",
];

const MUST_NOT = [
  "Понятие заголовков",
  "Сервис проверки заголовков HTTP",
  "Преимущества сервиса RedBox",
  "/modules/assets/3efa6f436b2d89b1.png",
  "/modules/assets/ad4110fce10be168.png",
  "/modules/assets/2616d92c00483f20.png",
  "/modules/assets/5489a727f723a16f.png",
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
