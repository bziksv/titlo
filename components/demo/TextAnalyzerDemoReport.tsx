"use client";

import { TextAnalyzerSpiralCloud } from "@/components/demo/TextAnalyzerSpiralCloud";
import type {
  TextAnalyzerCloudWord,
  TextAnalyzerDemoComparison,
  TextAnalyzerDemoResult,
  TextAnalyzerGeneral,
  TextAnalyzerCompareWord,
  TextAnalyzerPhraseRow,
  TextAnalyzerTopWord,
  TextAnalyzerZipfPoint,
  TextAnalyzerZipfRow,
} from "@/lib/demo/types";

function PreviewNote({ shown, total, noun }: { shown: number; total: number; noun: string }) {
  if (total <= shown) return null;
  return (
    <p className="mt-2 text-xs text-slate-500">
      Показано {shown} из {total} {noun}. Полный отчёт — в кабинете после регистрации.
    </p>
  );
}

function WordsTable({ rows, shown, total }: { rows: TextAnalyzerTopWord[]; shown: number; total: number }) {
  if (rows.length === 0) return null;
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-900">Общий анализ слов</h3>
      <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-2 font-semibold">Слово</th>
              <th className="px-4 py-2 font-semibold text-right">Плотность</th>
              <th className="px-4 py-2 font-semibold text-right">Всего</th>
              <th className="px-4 py-2 font-semibold text-right">В тексте</th>
              <th className="px-4 py-2 font-semibold text-right">В ссылках</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((word) => (
              <tr key={word.text} className="border-t border-slate-100">
                <td className="px-4 py-2 font-medium text-slate-800">{word.text}</td>
                <td className="px-4 py-2 text-right font-mono text-slate-600">{word.density}</td>
                <td className="px-4 py-2 text-right font-mono text-slate-600">{word.total}</td>
                <td className="px-4 py-2 text-right font-mono text-slate-600">{word.inText}</td>
                <td className="px-4 py-2 text-right font-mono text-slate-600">{word.inLink}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PreviewNote shown={shown} total={total} noun="слов" />
      <p className="mt-1 text-xs text-slate-500">Словоформы и полная таблица — в кабинете.</p>
    </div>
  );
}

function ZipfChart({ graph }: { graph: TextAnalyzerZipfPoint[] }) {
  if (graph.length < 2) return null;

  const width = 520;
  const height = 220;
  const pad = { t: 16, r: 16, b: 28, l: 36 };
  const innerW = width - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;
  const maxY = Math.max(...graph.map((p) => p.y), 1);
  const baseY = graph[0]?.y ?? 1;

  const toX = (rank: number) => pad.l + ((rank - 1) / Math.max(graph.length - 1, 1)) * innerW;
  const toY = (y: number) => pad.t + innerH - (y / maxY) * innerH;

  const actualPath = graph.map((p) => `${toX(p.x)},${toY(p.y)}`).join(" ");
  const idealPath = graph
    .map((p) => {
      const ideal = Math.max(1, Math.round(baseY / p.x));
      return `${toX(p.x)},${toY(ideal)}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full max-w-xl" role="img" aria-label="График закона Ципфа">
      <line x1={pad.l} y1={pad.t + innerH} x2={width - pad.r} y2={pad.t + innerH} stroke="#e2e8f0" />
      <line x1={pad.l} y1={pad.t} x2={pad.l} y2={pad.t + innerH} stroke="#e2e8f0" />
      <polyline fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="5 4" points={idealPath} />
      <polyline fill="none" stroke="#1d4ed8" strokeWidth="2.5" points={actualPath} />
      {graph.map((p) => (
        <circle key={p.x} cx={toX(p.x)} cy={toY(p.y)} r="3.5" fill="#1d4ed8" stroke="#fff" strokeWidth="1" />
      ))}
    </svg>
  );
}

function ZipfSection({
  graph,
  rows,
  shown,
  total,
}: {
  graph: TextAnalyzerZipfPoint[];
  rows: TextAnalyzerZipfRow[];
  shown: number;
  total: number;
}) {
  if (rows.length === 0 && graph.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-900">Закон Ципфа</h3>
      <p className="mt-1 text-xs text-slate-500">Синяя линия — факт, оранжевая пунктирная — идеал.</p>
      {graph.length >= 2 && (
        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
          <ZipfChart graph={graph} />
          <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-600">
            <span><span className="inline-block h-2 w-4 rounded bg-blue-700 align-middle" /> Факт</span>
            <span><span className="inline-block h-2 w-4 rounded border border-dashed border-orange-500 align-middle" /> Идеал</span>
          </div>
        </div>
      )}
      {rows.length > 0 && (
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2 font-semibold text-right">#</th>
                <th className="px-3 py-2 font-semibold">Слово</th>
                <th className="px-3 py-2 font-semibold text-right">Факт</th>
                <th className="px-3 py-2 font-semibold text-right">Идеал</th>
                <th className="px-3 py-2 font-semibold text-right">Δ</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${row.rank}-${row.word}`} className="border-t border-slate-100">
                  <td className="px-3 py-2 text-right font-mono text-slate-500">{row.rank}</td>
                  <td className="px-3 py-2 font-medium text-slate-800">{row.word}</td>
                  <td className="px-3 py-2 text-right font-mono">{row.actual}</td>
                  <td className="px-3 py-2 text-right font-mono text-slate-500">{row.ideal}</td>
                  <td className={`px-3 py-2 text-right font-mono ${row.delta > 0 ? "text-emerald-700" : row.delta < 0 ? "text-amber-700" : ""}`}>
                    {row.delta > 0 ? `+${row.delta}` : row.delta}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <PreviewNote shown={shown} total={total} noun="строк таблицы Ципфа" />
    </div>
  );
}

function PhrasesTable({
  rows,
  shown,
  total,
}: {
  rows: TextAnalyzerPhraseRow[];
  shown: number;
  total: number;
}) {
  if (rows.length === 0) return null;
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-900">Словосочетания из 2 слов</h3>
      <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-2 font-semibold">Фраза</th>
              <th className="px-4 py-2 font-semibold text-right">Кол-во</th>
              <th className="px-4 py-2 font-semibold text-right">Плотность</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.phrase} className="border-t border-slate-100">
                <td className="px-4 py-2 font-medium text-slate-800">{row.phrase}</td>
                <td className="px-4 py-2 text-right font-mono text-slate-600">{row.count}</td>
                <td className="px-4 py-2 text-right font-mono text-slate-600">{row.density}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PreviewNote shown={shown} total={total} noun="фраз" />
    </div>
  );
}

function TextCloud({
  words,
  shown,
  total,
}: {
  words: TextAnalyzerCloudWord[];
  shown: number;
  total: number;
}) {
  if (words.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-900">Облако слов — зона текста</h3>
      <p className="mt-1 text-xs text-slate-500">В демо только текстовая зона. Облака «Ссылки» и «Обе зоны» — в кабинете.</p>
      <div className="mt-3">
        <TextAnalyzerSpiralCloud words={words} wordLimit={80} />
      </div>
      <PreviewNote shown={shown} total={total} noun="слов в облаке" />
    </div>
  );
}

function KpiGrid({ general, label }: { general: TextAnalyzerGeneral; label: string }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Слов", general.countWords],
          ["Символов с пробелами", general.textLength],
          ["Пробелов", general.countSpaces],
          ["Символов без пробелов", general.lengthWithOutSpaces],
        ].map(([title, value]) => (
          <div
            key={`${label}-${String(title)}`}
            className="rounded-xl border border-brand-100 bg-gradient-to-b from-brand-50 to-white px-4 py-3 shadow-sm"
          >
            <dt className="text-xs font-medium text-slate-500">{title}</dt>
            <dd className="mt-1 text-2xl font-bold tabular-nums text-brand-700">
              {typeof value === "number" ? value.toLocaleString("ru-RU") : value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function CompareSection({ comparison, general }: { comparison: TextAnalyzerDemoComparison; general: TextAnalyzerGeneral }) {
  const host = comparison.competitor_host || comparison.competitor_url;

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 md:p-5">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="font-semibold text-slate-900">Сравнение с конкурентом</span>
        <span className="text-slate-500">·</span>
        <a
          href={comparison.competitor_url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-brand-700 underline decoration-brand-200 underline-offset-2 hover:text-brand-800"
        >
          {host}
        </a>
      </div>

      <div className="mt-5 space-y-5">
        <KpiGrid general={general} label="Ваш текст" />
        <KpiGrid general={comparison.general_competitor} label="Конкурент" />
      </div>

      {comparison.words.rows.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-slate-900">Слова: вы vs конкурент</h3>
          <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-2 font-semibold">Слово</th>
                  <th className="px-4 py-2 font-semibold text-right">У вас</th>
                  <th className="px-4 py-2 font-semibold text-right">Конкурент</th>
                  <th className="px-4 py-2 font-semibold text-right">Δ</th>
                </tr>
              </thead>
              <tbody>
                {comparison.words.rows.map((row: TextAnalyzerCompareWord) => (
                  <tr key={row.text} className="border-t border-slate-100">
                    <td className="px-4 py-2 font-medium text-slate-800">{row.text}</td>
                    <td className="px-4 py-2 text-right font-mono text-slate-600">{row.main_total}</td>
                    <td className="px-4 py-2 text-right font-mono text-slate-600">{row.competitor_total}</td>
                    <td
                      className={`px-4 py-2 text-right font-mono ${
                        row.delta_total > 0 ? "text-emerald-700" : row.delta_total < 0 ? "text-rose-700" : "text-slate-500"
                      }`}
                    >
                      {row.delta_total > 0 ? `+${row.delta_total}` : row.delta_total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PreviewNote shown={comparison.words.shown} total={comparison.words.total} noun="слов в сравнении" />
        </div>
      ) : null}

      <p className="mt-4 text-xs text-slate-600">
        В кабинете — сравнение графиков Ципфа, облаков по зонам и полных таблиц фраз.
      </p>
    </div>
  );
}

function LockedZonesStrip({ locked }: { locked: readonly string[] }) {
  const labels: Record<string, string> = {
    cloud_links: "Облако: зона ссылок",
    cloud_both: "Облако: обе зоны",
    compare: "Сравнение с конкурентом",
    compare_zipf: "Сравнение графиков Ципфа",
    compare_cloud: "Сравнение облаков",
    url: "Анализ по URL",
    export: "Excel / PDF",
    word_forms: "Словоформы",
  };

  const items = locked.map((key) => labels[key] ?? key).filter(Boolean);
  if (items.length === 0) return null;

  return (
    <div className="rounded-xl border border-dashed border-brand-200 bg-brand-50/50 p-4">
      <p className="text-sm font-semibold text-slate-900">Доступно в полной версии кабинета</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item} className="rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-medium text-brand-800">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

type Props = {
  result: TextAnalyzerDemoResult["result"];
};

export function TextAnalyzerDemoReport({ result }: Props) {
  const { general, words, zipf, phrases, cloud, comparison, locked } = result;

  return (
    <div className="mt-8 space-y-8">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Сводка</h3>
        <dl className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            ["Слов", general.countWords],
            ["Символов с пробелами", general.textLength],
            ["Пробелов", general.countSpaces],
            ["Символов без пробелов", general.lengthWithOutSpaces],
          ].map(([label, value]) => (
            <div
              key={String(label)}
              className="rounded-xl border border-brand-100 bg-gradient-to-b from-brand-50 to-white px-4 py-3 shadow-sm"
            >
              <dt className="text-xs font-medium text-slate-500">{label}</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums text-brand-700">
                {typeof value === "number" ? value.toLocaleString("ru-RU") : value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {comparison ? <CompareSection comparison={comparison} general={general} /> : null}

      <WordsTable rows={words.rows} shown={words.shown} total={words.total} />
      <ZipfSection graph={zipf.graph} rows={zipf.rows} shown={zipf.shown} total={zipf.total} />
      <TextCloud words={cloud.text} shown={cloud.text_shown} total={cloud.text_total} />
      <PhrasesTable rows={phrases.rows} shown={phrases.shown} total={phrases.total} />
      <LockedZonesStrip locked={locked} />
    </div>
  );
}
