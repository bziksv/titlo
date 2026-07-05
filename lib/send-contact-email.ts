import nodemailer from "nodemailer";
import { SITE } from "@/lib/site";

export type ContactEmailPayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
};

/** Получатели заявок с формы «Задать вопрос» */
export const CONTACT_MAIL_TO = ["info@titlo.ru", "sv6@list.ru"] as const;

export function getContactRecipients(): string[] {
  const fromEnv = process.env.CONTACT_TO?.split(/[,;]+/).map((e) => e.trim()).filter(Boolean);
  return fromEnv?.length ? fromEnv : [...CONTACT_MAIL_TO];
}

export function isSmtpConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function buildText(payload: ContactEmailPayload): string {
  return [
    "Новая заявка с формы «Задать вопрос»",
    `Сайт: ${SITE.siteUrl}/contact/`,
    "",
    `Имя: ${payload.name}`,
    `E-mail: ${payload.email}`,
    `Телефон: ${payload.phone?.trim() || "—"}`,
    "",
    "Сообщение:",
    payload.message,
  ].join("\n");
}

function buildHtml(payload: ContactEmailPayload): string {
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  return `
    <p>Новая заявка с формы «Задать вопрос» на <a href="${SITE.siteUrl}/contact/">${SITE.siteUrl}</a></p>
    <p><strong>Имя:</strong> ${esc(payload.name)}</p>
    <p><strong>E-mail:</strong> <a href="mailto:${esc(payload.email)}">${esc(payload.email)}</a></p>
    <p><strong>Телефон:</strong> ${esc(payload.phone?.trim() || "—")}</p>
    <p><strong>Сообщение:</strong></p>
    <p style="white-space:pre-wrap">${esc(payload.message)}</p>
  `.trim();
}

export async function sendContactEmail(payload: ContactEmailPayload): Promise<boolean> {
  if (!isSmtpConfigured()) return false;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const to = getContactRecipients();
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;

  await transporter.sendMail({
    from: `"${SITE.name}" <${from}>`,
    to: to.join(", "),
    replyTo: payload.email,
    subject: `[${SITE.name}] Вопрос с сайта — ${payload.name}`,
    text: buildText(payload),
    html: buildHtml(payload),
  });

  return true;
}
