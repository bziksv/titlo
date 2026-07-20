"use client";

import { useCallback, useId, useState } from "react";
import { DemoModuleLinks } from "@/components/demo/DemoModuleLinks";
import { DemoUpgradePanel } from "@/components/demo/DemoUpgradePanel";
import { DemoWidgetShell } from "@/components/demo/DemoWidgetShell";
import { runIndexCheckDemo } from "@/lib/demo/run-index-check-demo-client";
import type { IndexCheckDemoResult } from "@/lib/demo/types";
import {
  buildIndexCheckRegisterUrl,
  INDEX_CHECK_CABINET_FEATURES,
  INDEX_CHECK_DEMO_MAX_RUNS,
  INDEX_CHECK_GOOGLE_DOMAINS,
  INDEX_CHECK_SAMPLE_URL,
} from "@/lib/demo/index-check-demo";

function engineBadge(indexed: boolean, error?: string | null) {
  if (error) {
    return (
      <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-950">
        Ошибка
      </span>
    );
  }
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
        indexed
          ? "border-emerald-200 bg-emerald-50 text-emerald-900"
          : "border-slate-200 bg-slate-100 text-slate-700"
      }`}
    >
      {indexed ? "Да" : "Нет"}
    </span>
  );
}

function IndexCheckDemoReport({ result }: { result: IndexCheckDemoResult }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">URL</p>
        <p className="mt-1 break-all text-sm font-medium text-slate-900">{result.url}</p>
      </div>
      <dl className="grid gap-0 sm:grid-cols-2">
        {result.yandex && (
          <div className="border-b border-slate-100 px-4 py-3 sm:border-r">
            <dt className="text-xs font-semibold uppercase text-slate-500">Яндекс</dt>
            <dd className="mt-2">{engineBadge(result.yandex.indexed, result.yandex.error)}</dd>
          </div>
        )}
        {result.google && (
          <div className="border-b border-slate-100 px-4 py-3">
            <dt className="text-xs font-semibold uppercase text-slate-500">Google</dt>
            <dd className="mt-2">{engineBadge(result.google.indexed, result.google.error)}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}

export function IndexCheckDemoWidget() {
  const inputId = useId();
  const [url, setUrl] = useState(INDEX_CHECK_SAMPLE_URL);
  const [yandex, setYandex] = useState(true);
  const [google, setGoogle] = useState(true);
  const [unifyWww, setUnifyWww] = useState(false);
  const [googleDomain, setGoogleDomain] = useState("google.ru");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [result, setResult] = useState<IndexCheckDemoResult | null>(null);

  const onSubmit = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await runIndexCheckDemo({
      url: url.trim(),
      yandex,
      google,
      unify_www: unifyWww,
      google_domain: googleDomain,
    });
    setLoading(false);

    if (!res.ok) {
      setError(res.message ?? "Не удалось выполнить проверку");
      if (res.remaining !== undefined) setRemaining(res.remaining);
      return;
    }

    setResult(res.data.result);
    setRemaining(res.data.remaining);
  }, [url, yandex, google, unifyWww, googleDomain]);

  return (
    <DemoWidgetShell
      title="Проверка индексации и сниппетов без регистрации"
      lead="1 URL за запуск · до 5 демо-проверок в сутки. В кабинете — пакет до 500 URL, выбор ПС и CSV."
      features={["Яндекс", "Google", "site:", "Лимиты по тарифу в кабинете"]}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-slate-700">
            URL страницы
          </label>
          <input
            id={inputId}
            type="url"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/page"
          />
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={yandex} onChange={(e) => setYandex(e.target.checked)} />
            Яндекс
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={google} onChange={(e) => setGoogle(e.target.checked)} />
            Google
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={unifyWww} onChange={(e) => setUnifyWww(e.target.checked)} />
            www/http единым URL
          </label>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Домен Google</label>
          <select
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm sm:max-w-xs"
            value={googleDomain}
            onChange={(e) => setGoogleDomain(e.target.value)}
            disabled={!google}
          >
            {INDEX_CHECK_GOOGLE_DOMAINS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={onSubmit}
          disabled={loading || !url.trim() || (!yandex && !google)}
          className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? "Проверяем…" : "Начать проверку"}
        </button>

        {remaining !== null && (
          <p className="text-xs text-slate-500">
            Осталось демо-проверок сегодня: <strong>{remaining}</strong> / {INDEX_CHECK_DEMO_MAX_RUNS}
          </p>
        )}

        {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}

        {result && <IndexCheckDemoReport result={result} />}

        <DemoUpgradePanel
          registerUrl={buildIndexCheckRegisterUrl()}
          remaining={remaining ?? INDEX_CHECK_DEMO_MAX_RUNS}
          maxRuns={INDEX_CHECK_DEMO_MAX_RUNS}
          fullMaxChars={500}
          moduleTitle="проверки индексации"
          upgradeHint="В кабинете — пакетная проверка, учёт лимитов и CSV."
          details={INDEX_CHECK_CABINET_FEATURES}
        />
        <DemoModuleLinks
          links={[
            { href: "/proverka-http-zagolovkov/", label: "HTTP-заголовки" },
            { href: "/proverka-meta-tegov-online/", label: "Мета-теги" },
          ]}
        />
      </div>
    </DemoWidgetShell>
  );
}
