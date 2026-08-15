/**
 * Скрины РЕАЛЬНОГО UI «UTM-метки» из демо-кабинета.
 *
 *   node scripts/capture-utm-shots.mjs
 *   CABINET_BASE=http://127.0.0.1:3002 node scripts/capture-utm-shots.mjs
 *
 * Демо подставляет showcase (demo-shop.ru + utm_*) и кликает «Собрать».
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
        [
          ".main-sidebar",
          "aside.main-sidebar",
          ".main-header",
          "nav.main-header",
          ".demo-cabinet-banner",
          ".control-sidebar",
          ".preloader",
          ".main-footer",
          "#scroll-to-top",
          ".cabinet-feedback",
          "#cabinet-feedback-root",
          ".cabinet-module-description",
        ].join(", ")
      )
      .forEach((el) => el.remove());
    document.body.classList.remove("sidebar-mini", "sidebar-collapse", "layout-fixed", "sidebar-open");
    const cw = document.querySelector(".content-wrapper");
    if (cw) {
      cw.style.cssText += ";margin-left:0!important;padding-left:0!important;width:100%!important;";
    }
    const content = document.querySelector(".content-wrapper .content");
    if (content) content.style.cssText += ";margin-left:0!important;padding-left:12px!important;";
    document.querySelectorAll(".badge, small, span").forEach((el) => {
      if (/v\d+\.\d+/i.test(el.textContent || "") && (el.textContent || "").trim().length < 12) {
        el.remove();
      }
    });
  });
  await page.addStyleTag({
    content: `
      .main-sidebar, aside.main-sidebar, .main-header, .demo-cabinet-banner,
      .cabinet-feedback, #cabinet-feedback-root, .cabinet-module-description { display: none !important; }
      .content-wrapper { margin-left: 0 !important; width: 100% !important; }
      body { overflow: auto !important; }
      .cabinet-utm-lead { display: none !important; }
      .urlBuilder_help { display: none !important; }
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

async function rectUnion(page, selectors) {
  return page.evaluate((sels) => {
    let left = Infinity;
    let top = Infinity;
    let right = -Infinity;
    let bottom = -Infinity;
    let found = false;
    for (const sel of sels) {
      const el = document.querySelector(sel);
      if (!el || el.offsetParent === null) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      found = true;
      left = Math.min(left, r.left);
      top = Math.min(top, r.top);
      right = Math.max(right, r.right);
      bottom = Math.max(bottom, r.bottom);
    }
    if (!found) return null;
    return {
      x: Math.max(0, left - 6),
      y: Math.max(0, top - 6),
      width: Math.min(1580, right - left + 12),
      height: Math.min(1400, bottom - top + 12),
    };
  }, selectors);
}

async function main() {
  fs.mkdirSync(ASSETS, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    channel: process.env.PW_CHANNEL || "chrome",
  });
  const page = await (
    await browser.newContext({
      viewport: { width: 1440, height: 2000 },
      deviceScaleFactor: 2,
      locale: "ru-RU",
    })
  ).newPage();

  await page.goto(`${CABINET}/demo-cabinet?to=${encodeURIComponent("/utm-marks")}`, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  await page.waitForTimeout(4000);
  console.log("demo →", page.url());
  if (page.url().includes("/login")) {
    throw new Error(`Демо не пустил — ${CABINET}`);
  }

  await page.waitForSelector(".cabinet-utm-page .urlBuilder, #urlBuilderUrl", { timeout: 60_000 });

  // Дождаться демо-заполнения и результата
  await page.waitForFunction(
    () => {
      const url = document.getElementById("urlBuilderUrl");
      const src = document.getElementById("urlBuilderUtmSource");
      return !!(url?.value && src?.value);
    },
    { timeout: 30_000 }
  ).catch(() => {});

  // Если результат ещё не собран — клик
  const hasResult = await page.evaluate(() => {
    const body = document.querySelector(".urlBuilder_result_body");
    return !!(body && (body.textContent || "").trim().length > 20);
  });
  if (!hasResult) {
    const go = page.locator(".urlBuilder_go");
    if (await go.count()) await go.click();
    await page.waitForTimeout(800);
  }
  await page.waitForTimeout(500);

  await stripChrome(page);

  // ——— 01: посадочная + шаблоны площадок ———
  let formBox = await rectUnion(page, [
    '.urlBuilder_step[data-step="1"]',
    ".urlBuilder_el-url",
    ".urlBuilder_tpl",
  ]);
  if (!formBox) {
    formBox = await page.evaluate(() => {
      const root = document.querySelector(".urlBuilder_form .row.g-3") || document.querySelector(".urlBuilder");
      if (!root) return null;
      const r = root.getBoundingClientRect();
      return { x: r.left - 6, y: r.top - 6, width: r.width + 12, height: Math.min(520, r.height + 12) };
    });
  }
  console.log("formBox", formBox);
  if (formBox) {
    formBox.height = Math.min(formBox.height, 520);
    await shotClip(page, formBox, "utm-shot-form");
  }

  // ——— 02: базовые параметры (source / medium / campaign) ———
  // Спрятать длинные help-блоки уже в CSS; кадр от шага 2 до content/term
  let paramsBox = await page.evaluate(() => {
    const step2 = document.querySelector('.urlBuilder_step[data-step="2"]');
    const step3 = document.querySelector('.urlBuilder_step[data-step="3"]');
    if (!step2) return null;
    const top = step2.getBoundingClientRect().top;
    // до шага 3 или до кнопки go
    const bottomEl =
      step3 ||
      document.querySelector("#urlBuilderUtmCampaign")?.closest(".urlBuilder_el") ||
      document.querySelector(".urlBuilder_go");
    const bottom = bottomEl
      ? bottomEl.getBoundingClientRect().top - 8
      : top + 700;
    const form = document.querySelector(".urlBuilder_form") || document.querySelector(".urlBuilder");
    const fr = form.getBoundingClientRect();
    return {
      x: Math.max(0, fr.left - 6),
      y: Math.max(0, top - 6),
      width: Math.min(1580, fr.width + 12),
      height: Math.min(1100, Math.max(360, bottom - top + 12)),
    };
  });
  console.log("paramsBox", paramsBox);
  if (paramsBox) {
    await page.evaluate((y) => window.scrollTo(0, Math.max(0, y - 40)), paramsBox.y);
    await page.waitForTimeout(200);
    // пересчитать после скролла
    paramsBox = await page.evaluate(() => {
      const step2 = document.querySelector('.urlBuilder_step[data-step="2"]');
      const campaign = document.getElementById("urlBuilderUtmCampaign");
      const campaignEl = campaign?.closest(".urlBuilder_el");
      if (!step2 || !campaignEl) return null;
      const top = step2.getBoundingClientRect().top;
      const bottom = campaignEl.getBoundingClientRect().bottom;
      const form = document.querySelector(".urlBuilder_form") || document.querySelector(".urlBuilder");
      const fr = form.getBoundingClientRect();
      return {
        x: Math.max(0, fr.left - 6),
        y: Math.max(0, top - 6),
        width: Math.min(1580, fr.width + 12),
        height: Math.min(1200, Math.max(400, bottom - top + 16)),
      };
    });
    console.log("paramsBox2", paramsBox);
    if (paramsBox) await shotClip(page, paramsBox, "utm-shot-params");
  }

  // ——— 03: готовый URL (модалка часто display:none — собираем карточку сами) ———
  await page.evaluate(() => {
    document.querySelector("#utm-shot-result-backdrop")?.remove();
    document.querySelector("#utm-shot-result-card")?.remove();
    const val =
      document.querySelector(".urlBuilder_result_body input")?.value ||
      document.querySelector(".urlBuilder_result_body textarea")?.value ||
      "";
    if (!val) return;

    const backdrop = document.createElement("div");
    backdrop.id = "utm-shot-result-backdrop";
    backdrop.style.cssText =
      "position:fixed;inset:0;z-index:2999;background:#f1f5f9;";
    document.body.appendChild(backdrop);

    const host = document.createElement("div");
    host.id = "utm-shot-result-card";
    host.style.cssText = [
      "position:fixed",
      "left:50%",
      "top:100px",
      "transform:translateX(-50%)",
      "width:min(1100px,92vw)",
      "z-index:3000",
      "background:#fff",
      "border:1px solid #e2e8f0",
      "border-radius:12px",
      "padding:24px 28px",
      "box-shadow:0 16px 48px rgba(15,23,42,.18)",
      "font-family:system-ui,-apple-system,sans-serif",
    ].join(";");
    const title = document.createElement("div");
    title.textContent = "Готово! Можно использовать:";
    title.style.cssText = "font-weight:600;font-size:16px;margin-bottom:14px;color:#0f172a;";
    const ta = document.createElement("textarea");
    ta.readOnly = true;
    ta.value = val;
    ta.rows = 3;
    ta.style.cssText = [
      "width:100%",
      "box-sizing:border-box",
      "font-family:ui-monospace,SFMono-Regular,Menlo,monospace",
      "font-size:13px",
      "line-height:1.45",
      "padding:12px 14px",
      "border:1px solid #cbd5e1",
      "border-radius:8px",
      "resize:none",
      "color:#0f172a",
      "background:#f8fafc",
    ].join(";");
    host.appendChild(title);
    host.appendChild(ta);
    document.body.appendChild(host);
  });
  await page.waitForTimeout(200);

  let resultBox = await page.evaluate(() => {
    const host = document.querySelector("#utm-shot-result-card");
    if (!host) return null;
    const r = host.getBoundingClientRect();
    return {
      x: Math.max(0, r.left - 12),
      y: Math.max(0, r.top - 12),
      width: Math.min(1580, r.width + 24),
      height: Math.min(600, Math.max(160, r.height + 24)),
    };
  });
  console.log("resultBox", resultBox);
  if (resultBox) await shotClip(page, resultBox, "utm-shot-result");

  await browser.close();
  console.log("done —", CABINET);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
