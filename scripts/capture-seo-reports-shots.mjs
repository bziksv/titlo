/**
 * Скрины SEO-отчётов: список в демо-кабинете и клиентский отчёт на демо-данных.
 *   CABINET_BASE=http://localhost:3002 node scripts/capture-seo-reports-shots.mjs
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

async function clipPage(page, base, height) {
  const raw = path.join(ASSETS, `_raw-${base}.png`);
  await page.screenshot({ path: raw, type: "png", clip: { x: 0, y: 0, width: 1440, height } });
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

  await page.goto(`${CABINET}/demo-cabinet?to=${encodeURIComponent("/reports")}`, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  console.log("cabinet", page.url());
  await page.waitForSelector(".cabinet-sr-page", { timeout: 60_000 });
  await page.addStyleTag({
    content: `.main-header,.main-sidebar,aside.main-sidebar,.demo-cabinet-banner,.control-sidebar,.preloader,.cabinet-module-beta-banner{display:none!important}.content-wrapper{margin-left:0!important}`,
  });
  await shot(page, page.locator(".cabinet-sr-page"), "reports-shot-projects");

  const open = page.locator('a[href*="/reports/"]').filter({ hasText: "Открыть проект" }).first();
  if (await open.count()) {
    await open.click();
    await page.waitForSelector(".cabinet-sr-board", { timeout: 60_000 });
    await page.addStyleTag({
      content: `.main-header,.main-sidebar,aside.main-sidebar,.demo-cabinet-banner,.cabinet-module-beta-banner{display:none!important}.content-wrapper{margin-left:0!important}`,
    });
    await page.setViewportSize({ width: 1440, height: 1800 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    const clip = await page.evaluate(() => {
      const root = document.querySelector(".cabinet-sr-page");
      const warn = [...document.querySelectorAll(".cabinet-sr-page .alert-warning")].find(
        (el) => el.getBoundingClientRect().height > 40
      );
      const r = root.getBoundingClientRect();
      const bottom = warn ? warn.getBoundingClientRect().bottom : r.bottom;
      return {
        x: Math.max(0, Math.floor(r.left)),
        y: Math.max(0, Math.floor(r.top)),
        width: Math.ceil(r.width),
        height: Math.ceil(bottom - r.top + 16),
      };
    });
    console.log("project clip", clip);
    const raw = path.join(ASSETS, "_raw-reports-shot-project.png");
    await page.screenshot({ path: raw, type: "png", clip });
    await saveCover(raw, "reports-shot-project");
  }

  await page.goto(`${CABINET}/reports/presets/seo_only/demo`, { waitUntil: "domcontentloaded", timeout: 120_000 });
  console.log("demo", page.url());
  await page.waitForSelector(".cabinet-sr-public__wrap", { timeout: 60_000 });
  await page.addStyleTag({ content: `.cabinet-sr-demo-banner{display:none!important}` });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
  await clipPage(page, "reports-shot-client", 1000);

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
