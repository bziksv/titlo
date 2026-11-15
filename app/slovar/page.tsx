import type { Metadata } from "next";
import Link from "next/link";
import { GlossaryHubJsonLd } from "@/components/glossary/GlossaryJsonLd";
import {
  findPublishedTermPath,
  getGlossaryCategory,
  GLOSSARY_CATEGORIES,
  GLOSSARY_NAME,
  GLOSSARY_PATH,
  GLOSSARY_PLANNED_TOTAL,
  GLOSSARY_TERMS,
  glossaryTermPath,
} from "@/lib/content/glossary";
import { canonicalMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  title: "SEO-словарь: термины поискового продвижения простыми словами",
  description:
    "Словарь SEO-терминов от Титло: семантическое ядро, кластеризация, интент, индексация, ссылки и алгоритмы Яндекса и Google — коротко, понятно и с примерами.",
  ...canonicalMetadata(GLOSSARY_PATH, { image: `${GLOSSARY_PATH}opengraph-image/`, imageAlt: GLOSSARY_NAME }),
};

function termsWord(n: number) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "термин";
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "термина";
  return "терминов";
}

export default function GlossaryHubPage() {
  const published = GLOSSARY_TERMS.length;
  return (
    <>
      <GlossaryHubJsonLd />
      <section className="border-b border-slate-200 bg-gradient-to-br from-white via-brand-50/30 to-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <nav className="mb-6 text-sm text-slate-500" aria-label="Хлебные крошки">
            <Link href="/" className="hover:text-brand-700">
              Главная
            </Link>
            <span className="mx-2 opacity-60" aria-hidden>
              /
            </span>
            <span aria-current="page" className="text-slate-700">
              {GLOSSARY_NAME}
            </span>
          </nav>
          <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
            Справочник Титло
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">{GLOSSARY_NAME}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600 md:text-xl">
            Понятные определения терминов поискового продвижения — для SEO-специалистов и тех, кто только начинает
            разбираться. С примерами на реальных данных и ссылками на модули Титло, где термин можно сразу применить.
          </p>
          <dl className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-brand-100 bg-white/80 px-4 py-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Опубликовано</dt>
              <dd className="mt-1 text-lg font-bold text-slate-900">
                {published} {termsWord(published)}
              </dd>
            </div>
            <div className="rounded-xl border border-brand-100 bg-white/80 px-4 py-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Разделы</dt>
              <dd className="mt-1 text-lg font-bold text-slate-900">{GLOSSARY_CATEGORIES.length} категорий</dd>
            </div>
            <div className="rounded-xl border border-brand-100 bg-white/80 px-4 py-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">В плане словаря</dt>
              <dd className="mt-1 text-lg font-bold text-slate-900">
                {GLOSSARY_PLANNED_TOTAL} {termsWord(GLOSSARY_PLANNED_TOTAL)}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <nav aria-label="Категории словаря">
          <ul className="flex flex-wrap gap-2">
            {GLOSSARY_CATEGORIES.map((c) => (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  data-category={c.id}
                  className="inline-flex rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                >
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <section className="mt-10" aria-labelledby="published-terms">
          <h2 id="published-terms" className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
            Опубликованные термины
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GLOSSARY_TERMS.map((t) => (
              <article
                key={t.slug}
                className="group relative flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-sm font-bold text-brand-700">
                    {t.term.charAt(0)}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                    {getGlossaryCategory(t.categoryId)?.label}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900 group-hover:text-brand-700">
                  <Link href={glossaryTermPath(t.slug)} className="after:absolute after:inset-0">
                    {t.term}
                  </Link>
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{t.short}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
                  Читать определение <span aria-hidden>→</span>
                </span>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14" aria-labelledby="categories">
          <h2 id="categories" className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
            Разделы словаря
          </h2>
          <p className="mt-2 max-w-3xl text-slate-600">
            Словарь пополняется. Ниже — разделы и термины, которые мы готовим в первую очередь; ссылкой отмечены уже
            опубликованные.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {GLOSSARY_CATEGORIES.map((c) => (
              <section key={c.id} id={c.id} className="scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-semibold text-slate-900">{c.label}</h3>
                  <span className="shrink-0 text-xs text-slate-500">
                    в плане: {c.plannedCount}
                  </span>
                </div>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {c.upcoming.map((name) => {
                    const href = findPublishedTermPath(name);
                    return (
                      <li key={name}>
                        {href ? (
                          <Link
                            href={href}
                            className="inline-flex rounded-lg border border-brand-200 bg-brand-50 px-2.5 py-1 text-sm font-semibold text-brand-700 hover:bg-brand-100"
                          >
                            {name}
                          </Link>
                        ) : (
                          <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-sm text-slate-500">{name}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </section>

        <section className="mt-16 overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 to-brand-700 p-8 text-center text-white shadow-lg md:p-12">
          <h2 className="text-2xl font-bold">Разобрали термин — проверьте на своём сайте</h2>
          <p className="mx-auto mt-3 max-w-lg text-brand-100">
            Словарь объясняет понятия, а модули Титло помогают сразу их применить: собрать ядро, оценить текст, снять позиции.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/klasterizator-klyuchevykh-slov/" className="rounded-xl bg-white px-6 py-3 font-semibold text-brand-700 hover:bg-brand-50">
              Кластеризатор
            </Link>
            <Link href="/analiz-relevantnosti/" className="rounded-xl border border-white/40 px-6 py-3 font-semibold hover:bg-white/10">
              Анализ релевантности
            </Link>
            <Link href="/monitoring-pozicii-sayta/" className="rounded-xl border border-white/40 px-6 py-3 font-semibold hover:bg-white/10">
              Позиции сайта
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
