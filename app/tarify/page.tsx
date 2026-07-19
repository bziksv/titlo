import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { TariffCard } from "@/components/TariffCard";
import { TariffComparison } from "@/components/TariffComparison";
import { getSitePage } from "@/lib/content/site-pages.generated";
import { TARIFF_DISCOUNT_NOTE, TARIFF_PLANS } from "@/lib/content/tariffs";

export const metadata: Metadata = {
  title: "Тарифы",
  description: "Тарифные планы Титло: Бесплатный, Оптимальный, Ультимат, Максимум — сравнение лимитов.",
};

export default function TarifyPage() {
  const page = getSitePage("tarify");

  return (
    <PageShell
      title={page?.h1 ?? "Тарифы"}
      lead="Выберите тариф под ваши задачи. Стоимость платных планов — за календарный день; итог зависит от периода оплаты. На Free — по 3 проверки на релевантность, текст и конкурентов; индексация и Есенин — по 5; кластеризатор — 50. Утилиты без лимитов. Мониторинг сайтов, доменов и ссылок на Free: кабинет и Telegram; email — на платных."
    >
      <div className="mb-10 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-950">
        <strong className="font-semibold">Период оплаты:</strong> {TARIFF_DISCOUNT_NOTE}
      </div>

      <p className="mb-6 text-center text-sm font-medium text-slate-500">
        Сравните планы — от бесплатного старта до максимальных лимитов
      </p>

      <div className="grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-4 xl:items-start">
        {TARIFF_PLANS.map((plan) => (
          <TariffCard key={plan.name} plan={plan} highlighted={plan.highlighted} />
        ))}
      </div>

      <section className="mt-16">
        <h2 className="text-xl font-bold text-slate-900 md:text-2xl">Сравнение лимитов по модулям</h2>
        <p className="mt-2 text-slate-600">
          Наглядная таблица — чем отличаются тарифы по ключевым инструментам. На Free — по{" "}
          <strong className="font-medium text-slate-800">3 проверки</strong> в месяц на анализ релевантности, текста и
          конкурентов; проверка индексации — <strong className="font-medium text-slate-800">5</strong>.
        </p>
        <div className="mt-6">
          <TariffComparison />
        </div>
      </section>

      {page?.sections[0] && (
        <p className="mt-10 text-center text-sm text-slate-600">{page.sections[0].paragraphs[0]}</p>
      )}

      <p className="mt-8 text-center text-sm text-slate-500">
        Полный перечень лимитов по каждому модулю — в личном кабинете после регистрации.
      </p>
    </PageShell>
  );
}
