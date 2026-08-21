"use client";

import Link from "next/link";
import { useState } from "react";
import { SITE } from "@/lib/site";

type FormState = "idle" | "loading" | "success" | "error";

type FieldErrors = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  agree?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Допускаем пустое; иначе цифры/пробелы/+()- , минимум 10 цифр */
function isPhoneOk(phone: string): boolean {
  if (!phone) return true;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

function fieldClass(invalid: boolean): string {
  const base =
    "mt-1 w-full rounded-lg border px-3 py-2 text-slate-900 focus:outline-none focus:ring-1";
  return invalid
    ? `${base} border-red-400 focus:border-red-500 focus:ring-red-500`
    : `${base} border-slate-300 focus:border-brand-500 focus:ring-brand-500`;
}

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function clearField(key: keyof FieldErrors) {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function validateClient(data: FormData): FieldErrors {
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const agree = data.get("agreeConsent") === "on";

    const errors: FieldErrors = {};
    if (!name) errors.name = "Укажите имя";
    else if (name.length < 2) errors.name = "Имя слишком короткое";

    if (!email) errors.email = "Укажите e-mail";
    else if (!EMAIL_RE.test(email)) errors.email = "Некорректный формат e-mail";

    if (!isPhoneOk(phone)) errors.phone = "Укажите телефон полностью (не менее 10 цифр)";

    if (!message) errors.message = "Напишите вопрос";
    else if (message.length < 10) errors.message = "Вопрос слишком короткий (не менее 10 символов)";

    if (!agree) errors.agree = "Нужно подтвердить согласие и политику персональных данных";

    return errors;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const errors = validateClient(data);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setState("idle");
      const firstKey = (["name", "email", "phone", "message", "agree"] as const).find((k) => errors[k]);
      if (firstKey && firstKey !== "agree") {
        document.getElementById(`contact-${firstKey}`)?.focus();
      } else if (errors.agree) {
        document.getElementById("contact-agree")?.focus();
      }
      return;
    }

    setState("loading");

    const payload = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
      agreeConsent: true,
      agreePrivacy: true,
    };

    try {
      const res = await fetch("/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string; fallbackEmail?: string };

      if (!res.ok) {
        setState("error");
        const msg =
          json.error === "mail_send_failed"
            ? "Не удалось отправить письмо. Попробуйте позже или напишите напрямую."
            : json.error === "contact_unavailable"
              ? "Форма временно недоступна."
              : (json.error ?? "Не удалось отправить форму");
        setError(json.fallbackEmail ? `${msg} ${json.fallbackEmail}` : msg);
        return;
      }

      setState("success");
      setFieldErrors({});
      form.reset();
    } catch {
      setState("error");
      setError(`Не удалось отправить. Напишите на ${SITE.email}`);
    }
  }

  if (state === "success") {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-green-800">
        <p className="font-medium">Спасибо! Вопрос отправлен.</p>
        <p className="mt-2 text-sm">Мы ответим на указанный e-mail в рабочее время.</p>
        <button
          type="button"
          className="mt-4 text-sm font-medium text-brand-600 hover:text-brand-700"
          onClick={() => setState("idle")}
        >
          Отправить ещё один вопрос
        </button>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-slate-900">Задать вопрос</h2>
      <p className="text-sm text-slate-600">Заполните форму — мы свяжемся с вами по e-mail.</p>

      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium text-slate-700">
          Имя <span className="text-red-500">*</span>
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
          onChange={() => clearField("name")}
          className={fieldClass(Boolean(fieldErrors.name))}
        />
        {fieldErrors.name ? (
          <p id="contact-name-error" className="mt-1 text-sm text-red-600">
            {fieldErrors.name}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium text-slate-700">
          E-mail <span className="text-red-500">*</span>
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
          onChange={() => clearField("email")}
          className={fieldClass(Boolean(fieldErrors.email))}
        />
        {fieldErrors.email ? (
          <p id="contact-email-error" className="mt-1 text-sm text-red-600">
            {fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-phone" className="block text-sm font-medium text-slate-700">
          Телефон
        </label>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="+7 900 000-00-00"
          aria-invalid={Boolean(fieldErrors.phone)}
          aria-describedby={fieldErrors.phone ? "contact-phone-error" : undefined}
          onChange={() => clearField("phone")}
          className={fieldClass(Boolean(fieldErrors.phone))}
        />
        {fieldErrors.phone ? (
          <p id="contact-phone-error" className="mt-1 text-sm text-red-600">
            {fieldErrors.phone}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-slate-700">
          Вопрос <span className="text-red-500">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={fieldErrors.message ? "contact-message-error" : undefined}
          onChange={() => clearField("message")}
          className={fieldClass(Boolean(fieldErrors.message))}
        />
        {fieldErrors.message ? (
          <p id="contact-message-error" className="mt-1 text-sm text-red-600">
            {fieldErrors.message}
          </p>
        ) : null}
      </div>

      <div>
        <label className="flex gap-2 text-sm text-slate-600">
          <input
            id="contact-agree"
            name="agreeConsent"
            type="checkbox"
            aria-invalid={Boolean(fieldErrors.agree)}
            aria-describedby={fieldErrors.agree ? "contact-agree-error" : undefined}
            onChange={() => clearField("agree")}
            className={`mt-1 ${fieldErrors.agree ? "outline outline-1 outline-red-400" : ""}`}
          />
          <span>
            Даю свое{" "}
            <Link href="/legal/doc/personal-data-consent/" className="text-brand-600 hover:text-brand-700">
              согласие
            </Link>{" "}
            на обработку и соглашаюсь с{" "}
            <Link href="/legal/doc/privacy-policy/" className="text-brand-600 hover:text-brand-700">
              политикой персональных данных
            </Link>
          </span>
        </label>
        {fieldErrors.agree ? (
          <p id="contact-agree-error" className="mt-1 text-sm text-red-600">
            {fieldErrors.agree}
          </p>
        ) : null}
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={state === "loading"}
        className="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
      >
        {state === "loading" ? "Отправка…" : "Отправить"}
      </button>
    </form>
  );
}
