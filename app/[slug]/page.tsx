import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ModuleLanding } from "@/components/ModuleLanding";
import { AnalizRelevantnostiLanding } from "@/components/module-landings/AnalizRelevantnostiLanding";
import { getAllModuleSlugs, getModuleBySlug } from "@/lib/content/modules";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllModuleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const mod = getModuleBySlug(slug);
  if (!mod) return {};
  return {
    title: mod.title,
    description: mod.description,
  };
}

export default async function ModulePage({ params }: Props) {
  const { slug } = await params;
  const mod = getModuleBySlug(slug);
  if (!mod) notFound();
  if (slug === "analiz-relevantnosti") {
    return <AnalizRelevantnostiLanding module={mod} />;
  }
  return <ModuleLanding module={mod} />;
}
