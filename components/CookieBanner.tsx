"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { acceptCookieConsent, hasCookieConsent } from "@/lib/cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!hasCookieConsent()) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Уведомление о cookies"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white p-4 shadow-lg"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          Мы используем cookie для оптимизации работы сайта и анализа посещаемости. Используя сайт, вы
          соглашаетесь с{" "}
          <Link href="/legal/doc/cookies-policy/" className="text-brand-600 hover:text-brand-700">
            политикой cookie-файлов
          </Link>
          ,{" "}
          <Link href="/legal/doc/privacy-policy/" className="text-brand-600 hover:text-brand-700">
            политикой обработки персональных данных
          </Link>{" "}
          и{" "}
          <Link href="/legal/personal-data/" className="text-brand-600 hover:text-brand-700">
            согласием на обработку персональных данных
          </Link>
          .
        </p>
        <button
          type="button"
          className="shrink-0 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          onClick={() => {
            acceptCookieConsent();
            setVisible(false);
          }}
        >
          Принять
        </button>
      </div>
    </div>
  );
}
