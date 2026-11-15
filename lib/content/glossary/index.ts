import { GLOSSARY_CATEGORIES, type GlossaryCategory } from "./plan";
import { SEMANTICHESKOE_YADRO } from "./terms/semanticheskoe-yadro";
import type { GlossaryTerm } from "./types";

export { GLOSSARY_CATEGORIES, GLOSSARY_PLANNED_TOTAL } from "./plan";
export type { GlossaryCategory } from "./plan";
export type * from "./types";

export const GLOSSARY_PATH = "/slovar/";
export const GLOSSARY_NAME = "SEO-словарь";

/** Опубликованные термины. Новый термин: файл в terms/ + строка здесь. */
export const GLOSSARY_TERMS: readonly GlossaryTerm[] = [SEMANTICHESKOE_YADRO];

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

export function getGlossaryCategory(id: string): GlossaryCategory | undefined {
  return GLOSSARY_CATEGORIES.find((c) => c.id === id);
}
