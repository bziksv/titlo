"use client";

import { useCallback, useId, useState } from "react";
import { DemoModuleLinks } from "@/components/demo/DemoModuleLinks";
import { DemoUpgradePanel } from "@/components/demo/DemoUpgradePanel";
import { DemoWidgetShell } from "@/components/demo/DemoWidgetShell";
import { runHttpHeadersDemo } from "@/lib/demo/run-http-headers-demo-client";
import type { HttpHeadersDemoHop, HttpHeadersDemoResult } from "@/lib/demo/types";
import {
  buildHttpHeadersRegisterUrl,
  HTTP_HEADERS_CABINET_FEATURES,
  HTTP_HEADERS_DEMO_MAX_RUNS,
  HTTP_HEADERS_SAMPLE_URL,
} from "@/lib/demo/http-headers-demo";

const DEMO_FEATURES = [
  "Цепочка редиректов (301/302)",
  "Статус, Cache-Control, Content-Encoding",
  "HSTS, CSP, X-Frame-Options",
  "1 URL за запуск, 5 проверок в демо за сутки",
] as const;

const CABINET_NOTE =
  "В кабинете — полный отчёт по URL (заголовки + HTML), пакет до 500 адресов со сводкой кодов, пауза между запросами и выгрузка таблицы.";

function statusBadgeClass(status: number): string {
  if (status >= 200 && status < 300) return "bg-emerald-100 text-emerald-900 border-emerald-200";
  if (status >= 300 && status < 400) return "bg-sky-100 text-sky-900 border-sky-200";
  if (status >= 400) return "bg-red-100 text-red-900 border-red-200";
  return "bg-slate-100 text-slate-800 border-slate-200";
}

function HopBlock({ hop }: { hop: HttpHeadersDemoHop }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
        <p className="text-sm font-semibold text-slate-900">
          Шаг {hop.index}
          {hop.index > 1 ? " (редирект)" : ""}
        </p>
        <span
          className={`inline-flex rounded-full border px-2.5 py-0.5 font-mono text-xs font-semibold ${statusBadgeClass(hop.status)}`}
        >
          {hop.status} {hop.status_label}
        </span>
      </div>
      <dl className="divide-y divide-slate-100">
        {hop.headers.map((h) => (
          <div key={`${hop.index}-${h.name}`} className="grid gap-1 px-4 py-2.5 sm:grid-cols-[minmax(0,11rem)_1fr] sm:gap-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{h.name}</dt>
            <dd className="break-all font-mono text-xs text-slate-800">{h.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function HttpHeadersDemoReport({ result }: { result: HttpHeadersDemoResult }) {
  const { summary } = result;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm sm:px-5">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Запрошенный URL</p>
        <p className="mt-1 break-all font-medium text-slate-900">{result.requested_url}</p>
        {result.final_url && result.final_url !== result.requested_url && (
          <>
            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-500">После редиректов</p>
            <p className="mt-1 break-all text-slate-800">{result.final_url}</p>
          </>
        )}
        <p className="mt-3 text-xs text-slate-500">
          Шагов в цепочке: <strong>{result.hop_count}</strong>
          {summary.final_status != null && (
            <>
              {" "}
              · итоговый код: <strong>{summary.final_status}</strong>
            </>
          )}
        </p>
      </div>

      {summary.hints.length > 0 && (
        <ul className="space-y-2">
          {summary.hints.map((hint) => (
            <li
              key={hint}
              className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-950"
            >
              {hint}
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap gap-2 text-xs">
        <span
          className={`rounded-full border px-2.5 py-1 ${summary.security.hsts ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-slate-200 bg-slate-50 text-slate-600"}`}
        >
          HSTS {summary.security.hsts ? "✓" : "—"}
        </span>
        <span
          className={`rounded-full border px-2.5 py-1 ${summary.security.csp ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-slate-200 bg-slate-50 text-slate-600"}`}
        >
          CSP {summary.security.csp ? "✓" : "—"}
        </span>
        <span
          className={`rounded-full border px-2.5 py-1 ${summary.security.x_frame ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-slate-200 bg-slate-50 text-slate-600"}`}
        >
          X-Frame {summary.security.x_frame ? "✓" : "—"}
        </span>
        <span
          className={`rounded-full border px-2.5 py-1 ${summary.security.x_content_type ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-slate-200 bg-slate-50 text-slate-600"}`}
        >
          X-Content-Type {summary.security.x_content_type ? "✓" : "—"}
        </span>
      </div>

      <div className="space-y-3">
        {result.hops.map((hop) => (
          <HopBlock key={hop.index} hop={hop} />
        ))}
      </div>
    </div>
  );
}

export function HttpHeadersDemoWidget() {
  const urlId = useId();
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<HttpHeadersDemoResult | null>(null);
  const [remaining, setRemaining] = useState(HTTP_HEADERS_DEMO_MAX_RUNS);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const runCheck = useCallback(async () => {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await runHttpHeadersDemo({ url: url.trim() });
      if (!res.ok) {
        setError(res.message ?? "Не удалось выполнить проверку");
        if (typeof res.remaining === "number") {
          setRemaining(res.remaining);
        }
        return;
      }
      setResult(res.data.result);
      setRemaining(res.data.remaining);
    } catch {
      setError("Сервис временно недоступен. Убедитесь, что кабинет запущен на :3002.");
    } finally {
      setLoading(false);
    }
  }, [url]);

  return (
    <DemoWidgetShell
      title="Проверьте HTTP-заголовки без регистрации"
      lead="Разовая проверка одного URL: редиректы, код ответа, кэш и заголовки безопасности. В кабинете — полный отчёт с HTML, пакет до 500 и выгрузка."
      features={DEMO_FEATURES}
    >
      <p className="mb-6 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm leading-relaxed text-brand-950">
        {CABINET_NOTE}
      </p>

      <div className="space-y-6">
        <div className="max-w-xl">
          <label className="text-sm font-medium text-slate-700" htmlFor={urlId}>
            URL страницы
          </label>
          <input
            id={urlId}
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
              onClick={() => setUrl(HTTP_HEADERS_SAMPLE_URL)}
            >
              Пример: titlo.ru
            </button>
          </div>

          <button
            type="button"
            onClick={() => void runCheck()}
            disabled={loading || !url.trim() || remaining <= 0}
            className="mt-4 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {loading ? "Запрашиваем ответ…" : "Проверить заголовки"}
          </button>
          <p className="mt-2 text-xs text-slate-500">
            Демо: {remaining} из {HTTP_HEADERS_DEMO_MAX_RUNS} проверок сегодня · 1 URL за запуск
          </p>
        </div>

        <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
          <p className="text-sm font-semibold text-slate-800">Результат</p>
          {!result && !error && (
            <p className="mt-2 text-sm text-slate-500">Укажите URL и нажмите «Проверить заголовки».</p>
          )}
          {error && (
            <p
              className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"
              role="alert"
            >
              {error}
            </p>
          )}
          {result && (
            <div className="mt-4 min-w-0">
              <HttpHeadersDemoReport result={result} />
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <DemoUpgradePanel
          registerUrl={buildHttpHeadersRegisterUrl()}
          remaining={remaining}
          maxRuns={HTTP_HEADERS_DEMO_MAX_RUNS}
          fullMaxChars={0}
          moduleTitle="проверки HTTP-заголовков"
          showRemaining={false}
          upgradeHint="Зарегистрируйтесь — полный отчёт с HTML, пакет до 500 URL и выгрузка таблицы для техаудита."
          details={HTTP_HEADERS_CABINET_FEATURES}
        />
      </div>

      <div className="mt-4">
        <DemoModuleLinks
          links={[
            { href: "/proverka-meta-tegov-online/", label: "Мета-теги" },
            { href: "/monitoring-saytov/", label: "Мониторинг сайтов" },
          ]}
        />
      </div>
    </DemoWidgetShell>
  );
}
