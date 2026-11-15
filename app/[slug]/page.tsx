import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MonitoringPoziciiV2Landing } from "@/components/module-landings/MonitoringPoziciiV2Landing";
import { MonitoringPoziciiV3Landing } from "@/components/module-landings/MonitoringPoziciiV3Landing";
import { baseSlugFromV1 } from "@/lib/content/module-v1/slugs";
import {
  getModuleV2LabSlugForPage,
  isMonitoringV2Page,
} from "@/lib/content/module-v2/resolve-route";
import { getModuleV2Config } from "@/lib/content/module-v2/registry";
import { getModuleV3Config } from "@/lib/content/module-v3/registry";
import {
  getAllModuleSlugs,
  getBaseModuleBySlug,
  getModuleBySlug,
  isLabModuleSlug,
} from "@/lib/content/modules";
import { ModuleV2Landing } from "@/components/module-landings/ModuleV2Landing";
import { ModuleV3Landing } from "@/components/module-landings/ModuleV3Landing";
import { renderModuleLanding } from "@/lib/render-module-landing";
import { canonicalMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllModuleSlugs().map((slug) => ({ slug }));
}

/** LAB-копии (*-v1 / *-v2 / *-v3) → slug публичного лендинга для canonical. */
function canonicalModuleSlug(slug: string): string {
  if (!isLabModuleSlug(slug)) return slug;
  if (/^monitoring-pozicii-v\d$/.test(slug)) return "monitoring-pozicii-sayta";
  const base = slug.replace(/-v\d$/, "");
  return getBaseModuleBySlug(base) ? base : slug;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const mod = getModuleBySlug(slug);
  if (!mod) return {};
  const isLab = isLabModuleSlug(slug);
  const canonicalSlug = canonicalModuleSlug(slug);
  return {
    title: isLab ? mod.title : (mod.seoTitle ?? mod.title),
    description: isLab ? mod.description : (mod.seoDescription ?? mod.description),
    ...canonicalMetadata(`/${canonicalSlug}/`, {
      image: `/${canonicalSlug}/opengraph-image/`,
      imageAlt: mod.seoTitle ?? mod.title,
    }),
    ...(isLab
      ? { robots: { index: false, follow: false, googleBot: { index: false, follow: false } } }
      : {}),
  };
}

export default async function ModulePage({ params }: Props) {
  const { slug } = await params;
  const mod = getModuleBySlug(slug);
  if (!mod) notFound();

  const v1Base = baseSlugFromV1(slug);
  if (v1Base) {
    const baseMod = getBaseModuleBySlug(v1Base);
    if (!baseMod) notFound();
    return renderModuleLanding(v1Base, baseMod);
  }

  if (isMonitoringV2Page(slug)) {
    const pageMod = getBaseModuleBySlug("monitoring-pozicii-sayta") ?? mod;
    return (
      <MonitoringPoziciiV2Landing
        module={pageMod}
        isLabRoute={slug === "monitoring-pozicii-v2"}
      />
    );
  }

  const v2LabSlug = getModuleV2LabSlugForPage(slug);
  if (v2LabSlug) {
    const v2Config = getModuleV2Config(v2LabSlug);
    if (v2Config) {
      const pageMod = getBaseModuleBySlug(v2Config.baseSlug) ?? mod;
      return (
        <ModuleV2Landing
          module={pageMod}
          config={v2Config}
          isLabRoute={slug.endsWith("-v2")}
        />
      );
    }
  }

  if (slug === "monitoring-pozicii-v3") {
    return <MonitoringPoziciiV3Landing module={mod} />;
  }

  const v3Config = getModuleV3Config(slug);
  if (v3Config) {
    return <ModuleV3Landing module={mod} config={v3Config} />;
  }

  return renderModuleLanding(slug, mod);
}
