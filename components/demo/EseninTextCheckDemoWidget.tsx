"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { attachEseninMarkTooltips } from "@/lib/demo/esenin-mark-tooltips";
import { DemoModuleLinks } from "@/components/demo/DemoModuleLinks";
import { DemoUpgradePanel } from "@/components/demo/DemoUpgradePanel";
import { DemoWidgetShell } from "@/components/demo/DemoWidgetShell";
import { runEseninTextCheckDemo } from "@/lib/demo/run-esenin-text-check-demo-client";
import type { EseninTextCheckDemoResult } from "@/lib/demo/types";
import {
  buildEseninTextCheckRegisterUrl,
  ESENIN_TEXT_CHECK_CABINET_FEATURES,
  ESENIN_TEXT_CHECK_DEMO_MAX_CHARS,
  ESENIN_TEXT_CHECK_DEMO_MAX_RUNS,
  ESENIN_TEXT_CHECK_SAMPLE_TEXT,
} from "@/lib/demo/esenin-text-check-demo";

function riskBadgeClass(score: number): string {
  if (score >= 13) return "border-red-200 bg-red-50 text-red-900";
  if (score >= 8) return "border-amber-200 bg-amber-50 text-amber-950";
  if (score >= 5) return "border-sky-200 bg-sky-50 text-sky-900";
  return "border-emerald-200 bg-emerald-50 text-emerald-900";
}

function EseninTextCheckDemoReport({ result }: { result: EseninTextCheckDemoResult }) {
  const highlightRef = useRef<HTMLDivElement>(null);
  const highlightHtml = useMemo(() => {
    return result.highlights?.risk || result.highlighted_html || "";
  }, [result]);

  useEffect(() => {
    return attachEseninMarkTooltips(highlightRef.current);
  }, [highlightHtml]);

  const details = result.details ?? [];
  const params = (result.params ?? []).slice(0, 8);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Общий риск</p>
            <p className="mt-1 text-lg font-bold text-slate-900">{result.level ?? "—"}</p>
          </div>
          <span
            className={`inline-flex min-w-[2.5rem] justify-center rounded-full border px-3 py-1 text-sm font-bold ${riskBadgeClass(result.risk ?? 0)}`}
          >
            {result.risk ?? 0}
          </span>
        </div>

        {details.length > 0 && (
          <dl className="mt-4 grid gap-2 sm:grid-cols-2">
            {details.map((item) => (
              <div key={item.block} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                <dt className="text-slate-600">{item.label ?? item.block}</dt>
                <dd className="font-semibold text-slate-900">{item.sum}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      {params.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase text-slate-500">
            Параметры
          </div>
          <table className="w-full text-left text-sm">
            <tbody>
              {params.map((row) => (
                <tr key={row.name} className="border-t border-slate-100">
                  <td className="px-4 py-2 text-slate-600">{row.name}</td>
                  <td className="px-4 py-2 text-right font-medium text-slate-900">{row.value ?? "—"}</td>
                  <td className="px-4 py-2 text-right">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                      {row.score ?? 0}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {highlightHtml ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase text-slate-500">
            Подсветка проблем
          </div>
          <div
            ref={highlightRef}
            className="esenin-demo-highlight px-4 py-3 text-sm leading-relaxed text-slate-800"
            dangerouslySetInnerHTML={{ __html: highlightHtml }}
          />
        </div>
      ) : null}

      {result.stats && (
        <p className="text-xs text-slate-500">
          Символов: {result.stats.chars ?? 0}, слов: {result.stats.words ?? 0}
        </p>
      )}
    </div>
  );
}

export function EseninTextCheckDemoWidget() {
  const textId = useId();
  const urlId = useId();
  const [source, setSource] = useState<"text" | "url">("text");
  const [text, setText] = useState(ESENIN_TEXT_CHECK_SAMPLE_TEXT);
  const [url, setUrl] = useState("https://titlo.ru/");
  const [tbclass, setTbclass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [result, setResult] = useState<EseninTextCheckDemoResult | null>(null);

  const onSubmit = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await runEseninTextCheckDemo({
      source,
      text: source === "text" ? text : undefined,
      url: source === "url" ? url.trim() : undefined,
      tbclass: source === "url" ? tbclass.trim() : undefined,
      mode: "risk",
    });
    setLoading(false);

    if (!res.ok) {
      setError(res.message ?? "Не удалось выполнить проверку");
      if (res.remaining !== undefined) setRemaining(res.remaining);
      return;
    }

    setResult(res.data.result);
    setRemaining(res.data.remaining);
  }, [source, text, url, tbclass]);

  return (
    <DemoWidgetShell
      title="Проверка текста без регистрации"
      lead={`До ${ESENIN_TEXT_CHECK_DEMO_MAX_CHARS.toLocaleString("ru-RU")} символов · ${ESENIN_TEXT_CHECK_DEMO_MAX_RUNS} проверки в сутки. В кабинете — HTML, автосохранение и до 20 000 символов.`}
      features={["Повторы", "Стилистика", "Запросы", "Подсветка рисков"]}
    >
      <style>{`
        .esenin-demo-highlight mark.esenin-mark--frequency { background: rgba(111, 66, 193, 0.18); border-bottom: 2px solid rgba(111, 66, 193, 0.45); }
        .esenin-demo-highlight mark.esenin-mark--style { background: rgba(255, 193, 7, 0.35); }
        .esenin-demo-highlight mark.esenin-mark--keywords { background: rgba(13, 110, 253, 0.18); }
        .esenin-demo-highlight mark.esenin-mark--readability { background: rgba(25, 135, 84, 0.18); }
        .esenin-demo-highlight mark .esenin-mark__icon { display: inline-flex; align-items: center; justify-content: center; width: 0.85em; height: 0.85em; margin-left: 0.12em; border-radius: 50%; background: #dc3545; color: #fff; font-size: 0.62em; font-weight: 700; vertical-align: super; }
        .esenin-demo-highlight mark[data-esenin-tip] { cursor: pointer; }
        .esenin-tip-popover { position: absolute; z-index: 1080; max-width: 20rem; padding: 0.45rem 0.65rem; font-size: 0.8125rem; line-height: 1.4; color: #fff; background: rgba(33, 37, 41, 0.94); border-radius: 0.45rem; box-shadow: 0 0.35rem 1rem rgba(0, 0, 0, 0.18); pointer-events: none; opacity: 0; transition: opacity 0.08s ease; }
        .esenin-tip-popover.is-visible { opacity: 1; }
      `}</style>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSource("text")}
            className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${source === "text" ? "border-brand-300 bg-brand-50 text-brand-800" : "border-slate-300 text-slate-700"}`}
          >
            Текст
          </button>
          <button
            type="button"
            onClick={() => setSource("url")}
            className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${source === "url" ? "border-brand-300 bg-brand-50 text-brand-800" : "border-slate-300 text-slate-700"}`}
          >
            URL страницы
          </button>
        </div>

        {source === "text" ? (
          <div>
            <label htmlFor={textId} className="mb-1.5 block text-sm font-medium text-slate-700">
              SEO-текст
            </label>
            <textarea
              id={textId}
              className="min-h-[12rem] w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <p className="mt-1 text-xs text-slate-500">
              Демо: до {ESENIN_TEXT_CHECK_DEMO_MAX_CHARS.toLocaleString("ru-RU")} символов текста
            </p>
          </div>
        ) : (
          <>
            <div>
              <label htmlFor={urlId} className="mb-1.5 block text-sm font-medium text-slate-700">
                URL страницы
              </label>
              <input
                id={urlId}
                type="url"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/page/"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                CSS-селектор блока (необязательно)
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                value={tbclass}
                onChange={(e) => setTbclass(e.target.value)}
                placeholder=".content"
              />
            </div>
          </>
        )}

        <button
          type="button"
          onClick={onSubmit}
          disabled={loading || (source === "text" ? !text.trim() : !url.trim())}
          className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? "Проверяем…" : "Проверить текст"}
        </button>

        {remaining !== null && (
          <p className="text-xs text-slate-500">
            Осталось демо-проверок сегодня: <strong>{remaining}</strong> / {ESENIN_TEXT_CHECK_DEMO_MAX_RUNS}
          </p>
        )}

        {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}

        {result && <EseninTextCheckDemoReport result={result} />}

        <DemoUpgradePanel
          registerUrl={buildEseninTextCheckRegisterUrl()}
          remaining={remaining ?? ESENIN_TEXT_CHECK_DEMO_MAX_RUNS}
          maxRuns={ESENIN_TEXT_CHECK_DEMO_MAX_RUNS}
          fullMaxChars={20000}
          moduleTitle="проверки текста Есенин"
          upgradeHint="В кабинете — HTML-редактор, автосохранение версий и лимиты по тарифу."
          details={ESENIN_TEXT_CHECK_CABINET_FEATURES}
        />
        <DemoModuleLinks
          links={[
            { href: "/analiz-teksta/", label: "Анализ текста" },
            { href: "/proverka-indeksacii/", label: "Проверка индексации" },
          ]}
        />
      </div>
    </DemoWidgetShell>
  );
}
