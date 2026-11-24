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
  "404-not-found": ["http-headers", "audit-sajta", "proverka-indeksacii"],
  "schema-org": ["proverka-meta-tegov-online", "audit-sajta", "analiz-relevantnosti"],
  "http-zagolovki": ["http-headers", "audit-sajta", "proverka-indeksacii"],
  "dofollow": ["otslezhivanie-ssylok", "audit-sajta", "monitoring-pozicii-sayta"],
  "minusinsk": ["otslezhivanie-ssylok", "audit-sajta", "monitoring-pozicii-sayta"],
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
  "wordstat": ["sbor-poiskovykh-podskazok", "generator_slov", "klasterizator-klyuchevykh-slov"],
  "yandeks-vebmaster": ["proverka-indeksacii", "audit-sajta", "monitoring-pozicii-sayta"],
  "google-search-console": ["proverka-indeksacii", "audit-sajta", "monitoring-pozicii-sayta"],
  "yandeks-metrika": ["utm-metki", "kalkulyator-roi", "audit-sajta"],
  "seo": ["sbor-poiskovykh-podskazok", "audit-sajta", "monitoring-pozicii-sayta"],
  "seo-audit": ["audit-sajta", "proverka-indeksacii", "analiz-relevantnosti"],
  "302-redirekt": ["http-headers", "audit-sajta", "proverka-indeksacii"],
  "oshibka-403": ["http-headers", "audit-sajta", "proverka-indeksacii"],
  "alt-tekst": ["proverka-meta-tegov-online", "audit-sajta", "analiz-teksta"],
  "dlinnyy-khvost": ["sbor-poiskovykh-podskazok", "generator_slov", "klasterizator-klyuchevykh-slov"],
  "operator-site": ["proverka-indeksacii", "audit-sajta", "tipy-saitov-v-vydache"],
  "informatsionnyy-zapros": ["sbor-poiskovykh-podskazok", "tipy-saitov-v-vydache", "klasterizator-klyuchevykh-slov"],
  "pereezd-sayta": ["http-headers", "audit-sajta", "proverka-indeksacii"],
  "core-web-vitals": ["audit-sajta", "http-headers", "monitoring-pozicii-sayta"],
  "meta-teg-robots": ["proverka-meta-tegov-online", "audit-sajta", "proverka-indeksacii"],
  "kommercheskiy-zapros": ["sbor-poiskovykh-podskazok", "tipy-saitov-v-vydache", "klasterizator-klyuchevykh-slov"],
  "vneshnyaya-optimizatsiya": ["audit-sajta", "monitoring-pozicii-sayta", "analiz-relevantnosti"],
  "indeks-poiskovoy-sistemy": ["proverka-indeksacii", "audit-sajta", "monitoring-pozicii-sayta"],
  "vnutrennyaya-optimizatsiya": ["audit-sajta", "analiz-teksta", "proverka-meta-tegov-online"],
  "linkbilding": ["audit-sajta", "monitoring-pozicii-sayta", "analiz-relevantnosti"],
  "pozitsiya-sayta": ["monitoring-pozicii-sayta", "analiz-relevantnosti", "audit-sajta"],
  "iks": ["audit-sajta", "monitoring-pozicii-sayta", "analiz-relevantnosti"],
  "poiskovye-operatory": ["proverka-indeksacii", "audit-sajta", "analiz-konkurentov"],
  "tsepochka-redirektov": ["http-headers", "audit-sajta", "proverka-indeksacii"],
  "rasshirennyy-snippet": ["proverka-meta-tegov-online", "audit-sajta", "analiz-relevantnosti"],
  "tekhnicheskaya-optimizatsiya": ["audit-sajta", "proverka-indeksacii", "http-headers"],
  "tekhnicheskiy-audit": ["audit-sajta", "http-headers", "proverka-indeksacii"],
  "direktiva-disallow": ["audit-sajta", "proverka-indeksacii", "http-headers"],
  "skanirovanie": ["audit-sajta", "http-headers", "proverka-indeksacii"],
  "kannibalizatsiya-zaprosov": ["klasterizator-klyuchevykh-slov", "monitoring-pozicii-sayta", "analiz-relevantnosti"],
  "regionalnost": ["geo-lokalizaciya-kommerciya", "monitoring-pozicii-sayta", "audit-sajta"],
  "domen": ["zapisi-domena", "http-headers", "audit-sajta"],
  "whois": ["zapisi-domena", "http-headers", "audit-sajta"],
  "dns": ["zapisi-domena", "http-headers", "audit-sajta"],
  "pereobhod-stranits": ["proverka-indeksacii", "http-headers", "audit-sajta"],
  "x-robots-tag": ["http-headers", "proverka-meta-tegov-online", "audit-sajta"],
  "top-10": ["monitoring-pozicii-sayta", "analiz-konkurentov", "analiz-relevantnosti"],
  "dlina-title-i-description": ["podschet-dliny-teksta", "proverka-meta-tegov-online", "audit-sajta"],
  "malopoleznyy-kontent": ["proverka-indeksacii", "analiz-teksta", "audit-sajta"],
  "obyom-teksta": ["podschet-dliny-teksta", "analiz-relevantnosti", "analiz-teksta"],
  "pessimizatsiya": ["proverka-teksta-esenin", "monitoring-pozicii-sayta", "otslezhivanie-ssylok", "audit-sajta"],
  "nedostatochno-kachestvennaya-stranitsa": ["proverka-indeksacii", "audit-sajta", "analiz-relevantnosti", "analiz-teksta"],
  "srok-registratsii-domena": ["otslezhivanie-sroka-registratsii-domenov", "zapisi-domena", "monitoring-saytov"],
  "domen-vtorogo-urovnya": ["zapisi-domena", "otslezhivanie-sroka-registratsii-domenov", "http-headers"],
  "konversiya": ["kalkulyator-roi", "utm-metki", "analiz-relevantnosti", "audit-sajta"],
  "seo-tekst": ["analiz-relevantnosti", "analiz-teksta", "proverka-teksta-esenin", "podschet-dliny-teksta"],
  "vkhozhdenie-klyucha": ["analiz-relevantnosti", "analiz-teksta", "proverka-meta-tegov-online", "generator_slov"],
  "simvoly-s-probelami-i-bez": ["podschet-dliny-teksta", "analiz-teksta", "proverka-meta-tegov-online"],
  "isklyuchennye-stranitsy": ["proverka-indeksacii", "http-headers", "audit-sajta", "monitoring-pozicii-sayta"],
  "minus-slova": ["udalenie-dublikatov", "generator_slov", "klasterizator-klyuchevykh-slov", "sbor-poiskovykh-podskazok"],
  "markernyy-zapros": ["generator_slov", "sbor-poiskovykh-podskazok", "klasterizator-klyuchevykh-slov", "analiz-konkurentov"],
  "konkurentnost-zaprosa": ["analiz-konkurentov", "tipy-saitov-v-vydache", "klasterizator-klyuchevykh-slov", "monitoring-pozicii-sayta"],
  "karta-relevantnosti": ["klasterizator-klyuchevykh-slov", "analiz-relevantnosti", "monitoring-pozicii-sayta", "proverka-meta-tegov-online"],
  "seo-krauler": ["audit-sajta", "http-headers", "proverka-indeksacii", "proverka-meta-tegov-online"],
  "uptime": ["monitoring-saytov", "http-headers", "otslezhivanie-sroka-registratsii-domenov", "zapisi-domena"],
  "donor": ["otslezhivanie-ssylok", "proverka-indeksacii", "analiz-konkurentov", "zapisi-domena"],
  "istochnik-trafika": ["utm-metki", "monitoring-pozicii-sayta", "analiz-konkurentov", "kalkulyator-roi"],
  "roi": ["kalkulyator-roi", "utm-metki", "monitoring-pozicii-sayta", "analiz-konkurentov"],
  "kartochka-tovara": ["analiz-relevantnosti", "proverka-meta-tegov-online", "analiz-teksta", "sbor-poiskovykh-podskazok"],
  "kpi-seo": ["monitoring-pozicii-sayta", "proverka-indeksacii", "audit-sajta", "kalkulyator-roi"],
  "chpu": ["audit-sajta", "http-headers", "proverka-indeksacii"],
  "paginatsiya": ["audit-sajta", "proverka-indeksacii", "http-headers"],
  "khlebnye-kroshki": ["audit-sajta", "proverka-indeksacii", "proverka-meta-tegov-online"],
  "tz-na-tekst": ["analiz-relevantnosti", "analiz-teksta", "podschet-dliny-teksta"],
  "kombinatorika-klyuchevykh-fraz": ["generator_slov", "udalenie-dublikatov", "klasterizator-klyuchevykh-slov"],
  "monitoring-obratnykh-ssylok": ["otslezhivanie-ssylok", "audit-sajta", "monitoring-pozicii-sayta"],
  "hreflang": ["proverka-meta-tegov-online", "http-headers", "audit-sajta"],
  "open-graph": ["proverka-meta-tegov-online", "audit-sajta"],
  "ssl-sertifikat": ["http-headers", "monitoring-saytov", "zapisi-domena"],
  "yuzabiliti": ["audit-sajta", "analiz-konkurentov"],
  "adaptivnaya-verstka": ["audit-sajta", "http-headers"],
  "pagespeed-insights": ["audit-sajta", "http-headers", "monitoring-saytov"],
  "keshirovanie": ["http-headers", "audit-sajta"],
  "oshibki-500-503": ["http-headers", "monitoring-saytov", "audit-sajta"],
  "trast-sayta": ["otslezhivanie-ssylok", "zapisi-domena", "monitoring-pozicii-sayta"],
  "satellit": ["zapisi-domena", "otslezhivanie-ssylok"],
  "ankor-list": ["otslezhivanie-ssylok", "analiz-konkurentov"],
  "vebvizor": ["utm-metki", "audit-sajta", "monitoring-pozicii-sayta"],
  "zerkalo-sayta": ["http-headers", "zapisi-domena", "proverka-indeksacii"],
  "pesochnitsa": ["monitoring-pozicii-sayta", "proverka-indeksacii", "zapisi-domena"],
  "kategoriya-listing": ["analiz-relevantnosti", "klasterizator-klyuchevykh-slov", "audit-sajta", "analiz-konkurentov"],
  "registrator-domena": ["otslezhivanie-sroka-registratsii-domenov", "zapisi-domena", "monitoring-saytov"],
  "vozrast-domena": ["zapisi-domena", "otslezhivanie-sroka-registratsii-domenov", "proverka-indeksacii"],
  "drop-domen": ["otslezhivanie-sroka-registratsii-domenov", "zapisi-domena", "otslezhivanie-ssylok"],
  "skorost-zagruzki": ["audit-sajta", "monitoring-saytov", "http-headers"],
  "poiskovyy-zapros": ["sbor-poiskovykh-podskazok", "klasterizator-klyuchevykh-slov", "generator_slov"],
  "sirotskie-stranitsy": ["audit-sajta", "proverka-indeksacii", "analiz-konkurentov"],
  "get-parametry": ["audit-sajta", "utm-metki", "udalenie-dublikatov"],
  "soft-404": ["http-headers", "proverka-indeksacii", "audit-sajta"],
  "vlozhennost-stranits": ["analiz-konkurentov", "audit-sajta", "klasterizator-klyuchevykh-slov"],
  "meta-teg-keywords": ["proverka-meta-tegov-online", "audit-sajta", "analiz-teksta"],
  "optimizatsiya-izobrazheniy": ["audit-sajta", "http-headers", "monitoring-saytov"],
  "affiliat-filtr": ["zapisi-domena", "monitoring-pozicii-sayta", "audit-sajta"],
  "disavow": ["otslezhivanie-ssylok", "audit-sajta", "monitoring-pozicii-sayta"],
  "kloaking": ["http-headers", "audit-sajta", "proverka-indeksacii"],
  "lokalnoe-seo": ["geo-lokalizaciya-kommerciya", "monitoring-pozicii-sayta", "analiz-konkurentov"],
  "stranitsy-filtrov": ["klasterizator-klyuchevykh-slov", "audit-sajta", "proverka-indeksacii"],
  "apdeyt": ["monitoring-pozicii-sayta", "analiz-konkurentov", "audit-sajta"],
  "koldunshchiki": ["tipy-saitov-v-vydache", "monitoring-pozicii-sayta", "analiz-relevantnosti"],
  "keyvord-staffing": ["proverka-teksta-esenin", "analiz-teksta", "proverka-meta-tegov-online"],
  "smeshannyy-zapros": ["tipy-saitov-v-vydache"],
  "chitabelnost": ["proverka-teksta-esenin", "analiz-teksta", "podschet-dliny-teksta"],
  "staticheskiy-ves": ["audit-sajta"],
  "skvoznaya-ssylka": ["audit-sajta"],
  "indexnow": ["proverka-indeksacii"],
  "navigatsionnyy-zapros": ["tipy-saitov-v-vydache", "sbor-poiskovykh-podskazok"],
  "brendovyy-zapros": ["tipy-saitov-v-vydache", "sbor-poiskovykh-podskazok"],
  "stop-slova": ["analiz-teksta"],
  "tonkiy-kontent": ["proverka-teksta-esenin", "analiz-teksta"],
  "bezankornaya-ssylka": ["otslezhivanie-ssylok"],
  "toksichnye-ssylki": ["otslezhivanie-ssylok"],
  "skrytyy-tekst": ["proverka-teksta-esenin", "proverka-meta-tegov-online"],
  "dorvey": ["audit-sajta", "otslezhivanie-ssylok"],
  "saytlinki": ["proverka-meta-tegov-online", "tipy-saitov-v-vydache"],
  "mobile-first-indeksatsiya": ["audit-sajta"],
  "json-ld": [],
  "javascript-seo": ["audit-sajta"],
  "fasetnaya-navigatsiya": ["analiz-relevantnosti", "audit-sajta"],
  "tseli-v-metrike": ["utm-metki"],
  "chernoe-seo": [],
  "ymyl": [],
  "direktiva-allow": ["audit-sajta"],
  "bystrye-otvety-yandeksa": [],
  "people-also-ask": ["sbor-poiskovykh-podskazok"],
  "geonezavisimyy-zapros": ["geo-lokalizaciya-kommerciya"],
  "tsiklicheskiy-redirekt": ["http-headers"],
  "teg-noindex-yandeksa": ["otslezhivanie-ssylok"],
  "clean-param": ["audit-sajta"],
  "https-pereezd": ["http-headers"],
  "skleyka-zerkal": ["http-headers"],
  "410-gone": ["http-headers"],
  "google-analytics-4": ["utm-metki"],
  "skvoznaya-analitika": ["kalkulyator-roi"],
  "seo-kopirayting": ["analiz-teksta"],
  "negativnoe-seo": ["otslezhivanie-ssylok"],
  "aktseptor": ["otslezhivanie-ssylok"],
  "autrich": ["otslezhivanie-ssylok"],
  "google-business-profile": [],
  "generativnyy-kontent": [],
  "zero-click-poisk": ["monitoring-pozicii-sayta", "tipy-saitov-v-vydache", "analiz-konkurentov"],
  "beloe-seo": ["audit-sajta", "analiz-teksta", "otslezhivanie-ssylok", "monitoring-pozicii-sayta"],
  "khab-stranitsa": ["klasterizator-klyuchevykh-slov", "analiz-relevantnosti", "audit-sajta"],
  "ssr": ["http-headers", "audit-sajta", "proverka-indeksacii"],
  "asessor": ["analiz-relevantnosti", "audit-sajta", "monitoring-pozicii-sayta"],
  "log-fayly-servera": ["audit-sajta", "http-headers", "proverka-indeksacii", "monitoring-saytov"],
  "geovydacha": ["geo-lokalizaciya-kommerciya", "monitoring-pozicii-sayta", "tipy-saitov-v-vydache"],
  "ai-overviews": ["monitoring-pozicii-sayta", "analiz-relevantnosti", "tipy-saitov-v-vydache"],
  "nulevaya-pozitsiya": ["monitoring-pozicii-sayta", "analiz-relevantnosti", "proverka-meta-tegov-online"],
  "faqpage-razmetka": ["sbor-poiskovykh-podskazok", "proverka-meta-tegov-online", "audit-sajta"],
  "transaktsionnyy-zapros": ["tipy-saitov-v-vydache", "geo-lokalizaciya-kommerciya", "klasterizator-klyuchevykh-slov"],
  "estestvennye-ssylki": ["otslezhivanie-ssylok", "analiz-konkurentov", "audit-sajta"],
  "gostevoy-post": ["otslezhivanie-ssylok", "analiz-konkurentov", "proverka-indeksacii"],
  "ttfb": ["http-headers", "monitoring-saytov", "audit-sajta"],
  "glubina-skanirovaniya": ["audit-sajta", "proverka-indeksacii", "http-headers"],
  "ugc": ["analiz-teksta", "proverka-indeksacii", "audit-sajta"],
  "rerayting": ["analiz-teksta", "analiz-konkurentov", "audit-sajta"],
  "atributsiya": ["utm-metki", "kalkulyator-roi", "monitoring-pozicii-sayta"],
  "serm": ["monitoring-pozicii-sayta", "tipy-saitov-v-vydache", "analiz-konkurentov"],
  "neyro-yandeksa": ["analiz-relevantnosti", "monitoring-pozicii-sayta", "sbor-poiskovykh-podskazok", "audit-sajta"],
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
