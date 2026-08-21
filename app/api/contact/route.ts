import { SITE } from "@/lib/site";
import { proxyToLk } from "@/lib/lk-api";
import { getContactRecipients, isSmtpConfigured, sendContactEmail } from "@/lib/send-contact-email";

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  agreeConsent?: boolean;
  agreePrivacy?: boolean;
};

function validate(body: ContactPayload): string | null {
  if (!body.agreeConsent) return "Требуется согласие на обработку персональных данных";
  if (!body.agreePrivacy) return "Требуется согласие с политикой персональных данных";
  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();
  if (!name || name.length < 2) return "Укажите имя";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Укажите корректный e-mail";
  if (!message || message.length < 10) return "Укажите текст вопроса (не менее 10 символов)";
  return null;
}

function normalizedPayload(body: ContactPayload) {
  return {
    name: body.name!.trim(),
    email: body.email!.trim(),
    phone: body.phone?.trim() ?? "",
    message: body.message!.trim(),
  };
}

async function forwardWebhook(payload: ContactPayload): Promise<boolean> {
  const url = process.env.CONTACT_WEBHOOK_URL;
  if (!url) return false;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      form: "Задать вопрос",
      site: SITE.siteUrl,
      ...payload,
    }),
  });
  return res.ok;
}

async function forwardLk(payload: ContactPayload): Promise<boolean> {
  const res = await proxyToLk("api/public/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      phone: payload.phone ?? "",
      message: payload.message,
      source: `${new URL(SITE.siteUrl).host}/contact`,
    }),
  });
  return res.ok;
}

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const validationError = validate(body);
  if (validationError) {
    return Response.json({ error: validationError }, { status: 400 });
  }

  const payload = normalizedPayload(body);

  if (isSmtpConfigured()) {
    try {
      await sendContactEmail(payload);
      return Response.json({ ok: true });
    } catch (err) {
      console.error("[contact] SMTP error:", err);
      return Response.json(
        {
          error: "mail_send_failed",
          fallbackEmail: getContactRecipients()[0],
        },
        { status: 503 },
      );
    }
  }

  if (await forwardLk(body)) {
    return Response.json({ ok: true });
  }

  if (await forwardWebhook(body)) {
    return Response.json({ ok: true });
  }

  if (process.env.NODE_ENV === "development") {
    console.info("[contact] SMTP не настроен. Заявка:", payload);
    console.info("[contact] Получатели:", getContactRecipients().join(", "));
    return Response.json({
      ok: true,
      dev: true,
      hint: "Задайте SMTP_HOST, SMTP_USER, SMTP_PASS в .env.local",
    });
  }

  return Response.json(
    {
      error: "contact_unavailable",
      fallbackEmail: getContactRecipients()[0],
    },
    { status: 503 },
  );
}
