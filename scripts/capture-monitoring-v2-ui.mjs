/**
 * Снимки monitoring-v2 для лендинга (sv6@list.ru).
 * Ждём ajax.list + строки таблицы; админ-лог #cabinet-mon-v2-admin-debug скрываем.
 *
 *   node scripts/capture-monitoring-v2-ui.mjs
 */
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../public/modules/assets");
const cabinetRoot = path.resolve(__dirname, "../../cabinet.titlo.ru");
const phpBin = process.env.PHP_BIN || "/opt/homebrew/opt/php@7.4/bin/php";
const KEYWORDS_PROJECT_ID = process.env.CAPTURE_KEYWORDS_PROJECT || "623";
const FRAME_W = 1280;
const FRAME_H = 800;
const VERSION = "v6";

function publish(filePath, base) {
  const ver = path.join(outDir, `${base}-${VERSION}.png`);
  fs.copyFileSync(filePath, ver);
  for (const suffix of ["v5", "v4", "v3", ""]) {
    const name = suffix ? `${base}-${suffix}.png` : `${base}.png`;
    fs.copyFileSync(filePath, path.join(outDir, name));
  }
  console.log(base, fs.statSync(ver).size);
}

async function hideChrome(page) {
  await page.evaluate(() => {
    const hide = (el) => {
      if (el instanceof HTMLElement) el.style.setProperty("display", "none", "important");
    };
    // админ-лог — всегда, до съёмки
    document.querySelectorAll("#cabinet-mon-v2-admin-debug, .cabinet-mon-v2-admin-debug").forEach(hide);
    document.body.classList.add("sidebar-collapse");
    document
      .querySelectorAll(
        ".sidebar-wrapper, .app-sidebar, aside.app-sidebar, .app-header, .main-header, .app-footer"
      )
      .forEach(hide);
    const main = document.querySelector(".app-content, .app-main");
    if (main instanceof HTMLElement) {
      main.style.marginLeft = "0";
      main.style.width = "100%";
    }
    document.querySelectorAll("a, button").forEach((el) => {
      const t = (el.innerText || "").trim();
      if (/Подставить позиции|Сдвинуть позиции|Очереди съёма|Права в проекте|Администрирование/i.test(t)) {
        const bar = el.closest(".btn-toolbar, .btn-group, .card, nav, .d-flex, .cabinet-mon-v2-toolbar") || el.parentElement;
        if (bar && (bar.innerText || "").length < 800) hide(bar);
      }
    });
    document.querySelectorAll(".badge, [class*='version']").forEach((el) => {
      if (/v\d+\.\d+/.test(el.innerText || "")) hide(el);
    });
  });
}

/** Ждём прогрузку списка проектов (не админ-лог). */
async function waitForProjectsTable(page) {
  await page.waitForFunction(
    () => {
      const ws = document.querySelector("section.cabinet-mon-v2-workspace");
      if (!ws) return false;
      const rows = ws.querySelectorAll("table tbody tr, .cabinet-mon-v2-card[data-project-id]");
      if (rows.length < 5) return false;
      const text = (ws.innerText || "").replace(/\s+/g, " ");
      // таблица с доменами, без лога
      if (/page\.init|ajax\.list\.done|child-rows\.fetch/i.test(text)) return false;
      if (!/\.(ru|su|com|рф)\b/i.test(text)) return false;
      return true;
    },
    null,
    { timeout: 120000 }
  );
  // ещё чуть — дорисовка ТОП-баров / фавиконов
  await page.waitForTimeout(2500);
}

async function padToFrame(context, srcPath, destPath) {
  const b64 = fs.readFileSync(srcPath).toString("base64");
  const p = await context.newPage();
  await p.setViewportSize({ width: FRAME_W, height: FRAME_H });
  await p.setContent(`<!doctype html><html><body style="margin:0;background:#f8fafc">
<canvas id="c" width="${FRAME_W}" height="${FRAME_H}"></canvas>
<script>
const img=new Image();
img.onload=()=>{
  const c=document.getElementById('c');
  const ctx=c.getContext('2d');
  ctx.fillStyle='#f8fafc';
  ctx.fillRect(0,0,${FRAME_W},${FRAME_H});
  const scale=Math.min(${FRAME_W}/img.width, ${FRAME_H}/img.height);
  const w=img.width*scale, h=img.height*scale;
  ctx.drawImage(img,(${FRAME_W}-w)/2,0,w,h);
  document.title='ok';
};
img.src='data:image/png;base64,${b64}';
</script></body></html>`);
  await p.waitForFunction(() => document.title === "ok");
  await p.locator("canvas").screenshot({ path: destPath });
  await p.close();
}

function assertNotLog(filePath, label) {
  // грубая проверка размера — лог-кадры были заметно иначе; плюс OCR нет, смотрим PNG не пустой
  const size = fs.statSync(filePath).size;
  if (size < 80000) throw new Error(`${label}: слишком маленький файл (${size}) — похоже на пустой/лог кадр`);
}

const session = JSON.parse(
  execFileSync(phpBin, [path.join(cabinetRoot, "scripts/auth-session-user.php"), "sv6@list.ru"], {
    encoding: "utf8",
    timeout: 60000,
  })
);
console.log("auth", session.email);

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1600, height: 1000 },
  deviceScaleFactor: 2,
});
await context.addCookies(session.cookies);
const page = await context.newPage();

await page.goto("http://localhost:3002/monitoring-v2", {
  waitUntil: "domcontentloaded",
  timeout: 90000,
});
await hideChrome(page);

const showPort = page.getByRole("button", { name: /Показать портфель/i });
if ((await showPort.count()) && (await showPort.isVisible().catch(() => false))) {
  await showPort.click();
  await page.waitForTimeout(2000);
}
await hideChrome(page);

console.log("waiting for projects table…");
await waitForProjectsTable(page);
await hideChrome(page);

// canvas портфеля (если открыт)
await page.waitForSelector("canvas", { timeout: 30000 }).catch(() => {});

// —— LIST first (главная жалоба) ——
await page.evaluate(() => {
  const port = [...document.querySelectorAll("h2")].find((x) => /Портфель/.test(x.textContent || ""));
  if (port) {
    let el = port;
    for (let i = 0; i < 14; i++) {
      if (el.querySelector?.("canvas")) {
        el.style.setProperty("display", "none", "important");
        break;
      }
      el = el.parentElement;
      if (!el) break;
    }
  }
  document.querySelectorAll("#cabinet-mon-v2-admin-debug").forEach((el) => {
    el.style.setProperty("display", "none", "important");
  });
});

const ws = page.locator("section.cabinet-mon-v2-workspace").first();
await ws.scrollIntoViewIfNeeded();
await page.waitForTimeout(500);

const wsCheck = await ws.evaluate((el) => {
  const text = (el.innerText || "").replace(/\s+/g, " ");
  const rows = el.querySelectorAll("table tbody tr, .cabinet-mon-v2-card[data-project-id]").length;
  return {
    rows,
    hasLog: /page\.init|ajax\.list\.done|Лог прогресса/i.test(text),
    snippet: text.slice(0, 160),
  };
});
console.log("workspace", wsCheck);
if (wsCheck.hasLog || wsCheck.rows < 5) {
  throw new Error(`Список не готов: rows=${wsCheck.rows} hasLog=${wsCheck.hasLog}`);
}

const wb = await ws.boundingBox();
const rawList = path.join(outDir, "_raw-list.png");
await page.screenshot({
  path: rawList,
  clip: {
    x: Math.max(0, wb.x),
    y: Math.max(0, wb.y),
    width: Math.min(1400, wb.width),
    height: FRAME_H,
  },
});
const listOut = path.join(outDir, "_pad-list.png");
await padToFrame(context, rawList, listOut);
assertNotLog(listOut, "list");
publish(listOut, "monitoring-v2-shot-list");
fs.unlinkSync(rawList);
fs.unlinkSync(listOut);

// —— CHARTS ——
await page.evaluate(() => {
  document.querySelector("section.cabinet-mon-v2-workspace")?.style.setProperty("display", "none", "important");
  const port = [...document.querySelectorAll("h2")].find((x) => /Портфель/.test(x.textContent || ""));
  if (port) {
    let el = port;
    for (let i = 0; i < 14; i++) {
      if (el.querySelector?.("canvas")) {
        el.style.removeProperty("display");
        break;
      }
      el = el.parentElement;
      if (!el) break;
    }
  }
});
await hideChrome(page);
const portHandle = await page.evaluateHandle(() => {
  const port = [...document.querySelectorAll("h2")].find((x) => /Портфель/.test(x.textContent || ""));
  let el = port;
  for (let i = 0; i < 14; i++) {
    if (el.querySelector?.("canvas") && el.getBoundingClientRect().height > 200) return el;
    el = el.parentElement;
    if (!el) break;
  }
  return port?.parentElement;
});
const portEl = portHandle.asElement();
if (portEl) {
  await portEl.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const pb = await portEl.boundingBox();
  const rawCharts = path.join(outDir, "_raw-charts.png");
  await page.screenshot({
    path: rawCharts,
    clip: {
      x: Math.max(0, pb.x),
      y: Math.max(0, pb.y),
      width: Math.min(1400, pb.width),
      height: Math.min(FRAME_H, Math.max(400, pb.height + 24)),
    },
  });
  const chartsOut = path.join(outDir, "_pad-charts.png");
  await padToFrame(context, rawCharts, chartsOut);
  publish(chartsOut, "monitoring-v2-shot-charts");
  fs.unlinkSync(rawCharts);
  fs.unlinkSync(chartsOut);
}

// —— KEYWORDS ——
await page.goto(`http://localhost:3002/monitoring/${KEYWORDS_PROJECT_ID}#keywords`, {
  waitUntil: "domcontentloaded",
  timeout: 90000,
});
await hideChrome(page);
await page.waitForFunction(() => document.querySelectorAll("table tbody tr").length >= 5, null, {
  timeout: 90000,
});
await page.waitForTimeout(2000);
await hideChrome(page);
await page.evaluate(() => {
  document.querySelectorAll(".dataTables_scrollBody").forEach((el) => {
    if (el instanceof HTMLElement) {
      el.style.setProperty("max-height", "360px", "important");
      el.style.setProperty("overflow", "hidden", "important");
    }
  });
});
const cb = await page.locator(".cabinet-module-main-card").first().boundingBox();
const rawKw = path.join(outDir, "_raw-kw.png");
await page.screenshot({
  path: rawKw,
  clip: {
    x: Math.max(0, cb.x),
    y: Math.max(0, cb.y),
    width: Math.min(1400, cb.width),
    height: FRAME_H,
  },
});
const kwOut = path.join(outDir, "_pad-kw.png");
await padToFrame(context, rawKw, kwOut);
publish(kwOut, "monitoring-v2-shot-keywords");
fs.unlinkSync(rawKw);
fs.unlinkSync(kwOut);

await browser.close();
console.log(`done → monitoring-v2-shot-*-${VERSION}.png`);
