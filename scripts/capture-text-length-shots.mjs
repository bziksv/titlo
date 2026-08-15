/**
 * Скрины РЕАЛЬНОГО UI «Подсчёт длины текста» из демо-кабинета.
 *
 *   node scripts/capture-text-length-shots.mjs
 *   CABINET_BASE=http://127.0.0.1:3002 node scripts/capture-text-length-shots.mjs
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

const SAMPLE = `Купить диван в Москве — каталог с доставкой по России.
Угловые и прямые модели, рассрочка и гарантия. Смотрите актуальные цены на demo-shop.ru.

Доставка по Москве и области за 1–3 дня. Самовывоз из шоурума.`;

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

  await page.goto(`${CABINET}/demo-cabinet?to=${encodeURIComponent("/counting-text-length")}`, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  await page.waitForTimeout(2500);
  console.log("demo →", page.url());
  if (page.url().includes("/login")) {
    throw new Error(`Демо не пустил — ${CABINET}`);
  }

  await page.waitForSelector(".cabinet-module-main-card, #cabinet-tl-text", { timeout: 60_000 });
  await page.waitForTimeout(1000);
  await stripChrome(page);

  // убедиться, что есть текст и отчёт
  const hasStats = await page.evaluate(() =>
    /Символов с пробелами|Количество слов/i.test(document.body.innerText || "")
  );
  if (!hasStats) {
    const ta = page.locator("#cabinet-tl-text, textarea.cabinet-tl-textarea, textarea").first();
    await ta.fill(SAMPLE);
    await page.getByRole("button", { name: /Посчитать/i }).click();
    await page.waitForTimeout(1500);
    await stripChrome(page);
  }

  // ——— 01: форма (шаги 1–2) ———
  await page.evaluate(() => {
    const main = document.querySelector(".cabinet-module-main-card");
    if (!main) return;
    // спрятать блок отчёта (шаг 3), если мешает кадру формы
    const step3 = [...main.querySelectorAll("*")].find((el) => {
      const t = (el.innerText || "").trim();
      return /^3\s*Шаг 3|^Шаг 3/i.test(t) && el.children.length > 0;
    });
    if (step3) {
      let el = step3;
      for (let i = 0; i < 8; i++) {
        if (el.querySelector?.(".cabinet-tl-metric-card, .cabinet-tl-extended-card")) {
          el.style.setProperty("display", "none", "important");
          el.setAttribute("data-capture-tl-report-hidden", "1");
          break;
        }
        el = el.parentElement;
        if (!el || el === main) break;
      }
    }
  });
  await page.waitForTimeout(200);
  await shotSelector(page, ".cabinet-module-main-card", "text-length-shot-form", { maxH: FRAME_H });

  // ——— 02: полный отчёт (шаг 3) ———
  await page.evaluate(() => {
    document.querySelectorAll("[data-capture-tl-report-hidden='1']").forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.removeProperty("display");
        el.removeAttribute("data-capture-tl-report-hidden");
      }
    });
  });
  // спрятать форму ввода, оставить метрики
  await page.evaluate(() => {
    const main = document.querySelector(".cabinet-module-main-card");
    if (!main) return;
    const ta = document.querySelector("#cabinet-tl-text");
    if (ta) {
      let el = ta.closest(".form-group, .mb-3, .card, section, div");
      for (let i = 0; i < 6 && el && el !== main; i++) {
        if (/Шаг 1|Введите текст|SEO-мета/i.test(el.innerText || "") && el.getBoundingClientRect().height > 120) {
          el.style.setProperty("display", "none", "important");
          el.setAttribute("data-capture-tl-form-hidden", "1");
          break;
        }
        el = el.parentElement;
      }
    }
    // кнопки посчитать
    document.querySelectorAll("button").forEach((btn) => {
      if (/Посчитать|Очистить/i.test(btn.innerText || "")) {
        const bar = btn.closest(".d-flex, .btn-toolbar, .form-group, div");
        if (bar && /Посчитать/i.test(bar.innerText || "") && (bar.innerText || "").length < 200) {
          bar.style.setProperty("display", "none", "important");
        }
      }
    });
  });
  await page.waitForTimeout(200);
  await stripChrome(page);

  const metricsRow = await page.evaluate(() => {
    const cards = [...document.querySelectorAll(".cabinet-tl-metric-card")];
    if (cards.length < 2) return null;
    const first = cards[0];
    let row = first.parentElement;
    for (let i = 0; i < 5 && row; i++) {
      if (row.querySelectorAll(".cabinet-tl-metric-card").length >= 3) {
        row.setAttribute("data-capture-tl-metrics", "1");
        return "[data-capture-tl-metrics='1']";
      }
      row = row.parentElement;
    }
    return null;
  });
  if (metricsRow) {
    await shotSelector(page, metricsRow, "text-length-shot-metrics", { maxH: 360 });
  }

  // полный отчёт: метрики + расширенная карточка
  await page.evaluate(() => {
    const ext = document.querySelector(".cabinet-tl-extended-card");
    const metrics = document.querySelector("[data-capture-tl-metrics='1']");
    if (metrics && ext) {
      // пометить общий предок
      let el = metrics;
      for (let i = 0; i < 8 && el; i++) {
        if (el.contains(ext)) {
          el.setAttribute("data-capture-tl-report", "1");
          return;
        }
        el = el.parentElement;
      }
    }
    if (ext) ext.setAttribute("data-capture-tl-report", "1");
  });
  const reportSel = (await page.locator("[data-capture-tl-report='1']").count())
    ? "[data-capture-tl-report='1']"
    : ".cabinet-module-main-card";
  await shotSelector(page, reportSel, "text-length-shot-result", { maxH: FRAME_H });

  await browser.close();
  console.log("done —", CABINET);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
