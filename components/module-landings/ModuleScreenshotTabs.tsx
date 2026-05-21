"use client";

import Image from "next/image";
import { useState } from "react";

type Shot = {
  src: string;
  caption: string;
  tab: string;
  /** Tailwind aspect ratio, напр. aspect-[16/10] или aspect-[4/1] для широких скринов */
  aspect?: string;
};

type Props = {
  shots: readonly Shot[];
};

/** Табы сценариев UI — переключение крупных скринов LK. */
export function ModuleScreenshotTabs({ shots }: Props) {
  const [active, setActive] = useState(0);
  const shot = shots[active] ?? shots[0];
  const aspect = shot.aspect ?? "aspect-[16/10]";

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
      <div className="flex flex-wrap gap-2 border-b border-slate-100 bg-slate-50 px-3 py-3">
        {shots.map((s, i) => (
          <button
            key={s.tab}
            type="button"
            onClick={() => setActive(i)}
            className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
              i === active
                ? "bg-white text-brand-700 shadow-sm ring-1 ring-brand-200"
                : "text-slate-600 hover:bg-white/80 hover:text-slate-900"
            }`}
          >
            {s.tab}
          </button>
        ))}
      </div>
      <figure>
        <div className={`relative w-full min-h-[280px] bg-slate-100 md:min-h-[360px] ${aspect}`}>
          <Image
            src={shot.src}
            alt={shot.caption}
            fill
            className="object-contain object-left-top p-2 md:p-4"
            sizes="(max-width: 1024px) 100vw, 960px"
            priority={active === 0}
          />
        </div>
        <figcaption className="border-t border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          {shot.caption}
        </figcaption>
      </figure>
    </div>
  );
}
