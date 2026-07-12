/**
 * Импорт юридических документов из ODT (папка политики-titlo-word) → HTML-страницы.
 * Запуск: node scripts/import-legal-odt.mjs
 *
 * На macOS использует textutil; на Linux — python3 + zip/xml (без таблиц).
 */
import { execSync, spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as cheerio from "cheerio";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const ODT_DIR = path.join(ROOT, "политики-titlo-word");
const OUT_TS = path.join(ROOT, "lib/content/legal-pdf.generated.ts");

const SUBDOMAIN_SCOPE =
  " и всех остальных поддоменов *.titlo.ru в рамках основного доменного имени";

const DOCS = [
  {
    file: "politics-titlo.odt",
    slug: "privacy-policy",
    title: "Политика обработки персональных данных",
    metaTitle: "Политика обработки персональных данных",
    version: "21.04.2026",
  },
  {
    file: "cookies-titlo.odt",
    slug: "cookies-policy",
    title: "Политика использования cookie-файлов",
    metaTitle: "Политика использования cookie-файлов",
  },
  {
    file: "rules-recommendation-titlo.odt",
    slug: "recommendation-rules",
    title: "Правила применения рекомендательных технологий",
    metaTitle: "Правила применения рекомендательных технологий",
  },
];

function escapeTs(str) {
  return str.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");
}

function hasTextutil() {
  try {
    execSync("textutil -help", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function odtToHtmlTextutil(odtPath) {
  return execSync(`textutil -convert html -stdout ${JSON.stringify(odtPath)}`, {
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  });
}

/** Fallback: python extracts paragraphs (без таблиц). */
function odtToHtmlPython(odtPath) {
  const py = `
import zipfile, xml.etree.ElementTree as ET, html, sys
path = sys.argv[1]
NS = {'text': 'urn:oasis:names:tc:opendocument:xmlns:text:1.0'}
with zipfile.ZipFile(path) as z:
    root = ET.fromstring(z.read('content.xml'))
out = []
for el in root.iter():
    tag = el.tag.split('}')[-1]
    if tag == 'h':
        level = el.get('{urn:oasis:names:tc:opendocument:xmlns:text:1.0}outline-level', '1')
        t = html.escape(''.join(el.itertext()).strip())
        if t: out.append(f'<h{level}>{t}</h{level}>')
    elif tag == 'p':
        t = html.escape(''.join(el.itertext()).strip())
        if t: out.append(f'<p>{t}</p>')
print(''.join(out))
`;
  const res = spawnSync("python3", ["-c", py, odtPath], { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });
  if (res.status !== 0) throw new Error(res.stderr || "python odt parse failed");
  return `<html><body>${res.stdout}</body></html>`;
}

function normalizeBodyHtml(rawHtml) {
  const $ = cheerio.load(rawHtml);
  $("script, style, meta, title, link").remove();

  $("body span").each(function stripSpan() {
    const $span = $(this);
    $span.replaceWith($span.html() ?? "");
  });

  $("body")
    .find("p")
    .each(function mapParagraph() {
      const $p = $(this);
      const cls = $p.attr("class") ?? "";
      const text = $p.text().trim();
      const htmlInner = ($p.html() ?? "").replace(/<span[^>]*>/gi, "").replace(/<\/span>/gi, "");
      const hasBold = $p.find("b, strong").length > 0 || /<b>|<strong>/i.test(htmlInner);
      const isShortHeading =
        hasBold && text.length < 120 && /^\d+(\.\d+)*\.?\s+\S/.test(text);

      if (!text) {
        $p.remove();
        return;
      }

      if (cls === "p1") {
        $p.replaceWith(`<h1>${htmlInner}</h1>`);
        return;
      }
      if (/версия/i.test(text)) {
        $p.replaceWith(`<p class="legal-doc-version">${htmlInner}</p>`);
        return;
      }
      if ((cls === "p2" || cls === "p3" || cls === "p5") && isShortHeading) {
        $p.replaceWith(`<h2>${htmlInner}</h2>`);
        return;
      }
      if (cls === "p2" && hasBold && text.length < 80) {
        $p.replaceWith(`<h2>${htmlInner}</h2>`);
        return;
      }

      $p.removeAttr("class").removeAttr("style");
    });

  $("li").each(function cleanLi() {
    const $li = $(this);
    $li.removeAttr("class").removeAttr("style");
  });

  $("table").each(function cleanTable() {
    const $table = $(this);
    $table.removeAttr("class").removeAttr("cellspacing").removeAttr("cellpadding");
    $table.addClass("legal-doc-table");
    $table.find("td, th").removeAttr("class").removeAttr("style").removeAttr("valign");
    $table.find("p").each(function flattenCellP() {
      const $p = $(this);
      $p.replaceWith($p.html() ?? "");
    });
  });

  $("a").each(function fixLinks() {
    const $a = $(this);
    $a.removeAttr("class");
    const href = $a.attr("href");
    if (href && !href.startsWith("mailto:") && !href.startsWith("http")) {
      $a.attr("href", `https://${href.replace(/^\/+/, "")}`);
    }
  });

  let html = $("body").html()?.trim() ?? "";
  html = html.replace(/<span[^>]*>(.*?)<\/span>/gi, "$1");
  html = html.replace(/\s+/g, " ").replace(/>\s+</g, "><").trim();
  return applyWebsiteScope(html);
}

function titloLinkPattern() {
  return String.raw`(?:<a[^>]*href="https:\/\/titlo\.ru\/?"[^>]*>(?:<span[^>]*>)?https:\/\/titlo\.ru\/?(?:<\/span>)?<\/a>|https:\/\/titlo\.ru\/?)`;
}

function applyWebsiteScope(html) {
  if (html.includes("*.titlo.ru в рамках основного доменного имени")) {
    return html;
  }

  const link = titloLinkPattern();
  let out = html;

  out = out.replace(new RegExp(`(нашего веб-сайта:\\s*${link})(\\s*\\.)`, "gi"), `$1${SUBDOMAIN_SCOPE}$2`);
  out = out.replace(
    new RegExp(`(интернет-сайте ИП\\s*\\(\\s*${link}\\s*\\))(\\s*\\.)`, "gi"),
    `$1${SUBDOMAIN_SCOPE}$2`,
  );
  out = out.replace(
    new RegExp(`(владельцем сайта\\s+${link})(\\s*(?:\\(|\\.|«))`, "gi"),
    `$1${SUBDOMAIN_SCOPE}$2`,
  );

  return out;
}

function convertOdt(odtPath) {
  const raw = hasTextutil() ? odtToHtmlTextutil(odtPath) : odtToHtmlPython(odtPath);
  return normalizeBodyHtml(raw);
}

function main() {
  if (!fs.existsSync(ODT_DIR)) {
    throw new Error(`Missing folder: ${ODT_DIR}`);
  }

  const docs = [];
  for (const spec of DOCS) {
    const odtPath = path.join(ODT_DIR, spec.file);
    if (!fs.existsSync(odtPath)) {
      throw new Error(`Missing ODT: ${odtPath}`);
    }
    console.log(`Converting ${spec.file}…`);
    const bodyHtml = convertOdt(odtPath);
    docs.push({ ...spec, bodyHtml });
    console.log(`  ${spec.slug}: ${bodyHtml.length} chars`);
  }

  const entries = docs
    .map((d) => {
      const versionLine = d.version ? `\n    version: ${JSON.stringify(d.version)},` : "";
      return `  {
    slug: ${JSON.stringify(d.slug)},
    title: ${JSON.stringify(d.title)},
    metaTitle: ${JSON.stringify(d.metaTitle)},${versionLine}
    bodyHtml: \`${escapeTs(d.bodyHtml)}\`,
  }`;
    })
    .join(",\n");

  const ts = `/** AUTO-GENERATED by scripts/import-legal-odt.mjs — do not edit by hand */
export type LegalPdfDocContent = {
  slug: string;
  title: string;
  metaTitle: string;
  version?: string;
  bodyHtml: string;
};

export const LEGAL_PDF_DOC_CONTENT: LegalPdfDocContent[] = [
${entries}
];
`;

  fs.writeFileSync(OUT_TS, ts);
  console.log(`Wrote ${OUT_TS}`);
}

main();
