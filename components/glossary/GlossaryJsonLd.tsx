import { JsonLd } from "@/components/seo/JsonLd";
import { GLOSSARY_NAME, GLOSSARY_PATH, GLOSSARY_TERMS, glossaryTermPath, type GlossaryTerm } from "@/lib/content/glossary";
import { SITE } from "@/lib/site";

const base = () => SITE.siteUrl.replace(/\/$/, "");
const setId = () => `${base()}${GLOSSARY_PATH}#termset`;

function crumbs(items: { name: string; url: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: it.url })),
  };
}

export function GlossaryHubJsonLd() {
  const hub = `${base()}${GLOSSARY_PATH}`;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "DefinedTermSet",
            "@id": setId(),
            name: `${GLOSSARY_NAME} ${SITE.name}`,
            url: hub,
            inLanguage: "ru-RU",
            publisher: { "@id": `${base()}/#organization` },
            hasDefinedTerm: GLOSSARY_TERMS.map((t) => ({
              "@type": "DefinedTerm",
              "@id": `${base()}${glossaryTermPath(t.slug)}#term`,
              name: t.term,
              url: `${base()}${glossaryTermPath(t.slug)}`,
            })),
          },
          { ...crumbs([{ name: "Главная", url: `${base()}/` }, { name: GLOSSARY_NAME, url: hub }]), "@id": `${hub}#breadcrumb` },
        ],
      }}
    />
  );
}

export function GlossaryTermJsonLd({ term }: { term: GlossaryTerm }) {
  const url = `${base()}${glossaryTermPath(term.slug)}`;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "DefinedTerm",
            "@id": `${url}#term`,
            name: term.term,
            alternateName: term.aliases,
            description: term.definition,
            url,
            inLanguage: "ru-RU",
            inDefinedTermSet: {
              "@type": "DefinedTermSet",
              "@id": setId(),
              name: `${GLOSSARY_NAME} ${SITE.name}`,
              url: `${base()}${GLOSSARY_PATH}`,
            },
          },
          {
            ...crumbs([
              { name: "Главная", url: `${base()}/` },
              { name: GLOSSARY_NAME, url: `${base()}${GLOSSARY_PATH}` },
              { name: term.term, url },
            ]),
            "@id": `${url}#breadcrumb`,
          },
          ...(term.faq.length
            ? [
                {
                  "@type": "FAQPage",
                  "@id": `${url}#faq`,
                  mainEntity: term.faq.map(({ q, a }) => ({
                    "@type": "Question",
                    name: q,
                    acceptedAnswer: { "@type": "Answer", text: a },
                  })),
                },
              ]
            : []),
        ],
      }}
    />
  );
}
