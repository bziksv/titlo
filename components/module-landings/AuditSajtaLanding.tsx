import Link from "next/link";
import { ModuleLeadCta } from "@/components/ModuleLeadCta";
import { ModuleIcon } from "@/lib/module-icons";
import {
  SITE_AUDIT_FAQ,
  SITE_AUDIT_FEATURES,
  SITE_AUDIT_HERO,
  SITE_AUDIT_STATS,
  SITE_AUDIT_TARIFF_LIMITS,
} from "@/lib/content/audit-sajta-page";
import { LK_URL } from "@/lib/site";
import type { ModulePage } from "@/lib/content/modules";

type Props = { module: ModulePage };

export function AuditSajtaLanding({ module }: Props) {
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
              {SITE_AUDIT_HERO.badge}
            </span>
          </div>

          <h1 className="mt-5 max-w-4xl text-3xl font-bold leading-tight md:text-4xl">{SITE_AUDIT_HERO.title}</h1>
          <p className="mt-4 max-w-3xl text-lg text-brand-50/95">{SITE_AUDIT_HERO.lead}</p>
          <p className="mt-2 font-mono text-sm text-white/70">{SITE_AUDIT_HERO.sub}</p>

          <ul className="mt-8 flex flex-wrap gap-2">
            {module.features?.map((f) => (
              <li key={f} className="rounded-full border border-white/20 bg-brand-800/80 px-3 py-1.5 text-sm">
                ✓ {f}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <ModuleLeadCta
              variant="hero"
              idPrefix="site-audit-hero"
              moduleSlug="audit-sajta"
              title="Запустить аудит в кабинете"
              hint="Регистрация — краул домена, tech+SEO отчёты, шаринг клиенту, расписание и экспорт."
            />
            <a
              href={`${LK_URL}/demo-cabinet`}
              className="inline-flex items-center rounded-xl border-2 border-white/35 px-6 py-3.5 font-semibold transition hover:bg-white/10"
            >
              Демо-кабинет
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-10">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {SITE_AUDIT_STATS.map((s) => (
            <div key={s.label} className="rounded-xl border border-slate-200 p-4 text-center">
              <p className="text-2xl font-bold text-brand-700">{s.value}</p>
              <p className="mt-1 text-sm text-slate-600">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">Что проверяем</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {SITE_AUDIT_FEATURES.map((f) => (
              <div key={f.title} className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="text-lg font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">Лимиты по тарифам</h2>
          <p className="mt-2 text-slate-600">Страниц за краул и число запусков аудита в месяц.</p>
          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-semibold">Тариф</th>
                  <th className="px-4 py-3 font-semibold">Страниц / краул</th>
                  <th className="px-4 py-3 font-semibold">Краулов / мес</th>
                </tr>
              </thead>
              <tbody>
                {SITE_AUDIT_TARIFF_LIMITS.map((row) => (
                  <tr key={row.name} className="border-t border-slate-100">
                    <td className="px-4 py-3">{row.name}</td>
                    <td className="px-4 py-3">{row.pages}</td>
                    <td className="px-4 py-3">{row.crawls}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4">
            <Link href="/tarify/" className="font-semibold text-brand-700 hover:underline">
              Сравнить тарифы →
            </Link>
          </p>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">Частые вопросы</h2>
          <dl className="mt-8 space-y-6">
            {SITE_AUDIT_FAQ.map((item) => (
              <div key={item.q}>
                <dt className="font-semibold text-slate-900">{item.q}</dt>
                <dd className="mt-2 text-slate-600">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Готовы просканировать сайт?</h2>
          <p className="mt-3 text-slate-600">Запустите краул в кабинете или откройте демо без регистрации.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={`${LK_URL}/register`}
              className="rounded-xl bg-brand-700 px-7 py-3.5 font-semibold text-white shadow-lg transition hover:bg-brand-800"
            >
              Регистрация
            </a>
            <a
              href={`${LK_URL}/demo-cabinet`}
              className="rounded-xl border-2 border-brand-200 px-7 py-3.5 font-semibold text-brand-800 transition hover:bg-brand-50"
            >
              Демо
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
