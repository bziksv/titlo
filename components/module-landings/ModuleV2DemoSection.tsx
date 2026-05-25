import { ClusterDemoWidget } from "@/components/demo/ClusterDemoWidget";
import { CompetitorAnalysisDemoWidget } from "@/components/demo/CompetitorAnalysisDemoWidget";
import { DuplicatesDemoWidget } from "@/components/demo/DuplicatesDemoWidget";
import { HtmlEditorDemoWidget } from "@/components/demo/HtmlEditorDemoWidget";
import { ListComparisonDemoWidget } from "@/components/demo/ListComparisonDemoWidget";
import { UniqueWordsDemoWidget } from "@/components/demo/UniqueWordsDemoWidget";
import { TextAnalyzerDemoWidget } from "@/components/demo/TextAnalyzerDemoWidget";
import { TextLengthDemoWidget } from "@/components/demo/TextLengthDemoWidget";
import type { ModuleV2DemoWidget } from "@/lib/content/module-v2/types";

const SECTION_COPY: Record<
  ModuleV2DemoWidget,
  { title: string; lead: string }
> = {
  "text-analyzer": {
    title: "Проверьте анализ текста без регистрации",
    lead: "Вставьте фрагмент — получите отчёт как в кабинете: KPI, слова, Ципф, облако и фразы. Часть данных — с ограничениями.",
  },
  "competitor-analysis": {
    title: "Попробуйте анализ конкурентов без регистрации",
    lead: "Яндекс или Google, сравнение двух городов и геозависимость — как в кабинете. В демо ТОП-10; полный съём — до 30 URL.",
  },
  "text-length": {
    title: "Посчитайте длину текста прямо здесь",
    lead: "Базовая статистика символов и слов — сразу. SEO-поля и расширенный отчёт — после регистрации.",
  },
  duplicates: {
    title: "Уберите дубликаты из списка без регистрации",
    lead: "7 базовых фильтров и KPI — как в кабинете. Сортировка, пресеты, сравнение до/после и большие списки — после регистрации.",
  },
  "list-comparison": {
    title: "Сравните два списка фраз без регистрации",
    lead: "Все 4 режима и опции — как в кабинете. В демо лимит только по символам в каждом списке.",
  },
  "unique-words": {
    title: "Выделите уникальные слова без регистрации",
    lead: "Морфология, словоформы и ключевые фразы — как в кабинете. В демо лимит только по символам.",
  },
  "html-editor": {
    title: "Попробуйте HTML-редактор без регистрации",
    lead: "CKEditor и split-view как в кабинете — без лимита по символам. Сохранение, проекты и публичная ссылка — после регистрации.",
  },
  cluster: {
    title: "Попробуйте кластеризатор без регистрации",
    lead: "До 10 фраз без сохранения. В кабинете — проекты, Wordstat, большие ядра, конкуренты и экспорт XLS.",
  },
};

type Props = { kind: ModuleV2DemoWidget };

export function ModuleV2DemoSection({ kind }: Props) {
  const copy = SECTION_COPY[kind];

  return (
    <section className="relative overflow-x-clip border-b border-brand-800/40">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#0f1a33] via-brand-800 to-brand-700"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-14 md:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-100">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.8)]" aria-hidden />
            Попробовать бесплатно
          </p>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white md:text-4xl">{copy.title}</h2>
          <p className="mt-4 text-base leading-relaxed text-brand-100/95 md:text-lg">{copy.lead}</p>
        </div>

        <div className="relative mt-10 rounded-2xl border border-white/20 bg-white shadow-2xl shadow-brand-800/40 ring-1 ring-black/5 md:mt-12">
          <div className="h-1.5 rounded-t-2xl bg-gradient-to-r from-brand-500 via-emerald-400 to-brand-600" aria-hidden />
          {kind === "text-analyzer" ? (
            <TextAnalyzerDemoWidget />
          ) : kind === "competitor-analysis" ? (
            <CompetitorAnalysisDemoWidget />
          ) : kind === "duplicates" ? (
            <DuplicatesDemoWidget />
          ) : kind === "list-comparison" ? (
            <ListComparisonDemoWidget />
          ) : kind === "unique-words" ? (
            <UniqueWordsDemoWidget />
          ) : kind === "html-editor" ? (
            <HtmlEditorDemoWidget />
          ) : kind === "cluster" ? (
            <ClusterDemoWidget />
          ) : (
            <TextLengthDemoWidget />
          )}
        </div>
      </div>
    </section>
  );
}
