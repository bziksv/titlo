"use client";

import { useCallback, useId, useState } from "react";
import { DemoToggleSwitch } from "@/components/demo/DemoToggleSwitch";
import { DemoUpgradePanel } from "@/components/demo/DemoUpgradePanel";
import { DemoWidgetShell } from "@/components/demo/DemoWidgetShell";
import {
  countLinesForDisplay,
  DEMO_MAX_CHARS,
  DEMO_MAX_LINES,
} from "@/lib/demo/dedup-demo";
import { runDedupDemo } from "@/lib/demo/run-dedup-demo-client";
import type { DedupDemoOptionsInput, DedupDemoResult } from "@/lib/demo/types";

const PLACEHOLDER = `Вставьте список — по одной строке на элемент.\n\nПример:\nкупить телефон\nкупить телефон\nзаказать доставку`;

const DEMO_FEATURES = [
  "Удаление дубликатов",
  "Trim и пустые строки",
  "Нижний регистр и ё→е",
  "Пробелы и табы",
  "Сравнение до и после",
  "KPI: было / стало / удалено",
] as const;

const LOCKED_ROWS = [
  { label: "Без учёта регистра", hint: "Key = key при dedupe" },
  { label: "Сортировка А→Я", hint: "после обработки" },
  { label: "Символы в начале/конце слова", hint: "свой набор +-! .!?" },
  { label: "Пресеты SEO-списка", hint: "одним кликом" },
  { label: "Загрузка .txt", hint: "drag & drop" },
] as const;

type OptionKey = keyof DedupDemoOptionsInput;

const DEMO_OPTIONS: { key: OptionKey; label: string }[] = [
  { key: "removeDuplicates", label: "Удалить дубликаты" },
  { key: "trim", label: "Trim строк" },
  { key: "removeEmptyRows", label: "Удалить пустые строки" },
  { key: "lowerCase", label: "Нижний регистр" },
  { key: "removeExtraSpace", label: "Схлопнуть двойные пробелы" },
  { key: "replaceTabWithSpace", label: "Табы → пробелы" },
  { key: "replaceUmlaut", label: "Замена ё→е" },
];

const DEFAULT_OPTIONS: DedupDemoOptionsInput = {
  removeDuplicates: true,
  trim: false,
  removeEmptyRows: false,
  lowerCase: false,
  removeExtraSpace: false,
  replaceTabWithSpace: false,
  replaceUmlaut: false,
};

function StatGrid({ metrics }: { metrics: DedupDemoResult["result"]["metrics"] }) {
  const items = [
    { label: "Было строк", value: metrics.before },
    { label: "Стало строк", value: metrics.after },
    { label: "Дублей убрано", value: metrics.dupRemoved },
    { label: "Пустых убрано", value: metrics.emptyRemoved },
  ];
  return (
    <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((s) => (
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

function BeforeAfterPanels({ before, after }: { before: string; after: string }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">До обработки</p>
        <textarea
          readOnly
          className="mt-2 min-h-[180px] w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-700"
          value={before}
          aria-label="Список до обработки"
        />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">После обработки</p>
        <textarea
          readOnly
          className="mt-2 min-h-[180px] w-full resize-y rounded-xl border border-brand-200 bg-brand-50/40 px-4 py-3 font-mono text-sm text-slate-800"
          value={after}
          aria-label="Список после обработки"
        />
      </div>
    </div>
  );
}

function LockedCabinetBlock() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50/80 p-4">
      <p className="mb-3 text-sm font-semibold text-slate-900">Только в личном кабинете</p>
      <div className="pointer-events-none space-y-2 blur-[5px] select-none" aria-hidden>
        {LOCKED_ROWS.map((r) => (
          <div key={r.label} className="flex justify-between gap-4 text-sm">
            <span className="font-medium text-slate-700">{r.label}</span>
            <span className="text-slate-400">{r.hint}</span>
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-center bg-gradient-to-t from-white via-white/90 to-transparent px-4 pb-4 pt-10">
        <p className="max-w-md text-center text-xs text-slate-600">
          Регистрация бесплатна — расширенные фильтры, пресеты SEO и загрузка .txt без лимитов демо.
        </p>
      </div>
    </div>
  );
}

export function DuplicatesDemoWidget() {
  const textareaId = useId();
  const [text, setText] = useState("");
  const [options, setOptions] = useState<DedupDemoOptionsInput>(DEFAULT_OPTIONS);
  const [result, setResult] = useState<DedupDemoResult | null>(null);
  const [beforeText, setBeforeText] = useState<string | null>(null);
  const [afterText, setAfterText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const charCount = text.length;
  const lineCount = countLinesForDisplay(text);
  const overChars = charCount > DEMO_MAX_CHARS;
  const overLines = lineCount > DEMO_MAX_LINES;

  const setOption = (key: OptionKey, checked: boolean) => {
    setOptions((prev) => ({ ...prev, [key]: checked }));
  };

  const runDemo = useCallback(async () => {
    setError(null);
    setLoading(true);
    const snapshot = text;
    try {
      const res = await runDedupDemo({ text: snapshot, options });
      if (!res.ok) {
        setError(res.error.message ?? "Не удалось обработать список");
        if (res.status === 429 && result) {
          setResult({ ...result, remaining: 0 });
        }
        return;
      }
      setResult(res.data);
      setBeforeText(snapshot);
      setAfterText(res.data.result.text);
    } finally {
      setLoading(false);
    }
  }, [text, options, result]);

  const copyResult = async () => {
    const payload = afterText ?? text;
    if (!payload.trim()) return;
    try {
      await navigator.clipboard.writeText(payload);
    } catch {
      /* ignore */
    }
  };

  const reset = () => {
    setText("");
    setOptions(DEFAULT_OPTIONS);
    setResult(null);
    setBeforeText(null);
    setAfterText(null);
    setError(null);
  };

  return (
    <DemoWidgetShell
      title="Вставьте список и уберите дубликаты"
      lead="7 базовых фильтров и сравнение до/после — сразу в браузере. Расширенные опции и большие списки — в кабинете после регистрации."
      features={DEMO_FEATURES}
      badge={
        result ? (
          <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800">
            Демо-режим
          </span>
        ) : undefined
      }
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">Шаг 1 — список</p>
      <label className="mt-2 block text-sm font-medium text-slate-700" htmlFor={textareaId}>
        Ваш текст
      </label>
      <textarea
        id={textareaId}
        className={`mt-2 min-h-[160px] w-full rounded-xl border bg-slate-50/50 px-4 py-3 font-mono text-sm text-slate-800 shadow-inner focus:bg-white focus:outline-none focus:ring-2 ${
          overChars || overLines
            ? "border-amber-400 focus:border-amber-500 focus:ring-amber-200"
            : "border-slate-300 focus:border-brand-600 focus:ring-brand-200"
        }`}
        placeholder={PLACEHOLDER}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          if (beforeText !== null || afterText !== null) {
            setBeforeText(null);
            setAfterText(null);
            setResult(null);
          }
        }}
      />
      <p className={`mt-1 text-xs ${overChars || overLines ? "font-medium text-amber-700" : "text-slate-500"}`}>
        {lineCount.toLocaleString("ru-RU")} строк · {charCount.toLocaleString("ru-RU")} /{" "}
        {DEMO_MAX_CHARS.toLocaleString("ru-RU")} символов в демо
      </p>

      <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-brand-600">Шаг 2 — фильтры</p>
      <div className="mt-3 grid gap-1 sm:grid-cols-2">
        {DEMO_OPTIONS.map(({ key, label }) => (
          <DemoToggleSwitch
            key={key}
            id={`dedup-demo-${key}`}
            label={label}
            checked={!!options[key]}
            onChange={(checked) => setOption(key, checked)}
          />
        ))}
      </div>

      <div className="mt-6">
        <LockedCabinetBlock />
      </div>

      <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-brand-600">Шаг 3 — обработка</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void runDemo()}
          disabled={loading || !text.trim() || overChars || overLines}
          className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-brand-600/25 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          {loading ? "Обрабатываем…" : "Удалить дубликаты в демо"}
        </button>
        <button
          type="button"
          onClick={() => void copyResult()}
          disabled={!(afterText ?? text).trim()}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Копировать результат
        </button>
        <button
          type="button"
          onClick={reset}
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

      {result?.result.metrics && beforeText !== null && afterText !== null && (
        <div className="mt-8 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Сводка</h3>
            <div className="mt-3">
              <StatGrid metrics={result.result.metrics} />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">Сравнение до и после</h3>
            <p className="mt-1 text-sm text-slate-600">
              Исходный список слева, очищенный — справа. Как в модуле кабинета.
            </p>
            <div className="mt-4">
              <BeforeAfterPanels before={beforeText} after={afterText} />
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-6">
          <DemoUpgradePanel
            registerUrl={result.upgrade.register_url}
            remaining={result.remaining}
            maxRuns={result.limits.max_runs_per_day}
            fullMaxChars={DEMO_MAX_CHARS}
            moduleTitle="удаления дубликатов"
            upgradeHint="В кабинете — все 9+ фильтров, пресеты SEO, загрузка .txt и списки без лимита демо."
          />
        </div>
      )}
    </DemoWidgetShell>
  );
}
