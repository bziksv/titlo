/**
 * Кропы tablet-скрина HTTP headers (fca23ef04bd3b647.png).
 * node scripts/capture-http-headers-screenshots.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, "../public/modules/assets/fca23ef04bd3b647.png");
const OUT = path.join(__dirname, "../public/modules/assets");

const CLIPS = [
  { file: "http-headers-capture-form.png", clip: { x: 228, y: 88, width: 548, height: 420 } },
  { file: "http-headers-capture-url.png", clip: { x: 248, y: 248, width: 508, height: 180 } },
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
  const page = await browser.newPage({ viewport: { width: 800, height: 660 } });
  await page.setContent(
    `<!DOCTYPE html><html><body style="margin:0;background:#fff"><img src="${srcUrl}" width="800" height="660" alt=""></body></html>`
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
