import type { ReactNode } from "react";
import type { ModulePage } from "@/lib/content/modules";
import { ModuleLanding } from "@/components/ModuleLanding";
import { ModuleLandingShell } from "@/components/module-landings/ModuleLandingShell";
import { AnalizRelevantnostiLanding } from "@/components/module-landings/AnalizRelevantnostiLanding";
import { AnalizKonkurentovLanding } from "@/components/module-landings/AnalizKonkurentovLanding";
import { HttpHeadersLanding } from "@/components/module-landings/HttpHeadersLanding";
import { ProverkaIndeksaciiLanding } from "@/components/module-landings/ProverkaIndeksaciiLanding";
import { ProverkaTekstaEseninLanding } from "@/components/module-landings/ProverkaTekstaEseninLanding";
import { SborPoiskovykhPodskazokLanding } from "@/components/module-landings/SborPoiskovykhPodskazokLanding";
import { ZapisiDomenaLanding } from "@/components/module-landings/ZapisiDomenaLanding";
import { TipySaitovVVydacheLanding } from "@/components/module-landings/TipySaitovVVydacheLanding";
import { GeoLokalizaciyaKommerciyaLanding } from "@/components/module-landings/GeoLokalizaciyaKommerciyaLanding";
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

function wrapClassic(page: ReactNode) {
  return <ModuleLandingShell>{page}</ModuleLandingShell>;
}

/** Рендер эталонного лендинга по базовому slug (классика / LAB v1). */
export function renderModuleLanding(baseSlug: string, module: ModulePage) {
  switch (baseSlug) {
    case "analiz-relevantnosti":
      return wrapClassic(<AnalizRelevantnostiLanding module={module} />);
    case "monitoring-pozicii-sayta":
      return wrapClassic(<MonitoringPoziciiLanding module={module} />);
    case "monitoring-saytov":
      return wrapClassic(<MonitoringSaytovLanding module={module} />);
    case "analiz-konkurentov":
      return wrapClassic(<AnalizKonkurentovLanding module={module} />);
    case "html-redaktor":
      return wrapClassic(<HtmlRedaktorLanding module={module} />);
    case "http-headers":
      return wrapClassic(<HttpHeadersLanding module={module} />);
    case "proverka-indeksacii":
      return wrapClassic(<ProverkaIndeksaciiLanding module={module} />);
    case "proverka-teksta-esenin":
      return wrapClassic(<ProverkaTekstaEseninLanding module={module} />);
    case "sbor-poiskovykh-podskazok":
      return wrapClassic(<SborPoiskovykhPodskazokLanding module={module} />);
    case "zapisi-domena":
      return wrapClassic(<ZapisiDomenaLanding module={module} />);
    case "tipy-saitov-v-vydache":
      return wrapClassic(<TipySaitovVVydacheLanding module={module} />);
    case "geo-lokalizaciya-kommerciya":
      return wrapClassic(<GeoLokalizaciyaKommerciyaLanding module={module} />);
    case "kalkulyator-roi":
      return wrapClassic(<KalkulyatorRoiLanding module={module} />);
    case "utm-metki":
      return wrapClassic(<UtmMetkiLanding module={module} />);
    case "sravnenie-spiskov-klyuchevykh-fraz":
      return wrapClassic(<SravnenieSpiskovLanding module={module} />);
    case "generator-paroley":
      return wrapClassic(<GeneratorParoleyLanding module={module} />);
    case "podschet-dliny-teksta":
      return wrapClassic(<PodschetDlinyTekstaLanding module={module} />);
    case "generator_slov":
      return wrapClassic(<GeneratorSlovLanding module={module} />);
    case "proverka-meta-tegov-online":
      return wrapClassic(<ProverkaMetaTegovLanding module={module} />);
    case "udalenie-dublikatov":
      return wrapClassic(<UdalenieDublikatovLanding module={module} />);
    case "vydelenie-unikalnykh-slov-v-tekste":
      return wrapClassic(<VydelenieUnikalnykhSlovLanding module={module} />);
    case "otslezhivanie-ssylok":
      return wrapClassic(<OtslezhivanieSsylokLanding module={module} />);
    case "otslezhivanie-sroka-registratsii-domenov":
      return wrapClassic(<OtslezhivanieSrokaRegistratsiiDomenovLanding module={module} />);
    case "analiz-teksta":
      return wrapClassic(<AnalizTekstaLanding module={module} />);
    case "klasterizator-klyuchevykh-slov":
      return wrapClassic(<KlasterizatorKlyuchevykhSlovLanding module={module} />);
    default:
      return wrapClassic(<ModuleLanding module={module} />);
  }
}
