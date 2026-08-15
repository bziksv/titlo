/**
 * Скрины РЕАЛЬНОГО UI «Удаление дубликатов» из демо-кабинета.
 *
 *   node scripts/capture-dedup-shots.mjs
 *   CABINET_BASE=http://127.0.0.1:3002 node scripts/capture-dedup-shots.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.join(__dirname, "../public/modules/assets");
const CABINET = (process.env.CABINET_BASE || "https://cabinet.titlo.ru").replace(/\/$/, "");
const FRAME_H = 900;

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
    const hide = (el) => {
      if (el instanceof HTMLElement) el.style.setProperty("display", "none", "important");
    };
    document
      .querySelectorAll(
        [
          ".main-sidebar",
          "aside.main-sidebar",
          ".main-header",
          "nav.main-header",
          ".navbar",
          ".demo-cabinet-banner",
          "[class*='demo-cabinet']",
          ".control-sidebar",
          ".preloader",
          ".main-footer",
          "#scroll-to-top",
          ".cabinet-feedback",
          "#cabinet-feedback-root",
          ".cabinet-module-description",
        ].join(", ")
      )
      .forEach(hide);
    document.querySelectorAll("a, button, .alert").forEach((el) => {
      const t = (el.innerText || "").trim();
      if (/Выйти из демо|Демо-режим|Это демо/i.test(t) && t.length < 120) {
        hide(el.closest(".alert, .banner, .navbar, .d-flex, header, .sticky-top") || el);
      }
    });
    document.body.classList.remove("sidebar-mini", "layout-fixed", "sidebar-open");
    document.body.classList.add("sidebar-collapse");
    const cw = document.querySelector(".content-wrapper");
    if (cw instanceof HTMLElement) {
      cw.style.cssText += ";margin-left:0!important;padding-left:0!important;width:100%!important;";
    }
    const content = document.querySelector(".content-wrapper .content");
    if (content instanceof HTMLElement) {
      content.style.cssText += ";margin-left:0!important;padding-left:12px!important;";
    }
    document.querySelectorAll(".badge, small, span").forEach((el) => {
      if (/v\d+\.\d+/i.test(el.innerText || "") && (el.innerText || "").length < 20) hide(el);
    });
  });
  await page.addStyleTag({
    content: `
      .main-sidebar, aside.main-sidebar, .main-header, nav.main-header, .navbar,
      .demo-cabinet-banner, [class*='demo-cabinet'], .cabinet-module-description,
      .cabinet-feedback, #cabinet-feedback-root, .toasts-top-right, .toast { display: none !important; }
      .content-wrapper { margin-left: 0 !important; width: 100% !important; }
      body { overflow: auto !important; }
    `,
  });
  await page.waitForTimeout(250);
}

async function shotSelector(page, selector, base, { maxH = FRAME_H } = {}) {
  const loc = page.locator(selector).first();
  await loc.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return;
    el.scrollIntoView({ block: "start", inline: "nearest" });
    const r = el.getBoundingClientRect();
    if (r.top < 0 || r.top > 40) window.scrollBy(0, r.top - 8);
  }, selector);
  await page.waitForTimeout(200);

  const box = await loc.boundingBox();
  if (!box || box.height < 60) {
    throw new Error(`${base}: пустой/маленький box для ${selector} → ${JSON.stringify(box)}`);
  }
  const raw = path.join(ASSETS, `_raw-${base}.png`);
  const vh = page.viewportSize()?.height || 1600;
  const maxAvail = Math.max(200, vh - Math.max(0, Math.floor(box.y)) - 4);
  const h = Math.min(maxH, Math.max(180, Math.ceil(box.height + 8)), maxAvail);
  await page.screenshot({
    path: raw,
    type: "png",
    clip: {
      x: Math.max(0, Math.floor(box.x)),
      y: Math.max(0, Math.floor(box.y)),
      width: Math.min(1580, Math.max(200, Math.ceil(box.width))),
      height: h,
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

  await page.goto(`${CABINET}/demo-cabinet?to=${encodeURIComponent("/duplicates")}`, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  await page.waitForTimeout(2500);
  console.log("demo →", page.url());
  if (page.url().includes("/login")) {
    throw new Error(`Демо не пустил — ${CABINET}`);
  }

  await page.waitForSelector(".cabinet-duplicates-page, #cabinet-dup-source", { timeout: 60_000 });
  await page.waitForTimeout(1500);
  await stripChrome(page);

  const hasResult = await page.evaluate(() => {
    const r = document.querySelector("#cabinet-dup-text");
    return !!(r && String(r.value || "").trim().length > 0);
  });
  if (!hasResult) {
    const sample = `купить диван москва
купить диван москва
угловой диван

диван кровать
угловой диван
доставка дивана
купить диваны недорого
доставка дивана
`;
    await page.locator("#cabinet-dup-source").fill(sample);
    await page.locator("#cabinet-dup-opt-extra-space").check();
    await page.locator("#cabinet-dup-opt-trim").check();
    await page.locator("#cabinet-dup-opt-empty").check();
    await page.locator("#cabinet-dup-opt-dedup").check();
    await page.locator("#cabinet-dup-opt-dedup-ci").check();
    await page.locator("#cabinet-dup-opt-sort").check();
    await page.locator("[data-dup-process], button:has-text('Удалить дубликаты'), button:has-text('Обработать')").first().click();
    await page.waitForTimeout(800);
    await stripChrome(page);
  }

  console.log(
    "result lines",
    await page.evaluate(() =>
      String(document.querySelector("#cabinet-dup-text")?.value || "")
        .split("\n")
        .filter((l) => l.trim()).length
    )
  );

  // ——— 01: исходник + результат (шаг 1) ———
  await page.evaluate(() => {
    const step1 = document.querySelector("#cabinet-dup-step-1-title")?.closest("section");
    if (step1) step1.setAttribute("data-capture-dup-lists", "1");
  });
  await shotSelector(page, "[data-capture-dup-lists='1']", "dedup-shot-lists", { maxH: FRAME_H });

  // ——— 02: фильтры (шаг 2) ———
  await page.evaluate(() => {
    const step2 = document.querySelector("#cabinet-dup-step-2-title")?.closest("section");
    if (step2) step2.setAttribute("data-capture-dup-filters", "1");
  });
  await shotSelector(page, "[data-capture-dup-filters='1']", "dedup-shot-filters", { maxH: FRAME_H });

  // ——— 03: KPI + результат ———
  await page.evaluate(() => {
    const pageRoot = document.querySelector(".cabinet-duplicates-page");
    if (!pageRoot) return;
    pageRoot.querySelectorAll("section.cabinet-dup-step").forEach((sec) => {
      if (sec.querySelector("#cabinet-dup-step-1-title, #cabinet-dup-step-2-title, #cabinet-dup-step-3-title")) {
        // шаг 1 спрячем целиком кроме результата — проще: hide step1 source, keep result via bundle
        if (sec.querySelector("#cabinet-dup-step-1-title")) {
          // hide presets/actions in step1 but we'll rebuild bundle
        }
        if (sec.querySelector("#cabinet-dup-step-2-title, #cabinet-dup-step-3-title")) {
          sec.style.setProperty("display", "none", "important");
          sec.setAttribute("data-capture-dup-hidden", "1");
        }
      }
    });
    const hint = pageRoot.querySelector(".cabinet-dup-hint");
    if (hint) hint.style.setProperty("display", "none", "important");
    const step1 = document.querySelector("#cabinet-dup-step-1-title")?.closest("section");
    if (step1) {
      const sourcePane = step1.querySelector(".cabinet-dup-pane--source");
      const presets = step1.querySelector(".cabinet-dup-presets")?.closest(".d-flex");
      const drop = step1.querySelector(".cabinet-dup-drop-hint");
      if (sourcePane) sourcePane.style.setProperty("display", "none", "important");
      if (presets) presets.style.setProperty("display", "none", "important");
      if (drop) drop.style.setProperty("display", "none", "important");
      // hide clear button bar if left alone
      step1.querySelectorAll("[data-dup-clear]").forEach((btn) => {
        const bar = btn.closest(".d-flex");
        if (bar) bar.style.setProperty("display", "none", "important");
      });
    }
    const kpi = pageRoot.querySelector(".cabinet-dup-kpi");
    const resultPane = pageRoot.querySelector(".cabinet-dup-pane--result");
    if (kpi && resultPane) {
      const wrap = document.createElement("div");
      wrap.setAttribute("data-capture-dup-bundle", "1");
      wrap.style.cssText = "display:block;background:#fff;";
      kpi.parentNode.insertBefore(wrap, kpi);
      wrap.appendChild(kpi);
      wrap.appendChild(resultPane);
    }
  });
  await page.waitForTimeout(200);
  await stripChrome(page);
  await shotSelector(page, "[data-capture-dup-bundle='1']", "dedup-shot-result", { maxH: FRAME_H });

  await browser.close();
  console.log("done —", CABINET);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
