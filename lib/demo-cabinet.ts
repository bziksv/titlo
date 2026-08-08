import { LK_URL } from "@/lib/site";

/**
 * Маркетинговый slug → путь модуля в кабинете после /demo-cabinet.
 * См. docs/cabinet-reference.md §6.3.
 */
const MARKETING_SLUG_TO_CABINET_PATH: Record<string, string> = {
  "analiz-relevantnosti": "/analyze-relevance",
  "analiz-konkurentov": "/competitor-analysis",
  "monitoring-pozicii-sayta": "/monitoring-v2",
  "monitoring-pozicii-v2": "/monitoring-v2",
  "monitoring-pozicii-v3": "/monitoring-v2",
  "monitoring-saytov": "/site-monitoring",
  "proverka-meta-tegov-online": "/meta-tags",
  generator_slov: "/keyword-generator",
  "podschet-dliny-teksta": "/counting-text-length",
  "generator-paroley": "/password-generator",
  "sravnenie-spiskov-klyuchevykh-fraz": "/list-comparison",
  "udalenie-dublikatov": "/duplicates",
  "utm-metki": "/utm-marks",
  "kalkulyator-roi": "/roi-calculator",
  "http-headers": "/http-headers",
  "proverka-indeksacii": "/index-check",
  "proverka-teksta-esenin": "/esenin-text-check",
  "sbor-poiskovykh-podskazok": "/search-suggestions",
  "zapisi-domena": "/domain-records",
  "tipy-saitov-v-vydache": "/site-types",
  "geo-lokalizaciya-kommerciya": "/phrase-commerce",
  "html-redaktor": "/html-editor",
  "vydelenie-unikalnykh-slov-v-tekste": "/unique",
  "otslezhivanie-ssylok": "/backlink",
  "otslezhivanie-sroka-registratsii-domenov": "/domain-information",
  "analiz-teksta": "/text-analyzer",
  "klasterizator-klyuchevykh-slov": "/cluster",
  "audit-sajta": "/site-audit",
};

/** LAB `foo-v2` → базовый `foo`, кроме особых slug мониторинга. */
function baseMarketingSlug(slug: string): string {
  if (slug === "monitoring-pozicii-v1" || slug === "monitoring-pozicii-v2" || slug === "monitoring-pozicii-v3") {
    return slug;
  }
  if (slug.endsWith("-v1") || slug.endsWith("-v2") || slug.endsWith("-v3")) {
    return slug.replace(/-v[123]$/, "");
  }
  return slug;
}

export function cabinetPathForMarketingPathname(pathname: string | null | undefined): string | null {
  if (!pathname) return null;
  const slug = pathname.replace(/^\/+|\/+$/g, "");
  if (!slug) return null;
  const direct = MARKETING_SLUG_TO_CABINET_PATH[slug];
  if (direct) return direct;
  const base = baseMarketingSlug(slug);
  return MARKETING_SLUG_TO_CABINET_PATH[base] ?? null;
}

/** Ссылка «Демо кабинет»: с лендинга модуля — сразу в демо этого модуля. */
export function demoCabinetHref(pathname?: string | null): string {
  const base = `${LK_URL.replace(/\/$/, "")}/demo-cabinet`;
  const to = cabinetPathForMarketingPathname(pathname);
  if (!to) return base;
  return `${base}?to=${encodeURIComponent(to)}`;
}
