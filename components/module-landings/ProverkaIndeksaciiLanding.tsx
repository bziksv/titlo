import Link from "next/link";
import { IndexCheckDemoWidget } from "@/components/demo/IndexCheckDemoWidget";
import { ModuleLeadCta } from "@/components/ModuleLeadCta";
import { ModuleIcon } from "@/lib/module-icons";
import {
  INDEX_CHECK_FAQ,
  INDEX_CHECK_HERO,
  INDEX_CHECK_STATS,
  INDEX_CHECK_TARIFF_LIMITS,
} from "@/lib/content/proverka-indeksacii-page";
import type { ModulePage } from "@/lib/content/modules";

type Props = { module: ModulePage };

export function ProverkaIndeksaciiLanding({ module }: Props) {
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
              {INDEX_CHECK_HERO.badge}
            </span>
          </div>

          <h1 className="mt-5 max-w-4xl text-3xl font-bold leading-tight md:text-4xl">{INDEX_CHECK_HERO.title}</h1>
          <p className="mt-4 max-w-3xl text-lg text-brand-50/95">{INDEX_CHECK_HERO.lead}</p>
          <p className="mt-2 font-mono text-sm text-white/70">{INDEX_CHECK_HERO.sub}</p>

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
              idPrefix="index-check-hero"
              moduleSlug="proverka-indeksacii"
              title="Проверить индексацию и сниппеты в кабинете"
              hint="Регистрация — пакет до 500 URL, сохранение title/сниппета, Яндекс и Google, CSV и лимиты по тарифу."
            />
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-10">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {INDEX_CHECK_STATS.map((s) => (
            <div key={s.label} className="rounded-xl border border-slate-200 p-4 text-center">
              <p className="text-2xl font-bold text-brand-700">{s.value}</p>
              <p className="mt-1 text-sm text-slate-600">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">Попробуйте на одном URL</h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Демо без регистрации. В кабинете — список до 500 URL, сниппеты из выдачи, выбор ПС и выгрузка CSV.
          </p>
          <div className="mt-8">
            <IndexCheckDemoWidget />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">Лимиты по тарифам (в месяц)</h2>
          <p className="mt-2 text-slate-600">
            Проверки: 1 URL × 1 ПС = 1. Сохранения: сколько результатов с title и сниппетом хранится в истории.
          </p>
          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-semibold">Тариф</th>
                  <th className="px-4 py-3 font-semibold">Проверки / сохранения</th>
                </tr>
              </thead>
              <tbody>
                {INDEX_CHECK_TARIFF_LIMITS.map((row) => (
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
            {INDEX_CHECK_FAQ.map((item) => (
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
