/**
 * Скриншоты секций лендинга analiz-konkurentov с redbox.su.
 * node scripts/capture-competitor-screenshots.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../public/modules/assets");
const URL = "https://redbox.su/analiz-konkurentov/";

const SECTION_SLUGS = [
  { match: /Как это работает/i, file: "competitor-capture-form.png" },
  { match: /^Сначала$/i, file: "competitor-capture-loading.png" },
  { match: /Наш сервис покажет/i, file: "competitor-capture-top-meta.png" },
  { match: /Топ сайтов на основе/i, file: "competitor-capture-top-sites.png" },
  { match: /проценту попадания в топ/i, file: "competitor-capture-share.png" },
  { match: /Анализ тегов/i, file: "competitor-capture-tags.png" },
];

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.waitForTimeout(2000);

  for (const { match, file } of SECTION_SLUGS) {
    const h2 = page.locator("h2.main1").filter({ hasText: match }).first();
    if (!(await h2.count())) {
      console.warn("no h2", match);
      continue;
    }
    await h2.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    let block = h2.locator("xpath=following-sibling::*[contains(@class,'descriptive')][1]");
    if (!(await block.count())) {
      block = h2.locator("xpath=following-sibling::*[1]");
    }
    const out = path.join(OUT, file);
    try {
      await block.screenshot({ path: out, timeout: 15_000 });
      console.log("ok", file);
    } catch (e) {
      console.warn("fail", file, e.message);
    }
  }

  const tablet = page.locator("img[src*='dfb5727037fba880825685b2e71a6d09']").first();
  if (await tablet.count()) {
    await tablet.scrollIntoViewIfNeeded();
    const out = path.join(OUT, "competitor-capture-hero-tablet.png");
    await tablet.locator("xpath=ancestor::figure[1]").first().screenshot({ path: out }).catch(async () => {
      await tablet.screenshot({ path: out });
    });
    console.log("ok hero-tablet");
  }

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
