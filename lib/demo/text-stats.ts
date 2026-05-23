import { analyzeTextSummary } from "@/lib/demo/text-length-analyze";

export type TextStats = {
  charsWithSpaces: number;
  charsNoSpaces: number;
  words: number;
  lines: number;
};

export function analyzeText(text: string): TextStats {
  const s = analyzeTextSummary(text);
  return {
    charsWithSpaces: s.chars_with_spaces,
    charsNoSpaces: s.chars_no_spaces,
    words: s.words,
    lines: s.lines,
  };
}
