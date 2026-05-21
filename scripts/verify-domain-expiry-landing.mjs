const BASE = (process.env.BASE_URL ?? "http://127.0.0.1:3001").replace(/\/$/, "");
const PATH = "/otslezhivanie-sroka-registratsii-domenov/";

const MUST_HAVE = [
  "Отслеживание срока регистрации доменов",
  "Где пригодится",
  "Что проверяет сервис",
  "Срок регистрации домена простым языком",
];

const MUST_NOT = [
  "Пошаговая инструкция",
  "О списке отслеживаемых доменов",
  "Распространённые вопросы",
  "/modules/assets/b991cbf83bd5f087.png",
  "/modules/assets/bgeidu0qys5wggzl1s9qvf808e621pmk.png",
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
