import { LK_URL } from "@/lib/site";

type Props = {
  registerUrl: string;
  remaining: number;
  maxRuns: number;
  fullMaxChars: number;
  moduleTitle?: string;
  upgradeHint?: string;
  /** Дополнительные пункты «что в кабинете» */
  details?: readonly string[];
  /** Скрыть счётчик демо-запусков */
  showRemaining?: boolean;
};

export function DemoUpgradePanel({
  registerUrl,
  remaining,
  maxRuns,
  fullMaxChars,
  moduleTitle = "модуль",
  upgradeHint,
  details,
  showRemaining = true,
}: Props) {
  const hint =
    upgradeHint ??
    `В кабинете — до ${fullMaxChars.toLocaleString("ru-RU")} символов за проверку, SEO-поля title/description и расширенная статистика для ${moduleTitle}.`;

  let remainingLabel = "Полный доступ в кабинете";
  if (showRemaining) {
    if (remaining <= 0) {
      remainingLabel = "Демо на сегодня закончилось — полный доступ после регистрации";
    } else if (remaining >= maxRuns) {
      remainingLabel = `Демо без регистрации: до ${maxRuns} запусков в сутки`;
    } else {
      remainingLabel = `Демо: сегодня ещё ${remaining} из ${maxRuns} запусков`;
    }
  }

  return (
    <div className="rounded-xl border border-brand-200 bg-brand-50/80 p-4 md:p-5">
      <p className="text-sm font-semibold text-brand-900">{remainingLabel}</p>
      <p className="mt-1 text-sm text-slate-600">{hint}</p>
      {details && details.length > 0 ? (
        <ul className="mt-3 space-y-1.5">
          {details.map((line) => (
            <li key={line} className="flex gap-2 text-sm text-slate-700">
              <span className="font-bold text-brand-600" aria-hidden>
                ✓
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      ) : null}
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
