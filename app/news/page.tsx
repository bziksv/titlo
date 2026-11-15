import type { Metadata } from "next";
import { NewsList } from "@/components/NewsList";
import { getNewsPage } from "@/lib/content/news";
import { canonicalMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...canonicalMetadata("/news/"),
  title: "Новости",
  description: "Новости и обновления сервиса Титло.",
};

export default function NewsListPage() {
  const { items, page, totalPages, total } = getNewsPage(1);
  return <NewsList items={items} page={page} totalPages={totalPages} total={total} />;
}
