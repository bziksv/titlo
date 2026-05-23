"use client";

import { useCallback, useId, useState } from "react";
import { DemoUpgradePanel } from "@/components/demo/DemoUpgradePanel";
import { DemoWidgetShell } from "@/components/demo/DemoWidgetShell";
import {
  TextAnalyzerDemoSettings,
  type TextAnalyzerDemoSettingsState,
} from "@/components/demo/TextAnalyzerDemoSettings";
import { TextAnalyzerDemoReport } from "@/components/demo/TextAnalyzerDemoReport";
import {
  DEMO_MAX_CHARS,
  DEMO_MIN_CHARS,
} from "@/lib/demo/text-analyzer-demo";
import { runTextAnalyzerDemo } from "@/lib/demo/run-text-analyzer-client";
import type { TextAnalyzerDemoResult } from "@/lib/demo/types";

const TEXT_PLACEHOLDER = `Вставьте текст — в демо от ${DEMO_MIN_CHARS} до ${DEMO_MAX_CHARS.toLocaleString("ru-RU")} символов. Настройки как в кабинете: стоп-слова, сравнение с конкурентом и др.`;

const DEMO_FEATURES = [
  "Анализ текста или страницы по URL",
  "KPI, топ-слов, Ципф, облако",
  "noindex и alt/title (режим URL)",
  "Сравнение с конкурентом",
  "Спиральное облако как в кабинете",
] as const;

const DEFAULT_SETTINGS: TextAnalyzerDemoSettingsState = {
  mode: "text",
  excludeStopWords: true,
  noIndex: false,
  hiddenText: false,
  compareCompetitor: false,
  competitorUrl: "",
};

export function TextAnalyzerDemoWidget() {
  const textareaId = useId();
  const pageUrlId = useId();
  const [text, setText] = useState("");
  const [pageUrl, setPageUrl] = useState("");
  const [settings, setSettings] = useState<TextAnalyzerDemoSettingsState>(DEFAULT_SETTINGS);
  const [result, setResult] = useState<TextAnalyzerDemoResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isUrlMode = settings.mode === "url";
  const charCount = text.length;
  const overLimit = charCount > DEMO_MAX_CHARS;
  const underMin = charCount > 0 && charCount < DEMO_MIN_CHARS;
  const pageUrlMissing = isUrlMode && pageUrl.trim() === "";
  const compareUrlMissing =
    settings.compareCompetitor && settings.competitorUrl.trim() === "";

  const patchSettings = useCallback((patch: Partial<TextAnalyzerDemoSettingsState>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
    setResult(null);
    setError(null);
  }, []);

  const runDemo = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await runTextAnalyzerDemo({
        mode: settings.mode,
        text: isUrlMode ? undefined : text,
        url: isUrlMode ? pageUrl.trim() : undefined,
        exclude_stop_words: settings.excludeStopWords,
        no_index: isUrlMode ? settings.noIndex : false,
        hidden_text: isUrlMode ? settings.hiddenText : false,
        compare_competitor: settings.compareCompetitor,
        competitor_url: settings.compareCompetitor ? settings.competitorUrl.trim() : undefined,
      });
      if (!res.ok) {
        setError(res.error.message ?? "Не удалось выполнить анализ");
        if (res.status === 429 && result) {
          setResult({ ...result, remaining: 0 });
        }
        return;
      }
      setResult(res.data);
    } finally {
      setLoading(false);
    }
  }, [text, pageUrl, settings, isUrlMode, result]);

  const canRun =
    !loading &&
    !compareUrlMissing &&
    (isUrlMode ? !pageUrlMissing : Boolean(text.trim()) && !overLimit && !underMin);

  return (
    <DemoWidgetShell
      title={isUrlMode ? "Укажите URL и запустите анализ" : "Вставьте текст и запустите анализ"}
      lead="Те же переключатели, что в кабинете /text-analyzer: текст или URL, noindex, alt/title, сравнение с конкурентом."
      features={DEMO_FEATURES}
      badge={
        result ? (
          <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800">
            Демо-режим
          </span>
        ) : undefined
      }
    >
      {isUrlMode ? (
        <>
          <label className="block text-sm font-medium text-slate-700" htmlFor={pageUrlId}>
            URL страницы
          </label>
          <input
            id={pageUrlId}
            type="url"
            className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 shadow-inner focus:border-brand-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-200"
            placeholder="https://example.com/page"
            value={pageUrl}
            onChange={(e) => {
              setPageUrl(e.target.value);
              setResult(null);
              setError(null);
            }}
          />
          <p className="mt-1 text-xs text-slate-500">
            Страница загружается на сервере — как в кабинете. Включите noindex и alt/title в настройках ниже.
          </p>
        </>
      ) : (
        <>
          <label className="block text-sm font-medium text-slate-700" htmlFor={textareaId}>
            Текст для анализа
          </label>
          <textarea
            id={textareaId}
            className={`mt-2 min-h-[160px] w-full rounded-xl border bg-slate-50/50 px-4 py-3 text-sm text-slate-800 shadow-inner focus:bg-white focus:outline-none focus:ring-2 ${
              overLimit || underMin
                ? "border-amber-400 focus:border-amber-500 focus:ring-amber-200"
                : "border-slate-300 focus:border-brand-600 focus:ring-brand-200"
            }`}
            placeholder={TEXT_PLACEHOLDER}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setResult(null);
              setError(null);
            }}
          />
          <p
            className={`mt-1 text-xs ${overLimit || underMin ? "font-medium text-amber-700" : "text-slate-500"}`}
          >
            {charCount.toLocaleString("ru-RU")} / {DEMO_MAX_CHARS.toLocaleString("ru-RU")} символов в демо
            {charCount > 0 && charCount < DEMO_MIN_CHARS ? ` · минимум ${DEMO_MIN_CHARS}` : ""}
          </p>
        </>
      )}

      <TextAnalyzerDemoSettings value={settings} onChange={patchSettings} />

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void runDemo()}
          disabled={!canRun}
          className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-brand-600/25 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          {loading ? "Анализируем…" : "Анализировать в демо"}
        </button>
        <button
          type="button"
          onClick={() => {
            setText("");
            setPageUrl("");
            setSettings(DEFAULT_SETTINGS);
            setResult(null);
            setError(null);
          }}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Очистить
        </button>
      </div>

      {pageUrlMissing && isUrlMode ? (
        <p className="mt-3 text-xs text-amber-700">Укажите URL страницы для анализа.</p>
      ) : null}

      {compareUrlMissing ? (
        <p className="mt-3 text-xs text-amber-700">Включено сравнение с конкурентом — укажите URL страницы.</p>
      ) : null}

      {error && (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900" role="alert">
          {error}
        </p>
      )}

      {result && <TextAnalyzerDemoReport result={result.result} />}

      {result && (
        <div className="mt-6">
          <DemoUpgradePanel
            registerUrl={result.upgrade.register_url}
            remaining={result.remaining}
            maxRuns={result.limits.max_runs_per_day}
            fullMaxChars={result.limits.full_max_chars}
            moduleTitle="анализа текста"
            upgradeHint="В кабинете — все строки таблиц, облака ссылок и «обе зоны», полное сравнение Ципфа и облаков, словоформы и PDF-отчёт."
          />
        </div>
      )}
    </DemoWidgetShell>
  );
}
