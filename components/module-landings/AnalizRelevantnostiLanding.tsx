import Link from "next/link";
import Image from "next/image";
import { ParallaxMonoScene } from "@/components/module-landings/ParallaxMonoScene";
import { HeroParallaxMedia } from "@/components/module-landings/HeroParallaxMedia";
import { RelevanceTechSection } from "@/components/module-landings/RelevanceTechSection";
import { SearchEngineLogos } from "@/components/SearchEngineLogos";
import { ModuleLeadCta } from "@/components/ModuleLeadCta";
import { ModuleVideoGallery } from "@/components/ModuleVideoGallery";
import { RelevancePlainSection } from "@/components/module-landings/RelevancePlainSection";
import { RelevanceReportSection } from "@/components/module-landings/RelevanceReportSection";
import { ModuleIcon } from "@/lib/module-icons";
import {
  RELEVANCE_ADVANTAGES,
  RELEVANCE_VIDEOS,
  RELEVANCE_FAQ,
  RELEVANCE_HERO,
  RELEVANCE_SCREENSHOTS,
  RELEVANCE_STATS,
  RELEVANCE_STEPS,
  RELEVANCE_ZONES,
} from "@/lib/content/analiz-relevantnosti-page";
import { LK_URL, SITE } from "@/lib/site";
import type { ModulePage } from "@/lib/content/modules";

type Props = { module: ModulePage };

export function AnalizRelevantnostiLanding({ module }: Props) {
  return (
    <>
      {/* Hero */}
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
                  {RELEVANCE_HERO.badge}
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-[2.75rem]">
                {RELEVANCE_HERO.title}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-brand-50/95">{RELEVANCE_HERO.lead}</p>
              <p className="mt-3 font-mono text-sm text-white/70">{RELEVANCE_HERO.sub}</p>

              <SearchEngineLogos className="mt-8" variant="hero" />

              <ul className="mt-8 flex flex-wrap gap-2">
                {module.features?.map((f) => (
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
                  idPrefix="relevance-hero"
                  title="Запустить первый анализ"
                  hint="Укажите email — перейдёте к регистрации в личном кабинете с доступом к модулю."
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
                <div className="relative min-h-[220px] w-full aspect-[16/11] sm:min-h-[280px] lg:min-h-[340px] xl:min-h-[380px]">
                  <Image
                    src={RELEVANCE_SCREENSHOTS[0].src}
                    alt={RELEVANCE_SCREENSHOTS[0].caption}
                    fill
                    className="object-contain p-1 sm:p-2"
                    sizes="(max-width: 1024px) 100vw, 560px"
                    priority
                  />
                </div>
                <figcaption className="border-t border-slate-200 bg-slate-50 px-4 py-2.5 text-center text-xs font-medium text-slate-600">
                  {RELEVANCE_SCREENSHOTS[0].caption}
                </figcaption>
              </figure>
              </HeroParallaxMedia>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
          {RELEVANCE_STATS.map((s) => (
            <div key={s.label} className="bg-white px-6 py-8 text-center">
              <div className="text-2xl font-bold text-brand-700 md:text-3xl">{s.value}</div>
              <p className="mt-2 text-sm text-slate-600">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <RelevanceTechSection />

      <div className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          {/* Steps */}
          <section>
            <p className="text-center text-sm font-semibold uppercase tracking-widest text-brand-600">
              Как это работает
            </p>
            <h2 className="mt-2 text-center text-2xl font-bold text-slate-900 md:text-3xl">
              От запроса до списка правок
            </h2>
            <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {RELEVANCE_STEPS.map((item) => (
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

          {/* 3 zones infographic */}
          <section className="mt-20">
            <h2 className="text-2xl font-bold text-slate-900">Три зоны анализа</h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              Сервис сравнивает вашу страницу с лидерами выдачи отдельно по тексту, ссылкам и мета — чтобы
              править не «вслепую», а точечно.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {RELEVANCE_ZONES.map((z, i) => (
                <div
                  key={z.zone}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className={`bg-gradient-to-r ${z.color} px-6 py-5 text-white`}>
                    <span className="text-xs font-semibold uppercase tracking-widest opacity-80">
                      Зона {i + 1}
                    </span>
                    <h3 className="mt-1 text-xl font-bold">{z.zone}</h3>
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

          <RelevanceReportSection />

          {/* Screenshots */}
          <section className="mt-20">
            <h2 className="text-2xl font-bold text-slate-900">Интерфейс модуля</h2>
            <p className="mt-2 text-slate-600">Настройка анализа и сводка по словам — как в личном кабинете.</p>
            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              {RELEVANCE_SCREENSHOTS.map((shot) => (
                <figure
                  key={shot.src}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg"
                >
                  <div className="relative aspect-[16/10] w-full bg-slate-100">
                    <Image src={shot.src} alt={shot.caption} fill className="object-contain p-2" sizes="50vw" />
                  </div>
                  <figcaption className="border-t border-slate-100 px-4 py-3 text-center text-sm text-slate-600">
                    {shot.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          <RelevancePlainSection />

          <div className="mt-12 flex justify-center">
            <SearchEngineLogos variant="light" />
          </div>

          {/* Advantages */}
          <section className="mt-20">
            <h2 className="text-2xl font-bold text-slate-900">Почему {SITE.name}</h2>
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              {RELEVANCE_ADVANTAGES.map((a) => (
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

          <section className="mt-16 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-6 md:p-10">
            <ModuleVideoGallery
              title="Видео: знакомство и практика"
              lead="Четыре урока по работе с модулем: интерфейс, страница услуги, карточка товара и категория каталога. Выберите ролик в списке."
              items={RELEVANCE_VIDEOS.map((v) => ({
                embedUrl: `https://www.youtube.com/embed/${v.id}`,
                title: v.title,
                description: v.description,
              }))}
            />
          </section>

          {/* FAQ */}
          <section className="mt-16">
            <h2 className="text-xl font-bold text-slate-900">Частые вопросы</h2>
            <dl className="mt-6 space-y-4">
              {RELEVANCE_FAQ.map((item) => (
                <div key={item.q} className="rounded-xl border border-slate-200 bg-white px-5 py-4">
                  <dt className="font-semibold text-slate-900">{item.q}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-slate-600">{item.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* CTA */}
          <section className="mt-16 grid gap-8 overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 to-brand-700 p-8 text-white md:grid-cols-2 md:p-12">
            <div>
              <h2 className="text-2xl font-bold">Готовы сравнить страницу с ТОПом?</h2>
              <p className="mt-3 text-brand-100">
                Зарегистрируйтесь в кабинете — модуль «Анализ релевантности» и остальные SEO-инструменты
                платформы в одном месте.
              </p>
            </div>
            <ModuleLeadCta
              variant="card"
              idPrefix="relevance-footer"
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
