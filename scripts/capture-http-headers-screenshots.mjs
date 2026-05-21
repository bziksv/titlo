/**
 * Кропы UI HTTP headers из tablet-скрина redbox (fca23ef04bd3b647.png, 800×660).
 * Границы сайдбара и контента — по пикселям. Пакет — коллаж иконок (не A/文 276b48fc).
 * node scripts/capture-http-headers-screenshots.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.join(__dirname, "../public/modules/assets");
const SRC = path.join(ASSETS, "fca23ef04bd3b647.png");
const MARGIN = 6;
const ICON_SIZE = 120;

async function loadRaw(file) {
  return sharp(file).raw().toBuffer({ resolveWithObject: true });
}

async function detectBounds(file) {
  const { data, info } = await loadRaw(file);
  const { width, height, channels } = info;

  let sidebarEnd = 0;
  for (let x = 0; x < width; x++) {
    let dark = 0;
    let samples = 0;
    for (let y = 80; y < height - 40; y += 6) {
      const i = (y * width + x) * channels;
      const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      if (lum < 90) dark++;
      samples++;
    }
    if (dark / samples > 0.35) sidebarEnd = x;
    else if (x > sidebarEnd + 5 && sidebarEnd > 0) break;
  }

  const contentLeft = sidebarEnd + MARGIN;
  let contentTop = 0;
  for (let y = 0; y < height; y++) {
    let light = 0;
    for (let x = contentLeft; x < width - 20; x += 4) {
      const i = (y * width + x) * channels;
      const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      if (lum > 200) light++;
    }
    if (light > 80) {
      contentTop = y;
      break;
    }
  }

  let contentBottom = height - 1;
  for (let y = height - 1; y >= 0; y--) {
    let light = 0;
    for (let x = contentLeft; x < width - 20; x += 4) {
      const i = (y * width + x) * channels;
      const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      if (lum > 180) light++;
    }
    if (light > 80) {
      contentBottom = y;
      break;
    }
  }

  let contentRight = width - 1;
  for (let x = width - 1; x >= contentLeft; x--) {
    let light = 0;
    let samples = 0;
    for (let y = contentTop; y <= contentBottom; y += 6) {
      const i = (y * width + x) * channels;
      const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      if (lum > 180) light++;
      samples++;
    }
    if (light / samples > 0.5) {
      contentRight = x;
      break;
    }
  }

  return {
    left: contentLeft,
    top: contentTop,
    width: contentRight - contentLeft + 1,
    height: contentBottom - contentTop + 1,
    sidebarEnd,
  };
}

async function cropPanel(bounds) {
  const out = path.join(ASSETS, "http-headers-shot-screen.png");
  await sharp(SRC)
    .extract(bounds)
    .png()
    .toFile(out);
  console.log("ok", path.basename(out), bounds);
  return bounds;
}

async function cropForm(bounds) {
  const form = {
    left: bounds.left,
    top: bounds.top,
    width: bounds.width,
    height: Math.min(130, bounds.height),
  };
  const out = path.join(ASSETS, "http-headers-shot-form.png");
  await sharp(SRC).extract(form).png().toFile(out);
  console.log("ok", path.basename(out), form);
}

async function cropWorkspace(bounds) {
  const ws = {
    left: bounds.left,
    top: bounds.top + 28,
    width: bounds.width,
    height: bounds.height - 28,
  };
  const out = path.join(ASSETS, "http-headers-shot-workspace.png");
  await sharp(SRC).extract(ws).png().toFile(out);
  console.log("ok", path.basename(out), ws);
}

/** Коллаж возможностей пакетной проверки (иконки с redbox, не 276b48fc A/文). */
async function buildBatchCollage() {
  const icons = [
    { file: "7926b6280ae1cde1.png", label: "Коды ответа" },
    { file: "ad4110fce10be168.png", label: "Кэш" },
    { file: "ddb0b02eb692b169.png", label: "Сжатие" },
    { file: "1afbca1b2547f1d6.png", label: "User-Agent" },
  ];

  const tiles = [];
  const cols = 2;
  const pad = 48;
  const gap = 40;
  const canvasW = 720;
  const canvasH = 432;

  for (let i = 0; i < icons.length; i++) {
    const disk = path.join(ASSETS, icons[i].file);
    if (!fs.existsSync(disk)) throw new Error(`missing ${disk}`);
    const col = i % cols;
    const row = Math.floor(i / cols);
    const tileW = (canvasW - pad * 2 - gap) / cols;
    const tileH = (canvasH - pad * 2 - gap) / cols;
    const left = pad + col * (tileW + gap) + Math.floor((tileW - ICON_SIZE) / 2);
    const top = pad + row * (tileH + gap) + Math.floor((tileH - ICON_SIZE) / 2) - 8;

    const iconBuf = await sharp(disk)
      .flatten({ background: "#f8fafc" })
      .resize(ICON_SIZE, ICON_SIZE, { fit: "contain", background: "#f8fafc" })
      .png()
      .toBuffer();

    tiles.push({ input: iconBuf, left, top });
  }

  const out = path.join(ASSETS, "http-headers-shot-batch.png");
  await sharp({
    create: { width: canvasW, height: canvasH, channels: 3, background: "#f8fafc" },
  })
    .composite(tiles)
    .png()
    .toFile(out);
  console.log("ok", path.basename(out), `${canvasW}x${canvasH}`);
}

async function main() {
  if (!fs.existsSync(SRC)) {
    console.error("missing", SRC);
    process.exit(1);
  }

  const bounds = await detectBounds(SRC);
  console.log("bounds", bounds);
  await cropPanel(bounds);
  await cropForm(bounds);
  await cropWorkspace(bounds);
  await buildBatchCollage();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
