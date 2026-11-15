import { JsonLd } from "@/components/seo/JsonLd";
import { SITE } from "@/lib/site";

export function SiteJsonLd() {
  const url = SITE.siteUrl.replace(/\/$/, "");
  return (
    <JsonLd data={{
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": `${url}/#organization`,
          name: SITE.name,
          alternateName: SITE.nameLatin,
          url: `${url}/`,
          logo: `${url}/favicon.svg`,
          telephone: SITE.phone,
          email: SITE.email,
        },
        {
          "@type": "WebSite",
          "@id": `${url}/#website`,
          name: SITE.name,
          url: `${url}/`,
          description: SITE.description,
          inLanguage: "ru-RU",
          publisher: { "@id": `${url}/#organization` },
        },
      ],
    }} />
  );
}
