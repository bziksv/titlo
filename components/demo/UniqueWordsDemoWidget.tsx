"use client";

import { useCallback, useId, useMemo, useState } from "react";
import { DemoModuleLinks } from "@/components/demo/DemoModuleLinks";
import { DemoUpgradePanel } from "@/components/demo/DemoUpgradePanel";
import { DemoWidgetShell } from "@/components/demo/DemoWidgetShell";
import { UNIQUE_WORDS_DEMO_EXAMPLE } from "@/lib/demo/demo-presets";
import { runUniqueWordsDemo } from "@/lib/demo/run-unique-words-demo-client";
import {
  buildUniqueWordsRegisterUrl,
  countNonEmptyLines,
  UNIQUE_WORDS_DEMO_MAX_CHARS,
  validateUniqueWordsContent,
  type UniqueWordsRow,
} from "@/lib/demo/unique-words-demo";

const PLACEHOLDER = `Список ключевых фраз — по одной на строку.\n\nпример:\nкупить телефон\nзаказать доставку телефона\nремонт смартфона`;

const DEMO_FEATURES = [
  "Морфология и словоформы",
  "Ключевые фразы вокруг слова",
  "Фильтр по числу вхождений",
  "KPI: фразы / слова / вхождения",
  "Копирование и CSV",
] as const;

type SortKey = "word" | "wordForms" | "count";

function StatGrid({
  phrases,
  uniqueWords,
  totalOccurrences,
}: {
  phrases: number;
  uniqueWords: number;
  totalOccurrences: number;
}) {
  const items = [
    { label: "Фраз в списке", value: phrases },
    { label: "Уникальных слов", value: uniqueWords },
    { label: "Сумма вхождений", value: totalOccurrences },
  ];
  return (
    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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

export function UniqueWordsDemoWidget() {
  const textareaId = useId();
  const [content, setContent] = useState("");
  const [rows, setRows] = useState<UniqueWordsRow[]>([]);
  const [metrics, setMetrics] = useState<{ phrases: number; uniqueWords: number; totalOccurrences: number } | null>(
    null
  );
  const [visibleCols, setVisibleCols] = useState({ word: true, wordForms: true, count: true, keyPhrases: true });
  const [rangeFrom, setRangeFrom] = useState("");
  const [rangeTo, setRangeTo] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("count");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const charCount = content.length;
  const overLimit = charCount > UNIQUE_WORDS_DEMO_MAX_CHARS;

  const displayRows = useMemo(() => {
    let list = [...rows];
    const from = rangeFrom ? parseInt(rangeFrom, 10) : 0;
    const to = rangeTo ? parseInt(rangeTo, 10) : 0;
    if (from > 0) list = list.filter((r) => r.count < from);
    if (to > 0) list = list.filter((r) => r.count > to);
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (r) =>
          r.word.toLowerCase().includes(q) ||
          r.wordForms.toLowerCase().includes(q) ||
          r.keyPhrases.toLowerCase().includes(q) ||
          String(r.count).includes(q)
      );
    }
    list.sort((a, b) => {
      const av = sortKey === "count" ? a.count : a[sortKey].toLowerCase();
      const bv = sortKey === "count" ? b.count : b[sortKey].toLowerCase();
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [rows, rangeFrom, rangeTo, sortKey, sortDir, searchQuery]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "count" ? "desc" : "asc");
    }
  };

  const runDemo = useCallback(async () => {
    setError(null);
    const validation = validateUniqueWordsContent(content);
    if (validation) {
      setError(validation);
      return;
    }
    setLoading(true);
    const res = await runUniqueWordsDemo(content);
    setLoading(false);
    if (!res.ok) {
      setError(res.error.message ?? "Ошибка демо");
      return;
    }
    setRows(res.data.result.rows);
    setMetrics(res.data.result.metrics);
    setRangeFrom("");
    setRangeTo("");
    setSearchQuery("");
  }, [content]);

  const copyTable = async () => {
    if (!displayRows.length) return;
    const lines = displayRows.map((row) => {
      const parts: string[] = [];
      if (visibleCols.word) parts.push(row.word);
      if (visibleCols.wordForms) parts.push(row.wordForms);
      if (visibleCols.count) parts.push(String(row.count));
      if (visibleCols.keyPhrases) parts.push(row.keyPhrases.replace(/\n/g, "; "));
      return parts.join("\t");
    });
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
    } catch {
      /* ignore */
    }
  };

  const downloadCsv = () => {
    if (!displayRows.length) return;
    const lines = displayRows.map((row) => {
      const parts: string[] = [];
      if (visibleCols.word) parts.push(row.word);
      if (visibleCols.wordForms) parts.push(row.wordForms);
      if (visibleCols.count) parts.push(String(row.count));
      if (visibleCols.keyPhrases) parts.push(row.keyPhrases.replace(/\n/g, "; "));
      return parts
        .map((cell) => (/[",\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell))
        .join(",");
    });
    const blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "unikalnye-slova-demo.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const fillExample = () => {
    setContent(UNIQUE_WORDS_DEMO_EXAMPLE);
    setRows([]);
    setMetrics(null);
    setError(null);
  };

  const reset = () => {
    setContent("");
    setRows([]);
    setMetrics(null);
    setError(null);
    setRangeFrom("");
    setRangeTo("");
    setSearchQuery("");
  };

  return (
    <DemoWidgetShell
      title="Выделите уникальные слова из списка фраз"
      lead="Морфология, словоформы и ключевые фразы — как в кабинете. В демо лимит только по символам."
      features={DEMO_FEATURES}
      badge={
        metrics ? (
          <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800">Демо-режим</span>
        ) : undefined
      }
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">Шаг 1 — список фраз</p>
      <label className="mt-3 block text-sm font-medium text-slate-700" htmlFor={textareaId}>
        Список ключевых фраз
      </label>
      <textarea
        id={textareaId}
        className={`mt-2 min-h-[140px] w-full rounded-xl border bg-slate-50/50 px-4 py-3 font-mono text-sm shadow-inner focus:bg-white focus:outline-none focus:ring-2 ${
          overLimit
            ? "border-amber-400 focus:border-amber-500 focus:ring-amber-200"
            : "border-slate-300 focus:border-brand-600 focus:ring-brand-200"
        }`}
        placeholder={PLACEHOLDER}
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setRows([]);
          setMetrics(null);
        }}
      />
      <p className={`mt-1 text-xs ${overLimit ? "font-medium text-amber-700" : "text-slate-500"}`}>
        {countNonEmptyLines(content)} строк · {charCount.toLocaleString("ru-RU")} /{" "}
        {UNIQUE_WORDS_DEMO_MAX_CHARS.toLocaleString("ru-RU")} символов в демо
      </p>
      <button
        type="button"
        onClick={fillExample}
        className="mt-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        Заполнить примером
      </button>

      <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-brand-600">Шаг 2 — обработка</p>
      <div className="mt-3 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void runDemo()}
          disabled={loading || overLimit || !content.trim()}
          className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-brand-600/25 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Обработка…" : "Обработать в демо"}
        </button>
        <button
          type="button"
          onClick={() => void copyTable()}
          disabled={!displayRows.length}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Копировать
        </button>
        <button
          type="button"
          onClick={downloadCsv}
          disabled={!displayRows.length}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Скачать CSV
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

      {metrics && (
        <div className="mt-8 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Сводка</h3>
            <div className="mt-3">
              <StatGrid
                phrases={metrics.phrases}
                uniqueWords={displayRows.length}
                totalOccurrences={displayRows.reduce((s, r) => s + r.count, 0)}
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">Фильтр и колонки</h3>
            <div className="mt-3 grid gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs text-slate-500" htmlFor="uw-demo-search">
                  Поиск по таблице
                </label>
                <input
                  id="uw-demo-search"
                  type="search"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Слово или фрагмент фразы"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap items-end gap-2">
                <div>
                  <label className="text-xs text-slate-500">Удалить, если вхождений ≥</label>
                  <input
                    type="number"
                    min={1}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    value={rangeFrom}
                    onChange={(e) => setRangeFrom(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">или ≤</label>
                  <input
                    type="number"
                    min={1}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    value={rangeTo}
                    onChange={(e) => setRangeTo(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-3 text-sm">
                {(
                  [
                    ["word", "Слово"],
                    ["wordForms", "Словоформы"],
                    ["count", "Вхождения"],
                    ["keyPhrases", "Ключевые фразы"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key} className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={visibleCols[key]}
                      onChange={(e) => setVisibleCols((v) => ({ ...v, [key]: e.target.checked }))}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {visibleCols.word && (
                    <th className="cursor-pointer px-3 py-2 text-left font-semibold" onClick={() => toggleSort("word")}>
                      Слово {sortKey === "word" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                    </th>
                  )}
                  {visibleCols.wordForms && (
                    <th
                      className="cursor-pointer px-3 py-2 text-left font-semibold"
                      onClick={() => toggleSort("wordForms")}
                    >
                      Словоформы {sortKey === "wordForms" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                    </th>
                  )}
                  {visibleCols.count && (
                    <th
                      className="cursor-pointer px-3 py-2 text-right font-semibold"
                      onClick={() => toggleSort("count")}
                    >
                      Вхождения {sortKey === "count" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                    </th>
                  )}
                  {visibleCols.keyPhrases && (
                    <th className="px-3 py-2 text-left font-semibold">Ключевые фразы</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {displayRows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-6 text-center text-slate-500">
                      Нет строк для выбранного фильтра.
                    </td>
                  </tr>
                ) : (
                  displayRows.map((row) => (
                    <tr key={row.word}>
                      {visibleCols.word && <td className="px-3 py-2 font-medium">{row.word}</td>}
                      {visibleCols.wordForms && <td className="px-3 py-2 text-slate-600">{row.wordForms}</td>}
                      {visibleCols.count && <td className="px-3 py-2 text-right tabular-nums">{row.count}</td>}
                      {visibleCols.keyPhrases && (
                        <td className="max-w-xs px-3 py-2">
                          <pre className="max-h-20 overflow-auto whitespace-pre-wrap font-mono text-xs text-slate-600">
                            {row.keyPhrases}
                          </pre>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <DemoUpgradePanel
            registerUrl={buildUniqueWordsRegisterUrl()}
            remaining={0}
            maxRuns={0}
            fullMaxChars={UNIQUE_WORDS_DEMO_MAX_CHARS}
            moduleTitle="выделения уникальных слов"
            showRemaining={false}
            upgradeHint="В кабинете — те же морфология и отчёт, списки без лимита по символам, drag & drop .txt и localStorage."
          />

          <DemoModuleLinks
            links={[
              { href: "/sravnenie-spiskov-klyuchevykh-fraz/", label: "Сравнение списков" },
              { href: "/udalenie-dublikatov/", label: "Удаление дубликатов" },
            ]}
          />
        </div>
      )}
    </DemoWidgetShell>
  );
}
