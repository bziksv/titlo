import { LK_URL } from "@/lib/site";

export const HTML_EDITOR_DEMO_MODULE = "html-redaktor" as const;

export const HTML_EDITOR_FULL_MAX_PROJECTS = 20;
export const HTML_EDITOR_FULL_MAX_TEXTS = 30;

export const CKEDITOR_CDN_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/ckeditor/4.20.1/ckeditor.js";

export const HTML_EDITOR_DEMO_LAYOUT_KEY = "datagon-he-demo-layout";

export function buildHtmlEditorRegisterUrl(): string {
  const u = new URL(`${LK_URL}/register`);
  u.searchParams.set("module", HTML_EDITOR_DEMO_MODULE);
  u.searchParams.set("from", "demo");
  return u.toString();
}

export function plainTextLength(html: string): number {
  if (typeof document === "undefined") {
    return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().length;
  }
  const div = document.createElement("div");
  div.innerHTML = html || "";
  return (div.textContent || "").replace(/\s+/g, " ").trim().length;
}

export function formatHtmlForDisplay(html: string): string {
  return html
    .replace(/></g, ">\n<")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

let ckeditorLoadPromise: Promise<void> | null = null;

export function loadCKEditorScript(): Promise<void> {
  if (typeof window !== "undefined" && window.CKEDITOR) {
    return Promise.resolve();
  }
  if (ckeditorLoadPromise) {
    return ckeditorLoadPromise;
  }
  ckeditorLoadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${CKEDITOR_CDN_URL}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("CKEditor load failed")), { once: true });
      if (window.CKEDITOR) resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = CKEDITOR_CDN_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("CKEditor load failed"));
    document.head.appendChild(script);
  });
  return ckeditorLoadPromise;
}

export const HTML_EDITOR_CABINET_FEATURES = [
  "Проекты и сохранение HTML-текстов",
  "Свои HTML-пресеты (до 20)",
  "Публичная ссылка на текст — 30 дней, без регистрации у получателя",
  "Поиск по проектам и содержимому текстов",
] as const;
