import type { GlossaryTerm } from "../types";

/**
 * Бриф: кабинет #301 «Manual Action».
 * Google MSK TOP-20, history 103936, запрос «manual action google», 19.11.2026.
 */
export const ManualAction: GlossaryTerm = {
  slug: "manual-action",
  term: "Manual Action",
  aliases: [
    "manual action",
    "manual actions",
    "ручные меры google",
    "manual action google"
  ],
  categoryId: "algoritmy-i-apdeyty-google",
  h1: "Manual Action: что такое ручные меры Google и как с ними работать",
  seoTitle: "Manual Action в Google: что это, где смотреть отчёт и как подавать reconsideration request",
  seoDescription: "Manual Action — ручная мера Google за нарушение правил для веб-мастеров. Чем она отличается от автоматических алгоритмов, как читать отчёт в Search Console и что делать перед запросом на пересмотр.",
  short: "Manual Action (ручная мера Google) — это санкция, которую сотрудник Google накладывает на сайт или часть страниц, если считает, что ресурс нарушает спам-политики. В отличие от автоматических систем, о мере обычно сообщают в Search Console: в отчёте Manual actions видно тип проблемы и область действия. Снять её можно только после реальных исправлений и, как правило, запроса на пересмотр (reconsideration request).",
  definition: "Manual Action — ручное действие команды поиска Google против сайта, который, по их оценке, нарушает опубликованные spam policies. Мера может затронуть весь сайт или отдельные разделы и снижает видимость в результатах поиска, пока нарушение не устранят. Это не то же самое, что [Core Update](/slovar/core-update/) или автоматический классификатор качества: о ручной мере обычно есть запись в Search Console, а не только догадка по графику трафика.",
  sections: [
    {
      id: "chto-takoe",
      title: "Что такое Manual Action",
      tocLabel: "Определение",
      blocks: [
        {
          type: "p",
          text: "Ручная мера появляется, когда Google считает, что автоматических систем недостаточно и сайт стоит проверить и ограничить вручную. Типичные поводы связаны со spam policies: накрутка ссылок, скрытый текст и переадресации, взломанные страницы, чистый спам, иногда злоупотребление репутацией домена. Точный тип пишут в отчёте, и именно его нужно разбирать, а не «санкции Google» вообще."
        },
        {
          type: "p",
          text: "Важно не путать термины. Пессимизация и алгоритмическая просадка могут идти без письма. Manual action — это именно ручной вердикт с уведомлением. Пока мера активна, часть или все страницы могут хуже показываться в search results или не показываться так, как раньше."
        }
      ]
    },
    {
      id: "gde-smotret",
      title: "Где смотреть отчёт и что в нём бывает",
      tocLabel: "Отчёт в консоли",
      blocks: [
        {
          type: "p",
          text: "Основное место — отчёт Manual actions в Google Search Console. Там видно, есть ли активная мера, на весь сайт она распространяется или на часть URL, и какой тип нарушения указан. Если отчёт чистый, объяснять падение трафика «ручным баном» обычно рано: чаще виноваты алгоритмы, спрос, технический сбой или конкуренция."
        },
        {
          type: "p",
          text: "Сообщения в аккаунте консоли тоже стоит читать внимательно. Google пишет, когда меру наложили, что именно считается нарушением и какой следующий шаг ожидают. Шаблонное письмо «мы хорошие, снимите, пожалуйста» без фактов исправлений почти никогда не помогает."
        },
        {
          type: "flow",
          caption: "Как обычно работают с ручной мерой",
          steps: [
            {
              label: "Читают отчёт Manual actions",
              note: "тип нарушения и область действия, не только факт письма"
            },
            {
              label: "Сверяют с правилами",
              note: "какой пункт spam policies имеют в виду"
            },
            {
              label: "Устраняют причину на сайте и в ссылках",
              note: "не косметику, а само нарушение"
            },
            {
              label: "Собирают доказательства изменений",
              note: "что убрали, что закрыли, что исправили"
            },
            {
              label: "Отправляют reconsideration request и ждут ответа",
              note: "без повторных писем каждый день"
            }
          ]
        },
        {
          type: "table",
          caption: "Чем ручная мера отличается от соседних ситуаций",
          head: [],
          rows: [
            [
              "Ситуация",
              "Как обычно проявляется",
              "Есть ли письмо в консоли",
              "Что делать в первую очередь"
            ],
            [
              "Manual Action",
              "ограничение после ручной проверки",
              "да, отчёт Manual actions",
              "исправить указанное нарушение и запросить пересмотр"
            ],
            [
              "Автоматический спам-фильтр",
              "просадка без ручного вердикта",
              "чаще нет",
              "разбирать качество и спам-сигналы, а не ждать «снятия бана»"
            ],
            [
              "Core Update",
              "широкое перераспределение видимости",
              "нет ручной меры",
              "сравнивать полезность страниц, не подавать reconsideration «на обновление»"
            ],
            [
              "Взлом или накрутка на сайте",
              "странные URL, спам-страницы, резкий мусорный трафик",
              "иногда да, если это оформили как меру",
              "закрыть дыру, вычистить спам, затем уже писать запрос"
            ],
            [
              "Токсичные входящие ссылки",
              "риск при явном ссылочном спаме",
              "иногда, если есть ссылочная мера",
              "разобрать профиль, при необходимости использовать [Disavow](/slovar/disavow/)"
            ],
            [
              "Проблемы индексации",
              "страницы выпали, но без санкции",
              "нет",
              "смотреть покрытие, robots, ошибки, а не отчёт мер"
            ]
          ],
          textOnly: true,
          note: "Сначала читают формулировку меры, потом уже выбирают лечение."
        }
      ]
    },
    {
      id: "reconsideration",
      title: "Как готовят запрос на пересмотр",
      tocLabel: "Запрос на пересмотр",
      blocks: [
        {
          type: "p",
          text: "Reconsideration request — это не жалоба и не «апелляция ради скорости». В запросе кратко описывают, что было не так, что именно исправили и как собираются не повторять нарушение. Имеет смысл прикладывать факты: какие разделы сняты, какие ссылки отвергнуты, какой взлом закрыт. Если правки ещё идут, письмо отправлять рано: команда должна увидеть уже исправленный сайт."
        },
        {
          type: "p",
          text: "После отправки статус в отчёте может некоторое время не меняться. Повторные запросы, пока предыдущий не рассмотрен, обычно только мешают. Если меру оставляют, в ответе иногда поясняют, чего не хватает; тогда доделывают работу и пишут снова, а не спорят с формулировкой."
        }
      ]
    },
    {
      id: "chto-ne-delat",
      title: "Чего не стоит делать",
      tocLabel: "Чего не делать",
      blocks: [
        {
          type: "p",
          text: "Не стоит менять домен «чтобы обнулить санкцию»: перенос без исправления причины часто переносит и проблему, плюс это само по себе выглядит как попытка обхода. Не стоит маскировать спам-страницы вместо удаления, покупать ещё ссылок «в плюс» и писать в запрос общие слова без списка действий. Не стоит также путать меру с [серым SEO](/slovar/seroe-seo/) как ярлыком: нужна конкретная причина из отчёта."
        }
      ]
    },
    {
      id: "documentaciya-en",
      title: "How Google describes manual actions in English",
      tocLabel: "Документация на английском",
      blocks: [
        {
          type: "p",
          text: "The Manual actions report in Search Console tells you whether a site is in violation of spam policies. If a manual action is applied, Google may limit how the site appears in search results until the issue is fixed. Typical public materials describe a simple sequence: review the report, fix the problem on the site, then submit a reconsideration request and be patient while the review is in progress."
        },
        {
          type: "p",
          text: "When a reviewer determines that your site is no longer in violation, they can revoke the manual action. Search Console usually lets you know when the request has been reviewed. The message is not a guarantee of the old rankings: it only says the manual restriction was lifted. Other ranking systems can still treat the pages differently."
        },
        {
          type: "p",
          text: "Common English phrases in this context are practical, not magical: manual actions report, reconsideration request, spam policies, review status, recommended actions, evidence of changed behavior. You should be able to show that the violation is gone and that the site now follows the published guidelines. Link spam cases may also involve a link cleanup and, in some situations, a disavow file, but the file alone does not replace removing the underlying issue."
        },
        {
          type: "p",
          text: "Do not send a request if the report is empty. A traffic drop after a core update or an automated system is not, by itself, a manual action. Use the console account to confirm the status first, then do the recommended work, then ask for a review."
        },
        {
          type: "p",
          text: "In English help pages you will also see examples of what a manual action is not. A sudden drop can come from a ranking update, a technical outage, a seasonal change or a penalty-like algorithmic classifier — and still leave the Manual actions report empty. If the report has no entry, do not invent a manual penalty. Check coverage, robots, content quality and other data first. If the report does have an entry, do not ignore it and hope the website will “get used” to the restriction."
        },
        {
          type: "p",
          text: "For link-related cases, reviewers often look at whether you removed unnatural links you control, contacted webmasters where possible, and, if needed, used a disavow file for links you cannot take down. The file is evidence of cleanup, not a magic tool. For hacked content, redirects, doorway-like created pages or keyword stuffing, the work is on your own URLs: remove or fix the violating content, then explain what changed. Provide a clear list, not a vague promise to “be good”."
        },
        {
          type: "p",
          text: "Any reconsideration request should read as a factual status: what we found, what we fixed, how we will prevent the same issue. Help the reviewer see the difference. One good request after a complete cleanup is better than many short messages. There is no public timer, so the way to work is to wait for the review status to update in Search Console."
        },
        {
          type: "table",
          caption: "Какие английские формулировки встречаются в отчётах о manual action",
          head: [],
          rows: [
            [
              "Термин",
              "Что обычно имеют в виду",
              "Где смотрят",
              "Что делать"
            ],
            [
              "manual action / manual actions report",
              "ручная мера и отчёт о ней",
              "Search Console",
              "сначала подтвердить, что мера есть"
            ],
            [
              "spam policies",
              "опубликованные правила против спама",
              "документация Google",
              "сверить тип меры с пунктом правил"
            ],
            [
              "reconsideration request",
              "запрос на пересмотр после исправлений",
              "форма в консоли",
              "писать, когда правки уже сделаны"
            ],
            [
              "review status",
              "статус рассмотрения запроса",
              "отчёт и уведомления",
              "ждать ответа, не слать письма каждый день"
            ],
            [
              "revoke the manual action",
              "снятие ручного ограничения",
              "сообщение после проверки",
              "это не гарантия старых позиций"
            ],
            [
              "unnatural links, link spam",
              "неестественный ссылочный профиль",
              "тип меры про ссылки",
              "убрать то, что контролируете, при необходимости disavow"
            ],
            [
              "hidden text, cloaking, sneaky redirects",
              "скрытый текст, подмена, скрытые переадресации",
              "тип меры на свои URL",
              "исправить свои страницы, затем запрос"
            ],
            [
              "hacked content",
              "взломанные или навязанные спам-URL",
              "отчёт и список страниц",
              "закрыть дыру и вычистить контент"
            ]
          ],
          textOnly: true,
          note: "Формулировка в отчёте важнее общего слова «бан»."
        },
        {
          type: "p",
          text: "User-generated spam, commercial comments, doorway-like pages and auto-generated text can all be in scope if they violate the policies. News and Discover visibility can also be affected in some cases, but the first job is still the same: identify the violating content, make the site compliant, and include enough details in the request. Do not hide the issue or cloak the old URLs. If you want the restriction lifted, the reviewer should be able to see the difference without guessing."
        },
        {
          type: "p",
          text: "People sometimes call any traffic drop a “Google penalty”. The report is what matters. If no manual action was detected, keep the investigation on content quality, structured data mistakes, hosting, or a written change you shipped the same week. If a measure is there, start with the named issue: thin pages, hidden text, deceptive redirects, spam in comments, or a block of auto-generated URLs. Learn the official terms, follow the steps, and email through Search Console rather than a free public form. Customers should see a clean site; reviewers should receive a clear description of what changed and which URLs were affected."
        },
        {
          type: "p",
          text: "A short business blog post or a marketing landing page is not a problem by itself. It becomes one when the page is created only to manipulate rankings, uses cloaking, or adds no value. Different types of manual actions have different cleanup paths, so do not copy a generic guide. Improve the specific violation, then wait for the review."
        },
        {
          type: "p",
          text: "Security holes, broken affiliate sections and third-party widgets can also lead to a manual action if they inject spammy posts or paid links you did not intend to host. Check the web server logs, the CMS, and any service that can publish on your domain. Visitors should never land on a page that was not written by you. Mobile and AMP versions, image sitemaps and analytics tags do not replace this cleanup, but they should not be left as a back door either. When the site is clean, submit the request and give the review a few days — there is no public button that determines the outcome instantly."
        },
        {
          type: "p",
          text: "Official practices also mention user-generated spam on the same domain, scraped information, and doorway behavior that sends people to a different experience than the snippet promised. If such patterns are found, remove them, then provide examples in the request. This is ordinary web hygiene, not a special engine ritual."
        },
        {
          type: "p",
          text: "A product page, an image gallery or a mobile template can be part of the cleanup if that is where the violation was hosted."
        }
      ]
    }
  ],
  modules: {
    id: "manual-action-titlo",
    title: "Какие инструменты Титло помогают навести порядок до запроса на пересмотр",
    intro: "Ручную меру не «отговорить» красивым письмом. Сначала убирают причину: сомнительные ссылки, скрытый спам, служебные разделы, которые не должны попадать в поиск.",
    items: [
      {
        slug: "otslezhivanie-ssylok",
        title: "Отслеживание ссылок",
        text: "Помогает собрать входящий профиль и увидеть площадки, которые часто всплывают в историях про покупные и спам-ссылки."
      },
      {
        slug: "audit-sajta",
        title: "Аудит сайта",
        text: "Полезно пройтись по техническим и индексным проблемам, которые иногда соседствуют с нарушением: служебные URL, дубли, странные шаблоны."
      },
      {
        slug: "monitoring-pozicii-sayta",
        title: "Мониторинг позиций",
        text: "Показывает, какие запросы просели вместе с мерой, а какие жили отдельно — так проще оценить область действия."
      }
    ]
  },
  related: [
    "Core Update",
    "Disavow",
    "Токсичные ссылки",
    "Серое SEO",
    "Site Reputation Abuse",
    "Nofollow"
  ],
  takeaways: [
    "Manual Action — ручная мера Google за нарушение спам-политик, а не любое падение трафика.",
    "Главный источник правды — отчёт Manual actions в Search Console: тип меры и область действия.",
    "Сначала устраняют причину, затем отправляют reconsideration request с фактами исправлений.",
    "Снятие меры не обещает прежние позиции: оно только убирает ручное ограничение.",
    "Пустой отчёт означает, что объяснять просадку «ручным баном» рано."
  ],
  faq: [
    {
      q: "Как понять, что на сайт наложили именно ручную меру?",
      a: "Откройте отчёт Manual actions в Search Console и почтовые уведомления аккаунта. Если активной меры нет, падение скорее связано с алгоритмами, спросом или техникой, а не с ручным вердиктом."
    },
    {
      q: "Можно ли снять меру, просто написав письмо?",
      a: "Нет. Сначала исправляют нарушение, потом отправляют запрос на пересмотр. Письмо без изменений обычно отклоняют."
    },
    {
      q: "Вернётся ли трафик сразу после снятия меры?",
      a: "Не обязательно. Ручное ограничение снимают, но позиции зависят и от других систем, конкурентов и качества страниц. Иногда видимость отходит постепенно."
    },
    {
      q: "Нужно ли сразу подавать disavow при любой мере?",
      a: "Только если проблема именно во входящих ссылках и это следует из типа меры. Для скрытого текста, взлома или спама на своих URL disavow не заменяет уборку сайта. См. [токсичные ссылки](/slovar/toksichnye-ssylki/)."
    },
    {
      q: "Чем это отличается от Site Reputation Abuse?",
      a: "Злоупотребление репутацией сайта — отдельная политика, по которой тоже могут быть ручные меры. Суть в другом: чужой или сторонний контент паразитирует на авторитете домена. Подробнее — в отдельной статье, когда вы разбираете именно этот тип."
    }
  ],
  datePublished: "2026-11-26",
  dateModified: "2026-11-26"
};
