/**
 * Скрины РЕАЛЬНОГО UI «Сравнение списков» из демо-кабинета.
 *
 *   node scripts/capture-list-compare-shots.mjs
 *   CABINET_BASE=http://127.0.0.1:3002 node scripts/capture-list-compare-shots.mjs
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

  await page.goto(`${CABINET}/demo-cabinet?to=${encodeURIComponent("/list-comparison")}`, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  await page.waitForTimeout(2500);
  console.log("demo →", page.url());
  if (page.url().includes("/login")) {
    throw new Error(`Демо не пустил — ${CABINET}`);
  }

  await page.waitForSelector(".cabinet-list-comparison-page, #cabinet-lc-list-a", { timeout: 60_000 });
  await page.waitForTimeout(1500);
  await stripChrome(page);

  // Демо-showcase обычно уже заполнил и прогнал; если нет — подставим сами
  const hasResult = await page.evaluate(() => {
    const r = document.querySelector("#cabinet-lc-result");
    return !!(r && String(r.value || "").trim().length > 0);
  });
  if (!hasResult) {
    const listA = `купить диван
угловой диван
диван кровать
доставка дивана
ремонт мебели`;
    const listB = `угловой диван
пуф в гостиную
диван кровать
чехол на диван
доставка дивана`;
    await page.locator("#cabinet-lc-list-a").fill(listA);
    await page.locator("#cabinet-lc-list-b").fill(listB);
    await page.locator("#cabinet-lc-opt-ci").check();
    await page.locator("#cabinet-lc-opt-sort").check();
    await page.locator("[data-lc-process]").click();
    await page.waitForTimeout(800);
    await stripChrome(page);
  }

  console.log(
    "result lines",
    await page.evaluate(() =>
      String(document.querySelector("#cabinet-lc-result")?.value || "")
        .split("\n")
        .filter((l) => l.trim()).length
    )
  );

  // ——— 01: два списка (шаг 1) ———
  await page.evaluate(() => {
    const pageRoot = document.querySelector(".cabinet-list-comparison-page");
    if (!pageRoot) return;
    const step1 = pageRoot.querySelector("#cabinet-lc-step-1-title")?.closest("section");
    if (step1) {
      step1.setAttribute("data-capture-lc-lists", "1");
      return;
    }
    const panes = pageRoot.querySelectorAll(".cabinet-lc-list-pane");
    if (panes.length >= 2) {
      let el = panes[0].parentElement;
      for (let i = 0; i < 6 && el && el !== pageRoot; i++) {
        if (el.querySelectorAll(".cabinet-lc-list-pane").length >= 2) {
          el.setAttribute("data-capture-lc-lists", "1");
          return;
        }
        el = el.parentElement;
      }
    }
  });
  await shotSelector(page, "[data-capture-lc-lists='1']", "list-compare-shot-lists", { maxH: FRAME_H });

  // ——— 02: тип сравнения (шаг 2) ———
  await page.evaluate(() => {
    const pageRoot = document.querySelector(".cabinet-list-comparison-page");
    if (!pageRoot) return;
    const step2 = pageRoot.querySelector("#cabinet-lc-step-2-title")?.closest("section");
    if (step2) step2.setAttribute("data-capture-lc-modes", "1");
  });
  await shotSelector(page, "[data-capture-lc-modes='1']", "list-compare-shot-modes", { maxH: FRAME_H });

  // ——— 03: KPI + результат ———
  await page.evaluate(() => {
    const pageRoot = document.querySelector(".cabinet-list-comparison-page");
    if (!pageRoot) return;
    const kpi = pageRoot.querySelector(".cabinet-lc-kpi");
    const result = pageRoot.querySelector(".cabinet-lc-result");
    if (kpi && result) {
      // общий предок для кадра «сводка + результат»
      let el = kpi;
      for (let i = 0; i < 8 && el; i++) {
        if (el.contains(result)) {
          el.setAttribute("data-capture-lc-result", "1");
          return;
        }
        el = el.parentElement;
      }
    }
    if (result) result.setAttribute("data-capture-lc-result", "1");
  });
  // спрятать шаги 1–3, оставить KPI + результат в кадре страницы
  await page.evaluate(() => {
    const pageRoot = document.querySelector(".cabinet-list-comparison-page");
    if (!pageRoot) return;
    pageRoot.querySelectorAll("section").forEach((sec) => {
      if (sec.classList.contains("cabinet-lc-result")) return;
      if (sec.querySelector("#cabinet-lc-step-1-title, #cabinet-lc-step-2-title, #cabinet-lc-step-3-title")) {
        sec.style.setProperty("display", "none", "important");
        sec.setAttribute("data-capture-lc-hidden", "1");
      }
    });
    // пометить блок: kpi + result
    const kpi = pageRoot.querySelector(".cabinet-lc-kpi");
    const result = pageRoot.querySelector(".cabinet-lc-result");
    if (kpi) kpi.setAttribute("data-capture-lc-kpi", "1");
    if (result) result.setAttribute("data-capture-lc-result-only", "1");
    // wrap marker on page root for joint shot
    pageRoot.setAttribute("data-capture-lc-out", "1");
  });
  await page.waitForTimeout(200);
  await stripChrome(page);

  // кадр: KPI + result (без длинных списков ввода)
  await page.evaluate(() => {
    const kpi = document.querySelector("[data-capture-lc-kpi='1']");
    const result = document.querySelector("[data-capture-lc-result-only='1']");
    if (!kpi || !result) return;
    const wrap = document.createElement("div");
    wrap.setAttribute("data-capture-lc-bundle", "1");
    wrap.style.cssText = "display:block;background:#fff;";
    kpi.parentNode.insertBefore(wrap, kpi);
    wrap.appendChild(kpi);
    wrap.appendChild(result);
  });
  await page.waitForTimeout(200);
  await shotSelector(page, "[data-capture-lc-bundle='1']", "list-compare-shot-result", { maxH: FRAME_H });

  await browser.close();
  console.log("done —", CABINET);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
