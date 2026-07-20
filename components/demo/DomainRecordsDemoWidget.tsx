"use client";

import { useCallback, useId, useState } from "react";
import { DemoModuleLinks } from "@/components/demo/DemoModuleLinks";
import { DemoUpgradePanel } from "@/components/demo/DemoUpgradePanel";
import { DemoWidgetShell } from "@/components/demo/DemoWidgetShell";
import { runDomainRecordsDemo } from "@/lib/demo/run-domain-records-demo-client";
import type { DomainRecordsDemoResult } from "@/lib/demo/types";
import {
  buildDomainRecordsRegisterUrl,
  DOMAIN_RECORDS_CABINET_FEATURES,
  DOMAIN_RECORDS_DEMO_FEATURES,
  DOMAIN_RECORDS_DEMO_MAX_RUNS,
  DOMAIN_RECORDS_SAMPLE_DOMAIN,
} from "@/lib/demo/domain-records-demo";

function statusLabel(key: string | null | undefined, registered?: boolean): string {
  if (key === "free") return "Свободен";
  if (key === "error") return "Ошибка запроса сведений";
  if (key === "ok" || registered) return "Зарегистрирован";
  if (registered === false) return "Свободен";
  return "—";
}

function DomainRecordsDemoReport({ result }: { result: DomainRecordsDemoResult }) {
  const whois = result.whois;
  const summary = result.summary;
  const dnsEntries = Object.entries(result.dns_counts).filter(([, n]) => n > 0);

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Домен</p>
          <p className="mt-1 text-sm font-medium text-slate-900">{result.domain}</p>
          {result.punycode && result.punycode !== result.domain ? (
            <p className="mt-1 font-mono text-xs text-slate-500">{result.punycode}</p>
          ) : null}
        </div>

        <div className="grid gap-3 border-b border-slate-100 p-4 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Регистрация</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {statusLabel(whois.status_key ?? summary.status_key, summary.registered)}
            </p>
            {(whois.expires_at || summary.expires_at) && (
              <p className="mt-1 text-xs text-slate-600">
                Истекает: {whois.expires_at ?? summary.expires_at}
                {(whois.days_until_expiry ?? summary.days_until_expiry) != null
                  ? ` · ${whois.days_until_expiry ?? summary.days_until_expiry} дн.`
                  : ""}
              </p>
            )}
            {whois.registered_at && (
              <p className="mt-0.5 text-xs text-slate-600">Создан: {whois.registered_at}</p>
            )}
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Серверы имён</p>
            {(whois.dns_servers ?? summary.ns ?? []).length === 0 ? (
              <p className="mt-1 text-sm text-slate-500">—</p>
            ) : (
              <ul className="mt-1 space-y-0.5 text-xs text-slate-700">
                {(whois.dns_servers ?? summary.ns ?? []).slice(0, 4).map((ns) => (
                  <li key={ns} className="font-mono">
                    {ns}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="border-b border-slate-100 px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">DNS (число записей)</p>
          {dnsEntries.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">Записи не найдены</p>
          ) : (
            <div className="mt-2 flex flex-wrap gap-2">
              {dnsEntries.map(([type, count]) => (
                <span
                  key={type}
                  className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-xs text-slate-800"
                >
                  {type}: {count}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">Адрес и соседи</p>
          {result.ips.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">Адрес не определён</p>
          ) : (
            <ul className="mt-2 space-y-3">
              {result.ips.map((row, i) => (
                <li key={`${row.ip}-${i}`} className="text-sm">
                  <p className="font-mono font-semibold text-slate-900">{row.ip ?? "—"}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Соседей: {row.neighbors_count}
                    {row.neighbors_truncated ? " (в демо показана часть)" : ""}
                  </p>
                  {row.neighbors.length > 0 && (
                    <ul className="mt-1 max-h-28 overflow-auto text-xs text-slate-600">
                      {row.neighbors.map((n) => (
                        <li key={n} className="font-mono">
                          {n}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export function DomainRecordsDemoWidget() {
  const inputId = useId();
  const [domain, setDomain] = useState(DOMAIN_RECORDS_SAMPLE_DOMAIN);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [result, setResult] = useState<DomainRecordsDemoResult | null>(null);

  const onSubmit = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await runDomainRecordsDemo({ domain: domain.trim() });
    setLoading(false);

    if (!res.ok) {
      setError(res.message ?? "Не удалось получить записи домена");
      if (res.remaining !== undefined) setRemaining(res.remaining);
      return;
    }

    setResult(res.data.result);
    setRemaining(res.data.remaining);
  }, [domain]);

  return (
    <DemoWidgetShell
      title="Проверьте записи домена без регистрации"
      lead="Сейчас — один домен: регистрация, сводка DNS, адрес и часть соседей. После регистрации — полная карточка, история, сравнение и связка с мониторингом."
      features={DOMAIN_RECORDS_DEMO_FEATURES}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-slate-700">
            Домен или URL
          </label>
          <input
            id={inputId}
            type="text"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="например: example.ru"
            maxLength={120}
          />
        </div>

        <button
          type="button"
          onClick={onSubmit}
          disabled={loading || !domain.trim()}
          className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? "Проверяем…" : "Проверить домен"}
        </button>

        {remaining !== null && (
          <p className="text-xs text-slate-500">
            Осталось демо-проверок сегодня: <strong>{remaining}</strong> / {DOMAIN_RECORDS_DEMO_MAX_RUNS}
          </p>
        )}

        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>
        )}

        {result && <DomainRecordsDemoReport result={result} />}

        <DemoUpgradePanel
          registerUrl={buildDomainRecordsRegisterUrl()}
          remaining={remaining ?? DOMAIN_RECORDS_DEMO_MAX_RUNS}
          maxRuns={DOMAIN_RECORDS_DEMO_MAX_RUNS}
          fullMaxChars={100}
          moduleTitle="записей домена"
          upgradeHint="Ниже — что открывается после регистрации. В демо этого нет."
          details={DOMAIN_RECORDS_CABINET_FEATURES}
        />
        <DemoModuleLinks
          links={[
            { href: "/otslezhivanie-sroka-registratsii-domenov/", label: "Срок регистрации" },
            { href: "/monitoring-saytov/", label: "Мониторинг сайтов" },
          ]}
        />
      </div>
    </DemoWidgetShell>
  );
}
