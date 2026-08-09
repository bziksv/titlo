"use client";

import { useEffect, useState } from "react";

const NAV = [
  "Релевантность",
  "Позиции",
  "Конкуренты",
  "Кластеризатор",
  "Мониторинг сайтов",
] as const;

const ROWS = [
  { q: "купить металлопрокат москва", y: 4, g: 7, delta: "+2" },
  { q: "профнастил с8 цена", y: 9, g: 12, delta: "−1" },
  { q: "трубы профильные оптом", y: 3, g: 5, delta: "+3" },
  { q: "сетка рабица купить", y: 14, g: 18, delta: "0" },
  { q: "арматура а500с", y: 6, g: 8, delta: "+1" },
] as const;

const FIXES = [
  { word: "металлопрокат", note: "мало в H2 и тексте" },
  { word: "доставка", note: "есть у 8 из 10 в ТОП" },
  { word: "прайс", note: "переспам в title" },
] as const;

/** Плотный макет кабинета для hero — вместо слабого кропа таблицы. */
export function HomeHeroStage() {
  const [reduceMotion, setReduceMotion] = useState(true);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setTilt({
        x: ((e.clientY - cy) / cy) * 2.2,
        y: ((e.clientX - cx) / cx) * -3,
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduceMotion]);

  return (
    <div
      className="home-hero-stage relative mx-auto w-full max-w-[540px] lg:max-w-none lg:perspective-[1400px]"
      style={
        reduceMotion
          ? undefined
          : {
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: "transform 0.12s ease-out",
            }
      }
    >
      <div className="home-hero-stage__panel relative z-10 overflow-hidden rounded-2xl border border-white/20 bg-[#0b1220] shadow-[0_40px_90px_-20px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
        <div className="flex items-center gap-2 border-b border-white/10 bg-[#111827] px-3 py-2.5">
          <span className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </span>
          <span className="ml-2 truncate font-mono text-[11px] text-slate-400">
            cabinet.titlo.ru · позиции
          </span>
          <span className="ml-auto flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
            <span className="home-hero-live h-1.5 w-1.5 rounded-full bg-emerald-400" />
            live
          </span>
        </div>

        <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[118px_1fr]">
          <aside className="border-r border-white/10 bg-[#0a101c] px-2 py-3">
            <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-brand-300">
              Титло
            </p>
            <ul className="space-y-0.5">
              {NAV.map((item, i) => (
                <li key={item}>
                  <span
                    className={`block truncate rounded-md px-2 py-1.5 text-[11px] ${
                      i === 1
                        ? "bg-brand-600/90 font-semibold text-white"
                        : "text-slate-400"
                    }`}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </aside>

          <div className="min-w-0 bg-[#f8fafc] p-3 sm:p-3.5">
            <div className="mb-2.5 flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="text-[11px] font-semibold text-slate-500">Проект</p>
                <p className="text-sm font-bold text-slate-900">metplus-vrn.ru</p>
              </div>
              <div className="flex gap-3 text-center">
                <div>
                  <p className="text-lg font-bold tabular-nums text-brand-700">38%</p>
                  <p className="text-[10px] text-slate-500">в ТОП‑10</p>
                </div>
                <div>
                  <p className="text-lg font-bold tabular-nums text-emerald-600">+12</p>
                  <p className="text-[10px] text-slate-500">за неделю</p>
                </div>
              </div>
            </div>

            <div className="mb-2.5 h-14 overflow-hidden rounded-lg bg-gradient-to-t from-brand-100 to-white px-2 pt-2">
              <svg
                viewBox="0 0 220 40"
                className="h-full w-full"
                preserveAspectRatio="none"
                aria-hidden
              >
                <polyline
                  fill="none"
                  stroke="#2f5de0"
                  strokeWidth="2.2"
                  points="0,32 30,28 55,30 80,22 110,18 140,20 170,12 200,10 220,8"
                />
                <polyline
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="1.6"
                  opacity="0.7"
                  points="0,34 40,30 90,26 130,22 180,16 220,14"
                />
              </svg>
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <table className="w-full text-left text-[10px] sm:text-[11px]">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-2 py-1.5 font-semibold">Запрос</th>
                    <th className="px-1.5 py-1.5 font-semibold">Я</th>
                    <th className="px-1.5 py-1.5 font-semibold">G</th>
                    <th className="px-2 py-1.5 font-semibold">Δ</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row) => (
                    <tr key={row.q} className="border-t border-slate-100 text-slate-800">
                      <td className="max-w-[8.5rem] truncate px-2 py-1.5 font-medium sm:max-w-none">
                        {row.q}
                      </td>
                      <td className="px-1.5 py-1.5 tabular-nums font-semibold">{row.y}</td>
                      <td className="px-1.5 py-1.5 tabular-nums">{row.g}</td>
                      <td
                        className={`px-2 py-1.5 tabular-nums font-semibold ${
                          row.delta.startsWith("+")
                            ? "text-emerald-600"
                            : row.delta.startsWith("−")
                              ? "text-rose-600"
                              : "text-slate-500"
                        }`}
                      >
                        {row.delta}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="home-hero-stage__float absolute -bottom-5 -left-1 z-20 w-[min(100%,250px)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-black/30 sm:-bottom-7 sm:-left-5 sm:w-[270px] lg:-left-8">
        <div className="border-b border-slate-100 bg-brand-50 px-3 py-2">
          <p className="text-[11px] font-bold text-brand-800">Релевантность · что править</p>
          <p className="text-[10px] text-slate-500">сравнение с ТОП‑10 · Москва</p>
        </div>
        <ul className="divide-y divide-slate-100">
          {FIXES.map((f) => (
            <li key={f.word} className="flex items-start gap-2 px-3 py-2">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              <span>
                <span className="block text-xs font-semibold text-slate-900">{f.word}</span>
                <span className="text-[10px] text-slate-500">{f.note}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
