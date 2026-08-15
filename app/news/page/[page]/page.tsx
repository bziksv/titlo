import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { NewsList } from "@/components/NewsList";
import { getNewsPage, getNewsTotalPages } from "@/lib/content/news";

type Props = {
  params: Promise<{ page: string }>;
};

export function generateStaticParams() {
  const total = getNewsTotalPages();
  return Array.from({ length: Math.max(0, total - 1) }, (_, i) => ({
    page: String(i + 2),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page: raw } = await params;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 2) {
    return { title: "Новости" };
  }
  return {
    title: `Новости — страница ${n}`,
    description: `Новости и обновления сервиса Титло, страница ${n}.`,
  };
}

export default async function NewsPagedListPage({ params }: Props) {
  const { page: raw } = await params;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1) notFound();
  if (n === 1) redirect("/news/");

  const totalPages = getNewsTotalPages();
  if (n > totalPages) notFound();

  const { items, page, total } = getNewsPage(n);
  return <NewsList items={items} page={page} totalPages={totalPages} total={total} />;
}
