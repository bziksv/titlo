import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
          <a
            href={doc.pdfPath}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700"
          >
            Открыть PDF
          </a>
          <a
            href={doc.pdfPath}
            download
            className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
          >
            Скачать PDF
          </a>
          <Link href="/legal/offer/" className="text-brand-600 hover:text-brand-700">
            Договор-оферта
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <iframe
            src={doc.pdfPath}
            title={doc.title}
            className="h-[min(80vh,56rem)] w-full"
          />
        </div>
      </div>
    </PageShell>
  );
}
