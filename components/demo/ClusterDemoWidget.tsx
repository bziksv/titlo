"use client";

import { useCallback, useId, useMemo, useState } from "react";
import { ClusterDemoCapabilities } from "@/components/demo/ClusterDemoCapabilities";
import { ClusterDemoReport } from "@/components/demo/ClusterDemoReport";
import { DemoUpgradePanel } from "@/components/demo/DemoUpgradePanel";
import { DemoWidgetShell } from "@/components/demo/DemoWidgetShell";
import {
  CLUSTER_DEMO_DEFAULT_LEVEL,
  CLUSTER_DEMO_DEFAULT_REGION,
  CLUSTER_DEMO_MAX_PHRASES,
  CLUSTER_DEMO_MIN_PHRASES,
  CLUSTER_DEMO_MODULE,
  CLUSTER_DEMO_SAMPLE,
} from "@/lib/demo/cluster-demo";
import { runClusterDemoWithPoll } from "@/lib/demo/run-cluster-demo-client";
import type { ClusterDemoResponse } from "@/lib/demo/types";
import { LK_URL } from "@/lib/site";

const DEMO_FEATURES = [
  "Живой парсинг ТОП-10 Яндекса",
  "Группировка по пересечению URL",
  "Жёсткость: Soft / Light в демо",
  "До 10 фраз · 2 запуска в день",
] as const;

const CABINET_UPGRADE_DETAILS = [
  "«Мои проекты» — сохранение прогонов, комментарии, возврат к результату",
  "Hard и Pre-hard, частотность Wordstat, релевантность URL, конкуренты по фразам",
  "ТОП до 50, classic / professional, экспорт CSV и XLS, Telegram",
] as const;

const FALLBACK_REGISTER_URL = `${LK_URL}/register?module=${CLUSTER_DEMO_MODULE}&from=demo`;

const FALLBACK_REGIONS = [
  { id: "213", label: "Москва" },
  { id: "2", label: "Санкт-Петербург" },
  { id: "193", label: "Воронеж" },
];

const FALLBACK_LEVELS = [
  { value: "soft", label: "Soft (рекомендуемый)" },
  { value: "light", label: "Light" },
];

/** Только в кабинете — показываем в select как disabled с замком */
const LOCKED_LEVELS = [
  { value: "pre-hard", label: "Pre-hard (60%)" },
  { value: "hard", label: "Hard (70%)" },
] as const;

function countPhrases(text: string): number {
  return text
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean).length;
}

export function ClusterDemoWidget() {
  const phrasesId = useId();
  const regionId = useId();
  const levelId = useId();

  const [phrases, setPhrases] = useState("");
  const [region, setRegion] = useState(CLUSTER_DEMO_DEFAULT_REGION);
  const [level, setLevel] = useState(CLUSTER_DEMO_DEFAULT_LEVEL);
  const [result, setResult] = useState<ClusterDemoResponse | null>(null);
  const [progress, setProgress] = useState<ClusterDemoResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const regions = result?.limits.regions?.length ? result.limits.regions : FALLBACK_REGIONS;
  const levels = result?.limits.clustering_levels?.length ? result.limits.clustering_levels : FALLBACK_LEVELS;

  const phraseCount = useMemo(() => countPhrases(phrases), [phrases]);
  const overLimit = phraseCount > CLUSTER_DEMO_MAX_PHRASES;
  const underMin = phraseCount > 0 && phraseCount < CLUSTER_DEMO_MIN_PHRASES;

  const runDemo = useCallback(async () => {
    setError(null);
    setResult(null);
    setProgress(null);
    setLoading(true);
    try {
      const res = await runClusterDemoWithPoll(
        {
          phrases: phrases.trim(),
          region_id: region,
          clustering_level: level,
        },
        (snap) => setProgress(snap)
      );
      if (!res.ok) {
        setError(res.error.message ?? "Не удалось выполнить кластеризацию");
        if (res.status === 429 && result) {
          setResult({ ...result, remaining: 0 });
        }
        return;
      }
      setResult(res.data);
      setProgress(null);
    } finally {
      setLoading(false);
    }
  }, [phrases, region, level, result]);

  const canRun = !loading && phrases.trim() !== "" && !overLimit && !underMin;

  const progressPct =
    progress?.progress && progress.progress.phrases_total > 0
      ? Math.min(
          100,
          Math.round((progress.progress.phrases_done / progress.progress.phrases_total) * 100)
        )
      : loading
        ? 8
        : 0;

  return (
    <DemoWidgetShell
      title="Попробуйте кластеризацию — как в кабинете"
      lead="В демо — до 10 фраз без сохранения. В кабинете — проекты, Wordstat, тысячи ключей, конкуренты и экспорт."
      features={DEMO_FEATURES}
      badge={
        result ? (
          <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800">
            Демо · ТОП-10 · classic
          </span>
        ) : undefined
      }
    >
      <ClusterDemoCapabilities />

      <div className="mt-8 space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-brand-200"
            onClick={() => setPhrases(CLUSTER_DEMO_SAMPLE)}
            disabled={loading}
          >
            Пример (8 фраз)
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-brand-200"
            onClick={() => setPhrases("")}
            disabled={loading}
          >
            Очистить
          </button>
        </div>

        <div>
          <label htmlFor={phrasesId} className="mb-1.5 block text-sm font-medium text-slate-700">
            Ключевые фразы
          </label>
          <textarea
            id={phrasesId}
            rows={8}
            value={phrases}
            onChange={(e) => setPhrases(e.target.value)}
            placeholder="По одной фразе на строку…"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 font-mono text-sm text-slate-800 shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
            disabled={loading}
          />
          <p className={`mt-1 text-xs ${overLimit || underMin ? "text-red-600" : "text-slate-500"}`}>
            {phraseCount} / {CLUSTER_DEMO_MAX_PHRASES} фраз (мин. {CLUSTER_DEMO_MIN_PHRASES})
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={regionId} className="mb-1.5 block text-sm font-medium text-slate-700">
              Регион
            </label>
            <select
              id={regionId}
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              disabled={loading}
            >
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={levelId} className="mb-1.5 block text-sm font-medium text-slate-700">
              Жёсткость
            </label>
            <select
              id={levelId}
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              disabled={loading}
            >
              {levels.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
              {LOCKED_LEVELS.map((l) => (
                <option key={l.value} value={l.value} disabled>
                  🔒 {l.label} — после регистрации
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-500">
              В демо — Soft и Light (classic). Hard и Pre-hard открываются в кабинете после регистрации.
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={!canRun}
          onClick={() => void runDemo()}
          className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {loading ? "Кластеризация…" : "Запустить демо"}
        </button>

        {loading && (
          <div className="rounded-xl border border-brand-100 bg-brand-50/50 p-4">
            <div className="flex items-center justify-between text-sm text-slate-700">
              <span>
                {progress?.progress?.waiting_in_queue
                  ? "Ожидание воркера очереди…"
                  : "Сбор выдачи по фразам…"}
              </span>
              {progress?.progress ? (
                <span className="font-mono text-xs text-slate-500">
                  {progress.progress.phrases_done}/{progress.progress.phrases_total}
                </span>
              ) : null}
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-brand-500 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">Обычно 1–3 минуты на 8 фраз. Нужны воркеры кластера на :3002.</p>
          </div>
        )}

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            {error}
          </p>
        )}

        {result?.result && <ClusterDemoReport result={result.result} />}

        <DemoUpgradePanel
          registerUrl={result?.upgrade.register_url ?? FALLBACK_REGISTER_URL}
          remaining={result?.remaining ?? 2}
          maxRuns={result?.limits.max_runs_per_day ?? 2}
          fullMaxChars={result?.limits.max_phrases ?? CLUSTER_DEMO_MAX_PHRASES}
          moduleTitle="кластеризатор"
          showRemaining={Boolean(result)}
          upgradeHint="Регистрация бесплатна — полный кластеризатор в личном кабинете без ограничения демо по 10 фразам."
          details={CABINET_UPGRADE_DETAILS}
        />
      </div>
    </DemoWidgetShell>
  );
}
