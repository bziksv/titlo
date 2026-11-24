"use client";

import { useCallback, useId, useState } from "react";
import { DemoModuleLinks } from "@/components/demo/DemoModuleLinks";
import { DemoUpgradePanel } from "@/components/demo/DemoUpgradePanel";
import { DemoWidgetShell } from "@/components/demo/DemoWidgetShell";
import { runTextUniquenessDemo } from "@/lib/demo/run-text-uniqueness-demo-client";
import type { TextUniquenessCompareResult } from "@/lib/demo/text-uniqueness-compare";
import {
  buildTextUniquenessRegisterUrl,
  TEXT_UNIQUENESS_CABINET_FEATURES,
  TEXT_UNIQUENESS_DEMO_MAX_RUNS,
  TEXT_UNIQUENESS_SAMPLE_TEXT,
  TEXT_UNIQUENESS_SAMPLE_URL,
} from "@/lib/demo/text-uniqueness-demo";

function Report({ result }: { result: TextUniquenessCompareResult }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="grid gap-0 sm:grid-cols-2">
        <div className="border-b border-slate-100 px-4 py-3 sm:border-r">
          <p className="text-xs font-semibold uppercase text-slate-500">Уникальность</p>
          <p className="mt-1 text-2xl font-bold text-brand-700">{result.uniqueness_pct}%</p>
        </div>
        <div className="border-b border-slate-100 px-4 py-3">
          <p className="text-xs font-semibold uppercase text-slate-500">Совпало фрагментов</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {result.shingles_matched} / {result.shingles_total}
          </p>
        </div>
      </div>
      <div className="px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Страница</p>
        <p className="mt-1 break-all text-sm text-slate-800">{result.url}</p>
        {result.samples.length > 0 && (
          <ul className="mt-3 space-y-1 text-sm text-slate-700">
            {result.samples.map((sample) => (
              <li key={sample}>«{sample}»</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function TextUniquenessDemoWidget() {
  const textId = useId();
  const urlId = useId();
  const [text, setText] = useState(TEXT_UNIQUENESS_SAMPLE_TEXT);
  const [url, setUrl] = useState(TEXT_UNIQUENESS_SAMPLE_URL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [result, setResult] = useState<TextUniquenessCompareResult | null>(null);

  const onSubmit = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await runTextUniquenessDemo({ text: text.trim(), url: url.trim() });
    setLoading(false);
    if (!res.ok) {
      setError(res.message ?? "Не удалось выполнить проверку");
      if (res.remaining !== undefined) setRemaining(res.remaining);
      return;
    }
    setResult(res.data.result);
    setRemaining(res.data.remaining);
  }, [text, url]);

  return (
    <DemoWidgetShell
      title="Проверка уникальности без регистрации"
      lead="Один адрес страницы за запуск · до 5 демо-проверок в сутки. В кабинете — поиск по выдаче, несколько URL и история."
      features={["Процент уникальности", "Совпавшие фрагменты", "Сравнение с URL", "Лимиты по тарифу в кабинете"]}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor={textId} className="mb-1.5 block text-sm font-medium text-slate-700">
            Текст
          </label>
          <textarea
            id={textId}
            rows={5}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor={urlId} className="mb-1.5 block text-sm font-medium text-slate-700">
            Сравнить со страницей
          </label>
          <input
            id={urlId}
            type="url"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/page"
          />
        </div>
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading || text.trim().length < 80 || !url.trim()}
          className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? "Проверяем…" : "Начать проверку"}
        </button>
        {remaining !== null && (
          <p className="text-xs text-slate-500">
            Осталось демо-проверок сегодня: <strong>{remaining}</strong> / {TEXT_UNIQUENESS_DEMO_MAX_RUNS}
          </p>
        )}
        {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}
        {result && <Report result={result} />}
        <DemoUpgradePanel
          registerUrl={buildTextUniquenessRegisterUrl()}
          remaining={remaining ?? TEXT_UNIQUENESS_DEMO_MAX_RUNS}
          maxRuns={TEXT_UNIQUENESS_DEMO_MAX_RUNS}
          fullMaxChars={50000}
          moduleTitle="проверки уникальности"
          upgradeHint="В кабинете — поиск совпадений по выдаче, несколько URL, источники и история."
          details={TEXT_UNIQUENESS_CABINET_FEATURES}
        />
        <DemoModuleLinks
          links={[
            { href: "/analiz-teksta/", label: "Анализ текста" },
            { href: "/proverka-teksta-esenin/", label: "Проверка текста Есенин" },
            { href: "/analiz-relevantnosti/", label: "Анализ релевантности" },
          ]}
        />
      </div>
    </DemoWidgetShell>
  );
}
