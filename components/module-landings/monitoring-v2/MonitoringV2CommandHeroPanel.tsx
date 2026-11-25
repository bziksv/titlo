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
      className="relative mx-auto min-w-0 w-full max-w-xl lg:mx-0 lg:max-w-none lg:overflow-visible lg:pl-16 lg:perspective-[1200px] xl:pl-20"
      style={{
        transform: panelTransform,
        transition: reduceMotion || !canTiltPanel ? undefined : "transform 0.15s ease-out",
      }}
    >
      {/* <lg: чипы над мокапом — иначе overflow обрезает и они наезжают на карточку */}
      <div className="mb-3 flex flex-wrap gap-2 lg:hidden">
        {panelChips.map((c) => (
          <span key={c.label} className={chipClass(c.tone)}>
            {c.label}
          </span>
        ))}
      </div>

      {/* lg+: стикеры слева от мокапа, вне карточки */}
      <div className="pointer-events-none absolute left-0 top-5 z-30 hidden w-max flex-col gap-2.5 lg:flex xl:left-1">
        {panelChips.map((c) => (
          <span key={c.label} className={chipClass(c.tone)}>
            {c.label}
          </span>
        ))}
      </div>

      {keys && (
        <div className="relative z-10 overflow-hidden rounded-xl border border-white/20 bg-white shadow-2xl shadow-black/60 ring-1 ring-white/15">
          <div
            className={`relative w-full bg-slate-100 ${
              keys.src.includes("site-audit-shot") ||
              keys.src.includes("relevance-shot") ||
              keys.src.includes("phrase-commerce-shot") ||
              keys.src.includes("pw-gen-shot") ||
              keys.src.includes("domain-records-shot") ||
              keys.src.includes("domain-reg-shot") ||
              keys.src.includes("link-track-shot") ||
              keys.src.includes("text-length-shot") ||
              keys.src.includes("list-compare-shot") ||
              keys.src.includes("dedup-shot") ||
              keys.src.includes("site-types-shot") ||
              keys.src.includes("html-editor-shot") ||
              keys.src.includes("http-headers-shot") ||
              keys.src.includes("utm-shot") ||
              keys.src.includes("esenin-shot") ||
              keys.src.includes("cluster-shot") ||
              keys.src.includes("meta-tags-shot") ||
              keys.src.includes("monitoring-v2-shot")
                ? "aspect-[16/10] min-h-[200px]"
                : "aspect-[739/385] min-h-[180px] sm:min-h-[200px]"
            }`}
          >
            <Image
              src={keys.src}
              alt={keys.caption}
              fill
              className={
                keys.src.includes("site-audit-shot") ||
                keys.src.includes("relevance-shot") ||
                keys.src.includes("phrase-commerce-shot") ||
                keys.src.includes("pw-gen-shot") ||
                keys.src.includes("domain-records-shot") ||
                keys.src.includes("domain-reg-shot") ||
                keys.src.includes("link-track-shot") ||
                keys.src.includes("text-length-shot") ||
                keys.src.includes("list-compare-shot") ||
                keys.src.includes("dedup-shot") ||
                keys.src.includes("site-types-shot") ||
                keys.src.includes("html-editor-shot") ||
                keys.src.includes("http-headers-shot") ||
                keys.src.includes("utm-shot") ||
              keys.src.includes("esenin-shot") ||
                keys.src.includes("cluster-shot") ||
                keys.src.includes("meta-tags-shot") ||
                keys.src.includes("monitoring-v2-shot")
                  ? "object-contain object-top"
                  : "object-cover object-left-top"
              }
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
          <div
            className={`relative w-full bg-slate-50 ${
              dynamics.src.includes("site-audit-shot") ||
              dynamics.src.includes("relevance-shot") ||
              dynamics.src.includes("phrase-commerce-shot") ||
              dynamics.src.includes("pw-gen-shot") ||
              dynamics.src.includes("domain-records-shot") ||
              dynamics.src.includes("domain-reg-shot") ||
              dynamics.src.includes("link-track-shot") ||
              dynamics.src.includes("text-length-shot") ||
              dynamics.src.includes("list-compare-shot") ||
              dynamics.src.includes("dedup-shot") ||
              dynamics.src.includes("site-types-shot") ||
              dynamics.src.includes("html-editor-shot") ||
              dynamics.src.includes("http-headers-shot") ||
              dynamics.src.includes("utm-shot") ||
              dynamics.src.includes("esenin-shot") ||
              dynamics.src.includes("cluster-shot") ||
              dynamics.src.includes("meta-tags-shot") ||
              dynamics.src.includes("monitoring-v2-shot")
                ? "aspect-[16/9] min-h-[120px]"
                : "aspect-[1024/260] min-h-[88px] sm:min-h-[110px]"
            }`}
          >
            <Image
              src={dynamics.src}
              alt={dynamics.caption}
              fill
              className={
                dynamics.src.includes("site-audit-shot") ||
                dynamics.src.includes("relevance-shot") ||
                dynamics.src.includes("phrase-commerce-shot") ||
                dynamics.src.includes("pw-gen-shot") ||
                dynamics.src.includes("domain-records-shot") ||
                dynamics.src.includes("domain-reg-shot") ||
                dynamics.src.includes("link-track-shot") ||
                dynamics.src.includes("text-length-shot") ||
                dynamics.src.includes("list-compare-shot") ||
                dynamics.src.includes("dedup-shot") ||
                dynamics.src.includes("site-types-shot") ||
                dynamics.src.includes("html-editor-shot") ||
                dynamics.src.includes("http-headers-shot") ||
                dynamics.src.includes("utm-shot") ||
              dynamics.src.includes("esenin-shot") ||
                dynamics.src.includes("cluster-shot") ||
                dynamics.src.includes("meta-tags-shot") ||
                dynamics.src.includes("monitoring-v2-shot")
                  ? "object-contain object-top"
                  : "object-cover object-left-top"
              }
              sizes="(max-width: 1024px) 90vw, 520px"
            />
          </div>
          <div className="bg-brand-600 px-3 py-2 text-xs font-medium text-white">{dynamicsFooter}</div>
        </div>
      )}
    </div>
  );
}

function chipClass(tone: "emerald" | "sky" | "amber"): string {
  const base =
    "inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-bold tracking-wide shadow-md";
  if (tone === "emerald") {
    return `${base} border-emerald-300/80 bg-emerald-100 text-emerald-950`;
  }
  if (tone === "sky") {
    return `${base} border-sky-300/80 bg-sky-100 text-sky-950`;
  }
  return `${base} border-amber-300/80 bg-amber-100 text-amber-950`;
}
