"use client";

import { useCallback, useId, useState } from "react";
import { DemoModuleLinks } from "@/components/demo/DemoModuleLinks";
import { DemoUpgradePanel } from "@/components/demo/DemoUpgradePanel";
import { DemoWidgetShell } from "@/components/demo/DemoWidgetShell";
import { runMetaTagsDemo } from "@/lib/demo/run-meta-tags-demo-client";
import type { MetaTagsDemoField, MetaTagsDemoResult } from "@/lib/demo/types";
import {
  buildMetaTagsRegisterUrl,
  META_TAGS_CABINET_FEATURES,
  META_TAGS_DEMO_MAX_RUNS,
  META_TAGS_SAMPLE_URL,
} from "@/lib/demo/meta-tags-demo";

const DEMO_FEATURES = [
  "Title, description, H1, canonical, robots",
  "Проверка длины title и description",
  "1 URL за запуск, 5 проверок в демо за сутки",
] as const;

const CABINET_MONITORING_NOTE =
  "В кабинете — полноценный мониторинг: проект на сотни страниц, автоматические снимки раз в сутки и сравнение с эталоном. Если кто-то изменил title, description, canonical или другие теги — придёт уведомление в Telegram (при подключённом боте). Вы будете в курсе, что разметку «подкрутили» без вашего ведома.";

function statusTone(status: string): string {
  if (status === "issue") return "text-red-700 bg-red-50 border-red-200";
  if (status === "missing") return "text-amber-800 bg-amber-50 border-amber-200";
  return "text-emerald-800 bg-emerald-50 border-emerald-200";
}

function statusLabel(status: string): string {
  if (status === "issue") return "Замечание";
  if (status === "missing") return "Не найден";
  return "OK";
}

function MetaTagsDemoFieldRow({ field }: { field: MetaTagsDemoField }) {
  return (
    <div className="border-b border-slate-100 px-4 py-3 last:border-b-0 sm:px-5 sm:py-4">
      <div className="flex flex-wrap items-start justify-between gap-2 gap-y-1">
        <p className="text-sm font-semibold text-slate-900">{field.label}</p>
        <span
          className={`inline-flex shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusTone(field.status)}`}
        >
          {statusLabel(field.status)}
        </span>
      </div>
      <div className="mt-2 text-sm leading-relaxed text-slate-700">
        {field.values.length > 0 ? (
          <ul className="space-y-1.5">
            {field.values.map((v, i) => (
              <li key={`${field.tag}-${i}`} className="break-words">
                {v}
              </li>
            ))}
          </ul>
        ) : (
          <span className="text-slate-400">—</span>
        )}
        {field.messages.length > 0 && (
          <ul className="mt-2 space-y-1 text-xs text-slate-500">
            {field.messages.map((m) => (
              <li key={m} className="rounded-md bg-slate-50 px-2 py-1">
                {m}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function MetaTagsDemoReport({ result }: { result: MetaTagsDemoResult }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm sm:px-5">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Запрошенный URL</p>
        <p className="mt-1 break-all font-medium text-slate-900">{result.requested_url}</p>
        {result.final_url && result.final_url !== result.requested_url && (
          <>
            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-500">Итоговый URL</p>
            <p className="mt-1 break-all text-slate-800">{result.final_url}</p>
          </>
        )}
      </div>

      {result.redirect && (
        <p className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-2.5 text-sm text-sky-900">
          Редирект: {result.redirect}
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {result.fields.map((field) => (
          <MetaTagsDemoFieldRow key={field.tag} field={field} />
        ))}
      </div>

      {result.issues_count > 0 && (
        <p className="text-sm text-slate-600">
          Найдено замечаний: <strong>{result.issues_count}</strong>
        </p>
      )}
    </div>
  );
}

export function MetaTagsDemoWidget() {
  const urlId = useId();
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<MetaTagsDemoResult | null>(null);
  const [remaining, setRemaining] = useState(META_TAGS_DEMO_MAX_RUNS);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const runCheck = useCallback(async () => {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await runMetaTagsDemo({ url: url.trim() });
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
      title="Проверьте мета-теги без регистрации"
      lead="Сейчас — разовая проверка одной страницы, как первый шаг в кабинете. После регистрации — мониторинг по расписанию, история снимков и оповещения об изменениях разметки."
      features={DEMO_FEATURES}
    >
      <p className="mb-6 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm leading-relaxed text-brand-950">
        {CABINET_MONITORING_NOTE}
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
            placeholder="https://example.com/page/"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
              onClick={() => setUrl(META_TAGS_SAMPLE_URL)}
            >
              Пример: datagon.ru
            </button>
          </div>

          <button
            type="button"
            onClick={() => void runCheck()}
            disabled={loading || !url.trim() || remaining <= 0}
            className="mt-4 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {loading ? "Снимаем теги…" : "Проверить страницу"}
          </button>
          <p className="mt-2 text-xs text-slate-500">
            Демо: {remaining} из {META_TAGS_DEMO_MAX_RUNS} проверок сегодня · 1 URL за запуск
          </p>
        </div>

        <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
          <p className="text-sm font-semibold text-slate-800">Результат</p>
          {!result && !error && (
            <p className="mt-2 text-sm text-slate-500">Укажите URL и нажмите «Проверить страницу».</p>
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
              <MetaTagsDemoReport result={result} />
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <DemoUpgradePanel
          registerUrl={buildMetaTagsRegisterUrl()}
          remaining={remaining}
          maxRuns={META_TAGS_DEMO_MAX_RUNS}
          fullMaxChars={0}
          moduleTitle="мониторинга мета-тегов"
          showRemaining={false}
          upgradeHint="Зарегистрируйтесь — сохраните проект, включите мониторинг и получайте уведомления, если мета-теги на сайте изменились."
          details={META_TAGS_CABINET_FEATURES}
        />
      </div>

      <div className="mt-4">
        <DemoModuleLinks
          links={[
            { href: "/http-headers/", label: "HTTP-заголовки" },
            { href: "/monitoring-saytov/", label: "Мониторинг сайтов" },
          ]}
        />
      </div>
    </DemoWidgetShell>
  );
}
