import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { TariffComparison } from "@/components/TariffComparison";
import { getSitePage } from "@/lib/content/site-pages.generated";

export const metadata: Metadata = {
  title: "Тарифы",
  description: "Тарифные планы Титло: Бесплатный, Оптимальный, Ультимат, Максимум — сравнение лимитов.",
};

export default function TarifyPage() {
  const page = getSitePage("tarify");

  return (
    <PageShell title={page?.h1 ?? "Тарифы"} compact>
      <TariffComparison />

      {page?.sections[0] && (
        <p className="mt-6 text-center text-sm text-slate-600">{page.sections[0].paragraphs[0]}</p>
      )}

      <p className="mt-4 text-center text-sm text-slate-500">
        Полный перечень лимитов по каждому модулю — в личном кабинете после регистрации.
      </p>
    </PageShell>
  );
}
