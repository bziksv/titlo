import Link from "next/link";
import Image from "next/image";
import { ModuleContent } from "@/components/ModuleContent";
import { ModuleIcon } from "@/lib/module-icons";
import { ModuleVideos } from "@/components/ModuleVideos";
import { getModuleContent } from "@/lib/content/modules.generated";
import { getModuleVideos } from "@/lib/content/module-videos";
import { pickHeroImage, prepareModuleSections } from "@/lib/content/normalize-module-sections";
import { publicCopy } from "@/lib/public-copy";
import { LK_URL, SITE } from "@/lib/site";
import type { ModulePage } from "@/lib/content/modules";

type Props = {
  module: ModulePage;
};

function isWeakLead(lead: string, h1: string) {
  return !lead || lead === h1 || lead.includes("| Инструменты для SEO |");
}

export function ModuleLanding({ module }: Props) {
  const videos = module.videos?.length ? module.videos : getModuleVideos(module.slug);
  const scraped = getModuleContent(module.slug);
  const h1 = publicCopy(scraped?.h1 || module.h1);
  const rawLead = scraped?.lead && !isWeakLead(scraped.lead, h1) ? scraped.lead : module.lead;
  const lead = publicCopy(rawLead);
  const sections = prepareModuleSections(scraped?.sections ?? []);
  const heroImage = pickHeroImage(scraped?.sections ?? []);
  const features = module.features?.length ? module.features : [];

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-600 to-brand-700 text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-56 w-56 rounded-full bg-brand-400/25 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-12 md:py-16 lg:py-20">
          <nav className="mb-6 text-sm text-brand-100">
            <Link href="/" className="hover:text-white">
              Главная
            </Link>
            <span className="mx-2 opacity-60">/</span>
            <Link href="/services/" className="hover:text-white">
              Модули
            </Link>
          </nav>

          <div className="grid items-center gap-10 lg:grid-cols-[1fr_minmax(0,420px)] lg:gap-12">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <ModuleIcon href={module.path} className="h-12 w-12 bg-white/20 text-2xl shadow-lg" />
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-50">
                  Модуль {SITE.name}
                </span>
              </div>
              <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-[2.75rem]">
                {h1}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-brand-50/95">{lead}</p>

              {features.length > 0 && (
                <ul className="mt-8 grid gap-3 sm:grid-cols-3">
                  {features.map((f) => (
                    <li
                      key={f}
                      className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm leading-snug backdrop-blur-sm"
                    >
                      <span className="mr-1.5 font-bold text-brand-100">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={`${LK_URL}/register`}
                  className="rounded-xl bg-white px-7 py-3.5 font-semibold text-brand-700 shadow-lg shadow-brand-900/25 transition hover:bg-brand-50"
                >
                  Попробовать в кабинете
                </a>
                <Link
                  href="/tarify/"
                  className="rounded-xl border-2 border-white/35 px-7 py-3.5 font-semibold transition hover:bg-white/10"
                >
                  Тарифы
                </Link>
              </div>
            </div>

            {heroImage && (
              <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                <div className="absolute -inset-3 rounded-3xl bg-white/20 blur-xl" aria-hidden />
                <figure className="relative overflow-hidden rounded-2xl border border-white/25 bg-white/10 shadow-2xl ring-1 ring-white/30">
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={heroImage}
                      alt=""
                      fill
                      className="object-contain p-4"
                      sizes="(max-width: 1024px) 90vw, 420px"
                      priority
                    />
                  </div>
                </figure>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          {sections.length > 0 ? (
            <ModuleContent sections={sections} />
          ) : (
            features.length > 0 && (
              <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">Возможности</h2>
                <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                  {features.map((f) => (
                    <li
                      key={f}
                      className="flex gap-3 rounded-xl border border-brand-100 bg-brand-50/50 px-4 py-3 text-slate-700"
                    >
                      <span className="font-bold text-brand-600">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </section>
            )
          )}

          {videos.length > 0 && (
            <div className="mt-16 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-10">
              <ModuleVideos videos={videos} />
            </div>
          )}

          <section className="mt-16 overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 to-brand-700 p-8 text-center text-white shadow-lg md:p-12">
            <h2 className="text-2xl font-bold">Готовы попробовать «{module.title}»?</h2>
            <p className="mx-auto mt-3 max-w-lg text-brand-100">
              Регистрация в личном кабинете — доступ к модулю и остальным инструментам платформы.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href={`${LK_URL}/register`}
                className="rounded-xl bg-white px-8 py-3 font-semibold text-brand-700 hover:bg-brand-50"
              >
                Зарегистрироваться
              </a>
              <a
                href={`${LK_URL}/login`}
                className="rounded-xl border border-white/40 px-8 py-3 font-semibold hover:bg-white/10"
              >
                Войти
              </a>
            </div>
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
