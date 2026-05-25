"use client";

import { useCallback, useId, useState } from "react";
import { DemoModuleLinks } from "@/components/demo/DemoModuleLinks";
import { DemoToggleSwitch } from "@/components/demo/DemoToggleSwitch";
import { DemoUpgradePanel } from "@/components/demo/DemoUpgradePanel";
import { DemoWidgetShell } from "@/components/demo/DemoWidgetShell";
import {
  LIST_COMPARE_DEMO_EXAMPLE_A,
  LIST_COMPARE_DEMO_EXAMPLE_B,
} from "@/lib/demo/demo-presets";
import {
  buildListCompareRegisterUrl,
  LIST_COMPARE_DEMO_MAX_CHARS,
  validateListLength,
} from "@/lib/demo/list-comparison-demo";
import {
  compareLists,
  countNonEmptyLines,
  type ListCompareMode,
  type ListCompareOptions,
} from "@/lib/demo/list-comparison-process";

const PLACEHOLDER_A = `Список A — по строке на фразу.\n\nпример:\nкупить телефон\nзаказать доставку\nкупить телефон`;

const PLACEHOLDER_B = `Список B — по строке на фразу.\n\nпример:\nкупить телефон\nремонт телефона\nаксессуары`;

const DEMO_FEATURES = [
  "4 режима сравнения",
  "Trim и пустые строки",
  "Без учёта регистра",
  "Сортировка результата",
  "KPI: A / B / результат / пересечение",
] as const;

const MODES: { value: ListCompareMode; label: string; hint: string }[] = [
  {
    value: "unique",
    label: "Пересечение",
    hint: "Фразы, которые есть в обоих списках",
  },
  {
    value: "uniqueInFirstList",
    label: "Только в A",
    hint: "Есть в первом списке, нет во втором",
  },
  {
    value: "uniqueInSecondList",
    label: "Только в B",
    hint: "Есть во втором списке, нет в первом",
  },
  {
    value: "union",
    label: "Объединение",
    hint: "Все уникальные фразы из обоих списков",
  },
];

const DEFAULT_OPTIONS: ListCompareOptions = {
  trim: true,
  removeEmpty: true,
  caseInsensitive: false,
  sortResult: false,
};

function StatGrid({ metrics }: { metrics: ReturnType<typeof compareLists>["metrics"] }) {
  const items = [
    { label: "Список A", value: metrics.linesA },
    { label: "Список B", value: metrics.linesB },
    { label: "В результате", value: metrics.resultLines },
    { label: "Пересечение", value: metrics.overlap },
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

export function ListComparisonDemoWidget() {
  const idA = useId();
  const idB = useId();
  const idResult = useId();
  const [listA, setListA] = useState("");
  const [listB, setListB] = useState("");
  const [mode, setMode] = useState<ListCompareMode>("unique");
  const [options, setOptions] = useState<ListCompareOptions>(DEFAULT_OPTIONS);
  const [result, setResult] = useState<ReturnType<typeof compareLists> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const charsA = listA.length;
  const charsB = listB.length;
  const overA = charsA > LIST_COMPARE_DEMO_MAX_CHARS;
  const overB = charsB > LIST_COMPARE_DEMO_MAX_CHARS;

  const setOption = <K extends keyof ListCompareOptions>(key: K, value: ListCompareOptions[K]) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const runDemo = useCallback(() => {
    setError(null);
    if (!listA.trim() || !listB.trim()) {
      setError("Заполните оба списка.");
      setResult(null);
      return;
    }
    const errA = validateListLength(listA, "Список A");
    const errB = validateListLength(listB, "Список B");
    if (errA || errB) {
      setError(errA ?? errB ?? "Превышен лимит символов");
      return;
    }
    setResult(compareLists(listA, listB, mode, options));
  }, [listA, listB, mode, options]);

  const copyResult = async () => {
    if (!result?.text.trim()) return;
    try {
      await navigator.clipboard.writeText(result.text);
    } catch {
      /* ignore */
    }
  };

  const swapLists = () => {
    setListA(listB);
    setListB(listA);
    setResult(null);
    setError(null);
  };

  const reset = () => {
    setListA("");
    setListB("");
    setMode("unique");
    setOptions(DEFAULT_OPTIONS);
    setResult(null);
    setError(null);
  };

  const fillExample = () => {
    setListA(LIST_COMPARE_DEMO_EXAMPLE_A);
    setListB(LIST_COMPARE_DEMO_EXAMPLE_B);
    setResult(null);
    setError(null);
  };

  const lineCountHint = (text: string, chars: number) =>
    `${countNonEmptyLines(text)} строк · ${chars.toLocaleString("ru-RU")} / ${LIST_COMPARE_DEMO_MAX_CHARS.toLocaleString("ru-RU")} символов в демо`;

  return (
    <DemoWidgetShell
      title="Сравните два списка фраз"
      lead="Все 4 режима и опции — как в кабинете. В демо лимит только по символам в каждом списке."
      features={DEMO_FEATURES}
      badge={
        result ? (
          <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800">
            Демо-режим
          </span>
        ) : undefined
      }
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">Шаг 1 — два списка</p>
      <div className="mt-3 grid gap-4 lg:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor={idA}>
            Список A
          </label>
          <textarea
            id={idA}
            className={`mt-2 min-h-[140px] w-full rounded-xl border bg-slate-50/50 px-4 py-3 font-mono text-sm shadow-inner focus:bg-white focus:outline-none focus:ring-2 ${
              overA
                ? "border-amber-400 focus:border-amber-500 focus:ring-amber-200"
                : "border-slate-300 focus:border-brand-600 focus:ring-brand-200"
            }`}
            placeholder={PLACEHOLDER_A}
            value={listA}
            onChange={(e) => {
              setListA(e.target.value);
              setResult(null);
            }}
          />
          <p className={`mt-1 text-xs ${overA ? "font-medium text-amber-700" : "text-slate-500"}`}>
            {lineCountHint(listA, charsA)}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor={idB}>
            Список B
          </label>
          <textarea
            id={idB}
            className={`mt-2 min-h-[140px] w-full rounded-xl border bg-slate-50/50 px-4 py-3 font-mono text-sm shadow-inner focus:bg-white focus:outline-none focus:ring-2 ${
              overB
                ? "border-amber-400 focus:border-amber-500 focus:ring-amber-200"
                : "border-slate-300 focus:border-brand-600 focus:ring-brand-200"
            }`}
            placeholder={PLACEHOLDER_B}
            value={listB}
            onChange={(e) => {
              setListB(e.target.value);
              setResult(null);
            }}
          />
          <p className={`mt-1 text-xs ${overB ? "font-medium text-amber-700" : "text-slate-500"}`}>
            {lineCountHint(listB, charsB)}
          </p>
        </div>
      </div>

      <div className="mt-3">
        <button
          type="button"
          onClick={fillExample}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Заполнить примером
        </button>
      </div>

      <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-brand-600">Шаг 2 — режим и опции</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {MODES.map((m) => (
          <label
            key={m.value}
            className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition ${
              mode === m.value
                ? "border-brand-400 bg-brand-50/60 ring-1 ring-brand-200"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <input
              type="radio"
              name="lc-demo-mode"
              className="mt-1"
              checked={mode === m.value}
              onChange={() => setMode(m.value)}
            />
            <span>
              <span className="block text-sm font-semibold text-slate-900">{m.label}</span>
              <span className="block text-xs text-slate-500">{m.hint}</span>
            </span>
          </label>
        ))}
      </div>

      <div className="mt-4 grid gap-1 sm:grid-cols-2">
        <DemoToggleSwitch
          id="lc-demo-trim"
          label="Trim строк"
          checked={options.trim}
          onChange={(checked) => setOption("trim", checked)}
        />
        <DemoToggleSwitch
          id="lc-demo-empty"
          label="Удалить пустые строки"
          checked={options.removeEmpty}
          onChange={(checked) => setOption("removeEmpty", checked)}
        />
        <DemoToggleSwitch
          id="lc-demo-ci"
          label="Без учёта регистра"
          checked={options.caseInsensitive}
          onChange={(checked) => setOption("caseInsensitive", checked)}
        />
        <DemoToggleSwitch
          id="lc-demo-sort"
          label="Сортировка A→Z"
          checked={options.sortResult}
          onChange={(checked) => setOption("sortResult", checked)}
        />
      </div>

      <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-brand-600">Шаг 3 — сравнение</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void runDemo()}
          disabled={overA || overB || !listA.trim() || !listB.trim()}
          className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-brand-600/25 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Сравнить в демо
        </button>
        <button
          type="button"
          onClick={swapLists}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Поменять A ↔ B
        </button>
        <button
          type="button"
          onClick={() => void copyResult()}
          disabled={!result?.text.trim()}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Копировать
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

      {result && (
        <div className="mt-8 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Сводка</h3>
            <div className="mt-3">
              <StatGrid metrics={result.metrics} />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-900" htmlFor={idResult}>
              Результат
            </label>
            {result.text.trim() === "" && (
              <p className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                Нет строк для выбранного режима. Проверьте регистр и опции trim.
              </p>
            )}
            <textarea
              id={idResult}
              readOnly
              className="mt-3 min-h-[160px] w-full resize-y rounded-xl border border-brand-200 bg-brand-50/40 px-4 py-3 font-mono text-sm text-slate-800"
              value={result.text}
            />
          </div>

          <DemoUpgradePanel
            registerUrl={buildListCompareRegisterUrl()}
            remaining={0}
            maxRuns={0}
            fullMaxChars={LIST_COMPARE_DEMO_MAX_CHARS}
            moduleTitle="сравнения списков"
            showRemaining={false}
            upgradeHint="В кабинете — те же 4 режима и опции, списки без лимита по символам, drag & drop .txt и localStorage."
          />

          <DemoModuleLinks
            links={[
              { href: "/vydelenie-unikalnykh-slov-v-tekste/", label: "Уникальные слова" },
              { href: "/udalenie-dublikatov/", label: "Удаление дубликатов" },
            ]}
          />
        </div>
      )}
    </DemoWidgetShell>
  );
}
