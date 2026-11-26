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
    },
    {
      id: "english-manual-action",
      title: "How Google describes manual actions and a reconsideration request",
      tocLabel: "English-language notes",
      blocks: [
        {
          type: "p",
          text: "A manual action is a human-reviewed penalty in Google Search Console, not an ordinary ranking fluctuation. The Manual Actions report tells a webmaster whether a site or a section has been flagged for a policy violation and what type of issue was found. Common families include spam, cloaking, hidden text, sneaky redirects, thin or scraped content, user-generated spam, unnatural links, hacked content and structured data abuse. The report may apply to the whole site or only to some URLs."
        },
        {
          type: "p",
          text: "The official process is to fix the issue first and then request a review. Google asks you to explain what happened, what you changed, and how you will prevent it from coming back. Sending the same request again and again before the work is done does not help. If the report opens with an unnatural links item, the work is to clean the link profile and document the cleanup, not to write a short denial. If the store or a section of the site is listed, start there; do not assume the whole domain is equally affected."
        },
        {
          type: "p",
          text: "How teams should treat this in practice is conservative. A manual action is a serious signal. It does not mean every traffic drop is a manual penalty, and most visibility changes are still algorithmic. But if the report is not clean, that is the first job. Get the facts from Search Console, fix the pages or the links, keep a written log, and only then request reconsideration. Introducing new aggressive tactics while a review is pending usually makes the case worse."
        }
      ]
    },
    {
      id: "kak-gotovit-razbor",
      title: "Как готовить разбор и запрос на пересмотр, чтобы он опирался на факты",
      tocLabel: "Как готовить разбор",
      blocks: [
        {
          type: "p",
          text: "Запрос на пересмотр имеет смысл только после реальных правок. Сначала открывают отчет, читают тип нарушения, определяют границы: весь сайт или часть раздела. Затем собирают доказательства работы: какие страницы или ссылки убрали, что исправили в шаблоне, как закрыли точку входа для спама, кто это проверял. В тексте запроса лучше коротко и по делу: что было, что сделали, как будут следить дальше. Общие фразы «мы больше так не будем» без фактов выглядят слабо."
        },
        {
          type: "p",
          text: "Если речь про неестественные ссылки, к разбору прикладывают логику очистки, а не обещание «сейчас купим другие, но хорошие». Если проблема в тонких или сгенерированных страницах — показывают, что удалили, объединили или переписали. Если взлом — описывают, как закрыли доступ и почистили код. После отправки ждут решения и не путают паузу с игнором: пересмотр занимает время. Пока ответ не пришел, новый сомнительный эксперимент только усложняет историю."
        }
      ]
    },
    {
      id: "types-and-scope",
      title: "How to read the type and the scope of a manual action before you write anything to Google",
      tocLabel: "Types and scope of the action",
      blocks: [
        {
          type: "p",
          text: "The first useful split is scope. Some manual actions apply to the entire site, others only to a section, a set of URLs or a specific issue like a spammy structured-data pattern. The report in Search Console is the source of truth for that scope. Guessing from a traffic graph wastes time. A site can lose visibility for many algorithmic reasons without any manual action at all; conversely, a clean-looking analytics chart does not prove the report is empty. Open the report first."
        },
        {
          type: "p",
          text: "The second split is the type of violation. Unnatural links, thin or scraped content, cloaking, hidden text, sneaky redirects, user-generated spam, hacked pages and structured data problems require different cleanups. A store that got flagged for doorway-like filtered URLs should not send a reconsideration text about backlinks. A site with a surge of spam comments should not start by rewriting its product descriptions. The report already tells you the family of the issue; the work is to map it to real pages, accounts, templates or links."
        },
        {
          type: "p",
          text: "When the report opens, write down the date, the type, the scope and the examples you can find. Then build a cleanup list. Only after that list is executed does a reconsideration request have substance. Google reviewers are not looking for emotional language. They are looking for a credible description of what was wrong and what was changed. If you cannot describe the change in concrete terms, you are not ready to submit."
        }
      ]
    },
    {
      id: "posle-odobreniya-ili-otkaza",
      title: "Что делать после одобрения или отказа в пересмотре",
      tocLabel: "После ответа Google",
      blocks: [
        {
          type: "p",
          text: "Если пересмотр одобрили, это не конец работы, а конец текущего эпизода. Имеет смысл оставить контроль: кто следит за отчетом, как не вернуть ту же схему, какие шаблоны и ссылочные практики больше нельзя использовать. Если в пересмотре отказали, не отправляют тот же текст на следующий день. Читают, чего не хватило, доделывают фактическую очистку и только потом пишут новый запрос. Повтор без новых действий почти никогда не помогает."
        },
        {
          type: "p",
          text: "Для команды полезно сохранять досье: скрины отчета, список URL, что именно исправили, кем согласовано, когда отправлен запрос, какой был ответ. Это пригодится и при следующем инциденте, и при разговоре с заказчиком, который видит только график трафика. Manual action — редкая, но тяжелая история, и её лучше вести как инцидент с документами, а не как переписку «попробуйте еще раз»."
        }
      ]
    },
    {
      id: "typy-narusheniy",
      title: "Как различаются типичные ручные меры и какой у каждой из них фокус очистки",
      tocLabel: "Типы нарушений",
      blocks: [
        {
          type: "p",
          text: "Неестественные ссылки на сайт обычно требуют разбора доноров, снятия того, что можно снять, файла отказа от ссылок там, где это уместно, и честного описания, как такая практика появилась и чем её заменили. Неестественные ссылки с вашего сайта — другая история: чистят исходящие простановки, продажные блоки, шаблоны, которые автоматически ставят служебные ссылки. Путать эти два отчета нельзя: запрос на пересмотр должен попадать в тот тип, который указан в кабинете."
        },
        {
          type: "p",
          text: "Тонкий или скопированный контент чистят иначе. Страницы с малой ценностью объединяют, закрывают от индекса или переписывают так, чтобы у каждой был свой смысл. Дорвеи, подмены (cloaking), скрытый текст и хитрые редиректы — это уже не «немного переспама», а приемы, которые нужно полностью убрать из шаблона и из правил публикации. Пользовательский спам требует закрыть точку входа: комментарии, профили, каталоги, которые принимают ссылки без модерации. Взлом — отдельный инцидент безопасности: сначала доступ и вреносный код, потом уже пересмотр."
        },
        {
          type: "p",
          text: "Злоупотребление разметкой и другие точечные типы тоже не лечатся общим текстом «мы исправились». Нужно показать, какой шаблон давал ложные отзывы, ложные цены или чужие факты, и что именно в коде после этого изменилось. Чем точнее карта нарушения, тем короче и сильнее запрос на пересмотр. Если команда не может объяснить тип своими словами, она, скорее всего, еще не закончила разбор."
        }
      ]
    },
    {
      id: "poshagovyy-perechen",
      title: "Какой пошаговый перечень работ обычно стоит пройти до отправки запроса",
      tocLabel: "Пошаговый перечень",
      blocks: [
        {
          type: "p",
          text: "Практичный перечень выглядит так. Открыть отчет и сохранить его состояние. Определить границы: весь сайт, раздел, конкретные URL. Собрать примеры. Назначить ответственного и срок. Исправить причину, а не только видимый симптом. Проверить, что исправление попало в код и в индексную версию страницы, а не только в черновик CMS. Подготовить краткое описание на языке фактов. Отправить запрос один раз и ждать. Не запускать параллельно новую серую схему."
        },
        {
          type: "p",
          text: "Этот перечень кажется бюрократией, но именно он отличает серьезную очистку от письма «пожалуйста, верните позиции». Google в англоязычных материалах прямо просит исправить проблему до request a review. Если отправить форму слишком рано, можно получить отказ и потерять время. Если ждать слишком долго, не делая ничего, проблема просто продолжает действовать. Баланс здесь простой: сначала работа, потом запрос, потом ожидание, потом уже выводы по трафику."
        },
        {
          type: "p",
          text: "Команде полезно заранее знать, кто имеет доступ к Search Console, кто может менять шаблоны и кто разговаривает с подрядчиками по ссылкам или контенту. Иначе разбор растягивается, потому что факты расползлись по людям. Manual action — это не только SEO-задача, это еще и процесс: доступы, ответственность, документация. Когда процесс собран, следующий инцидент, если он вообще случится, проходит спокойнее."
        }
      ]
    },
    {
      id: "english-cleanup-guide",
      title: "How to investigate, fix and document a manual action in English-language terms",
      tocLabel: "Cleanup guide in English",
      blocks: [
        {
          type: "p",
          text: "If the Manual Actions report in Google Search Console is not clear, start by reading it carefully. This is a policy issue, not a guess about a core update. The report tells you whether the problem is site-wide or limited to some pages, and which type of violation was found. Use that scope to select the right cleanup. A store, a news section, a user forum or a set of landing pages may be the only target. Do not perform a random rewrite of the whole site if the report opens on a narrower issue."
        },
        {
          type: "p",
          text: "Content problems and link problems need different work. If the issue is thin, scraped or doorway-like pages, the expected fix is to improve, merge, noindex or remove those URLs so that little-value pages no longer try to rank. If the issue is unnatural links, record the referring domains, remove what you can, and disclose in the review request what you changed. Editorial judgment matters here: a retailer should not keep sales pages that exist only to pass PageRank, and a publisher should not keep a marked-up block that displays fake reviews. The policy is about what the pages are, not about how polished the reconsideration letter sounds."
        },
        {
          type: "p",
          text: "Teams should also understand what a review can and cannot do. Google does not welcome a request that is sent before the work is done. Try to test the fixed templates, visit the live URLs, and think through how the same problem would be prevented next year. Support documentation describes the same sequence: fix first, then request a review, then wait. If the request does not pass, do not employ the same text again. Deliver a clearer record of the cleanup. Growth will not come from a second form submission; it will come from pages and links that no longer violate the policy."
        },
        {
          type: "p",
          text: "Features of a good internal case file are ordinary. Date the report, list example URLs, name the owner, keep a changelog, and note when the request was sent. Countries and languages do not change the principle, but they may change who has to fix the template. A site that operates in several markets should still use one source of truth in Search Console. The more concrete the file, the easier it is to explain the case to a reviewer and to the business."
        },
        {
          type: "p",
          text: "User-generated spam, hacked pages and sneaky redirects are easy to under-estimate. A forum that was left without moderation can grow a thick layer of spam links. A compromised account can place hidden content on otherwise clean pages. A redirect that was meant to be temporary can start to drive people to a different destination than the one search systems were shown. In all of these cases the fix has to happen in the system, not only on a few example URLs. Once the system is clean, the reconsideration request can describe that system change in plain language."
        },
        {
          type: "p",
          text: "A reconsideration request should read like a factual report. Say what the Manual Actions report showed, what pages or links were involved, what you changed, how you checked the live site, and how you will keep the same issue from coming back. Do not try to win the case with adjectives. Reviewers have seen every version of “this was an old vendor, we understand now.” What helps is a record: URLs, dates, the policy type, and the fix. If a retailer or publisher used a feature that created doorway-like pages, describe that feature and how it was turned off."
        },
        {
          type: "p",
          text: "It also helps to think about users, not only about Search. Thin pages, hidden text, spam comments and misleading redirects are bad for people even when no manual action has been raised. Use the incident to raise the internal bar. Place responsibility with the team that can actually change the template or the link process. Perform a later test to make sure the fix is still in production. Mark the case closed only when the report is clear and the same pattern is no longer available as a shortcut."
        },
        {
          type: "p",
          text: "Some sites never receive a manual action and still worry about every dip in growth. That anxiety is understandable, but it is not a diagnosis. Open the report. If it is empty, look at algorithmic changes, demand, seasonality, technical errors and content quality. If it is not empty, do the cleanup first. The expected order does not change from year to year: discover, fix, document, request, wait, then review the outcome. Support articles describe the same path, and it is still the one that works."
        }
      ]
    },
    {
      id: "english-questions",
      title: "Questions teams usually ask once a manual action is already on the report",
      tocLabel: "Common questions",
      blocks: [
        {
          type: "p",
          text: "A first warning from Search Console should change the plan for the week, even if traffic has not yet dropped at the same rate. The report is already a strong signal. It does not talk in the style of a marketing award, and it does not allow a team to wait and see whether the problem “goes away.” If the status continues after a weak request, the request was probably rejected because the cleanup was incomplete, not because the form was in the wrong language."
        },
        {
          type: "p",
          text: "Teams often ask whether they can still promote the brand, run shopping campaigns or keep selling while the cleanup is running. Paid channels are a separate system, but putting more pressure on a broken organic landing is rarely a good idea. If the same pages are serving a policy problem, fix those pages first. A sample of URLs is not enough when the pattern has already scaled across a template. Watch the live pages, view the rendered source, and reduce any leftover trick that still presents one version to users and another to Search."
        },
        {
          type: "p",
          text: "Studies and official reference materials describe the same end state: the site stands on content it actually developed, not on a repeated shortcut. Share the findings with the people who can change the template. Today’s patch should still be there after the next set of releases. If a later return of the same issue appears, it usually reflects a process gap: someone was again allowed to ship doorway-like landing pages, comment spam or a selling widget that hides links. Reach that process, not only the last URL on the list."
        },
        {
          type: "p",
          text: "Click-through and positions can rise again after a successful review, but that is not a promise with a date. The present job is to make the site policy-clean. States and countries do not change that job, only who has to sign off on the fix. Talk about it in operational language: what was found, what was changed, who owns the check, and when you will look again. That is enough power for a serious reconsideration request; adjectives will not add more."
        }
      ]
    },
    {
      id: "english-follow-through",
      title: "How to follow through after a review is submitted or after the report is already clear",
      tocLabel: "Follow-through after the review",
      blocks: [
        {
          type: "p",
          text: "After a reconsideration request is submitted, the useful work is patience plus monitoring, not a second letter the next day. Search reviewers need time, and repeated clicks on the same unfinished case do not help. Use that interval to watch the cleaned pages, confirm that the template still stands, and reduce any leftover shortcut that might grow back. If the request is later rejected, the next version should present new facts, not a louder tone."
        },
        {
          type: "p",
          text: "If the report later becomes clear, do not treat that as permission to return to the old growth tactics. The policy did not change. A brand that has already been through a manual action should keep the same controls: who can publish landing pages, who can place links, who can open a store campaign that generates thin URLs. Features that once created the problem should stay off or be redesigned. Record the outcome, share the lesson, and keep the case file. That is how a site stays out of the same report next year."
        },
        {
          type: "p",
          text: "Teams sometimes want a target date for the return of positions. There is no honest one. Traffic can recover after a successful review, or it can stay muted because demand, competitors and content quality have also changed. The expected promise is narrower: the manual action itself is addressed, and the site no longer operates the same violation. Everything else is ordinary SEO and product work. Allow that distinction in conversations with stakeholders; it prevents a second round of magical thinking."
        }
      ]
    },
    {
      id: "english-policy-and-evidence",
      title: "How to read the policy, collect evidence, and keep the case file usable",
      tocLabel: "Policy, evidence, and the case file",
      blocks: [
        {
          type: "p",
          text: "A manual action is easier to handle when the team treats it as a documented case, not as a sudden emergency with no paper trail. Start with the report itself. Identify the policy that was named, the section of the site that was detected, and the examples Google already displayed. Then take the time to compare those examples with the live website. The goal is not to argue tone. The goal is to know, in writing, what was considered a violation and what evidence you can show after the cleanup."
        },
        {
          type: "p",
          text: "The case file should contain more than a screenshot of the report. Keep the original notice, the date it appeared, the URLs or patterns involved, the people responsible, and the changes that were later made. If affiliate pages, doorway templates, copied text, or other shortcut tactics were involved, disclose that internally and record how they were closed. Editorial owners should be named. Tools used for the cleanup should be listed. This is not bureaucracy for its own sake. When a review is later submitted, a complete file helps the team write a factual request instead of a vague promise."
        },
        {
          type: "p",
          text: "Third-party platforms can complicate the picture. A landing service, a store app, a partner feed, or a campaign tool may have generated the thin URLs even if the main website looks clean. The review still lands on the site owner. That is why the investigation has to include those tools and partners, not only the pages the content team edits by hand. If a vendor continues to create the same pattern after the first cleanup, the problem is not solved. Select another process, close the feed, or change the vendor before you ask for a review."
        }
      ]
    },
    {
      id: "english-aftercare-and-governance",
      title: "What governance should remain after the report is cleared so the same issue does not return",
      tocLabel: "Aftercare and governance",
      blocks: [
        {
          type: "p",
          text: "Once a request is in progress, the useful work is to keep the cleaned experience stable. Visit the previously affected sections. Learn whether a template has drifted. Check whether a new campaign has started to display the same thin pages. Little regressions are easier to fix early than after another report. Let the team know that “the request was submitted” is not the end of the work. The end is a site that no longer employs the same shortcut."
        },
        {
          type: "p",
          text: "Guidelines and official documentation should stay in the operating process, not in a one-off training slide. Editors, SEO specialists, affiliates, and paid-media owners all need a short guide to what is required before a new URL pattern goes live. Customers should not have to discover a doorway page, a copied article, or a misleading offer. If the company wants traffic growth, it should drive that growth through pages that deliver a real service, product, or explanation. High-pressure sales tactics that depend on low-quality URL sets are usually how the same report returns."
        },
        {
          type: "p",
          text: "There is also no honest award for a fast recovery of rankings. Traffic may increase after a successful review, or it may stay muted because competitors, demand, and the site’s own quality have changed. What the review can do is remove the manual restriction. What it cannot do is guarantee a previous position, a previous number of visits, or a previous lead volume. Stakeholders deserve that distinction. A clear purpose of the cleanup is to restore policy compliance and a trustworthy website, not to promise a date when the graph goes back up."
        },
        {
          type: "p",
          text: "Over later months, keep a light but regular check. Read new guidelines when they are updated. Identify any leftover pattern that looks close to the old issue. Ensure that access to publishing tools stays limited, and that both organic and paid teams understand why some old tactics are no longer allowed. If a warning later appears again, the same case-file habit will save time. The site will already know how to investigate, how to clean, and how to submit a factual request. That is the real aftercare of a manual action: not a one-time fix, but a way of working that continues after the report itself is gone."
        }
      ]
    },
    {
      id: "english-density-operations",
      title: "How a cleanup actually proceeds when the report is already specific",
      tocLabel: "How the cleanup proceeds",
      blocks: [
        {
          type: "p",
          text: "When the report is already specific, the cleanup should follow clear steps rather than a general burst of editing. Take the examples Google displayed and view each live URL. Make sure the same pattern is not still serving visitors somewhere else in the site. If similar templates were added by a campaign, a feed, or a development partner, close those sources too. Such work is slower than rewriting one page, and that is exactly why it is more reliable."
        },
        {
          type: "p",
          text: "A strong case file helps here. It should provide the original report, the reason it appeared, the pages or directories involved, and the actions later taken. Reference the policy in plain language, not as a slogan. If malicious or scaled URL generation was involved, say so internally and record the removal. If the issue was copied text, thin local landing pages, or misleading advertising, document the cleanup in the same way. The review request will later need this level of detail. A vague overview is not enough."
        },
        {
          type: "p",
          text: "Studies of past cases, internal postmortems, and official resources all point to the same practical style: clean first, then request a review. Do not put a request at the top of the list while the pattern still exists. Today that sounds obvious, and yet teams still try it when traffic is losing ground. The better path is to take the time required, fix the website, and only then submit. Results may still take time to appear. That delay is not a trick, and it is not a signal to send a second message the next day."
        }
      ]
    },
    {
      id: "english-what-to-watch",
      title: "What to watch after the request so the same pattern does not rise again",
      tocLabel: "What to watch after the request",
      blocks: [
        {
          type: "p",
          text: "After the request is submitted, keep watching the cleaned sections. A template can drift. A new shopping campaign can publish thin pages. A partner network can recreate the old sample URLs. Little signs matter: a sudden rise in low-quality paths, a leftover tag pattern, a landing style that reflects the old shortcut. If these signs appear, fix them at once. The fact that a review is already in progress does not make the new pages safe."
        },
        {
          type: "p",
          text: "The operating rule should stay simple. The site must not employ the same policy violation, even in a “smaller” form. Editors, affiliates, and paid teams should receive the same guide. Access to publishing tools should stay limited. Key decisions about new URL sets should go through a short review, not through an informal chat. Trust is rebuilt this way: not by promising a date when the graph recovers, but by making sure the website continues to provide a genuine service, product, or explanation."
        },
        {
          type: "p",
          text: "There is no award for speed here, and no reliable way to win back every previous visit. What you can do is keep the cleanup complete, keep the record clear, and keep the same safeguards in place months later. If official releases later change a guideline, read them and adjust. If a similar issue is later detected, the team will already know how to investigate. That is the real measure of recovery after a manual action: not a single successful request, but a way of working that does not recreate the problem."
        }
      ]
    },
    {
      id: "english-operating-notes",
      title: "Operating notes that help a team avoid shortcuts after a manual action",
      tocLabel: "Operating notes",
      blocks: [
        {
          type: "p",
          text: "A manual action is easier to keep closed when the team has a short operating plan, not just a one-time cleanup. The plan should address how new pages are developed, how keyword targeting is chosen, and how the site will reach customers without falling back to the same shortcut. High-pressure tactics that try to manipulate search, stuff keywords, or promote thin posts can look fast. They are also how the same warning returns."
        },
        {
          type: "p",
          text: "Part of that plan is information hygiene. Collect the original report, the notes from the cleanup, and the examples Google mentioned. Give editors a short briefing they can actually read. Ensure that new landing pages, store campaigns, and third-party feeds cannot quietly get added to the site without a review. If a blog, a sales offer, or a local store page is later considered risky, block or fix it before it is scaled. This is ordinary support work, not a special project."
        },
        {
          type: "p",
          text: "The same notes should improve day-to-day practices. Do not build URL sets just to increase coverage of a keyword list. Do not publish posts whose only value is to rank. Do not buy or trade backlinks as a way to repair a report. If a page cannot give a person a real answer, product, or service, it should not go live. Test the templates. Select the pages that stay. Target only the queries the site can honestly serve. Read the results later and adjust the plan if a new pattern starts to appear."
        },
        {
          type: "p",
          text: "Teams sometimes want a rate of recovery or the fastest path back to previous traffic. There is no honest version of that promise. What you can do is keep the cleanup complete, keep the record available, and keep the same rules in power after the request is submitted. If traffic later improves, that is welcome. If it does not, the site is still in a better place than when the report first appeared: the policy issue has been addressed, and the team knows how to avoid the same class of problem."
        }
      ]
    },
    {
      id: "english-small-safeguards",
      title: "Small safeguards that keep a cleaned site from sliding back into the same query tricks",
      tocLabel: "Small safeguards",
      blocks: [
        {
          type: "p",
          text: "After a cleanup, small safeguards matter more than a new announcement. The main purpose is simple: the site should no longer contain the same pattern, and new pages should not be added just to answer a keyword query. If a template, a feed, or an advertising campaign starts to look thin, stop it early. It is more work in the moment and more protection later."
        },
        {
          type: "p",
          text: "A short monitoring habit helps more than a one-off audit. Someone should watch new URL sets, snippet text, and internal search reports. If a page is called useful but cannot deliver a real answer, it should not stay. Editorial and development owners need a way to contact each other quickly when a risky pattern appears. Security, access control, and removal of leftover doorway paths belong in the same routine. The company does not need a large new platform for this. It needs a clear level of care and a way to recover quickly if a small issue returns."
        },
        {
          type: "p",
          text: "More generally, do not treat recovery as a race. More traffic may come later, or it may not. What matters more is that the website keeps its cleanup, answers real questions, and does not go back to keyword stuffing or other shortcuts that already caused a report. That is more sustainable than any promise of a fast rebound."
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
