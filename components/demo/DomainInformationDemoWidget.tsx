"use client";

import { useCallback, useId, useState } from "react";
import Link from "next/link";
import { DemoModuleLinks } from "@/components/demo/DemoModuleLinks";
import { DemoUpgradePanel } from "@/components/demo/DemoUpgradePanel";
import { DemoWidgetShell } from "@/components/demo/DemoWidgetShell";
import {
  buildDomainInformationRegisterUrl,
  DOMAIN_INFORMATION_CABINET_FEATURES,
  DOMAIN_INFORMATION_DEMO_MAX_RUNS,
  DOMAIN_INFORMATION_SAMPLE_DOMAIN,
} from "@/lib/demo/domain-information-demo";
import { runDomainInformationDemo } from "@/lib/demo/run-domain-information-demo-client";
import type { DomainInformationDemoResult } from "@/lib/demo/types";

const DEMO_FEATURES = [
  "Разовая WHOIS-проверка как в кабинете",
  "Срок регистрации и дни до окончания",
  "Список NS-серверов",
  "5 проверок в демо за сутки",
  "Мониторинг по расписанию — после регистрации",
] as const;

function formatDaysLeft(days: number | null): string {
  if (days === null) return "—";
  if (days < 0) return "истёк";
  return `${days} дн.`;
}

export function DomainInformationDemoWidget() {
  const domainId = useId();

  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<DomainInformationDemoResult | null>(null);
  const [remaining, setRemaining] = useState(DOMAIN_INFORMATION_DEMO_MAX_RUNS);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const runCheck = useCallback(async () => {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await runDomainInformationDemo({ domain: domain.trim() });
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
  }, [domain]);

  return (
    <DemoWidgetShell
      title="Проверьте домен без регистрации"
      lead="Разовый запрос WHOIS — те же данные, что при добавлении домена в кабинете. Ежедневный мониторинг, сравнение DNS и оповещения — после регистрации."
      features={DEMO_FEATURES}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor={domainId}>
            Домен
          </label>
          <input
            id={domainId}
            type="text"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.ru"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-mono"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
              onClick={() => setDomain(DOMAIN_INFORMATION_SAMPLE_DOMAIN)}
            >
              Пример: datagon.ru
            </button>
          </div>

          <button
            type="button"
            onClick={() => void runCheck()}
            disabled={loading || !domain.trim() || remaining <= 0}
            className="mt-4 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {loading ? "Проверяем…" : "Проверить WHOIS"}
          </button>
          <p className="mt-2 text-xs text-slate-500">
            Демо: {remaining} из {DOMAIN_INFORMATION_DEMO_MAX_RUNS} проверок сегодня
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-800">Результат</p>
          {!result && !error && (
            <p className="mt-2 text-sm text-slate-500">Укажите домен и нажмите «Проверить WHOIS».</p>
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
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Домен</dt>
                <dd className="font-mono text-slate-900">{result.domain}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Статус</dt>
                <dd className={`font-medium ${result.broken ? "text-amber-700" : "text-emerald-700"}`}>
                  {result.status}
                </dd>
              </div>
              {result.registered_at && (
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">Регистрация</dt>
                  <dd>{result.registered_at}</dd>
                </div>
              )}
              {result.expires_at && (
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">Окончание</dt>
                  <dd>{result.expires_at}</dd>
                </div>
              )}
              {result.expires_at && (
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">До окончания</dt>
                  <dd>{formatDaysLeft(result.days_until_expiry)}</dd>
                </div>
              )}
              {result.dns_servers.length > 0 && (
                <div>
                  <dt className="text-slate-500">NS</dt>
                  <dd className="mt-1 font-mono text-xs leading-relaxed text-slate-800">
                    {result.dns_servers.join(", ")}
                  </dd>
                </div>
              )}
              {result.registration_summary && !result.dns_servers.length && (
                <div>
                  <dt className="sr-only">Сводка</dt>
                  <dd className="text-slate-700">{result.registration_summary}</dd>
                </div>
              )}
              {result.message && (
                <p className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700">{result.message}</p>
              )}
            </dl>
          )}
        </div>
      </div>

      <div className="mt-6">
        <DemoUpgradePanel
          registerUrl={buildDomainInformationRegisterUrl()}
          remaining={remaining}
          maxRuns={DOMAIN_INFORMATION_DEMO_MAX_RUNS}
          fullMaxChars={0}
          moduleTitle="отслеживания доменов"
          showRemaining={false}
          upgradeHint="В кабинете — список доменов, ежедневная проверка, сравнение DNS, лог, PDF и оповещения."
          details={DOMAIN_INFORMATION_CABINET_FEATURES}
        />
      </div>

      <div className="mt-4">
        <DemoModuleLinks
          links={[
            { href: "/monitoring-saytov/", label: "Мониторинг сайтов" },
            { href: "/otslezhivanie-ssylok/", label: "Отслеживание ссылок" },
          ]}
        />
      </div>

      <p className="mt-4 text-xs text-slate-500">
        На тарифе «Бесплатный» оповещения — в{" "}
        <span className="whitespace-nowrap">Telegram</span>; письма на email — на{" "}
        <Link href="/tarify/" className="font-medium text-brand-600 hover:underline">
          платных тарифах
        </Link>
        .
      </p>
    </DemoWidgetShell>
  );
}
