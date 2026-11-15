import type { Metadata } from "next";
import { SITE } from "@/lib/site";

/** Базовые OG-поля: при задании openGraph на странице layout-значения не мержатся — дублируем здесь. */
const BASE_OPEN_GRAPH = {
  siteName: SITE.name,
  locale: "ru_RU",
  type: "website",
} as const;

/** Нормализует путь под trailingSlash: true → `/path/`. */
export function normalizePath(path: string): string {
  const p = `/${path.replace(/^\/+|\/+$/g, "")}/`;
  return p === "//" ? "/" : p;
}

/**
 * canonical + openGraph.url для страницы (относительный путь, абсолютный URL строится от metadataBase).
 * og:title / og:description Next подставляет из title / description страницы.
 */
export function canonicalMetadata(
  path: string,
  opts: { image?: string; imageAlt?: string } = {}
): Pick<Metadata, "alternates" | "openGraph"> {
  const url = normalizePath(path);
  return {
    alternates: { canonical: url },
    openGraph: {
      ...BASE_OPEN_GRAPH,
      url,
      // Превью: по умолчанию app/opengraph-image.tsx; модули передают свой app/[slug]/opengraph-image.
      // Явно задаём, т.к. openGraph страницы перекрывает файловые картинки родительских сегментов.
      images: [
        { url: opts.image ?? "/opengraph-image/", width: 1200, height: 630, alt: opts.imageAlt ?? SITE.title },
      ],
    },
  };
}
