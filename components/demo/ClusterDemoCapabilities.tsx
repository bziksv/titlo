import Link from "next/link";

const ITEMS = [
  {
    icon: "💾",
    title: "Мои проекты",
    text: "Каждый прогон сохраняется: вернуться к результату, править группы, комментарий к проекту и сравнить с новым ядром.",
    tone: "brand" as const,
  },
  {
    icon: "📋",
    title: "Большие ядра",
    text: "Сотни и тысячи фраз за запуск — без лимита демо в 10 ключей. Загрузка списка из файла или вставка из Wordstat.",
    tone: "sky" as const,
  },
  {
    icon: "📈",
    title: "Частотность Wordstat",
    text: "Базовая, «фразовая» и «!точная» по каждому ключу — сразу в таблице кластеров.",
    tone: "emerald" as const,
  },
  {
    icon: "🔍",
    title: "ТОП до 50 URL",
    text: "Глубже выдача и точнее связи. Hard / Pre-hard — для плотных коммерческих ниш.",
    tone: "violet" as const,
  },
  {
    icon: "🔗",
    title: "Релевантность и конкуренты",
    text: "URL группы, списки конкурентов по каждой фразе, привязка к вашему site: — для структуры сайта и ТЗ.",
    tone: "amber" as const,
    href: "/analiz-relevantnosti/",
  },
  {
    icon: "📥",
    title: "Экспорт и уведомления",
    text: "CSV и XLS, classic и professional режим, готовность анализа в Telegram — когда ядро большое.",
    tone: "slate" as const,
  },
] as const;

const TONE_CLASS: Record<string, string> = {
  brand: "border-brand-200 bg-brand-50/80",
  sky: "border-sky-200 bg-sky-50/80",
  emerald: "border-emerald-200 bg-emerald-50/80",
  amber: "border-amber-200 bg-amber-50/80",
  violet: "border-violet-200 bg-violet-50/80",
  slate: "border-slate-200 bg-slate-50/80",
};

export function ClusterDemoCapabilities() {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
        После регистрации в кабинете
      </p>
      <p className="mt-1 text-sm text-slate-600">
        Демо — разовый прогон без сохранения, Soft/Light. В кабинете — проекты, Hard/Pre-hard, частотность, конкуренты и
        выгрузка в Excel.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((item) => {
          const card = (
            <div
              className={`h-full rounded-xl border p-4 transition hover:shadow-md ${TONE_CLASS[item.tone]}`}
            >
              <span className="text-2xl" aria-hidden>
                {item.icon}
              </span>
              <h4 className="mt-2 text-sm font-semibold text-slate-900">{item.title}</h4>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">{item.text}</p>
              {"href" in item && item.href ? (
                <span className="mt-2 inline-block text-xs font-semibold text-brand-700">Связанный модуль →</span>
              ) : null}
            </div>
          );

          if ("href" in item && item.href) {
            return (
              <Link key={item.title} href={item.href} className="block no-underline">
                {card}
              </Link>
            );
          }

          return <div key={item.title}>{card}</div>;
        })}
      </div>
    </div>
  );
}
