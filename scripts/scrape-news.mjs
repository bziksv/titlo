/**
 * Импорт новостей с redbox.su → lib/content/news.generated.ts
 * Запуск: node scripts/scrape-news.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as cheerio from "cheerio";
import { mirrorFileUploadUrls } from "./lib/mirror-images.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../lib/content/news.generated.ts");
const SITE = "https://redbox.su";

const SLUGS = [
  "analizator-relevantnosti-stranitsy-dobavlena-vozmozhno-skachivat-spisok-tlps",
  "analizator-relevantnosti-stranitsy-obnovleno-opisanie-v-proekte-funktsionala",
  "bolshoe-obnovlenie-analiza-relevantnosti-stranitsy",
  "bolee-70-klientov-uzhe-sotrudnichayut-s-kompaniey-i-chast-iz-nikh-s-momenta-osnovaniya",
  "dobavlena-sistema-metok-dlya-analizatora-relevantnosti-stranitsy",
  "dobavleny-obuchayushchie-roliki-k-nekotorym-servisami",
  "dorabotki-modulya-analiz-relevantnosti-stranitsy",
  "god-osnovaniya-i-shtat-v-3-cheloveka",
  "ispravlen-bag-s-oblakami-slov",
  "izmenenie-politiki-otdachi-stranits-google",
  "izmeneniya-usloviya-raboty-s-yandeks-api",
  "k-komande-prisoedinyaetsya-pervyy-programmist",
  "monitoring-pozitsiy-novye-vozmozhnosti-redaktirovaniya-proektov",
  "my-napisali-sistemu-ucheta-klientov-dlya-vnutrennikh-nuzhd",
  "my-razrabatyvaem-sobstvennuyu-platformu-dlya-seo-spetsialistov-i-analitikov-i-zapuskaem-ee-pomodulno",
  "novoe-video-v-module-analiz-relevantnosti",
  "obnovlenie-modulya-analiz-teksta",
  "obnovlenie-modulya-monitoring-pozitsiy-analiz-top-100",
  "obnovlenie-v-module-monitoring-poziciy",
  "obnovlenie-v-module-monitoring-pozitsiy",
  "peredelan-modul-vydelenie-unikalnykh-slov-v-tekste",
  "poyavilos-video-v-servise-analiz-relevantnosti",
  "prakticheskiy-kurs-v-module-analiz-relevantnosti",
  "pravki-v-module-analiz-teksta",
  "problemy-s-videorolikami",
  "prodolzhaem-rabotu-nad-modulyami",
  "sredniy-srok-sotrudnichestva-prevysil-3-5-goda-nas-uzhe-bolee-20-chelovek-v-komande",
  "tarifnye-limity-v-module-monitoring-pozitsiy",
  "u-kompanii-bolee-50-klientov-na-seo-prodvizhenii-i-bolee-10-proektov-po-kontekstnoy-reklame",
  "vygruzka-rezultatov-v-module-http-headers",
];

function escape(str) {
  return str.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");
}

function absUrl(src) {
  if (!src) return "";
  if (src.startsWith("http")) return src;
  if (src.startsWith("//")) return `https:${src}`;
  return `${SITE}${src.startsWith("/") ? "" : "/"}${src}`;
}

function isDecorativeImg(src) {
  return /kraken\/b91|favicon|logo|resize_cache.*logo/i.test(src);
}

function normalizeEmbedSrc(src) {
  const url = absUrl(src);
  if (!/youtube\.com|youtu\.be/i.test(url)) return null;
  return url;
}

function parseArticle(html) {
  const $ = cheerio.load(html);
  const title =
    $("h1").first().text().trim() ||
    $("meta[property='og:title']").attr("content")?.trim() ||
    $("title").text().split("|")[0].trim();

  const ogImage = $("meta[property='og:image']").attr("content");
  let imageUrl = ogImage && !isDecorativeImg(ogImage) ? absUrl(ogImage) : "";

  if (!imageUrl) {
    const lazyRoot = $(".news-detail, .text-content, main").first();
    imageUrl = pickLazySrc($, lazyRoot.length ? lazyRoot : $("body"));
  }

  const root = $(".text-content, .descriptive .text-wrap, .news-detail, article .content").first();
  const scope = root.length ? root : $("main");

  const blocks = [];
  const seenText = new Set();

  scope.find("p, iframe, img").each((_, el) => {
    const tag = el.tagName?.toLowerCase();
    if (tag === "p") {
      const t = $(el).text().replace(/\s+/g, " ").trim();
      if (t.length < 20 || seenText.has(t) || /cookie|BITRIX|Модули сервиса/i.test(t)) return;
      seenText.add(t);
      blocks.push({ type: "p", text: t });
      return;
    }
    if (tag === "iframe") {
      const src = normalizeEmbedSrc($(el).attr("src"));
      if (src) blocks.push({ type: "embed", src });
      return;
    }
    if (tag === "img") {
      const src = absUrl($(el).attr("src"));
      if (!src || isDecorativeImg(src)) return;
      if (!imageUrl) imageUrl = src;
      blocks.push({ type: "img", src, alt: $(el).attr("alt")?.trim() || "" });
    }
  });

  if (blocks.length === 0) {
    $("main p").each((_, el) => {
      const t = $(el).text().replace(/\s+/g, " ").trim();
      if (t.length < 30 || seenText.has(t)) return;
      seenText.add(t);
      blocks.push({ type: "p", text: t });
    });
  }

  const body = blocks.filter((b) => b.type === "p").map((b) => b.text);
  const excerpt = body[0]?.slice(0, 220) || title;

  return { title, excerpt, blocks: blocks.slice(0, 40), body: body.slice(0, 30), imageUrl };
}

function pickLazySrc($, $root) {
  const lazy =
    $root.find("[data-src*='iblock'], [data-src*='resize_cache'], [data-src*='medialibrary']").first().attr("data-src") ||
    $root.find("img[src*='iblock'], img[src*='resize_cache']").first().attr("src") ||
    $root.attr("data-src") ||
    $root.attr("style")?.match(/url\(['"]?([^'")]+)/)?.[1];
  if (!lazy || isDecorativeImg(lazy)) return "";
  return absUrl(lazy);
}

function imageFromNewsLink($, $a) {
  const inside =
    $a.find(".bg-img[data-src], .lazyload[data-src]").first().attr("data-src") ||
    $a.find("[data-src*='iblock'], [data-src*='resize_cache'], [data-src*='medialibrary']").first().attr("data-src") ||
    $a.find("img[src*='iblock'], img[src*='resize_cache']").first().attr("src");
  if (inside && !isDecorativeImg(inside)) return absUrl(inside);

  const card = $a.closest(".wrap-element, .element, .col-md-4, .col-sm-6, .news-item, li, article");
  return pickLazySrc($, card.length ? card : $a);
}

function buildImageMapFromHtml(html) {
  const $ = cheerio.load(html);
  const imageMap = {};

  $("a[href*='/news/detail/']").each((_, a) => {
    const href = $(a).attr("href") || "";
    const m = href.match(/detail\/([^/]+)/);
    if (!m) return;
    const slug = m[1];
    const $a = $(a);
    const src = imageFromNewsLink($, $a);
    if (!src) return;
    const hasPreview = $a.find(".bg-img[data-src], .lazyload[data-src]").length > 0;
    if (!imageMap[slug] || hasPreview) imageMap[slug] = src;
  });

  return imageMap;
}

function buildDateMapFromHtml(html) {
  const $ = cheerio.load(html);
  const dateMap = {};
  $("a[href*='/news/detail/']").each((_, a) => {
    const href = $(a).attr("href") || "";
    const m = href.match(/detail\/([^/]+)/);
    if (!m) return;
    const slug = m[1];
    const block = $(a).closest("div, article, li, .item, .news-item");
    const text = block.text().replace(/\s+/g, " ");
    const dm = text.match(
      /(\d{1,2}\s+(?:января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)\s+\d{4})/i
    );
    if (dm) dateMap[slug] = dm[1];
  });
  return dateMap;
}

async function fetchMetaMaps() {
  const [newsHtml, historyHtml] = await Promise.all([
    fetch(`${SITE}/news/`).then((r) => r.text()),
    fetch(`${SITE}/news/istoriya-kompanii/`).then((r) => r.text()),
  ]);

  const dateMap = { ...buildDateMapFromHtml(historyHtml), ...buildDateMapFromHtml(newsHtml) };
  const imageMap = { ...buildImageMapFromHtml(historyHtml), ...buildImageMapFromHtml(newsHtml) };

  return { dateMap, imageMap };
}

const ABOUT_DATES = {
  "god-osnovaniya-i-shtat-v-3-cheloveka": "11 марта 2015",
  "k-komande-prisoedinyaetsya-pervyy-programmist": "6 апреля 2016",
  "u-kompanii-bolee-50-klientov-na-seo-prodvizhenii-i-bolee-10-proektov-po-kontekstnoy-reklame": "1 января 2018",
  "my-napisali-sistemu-ucheta-klientov-dlya-vnutrennikh-nuzhd": "4 октября 2019",
  "bolee-70-klientov-uzhe-sotrudnichayut-s-kompaniey-i-chast-iz-nikh-s-momenta-osnovaniya": "4 января 2020",
  "sredniy-srok-sotrudnichestva-prevysil-3-5-goda-nas-uzhe-bolee-20-chelovek-v-komande": "22 июля 2021",
};

const { dateMap, imageMap } = await fetchMetaMaps();
const items = [];

for (const slug of SLUGS) {
  const url = `${SITE}/news/detail/${slug}/`;
  const res = await fetch(url);
  const html = await res.text();
  const parsed = parseArticle(html);
  const date = dateMap[slug] || ABOUT_DATES[slug] || "";
  // Превью со списка /news/ важнее картинки из тела статьи
  let imageUrl = imageMap[slug] || "";
  if (!imageUrl && parsed.imageUrl) imageUrl = parsed.imageUrl;
  items.push({ slug, ...parsed, date, imageUrl });
  console.log("ok", slug, parsed.blocks.length, imageUrl ? "img" : "-");
  await new Promise((r) => setTimeout(r, 200));
}

function serializeBlock(b) {
  if (b.type === "p") {
    return `    { type: "p", text: ${JSON.stringify(b.text)} },`;
  }
  if (b.type === "img") {
    return `    { type: "img", src: ${JSON.stringify(b.src)}, alt: ${JSON.stringify(b.alt || "")} },`;
  }
  return `    { type: "embed", src: ${JSON.stringify(b.src)} },`;
}

const lines = [
  "/** Автогенерация: node scripts/scrape-news.mjs */",
  "export type NewsBlock =",
  '  | { type: "p"; text: string }',
  '  | { type: "img"; src: string; alt?: string }',
  '  | { type: "embed"; src: string };',
  "",
  "export type NewsItem = {",
  "  slug: string;",
  "  title: string;",
  "  date: string;",
  "  excerpt: string;",
  "  imageUrl?: string;",
  "  blocks: NewsBlock[];",
  "  /** @deprecated используйте blocks */",
  "  body: string[];",
  "};",
  "",
  "export const NEWS_ITEMS: NewsItem[] = [",
];

for (const item of items) {
  const blockLines = item.blocks.map((b) => serializeBlock(b)).join("\n");
  const bodyLines = item.body.map((p) => `      ${JSON.stringify(p)},`).join("\n");
  const imageLine = item.imageUrl
    ? `    imageUrl: ${JSON.stringify(item.imageUrl)},`
    : "";

  lines.push(`  {
    slug: ${JSON.stringify(item.slug)},
    title: ${JSON.stringify(item.title)},
    date: ${JSON.stringify(item.date)},
    excerpt: ${JSON.stringify(item.excerpt)},
${imageLine}
    blocks: [
${blockLines}
    ],
    body: [
${bodyLines}
    ],
  },`);
}

lines.push(
  "];",
  "",
  "export function getNewsBySlug(slug: string): NewsItem | undefined {",
  "  return NEWS_ITEMS.find((n) => n.slug === slug);",
  "}",
  ""
);

fs.writeFileSync(OUT, lines.join("\n"));
console.log("written", OUT, items.length);

const PUBLIC = path.join(__dirname, "../public");
await mirrorFileUploadUrls(OUT, PUBLIC);
