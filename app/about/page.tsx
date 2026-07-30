import type { Metadata } from "next";
import Link from "next/link";
import { CompanyTimeline } from "@/components/CompanyTimeline";
import { ContentSections } from "@/components/ContentSections";
import { PageShell } from "@/components/PageShell";
import { getSitePage } from "@/lib/content/site-pages.generated";
import { publicCopy } from "@/lib/public-copy";

export const metadata: Metadata = {
  title: "О сервисе Титло — история развития",
  description:
    "О компании Титло: инструменты для SEO, история с 2015 года, команда в Воронеже.",
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
      <CompanyTimeline items={timeline} transformDescription={publicCopy} />

      <Link
        href="/news/istoriya-kompanii/"
        className="mt-10 inline-block font-medium text-brand-600 hover:text-brand-700"
      >
        История компании в новостях →
      </Link>
    </PageShell>
  );
}
