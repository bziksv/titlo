/** Локальные обложки новостей: предпочитаем WebP рядом с png/jpg. */

const RASTER_EXT = /\.(png|jpe?g)$/i;

export function toNewsWebpUrl(src: string | undefined | null): string | undefined {
  if (!src) return undefined;
  if (!src.startsWith("/news/assets/")) return src;
  if (!RASTER_EXT.test(src)) return src;
  return src.replace(RASTER_EXT, ".webp");
}
