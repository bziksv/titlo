/**
 * Скрины РЕАЛЬНОГО UI «Кластеризатор» из демо-кабинета.
 *
 *   node scripts/capture-cluster-shots.mjs
 *   CABINET_BASE=http://127.0.0.1:3002 node scripts/capture-cluster-shots.mjs
 *
 * Нужен кабинет с поддержкой /cluster?analyzer=1 (обход витрины результата).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.join(__dirname, "../public/modules/assets");
const CABINET = (process.env.CABINET_BASE || "https://cabinet.titlo.ru").replace(/\/$/, "");
/** Форма: нужен ?analyzer=1. Если prod ещё без патча — FORM_CABINET=http://127.0.0.1:3002 */
const FORM_CABINET = (process.env.FORM_CABINET || CABINET).replace(/\/$/, "");

const SAMPLE_PHRASES = [
  "купить насос",
  "насос для воды",
  "скважинный насос",
  "насосная станция",
  "погружной насос",
  "циркуляционный насос",
  "ремонт насоса",
  "насос цена",
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
      .cabinet-feedback, #cabinet-feedback-root, .toasts-top-right, .toast { display: none !important; }
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

async function demoLogin(page, toPath, base = CABINET) {
  await page.goto(`${base}/demo-cabinet?to=${encodeURIComponent(toPath)}`, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  await page.waitForTimeout(2000);
  console.log("demo →", page.url());
  if (page.url().includes("/login")) {
    throw new Error(`Демо не пустил — ${base}`);
  }
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

  // ——— 01: форма анализатора (?analyzer=1) ———
  await demoLogin(page, "/cluster", FORM_CABINET);
  await page.goto(`${FORM_CABINET}/cluster?analyzer=1`, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  await page.waitForTimeout(1500);
  if (page.url().includes("show-cluster-result")) {
    throw new Error(
      `Кабинет ${FORM_CABINET} редиректит /cluster на витрину. Нужен патч ClusterController (?analyzer=1), FORM_CABINET=http://127.0.0.1:3002.`
    );
  }
  await page.waitForSelector("#cabinet-cluster-v2-root #clv2-phrases", { timeout: 60_000 });
  await page.fill("#clv2-phrases", SAMPLE_PHRASES);
  await page.waitForTimeout(400);
  await page.evaluate(() => {
    const ta = document.getElementById("clv2-phrases");
    if (ta) ta.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.waitForTimeout(300);
  await stripChrome(page);

  const formBox = await page.evaluate(() => {
    const root = document.getElementById("cabinet-cluster-v2-root");
    const step1 = document.getElementById("clv2-step-1");
    const step2 = document.getElementById("clv2-step-2");
    const topEl = step1 || root;
    const bottomEl = step2 || step1;
    const rr = root.getBoundingClientRect();
    const top = topEl.getBoundingClientRect().top - 6;
    const bottom = bottomEl.getBoundingClientRect().bottom + 10;
    return {
      x: Math.max(0, rr.left),
      y: Math.max(0, top),
      width: Math.min(1580, rr.width),
      height: Math.min(1400, Math.max(320, bottom - top)),
    };
  });
  await shotClip(page, formBox, "cluster-shot-form");

  // ——— 02: сводка + таблица кластеров (данные с CABINET / prod) ———
  await demoLogin(page, "/cluster", CABINET);
  await page.waitForURL(/show-cluster-result\/\d+/, { timeout: 90_000 });
  const showcaseId = (page.url().match(/show-cluster-result\/(\d+)/) || [])[1];
  console.log("showcaseId", showcaseId);
  await page.waitForSelector("#result-table", { timeout: 90_000 });
  await page.waitForFunction(() => {
    const t = document.querySelector("#result-table");
    const rows = document.querySelectorAll("#clusters-table-tbody tr").length;
    return t && getComputedStyle(t).display !== "none" && rows > 3;
  }, { timeout: 90_000 });
  await page.waitForTimeout(1000);
  await stripChrome(page);
  await page.evaluate(() => {
    document.getElementById("clv2-freq-zero-hint")?.remove();
    document.querySelectorAll(".alert-warning").forEach((el) => {
      const t = (el.textContent || "").toLowerCase();
      if (t.includes("частотность") || t.includes("wordstat") || t.includes("queue worker")) {
        el.remove();
      }
    });
  });
  await page.waitForTimeout(200);

  const resultBox = await page.evaluate(() => {
    const root = document.getElementById("cabinet-cluster-result-v2-root");
    const summary = document.querySelector(".cabinet-cluster-result-v2__summary");
    const results = document.getElementById("cabinet-cluster-v2-results");
    const rr = root.getBoundingClientRect();
    const top = (summary || root).getBoundingClientRect().top - 6;
    const bottom = Math.min(
      (results || root).getBoundingClientRect().bottom + 8,
      top + 1200
    );
    return {
      x: Math.max(0, rr.left),
      y: Math.max(0, top),
      width: Math.min(1580, rr.width),
      height: Math.min(1400, Math.max(400, bottom - top)),
    };
  });
  await shotClip(page, resultBox, "cluster-shot-result");

  // ——— 03: ручной редактор ———
  let thirdBase = "cluster-shot-edit";
  await page.goto(`${CABINET}/edit-clusters/${showcaseId}`, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  await page.waitForTimeout(2000);
  const hasEdit = await page.$("#cabinet-cluster-edit-v2-root");
  if (hasEdit) {
    await page.waitForSelector("#cabinet-cluster-edit-v2-root .cabinet-cluster-edit-v2__layout, #cabinet-cluster-edit-v2-root .row", {
      timeout: 30_000,
    });
    await stripChrome(page);
    const editBox = await page.evaluate(() => {
      const root = document.getElementById("cabinet-cluster-edit-v2-root");
      const rr = root.getBoundingClientRect();
      return {
        x: Math.max(0, rr.left),
        y: Math.max(0, rr.top - 4),
        width: Math.min(1580, rr.width),
        height: Math.min(1200, Math.max(400, Math.min(rr.height, 1100))),
      };
    });
    await shotClip(page, editBox, thirdBase);
  } else {
    thirdBase = "cluster-shot-projects";
    await page.goto(`${CABINET}/cluster-projects`, {
      waitUntil: "domcontentloaded",
      timeout: 120_000,
    });
    await page.waitForSelector("#my-cluster-projects, #cabinet-cluster-projects", { timeout: 60_000 });
    await page.waitForTimeout(800);
    await stripChrome(page);
    const projBox = await page.evaluate(() => {
      const root =
        document.querySelector("#cabinet-cluster-projects") ||
        document.querySelector(".cabinet-cluster-projects-page");
      const rr = root.getBoundingClientRect();
      return {
        x: Math.max(0, rr.left),
        y: Math.max(0, rr.top - 4),
        width: Math.min(1580, rr.width),
        height: Math.min(900, Math.max(280, rr.height + 8)),
      };
    });
    await shotClip(page, projBox, thirdBase);
  }

  await browser.close();
  console.log("done — result:", CABINET, "| form:", FORM_CABINET, "| third:", thirdBase);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
