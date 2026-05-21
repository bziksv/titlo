"use client";

import { useEffect, useState } from "react";

type Props = {
  scenarios: readonly string[];
  intervalMs?: number;
};

/** Ротатор сценариев в подзаголовке hero (волна 1, AIC/Nota). */
export function HeroScenarioRotator({ scenarios, intervalMs = 3200 }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (scenarios.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % scenarios.length), intervalMs);
    return () => clearInterval(id);
  }, [scenarios.length, intervalMs]);

  return (
    <span className="inline-block min-w-[12ch] border-b border-brand-300/50 text-brand-50 transition-opacity duration-500">
      {scenarios[index]}
    </span>
  );
}
