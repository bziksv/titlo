"use client";

import { useCallback, useId, useState } from "react";
import { DemoModuleLinks } from "@/components/demo/DemoModuleLinks";
import { DemoUpgradePanel } from "@/components/demo/DemoUpgradePanel";
import { DemoWidgetShell } from "@/components/demo/DemoWidgetShell";
import { runSearchSuggestionsDemo } from "@/lib/demo/run-search-suggestions-demo-client";
import type { SearchSuggestionsDemoResult } from "@/lib/demo/types";
import {
  buildSearchSuggestionsRegisterUrl,
  SEARCH_SUGGESTIONS_CABINET_FEATURES,
  SEARCH_SUGGESTIONS_DEMO_FEATURES,
  SEARCH_SUGGESTIONS_DEMO_MAX_RUNS,
  SEARCH_SUGGESTIONS_SAMPLE_SEED,
} from "@/lib/demo/search-suggestions-demo";

function engineLabel(engine: string) {
  return engine === "google" ? "Google" : "Яндекс";
}

function SearchSuggestionsDemoReport({ result }: { result: SearchSuggestionsDemoResult }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Исходная фраза</p>
        <p className="mt-1 text-sm font-medium text-slate-900">{result.seed}</p>
        <p className="mt-1 text-xs text-slate-500">
          {engineLabel(result.engine)} · показано {result.results_count}
          {result.truncated ? ` из ${result.total_found}+` : ""}
        </p>
      </div>
      {result.rows.length === 0 ? (
        <p className="px-4 py-6 text-sm text-slate-600">Подсказки не найдены. Попробуйте другую фразу.</p>
      ) : (
        <div className="max-h-80 overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-white text-xs uppercase text-slate-500">
              <tr className="border-b border-slate-100">
                <th className="px-3 py-2 font-semibold">Подсказка</th>
                <th className="px-3 py-2 font-semibold">Слов</th>
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row, i) => (
                <tr key={`${row.suggest}-${i}`} className="border-b border-slate-50">
                  <td className="px-3 py-2 text-slate-900">{row.suggest}</td>
                  <td className="px-3 py-2 tabular-nums text-slate-600">{row.words}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function SearchSuggestionsDemoWidget() {
  const inputId = useId();
  const [seed, setSeed] = useState(SEARCH_SUGGESTIONS_SAMPLE_SEED);
  const [engine, setEngine] = useState<"yandex" | "google">("yandex");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [result, setResult] = useState<SearchSuggestionsDemoResult | null>(null);

  const onSubmit = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await runSearchSuggestionsDemo({
      seed: seed.trim(),
      engine,
    });
    setLoading(false);

    if (!res.ok) {
      setError(res.message ?? "Не удалось собрать подсказки");
      if (res.remaining !== undefined) setRemaining(res.remaining);
      return;
    }

    setResult(res.data.result);
    setRemaining(res.data.remaining);
  }, [seed, engine]);

  return (
    <DemoWidgetShell
      title="Соберите поисковые подсказки без регистрации"
      lead="Сейчас — одна фраза и одна ПС, режим «фраза». После регистрации — список исходных фраз, алфавит, пресеты, глубина и сохранение в историю."
      features={SEARCH_SUGGESTIONS_DEMO_FEATURES}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-slate-700">
            Исходная фраза
          </label>
          <input
            id={inputId}
            type="text"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            placeholder="например: ремонт фасада"
            maxLength={80}
          />
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="ss-demo-engine"
              checked={engine === "yandex"}
              onChange={() => setEngine("yandex")}
            />
            Яндекс
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="ss-demo-engine"
              checked={engine === "google"}
              onChange={() => setEngine("google")}
            />
            Google
          </label>
        </div>

        <button
          type="button"
          onClick={onSubmit}
          disabled={loading || !seed.trim()}
          className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? "Собираем…" : "Собрать подсказки"}
        </button>

        {remaining !== null && (
          <p className="text-xs text-slate-500">
            Сегодня ещё демо-сборов: <strong>{remaining}</strong> из {SEARCH_SUGGESTIONS_DEMO_MAX_RUNS}
          </p>
        )}

        {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}

        {result && <SearchSuggestionsDemoReport result={result} />}

        <DemoUpgradePanel
          registerUrl={buildSearchSuggestionsRegisterUrl()}
          remaining={remaining ?? SEARCH_SUGGESTIONS_DEMO_MAX_RUNS}
          maxRuns={SEARCH_SUGGESTIONS_DEMO_MAX_RUNS}
          fullMaxChars={100}
          moduleTitle="сбора подсказок"
          upgradeHint="Ниже — что открывается после регистрации. В демо этих режимов нет."
          details={SEARCH_SUGGESTIONS_CABINET_FEATURES}
        />
        <DemoModuleLinks
          links={[
            { href: "/generator_slov/", label: "Генератор слов" },
            { href: "/klasterizator-klyuchevykh-slov/", label: "Кластеризатор" },
          ]}
        />
      </div>
    </DemoWidgetShell>
  );
}
