"use client";

import { useEffect, useRef, useState } from "react";

export function MonitoringV2CountUp({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  const parsed = /^(\d+)(.*)$/.exec(value);
  const ref = useRef<HTMLSpanElement>(null);
  const [num, setNum] = useState<number | null>(null);
  const ran = useRef(false);

  useEffect(() => {
    if (!parsed) return;
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || ran.current) return;
        ran.current = true;
        const target = Number(parsed[1]);
        const t0 = performance.now();
        const duration = 1100;
        let frame = 0;

        const tick = (now: number) => {
          const t = Math.min(1, (now - t0) / duration);
          const eased = 1 - (1 - t) ** 3;
          setNum(Math.round(target * eased));
          if (t < 1) frame = requestAnimationFrame(tick);
          else setNum(target);
        };
        setNum(0);
        frame = requestAnimationFrame(tick);
        obs.disconnect();
        return () => cancelAnimationFrame(frame);
      },
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [parsed]);

  if (!parsed) {
    return <span className={className}>{value}</span>;
  }

  const suffix = parsed[2] ?? "";
  const display = num === null ? value : `${num}${suffix}`;

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {display}
    </span>
  );
}
