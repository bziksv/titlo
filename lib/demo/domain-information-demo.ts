import { LK_URL } from "@/lib/site";

export const DOMAIN_INFORMATION_DEMO_MODULE = "otslezhivanie-sroka-registratsii-domenov" as const;

export const DOMAIN_INFORMATION_DEMO_MAX_RUNS = 5;

export const DOMAIN_INFORMATION_SAMPLE_DOMAIN = "datagon.ru";

export function buildDomainInformationRegisterUrl(): string {
  const u = new URL(`${LK_URL}/register`);
  u.searchParams.set("module", DOMAIN_INFORMATION_DEMO_MODULE);
  u.searchParams.set("from", "demo");
  return u.toString();
}

export const DOMAIN_INFORMATION_CABINET_FEATURES = [
  "Список доменов: один адрес или вставка построчно",
  "Проверка WHOIS и DNS раз в сутки",
  "Оповещения в Telegram на Free; email — на платных",
  "Лог проверок, PDF-отчёт и публичная ссылка",
  "Таблица с поиском и настройками по каждому домену",
] as const;
