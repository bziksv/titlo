"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { RevealOnScroll } from "@/components/module-landings/RevealOnScroll";

const NODES = [
  { label: "Релевантность", href: "/analiz-relevantnosti/", role: "ТОП и правки текста" },
  { label: "Конкуренты", href: "/analiz-konkurentov/", role: "Карта ниши" },
  { label: "Позиции", href: "/monitoring-pozicii-sayta/", role: "Динамика по ключам" },
  { label: "Кластеризатор", href: "/klasterizator-klyuchevykh-slov/", role: "Структура ядра" },
] as const;

export function HomeEcosystemOrbit() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setActive(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const [top, right, bottom, left] = NODES;

  return (
    <section className="overflow-hidden bg-slate-50 py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <RevealOnScroll>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Связка модулей</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
            Один кабинет — цепочка от семантики до отчёта
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            Модули не изолированы: ядро, анализ, мониторинг и экспорт — без выгрузки в сторонние сервисы.
          </p>
        </RevealOnScroll>

        <div ref={wrapRef} className={`relative mx-auto mt-10 max-w-2xl ${active ? "home-orbit-active" : ""}`}>
          <div className="relative hidden min-h-[280px] lg:block">
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden
            >
              {[
                { x2: 50, y2: 8 },
                { x2: 92, y2: 50 },
                { x2: 50, y2: 92 },
                { x2: 8, y2: 50 },
              ].map((line, i) => (
                <line
                  key={i}
                  x1="50"
                  y1="50"
                  x2={line.x2}
                  y2={line.y2}
                  className={`home-orbit-line ${active ? "home-orbit-line--drawn" : ""}`}
                  style={{ animationDelay: `${i * 120}ms` }}
                />
              ))}
              <circle cx="50" cy="50" r="6" className="home-orbit-hub" />
            </svg>

            <div className="absolute left-1/2 top-0 w-[168px] -translate-x-1/2">
              <OrbitCard node={top} delay={0} />
            </div>
            <div className="absolute right-0 top-1/2 w-[168px] -translate-y-1/2">
              <OrbitCard node={right} delay={100} />
            </div>
            <div className="absolute bottom-0 left-1/2 w-[168px] -translate-x-1/2">
              <OrbitCard node={bottom} delay={200} />
            </div>
            <div className="absolute left-0 top-1/2 w-[168px] -translate-y-1/2">
              <OrbitCard node={left} delay={300} />
            </div>

            <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-xl border-2 border-brand-500 bg-white px-4 py-2 text-center shadow-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">Хаб</span>
              <p className="text-sm font-bold text-slate-900">Титло</p>
            </div>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2 lg:hidden">
            {NODES.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-300 hover:shadow-md"
                >
                  <span className="font-bold text-brand-700">{n.label}</span>
                  <p className="mt-1 text-sm text-slate-600">{n.role}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function OrbitCard({ node, delay }: { node: (typeof NODES)[number]; delay: number }) {
  return (
    <Link
      href={node.href}
      className="home-orbit-card block rounded-lg border border-slate-200 bg-white p-2.5 text-center shadow-sm transition hover:border-brand-400 hover:shadow-md"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="text-sm font-bold text-brand-700">{node.label}</span>
      <p className="mt-0.5 text-xs leading-snug text-slate-600">{node.role}</p>
    </Link>
  );
}
