import type { Metadata } from "next";
import Link from "next/link";
import { ModuleIcon } from "@/lib/module-icons";
import { PageShell } from "@/components/PageShell";
import { SERVICE_ITEMS, SERVICES_INTRO } from "@/lib/content/services";
import { LK_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Модули сервиса",
  description: "SEO-инструменты платформы Титло: описание модулей, демо и доступ в личном кабинете.",
};

export default function ServicesPage() {
  return (
    <PageShell
      title="Модули сервиса"
      lead={SERVICES_INTRO}
    >
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICE_ITEMS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg"
            >
              <div className="flex items-start gap-3">
                <ModuleIcon href={item.href} className="h-11 w-11 text-xl" />
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-slate-900 group-hover:text-brand-700">{item.title}</h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">
                    {item.description || "Подробное описание на странице модуля."}
                  </p>
                </div>
              </div>
              <span className="mt-4 text-sm font-semibold text-brand-600">Подробнее →</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-12 text-center text-sm text-slate-500">
        Работа с модулями — в{" "}
        <a href={`${LK_URL}/register`} className="font-medium text-brand-600 hover:underline">
          личном кабинете
        </a>
        .
      </p>
    </PageShell>
  );
}
