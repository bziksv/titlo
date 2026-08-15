import { LK_URL } from "@/lib/site";

export const HTTP_HEADERS_DEMO_MODULE = "http-headers" as const;

export const HTTP_HEADERS_DEMO_MAX_RUNS = 5;

export const HTTP_HEADERS_SAMPLE_URL = "https://titlo.ru/";

export function buildHttpHeadersRegisterUrl(): string {
  const u = new URL(`${LK_URL}/register`);
  u.searchParams.set("module", HTTP_HEADERS_DEMO_MODULE);
  u.searchParams.set("from", "demo");
  return u.toString();
}

export const HTTP_HEADERS_CABINET_FEATURES = [
  "Полный отчёт по URL: код, заголовки и HTML",
  "Пакет до 500 URL — сводка кодов ответа",
  "Пауза между запросами — без перегрузки сервера",
  "Публичная ссылка на результат и выгрузка таблицы",
  "Рядом мета-теги, ссылки и мониторинг сайтов",
] as const;
