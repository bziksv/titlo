/**
 * Скрины РЕАЛЬНОГО UI анализа релевантности из демо-кабинета.
 *
 *   node scripts/capture-relevance-shots.mjs
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

async function hideChrome(page) {
  await page.addStyleTag({
    content: `
      .main-header, .main-sidebar, aside.main-sidebar,
      .demo-cabinet-banner, .control-sidebar, .preloader,
      #scroll-to-top, .toasts-top-right, .toast { display: none !important; }
      .content-wrapper { margin-left: 0 !important; }
      body.sidebar-mini .content-wrapper,
      body.sidebar-collapse .content-wrapper { margin-left: 0 !important; }
      body { overflow: auto !important; }
    `,
  });
}

async function contentBox(page) {
  return page.evaluate(() => {
    const el = document.querySelector(".content-wrapper .content") || document.querySelector(".content-wrapper");
    const r = el.getBoundingClientRect();
    return { x: r.left, y: r.top, width: r.width, height: r.height, left: r.left };
  });
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
      height: Math.min(1800, Math.max(200, Math.ceil(box.height))),
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
      viewport: { width: 1600, height: 1600 },
      deviceScaleFactor: 2,
      locale: "ru-RU",
    })
  ).newPage();

  await page.goto(`${CABINET}/demo-cabinet?to=${encodeURIComponent("/analyze-relevance")}`, {
    waitUntil: "networkidle",
    timeout: 180_000,
  });
  console.log("demo →", page.url());
  if (page.url().includes("/login")) {
    throw new Error(`Демо не пустил на ${CABINET}`);
  }

  await page.waitForSelector("text=Сравнение количества текста", { timeout: 120_000 });
  await page.waitForTimeout(2000);
  await hideChrome(page);

  // ——— 01: форма «Повторить анализ» (в демо /analyze-relevance редиректит на витрину) ———
  const repeatTab = page.getByRole("tab", { name: /Повторить анализ/i }).first();
  await repeatTab.click();
  await page.waitForTimeout(2000);
  await hideChrome(page);

  const formReady = await page.getByText(/Ваша посадочная страница/i).first().isVisible().catch(() => false);
  console.log("repeat form visible", formReady);
  if (formReady) {
    const box = await page.evaluate(() => {
      const label = [...document.querySelectorAll("label, .col-form-label, span, div")].find((el) =>
        /Ваша посадочная страница/i.test(el.textContent || "")
      );
      const card =
        label?.closest(".card") ||
        label?.closest(".tab-pane") ||
        document.querySelector("#repeat-analysis, .tab-pane.active, .content");
      const r = (card || document.querySelector(".content")).getBoundingClientRect();
      return { x: r.left, y: r.top, width: r.width, height: Math.min(980, r.height) };
    });
    await shotClip(page, box, "relevance-shot-form");
  } else {
    console.warn("form not found on repeat tab — skip form");
  }

  // назад к деталям
  await page.getByRole("tab", { name: /Показать детали/i }).click();
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2500);
  await hideChrome(page);
  await page.waitForSelector("h2:has-text('Сравнение количества текста')", { timeout: 60_000 });

  // ——— 02: облака ———
  const cloudBtn = page
    .locator("button, a, .btn")
    .filter({ hasText: /Облака TF \(частота\)|Облака TF idf посадочной/i })
    .first();
  if (await cloudBtn.count()) {
    await cloudBtn.click();
    await page.waitForTimeout(2800);
  }
  await page.waitForSelector(".jqcloud", { timeout: 20_000 }).catch(() => null);
  await hideChrome(page);

  const cloudsBox = await page.evaluate(() => {
    const start = [...document.querySelectorAll("h2")].find((h) =>
      /Сравнение количества текста/i.test(h.textContent || "")
    );
    const end = [...document.querySelectorAll("h2")].find((h) => /Рекомендации TLP/i.test(h.textContent || ""));
    const content =
      document.querySelector(".content-wrapper .content") ||
      document.querySelector(".content-wrapper") ||
      document.body;
    const cr = content.getBoundingClientRect();
    const top = start ? start.getBoundingClientRect().top - 8 : cr.top + 40;
    let bottom = end ? end.getBoundingClientRect().top - 8 : top + 1200;
    document.querySelectorAll(".jqcloud").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom > bottom) bottom = r.bottom + 20;
    });
    return { x: Math.max(0, cr.left + 4), y: Math.max(0, top), width: Math.max(400, cr.width - 8), height: Math.min(1650, Math.max(400, bottom - top)) };
  });
  await shotClip(page, cloudsBox, "relevance-shot-clouds");

  // ——— 03: TLP рекомендации ———
  const recH = page.locator("h2").filter({ hasText: /Рекомендации TLP/i }).first();
  await recH.scrollIntoViewIfNeeded();
  const showRec = page.locator("button, .btn").filter({ hasText: /^Показать$/ }).first();
  if (await showRec.isVisible().catch(() => false)) {
    await showRec.click();
    await page.waitForTimeout(1800);
  }
  await hideChrome(page);

  const tlpBox = await page.evaluate(() => {
    const start = [...document.querySelectorAll("h2")].find((h) => /Рекомендации TLP/i.test(h.textContent || ""));
    const content =
      document.querySelector(".content-wrapper .content") ||
      document.querySelector(".content-wrapper") ||
      document.body;
    const cr = content.getBoundingClientRect();
    if (!start) return { x: cr.left, y: cr.top, width: cr.width, height: 800 };
    const top = start.getBoundingClientRect().top - 8;
    let bottom = top + 900;
    const tables = [...document.querySelectorAll("table")];
    for (const t of tables) {
      const head = (t.tHead?.innerText || t.innerText || "").slice(0, 400);
      if (/Добавить|Удалить|Рекомендуемый диапазон/i.test(head)) {
        const r = t.getBoundingClientRect();
        if (r.top >= top - 40) {
          bottom = Math.min(r.bottom + 12, top + 1100);
          break;
        }
      }
    }
    return { x: Math.max(0, cr.left + 4), y: Math.max(0, top), width: Math.max(400, cr.width - 8), height: Math.min(1100, Math.max(300, bottom - top)) };
  });
  await shotClip(page, tlpBox, "relevance-shot-tlp");

  await browser.close();
  console.log("done —", CABINET);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
