/**
 * SEO-словарь (/slovar/): типы контента.
 * Инлайн-разметка в строках: **жирный** и [текст](/href/) — см. components/glossary/RichText.tsx.
 */

export type GlossaryBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "steps"; items: { title: string; text: string }[] }
  | {
      type: "table";
      caption: string;
      head: string[];
      rows: string[][];
      note?: string;
    };

export type GlossarySubsection = { title: string; blocks: GlossaryBlock[] };

export type GlossarySection = {
  /** якорь (#id) */
  id: string;
  title: string;
  /** короткая подпись для оглавления */
  tocLabel?: string;
  blocks?: GlossaryBlock[];
  subsections?: GlossarySubsection[];
};

export type GlossaryModuleCta = {
  /** slug существующего лендинга модуля (lib/content/modules.ts) */
  slug: string;
  title: string;
  text: string;
};

export type GlossaryFaqItem = { q: string; a: string };

export type GlossaryTerm = {
  slug: string;
  /** название термина (карточка, хлебные крошки, DefinedTerm.name) */
  term: string;
  aliases: string[];
  /** id категории из GLOSSARY_CATEGORIES */
  categoryId: string;
  h1: string;
  /** <title> без суффикса « | Титло» */
  seoTitle: string;
  seoDescription: string;
  /** короткое описание для карточки на хабе */
  short: string;
  /** блок «Краткое определение» */
  definition: string;
  sections: GlossarySection[];
  /** блок CTA в модули Титло */
  modules: { id: string; title: string; intro: string; items: GlossaryModuleCta[] };
  /** связанные термины (названия); ссылкой становятся только опубликованные */
  related: string[];
  faq: GlossaryFaqItem[];
  datePublished: string;
  dateModified: string;
  /** подпись об источниках данных */
  sources: string;
};
