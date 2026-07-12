import type { MetadataRoute } from "next";
import { getAllLegalSlugs } from "@/lib/content/legal";
import { getAllLegalPdfSlugs } from "@/lib/content/legal-pdfs";
import { getPublicModuleSlugs } from "@/lib/content/modules";
import { NEWS_ITEMS } from "@/lib/content/news";
import { SITE } from "@/lib/site";

const BASE = SITE.siteUrl.replace(/\/$/, "");

const STATIC = [
  "",
  "about/",
  "contact/",
  "tarify/",
  "services/",
  "faq/",
  "news/",
  "news/istoriya-kompanii/",
  "demo/",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages = STATIC.map((path) => ({
    url: `${BASE}/${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const modules = getPublicModuleSlugs().map((slug) => ({
    url: `${BASE}/${slug}/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const legal = [
    ...getAllLegalSlugs().map((slug) => ({
      url: `${BASE}/legal/${slug}/`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
    ...getAllLegalPdfSlugs().map((slug) => ({
      url: `${BASE}/legal/doc/${slug}/`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];

  const news = NEWS_ITEMS.map((n) => ({
    url: `${BASE}/news/detail/${n.slug}/`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...modules, ...legal, ...news];
}
