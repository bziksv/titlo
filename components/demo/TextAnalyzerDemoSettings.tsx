"use client";

import { useId } from "react";
import { DemoToggleSwitch } from "@/components/demo/DemoToggleSwitch";

export type TextAnalyzerDemoMode = "text" | "url";

export type TextAnalyzerDemoSettingsState = {
  mode: TextAnalyzerDemoMode;
  excludeStopWords: boolean;
  noIndex: boolean;
  hiddenText: boolean;
  compareCompetitor: boolean;
  competitorUrl: string;
};

type Props = {
  value: TextAnalyzerDemoSettingsState;
  onChange: (patch: Partial<TextAnalyzerDemoSettingsState>) => void;
};

export function TextAnalyzerDemoSettings({ value, onChange }: Props) {
  const noIndexId = useId();
  const hiddenTextId = useId();
  const stopWordsId = useId();
  const removeWordsId = useId();
  const compareId = useId();
  const competitorUrlId = useId();
  const isUrlMode = value.mode === "url";

  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/60 p-4 md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-900">
          <span className="mr-1.5 inline-block text-brand-600" aria-hidden>
            ⚙
          </span>
          Настройки анализа
        </p>
        <div
          role="tablist"
          aria-label="Режим анализа"
          className="flex gap-1 rounded-lg border border-slate-200 bg-white p-0.5 text-xs"
        >
          <button
            type="button"
            role="tab"
            aria-selected={value.mode === "text"}
            className={`rounded-md px-2.5 py-1 font-medium transition ${
              value.mode === "text" ? "bg-brand-600 text-white" : "text-slate-600 hover:text-slate-900"
            }`}
            onClick={() => onChange({ mode: "text", noIndex: false, hiddenText: false })}
          >
            Текст
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={value.mode === "url"}
            className={`rounded-md px-2.5 py-1 font-medium transition ${
              value.mode === "url" ? "bg-brand-600 text-white" : "text-slate-600 hover:text-slate-900"
            }`}
            onClick={() => onChange({ mode: "url" })}
          >
            URL
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-1 divide-y divide-slate-200/80">
        <DemoToggleSwitch
          id={noIndexId}
          label="Учитывать текст в noindex"
          hint={isUrlMode ? "Как в кабинете — текст внутри noindex попадёт в отчёт." : "Включите режим URL."}
          checked={isUrlMode ? value.noIndex : false}
          disabled={!isUrlMode}
          onChange={(checked) => onChange({ noIndex: checked })}
        />
        <DemoToggleSwitch
          id={hiddenTextId}
          label="Учитывать alt, title и data-text"
          hint={isUrlMode ? "Атрибуты alt, title и data-text на странице." : "Включите режим URL."}
          checked={isUrlMode ? value.hiddenText : false}
          disabled={!isUrlMode}
          onChange={(checked) => onChange({ hiddenText: checked })}
        />
        <DemoToggleSwitch
          id={stopWordsId}
          label="Исключать союзы, предлоги, местоимения"
          checked={value.excludeStopWords}
          onChange={(checked) => onChange({ excludeStopWords: checked })}
        />
        <DemoToggleSwitch
          id={removeWordsId}
          label={
            <>
              Исключать слова <span className="text-slate-500">(свой список)</span>
            </>
          }
          hint="Список слов для исключения — в полной версии кабинета."
          checked={false}
          disabled
          badge="кабинет"
        />
        <DemoToggleSwitch
          id={compareId}
          label="Сравнение с конкурентом"
          hint="В демо — сравнение KPI и топ-слов с URL конкурента (ограниченный отчёт)."
          checked={value.compareCompetitor}
          onChange={(checked) => onChange({ compareCompetitor: checked, competitorUrl: checked ? value.competitorUrl : "" })}
        />
      </div>

      {value.compareCompetitor ? (
        <div className="mt-4 border-t border-slate-200 pt-4">
          <label className="block text-sm font-medium text-slate-700" htmlFor={competitorUrlId}>
            URL страницы конкурента
          </label>
          <input
            id={competitorUrlId}
            type="url"
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-200"
            placeholder="https://competitor.example/page"
            value={value.competitorUrl}
            onChange={(e) => onChange({ competitorUrl: e.target.value })}
          />
          <p className="mt-1 text-xs text-slate-500">
            Страница конкурента загружается на сервере, как в кабинете. Облака и полное сравнение Ципфа — после регистрации.
          </p>
        </div>
      ) : null}
    </div>
  );
}
