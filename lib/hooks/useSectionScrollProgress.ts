"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Прогресс 0→1, пока секция проходит через viewport.
 * 0 — верх секции у нижнего края экрана, 1 — низ секции у верхнего края.
 */
export function useSectionScrollProgress(ref: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const update = () => {
      if (reduced) {
        setProgress(0);
        return;
      }
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const current = vh - rect.top;
      setProgress(Math.min(1, Math.max(0, current / total)));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ref]);

  return progress;
}
