import type { ModulePage } from "@/lib/content/modules";
import { buildModuleV2Config } from "@/lib/content/module-v2/build-config";
import type { ClassicV3Source } from "@/lib/content/module-v3/build-config";
import type { ModuleV2PageConfig } from "@/lib/content/module-v2/types";

import * as relevance from "@/lib/content/analiz-relevantnosti-page";
import * as competitor from "@/lib/content/analiz-konkurentov-page";
import * as siteMon from "@/lib/content/monitoring-saytov-page";
import * as metaMon from "@/lib/content/proverka-meta-tegov-page";
import * as wordGen from "@/lib/content/generator-slov-page";
import * as textLen from "@/lib/content/podschet-dliny-teksta-page";
import * as pwGen from "@/lib/content/generator-paroley-page";
import * as listCmp from "@/lib/content/sravnenie-spiskov-page";
import * as dedup from "@/lib/content/udalenie-dublikatov-page";
import * as utm from "@/lib/content/utm-metki-page";
import * as roi from "@/lib/content/kalkulyator-roi-page";
import * as httpH from "@/lib/content/http-headers-page";
import * as htmlEd from "@/lib/content/html-redaktor-page";
import * as uniqWords from "@/lib/content/vydelenie-unikalnykh-slov-page";
import * as linkTr from "@/lib/content/otslezhivanie-ssylok-page";
import * as domainReg from "@/lib/content/otslezhivanie-sroka-registratsii-domenov-page";
import * as textAn from "@/lib/content/analiz-teksta-page";
import * as cluster from "@/lib/content/klasterizator-klyuchevykh-slov-page";
import {
  DOMAIN_RECORDS_V2_SOURCE,
  ESENIN_V2_SOURCE,
  INDEX_CHECK_V2_SOURCE,
  PHRASE_COMMERCE_V2_SOURCE,
  SEARCH_SUGGESTIONS_V2_SOURCE,
  SITE_AUDIT_V2_SOURCE,
  SITE_TYPES_V2_SOURCE,
} from "@/lib/content/module-v2/classic-sources-extra";

function cfg(
  getBase: (slug: string) => ModulePage | undefined,
  baseSlug: string,
  source: ClassicV3Source,
  opts?: Parameters<typeof buildModuleV2Config>[3]
) {
  const mod = getBase(baseSlug);
  if (!mod) throw new Error(`module-v2: нет базового модуля ${baseSlug}`);
  return buildModuleV2Config(baseSlug, mod, source, opts);
}

function buildRegistry(getBase: (slug: string) => ModulePage | undefined): ModuleV2PageConfig[] {
  return [
  cfg(getBase,
    "analiz-relevantnosti",
    {
      hero: relevance.RELEVANCE_HERO,
      stats: relevance.RELEVANCE_STATS,
      steps: relevance.RELEVANCE_STEPS,
      techLayers: relevance.RELEVANCE_TECH_LAYERS,
      grid: relevance.RELEVANCE_REPORT_GRID,
      highlight: {
        title: relevance.RELEVANCE_REPORT_LSI.title,
        lead: relevance.RELEVANCE_REPORT_LSI.lead,
        bullets: relevance.RELEVANCE_REPORT_LSI.bullets,
      },
      insightsMeta: relevance.RELEVANCE_INSIGHTS,
      screenshots: relevance.RELEVANCE_SCREENSHOTS,
      plain: relevance.RELEVANCE_PLAIN,
      faq: relevance.RELEVANCE_FAQ,
    }
  ),
  cfg(getBase, "analiz-konkurentov", {
    hero: competitor.COMPETITOR_HERO,
    stats: competitor.COMPETITOR_STATS,
    steps: competitor.COMPETITOR_STEPS,
    techLayers: competitor.COMPETITOR_TECH_LAYERS,
    grid: competitor.COMPETITOR_INSIGHTS_GRID,
    highlight: competitor.COMPETITOR_INSIGHTS_HIGHLIGHT,
    insightsMeta: competitor.COMPETITOR_INSIGHTS,
    screenshots: competitor.COMPETITOR_SCREENSHOTS,
    plain: competitor.COMPETITOR_PLAIN,
    faq: competitor.COMPETITOR_FAQ,
    options: competitor.COMPETITOR_OPTIONS,
  }),
  cfg(getBase, "monitoring-saytov", {
    hero: siteMon.SITE_MON_HERO,
    stats: siteMon.SITE_MON_STATS,
    steps: siteMon.SITE_MON_STEPS,
    techLayers: siteMon.SITE_MON_TECH_LAYERS,
    grid: siteMon.SITE_MON_INSIGHTS_GRID,
    highlight: siteMon.SITE_MON_INSIGHTS_HIGHLIGHT,
    insightsMeta: siteMon.SITE_MON_INSIGHTS,
    screenshots: siteMon.SITE_MON_SCREENSHOTS,
    plain: siteMon.SITE_MON_PLAIN,
    faq: siteMon.SITE_MON_FAQ,
    options: siteMon.SITE_MON_OPTIONS,
  }),
  cfg(getBase, "proverka-meta-tegov-online", {
    hero: metaMon.META_MON_HERO,
    stats: metaMon.META_MON_STATS,
    steps: metaMon.META_MON_STEPS,
    techLayers: metaMon.META_MON_TECH_LAYERS,
    grid: metaMon.META_MON_INSIGHTS_GRID,
    highlight: metaMon.META_MON_INSIGHTS_HIGHLIGHT,
    insightsMeta: metaMon.META_MON_INSIGHTS,
    screenshots: metaMon.META_MON_SCREENSHOTS,
    plain: metaMon.META_MON_PLAIN,
    faq: metaMon.META_MON_FAQ,
    options: metaMon.META_MON_OPTIONS,
  }),
  cfg(getBase, "generator_slov", {
    hero: wordGen.WORD_GEN_HERO,
    stats: wordGen.WORD_GEN_STATS,
    steps: wordGen.WORD_GEN_STEPS,
    techLayers: wordGen.WORD_GEN_TECH_LAYERS,
    grid: wordGen.WORD_GEN_INSIGHTS_GRID,
    highlight: wordGen.WORD_GEN_INSIGHTS_HIGHLIGHT,
    insightsMeta: wordGen.WORD_GEN_INSIGHTS,
    screenshots: wordGen.WORD_GEN_SCREENSHOTS,
    plain: wordGen.WORD_GEN_PLAIN,
    faq: wordGen.WORD_GEN_FAQ,
    options: wordGen.WORD_GEN_OPTIONS,
  }),
  cfg(getBase, "podschet-dliny-teksta", {
    hero: textLen.TEXT_LENGTH_HERO,
    stats: textLen.TEXT_LENGTH_STATS,
    steps: textLen.TEXT_LENGTH_STEPS,
    techLayers: textLen.TEXT_LENGTH_TECH_LAYERS,
    grid: textLen.TEXT_LENGTH_INSIGHTS_GRID,
    highlight: textLen.TEXT_LENGTH_INSIGHTS_HIGHLIGHT,
    insightsMeta: textLen.TEXT_LENGTH_INSIGHTS,
    screenshots: textLen.TEXT_LENGTH_SCREENSHOTS,
    plain: textLen.TEXT_LENGTH_PLAIN,
    faq: textLen.TEXT_LENGTH_FAQ,
    options: textLen.TEXT_LENGTH_OPTIONS,
  }),
  cfg(getBase, "generator-paroley", {
    hero: pwGen.PW_GEN_HERO,
    stats: pwGen.PW_GEN_STATS,
    steps: pwGen.PW_GEN_STEPS,
    techLayers: pwGen.PW_GEN_TECH_LAYERS,
    grid: pwGen.PW_GEN_INSIGHTS_GRID,
    highlight: pwGen.PW_GEN_INSIGHTS_HIGHLIGHT,
    insightsMeta: pwGen.PW_GEN_INSIGHTS,
    screenshots: pwGen.PW_GEN_SCREENSHOTS,
    plain: pwGen.PW_GEN_PLAIN,
    faq: pwGen.PW_GEN_FAQ,
    options: pwGen.PW_GEN_OPTIONS,
  }),
  cfg(getBase, "sravnenie-spiskov-klyuchevykh-fraz", {
    hero: listCmp.LIST_COMPARE_HERO,
    stats: listCmp.LIST_COMPARE_STATS,
    steps: listCmp.LIST_COMPARE_STEPS,
    techLayers: listCmp.LIST_COMPARE_TECH_LAYERS,
    grid: listCmp.LIST_COMPARE_INSIGHTS_GRID,
    highlight: listCmp.LIST_COMPARE_INSIGHTS_HIGHLIGHT,
    insightsMeta: listCmp.LIST_COMPARE_INSIGHTS,
    screenshots: listCmp.LIST_COMPARE_SCREENSHOTS,
    plain: listCmp.LIST_COMPARE_PLAIN,
    faq: listCmp.LIST_COMPARE_FAQ,
    options: listCmp.LIST_COMPARE_OPTIONS,
  }),
  cfg(getBase, "udalenie-dublikatov", {
    hero: dedup.DEDUP_HERO,
    stats: dedup.DEDUP_STATS,
    steps: dedup.DEDUP_STEPS,
    techLayers: dedup.DEDUP_TECH_LAYERS,
    grid: dedup.DEDUP_INSIGHTS_GRID,
    highlight: dedup.DEDUP_INSIGHTS_HIGHLIGHT,
    insightsMeta: dedup.DEDUP_INSIGHTS,
    screenshots: dedup.DEDUP_SCREENSHOTS,
    plain: dedup.DEDUP_PLAIN,
    faq: dedup.DEDUP_FAQ,
    options: dedup.DEDUP_OPTIONS,
  }),
  cfg(getBase, "utm-metki", {
    hero: utm.UTM_HERO,
    stats: utm.UTM_STATS,
    steps: utm.UTM_STEPS,
    techLayers: utm.UTM_TECH_LAYERS,
    grid: utm.UTM_INSIGHTS_GRID,
    highlight: utm.UTM_INSIGHTS_HIGHLIGHT,
    insightsMeta: utm.UTM_INSIGHTS,
    screenshots: utm.UTM_SCREENSHOTS,
    plain: utm.UTM_PLAIN,
    faq: utm.UTM_FAQ,
    options: utm.UTM_OPTIONS,
  }),
  cfg(getBase, "kalkulyator-roi", {
    hero: roi.ROI_CALC_HERO,
    stats: roi.ROI_CALC_STATS,
    steps: roi.ROI_CALC_STEPS,
    techLayers: roi.ROI_CALC_TECH_LAYERS,
    grid: roi.ROI_CALC_INSIGHTS_GRID,
    highlight: roi.ROI_CALC_INSIGHTS_HIGHLIGHT,
    insightsMeta: roi.ROI_CALC_INSIGHTS,
    screenshots: roi.ROI_CALC_SCREENSHOTS,
    plain: roi.ROI_CALC_PLAIN,
    faq: roi.ROI_CALC_FAQ,
    options: roi.ROI_CALC_OPTIONS,
  }),
  cfg(getBase, "http-headers", {
    hero: httpH.HTTP_HEADERS_HERO,
    stats: httpH.HTTP_HEADERS_STATS,
    steps: httpH.HTTP_HEADERS_STEPS,
    techLayers: httpH.HTTP_HEADERS_TECH_LAYERS,
    grid: httpH.HTTP_HEADERS_INSIGHTS_GRID,
    highlight: httpH.HTTP_HEADERS_INSIGHTS_HIGHLIGHT,
    insightsMeta: httpH.HTTP_HEADERS_INSIGHTS,
    screenshots: httpH.HTTP_HEADERS_SCREENSHOTS,
    plain: httpH.HTTP_HEADERS_PLAIN,
    faq: httpH.HTTP_HEADERS_FAQ,
    options: httpH.HTTP_HEADERS_OPTIONS,
  }),
  cfg(getBase, "html-redaktor", {
    hero: htmlEd.HTML_EDITOR_HERO,
    stats: htmlEd.HTML_EDITOR_STATS,
    steps: htmlEd.HTML_EDITOR_STEPS,
    techLayers: htmlEd.HTML_EDITOR_TECH_LAYERS,
    grid: htmlEd.HTML_EDITOR_INSIGHTS_GRID,
    highlight: htmlEd.HTML_EDITOR_INSIGHTS_HIGHLIGHT,
    insightsMeta: htmlEd.HTML_EDITOR_INSIGHTS,
    screenshots: htmlEd.HTML_EDITOR_SCREENSHOTS,
    plain: htmlEd.HTML_EDITOR_PLAIN,
    faq: htmlEd.HTML_EDITOR_FAQ,
    options: htmlEd.HTML_EDITOR_OPTIONS,
  }),
  cfg(getBase, "vydelenie-unikalnykh-slov-v-tekste", {
    hero: uniqWords.UNIQUE_WORDS_HERO,
    stats: uniqWords.UNIQUE_WORDS_STATS,
    steps: uniqWords.UNIQUE_WORDS_STEPS,
    techLayers: uniqWords.UNIQUE_WORDS_TECH_LAYERS,
    grid: uniqWords.UNIQUE_WORDS_INSIGHTS_GRID,
    highlight: uniqWords.UNIQUE_WORDS_INSIGHTS_HIGHLIGHT,
    insightsMeta: uniqWords.UNIQUE_WORDS_INSIGHTS,
    screenshots: uniqWords.UNIQUE_WORDS_SCREENSHOTS,
    plain: uniqWords.UNIQUE_WORDS_PLAIN,
    faq: uniqWords.UNIQUE_WORDS_FAQ,
    options: uniqWords.UNIQUE_WORDS_OPTIONS,
  }),
  cfg(getBase, "otslezhivanie-ssylok", {
    hero: linkTr.LINK_TRACK_HERO,
    stats: linkTr.LINK_TRACK_STATS,
    steps: linkTr.LINK_TRACK_STEPS,
    techLayers: linkTr.LINK_TRACK_TECH_LAYERS,
    grid: linkTr.LINK_TRACK_INSIGHTS_GRID,
    highlight: linkTr.LINK_TRACK_INSIGHTS_HIGHLIGHT,
    insightsMeta: linkTr.LINK_TRACK_INSIGHTS,
    screenshots: linkTr.LINK_TRACK_SCREENSHOTS,
    plain: linkTr.LINK_TRACK_PLAIN,
    faq: linkTr.LINK_TRACK_FAQ,
    options: linkTr.LINK_TRACK_OPTIONS,
  }),
  cfg(getBase, "otslezhivanie-sroka-registratsii-domenov", {
    hero: domainReg.DOMAIN_REG_HERO,
    stats: domainReg.DOMAIN_REG_STATS,
    steps: domainReg.DOMAIN_REG_STEPS,
    techLayers: domainReg.DOMAIN_REG_TECH_LAYERS,
    grid: domainReg.DOMAIN_REG_INSIGHTS_GRID,
    highlight: domainReg.DOMAIN_REG_INSIGHTS_HIGHLIGHT,
    insightsMeta: domainReg.DOMAIN_REG_INSIGHTS,
    screenshots: domainReg.DOMAIN_REG_SCREENSHOTS,
    plain: domainReg.DOMAIN_REG_PLAIN,
    faq: domainReg.DOMAIN_REG_FAQ,
    options: domainReg.DOMAIN_REG_OPTIONS,
  }),
  cfg(getBase, "analiz-teksta", {
    hero: textAn.TEXT_ANAL_HERO,
    stats: textAn.TEXT_ANAL_STATS,
    steps: textAn.TEXT_ANAL_STEPS,
    techLayers: textAn.TEXT_ANAL_TECH_LAYERS,
    grid: textAn.TEXT_ANAL_INSIGHTS_GRID,
    highlight: textAn.TEXT_ANAL_INSIGHTS_HIGHLIGHT,
    insightsMeta: textAn.TEXT_ANAL_INSIGHTS,
    screenshots: textAn.TEXT_ANAL_SCREENSHOTS,
    plain: textAn.TEXT_ANAL_PLAIN,
    faq: textAn.TEXT_ANAL_FAQ,
    options: textAn.TEXT_ANAL_OPTIONS,
  }),
  cfg(getBase, "klasterizator-klyuchevykh-slov", {
    hero: cluster.CLUSTER_HERO,
    stats: cluster.CLUSTER_STATS,
    steps: cluster.CLUSTER_STEPS,
    techLayers: cluster.CLUSTER_TECH_LAYERS,
    grid: cluster.CLUSTER_INSIGHTS_GRID,
    highlight: cluster.CLUSTER_INSIGHTS_HIGHLIGHT,
    insightsMeta: cluster.CLUSTER_INSIGHTS,
    screenshots: cluster.CLUSTER_SCREENSHOTS,
    plain: cluster.CLUSTER_PLAIN,
    faq: cluster.CLUSTER_FAQ,
    options: cluster.CLUSTER_OPTIONS,
  }),
  cfg(getBase, "audit-sajta", SITE_AUDIT_V2_SOURCE),
  cfg(getBase, "geo-lokalizaciya-kommerciya", PHRASE_COMMERCE_V2_SOURCE),
  cfg(getBase, "tipy-saitov-v-vydache", SITE_TYPES_V2_SOURCE),
  cfg(getBase, "zapisi-domena", DOMAIN_RECORDS_V2_SOURCE),
  cfg(getBase, "sbor-poiskovykh-podskazok", SEARCH_SUGGESTIONS_V2_SOURCE),
  cfg(getBase, "proverka-indeksacii", INDEX_CHECK_V2_SOURCE),
  cfg(getBase, "proverka-teksta-esenin", ESENIN_V2_SOURCE),
  ];
}

let registryCache: ModuleV2PageConfig[] | null = null;
let bySlugCache: Map<string, ModuleV2PageConfig> | null = null;
let getBaseRef: ((slug: string) => ModulePage | undefined) | null = null;

/** Вызывается из `lib/content/modules.ts` при загрузке — без циклического import. */
export function registerModuleV2GetBase(
  getBase: (slug: string) => ModulePage | undefined
) {
  getBaseRef = getBase;
}

function ensureRegistry(): ModuleV2PageConfig[] {
  if (!registryCache) {
    if (!getBaseRef) {
      throw new Error("module-v2: вызовите registerModuleV2GetBase из modules.ts");
    }
    registryCache = buildRegistry(getBaseRef);
    bySlugCache = new Map(registryCache.map((c) => [c.slug, c]));
  }
  return registryCache;
}

export function getModuleV2Config(slug: string): ModuleV2PageConfig | undefined {
  ensureRegistry();
  return bySlugCache!.get(slug);
}

export function getAllModuleV2Slugs(): string[] {
  return ensureRegistry().map((c) => c.slug);
}

/** Записи ModulePage для роутера и generateStaticParams */
export function getModuleV2ModulePages(
  getBase: (slug: string) => ModulePage | undefined
): ModulePage[] {
  registerModuleV2GetBase(getBase);
  return ensureRegistry().map((c) => {
    const base = getBase(c.baseSlug)!;
    return {
      slug: c.slug,
      path: `/${c.slug}/`,
      title: `${base.title} (LAB v2)`,
      h1: c.concept.headline,
      description: base.description,
      lead: c.concept.lead,
      features: base.features,
      videos: base.videos,
    };
  });
}

