import Link from "next/link";
import { SiteTypesDemoWidget } from "@/components/demo/SiteTypesDemoWidget";
import { DemoShowcaseSection } from "@/components/module-landings/DemoShowcaseSection";
import { ModuleLeadCta } from "@/components/ModuleLeadCta";
import { ModuleIcon } from "@/lib/module-icons";
import {
  SITE_TYPES_AUDIENCE,
  SITE_TYPES_FAQ,
  SITE_TYPES_HERO,
  SITE_TYPES_PIPELINE,
  SITE_TYPES_SCENARIOS,
  SITE_TYPES_STATS,
  SITE_TYPES_STEPS,
  SITE_TYPES_TARIFF_LIMITS,
  SITE_TYPES_WHY,
} from "@/lib/content/tipy-saitov-v-vydache-page";
import { LK_URL } from "@/lib/site";
import type { ModulePage } from "@/lib/content/modules";

type Props = { module: ModulePage };

export function TipySaitovVVydacheLanding({ module }: Props) {
  return (
    <>
      <section className="relative overflow-hidden bg-brand-800 text-white">
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-12 md:py-16">
          <nav className="mb-6 text-sm text-brand-100">
            <Link href="/" className="hover:text-white">
              Главная
            </Link>
            <span className="mx-2 opacity-60">/</span>
            <Link href="/services/" className="hover:text-white">
              Модули
            </Link>
          </nav>

          <div className="flex flex-wrap items-center gap-3">
            <ModuleIcon href={module.path} className="h-12 w-12 bg-white/15 text-2xl" />
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              {SITE_TYPES_HERO.badge}
            </span>
          </div>

          <h1 className="mt-5 max-w-4xl text-3xl font-bold leading-tight md:text-4xl">
            {SITE_TYPES_HERO.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-brand-50/95">{SITE_TYPES_HERO.lead}</p>
          <p className="mt-2 font-mono text-sm text-white/70">{SITE_TYPES_HERO.sub}</p>

          <ul className="mt-8 flex flex-wrap gap-2">
            {module.features?.map((f) => (
              <li key={f} className="rounded-full border border-white/20 bg-brand-800/80 px-3 py-1.5 text-sm">
                ✓ {f}
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <ModuleLeadCta
              variant="hero"
              idPrefix="site-types-hero"
              moduleSlug="tipy-saitov-v-vydache"
              title="Разобрать выдачу в кабинете"
              hint="Регистрация — список фраз, обе ПС, глубина до 30, история и свои каталоги доменов."
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/tarify/"
              className="rounded-xl border-2 border-white/35 px-6 py-3 text-sm font-semibold transition hover:bg-white/10"
            >
              Тарифы и лимиты
            </Link>
            <a
              href={`${LK_URL}/site-types`}
              className="rounded-xl px-6 py-3 text-sm font-semibold text-brand-100 underline-offset-2 hover:text-white hover:underline"
            >
              Уже есть кабинет →
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-10">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {SITE_TYPES_STATS.map((s) => (
            <div key={s.label} className="rounded-xl border border-slate-200 p-4 text-center">
              <p className="text-2xl font-bold text-brand-700">{s.value}</p>
              <p className="mt-1 text-sm text-slate-600">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <DemoShowcaseSection
        title="Проверьте типы сайтов в выдаче без регистрации"
        lead="1 фраза · 1 ПС · глубина 10 · до 2 запусков в сутки. Список фраз, обе системы и история — в кабинете."
      >
        <SiteTypesDemoWidget />
      </DemoShowcaseSection>

      <section className="py-14 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">{SITE_TYPES_WHY.title}</h2>
          <p className="mt-3 max-w-3xl text-slate-600">{SITE_TYPES_WHY.lead}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {SITE_TYPES_WHY.items.map((item) => (
              <div key={item.title} className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-14 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">{SITE_TYPES_AUDIENCE.title}</h2>
          <p className="mt-3 max-w-3xl text-slate-600">{SITE_TYPES_AUDIENCE.lead}</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {SITE_TYPES_AUDIENCE.items.map((item) => (
              <div key={item.role} className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">{item.role}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">{SITE_TYPES_SCENARIOS.title}</h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2">
            {SITE_TYPES_SCENARIOS.items.map((item, i) => (
              <li key={item.title} className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="font-mono text-xs text-brand-700">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-1 font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-14 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Как работает</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {SITE_TYPES_STEPS.map((step) => (
              <div key={step.step} className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="font-mono text-sm font-semibold text-brand-700">{step.step}</p>
                <h3 className="mt-2 font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">{SITE_TYPES_PIPELINE.title}</h2>
          <p className="mt-3 max-w-3xl text-slate-600">{SITE_TYPES_PIPELINE.lead}</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SITE_TYPES_PIPELINE.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand-300 hover:shadow-sm"
                >
                  <span className="font-semibold text-brand-800">{link.label}</span>
                  <span className="mt-1 block text-xs text-slate-500">{link.hint}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">Лимиты по тарифам</h2>
          <p className="mt-2 text-slate-600">Проверки / сохранения: 1 фраза × 1 ПС = 1 лимит в месяц (в Google глубже 10 — больше).</p>
          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-semibold">Тариф</th>
                  <th className="px-4 py-3 font-semibold">Лимит</th>
                </tr>
              </thead>
              <tbody>
                {SITE_TYPES_TARIFF_LIMITS.map((row) => (
                  <tr key={row.name} className="border-t border-slate-100">
                    <td className="px-4 py-3">{row.name}</td>
                    <td className="px-4 py-3 font-mono font-semibold">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">Частые вопросы</h2>
          <dl className="mt-6 space-y-4">
            {SITE_TYPES_FAQ.map((item) => (
              <div key={item.q} className="rounded-xl border border-slate-200 bg-white p-4">
                <dt className="font-semibold text-slate-900">{item.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-slate-600">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
