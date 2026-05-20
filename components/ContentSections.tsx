import Image from "next/image";
import { publicCopy } from "@/lib/public-copy";

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "img"; src: string; alt?: string };

export type Section = {
  title: string;
  /** @deprecated используйте blocks */
  paragraphs?: string[];
  blocks?: ContentBlock[];
};

type Props = {
  sections: Section[];
  className?: string;
};

function normalizeBlocks(section: Section): ContentBlock[] {
  if (section.blocks?.length) return section.blocks;
  return (section.paragraphs ?? []).map((text) => ({ type: "p" as const, text }));
}

function ContentBlockView({ block, index }: { block: ContentBlock; index: number }) {
  if (block.type === "p") {
    return (
      <p key={`p-${index}`} className="leading-relaxed text-slate-700">
        {publicCopy(block.text)}
      </p>
    );
  }
  if (block.type === "list") {
    return (
      <ul key={`list-${index}`} className="list-disc space-y-2 pl-5 text-slate-700">
        {block.items.map((item) => (
          <li key={item.slice(0, 40)} className="leading-relaxed">
            {publicCopy(item)}
          </li>
        ))}
      </ul>
    );
  }
  if (block.src.startsWith("/")) {
    return (
      <figure key={`img-${index}`} className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
        <div className="relative aspect-[16/10] w-full max-h-[420px]">
          <Image
            src={block.src}
            alt={block.alt || ""}
            fill
            className="object-contain p-2"
            sizes="(max-width: 768px) 100vw, 720px"
          />
        </div>
      </figure>
    );
  }
  return (
    <figure key={`img-${index}`} className="overflow-hidden rounded-xl border border-slate-200">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={block.src} alt={block.alt || ""} className="mx-auto max-h-[420px] w-full object-contain" loading="lazy" />
    </figure>
  );
}

/** Секции лендинга: заголовок + текст и иллюстрации */
export function ContentSections({ sections, className = "" }: Props) {
  if (!sections.length) return null;

  return (
    <div className={`prose-sections space-y-10 ${className}`}>
      {sections.map((section, idx) => {
        const blocks = normalizeBlocks(section);
        if (!blocks.length) return null;

        return (
          <section
            key={`${section.title}-${idx}`}
            className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8"
          >
            <h2 className="border-l-4 border-brand-500 pl-4 text-xl font-bold text-slate-900 md:text-2xl">
              {publicCopy(section.title)}
            </h2>
            <div className="mt-5 space-y-4">
              {blocks.map((block, i) => (
                <ContentBlockView key={`${section.title}-b-${i}`} block={block} index={i} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
