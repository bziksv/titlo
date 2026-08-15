/**
 * Скрины РЕАЛЬНОГО UI из демо-кабинета:
 *   https://cabinet.titlo.ru/demo-cabinet?to=/text-analyzer
 *
 *   node scripts/capture-text-analyzer-shots.mjs
 *   CABINET_BASE=http://127.0.0.1:3002 node scripts/capture-text-analyzer-shots.mjs
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
  // Ширина до 1600, высота по контенту — без cover/contain в фиксированный кадр
  await sharp(raw)
    .resize({ width: 1600, withoutEnlargement: true })
    .png({ compressionLevel: 8 })
    .toFile(png);
  await sharp(png).webp({ quality: 90, effort: 5 }).toFile(png.replace(/\.png$/, ".webp"));
  const meta = await sharp(png).metadata();
  fs.unlinkSync(raw);
  console.log("wrote", base, meta.width + "x" + meta.height, fs.statSync(png).size);
}

async function main() {
  fs.mkdirSync(ASSETS, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    channel: process.env.PW_CHANNEL || "chrome",
  });
  const page = await (
    await browser.newContext({
      viewport: { width: 1600, height: 1400 },
      deviceScaleFactor: 2,
      locale: "ru-RU",
    })
  ).newPage();

  await page.goto(`${CABINET}/demo-cabinet?to=${encodeURIComponent("/text-analyzer")}`, {
    waitUntil: "networkidle",
    timeout: 180_000,
  });
  console.log("url", page.url());
  if (page.url().includes("/login")) {
    throw new Error(`Демо не пустил на login — нужен demo-cabinet:seed на ${CABINET}`);
  }

  await page.waitForSelector(".cabinet-text-analyzer-page", { timeout: 60_000 });
  await page.waitForTimeout(2000);
  await page.addStyleTag({
    content: `
      .main-header, .main-sidebar, aside.main-sidebar,
      .demo-cabinet-banner, .control-sidebar, .preloader { display: none !important; }
      .content-wrapper { margin-left: 0 !important; }
    `,
  });

  const info = await page.locator(".cabinet-text-analyzer-page .card").evaluateAll((cards) =>
    cards.map((c, i) => ({
      i,
      t: (c.querySelector("h3.card-title, .card-title")?.textContent || "")
        .trim()
        .replace(/\s+/g, " ")
        .slice(0, 80),
      h: Math.round(c.getBoundingClientRect().height),
    }))
  );
  console.log(info.map((c) => `${c.i}:${c.t} (${c.h})`).join("\n"));

  async function shotIndex(i, base) {
    const card = page.locator(".cabinet-text-analyzer-page .card").nth(i);
    await card.evaluate((el) => el.scrollIntoView({ block: "center" }));
    await page.waitForTimeout(500);
    const raw = path.join(ASSETS, `_raw-${base}.png`);
    await card.screenshot({ path: raw, type: "png" });
    await saveCover(raw, base);
  }

  for (const c of info) {
    const t = c.t.toLowerCase();
    if (t.includes("параметры анализа")) await shotIndex(c.i, "text-anal-shot-input");
    if (t.includes("ципфа")) await shotIndex(c.i, "text-anal-shot-zipf");
    if (t.includes("облака")) await shotIndex(c.i, "text-anal-shot-cloud");
    if (t.includes("общий анализ слов")) await shotIndex(c.i, "text-anal-shot-table");
  }

  // settings = нижняя часть формы с тогглами
  const formIdx = info.find((c) => c.t.toLowerCase().includes("параметры анализа"))?.i;
  if (formIdx != null) {
    const card = page.locator(".cabinet-text-analyzer-page .card").nth(formIdx);
    await card.evaluate((el) => el.scrollIntoView({ block: "center" }));
    await page.waitForTimeout(400);
    const box = await card.boundingBox();
    if (box && box.height > 100) {
      const raw = path.join(ASSETS, "_raw-text-anal-shot-settings.png");
      const h = Math.min(480, box.height);
      await page.screenshot({
        path: raw,
        type: "png",
        clip: { x: box.x, y: box.y + box.height - h, width: box.width, height: h },
      });
      await saveCover(raw, "text-anal-shot-settings");
    }
  }

  await browser.close();
  console.log("done — demo cabinet", CABINET);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
