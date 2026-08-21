import { LEGAL_PDF_DOC_CONTENT, type LegalPdfDocContent } from "@/lib/content/legal-pdf.generated";
import { PERSONAL_DATA_CONSENT } from "@/lib/content/personal-data-consent";
import { PRIVACY_POLICY } from "@/lib/content/privacy-policy";
import { LEGAL_SERVICE_SCOPE_SENTENCE } from "@/lib/content/legal-scope";

export type LegalPdfDoc = LegalPdfDocContent;

/** ODT-импорт без privacy-policy: публичная редакция ведётся в privacy-policy.ts */
const GENERATED_WITHOUT_PRIVACY = LEGAL_PDF_DOC_CONTENT.filter(
  (doc) => doc.slug !== PRIVACY_POLICY.slug,
);

export const LEGAL_PDF_DOCS: LegalPdfDoc[] = [
  {
    slug: PRIVACY_POLICY.slug,
    title: PRIVACY_POLICY.title,
    metaTitle: PRIVACY_POLICY.metaTitle,
    version: PRIVACY_POLICY.version,
    bodyHtml: PRIVACY_POLICY.bodyHtml,
  },
  ...GENERATED_WITHOUT_PRIVACY,
  {
    slug: PERSONAL_DATA_CONSENT.slug,
    title: PERSONAL_DATA_CONSENT.title,
    metaTitle: PERSONAL_DATA_CONSENT.metaTitle,
    bodyHtml: PERSONAL_DATA_CONSENT.bodyHtml,
  },
];

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
