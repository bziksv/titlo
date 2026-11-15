import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsArticle } from "@/components/NewsArticle";
import { PageShell } from "@/components/PageShell";
import { NEWS_ITEMS, getNewsBySlug } from "@/lib/content/news";
import { canonicalMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return NEWS_ITEMS.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getNewsBySlug(slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.excerpt,
    ...canonicalMetadata(`/news/detail/${slug}/`),
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = getNewsBySlug(slug);
  if (!item) notFound();

  return (
    <PageShell title={item.title} lead={item.date || undefined}>
      <NewsArticle blocks={item.blocks ?? []} fallback={item.body} />
      <Link href="/news/" className="mt-10 inline-block font-medium text-brand-600 hover:text-brand-700">
        ← Все новости
      </Link>
    </PageShell>
  );
}
