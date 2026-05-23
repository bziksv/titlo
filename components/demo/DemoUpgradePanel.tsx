import { LK_URL } from "@/lib/site";

type Props = {
  registerUrl: string;
  remaining: number;
  maxRuns: number;
  fullMaxChars: number;
  moduleTitle?: string;
  upgradeHint?: string;
};

export function DemoUpgradePanel({
  registerUrl,
  remaining,
  maxRuns,
  fullMaxChars,
  moduleTitle = "модуль",
  upgradeHint,
}: Props) {
  const hint =
    upgradeHint ??
    `В кабинете — до ${fullMaxChars.toLocaleString("ru-RU")} символов за проверку, SEO-поля title/description и расширенная статистика для ${moduleTitle}.`;
  return (
    <div className="rounded-xl border border-brand-200 bg-brand-50/80 p-4 md:p-5">
      <p className="text-sm font-semibold text-brand-900">
        {remaining > 0
          ? `Демо: осталось ${remaining} из ${maxRuns} проверок сегодня`
          : "Демо на сегодня закончилось"}
      </p>
      <p className="mt-1 text-sm text-slate-600">{hint}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <a
          href={registerUrl}
          className="inline-flex rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          Получить полный доступ
        </a>
        <a
          href={`${LK_URL}/login`}
          className="inline-flex rounded-xl border border-brand-300 bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
        >
          Войти
        </a>
      </div>
    </div>
  );
}
