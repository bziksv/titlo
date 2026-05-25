export type ListCompareMode = "unique" | "union" | "uniqueInFirstList" | "uniqueInSecondList";

export type ListCompareOptions = {
  trim: boolean;
  removeEmpty: boolean;
  caseInsensitive: boolean;
  sortResult: boolean;
};

export type ListCompareMetrics = {
  linesA: number;
  linesB: number;
  resultLines: number;
  overlap: number;
};

export type ListCompareResult = {
  text: string;
  metrics: ListCompareMetrics;
};

function splitLines(text: string): string[] {
  return String(text).split(/[\r\n]+/);
}

export function countNonEmptyLines(text: string): number {
  return splitLines(text).filter((line) => line.trim() !== "").length;
}

function normalizeLines(text: string, opts: ListCompareOptions): string[] {
  let lines = splitLines(text);
  if (opts.trim) {
    lines = lines.map((line) => line.trim());
  }
  if (opts.removeEmpty) {
    lines = lines.filter((line) => line !== "");
  }
  if (opts.caseInsensitive) {
    lines = lines.map((line) => line.toLowerCase());
  }
  return lines;
}

function arrayUnique(lines: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const line of lines) {
    if (!seen.has(line)) {
      seen.add(line);
      out.push(line);
    }
  }
  return out;
}

function arrayDiff(a: string[], b: string[]): string[] {
  const setB = new Set(b);
  return a.filter((line) => !setB.has(line));
}

function arrayIntersect(a: string[], b: string[]): string[] {
  const setB = new Set(b);
  return a.filter((line) => setB.has(line));
}

export function compareLists(
  listA: string,
  listB: string,
  mode: ListCompareMode,
  opts: ListCompareOptions
): ListCompareResult {
  const first = normalizeLines(listA, opts);
  const second = normalizeLines(listB, opts);
  const overlapLines = arrayUnique(arrayIntersect(first, second)).filter((line) => line !== "");

  let result: string[];
  switch (mode) {
    case "uniqueInFirstList":
      result = arrayDiff(arrayUnique(arrayDiff(first, second)), [""]);
      break;
    case "uniqueInSecondList":
      result = arrayDiff(arrayUnique(arrayDiff(second, first)), [""]);
      break;
    case "union":
      result = arrayDiff(arrayUnique([...first, ...second]), [""]);
      break;
    case "unique":
    default:
      result = arrayDiff(arrayUnique(arrayIntersect(first, second)), [""]);
      break;
  }

  if (opts.sortResult) {
    result.sort((a, b) => a.localeCompare(b, "ru", { sensitivity: "base" }));
  }

  const text = result.join("\n");
  return {
    text,
    metrics: {
      linesA: countNonEmptyLines(listA),
      linesB: countNonEmptyLines(listB),
      resultLines: countNonEmptyLines(text),
      overlap: overlapLines.length,
    },
  };
}
