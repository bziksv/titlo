import type { TextAnalyzerCloudWord } from "@/lib/demo/types";

export type NormalizedCloudWord = {
  text: string;
  weight: number;
  tip: string;
};

export type PlacedCloudWord = NormalizedCloudWord & {
  left: number;
  top: number;
  fontSizePx: number;
  weightClass: string;
};

type Box = { left: number; top: number; right: number; bottom: number };

function boxesOverlap(a: Box, b: Box, pad = 4): boolean {
  return !(
    a.right + pad <= b.left ||
    a.left >= b.right + pad ||
    a.bottom + pad <= b.top ||
    a.top >= b.bottom + pad
  );
}

export function weightClass(ratio: number): string {
  const bucket = Math.max(1, Math.min(10, Math.round(ratio * 9) + 1));
  return `w${bucket}`;
}

export function weightColorClass(weightClassName: string): string {
  const n = Number.parseInt(weightClassName.replace("w", ""), 10);
  if (n >= 9) return "text-[#00ccff]";
  if (n >= 7) return "text-[#3399dd]";
  if (n >= 5) return "text-[#627d98]";
  if (n >= 3) return "text-[#90a0dd]";
  return "text-[#99ccee]";
}

export function fontSizePxForWord(text: string, ratio: number): number {
  const len = text.length;
  return Math.round(11 + ratio * 24 - Math.min(7, Math.max(0, len - 7) * 0.35));
}

export function normalizeCloudWords(
  words: TextAnalyzerCloudWord[],
  limit: number,
  repetitionsLabel = "Повторений"
): NormalizedCloudWord[] {
  if (words.length === 0) return [];

  const sorted = [...words]
    .filter((w) => w?.text)
    .sort((a, b) => (b.weight || 0) - (a.weight || 0))
    .slice(0, limit);

  if (sorted.length === 0) return [];

  return sorted.map((word) => {
    const count = word.weight || 1;
    return {
      text: String(word.text),
      weight: count,
      tip: `${word.text} — ${repetitionsLabel}: ${count}`,
    };
  });
}

export function layoutSpiralCloud(
  words: NormalizedCloudWord[],
  hostW: number,
  hostH: number,
  measure: (text: string, fontSizePx: number) => { w: number; h: number }
): PlacedCloudWord[] {
  if (words.length === 0) return [];

  const width = Math.max(260, Math.floor(hostW));
  const height = Math.max(320, Math.floor(hostH));
  const maxWeight = words[0]?.weight || 1;
  const placed: Box[] = [];
  const edgePad = 18;
  const result: PlacedCloudWord[] = [];

  for (const word of words) {
    const ratio = maxWeight > 0 ? (word.weight || 1) / maxWeight : 1;
    const sizePx = fontSizePxForWord(word.text, ratio);
    const { w, h } = measure(word.text, sizePx);

    const cx = width / 2;
    const cy = height / 2;
    let angle = 0;
    let radius = 0;
    const step = 0.42;
    let placedOk = false;

    for (let i = 0; i < 500; i++) {
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      const box: Box = {
        left: x - w / 2,
        top: y - h / 2,
        right: x + w / 2,
        bottom: y + h / 2,
      };

      if (box.left < edgePad || box.top < edgePad || box.right > width - edgePad || box.bottom > height - edgePad) {
        angle += step;
        radius += 0.75;
        continue;
      }

      let collision = false;
      for (const other of placed) {
        if (boxesOverlap(box, other, 4)) {
          collision = true;
          break;
        }
      }

      if (!collision) {
        const wc = weightClass(ratio);
        result.push({
          ...word,
          left: x,
          top: y,
          fontSizePx: sizePx,
          weightClass: wc,
        });
        placed.push(box);
        placedOk = true;
        break;
      }

      angle += step;
      radius += 0.75;
    }

    if (!placedOk) {
      // skip word if no room — same as cabinet
    }
  }

  return result;
}

/** Fallback tag layout when spiral cannot place enough words (narrow container). */
export function layoutTagCloud(words: NormalizedCloudWord[]): PlacedCloudWord[] {
  const maxWeight = words[0]?.weight || 1;
  return words.map((word) => {
    const ratio = maxWeight > 0 ? (word.weight || 1) / maxWeight : 1;
    const wc = weightClass(ratio);
    return {
      ...word,
      left: 0,
      top: 0,
      fontSizePx: Math.round((0.78 + ratio * 1.55) * 16),
      weightClass: wc,
    };
  });
}
