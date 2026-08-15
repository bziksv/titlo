import Link from "next/link";
import { NewsCard } from "@/components/NewsCard";
import { NewsPagination } from "@/components/NewsPagination";
import { PageShell } from "@/components/PageShell";
import type { NewsItem } from "@/lib/content/news";

type Props = {
  items: NewsItem[];
  page: number;
  totalPages: number;
  total: number;
};

export function NewsList({ items, page, totalPages, total }: Props) {
  return (
    <PageShell title="Новости и обновления" lead="Актуальные события и изменения в модулях Титло.">
      <ul className="space-y-4">
        {items.map((item, index) => (
          <NewsCard key={item.slug} item={item} priority={page === 1 && index === 0} />
        ))}
      </ul>
      <NewsPagination page={page} totalPages={totalPages} />
      {totalPages > 1 && (
        <p className="mt-3 text-center text-sm text-slate-500">
          Страница {page} из {totalPages} · {total} {pluralNews(total)}
        </p>
      )}
      <Link href="/news/istoriya-kompanii/" className="mt-6 inline-block text-brand-600">
        История компании →
      </Link>
    </PageShell>
  );
}

function pluralNews(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "новость";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "новости";
  return "новостей";
}
