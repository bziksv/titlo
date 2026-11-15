import type { Metadata } from "next";
import { ServicesCatalog } from "@/components/ServicesCatalog";
import { canonicalMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...canonicalMetadata("/services/"),
  title: "Модули сервиса",
  description: "SEO-инструменты платформы Титло: описание модулей, демо и доступ в личном кабинете.",
};

export default function ServicesPage() {
  return <ServicesCatalog />;
}
