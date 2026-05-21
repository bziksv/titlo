"use client";

type Props = {
  items: readonly string[];
  className?: string;
};

/** Бегущая строка фич под hero (волна 1). */
export function FeatureMarquee({ items, className = "" }: Props) {
  const row = [...items, ...items];

  return (
    <div
      className={`group relative overflow-hidden border-y border-white/15 py-3 ${className}`}
      aria-hidden
    >
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap px-4 text-sm font-medium text-brand-100 group-hover:[animation-play-state:paused]">
        {row.map((item, i) => (
          <span key={`${item}-${i}`} className="inline-flex items-center gap-2">
            <span className="text-brand-300/80">◆</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
