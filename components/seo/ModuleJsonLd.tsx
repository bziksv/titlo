import { JsonLd } from "@/components/seo/JsonLd";
import type { ModulePage } from "@/lib/content/modules";
import { SITE } from "@/lib/site";

type Props = { module: ModulePage; faq: readonly { q: string; a: string }[] };

/** Только публичные лендинги. Цены тарифов общие для платформы, не цена модуля — offers намеренно не размечаем. */
export function ModuleJsonLd({ module, faq }: Props) {
  const base = SITE.siteUrl.replace(/\/$/, "");
  const url = `${base}/${module.slug}/`;
  return (
    <JsonLd data={{
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          "@id": `${url}#application`,
          name: `${module.title} — ${SITE.name}`,
          description: module.seoDescription ?? module.description,
          url,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          inLanguage: "ru-RU",
          browserRequirements: "Современный браузер с поддержкой JavaScript",
          provider: { "@id": `${base}/#organization` },
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${url}#breadcrumb`,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Главная", item: `${base}/` },
            { "@type": "ListItem", position: 2, name: "Модули", item: `${base}/services/` },
            { "@type": "ListItem", position: 3, name: module.title, item: url },
          ],
        },
        ...(faq.length ? [{
          "@type": "FAQPage",
          "@id": `${url}#faq`,
          mainEntity: faq.map(({ q, a }) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
          })),
        }] : []),
      ],
    }} />
  );
}
