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
  "Длина Title, Description и H1",
  "Предложения, абзацы, время чтения",
  "До 38 600 символов в кабинете",
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

function SeoRow({
  label,
  chars,
  ok,
  recommended,
}: {
  label: string;
  chars: number | null;
  ok: boolean | null;
  recommended: string;
}) {
  if (chars === null) {
    return (
      <div className="flex justify-between gap-4 text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-slate-500">—</span>
      </div>
    );
  }
  const tone = ok ? "text-emerald-700" : "text-amber-800";
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      <span className={`font-mono font-semibold tabular-nums ${tone}`}>
        {chars} <span className="text-xs font-normal text-slate-500">({recommended})</span>
      </span>
    </div>
  );
}

export function TextLengthDemoWidget() {
  const textareaId = useId();
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [h1, setH1] = useState("");
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
        h1: h1.trim() || undefined,
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
  }, [text, title, description, h1, result]);

  const summary = result?.result.summary;
  const seo = result?.result.seo;
  const extended = result?.result.extended;

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
      lead="Полный отчёт — символы, SEO-поля и структура текста. В демо лимит 2 000 символов и 5 проверок в сутки."
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

      <p className="mt-4 text-xs font-medium text-slate-600">SEO-поля (необязательно)</p>
      <div className="mt-2 grid gap-4 sm:grid-cols-3">
        <div>
          <label className="text-xs font-medium text-slate-600">Title</label>
          <input
            type="text"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Заголовок страницы"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Description</label>
          <input
            type="text"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Мета-описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">H1</label>
          <input
            type="text"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Заголовок на странице"
            value={h1}
            onChange={(e) => setH1(e.target.value)}
          />
        </div>
      </div>

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
            setH1("");
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

          {seo && (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-slate-900">SEO-мета</h3>
              <div className="mt-3 space-y-2">
                <SeoRow label="Title" chars={seo.title_chars} ok={seo.title_ok} recommended="до 60" />
                <SeoRow label="Description" chars={seo.description_chars} ok={seo.description_ok} recommended="до 160" />
                <SeoRow label="H1" chars={seo.h1_chars} ok={null} recommended="контроль заголовка" />
              </div>
            </div>
          )}

          {extended && (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-slate-900">Структура текста</h3>
              <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <dt className="text-xs text-slate-500">Предложений</dt>
                  <dd className="text-xl font-bold tabular-nums text-brand-700">{extended.sentences}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Абзацев</dt>
                  <dd className="text-xl font-bold tabular-nums text-brand-700">{extended.paragraphs}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Время чтения</dt>
                  <dd className="text-xl font-bold tabular-nums text-brand-700">{extended.reading_time_min} мин</dd>
                </div>
              </dl>
            </div>
          )}
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
            upgradeHint={`В кабинете — до ${FULL_MAX_CHARS.toLocaleString("ru-RU")} символов за проверку, те же SEO-поля и отчёт без лимита демо.`}
          />
        </div>
      )}
    </DemoWidgetShell>
  );
}
