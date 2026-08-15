export type { NewsBlock, NewsItem } from "./news.generated";
import { NEWS_ITEMS as SCRAPED, type NewsItem } from "./news.generated";
import { CABINET_NEWS_ITEMS } from "./news.cabinet";

const MONTHS: Record<string, number> = {
  января: 0,
  февраля: 1,
  марта: 2,
  апреля: 3,
  мая: 4,
  июня: 5,
  июля: 6,
  августа: 7,
  сентября: 8,
  октября: 9,
  ноября: 10,
  декабря: 11,
};

function parseRuDate(date: string): number {
  const m = date.match(/(\d{1,2})\s+(\S+)\s+(\d{4})/);
  if (!m) return 0;
  const month = MONTHS[m[2].toLowerCase()];
  if (month === undefined) return 0;
  return new Date(Number(m[3]), month, Number(m[1])).getTime();
}

const bySlug = new Map<string, NewsItem>();
for (const item of [...CABINET_NEWS_ITEMS, ...SCRAPED]) {
  if (!bySlug.has(item.slug)) bySlug.set(item.slug, item);
}

/** Новости сайта: кабинет + архив, новые сверху */
export const NEWS_ITEMS: NewsItem[] = [...bySlug.values()].sort(
  (a, b) => parseRuDate(b.date) - parseRuDate(a.date)
);

/** Карточек на странице ленты `/news/`. */
export const NEWS_PAGE_SIZE = 10;

export function getNewsTotalPages(pageSize = NEWS_PAGE_SIZE): number {
  return Math.max(1, Math.ceil(NEWS_ITEMS.length / pageSize));
}

export function getNewsPage(
  page: number,
  pageSize = NEWS_PAGE_SIZE
): {
  items: NewsItem[];
  page: number;
  totalPages: number;
  total: number;
} {
  const totalPages = getNewsTotalPages(pageSize);
  const safe = Number.isFinite(page) ? Math.trunc(page) : 1;
  const current = Math.min(Math.max(1, safe), totalPages);
  const start = (current - 1) * pageSize;
  return {
    items: NEWS_ITEMS.slice(start, start + pageSize),
    page: current,
    totalPages,
    total: NEWS_ITEMS.length,
  };
}

/** URL ленты: 1 → `/news/`, дальше → `/news/page/N/`. */
export function newsListHref(page: number): string {
  if (page <= 1) return "/news/";
  return `/news/page/${page}/`;
}

export function getNewsBySlug(slug: string): NewsItem | undefined {
  return NEWS_ITEMS.find((n) => n.slug === slug);
}
