/**
 * Синхронизация ленты titlo.ru с новостями кабинета (HTML → NewsItem + обложки).
 *
 * Обложки: уникальная генерация в стилистике ленты (см. docs/news-cover-generation.md).
 * Не копировать готовые PNG архива на несколько постов.
 *
 * Вход: scripts/_tmp_cabinet_news.json
 * Выход: lib/content/news.cabinet.ts + public/news/assets/cab-*.png|.webp
 *
 * Запуск: npm run sync:cabinet-news
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
const EXISTING = path.join(ROOT, "lib/content/news.generated.ts");

const MONTHS_RU = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

/**
 * Чистые фото-фоны (без типографики). Готовые обложки из архива НЕ копировать —
 * на каждый пост генерируем уникальный SVG-оверлей в стиле старых обложек titlo.ru.
 * См. docs/news-cover-generation.md
 */
const COVER_BGS = [
  "cover-bg-03.jpg",
  "cover-bg-04.jpg",
  "cover-bg-05.jpg",
  "cover-bg-06.jpg",
  "cover-bg-07.jpg",
  // cover-bg-08 — с впечатанным текстом, не использовать
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
  { re: /seo[\s-]?отч[её]т|клиентск(ий|ого) отч/i, theme: "cabinet", label: "SEO-ОТЧЁТЫ", tag: "SEO-отчёты" },
  { re: /чек[\s-]?лист|checklist/i, theme: "cabinet", label: "SEO-ЧЕКЛИСТ", tag: "SEO-чеклист" },
  { re: /аудит\s*сайта|site.?audit/i, theme: "audit", label: "АУДИТ САЙТА", tag: "Аудит сайта" },
  { re: /релевантн|tlp|словосочетани/i, theme: "relevance", label: "РЕЛЕВАНТНОСТЬ", tag: "Анализ релевантности" },
  { re: /анализ\s*текста|текста\s*страниц/i, theme: "text", label: "АНАЛИЗ ТЕКСТА", tag: "Анализ текста" },
  { re: /мониторинг\s*позиц/i, theme: "monitoring", label: "МОНИТОРИНГ", tag: "Мониторинг позиций" },
  { re: /метрик/i, theme: "cabinet", label: "МЕТРИКА", tag: "Яндекс.Метрика" },
  { re: /проверк[аеи].*ссыл|донор/i, theme: "cabinet", label: "ССЫЛКИ", tag: "Проверка ссылок" },
  { re: /кластер/i, theme: "cabinet", label: "КЛАСТЕРИЗАЦИЯ", tag: "Кластеризация" },
  { re: /геозависим|локализац|коммерциализац/i, theme: "geo", label: "ГЕО", tag: "Гео и коммерция" },
  { re: /индексац/i, theme: "indexing", label: "ИНДЕКСАЦИЯ", tag: "Проверка индексации" },
  { re: /есенин/i, theme: "yesenin", label: "ЕСЕНИН", tag: "Проверка текста" },
  { re: /whois|dns|запис[ьи]\s*домена/i, theme: "dns", label: "DNS", tag: "Записи домена" },
  { re: /подсказ/i, theme: "suggestions", label: "ПОДСКАЗКИ", tag: "Поисковые подсказки" },
  { re: /тип(ы|ов)\s*сайт/i, theme: "siteTypes", label: "ТИПЫ САЙТОВ", tag: "Типы сайтов" },
  { re: /демо.?кабинет/i, theme: "brand", label: "ДЕМО", tag: "Демо-кабинет" },
  { re: /главн(ой|ая)|матриц(а|ы) сайт/i, theme: "cabinet", label: "ГЛАВНАЯ", tag: "Кабинет" },
];
function esc(str) {
  return String(str)
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$/g, "\\$");
}

function slugify(title) {
  const map = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "e",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "h",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "sch",
    ъ: "",
    ы: "y",
    ь: "",
    э: "e",
    ю: "yu",
    я: "ya",
  };
  return title
    .toLowerCase()
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function formatRuDate(iso) {
  const d = new Date(iso.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getDate()} ${MONTHS_RU[d.getMonth()]} ${d.getFullYear()}`;
}

function pickCoverMeta(title, excerpt = "", content = "") {
  const primary = `${title}\n${excerpt}`;
  for (const rule of COVER_RULES) {
    if (rule.re.test(primary)) return rule;
  }
  for (const rule of COVER_RULES) {
    if (rule.re.test(content)) return rule;
  }
  return { theme: "cabinet", label: "КАБИНЕТ ТИТЛО", tag: "Обновление" };
}

function pickBgFile(seed) {
  const n = Number.parseInt(String(seed).replace(/\D/g, "").slice(-6) || "0", 10);
  return COVER_BGS[n % COVER_BGS.length];
}

function coverSubtitle(title, tag) {
  const colon = title.indexOf(":");
  if (colon > 0 && colon < title.length - 2) {
    return title
      .slice(colon + 1)
      .trim()
      .replace(/\s+/g, " ")
      .slice(0, 52);
  }
  // убрать повтор модуля из начала
  let s = title.replace(/^(аудит сайта|анализатор релевантности|мониторинг позиций|проверка ссылок)\s*[—–-]?\s*/i, "").trim();
  if (!s || s.length < 8) s = tag;
  return s.slice(0, 52);
}

function escXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function splitLabel(label) {
  const words = String(label).trim().split(/\s+/);
  if (words.length < 2 || label.length <= 11) return [label, ""];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
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

  if (!fs.existsSync(bgPath)) {
    throw new Error(`нет фона ${bgFile}`);
  }

  const W = 1536;
  const H = 1024;
  const n = Number.parseInt(String(id).replace(/\D/g, "") || "0", 10);
  // Кроп слева/центр — место под крупный заголовок, как у эталона 8860a3…
  const positions = ["left", "left", "centre", "northwest", "west"];
  const position = positions[n % positions.length];

  const [line1, line2] = splitLabel(label);
  const fontSize = line2 ? 86 : 102;
  const ink = "#163a48";
  const badgePadX = 28;
  const badgePadY = 18;
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

  return `/news/assets/${baseName}.png`;
}

function htmlToParts(html) {
  const $ = cheerio.load(`<div id="root">${html}</div>`);
  const root = $("#root");
  root.find("script, style").remove();

  // Первый смысловой абзац после приветствия — основа заголовка.
  let leadP = "";
  root.find("p").each((_, el) => {
    if (leadP) return;
    const t = $(el).text().replace(/\s+/g, " ").trim();
    if (!t || /^доброго дня[!?.…\s]*$/i.test(t)) return;
    leadP = t;
  });

  const strong = root.find("strong").first().text().replace(/\s+/g, " ").trim();
  let title = "";
  if (strong && strong.length >= 18 && !/^доброго дня/i.test(strong)) {
    title = strong;
  } else if (leadP) {
    title = leadP
      .replace(/^доброго дня[!.,\s]*/i, "")
      .replace(/\s+[—–-]\s+.*$/, "")
      .trim();
    // Если strong короткий («Аудит сайта»), берём фразу до первой точки/двоеточия+длинный хвост
    const colon = title.indexOf(":");
    if (colon > 8 && colon < 90) {
      // оставить тему до двоеточия + короткое уточнение
      const after = title.slice(colon + 1).trim();
      const shortAfter = after.split(/[.;]/)[0].trim();
      if (shortAfter && shortAfter.length < 70) {
        title = `${title.slice(0, colon).trim()}: ${shortAfter}`;
      } else {
        title = title.slice(0, colon).trim();
      }
    }
  }

  title = title.replace(/\s+/g, " ").trim().replace(/[:\s]+$/, "");
  // Нормализуем падежные обрывки вида ««Аудите сайта»»
  title = title
    .replace(/^на\s+/i, "")
    .replace(/^в\s+/i, "")
    .replace(/^«аудаите/i, "«Аудит")
    .replace(/^«аудита\s+сайта»/i, "Аудит сайта")
    .replace(/^«аудите\s+сайта»/i, "Аудит сайта")
    .replace(/^«проверке\s+ссылок»/i, "Проверка ссылок")
    .replace(/^главной$/i, "Обновления главной и привязка Метрики");

  if (title.length > 110) title = `${title.slice(0, 107).trim()}…`;
  if (!title) title = "Обновление кабинета";

  // Более читаемые заголовки для коротких меток модуля
  if (/^аудит сайта$/i.test(title) && leadP) {
    const rest = leadP
      .replace(/^доброго дня[!.,\s]*/i, "")
      .replace(/^аудит сайта\s*[:—–-]?\s*/i, "")
      .trim();
    const bit = rest.split(/[.;]/)[0].trim();
    if (bit && bit.length > 12) title = `Аудит сайта: ${bit.slice(0, 90)}`;
  }
  if (/^мониторинг позиций$/i.test(title) && leadP) {
    const rest = leadP.replace(/^доброго дня[!.,\s]*/i, "").replace(/^мониторинг позиций\s*[—–-]?\s*/i, "").trim();
    const bit = rest.split(/[.;]/)[0].trim();
    if (bit && bit.length > 12) title = `Мониторинг позиций: ${bit.slice(0, 90)}`;
  }
  if (/^яндекс\.?метрика$/i.test(title) && leadP) {
    const rest = leadP.replace(/^доброго дня[!.,\s]*/i, "").replace(/^яндекс\.?метрика\s*[—–-]?\s*/i, "").trim();
    const bit = rest.split(/[.;]/)[0].trim();
    if (bit && bit.length > 12) title = `Яндекс.Метрика: ${bit.slice(0, 90)}`;
  }
  if (/^анализатор релевантности$/i.test(title) && leadP) {
    const rest = leadP
      .replace(/^доброго дня[!.,\s]*/i, "")
      .replace(/^анализатор релевантности\s*[—–-]?\s*/i, "")
      .trim();
    const bit = rest.split(/[.;]/)[0].trim();
    if (bit && bit.length > 12) title = `Анализатор релевантности: ${bit.slice(0, 90)}`;
  }
  if (/^кластеризация$/i.test(title) && leadP) {
    title = "Улучшения кластеризации и повседневных модулей";
  }

  const blocks = [];
  root.find("p, li").each((_, el) => {
    const t = $(el).text().replace(/\s+/g, " ").trim();
    if (!t || /^доброго дня[!?.…\s]*$/i.test(t)) return;
    if (blocks.some((b) => b.text === t)) return;
    blocks.push({ type: "p", text: t });
  });

  if (!blocks.length) {
    const plain = root.text().replace(/\s+/g, " ").trim().replace(/^доброго дня[!.,\s]*/i, "");
    if (plain) blocks.push({ type: "p", text: plain });
  }

  let excerpt = blocks[0]?.text || title;
  if (excerpt.length > 160) {
    excerpt = `${excerpt.slice(0, 157).replace(/\s+\S*$/, "")}…`;
  }

  return { title, excerpt, blocks };
}

function existingSlugs() {
  const src = fs.readFileSync(EXISTING, "utf8");
  const set = new Set();
  for (const m of src.matchAll(/slug:\s*"([^"]+)"/g)) set.add(m[1]);
  return set;
}

function emitTs(items) {
  const chunks = items.map((item) => {
    const blocks = item.blocks
      .map((b) => `      {\n        type: "p",\n        text: "${esc(b.text).replace(/"/g, '\\"')}",\n      }`)
      .join(",\n");
    const body = item.blocks
      .map((b) => `      "${esc(b.text).replace(/"/g, '\\"')}"`)
      .join(",\n");
    return `  {
    slug: "${item.slug}",
    title: "${esc(item.title).replace(/"/g, '\\"')}",
    date: "${item.date}",
    excerpt: "${esc(item.excerpt).replace(/"/g, '\\"')}",
    imageUrl: "${item.imageUrl}",
    blocks: [
${blocks}
    ],
    body: [
${body}
    ],
  }`;
  });

  return `/** Автогенерация из новостей кабинета: node scripts/sync-cabinet-news.mjs */
import type { NewsItem } from "./news.generated";

export const CABINET_NEWS_ITEMS: NewsItem[] = [
${chunks.join(",\n")}
];
`;
}

async function main() {
  if (!fs.existsSync(IN)) {
    console.error("Нет входного файла", IN);
    process.exit(1);
  }
  const rows = JSON.parse(fs.readFileSync(IN, "utf8"));
  const known = existingSlugs();
  const items = [];

  // newest first in JSON already
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const parts = htmlToParts(row.content || "");
    if (TITLE_OVERRIDES[row.id]) {
      parts.title = TITLE_OVERRIDES[row.id];
      if (!parts.excerpt || parts.excerpt.length < 40) {
        parts.excerpt = parts.title;
      }
    }
    let slug = slugify(parts.title);
    if (!slug) slug = `cabinet-news-${row.id}`;
    if (known.has(slug) || items.some((x) => x.slug === slug)) {
      slug = `${slug}-${row.id}`;
    }
    known.add(slug);

    const meta = pickCoverMeta(parts.title, parts.excerpt, row.content || "");
    const imageUrl = await makeCover({
      id: row.id,
      label: meta.label,
      tag: meta.tag,
      title: parts.title,
    });

    items.push({
      slug,
      title: parts.title,
      date: formatRuDate(row.created_at),
      excerpt: parts.excerpt,
      imageUrl,
      blocks: parts.blocks.slice(0, 12),
    });
    console.log(`✓ #${row.id} ${formatRuDate(row.created_at)} — ${parts.title}`);
  }

  fs.writeFileSync(OUT_TS, emitTs(items), "utf8");
  console.log(`\nзаписано ${items.length} → ${path.relative(ROOT, OUT_TS)}`);
}

await main();
