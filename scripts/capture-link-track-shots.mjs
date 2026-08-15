/**
 * Скрины РЕАЛЬНОГО UI «Отслеживание ссылок» из демо-кабинета.
 *
 *   node scripts/capture-link-track-shots.mjs
 *   CABINET_BASE=http://127.0.0.1:3002 node scripts/capture-link-track-shots.mjs
 *   PROJECT_ID=46 node scripts/capture-link-track-shots.mjs
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
    document.querySelectorAll(".alert, .callout").forEach((el) => {
      if (/Телеграм|Telegram/i.test(el.innerText || "")) hide(el);
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
  const vh = page.viewportSize()?.height || 1600;
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

  await demoLogin(page, "/backlink");

  let projectId = process.env.PROJECT_ID || null;
  if (!projectId) {
    const m = page.url().match(/show-backlink\/(\d+)/);
    projectId = m ? m[1] : null;
  }
  if (!projectId) {
    projectId = await page.evaluate(() => {
      const a = [...document.querySelectorAll("a[href*='show-backlink']")].find((el) =>
        /show-backlink\/\d+/.test(el.getAttribute("href") || "")
      );
      const m = (a?.getAttribute("href") || "").match(/show-backlink\/(\d+)/);
      return m ? m[1] : null;
    });
  }
  console.log("projectId", projectId);

  // ——— 01 + 02: проект (демо часто сразу открывает show-backlink) ———
  if (!/show-backlink\/\d+/.test(page.url()) && projectId) {
    await page.goto(`${CABINET}/show-backlink/${projectId}`, {
      waitUntil: "domcontentloaded",
      timeout: 120_000,
    });
    await page.waitForTimeout(2500);
  }
  await page.waitForSelector(".cabinet-module-main-card", { timeout: 60_000 });
  await page.waitForTimeout(1500);
  await stripChrome(page);

  // KPI / карточка проекта
  const statsOk = await page.evaluate(() => {
    const card = document.querySelector(".cabinet-bl-project-card");
    if (!card) return false;
    card.setAttribute("data-capture-bl-stats", "1");
    return true;
  });
  if (statsOk) {
    await shotSelector(page, "[data-capture-bl-stats='1']", "link-track-shot-projects", {
      maxH: 520,
    });
  }

  // таблица ссылок: фильтры + строки (не шапка проекта)
  await page.evaluate(() => {
    document.querySelectorAll(".dataTables_scrollBody, .table-responsive").forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.setProperty("max-height", "440px", "important");
        el.style.setProperty("overflow", "hidden", "important");
      }
    });
  });
  const linksBox = await page.evaluate(() => {
    const filters = document.querySelector("#cabinet-bl-filters");
    const table =
      document.querySelector(".cabinet-module-main-card .table-responsive") ||
      document.querySelector(".cabinet-module-main-card table");
    const actions = [...document.querySelectorAll("button, a")].find((el) =>
      /Проверить все ссылки|Добавить ссылку/i.test(el.innerText || "")
    );
    const actionBar = actions?.closest(".d-flex, .btn-toolbar, .row, div") || null;
    const parts = [actionBar, filters, table].filter(Boolean);
    if (!parts.length) return null;
    parts[0].scrollIntoView({ block: "start" });
    const rects = parts.map((el) => el.getBoundingClientRect());
    const top = Math.min(...rects.map((r) => r.top));
    const left = Math.min(...rects.map((r) => r.left));
    const right = Math.max(...rects.map((r) => r.right));
    const bottom = Math.max(...rects.map((r) => r.bottom));
    return { x: left, y: top, width: right - left, height: bottom - top };
  });
  if (!linksBox) throw new Error("Не найден блок таблицы ссылок");
  await page.waitForTimeout(300);
  // пересчитать после scroll
  const linksBox2 = await page.evaluate(() => {
    const filters = document.querySelector("#cabinet-bl-filters");
    const table =
      document.querySelector(".cabinet-module-main-card .table-responsive") ||
      document.querySelector(".cabinet-module-main-card table");
    const actions = [...document.querySelectorAll("button, a")].find((el) =>
      /Проверить все ссылки|Добавить ссылку/i.test(el.innerText || "")
    );
    const actionBar = actions?.closest(".d-flex, .btn-toolbar, .row, div") || null;
    const parts = [actionBar, filters, table].filter(Boolean);
    const rects = parts.map((el) => el.getBoundingClientRect());
    const top = Math.min(...rects.map((r) => r.top));
    const left = Math.min(...rects.map((r) => r.left));
    const right = Math.max(...rects.map((r) => r.right));
    const bottom = Math.max(...rects.map((r) => r.bottom));
    return { x: left, y: top, width: right - left, height: bottom - top };
  });
  {
    const raw = path.join(ASSETS, `_raw-link-track-shot-links.png`);
    const vh = page.viewportSize()?.height || 1600;
    const y = Math.max(0, Math.floor(linksBox2.y));
    const h = Math.min(FRAME_H, Math.max(240, Math.ceil(linksBox2.height + 8)), vh - y - 4);
    await page.screenshot({
      path: raw,
      type: "png",
      clip: {
        x: Math.max(0, Math.floor(linksBox2.x)),
        y,
        width: Math.min(1580, Math.max(200, Math.ceil(linksBox2.width))),
        height: h,
      },
    });
    await saveCover(raw, "link-track-shot-links");
  }
  // ——— 03: форма добавления ссылок ———
  if (!projectId) throw new Error("Нет projectId для add-link");
  await page.goto(`${CABINET}/add-link/${projectId}`, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  await page.waitForSelector(".cabinet-module-main-card, form, textarea", { timeout: 60_000 });
  await page.waitForTimeout(1500);
  await stripChrome(page);
  await shotSelector(page, ".cabinet-module-main-card, .content .card", "link-track-shot-form", {
    maxH: FRAME_H,
  });

  // ——— бонус: список проектов, если доступен без редиректа ———
  await page.goto(`${CABINET}/backlink`, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.waitForTimeout(2000);
  if (/\/backlink\/?$/.test(page.url().replace(/\?.*/, ""))) {
    await stripChrome(page);
    await shotSelector(page, ".cabinet-module-main-card", "link-track-shot-projects", {
      maxH: FRAME_H,
    });
  } else {
    console.log("projects list redirects → keep KPI card as projects shot");
  }

  await browser.close();
  console.log("done —", CABINET);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
