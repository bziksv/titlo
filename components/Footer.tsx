import Link from "next/link";
import { LEGAL_NAV } from "@/lib/content/legal";
import { getCopyrightText, NAV_MODULES, SITE } from "@/lib/site";

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
        <nav aria-label="Инструменты" className="mt-8 border-t border-white/10 pt-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-white">Инструменты</p>
          <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
            {NAV_MODULES.map(({ href, label }) => (
              <li key={href}><Link href={href} className="hover:text-white">{label}</Link></li>
            ))}
          </ul>
        </nav>
        <p className="mt-8 text-xs text-slate-400">{getCopyrightText()}</p>
      </div>
    </footer>
  );
}
