import { LEGAL_PDF_DOC_CONTENT, type LegalPdfDocContent } from "@/lib/content/legal-pdf.generated";
import { LEGAL_SERVICE_SCOPE_SENTENCE } from "@/lib/content/legal-scope";

export type LegalPdfDoc = LegalPdfDocContent;

export const LEGAL_PDF_DOCS: LegalPdfDoc[] = LEGAL_PDF_DOC_CONTENT;

export const LEGAL_PDF_SCOPE_NOTE = LEGAL_SERVICE_SCOPE_SENTENCE;

export function getAllLegalPdfSlugs(): string[] {
  return LEGAL_PDF_DOCS.map((doc) => doc.slug);
}

export function getLegalPdfBySlug(slug: string): LegalPdfDoc | undefined {
  return LEGAL_PDF_DOCS.find((doc) => doc.slug === slug);
}

export const LEGAL_PDF_NAV = LEGAL_PDF_DOCS.map((doc) => ({
  href: `/legal/doc/${doc.slug}/`,
  label: doc.title,
}));
