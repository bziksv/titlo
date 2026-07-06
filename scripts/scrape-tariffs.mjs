/**
 * Лимиты с redbox.su/tarify/ + цены ₽/день из ЛК (tariff_setting_values.code = price)
 * → lib/content/tariffs.generated.ts
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as cheerio from "cheerio";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../lib/content/tariffs.generated.ts");
const SITE = "https://redbox.su/tarify/";

/** ₽ за календарный день — как в cabinet.titlo.ru /tariff */
const PRICE_PER_DAY = { Free: 0, Optimal: 65, Ultimate: 129, Maximum: 194 };

const DISCOUNT_NOTE =
  "Итоговая сумма зависит от периода оплаты. Скидки при оплате на 3 месяца — 10%, на 6 месяцев — 20%, на 12 месяцев — 35%.";

const html = await (await fetch(SITE)).text();
const $ = cheerio.load(html);

const NAMES_RU = {
  Free: "Бесплатный",
  Optimal: "Оптимальный",
  Ultimate: "Ультимат",
  Maximum: "Максимум",
};
const TAGLINES = {
  Free: "Попробовать платформу и утилиты",
  Optimal: "Фрилансер или небольшой проект",
  Ultimate: "Агентство и несколько клиентов",
  Maximum: "Крупные объёмы и много проектов",
};

const plans = [];

$(".tarif-item").each((_, item) => {
  const $item = $(item);
  const name = $item.find(".name, .title").first().text().replace(/\s+/g, " ").trim();
  if (!["Free", "Optimal", "Ultimate", "Maximum"].includes(name)) return;

  const features = [];
  $item.find("li").each((__, li) => {
    const t = $(li).text().replace(/\s+/g, " ").trim();
    if (t.length > 8 && !/репутац|поведенческ/i.test(t)) features.push(t);
  });

  plans.push({
    id: name,
    name: NAMES_RU[name],
    pricePerDay: PRICE_PER_DAY[name],
    price: `${PRICE_PER_DAY[name].toLocaleString("ru-RU")} ₽`,
    priceNote: name === "Free" ? "навсегда бесплатно" : undefined,
    tagline: TAGLINES[name],
    highlighted: name === "Ultimate",
    badge: name === "Ultimate" ? "Популярный" : undefined,
    features,
  });
});

const discount = DISCOUNT_NOTE;

function formatNum(n) {
  const num = Number(String(n).replace(/\s/g, ""));
  if (Number.isNaN(num)) return "?";
  return num.toLocaleString("ru-RU");
}

const compare = {
  relevance: {},
  text: {},
  competitors: {},
  positions: {},
  sites: {},
  meta: {},
  links: {},
};

for (const plan of plans) {
  for (const f of plan.features) {
    const low = f.toLowerCase();
    if (low.includes("релевантност")) {
      const n = f.match(/(\d[\d\s]*)\s*запрос/i)?.[1];
      compare.relevance[plan.id] = n ? formatNum(n) : "—";
    }
    if (low.includes("анализ текста") && !low.includes("релевант")) {
      const n = f.match(/(\d[\d\s]*)\s*запрос/i)?.[1];
      compare.text[plan.id] = n ? formatNum(n) : "—";
    }
    if (low.includes("конкурент")) {
      const n = f.match(/(\d[\d\s]*)\s*запрос/i)?.[1];
      compare.competitors[plan.id] = n ? formatNum(n) : "—";
    }
    if (low.includes("мониторинг позиций") || (low.includes("позиц") && (low.includes("провер") || low.includes("ключ")))) {
      const n = f.match(/(\d[\d\s]*)\s*(?:провер|ключ)/i)?.[1];
      compare.positions[plan.id] = n ? formatNum(n) : "—";
    }
    if (low.includes("мониторинг сайтов") || (low.includes("доступност") && low.includes("мониторинг"))) {
      const n = f.match(/(\d+)\s*проект/i)?.[1];
      compare.sites[plan.id] = n ? formatNum(n) : "—";
    }
    if (low.includes("мета-тег")) {
      const proj = f.match(/(\d+)\s*проект/i)?.[1];
      const pages = f.match(/(\d[\d\s]*)\s*страниц/i)?.[1];
      compare.meta[plan.id] =
        proj && pages ? `${formatNum(proj)} / ${formatNum(pages)}` : "—";
    }
    if (low.includes("отслеживание") && low.includes("ссылок")) {
      const proj = f.match(/(\d+)\s*проект/i)?.[1];
      const links = f.match(/(\d[\d\s]*)\s*ссылок/i)?.[1];
      compare.links[plan.id] =
        proj && links ? `${formatNum(proj)} / ${formatNum(links)}` : "—";
    }
  }
}

const lines = [
  "/** AUTO-GENERATED: node scripts/scrape-tariffs.mjs */",
  "export type TariffPlan = {",
  "  id: string;",
  "  name: string;",
  "  /** @deprecated Используйте pricePerDay — оставлено для обратной совместимости */",
  "  price: string;",
  "  /** Стоимость тарифа в рублях за календарный день (как в ЛК) */",
  "  pricePerDay: number;",
  "  priceNote?: string;",
  "  tagline: string;",
  "  features: string[];",
  "  highlighted?: boolean;",
  "  badge?: string;",
  "};",
  "",
  `export const TARIFF_DISCOUNT_NOTE = ${JSON.stringify(discount)};`,
  "",
  "export const TARIFF_PLANS: TariffPlan[] = [",
];

for (const p of plans) {
  const featLines = p.features.map((f) => `      ${JSON.stringify(f)},`).join("\n");
  const priceNoteLine = p.priceNote ? `\n    priceNote: ${JSON.stringify(p.priceNote)},` : "";
  lines.push(`  {
    id: ${JSON.stringify(p.id)},
    name: ${JSON.stringify(p.name)},
    price: ${JSON.stringify(p.price)},
    pricePerDay: ${p.pricePerDay},${priceNoteLine}
    tagline: ${JSON.stringify(p.tagline)},
    highlighted: ${p.highlighted ? "true" : "false"},${p.badge ? `\n    badge: ${JSON.stringify(p.badge)},` : ""}
    features: [
${featLines}
    ],
  },`);
}

lines.push(
  "];",
  "",
  "export const TARIFF_COMPARE_ROWS = [",
  '  { label: "Анализ релевантности, запросов/мес", key: "relevance" as const },',
  '  { label: "Анализ текста, запросов/мес", key: "text" as const },',
  '  { label: "Анализ конкурентов, запросов/мес", key: "competitors" as const },',
  '  { label: "Мониторинг позиций, проверок/мес", key: "positions" as const },',
  '  { label: "Мониторинг сайтов, проектов", key: "sites" as const },',
  '  { label: "Мета-теги, проектов / страниц", key: "meta" as const },',
  '  { label: "Отслеживание ссылок, проектов / ссылок", key: "links" as const },',
  "] as const;",
  "",
  "export const TARIFF_COMPARE: Record<string, Record<string, string>> = {",
  `  relevance: ${JSON.stringify(compare.relevance)},`,
  `  text: ${JSON.stringify(compare.text)},`,
  `  competitors: ${JSON.stringify(compare.competitors)},`,
  `  positions: ${JSON.stringify(compare.positions)},`,
  `  sites: ${JSON.stringify(compare.sites)},`,
  `  meta: ${JSON.stringify(compare.meta)},`,
  `  links: ${JSON.stringify(compare.links)},`,
  "};",
  "",
);

fs.writeFileSync(OUT, lines.join("\n"));
console.log("written", OUT, plans.length, "plans");
