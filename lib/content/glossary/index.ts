import { GLOSSARY_CATEGORIES, type GlossaryCategory } from "./plan";
import { CHASTOTNOST_ZAPROSA } from "./terms/chastotnost-zaprosa";
import { POISKOVYE_PODSKAZKI } from "./terms/poiskovye-podskazki";
import { INTENT } from "./terms/intent";
import { GEOZAVISIMYY_ZAPROS } from "./terms/geozavisimyy-zapros";
import { KLASTERIZATSIYA_ZAPROSOV } from "./terms/klasterizatsiya-zaprosov";
import { SEMANTICHESKOE_YADRO } from "./terms/semanticheskoe-yadro";
import { OPERATORY_WORDSTAT } from "./terms/operatory-wordstat";
import { RELEVANTNOST } from "./terms/relevantnost";
import { LSI_SLOVA } from "./terms/lsi-slova";
import { TF_IDF } from "./terms/tf-idf";
import { TOSHNOTA_TEKSTA } from "./terms/toshnota-teksta";
import { VODNOST_TEKSTA } from "./terms/vodnost-teksta";
import { UNIKALNOST_TEKSTA } from "./terms/unikalnost-teksta";
import { KLYUCHEVYE_SLOVA } from "./terms/klyuchevye-slova";
import { BADEN_BADEN } from "./terms/baden-baden";
import { INDEKSATSIYA } from "./terms/indeksatsiya";
import { ROBOTS_TXT } from "./terms/robots-txt";
import { CANONICAL } from "./terms/canonical";
import { TITLE } from "./terms/title";
import { SNIPPET } from "./terms/snippet";
import { POISKOVAYA_VYDACHA } from "./terms/poiskovaya-vydacha";
import { STRUKTURA_SAYTA } from "./terms/struktura-sayta";
import { TEG_H1 } from "./terms/teg-h1";
import { POVEDENCHESKIE_FAKTORY } from "./terms/povedencheskie-faktory";
import { CTR } from "./terms/ctr";
import { POKAZATEL_OTKAZOV } from "./terms/pokazatel-otkazov";
import { POISKOVYY_ROBOT } from "./terms/poiskovyy-robot";
import { MIKRORAZMETKA } from "./terms/mikrorazmetka";
import { OBRATNYE_SSYLKI } from "./terms/obratnye-ssylki";
import { NAKRUTKA_PF } from "./terms/nakrutka-pf";
import { NOFOLLOW } from "./terms/nofollow";
import { NOINDEX } from "./terms/noindex";
import { ANKOR } from "./terms/ankor";
import { POSADOCHNAYA_STRANICA } from "./terms/posadochnaya-stranica";
import { BITYE_SSYLKI } from "./terms/bitye-ssylki";
import { SITEMAP_XML } from "./terms/sitemap-xml";
import { KOMMERCHESKIE_FAKTORY } from "./terms/kommercheskie-faktory";
import { VIDIMOST_SAYTA } from "./terms/vidimost-sayta";
import { FAKTORY_RANZHIROVANIYA } from "./terms/faktory-ranzhirovaniya";
import { KOMMERTSIALIZATSIYA_ZAPROSA } from "./terms/kommertsializatsiya-zaprosa";
import { KOD_OTVETA_SERVERA } from "./terms/kod-otveta-servera";
import { REDIREKT_301 } from "./terms/301-redirekt";
import { ORGANICHESKIY_TRAFIK } from "./terms/organicheskiy-trafik";
import { RANZHIROVANIE } from "./terms/ranzhirovanie";
import { DUBLI_STRANITS } from "./terms/dubli-stranits";
import { SSYLOCHNAYA_MASSA } from "./terms/ssylochnaya-massa";
import { KRAUD_MARKETING } from "./terms/kraud-marketing";
import { TIPY_SAITOV_V_VYDACHE } from "./terms/tipy-saitov-v-vydache";
import { TEKSTOVYE_FAKTORY } from "./terms/tekstovye-faktory";
import { META_TEGI } from "./terms/meta-tegi";
import { DESCRIPTION } from "./terms/description";
import { PLOTNOST_KLYUCHEVYKH_SLOV } from "./terms/plotnost-klyuchevykh-slov";
import { VNUTRENNYAYA_PERELINKOVKA } from "./terms/vnutrennyaya-perelinkovka";
import { E_E_A_T } from "./terms/e-e-a-t";
import { NOT_FOUND_404 } from "./terms/404-not-found";
import { SCHEMA_ORG } from "./terms/schema-org";
import { HTTP_ZAGOLOVKI } from "./terms/http-zagolovki";
import { DOFOLLOW } from "./terms/dofollow";
import { MINUSINSK } from "./terms/minusinsk";
import { UTM_METKI } from "./terms/utm-metki";
import { WORDSTAT } from "./terms/wordstat";
import { YANDEKS_VEBMASTER } from "./terms/yandeks-vebmaster";
import { GOOGLE_SEARCH_CONSOLE } from "./terms/google-search-console";
import { YANDEKS_METRIKA } from "./terms/yandeks-metrika";
import { SEO } from "./terms/seo";
import { SEO_AUDIT } from "./terms/seo-audit";
import { REDIREKT_302 } from "./terms/302-redirekt";
import { OSHIBKA_403 } from "./terms/oshibka-403";
import { ALT_TEKST } from "./terms/alt-tekst";
import { DLINNYY_KHVOST } from "./terms/dlinnyy-khvost";
import { OPERATOR_SITE } from "./terms/operator-site";
import { INFORMATSIONNYY_ZAPROS } from "./terms/informatsionnyy-zapros";
import { PEREEZD_SAYTA } from "./terms/pereezd-sayta";
import { CORE_WEB_VITALS } from "./terms/core-web-vitals";
import { META_TEG_ROBOTS } from "./terms/meta-teg-robots";
import { KOMMERCHESKIY_ZAPROS } from "./terms/kommercheskiy-zapros";
import { VNESHNYAYA_OPTIMIZATSIYA } from "./terms/vneshnyaya-optimizatsiya";
import { INDEKS_POISKOVY_SISTEMY } from "./terms/indeks-poiskovoy-sistemy";
import { VNUTRENNYAYA_OPTIMIZATSIYA } from "./terms/vnutrennyaya-optimizatsiya";
import { LINKBILDING } from "./terms/linkbilding";
import { POZITSIYA_SAYTA } from "./terms/pozitsiya-sayta";
import { IKS } from "./terms/iks";
import { POISKOVYE_OPERATORY } from "./terms/poiskovye-operatory";
import { TSEPOCHKA_REDIREKTOV } from "./terms/tsepochka-redirektov";
import { RASSHIRENNYY_SNIPPET } from "./terms/rasshirennyy-snippet";
import { TEKHNICHESKAYA_OPTIMIZATSIYA } from "./terms/tekhnicheskaya-optimizatsiya";
import { TEKHNICHESKIY_AUDIT } from "./terms/tekhnicheskiy-audit";
import { DIREKTIVA_DISALLOW } from "./terms/direktiva-disallow";
import { SKANIROVANIE } from "./terms/skanirovanie";
import { KANNIBALIZATSIYA_ZAPROSOV } from "./terms/kannibalizatsiya-zaprosov";
import { REGIONALNOST } from "./terms/regionalnost";
import { DOMEN } from "./terms/domen";
import { WHOIS } from "./terms/whois";
import { DNS } from "./terms/dns";
import { PEREOBHOD_STRANITS } from "./terms/pereobhod-stranits";
import { X_ROBOTS_TAG } from "./terms/x-robots-tag";
import { TOP_10 } from "./terms/top-10";
import { DLINA_TITLE_I_DESCRIPTION } from "./terms/dlina-title-i-description";
import { MALOPOLEZNYY_KONTENT } from "./terms/malopoleznyy-kontent";
import { OBYOM_TEKSTA } from "./terms/obyom-teksta";
import { PESSIMIZATSIYA } from "./terms/pessimizatsiya";
import { NEDOSTATOCHNO_KACHESTVENNAYA_STRANITSA } from "./terms/nedostatochno-kachestvennaya-stranitsa";
import { SROK_REGISTRATSII_DOMENA } from "./terms/srok-registratsii-domena";
import { DOMEN_VTOROGO_UROVNYA } from "./terms/domen-vtorogo-urovnya";
import { KONVERSIYA } from "./terms/konversiya";
import { SEO_TEKST } from "./terms/seo-tekst";
import { VKHOZHDENIE_KLYUCHA } from "./terms/vkhozhdenie-klyucha";
import { SIMVOLY_S_PROBELAMI_I_BEZ } from "./terms/simvoly-s-probelami-i-bez";
import { ISKLYUCHENNYE_STRANITSY } from "./terms/isklyuchennye-stranitsy";
import { MINUS_SLOVA } from "./terms/minus-slova";
import { MARKERNYY_ZAPROS } from "./terms/markernyy-zapros";
import { KONKURENTNOST_ZAPROSA } from "./terms/konkurentnost-zaprosa";
import { KARTA_RELEVANTNOSTI } from "./terms/karta-relevantnosti";
import { SEO_KRAULER } from "./terms/seo-krauler";
import { UPTIME } from "./terms/uptime";
import { DONOR } from "./terms/donor";
import { ISTOCHNIK_TRAFIKA } from "./terms/istochnik-trafika";
import { ROI } from "./terms/roi";
import { KARTOCHKA_TOVARA } from "./terms/kartochka-tovara";
import { KPI_SEO } from "./terms/kpi-seo";
import { CHPU } from "./terms/chpu";
import { PAGINATSIYA } from "./terms/paginatsiya";
import { KHLEBNYE_KROSHKI } from "./terms/khlebnye-kroshki";
import { TZ_NA_TEKST } from "./terms/tz-na-tekst";
import { KOMBINATORIKA_KLYUCHEVYKH_FRAZ } from "./terms/kombinatorika-klyuchevykh-fraz";
import { MONITORING_OBRATNYKH_SSYLOK } from "./terms/monitoring-obratnykh-ssylok";
import { HREFLANG } from "./terms/hreflang";
import { OPEN_GRAPH } from "./terms/open-graph";
import { SSL_SERTIFIKAT } from "./terms/ssl-sertifikat";
import { YUZABILITI } from "./terms/yuzabiliti";
import { ADAPTIVNAYA_VERSTKA } from "./terms/adaptivnaya-verstka";
import { PAGESPEED_INSIGHTS } from "./terms/pagespeed-insights";
import { KESHIROVANIE } from "./terms/keshirovanie";
import { OSHIBKI_500_503 } from "./terms/oshibki-500-503";
import { TRAST_SAYTA } from "./terms/trast-sayta";
import { SATELLIT } from "./terms/satellit";
import { ANKOR_LIST } from "./terms/ankor-list";
import { VEBVIZOR } from "./terms/vebvizor";
import { ZERKALO_SAYTA } from "./terms/zerkalo-sayta";
import { PESOCHNITSA } from "./terms/pesochnitsa";
import { KATEGORIYA_LISTING } from "./terms/kategoriya-listing";
import { REGISTRATOR_DOMENA } from "./terms/registrator-domena";
import { VOZRAST_DOMENA } from "./terms/vozrast-domena";
import { DROP_DOMEN } from "./terms/drop-domen";
import { SKOROST_ZAGRUZKI } from "./terms/skorost-zagruzki";
import { POISKOVYY_ZAPROS } from "./terms/poiskovyy-zapros";
import { SIROTSKIE_STRANITSY } from "./terms/sirotskie-stranitsy";
import { GET_PARAMETRY } from "./terms/get-parametry";
import { SOFT_404 } from "./terms/soft-404";
import { VLOZHENNOST_STRANITS } from "./terms/vlozhennost-stranits";
import { META_TEG_KEYWORDS } from "./terms/meta-teg-keywords";
import { OPTIMIZATSIYA_IZOBRAZHENIY } from "./terms/optimizatsiya-izobrazheniy";
import { AFFILIAT_FILTR } from "./terms/affiliat-filtr";
import { DISAVOW } from "./terms/disavow";
import { KLOAKING } from "./terms/kloaking";
import { LOKALNOE_SEO } from "./terms/lokalnoe-seo";
import { STRANITSY_FILTROV } from "./terms/stranitsy-filtrov";
import { APDEYT } from "./terms/apdeyt";
import { KOLDUNSHCHIKI } from "./terms/koldunshchiki";
import { KEYVORD_STAFFING } from "./terms/keyvord-staffing";
import { SMESHANNYY_ZAPROS } from "./terms/smeshannyy-zapros";
import { CHITABELNOST } from "./terms/chitabelnost";
import { STATICHESKIY_VES } from "./terms/staticheskiy-ves";
import { SKVOZNAYA_SSYLKA } from "./terms/skvoznaya-ssylka";
import { INDEXNOW } from "./terms/indexnow";
import { NAVIGATSIONNYY_ZAPROS } from "./terms/navigatsionnyy-zapros";
import { BRENDOVYY_ZAPROS } from "./terms/brendovyy-zapros";
import { STOP_SLOVA } from "./terms/stop-slova";
import { TONKIY_KONTENT } from "./terms/tonkiy-kontent";
import { BEZANKORNAYA_SSYLKA } from "./terms/bezankornaya-ssylka";
import { TOKSICHNYE_SSYLKI } from "./terms/toksichnye-ssylki";
import { SKRYTYY_TEKST } from "./terms/skrytyy-tekst";
import { DORVEY } from "./terms/dorvey";
import { SAYTLINKI } from "./terms/saytlinki";
import { MOBILE_FIRST_INDEKSATSIYA } from "./terms/mobile-first-indeksatsiya";
import { JSON_LD } from "./terms/json-ld";
import { JAVASCRIPT_SEO } from "./terms/javascript-seo";
import { FASETNAYA_NAVIGATSIYA } from "./terms/fasetnaya-navigatsiya";
import { TSELI_V_METRIKE } from "./terms/tseli-v-metrike";
import { CHERNOE_SEO } from "./terms/chernoe-seo";
import { YMYL } from "./terms/ymyl";
import { DIREKTIVA_ALLOW } from "./terms/direktiva-allow";
import { BYSTRYE_OTVETY_YANDEKSA } from "./terms/bystrye-otvety-yandeksa";
import { PEOPLE_ALSO_ASK } from "./terms/people-also-ask";
import { GEONEZAVISIMYY_ZAPROS } from "./terms/geonezavisimyy-zapros";
import { TSIKLICHESKIY_REDIREKT } from "./terms/tsiklicheskiy-redirekt";
import { TEG_NOINDEX_YANDEKSA } from "./terms/teg-noindex-yandeksa";
import { CLEAN_PARAM } from "./terms/clean-param";
import { HTTPS_PEREEZD } from "./terms/https-pereezd";
import { SKLEYKA_ZERKAL } from "./terms/skleyka-zerkal";
import { GONE_410 } from "./terms/410-gone";
import { GOOGLE_ANALYTICS_4 } from "./terms/google-analytics-4";
import { SKVOZNAYA_ANALITIKA } from "./terms/skvoznaya-analitika";
import { SEO_KOPIRAYTING } from "./terms/seo-kopirayting";
import { NEGATIVNOE_SEO } from "./terms/negativnoe-seo";
import { AKTSEPTOR } from "./terms/aktseptor";
import { AUTRICH } from "./terms/autrich";
import { GOOGLE_BUSINESS_PROFILE } from "./terms/google-business-profile";
import { GENERATIVNYY_KONTENT } from "./terms/generativnyy-kontent";
import type { GlossaryBlock, GlossaryTerm } from "./types";

export { GLOSSARY_CATEGORIES, GLOSSARY_PLANNED_TOTAL } from "./plan";
export type { GlossaryCategory } from "./plan";
export type * from "./types";

export const GLOSSARY_PATH = "/slovar/";
export const GLOSSARY_NAME = "SEO-словарь";

/** Опубликованные термины. Новый термин: файл в terms/ + строка здесь. */
export const GLOSSARY_TERMS: readonly GlossaryTerm[] = [SEMANTICHESKOE_YADRO, KLASTERIZATSIYA_ZAPROSOV, CHASTOTNOST_ZAPROSA, POISKOVYE_PODSKAZKI, INTENT, GEOZAVISIMYY_ZAPROS, OPERATORY_WORDSTAT, RELEVANTNOST, LSI_SLOVA, TF_IDF, TOSHNOTA_TEKSTA, VODNOST_TEKSTA, UNIKALNOST_TEKSTA, KLYUCHEVYE_SLOVA, BADEN_BADEN, INDEKSATSIYA, ROBOTS_TXT, CANONICAL, TITLE, SNIPPET, POISKOVAYA_VYDACHA, STRUKTURA_SAYTA, TEG_H1, POVEDENCHESKIE_FAKTORY, CTR, POKAZATEL_OTKAZOV, POISKOVYY_ROBOT, MIKRORAZMETKA, OBRATNYE_SSYLKI, NAKRUTKA_PF, NOFOLLOW, NOINDEX, ANKOR, POSADOCHNAYA_STRANICA, BITYE_SSYLKI, SITEMAP_XML, KOMMERCHESKIE_FAKTORY, VIDIMOST_SAYTA, FAKTORY_RANZHIROVANIYA, KOMMERTSIALIZATSIYA_ZAPROSA, KOD_OTVETA_SERVERA, REDIREKT_301, ORGANICHESKIY_TRAFIK, RANZHIROVANIE, DUBLI_STRANITS, SSYLOCHNAYA_MASSA, KRAUD_MARKETING, TIPY_SAITOV_V_VYDACHE, TEKSTOVYE_FAKTORY, META_TEGI, DESCRIPTION, PLOTNOST_KLYUCHEVYKH_SLOV, VNUTRENNYAYA_PERELINKOVKA, E_E_A_T, UTM_METKI, NOT_FOUND_404, SCHEMA_ORG, HTTP_ZAGOLOVKI, DOFOLLOW, MINUSINSK, WORDSTAT, YANDEKS_VEBMASTER, GOOGLE_SEARCH_CONSOLE, YANDEKS_METRIKA, SEO, SEO_AUDIT, REDIREKT_302, OSHIBKA_403, ALT_TEKST, DLINNYY_KHVOST, OPERATOR_SITE, INFORMATSIONNYY_ZAPROS, PEREEZD_SAYTA, CORE_WEB_VITALS, META_TEG_ROBOTS, KOMMERCHESKIY_ZAPROS, VNESHNYAYA_OPTIMIZATSIYA, INDEKS_POISKOVY_SISTEMY, VNUTRENNYAYA_OPTIMIZATSIYA, LINKBILDING, POZITSIYA_SAYTA, IKS, POISKOVYE_OPERATORY, TSEPOCHKA_REDIREKTOV, RASSHIRENNYY_SNIPPET, TEKHNICHESKAYA_OPTIMIZATSIYA, TEKHNICHESKIY_AUDIT, DIREKTIVA_DISALLOW, SKANIROVANIE, KANNIBALIZATSIYA_ZAPROSOV, REGIONALNOST, DOMEN, WHOIS, DNS, PEREOBHOD_STRANITS, X_ROBOTS_TAG, TOP_10, DLINA_TITLE_I_DESCRIPTION, MALOPOLEZNYY_KONTENT, OBYOM_TEKSTA, PESSIMIZATSIYA, NEDOSTATOCHNO_KACHESTVENNAYA_STRANITSA, SROK_REGISTRATSII_DOMENA, DOMEN_VTOROGO_UROVNYA, KONVERSIYA, SEO_TEKST, VKHOZHDENIE_KLYUCHA, SIMVOLY_S_PROBELAMI_I_BEZ, ISKLYUCHENNYE_STRANITSY, MINUS_SLOVA, MARKERNYY_ZAPROS, KONKURENTNOST_ZAPROSA, KARTA_RELEVANTNOSTI, SEO_KRAULER, UPTIME, DONOR, ISTOCHNIK_TRAFIKA, ROI, KARTOCHKA_TOVARA, KPI_SEO, CHPU, PAGINATSIYA, KHLEBNYE_KROSHKI, TZ_NA_TEKST, KOMBINATORIKA_KLYUCHEVYKH_FRAZ, MONITORING_OBRATNYKH_SSYLOK, HREFLANG, OPEN_GRAPH, SSL_SERTIFIKAT, YUZABILITI, ADAPTIVNAYA_VERSTKA, PAGESPEED_INSIGHTS, KESHIROVANIE, OSHIBKI_500_503, TRAST_SAYTA, SATELLIT, ANKOR_LIST, VEBVIZOR, ZERKALO_SAYTA, PESOCHNITSA, KATEGORIYA_LISTING, REGISTRATOR_DOMENA, VOZRAST_DOMENA, DROP_DOMEN, SKOROST_ZAGRUZKI, POISKOVYY_ZAPROS, SIROTSKIE_STRANITSY, GET_PARAMETRY, SOFT_404, VLOZHENNOST_STRANITS, META_TEG_KEYWORDS, OPTIMIZATSIYA_IZOBRAZHENIY, AFFILIAT_FILTR, DISAVOW, KLOAKING, LOKALNOE_SEO, STRANITSY_FILTROV, APDEYT, KOLDUNSHCHIKI, KEYVORD_STAFFING, SMESHANNYY_ZAPROS, CHITABELNOST, STATICHESKIY_VES, SKVOZNAYA_SSYLKA, INDEXNOW, NAVIGATSIONNYY_ZAPROS, BRENDOVYY_ZAPROS, STOP_SLOVA, TONKIY_KONTENT, BEZANKORNAYA_SSYLKA, TOKSICHNYE_SSYLKI, SKRYTYY_TEKST, DORVEY, SAYTLINKI, MOBILE_FIRST_INDEKSATSIYA, JSON_LD, JAVASCRIPT_SEO, FASETNAYA_NAVIGATSIYA, TSELI_V_METRIKE, CHERNOE_SEO, YMYL, DIREKTIVA_ALLOW, BYSTRYE_OTVETY_YANDEKSA, PEOPLE_ALSO_ASK, GEONEZAVISIMYY_ZAPROS, TSIKLICHESKIY_REDIREKT, TEG_NOINDEX_YANDEKSA, CLEAN_PARAM, HTTPS_PEREEZD, SKLEYKA_ZERKAL, GONE_410, GOOGLE_ANALYTICS_4, SKVOZNAYA_ANALITIKA, SEO_KOPIRAYTING, NEGATIVNOE_SEO, AKTSEPTOR, AUTRICH, GOOGLE_BUSINESS_PROFILE, GENERATIVNYY_KONTENT];

export function getGlossaryTerm(slug: string): GlossaryTerm | undefined {
  return GLOSSARY_TERMS.find((t) => t.slug === slug);
}

export function glossaryTermPath(slug: string): string {
  return `${GLOSSARY_PATH}${slug}/`;
}

const norm = (s: string) => s.trim().toLowerCase().replace(/ё/g, "е");

/** Путь опубликованного термина по названию/синониму, иначе undefined (рендерим текстом, без ссылки). */
export function findPublishedTermPath(name: string): string | undefined {
  const n = norm(name);
  const term = GLOSSARY_TERMS.find((t) => norm(t.term) === n || t.aliases.some((a) => norm(a) === n));
  return term ? glossaryTermPath(term.slug) : undefined;
}

const WORD_RE = /[\p{L}\p{N}]+(?:[-–][\p{L}\p{N}]+)*/gu;
const countWords = (s: string) => s.match(WORD_RE)?.length ?? 0;

function blockText(b: GlossaryBlock): string[] {
  switch (b.type) {
    case "p":
      return [b.text];
    case "ul":
      return b.items;
    case "callout":
      return [b.text];
    case "compare":
      return b.items.flatMap((i) => [i.title, i.text]);
    case "flow":
      return [b.caption ?? "", ...b.steps.flatMap((st) => [st.label, st.note])];
    case "steps":
      return b.items.flatMap((i) => [i.title, i.text]);
    case "table":
      return [b.caption, ...b.head, ...b.rows.flat(), b.note ?? ""];
  }
}

/** Число слов в наборе блоков (для раскладки: длинные карточки растягиваются на всю ширину). */
export function glossaryBlocksWordCount(blocks: readonly GlossaryBlock[]): number {
  return blocks.flatMap(blockText).reduce((n, p) => n + countWords(p), 0);
}

/** Число слов в тексте статьи термина (определение, разделы, сервисы, FAQ). */
export function glossaryTermWordCount(t: GlossaryTerm): number {
  const parts: string[] = [t.h1, t.definition];
  for (const s of t.sections) {
    parts.push(s.title, ...(s.blocks ?? []).flatMap(blockText));
    for (const sub of s.subsections ?? []) parts.push(sub.title, ...sub.blocks.flatMap(blockText));
  }
  parts.push(t.modules.title, t.modules.intro, ...t.modules.items.flatMap((m) => [m.title, m.text]));
  parts.push(...(t.takeaways ?? []), ...t.faq.flatMap((f) => [f.q, f.a]));
  return parts.reduce((n, p) => n + countWords(p.replace(/\]\([^)]*\)/g, "]")), 0);
}

/** Время чтения в минутах (~180 слов/мин для русского текста, округление вверх). */
export const GLOSSARY_WORDS_PER_MINUTE = 180;
export function glossaryReadingMinutes(t: GlossaryTerm): number {
  return Math.max(1, Math.ceil(glossaryTermWordCount(t) / GLOSSARY_WORDS_PER_MINUTE));
}

export function getGlossaryCategory(id: string): GlossaryCategory | undefined {
  return GLOSSARY_CATEGORIES.find((c) => c.id === id);
}
