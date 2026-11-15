import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og/render";
import { SITE } from "@/lib/site";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = SITE.title;

export default async function Image() {
  return renderOgImage({
    eyebrow: "Платформа для SEO-специалистов",
    title: "Инструменты для SEO: позиции, релевантность, аудит",
    subtitle: "26 модулей в одном кабинете — от семантики до отчёта клиенту",
  });
}
