/**
 * Скрины РЕАЛЬНОГО UI «Проверка текста Есенин» из демо-кабинета.
 *
 *   node scripts/capture-esenin-shots.mjs
 *   CABINET_BASE=http://127.0.0.1:3002 node scripts/capture-esenin-shots.mjs
 *
 * Демо открывает готовую сессию: /esenin-text-check?session=…
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
        [
          ".main-sidebar",
          "aside.main-sidebar",
          ".main-header",
          "nav.main-header",
          ".demo-cabinet-banner",
          ".control-sidebar",
          ".preloader",
          ".main-footer",
          "#scroll-to-top",
          ".cabinet-feedback",
          "#cabinet-feedback-root",
          ".cabinet-module-description",
        ].join(", ")
      )
      .forEach((el) => el.remove());
    document.body.classList.remove("sidebar-mini", "sidebar-collapse", "layout-fixed", "sidebar-open");
    const cw = document.querySelector(".content-wrapper");
    if (cw) {
      cw.style.cssText += ";margin-left:0!important;padding-left:0!important;width:100%!important;";
    }
    const content = document.querySelector(".content-wrapper .content");
    if (content) content.style.cssText += ";margin-left:0!important;padding-left:12px!important;";
    document.querySelectorAll(".badge, small, span").forEach((el) => {
      if (/v\d+\.\d+/i.test(el.textContent || "") && (el.textContent || "").trim().length < 12) {
        el.remove();
      }
    });
  });
  await page.addStyleTag({
    content: `
      .main-sidebar, aside.main-sidebar, .main-header, .demo-cabinet-banner,
      .cabinet-feedback, #cabinet-feedback-root, .cabinet-module-description { display: none !important; }
      .content-wrapper { margin-left: 0 !important; width: 100% !important; }
      body { overflow: auto !important; }
      .cabinet-esenin-lead { display: none !important; }
      .cabinet-esenin-module-nav, [class*="esenin"] .module-nav { display: none !important; }
    `,
  });
  await page.waitForTimeout(250);
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

async function boxOf(page, selector, pad = 6) {
  return page.evaluate(
    ({ sel, p }) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      if (r.width < 40 || r.height < 40) return null;
      return {
        x: Math.max(0, r.left - p),
        y: Math.max(0, r.top - p),
        width: Math.min(1580, r.width + p * 2),
        height: Math.min(1400, r.height + p * 2),
      };
    },
    { sel: selector, p: pad }
  );
}

async function main() {
  fs.mkdirSync(ASSETS, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    channel: process.env.PW_CHANNEL || "chrome",
  });
  const page = await (
    await browser.newContext({
      viewport: { width: 1440, height: 2000 },
      deviceScaleFactor: 2,
      locale: "ru-RU",
    })
  ).newPage();

  await page.goto(`${CABINET}/demo-cabinet?to=${encodeURIComponent("/esenin-text-check")}`, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  await page.waitForTimeout(4500);
  console.log("demo →", page.url());
  if (page.url().includes("/login")) {
    throw new Error(`Демо не пустил — ${CABINET}`);
  }

  await page.waitForSelector(".cabinet-esenin-page", { timeout: 60_000 });
  // дождаться результатов витрины
  await page.waitForSelector(".cabinet-esenin-results:not(.d-none), .cabinet-esenin-score-nav .cabinet-esenin-score-btn", {
    timeout: 60_000,
  }).catch(() => {});
  await page.waitForTimeout(1500);

  await stripChrome(page);

  // ——— 01: задача + HTML-редактор (в витрине редактор уже в results-host) ———
  await page.evaluate(() => {
    document.querySelector(".cabinet-esenin-empty")?.style.setProperty("display", "none", "important");
    document.querySelector(".cabinet-esenin-results-grid")?.style.setProperty("display", "none", "important");
    document.querySelector(".cabinet-esenin-session-bar")?.style.setProperty("display", "none", "important");
    document.querySelector("[data-esenin-stale-banner]")?.style.setProperty("display", "none", "important");
    document.querySelector("[data-esenin-providers-bar]")?.style.setProperty("display", "none", "important");
    const results = document.querySelector(".cabinet-esenin-results");
    if (results instanceof HTMLElement) {
      results.classList.remove("d-none");
      results.style.removeProperty("display");
    }
    const host = document.querySelector("[data-esenin-editor-host-results]");
    if (host instanceof HTMLElement) {
      host.classList.remove("d-none");
      host.style.setProperty("display", "block", "important");
    }
    const input = document.querySelector(".cabinet-esenin-input");
    if (input instanceof HTMLElement) {
      input.style.removeProperty("display");
      // панель текста пустая (редактор уехал) — прячем табы/панели, оставляем имя задания
      input.querySelectorAll(".cabinet-esenin-tabs, .cabinet-esenin-panel, [data-esenin-submit], [data-esenin-clear], .cabinet-esenin-check-status")
        .forEach((el) => {
          if (el instanceof HTMLElement) el.style.setProperty("display", "none", "important");
        });
      // кнопка «Проверить снова» и лимит — внизу редактора, их тоже спрячем у input
      const foot = input.querySelector(".d-flex.flex-wrap.gap-2.justify-content-between");
      if (foot instanceof HTMLElement) foot.style.setProperty("display", "none", "important");
    }
  });
  await page.waitForTimeout(400);
  let formBox = await page.evaluate(() => {
    const name = document.querySelector(".cabinet-esenin-input");
    const ed = document.querySelector("[data-esenin-editor-host-results]") || document.querySelector(".cabinet-esenin-editor");
    if (!name && !ed) return null;
    const a = name?.getBoundingClientRect();
    const b = ed?.getBoundingClientRect();
    const left = Math.min(a?.left ?? b.left, b?.left ?? a.left);
    const top = Math.min(a?.top ?? b.top, b?.top ?? a.top);
    const right = Math.max((a?.right ?? b.right), (b?.right ?? a.right));
    const bottom = Math.max((a?.bottom ?? b.bottom), (b?.bottom ?? a.bottom));
    return {
      x: Math.max(0, left - 8),
      y: Math.max(0, top - 8),
      width: Math.min(1580, right - left + 16),
      height: Math.min(1200, bottom - top + 16),
    };
  });
  console.log("formBox", formBox);
  if (formBox) {
    formBox.height = Math.min(Math.max(formBox.height, 520), 1200);
    await shotClip(page, formBox, "esenin-shot-form");
  }

  // вернуть результаты для следующих кадров
  await page.evaluate(() => {
    document.querySelector(".cabinet-esenin-results-grid")?.style.removeProperty("display");
    document.querySelector("[data-esenin-editor-host-results]")?.style.setProperty("display", "none", "important");
    document.querySelector(".cabinet-esenin-input")?.style.setProperty("display", "none", "important");
  });
  await page.waitForTimeout(300);

  // ——— 02: подсветка в тексте (центральная колонка) ———
  await page.evaluate(() => {
    document.querySelector(".cabinet-esenin-score-nav")?.style.setProperty("display", "none", "important");
    document.querySelector(".cabinet-esenin-params, [data-esenin-params], .cabinet-esenin-side")?.style.setProperty(
      "display",
      "none",
      "important"
    );
    // правая колонка параметров — скрыть по типичным классам
    document.querySelectorAll(".cabinet-esenin-results-grid > *").forEach((col, i) => {
      if (i !== 1 && col instanceof HTMLElement) col.style.setProperty("display", "none", "important");
    });
    document.querySelector(".cabinet-esenin-text-view")?.scrollIntoView({ block: "start" });
  });
  await page.waitForTimeout(250);
  let highlightBox = await boxOf(page, ".cabinet-esenin-text-view", 10);
  if (!highlightBox) {
    highlightBox = await page.evaluate(() => {
      const el = document.querySelector(".cabinet-esenin-results-grid");
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left - 6, y: r.top - 6, width: Math.min(900, r.width + 12), height: Math.min(1100, r.height + 12) };
    });
  }
  console.log("highlightBox", highlightBox);
  if (highlightBox) {
    highlightBox.height = Math.min(highlightBox.height, 1100);
    await shotClip(page, highlightBox, "esenin-shot-highlight");
  }

  // вернуть колонки для полного отчёта
  await page.evaluate(() => {
    document.querySelectorAll(".cabinet-esenin-results-grid > *").forEach((col) => {
      if (col instanceof HTMLElement) col.style.removeProperty("display");
    });
    document.querySelector(".cabinet-esenin-score-nav")?.style.removeProperty("display");
  });
  await page.waitForTimeout(200);

  // ——— 03: полный отчёт (скоры · подсветка · параметры) ———
  await page.evaluate(() => {
    document.querySelector(".cabinet-esenin-results-grid")?.scrollIntoView({ block: "start" });
  });
  await page.waitForTimeout(200);
  let reportBox = await page.evaluate(() => {
    const grid = document.querySelector(".cabinet-esenin-results-grid");
    if (!grid) return null;
    const r = grid.getBoundingClientRect();
    return {
      x: Math.max(0, r.left - 6),
      y: Math.max(0, r.top - 6),
      width: Math.min(1580, r.width + 12),
      height: Math.min(1400, Math.max(480, r.height + 12)),
    };
  });
  console.log("reportBox", reportBox);
  if (reportBox) await shotClip(page, reportBox, "esenin-shot-report");

  await browser.close();
  console.log("done —", CABINET);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
