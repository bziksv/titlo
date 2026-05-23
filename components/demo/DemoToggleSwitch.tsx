"use client";

import type { ReactNode } from "react";

type Props = {
  id: string;
  label: ReactNode;
  hint?: string;
  checked: boolean;
  disabled?: boolean;
  badge?: string;
  onChange?: (checked: boolean) => void;
};

/** Переключатель в стиле кабинета (красный выкл / зелёный вкл). */
export function DemoToggleSwitch({ id, label, hint, checked, disabled, badge, onChange }: Props) {
  return (
    <div className="flex items-start gap-3 py-1">
      <label
        htmlFor={id}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center ${disabled ? "cursor-not-allowed opacity-55" : "cursor-pointer"}`}
      >
        <input
          id={id}
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
        />
        <span
          className="absolute inset-0 rounded-full bg-rose-400 transition-colors peer-checked:bg-emerald-500 peer-disabled:bg-slate-300"
          aria-hidden
        />
        <span
          className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5"
          aria-hidden
        />
      </label>
      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
          <span>{label}</span>
          {badge ? (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              {badge}
            </span>
          ) : null}
        </div>
        {hint ? <p className="mt-0.5 text-xs text-slate-500">{hint}</p> : null}
      </div>
    </div>
  );
}
