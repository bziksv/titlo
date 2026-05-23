"use client";

import { useCallback, useId, useState } from "react";
import { DemoUpgradePanel } from "@/components/demo/DemoUpgradePanel";
import { DemoWidgetShell } from "@/components/demo/DemoWidgetShell";
import { DEMO_MAX_CHARS, FULL_MAX_CHARS } from "@/lib/demo/text-length-demo";
import { runTextLengthDemo } from "@/lib/demo/run-text-length-client";
import type { TextLengthDemoResult } from "@/lib/demo/types";

const PLACEHOLDER = `Вставьте текст — в демо до ${DEMO_MAX_CHARS.toLocaleString("ru-RU")} символов. В кабинете — до ${FULL_MAX_CHARS.toLocaleString("ru-RU")}.`;

const DEMO_FEATURES = [
  "Символы с пробелами и без",
  "Количество слов и строк",
  "Подсчёт пробелов",
  "Title и Description (в кабинете)",
  "Время чтения и структура текста",
] as const;

type StatCard = { label: string; value: number | string };

function StatGrid({ stats }: { stats: StatCard[] }) {
  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-xl border border-brand-100 bg-gradient-to-b from-brand-50 to-white px-4 py-3 shadow-sm"
        >
          <dt className="text-xs font-medium text-slate-500">{s.label}</dt>
          <dd className="mt-1 text-2xl font-bold tabular-nums text-brand-700">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function LockedMetricsBlock() {
  const rows = [
    { label: "Длина Title", hint: "рекомендация до 60 знаков" },
    { label: "Длина Description", hint: "рекомендация до 160 знаков" },
    { label: "Длина H1", hint: "контроль заголовка страницы" },
    { label: "Предложения и абзацы", hint: "структура текста" },
    { label: "Время чтения", hint: "оценка для лонгридов" },
  ];

  return (
    <div className="relative overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50/80 p-4">
      <div className="pointer-events-none space-y-3 blur-[6px] select-none" aria-hidden>
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between gap-4 text-sm">
            <span className="font-medium text-slate-700">{r.label}</span>
            <span className="font-mono text-brand-600">•••</span>
          </div>
        ))}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 px-4 text-center backdrop-blur-[2px]">
        <p className="text-sm font-semibold text-slate-900">Расширенный отчёт в личном кабинете</p>
        <p className="mt-1 max-w-md text-xs text-slate-600">
          Title, Description, H1, предложения, абзацы и время чтения — после регистрации.
        </p>
      </div>
    </div>
  );
}

export function TextLengthDemoWidget() {
  const textareaId = useId();
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<TextLengthDemoResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const charCount = text.length;
  const overLimit = charCount > DEMO_MAX_CHARS;

  const runDemo = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await runTextLengthDemo({
        text,
        title: title.trim() || undefined,
        description: description.trim() || undefined,
      });
      if (!res.ok) {
        setError(res.error.message ?? "Не удалось выполнить подсчёт");
        if (res.status === 429 && result) {
          setResult({ ...result, remaining: 0 });
        }
        return;
      }
      setResult(res.data);
    } finally {
      setLoading(false);
    }
  }, [text, title, description, result]);

  const summary = result?.result.summary;
  const stats: StatCard[] = summary
    ? [
        { label: "Символов с пробелами", value: summary.chars_with_spaces },
        { label: "Символов без пробелов", value: summary.chars_no_spaces },
        { label: "Слов", value: summary.words },
        { label: "Строк", value: summary.lines },
        { label: "Пробелов", value: summary.spaces },
      ]
    : [];

  return (
    <DemoWidgetShell
      title="Вставьте текст для подсчёта"
      lead="Базовая статистика — сразу. SEO-поля и расширенный отчёт — после регистрации в кабинете."
      features={DEMO_FEATURES}
      badge={
        result ? (
          <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800">
            Демо-режим
          </span>
        ) : undefined
      }
    >
      <label className="block text-sm font-medium text-slate-700" htmlFor={textareaId}>
        Текст для проверки
      </label>
      <textarea
        id={textareaId}
        className={`mt-2 min-h-[140px] w-full rounded-xl border bg-slate-50/50 px-4 py-3 text-sm text-slate-800 shadow-inner focus:bg-white focus:outline-none focus:ring-2 ${
          overLimit
            ? "border-amber-400 focus:border-amber-500 focus:ring-amber-200"
            : "border-slate-300 focus:border-brand-600 focus:ring-brand-200"
        }`}
        placeholder={PLACEHOLDER}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <p className={`mt-1 text-xs ${overLimit ? "font-medium text-amber-700" : "text-slate-500"}`}>
        {charCount.toLocaleString("ru-RU")} / {DEMO_MAX_CHARS.toLocaleString("ru-RU")} символов в демо
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-slate-600">Title (опционально)</label>
          <input
            type="text"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Заголовок страницы"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Description (опционально)</label>
          <input
            type="text"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Мета-описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
      <p className="mt-1 text-xs text-slate-500">Длина title и description считается в полной версии модуля.</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void runDemo()}
          disabled={loading || !text.trim() || overLimit}
          className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-brand-600/25 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          {loading ? "Считаем…" : "Посчитать в демо"}
        </button>
        <button
          type="button"
          onClick={() => {
            setText("");
            setTitle("");
            setDescription("");
            setResult(null);
            setError(null);
          }}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Очистить
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900" role="alert">
          {error}
        </p>
      )}

      {summary && (
        <div className="mt-8 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Базовый отчёт</h3>
            <div className="mt-3">
              <StatGrid stats={stats} />
            </div>
          </div>
          <LockedMetricsBlock />
        </div>
      )}

      {result && (
        <div className="mt-6">
          <DemoUpgradePanel
            registerUrl={result.upgrade.register_url}
            remaining={result.remaining}
            maxRuns={result.limits.max_runs_per_day}
            fullMaxChars={result.limits.full_max_chars}
            moduleTitle="подсчёта длины текста"
          />
        </div>
      )}
    </DemoWidgetShell>
  );
}
