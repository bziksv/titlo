import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * LAB-копии модулей (*-v1 / *-v2 / *-v3) не закрываем в robots.txt: на них meta robots noindex
 * и canonical на публичный лендинг — краулер должен иметь доступ, чтобы увидеть noindex.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE.siteUrl.replace(/\/$/, "")}/sitemap.xml`,
  };
}
