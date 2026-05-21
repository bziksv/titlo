"use client";

import { useEffect, useRef, useState } from "react";

type Stat = { value: string; label: string };

function parseNumeric(value: string): { num: number; suffix: string } | null {
  const m = value.match(/^(\d+)\s*(.*)$/);
  if (!m) return null;
  const suffix = m[2]?.trim();
  return { num: Number(m[1]), suffix: suffix ? ` ${suffix}` : "" };
}

function StatValue({ value, active }: { value: string; active: boolean }) {
  const parsed = parseNumeric(value);
  const [num, setNum] = useState<number | null>(null);
  const ran = useRef(false);

  useEffect(() => {
    if (!parsed || !active || ran.current) return;
    ran.current = true;
    const target = parsed.num;
    const t0 = performance.now();
    const duration = 1000;
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
    return () => cancelAnimationFrame(frame);
  }, [active, parsed]);

  if (!parsed) return <>{value}</>;
  if (!active || num === null) return <>{value}</>;
  return (
    <>
      {num}
      {parsed.suffix}
    </>
  );
}

type Props = {
  stats: readonly Stat[];
};

/** Сетка stats: count-up только для чистых чисел; до скролла — финальные значения. */
export function AnimatedStatsGrid({ stats }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="border-b border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white px-6 py-8 text-center">
            <div className="text-2xl font-bold tabular-nums text-brand-700 md:text-3xl">
              <StatValue value={s.value} active={active} />
            </div>
            <p className="mt-2 text-sm text-slate-600">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
