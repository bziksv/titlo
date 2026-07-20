"use client";

import { useCallback, useId, useState } from "react";
import { DemoModuleLinks } from "@/components/demo/DemoModuleLinks";
import { DemoUpgradePanel } from "@/components/demo/DemoUpgradePanel";
import { DemoWidgetShell } from "@/components/demo/DemoWidgetShell";
import { runPhraseCommerceDemo } from "@/lib/demo/run-phrase-commerce-demo-client";
import type { PhraseCommerceDemoMetric, PhraseCommerceDemoResult } from "@/lib/demo/types";
import {
  buildPhraseCommerceRegisterUrl,
  PHRASE_COMMERCE_CABINET_FEATURES,
  PHRASE_COMMERCE_DEMO_FEATURES,
  PHRASE_COMMERCE_DEMO_MAX_RUNS,
  PHRASE_COMMERCE_SAMPLE_PHRASE,
} from "@/lib/demo/phrase-commerce-demo";

function engineLabel(engine: string) {
  return engine === "google" ? "Google" : "Яндекс";
}

function MetricCard({
  title,
  metric,
  detail,
}: {
  title: string;
  metric: PhraseCommerceDemoMetric;
  detail: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
      <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{metric.label}</p>
      <p className="mt-1 text-xs text-slate-600">{detail}</p>
    </div>
  );
}

function PhraseCommerceDemoReport({ result }: { result: PhraseCommerceDemoResult }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Фраза</p>
        <p className="mt-1 text-sm font-medium text-slate-900">{result.phrase}</p>
        <p className="mt-1 text-xs text-slate-500">
          {engineLabel(result.engine)} · глубина {result.depth} · позиций {result.positions}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Регионы: {result.region_name || "—"} ↔ {result.region_contrast_name || "—"}
        </p>
      </div>

      {result.error ? (
        <p className="px-4 py-4 text-sm text-amber-800">
          Выдача пуста или источник не ответил — попробуйте другую фразу.
        </p>
      ) : null}

      <div className="grid gap-3 p-4 sm:grid-cols-3">
        <MetricCard
          title="Геозависимость"
          metric={result.geo}
          detail={
            result.geo.incomplete
              ? `Пересечение ${result.geo.overlap_pct ?? 0}% · данные неполные`
              : `Пересечение доменов ${result.geo.overlap_pct ?? 0}% · общих ${result.geo.shared ?? 0}`
          }
        />
        <MetricCard
          title="Локализация"
          metric={result.localization}
          detail={`${result.localization.pct ?? 0}% · ${result.localization.local ?? 0} из ${result.localization.total ?? 0}`}
        />
        <MetricCard
          title="Коммерция"
          metric={result.commerce}
          detail={`${result.commerce.pct ?? 0}% · ${result.commerce.commercial ?? 0} из ${result.commerce.total ?? 0}`}
        />
      </div>
    </div>
  );
}

export function PhraseCommerceDemoWidget() {
  const inputId = useId();
  const [phrase, setPhrase] = useState(PHRASE_COMMERCE_SAMPLE_PHRASE);
  const [engine, setEngine] = useState<"yandex" | "google">("yandex");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [result, setResult] = useState<PhraseCommerceDemoResult | null>(null);

  const onSubmit = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await runPhraseCommerceDemo({
      phrase: phrase.trim(),
      engine,
    });
    setLoading(false);

    if (!res.ok) {
      setError(res.message ?? "Не удалось оценить фразу");
      if (res.remaining !== undefined) setRemaining(res.remaining);
      return;
    }

    setResult(res.data.result);
    setRemaining(res.data.remaining);
  }, [phrase, engine]);

  return (
    <DemoWidgetShell
      title="Проверьте характер фразы без регистрации"
      lead="Сейчас — одна фраза и одна ПС: гео, локализация и коммерция. После регистрации — список фраз, обе системы, выбор регионов и история."
      features={PHRASE_COMMERCE_DEMO_FEATURES}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-slate-700">
            Поисковая фраза
          </label>
          <input
            id={inputId}
            type="text"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            placeholder="например: купить диван москва"
            maxLength={80}
          />
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="pc-demo-engine"
              checked={engine === "yandex"}
              onChange={() => setEngine("yandex")}
            />
            Яндекс
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="pc-demo-engine"
              checked={engine === "google"}
              onChange={() => setEngine("google")}
            />
            Google
          </label>
        </div>

        <button
          type="button"
          onClick={onSubmit}
          disabled={loading || !phrase.trim()}
          className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? "Считаем…" : "Оценить фразу"}
        </button>

        {remaining !== null && (
          <p className="text-xs text-slate-500">
            Сегодня ещё демо-проверок: <strong>{remaining}</strong> из {PHRASE_COMMERCE_DEMO_MAX_RUNS}
          </p>
        )}

        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>
        )}

        {result && <PhraseCommerceDemoReport result={result} />}

        <DemoUpgradePanel
          registerUrl={buildPhraseCommerceRegisterUrl()}
          remaining={remaining ?? PHRASE_COMMERCE_DEMO_MAX_RUNS}
          maxRuns={PHRASE_COMMERCE_DEMO_MAX_RUNS}
          fullMaxChars={100}
          moduleTitle="гео, локализации и коммерции"
          upgradeHint="Ниже — что открывается после регистрации. В демо этого нет."
          details={PHRASE_COMMERCE_CABINET_FEATURES}
        />
        <DemoModuleLinks
          links={[
            { href: "/tipy-saitov-v-vydache/", label: "Типы сайтов" },
            { href: "/analiz-konkurentov/", label: "Анализ конкурентов" },
          ]}
        />
      </div>
    </DemoWidgetShell>
  );
}
