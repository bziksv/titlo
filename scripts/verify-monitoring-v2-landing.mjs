/**
 * Проверка концепции /monitoring-pozicii-v2/ (не структура классики).
 */
const BASE = (process.env.BASE_URL ?? "http://127.0.0.1:3001").replace(/\/$/, "");
const PATH = "/monitoring-pozicii-v2/";

const MUST_HAVE = [
  "Проверка позиций сайта по ключевым запросам",
  "Мониторинг позиций",
  "Три акта",
  "Какие проблемы решает наш сервис",
  "С панелью Титло",
  "Мониторинг позиций — узел в вашей системе продвижения",
  "От сборки ядра до отчёта",
  "Соберите ядро",
  "Что внутри мониторинга позиций",
  "Динамика в таблице ключей",
  "monitoring-v2-shot-keywords-v3.png",
  "Отчёты XLS и PDF",
  "Публичная ссылка",
  "Параметры съёма",
  "Просто о проверке позиций",
];

const MUST_NOT = [
  "Режимы в одной платформе",
  "Как устроен мониторинг",
  "Что нового на этой странице",
  "Не косметика",
  "Концепция подачи",
  "Где вы в выдаче — по ключам",
  "Без единой картины",
  "Цифры без маркетингового шума",
  "Объективные цифры и ничего лишнего",
  "Параметры съёма в одном взгляде",
  "money-запросам",
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
  if (stale.length) console.error("  устаревший копирайт / классика:", stale.join(", "));
  process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
