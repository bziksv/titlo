import { GLOSSARY_NAME } from "@/lib/content/glossary";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og/render";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = GLOSSARY_NAME;

export default async function Image() {
  return renderOgImage({
    eyebrow: "Справочник Титло",
    title: GLOSSARY_NAME,
    subtitle: "Термины поискового продвижения простыми словами — с примерами и модулями для практики",
  });
}
