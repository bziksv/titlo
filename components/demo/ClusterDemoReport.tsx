import type { ClusterDemoResultPayload } from "@/lib/demo/types";

type Props = { result: ClusterDemoResultPayload };

export function ClusterDemoReport({ result }: Props) {
  const { summary, groups, singles } = result;

  return (
    <div className="mt-8 space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
          <div className="text-2xl font-bold text-brand-700">{summary.phrases}</div>
          <p className="mt-1 text-xs text-slate-600">фраз обработано</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
          <div className="text-2xl font-bold text-brand-700">{summary.clusters}</div>
          <p className="mt-1 text-xs text-slate-600">кластеров</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
          <div className="text-2xl font-bold text-amber-700">{summary.singles}</div>
          <p className="mt-1 text-xs text-slate-600">нераспределённых</p>
        </div>
      </div>

      {groups.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-500">Кластеры</h4>
          <ul className="mt-3 space-y-3">
            {groups.map((group) => (
              <li key={group.name} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h5 className="font-semibold text-slate-900">{group.name}</h5>
                  <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-semibold text-brand-800">
                    {group.size} фр.
                  </span>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {group.phrases.map((phrase) => (
                    <li key={phrase} className="text-sm text-slate-700 before:mr-2 before:text-brand-400 before:content-['•']">
                      {phrase}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}

      {singles.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
          <h4 className="text-sm font-semibold text-amber-900">Нераспределённые фразы</h4>
          <ul className="mt-2 space-y-1">
            {singles.map((phrase) => (
              <li key={phrase} className="text-sm text-amber-950">
                {phrase}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-xs text-slate-500">
        Это упрощённый отчёт без сохранения. В кабинете результат попадает в «Мои проекты» — с частотностью, URL групп и Excel.
      </p>
    </div>
  );
}
