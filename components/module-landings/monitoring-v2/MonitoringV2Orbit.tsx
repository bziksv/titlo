"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { RevealOnScroll } from "@/components/module-landings/RevealOnScroll";
import { MonitoringV2SectionHeader } from "@/components/module-landings/monitoring-v2/MonitoringV2SectionHeader";

type Node = { label: string; href: string; role: string };

const ORBIT_LINES = [
  { x2: 50, y2: 12 },
  { x2: 88, y2: 50 },
  { x2: 50, y2: 88 },
  { x2: 12, y2: 50 },
] as const;

function OrbitNodeCard({
  node,
  active,
  delayMs,
  onHover,
  fullWidth,
}: {
  node: Node;
  active: boolean;
  delayMs: number;
  onHover?: (hovering: boolean) => void;
  fullWidth?: boolean;
}) {
  return (
    <Link
      href={node.href}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      className={`group relative z-10 block w-full rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm transition-[border-color,box-shadow,opacity] duration-300 hover:border-brand-400 hover:shadow-md lg:text-left ${
        fullWidth ? "max-w-none" : "max-w-[220px]"
      } ${active ? "opacity-100" : "opacity-50"}`}
      style={{ transitionDelay: active ? `${delayMs}ms` : "0ms" }}
    >
      <span className="font-bold text-brand-700 group-hover:underline">{node.label}</span>
      <p className="mt-1.5 text-sm leading-snug text-slate-600">{node.role}</p>
    </Link>
  );
}

function OrbitDiagram({ nodes, hubTitle }: { nodes: readonly Node[]; hubTitle: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [motion, setMotion] = useState(true);
  const [hoveredLine, setHoveredLine] = useState<number | "center" | null>(null);

  useEffect(() => {
    setMotion(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setActive(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const [top, right, bottom, left] = nodes;

  const lineClass = (index: number) => {
    const hot =
      hoveredLine === "center" || hoveredLine === index;
    const dim = hoveredLine !== null && !hot;
    return [
      "monitoring-v2-orbit-line",
      active && motion ? "monitoring-v2-orbit-line--drawn" : active ? "monitoring-v2-orbit-line--shown" : "",
      hot ? "monitoring-v2-orbit-line--hot" : "",
      dim ? "monitoring-v2-orbit-line--dim" : "",
    ]
      .filter(Boolean)
      .join(" ");
  };

  return (
    <div ref={wrapRef} className="relative mx-auto mt-16 hidden w-full max-w-3xl lg:block">
      <div className={`relative min-h-[440px] w-full ${active ? "monitoring-v2-orbit-active" : ""}`}>
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <defs>
            <marker
              id="monitoring-v2-orbit-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto"
            >
              <path d="M0,0 L10,5 L0,10 Z" fill="#2f5de0" />
            </marker>
          </defs>

          <ellipse className="monitoring-v2-orbit-ring" cx="50" cy="50" rx="36" ry="36" />

          {ORBIT_LINES.map((line, i) => (
            <line
              key={`line-${line.x2}-${line.y2}`}
              className={lineClass(i)}
              style={{ animationDelay: active && motion ? `${i * 0.18}s` : undefined }}
              x1="50"
              y1="50"
              x2={line.x2}
              y2={line.y2}
              markerEnd="url(#monitoring-v2-orbit-arrow)"
            />
          ))}

          {ORBIT_LINES.map((line, i) => (
            <circle
              key={`end-${line.x2}-${line.y2}`}
              cx={line.x2}
              cy={line.y2}
              r="2"
              className="monitoring-v2-orbit-endpoint"
              style={{ transitionDelay: active ? `${0.55 + i * 0.18}s` : undefined }}
            />
          ))}

          <circle cx="50" cy="50" r="2.5" className="monitoring-v2-orbit-hub" />
        </svg>

        <div className="grid h-full min-h-[440px] w-full grid-cols-[1fr_auto_1fr] grid-rows-[auto_1fr_auto] items-center justify-items-center gap-x-6 gap-y-4">
          <div className="col-start-2 row-start-1 flex justify-center self-end pb-2">
            {top && (
              <OrbitNodeCard
                node={top}
                active={active}
                delayMs={350}
                onHover={(h) => setHoveredLine(h ? 0 : null)}
              />
            )}
          </div>

          <div className="col-start-1 row-start-2 flex justify-end self-center pr-2">
            {left && (
              <OrbitNodeCard
                node={left}
                active={active}
                delayMs={800}
                onHover={(h) => setHoveredLine(h ? 3 : null)}
              />
            )}
          </div>

          <div
            className="col-start-2 row-start-2 relative z-10 flex w-[13.5rem] flex-col items-center justify-center self-center rounded-2xl border-2 border-brand-600 bg-brand-50 px-5 py-6 text-center shadow-lg transition-[box-shadow,border-color] duration-300 hover:border-brand-700 hover:shadow-xl"
            onMouseEnter={() => setHoveredLine("center")}
            onMouseLeave={() => setHoveredLine(null)}
          >
            <span className="text-lg font-bold leading-tight text-slate-900">{hubTitle}</span>
          </div>

          <div className="col-start-3 row-start-2 flex justify-start self-center pl-2">
            {right && (
              <OrbitNodeCard
                node={right}
                active={active}
                delayMs={500}
                onHover={(h) => setHoveredLine(h ? 1 : null)}
              />
            )}
          </div>

          <div className="col-start-2 row-start-3 flex justify-center self-start pt-2">
            {bottom && (
              <OrbitNodeCard
                node={bottom}
                active={active}
                delayMs={650}
                onHover={(h) => setHoveredLine(h ? 2 : null)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

type OrbitSection = {
  hubTitle: string;
  eyebrow: string;
  title: string;
  lead: string;
};

export function MonitoringV2Orbit({
  nodes,
  section = {
    hubTitle: "Мониторинг позиций",
    eyebrow: "Экосистема",
    title: "Мониторинг — узел, не остров",
    lead: "Позиции связаны с конкурентами, релевантностью, ссылками и техникой — переход в соседний модуль без смены платформы.",
  },
}: {
  nodes: readonly Node[];
  section?: OrbitSection;
}) {
  return (
    <section className="overflow-x-clip py-16 md:py-24">
      <div className="mx-auto min-w-0 max-w-6xl px-4">
        <RevealOnScroll>
          <MonitoringV2SectionHeader
            eyebrow={section.eyebrow}
            title={section.title}
            lead={section.lead}
          />
        </RevealOnScroll>

        <OrbitDiagram nodes={nodes} hubTitle={section.hubTitle} />

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:hidden">
          <li className="col-span-full rounded-2xl border-2 border-brand-600 bg-brand-50 p-6 text-center">
            <span className="block text-xl font-bold text-slate-900">{section.hubTitle}</span>
          </li>
          {nodes.map((n) => (
            <li key={n.href} className="min-w-0">
              <OrbitNodeCard node={n} active delayMs={0} fullWidth />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
