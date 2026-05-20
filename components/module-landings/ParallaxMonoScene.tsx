"use client";

import { useEffect, useRef } from "react";

type Props = {
  align?: "spread" | "right";
};

/** Декор hero: движение привязано к scroll (rect.top), не к прогрессу 0–1 */
export function ParallaxMonoScene({ align = "spread" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const section = el.closest("section");
    let raf = 0;

    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!section) return;
        const k = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0.4 : 1;
        const top = section.getBoundingClientRect().top * k;
        el.style.setProperty("--py1", `${top * 0.42}px`);
        el.style.setProperty("--py2", `${top * 0.24}px`);
        el.style.setProperty("--px1", `${top * 0.08}px`);
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const rootClass =
    align === "right"
      ? "pointer-events-none absolute inset-y-0 right-0 w-full max-w-[62%]"
      : "pointer-events-none absolute inset-0";

  return (
    <div ref={ref} className={rootClass} aria-hidden>
      <div
        className="absolute inset-[-20%] opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          transform: "translate3d(0, var(--py2, 0px), 0)",
        }}
      />
      <div
        className="absolute right-6 top-[18%] h-48 w-48 rounded-full border-2 border-white/20 bg-brand-500/25"
        style={{ transform: "translate3d(var(--px1, 0px), var(--py1, 0px), 0)" }}
      />
      <div
        className="absolute bottom-[12%] right-[18%] h-36 w-36 rotate-12 rounded-3xl border-2 border-white/15 bg-brand-600/30"
        style={{
          transform:
            "translate3d(calc(var(--px1, 0px) * -1.5), calc(var(--py1, 0px) * 0.65), 0)",
        }}
      />
      {align === "right" && (
        <div
          className="absolute right-[8%] top-[22%] hidden font-mono text-xs leading-relaxed text-white/40 lg:block"
          style={{ transform: "translate3d(0, calc(var(--py2, 0px) * 1.8), 0)" }}
        >
          {["топ‑10", "тлп", "релевантность", "мета", "серп"].map((w) => (
            <div
              key={w}
              className="mb-1.5 rounded-lg border border-white/15 bg-brand-900/60 px-2.5 py-1 backdrop-blur-sm"
            >
              {w}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
