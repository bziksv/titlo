"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Shots = readonly { src: string; caption: string }[];

type PanelChips = readonly { label: string; tone: "emerald" | "sky" | "amber" }[];

type Props = {
  shots: Shots;
  panelChips: PanelChips;
  keysFooter?: string;
  dynamicsFooter?: string;
};

/** Правая колонка hero: скрины и лёгкий 3D-tilt (client). */
export function MonitoringV2CommandHeroPanel({
  shots,
  panelChips,
  keysFooter = "Проект · ключи",
  dynamicsFooter = "Динамика · отчёт",
}: Props) {
  const [keys, dynamics] = shots;
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [reduceMotion, setReduceMotion] = useState(true);
  const [canTiltPanel, setCanTiltPanel] = useState(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setCanTiltPanel(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduceMotion || !canTiltPanel) return;
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setTilt({
        x: ((e.clientY - cy) / cy) * 3,
        y: ((e.clientX - cx) / cx) * -4,
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduceMotion, canTiltPanel]);

  const panelTransform =
    reduceMotion || !canTiltPanel ? undefined : `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`;

  return (
    <div
      className="relative mx-auto min-w-0 w-full max-w-xl overflow-hidden lg:mx-0 lg:max-w-none lg:overflow-visible lg:perspective-[1200px]"
      style={{
        transform: panelTransform,
        transition: reduceMotion || !canTiltPanel ? undefined : "transform 0.15s ease-out",
      }}
    >
      <div className="pointer-events-none absolute left-0 top-6 z-30 hidden flex-col gap-2 sm:flex lg:-left-2 lg:top-8">
        {panelChips.map((c) => (
          <span
            key={c.label}
            className={`rounded-lg border px-2.5 py-1 text-xs font-semibold shadow-lg backdrop-blur-md ${
              c.tone === "emerald"
                ? "border-emerald-400/30 bg-emerald-500/25 text-emerald-100"
                : c.tone === "sky"
                  ? "border-sky-400/30 bg-sky-500/25 text-sky-100"
                  : "border-amber-400/30 bg-amber-500/25 text-amber-100"
            }`}
          >
            {c.label}
          </span>
        ))}
      </div>

      {keys && (
        <div className="relative z-10 overflow-hidden rounded-xl border border-white/20 bg-white shadow-2xl shadow-black/60 ring-1 ring-white/15">
          <div className="relative aspect-[739/385] w-full min-h-[180px] bg-slate-100 sm:min-h-[200px]">
            <Image
              src={keys.src}
              alt={keys.caption}
              fill
              className="object-cover object-left-top"
              priority
              sizes="(max-width: 1024px) 100vw, 560px"
            />
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
            <span>{keysFooter}</span>
            <span className="font-mono font-semibold text-brand-600">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 align-middle motion-reduce:animate-none" />{" "}
              LIVE
            </span>
          </div>
        </div>
      )}
      {dynamics && (
        <div className="relative z-20 -mt-8 w-full max-w-full overflow-hidden rounded-xl border border-brand-400/50 bg-white shadow-2xl shadow-brand-900/50 sm:-mt-12 lg:-mt-20 lg:ml-12 lg:max-w-[92%]">
          <div className="relative aspect-[1024/260] w-full min-h-[88px] bg-slate-50 sm:min-h-[110px]">
            <Image
              src={dynamics.src}
              alt={dynamics.caption}
              fill
              className="object-cover object-left-top"
              sizes="(max-width: 1024px) 90vw, 520px"
            />
          </div>
          <div className="bg-brand-600 px-3 py-2 text-xs font-medium text-white">{dynamicsFooter}</div>
        </div>
      )}
    </div>
  );
}
