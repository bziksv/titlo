import Link from "next/link";
import { SearchSuggestionsDemoWidget } from "@/components/demo/SearchSuggestionsDemoWidget";
import { DemoShowcaseSection } from "@/components/module-landings/DemoShowcaseSection";
import { ModuleLeadCta } from "@/components/ModuleLeadCta";
import { ModuleIcon } from "@/lib/module-icons";
import {
  SEARCH_SUGGESTIONS_AUDIENCE,
  SEARCH_SUGGESTIONS_FAQ,
  SEARCH_SUGGESTIONS_HERO,
  SEARCH_SUGGESTIONS_PIPELINE,
  SEARCH_SUGGESTIONS_SCENARIOS,
  SEARCH_SUGGESTIONS_STATS,
  SEARCH_SUGGESTIONS_STEPS,
  SEARCH_SUGGESTIONS_TARIFF_LIMITS,
  SEARCH_SUGGESTIONS_WHY,
} from "@/lib/content/sbor-poiskovykh-podskazok-page";
import { LK_URL } from "@/lib/site";
import type { ModulePage } from "@/lib/content/modules";

type Props = { module: ModulePage };

export function SborPoiskovykhPodskazokLanding({ module }: Props) {
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
              {SEARCH_SUGGESTIONS_HERO.badge}
            </span>
          </div>

          <h1 className="mt-5 max-w-4xl text-3xl font-bold leading-tight md:text-4xl">
            {SEARCH_SUGGESTIONS_HERO.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-brand-50/95">{SEARCH_SUGGESTIONS_HERO.lead}</p>
          <p className="mt-2 font-mono text-sm text-white/70">{SEARCH_SUGGESTIONS_HERO.sub}</p>

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
              idPrefix="search-suggestions-hero"
              moduleSlug="sbor-poiskovykh-podskazok"
              title="Собрать подсказки в кабинете"
              hint="Регистрация — список фраз, алфавит, пресеты, глубина, история и выгрузка."
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
              href={`${LK_URL}/search-suggestions`}
              className="rounded-xl px-6 py-3 text-sm font-semibold text-brand-100 underline-offset-2 hover:text-white hover:underline"
            >
              Уже есть кабинет →
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-10">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {SEARCH_SUGGESTIONS_STATS.map((s) => (
            <div key={s.label} className="rounded-xl border border-slate-200 p-4 text-center">
              <p className="text-2xl font-bold text-brand-700">{s.value}</p>
              <p className="mt-1 text-sm text-slate-600">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <DemoShowcaseSection
        title="Соберите поисковые подсказки без регистрации"
        lead="1 фраза · 1 ПС · только режим «фраза» · до 2 запусков в сутки. Алфавит, пресеты, глубина и история — в кабинете."
      >
        <SearchSuggestionsDemoWidget />
      </DemoShowcaseSection>

      <section className="py-14 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">{SEARCH_SUGGESTIONS_WHY.title}</h2>
          <p className="mt-3 max-w-3xl text-slate-600">{SEARCH_SUGGESTIONS_WHY.lead}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {SEARCH_SUGGESTIONS_WHY.items.map((item) => (
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
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">{SEARCH_SUGGESTIONS_AUDIENCE.title}</h2>
          <p className="mt-3 max-w-3xl text-slate-600">{SEARCH_SUGGESTIONS_AUDIENCE.lead}</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {SEARCH_SUGGESTIONS_AUDIENCE.items.map((item) => (
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
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">{SEARCH_SUGGESTIONS_SCENARIOS.title}</h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2">
            {SEARCH_SUGGESTIONS_SCENARIOS.items.map((item, i) => (
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
            {SEARCH_SUGGESTIONS_STEPS.map((step) => (
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
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">{SEARCH_SUGGESTIONS_PIPELINE.title}</h2>
          <p className="mt-3 max-w-3xl text-slate-600">{SEARCH_SUGGESTIONS_PIPELINE.lead}</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SEARCH_SUGGESTIONS_PIPELINE.links.map((link) => (
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
          <p className="mt-2 text-slate-600">
            Проверки / сохранения: 1 исходная фраза × 1 ПС = 1 лимит в месяц.
          </p>
          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-semibold">Тариф</th>
                  <th className="px-4 py-3 font-semibold">Лимит</th>
                </tr>
              </thead>
              <tbody>
                {SEARCH_SUGGESTIONS_TARIFF_LIMITS.map((row) => (
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
            {SEARCH_SUGGESTIONS_FAQ.map((item) => (
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
