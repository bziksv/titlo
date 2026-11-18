/** Read-only smoke test: BASE_URL=http://localhost:3013 node scripts/verify-glossary.mjs */
import assert from "node:assert/strict";
import { load } from "cheerio";
const base = (process.env.BASE_URL || "http://localhost:3013").replace(/\/$/, "");
const origin = process.env.CANONICAL_BASE || "https://titlo.ru";
const TERMS = {
  "semanticheskoe-yadro": ["sbor-poiskovykh-podskazok", "generator_slov", "klasterizator-klyuchevykh-slov"],
  "klasterizatsiya-zaprosov": ["klasterizator-klyuchevykh-slov", "tipy-saitov-v-vydache", "sbor-poiskovykh-podskazok"],
  "chastotnost-zaprosa": ["generator_slov", "sbor-poiskovykh-podskazok", "klasterizator-klyuchevykh-slov"],
  "poiskovye-podskazki": ["sbor-poiskovykh-podskazok", "klasterizator-klyuchevykh-slov", "generator_slov"],
  "intent": ["tipy-saitov-v-vydache", "geo-lokalizaciya-kommerciya", "klasterizator-klyuchevykh-slov"],
  "geozavisimyy-zapros": ["geo-lokalizaciya-kommerciya", "klasterizator-klyuchevykh-slov", "tipy-saitov-v-vydache"],
  "operatory-wordstat": ["generator_slov", "sbor-poiskovykh-podskazok", "klasterizator-klyuchevykh-slov"],
  "relevantnost": ["analiz-relevantnosti", "analiz-teksta", "klasterizator-klyuchevykh-slov"],
  "lsi-slova": ["analiz-relevantnosti", "sbor-poiskovykh-podskazok", "analiz-teksta"],
  "tf-idf": ["analiz-relevantnosti", "analiz-teksta"],
  "toshnota-teksta": ["analiz-teksta", "proverka-teksta-esenin", "analiz-relevantnosti"],
  "vodnost-teksta": ["analiz-teksta", "proverka-teksta-esenin", "podschet-dliny-teksta"],
  "unikalnost-teksta": ["analiz-teksta", "proverka-teksta-esenin", "analiz-relevantnosti"],
  "klyuchevye-slova": ["sbor-poiskovykh-podskazok", "generator_slov", "klasterizator-klyuchevykh-slov"],
  "baden-baden": ["proverka-teksta-esenin", "analiz-teksta", "analiz-relevantnosti"],
  "indeksatsiya": ["proverka-indeksacii", "audit-sajta", "http-headers"],
  "robots-txt": ["audit-sajta", "proverka-indeksacii", "http-headers"],
  "canonical": ["udalenie-dublikatov", "audit-sajta", "proverka-indeksacii"],
  "title": ["proverka-meta-tegov-online", "analiz-teksta", "audit-sajta"],
  "snippet": ["proverka-meta-tegov-online", "tipy-saitov-v-vydache", "analiz-teksta"],
  "poiskovaya-vydacha": ["tipy-saitov-v-vydache", "monitoring-pozicii-sayta", "geo-lokalizaciya-kommerciya"],
  "struktura-sayta": ["klasterizator-klyuchevykh-slov", "audit-sajta", "sbor-poiskovykh-podskazok"],
  "teg-h1": ["proverka-meta-tegov-online", "analiz-teksta", "audit-sajta"],
  "povedencheskie-faktory": ["proverka-meta-tegov-online", "monitoring-pozicii-sayta", "audit-sajta"],
  "ctr": ["proverka-meta-tegov-online", "tipy-saitov-v-vydache", "monitoring-pozicii-sayta"],
  "pokazatel-otkazov": ["audit-sajta", "proverka-meta-tegov-online", "monitoring-pozicii-sayta"],
  "poiskovyy-robot": ["proverka-indeksacii", "audit-sajta", "http-headers"],
  "mikrorazmetka": ["proverka-meta-tegov-online", "tipy-saitov-v-vydache", "audit-sajta"],
  "obratnye-ssylki": ["otslezhivanie-ssylok", "audit-sajta", "monitoring-pozicii-sayta"],
  "nakrutka-pf": ["monitoring-pozicii-sayta", "audit-sajta", "proverka-meta-tegov-online"],
  "nofollow": ["proverka-meta-tegov-online", "audit-sajta", "otslezhivanie-ssylok"],
  "noindex": ["audit-sajta", "proverka-indeksacii", "proverka-meta-tegov-online"],
  "301-redirekt": ["http-headers", "audit-sajta", "proverka-indeksacii"],
  "organicheskiy-trafik": ["monitoring-pozicii-sayta", "audit-sajta", "analiz-relevantnosti"],
  "ranzhirovanie": ["monitoring-pozicii-sayta", "analiz-relevantnosti", "audit-sajta"],
  "dubli-stranits": ["udalenie-dublikatov", "audit-sajta", "proverka-indeksacii"],
  "ssylochnaya-massa": ["otslezhivanie-ssylok", "audit-sajta", "monitoring-pozicii-sayta"],
  "kraud-marketing": ["otslezhivanie-ssylok", "audit-sajta", "monitoring-pozicii-sayta"],
  "tipy-saitov-v-vydache": ["tipy-saitov-v-vydache", "analiz-relevantnosti", "monitoring-pozicii-sayta"],
  "tekstovye-faktory": ["analiz-relevantnosti", "analiz-teksta", "proverka-teksta-esenin"],
  "meta-tegi": ["proverka-meta-tegov-online", "audit-sajta", "proverka-indeksacii"],
  "description": ["proverka-meta-tegov-online", "audit-sajta", "analiz-teksta"],
  "plotnost-klyuchevykh-slov": ["analiz-teksta", "analiz-relevantnosti", "proverka-teksta-esenin"],
  "vnutrennyaya-perelinkovka": ["audit-sajta", "otslezhivanie-ssylok", "proverka-indeksacii"],
  "e-e-a-t": ["audit-sajta", "monitoring-pozicii-sayta", "analiz-relevantnosti"],
  "ankor": ["otslezhivanie-ssylok", "audit-sajta", "monitoring-pozicii-sayta"],
  "posadochnaya-stranica": ["proverka-meta-tegov-online", "audit-sajta", "monitoring-pozicii-sayta"],
  "bitye-ssylki": ["audit-sajta", "http-headers", "proverka-indeksacii"],
  "sitemap-xml": ["audit-sajta", "http-headers", "proverka-indeksacii"],
  "kommercheskie-faktory": ["audit-sajta", "monitoring-pozicii-sayta", "geo-lokalizaciya-kommerciya"],
  "vidimost-sayta": ["monitoring-pozicii-sayta", "tipy-saitov-v-vydache", "sbor-poiskovykh-podskazok"],
  "faktory-ranzhirovaniya": ["audit-sajta", "monitoring-pozicii-sayta", "analiz-relevantnosti"],
  "kommertsializatsiya-zaprosa": ["geo-lokalizaciya-kommerciya", "tipy-saitov-v-vydache", "klasterizator-klyuchevykh-slov"],
  "kod-otveta-servera": ["http-headers", "audit-sajta", "proverka-indeksacii"],
  "utm-metki": ["utm-metki", "kalkulyator-roi", "audit-sajta"],
};
const termPaths = Object.keys(TERMS).map((s) => `/slovar/${s}/`);
for (const path of ["/slovar/", ...termPaths]) {
  const slug = path.split("/")[2] || "";
  const response = await fetch(base + path);
  assert.equal(response.status, 200, `${path}: HTTP 200`);
  const $ = load(await response.text());
  assert.equal($("h1").length, 1, "exactly one H1");
  assert.equal($('link[rel="canonical"]').attr("href"), origin + path);
  const graphs = $('script[type="application/ld+json"]').toArray().flatMap(el => {
    const data = JSON.parse($(el).text());
    return data["@graph"] || [data];
  });
  for (const type of ["BreadcrumbList", ...(slug ? ["DefinedTerm", "FAQPage", "WebPage"] : ["DefinedTermSet"])]) {
    assert.ok(graphs.some(g => g["@type"] === type), `${path}: ${type}`);
  }
  assert.ok(JSON.stringify(graphs).includes('"DefinedTermSet"'), `${path}: DefinedTermSet (top-level or inDefinedTermSet)`);
  const links = $('main a[href^="/slovar/"]').toArray().map(el => $(el).attr("href"));
  assert.ok(links.every(href => ["/slovar/", ...termPaths].includes(href.split("#")[0])), "no unpublished term links");
  for (const el of $('main a[href^="#"]').toArray()) {
    const id = $(el).attr("href").slice(1);
    assert.ok($(`[id="${id}"]`).length, `anchor exists: ${id}`);
  }
  if (slug) {
    const article = $('[role="article"][data-glossary-term]');
    assert.equal(article.length, 1);
    assert.equal($("article, aside, address, abbr, audio, area").length, 0, "no a-prefix tags that trigger analyzer link regex");
    assert.equal($('meta[property="og:type"]').attr("content"), "article");
    const page = graphs.find((g) => g["@type"] === "WebPage");
    assert.equal(page.dateModified, article.find("time").attr("datetime"));
    assert.equal($("#header-company a").length > 0, true, "company links in SSR HTML");
    assert.equal($('button[aria-controls="header-company"]').length, 1);
    assert.ok(article.find("table tbody tr").length >= 5);
    assert.ok(article.find("details").length >= 3);
    for (const mod of TERMS[slug]) {
      assert.ok(article.find(`a[href="/${mod}/"]`).length, `module CTA ${mod}`);
    }
    for (const el of $("main h2, main h3, main nav a").toArray()) {
      const t = $(el).text().trim();
      assert.ok(t && !/^[\d✕×→+−-]/.test(t), `clean heading/TOC text: «${t}»`);
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
for (const path of ["/slovar/", ...termPaths]) assert.ok(sm.includes(origin + path), `sitemap: ${path}`);
console.log("PASS sitemap");
