/**
 * Перегенерация обложек cab-* по 2 (или N) за раз.
 * Usage: node scripts/regen-cabinet-covers.mjs [offset=0] [count=2]
 */
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as cheerio from "cheerio";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const IN = path.join(__dirname, "_tmp_cabinet_news.json");
const OUT_TS = path.join(ROOT, "lib/content/news.cabinet.ts");
const ASSETS = path.join(ROOT, "public/news/assets");

const COVER_BGS = [
  "cover-bg-03.jpg",
  "cover-bg-04.jpg",
  "cover-bg-05.jpg",
  "cover-bg-06.jpg",
  "cover-bg-07.jpg",
  "cover-bg-09.jpg",
  "cover-bg-10.jpg",
  "cover-bg-11.jpg",
  "cover-bg-12.jpg",
];

const TITLE_OVERRIDES = {
  144: "Аудит сайта: инвентарь страниц, похожие URL и бейджи отчётов",
  143: "Аудит сайта: PageSpeed по-русски, телефон/компьютер и этапы",
  142: "Аудит сайта: объяснения отчётов и PageSpeed Insights",
  131: "Аудит сайта: отмена краула, robots wildcards и быстрее обновление",
  130: "Анализатор релевантности: удобнее SERP Google",
  129: "Обновления релевантности, доступа к проектам и других модулей",
  128: "Проверка ссылок: пакетная проверка и удобнее статусы",
  134: "Главная: матрица сайтов и удобнее привязка Метрики",
  137: "Бета-плашки на Аудите, Чек-листе и SEO-отчётах",
  133: "Проверка ссылок: статусы доноров, фильтры и массовое удаление",
  139: "Большое обновление аудита сайта: простой и расширенный режимы",
};

const COVER_RULES = [
  { re: /seo[\s-]?отч[её]т|клиентск(ий|ого) отч/i, label: "SEO-ОТЧЁТЫ", tag: "SEO-отчёты" },
  { re: /чек[\s-]?лист|checklist/i, label: "SEO-ЧЕКЛИСТ", tag: "SEO-чеклист" },
  { re: /аудит\s*сайта|site.?audit/i, label: "АУДИТ САЙТА", tag: "Аудит сайта" },
  { re: /релевантн|tlp|словосочетани/i, label: "РЕЛЕВАНТНОСТЬ", tag: "Анализ релевантности" },
  { re: /анализ\s*текста|текста\s*страниц/i, label: "АНАЛИЗ ТЕКСТА", tag: "Анализ текста" },
  { re: /мониторинг\s*позиц/i, label: "МОНИТОРИНГ", tag: "Мониторинг позиций" },
  { re: /метрик/i, label: "МЕТРИКА", tag: "Яндекс.Метрика" },
  { re: /проверк[аеи].*ссыл|донор/i, label: "ССЫЛКИ", tag: "Проверка ссылок" },
  { re: /кластер/i, label: "КЛАСТЕРИЗАЦИЯ", tag: "Кластеризация" },
  { re: /главн(ой|ая)|матриц(а|ы) сайт/i, label: "ГЛАВНАЯ", tag: "Кабинет" },
];

function escXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function pickCoverMeta(title) {
  for (const rule of COVER_RULES) {
    if (rule.re.test(title)) return rule;
  }
  return { label: "КАБИНЕТ ТИТЛО", tag: "Обновление" };
}

function coverSubtitle(title, tag) {
  const colon = title.indexOf(":");
  if (colon > 0 && colon < title.length - 2) {
    return title.slice(colon + 1).trim().replace(/\s+/g, " ").slice(0, 52);
  }
  let s = title
    .replace(/^(аудит сайта|анализатор релевантности|мониторинг позиций|проверка ссылок)\s*[—–-]?\s*/i, "")
    .trim();
  if (!s || s.length < 8) s = tag;
  return s.slice(0, 52);
}

function splitLabel(label) {
  const words = String(label).trim().split(/\s+/);
  if (words.length < 2 || label.length <= 11) return [label, ""];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

function pickBgFile(seed) {
  const n = Number.parseInt(String(seed).replace(/\D/g, "").slice(-6) || "0", 10);
  return COVER_BGS[n % COVER_BGS.length];
}

function titleFromHtml(html, id) {
  if (TITLE_OVERRIDES[id]) return TITLE_OVERRIDES[id];
  const $ = cheerio.load(`<div id="root">${html}</div>`);
  const strong = $("#root").find("strong").first().text().replace(/\s+/g, " ").trim();
  if (strong && strong.length >= 12) return strong.slice(0, 110);
  let lead = "";
  $("#root").find("p").each((_, el) => {
    if (lead) return;
    const t = $(el).text().replace(/\s+/g, " ").trim();
    if (!t || /^доброго дня/i.test(t)) return;
    lead = t;
  });
  return (lead || "Обновление кабинета").slice(0, 110);
}

async function makeCover({ id, label, tag, title }) {
  const subtitle = coverSubtitle(title, tag);
  const hash = crypto
    .createHash("sha1")
    .update(`cab-v4-${id}-${label}-${subtitle}`)
    .digest("hex")
    .slice(0, 16);
  const baseName = `cab-${hash}`;
  const pngPath = path.join(ASSETS, `${baseName}.png`);
  const webpPath = path.join(ASSETS, `${baseName}.webp`);
  const bgFile = pickBgFile(id);
  const bgPath = path.join(ASSETS, bgFile);
  if (!fs.existsSync(bgPath)) throw new Error(`нет фона ${bgFile}`);

  const W = 1536;
  const H = 1024;
  const n = Number.parseInt(String(id).replace(/\D/g, "") || "0", 10);
  const positions = ["left", "left", "centre", "northwest", "west"];
  const position = positions[n % positions.length];
  const [line1, line2] = splitLabel(label);
  const fontSize = line2 ? 86 : 102;
  const ink = "#163a48";
  const badgePadX = 28;
  const tagLine = String(subtitle.length > 0 ? subtitle : tag).slice(0, 52);
  const badgeInnerW = Math.max(tag.length, tagLine.length) * 12.2 + badgePadX * 2;
  const tagW = Math.min(680, Math.max(280, badgeInnerW));
  const tagH = 86;
  const badgeY = H - 56 - tagH;
  const titleY1 = line2 ? 156 : 176;

  const svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="veil" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#f7f4ee" stop-opacity="0.55"/>
      <stop offset="32%" stop-color="#f7f4ee" stop-opacity="0.18"/>
      <stop offset="55%" stop-color="#f7f4ee" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#veil)"/>
  <text x="56" y="${titleY1}" fill="${ink}" font-family="Arial Black, Helvetica Neue, Helvetica, Arial, sans-serif"
        font-size="${fontSize}" font-weight="900" letter-spacing="0.5">${escXml(line1)}</text>
  ${
    line2
      ? `<text x="56" y="${titleY1 + 96}" fill="${ink}" font-family="Arial Black, Helvetica Neue, Helvetica, Arial, sans-serif"
        font-size="${fontSize}" font-weight="900" letter-spacing="0.5">${escXml(line2)}</text>`
      : ""
  }
  <rect x="40" y="${badgeY}" rx="12" ry="12" width="${tagW}" height="${tagH}" fill="#0f2f3a" fill-opacity="0.92"/>
  <text x="${40 + badgePadX}" y="${badgeY + 34}" fill="#ffffff" font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
        font-size="24" font-weight="700">${escXml(tag)}</text>
  <text x="${40 + badgePadX}" y="${badgeY + 62}" fill="#b8c5ce" font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
        font-size="17" font-weight="500">${escXml(tagLine)}</text>
</svg>`;

  const base = await sharp(bgPath)
    .resize(W, H, { fit: "cover", position })
    .modulate({ brightness: 1.03, saturation: 0.92 })
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .png({ compressionLevel: 8 })
    .toBuffer();

  await sharp(base).png().toFile(pngPath);
  await sharp(base)
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 90, effort: 5 })
    .toFile(webpPath);

  return { imageUrl: `/news/assets/${baseName}.png`, bgFile, title, label };
}

async function main() {
  const offset = Number(process.argv[2] || 0);
  const count = Number(process.argv[3] || 2);
  const rows = JSON.parse(fs.readFileSync(IN, "utf8"));
  const slice = rows.slice(offset, offset + count);
  if (!slice.length) {
    console.error("пусто: offset", offset, "всего", rows.length);
    process.exit(1);
  }

  let ts = fs.readFileSync(OUT_TS, "utf8");
  const done = [];

  for (const row of slice) {
    const title = titleFromHtml(row.content || "", row.id);
    const meta = pickCoverMeta(title);
    const { imageUrl, bgFile, label } = await makeCover({
      id: row.id,
      label: meta.label,
      tag: meta.tag,
      title,
    });

    // Заменить imageUrl у блока с этим title (или slug-соседом)
    const titleEsc = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(
      `(title:\\s*"${titleEsc}"[\\s\\S]*?imageUrl:\\s*")[^"]+(")`,
      "m"
    );
    if (!re.test(ts)) {
      // fallback: по порядку в файле — ищем N-й imageUrl
      console.warn("! title не найден в TS, ищем по индексу", offset + done.length);
    } else {
      ts = ts.replace(re, `$1${imageUrl}$2`);
    }
    done.push({ id: row.id, title, imageUrl, bgFile, label });
    console.log(`✓ #${row.id} [${bgFile}] ${label} — ${title}`);
    console.log(`  → ${imageUrl}`);
  }

  // Если title-replace не сработал для части — патч по порядковому imageUrl
  const urls = [...ts.matchAll(/imageUrl:\s*"([^"]+)"/g)].map((m) => m[1]);
  if (urls.length >= offset + done.length) {
    let i = 0;
    ts = ts.replace(/imageUrl:\s*"[^"]+"/g, (m) => {
      const idx = i++;
      const local = idx - offset;
      if (local >= 0 && local < done.length) {
        return `imageUrl: "${done[local].imageUrl}"`;
      }
      return m;
    });
  }

  fs.writeFileSync(OUT_TS, ts, "utf8");
  console.log(`\nобновлено ${done.length} обложек (offset ${offset}) → news.cabinet.ts`);
}

await main();
