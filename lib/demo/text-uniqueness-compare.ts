/** Сравнение текста с HTML одной страницы. Без запросов к выдаче — только для демо на сайте. */

const SHINGLE = 3;

export type TextUniquenessCompareResult = {
  uniqueness_pct: number;
  matched_pct: number;
  shingles_total: number;
  shingles_matched: number;
  samples: string[];
  url: string;
};

function words(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&[a-z]+;/g, " ")
    .replace(/[^a-zа-я0-9\s-]/gi, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 1);
}

function shingles(list: string[]): string[] {
  if (list.length < SHINGLE) return [];
  const out: string[] = [];
  for (let i = 0; i <= list.length - SHINGLE; i++) {
    out.push(list.slice(i, i + SHINGLE).join(" "));
  }
  return out;
}

export function compareTextWithHtml(text: string, html: string, url: string): TextUniquenessCompareResult {
  const source = shingles(words(text));
  const target = new Set(shingles(words(html)));
  const unique = [...new Set(source)];
  const matched = unique.filter((s) => target.has(s));
  const total = unique.length;
  const hit = matched.length;
  const matchedPct = total === 0 ? 0 : Math.round((hit / total) * 1000) / 10;
  return {
    uniqueness_pct: Math.round((100 - matchedPct) * 10) / 10,
    matched_pct: matchedPct,
    shingles_total: total,
    shingles_matched: hit,
    samples: matched.slice(0, 8),
    url,
  };
}

const BLOCKED_HOST = /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])$/i;

export function assertPublicHttpUrl(raw: string): URL {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    throw new Error("Укажите адрес страницы, например https://titlo.ru/about/");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Адрес должен начинаться с http:// или https://");
  }
  if (BLOCKED_HOST.test(url.hostname) || url.hostname.endsWith(".local")) {
    throw new Error("Этот адрес для демо недоступен. Укажите публичную страницу.");
  }
  if (/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.|169\.254\.)/.test(url.hostname)) {
    throw new Error("Этот адрес для демо недоступен. Укажите публичную страницу.");
  }
  return url;
}
