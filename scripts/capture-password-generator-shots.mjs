/**
 * Скрины РЕАЛЬНОГО UI «Генератор паролей» из демо-кабинета.
 *
 *   node scripts/capture-password-generator-shots.mjs
 *   CABINET_BASE=http://127.0.0.1:3002 node scripts/capture-password-generator-shots.mjs
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
      .cabinet-pw-toasts,
      .btn-chat, .btn-feedback, [class*="feedback"], #chat-widget, .floating-btn,
      a[href*="feedback"], .cabinet-module-feedback { display: none !important; }
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
      viewport: { width: 1440, height: 1400 },
      deviceScaleFactor: 2,
      locale: "ru-RU",
    })
  ).newPage();

  await page.goto(`${CABINET}/demo-cabinet?to=${encodeURIComponent("/password-generator")}`, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  await page.waitForURL(/password-generator|generate-password/, { timeout: 90_000 });
  console.log("demo →", page.url());
  if (page.url().includes("/login")) {
    throw new Error(`Демо не пустил — ${CABINET}`);
  }

  await page.waitForSelector(".cabinet-pw-page, #cabinet-pw-form", { timeout: 60_000 });
  await page.waitForTimeout(1000);
  await stripChrome(page);

  // В демо POST на генерацию режется readonly — для скрина результатов подставляем UI как после генерации
  await page.evaluate(() => {
    const samples = [
      "K7#mQx9pL2vR",
      "nT4$wE8bH1yU",
      "Pz6!aS3dF0gH",
      "Rm2@cV5nB9xZ",
      "Qw8%jK1lO4iP",
    ];
    const cardBody = document.querySelector(".cabinet-pw-results-card .card-body");
    if (!cardBody) return;
    const ul = document.createElement("ul");
    ul.className = "cabinet-pw-results-list";
    samples.forEach((pw) => {
      const li = document.createElement("li");
      const code = document.createElement("code");
      code.textContent = pw;
      const actions = document.createElement("div");
      actions.className = "cabinet-pw-result-actions";
      actions.innerHTML =
        '<button type="button" class="btn btn-outline-secondary btn-sm"><i class="bi bi-clipboard" aria-hidden="true"></i></button>' +
        '<button type="button" class="btn btn-outline-primary btn-sm"><i class="bi bi-bookmark-plus" aria-hidden="true"></i></button>';
      li.appendChild(code);
      li.appendChild(actions);
      ul.appendChild(li);
    });
    const hint = document.createElement("p");
    hint.className = "small text-secondary mt-3 mb-0";
    hint.textContent = "Скопируйте нужный вариант или сохраните в историю ниже.";
    cardBody.innerHTML = "";
    cardBody.appendChild(ul);
    cardBody.appendChild(hint);
  });
  console.log("results injected", await page.locator(".cabinet-pw-results-list li").count());

  // ——— 01: настройки (пресеты + форма) ———
  const formBox = await page.evaluate(() => {
    const panel = document.querySelector(".cabinet-pw-panel") || document.querySelector("#cabinet-pw-form")?.closest(".card");
    const r = panel.getBoundingClientRect();
    return { x: r.left, y: r.top - 4, width: r.width, height: Math.min(1100, r.height + 8) };
  });
  await shotClip(page, formBox, "pw-gen-shot-form");

  // ——— 02: результаты генерации ———
  const resultsBox = await page.evaluate(() => {
    const card = document.querySelector(".cabinet-pw-results-card");
    const r = card.getBoundingClientRect();
    return { x: r.left, y: r.top - 4, width: r.width, height: Math.min(1100, Math.max(280, r.height + 8)) };
  });
  await shotClip(page, resultsBox, "pw-gen-shot-results");

  // ——— 03: история сохранённых (уже есть в демо-сиде) ———
  await page.locator(".cabinet-pw-saved-card").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const histBox = await page.evaluate(() => {
    const card = document.querySelector(".cabinet-pw-saved-card");
    const r = card.getBoundingClientRect();
    return {
      x: r.left,
      y: r.top - 4,
      width: r.width,
      height: Math.min(1200, Math.max(260, Math.min(r.height + 8, 900))),
    };
  });
  await shotClip(page, histBox, "pw-gen-shot-history");

  // ——— workspace: лид + KPI + две колонки (для hero) ———
  await page.evaluate(() => {
    const hist = document.querySelector(".cabinet-pw-saved-card");
    if (hist) hist.style.display = "none";
  });
  await page.locator(".cabinet-pw-page").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const workspaceBox = await page.evaluate(() => {
    const lead = document.querySelector(".cabinet-pw-lead");
    const panels = [...document.querySelectorAll(".cabinet-pw-kpi, .cabinet-pw-panel, .cabinet-pw-results-card")];
    let top = lead ? lead.getBoundingClientRect().top - 6 : panels[0].getBoundingClientRect().top - 6;
    let left = Infinity;
    let right = -Infinity;
    let bottom = top;
    if (lead) {
      const lr = lead.getBoundingClientRect();
      left = Math.min(left, lr.left);
      right = Math.max(right, lr.right);
    }
    panels.forEach((p) => {
      const r = p.getBoundingClientRect();
      left = Math.min(left, r.left);
      right = Math.max(right, r.right);
      bottom = Math.max(bottom, r.bottom);
    });
    return {
      x: Math.max(0, left),
      y: Math.max(0, top),
      width: Math.min(1580, right - left),
      height: Math.min(1200, bottom - top + 10),
    };
  });
  await shotClip(page, workspaceBox, "pw-gen-shot-workspace");

  await browser.close();
  console.log("done —", CABINET);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
