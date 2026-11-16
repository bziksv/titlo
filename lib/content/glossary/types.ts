/**
 * SEO-словарь (/slovar/): типы контента.
 * Инлайн-разметка в строках: **жирный** и [текст](/href/) — см. components/glossary/RichText.tsx.
 */

export type GlossaryCalloutVariant = "important" | "tip" | "mistake";

export type GlossaryBlock =
  | { type: "p"; text: string }
  /** check — список с галочками; cards — сетка карточек; mistakes — карточки с ✕ */
  | { type: "ul"; items: string[]; style?: "check" | "cards" | "mistakes" }
  /** выделенная врезка: Важно / Совет / Ошибка */
  | { type: "callout"; variant: GlossaryCalloutVariant; text: string }
  /** сравнение в две (или больше) колонки */
  | { type: "compare"; items: { title: string; text: string }[] }
  /** простая схема «шаг → шаг → шаг» */
  | { type: "flow"; caption?: string; steps: { label: string; note: string }[] }
  | { type: "steps"; items: { title: string; text: string }[] }
  | {
      type: "table";
      caption: string;
      head: string[];
      rows: string[][];
      note?: string;
      /** Текстовая таблица: без числового выравнивания и nowrap во 2–3 колонках. */
      textOnly?: boolean;
    };

export type GlossarySubsection = { title: string; blocks: GlossaryBlock[] };

/** stack — подразделы как отдельные карточки; grid — карточки в две колонки */
export type GlossarySectionLayout = "default" | "stack" | "grid";

export type GlossarySection = {
  /** якорь (#id) */
  id: string;
  title: string;
  /** короткая подпись для оглавления */
  tocLabel?: string;
  blocks?: GlossaryBlock[];
  subsections?: GlossarySubsection[];
  layout?: GlossarySectionLayout;
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
  /** блок «Главное» — короткие выводы в конце статьи */
  takeaways?: string[];
  faq: GlossaryFaqItem[];
  datePublished: string;
  dateModified: string;
};
