import type { Metadata } from "next";
import { FaqAccordion } from "@/components/FaqAccordion";
import { PageShell } from "@/components/PageShell";
import { FAQ_ITEMS } from "@/lib/content/faq";
import { canonicalMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...canonicalMetadata("/faq/"),
  title: "Вопрос-ответ",
  description: "Частые вопросы о сервисе Титло и личном кабинете.",
};

export default function FaqPage() {
  return (
    <PageShell title="Вопрос-ответ" lead="Ответы на частые вопросы о платформе Титло.">
      <FaqAccordion items={FAQ_ITEMS} />
    </PageShell>
  );
}
