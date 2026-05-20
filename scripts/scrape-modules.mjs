/**
 * Полный текст и иллюстрации лендингов модулей с redbox.su → lib/content/modules.generated.ts
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as cheerio from "cheerio";
import { parseH1, parseKrakenLead, parseKrakenSections } from "./lib/kraken-parse.mjs";
import { mirrorFileUploadUrls } from "./lib/mirror-images.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MODULES_TS = path.join(__dirname, "../lib/content/modules.ts");
const OUT = path.join(__dirname, "../lib/content/modules.generated.ts");
const PUBLIC = path.join(__dirname, "../public");
const SITE = "https://redbox.su";

const paths = [...fs.readFileSync(MODULES_TS, "utf8").matchAll(/path: "(\/[^"]+\/)"/g)].map((m) => m[1]);

const items = [];

for (const p of paths) {
  const slug = p.replace(/^\/|\/$/g, "");
  const url = `${SITE}${p}`;
  const html = await (await fetch(url)).text();
  const $ = cheerio.load(html);
  const h1 = parseH1($);
  const sections = parseKrakenSections($, SITE);
  const lead = parseKrakenLead($, sections);
  const metaDesc = $("meta[name='description']").attr("content")?.trim() || "";
  const description = metaDesc.includes("| Инструменты для SEO |")
    ? lead.slice(0, 160) || h1
    : metaDesc;

  const blockCount = sections.reduce((n, s) => n + s.blocks.length, 0);
  const imgCount = sections.reduce(
    (n, s) => n + s.blocks.filter((b) => b.type === "img").length,
    0,
  );

  items.push({ slug, path: p, h1, lead, description, sections });
  console.log(slug, "sections:", sections.length, "blocks:", blockCount, "imgs:", imgCount);
  await new Promise((r) => setTimeout(r, 150));
}

function serializeBlock(b, indent) {
  if (b.type === "p") return `${indent}{ type: "p", text: ${JSON.stringify(b.text)} },`;
  if (b.type === "list") {
    const items = b.items.map((i) => `${indent}  ${JSON.stringify(i)},`).join("\n");
    return `${indent}{ type: "list", items: [\n${items}\n${indent}] },`;
  }
  return `${indent}{ type: "img", src: ${JSON.stringify(b.src)}, alt: ${JSON.stringify(b.alt || "")} },`;
}

const lines = [
  "/** AUTO-GENERATED: node scripts/scrape-modules.mjs */",
  'export type ContentBlock =',
  '  | { type: "p"; text: string }',
  '  | { type: "list"; items: string[] }',
  '  | { type: "img"; src: string; alt?: string };',
  "export type ModuleSection = { title: string; blocks: ContentBlock[] };",
  "export type ModuleContent = {",
  "  slug: string;",
  "  path: string;",
  "  h1: string;",
  "  description: string;",
  "  lead: string;",
  "  sections: ModuleSection[];",
  "};",
  "",
  "export const MODULE_CONTENT: ModuleContent[] = [",
];

for (const m of items) {
  const secLines = m.sections
    .map((s) => {
      const blockLines = s.blocks.map((b) => serializeBlock(b, "        ")).join("\n");
      return `      { title: ${JSON.stringify(s.title)}, blocks: [\n${blockLines}\n      ] },`;
    })
    .join("\n");
  lines.push(`  {
    slug: ${JSON.stringify(m.slug)},
    path: ${JSON.stringify(m.path)},
    h1: ${JSON.stringify(m.h1)},
    description: ${JSON.stringify(m.description)},
    lead: ${JSON.stringify(m.lead)},
    sections: [
${secLines}
    ],
  },`);
}

lines.push(
  "];",
  "",
  "export function getModuleContent(slug: string): ModuleContent | undefined {",
  "  return MODULE_CONTENT.find((m) => m.slug === slug);",
  "}",
  "",
);

fs.writeFileSync(OUT, lines.join("\n"));
console.log("written", OUT);

await mirrorFileUploadUrls(OUT, PUBLIC, { assetDir: "modules" });
