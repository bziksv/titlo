/**
 * Кропы UI «Анализ текста» — рабочая область без сайдбара RedBox.
 * Граница сайдбара определяется по пикселям (не фиксированные 168px).
 * node scripts/capture-analiz-teksta-screenshots.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.join(__dirname, "../public/modules/assets");

const MARGIN = 6;

const SOURCES = [
  { src: "0d20bf0152839075.jpg", out: "text-anal-shot-table.jpg" },
  { src: "a2c300ca36c2ea27.jpg", out: "text-anal-shot-input.jpg" },
  { src: "474da29ee76c785b.jpg", out: "text-anal-shot-settings.jpg" },
  {
    src: "db844d36fa540fa7.jpg",
    out: "text-anal-shot-zipf.jpg",
    /** Только блок графика Ципфа, без таблицы «Общий анализ слов» */
    maxHeight: 210,
  },
];

async function detectSidebarEnd(inputPath) {
  const { data, info } = await sharp(inputPath)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  let lastDark = 0;

  for (let x = 0; x < width; x++) {
    let dark = 0;
    let samples = 0;
    for (let y = 0; y < height; y += 3) {
      const i = (y * width + x) * channels;
      const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      if (lum < 120) dark++;
      samples++;
    }
    if (dark / samples > 0.35) lastDark = x;
    else if (x > lastDark + 3 && lastDark > 0) return lastDark + 1;
  }

  return lastDark + 1;
}

async function cropOne({ src, out, maxHeight }) {
  const disk = path.join(ASSETS, src);
  if (!fs.existsSync(disk)) {
    throw new Error(`missing ${disk}`);
  }

  const meta = await sharp(disk).metadata();
  const sidebarEnd = await detectSidebarEnd(disk);
  const left = Math.min(sidebarEnd + MARGIN, meta.width - 200);
  const width = meta.width - left;
  const height = maxHeight
    ? Math.min(maxHeight, meta.height)
    : meta.height;

  const outPath = path.join(ASSETS, out);
  await sharp(disk)
    .extract({ left, top: 0, width, height })
    .jpeg({ quality: 92 })
    .toFile(outPath);

  console.log("ok", out, { left, width, height, sidebarEnd });
}

async function main() {
  fs.mkdirSync(ASSETS, { recursive: true });
  for (const item of SOURCES) {
    await cropOne(item);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
