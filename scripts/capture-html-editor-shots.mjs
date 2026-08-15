/**
 * Скрины РЕАЛЬНОГО UI «HTML-редактор» из демо-кабинета.
 *
 *   node scripts/capture-html-editor-shots.mjs
 *   CABINET_BASE=http://127.0.0.1:3002 node scripts/capture-html-editor-shots.mjs
 *
 * В демо /html-editor редиректит в edit-description. Список проектов:
 * /html-editor?list=1 (после деплоя bypass в TextEditorController).
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
        ".main-sidebar, aside.main-sidebar, .main-header, .demo-cabinet-banner, .control-sidebar, .preloader, .main-footer, #scroll-to-top, .cabinet-feedback, #cabinet-feedback-root, .cabinet-module-description"
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
      .main-sidebar, aside.main-sidebar, .main-header, .demo-cabinet-banner,
      .cabinet-feedback, #cabinet-feedback-root, .cabinet-module-description { display: none !important; }
      .content-wrapper { margin-left: 0 !important; width: 100% !important; }
      body { overflow: auto !important; }
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

  // Логин в демо
  await page.goto(`${CABINET}/demo-cabinet?to=${encodeURIComponent("/html-editor")}`, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  await page.waitForTimeout(3500);
  console.log("demo →", page.url());
  if (page.url().includes("/login")) {
    throw new Error(`Демо не пустил — ${CABINET}`);
  }

  // Запомнить URL редактора (витрина) и id текста
  let editUrl = page.url();
  if (!/edit-description/.test(editUrl)) {
    // если остались на списке — найдём ссылку
    const href = await page.evaluate(() => {
      const a = document.querySelector("a.cabinet-he-text-link, a[href*='edit-description']");
      return a ? a.href : null;
    });
    if (href) editUrl = href;
  }
  console.log("editUrl →", editUrl);

  // ——— 01: список проектов (?list=1 после деплоя bypass; иначе пропуск) ———
  await page.goto(`${CABINET}/html-editor?list=1`, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  await page.waitForTimeout(1500);
  const onProjectsList = await page.evaluate(
    () => !!document.querySelector(".cabinet-he-layout .cabinet-he-project-tab")
  );
  console.log("projects list", onProjectsList, page.url());

  if (onProjectsList) {
    await stripChrome(page);
    await page.evaluate(() => {
      const howto = document.querySelector(".cabinet-he-howto");
      if (howto) howto.style.display = "none";
    });
    await page.waitForTimeout(200);
    const listBox = await page.evaluate(() => {
      const pageRoot = document.querySelector(".cabinet-html-editor-page");
      const summary = pageRoot.querySelector(".cabinet-he-summary-bar");
      const layout = pageRoot.querySelector(".cabinet-he-layout");
      const top = (summary || layout).getBoundingClientRect().top - 6;
      const bottom = Math.max(
        layout.getBoundingClientRect().bottom,
        pageRoot.querySelector(".cabinet-he-detail:not([hidden])")?.getBoundingClientRect().bottom || 0
      );
      const r = pageRoot.getBoundingClientRect();
      return {
        x: Math.max(0, Math.floor(r.left)),
        y: Math.max(0, Math.floor(top)),
        width: Math.min(1580, Math.max(400, Math.ceil(r.width))),
        height: Math.min(1100, Math.max(320, Math.ceil(bottom - top + 12))),
      };
    });
    await shotClip(page, listBox, "html-editor-shot-projects");
  }

  // ——— редактор ———
  await page.goto(editUrl, { waitUntil: "domcontentloaded", timeout: 120_000 });
  await page.waitForSelector(".cabinet-he-split, .cabinet-he-editor-wrap, .ck-editor", {
    timeout: 90_000,
  });
  await page.waitForTimeout(3000);
  await stripChrome(page);

  // ——— 02: визуал + код ———
  await page.evaluate(() => {
    document.querySelectorAll(".cabinet-he-fold, .cabinet-he-nav").forEach((el) => {
      el.style.display = "none";
    });
  });
  await page.waitForTimeout(300);
  const editorBox = await page.evaluate(() => {
    const wrap =
      document.querySelector(".cabinet-he-split-wrap") ||
      document.querySelector(".cabinet-he-split") ||
      document.querySelector(".cabinet-he-editor-wrap");
    const r = wrap.getBoundingClientRect();
    return {
      x: Math.max(0, Math.floor(r.left)),
      y: Math.max(0, Math.floor(r.top - 4)),
      width: Math.min(1580, Math.max(400, Math.ceil(r.width))),
      height: Math.min(1200, Math.max(360, Math.ceil(r.height + 8))),
    };
  });
  await shotClip(page, editorBox, "html-editor-shot-editor");

  // ——— 03: только код ———
  await page.evaluate(() => {
    const visual = document.querySelector(".cabinet-he-split-col--visual");
    if (visual) visual.style.display = "none";
    const code = document.querySelector(".cabinet-he-split-col--code");
    if (code) {
      code.classList.remove("col-lg-6");
      code.classList.add("col-12");
      code.setAttribute("data-capture-he-code", "1");
    }
  });
  await page.waitForTimeout(300);
  const codeBox = await page.evaluate(() => {
    const col =
      document.querySelector("[data-capture-he-code='1']") ||
      document.querySelector(".cabinet-he-split-col--code");
    const toolbar = document.querySelector(".cabinet-he-split-toolbar");
    const top = toolbar ? toolbar.getBoundingClientRect().top - 4 : col.getBoundingClientRect().top - 4;
    const bottom = col.getBoundingClientRect().bottom + 8;
    const left = Math.min(
      toolbar?.getBoundingClientRect().left ?? col.getBoundingClientRect().left,
      col.getBoundingClientRect().left
    );
    const right = Math.max(
      toolbar?.getBoundingClientRect().right ?? col.getBoundingClientRect().right,
      col.getBoundingClientRect().right
    );
    return {
      x: Math.max(0, Math.floor(left)),
      y: Math.max(0, Math.floor(top)),
      width: Math.min(1580, Math.max(400, Math.ceil(right - left))),
      height: Math.min(1100, Math.max(280, Math.ceil(bottom - top))),
    };
  });
  await shotClip(page, codeBox, "html-editor-shot-code");

  // ——— 04: пресеты (если не сняли список проектов) ———
  if (!onProjectsList) {
    await page.evaluate(() => {
      const visual = document.querySelector(".cabinet-he-split-col--visual");
      if (visual) visual.style.display = "";
      const code = document.querySelector(".cabinet-he-split-col--code");
      if (code) {
        code.classList.add("col-lg-6");
        code.classList.remove("col-12");
      }
      document.querySelectorAll(".cabinet-he-fold").forEach((el) => {
        el.style.display = "";
      });
      document.querySelectorAll(".cabinet-he-split-wrap, .cabinet-he-split").forEach((el) => {
        el.style.display = "none";
      });
      const fold = [...document.querySelectorAll(".cabinet-he-fold")].find((el) =>
        /пресет|preset/i.test(el.querySelector("summary")?.innerText || "")
      );
      if (fold) {
        fold.open = true;
        fold.setAttribute("data-capture-he-presets", "1");
      }
    });
    await page.waitForTimeout(400);
    const presetsBox = await page.evaluate(() => {
      const fold =
        document.querySelector("[data-capture-he-presets='1']") || document.querySelector(".cabinet-he-presets");
      const r = fold.getBoundingClientRect();
      return {
        x: Math.max(0, Math.floor(r.left)),
        y: Math.max(0, Math.floor(r.top - 4)),
        width: Math.min(1580, Math.max(400, Math.ceil(r.width))),
        height: Math.min(900, Math.max(200, Math.ceil(r.height + 8))),
      };
    });
    await shotClip(page, presetsBox, "html-editor-shot-presets");
  }

  await browser.close();
  console.log("done —", CABINET);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
