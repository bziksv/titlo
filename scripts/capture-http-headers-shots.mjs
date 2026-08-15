/**
 * Скрины РЕАЛЬНОГО UI «HTTP headers» из демо-кабинета.
 *
 *   node scripts/capture-http-headers-shots.mjs
 *   CABINET_BASE=http://127.0.0.1:3002 node scripts/capture-http-headers-shots.mjs
 *
 * Демо без ?url= показывает витрину titlo.ru (заголовки + HTML).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.join(__dirname, "../public/modules/assets");
const CABINET = (process.env.CABINET_BASE || "https://cabinet.titlo.ru").replace(/\/$/, "");

const SAMPLE_URLS = [
  "https://titlo.ru/",
  "https://titlo.ru/monitoring-saytov/",
  "https://titlo.ru/proverka-meta-tegov-online/",
  "https://titlo.ru/analiz-relevantnosti/",
  "https://titlo.ru/http-headers/",
].join("\n");

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
  });
  await page.addStyleTag({
    content: `
      .main-sidebar, aside.main-sidebar, .main-header, .demo-cabinet-banner,
      .cabinet-feedback, #cabinet-feedback-root, .cabinet-module-description { display: none !important; }
      .content-wrapper { margin-left: 0 !important; width: 100% !important; }
      body { overflow: auto !important; }
      .cabinet-hh-lead { display: none !important; }
      .cabinet-hh-module-nav, [class*="http-headers-module-nav"] { display: none !important; }
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

async function boxOf(page, selector) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      x: Math.max(0, r.left - 4),
      y: Math.max(0, r.top - 4),
      width: Math.min(1580, r.width + 8),
      height: Math.min(1400, r.height + 8),
    };
  }, selector);
}

async function main() {
  fs.mkdirSync(ASSETS, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    channel: process.env.PW_CHANNEL || "chrome",
  });
  const page = await (
    await browser.newContext({
      viewport: { width: 1440, height: 1800 },
      deviceScaleFactor: 2,
      locale: "ru-RU",
    })
  ).newPage();

  await page.goto(`${CABINET}/demo-cabinet?to=${encodeURIComponent("/http-headers")}`, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  await page.waitForTimeout(3500);
  console.log("demo →", page.url());
  if (page.url().includes("/login")) {
    throw new Error(`Демо не пустил — ${CABINET}`);
  }

  await page.waitForSelector(".cabinet-hh-page, .cabinet-hh-single-form, #response-code", {
    timeout: 60_000,
  });
  await stripChrome(page);
  await page.evaluate(() => {
    document.querySelectorAll(".badge, small, span").forEach((el) => {
      if (/v\d+\.\d+/i.test(el.textContent || "") && (el.textContent || "").trim().length < 12) {
        el.remove();
      }
    });
  });

  // ——— 01: форма одного URL ———
  let formBox = await page.evaluate(() => {
    const title = Array.from(document.querySelectorAll("h2, .cabinet-hh-step-title")).find((el) =>
      /Один URL/i.test(el.textContent || "")
    );
    const card = title?.closest(".card, section");
    if (!card) return null;
    const r = card.getBoundingClientRect();
    return { x: r.left - 4, y: r.top - 4, width: r.width + 8, height: r.height + 8 };
  });
  console.log("formBox", formBox);
  if (formBox) await shotClip(page, formBox, "http-headers-shot-form");

  // ——— 02: таблица заголовков (+ HTML превью, если есть) ———
  let resultBox = await page.evaluate(() => {
    const result = document.querySelector("#response-code .cabinet-hh-result-card, #response-code");
    const html = document.querySelector(".cabinet-hh-html-card");
    if (!result) return null;
    const top = result.getBoundingClientRect().top;
    const bottom = Math.max(
      result.getBoundingClientRect().bottom,
      html?.getBoundingClientRect().bottom || 0
    );
    const left = Math.min(
      result.getBoundingClientRect().left,
      html?.getBoundingClientRect().left ?? result.getBoundingClientRect().left
    );
    const right = Math.max(
      result.getBoundingClientRect().right,
      html?.getBoundingClientRect().right ?? result.getBoundingClientRect().right
    );
    return {
      x: Math.max(0, left - 4),
      y: Math.max(0, top - 4),
      width: Math.min(1580, right - left + 8),
      height: Math.min(1400, bottom - top + 8),
    };
  });
  console.log("resultBox", resultBox);
  if (resultBox) await shotClip(page, resultBox, "http-headers-shot-result");

  // ——— 03: только пакетная форма ———
  await page.evaluate(() => {
    // спрятать одиночную форму и витрину результата — в кадре только bulk
    document.querySelectorAll("section.cabinet-hh-panel").forEach((el) => {
      if (/Один URL/i.test(el.textContent || "")) el.style.display = "none";
    });
    document.querySelector("#response-code")?.closest("div")?.style.setProperty("display", "none");
    document.querySelector(".cabinet-hh-html-card")?.style.setProperty("display", "none");
    document.querySelector(".cabinet-hh-share")?.style.setProperty("display", "none");
    const pageTitle = document.querySelector(".card-title, .cabinet-card-title, h1, .content-header");
    // title often outside .cabinet-hh-page
  });

  const urlsField = page.locator("#cabinet-hh-urls");
  if (await urlsField.count()) {
    await urlsField.fill(SAMPLE_URLS);
  } else {
    await page.evaluate((urls) => {
      const ta = document.querySelector("#cabinet-hh-urls, .cabinet-hh-bulk textarea, textarea");
      if (!ta) return;
      const proto = window.HTMLTextAreaElement.prototype;
      const desc = Object.getOwnPropertyDescriptor(proto, "value");
      desc?.set?.call(ta, urls);
      ta.dispatchEvent(new Event("input", { bubbles: true }));
    }, SAMPLE_URLS);
  }
  await page.waitForTimeout(300);

  let bulkBox = await page.evaluate(() => {
    const bulk = document.querySelector(".cabinet-hh-bulk");
    const panel = bulk?.querySelector("section.cabinet-hh-panel") || bulk;
    if (!panel) return null;
    const r = panel.getBoundingClientRect();
    return {
      x: Math.max(0, r.left - 4),
      y: Math.max(0, r.top - 4),
      width: Math.min(1580, r.width + 8),
      height: Math.min(1000, Math.max(360, r.height + 8)),
    };
  });
  console.log("bulkBox", bulkBox);
  if (bulkBox) await shotClip(page, bulkBox, "http-headers-shot-bulk");

  await browser.close();
  console.log("done —", CABINET);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
