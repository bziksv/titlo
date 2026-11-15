import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalHtml } from "@/components/LegalHtml";
import { PageShell } from "@/components/PageShell";
import { getAllLegalSlugs, getLegalBySlug } from "@/lib/content/legal";
import { canonicalMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllLegalSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = getLegalBySlug(slug);
  if (!doc) return {};
  return {
    title: doc.metaTitle,
    robots: { index: true, follow: true },
    ...canonicalMetadata(`/legal/${slug}/`),
  };
}

export default async function LegalPage({ params }: Props) {
  const { slug } = await params;
  const doc = getLegalBySlug(slug);
  if (!doc) notFound();

  return (
    <PageShell title={doc.title}>
      <LegalHtml html={doc.bodyHtml} />
    </PageShell>
  );
}
