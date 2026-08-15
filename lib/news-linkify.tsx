import type { ReactNode } from "react";
import { LK_URL } from "@/lib/site";

const LK = LK_URL.replace(/\/$/, "");

/** Известные фразы из новостей кабинета → URL. */
const PHRASE_LINKS: { re: RegExp; href: string }[] = [
  { re: /службу поддержки/gi, href: `${LK}/support` },
  { re: /раздел идей/gi, href: `${LK}/ideas` },
];

/**
 * URL в тексте новостей: https://…, cabinet.titlo.ru/…, titlo.ru/…
 * Хвостовую пунктуацию (. , ; :) оставляем снаружи ссылки.
 */
const URL_RE =
  /(?:https?:\/\/[^\s<]+)|(?:(?:cabinet\.)?titlo\.ru\/[^\s<]+)/gi;

function trimUrlMatch(raw: string): { href: string; trailing: string } {
  let url = raw;
  let trailing = "";
  while (/[.,;:!?)]$/.test(url) && !url.endsWith("/)")) {
    trailing = url.slice(-1) + trailing;
    url = url.slice(0, -1);
  }
  const href = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  return { href, trailing };
}

function linkClassName() {
  return "font-medium text-brand-600 underline underline-offset-2 hover:text-brand-700";
}

function linkifyUrls(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let i = 0;
  const re = new RegExp(URL_RE.source, "gi");
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      nodes.push(text.slice(last, m.index));
    }
    const { href, trailing } = trimUrlMatch(m[0]);
    nodes.push(
      <a
        key={`${keyPrefix}-u-${i++}`}
        href={href}
        className={linkClassName()}
        target="_blank"
        rel="noopener noreferrer"
      >
        {m[0].slice(0, m[0].length - trailing.length)}
      </a>
    );
    if (trailing) nodes.push(trailing);
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes.length ? nodes : [text];
}

function linkifyPhrases(text: string, keyPrefix: string): ReactNode[] {
  type Hit = { start: number; end: number; href: string; label: string };
  const hits: Hit[] = [];
  for (const { re, href } of PHRASE_LINKS) {
    const r = new RegExp(re.source, re.flags);
    let m: RegExpExecArray | null;
    while ((m = r.exec(text)) !== null) {
      hits.push({ start: m.index, end: m.index + m[0].length, href, label: m[0] });
    }
  }
  hits.sort((a, b) => a.start - b.start || b.end - a.end);
  const picked: Hit[] = [];
  let cursor = 0;
  for (const h of hits) {
    if (h.start < cursor) continue;
    picked.push(h);
    cursor = h.end;
  }
  if (!picked.length) return linkifyUrls(text, keyPrefix);

  const nodes: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const h of picked) {
    if (h.start > last) {
      nodes.push(...linkifyUrls(text.slice(last, h.start), `${keyPrefix}-p${i}`));
    }
    nodes.push(
      <a
        key={`${keyPrefix}-ph-${i++}`}
        href={h.href}
        className={linkClassName()}
        target="_blank"
        rel="noopener noreferrer"
      >
        {h.label}
      </a>
    );
    last = h.end;
  }
  if (last < text.length) {
    nodes.push(...linkifyUrls(text.slice(last), `${keyPrefix}-t`));
  }
  return nodes;
}

/** Рендер абзаца новости со кликабельными URL и типовыми ссылками кабинета. */
export function NewsLinkedText({ text, id }: { text: string; id: string }) {
  return <>{linkifyPhrases(text, id)}</>;
}
