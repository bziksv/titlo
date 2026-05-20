"use client";

import { useState } from "react";
import { LK_URL } from "@/lib/site";

type Props = {
  /** hero — на тёмном фоне; card — белая карточка */
  variant?: "hero" | "card" | "inline";
  title?: string;
  hint?: string;
  /** Уникальный префикс id полей (если на странице несколько форм) */
  idPrefix?: string;
};

export function ModuleLeadCta({
  variant = "card",
  title = "Попробовать модуль бесплатно",
  hint = "Регистрация в личном кабинете — доступ к анализу и другим инструментам.",
  idPrefix = "module-cta",
}: Props) {
  const emailId = `${idPrefix}-email`;
  const [email, setEmail] = useState("");

  const goRegister = () => {
    const q = email.trim() ? `?email=${encodeURIComponent(email.trim())}` : "";
    window.location.href = `${LK_URL}/register${q}`;
  };

  const inputClass =
    variant === "hero"
      ? "min-w-0 flex-1 rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/30"
      : "min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200";

  const btnClass =
    variant === "hero"
      ? "shrink-0 rounded-xl bg-white px-6 py-3 font-semibold text-brand-700 transition hover:bg-brand-50"
      : "shrink-0 rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-brand-700";

  const wrapClass =
    variant === "card"
      ? "rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 md:p-8"
      : variant === "hero"
        ? "w-full max-w-xl"
        : "w-full";

  return (
    <div className={wrapClass}>
      {variant !== "inline" && (
        <div className="mb-4">
          <h3 className={`text-lg font-bold ${variant === "hero" ? "text-white" : "text-slate-900"}`}>
            {title}
          </h3>
          <p className={`mt-1 text-sm ${variant === "hero" ? "text-brand-100" : "text-slate-600"}`}>{hint}</p>
        </div>
      )}
      <form
        className="flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          goRegister();
        }}
      >
        <label className="sr-only" htmlFor={emailId}>
          Email
        </label>
        <input
          id={emailId}
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Ваш email для регистрации"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
        <button type="submit" className={btnClass}>
          Получить доступ
        </button>
      </form>
      <p className={`mt-3 text-xs ${variant === "hero" ? "text-brand-100/90" : "text-slate-500"}`}>
        Уже есть аккаунт?{" "}
        <a
          href={`${LK_URL}/login`}
          className={`font-semibold underline-offset-2 hover:underline ${variant === "hero" ? "text-white" : "text-brand-600"}`}
        >
          Войти в кабинет
        </a>
      </p>
    </div>
  );
}
