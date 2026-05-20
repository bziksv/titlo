"use client";

import { useEffect, useState, type RefObject } from "react";

/** Смещение в px: rect.top * speed (классический parallax при скролле). */
export function useParallaxOffset(
  ref: RefObject<HTMLElement | null>,
  speed = 0.35,
  enabled = true,
) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    let raf = 0;
    const motionScale = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0.4 : 1;

    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setOffset(el.getBoundingClientRect().top * speed * motionScale());
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
  }, [ref, speed, enabled]);

  return offset;
}
