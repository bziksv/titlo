import { LK_URL } from "@/lib/site";
import type { TariffPlan } from "@/lib/content/tariffs";

type Props = {
  plan: TariffPlan;
  highlighted?: boolean;
};

function groupFeatures(features: string[]) {
  const modules: string[] = [];
  const utils: string[] = [];
  const other: string[] = [];

  for (const f of features) {
    const low = f.toLowerCase();
    if (low.includes("без ограничений") || low.includes("генератор") || low.includes("utm") || low.includes("roi") || low.includes("html") || low.includes("дубликат") || low.includes("длин")) {
      utils.push(f);
    } else if (low.includes("анализ") || low.includes("мониторинг") || low.includes("отслеж") || low.includes("позиц")) {
      modules.push(f);
    } else {
      other.push(f);
    }
  }
  return { modules, utils, other };
}

function FeatureList({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ul className="space-y-2 text-sm text-slate-600">
      {items.map((f) => (
        <li key={f} className="flex gap-2 leading-snug">
          <span className="mt-0.5 shrink-0 font-bold text-emerald-600" aria-hidden>
            ✓
          </span>
          <span>{f}</span>
        </li>
      ))}
    </ul>
  );
}

export function TariffCard({ plan, highlighted }: Props) {
  const isPopular = highlighted || plan.badge;
  const { modules, utils, other } = groupFeatures(plan.features);

  return (
    <article
      className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-lg ${
        isPopular
          ? "z-10 border-brand-500 shadow-md ring-2 ring-brand-200 md:-mt-2 md:pb-8 md:pt-8"
          : "border-slate-200 hover:border-brand-200"
      }`}
    >
      {plan.badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-600 px-4 py-1 text-xs font-bold uppercase tracking-wide text-white shadow">
          {plan.badge}
        </span>
      )}

      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{plan.tagline}</p>
      <h3 className="mt-2 text-2xl font-bold text-slate-900">{plan.name}</h3>
      <div className="mt-3 border-b border-slate-100 pb-4">
        {plan.pricePerDay === 0 ? (
          <>
            <p className="text-3xl font-bold text-brand-600">
              0 <span className="text-lg font-normal text-slate-500">₽</span>
            </p>
            {plan.priceNote && <p className="mt-1 text-sm text-slate-500">{plan.priceNote}</p>}
          </>
        ) : (
          <p className="text-3xl font-bold text-brand-600">
            {plan.pricePerDay.toLocaleString("ru-RU")}{" "}
            <span className="text-lg font-normal text-slate-500">₽ / день</span>
          </p>
        )}
      </div>

      <div className="mt-5 flex-1 space-y-5">
        {modules.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-bold uppercase text-brand-600">Платные модули</p>
            <FeatureList items={modules} />
          </div>
        )}
        {utils.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-bold uppercase text-emerald-700">Утилиты</p>
            <FeatureList items={utils} />
          </div>
        )}
        {other.length > 0 && <FeatureList items={other} />}
      </div>

      <a
        href={`${LK_URL}/register`}
        className={`mt-6 block rounded-xl py-3 text-center text-sm font-semibold transition ${
          isPopular
            ? "bg-brand-600 text-white shadow hover:bg-brand-700"
            : "border-2 border-brand-200 bg-brand-50 text-brand-700 hover:border-brand-400 hover:bg-brand-100"
        }`}
      >
        {plan.id === "Free" ? "Начать бесплатно" : "Выбрать тариф"}
      </a>
    </article>
  );
}
