import Link from "next/link";
import { EseninTextCheckDemoWidget } from "@/components/demo/EseninTextCheckDemoWidget";
import { ModuleInsightsSection } from "@/components/module-landings/ModuleInsightsSection";
import { ModulePlainSection } from "@/components/module-landings/ModulePlainSection";
import { ModuleLeadCta } from "@/components/ModuleLeadCta";
import { ModuleIcon } from "@/lib/module-icons";
import {
  ESENIN_TEXT_CHECK_CABINET_BENEFITS,
  ESENIN_TEXT_CHECK_CABINET_INTERFACE,
  ESENIN_TEXT_CHECK_FAQ,
  ESENIN_TEXT_CHECK_HERO,
  ESENIN_TEXT_CHECK_INSIGHTS,
  ESENIN_TEXT_CHECK_INSIGHTS_GRID,
  ESENIN_TEXT_CHECK_INSIGHTS_HIGHLIGHT,
  ESENIN_TEXT_CHECK_INSIGHTS_OUTCOMES,
  ESENIN_TEXT_CHECK_PLAIN,
  ESENIN_TEXT_CHECK_STATS,
  ESENIN_TEXT_CHECK_STEPS,
  ESENIN_TEXT_CHECK_TARIFF_LIMITS,
} from "@/lib/content/proverka-teksta-esenin-page";
import { LK_URL } from "@/lib/site";
import type { ModulePage } from "@/lib/content/modules";

type Props = { module: ModulePage };

export function ProverkaTekstaEseninLanding({ module }: Props) {
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
              {ESENIN_TEXT_CHECK_HERO.badge}
            </span>
          </div>

          <h1 className="mt-5 max-w-4xl text-3xl font-bold leading-tight md:text-4xl">{ESENIN_TEXT_CHECK_HERO.title}</h1>
          <p className="mt-4 max-w-3xl text-lg text-brand-50/95">{ESENIN_TEXT_CHECK_HERO.lead}</p>
          <p className="mt-2 font-mono text-sm text-white/70">{ESENIN_TEXT_CHECK_HERO.sub}</p>

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
              idPrefix="esenin-text-check-hero"
              moduleSlug="proverka-teksta-esenin"
              title="Открыть полный интерфейс в кабинете"
              hint="HTML-редактор, 6 вкладок риска, правки в отчёте, задачи и автосохранение до 3 версий."
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
              href={`${LK_URL}/esenin-text-check`}
              className="rounded-xl px-6 py-3 text-sm font-semibold text-brand-100 underline-offset-2 hover:text-white hover:underline"
            >
              Уже есть кабинет →
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-10">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {ESENIN_TEXT_CHECK_STATS.map((s) => (
            <div key={s.label} className="rounded-xl border border-slate-200 p-4 text-center">
              <p className="text-2xl font-bold text-brand-700">{s.value}</p>
              <p className="mt-1 text-sm text-slate-600">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="min-w-0 max-w-full overflow-x-clip bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-16">
          <ModuleInsightsSection
            meta={ESENIN_TEXT_CHECK_INSIGHTS}
            grid={ESENIN_TEXT_CHECK_INSIGHTS_GRID}
            highlight={ESENIN_TEXT_CHECK_INSIGHTS_HIGHLIGHT}
            outcomes={ESENIN_TEXT_CHECK_INSIGHTS_OUTCOMES}
            titleId="esenin-insights-title"
          />
        </div>
      </div>

      <section className="border-b border-slate-200 bg-slate-50 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">Попробуйте без регистрации</h2>
          <p className="mt-2 max-w-3xl text-slate-600">
            Демо на этой странице — до 5 000 символов и 2 проверки в сутки, сводный режим «Общий риск» и подсказки при
            наведении. В личном кабинете интерфейс заметно шире: HTML-редактор, шесть вкладок риска, правки в отчёте и
            история версий.
          </p>
          <div className="mt-8">
            <EseninTextCheckDemoWidget />
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-14 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-brand-600">Личный кабинет</p>
          <h2 className="mt-2 text-center text-2xl font-bold text-slate-900 md:text-3xl">
            {ESENIN_TEXT_CHECK_CABINET_BENEFITS.title}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-slate-600">{ESENIN_TEXT_CHECK_CABINET_BENEFITS.lead}</p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {ESENIN_TEXT_CHECK_CABINET_BENEFITS.columns.map((col) => (
              <div
                key={col.title}
                className={`rounded-2xl border p-6 shadow-sm md:p-8 ${
                  col.title.includes("кабинет")
                    ? "border-brand-200 bg-gradient-to-br from-brand-50/80 to-white"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <h3 className="text-lg font-bold text-slate-900">{col.title}</h3>
                <ul className="mt-4 space-y-2.5 text-sm text-slate-700">
                  {col.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-brand-600" aria-hidden>
                        •
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50 py-14 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-brand-600">
            {ESENIN_TEXT_CHECK_CABINET_INTERFACE.eyebrow}
          </p>
          <h2 className="mt-2 text-center text-2xl font-bold text-slate-900 md:text-3xl">
            {ESENIN_TEXT_CHECK_CABINET_INTERFACE.title}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-slate-600">{ESENIN_TEXT_CHECK_CABINET_INTERFACE.lead}</p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ESENIN_TEXT_CHECK_CABINET_INTERFACE.items.map((item) => (
              <li
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-200"
              >
                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex justify-center">
            <ModuleLeadCta
              variant="inline"
              idPrefix="esenin-text-check-mid"
              moduleSlug="proverka-teksta-esenin"
              title="Зарегистрироваться и открыть кабинет"
              hint="Полный интерфейс модуля — сразу после регистрации, без карты на старте."
            />
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-14 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-brand-600">Как это работает</p>
          <h2 className="mt-2 text-center text-2xl font-bold text-slate-900 md:text-3xl">
            От черновика до отчёта по рискам
          </h2>
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ESENIN_TEXT_CHECK_STEPS.map((item) => (
              <li
                key={item.step}
                className="relative rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:border-brand-200 hover:shadow-md"
              >
                <span className="font-mono text-3xl font-bold text-brand-200">{item.step}</span>
                <h3 className="mt-3 text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50 py-14 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <ModulePlainSection data={ESENIN_TEXT_CHECK_PLAIN} titleId="esenin-plain-title" />
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">Лимиты по тарифам (в месяц)</h2>
          <p className="mt-2 text-slate-600">1 текст или страница = 1 лимит. Автосохранение черновика лимит не тратит.</p>
          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-semibold">Тариф</th>
                  <th className="px-4 py-3 font-semibold">Лимит</th>
                </tr>
              </thead>
              <tbody>
                {ESENIN_TEXT_CHECK_TARIFF_LIMITS.map((row) => (
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
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">Вопросы</h2>
          <dl className="mt-6 space-y-4">
            {ESENIN_TEXT_CHECK_FAQ.map((item) => (
              <div key={item.q} className="rounded-xl border border-slate-200 bg-white p-4">
                <dt className="font-semibold text-slate-900">{item.q}</dt>
                <dd className="mt-2 text-sm text-slate-600">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
