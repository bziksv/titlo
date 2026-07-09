import Link from "next/link";
import { LEGAL_NAV } from "@/lib/content/legal";
import { getCopyrightText, SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-white">
          Контакты технической поддержки
        </p>
        <p className="mt-2 text-sm">Режим работы: {SITE.supportHours}</p>
        <p className="text-sm">
          Телефон:{" "}
          <a href={`tel:${SITE.phone.replace(/-/g, "")}`} className="hover:text-white">
            {SITE.phone}
          </a>
        </p>
        <p className="text-sm">
          E-mail:{" "}
          <a href={`mailto:${SITE.email}`} className="hover:text-white">
            {SITE.email}
          </a>
        </p>
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <Link href="/contact/" className="hover:text-white">
            Контакты
          </Link>
          <Link href="/tarify/" className="hover:text-white">
            Тарифы
          </Link>
          <Link href="/about/" className="hover:text-white">
            О компании
          </Link>
          {LEGAL_NAV.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-white">
              {link.label}
            </Link>
          ))}
        </div>
        <p className="mt-8 text-xs text-slate-400">{getCopyrightText()}</p>
      </div>
    </footer>
  );
}
