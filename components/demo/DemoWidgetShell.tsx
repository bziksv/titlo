import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: string;
  lead: string;
  features?: readonly string[];
  badge?: ReactNode;
  children: ReactNode;
};

/** Внутренняя оболочка демо-виджета (секция с фоном — в ModuleV2DemoSection). */
export function DemoWidgetShell({ title, lead, features, badge, children }: Props) {
  return (
    <div className="p-6 md:p-8 lg:p-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">{title}</h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">{lead}</p>
            </div>
            {badge}
          </div>
          <div className="mt-6">{children}</div>
        </div>

        {features && features.length > 0 && (
          <aside className="hidden lg:block">
            <div className="sticky top-6 rounded-xl border border-brand-100 bg-gradient-to-b from-brand-50 to-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">В демо-отчёте</p>
              <ul className="mt-4 space-y-3">
                {features.map((f) => (
                  <li key={f} className="flex gap-2.5 text-sm text-slate-700">
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white"
                      aria-hidden
                    >
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-brand-100 pt-4 text-xs leading-relaxed text-slate-500">
                Полный доступ — регистрация в кабинете, без карты на старте.
              </p>
            </div>
          </aside>
        )}
      </div>

      {features && features.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-2 lg:hidden">
          {features.map((f) => (
            <li
              key={f}
              className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-800"
            >
              {f}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
