import dynamic from "next/dynamic";
import { MonitoringV2CommandHero } from "@/components/module-landings/monitoring-v2/MonitoringV2CommandHero";
import { MonitoringV2PainGain } from "@/components/module-landings/monitoring-v2/MonitoringV2PainGain";
import { MonitoringV2MetricWall } from "@/components/module-landings/monitoring-v2/MonitoringV2MetricWall";
import { MonitoringV2Footer } from "@/components/module-landings/monitoring-v2/MonitoringV2Footer";
import { ModuleV2DemoSection } from "@/components/module-landings/ModuleV2DemoSection";

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
import type { ModuleV2PageConfig } from "@/lib/content/module-v2/types";
import type { ModulePage } from "@/lib/content/modules";

type Props = {
  module: ModulePage;
  config: ModuleV2PageConfig;
  /** true на URL *-v2; false на публичном /<base>/ */
  isLabRoute?: boolean;
};

/**
 * Универсальный лендинг v2 «Центр управления» (как monitoring-pozicii-v2).
 */
export function ModuleV2Landing({ module, config, isLabRoute = false }: Props) {
  const c = config;
  const heroUi = {
    ...c.heroUi,
    labBadge: isLabRoute ? (c.heroUi.labBadge ?? "LAB v2") : undefined,
  };
  const footerUi = { ...c.footerUi, isLabRoute };
  const shots = c.acts.map((a) => ({ src: a.image, caption: a.imageAlt }));
  const actsPreview = c.acts.map((a) => ({ act: a.act, title: a.title }));

  return (
    <div className="module-v2-landing min-w-0 max-w-full overflow-x-clip">
      <MonitoringV2CommandHero
        module={module}
        concept={c.concept}
        shots={shots.length >= 2 ? [shots[0], shots[1]] : shots}
        acts={actsPreview}
        heroUi={heroUi}
      />
      <MonitoringV2PainGain data={c.painGain} />
      {c.demoWidget ? <ModuleV2DemoSection kind={c.demoWidget} /> : null}
      <MonitoringV2StoryActs
        acts={c.acts}
        section={{
          id: c.heroUi.storyAnchor,
          eyebrow: c.storySection.eyebrow,
          title: c.storySection.title,
          lead: c.storySection.lead,
        }}
      />
      <MonitoringV2MetricWall metrics={c.metrics} section={c.metricSection} />
      <MonitoringV2Orbit nodes={c.orbit} section={c.orbitSection} />
      <MonitoringV2Footer
        options={c.options}
        optionsSection={c.optionsSection}
        plain={c.plain}
        videos={c.videos}
        faq={c.faq}
        footerUi={footerUi}
      />
    </div>
  );
}
