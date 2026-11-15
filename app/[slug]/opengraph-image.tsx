import { getAllModuleSlugs, getBaseModuleBySlug, getModuleBySlug } from "@/lib/content/modules";
import { MODULE_ORBIT_CARD } from "@/lib/content/module-related";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og/render";
import { SITE } from "@/lib/site";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `Модуль ${SITE.name}`;

export function generateStaticParams() {
  return getAllModuleSlugs().map((slug) => ({ slug }));
}

function baseSlugOf(slug: string): string {
  if (/^monitoring-pozicii-v\d$/.test(slug)) return "monitoring-pozicii-sayta";
  const base = slug.replace(/-v\d$/, "");
  return getBaseModuleBySlug(base) ? base : slug;
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const baseSlug = baseSlugOf(slug);
  const mod = getBaseModuleBySlug(baseSlug) ?? getModuleBySlug(slug);
  const card = MODULE_ORBIT_CARD[baseSlug];
  return renderOgImage({
    eyebrow: card?.role ?? "Модуль",
    title: mod?.seoTitle ?? mod?.title ?? SITE.name,
    subtitle: card ? `Модуль «${card.label}» в кабинете ${SITE.name}` : undefined,
  });
}
