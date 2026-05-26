import { LK_URL } from "@/lib/site";

export const SITE_MONITORING_DEMO_MODULE = "monitoring-saytov" as const;

export const SITE_MONITORING_DEMO_MAX_RUNS = 5;

export function buildSiteMonitoringRegisterUrl(): string {
  const u = new URL(`${LK_URL}/register`);
  u.searchParams.set("module", SITE_MONITORING_DEMO_MODULE);
  u.searchParams.set("from", "demo");
  return u.toString();
}

export const SITE_MONITORING_CABINET_FEATURES = [
  "Несколько проектов с разными интервалами",
  "Автоматические проверки 24/7",
  "Telegram на Free; email при сбоях — на платных",
  "Контроль ключевой фразы в HTML",
  "Uptime и история в кабинете",
] as const;

export const SITE_MONITORING_SAMPLE_URL = "https://datagon.ru/";
