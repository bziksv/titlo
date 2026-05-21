/**
 * Кропы UI «Подсчёт длины текста» из tablet-скрина redbox (af060603 → a5f1bfd79fcdf76a.png).
 * node scripts/capture-text-length-screenshots.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, "../public/modules/assets/a5f1bfd79fcdf76a.png");
const OUT = path.join(__dirname, "../public/modules/assets");

const CLIPS = [
  { file: "text-length-capture-hero.png", clip: { x: 0, y: 0, width: 800, height: 609 } },
  { file: "text-length-capture-form.png", clip: { x: 228, y: 88, width: 548, height: 420 } },
  { file: "text-length-capture-input.png", clip: { x: 248, y: 248, width: 508, height: 220 } },
];

async function main() {
  if (!fs.existsSync(SRC)) {
    console.error("missing", SRC);
    process.exit(1);
  }
  fs.mkdirSync(OUT, { recursive: true });
  const b64 = fs.readFileSync(SRC).toString("base64");
  const srcUrl = `data:image/png;base64,${b64}`;
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 800, height: 609 } });
  await page.setContent(
    `<!DOCTYPE html><html><body style="margin:0;background:#fff"><img src="${srcUrl}" width="800" height="609" alt=""></body></html>`
  );
  await page.waitForTimeout(200);

  for (const { file, clip } of CLIPS) {
    const out = path.join(OUT, file);
    await page.screenshot({ path: out, clip });
    console.log("ok", file, clip);
  }

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
