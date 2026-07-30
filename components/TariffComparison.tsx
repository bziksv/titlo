"use client";

import { useMemo, useState } from "react";
import { TARIFF_COMPARE, TARIFF_COMPARE_ROWS, TARIFF_PLANS } from "@/lib/content/tariffs";
import { LK_URL } from "@/lib/site";

type Period = {
  id: string;
  months: number;
  discount: number;
  label: string;
  short: string;
};

const PERIODS: Period[] = [
  { id: "1", months: 1, discount: 0, label: "1 месяц", short: "1 мес." },
  { id: "3", months: 3, discount: 0.1, label: "3 месяца", short: "3 мес." },
  { id: "6", months: 6, discount: 0.2, label: "6 месяцев", short: "6 мес." },
  { id: "12", months: 12, discount: 0.35, label: "12 месяцев", short: "12 мес." },
];

function daysInPeriod(months: number): number {
  return months * 30;
}

function effectivePerDay(base: number, discount: number): number {
  if (base <= 0) return 0;
  return Math.round(base * (1 - discount));
}

function periodTotal(base: number, months: number, discount: number): number {
  if (base <= 0) return 0;
  return Math.round(base * daysInPeriod(months) * (1 - discount));
}

function renderTariffAlertsCell(planId: string) {
  if (planId === "Free") {
    return (
      <span className="inline-flex flex-col items-center text-[11px] leading-snug text-slate-600 sm:text-sm">
        <span>
          Telegram
          <span className="text-brand-600" title="После подключения бота в профиле">
            *
          </span>
        </span>
        <span className="hidden text-slate-400 sm:inline">без email</span>
      </span>
    );
  }

  return (
    <span className="inline-flex flex-col items-center gap-0.5 text-[11px] font-medium text-emerald-700 sm:text-sm">
      <span className="text-base leading-none sm:text-lg" aria-hidden>
        ✓
      </span>
      <span className="sm:hidden">Email+TG</span>
      <span className="hidden sm:inline">Email и Telegram</span>
    </span>
  );
}

function renderCompareCell(rowKey: string, planId: string, raw: string) {
  if (rowKey === "sitesAlerts" || rowKey === "domainsAlerts" || rowKey === "linksAlerts") {
    return renderTariffAlertsCell(planId);
  }

  return <span className="tabular-nums">{raw}</span>;
}

export function TariffComparison() {
  const [periodId, setPeriodId] = useState("1");
  const period = PERIODS.find((p) => p.id === periodId) ?? PERIODS[0];

  const prices = useMemo(
    () =>
      TARIFF_PLANS.map((plan) => {
        const perDay = effectivePerDay(plan.pricePerDay, period.discount);
        const total = periodTotal(plan.pricePerDay, period.months, period.discount);
        const perMonth = plan.pricePerDay === 0 ? 0 : Math.round(total / period.months);
        return { plan, perDay, total, perMonth };
      }),
    [period],
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Период оплаты</p>
          <div
            className="mt-2 inline-flex max-w-full flex-wrap rounded-full border border-slate-200 bg-slate-50 p-1"
            role="group"
            aria-label="Период оплаты"
          >
            {PERIODS.map((p) => {
              const active = p.id === period.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPeriodId(p.id)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition sm:px-4 ${
                    active
                      ? "bg-brand-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-white hover:text-slate-900"
                  }`}
                >
                  {p.short}
                  {p.discount > 0 ? (
                    <span className={`ml-1 text-xs ${active ? "text-brand-100" : "text-emerald-600"}`}>
                      −{Math.round(p.discount * 100)}%
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
        {period.discount > 0 ? (
          <div className="rounded-xl border border-brand-100 bg-brand-50 px-4 py-2.5 text-sm text-brand-900">
            <span className="font-semibold">Скидка {Math.round(period.discount * 100)}%</span>
            {" — "}
            цена за день ниже при оплате на {period.label.toLowerCase()}.
          </div>
        ) : (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-950">
            На 3 / 6 / 12 месяцев — скидки 10% / 20% / 35%.
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 z-20 w-[7.5rem] min-w-[7rem] border-b border-slate-200 bg-white px-2 py-4 align-bottom sm:w-[12rem] sm:min-w-[11rem] sm:px-4 sm:py-5 md:w-[14rem]">
                <span className="sr-only">Параметр</span>
              </th>
              {prices.map(({ plan, perDay, perMonth, total }) => {
                const hi = Boolean(plan.highlighted);
                return (
                  <th
                    key={plan.id}
                    className={`min-w-[9.5rem] border-b border-slate-200 px-3 py-5 text-center align-bottom sm:min-w-[11rem] sm:px-4 ${
                      hi ? "bg-brand-50/80" : "bg-white"
                    }`}
                  >
                    <div className="mb-2 flex min-h-[1.5rem] items-center justify-center">
                      {plan.badge ? (
                        <span className="inline-flex whitespace-nowrap rounded-full bg-brand-600 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow">
                          {plan.badge}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      {plan.tagline}
                    </p>
                    <p className={`mt-1 text-xl font-bold sm:text-2xl ${hi ? "text-brand-700" : "text-slate-900"}`}>
                      {plan.name}
                    </p>
                    <div className="mt-3 min-h-[4.5rem]">
                      {plan.pricePerDay === 0 ? (
                        <>
                          <p className="text-3xl font-bold tabular-nums text-brand-600">0 ₽</p>
                          <p className="mt-1 text-xs text-slate-500">навсегда бесплатно</p>
                        </>
                      ) : (
                        <>
                          <p className="text-3xl font-bold tabular-nums text-brand-600">
                            {perDay.toLocaleString("ru-RU")}
                            <span className="text-base font-medium text-slate-500"> ₽</span>
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500">в день</p>
                          <p className="mt-1 text-xs leading-snug text-slate-500">
                            ≈ {perMonth.toLocaleString("ru-RU")} ₽/мес
                            {period.months > 1 ? (
                              <>
                                <br />
                                {total.toLocaleString("ru-RU")} ₽ за {period.short}
                              </>
                            ) : null}
                          </p>
                          {period.discount > 0 && plan.pricePerDay !== perDay ? (
                            <p className="mt-1 text-[11px] text-slate-400 line-through">
                              {plan.pricePerDay.toLocaleString("ru-RU")} ₽/день
                            </p>
                          ) : null}
                        </>
                      )}
                    </div>
                    <a
                      href={`${LK_URL}/register`}
                      className={`mt-4 inline-flex w-full items-center justify-center rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                        hi
                          ? "bg-brand-600 text-white shadow-sm hover:bg-brand-700"
                          : "border border-slate-300 bg-white text-slate-800 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
                      }`}
                    >
                      {plan.id === "Free" ? "Начать бесплатно" : "Выбрать"}
                    </a>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {TARIFF_COMPARE_ROWS.map((row, i) => (
              <tr key={row.key} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                <th
                  scope="row"
                  title={row.label}
                  className={`sticky left-0 z-10 border-t border-slate-100 px-2 py-2 text-left text-[11px] font-medium leading-snug text-slate-700 sm:px-4 sm:py-3 sm:text-sm ${
                    i % 2 === 0 ? "bg-white" : "bg-slate-50"
                  }`}
                >
                  <span className="md:hidden">{row.short}</span>
                  <span className="hidden md:inline">{row.label}</span>
                </th>
                {TARIFF_PLANS.map((plan) => (
                  <td
                    key={plan.id}
                    className={`border-t border-slate-100 px-2 py-2 text-center text-xs text-slate-800 sm:px-4 sm:py-3 sm:text-sm ${
                      plan.highlighted ? "bg-brand-50/40 font-semibold" : "font-medium"
                    }`}
                  >
                    {renderCompareCell(row.key, plan.id, TARIFF_COMPARE[row.key][plan.id])}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="bg-emerald-50/40">
              <th
                scope="row"
                className="sticky left-0 z-10 border-t border-slate-200 bg-emerald-50 px-2 py-2 text-left text-[11px] font-medium text-slate-700 sm:px-4 sm:py-3 sm:text-sm"
              >
                <span className="md:hidden">Утилиты</span>
                <span className="hidden md:inline">Утилиты (генераторы, UTM, ROI…)</span>
              </th>
              {TARIFF_PLANS.map((plan) => (
                <td
                  key={plan.id}
                  className={`border-t border-slate-200 px-2 py-2 text-center text-xs font-medium text-emerald-700 sm:px-4 sm:py-3 sm:text-sm ${
                    plan.highlighted ? "bg-brand-50/30" : ""
                  }`}
                >
                  <span className="text-base leading-none sm:text-lg" aria-hidden>
                    ✓
                  </span>
                  <span className="mt-0.5 block text-[10px] sm:text-xs">без лимитов</span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>

        <div className="space-y-0 border-t border-slate-100 text-xs leading-relaxed text-slate-600">
          <p className="px-4 py-3">
            <span className="font-medium text-slate-700">Проверка текста Есенин:</span> 1 текст или страница по URL ={" "}
            <strong className="font-medium text-slate-700">1 проверка</strong> из месячного лимита. Демо на titlo.ru — 2
            проверки в сутки без регистрации.
          </p>
          <p className="border-t border-slate-100 px-4 py-3">
            <span className="font-medium text-slate-700">Проверка индексации и сниппетов:</span> 1 URL в одной поисковой
            системе (Яндекс или Google) = <strong className="font-medium text-slate-700">1 проверка</strong>. В таблице —
            проверки / сохранения. Пакет до 500 URL за запуск.
          </p>
          <p className="border-t border-slate-100 px-4 py-3">
            <span className="font-medium text-slate-700">Мониторинг позиций:</span> лимит — число{" "}
            <strong className="font-medium text-slate-700">проверок</strong> в месяц. Одна проверка ≈ фраза × регион; при
            съёме частотности Wordstat — × число типов запроса.
          </p>
          <p className="border-t border-slate-100 px-4 py-3">
            <span className="font-medium text-slate-700">Кластеризатор:</span> списание в{" "}
            <strong className="font-medium text-slate-700">проверках</strong> = число уникальных фраз × коэффициент типов
            поиска.
          </p>
          <p className="border-t border-slate-100 px-4 py-3">
            <span className="font-medium text-slate-700">Анализ текста, подсказки, типы сайтов, записи домена, коммерция
            фраз:</span>{" "}
            в таблице <strong className="font-medium text-slate-700">проверки / сохранения</strong>.
          </p>
          <p className="border-t border-slate-100 px-4 py-3">
            <span className="font-medium text-slate-700">Мониторинг сайтов, доменов и ссылок:</span> на Free email не
            отправляется — кабинет и Telegram после подключения бота (
            <span className="whitespace-nowrap">*</span>). Расчёт периода: 30 дней в месяце.
          </p>
        </div>
      </div>
    </div>
  );
}
