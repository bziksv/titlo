"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { demoCabinetHref } from "@/lib/demo-cabinet";
import { NavMenuIcon } from "@/lib/module-icons";
import { LK_URL, NAV_COMPANY, NAV_MODULES, SITE } from "@/lib/site";

const COMPANY_ICONS: Record<string, string> = {
  "/about/": "🏢",
  "/news/": "📰",
};

const menuLinkClass =
  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition hover:bg-brand-50 hover:text-brand-700";

const navItemClass =
  "rounded-lg border border-transparent px-3 py-1.5 text-sm transition-all hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 hover:shadow-sm";

const navItemActiveClass =
  "rounded-lg border border-brand-300 bg-brand-50 px-3 py-1.5 text-sm text-brand-700 shadow-sm";

const dropdownAnchorClass = "absolute left-0 top-full z-[70] pt-2";

const dropdownPanelClass = "rounded-xl border border-slate-200 bg-white shadow-lg";

function FlagshipNavBadge({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={
        compact
          ? "inline-flex items-center rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-700"
          : "inline-flex items-center rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700"
      }
    >
      флагман
    </span>
  );
}

export function Header() {
  const pathname = usePathname();
  const demoHref = demoCabinetHref(pathname);
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

  useEffect(() => {
    if (!mobileOpen) return;

    const html = document.documentElement;
    const body = document.body;
    const scrollY = window.scrollY;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyPosition = body.style.position;
    const prevBodyTop = body.style.top;
    const prevBodyWidth = body.style.width;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.position = prevBodyPosition;
      body.style.top = prevBodyTop;
      body.style.width = prevBodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, [mobileOpen]);

  return (
    <>
    <header className="sticky top-0 z-50 overflow-visible border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 overflow-visible px-3 py-2 sm:gap-3 sm:px-4">
        <Link
          href="/"
          className="flex min-w-0 shrink items-center gap-1.5 rounded-lg border border-transparent p-0.5 transition hover:border-brand-200 hover:bg-brand-50/50 sm:gap-2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/favicon.svg" alt="" width={32} height={32} className="h-7 w-7 shrink-0 sm:h-8 sm:w-8" />
          <span className="truncate text-base font-bold leading-none text-brand-600 sm:text-lg">{SITE.name}</span>
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
              <div className={`${dropdownAnchorClass} w-[min(100vw-2rem,460px)]`}>
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
                      <span className="min-w-0 flex-1 leading-snug">{item.label}</span>
                      <span className="flex w-[4.25rem] shrink-0 justify-end">
                        {item.badge ? <FlagshipNavBadge /> : null}
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
                      <span className="min-w-0 flex-1">Все модули — обзор</span>
                      <span className="w-[4.25rem] shrink-0" aria-hidden />
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
            href={demoHref}
            className="rounded-lg border border-brand-300 bg-white px-3 py-1.5 text-sm font-medium text-brand-800 shadow-sm transition hover:bg-brand-50"
          >
            Демо кабинет
          </a>
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

        {/* ≤1023px: только лого + меню; CTA в панели — иначе на 320px обрезается «Регистрация» */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 lg:hidden">
          <a
            href={`${LK_URL}/login`}
            className="hidden rounded-lg px-2 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-brand-50 hover:text-brand-700 min-[380px]:inline-flex"
          >
            Вход
          </a>
          <button
            type="button"
            className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm transition hover:border-brand-300 hover:bg-brand-50"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>
    </header>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-white lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Меню"
        >
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-200 px-3 py-2 sm:px-4">
            <Link
              href="/"
              className="flex min-w-0 items-center gap-1.5"
              onClick={() => setMobileOpen(false)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/favicon.svg" alt="" width={32} height={32} className="h-7 w-7 shrink-0" />
              <span className="truncate text-base font-bold leading-none text-brand-600">{SITE.name}</span>
            </Link>
            <button
              type="button"
              className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm transition hover:border-brand-300 hover:bg-brand-50"
              onClick={() => setMobileOpen(false)}
              aria-label="Закрыть меню"
            >
              ✕
            </button>
          </div>
          <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 [-webkit-overflow-scrolling:touch]">
            <div className="mb-4 flex flex-col gap-2">
              <a
                href={`${LK_URL}/register`}
                className="rounded-lg bg-brand-600 px-3 py-2.5 text-center text-sm font-medium text-white shadow-sm"
                onClick={() => setMobileOpen(false)}
              >
                Регистрация
              </a>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`${LK_URL}/login`}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-center text-sm font-medium text-slate-700"
                  onClick={() => setMobileOpen(false)}
                >
                  Вход
                </a>
                <a
                  href={demoHref}
                  className="rounded-lg border border-brand-300 bg-brand-50 px-3 py-2 text-center text-sm font-medium text-brand-800"
                  onClick={() => setMobileOpen(false)}
                >
                  Демо
                </a>
              </div>
            </div>
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
                <span className="min-w-0 flex-1 leading-snug">{item.label}</span>
                <span className="flex w-[3.75rem] shrink-0 justify-end">
                  {item.badge ? <FlagshipNavBadge compact /> : null}
                </span>
              </Link>
            ))}
            <Link href="/services/" className={`${menuLinkClass} mt-1 text-brand-600`} onClick={() => setMobileOpen(false)}>
              <span className="min-w-0 flex-1">Все модули — обзор</span>
              <span className="w-[3.75rem] shrink-0" aria-hidden />
            </Link>
            <div className="mt-4 flex flex-col gap-1 border-t border-slate-200 pt-4 pb-6">
              <Link href="/tarify/" className="rounded-lg px-2 py-2 hover:bg-brand-50" onClick={() => setMobileOpen(false)}>
                Тарифы
              </Link>
              <Link href="/contact/" className="rounded-lg px-2 py-2 hover:bg-brand-50" onClick={() => setMobileOpen(false)}>
                Контакты
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
