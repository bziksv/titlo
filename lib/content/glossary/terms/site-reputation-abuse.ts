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
    }
  ],
  datePublished: "2026-11-26",
  dateModified: "2026-11-26"
};
