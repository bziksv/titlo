/**
 * Скрины «Подбор слов Wordstat» из демо-кабинета.
 *   CABINET_BASE=http://localhost:3002 node scripts/capture-wordstat-shots.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.join(__dirname, "../public/modules/assets");
const CABINET = (process.env.CABINET_BASE || "http://localhost:3002").replace(/\/$/, "");

async function saveCover(raw, base) {
  const png = path.join(ASSETS, `${base}.png`);
  await sharp(raw).resize({ width: 1600, withoutEnlargement: true }).png({ compressionLevel: 8 }).toFile(png);
  await sharp(png).webp({ quality: 90, effort: 5 }).toFile(png.replace(/\.png$/, ".webp"));
  const meta = await sharp(png).metadata();
  fs.unlinkSync(raw);
  console.log("wrote", base, meta.width + "x" + meta.height);
}

async function shot(page, locator, base) {
  await locator.evaluate((el) => el.scrollIntoView({ block: "start" }));
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

  await page.goto(`${CABINET}/demo-cabinet?to=${encodeURIComponent("/wordstat-keywords")}`, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  console.log("list", page.url());
  await page.waitForSelector("#cabinetWskPage", { timeout: 60_000 });
  await page.addStyleTag({
    content: `.main-header,.main-sidebar,aside.main-sidebar,.demo-cabinet-banner,.preloader,.cabinet-module-beta-banner{display:none!important}.content-wrapper{margin-left:0!important}`,
  });
  await shot(page, page.locator("#cabinetWskPage"), "wordstat-shot-projects");

  await page.locator('#cabinetWskPage a[href*="/wordstat-keywords/"]').first().click();
  await page.waitForSelector(".cabinet-wsk-collect", { timeout: 60_000 });
  await page.addStyleTag({
    content: `.main-header,.main-sidebar,aside.main-sidebar,.demo-cabinet-banner,.cabinet-module-beta-banner{display:none!important}.content-wrapper{margin-left:0!important}`,
  });
  await shot(page, page.locator(".cabinet-wsk-collect"), "wordstat-shot-form");
  await page.waitForSelector("[data-wsk-rows] tr", { timeout: 20_000 }).catch(() => {});
  await shot(page, page.locator(".cabinet-wsk-body"), "wordstat-shot-phrases");
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
