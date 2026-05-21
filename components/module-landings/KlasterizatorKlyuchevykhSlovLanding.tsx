import Link from "next/link";
import Image from "next/image";
import { ParallaxMonoScene } from "@/components/module-landings/ParallaxMonoScene";
import { HeroParallaxMedia } from "@/components/module-landings/HeroParallaxMedia";
import { ModuleTechSection } from "@/components/module-landings/ModuleTechSection";
import { ModuleInsightsSection } from "@/components/module-landings/ModuleInsightsSection";
import { ModulePlainSection } from "@/components/module-landings/ModulePlainSection";
import { ModuleLeadCta } from "@/components/ModuleLeadCta";
import { ModuleVideoGallery } from "@/components/ModuleVideoGallery";
import { ModuleIcon } from "@/lib/module-icons";
import {
  CLUSTER_ADVANTAGES,
  CLUSTER_FAQ,
  CLUSTER_FEATURES,
  CLUSTER_HERO,
  CLUSTER_INSIGHTS,
  CLUSTER_INSIGHTS_GRID,
  CLUSTER_INSIGHTS_HIGHLIGHT,
  CLUSTER_INSIGHTS_OUTCOMES,
  CLUSTER_OPTIONS,
  CLUSTER_PLAIN,
  CLUSTER_SCREENSHOTS,
  CLUSTER_SLICES,
  CLUSTER_STATS,
  CLUSTER_STEPS,
  CLUSTER_CHECKS,
  CLUSTER_TECH_LAYERS,
  CLUSTER_TECH_SECTION,
  CLUSTER_VIDEOS,
} from "@/lib/content/klasterizator-klyuchevykh-slov-page";
import { LK_URL, SITE } from "@/lib/site";
import type { ModulePage } from "@/lib/content/modules";

type Props = { module: ModulePage };

export function KlasterizatorKlyuchevykhSlovLanding({ module }: Props) {
  const featurePills = module.features?.length ? module.features : CLUSTER_FEATURES;

  return (
    <>
      <section className="relative overflow-x-clip bg-brand-800 text-white">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand-800 via-brand-800 to-brand-700/70"
          aria-hidden
        />
        <ParallaxMonoScene align="right" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-12 md:py-16 lg:py-20">
          <nav className="mb-6 text-sm text-brand-100">
            <Link href="/" className="hover:text-white">
              Главная
            </Link>
            <span className="mx-2 opacity-60">/</span>
            <Link href="/services/" className="hover:text-white">
              Модули
            </Link>
          </nav>

          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <ModuleIcon href={module.path} className="h-12 w-12 bg-white/15 text-2xl" />
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-50">
                  {CLUSTER_HERO.badge}
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-[2.75rem]">
                {CLUSTER_HERO.title}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-brand-50/95">{CLUSTER_HERO.lead}</p>
              <p className="mt-3 font-mono text-sm text-white/70">{CLUSTER_HERO.sub}</p>

              <ul className="mt-8 flex flex-wrap gap-2">
                {featurePills.map((f) => (
                  <li
                    key={f}
                    className="rounded-full border border-white/20 bg-brand-800/80 px-3 py-1.5 text-sm"
                  >
                    ✓ {f}
                  </li>
                ))}
              </ul>

              <div className="mt-10">
                <ModuleLeadCta
                  variant="hero"
                  idPrefix="cluster-hero"
                  title="Добавить семантику"
                  hint="Укажите email — откроется регистрация в личном кабинете с доступом к модулю."
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
                  href={`${LK_URL}/login`}
                  className="rounded-xl px-6 py-3 text-sm font-semibold text-brand-100 underline-offset-2 hover:text-white hover:underline"
                >
                  Уже есть кабинет →
                </a>
              </div>
            </div>

            <div className="relative w-full lg:max-w-none">
              <HeroParallaxMedia>
                <figure className="relative overflow-hidden rounded-2xl border border-white/20 bg-white shadow-xl shadow-black/25">
                  <div className="relative aspect-[16/11] min-h-[220px] w-full sm:min-h-[280px] lg:min-h-[340px] xl:min-h-[380px]">
                    <Image
                      src={CLUSTER_SCREENSHOTS[0].src}
                      alt={CLUSTER_SCREENSHOTS[0].caption}
                      fill
                      className="object-contain p-1 sm:p-2"
                      sizes="(max-width: 1024px) 100vw, 560px"
                      priority
                    />
                  </div>
                  <figcaption className="border-t border-slate-200 bg-slate-50 px-4 py-2.5 text-center text-xs font-medium text-slate-600">
                    {CLUSTER_SCREENSHOTS[0].caption}
                  </figcaption>
                </figure>
              </HeroParallaxMedia>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
          {CLUSTER_STATS.map((s) => (
            <div key={s.label} className="bg-white px-6 py-8 text-center">
              <div className="text-2xl font-bold text-brand-700 md:text-3xl">{s.value}</div>
              <p className="mt-2 text-sm text-slate-600">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <ModuleTechSection
        section={CLUSTER_TECH_SECTION}
        layers={CLUSTER_TECH_LAYERS}
        titleId="cluster-tech-title"
      />

      <div className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <section>
            <p className="text-center text-sm font-semibold uppercase tracking-widest text-brand-600">
              Как это работает
            </p>
            <h2 className="mt-2 text-center text-2xl font-bold text-slate-900 md:text-3xl">
              От вставки ключевых фраз до отчёта
            </h2>
            <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {CLUSTER_STEPS.map((item) => (
                <li
                  key={item.step}
                  className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-brand-200 hover:shadow-md"
                >
                  <span className="font-mono text-3xl font-bold text-brand-200">{item.step}</span>
                  <h3 className="mt-3 text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-20">
            <h2 className="text-2xl font-bold text-slate-900">Где пригодится</h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              SEO, агентства и интернет-магазины — один инструмент для семантики.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {CLUSTER_SLICES.map((z, i) => (
                <div
                  key={z.mode}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className={`bg-gradient-to-r ${z.color} px-6 py-5 text-white`}>
                    <span className="text-xs font-semibold uppercase tracking-widest opacity-80">
                      Сценарий {i + 1}
                    </span>
                    <h3 className="mt-1 text-xl font-bold">{z.mode}</h3>
                  </div>
                  <ul className="space-y-3 px-6 py-5">
                    {z.items.map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-slate-700">
                        <span className="font-bold text-brand-600">→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <ModuleInsightsSection
            meta={CLUSTER_INSIGHTS}
            grid={CLUSTER_INSIGHTS_GRID}
            highlight={CLUSTER_INSIGHTS_HIGHLIGHT}
            outcomes={CLUSTER_INSIGHTS_OUTCOMES}
            titleId="cluster-insights-title"
          />

          <section className="mt-20">
            <h2 className="text-2xl font-bold text-slate-900">Интерфейс модуля</h2>
            <p className="mt-2 text-slate-600">Ввод фраз, кластеры и экспорт — как в личном кабинете.</p>
            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              {CLUSTER_SCREENSHOTS.map((shot) => (
                <figure
                  key={shot.src}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg"
                >
                  <div className="relative aspect-[16/10] min-h-[200px] w-full bg-slate-50 sm:min-h-[240px]">
                    <Image
                      src={shot.src}
                      alt={shot.caption}
                      fill
                      className="object-contain object-center p-3"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                  <figcaption className="border-t border-slate-100 px-4 py-3 text-center text-sm text-slate-600">
                    {shot.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section className="mt-20 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-bold text-slate-900">Что проверяет сервис</h2>
            <p className="mt-2 text-sm text-slate-600">При кластеризации списка ключевых запросов.</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {CLUSTER_CHECKS.map((line) => (
                <li key={line} className="flex gap-2 text-sm text-slate-700">
                  <span className="font-bold text-brand-600">✓</span>
                  {line}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-bold text-slate-900">Кратко о возможностях</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {CLUSTER_OPTIONS.map((line) => (
                <li key={line} className="flex gap-2 text-sm text-slate-700">
                  <span className="font-bold text-brand-600">→</span>
                  {line}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-12 rounded-2xl border border-brand-100 bg-brand-50/50 p-6 md:p-8">
            <h2 className="text-lg font-bold text-slate-900">Связанные модули</h2>
            <p className="mt-2 text-sm text-slate-600">Семантика и контент — в одной платформе.</p>
            <ul className="mt-4 flex flex-wrap gap-3">
              <li>
                <Link
                  href="/analiz-relevantnosti/"
                  className="rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50"
                >
                  Анализ релевантности →
                </Link>
              </li>
              <li>
                <Link
                  href="/sravnenie-spiskov-klyuchevykh-fraz/"
                  className="rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50"
                >
                  Сравнение списков →
                </Link>
              </li>
              <li>
                <Link
                  href="/generator_slov/"
                  className="rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50"
                >
                  Генератор слов →
                </Link>
              </li>
            </ul>
          </section>

          <ModulePlainSection data={CLUSTER_PLAIN} titleId="cluster-plain-title" />

          <section className="mt-16 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-6 md:p-10">
            <ModuleVideoGallery
              title="Видео: кластеризатор"
              lead="Как запустить кластеризацию и работать с таблицей кластеров."
              items={CLUSTER_VIDEOS.map((v) => ({
                embedUrl: `https://www.youtube.com/embed/${v.id}`,
                title: v.title,
                description: v.description,
              }))}
            />
          </section>

          <section className="mt-20">
            <h2 className="text-2xl font-bold text-slate-900">Почему {SITE.name}</h2>
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              {CLUSTER_ADVANTAGES.map((a) => (
                <div key={a.title} className="text-center">
                  <div className="relative mx-auto h-28 w-28">
                    <Image src={a.src} alt="" fill className="object-contain" sizes="112px" />
                  </div>
                  <h3 className="mt-4 font-bold text-slate-900">{a.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{a.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <h2 className="text-xl font-bold text-slate-900">Частые вопросы</h2>
            <dl className="mt-6 space-y-4">
              {CLUSTER_FAQ.map((item) => (
                <div key={item.q} className="rounded-xl border border-slate-200 bg-white px-5 py-4">
                  <dt className="font-semibold text-slate-900">{item.q}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-slate-600">{item.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-16 grid gap-8 overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 to-brand-700 p-8 text-white md:grid-cols-2 md:p-12">
            <div>
              <h2 className="text-2xl font-bold">Нужно собрать семантическое ядро?</h2>
              <p className="mt-3 text-brand-100">
                Зарегистрируйтесь в кабинете — модуль и остальные инструменты платформы в одном месте.
              </p>
            </div>
            <ModuleLeadCta
              variant="card"
              idPrefix="cluster-footer"
              title="Начать бесплатно"
              hint="Укажите email — откроется страница регистрации в личном кабинете."
            />
          </section>

          <nav className="mt-12 text-center">
            <Link href="/services/" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
              ← Все модули сервиса
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
