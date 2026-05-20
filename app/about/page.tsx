import type { Metadata } from "next";
import Link from "next/link";
import { ContentSections } from "@/components/ContentSections";
import { PageShell } from "@/components/PageShell";
import { getSitePage } from "@/lib/content/site-pages.generated";
import { publicCopy } from "@/lib/public-copy";

export const metadata: Metadata = {
  title: "О сервисе Датагон — история развития",
  description:
    "О компании Датагон: инструменты для SEO, история с 2015 года, команда в Воронеже.",
};

type TimelineItem = {
  date: string;
  title: string;
  description: string;
  href: string;
};

export default function AboutPage() {
  const page = getSitePage("about");
  const lead = page?.lead ? publicCopy(page.lead) : "";
  const timeline = (page?.extra?.timeline as TimelineItem[] | undefined) ?? [];

  return (
    <PageShell title={page?.h1 ?? "О компании"} lead={lead || undefined}>
      {page?.sections && page.sections.length > 0 && (
        <ContentSections sections={page.sections} className="mb-12" />
      )}

      <h2 className="text-2xl font-bold text-slate-900">Краткая история компании</h2>
      <ol className="mt-8 space-y-6">
        {timeline.map((item) => (
          <li
            key={item.href}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <time className="text-sm font-medium text-brand-600">{item.date}</time>
            {item.title ? (
              <h3 className="mt-2 text-lg font-semibold text-slate-900">{item.title}</h3>
            ) : null}
            <p className="mt-2 text-sm text-slate-600">{publicCopy(item.description)}</p>
            <Link href={item.href} className="mt-3 inline-block text-sm font-medium text-brand-600">
              Подробнее →
            </Link>
          </li>
        ))}
      </ol>

      <Link
        href="/news/istoriya-kompanii/"
        className="mt-10 inline-block font-medium text-brand-600 hover:text-brand-700"
      >
        История компании в новостях →
      </Link>
    </PageShell>
  );
}
