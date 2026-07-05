"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { NavMenuIcon } from "@/lib/module-icons";
import { LK_URL, NAV_COMPANY, NAV_MODULES, SITE } from "@/lib/site";

const COMPANY_ICONS: Record<string, string> = {
  "/about/": "🏢",
  "/news/": "📰",
};

const menuLinkClass =
  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition hover:bg-brand-50 hover:text-brand-700";

const navItemClass =
  "rounded-lg border border-transparent px-3 py-1.5 text-sm transition-all hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 hover:shadow-sm";

const navItemActiveClass =
  "rounded-lg border border-brand-300 bg-brand-50 px-3 py-1.5 text-sm text-brand-700 shadow-sm";

const dropdownAnchorClass = "absolute left-0 top-full z-[70] pt-2";

const dropdownPanelClass = "rounded-xl border border-slate-200 bg-white shadow-lg";

export function Header() {
  const [modulesOpen, setModulesOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const companyRef = useRef<HTMLDivElement>(null);
  const modulesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!companyOpen && !modulesOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (companyRef.current?.contains(target) || modulesRef.current?.contains(target)) return;
      setCompanyOpen(false);
      setModulesOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCompanyOpen(false);
        setModulesOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [companyOpen, modulesOpen]);

  return (
    <header className="sticky top-0 z-50 overflow-visible border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 overflow-visible px-4 py-2">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 rounded-lg border border-transparent p-0.5 transition hover:border-brand-200 hover:bg-brand-50/50"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/favicon.svg" alt="" width={32} height={32} className="h-8 w-8" />
          <span className="text-lg font-bold leading-none text-brand-600">{SITE.name}</span>
        </Link>

        <nav className="relative hidden items-center gap-1 overflow-visible text-sm font-medium text-slate-700 lg:flex">
          <div
            ref={companyRef}
            className={`relative ${companyOpen ? "z-[60]" : ""}`}
            onMouseEnter={() => {
              setCompanyOpen(true);
              setModulesOpen(false);
            }}
            onMouseLeave={() => setCompanyOpen(false)}
          >
            <button
              type="button"
              className={companyOpen ? navItemActiveClass : navItemClass}
              aria-expanded={companyOpen}
              aria-haspopup="true"
              onFocus={() => {
                setCompanyOpen(true);
                setModulesOpen(false);
              }}
              onBlur={(e) => {
                if (!companyRef.current?.contains(e.relatedTarget)) setCompanyOpen(false);
              }}
            >
              Компания
            </button>
            {companyOpen && (
              <div className={`${dropdownAnchorClass} min-w-[180px]`}>
                <div className={`${dropdownPanelClass} py-2`}>
                  {NAV_COMPANY.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={menuLinkClass}
                      onClick={() => setCompanyOpen(false)}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-base" aria-hidden>
                        {COMPANY_ICONS[item.href] ?? "📌"}
                      </span>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div
            ref={modulesRef}
            className={`relative ${modulesOpen ? "z-[60]" : ""}`}
            onMouseEnter={() => {
              setModulesOpen(true);
              setCompanyOpen(false);
            }}
            onMouseLeave={() => setModulesOpen(false)}
          >
            <button
              type="button"
              className={modulesOpen ? navItemActiveClass : navItemClass}
              aria-expanded={modulesOpen}
              aria-haspopup="true"
              onFocus={() => {
                setModulesOpen(true);
                setCompanyOpen(false);
              }}
              onBlur={(e) => {
                if (!modulesRef.current?.contains(e.relatedTarget)) setModulesOpen(false);
              }}
            >
              Модули сервиса
            </button>
            {modulesOpen && (
              <div className={`${dropdownAnchorClass} w-[min(100vw-2rem,380px)]`}>
                <div
                  className={`${dropdownPanelClass} max-h-[70vh] overflow-y-auto p-1.5`}
                >
                  {NAV_MODULES.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={menuLinkClass}
                      onClick={() => setModulesOpen(false)}
                    >
                      <NavMenuIcon href={item.href} />
                      <span className="min-w-0 leading-snug">
                        {item.label}
                        {item.badge && (
                          <span className="ml-2 inline-flex rounded bg-brand-600 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                            {item.badge}
                          </span>
                        )}
                      </span>
                    </Link>
                  ))}
                  <div className="mt-1 border-t border-slate-100 pt-1">
                    <Link
                      href="/services/"
                      className={`${menuLinkClass} text-brand-600`}
                      onClick={() => setModulesOpen(false)}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-base" aria-hidden>
                        ⊞
                      </span>
                      Все модули — обзор
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link href="/tarify/" className={navItemClass}>
            Тарифы
          </Link>
          <Link href="/contact/" className={navItemClass}>
            Контакты
          </Link>
        </nav>

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <a
            href={`${LK_URL}/login`}
            className={`${navItemClass} text-slate-700`}
          >
            Вход
          </a>
          <a
            href={`${LK_URL}/register`}
            className="rounded-lg bg-brand-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700 hover:shadow-md"
          >
            Регистрация
          </a>
        </div>

        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <a
            href={`${LK_URL}/login`}
            className="rounded-lg px-2 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-brand-50 hover:text-brand-700"
          >
            Вход
          </a>
          <a
            href={`${LK_URL}/register`}
            className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700"
          >
            Регистрация
          </a>
          <button
            type="button"
            className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm transition hover:border-brand-300 hover:bg-brand-50"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-slate-200 px-4 py-4 lg:hidden">
          <p className="mb-2 text-xs font-semibold uppercase text-slate-500">Компания</p>
          {NAV_COMPANY.map((item) => (
            <Link key={item.href} href={item.href} className={menuLinkClass} onClick={() => setMobileOpen(false)}>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand-50 text-sm" aria-hidden>
                {COMPANY_ICONS[item.href] ?? "📌"}
              </span>
              {item.label}
            </Link>
          ))}
          <p className="mb-2 mt-4 text-xs font-semibold uppercase text-slate-500">Модули</p>
          {NAV_MODULES.map((item) => (
            <Link key={item.href} href={item.href} className={menuLinkClass} onClick={() => setMobileOpen(false)}>
              <NavMenuIcon href={item.href} size="sm" />
              <span className="min-w-0">
                {item.label}
                {item.badge && (
                  <span className="ml-1.5 inline-flex rounded bg-brand-600 px-1 py-0.5 text-[9px] font-bold uppercase text-white">
                    {item.badge}
                  </span>
                )}
              </span>
            </Link>
          ))}
          <Link href="/services/" className={`${menuLinkClass} mt-1 text-brand-600`} onClick={() => setMobileOpen(false)}>
            Все модули — обзор
          </Link>
          <div className="mt-4 flex flex-col gap-1 border-t border-slate-200 pt-4">
            <Link href="/tarify/" className="rounded-lg px-2 py-2 hover:bg-brand-50" onClick={() => setMobileOpen(false)}>
              Тарифы
            </Link>
            <Link href="/contact/" className="rounded-lg px-2 py-2 hover:bg-brand-50" onClick={() => setMobileOpen(false)}>
              Контакты
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
