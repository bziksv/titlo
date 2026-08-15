import { LK_URL } from "@/lib/site";

export const UTM_MARKS_DEMO_MODULE = "utm-metki" as const;

export function buildUtmMarksRegisterUrl(): string {
  const u = new URL(`${LK_URL}/register`);
  u.searchParams.set("module", UTM_MARKS_DEMO_MODULE);
  u.searchParams.set("from", "demo");
  return u.toString();
}

export const UTM_MARKS_CABINET_FEATURES = [
  "Тот же генератор UTM — всегда под рукой в кабинете",
  "Калькулятор ROI рядом с разметкой кампаний",
  "Мета-теги и HTTP-заголовки по расписанию",
  "Позиции, ссылки и доступность сайтов",
  "Один вход вместо россыпи сервисов",
] as const;
