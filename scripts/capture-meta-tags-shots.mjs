/**
 * Скрины РЕАЛЬНОГО UI «Мониторинг мета-тегов» из демо-кабинета.
 *
 *   node scripts/capture-meta-tags-shots.mjs
 *   CABINET_BASE=http://127.0.0.1:3002 node scripts/capture-meta-tags-shots.mjs
 *
 * Нужен кабинет с /meta-tags?form=1 (обход витрины снимка).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.join(__dirname, "../public/modules/assets");
const CABINET = (process.env.CABINET_BASE || "https://cabinet.titlo.ru").replace(/\/$/, "");

const SAMPLE_URLS = [
  "https://titlo.ru/",
  "https://titlo.ru/monitoring-saytov/",
  "https://titlo.ru/proverka-meta-tegov-online/",
  "https://titlo.ru/analiz-relevantnosti/",
  "https://titlo.ru/klasterizator-klyuchevykh-slov/",
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

async function demoLogin(page, toPath) {
  await page.goto(`${CABINET}/demo-cabinet?to=${encodeURIComponent(toPath)}`, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  await page.waitForTimeout(2000);
  console.log("demo →", page.url());
  if (page.url().includes("/login")) {
    throw new Error(`Демо не пустил — ${CABINET}`);
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

  // витрина → id снимка
  await demoLogin(page, "/meta-tags");
  await page.waitForURL(/meta-tags\/history\/\d+/, { timeout: 90_000 });
  const histId = (page.url().match(/history\/(\d+)/) || [])[1];
  console.log("histId", histId);

  const projects = await page.evaluate(async () => {
    const r = await fetch("/meta-tags/projects", {
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    });
    return r.json();
  });
  const projectId = Array.isArray(projects) && projects[0] ? projects[0].id : null;
  console.log("projectId", projectId);

  // ——— 01: форма (?form=1) ———
  await page.goto(`${CABINET}/meta-tags?form=1`, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  await page.waitForTimeout(2000);
  if (page.url().includes("/history/")) {
    throw new Error("Кабинет редиректит /meta-tags на витрину — нужен патч ?form=1");
  }
  await page.waitForSelector("#cabinet-mt-step-1 textarea, .cabinet-mt-check-card textarea", {
    timeout: 60_000,
  });
  await page.fill("#cabinet-mt-step-1 textarea, .cabinet-mt-check-card textarea", SAMPLE_URLS);
  await page.waitForTimeout(400);
  // дождаться таблицы проектов, если подгружается
  await page.waitForSelector(".cabinet-mt-page", { timeout: 30_000 });
  await page.waitForTimeout(1500);
  await stripChrome(page);

  const formBox = await page.evaluate(() => {
    const root = document.querySelector(".cabinet-mt-page") || document.querySelector(".content");
    const step1 = document.getElementById("cabinet-mt-step-1");
    const step2 = document.getElementById("cabinet-mt-step-2");
    const projects = document.querySelector(".cabinet-mt-projects, #cabinet-mt-projects, table");
    const rr = root.getBoundingClientRect();
    const top = (step1 || root).getBoundingClientRect().top - 6;
    let bottom = (step1 || root).getBoundingClientRect().bottom + 12;
    [step2, projects].forEach((el) => {
      if (!el) return;
      const b = el.getBoundingClientRect().bottom;
      if (b > bottom && b - top < 1400) bottom = b + 10;
    });
    // если проектов нет — возьмём шаг 1 + часть шага 2 / how-to
    if (bottom - top < 420 && step2) {
      bottom = Math.min(step2.getBoundingClientRect().bottom + 10, top + 1100);
    }
    return {
      x: Math.max(0, rr.left),
      y: Math.max(0, top),
      width: Math.min(1580, rr.width),
      height: Math.min(1400, Math.max(360, bottom - top)),
    };
  });
  await shotClip(page, formBox, "meta-tags-shot-form");

  // ——— 02: снимок истории (таблица URL + раскрытая карточка) ———
  await page.goto(`${CABINET}/meta-tags/history/${histId}`, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  await page.waitForSelector("#cabinet-mt-filter-select, .cabinet-mt-page .card", { timeout: 90_000 });
  await page.waitForFunction(
    () => (document.querySelector(".cabinet-mt-page")?.innerText || "").includes("http"),
    { timeout: 90_000 }
  );
  await page.waitForTimeout(2000);
  // раскрыть первую карточку
  await page.evaluate(() => {
    const link = document.querySelector(".accordion-title, [data-bs-toggle='collapse']");
    if (link) link.click();
  });
  await page.waitForTimeout(800);
  await stripChrome(page);

  const histBox = await page.evaluate(() => {
    const root = document.querySelector(".cabinet-mt-page") || document.querySelector("#app");
    const rr = root.getBoundingClientRect();
    return {
      x: Math.max(0, rr.left),
      y: Math.max(0, rr.top - 4),
      width: Math.min(1580, rr.width),
      height: Math.min(1400, Math.max(400, Math.min(rr.height + 8, 1300))),
    };
  });
  await shotClip(page, histBox, "meta-tags-shot-history");

  // ——— 03: список снимков проекта или сравнение ———
  if (projectId) {
    await page.goto(`${CABINET}/meta-tags/histories/${projectId}`, {
      waitUntil: "domcontentloaded",
      timeout: 120_000,
    });
    await page.waitForTimeout(2500);
    await stripChrome(page);

    // если есть ≥2 снимка — сравнение
    const compareHref = await page.evaluate(() => {
      const ids = [
        ...new Set(
          [...document.querySelectorAll("a[href*='/meta-tags/history/']")]
            .map((a) => (a.getAttribute("href") || "").match(/history\/(\d+)/)?.[1])
            .filter(Boolean)
        ),
      ];
      if (ids.length >= 2) return `/meta-tags/history/${ids[0]}/compare/${ids[1]}`;
      return null;
    });

    if (compareHref) {
      await page.goto(`${CABINET}${compareHref}`, {
        waitUntil: "domcontentloaded",
        timeout: 120_000,
      });
      await page.waitForTimeout(4000);
      await stripChrome(page);
      const cmpBox = await page.evaluate(() => {
        const root =
          document.querySelector(".cabinet-mt-page") ||
          document.querySelector(".content") ||
          document.querySelector("#app");
        const rr = root.getBoundingClientRect();
        return {
          x: Math.max(0, rr.left),
          y: Math.max(0, rr.top - 4),
          width: Math.min(1580, rr.width),
          height: Math.min(1400, Math.max(400, Math.min(rr.height + 8, 1200))),
        };
      });
      await shotClip(page, cmpBox, "meta-tags-shot-compare");
    } else {
      const listBox = await page.evaluate(() => {
        const root =
          document.querySelector(".cabinet-mt-page") ||
          document.querySelector(".content");
        const rr = root.getBoundingClientRect();
        return {
          x: Math.max(0, rr.left),
          y: Math.max(0, rr.top - 4),
          width: Math.min(1580, rr.width),
          height: Math.min(1100, Math.max(320, rr.height + 8)),
        };
      });
      await shotClip(page, listBox, "meta-tags-shot-histories");
    }
  }

  await browser.close();
  console.log("done —", CABINET);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
