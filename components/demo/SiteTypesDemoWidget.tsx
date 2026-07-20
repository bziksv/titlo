"use client";

import { useCallback, useId, useState } from "react";
import { DemoModuleLinks } from "@/components/demo/DemoModuleLinks";
import { DemoUpgradePanel } from "@/components/demo/DemoUpgradePanel";
import { DemoWidgetShell } from "@/components/demo/DemoWidgetShell";
import { runSiteTypesDemo } from "@/lib/demo/run-site-types-demo-client";
import type { SiteTypesDemoResult } from "@/lib/demo/types";
import {
  buildSiteTypesRegisterUrl,
  SITE_TYPES_CABINET_FEATURES,
  SITE_TYPES_DEMO_FEATURES,
  SITE_TYPES_DEMO_MAX_RUNS,
  SITE_TYPES_SAMPLE_PHRASE,
} from "@/lib/demo/site-types-demo";

function engineLabel(engine: string) {
  return engine === "google" ? "Google" : "Яндекс";
}

function SiteTypesDemoReport({ result }: { result: SiteTypesDemoResult }) {
  const cat = (type: string) => result.categories[type]?.label ?? type;

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Фраза</p>
          <p className="mt-1 text-sm font-medium text-slate-900">{result.phrase}</p>
          <p className="mt-1 text-xs text-slate-500">
            {engineLabel(result.engine)} · глубина {result.depth} · позиций {result.total_positions}
            {result.truncated ? ` · в таблице ${result.rows_shown}` : ""}
          </p>
        </div>

        <div className="border-b border-slate-100 px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">Вердикт</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{result.verdict.label}</p>
          {result.verdict.hint ? (
            <p className="mt-1 text-xs leading-relaxed text-slate-600">{result.verdict.hint}</p>
          ) : null}
          {result.error ? (
            <p className="mt-2 text-xs text-amber-700">Выдача пуста или источник не ответил — попробуйте другую фразу.</p>
          ) : null}
        </div>

        {result.mix.length > 0 && (
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Доли типов</p>
            <ul className="mt-2 space-y-1.5">
              {result.mix
                .filter((m) => m.count > 0)
                .map((m) => (
                  <li key={m.type} className="flex items-center gap-2 text-sm">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: result.categories[m.type]?.color ?? "#94a3b8" }}
                      aria-hidden
                    />
                    <span className="flex-1 text-slate-800">{cat(m.type)}</span>
                    <span className="tabular-nums text-slate-600">
                      {m.share}% · {m.count}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        )}

        {result.rows.length === 0 ? (
          <p className="px-4 py-6 text-sm text-slate-600">Позиции не найдены. Попробуйте другую фразу.</p>
        ) : (
          <div className="max-h-80 overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-white text-xs uppercase text-slate-500">
                <tr className="border-b border-slate-100">
                  <th className="px-3 py-2 font-semibold">#</th>
                  <th className="px-3 py-2 font-semibold">Домен</th>
                  <th className="px-3 py-2 font-semibold">Тип</th>
                </tr>
              </thead>
              <tbody>
                {result.rows.map((row) => (
                  <tr key={`${row.position}-${row.domain}`} className="border-b border-slate-50">
                    <td className="px-3 py-2 tabular-nums text-slate-500">{row.position}</td>
                    <td className="px-3 py-2 font-mono text-xs text-slate-900">{row.domain || "—"}</td>
                    <td className="px-3 py-2 text-slate-700">{cat(row.type)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export function SiteTypesDemoWidget() {
  const inputId = useId();
  const [phrase, setPhrase] = useState(SITE_TYPES_SAMPLE_PHRASE);
  const [engine, setEngine] = useState<"yandex" | "google">("yandex");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [result, setResult] = useState<SiteTypesDemoResult | null>(null);

  const onSubmit = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await runSiteTypesDemo({
      phrase: phrase.trim(),
      engine,
    });
    setLoading(false);

    if (!res.ok) {
      setError(res.message ?? "Не удалось разобрать типы сайтов");
      if (res.remaining !== undefined) setRemaining(res.remaining);
      return;
    }

    setResult(res.data.result);
    setRemaining(res.data.remaining);
  }, [phrase, engine]);

  return (
    <DemoWidgetShell
      title="Проверьте типы сайтов в выдаче без регистрации"
      lead="Сейчас — одна фраза и одна ПС, глубина 10. После регистрации — список фраз, обе системы, глубина до 30, история и свои каталоги."
      features={SITE_TYPES_DEMO_FEATURES}
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
            placeholder="например: купить диван"
            maxLength={80}
          />
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="st-demo-engine"
              checked={engine === "yandex"}
              onChange={() => setEngine("yandex")}
            />
            Яндекс
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="st-demo-engine"
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
          {loading ? "Разбираем выдачу…" : "Показать типы"}
        </button>

        {remaining !== null && (
          <p className="text-xs text-slate-500">
            Сегодня ещё демо-проверок: <strong>{remaining}</strong> из {SITE_TYPES_DEMO_MAX_RUNS}
          </p>
        )}

        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>
        )}

        {result && <SiteTypesDemoReport result={result} />}

        <DemoUpgradePanel
          registerUrl={buildSiteTypesRegisterUrl()}
          remaining={remaining ?? SITE_TYPES_DEMO_MAX_RUNS}
          maxRuns={SITE_TYPES_DEMO_MAX_RUNS}
          fullMaxChars={100}
          moduleTitle="типов сайтов в выдаче"
          upgradeHint="Ниже — что открывается после регистрации. В демо этого нет."
          details={SITE_TYPES_CABINET_FEATURES}
        />
        <DemoModuleLinks
          links={[
            { href: "/analiz-konkurentov/", label: "Анализ конкурентов" },
            { href: "/analiz-relevantnosti/", label: "Релевантность" },
          ]}
        />
      </div>
    </DemoWidgetShell>
  );
}
