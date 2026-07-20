import { TARIFF_COMPARE, TARIFF_COMPARE_ROWS, TARIFF_PLANS } from "@/lib/content/tariffs";

function renderTariffAlertsCell(planId: string) {
  if (planId === "Free") {
    return (
      <span className="inline-block text-center text-sm leading-snug text-slate-600">
        Только Telegram
        <span className="text-brand-600" title="После подключения бота в профиле">
          *
        </span>
      </span>
    );
  }

  return <span className="text-sm font-medium text-emerald-700">Email и Telegram</span>;
}

function renderCompareCell(rowKey: string, planId: string, raw: string) {
  if (rowKey === "sitesAlerts" || rowKey === "domainsAlerts" || rowKey === "linksAlerts") {
    return renderTariffAlertsCell(planId);
  }

  return raw;
}

export function TariffComparison() {
  const columns = TARIFF_PLANS.map((p) => ({ id: p.id, name: p.name, highlighted: p.highlighted }));

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-4 py-4 font-semibold text-slate-700">Модуль / лимит</th>
            {TARIFF_PLANS.map((plan) => (
              <th
                key={plan.name}
                className={`px-4 py-4 text-center font-bold ${
                  plan.highlighted ? "bg-brand-50 text-brand-700" : "text-slate-900"
                }`}
              >
                {plan.name}
                {plan.badge && (
                  <span className="mt-1 block text-xs font-medium text-brand-600">{plan.badge}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="bg-brand-50/40">
            <td className="border-t border-slate-200 px-4 py-3 font-semibold text-slate-700">Стоимость, ₽ / день</td>
            {TARIFF_PLANS.map((plan) => (
              <td
                key={plan.id}
                className={`border-t border-slate-200 px-4 py-3 text-center tabular-nums text-slate-900 ${
                  plan.highlighted ? "bg-brand-50 font-bold text-brand-700" : "font-semibold"
                }`}
              >
                {plan.pricePerDay === 0 ? "0" : plan.pricePerDay.toLocaleString("ru-RU")}
              </td>
            ))}
          </tr>
          {TARIFF_COMPARE_ROWS.map((row, i) => (
            <tr
              key={row.key}
              className={i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}
            >
              <td className="border-t border-slate-100 px-4 py-3 font-medium text-slate-700">
                {row.label}
              </td>
              {columns.map((col) => (
                <td
                  key={col.id}
                  className={`border-t border-slate-100 px-4 py-3 text-center tabular-nums text-slate-800 ${
                    col.highlighted ? "bg-brand-50/50 font-semibold" : "font-medium"
                  }`}
                >
                  {renderCompareCell(row.key, col.id, TARIFF_COMPARE[row.key][col.id])}
                </td>
              ))}
            </tr>
          ))}
          <tr className="bg-brand-50/30">
            <td className="border-t border-slate-200 px-4 py-3 font-medium text-slate-700">
              Утилиты (генераторы, UTM, ROI…)
            </td>
            <td colSpan={4} className="border-t border-slate-200 px-4 py-3 text-center font-medium text-emerald-700">
              Без ограничений на всех тарифах
            </td>
          </tr>
        </tbody>
      </table>
      <p className="border-t border-slate-100 px-4 py-3 text-xs leading-relaxed text-slate-600">
        <span className="font-medium text-slate-700">Проверка текста Есенин:</span> 1 текст или страница по URL ={" "}
        <strong className="font-medium text-slate-700">1 проверка</strong> из месячного лимита. Демо на titlo.ru — 2
        проверки в сутки без регистрации.
      </p>
      <p className="border-t border-slate-100 px-4 py-3 text-xs leading-relaxed text-slate-600">
        <span className="font-medium text-slate-700">Проверка индексации и сниппетов:</span> 1 URL в одной поисковой
        системе (Яндекс или Google) = <strong className="font-medium text-slate-700">1 проверка</strong>. В таблице —
        проверки / сохранения (сколько результатов с title и сниппетом хранится). Пакет до 500 URL за запуск.
      </p>
      <p className="border-t border-slate-100 px-4 py-3 text-xs leading-relaxed text-slate-600">
        <span className="font-medium text-slate-700">Мониторинг позиций:</span> лимит — число{" "}
        <strong className="font-medium text-slate-700">проверок</strong> в месяц. Одна проверка ≈ фраза × регион; при
        съёме частотности Wordstat — × число типов запроса. Перед запуском в кабинете видно, сколько спишется.
      </p>
      <p className="border-t border-slate-100 px-4 py-3 text-xs leading-relaxed text-slate-600">
        <span className="font-medium text-slate-700">Кластеризатор:</span> списание в{" "}
        <strong className="font-medium text-slate-700">проверках</strong> = число уникальных фраз × коэффициент типов
        поиска (базовый + каждый включённый режим). Пример: 5 фраз и два типа → 5 × 3 = 15.
      </p>
      <p className="border-t border-slate-100 px-4 py-3 text-xs leading-relaxed text-slate-600">
        <span className="font-medium text-slate-700">Анализ текста, подсказки, типы сайтов, записи домена, коммерция фраз:</span>{" "}
        в таблице <strong className="font-medium text-slate-700">проверки / сохранения</strong> — месячный лимит запусков
        и лимит сохранённых результатов в истории. У анализа текста сохранения — история уникальности/прогонов из модуля.
      </p>
      <p className="border-t border-slate-100 px-4 py-3 text-xs leading-relaxed text-slate-600">
        <span className="font-medium text-slate-700">Мониторинг сайтов, срок регистрации доменов и отслеживание ссылок:</span>{" "}
        на Free email не отправляется — данные в кабинете и Telegram после подключения бота в профиле (
        <span className="whitespace-nowrap">*</span>).
      </p>
    </div>
  );
}
