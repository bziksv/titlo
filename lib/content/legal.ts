import { LEGAL_DOCS, type LegalDoc } from "@/lib/content/legal.generated";
import { LK_URL, SITE } from "@/lib/site";

export type { LegalDoc };

/** Скрап с redbox.su → актуальные домены и контакты Титло. */
export function localizeLegalHtml(html: string): string {
  const siteUrl = SITE.siteUrl.replace(/\/$/, "");
  const siteHost = new URL(siteUrl).host;
  const lkHost = new URL(LK_URL.replace(/\/$/, "")).host;

  return html
    .replace(
      /размещенный в сети Интернет по адресу redbox\.su, а также любые сайты в доменной зоне \*\.redbox\.su \(где \* - любое имя\)/gi,
      `размещённый в сети Интернет на сайте ${siteHost} и в личном кабинете ${lkHost}, а также на любых поддоменах указанных доменов`,
    )
    .replace(/https:\/\/redbox\.su\/tarify\//gi, `${siteUrl}/tarify/`)
    .replace(/https:\/\/redbox\.su\//gi, `${siteUrl}/`)
    .replace(/https:\/\/redbox\.su/gi, siteUrl)
    .replace(/href="mailto:info@redbox\.su"/gi, `href="mailto:${SITE.email}"`)
    .replace(/info@redbox\.su/gi, SITE.email)
    .replace(/lk\.redbox\.su/gi, lkHost)
    .replace(/\*\.redbox\.su/gi, `*.${siteHost} и *.${lkHost}`)
    .replace(/на сайте redbox\.su/gi, `на сайте ${siteHost}`)
    .replace(/по адресу redbox\.su/gi, `по адресу ${siteHost}`)
    .replace(/сайте redbox\.su/gi, `сайте ${siteHost}`)
    .replace(/redbox\.su/gi, siteHost);
}

/** Дополнение к оферте: хранение данных Free при неактивности (согласовано с политикой сервиса). */
const OFFER_FREE_TARIFF_RETENTION_CLAUSE = `<br><p> 13.6. Для Клиентов на бесплатном тарифе («Free»), не имеющих действующего платного тарифа, применяется политика хранения данных с учётом активности в Сервисе. Под «посещением» / «активностью» понимается авторизация в личном кабинете (фиксируется по дате последнего входа). </p><p> 13.6.1. Если Клиент на бесплатном тарифе не посещал Сервис более 30 (тридцати) календарных дней подряд, Исполнитель вправе приостановить автоматическое обновление данных по проектам Клиента (в том числе отключить автосъём по расписанию) без предварительного уведомления. </p><p> 13.6.2. Если неактивность на бесплатном тарифе продолжается более 60 (шестидесяти) календарных дней подряд, Исполнитель вправе удалить данные автоматических съёмов по расписанию, сохранённые в Сервисе. </p><p> 13.6.3. Если неактивность на бесплатном тарифе продолжается более 90 (девяноста) календарных дней подряд, Исполнитель вправе удалить архивные данные по проектам (в том числе историю позиций и иные накопленные результаты), оставив при необходимости только структуру проекта (например, список ключевых слов без истории). </p><p> 13.6.4. По истечении более длительного срока неактивности Исполнитель вправе удалить проекты Клиента и связанные с ними данные полностью, если иное не предусмотрено действующим законодательством РФ. </p><p> 13.6.5. Указанные в п. 13.6–13.6.4 меры не применяются к Клиентам с действующим платным тарифом на момент соответствующих действий. Исполнитель не несёт ответственности за утрату данных и невозможность восстановления проектов, наступившую в связи с применением настоящей политики, а также за упущенную выгоду Клиента. </p><p> 13.6.6. Исполнитель вправе изменять сроки и порядок применения политики хранения данных для бесплатного тарифа, публикуя актуальную редакцию на сайте Сервиса. </p>`;

function appendOfferRetentionClause(html: string): string {
  if (html.includes("13.6. Для Клиентов на бесплатном тарифе")) {
    return html;
  }
  const marker = "<br><br><p> Юридические реквизиты";
  if (html.includes(marker)) {
    return html.replace(marker, OFFER_FREE_TARIFF_RETENTION_CLAUSE + marker);
  }
  return html + OFFER_FREE_TARIFF_RETENTION_CLAUSE;
}

export function getAllLegalSlugs(): string[] {
  return LEGAL_DOCS.map((d) => d.slug);
}

export function getLegalBySlug(slug: string): LegalDoc | undefined {
  const doc = LEGAL_DOCS.find((d) => d.slug === slug);
  if (!doc) return undefined;
  let bodyHtml = localizeLegalHtml(doc.bodyHtml);
  if (slug === "offer") {
    bodyHtml = appendOfferRetentionClause(bodyHtml);
  }
  return { ...doc, bodyHtml };
}

export const LEGAL_NAV = LEGAL_DOCS.map((d) => ({
  href: `/legal/${d.slug}/`,
  label: d.title,
}));
