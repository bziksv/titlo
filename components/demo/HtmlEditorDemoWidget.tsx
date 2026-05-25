"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { DemoModuleLinks } from "@/components/demo/DemoModuleLinks";
import { DemoUpgradePanel } from "@/components/demo/DemoUpgradePanel";
import { DemoWidgetShell } from "@/components/demo/DemoWidgetShell";
import {
  HTML_EDITOR_BUILTIN_PRESETS,
  HTML_EDITOR_DEMO_START_HTML,
} from "@/lib/demo/html-editor-builtin-presets";
import {
  buildHtmlEditorRegisterUrl,
  formatHtmlForDisplay,
  HTML_EDITOR_CABINET_FEATURES,
  HTML_EDITOR_DEMO_LAYOUT_KEY,
  HTML_EDITOR_FULL_MAX_PROJECTS,
  HTML_EDITOR_FULL_MAX_TEXTS,
  loadCKEditorScript,
  plainTextLength,
} from "@/lib/demo/html-editor-demo";

type LayoutMode = "side" | "stacked";

type CkEditorInstance = {
  getData: () => string;
  setData: (html: string) => void;
  on: (event: string, callback: () => void) => void;
  resize: (width: string, height: number) => void;
  destroy: (noUpdate?: boolean) => void;
};

declare global {
  interface Window {
    CKEDITOR?: {
      replace: (element: string | HTMLElement, config?: Record<string, unknown>) => CkEditorInstance;
      instances: Record<string, CkEditorInstance | undefined>;
    };
  }
}

const DEMO_FEATURES = [
  "CKEditor — как в кабинете",
  "Визуально слева, HTML справа",
  "Правка с любой стороны",
  "Готовые HTML-пресеты",
  "Копирование HTML без лимита",
] as const;

function debounce<T extends (...args: never[]) => void>(fn: T, ms: number): T {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return ((...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  }) as T;
}

export function HtmlEditorDemoWidget() {
  const rawId = useId();
  const editorDomId = `he-demo-${rawId.replace(/[^a-z0-9]/gi, "")}`;
  const htmlOutId = `he-html-${rawId.replace(/[^a-z0-9]/gi, "")}`;

  const editorRef = useRef<CkEditorInstance | null>(null);
  const syncingFromSource = useRef(false);
  const sourceRef = useRef<HTMLTextAreaElement>(null);

  const [layout, setLayout] = useState<LayoutMode>("side");
  const [htmlSource, setHtmlSource] = useState("");
  const [meta, setMeta] = useState({ htmlChars: 0, textChars: 0 });
  const [editorReady, setEditorReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const updateMeta = useCallback((html: string) => {
    setMeta({
      htmlChars: html.length,
      textChars: plainTextLength(html),
    });
  }, []);

  const syncToSource = useCallback(() => {
    if (syncingFromSource.current || !editorRef.current) return;
    const html = editorRef.current.getData();
    setHtmlSource(html);
    updateMeta(html);
  }, [updateMeta]);

  const setEditorHtml = useCallback(
    (html: string) => {
      if (!editorRef.current) return;
      editorRef.current.setData(html);
      setHtmlSource(html);
      updateMeta(html);
    },
    [updateMeta],
  );

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(HTML_EDITOR_DEMO_LAYOUT_KEY);
      if (saved === "stacked") setLayout("stacked");
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    loadCKEditorScript()
      .then(() => {
        if (cancelled || !window.CKEDITOR) return;

        const textarea = document.getElementById(editorDomId);
        if (!textarea) return;

        const editor = window.CKEDITOR.replace(editorDomId, {
          language: "ru",
          height: layout === "stacked" ? 440 : 360,
        });
        editorRef.current = editor;

        editor.on("instanceReady", () => {
          if (cancelled) return;
          editor.setData(HTML_EDITOR_DEMO_START_HTML);
          syncToSource();
          setEditorReady(true);
        });
        editor.on("change", syncToSource);
        editor.on("mode", syncToSource);
        editor.on("blur", syncToSource);
      })
      .catch(() => {
        if (!cancelled) setLoadError("Не удалось загрузить редактор. Обновите страницу.");
      });

    return () => {
      cancelled = true;
      const inst = window.CKEDITOR?.instances[editorDomId];
      if (inst?.destroy) {
        inst.destroy();
      }
      editorRef.current = null;
      setEditorReady(false);
    };
  }, [editorDomId, syncToSource]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || !editorReady) return;
    editor.resize("100%", layout === "stacked" ? 440 : 360);
    try {
      window.localStorage.setItem(HTML_EDITOR_DEMO_LAYOUT_KEY, layout);
    } catch {
      // ignore
    }
  }, [layout, editorReady]);

  const syncToEditor = useCallback(
    debounce((value: string) => {
      if (!editorRef.current) return;
      syncingFromSource.current = true;
      editorRef.current.setData(value);
      syncingFromSource.current = false;
      updateMeta(value);
    }, 400),
    [updateMeta],
  );

  const onSourceChange = (value: string) => {
    setHtmlSource(value);
    syncToEditor(value);
  };

  const applyPreset = (html: string, append: boolean) => {
    if (append && htmlSource.trim()) {
      setEditorHtml(htmlSource + html);
    } else {
      setEditorHtml(html);
    }
  };

  const copyHtml = async () => {
    const html = htmlSource.trim();
    if (!html) return;
    try {
      await navigator.clipboard.writeText(formatHtmlForDisplay(html));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      sourceRef.current?.select();
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const stacked = layout === "stacked";

  return (
    <DemoWidgetShell
      title="Попробуйте HTML-редактор"
      lead="Тот же CKEditor и split-view, что в кабинете: визуально и HTML в реальном времени. Ограничение одно — без регистрации текст не сохраняется."
      features={DEMO_FEATURES}
    >
      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 md:p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">HTML-пресеты</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {HTML_EDITOR_BUILTIN_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              title="Shift+клик — добавить в конец"
              disabled={!editorReady}
              onClick={(e) => applyPreset(preset.html, e.shiftKey)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-brand-300 hover:bg-brand-50 disabled:opacity-50"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium text-slate-700">Раскладка</span>
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5" role="group" aria-label="Раскладка редактора">
          <button
            type="button"
            aria-pressed={!stacked}
            onClick={() => setLayout("side")}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold ${!stacked ? "bg-brand-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}
          >
            Рядом
          </button>
          <button
            type="button"
            aria-pressed={stacked}
            onClick={() => setLayout("stacked")}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold ${stacked ? "bg-brand-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}
          >
            Код снизу
          </button>
        </div>
      </div>

      <div className={`mt-3 grid gap-3 ${stacked ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"}`}>
        <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
            Визуальный редактор
          </div>
          <div className="min-h-[200px] p-0">
            <textarea
              id={editorDomId}
              defaultValue={HTML_EDITOR_DEMO_START_HTML}
              className="sr-only"
              aria-hidden
              tabIndex={-1}
            />
            {!editorReady && !loadError && (
              <p className="p-4 text-sm text-slate-500">Загрузка CKEditor…</p>
            )}
            {loadError && (
              <p className="p-4 text-sm text-amber-800" role="alert">
                {loadError}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2">
            <span className="text-sm font-semibold text-slate-700">HTML-код</span>
            <button
              type="button"
              onClick={() => void copyHtml()}
              disabled={!htmlSource.trim()}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
            >
              {copied ? "Скопировано" : "Копировать HTML"}
            </button>
          </div>
          <div className="flex flex-1 flex-col p-2">
            <textarea
              ref={sourceRef}
              id={htmlOutId}
              value={htmlSource}
              onChange={(e) => onSourceChange(e.target.value)}
              spellCheck={false}
              rows={stacked ? 14 : 16}
              className="min-h-[200px] w-full flex-1 resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs leading-relaxed text-slate-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              aria-label="HTML-код"
            />
            <p className="mt-2 text-xs text-slate-500" aria-live="polite">
              {meta.htmlChars.toLocaleString("ru-RU")} символов HTML ·{" "}
              {meta.textChars.toLocaleString("ru-RU")} символов текста
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled
          title="Сохранение доступно после регистрации в кабинете"
          className="cursor-not-allowed rounded-xl bg-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600"
        >
          Сохранить текст
        </button>
        <span className="text-sm text-slate-500">В демо можно редактировать и копировать HTML без лимита.</span>
      </div>

      <div className="mt-6">
        <DemoUpgradePanel
          registerUrl={buildHtmlEditorRegisterUrl()}
          remaining={0}
          maxRuns={0}
          fullMaxChars={0}
          moduleTitle="HTML-редактора"
          showRemaining={false}
          upgradeHint={`Зарегистрируйтесь — сохраняйте до ${HTML_EDITOR_FULL_MAX_PROJECTS} проектов и ${HTML_EDITOR_FULL_MAX_TEXTS} текстов в каждом, делитесь публичной ссылкой и храните свои пресеты.`}
          details={HTML_EDITOR_CABINET_FEATURES}
        />
      </div>

      <div className="mt-4">
        <DemoModuleLinks
          links={[
            { href: "/podschet-dliny-teksta/", label: "Подсчёт длины текста" },
            { href: "/html-redaktor/", label: "О модуле" },
          ]}
        />
      </div>
    </DemoWidgetShell>
  );
}
