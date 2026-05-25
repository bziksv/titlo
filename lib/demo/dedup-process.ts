/** Обработка списка — та же логика, что в cabinet-duplicates.js */

export type DedupProcessOptions = {
  removeExtraSpace?: boolean;
  trim?: boolean;
  replaceTabWithSpace?: boolean;
  removeEmptyRows?: boolean;
  lowerCase?: boolean;
  removeDuplicates?: boolean;
  replaceUmlaut?: boolean;
  removeStartingChars?: boolean;
  removeEndingChars?: boolean;
  caseInsensitiveDedup?: boolean;
  sortAlphabetically?: boolean;
  startChars?: string;
  endChars?: string;
};

export type DedupProcessMetrics = {
  before: number;
  after: number;
  dupRemoved: number;
  emptyRemoved: number;
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function splitLines(text: string): string[] {
  return String(text).split(/[\r\n]+/);
}

export function countNonEmptyLines(text: string): number {
  return splitLines(text).filter((line) => line.trim() !== "").length;
}

const ORDER: (keyof DedupProcessOptions)[] = [
  "removeExtraSpace",
  "trim",
  "replaceTabWithSpace",
  "removeEmptyRows",
  "lowerCase",
  "removeDuplicates",
  "replaceUmlaut",
  "removeStartingChars",
  "removeEndingChars",
  "sortAlphabetically",
];

export function processDedupList(
  input: string,
  options: DedupProcessOptions
): { text: string; metrics: DedupProcessMetrics } {
  const metrics: DedupProcessMetrics = {
    before: countNonEmptyLines(input),
    after: 0,
    dupRemoved: 0,
    emptyRemoved: 0,
  };

  let text = input;

  for (const key of ORDER) {
    if (!options[key]) continue;

    switch (key) {
      case "removeExtraSpace":
        text = text.replace(/ +/gm, " ");
        break;
      case "trim":
        text = splitLines(text)
          .map((line) => line.trim())
          .join("\n");
        break;
      case "replaceTabWithSpace":
        text = text.replace(/[ \t]/gm, " ");
        break;
      case "removeEmptyRows": {
        const lines = splitLines(text);
        const filtered = lines.filter((line) => line.trim() !== "");
        metrics.emptyRemoved += Math.max(0, lines.length - filtered.length);
        text = filtered.join("\n");
        break;
      }
      case "lowerCase":
        text = text.toLowerCase();
        break;
      case "removeDuplicates": {
        const lines = splitLines(text);
        const seen: Record<string, boolean> = {};
        const unique: string[] = [];
        const ci = !!options.caseInsensitiveDedup;
        for (const line of lines) {
          const k = ci ? line.toLowerCase() : line;
          if (!Object.prototype.hasOwnProperty.call(seen, k)) {
            seen[k] = true;
            unique.push(line);
          } else {
            metrics.dupRemoved += 1;
          }
        }
        text = unique.join("\n");
        break;
      }
      case "replaceUmlaut":
        text = text.replace(/[ёЁ]/g, "е");
        break;
      case "removeStartingChars": {
        const chars = options.startChars ?? "";
        if (chars) {
          const pattern = `^[${escapeRegExp(chars)}]| [${escapeRegExp(chars)}]+`;
          text = text.replace(new RegExp(pattern, "gm"), " ");
        }
        break;
      }
      case "removeEndingChars": {
        const chars = options.endChars ?? "";
        if (chars) {
          const pattern = `[${escapeRegExp(chars)}]+[ \t]|[${escapeRegExp(chars)}]$`;
          text = text.replace(new RegExp(pattern, "gm"), " ");
        }
        break;
      }
      case "sortAlphabetically": {
        const lines = splitLines(text).filter((line) => line.trim() !== "");
        lines.sort((a, b) => a.localeCompare(b, "ru", { sensitivity: "base" }));
        text = lines.join("\n");
        break;
      }
    }
  }

  metrics.after = countNonEmptyLines(text);
  return { text, metrics };
}
