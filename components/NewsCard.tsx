import Image from "next/image";
import Link from "next/link";
import type { NewsItem } from "@/lib/content/news";
import { toNewsWebpUrl } from "@/lib/news-image";

type Props = {
  item: NewsItem;
  /** Первая карточка в ленте — без lazy (LCP). */
  priority?: boolean;
};

export function NewsCard({ item, priority = false }: Props) {
  const href = `/news/detail/${item.slug}/`;
  const imageSrc = toNewsWebpUrl(item.imageUrl) || item.imageUrl;

  return (
    <li>
      <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-brand-300 hover:shadow-md sm:flex-row sm:items-stretch">
        {imageSrc && (
          <Link
            href={href}
            className="relative block aspect-[3/2] w-full shrink-0 self-stretch overflow-hidden bg-slate-200 sm:w-72 sm:self-center lg:w-80"
          >
            <Image
              src={imageSrc}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, 320px"
              className="object-cover object-left transition duration-300 group-hover:scale-[1.02]"
              quality={90}
              loading={priority ? "eager" : "lazy"}
              priority={priority}
              decoding="async"
            />
          </Link>
        )}
        <div className="flex flex-1 flex-col p-6">
          <Link href={href} className="flex-1">
            <time className="text-sm font-medium text-brand-600">{item.date}</time>
            <h2 className="mt-2 text-lg font-semibold text-slate-900 group-hover:text-brand-700">
              {item.title}
            </h2>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{item.excerpt}</p>
          </Link>
          <Link
            href={href}
            className="mt-4 inline-flex w-fit items-center gap-2 rounded-lg border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 transition hover:border-brand-400 hover:bg-brand-100"
          >
            Подробнее
            <span aria-hidden className="transition group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>
      </article>
    </li>
  );
}
