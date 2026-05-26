import { LK_URL } from "@/lib/site";

export const META_TAGS_DEMO_MODULE = "proverka-meta-tegov-online" as const;

export const META_TAGS_DEMO_MAX_RUNS = 5;

export const META_TAGS_SAMPLE_URL = "https://datagon.ru/";

export function buildMetaTagsRegisterUrl(): string {
  const u = new URL(`${LK_URL}/register`);
  u.searchParams.set("module", META_TAGS_DEMO_MODULE);
  u.searchParams.set("from", "demo");
  return u.toString();
}

export const META_TAGS_CABINET_FEATURES = [
  "Проект до 500 URL — проверка раз в сутки",
  "История снимков и сравнение с эталоном",
  "Уведомление в Telegram, если title, description или canonical изменились",
  "Сразу видно, если кто-то поменял разметку без вашего ведома",
  "Экспорт CSV и Excel",
] as const;

export const META_TAGS_DEMO_FIELD_LABELS: Record<string, string> = {
  title: "Title",
  description: "Description",
  h1: "H1",
  canonical: "Canonical",
  noindex: "Noindex",
  robots: "Robots",
  http: "HTTP",
};
