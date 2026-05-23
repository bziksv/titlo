/**
 * Тарифы с redbox.su/tarify/ → lib/content/tariffs.generated.ts
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as cheerio from "cheerio";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../lib/content/tariffs.generated.ts");
const SITE = "https://redbox.su/tarify/";

const html = await (await fetch(SITE)).text();
const $ = cheerio.load(html);

const PRICES = { Free: "0 ₽", Optimal: "1 500 ₽", Ultimate: "3 000 ₽", Maximum: "5 000 ₽" };
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
    price: PRICES[name],
    priceNote: name === "Free" ? "навсегда бесплатно" : "в месяц",
    tagline: TAGLINES[name],
    highlighted: name === "Ultimate",
    badge: name === "Ultimate" ? "Популярный" : undefined,
    features,
  });
});

const discount =
  $(".text-wrap, .descriptive")
    .text()
    .match(/скидк[^.]{10,120}/i)?.[0]
    ?.replace(/\s+/g, " ")
    .trim() ||
  "Получите скидку на оплату тарифа при подключении на несколько месяцев — чем больше срок, тем больше скидка.";

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
    if (low.includes("мониторинг позиций") || (low.includes("позиц") && low.includes("ключ"))) {
      const n = f.match(/(\d[\d\s]*)\s*ключ/i)?.[1];
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
  "  price: string;",
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
  lines.push(`  {
    id: ${JSON.stringify(p.id)},
    name: ${JSON.stringify(p.name)},
    price: ${JSON.stringify(p.price)},
    priceNote: ${JSON.stringify(p.priceNote)},
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
  '  { label: "Мониторинг позиций, ключей", key: "positions" as const },',
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
