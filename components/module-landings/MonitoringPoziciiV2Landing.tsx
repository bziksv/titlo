import dynamic from "next/dynamic";
import { MonitoringV2CommandHero } from "@/components/module-landings/monitoring-v2/MonitoringV2CommandHero";
import { MonitoringV2PainGain } from "@/components/module-landings/monitoring-v2/MonitoringV2PainGain";
import { MonitoringV2Footer } from "@/components/module-landings/monitoring-v2/MonitoringV2Footer";

const MonitoringV2StoryActs = dynamic(
  () =>
    import("@/components/module-landings/monitoring-v2/MonitoringV2StoryActs").then(
      (m) => m.MonitoringV2StoryActs
    ),
  { loading: () => <div className="min-h-[28rem]" aria-hidden /> }
);

const MonitoringV2Orbit = dynamic(
  () =>
    import("@/components/module-landings/monitoring-v2/MonitoringV2Orbit").then((m) => m.MonitoringV2Orbit),
  { loading: () => <div className="min-h-[20rem]" aria-hidden /> }
);

const MonitoringV2CapabilityDeck = dynamic(
  () =>
    import("@/components/module-landings/monitoring-v2/MonitoringV2CapabilityDeck").then(
      (m) => m.MonitoringV2CapabilityDeck
    ),
  { loading: () => <div className="min-h-[24rem]" aria-hidden /> }
);
import {
  MONITORING_V2_ACTS,
  MONITORING_V2_CAPABILITIES,
  MONITORING_V2_CONCEPT,
  MONITORING_V2_FAQ,
  MONITORING_V2_OPTIONS,
  MONITORING_V2_OPTIONS_SECTION,
  MONITORING_V2_ORBIT,
  MONITORING_V2_ORBIT_SECTION,
  MONITORING_V2_PAIN_GAIN,
  MONITORING_V2_PLAIN,
  MONITORING_V2_SCREENSHOTS,
  MONITORING_V2_STORY_SECTION,
  MONITORING_V2_VIDEOS,
} from "@/lib/content/monitoring-pozicii-v2-page";
import type { ModulePage } from "@/lib/content/modules";

type Props = { module: ModulePage; isLabRoute?: boolean };

/**
 * v2 — лендинг мониторинга позиций.
 * Публичный URL: /monitoring-pozicii-sayta/; LAB: /monitoring-pozicii-v2/.
 */
export function MonitoringPoziciiV2Landing({ module, isLabRoute = false }: Props) {
  return (
    <div className="module-v2-landing min-w-0 max-w-full overflow-x-clip">
      <MonitoringV2CommandHero
        module={module}
        concept={MONITORING_V2_CONCEPT}
        shots={MONITORING_V2_SCREENSHOTS}
        acts={MONITORING_V2_ACTS.map((a) => ({ act: a.act, title: a.title }))}
        heroUi={{
          classicHref: "/monitoring-pozicii-sayta/",
          labBadge: isLabRoute ? "LAB v2" : undefined,
          keysFooter: "Проект · ключи",
          dynamicsFooter: "Динамика · отчёт",
          ctaHint: "Регистрация → проект, ядро и первый съём в кабинете.",
        }}
      />
      <MonitoringV2PainGain data={MONITORING_V2_PAIN_GAIN} />
      <MonitoringV2StoryActs acts={MONITORING_V2_ACTS} section={MONITORING_V2_STORY_SECTION} />
      <MonitoringV2Orbit nodes={MONITORING_V2_ORBIT} section={MONITORING_V2_ORBIT_SECTION} />
      <MonitoringV2CapabilityDeck data={MONITORING_V2_CAPABILITIES} />
      <MonitoringV2Footer
        options={MONITORING_V2_OPTIONS}
        optionsSection={MONITORING_V2_OPTIONS_SECTION}
        plain={MONITORING_V2_PLAIN}
        videos={MONITORING_V2_VIDEOS}
        faq={MONITORING_V2_FAQ}
        footerUi={{
          idPrefix: "monitoring-v2",
          finalTitle: "Запустить мониторинг позиций",
          finalLead:
            "Создайте проект, загрузите ядро и снимайте позиции по расписанию — после регистрации в кабинете.",
          classicHref: "/monitoring-pozicii-sayta/",
          faqTitle: "Частые вопросы про мониторинг позиций",
          videoTitle: "Разбор модуля в видео",
          videoLead: "Четыре урока — от первого проекта до выгрузки отчёта.",
          videoNote:
            "На роликах — прежний интерфейс. Сейчас панель обновлена: удобнее и выглядит иначе.",
          isLabRoute,
        }}
      />
    </div>
  );
}
