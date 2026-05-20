import { SITE } from "@/lib/site";

/**
 * Публичный текст: старый бренд Red Box / RedBox → Датагон,
 * убираем служебные формулировки из скрапа.
 */
export function publicCopy(text: string): string {
  if (!text?.trim()) return text;

  return text
    .replace(/Red\s*Box/gi, SITE.name)
    .replace(/RedBox/gi, SITE.name)
    .replace(/\s*с\s+live-сайта/gi, "")
    .replace(/live-сайта/gi, "")
    .replace(/на сайте redbox\.su/gi, `в сервисе ${SITE.name}`)
    .replace(/страницах модулей на redbox\.su/gi, "страницах модулей")
    .replace(/redbox\.su/gi, SITE.name)
    .replace(/\s{2,}/g, " ")
    .trim();
}
