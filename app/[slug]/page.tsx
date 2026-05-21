import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ModuleLanding } from "@/components/ModuleLanding";
import { AnalizRelevantnostiLanding } from "@/components/module-landings/AnalizRelevantnostiLanding";
import { AnalizKonkurentovLanding } from "@/components/module-landings/AnalizKonkurentovLanding";
import { HttpHeadersLanding } from "@/components/module-landings/HttpHeadersLanding";
import { KalkulyatorRoiLanding } from "@/components/module-landings/KalkulyatorRoiLanding";
import { UtmMetkiLanding } from "@/components/module-landings/UtmMetkiLanding";
import { SravnenieSpiskovLanding } from "@/components/module-landings/SravnenieSpiskovLanding";
import { GeneratorParoleyLanding } from "@/components/module-landings/GeneratorParoleyLanding";
import { PodschetDlinyTekstaLanding } from "@/components/module-landings/PodschetDlinyTekstaLanding";
import { GeneratorSlovLanding } from "@/components/module-landings/GeneratorSlovLanding";
import { ProverkaMetaTegovLanding } from "@/components/module-landings/ProverkaMetaTegovLanding";
import { UdalenieDublikatovLanding } from "@/components/module-landings/UdalenieDublikatovLanding";
import { VydelenieUnikalnykhSlovLanding } from "@/components/module-landings/VydelenieUnikalnykhSlovLanding";
import { OtslezhivanieSsylokLanding } from "@/components/module-landings/OtslezhivanieSsylokLanding";
import { OtslezhivanieSrokaRegistratsiiDomenovLanding } from "@/components/module-landings/OtslezhivanieSrokaRegistratsiiDomenovLanding";
import { AnalizTekstaLanding } from "@/components/module-landings/AnalizTekstaLanding";
import { KlasterizatorKlyuchevykhSlovLanding } from "@/components/module-landings/KlasterizatorKlyuchevykhSlovLanding";
import { HtmlRedaktorLanding } from "@/components/module-landings/HtmlRedaktorLanding";
import { MonitoringPoziciiLanding } from "@/components/module-landings/MonitoringPoziciiLanding";
import { MonitoringSaytovLanding } from "@/components/module-landings/MonitoringSaytovLanding";
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
  if (slug === "monitoring-pozicii-sayta") {
    return <MonitoringPoziciiLanding module={mod} />;
  }
  if (slug === "monitoring-saytov") {
    return <MonitoringSaytovLanding module={mod} />;
  }
  if (slug === "analiz-konkurentov") {
    return <AnalizKonkurentovLanding module={mod} />;
  }
  if (slug === "html-redaktor") {
    return <HtmlRedaktorLanding module={mod} />;
  }
  if (slug === "http-headers") {
    return <HttpHeadersLanding module={mod} />;
  }
  if (slug === "kalkulyator-roi") {
    return <KalkulyatorRoiLanding module={mod} />;
  }
  if (slug === "utm-metki") {
    return <UtmMetkiLanding module={mod} />;
  }
  if (slug === "sravnenie-spiskov-klyuchevykh-fraz") {
    return <SravnenieSpiskovLanding module={mod} />;
  }
  if (slug === "generator-paroley") {
    return <GeneratorParoleyLanding module={mod} />;
  }
  if (slug === "podschet-dliny-teksta") {
    return <PodschetDlinyTekstaLanding module={mod} />;
  }
  if (slug === "generator_slov") {
    return <GeneratorSlovLanding module={mod} />;
  }
  if (slug === "proverka-meta-tegov-online") {
    return <ProverkaMetaTegovLanding module={mod} />;
  }
  if (slug === "udalenie-dublikatov") {
    return <UdalenieDublikatovLanding module={mod} />;
  }
  if (slug === "vydelenie-unikalnykh-slov-v-tekste") {
    return <VydelenieUnikalnykhSlovLanding module={mod} />;
  }
  if (slug === "otslezhivanie-ssylok") {
    return <OtslezhivanieSsylokLanding module={mod} />;
  }
  if (slug === "otslezhivanie-sroka-registratsii-domenov") {
    return <OtslezhivanieSrokaRegistratsiiDomenovLanding module={mod} />;
  }
  if (slug === "analiz-teksta") {
    return <AnalizTekstaLanding module={mod} />;
  }
  if (slug === "klasterizator-klyuchevykh-slov") {
    return <KlasterizatorKlyuchevykhSlovLanding module={mod} />;
  }
  return <ModuleLanding module={mod} />;
}
