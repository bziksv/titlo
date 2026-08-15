import type { Metadata } from "next";
import { ServicesCatalog } from "@/components/ServicesCatalog";

export const metadata: Metadata = {
  title: "Модули сервиса",
  description: "SEO-инструменты платформы Титло: описание модулей, демо и доступ в личном кабинете.",
};

export default function ServicesPage() {
  return <ServicesCatalog />;
}
