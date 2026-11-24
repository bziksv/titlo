/**
 * Скрины реального блока уникальности в демо-кабинете:
 *   https://cabinet.titlo.ru/demo-cabinet?to=/text-analyzer
 *
 *   node scripts/capture-text-uniqueness-shots.mjs
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
  console.log("wrote", base, meta.width + "x" + meta.height);
}

async function shotLocator(page, locator, base) {
  await locator.evaluate((el) => el.scrollIntoView({ block: "center" }));
  await page.waitForTimeout(400);
  const raw = path.join(ASSETS, `_raw-${base}.png`);
  await locator.screenshot({ path: raw, type: "png" });
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
      viewport: { width: 1440, height: 1200 },
      deviceScaleFactor: 2,
      locale: "ru-RU",
    })
  ).newPage();

  await page.goto(`${CABINET}/demo-cabinet?to=${encodeURIComponent("/text-analyzer")}`, {
    waitUntil: "domcontentloaded",
    timeout: 180_000,
  });
  console.log("url", page.url());
  await page.waitForSelector("#cabinetTaFormCard", { timeout: 90_000 });
  await page.waitForTimeout(1500);
  await page.addStyleTag({
    content: `
      .main-header, .main-sidebar, aside.main-sidebar,
      .demo-cabinet-banner, .control-sidebar, .preloader { display: none !important; }
      .content-wrapper { margin-left: 0 !important; }
    `,
  });

  await page.evaluate(() => {
    document.querySelector("#cabinet-ta-panel-url")?.classList.add("d-none");
    document.querySelector("#cabinet-ta-panel-batch")?.classList.add("d-none");
    document.querySelector("#cabinet-ta-panel-text")?.classList.remove("d-none");
    document.querySelector("#cabinet-ta-uniqueness-panel")?.classList.remove("d-none");
    const sw = document.querySelector("#switchCheckUniqueness");
    if (sw) sw.checked = true;
    const own = document.querySelector("#cabinet-ta-exclude-domain");
    if (own && !own.value) own.value = "https://titlo.ru/about/";
  });
  await page.locator("#cabinet-ta-panel-text").waitFor({ state: "visible", timeout: 10_000 });

  await shotLocator(page, page.locator("#cabinet-ta-panel-text"), "uniqueness-shot-text");

  const modeBox = await page.evaluate(() => {
    const row = document.querySelector("#cabinet-ta-uniqueness-switch-row");
    const panel = document.querySelector("#cabinet-ta-uniqueness-panel");
    if (!row || !panel) return null;
    const a = row.getBoundingClientRect();
    const b = panel.getBoundingClientRect();
    const top = Math.min(a.top, b.top);
    const left = Math.min(a.left, b.left);
    return {
      x: Math.max(0, left - 8),
      y: Math.max(0, top - 8),
      width: Math.max(a.right, b.right) - left + 16,
      height: Math.max(a.bottom, b.bottom) - top + 16,
    };
  });
  if (!modeBox) throw new Error("Блок уникальности не найден");
  const rawMode = path.join(ASSETS, "_raw-uniqueness-shot-mode.png");
  await page.screenshot({ path: rawMode, type: "png", clip: modeBox });
  await saveCover(rawMode, "uniqueness-shot-mode");

  const head = await page.locator("#cabinetTaFormCard").boundingBox();
  if (!head) throw new Error("Карточка формы не найдена");
  const rawHead = path.join(ASSETS, "_raw-uniqueness-shot-modes.png");
  await page.screenshot({
    path: rawHead,
    type: "png",
    clip: { x: head.x, y: head.y, width: head.width, height: Math.min(340, head.height) },
  });
  await saveCover(rawHead, "uniqueness-shot-modes");

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
