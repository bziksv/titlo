/**
 * Device-рендеры для карточек главной: UI Титло в планшете на чёрном фоне
 * (как старый RedBox-мокап, но с нашими интерфейсами).
 *
 * Источники:
 *  - готовые скрины кабинета (monitoring-v2 и т.п.)
 *  - либо скрин демо-виджета с лендинга (localhost:3003)
 *
 * Запуск: node scripts/render-home-device-cards.mjs
 * Опц.:  HOME_BASE=http://127.0.0.1:3003
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const ASSETS = path.join(ROOT, "public/modules/assets");
const BASE = process.env.HOME_BASE || "http://127.0.0.1:3003";

const W = 1200;
const H = 900;
const BEZEL = 22;
const RADIUS = 36;
const SCREEN_RADIUS = 18;

/** @type {{ id: string, out: string, file?: string, url?: string, waitMs?: number }[]} */
const CARDS = [
  {
    id: "relevance",
    out: "home-device-relevance.png",
    url: "/analiz-relevantnosti/",
    file: "442df9bc371ac5d8.png",
  },
  {
    id: "positions",
    out: "home-device-positions.png",
    file: "monitoring-v2-shot-list-v7.png",
  },
  {
    id: "cluster",
    out: "home-device-cluster.png",
    url: "/klasterizator-klyuchevykh-slov/",
    file: "7ba8fc0938346394.png",
  },
  {
    id: "competitors",
    out: "home-device-competitors.png",
    url: "/analiz-konkurentov/",
  },
  {
    id: "text",
    out: "home-device-text.png",
    url: "/analiz-teksta/",
    file: "text-anal-shot-table.png",
  },
  {
    id: "sites",
    out: "home-device-sites.png",
    url: "/monitoring-saytov/",
    file: "f8bb432c0ab8457f.png",
  },
  {
    id: "meta",
    out: "home-device-meta.png",
    url: "/proverka-meta-tegov-online/",
  },
  {
    id: "links",
    out: "home-device-links.png",
    url: "/otslezhivanie-ssylok/",
    file: "e099cc385364f9d0.png",
  },
];
function tabletSvg({ screenW, screenH, screenX, screenY }) {
  const outerW = screenW + BEZEL * 2;
  const outerH = screenH + BEZEL * 2;
  const outerX = screenX - BEZEL;
  const outerY = screenY - BEZEL;
  return Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#05070f"/>
      <stop offset="55%" stop-color="#0a1020"/>
      <stop offset="100%" stop-color="#05070f"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#1e3a8a" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#05070f" stop-opacity="0"/>
    </radialGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="28" stdDeviation="28" flood-color="#000" flood-opacity="0.65"/>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect width="100%" height="100%" fill="url(#glow)"/>
  <!-- device body -->
  <rect x="${outerX}" y="${outerY}" width="${outerW}" height="${outerH}" rx="${RADIUS}" ry="${RADIUS}"
        fill="#12151c" stroke="#2a3140" stroke-width="2" filter="url(#shadow)"/>
  <!-- inner rim -->
  <rect x="${outerX + 6}" y="${outerY + 6}" width="${outerW - 12}" height="${outerH - 12}"
        rx="${RADIUS - 8}" ry="${RADIUS - 8}" fill="#0b0e14" stroke="#1a1f2a" stroke-width="1"/>
  <!-- camera dot -->
  <circle cx="${outerX + outerW / 2}" cy="${outerY + 11}" r="3.5" fill="#2a3140"/>
  <!-- left buttons -->
  <rect x="${outerX - 4}" y="${outerY + outerH * 0.28}" width="4" height="42" rx="2" fill="#1a1f2a"/>
  <rect x="${outerX - 4}" y="${outerY + outerH * 0.38}" width="4" height="64" rx="2" fill="#1a1f2a"/>
</svg>`);
}

async function prepareScreen(inputPath) {
  const screenW = W - BEZEL * 2 - 80;
  const screenH = H - BEZEL * 2 - 100;
  const screenX = Math.round((W - screenW) / 2);
  const screenY = Math.round((H - screenH) / 2) + 6;

  const roundedMask = Buffer.from(`
<svg width="${screenW}" height="${screenH}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" rx="${SCREEN_RADIUS}" ry="${SCREEN_RADIUS}" fill="#fff"/>
</svg>`);

  const screen = await sharp(inputPath)
    .rotate()
    .resize(screenW, screenH, { fit: "cover", position: "top" })
    .composite([{ input: roundedMask, blend: "dest-in" }])
    .png()
    .toBuffer();

  return { screen, screenW, screenH, screenX, screenY };
}

async function renderDevice(inputPath, outPath) {
  const { screen, screenW, screenH, screenX, screenY } = await prepareScreen(inputPath);
  const frame = tabletSvg({ screenW, screenH, screenX, screenY });

  await sharp(frame)
    .composite([{ input: screen, top: screenY, left: screenX }])
    .png({ compressionLevel: 9 })
    .toFile(outPath);

  // webp companion for cards
  const webp = outPath.replace(/\.png$/i, ".webp");
  await sharp(outPath)
    .resize({ width: 800, withoutEnlargement: true })
    .webp({ quality: 88, effort: 5 })
    .toFile(webp);

  return outPath;
}

async function captureDemo(page, urlPath) {
  const url = `${BASE}${urlPath}`;
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.waitForTimeout(1200);

  // липкий хедер сайта иначе рисуется поверх карточки в скрине
  await page.addStyleTag({
    content: `
      header, [data-site-header], .site-header { visibility: hidden !important; }
      [data-home-demo-card] { scroll-margin-top: 0 !important; }
    `,
  });

  let target = page.locator("[data-home-demo-card]").first();
  if (!(await target.count())) {
    target = page.locator("section .rounded-2xl.bg-white").filter({ has: page.locator("form, input, textarea, button") }).first();
  }
  if (!(await target.count())) {
    throw new Error(`no demo card on ${urlPath}`);
  }

  await target.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  const tmp = path.join(ASSETS, `_tmp-capture-${urlPath.replace(/\W+/g, "")}.png`);
  await target.screenshot({ path: tmp, type: "png" });
  return tmp;
}

async function main() {
  fs.mkdirSync(ASSETS, { recursive: true });

  const needCapture = CARDS.some((c) => c.url);
  let browser = null;
  let page = null;
  if (needCapture) {
    browser = await chromium.launch({
      headless: true,
      channel: process.env.PW_CHANNEL || "chrome",
    });
    page = await browser.newPage({
      viewport: { width: 1440, height: 1100 },
      deviceScaleFactor: 2,
    });
  }

  const temps = [];

  try {
    for (const card of CARDS) {
      let srcPath = card.file ? path.join(ASSETS, card.file) : null;
      let captured = null;

      if (card.url && page) {
        try {
          captured = await captureDemo(page, card.url);
          temps.push(captured);
          const meta = await sharp(captured).metadata();
          // слишком пустой/маленький кроп — fallback на file
          if ((meta.width || 0) > 400 && (meta.height || 0) > 280) {
            srcPath = captured;
          } else if (!srcPath || !fs.existsSync(srcPath)) {
            srcPath = captured;
          }
          console.log(`✓ capture ${card.id} ← ${card.url}`);
        } catch (e) {
          console.warn(`⚠ capture ${card.id}: ${e.message}`);
        }
      }

      if (!srcPath || !fs.existsSync(srcPath)) {
        throw new Error(`нет источника для ${card.id}`);
      }

      const outPath = path.join(ASSETS, card.out);
      await renderDevice(srcPath, outPath);
      console.log(`→ ${card.out}`);
    }
  } finally {
    if (browser) await browser.close();
    for (const t of temps) {
      try {
        fs.unlinkSync(t);
      } catch {
        /* ignore */
      }
    }
  }
}

await main();
