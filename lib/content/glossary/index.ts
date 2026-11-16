import { GLOSSARY_CATEGORIES, type GlossaryCategory } from "./plan";
import { CHASTOTNOST_ZAPROSA } from "./terms/chastotnost-zaprosa";
import { POISKOVYE_PODSKAZKI } from "./terms/poiskovye-podskazki";
import { INTENT } from "./terms/intent";
import { GEOZAVISIMYY_ZAPROS } from "./terms/geozavisimyy-zapros";
import { KLASTERIZATSIYA_ZAPROSOV } from "./terms/klasterizatsiya-zaprosov";
import { SEMANTICHESKOE_YADRO } from "./terms/semanticheskoe-yadro";
import type { GlossaryBlock, GlossaryTerm } from "./types";

export { GLOSSARY_CATEGORIES, GLOSSARY_PLANNED_TOTAL } from "./plan";
export type { GlossaryCategory } from "./plan";
export type * from "./types";

export const GLOSSARY_PATH = "/slovar/";
export const GLOSSARY_NAME = "SEO-словарь";

/** Опубликованные термины. Новый термин: файл в terms/ + строка здесь. */
export const GLOSSARY_TERMS: readonly GlossaryTerm[] = [SEMANTICHESKOE_YADRO, KLASTERIZATSIYA_ZAPROSOV, CHASTOTNOST_ZAPROSA, POISKOVYE_PODSKAZKI, INTENT, GEOZAVISIMYY_ZAPROS];

export function getGlossaryTerm(slug: string): GlossaryTerm | undefined {
  return GLOSSARY_TERMS.find((t) => t.slug === slug);
}

export function glossaryTermPath(slug: string): string {
  return `${GLOSSARY_PATH}${slug}/`;
}

const norm = (s: string) => s.trim().toLowerCase().replace(/ё/g, "е");

/** Путь опубликованного термина по названию/синониму, иначе undefined (рендерим текстом, без ссылки). */
export function findPublishedTermPath(name: string): string | undefined {
  const n = norm(name);
  const term = GLOSSARY_TERMS.find((t) => norm(t.term) === n || t.aliases.some((a) => norm(a) === n));
  return term ? glossaryTermPath(term.slug) : undefined;
}

const WORD_RE = /[\p{L}\p{N}]+(?:[-–][\p{L}\p{N}]+)*/gu;
const countWords = (s: string) => s.match(WORD_RE)?.length ?? 0;

function blockText(b: GlossaryBlock): string[] {
  switch (b.type) {
    case "p":
      return [b.text];
    case "ul":
      return b.items;
    case "callout":
      return [b.text];
    case "compare":
      return b.items.flatMap((i) => [i.title, i.text]);
    case "flow":
      return [b.caption ?? "", ...b.steps.flatMap((st) => [st.label, st.note])];
    case "steps":
      return b.items.flatMap((i) => [i.title, i.text]);
    case "table":
      return [b.caption, ...b.head, ...b.rows.flat(), b.note ?? ""];
  }
}

/** Число слов в наборе блоков (для раскладки: длинные карточки растягиваются на всю ширину). */
export function glossaryBlocksWordCount(blocks: readonly GlossaryBlock[]): number {
  return blocks.flatMap(blockText).reduce((n, p) => n + countWords(p), 0);
}

/** Число слов в тексте статьи термина (определение, разделы, сервисы, FAQ). */
export function glossaryTermWordCount(t: GlossaryTerm): number {
  const parts: string[] = [t.h1, t.definition];
  for (const s of t.sections) {
    parts.push(s.title, ...(s.blocks ?? []).flatMap(blockText));
    for (const sub of s.subsections ?? []) parts.push(sub.title, ...sub.blocks.flatMap(blockText));
  }
  parts.push(t.modules.title, t.modules.intro, ...t.modules.items.flatMap((m) => [m.title, m.text]));
  parts.push(...(t.takeaways ?? []), ...t.faq.flatMap((f) => [f.q, f.a]));
  return parts.reduce((n, p) => n + countWords(p.replace(/\]\([^)]*\)/g, "]")), 0);
}

/** Время чтения в минутах (~180 слов/мин для русского текста, округление вверх). */
export const GLOSSARY_WORDS_PER_MINUTE = 180;
export function glossaryReadingMinutes(t: GlossaryTerm): number {
  return Math.max(1, Math.ceil(glossaryTermWordCount(t) / GLOSSARY_WORDS_PER_MINUTE));
}

export function getGlossaryCategory(id: string): GlossaryCategory | undefined {
  return GLOSSARY_CATEGORIES.find((c) => c.id === id);
}
