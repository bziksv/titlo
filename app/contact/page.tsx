import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { OfficeYandexMap } from "@/components/OfficeYandexMap";
import { PageShell } from "@/components/PageShell";
import { BANK, CONTACT_LEAD, OFFICES, REQUISITES, SUPPORT } from "@/lib/content/contact";
import { canonicalMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...canonicalMetadata("/contact/"),
  title: "Контакты",
  description: "Контакты Титло: офис в Воронеже, поддержка, реквизиты.",
};

export default function ContactPage() {
  return (
    <PageShell title="Контакты" lead={CONTACT_LEAD}>
      <div className="grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="text-lg font-semibold text-slate-900">Поддержка сервиса</h2>
          <ul className="mt-4 space-y-2 text-slate-700">
            <li>Режим работы: {SUPPORT.hours}</li>
            <li>
              Телефон:{" "}
              <a href={`tel:${SUPPORT.phone.replace(/-/g, "")}`} className="text-brand-600">
                {SUPPORT.phone}
              </a>
            </li>
            <li>
              E-mail:{" "}
              <a href={`mailto:${SUPPORT.email}`} className="text-brand-600">
                {SUPPORT.email}
              </a>
            </li>
          </ul>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900">Центральный офис в Воронеже</h2>
            {OFFICES.map((office) => (
              <div key={office.name} className="mt-4">
                <h3 className="font-semibold text-slate-900">{office.name}</h3>
                <p className="mt-2 text-slate-600">{office.address}</p>
                <p className="text-slate-600">{office.hours}</p>
                <p className="text-slate-600">
                  <a href={`tel:${office.phone.replace(/-/g, "")}`} className="text-brand-600">
                    {office.phone}
                  </a>
                </p>
              </div>
            ))}
            <OfficeYandexMap />
          </div>
        </section>

        <section className="space-y-8">
          <ContactForm />

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Реквизиты</h2>
            <dl className="mt-4 space-y-2 text-sm text-slate-600">
              <div>
                <dt className="font-medium text-slate-800">Организация</dt>
                <dd>{REQUISITES.org}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-800">ИНН</dt>
                <dd>{REQUISITES.inn}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-800">ОГРНИП</dt>
                <dd>{REQUISITES.ogrnip}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-800">Адрес</dt>
                <dd>{REQUISITES.address}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Банковские реквизиты</h2>
            <dl className="mt-4 space-y-2 text-sm text-slate-600">
              <div>
                <dt className="font-medium text-slate-800">Расчётный счёт</dt>
                <dd>{BANK.account}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-800">Банк</dt>
                <dd>{BANK.bank}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-800">Корр. счёт</dt>
                <dd>{BANK.corr}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-800">БИК</dt>
                <dd>{BANK.bik}</dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
