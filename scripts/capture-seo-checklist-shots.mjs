/**
 * Скрины SEO-чеклиста из демо-кабинета, без плашки беты.
 *   CABINET_BASE=http://localhost:3002 node scripts/capture-seo-checklist-shots.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.join(__dirname, "../public/modules/assets");
const CABINET = (process.env.CABINET_BASE || "http://localhost:3002").replace(/\/$/, "");
const HIDE = `.main-header,.main-sidebar,aside.main-sidebar,.demo-cabinet-banner,.control-sidebar,.preloader,.cabinet-module-beta-banner{display:none!important}.content-wrapper{margin-left:0!important}`;

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
  await page.waitForTimeout(300);
  const raw = path.join(ASSETS, `_raw-${base}.png`);
  await locator.screenshot({ path: raw, type: "png" });
  await saveCover(raw, base);
}

async function clipBox(page, base, clip) {
  console.log(base, clip);
  const raw = path.join(ASSETS, `_raw-${base}.png`);
  await page.screenshot({ path: raw, type: "png", clip });
  await saveCover(raw, base);
}

async function main() {
  fs.mkdirSync(ASSETS, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: process.env.PW_CHANNEL || "chrome" });
  const page = await (await browser.newContext({
    viewport: { width: 1440, height: 1400 },
    deviceScaleFactor: 2,
    locale: "ru-RU",
  })).newPage();

  await page.goto(`${CABINET}/demo-cabinet?to=${encodeURIComponent("/checklist")}`, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  console.log("url", page.url());
  await page.waitForSelector(".cabinet-sc-page", { timeout: 60_000 });
  await page.addStyleTag({ content: HIDE });
  await page.evaluate(() => window.scrollTo(0, 0));
  await shot(page, page.locator(".cabinet-sc-page"), "checklist-shot-projects");

  const href = await page.locator("[data-sc-project-card]").first().getAttribute("href");
  console.log("project", href);
  await page.goto(new URL(href, CABINET).toString(), { waitUntil: "domcontentloaded", timeout: 60_000 });
  console.log("opened", page.url());
  await page.addStyleTag({ content: HIDE });
  await page.waitForSelector(".cabinet-sc-plan-layout, .cabinet-sc-plan__group, .cabinet-sc-task", { timeout: 20_000 });
  await page.setViewportSize({ width: 1440, height: 2000 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);

  const board = await page.evaluate(() => {
    const root = document.querySelector(".cabinet-sc-page");
    const rows = document.querySelectorAll(".cabinet-sc-stage .cabinet-sc-tasks > .cabinet-sc-task");
    const r = root.getBoundingClientRect();
    const end = rows[3] || rows[rows.length - 1];
    return {
      x: Math.max(0, Math.floor(r.left)),
      y: Math.max(0, Math.floor(r.top)),
      width: Math.ceil(r.width),
      height: Math.ceil(end.getBoundingClientRect().bottom - r.top + 8),
    };
  });
  await clipBox(page, "checklist-shot-board", board);

  await page.addStyleTag({
    content: `.cabinet-sc-show-toolbar{display:none!important}`,
  });
  await page.locator(".cabinet-sc-stage").first().evaluate((el) => el.scrollIntoView({ block: "start" }));
  await page.waitForTimeout(250);
  const tasks = await page.locator(".cabinet-sc-stage").first().evaluate((stage) => {
    const rows = stage.querySelectorAll(".cabinet-sc-tasks > .cabinet-sc-task");
    const gr = stage.getBoundingClientRect();
    const end = rows[Math.min(4, rows.length - 1)] || stage;
    return {
      x: Math.max(0, Math.floor(gr.left)),
      y: Math.max(0, Math.floor(gr.top)),
      width: Math.ceil(gr.width),
      height: Math.ceil(end.getBoundingClientRect().bottom - gr.top + 6),
    };
  });
  await clipBox(page, "checklist-shot-tasks", tasks);

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
