/**
 * WebP для обложек новостей: public/news/assets/*.{png,jpg} → *.webp
 * (оригиналы не трогаем; карточки списка берут .webp).
 *
 * Запуск: node scripts/optimize-news-images.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.join(__dirname, "../public/news/assets");
const MAX_WIDTH = 1200;
const QUALITY = 90;

const exts = new Set([".png", ".jpg", ".jpeg"]);

async function convertOne(file) {
  const ext = path.extname(file).toLowerCase();
  if (!exts.has(ext)) return null;
  const base = path.basename(file, ext);
  const src = path.join(ASSETS, file);
  const dest = path.join(ASSETS, `${base}.webp`);

  const srcStat = fs.statSync(src);
  if (fs.existsSync(dest) && fs.statSync(dest).mtimeMs >= srcStat.mtimeMs) {
    return { skipped: true, file };
  }

  await sharp(src)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 4 })
    .toFile(dest);

  const before = srcStat.size;
  const after = fs.statSync(dest).size;
  return { skipped: false, file, before, after };
}

async function main() {
  if (!fs.existsSync(ASSETS)) {
    console.error("нет каталога", ASSETS);
    process.exit(1);
  }

  const files = fs.readdirSync(ASSETS).filter((f) => exts.has(path.extname(f).toLowerCase()));
  let done = 0;
  let skipped = 0;
  let saved = 0;

  for (const file of files) {
    try {
      const r = await convertOne(file);
      if (!r) continue;
      if (r.skipped) {
        skipped += 1;
        continue;
      }
      done += 1;
      saved += r.before - r.after;
      const pct = Math.round((1 - r.after / r.before) * 100);
      console.log(
        `✓ ${file} → ${path.basename(file, path.extname(file))}.webp  ${Math.round(r.before / 1024)}K → ${Math.round(r.after / 1024)}K (−${pct}%)`
      );
    } catch (e) {
      console.error(`✗ ${file}:`, e.message || e);
    }
  }

  console.log(
    `\nготово: ${done} новых, ${skipped} без изменений, экономия ~${Math.round(saved / 1024 / 1024)} МБ`
  );
}

await main();
