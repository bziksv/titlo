"use client";

import { useEffect, useMemo, useState } from "react";

export type TocItem = { id: string; label: string };

/**
 * Подсвечивает раздел в зоне чтения. IntersectionObserver сообщает, что раздел пересёк «линию чтения»
 * (≈30% высоты окна); активным считается последний раздел, чей верх выше этой линии, иначе — первый.
 * Меняются только цвета — размеры не меняются, CLS нет.
 */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string>(ids[0] ?? "");
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    if (!els.length || typeof IntersectionObserver === "undefined") return;
    const compute = () => {
      const line = window.innerHeight * 0.3;
      let current = els[0].id;
      for (const el of els) {
        if (el.getBoundingClientRect().top <= line) current = el.id;
        else break;
      }
      setActive(current);
    };
    const io = new IntersectionObserver(compute, { rootMargin: "0px 0px -70% 0px", threshold: [0, 1] });
    els.forEach((el) => io.observe(el));
    compute();
    return () => io.disconnect();
  }, [ids]);
  return active;
}

/** Доля прочитанного article[data-glossary-term] (0…1). */
function useReadingProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const article = document.querySelector<HTMLElement>("[data-glossary-term]");
    if (!article) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = article.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      setP(total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return p;
}

function TocList({ items, active, onNavigate }: { items: TocItem[]; active: string; onNavigate?: () => void }) {
  return (
    <ol className="mt-3 space-y-0.5 text-sm">
      {items.map((t, i) => {
        const on = t.id === active;
        return (
          <li key={t.id}>
            <a
              href={`#${t.id}`}
              onClick={onNavigate}
              aria-current={on ? "location" : undefined}
              className={`flex items-start gap-2.5 rounded-lg border-l-2 px-2.5 py-1.5 transition-colors ${
                on ? "border-brand-600 bg-brand-50 font-semibold text-brand-700" : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span
                className={`mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[0.7rem] font-bold tabular-nums ${
                  on ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {i + 1}
              </span>
              <span className="min-w-0">{t.label}</span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}

/** Боковое оглавление (desktop): sticky-карточка с номерами, подсветкой и прогрессом чтения. */
export function GlossaryTocSidebar({ items }: { items: TocItem[] }) {
  const ids = useMemo(() => items.map((i) => i.id), [items]);
  const active = useActiveSection(ids);
  const progress = useReadingProgress();
  return (
    <nav aria-label="Содержание" className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Содержание</p>
        <span className="text-xs tabular-nums text-slate-400">{Math.round(progress * 100)}%</span>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100" aria-hidden>
        <div className="h-full origin-left rounded-full bg-brand-600" style={{ transform: `scaleX(${progress})` }} />
      </div>
      <TocList items={items} active={active} />
    </nav>
  );
}

/** Мобильное оглавление: сворачиваемый блок «Содержание». */
export function GlossaryTocMobile({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(false);
  return (
    <details
      open={open}
      onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
      className="group rounded-2xl border border-slate-200 bg-white shadow-sm lg:hidden"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2">
          <svg viewBox="0 0 20 20" className="h-4 w-4 text-brand-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="M4 5h12M4 10h12M4 15h8" />
          </svg>
          Содержание
          <span className="text-sm font-normal text-slate-400">· {items.length}</span>
        </span>
        <svg viewBox="0 0 20 20" className="h-4 w-4 text-slate-500 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5 8l5 5 5-5" />
        </svg>
      </summary>
      <div className="border-t border-slate-100 px-2 pb-3">
        <TocList items={items} active="" onNavigate={() => setOpen(false)} />
      </div>
    </details>
  );
}
