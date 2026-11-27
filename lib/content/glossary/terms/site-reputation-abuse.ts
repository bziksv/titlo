import type { GlossaryTerm } from "../types";

/**
 * Бриф: кабинет #305 «Site Reputation Abuse».
 * Google MSK TOP-20, history 103982, запрос «site reputation abuse», 19.11.2026.
 */
export const SiteReputationAbuse: GlossaryTerm = {
  slug: "site-reputation-abuse",
  term: "Site Reputation Abuse",
  aliases: [
    "site reputation abuse",
    "злоупотребление репутацией сайта",
    "паразитное seo",
    "site reputation abuse policy"
  ],
  categoryId: "algoritmy-i-apdeyty-google",
  h1: "Site Reputation Abuse: что такое злоупотребление репутацией сайта",
  seoTitle: "Site Reputation Abuse в Google: что это, чем грозит и как не путать с обычным партнёрским разделом",
  seoDescription: "Site Reputation Abuse — политика Google против размещения стороннего контента, который паразитирует на репутации домена. Чем это отличается от нормальных подразделов и как связаны ручные меры.",
  short: "Site Reputation Abuse — это политика Google против злоупотребления репутацией сайта: когда на авторитетном домене публикуют сторонний или малосвязанный контент, чтобы он лучше ранжировался за чужой счёт. Речь не о любом партнёрском материале, а о схемах, где third party content пользуется доверием основного сайта и при этом слабо связан с его основной деятельностью. Такие случаи Google относит к spam policies и может ограничивать в search results, иногда через [ручную меру](/slovar/manual-action/).",
  definition: "Site Reputation Abuse (злоупотребление репутацией сайта, в русскоязычной практике иногда говорят о паразитном SEO на чужом домене) — использование репутации известного сайта для продвижения чужого или малосвязанного контента в поиске. Политика касается ситуаций, когда сторонние материалы размещают главным образом ради search rankings, а не потому, что они естественно продолжают тему и сервис хозяина домена.",
  sections: [
    {
      id: "chto-takoe",
      title: "Что такое Site Reputation Abuse",
      tocLabel: "Определение",
      blocks: [
        {
          type: "p",
          text: "Смысл политики прямолинейный. Есть сайт, которому пользователи и поиск уже доверяют. Если на нём появляются разделы с чужим контентом — купоны, отзывы, кредиты, «рекомендации», партнёрские витрины, — которые почти не связаны с основной деятельностью, Google может расценить это как попытку manipulate search. Сторонний контент как бы занимает место в search results под репутацией хозяина домена."
        },
        {
          type: "p",
          text: "В Wordstat за период 23.10–21.11.2026 «паразитное seo» даёт 49 обращений, а английские формулировки «site reputation abuse» и «site reputation abuse google» в выбранном срезе оказались пустыми. Русскоязычное «паразитное SEO» шире и не всегда совпадает с конкретной политикой Google, но часто описывает ту же идею: рост за счёт чужого авторитета."
        }
      ]
    },
    {
      id: "chem-ne-yavlyaetsya",
      title: "Чем это не является",
      tocLabel: "Чем не является",
      blocks: [
        {
          type: "p",
          text: "Не любой гостевой материал, обзор партнёра или подраздел с экспертной колонкой автоматически нарушает политику. Важны цель, связь с основным сайтом и то, кто реально контролирует содержание. Если раздел естественно продолжает тему издания или сервиса, его редактирует хозяин сайта и он полезен той же аудитории, это другая ситуация, чем аренда «подпоиска» под чужие коммерческие витрины."
        },
        {
          type: "p",
          text: "Политику не стоит путать и с обычным [Core Update](/slovar/core-update/), и с системой полезного контента. Там речь о широкой оценке качества. Здесь — о конкретной схеме злоупотребления репутацией домена. Low quality content может соседствовать с проблемой, но сам по себе тонкий текст ещё не равен Site Reputation Abuse."
        }
      ]
    },
    {
      id: "kak-proyavlyaetsya",
      title: "Как это обычно выглядит и чем грозит",
      tocLabel: "Как проявляется",
      blocks: [
        {
          type: "p",
          text: "Типичный рисунок такой: на известном домене появляется раздел, который пишет или поставляет third party, а ранжироваться он хочет по коммерческим search queries, далёким от основного сайта. Иногда это оформляют как «партнёрский журнал», «каталог услуг» или поддомен с чужой редакцией. Site owners при этом формально остаются владельцами домена, на который смотрит пользователь."
        },
        {
          type: "p",
          text: "Google может ограничить такие страницы в выдаче и, в части случаев, применить manual action. Тогда в Search Console появляется запись, и дальше работают уже по сценарию ручной меры: убрать или жёстко отделить нарушающий контент, затем запросить пересмотр. Снятие меры не обещает прежние позиции, оно только убирает ручное ограничение."
        },
        {
          type: "flow",
          caption: "Как обычно проверяют, нет ли злоупотребления репутацией на своём домене",
          steps: [
            {
              label: "Смотрят, какие разделы реально принадлежат основной теме сайта",
              note: "нет ли чужих витрин «под ключ»"
            },
            {
              label: "Проверяют, кто пишет и публикует материалы",
              note: "редакция хозяина или третья сторона без контроля"
            },
            {
              label: "Сверяют поисковые запросы этих URL",
              note: "не ранжируются ли они по далёким коммерческим темам"
            },
            {
              label: "Оценивают пользу для своей аудитории",
              note: "нужен ли раздел читателю основного сайта"
            },
            {
              label: "Если схема есть, убирают или изолируют её",
              note: "не ждут, что «само рассосётся»"
            }
          ]
        },
        {
          type: "table",
          caption: "Как отличить политику от соседних ситуаций",
          head: [],
          rows: [
            [
              "Ситуация",
              "В чём суть",
              "Типичный признак",
              "Что делать"
            ],
            [
              "Site Reputation Abuse",
              "чужой или малосвязанный контент паразитирует на репутации домена",
              "сторонние витрины на авторитетном сайте ради выдачи",
              "убрать или жёстко отделить раздел, вернуть контроль"
            ],
            [
              "Обычный партнёрский материал",
              "связан с темой сайта и контролируется редакцией",
              "полезен той же аудитории, не маскируется",
              "держать прозрачность и качество"
            ],
            [
              "Manual Action вообще",
              "ручная мера за разные нарушения spam policies",
              "есть запись в Search Console",
              "читать тип меры, а не только общее имя политики"
            ],
            [
              "Серое SEO на своих сайтах",
              "собственные схемы накрутки и маскировки",
              "нет «аренды» чужого домена",
              "разбирать свои методы отдельно"
            ],
            [
              "Тонкий контент без стороннего раздела",
              "слабые свои материалы",
              "нет чужой витрины",
              "улучшать свои URL, это другая задача"
            ]
          ],
          textOnly: true,
          note: "Сначала смотрят, чей это контент и зачем он стоит на домене, потом уже вешают ярлык."
        }
      ]
    },
    {
      id: "chto-delat",
      title: "Что делать владельцу сайта",
      tocLabel: "Что делать",
      blocks: [
        {
          type: "p",
          text: "Если раздел ваш и он ушёл слишком далеко от темы, его перерабатывают или закрывают от поиска, пока не решат судьбу. Если контент поставляет третья сторона, пересматривают договор, модерацию и то, должны ли эти URL вообще жить на основном домене. Лучшие practices здесь простые: хозяин сайта отвечает за то, что видят users на его имени."
        },
        {
          type: "p",
          text: "Не стоит прятать старые витрины редиректом «на всякий случай» или переносить ту же схему на соседний поддомен без изменения сути. Нужно убрать сам паттерн злоупотребления. После этого, если уже есть ручная мера, готовят reconsideration request по фактам."
        }
      ]
    },
    {
      id: "eea-izmeneniya",
      title: "Что изменилось в политике для Европейской экономической зоны",
      tocLabel: "Изменения для EEA",
      blocks: [
        {
          type: "p",
          text: "В ноябре 2025 года Европейская комиссия открыла разбирательство по Digital Markets Act. По данным комиссии, Google на основании этой политики понижал в выдаче сайты новостных медиа и других издателей, если на них есть контент коммерческих партнёров, а для издателей это распространённый и законный способ монетизации. Комиссия проверяла, соблюдает ли Google требование справедливых, разумных и недискриминационных условий доступа к поиску."
        },
        {
          type: "p",
          text: "28 августа 2026 года Google объявил в блоге Search Central об изменении подхода в EEA, то есть в Европейской экономической зоне. С 30 августа ручные меры по этой политике действуют по-разному в зависимости от того, где находится пользователь. Вне EEA ручная мера, как и раньше, напрямую влияет на выдачу для затронутой части сайта, а остальной сайт не страдает. Для пользователей внутри EEA эффект ручной меры не применяется: затронутый раздел может быть отделён в системах Google от основного домена и со временем ранжироваться самостоятельно, на собственных сигналах."
        },
        {
          type: "p",
          text: "Одновременно в документации политику переименовали: теперь раздел в spam policies называется site reputation policy, хотя в отрасли по-прежнему чаще говорят site reputation abuse. Уведомления о ручной мере, как и раньше, приходят в Search Console, а после запроса на повторную проверку подходящие под условия сайты получили возможность передать спор на медиацию. Для русскоязычного владельца сайта это значит простую вещь: аудитория из России находится вне EEA, поэтому для неё ручная мера по-прежнему работает в полном объёме."
        },
        {
          type: "table",
          caption: "Как ручная мера по site reputation policy действует в зависимости от региона пользователя",
          head: ["Ситуация", "Вне EEA", "Внутри EEA"],
          rows: [
            ["Раздел признан нарушающим политику", "Ручная мера понижает или убирает затронутые страницы из выдачи", "Ручная мера не применяется к выдаче, раздел отделяется от основного домена"],
            ["Остальная часть сайта", "Не затрагивается", "Не затрагивается"],
            ["Как ранжируется сторонний раздел", "Под действием ручной меры", "Самостоятельно, против контента того же типа"],
            ["Уведомление владельцу", "Отчёт о ручных мерах и сообщения в Search Console", "Отчёт о ручных мерах и сообщения в Search Console"],
            ["Как оспорить", "Запрос на повторную проверку", "Запрос на повторную проверку, затем медиация для подходящих сайтов"]
          ],
          textOnly: true
        }
      ]
    },
    {
      id: "kriterii-proverki",
      title: "По каким признакам Google оценивает сторонний раздел при ручной проверке",
      tocLabel: "Критерии ручной проверки",
      blocks: [
        {
          type: "p",
          text: "В обновлённой документации Google подробнее описал, что смотрит человек при ручной проверке. Общая цель — понять, создан ли контент раздела с достаточным участием, редакционным контролем или вкладом хоста, чтобы считать его полностью интегрированным в основной сайт. Проверка применяется глобально, а не только в EEA, и опирается на несколько объективных факторов."
        },
        {
          type: "ul",
          style: "check",
          items: [
            "Оформление: совпадают ли дизайн, вёрстка, типографика и элементы интерфейса раздела с основным доменом.",
            "Качество: нет ли на страницах проблем, которых нет на основном сайте и которые говорят об отходе от его стандарта.",
            "Авторство: указан ли автор или ответственный редактор, есть ли явное признание ответственности за контент и нет ли признаков, что заявленное авторство не соответствует действительности.",
            "Дублирование: не публикуется ли тот же или почти тот же текст на множестве других сайтов."
          ]
        },
        {
          type: "p",
          text: "Google отдельно подчёркивает, что ни один из этих признаков сам по себе не является ни необходимым, ни достаточным. В конкретной ситуации одни факторы важнее других, а иногда учитываются и иные доказательства, например если страницы оказываются частью стороннего маркетингового материала для манипуляции ранжированием. Сама по себе публикация чужого контента не нарушает политику: нарушение есть, только если контент размещён главным образом ради уже накопленных сигналов ранжирования хоста."
        },
        {
          type: "p",
          text: "В документации разобраны три примера. Раздел купонов, сделанный вместе с партнёром на отдельной CMS, но встроенный в главную страницу и навигацию, с раскрытием коммерческого характера и указанием ответственной редакции, скорее всего не получит меру. Статья без автора и ответственного редактора со ссылками на маркетплейс CBD-масел на сайте делового издания, недоступная из тематических разделов и скопированная с сайта продавца, скорее всего получит меру для выдачи вне EEA. Кулинарный раздел новостного сайта с партнёрскими ссылками, который ведёт фрилансер под своим именем при видимом редакционном контроле издания, скорее всего тоже не получит меру."
        }
      ]
    },
    {
      id: "english-policy-wording",
      title: "How the current site reputation policy wording reads in English",
      tocLabel: "Current English wording",
      blocks: [
        {
          type: "p",
          text: "The current text in Google Search Central says that the site reputation policy applies where third-party content is published on a host site mainly because of that host's already-established ranking signals, which it has earned primarily from its first-party content. The goal of this tactic is for the content to rank better than it could otherwise on its own. Third-party content is defined as content created by an entity separate from the host site, for example users of that site, freelancers, white-label services and people not employed directly by the host."
        },
        {
          type: "p",
          text: "The policy lists examples that are not considered inconsistent with it: wire service or press release sites, news publications that syndicate news content from other publications, sites designed for user-generated content such as forums or comment sections, columns, opinion pieces and other editorial work, advertorial or native advertising pages whose purpose is to share content directly with readers rather than to manipulate search rankings, and affiliate links or third-party ad units placed throughout a page when the links are treated appropriately. Google adds that these examples are non-exhaustive."
        },
        {
          type: "p",
          text: "Google also states that it generally applies a presumption that individual pages, including new pages, match the overall quality of other pages on the domain. If a portion of a site may be out of line with the policy, the site will be subject to human review. The review aims to understand the degree to which the host domain exercises control over the page content: how the content is presented, its quality compared with the main domain, its stated or implied authorship, and whether the same content appears on multiple other sites in identical or near-identical form."
        },
        {
          type: "p",
          text: "For site owners the practical takeaway has not changed. If a section exists mainly to borrow your domain's reputation, the safest options are to integrate it properly with clear editorial responsibility, move it to a separate domain or remove it from the index. Moving the same content to a new subdomain or subdirectory to keep violating the policy is treated as policy circumvention, which can lead to broader action against the site."
        }
      ]
    },
    {
      id: "english-timeline",
      title: "How the site reputation policy developed over the years",
      tocLabel: "Policy timeline",
      blocks: [
        {
          type: "p",
          text: "The problem the policy addresses is older than its name. In January 2014 Matt Cutts, who then led the webspam team at Google, wrote that guest blogging for SEO had become a spammy practice, and that placing articles on other sites mainly to get links was a risky tactic. Over the following years the same idea moved from links to whole sections: instead of buying a link, a third party rented space on a strong domain and published its own pages there, relying on the host's ranking signals to reach the top of search results."
        },
        {
          type: "p",
          text: "On March 5, 2024, together with the March 2024 core update, Google announced three new spam policies: scaled content abuse, expired domain abuse and site reputation abuse. For the last one Google gave site owners time to make changes and said enforcement would begin on May 5, 2024. In May 2024 the first manual actions under the policy were reported, mostly against coupon, review and affiliate sections on large media and business sites."
        },
        {
          type: "p",
          text: "On November 19, 2024, Google published a clarification on the Search Central blog. After reviewing cases, the company stated that using third-party content on a site in an attempt to exploit the site's ranking signals is a violation regardless of whether there is first-party involvement or oversight of that content. In other words, a white-label deal or a revenue share with the host does not by itself make such a section acceptable. What matters is why the content is hosted, not who technically publishes it."
        },
        {
          type: "p",
          text: "On November 13, 2025, the European Commission opened proceedings under the Digital Markets Act, based on indications that the policy was used to demote news media and other publishers when their websites include content from commercial partners. On August 28, 2026, Google announced the adjusted enforcement for the European Economic Area that took effect on August 30, and the documentation now uses the shorter name site reputation policy. Outside the EEA the effects of a manual action stay the same."
        },
        {
          type: "callout",
          variant: "important",
          text: "The policy has changed several times since 2024. Before you make decisions about a third-party section, check the current text of the spam policies and the latest notes on the Search Central blog rather than older articles and summaries."
        }
      ]
    },
    {
      id: "english-host-checklist",
      title: "What a host site can check before a human review",
      tocLabel: "Host checklist",
      blocks: [
        {
          type: "p",
          text: "Google does not publish a self-assessment form, but the factors in the policy give site owners a practical way to review their own sections. Start with a list of every directory and subdomain that contains third-party content: coupons and deals, product reviews, financial offers, sponsored articles, partner catalogs and any pages created by an outside agency. For each one, record who writes the content, who approves it, when it was created and how people reach it from the main navigation."
        },
        {
          type: "ul",
          items: [
            "Presentation: does the section use the same design, formatting and templates as the rest of the site, or does it look like a separate business placed on your domain?",
            "Quality: would your editors publish these pages under their own standards, or do they include thin text, copied details and outdated deals?",
            "Authorship: is there a named author or responsible editor, and can readers contact the publisher if an offer or a review is wrong?",
            "Duplication: do the same words and examples appear on many other sites, which suggests the text is distributed by a third party rather than written for your readers?",
            "Purpose: would the section still make sense for your audience if it brought no search traffic at all?"
          ]
        },
        {
          type: "p",
          text: "If the answers point to a section that exists mainly to target search queries outside your topic, it is better to fix the problem before a review than to wait for a manual action. Typical options include integrating the content with clear editorial responsibility and disclosure, moving it to a separate domain that builds its own reputation, or blocking it from search with noindex and removing it from sitemaps. Blocking in robots.txt alone is not a reliable solution, because Google may still show known URLs without reading the page."
        },
        {
          type: "p",
          text: "Keep notes on what was changed and when. If a manual action does arrive, the reconsideration request should explain which pages were removed, moved or reworked and what process now prevents similar sections from appearing again. A short, specific report with examples is more useful to the reviewer than general statements that the site follows the guidelines. It also helps to name one person on your team who owns third-party sections and follows policy updates. The main resources for current information are the spam policies page, the Manual actions report in Search Console and the Search Central blog, where Google posts updates about the policy."
        }
      ]
    },
    {
      id: "smezhnye-pravila",
      title: "Чем эта политика отличается от соседних правил о спаме",
      tocLabel: "Соседние правила",
      blocks: [
        {
          type: "p",
          text: "В spam policies Google site reputation policy стоит рядом с несколькими правилами, которые легко перепутать. Scaled content abuse описывает массовое создание страниц главным образом ради манипуляции ранжированием, когда контент неоригинален и почти не несёт пользы, причём неважно, как он сделан: вручную, генеративными инструментами или автоматической переработкой чужих материалов. Expired domain abuse — покупка истёкшего домена, чтобы разместить на нём малополезный контент и воспользоваться прежней историей; подробнее об этом в статье про [дроп-домен](/slovar/drop-domen/)."
        },
        {
          type: "p",
          text: "Разница в том, чью репутацию используют. При злоупотреблении истёкшим доменом сайт целиком переходит к новому владельцу. При site reputation abuse хозяин домена остаётся прежним и продолжает публиковать свой основной контент, а сторонний раздел живёт рядом и опирается на сигналы, которые хост заработал своими материалами. Массовый контент может встречаться в обоих случаях, но сам по себе он описан отдельным правилом и наказывается независимо от того, чей это раздел."
        },
        {
          type: "p",
          text: "Отдельно в документации описан обход политик, policy circumvention. Если после ручной меры тот же контент переносят на новый поддомен, в другую папку или на соседний сайт, чтобы продолжать нарушение, Google может принять более широкие меры: убрать из выдачи больше разделов сайта или ограничить его участие в отдельных функциях поиска, например в Top Stories и Discover. Поэтому перенос чужой витрины на поддомен без изменения её сути не решает проблему, а только расширяет риск."
        },
        {
          type: "p",
          text: "Для практики полезно разводить эти ситуации ещё на этапе аудита. Если на сайте сотни однотипных страниц, сгенерированных под запросы, это вопрос масштабированного контента и качества. Если на сильном домене висит партнёрский раздел купонов или финансовых предложений без редакционного участия, это вопрос site reputation policy. Если домен недавно сменил владельца и тему, это ближе к истории с истёкшими доменами. От ответа зависит, какие страницы проверять первыми и что писать в запросе на повторную проверку."
        }
      ]
    },
    {
      id: "documentaciya-en",
      title: "How Google describes site reputation abuse in English",
      tocLabel: "Документация на английском",
      blocks: [
        {
          type: "p",
          text: "Google’s site reputation abuse policy targets third party content that is published on a reputable site primarily to manipulate search rankings. The concern is that users may trust the host domain, while the pages themselves have little to do with the site’s core purpose. Search results should not give a free pass to low quality or off-topic sections just because the domain is well known."
        },
        {
          type: "p",
          text: "Site owners are expected to take action when such sections appear. In some cases the pages may be subject to a manual action under spam policies. There is no special month-by-month dashboard just for this policy; the practical sources are Search Console, the official spam documentation and a review of your own web pages. Best practices are straightforward: keep editorial control, make sure third party content is genuinely part of the site, and do not rent your reputation to unrelated commercial landing pages."
        },
        {
          type: "p",
          text: "Crawling and indexing still matter for cleanup. After you remove or noindex the violating section, give Google time to recrawl the URLs and, if a manual action was applied, submit a reconsideration request with evidence. A core update or a helpful content discussion can overlap in time, but site reputation abuse is a specific policy about abusing a domain’s trust."
        }
      ]
    },
    {
      id: "primery-skhem",
      title: "Какие схемы чаще всего приводят к претензии",
      tocLabel: "Примеры схем",
      blocks: [
        {
          type: "p",
          text: "Частый рисунок — раздел с купонами, кредитами, «отзывами экспертов» или партнёрским каталогом услуг, который живёт на известном медиа или корпоративном домене, хотя основная редакция этим не занимается. Third party content при этом может быть provided внешней командой, а host website даёт только имя и позиции в поиске. Ещё один вариант — поддомен или «журнал», который формально ваш, а по факту сдан под чужие коммерческие landing pages."
        },
        {
          type: "p",
          text: "Affiliate-разделы сами по себе не запрещены, но становятся рискованными, когда их единственная задача — ranking по чужим запросам. Если users заходят на бренд СМИ, а попадают на витрину стороннего оффера, это плохой experience и хороший кандидат на проверку по политике. То же касается массовых posts и articles, которые не проходят вашу обычную редактуру."
        }
      ]
    },
    {
      id: "kak-smotret-console",
      title: "На что смотреть в Search Console и в индексе",
      tocLabel: "Search Console и индекс",
      blocks: [
        {
          type: "p",
          text: "Если уже пришло уведомление, читают тип меры и список URL, а не только общее имя политики. Затем сверяют, какие web pages с домена вообще показываются по неожиданным search queries. Иногда раздел живёт давно, и его просто не замечали, пока он не начал расти в выдаче. Report в консоли, карта сайта и проверка индексации помогают найти границы проблемы."
        },
        {
          type: "p",
          text: "После уборки дают время на crawling and indexing. Новые даты в документации, вроде обновлений политики в March или November, полезны как контекст, но решение принимают по своему домену, а не по календарю чужих рассылок. Если меры нет, это не повод оставлять сомнительный раздел «пока не пришло письмо»: лучше заранее вернуть редакционный контроль."
        },
        {
          type: "p",
          text: "English documentation stresses that site owners should not let third parties use a trusted domain to manipulate search. Help your reviewers see what changed: which sections were removed, which URLs were noindexed or deleted, and how editorial control works now. Tools and data in Search Console are enough to start. A blog post or a video recap of the policy will not replace a cleanup of the live pages. If other business units still want a partnership block, keep it on-topic, clearly labeled, and under your own editorial standards."
        },
        {
          type: "p",
          text: "If a partnership still makes sense, document who provides the content, how reviews are approved, and which services may appear under your brand. Show this process to your team so new sections do not quietly return. Changes in traffic or unexpected queries should trigger a review of the live pages, not only a new marketing idea."
        }
      ]
    },
    {
      id: "english-sra",
      title: "How Google describes site reputation abuse and why it matters to webmasters",
      tocLabel: "English-language notes",
      blocks: [
        {
          type: "p",
          text: "Site reputation abuse is Google’s name for a pattern where third-party content is published on an established site mainly to borrow that site’s ranking signals. The policy, introduced and then tightened in official Search spam documentation and blog posts, is aimed at arrangements where a subdomain, a section or a revived expired domain is used to host pages that have little to do with the site’s original purpose. Links and placements of that kind can look attractive to a partner, but they put the host’s reputation at risk."
        },
        {
          type: "p",
          text: "Google has said the policy does not ban all third-party content. Advertising, user-generated comments, affiliate content that is clearly labeled, and editorial partnerships can be legitimate when they serve the site’s audience. The problem starts when the host pages exist mainly to rank for queries that have nothing to do with the site, often in YMYL or commercial topics, and the visitor would not expect that content there. Introducing a “sponsored subdirectory” for loan offers or casino guides on a respected news domain is the classic example."
        },
        {
          type: "p",
          text: "Webmasters who want to stay on the safe side should review what is hosted on their domains, who can publish there, and whether a visitor can tell the difference between the site’s own work and a rented section. Get a clear inventory of subdomains and partnerships. If a section does not belong, remove or noindex it and be ready to explain the cleanup. More traffic from a rented cluster is not a good trade for a policy problem on the main site."
        }
      ]
    },
    {
      id: "kak-proveryat-svoi-domeny",
      title: "Как проверять свои домены, подразделы и партнерские витрины на этот риск",
      tocLabel: "Как проверять свои домены",
      blocks: [
        {
          type: "p",
          text: "Проверку начинают с инвентаря: какие поддомены, разделы и партнерские витрины живут на основном домене, кто ими управляет, о чем эти страницы, совпадает ли это с темой сайта. Если раздел можно снять, и аудитория сайта его не потеряет, это уже сигнал, что он живет ради чужой выдачи. Особенно рискованны темы, которые слабо связаны с основным брендом и появились пакетом «под ключ»."
        },
        {
          type: "p",
          text: "Практичные шаги скромные и жесткие. Закрепить, кто может заводить новые разделы. Смотреть, не сдают ли площадку третьим лицам под чужие коммерческие кластеры. Если такая схема уже была, ее сворачивают, страницы убирают или закрывают от индекса, а в comms и в кабинете вебмастера оставляют понятный след очистки. Репутация домена дороже, чем временный трафик с чужого кластера. Лучше отказаться от сомнительного партнерства заранее, чем потом объяснять, почему на уважаемом домене внезапно вырос чужой магазин."
        }
      ]
    },
    {
      id: "what-counts-and-what-does-not",
      title: "What usually counts as site reputation abuse and what usually does not",
      tocLabel: "What counts and what does not",
      blocks: [
        {
          type: "p",
          text: "Not every guest article, affiliate block or partner widget is site reputation abuse. Official materials draw a line around third-party content that exists mainly to rank because the host domain already has trust, especially when the topic is far from the host’s own purpose. A newsroom that publishes a clearly labeled affiliate box inside a relevant review is not the same thing as a respected university subdomain that suddenly hosts thousands of casino or loan pages written by an external team. The second pattern is what this policy is about."
        },
        {
          type: "p",
          text: "Webmasters should therefore ask a blunt question: if this section disappeared tomorrow, would our audience miss it as part of our service, or would only a partner miss the rankings? If the honest answer is the latter, the section is a risk. More traffic does not automatically justify it. Get legal, editorial and SEO people in the same conversation before a subdomain is rented out. Introducing this kind of partnership is easy; unwinding it after a policy hit is slower and more public."
        },
        {
          type: "p",
          text: "The same logic applies to expired domains that still carry an old reputation and are then filled with new commercial clusters. Buying a domain for its history and packing it with unrelated third-party pages is another way to borrow trust that does not belong to the new content. Search spam policies have been moving against that pattern. A safer path is to publish on a domain that actually represents the project, and to keep third-party material clearly limited, labeled and on-topic."
        }
      ]
    },
    {
      id: "kak-svorachivat-skhemu",
      title: "Как сворачивать уже запущенную чужую витрину на своем домене",
      tocLabel: "Как сворачивать схему",
      blocks: [
        {
          type: "p",
          text: "Если схема уже запущена, её сворачивают последовательно. Сначала останавливают новые публикации партнера, затем снимают или закрывают от индекса уже вышедшие страницы, убирают внутренние ссылки и рекламные входы, которые ведут в этот раздел как в «свой» контент. После этого проверяют, не остались ли зеркала, поддомены, лендинги на соседних URL и автоматические карты сайта, которые продолжают отдавать этот кластер в индекс."
        },
        {
          type: "p",
          text: "Документировать очистку стоит так же спокойно, как при ручном действии: что было, что убрали, кто подтвердил, когда раздел перестал быть доступен. Репутация основного сайта здесь главный актив. Лучше пережить временную потерю чужого трафика, чем держать на домене витрину, которая может задеть весь проект. На будущее в правилах площадки прямо фиксируют, какие партнерские форматы допустимы, а какие больше не запускают даже «на тест»."
        }
      ]
    },
    {
      id: "priznaki-riskovannogo-razdela",
      title: "Какие признаки обычно выдают рискованный чужой раздел на авторитетном домене",
      tocLabel: "Признаки рискованного раздела",
      blocks: [
        {
          type: "p",
          text: "Рискованный раздел часто выглядит чужеродно даже без анализа кода. Тема слабо связана с основным сайтом. Публикации появляются пакетами и похожи одна на другую. Авторы не из редакции площадки, а «партнерская команда». Внутренняя перелинковка ведет из сильных материалов сразу в коммерческие кластеры, которые аудитория сайта не ждала. В подвале или в меню этот раздел почти не объяснен, зато в поиске он уже собирает запросы из чужой ниши."
        },
        {
          type: "p",
          text: "Технические следы тоже бывают заметны: отдельный поддомен или глубокий каталог, своя CMS, свои шаблоны, своя карта сайта, иные метки аналитики, иные объявления. Это не доказательство нарушения само по себе, но повод задать вопрос, для кого этот раздел существует. Если ответ «для партнера и его выдачи», риск уже высокий. Если ответ «для нашей аудитории, это наш сервис», раздел должен так и выглядеть: стиль, авторство, польза, понятное место в навигации."
        },
        {
          type: "p",
          text: "Проверку стоит делать не только на основном домене, но и на старых зеркалах, региональных поддоменах и проектах, которые когда-то купили вместе с историей. Именно через такие активы чаще всего пытаются «привить» чужой кластер. Инвентаризация доменов и ответственных здесь важнее, чем еще одна общая статья про политику Google. Пока нет списка, нельзя честно сказать, что репутацию площадки никто не сдает в аренду."
        }
      ]
    },
    {
      id: "politika-i-komanda",
      title: "Как зафиксировать внутреннюю политику, чтобы такая схема не вернулась",
      tocLabel: "Политика и команда",
      blocks: [
        {
          type: "p",
          text: "Внутренняя политика должна быть короткой и жесткой. Кто может завести поддомен или раздел. Какие темы допустимы. Можно ли отдавать управление третьей стороне. Как маркируется партнерский материал. Кто раз в цикл проверяет, не появилось ли в индексе чужое. Если этого нет, даже после одной очистки схема может вернуться через «тест» отдела партнерств или через подрядчика, которому продали «витрину на вашем домене»."
        },
        {
          type: "p",
          text: "Редакция, юристы и SEO здесь должны говорить одним языком. Для редакции это вопрос доверия аудитории. Для юристов — вопрос, кто отвечает за чужой контент на вашем домене. Для SEO — вопрос политики поисковой системы и риска для всего сайта. Когда эти три взгляда собраны заранее, отказать сомнительному предложению гораздо проще, чем потом сворачивать уже приносящий трафик раздел. Репутация домена зарабатывается долго и тратится быстро; внутренняя политика как раз и нужна, чтобы её не сдать за чужие позиции."
        }
      ]
    },
    {
      id: "english-inventory",
      title: "How webmasters can inventory domains, sitemaps and third-party sections",
      tocLabel: "Inventory and sitemaps",
      blocks: [
        {
          type: "p",
          text: "A practical starting point for site reputation abuse is an inventory. List every host, subdomain and major directory that Search can see, including properties that only appear in sitemaps. Webmasters should know who publishes there, what the section is about, and whether the content is first-party. If a partner needs a place to build commercial pages, that place should usually be their own site, not a corner of yours. More traffic from a rented cluster does not mean the arrangement is safe."
        },
        {
          type: "p",
          text: "Official Search spam documentation and blog releases explain the line in more detail, but the operational test is simple. Would users of this site expect to find these pages here? Does the section lead people into a product, topic or service that has little to do with the host? Is the content treated as editorial, or is it a stand-alone machine for results in another niche? If you need a rich set of commercial pages that do not belong, do not place them on a trusted host just because it already ranks."
        },
        {
          type: "p",
          text: "Technical traces can help the review. Different CMS, different analytics, unusual redirects, a separate sitemap and a sudden list of new URLs in a language or topic the site never covered are all reasons to look closer. A mobile-only or subdomain rollout can hide the same pattern from a casual walk of the main menu. Learn to view the site the way Search does: hosts, sitemaps, the URL list, and the actual pages, not only the homepage. One neglected subdomain is enough to create a problem for the whole brand."
        },
        {
          type: "p",
          text: "Support materials also remind publishers that third-party content is not forbidden as such. What the policy means to stop is the borrowing of reputation. Measures can include removing the section, noindexing it, cutting internal links, and making sure it no longer appears in sitemaps. If a roll-back is required, document it. Search systems and users both benefit when a respected site stays on its own thematic territory."
        }
      ]
    },
    {
      id: "tematicheskaya-granica",
      title: "Как держать тематическую границу сайта и не сдавать репутацию под чужие запросы",
      tocLabel: "Тематическая граница",
      blocks: [
        {
          type: "p",
          text: "Тематическая граница должна быть понятна не только SEO, но и тем, кто продает партнерства. Если предложение «разместим у вас кластер, будете получать трафик» не связано с основной тематикой, это почти всегда плохой сигнал. Самостоятельный коммерческий раздел на чужой репутации может выглядеть как быстрый доход и при этом создать причину для санкции со стороны поиска. Лучше отказаться заранее, чем потом объяснять, почему в справочном центре и в выдаче площадка вдруг отвечает за чужую нишу."
        },
        {
          type: "p",
          text: "Адрес раздела, его место в навигации и его содержание должны помогать человеку, а не маскировать витрину. Если раздел нельзя честно показать в меню как свой сервис, его не стоит держать ради позиций. Ресурс, который бережет имя, выигрывает вдолгую больше, чем на коротком всплеске чужого кластера."
        }
      ]
    },
    {
      id: "english-response",
      title: "How a host site can respond if a third-party cluster is already live",
      tocLabel: "How to respond if it is already live",
      blocks: [
        {
          type: "p",
          text: "If a third-party cluster is already live, the host should treat it as an incident, not as a traffic channel to be optimized. Search quality systems do not owe the partner a soft landing. The first job is to stop new pages, then to remove or noindex what is already there, then to clean sitemaps, internal links and entry points. Users who bookmarked a page may see a removal; that is still better than leaving a policy problem on a domain the brand actually needs."
        },
        {
          type: "p",
          text: "Webmaster teams should also talk to the partner in writing. The arrangement may have been sold as “content marketing” or “a new vertical.” The site still has to decide whether those pages belong. If they do not, the partner can take the content to a property they own. Google’s public materials have been consistent on the direction of this policy: borrowing a host’s reputation to rank unrelated pages is not a safe growth plan. More debate about wording does not change the operational need to get the pages off the trusted host."
        },
        {
          type: "p",
          text: "Publishers sometimes ask whether a label or a disclosure is enough. A clear label is necessary for many legitimate commercial formats, but it does not turn an unrelated cluster into on-topic journalism. The question remains: is this the site’s own service to its audience, or a rented place in Search results? If the honest answer is the latter, disclosure will not make the risk disappear. Remove the cluster, document the cleanup, and keep the main site on its own subject matter."
        },
        {
          type: "p",
          text: "В справочном и редакционном контуре после очистки полезно коротко объяснить команде, почему раздел закрыли, какая тематикой площадки считается своей, и какие предложения больше не рассматривают. Это снижает шанс, что через квартал кто-то снова принесет «удобную витрину» под тем же соусом."
        }
      ]
    },
    {
      id: "english-questions-sra",
      title: "Questions publishers ask about site reputation abuse after the policy became public",
      tocLabel: "Questions publishers ask",
      blocks: [
        {
          type: "p",
          text: "Publishers often ask whether a single sponsored article can trigger the policy. In most ordinary cases a clearly labeled, on-topic piece is not what this rule is about. The risk rises when a host opens a whole section, subdomain or expired property and lets a third party fill it with pages whose only job is to rank. Search is looking at the pattern and the purpose, not at a one-off label."
        },
        {
          type: "p",
          text: "Another common question is whether moving the same cluster to a new subdirectory is enough. If the content still borrows the host’s reputation and still has little to do with the site, a new path is not a strategy. The safer response is to take the cluster off the trusted domain. Webmasters can then help the partner launch on a property they actually own. Users, Search results and the host brand are all clearer after that split."
        },
        {
          type: "p",
          text: "A third question is how to prove a cleanup if the pages were already indexed. Keep a list, remove or noindex the URLs, drop them from sitemaps, cut internal links, and give Search time to recrawl. More urgency in emails will not replace that work. The host should also make sure the same publishing access cannot silently return a month later. Policy risk of this kind is as much about access control as it is about the last URL."
        },
        {
          type: "p",
          text: "Если после очистки в выдаче еще какое-то время висят старые сниппеты, это не обязательно знак, что раздел «не закрыли». Сначала проверяют, доступны ли URL, отдают ли они контент, не остались ли они в карте сайта. Уже потом, если живые страницы исчезли, ждут переобхода. Для репутации домена важнее фактическое отсутствие чужого кластера, чем мгновенное исчезновение всех сохраненных ссылок."
        }
      ]
    },
    {
      id: "access-and-recrawl",
      title: "How access control and recrawl matter after a third-party cluster is removed",
      tocLabel: "Access control and recrawl",
      blocks: [
        {
          type: "p",
          text: "Cleanup is not finished when the first batch of URLs returns a 404. Access control has to change too, otherwise a partner can publish again next month under a slightly different path. Webmaster and site-security owners should review who can create subdomains, upload sitemaps and add sections to the CMS. If those doors stay open, the same pattern will return. Search then has to recrawl a problem the host already thought was over."
        },
        {
          type: "p",
          text: "A recrawl plan is ordinary. Update sitemaps, keep a list of removed URLs, make sure internal links no longer point into the cluster, and give Search time. Features like parameter variations and old campaign landing pages should be in that list if they were part of the same arrangement. Hacked or forgotten accounts deserve the same pass: a section does not have to be a formal partnership to abuse a host’s reputation. Central ownership of the domain, not a loose collection of side deals, is what keeps the site in its own topical lane."
        },
        {
          type: "p",
          text: "Publishers sometimes hope a soft noindex will be enough while the partner “winds down.” That can be a short transitional step, but it is not the end state if the pages do not belong. The safer end state is removal or a clearly isolated property that does not inherit the host’s name. Users are not helped by a quiet corner of a trusted site that exists only to rank. The brand is not helped either. Get the cluster off the domain, then keep the access tight."
        },
        {
          type: "p",
          text: "После очистки полезно еще раз пройти инвентарь поддоменов и разделов, чтобы убедиться, что не осталось «запасного» входа. Если такой вход находится, его закрывают сразу, не откладывая до следующего квартального обзора. Репутация домена держится не заявлением, а отсутствием чужого кластера в живом индексе."
        },
        {
          type: "p",
          text: "Практически это означает еще один спокойный цикл после формального закрытия раздела. Через некоторое время снова смотрят индекс, карту сайта, поддомены и входные ссылки. Если чужие URL еще открываются, их добивают. Если все чисто, оставляют короткий запрет в внутренней политике и не возвращаются к схеме, даже если партнер предлагает «более аккуратный» формат того же самого. Для основного сайта такой отказ обычно дешевле, чем еще один инцидент с репутацией домена."
        },
        {
          type: "p",
          text: "Для редакции полезно сохранить публичную логику: какие партнерские форматы остаются допустимыми, как они подписываются, и где проходит граница темы. Тогда следующий коммерческий эксперимент можно оценить заранее, а не разбирать уже после того, как он попал в индекс. Пользователи тоже выигрывают: на знакомом домене они снова встречают ожидаемое содержание, а не чужую витрину под привычным именем."
        }
      ]
    },
    {
      id: "tools-data-and-reports",
      title: "How tools, data and reports help a host find leftover third-party pages",
      tocLabel: "Tools, data and reports",
      blocks: [
        {
          type: "p",
          text: "Webmaster tools, sitemap data and a simple crawl report are usually enough to find leftover third-party pages after a cleanup. Google Search documentation is useful for the policy line; the website’s own URL list is useful for the work. If a video walkthrough helps a wider team see the difference between the main site and a rented section, use it. The point is not a presentation. The point is to see whether other hosts, parameters or generated landing pages still belong to the same arrangement."
        },
        {
          type: "p",
          text: "Using these tools once is not enough. Central owners should look again after recrawl windows, after CMS releases, and after a partner says the work is done. Features like automatic sitemap dumps can quietly reintroduce URLs that were already removed. A hacked or forgotten publishing account can do the same. Building a short recurring check into the webmaster routine is safer than trusting a single cleanup ticket."
        },
        {
          type: "p",
          text: "The web is full of packages that promise an easy new “vertical” on your domain. Data from previous incidents is a better guide than those decks. If the pages were generated mainly to rank, and if they needed your brand in the host name to have a chance, they were a risk. Report that clearly inside the company, even if the traffic looked attractive. Other teams can then stop selling the same idea under a new label."
        },
        {
          type: "p",
          text: "Для проекта это означает простую привычку: после любой крупной партнерской истории снова смотрят данные индекса и живые URL. Продвижение основного сайта не должно зависеть от чужого кластера, а справочном смысле команда должна понимать, где проходит тематикой граница площадки. Если граница держится, репутацию домена уже гораздо труднее сдать по ошибке или «на тест»."
        },
        {
          type: "p",
          text: "A short recurring report is worth more than a dramatic one-off audit. Look at the website hosts, the sitemap data, and any new sections that appeared since the last check. If tools still show pages that were supposed to be gone, fix them before the next Search pass. Using the same checklist each month makes leftover generated or partner URLs harder to miss. Other teams can read that report too, so the rule stays visible: this website is not a platform for renting reputation."
        },
        {
          type: "p",
          text: "If a video, a crawl or a Search Console report still shows leftover URLs after the official cleanup date, treat that as unfinished work, not as a cache curiosity. Google indexing of a removed cluster can lag, but live 200 pages should not. Features on the website that auto-build sitemaps or preview hosts should be in the same check. Central ownership means one team can take those leftovers down without waiting for the partner. Building that habit is part of protecting the domain, not an extra bureaucratic layer."
        },
        {
          type: "p",
          text: "The last check is mundane and necessary. Open the website, look at the sitemap, and confirm that Search tools no longer list the removed cluster as a living set of pages. If Google still has stale links in a report, compare them with the live data. A video recording of the empty section can help other teams see that the host is clean. Features that auto-generate URLs should stay off unless they serve the site’s own users. That is the difference between a cleanup on paper and a cleanup in production."
        },
        {
          type: "p",
          text: "Если в справочном центре или в отчете еще виден старый адрес раздела, это повод не получать ложное спокойствие, а заново оценить причину: живой ли это ресурс, редирект или только сохраненная ссылка. Самостоятельный проход по домену здесь надежнее, чем ожидание, что санкции или их отсутствие «сами все покажут». View the live page, check redirects, and only then close the ticket."
        },
        {
          type: "p",
          text: "Support for that last live check should stay with the central webmaster team, not with the partner who used to offer the product cluster."
        }
      ]
    },
    {
      id: "first-party-i-signal",
      title: "Чем свой контент отличается от чужого раздела, который паразитирует на репутации хоста",
      tocLabel: "Свой и чужой контент",
      blocks: [
        {
          type: "p",
          text: "Политика Google про site reputation abuse нацелена не на любой слабый материал и не на любую партнёрскую колонку. Речь о том, что третья сторона размещает на авторитетном домене свой контент в основном для поисковой выдачи и пользуется репутацией хоста. First-party страницы — свой журнал, свои справки, свои карточки — могут быть неровными, но они принадлежат сайту по смыслу и по ответственности. Third-party витрина, которая живёт в субдомене или разделе и продвигает чужие запросы, выглядит иначе: другая тема, другие авторы, другая коммерческая логика и часто отдельная CMS."
        },
        {
          type: "p",
          text: "Именно поэтому слабый собственный блог и чужой купонно-обзорный раздел нельзя лечить одним и тем же рецептом. Первый улучшают или сужают. Второй, если он рассчитан на чужие search queries и host site ranking signals, обычно сворачивают. Путать эти случаи опасно: команда начинает «улучшать качество» витрины, которую вообще не стоило держать на домене, или наоборот сносит свой журнал, хотя претензия была к партнёрскому кластеру. Смотрят происхождение раздела, а не только формулу «low quality content»."
        },
        {
          type: "table",
          caption: "Какие признаки чаще отличают рискованный чужой раздел от обычной публикации на сайте",
          textOnly: true,
          head: ["Признак", "Скорее свой раздел", "Скорее риск site reputation abuse"],
          rows: [
            ["Кто отвечает за тему и оферту", "Хост сам оказывает услугу, продаёт товар или пишет как издатель", "Третья сторона ведёт чужую витрину под чужие запросы"],
            ["Связь с основным сайтом", "Раздел продолжает ту же тему и навигацию", "Тема резко выпадает из репутации домена"],
            ["Как появляются страницы", "Редакция или каталог хоста", "Массовые шаблонные URL, которые хост почти не контролирует"],
            ["Зачем раздел существует", "Для своих пользователей и своей оферты", "Чтобы занять search results за счёт авторитета хоста"],
            ["Что остаётся после разрыва с партнёром", "Свой архив, который сайт готов поддерживать", "Кластер, который хосту нечем содержательно заменить"]
          ]
        },
        {
          type: "p",
          text: "Это не юридический тест и не замена текста политики Google. Это рабочий взгляд хозяина домена: если раздел можно объяснить своей деятельностью, его разбирают как обычный контентный риск. Если объяснить можно только желанием «занять выдачу с чужого плеча», схема уже похожа на злоупотребление репутацией. В таком случае обсуждают не «ещё немного поисковой оптимизации», а отключение витрины и контроль доступа, чтобы она не появилась снова."
        }
      ]
    },
    {
      id: "posle-udalenija-klastera",
      title: "Что делать с индексом и обходом после того, как чужой кластер уже сняли",
      tocLabel: "После снятия кластера",
      blocks: [
        {
          type: "p",
          text: "Снять раздел с сайта — только первая половина работы. В поиске ещё какое-то время могут жить старые адреса, файлы sitemap, параметры и копии, которые партнёр успел раздать наружу. Если их не закрыть и не отправить на переобход, search results продолжают показывать чужие сниппеты на вашем домене. Поэтому после отключения витрины составляют список URL: то, что было в карте сайта, в Search Console, в журналах сервера и в известных входящих ссылках."
        },
        {
          type: "p",
          text: "Дальше смотрят, что именно должен увидеть робот. Страницы, которых больше нет, отдают понятный код ответа, а не чужой шаблон «временно недоступно» с тем же содержимым. Случайные внутренние ссылки с основных разделов убирают. Если на кластер вели внешние ссылки, их уже не получится выключить все сразу, но хост хотя бы не продолжает раздавать эти адреса в своей навигации и карте сайта. Затем запрашивают переобход важных узлов и следят в Search Console, не всплывают ли новые третьесторонние URL."
        },
        {
          type: "callout",
          variant: "important",
          text: "Пока в индексе остаются живые адреса чужого кластера, работу нельзя считать законченной только потому, что раздел уже не открывается из меню."
        },
        {
          type: "p",
          text: "Имеет смысл отдельно проверить доступ. Если партнёр оставлял свою CMS, FTP или кабинет, этого достаточно, чтобы витрина вернулась под новым путём. Смена паролей, закрытие лишних учёток и запрет на создание новых подразделов без ревизии здесь важнее новых текстов «о качестве». Site reputation abuse — это не только содержимое страниц, но и то, кому хозяин домена разрешил ими пользоваться. Когда доступ приведён в порядок, а остатки кластера перестают отдаваться, можно спокойно наблюдать выдачу и не путать эту историю с обычным [core update](/slovar/core-update/) или с любой [ручной мерой](/slovar/manual-action/) вообще."
        },
        {
          type: "p",
          text: "Наблюдение после снятия обычно длится не один день. Смотрят, исчезли ли чужие сниппеты, не появились ли зеркала на соседнем поддомене и не осталось ли в отчёте об индексе пачки URL, которые сайт уже не считает своими. Если что-то всплывает снова, возвращаются к списку адресов и к доступу, а не к новой порции «качественного» контента в том же разделе. Так хозяин сайта закрывает именно схему злоупотребления репутацией, а не маскирует её под контентный проект."
        }
      ]
    }
  ],
  modules: {
    id: "site-reputation-abuse-titlo",
    title: "Какие инструменты Титло помогают следить за своими разделами, а не за чужими схемами",
    intro: "Если вы хозяин домена, важнее понимать, какие разделы вы реально контролируете и какие URL внезапно появляются в поиске под вашим именем.",
    items: [
      {
        slug: "monitoring-pozicii-sayta",
        title: "Мониторинг позиций",
        text: "Показывает, не начали ли расти посторонние запросы и посадочные, которых вы не заводили как основной контент."
      },
      {
        slug: "audit-sajta",
        title: "Аудит сайта",
        text: "Помогает увидеть разделы, служебные витрины и шаблоны, которые могли появиться без нормальной редакции."
      },
      {
        slug: "proverka-indeksacii",
        title: "Проверка индексации",
        text: "Полезно убедиться, какие именно URL с домена вообще попали в индекс."
      }
    ]
  },
  related: [
    "Manual Action",
    "Core Update",
    "Серое SEO",
    "Токсичные ссылки",
    "E-E-A-T",
    "Helpful Content Update"
  ],
  takeaways: [
    "Site Reputation Abuse — злоупотребление репутацией домена ради ранжирования стороннего или малосвязанного контента.",
    "Это не любой партнёрский материал, а схема, где чужие страницы живут за счёт доверия к хозяину сайта.",
    "Политика относится к spam policies и в части случаев сопровождается ручной мерой.",
    "Владелец домена отвечает за такие разделы: их убирают, изолируют или возвращают под свою редакцию.",
    "Русское «паразитное SEO» близко по смыслу, но не всегда совпадает с конкретной формулировкой Google."
  ],
  faq: [
    {
      q: "Любая партнёрская статья на сайте — это нарушение?",
      a: "Нет. Смотрят связь с основной темой, контроль редакции и цель размещения. Нарушением обычно считают сторонние разделы, которые нужны в первую очередь для чужого ранжирования."
    },
    {
      q: "Чем это отличается от ручной меры вообще?",
      a: "Site Reputation Abuse — название политики. Manual action — способ её применить. Меры бывают и по другим пунктам spam policies, поэтому читают тип записи в Search Console."
    },
    {
      q: "Можно ли оставить подраздел, если закрыть его от индекса?",
      a: "Иногда это временный шаг на время уборки. Если раздел по сути остаётся арендой репутации, лучше убрать схему, а не только спрятать URL."
    },
    {
      q: "Что делать, если чужой раздел появился без вашего ведома?",
      a: "Разобрать, как он был опубликован, закрыть доступ, снять материалы и проверить, нет ли уже уведомления в Search Console. Дальше — как с любой компрометацией своих URL."
    },
    {
      q: "Связано ли это с покупными ссылками?",
      a: "Иногда схемы пересекаются, но политика в первую очередь про контент на вашем домене, а не про входящие ссылки. Ссылочные истории разбирают отдельно."
    },
    {
      q: "Достаточно ли убрать чужой раздел из меню, чтобы политика больше не касалась сайта?",
      a: "Нет. Нужно, чтобы сами адреса перестали отдавать чужое содержимое, не остались в карте сайта и со временем ушли из индекса. Параллельно закрывают доступ, чтобы витрина не вернулась под новым путём. Пока страницы открываются или живут в выдаче, риск остаётся."
    }
  ],
  datePublished: "2026-11-26",
  dateModified: "2026-11-27"
};
