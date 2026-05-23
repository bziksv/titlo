import type { TextLengthExtendedPreview, TextLengthSeoPreview, TextLengthSummary } from "@/lib/demo/types";

const TITLE_MAX = 60;
const DESCRIPTION_MAX = 160;

export function analyzeTextSummary(text: string): TextLengthSummary {
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      chars_with_spaces: 0,
      chars_no_spaces: 0,
      words: 0,
      lines: 0,
      spaces: 0,
    };
  }
  const chars_with_spaces = text.length;
  const chars_no_spaces = text.replace(/\s/g, "").length;
  const words = trimmed.split(/\s+/).filter(Boolean).length;
  const lines = text.split(/\n/).length;
  const spaces = (text.match(/\s/g) ?? []).length;
  return { chars_with_spaces, chars_no_spaces, words, lines, spaces };
}

export function analyzeTextSeo(fields: {
  title?: string;
  description?: string;
  h1?: string;
}): TextLengthSeoPreview {
  const title = fields.title?.trim() ?? "";
  const description = fields.description?.trim() ?? "";
  const h1 = fields.h1?.trim() ?? "";
  const title_chars = title ? title.length : null;
  const description_chars = description ? description.length : null;
  const h1_chars = h1 ? h1.length : null;
  return {
    title_chars,
    description_chars,
    h1_chars,
    title_ok: title_chars !== null ? title_chars <= TITLE_MAX : null,
    description_ok: description_chars !== null ? description_chars <= DESCRIPTION_MAX : null,
  };
}

export function analyzeTextExtended(text: string): TextLengthExtendedPreview {
  const trimmed = text.trim();
  if (!trimmed) {
    return { sentences: 0, paragraphs: 0, reading_time_min: 0 };
  }
  const sentences = trimmed.split(/[.!?…]+/).filter((s) => s.trim()).length || 1;
  const paragraphs = trimmed.split(/\n\s*\n/).filter((p) => p.trim()).length || 1;
  const words = trimmed.split(/\s+/).filter(Boolean).length;
  const reading_time_min = Math.max(1, Math.ceil(words / 200));
  return { sentences, paragraphs, reading_time_min };
}
