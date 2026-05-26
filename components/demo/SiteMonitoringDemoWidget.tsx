"use client";

import { useCallback, useId, useState } from "react";
import { DemoModuleLinks } from "@/components/demo/DemoModuleLinks";
import { DemoUpgradePanel } from "@/components/demo/DemoUpgradePanel";
import { DemoWidgetShell } from "@/components/demo/DemoWidgetShell";
import { runSiteMonitoringDemo } from "@/lib/demo/run-site-monitoring-demo-client";
import type { SiteMonitoringDemoResult } from "@/lib/demo/types";
import {
  buildSiteMonitoringRegisterUrl,
  SITE_MONITORING_CABINET_FEATURES,
  SITE_MONITORING_DEMO_MAX_RUNS,
  SITE_MONITORING_SAMPLE_URL,
} from "@/lib/demo/site-monitoring-demo";

const DEMO_FEATURES = [
  "Проверка URL как в кабинете",
  "HTTP-код и время ответа",
  "Ключевая фраза в HTML",
  "5 проверок в демо за сутки",
  "Расписание и оповещения — после регистрации",
] as const;

export function SiteMonitoringDemoWidget() {
  const urlId = useId();
  const phraseId = useId();
  const waitId = useId();

  const [url, setUrl] = useState("");
  const [phrase, setPhrase] = useState("");
  const [checkPhrase, setCheckPhrase] = useState(false);
  const [waitingTime, setWaitingTime] = useState(15);
  const [result, setResult] = useState<SiteMonitoringDemoResult | null>(null);
  const [remaining, setRemaining] = useState(SITE_MONITORING_DEMO_MAX_RUNS);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const runCheck = useCallback(async () => {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await runSiteMonitoringDemo({
        url: url.trim(),
        phrase: checkPhrase ? phrase.trim() : "",
        waiting_time: waitingTime,
      });
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
  }, [url, phrase, checkPhrase, waitingTime]);

  return (
    <DemoWidgetShell
      title="Проверьте сайт без регистрации"
      lead="Разовая проверка URL — тот же HTTP-сценарий, что в кабинете. Расписание и оповещения — в кабинете: на Free — Telegram, на платных — ещё и email."
      features={DEMO_FEATURES}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor={urlId}>
            URL сайта
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
              onClick={() => setUrl(SITE_MONITORING_SAMPLE_URL)}
            >
              Пример: datagon.ru
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <input
              id={`${phraseId}-toggle`}
              type="checkbox"
              className="rounded border-slate-300"
              checked={checkPhrase}
              onChange={(e) => setCheckPhrase(e.target.checked)}
            />
            <label htmlFor={`${phraseId}-toggle`} className="text-sm text-slate-700">
              Проверить ключевую фразу в HTML
            </label>
          </div>
          {checkPhrase && (
            <div className="mt-2">
              <label className="sr-only" htmlFor={phraseId}>
                Ключевая фраза
              </label>
              <input
                id={phraseId}
                type="text"
                value={phrase}
                onChange={(e) => setPhrase(e.target.value)}
                placeholder="Фрагмент текста со страницы"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              />
            </div>
          )}

          <label className="mt-4 block text-sm font-medium text-slate-700" htmlFor={waitId}>
            Таймаут ответа
          </label>
          <select
            id={waitId}
            value={waitingTime}
            onChange={(e) => setWaitingTime(Number(e.target.value))}
            className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
          >
            <option value={10}>10 сек</option>
            <option value={15}>15 сек</option>
            <option value={20}>20 сек</option>
          </select>

          <button
            type="button"
            onClick={() => void runCheck()}
            disabled={loading || !url.trim() || remaining <= 0}
            className="mt-4 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {loading ? "Проверяем…" : "Проверить сейчас"}
          </button>
          <p className="mt-2 text-xs text-slate-500">
            Демо: {remaining} из {SITE_MONITORING_DEMO_MAX_RUNS} проверок сегодня
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-800">Результат</p>
          {!result && !error && (
            <p className="mt-2 text-sm text-slate-500">Укажите URL и нажмите «Проверить сейчас».</p>
          )}
          {error && (
            <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900" role="alert">
              {error}
            </p>
          )}
          {result && (
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Статус</dt>
                <dd className={`font-medium ${result.broken ? "text-red-600" : "text-emerald-700"}`}>
                  {result.status}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">HTTP-код</dt>
                <dd className="font-mono">{result.code}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Время ответа</dt>
                <dd>{result.response_time_ms} мс</dd>
              </div>
              {result.phrase_used && (
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">Фраза на странице</dt>
                  <dd>{result.broken ? "не найдена" : "найдена"}</dd>
                </div>
              )}
            </dl>
          )}
        </div>
      </div>

      <div className="mt-6">
        <DemoUpgradePanel
          registerUrl={buildSiteMonitoringRegisterUrl()}
          remaining={remaining}
          maxRuns={SITE_MONITORING_DEMO_MAX_RUNS}
          fullMaxChars={0}
          moduleTitle="мониторинга сайтов"
          showRemaining={false}
          upgradeHint="В кабинете — проекты, интервал от 5 минут, uptime и оповещения на email и в Telegram."
          details={SITE_MONITORING_CABINET_FEATURES}
        />
      </div>

      <div className="mt-4">
        <DemoModuleLinks
          links={[
            { href: "/monitoring-pozicii-sayta/", label: "Мониторинг позиций" },
            { href: "/monitoring-saytov/", label: "О модуле" },
          ]}
        />
      </div>
    </DemoWidgetShell>
  );
}
