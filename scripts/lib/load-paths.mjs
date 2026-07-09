import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

export function loadModulePaths() {
  const src = fs.readFileSync(path.join(ROOT, "lib/content/modules.ts"), "utf8");
  return [...src.matchAll(/path: "([^"]+)"/g)].map((m) => m[1]);
}

export function loadNewsDetailPaths() {
  const src = fs.readFileSync(path.join(ROOT, "lib/content/news.generated.ts"), "utf8");
  return [...src.matchAll(/slug: "([^"]+)"/g)].map((m) => `/news/detail/${m[1]}/`);
}

export function loadLegalPaths() {
  const src = fs.readFileSync(path.join(ROOT, "lib/content/legal.generated.ts"), "utf8");
  const html = [...src.matchAll(/slug: "([^"]+)"/g)].map((m) => `/legal/${m[1]}/`);
  const pdfSrc = fs.readFileSync(path.join(ROOT, "lib/content/legal-pdfs.ts"), "utf8");
  const pdf = [...pdfSrc.matchAll(/slug: "([^"]+)"/g)].map((m) => `/legal/doc/${m[1]}/`);
  return [...html, ...pdf];
}
