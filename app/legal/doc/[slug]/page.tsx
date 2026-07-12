import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LegalHtml } from "@/components/LegalHtml";
import { PageShell } from "@/components/PageShell";
import {
  getAllLegalPdfSlugs,
  getLegalPdfBySlug,
  LEGAL_PDF_SCOPE_NOTE,
} from "@/lib/content/legal-pdfs";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllLegalPdfSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = getLegalPdfBySlug(slug);
  if (!doc) return {};
  return {
    title: doc.metaTitle,
    robots: { index: true, follow: true },
  };
}

export default async function LegalPdfPage({ params }: Props) {
  const { slug } = await params;
  const doc = getLegalPdfBySlug(slug);
  if (!doc) notFound();

  return (
    <PageShell title={doc.title}>
      <div className="space-y-6">
        <div className="rounded-xl border border-brand-100 bg-brand-50/60 p-4 text-sm leading-relaxed text-slate-700">
          <p className="font-medium text-slate-900">Область действия</p>
          <p className="mt-2">{LEGAL_PDF_SCOPE_NOTE}</p>
          {doc.version ? (
            <p className="mt-2 text-slate-600">Версия документа: {doc.version}</p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Link href="/legal/offer/" className="text-brand-600 hover:text-brand-700">
            Договор-оферта
          </Link>
          <Link href="/legal/privacy/" className="text-brand-600 hover:text-brand-700">
            Политика конфиденциальности
          </Link>
          <Link href="/legal/personal-data/" className="text-brand-600 hover:text-brand-700">
            Согласие на обработку ПДн
          </Link>
        </div>

        <LegalHtml html={doc.bodyHtml} />
      </div>
    </PageShell>
  );
}
