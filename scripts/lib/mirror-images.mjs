/**
 * Скачивает https://redbox.su/upload/... в public/ и подменяет URL в TS-файле на локальные пути.
 */
import crypto from "crypto";
import fs from "fs";
import path from "path";

const UPLOAD_RE = /https:\/\/redbox\.su\/upload\/[^"'`\s)]+/gi;

export function localPathForUrl(url, assetDir = "news") {
  const { pathname } = new URL(url);
  let ext = path.extname(pathname).toLowerCase();
  if (!ext || ext.length > 6) ext = ".jpg";
  const hash = crypto.createHash("sha1").update(url).digest("hex").slice(0, 16);
  return `/${assetDir}/assets/${hash}${ext}`;
}

export async function mirrorOne(url, publicRoot, assetDir = "news") {
  const local = localPathForUrl(url, assetDir);
  const disk = path.join(publicRoot, local);
  if (fs.existsSync(disk)) return local;
  fs.mkdirSync(path.dirname(disk), { recursive: true });
  let res = await fetch(url, {
    headers: { "User-Agent": "redbox-migration/1.0" },
    redirect: "follow",
  });
  if (!res.ok && url.includes("/iblock/") && !url.includes("/resize_cache/")) {
    const m = url.match(/^(https?:\/\/[^/]+)\/upload\/iblock\/([^/]+)\/([^/?]+)/i);
    if (m) {
      const resize = `${m[1]}/upload/resize_cache/iblock/${m[2]}/600_400_1/${m[3]}`;
      const r2 = await fetch(resize, {
        headers: { "User-Agent": "redbox-migration/1.0" },
        redirect: "follow",
      });
      if (r2.ok) {
        res = r2;
        url = resize;
      }
    }
  }
  if (!res.ok) throw new Error(`${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(disk, buf);
  return local;
}

/** Заменить все upload-URL в файле на локальные пути в public/{assetDir}/assets/ */
export async function mirrorFileUploadUrls(tsFilePath, publicRoot, options = {}) {
  const assetDir = options.assetDir ?? "news";
  let content = fs.readFileSync(tsFilePath, "utf8");
  const urls = [...new Set(content.match(UPLOAD_RE) ?? [])];
  if (!urls.length) {
    console.log("no redbox.su/upload URLs to mirror");
    return 0;
  }

  const map = {};
  for (const url of urls) {
    try {
      map[url] = await mirrorOne(url, publicRoot, assetDir);
      console.log("ok", path.basename(map[url]), "←", url.slice(-48));
    } catch (e) {
      console.warn("skip", url, e.message);
    }
    await new Promise((r) => setTimeout(r, 80));
  }

  for (const [url, local] of Object.entries(map)) {
    content = content.split(url).join(local);
  }
  // Битые upload-URL в превью — убираем строку (карточка без картинки)
  content = content.replace(/\n    imageUrl: "https:\/\/redbox\.su\/[^"]+",/g, "");

  fs.writeFileSync(tsFilePath, content);
  console.log("mirrored", Object.keys(map).length, "of", urls.length, "→", tsFilePath);
  return Object.keys(map).length;
}
