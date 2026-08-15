/**
 * Скрины РЕАЛЬНОГО UI «Мониторинг позиций» (monitoring-v2) из демо-кабинета.
 *
 *   node scripts/capture-monitoring-positions-shots.mjs
 *   CABINET_BASE=http://127.0.0.1:3002 node scripts/capture-monitoring-positions-shots.mjs
 *   PROJECT_ID=751 node scripts/capture-monitoring-positions-shots.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.join(__dirname, "../public/modules/assets");
const CABINET = (process.env.CABINET_BASE || "https://cabinet.titlo.ru").replace(/\/$/, "");
const VERSION = process.env.SHOT_VERSION || "v7";
const FRAME_H = 900;

async function saveCover(raw, base) {
  const png = path.join(ASSETS, `${base}.png`);
  await sharp(raw)
    .resize({ width: 1600, withoutEnlargement: true })
    .png({ compressionLevel: 8 })
    .toFile(png);
  await sharp(png).webp({ quality: 90, effort: 5 }).toFile(png.replace(/\.png$/, ".webp"));
  // versioned + unversioned aliases (лендинг ссылается на *-vN)
  const ver = path.join(ASSETS, `${base}-${VERSION}.png`);
  fs.copyFileSync(png, ver);
  await sharp(png).webp({ quality: 90, effort: 5 }).toFile(ver.replace(/\.png$/, ".webp"));
  const meta = await sharp(png).metadata();
  fs.unlinkSync(raw);
  console.log("wrote", base, `(${VERSION})`, meta.width + "x" + meta.height, fs.statSync(png).size);
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
          "#cabinet-mon-v2-admin-debug",
          ".cabinet-mon-v2-admin-debug",
        ].join(", ")
      )
      .forEach(hide);
    // кнопка «Выйти из демо» и плашка
    document.querySelectorAll("a, button, .alert, .banner").forEach((el) => {
      const t = (el.innerText || "").trim();
      if (/Выйти из демо|Демо-режим|Это демо/i.test(t) && (t.length < 120 || el.matches("a, button"))) {
        hide(el.closest(".alert, .banner, .navbar, .d-flex, header, .sticky-top") || el);
      }
    });
    document.body.classList.remove("sidebar-mini", "layout-fixed", "sidebar-open");
    document.body.classList.add("sidebar-collapse");
    const cw = document.querySelector(".content-wrapper, .app-content, .app-main, main");
    if (cw instanceof HTMLElement) {
      cw.style.cssText += ";margin-left:0!important;padding-left:0!important;width:100%!important;";
    }
    const content = document.querySelector(".content-wrapper .content, .app-content .container-fluid");
    if (content instanceof HTMLElement) {
      content.style.cssText += ";margin-left:0!important;padding-left:12px!important;";
    }
    document.querySelectorAll("a, button").forEach((el) => {
      const t = (el.innerText || "").trim();
      if (/Подставить позиции|Сдвинуть позиции|Очереди съёма|Права в проекте|Администрирование/i.test(t)) {
        const bar =
          el.closest(".btn-toolbar, .btn-group, .card, nav, .d-flex, .cabinet-mon-v2-toolbar") ||
          el.parentElement;
        if (bar && (bar.innerText || "").length < 800) hide(bar);
      }
    });
    document.querySelectorAll(".badge, [class*='version']").forEach((el) => {
      if (/v\d+\.\d+/.test(el.innerText || "")) hide(el);
    });
    window.scrollTo(0, 0);
  });
  await page.addStyleTag({
    content: `
      .main-sidebar, aside.main-sidebar, .main-header, nav.main-header, .navbar,
      .demo-cabinet-banner, [class*='demo-cabinet'],
      #cabinet-mon-v2-admin-debug, .cabinet-mon-v2-admin-debug,
      .cabinet-feedback, #cabinet-feedback-root, .toasts-top-right, .toast { display: none !important; }
      .content-wrapper, .app-content, .app-main { margin-left: 0 !important; width: 100% !important; }
      body { overflow: auto !important; }
    `,
  });
  await page.waitForTimeout(250);
}

async function shotSelector(page, selector, base, { maxH = FRAME_H } = {}) {
  const loc = page.locator(selector).first();
  await loc.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  // доскролл: clip должен быть внутри viewport
  await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return;
    el.scrollIntoView({ block: "start", inline: "nearest" });
    const r = el.getBoundingClientRect();
    if (r.top < 0 || r.top > 40) {
      window.scrollBy(0, r.top - 8);
    }
  }, selector);
  await page.waitForTimeout(200);

  const box = await loc.boundingBox();
  if (!box || box.height < 80) {
    throw new Error(`${base}: пустой/маленький box для ${selector} → ${JSON.stringify(box)}`);
  }
  const raw = path.join(ASSETS, `_raw-${base}.png`);
  const h = Math.min(maxH, Math.max(200, Math.ceil(box.height + 8)));
  // если низ обрезается viewport’ом — уменьшаем высоту кадра
  const vh = page.viewportSize()?.height || 1200;
  const maxAvail = Math.max(200, vh - Math.max(0, Math.floor(box.y)) - 4);
  await page.screenshot({
    path: raw,
    type: "png",
    clip: {
      x: Math.max(0, Math.floor(box.x)),
      y: Math.max(0, Math.floor(box.y)),
      width: Math.min(1580, Math.max(200, Math.ceil(box.width))),
      height: Math.min(h, maxAvail),
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
      viewport: { width: 1600, height: 1200 },
      deviceScaleFactor: 2,
      locale: "ru-RU",
    })
  ).newPage();

  await page.goto(`${CABINET}/demo-cabinet?to=${encodeURIComponent("/monitoring-v2")}`, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  await page.waitForTimeout(3000);
  console.log("demo →", page.url());
  if (page.url().includes("/login")) {
    throw new Error(`Демо не пустил — ${CABINET}`);
  }

  await page.waitForSelector("section.cabinet-mon-v2-workspace, #cabinet-mon-v2-root", {
    timeout: 90_000,
  });
  await page.waitForFunction(
    () => {
      const ws = document.querySelector("section.cabinet-mon-v2-workspace");
      if (!ws) return false;
      const rows = ws.querySelectorAll("table tbody tr, .cabinet-mon-v2-card[data-project-id]");
      return rows.length >= 1;
    },
    null,
    { timeout: 90_000 }
  );
  await page.waitForTimeout(2500);
  await stripChrome(page);

  // project id from links
  let projectId = process.env.PROJECT_ID || null;
  if (!projectId) {
    projectId = await page.evaluate(() => {
      const a = [...document.querySelectorAll("a[href*='/monitoring/']")].find((el) =>
        /\/monitoring\/\d+/.test(el.getAttribute("href") || "")
      );
      const m = (a?.getAttribute("href") || "").match(/\/monitoring\/(\d+)/);
      return m ? m[1] : null;
    });
  }
  console.log("projectId", projectId);

  // портфель открываем сразу — нужен для кадра charts
  const showPort = page.getByRole("button", { name: /Показать портфель/i });
  if ((await showPort.count()) && (await showPort.isVisible().catch(() => false))) {
    await showPort.click();
    await page.waitForTimeout(2500);
  }
  await page.waitForSelector("#cabinet-mon-v2-dashboard canvas, canvas", { timeout: 30_000 }).catch(() => null);
  await stripChrome(page);

  // ——— 01: список проектов (портфель спрятан) ———
  await page.evaluate(() => {
    document.querySelector("#cabinet-mon-v2-dashboard")?.style.setProperty("display", "none", "important");
  });
  await page.waitForTimeout(300);
  await stripChrome(page);
  await shotSelector(page, "section.cabinet-mon-v2-workspace", "monitoring-v2-shot-list", {
    maxH: FRAME_H,
  });

  // ——— 02: портфель / графики ———
  await page.evaluate(() => {
    document.querySelector("#cabinet-mon-v2-dashboard")?.style.removeProperty("display");
    document.querySelectorAll("section.cabinet-mon-v2-workspace").forEach((el) => {
      if (el instanceof HTMLElement) el.style.setProperty("display", "none", "important");
    });
  });
  await page.waitForTimeout(800);
  await stripChrome(page);
  await shotSelector(page, "#cabinet-mon-v2-dashboard", "monitoring-v2-shot-charts", {
    maxH: FRAME_H,
  });

  // ——— 03: таблица ключей ———
  if (!projectId) {
    throw new Error("Не найден projectId для съёмки ключей");
  }
  await page.goto(`${CABINET}/monitoring/${projectId}#keywords`, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  await page.waitForFunction(() => document.querySelectorAll("table tbody tr").length >= 3, null, {
    timeout: 90_000,
  });
  await page.waitForTimeout(2500);
  await stripChrome(page);
  await page.evaluate(() => {
    document.querySelectorAll(".dataTables_scrollBody").forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.setProperty("max-height", "420px", "important");
        el.style.setProperty("overflow", "hidden", "important");
      }
    });
  });

  const kwSel = (await page.locator(".cabinet-module-main-card").count())
    ? ".cabinet-module-main-card"
    : ".content-wrapper .content .card, .content .card, .content";
  await shotSelector(page, kwSel.split(",")[0].trim(), "monitoring-v2-shot-keywords", {
    maxH: FRAME_H,
  });

  await browser.close();
  console.log("done —", CABINET, "| version", VERSION);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
