import { LK_URL } from "@/lib/site";

export const PASSWORD_GEN_DEMO_MODULE = "generator-paroley" as const;

export function buildPasswordGenRegisterUrl(): string {
  const u = new URL(`${LK_URL}/register`);
  u.searchParams.set("module", PASSWORD_GEN_DEMO_MODULE);
  u.searchParams.set("from", "demo");
  return u.toString();
}

export function buildPasswordGenIdeasUrl(): string {
  return `${LK_URL}/ideas`;
}

export const PASSWORD_GEN_CABINET_FEATURES = [
  "Сохранение паролей с комментарием — без логина, email и названия сервиса в тексте",
  "Копирование и удаление записей из истории",
  "Остальные модули платформы в одном кабинете",
] as const;

export const PASSWORD_GEN_UPGRADE_HINT =
  "После регистрации — история с комментариями и доступ к остальным модулям кабинета.";
