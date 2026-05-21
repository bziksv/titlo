/**
 * Проверка концепции /monitoring-pozicii-v2/ (не структура классики).
 */
const BASE = (process.env.BASE_URL ?? "http://127.0.0.1:3001").replace(/\/$/, "");
const PATH = "/monitoring-pozicii-v2/";

const MUST_HAVE = [
  "Где вы в выдаче — по ключам",
  "Центр управления",
  "Три акта",
  "Без единой картины",
  "С панелью Датагон",
  "Мониторинг — узел",
  "От ядра до отчёта",
  "Параметры съёма",
  "Цифры без маркетингового шума",
];

const MUST_NOT = [
  "Режимы в одной платформе",
  "Как устроен мониторинг",
  "Что нового на этой странице",
  "Не косметика",
  "Концепция подачи",
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
    console.log(`OK ${url} — концепция «Центр управления выдачей»`);
    process.exit(0);
  }
  console.error(`FAIL ${url}`);
  if (missing.length) console.error("  нет:", missing.join(", "));
  if (stale.length) console.error("  осталась структура классики:", stale.join(", "));
  process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
