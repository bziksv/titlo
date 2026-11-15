import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GlossaryBlocks } from "@/components/glossary/GlossaryBlocks";
import { GlossaryFaq } from "@/components/glossary/GlossaryFaq";
import { GlossaryTermJsonLd } from "@/components/glossary/GlossaryJsonLd";
import {
  findPublishedTermPath,
  getGlossaryCategory,
  getGlossaryTerm,
  GLOSSARY_NAME,
  GLOSSARY_PATH,
  GLOSSARY_TERMS,
  glossaryTermPath,
} from "@/lib/content/glossary";
import { canonicalMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return GLOSSARY_TERMS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const term = getGlossaryTerm(slug);
  if (!term) return {};
  const path = glossaryTermPath(term.slug);
  return {
    title: term.seoTitle,
    description: term.seoDescription,
    ...canonicalMetadata(path, { image: `${path}opengraph-image/`, imageAlt: term.h1 }),
  };
}

const sectionCard = "scroll-mt-24 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm md:p-10";
const h2Class = "text-xl font-bold tracking-tight text-slate-900 md:text-2xl";

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

export default async function GlossaryTermPage({ params }: Props) {
  const { slug } = await params;
  const term = getGlossaryTerm(slug);
  if (!term) notFound();
  const category = getGlossaryCategory(term.categoryId);

  const toc = [
    ...term.sections.map((s) => ({ id: s.id, label: s.tocLabel ?? s.title })),
    { id: term.modules.id, label: "Сервисы" },
    { id: "svyazannye", label: "Связанные термины" },
    ...(term.faq.length ? [{ id: "faq", label: "Частые вопросы" }] : []),
  ];

  const tocList = (linkClass: string) => (
    <ol className="mt-3 space-y-1.5 text-sm">
      {toc.map((t) => (
        <li key={t.id}>
          <a className={linkClass} href={`#${t.id}`}>
            {t.label}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      <GlossaryTermJsonLd term={term} />
      <div className="border-b border-slate-200 bg-gradient-to-br from-white via-brand-50/30 to-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
          <nav className="text-sm text-slate-500" aria-label="Хлебные крошки">
            <Link href="/" className="hover:text-brand-700">
              Главная
            </Link>
            <span className="mx-2 opacity-60" aria-hidden>
              /
            </span>
            <Link href={GLOSSARY_PATH} className="hover:text-brand-700">
              {GLOSSARY_NAME}
            </Link>
            <span className="mx-2 opacity-60" aria-hidden>
              /
            </span>
            <span aria-current="page" className="text-slate-700">
              {term.term}
            </span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_16.5rem]">
          <article className="min-w-0" data-glossary-term={term.slug}>
            <div className="flex flex-wrap items-center gap-2">
              {category ? (
                <Link
                  href={`${GLOSSARY_PATH}#${category.id}`}
                  className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700 hover:bg-brand-100"
                >
                  {category.label}
                </Link>
              ) : null}
              {term.aliases.length ? (
                <span className="text-sm text-slate-500">Синонимы: {term.aliases.join(", ")}</span>
              ) : null}
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">{term.h1}</h1>
            <p className="mt-3 text-sm text-slate-500">
              Обновлено <time dateTime={term.dateModified}>{formatDate(term.dateModified)}</time>
            </p>

            <div className="mt-6 rounded-2xl border border-brand-200 bg-brand-50/60 p-6 shadow-sm md:p-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Коротко</p>
              <p className="mt-3 text-[1.05rem] leading-relaxed text-slate-800">{term.definition}</p>
            </div>

            <nav aria-label="Содержание" className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 lg:hidden">
              <p className="font-semibold text-slate-900">На этой странице</p>
              {tocList("text-brand-600 hover:text-brand-700")}
            </nav>

            {term.sections.map((s, i) => (
              <section key={s.id} id={s.id} className={`${i === 0 ? "mt-10" : "mt-8"} ${sectionCard}`}>
                <h2 className={h2Class}>{s.title}</h2>
                {s.blocks ? (
                  <div className="mt-6">
                    <GlossaryBlocks blocks={s.blocks} />
                  </div>
                ) : null}
                {s.subsections?.map((sub) => (
                  <div key={sub.title} className="mt-8 first:mt-6">
                    <h3 className="text-lg font-semibold text-slate-900">{sub.title}</h3>
                    <div className="mt-3">
                      <GlossaryBlocks blocks={sub.blocks} />
                    </div>
                  </div>
                ))}
              </section>
            ))}

            <section id={term.modules.id} className={`mt-8 ${sectionCard}`}>
              <h2 className={h2Class}>{term.modules.title}</h2>
              <p className="mt-6 text-base leading-relaxed text-slate-600 md:text-[1.0625rem]">{term.modules.intro}</p>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {term.modules.items.map((m) => (
                  <Link
                    key={m.slug}
                    href={`/${m.slug}/`}
                    className="group flex flex-col rounded-2xl border border-slate-200/80 bg-slate-50 p-5 transition hover:border-brand-200 hover:bg-white hover:shadow-md"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">Сервис</span>
                    <span className="mt-2 text-lg font-semibold text-slate-900 group-hover:text-brand-700">{m.title}</span>
                    <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{m.text}</span>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
                      Открыть <span aria-hidden>→</span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            <section id="svyazannye" className="mt-8 scroll-mt-24">
              <h2 className={h2Class}>Связанные термины</h2>
              <p className="mt-2 text-sm text-slate-500">Термины без ссылки ещё в работе — ссылки появятся после публикации.</p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {term.related.map((name) => {
                  const href = findPublishedTermPath(name);
                  const cls =
                    "flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold";
                  return (
                    <li key={name}>
                      {href ? (
                        <Link href={href} className={`${cls} text-slate-800 transition hover:border-brand-200 hover:text-brand-700`}>
                          {name}
                          <span className="text-brand-600" aria-hidden>
                            →
                          </span>
                        </Link>
                      ) : (
                        <span className={`${cls} text-slate-700`}>{name}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>

            {term.faq.length ? (
              <section id="faq" className="mt-10 scroll-mt-24">
                <h2 className={h2Class}>Частые вопросы</h2>
                <div className="mt-6">
                  <GlossaryFaq items={term.faq} />
                </div>
              </section>
            ) : null}

            <p className="mt-8 text-sm leading-relaxed text-slate-500">{term.sources}</p>
          </article>

          <aside className="hidden lg:sticky lg:top-24 lg:block">
            <nav aria-label="Содержание" className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">На этой странице</p>
              {tocList("text-slate-700 hover:text-brand-700")}
            </nav>
            <Link href={GLOSSARY_PATH} className="mt-4 block text-sm font-semibold text-brand-600 hover:text-brand-700">
              ← Ко всем терминам
            </Link>
          </aside>
        </div>
      </div>
    </>
  );
}
