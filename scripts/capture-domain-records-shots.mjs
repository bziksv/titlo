/**
 * Скрины РЕАЛЬНОГО UI «Записи домена» из демо-кабинета.
 *
 *   node scripts/capture-domain-records-shots.mjs
 *   CABINET_BASE=http://127.0.0.1:3002 node scripts/capture-domain-records-shots.mjs
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
        ".main-sidebar, aside.main-sidebar, .main-header, .demo-cabinet-banner, .control-sidebar, .preloader, .main-footer, #scroll-to-top, .cabinet-feedback, #cabinet-feedback-root"
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
      .main-sidebar, aside.main-sidebar, .main-header, .demo-cabinet-banner { display: none !important; }
      .content-wrapper { margin-left: 0 !important; width: 100% !important; }
      body { overflow: auto !important; }
      .cabinet-feedback, #cabinet-feedback-root { display: none !important; }
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

  await page.goto(`${CABINET}/demo-cabinet?to=${encodeURIComponent("/domain-records")}`, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  await page.waitForURL(/domain-records/, { timeout: 90_000 });
  console.log("demo →", page.url());
  if (page.url().includes("/login")) {
    throw new Error(`Демо не пустил — ${CABINET}`);
  }

  await page.waitForSelector("#cabinetDrPage", { timeout: 60_000 });
  // витрина подгружает историю через fetch
  await page.waitForSelector("#cabinetDrResults:not(.d-none)", { timeout: 90_000 });
  await page.waitForSelector("#cabinetDrWhois dt, #cabinetDrWhois .cabinet-dr-kv, #cabinetDrSummary .cabinet-dr-stat", {
    timeout: 60_000,
  });
  await page.waitForTimeout(1200);
  await stripChrome(page);

  // ——— 01: форма (лид + ввод домена), без результатов ———
  await page.evaluate(() => {
    const results = document.getElementById("cabinetDrResults");
    if (results) results.style.display = "none";
    const hist = document.getElementById("cabinetDrHistoryWrap");
    if (hist) hist.style.display = "none";
  });
  await page.waitForTimeout(200);
  const formBox = await page.evaluate(() => {
    const pageRoot = document.getElementById("cabinetDrPage");
    const hero = document.querySelector(".cabinet-dr-hero");
    const form = document.getElementById("cabinetDrForm");
    const top = (hero || form).getBoundingClientRect().top - 6;
    const bottom = form.getBoundingClientRect().bottom + 10;
    const r = pageRoot.getBoundingClientRect();
    return {
      x: Math.max(0, r.left),
      y: Math.max(0, top),
      width: Math.min(1580, r.width),
      height: Math.min(900, Math.max(240, bottom - top)),
    };
  });
  await shotClip(page, formBox, "domain-records-shot-form");

  // вернуть результаты
  await page.evaluate(() => {
    const results = document.getElementById("cabinetDrResults");
    if (results) results.style.display = "";
    const hist = document.getElementById("cabinetDrHistoryWrap");
    if (hist) hist.style.display = "";
  });
  await stripChrome(page);

  // ——— 02: сводка + WHOIS + DNS ———
  await page.locator("#cabinetDrResults").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const reportBox = await page.evaluate(() => {
    const results = document.getElementById("cabinetDrResults");
    const whois = document.getElementById("cabinetDrWhois")?.closest(".cabinet-dr-card");
    const dns = document.getElementById("cabinetDrDns")?.closest(".cabinet-dr-card");
    const summary = document.getElementById("cabinetDrSummary");
    const cr = results.getBoundingClientRect();
    let top = summary ? summary.getBoundingClientRect().top - 8 : cr.top;
    let bottom = cr.top + 200;
    [whois, dns].forEach((el) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > bottom) bottom = r.bottom;
    });
    return {
      x: Math.max(0, cr.left),
      y: Math.max(0, top),
      width: Math.min(1580, cr.width),
      height: Math.min(1400, Math.max(400, bottom - top + 12)),
    };
  });
  await shotClip(page, reportBox, "domain-records-shot-report");

  // ——— 03: IP / соседи или история ———
  const ipsCard = page.locator("#cabinetDrIps").locator("xpath=ancestor::section[contains(@class,'cabinet-dr-card')]").first();
  if (await ipsCard.count()) {
    await ipsCard.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    // подгрузить соседей, если есть кнопка
    const loadBtn = page.locator("[data-dr-neighbors], .cabinet-dr-ip-btn, button").filter({ hasText: /сосед|загруз/i }).first();
    if (await loadBtn.count()) {
      await loadBtn.click().catch(() => null);
      await page.waitForTimeout(2000);
      await stripChrome(page);
    }
  }

  const detailBox = await page.evaluate(() => {
    const ips = document.getElementById("cabinetDrIps")?.closest(".cabinet-dr-card");
    const hist = document.getElementById("cabinetDrHistoryWrap");
    const target = ips && ips.getBoundingClientRect().height > 80 ? ips : hist;
    if (!target) return null;
    const r = target.getBoundingClientRect();
    const pageRoot = document.getElementById("cabinetDrPage");
    const pr = pageRoot.getBoundingClientRect();
    return {
      x: Math.max(0, pr.left),
      y: Math.max(0, r.top - 6),
      width: Math.min(1580, pr.width),
      height: Math.min(1100, Math.max(280, r.height + 12)),
    };
  });
  if (detailBox) {
    await shotClip(page, detailBox, "domain-records-shot-neighbors");
  } else {
    console.warn("neighbors/history not found — skip");
  }

  await browser.close();
  console.log("done —", CABINET);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
