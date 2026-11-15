import { getGlossaryTerm, GLOSSARY_NAME, GLOSSARY_TERMS } from "@/lib/content/glossary";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og/render";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = GLOSSARY_NAME;
export const dynamicParams = false;

export function generateStaticParams() {
  return GLOSSARY_TERMS.map((t) => ({ slug: t.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const term = getGlossaryTerm(slug);
  return renderOgImage({
    eyebrow: GLOSSARY_NAME,
    title: term?.h1 ?? GLOSSARY_NAME,
    subtitle: term?.short,
  });
}
