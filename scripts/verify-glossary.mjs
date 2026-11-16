/** Read-only smoke test: BASE_URL=http://localhost:3013 node scripts/verify-glossary.mjs */
import assert from "node:assert/strict";
import { load } from "cheerio";
const base = (process.env.BASE_URL || "http://localhost:3013").replace(/\/$/, "");
const origin = process.env.CANONICAL_BASE || "https://titlo.ru";
const slug = "semanticheskoe-yadro";
for (const path of ["/slovar/", `/slovar/${slug}/`]) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200, `${path}: HTTP 200`);
  const $ = load(await response.text());
  assert.equal($("h1").length, 1, "exactly one H1");
  assert.equal($('link[rel="canonical"]').attr("href"), origin + path);
  const graphs = $('script[type="application/ld+json"]').toArray().flatMap(el => {
    const data = JSON.parse($(el).text());
    return data["@graph"] || [data];
  });
  for (const type of ["BreadcrumbList", ...(path.includes(slug) ? ["DefinedTerm", "FAQPage"] : ["DefinedTermSet"])]) {
    assert.ok(graphs.some(g => g["@type"] === type), `${path}: ${type}`);
  }
  assert.ok(JSON.stringify(graphs).includes('"DefinedTermSet"'), `${path}: DefinedTermSet (top-level or inDefinedTermSet)`);
  const links = $('main a[href^="/slovar/"]').toArray().map(el => $(el).attr("href"));
  assert.ok(links.every(href => ["/slovar/", `/slovar/${slug}/`].includes(href.split("#")[0])), "no unpublished term links");
  for (const el of $('main a[href^="#"]').toArray()) {
    const id = $(el).attr("href").slice(1);
    assert.ok($(`[id="${id}"]`).length, `anchor exists: ${id}`);
  }
  if (path.includes(slug)) {
    const article = $("article[data-glossary-term]");
    assert.equal(article.length, 1);
    assert.ok(article.find("table tbody tr").length >= 5);
    assert.ok(article.find("details").length >= 3);
    for (const mod of ["sbor-poiskovykh-podskazok", "generator_slov", "klasterizator-klyuchevykh-slov"]) {
      assert.ok(article.find(`a[href="/${mod}/"]`).length, `module CTA ${mod}`);
    }
    console.log("Article words:", article.text().match(/[\p{L}\p{N}]+(?:[-–][\p{L}\p{N}]+)*/gu)?.length);
    const faq = graphs.find(g => g["@type"] === "FAQPage");
    assert.equal(faq.mainEntity.length, article.find("#faq details").length);
  } else {
    assert.equal($("a[data-category]").length, 20, "20 category chips");
  }
  const image = $('meta[property="og:image"]').attr("content");
  assert.ok(image);
  const img = await fetch(base + new URL(image, origin).pathname);
  assert.equal(img.status, 200, "OG image HTTP 200");
  assert.match(img.headers.get("content-type") || "", /image\/png/);
  console.log(`PASS ${path}`);
}
const sm = await (await fetch(base + "/sitemap.xml")).text();
for (const path of ["/slovar/", `/slovar/${slug}/`]) assert.ok(sm.includes(origin + path), `sitemap: ${path}`);
console.log("PASS sitemap");
