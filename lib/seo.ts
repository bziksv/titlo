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
export function canonicalMetadata(path: string): Pick<Metadata, "alternates" | "openGraph"> {
  const url = normalizePath(path);
  return {
    alternates: { canonical: url },
    openGraph: { ...BASE_OPEN_GRAPH, url },
  };
}
