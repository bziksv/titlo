"use client";

import { DemoModuleLinks } from "@/components/demo/DemoModuleLinks";
import { DemoUpgradePanel } from "@/components/demo/DemoUpgradePanel";
import { DemoWidgetShell } from "@/components/demo/DemoWidgetShell";
import { UtmMarksDemoEmbed } from "@/components/demo/UtmMarksDemoEmbed";
import {
  buildUtmMarksRegisterUrl,
  UTM_MARKS_CABINET_FEATURES,
} from "@/lib/demo/utm-marks-demo";

const DEMO_FEATURES = [
  "Шаблоны: Директ, Ads, VK, myTarget или вручную",
  "utm_source, medium, campaign, content, term",
  "Быстрые значения, макросы и Openstat",
  "Один URL или список посадочных",
  "Без лимитов на этой странице",
] as const;

type Props = {
  /** Внутри белой карточки ModuleV2DemoSection — без дублирования крупного заголовка */
  nested?: boolean;
};

export function UtmMarksDemoWidget({ nested }: Props) {
  const content = (
    <>
      <UtmMarksDemoEmbed />

      <div className="mt-8">
        <DemoUpgradePanel
          registerUrl={buildUtmMarksRegisterUrl()}
          remaining={1}
          maxRuns={1}
          fullMaxChars={0}
          moduleTitle="платформы Титло"
          showRemaining={false}
          upgradeHint="Зарегистрируйтесь бесплатно — сохраните доступ к генератору в кабинете и подключите мониторинг, SEO и аналитику в одном месте."
          details={UTM_MARKS_CABINET_FEATURES}
        />
      </div>

      <div className="mt-4">
        <DemoModuleLinks
          links={[
            { href: "/kalkulyator-roi/", label: "Калькулятор ROI" },
            { href: "/proverka-meta-tegov-online/", label: "Мета-теги" },
            { href: "/monitoring-saytov/", label: "Мониторинг сайтов" },
          ]}
        />
      </div>
    </>
  );

  if (nested) {
    return (
      <div className="p-6 md:p-8 lg:p-10">
        <ul className="mb-6 flex flex-wrap gap-2 lg:hidden">
          {DEMO_FEATURES.map((f) => (
            <li
              key={f}
              className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-800"
            >
              {f}
            </li>
          ))}
        </ul>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">{content}</div>
          <aside className="sticky top-20 hidden self-start lg:block">
            <div className="rounded-xl border border-brand-100 bg-gradient-to-b from-brand-50 to-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">В демо</p>
              <ul className="mt-4 space-y-3">
                {DEMO_FEATURES.map((f) => (
                  <li key={f} className="flex gap-2.5 text-sm text-slate-700">
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white"
                      aria-hidden
                    >
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <DemoWidgetShell
      title="Соберите UTM-ссылку прямо здесь"
      lead="Как в кабинете: шаблон площадки, подсказки по полям и готовая ссылка. Регистрация не нужна, чтобы собрать URL."
      features={DEMO_FEATURES}
    >
      {content}
    </DemoWidgetShell>
  );
}
