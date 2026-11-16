import type { Metadata } from "next";
import type { GlossaryBlock } from "@/lib/content/glossary";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GlossaryBlocks } from "@/components/glossary/GlossaryBlocks";
import { GlossaryFaq } from "@/components/glossary/GlossaryFaq";
import { GlossaryTermJsonLd } from "@/components/glossary/GlossaryJsonLd";
import { GlossaryTocMobile, GlossaryTocSidebar } from "@/components/glossary/GlossaryToc";
import { RichText } from "@/components/glossary/RichText";
import {
  findPublishedTermPath,
  getGlossaryCategory,
  getGlossaryTerm,
  GLOSSARY_NAME,
  GLOSSARY_PATH,
  GLOSSARY_TERMS,
  glossaryBlocksWordCount,
  glossaryReadingMinutes,
  glossaryTermPath,
} from "@/lib/content/glossary";
import { canonicalMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

const GRID_WIDE_CARD_WORDS = 70;

/**
 * Which cards of a two-column grid should span both columns on md+.
 * Long cards always span; a short card that would otherwise sit alone in its
 * row (before a wide card or at the end of an odd run) also spans, so the grid
 * never leaves an empty half-row.
 */
function gridCardSpans(blocksList: GlossaryBlock[][]): boolean[] {
  const wide = blocksList.map((b) => glossaryBlocksWordCount(b) > GRID_WIDE_CARD_WORDS);
  const spans: boolean[] = [];
  let col = 0;
  for (let i = 0; i < wide.length; i++) {
    if (wide[i]) {
      spans.push(true);
      col = 0;
    } else if (col === 0 && (i + 1 >= wide.length || wide[i + 1])) {
      spans.push(true);
    } else {
      spans.push(false);
      col = col === 0 ? 1 : 0;
    }
  }
  return spans;
}

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
const h2Class = "flex items-start gap-3 text-xl font-bold tracking-tight text-slate-900 md:text-2xl";

/** H2 с маленьким номером раздела (тот же номер, что в оглавлении). */
function SectionHeading({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <h2 className={h2Class}>
      <span
        aria-hidden
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-sm font-bold tabular-nums text-brand-700 ring-1 ring-brand-200 md:mt-1"
      >
        {n}
      </span>
      <span className="min-w-0">{children}</span>
    </h2>
  );
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

export default async function GlossaryTermPage({ params }: Props) {
  const { slug } = await params;
  const term = getGlossaryTerm(slug);
  if (!term) notFound();
  const category = getGlossaryCategory(term.categoryId);
  const readingMinutes = glossaryReadingMinutes(term);

  const toc = [
    ...term.sections.map((s) => ({ id: s.id, label: s.tocLabel ?? s.title })),
    { id: term.modules.id, label: "Сервисы" },
    { id: "svyazannye", label: "Связанные термины" },
    ...(term.faq.length ? [{ id: "faq", label: "Частые вопросы" }] : []),
  ];
  const gridSpans = new Map(
    term.sections
      .filter((s) => s.layout === "grid" && s.subsections)
      .map((s) => [s.id, gridCardSpans((s.subsections ?? []).map((sub) => sub.blocks))] as const),
  );

  const num = (id: string) => toc.findIndex((t) => t.id === id) + 1;

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
              <span className="mx-2 opacity-60" aria-hidden>
                ·
              </span>
              Время чтения: {readingMinutes} мин
            </p>

            <div className="relative mt-6 overflow-hidden rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-6 shadow-sm md:p-8">
              <span className="absolute inset-y-0 left-0 w-1.5 bg-brand-600" aria-hidden />
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-700">
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
                  <path d="M4 3.5A1.5 1.5 0 0 1 5.5 2h6.4c.4 0 .8.2 1.1.4l2.6 2.6c.3.3.4.7.4 1.1v10.4a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 4 16.5v-13ZM7 9a.75.75 0 0 0 0 1.5h6A.75.75 0 0 0 13 9H7Zm0 3a.75.75 0 0 0 0 1.5h4a.75.75 0 0 0 0-1.5H7Z" />
                </svg>
                Коротко
              </p>
              <p className="mt-3 max-w-[70ch] text-[1.05rem] leading-relaxed text-slate-800 md:text-lg">{term.definition}</p>
            </div>

            <div className="mt-6">
              <GlossaryTocMobile items={toc} />
            </div>

            {term.sections.map((s, i) => (
              <section key={s.id} id={s.id} className={`${i === 0 ? "mt-10" : "mt-8"} ${sectionCard}`}>
                <SectionHeading n={num(s.id)}>{s.title}</SectionHeading>
                {s.blocks ? (
                  <div className="mt-6">
                    <GlossaryBlocks blocks={s.blocks} />
                  </div>
                ) : null}
                {s.subsections ? (
                  <div className={s.layout === "grid" ? "mt-6 grid gap-4 md:grid-cols-2" : s.layout === "stack" ? "mt-6 space-y-4" : "mt-2"}>
                    {s.subsections.map((sub, si) =>
                      s.layout === "grid" || s.layout === "stack" ? (
                        <div
                          key={sub.title}
                          className={`min-w-0 rounded-xl border border-slate-200 bg-slate-50/50 p-5 md:p-6 ${
                            s.layout === "grid" && gridSpans.get(s.id)?.[si] ? "md:col-span-2" : ""
                          }`}
                        >
                          <h3 className="text-lg font-semibold text-slate-900">{sub.title}</h3>
                          <div className="mt-3">
                            <GlossaryBlocks blocks={sub.blocks} />
                          </div>
                        </div>
                      ) : (
                        <div key={sub.title} className="mt-6 border-t border-slate-100 pt-6 first:border-t-0 first:pt-0">
                          <h3 className="text-lg font-semibold text-slate-900">{sub.title}</h3>
                          <div className="mt-3">
                            <GlossaryBlocks blocks={sub.blocks} />
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                ) : null}
              </section>
            ))}

            {term.takeaways?.length ? (
              <section aria-labelledby="glavnoe" className="mt-8 rounded-2xl border border-brand-200 bg-brand-600 p-6 text-white shadow-sm md:p-8">
                <h2 id="glavnoe" className="text-lg font-bold md:text-xl">
                  Главное
                </h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {term.takeaways.map((t) => (
                    <li key={t} className="flex gap-3 rounded-xl bg-white/10 p-4 leading-relaxed text-brand-50">
                      <svg viewBox="0 0 16 16" className="mt-1 h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M3.5 8.5l3 3 6-7" />
                      </svg>
                      <span>
                        <RichText text={t} />
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section id={term.modules.id} className={`mt-8 ${sectionCard}`}>
              <SectionHeading n={num(term.modules.id)}>{term.modules.title}</SectionHeading>
              <p className="mt-6 max-w-[70ch] text-base leading-relaxed text-slate-600 md:text-[1.0625rem]">{term.modules.intro}</p>
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
              <SectionHeading n={num("svyazannye")}>Связанные термины</SectionHeading>
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
                <SectionHeading n={num("faq")}>Частые вопросы</SectionHeading>
                <div className="mt-6">
                  <GlossaryFaq items={term.faq} />
                </div>
              </section>
            ) : null}

          </article>

          <aside className="hidden lg:sticky lg:top-24 lg:block">
            <GlossaryTocSidebar items={toc} />
            <Link href={GLOSSARY_PATH} className="mt-4 block text-sm font-semibold text-brand-600 hover:text-brand-700">
              ← Ко всем терминам
            </Link>
          </aside>
        </div>
      </div>
    </>
  );
}
