import Image from "next/image";
import type { ContentBlock, Section } from "@/components/ContentSections";
import { displaySectionTitle, prepareModuleSections } from "@/lib/content/normalize-module-sections";

type Props = {
  sections: Section[];
};

function BlockText({ block }: { block: ContentBlock }) {
  if (block.type === "p") {
    return <p className="text-base leading-relaxed text-slate-600 md:text-[1.0625rem]">{block.text}</p>;
  }
  if (block.type === "list") {
    return (
      <ul className="space-y-3">
        {block.items.map((item, i) => (
          <li key={item.slice(0, 48)} className="flex gap-3 text-slate-700">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
              {i + 1}
            </span>
            <span className="pt-0.5 leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    );
  }
  return null;
}

function BlockImage({ block, priority }: { block: ContentBlock; priority?: boolean }) {
  if (block.type !== "img") return null;
  const className =
    "overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-lg shadow-slate-200/60 ring-1 ring-slate-100";

  if (block.src.startsWith("/")) {
    return (
      <figure className={className}>
        <div className="relative aspect-[16/10] w-full bg-gradient-to-b from-slate-50 to-white">
          <Image
            src={block.src}
            alt={block.alt || ""}
            fill
            className="object-contain p-3 md:p-4"
            sizes="(max-width: 1024px) 100vw, 560px"
            priority={priority}
          />
        </div>
      </figure>
    );
  }
  return (
    <figure className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={block.src}
        alt={block.alt || ""}
        className="mx-auto max-h-[420px] w-full object-contain p-4"
        loading={priority ? "eager" : "lazy"}
      />
    </figure>
  );
}

export function ModuleContent({ sections }: Props) {
  const prepared = prepareModuleSections(sections);
  if (!prepared.length) return null;

  return (
    <div className="module-content space-y-14 md:space-y-20">
      {prepared.map((section, idx) => {
        const blocks = section.blocks ?? [];
        const images = blocks.filter((b): b is ContentBlock & { type: "img" } => b.type === "img");
        const textBlocks = blocks.filter((b) => b.type !== "img");
        const title = displaySectionTitle(section.title);
        const flip = idx % 2 === 1 && images.length > 0;

        if (images.length === 0) {
          return (
            <article
              key={`${section.title}-${idx}`}
              className="mx-auto max-w-3xl rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm md:p-10"
            >
              <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">{title}</h2>
              {section.title !== title && (
                <p className="sr-only">{section.title}</p>
              )}
              <div className="mt-6 space-y-4">
                {textBlocks.map((b, i) => (
                  <BlockText key={`t-${idx}-${i}`} block={b} />
                ))}
              </div>
            </article>
          );
        }

        return (
          <article
            key={`${section.title}-${idx}`}
            className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm"
          >
            <div
              className={`grid gap-0 lg:grid-cols-2 lg:gap-0 ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}
            >
              <div className="flex flex-col justify-center p-6 md:p-10 lg:min-h-[280px]">
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-2 text-xl font-bold leading-snug text-slate-900 md:text-2xl">{title}</h2>
                <div className="mt-5 space-y-4">
                  {textBlocks.map((b, i) => (
                    <BlockText key={`t-${idx}-${i}`} block={b} />
                  ))}
                </div>
              </div>
              <div className="flex flex-col justify-center bg-gradient-to-br from-brand-50/80 via-slate-50 to-white p-4 md:p-8">
                {images.map((img, i) => (
                  <BlockImage key={`img-${idx}-${i}`} block={img} priority={idx === 0 && i === 0} />
                ))}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
