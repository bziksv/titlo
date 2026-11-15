import Link from "next/link";
import type { ReactNode } from "react";

const TOKEN = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

/** Минимальная инлайн-разметка контента словаря: **жирный** и [текст](/href/). */
export function RichText({ text }: { text: string }) {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(TOKEN)) {
    const i = m.index ?? 0;
    if (i > last) out.push(text.slice(last, i));
    if (m[1]) {
      out.push(
        <strong key={i} className="font-semibold text-slate-800">
          {m[1]}
        </strong>
      );
    } else {
      out.push(
        <Link key={i} href={m[3]} className="font-medium text-brand-600 underline-offset-2 hover:text-brand-700 hover:underline">
          {m[2]}
        </Link>
      );
    }
    last = i + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}
