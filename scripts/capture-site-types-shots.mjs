/**
 * Скрины РЕАЛЬНОГО UI «Типы сайтов в выдаче» из демо-кабинета.
 *
 *   node scripts/capture-site-types-shots.mjs
 *   CABINET_BASE=http://127.0.0.1:3002 node scripts/capture-site-types-shots.mjs
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
    document
      .querySelectorAll(
        ".main-sidebar, aside.main-sidebar, .main-header, .demo-cabinet-banner, .control-sidebar, .preloader, .main-footer, #scroll-to-top, .cabinet-feedback, #cabinet-feedback-root, .cabinet-module-description"
      )
      .forEach((el) => el.remove());
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
      .main-sidebar, aside.main-sidebar, .main-header, .demo-cabinet-banner,
      .cabinet-feedback, #cabinet-feedback-root, .cabinet-module-description { display: none !important; }
      .content-wrapper { margin-left: 0 !important; width: 100% !important; }
      body { overflow: auto !important; }
    `,
  });
  await page.waitForTimeout(300);
}

async function shotClip(page, box, base) {
  const raw = path.join(ASSETS, `_raw-${base}.png`);
  await page.screenshot({
    path: raw,
    type: "png",
    clip: {
      x: Math.max(0, Math.floor(box.x)),
      y: Math.max(0, Math.floor(box.y)),
      width: Math.min(1580, Math.max(200, Math.ceil(box.width))),
      height: Math.min(1600, Math.max(160, Math.ceil(box.height))),
    },
  });
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
      viewport: { width: 1440, height: 1600 },
      deviceScaleFactor: 2,
      locale: "ru-RU",
    })
  ).newPage();

  await page.goto(`${CABINET}/demo-cabinet?to=${encodeURIComponent("/site-types")}`, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  await page.waitForURL(/site-types/, { timeout: 90_000 });
  console.log("demo →", page.url());
  if (page.url().includes("/login")) {
    throw new Error(`Демо не пустил — ${CABINET}`);
  }

  await page.waitForSelector("#cabinetStPage", { timeout: 60_000 });
  // витрина открывает историю (?history=id) → результаты
  await page.waitForSelector("#cabinetStResultsWrap:not(.d-none)", { timeout: 90_000 });
  await page.waitForSelector("#cabinetStVerdictTitle", { timeout: 30_000 });
  await page.waitForFunction(() => {
    const t = document.getElementById("cabinetStVerdictTitle");
    return t && (t.textContent || "").trim().length > 0;
  }, { timeout: 30_000 });
  await page.waitForSelector("#cabinetStResults tbody tr", { timeout: 30_000 });
  await page.waitForTimeout(1200);
  await stripChrome(page);

  // ——— 01: форма (лид + форма), без результатов ———
  await page.evaluate(() => {
    const wrap = document.getElementById("cabinetStResultsWrap");
    if (wrap) wrap.style.display = "none";
    const hist = document.getElementById("cabinetStHistoryWrap");
    if (hist) hist.style.display = "none";
    const catalogs = document.querySelector(".cabinet-st-catalogs");
    if (catalogs) catalogs.style.display = "none";
  });
  await page.waitForTimeout(200);
  const formBox = await page.evaluate(() => {
    const pageRoot = document.getElementById("cabinetStPage");
    const lead = pageRoot.querySelector(".cabinet-st-lead");
    const form = document.getElementById("cabinetStForm");
    const top = (lead || form).getBoundingClientRect().top - 6;
    const bottom = form.getBoundingClientRect().bottom + 10;
    const r = pageRoot.getBoundingClientRect();
    return {
      x: Math.max(0, Math.floor(r.left)),
      y: Math.max(0, Math.floor(top)),
      width: Math.min(1580, Math.max(400, Math.ceil(r.width))),
      height: Math.min(1100, Math.max(280, Math.ceil(bottom - top))),
    };
  });
  await shotClip(page, formBox, "site-types-shot-form");

  // вернуть результаты
  await page.evaluate(() => {
    const wrap = document.getElementById("cabinetStResultsWrap");
    if (wrap) wrap.style.display = "";
    const hist = document.getElementById("cabinetStHistoryWrap");
    if (hist) hist.style.display = "";
  });
  await stripChrome(page);

  // ——— 02: вердикт + mix (доли типов) ———
  await page.locator("#cabinetStVerdict").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const metricsBox = await page.evaluate(() => {
    const verdict = document.getElementById("cabinetStVerdict");
    const mix = document.getElementById("cabinetStMix");
    const top = verdict.getBoundingClientRect().top - 8;
    const left = Math.min(verdict.getBoundingClientRect().left, mix?.getBoundingClientRect().left ?? Infinity);
    const right = Math.max(verdict.getBoundingClientRect().right, mix?.getBoundingClientRect().right ?? 0);
    const bottom = Math.max(verdict.getBoundingClientRect().bottom, mix?.getBoundingClientRect().bottom ?? 0) + 10;
    return {
      x: Math.max(0, Math.floor(left)),
      y: Math.max(0, Math.floor(top)),
      width: Math.min(1580, Math.max(400, Math.ceil(right - left))),
      height: Math.min(700, Math.max(160, Math.ceil(bottom - top))),
    };
  });
  await shotClip(page, metricsBox, "site-types-shot-verdict");

  // ——— 03: таблица SERP по типам ———
  await page.evaluate(() => {
    const lead = document.querySelector(".cabinet-st-lead");
    if (lead) lead.style.display = "none";
    const form = document.getElementById("cabinetStForm");
    if (form) form.style.display = "none";
    const hist = document.getElementById("cabinetStHistoryWrap");
    if (hist) hist.style.display = "none";
    // свернуть матрицу/хосты если мешают — оставить вердикт? лучше только таблица
    const phrase = document.getElementById("cabinetStPhraseBlock");
    if (phrase) phrase.style.display = "none";
    const hosts = document.getElementById("cabinetStHostsBlock");
    if (hosts) hosts.style.display = "none";
    const mix = document.getElementById("cabinetStMix");
    if (mix) mix.style.display = "none";
    const verdict = document.getElementById("cabinetStVerdict");
    if (verdict) verdict.style.display = "none";
  });
  await page.waitForTimeout(200);
  await page.locator("#cabinetStResults").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const tableBox = await page.evaluate(() => {
    const meta = document.getElementById("cabinetStResultsMeta")?.closest(".d-flex, .mb-2, div");
    const tabs = document.getElementById("cabinetStQueryTabs");
    const table = document.getElementById("cabinetStResults");
    const filter = document.getElementById("cabinetStFilterType");
    const tops = [meta, tabs, filter?.closest(".d-flex, .mb-2, div"), table].filter(Boolean);
    let top = Infinity;
    let left = Infinity;
    let right = -Infinity;
    let bottom = -Infinity;
    tops.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.height < 2 && r.width < 2) return;
      top = Math.min(top, r.top);
      left = Math.min(left, r.left);
      right = Math.max(right, r.right);
      bottom = Math.max(bottom, r.bottom);
    });
    const wrap = document.getElementById("cabinetStResultsWrap");
    const wr = wrap.getBoundingClientRect();
    return {
      x: Math.max(0, Math.floor(Math.min(left, wr.left))),
      y: Math.max(0, Math.floor(top === Infinity ? wr.top : top - 8)),
      width: Math.min(1580, Math.max(400, Math.ceil(wr.width))),
      height: Math.min(1000, Math.max(280, Math.ceil((bottom === -Infinity ? wr.bottom : bottom) - (top === Infinity ? wr.top : top) + 16))),
    };
  });
  await shotClip(page, tableBox, "site-types-shot-table");

  await browser.close();
  console.log("done —", CABINET);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
