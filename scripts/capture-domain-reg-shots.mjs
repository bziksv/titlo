/**
 * Скрины РЕАЛЬНОГО UI «Срок регистрации доменов» из демо-кабинета.
 *
 *   node scripts/capture-domain-reg-shots.mjs
 *   CABINET_BASE=http://127.0.0.1:3002 node scripts/capture-domain-reg-shots.mjs
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
    // плашка про Telegram — шум на лендинге
    document.querySelectorAll(".alert, .callout").forEach((el) => {
      if (/Телеграм|Telegram/i.test(el.innerText || "")) hide(el);
    });
    document.body.classList.remove("sidebar-mini", "layout-fixed", "sidebar-open");
    document.body.classList.add("sidebar-collapse");
    const cw = document.querySelector(".content-wrapper, .app-content, .app-main");
    if (cw instanceof HTMLElement) {
      cw.style.cssText += ";margin-left:0!important;padding-left:0!important;width:100%!important;";
    }
    const content = document.querySelector(".content-wrapper .content");
    if (content instanceof HTMLElement) {
      content.style.cssText += ";margin-left:0!important;padding-left:12px!important;";
    }
    // версия в заголовке
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
  await page.waitForTimeout(350);
  await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return;
    el.scrollIntoView({ block: "start", inline: "nearest" });
    const r = el.getBoundingClientRect();
    if (r.top < 0 || r.top > 40) window.scrollBy(0, r.top - 8);
  }, selector);
  await page.waitForTimeout(200);

  const box = await loc.boundingBox();
  if (!box || box.height < 80) {
    throw new Error(`${base}: пустой/маленький box для ${selector} → ${JSON.stringify(box)}`);
  }
  const raw = path.join(ASSETS, `_raw-${base}.png`);
  const vh = page.viewportSize()?.height || 1400;
  const maxAvail = Math.max(200, vh - Math.max(0, Math.floor(box.y)) - 4);
  const h = Math.min(maxH, Math.max(200, Math.ceil(box.height + 8)), maxAvail);
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

async function demoLogin(page, toPath) {
  await page.goto(`${CABINET}/demo-cabinet?to=${encodeURIComponent(toPath)}`, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  await page.waitForTimeout(2500);
  console.log("demo →", page.url());
  if (page.url().includes("/login")) {
    throw new Error(`Демо не пустил — ${CABINET}`);
  }
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

  // ——— 01: список доменов ———
  await demoLogin(page, "/domain-information");
  await page.waitForSelector(".cabinet-module-main-card table tbody tr", { timeout: 90_000 });
  await page.waitForFunction(
    () => document.querySelectorAll(".cabinet-module-main-card table tbody tr").length >= 1,
    null,
    { timeout: 60_000 }
  );
  await page.waitForTimeout(1500);
  await stripChrome(page);
  await shotSelector(page, ".cabinet-module-main-card", "domain-reg-shot-list", { maxH: FRAME_H });

  // ——— 02: сводка KPI (только 4 карточки) ———
  const statsSel = await page.evaluate(() => {
    const main = document.querySelector(".cabinet-module-main-card");
    if (!main) return null;
    const label = [...main.querySelectorAll("*")].find((el) => {
      const t = (el.innerText || "").trim();
      return t === "Всего доменов" || /^Всего доменов$/i.test(t);
    });
    if (!label) return null;
    // ищем ряд из 4 KPI: поднимаемся, пока не найдём контейнер с несколькими «карточками»
    let el = label.parentElement;
    for (let i = 0; i < 10 && el; i++) {
      const r = el.getBoundingClientRect();
      const text = el.innerText || "";
      const hasAll =
        /Всего доменов/i.test(text) &&
        /В порядке/i.test(text) &&
        /Требуют внимания/i.test(text) &&
        /Истекают/i.test(text);
      if (hasAll && r.height > 40 && r.height < 220 && r.width > 400) {
        el.setAttribute("data-capture-di-stats", "1");
        return "[data-capture-di-stats='1']";
      }
      el = el.parentElement;
    }
    return null;
  });
  if (statsSel) {
    await shotSelector(page, statsSel, "domain-reg-shot-stats", { maxH: 280 });
  } else {
    console.warn("stats KPI row not found — skip unique stats, keep previous");
  }

  // ——— 03: форма добавления ———
  await page.goto(`${CABINET}/add-domain-information`, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  await page.waitForSelector("form, .cabinet-module-main-card", { timeout: 60_000 });
  await page.waitForTimeout(1500);
  await stripChrome(page);
  // спрятать нижний feedback в форме
  await page.evaluate(() => {
    document.querySelectorAll(".cabinet-feedback, #cabinet-feedback-root").forEach((el) => {
      if (el instanceof HTMLElement) el.style.setProperty("display", "none", "important");
    });
  });
  await shotSelector(
    page,
    ".cabinet-module-main-card, .content .card",
    "domain-reg-shot-form",
    { maxH: FRAME_H }
  );

  await browser.close();
  console.log("done —", CABINET);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
