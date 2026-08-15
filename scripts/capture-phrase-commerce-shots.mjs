/**
 * Скрины РЕАЛЬНОГО UI «Гео / локализация / коммерция» из демо-кабинета.
 *
 *   node scripts/capture-phrase-commerce-shots.mjs
 *   CABINET_BASE=http://127.0.0.1:3002 node scripts/capture-phrase-commerce-shots.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.join(__dirname, "../public/modules/assets");
const CABINET = (process.env.CABINET_BASE || "https://cabinet.titlo.ru").replace(/\/$/, "");

async function saveCover(raw, base) {
  const png = path.join(ASSETS, `${base}.png`);
  await sharp(raw)
    .resize({ width: 1600, withoutEnlargement: true })
    .png({ compressionLevel: 8 })
    .toFile(png);
  await sharp(png).webp({ quality: 90, effort: 5 }).toFile(png.replace(/\.png$/, ".webp"));
  const meta = await sharp(png).metadata();
  fs.unlinkSync(raw);
  console.log("wrote", base, meta.width + "x" + meta.height, fs.statSync(png).size);
}

async function stripChrome(page) {
  await page.evaluate(() => {
    document.querySelectorAll(
      ".main-sidebar, aside.main-sidebar, .main-header, .demo-cabinet-banner, .control-sidebar, .preloader, .main-footer, #scroll-to-top"
    ).forEach((el) => el.remove());
    document.body.classList.remove("sidebar-mini", "sidebar-collapse", "layout-fixed", "sidebar-open");
    const cw = document.querySelector(".content-wrapper");
    if (cw) {
      cw.style.cssText += ";margin-left:0!important;padding-left:0!important;width:100%!important;";
    }
    const content = document.querySelector(".content-wrapper .content");
    if (content) content.style.cssText += ";margin-left:0!important;padding-left:12px!important;";
  });
  await page.addStyleTag({
    content: `
      .main-sidebar, aside.main-sidebar, .main-header, .demo-cabinet-banner { display: none !important; }
      .content-wrapper { margin-left: 0 !important; width: 100% !important; }
      body { overflow: auto !important; }
    `,
  });
  await page.waitForTimeout(300);
}

async function shotEl(page, selector, base, { padY = 8, maxH = 1200 } = {}) {
  const box = await page.evaluate(
    ({ selector, padY, maxH }) => {
      const el = document.querySelector(selector);
      if (!el) return null;
      el.scrollIntoView({ block: "start" });
      const r = el.getBoundingClientRect();
      // клип строго по элементу — без сайдбара
      return {
        x: Math.max(0, Math.floor(r.left)),
        y: Math.max(0, Math.floor(r.top - padY)),
        width: Math.min(1580, Math.max(200, Math.ceil(r.width))),
        height: Math.min(maxH, Math.max(120, Math.ceil(r.height + padY * 2))),
      };
    },
    { selector, padY, maxH }
  );
  if (!box) throw new Error(`Не найден ${selector}`);
  const raw = path.join(ASSETS, `_raw-${base}.png`);
  await page.screenshot({ path: raw, type: "png", clip: box });
  await saveCover(raw, base);
}

async function main() {
  fs.mkdirSync(ASSETS, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    channel: process.env.PW_CHANNEL || "chrome",
  });
  const page = await (
    await browser.newContext({
      viewport: { width: 1440, height: 1400 },
      deviceScaleFactor: 2,
      locale: "ru-RU",
    })
  ).newPage();

  await page.goto(`${CABINET}/demo-cabinet?to=${encodeURIComponent("/phrase-commerce")}`, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  await page.waitForURL(/phrase-commerce/, { timeout: 90_000 });
  console.log("demo →", page.url());
  if (page.url().includes("/login")) {
    throw new Error(`Демо не пустил — ${CABINET}`);
  }

  await page.waitForSelector("#cabinetPcPage", { timeout: 60_000 });
  await page.waitForSelector("#cabinetPcSummary .cabinet-pc-summary__card", { timeout: 90_000 });
  await page.waitForSelector("#cabinetPcResults tbody tr", { timeout: 30_000 });
  await page.waitForTimeout(1200);
  await stripChrome(page);

  // ——— 01: форма (лид + форма, без результатов) ———
  await page.evaluate(() => {
    const wrap = document.getElementById("cabinetPcResultsWrap");
    if (wrap) wrap.style.display = "none";
    document.querySelectorAll(".cabinet-pc-page > .px-4.pb-4").forEach((el) => {
      el.style.display = "none";
    });
  });
  await page.waitForTimeout(200);
  // лид + форма внутри #cabinetPcPage
  const formBox = await page.evaluate(() => {
    const pageRoot = document.getElementById("cabinetPcPage");
    const lead = pageRoot.querySelector(".cabinet-pc-lead");
    const form = document.getElementById("cabinetPcForm");
    const top = (lead || form).getBoundingClientRect().top - 6;
    const bottom = form.getBoundingClientRect().bottom + 10;
    const left = pageRoot.getBoundingClientRect().left;
    const width = pageRoot.getBoundingClientRect().width;
    return {
      x: Math.max(0, Math.floor(left)),
      y: Math.max(0, Math.floor(top)),
      width: Math.min(1580, Math.max(400, Math.ceil(width))),
      height: Math.min(1100, Math.max(280, Math.ceil(bottom - top))),
    };
  });
  {
    const raw = path.join(ASSETS, `_raw-phrase-commerce-shot-form.png`);
    await page.screenshot({ path: raw, type: "png", clip: formBox });
    await saveCover(raw, "phrase-commerce-shot-form");
  }

  // вернуть результаты
  await page.evaluate(() => {
    const wrap = document.getElementById("cabinetPcResultsWrap");
    if (wrap) wrap.style.display = "";
  });
  await stripChrome(page);

  // ——— 02: только сводные карточки ———
  await shotEl(page, "#cabinetPcSummary", "phrase-commerce-shot-metrics", { padY: 10, maxH: 400 });

  // ——— 03: фильтры + таблица ———
  await page.evaluate(() => {
    document.querySelectorAll(".cabinet-pc-page > .px-4.pb-4").forEach((el) => {
      el.style.display = "none";
    });
  });
  // обернём фильтры+таблицу во временный маркер через clip от filters до table
  const tableBox = await page.evaluate(() => {
    const filters = document.getElementById("cabinetPcFilters");
    const table = document.getElementById("cabinetPcResults");
    const top = filters.getBoundingClientRect().top - 8;
    const left = Math.min(filters.getBoundingClientRect().left, table.getBoundingClientRect().left);
    const right = Math.max(filters.getBoundingClientRect().right, table.getBoundingClientRect().right);
    const bottom = table.getBoundingClientRect().bottom + 12;
    return {
      x: Math.max(0, Math.floor(left)),
      y: Math.max(0, Math.floor(top)),
      width: Math.min(1580, Math.max(400, Math.ceil(right - left))),
      height: Math.min(900, Math.max(240, Math.ceil(bottom - top))),
    };
  });
  const raw = path.join(ASSETS, `_raw-phrase-commerce-shot-table.png`);
  await page.screenshot({ path: raw, type: "png", clip: tableBox });
  await saveCover(raw, "phrase-commerce-shot-table");

  await browser.close();
  console.log("done —", CABINET);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
