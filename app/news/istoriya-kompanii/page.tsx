import type { Metadata } from "next";
import Link from "next/link";
import { CompanyTimeline } from "@/components/CompanyTimeline";
import { PageShell } from "@/components/PageShell";
import { COMPANY_TIMELINE } from "@/lib/content/about";

export const metadata: Metadata = {
  title: "История компании",
  description: "История развития Титло с 2015 года.",
};

export default function CompanyHistoryPage() {
  return (
    <PageShell title="История компании" lead="Ключевые этапы развития Титло и команды.">
      <CompanyTimeline items={COMPANY_TIMELINE} linkLabel="Новость →" />
      <Link href="/about/" className="mt-10 inline-block font-medium text-brand-600">
        ← О компании
      </Link>
    </PageShell>
  );
}
