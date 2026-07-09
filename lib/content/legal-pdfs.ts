import { LEGAL_SERVICE_SCOPE_SENTENCE } from "@/lib/content/legal-scope";

export type LegalPdfDoc = {
  slug: string;
  title: string;
  metaTitle: string;
  pdfPath: string;
  version?: string;
};

export const LEGAL_PDF_DOCS: LegalPdfDoc[] = [
  {
    slug: "privacy-policy",
    title: "Политика обработки персональных данных",
    metaTitle: "Политика обработки персональных данных",
    pdfPath: "/legal/privacy-policy.pdf",
    version: "21.04.2026",
  },
  {
    slug: "cookies-policy",
    title: "Политика использования cookie-файлов",
    metaTitle: "Политика использования cookie-файлов",
    pdfPath: "/legal/cookies-policy.pdf",
  },
  {
    slug: "recommendation-rules",
    title: "Правила применения рекомендательных технологий",
    metaTitle: "Правила применения рекомендательных технологий",
    pdfPath: "/legal/recommendation-rules.pdf",
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
