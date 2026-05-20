"use client";

import { useRef, type ReactNode } from "react";
import { useParallaxOffset } from "@/lib/hooks/useParallaxOffset";

type Props = {
  children: ReactNode;
};

/** Скрин в hero слегка «плывёт» при скролле (заметный parallax) */
export function HeroParallaxMedia({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const y = useParallaxOffset(ref, -0.18);

  return (
    <div
      ref={ref}
      className="will-change-transform transition-none"
      style={{ transform: `translate3d(0, ${y}px, 0)` }}
    >
      {children}
    </div>
  );
}
