/**
 * Скрины SEO-чеклиста из демо-кабинета.
 *   node scripts/capture-seo-checklist-shots.mjs
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
  await sharp(raw).resize({ width: 1600, withoutEnlargement: true }).png({ compressionLevel: 8 }).toFile(png);
  await sharp(png).webp({ quality: 90, effort: 5 }).toFile(png.replace(/\.png$/, ".webp"));
  const meta = await sharp(png).metadata();
  fs.unlinkSync(raw);
  console.log("wrote", base, meta.width + "x" + meta.height);
}

async function shot(page, locator, base) {
  await locator.evaluate((el) => el.scrollIntoView({ block: "center" }));
  await page.waitForTimeout(400);
  const raw = path.join(ASSETS, `_raw-${base}.png`);
  await locator.screenshot({ path: raw, type: "png" });
  await saveCover(raw, base);
}

async function main() {
  fs.mkdirSync(ASSETS, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: process.env.PW_CHANNEL || "chrome" });
  const page = await (await browser.newContext({
    viewport: { width: 1440, height: 1100 },
    deviceScaleFactor: 2,
    locale: "ru-RU",
  })).newPage();

  await page.goto(`${CABINET}/demo-cabinet?to=${encodeURIComponent("/checklist")}`, {
    waitUntil: "domcontentloaded",
    timeout: 180_000,
  });
  console.log("url", page.url());
  await page.waitForSelector(".cabinet-sc-page", { timeout: 90_000 });
  await page.waitForTimeout(1200);
  await page.addStyleTag({
    content: `.main-header,.main-sidebar,aside.main-sidebar,.demo-cabinet-banner,.control-sidebar,.preloader{display:none!important}.content-wrapper{margin-left:0!important}`,
  });

  const cards = await page.locator("[data-sc-project-card]").count();
  console.log("projects", cards);
  const grid = page.locator(".cabinet-sc-page");
  await shot(page, grid, "checklist-shot-projects");

  if (cards > 0) {
    await page.locator("[data-sc-project-card]").first().click();
    await page.waitForSelector(".cabinet-sc-plan-layout", { timeout: 60_000 });
    await page.waitForTimeout(800);
    await shot(page, page.locator(".cabinet-sc-page"), "checklist-shot-plan");
    const rail = page.locator(".cabinet-sc-plan-rail");
    if (await rail.count()) await shot(page, rail, "checklist-shot-stages");
  } else {
    await page.goto(`${CABINET}/checklist/templates`, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await page.waitForSelector(".cabinet-sc-page", { timeout: 30_000 });
    await shot(page, page.locator(".cabinet-sc-page"), "checklist-shot-templates");
  }

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
