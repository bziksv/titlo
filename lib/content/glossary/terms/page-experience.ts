import type { GlossaryTerm } from "../types";

/**
 * Бриф: кабинет #286 «Page Experience».
 * Google MSK TOP-20, history 103928, запрос «page experience», 19.11.2026.
 */
export const PageExperience: GlossaryTerm = {
  slug: "page-experience",
  term: "Page Experience",
  aliases: [
    "page experience",
    "google page experience",
    "удобство страницы",
    "page experience update"
  ],
  categoryId: "algoritmy-i-apdeyty-google",
  h1: "Page Experience: что такое опыт страницы в Google и какие сигналы в него входят",
  seoTitle: "Page Experience: что это в Google, какие сигналы входят и как смотреть отчёт",
  seoDescription: "Page Experience — оценка того, насколько страница удобна пользователю в поиске Google. Какие сигналы входят в опыт страницы, как связаны Core Web Vitals и где смотреть отчёты.",
  short: "Page Experience — это оценка Google того, насколько страница удобна человеку помимо самого содержания: быстро ли появляется основной контент, не прыгает ли вёрстка, удобно ли пользоваться на мобильном, нет ли навязчивых перекрытий. Сигналы опыта страницы не заменяют полезный текст, но помогают поисковой системе отличить результат, которым реально можно воспользоваться, от страницы, которая формально отвечает на запрос.",
  definition: "Page Experience (опыт страницы, иногда — удобство страницы) — набор сигналов Google о том, как человек взаимодействует со страницей: скорость и стабильность отрисовки, отзывчивость на действия, мобильная пригодность и отсутствие мешающих элементов. Исторически в этот набор входили [Core Web Vitals](/slovar/core-web-vitals/) и связанные проверки удобства. Для владельца сайта важнее смотреть свои полевые данные и отчёты в Search Console, чем спорить о маркетинговом имени обновления.",
  sections: [
    {
      id: "chto-takoe",
      title: "Что такое Page Experience",
      tocLabel: "Определение",
      blocks: [
        {
          type: "p",
          text: "Google page experience описывает не «красоту дизайна», а практическое удобство результата в [поисковой выдаче](/slovar/snippet/). Человек открыл страницу из Google Search: видно ли основной контент без долгого ожидания, не уезжает ли кнопка в момент нажатия, можно ли прочитать текст на телефоне, не перекрывает ли всё рекламный слой."
        },
        {
          type: "p",
          text: "Содержание по-прежнему главное. Опыт страницы — дополнительный слой: при сопоставимой полезности удобный URL чаще оказывается предпочтительнее. Поэтому page experience signals не стоит воспринимать как отдельный «фильтр», который можно закрыть одним инструментом. Это скорее гигиена шаблона и реальные полевые метрики."
        }
      ]
    },
    {
      id: "kakie-signaly",
      title: "Какие сигналы обычно относят к опыту страницы",
      tocLabel: "Сигналы",
      blocks: [
        {
          type: "p",
          text: "Набор менялся по мере обновлений документации Google. Устойчивое ядро — Core Web Vitals: [LCP](/slovar/lcp/) (когда появляется основной контент), [INP](/slovar/inp/) как interaction to paint (насколько страница отзывчива) и [CLS](/slovar/cls/) (не прыгает ли вёрстка). Рядом смотрят мобильную пригодность (mobile friendly / mobile usability), безопасное соединение и то, не мешают ли навязчивые перекрытия главному содержимому."
        },
        {
          type: "p",
          text: "Раньше в разговорах об experience update часто всплывал отдельный FID; его место в живых рекомендациях занял INP. Для практики это значит: ориентируются на актуальные web vitals и полевые данные, а не на чек-лист устаревшей памятки."
        },
        {
          type: "callout",
          variant: "tip",
          text: "Хороший лабораторный балл в PageSpeed не равен хорошему page experience на живом трафике. Google в ранжировании опирается на полевые данные реальных заходов, а лаборатория нужна, чтобы понять, какой элемент и какой скрипт всё портят."
        }
      ]
    },
    {
      id: "gde-smotret",
      title: "Где смотреть Page Experience и связанные отчёты",
      tocLabel: "Где смотреть",
      blocks: [
        {
          type: "p",
          text: "Практичная точка сборки — Google Search Console: отчёты по удобству страницы и Core Web Vitals, плюс мобильная пригодность, если она ещё вынесена отдельно. [PageSpeed Insights](/slovar/pagespeed-insights/) показывает и field data, и лабораторный разбор конкретного URL. Важно смотреть шаблоны, а не одну витринную страницу: карточка, статья и форма заказа могут жить с разным опытом."
        },
        {
          type: "flow",
          caption: "Как обычно проверяют опыт страницы",
          steps: [
            {
              label: "Открывают полевые отчёты",
              note: "Search Console и field data по группам URL"
            },
            {
              label: "Смотрят Core Web Vitals",
              note: "LCP, INP и CLS на мобильном и десктопе"
            },
            {
              label: "Проверяют мобильное удобство",
              note: "читается ли main content, не мешают ли перекрытия"
            },
            {
              label: "Находят проблемный шаблон",
              note: "не один URL, а тип страницы, который стабильно красный"
            },
            {
              label: "Чинят причину и ждут новых полевых данных",
              note: "лаборатория подтверждает гипотезу, а не заменяет отчёт"
            }
          ]
        },
        {
          type: "table",
          caption: "Что обычно входит в обсуждение Page Experience",
          head: [],
          rows: [
            [
              "Сигнал или тема",
              "На что смотрят",
              "Где это видно",
              "Какой практический шаг"
            ],
            [
              "Largest Contentful Paint",
              "как быстро появляется основной контент",
              "полевые web vitals, PageSpeed",
              "найти LCP-элемент и не откладывать его"
            ],
            [
              "Interaction to Next Paint",
              "насколько страница отвечает на действия",
              "field data, лаборатория отзывчивости",
              "убрать длинные задачи в основном потоке"
            ],
            [
              "Cumulative Layout Shift",
              "не прыгает ли видимая вёрстка",
              "отчёт CLS, запись загрузки",
              "зарезервировать место под медиа и баннеры"
            ],
            [
              "Mobile friendly / mobile usability",
              "удобно ли пользоваться на телефоне",
              "мобильный просмотр, Search Console",
              "проверить [адаптивную вёрстку](/slovar/adaptivnaya-verstka/) и кликабельные элементы"
            ],
            [
              "Навязчивые перекрытия",
              "не закрывают ли объявления главный текст",
              "просмотр как у пользователя",
              "не перекрывать main content слоями, которые нельзя закрыть"
            ],
            [
              "HTTPS и безопасность",
              "можно ли открыть страницу без предупреждений",
              "адресная строка, отчёты безопасности",
              "держать корректный сертификат и смешанный контент под контролем"
            ]
          ],
          textOnly: true,
          note: "Это гигиена удобства, а не отдельный «волшебный» фактор вместо содержания."
        }
      ]
    },
    {
      id: "update-i-ranzhirovanie",
      title: "Как опыт страницы связан с ранжированием и обновлениями",
      tocLabel: "Ранжирование",
      blocks: [
        {
          type: "p",
          text: "Page experience update в начале двадцатых закрепил идею, что сигналы удобства участвуют в ранжировании Google. Позже формулировки в документации уточнялись: опыт страницы остаётся частью общей оценки, а отдельные системы ранжирования могут учитывать эти сигналы по-разному. На практике это не отменяет [Core Update](/slovar/core-update/): широкое обновление может пересобрать полезность страниц, даже если технические метрики были зелёными."
        },
        {
          type: "p",
          text: "Полезный рабочий принцип такой. Если позиции просели, а полевой опыт страницы давно плохой на шаблоне выдачи, его стоит чинить. Если vitals в порядке, а сдвиг совпал с широким обновлением, сначала сравнивают содержание и качество результата с конкурентами, а не «докручивают» сотые доли лабораторного балла."
        },
        {
          type: "p",
          text: "В русскоязычных материалах встречаются формулировки вроде «удобство страницы влияет на позиции» и «опыт страницы в SEO». Они верны лишь как общее направление: Google учитывает, можно ли нормально воспользоваться результатом. Это не гарантия роста и не повод ставить скорость выше смысла страницы."
        }
      ]
    },
    {
      id: "angliyskie-formulirovki",
      title: "Как читать англоязычные формулировки вокруг Page Experience",
      tocLabel: "Англоязычные формулировки",
      blocks: [
        {
          type: "p",
          text: "В справке Google Search и в отчётах часто оставляют английские имена сигналов. Их достаточно понимать как ярлыки отчётов, а не как отдельные продукты."
        },
        {
          type: "table",
          caption: "Какие английские термины встречаются в материалах о Page Experience",
          head: [],
          rows: [
            [
              "Термин",
              "Что обычно имеют в виду",
              "Где смотрят",
              "Что с этим делать"
            ],
            [
              "page experience / google page experience",
              "удобство страницы как набор сигналов",
              "документация Search, Search Console",
              "смотреть свои URL, а не общее имя обновления"
            ],
            [
              "page experience signals",
              "конкретные сигналы удобства",
              "отчёты appearance и vitals",
              "разобрать LCP, INP, CLS и мобильное удобство"
            ],
            [
              "Core Web Vitals, web vitals",
              "полевые метрики загрузки, отзывчивости и стабильности",
              "PageSpeed, Search Console, field data",
              "ориентироваться на реальные визиты"
            ],
            [
              "search console report",
              "отчёт по группам URL",
              "Google Search Console",
              "чинить шаблон, который массово не проходит порог"
            ],
            [
              "mobile friendly, mobile usability",
              "пригодность для телефона",
              "мобильная проверка, живой просмотр",
              "не прятать main content и не мельчить кнопки"
            ],
            [
              "page experience update",
              "волна, после которой сигналы удобства сильнее обсуждали в ранжировании",
              "блог Google Search, хроника обновлений",
              "не путать с текущим Core Update"
            ],
            [
              "user experience, good page experience",
              "общее удобство пользования страницей",
              "полевые данные и поведение",
              "улучшать реальный опыт, не только лабораторный балл"
            ],
            [
              "search appearance",
              "то, как результат выглядит и открывается из поиска",
              "разделы документации Search",
              "связать сниппет, мобильный вход и саму страницу"
            ]
          ],
          textOnly: true,
          note: "Английские ярлыки описывают удобство результата в Google Search, а не отдельный секретный алгоритм."
        }
      ]
    },
    {
      id: "chto-delat",
      title: "Что делать, если опыт страницы слабый",
      tocLabel: "Что делать",
      blocks: [
        {
          type: "p",
          text: "Сначала отделяют шаблон от единичной страницы. Затем по полевым данным выбирают худшую метрику: если это LCP — ищут элемент героя; если CLS — сдвигающийся блок; если INP — тяжёлые обработчики. Параллельно проверяют мобильный просмотр и перекрытия. После правок ждут накопления новых field data: опыт страницы не обновляется мгновенно после одной лабораторной «зелёной» проверки."
        },
        {
          type: "p",
          text: "Не стоит путать это с косметическим редизайном. Иногда достаточно зарезервировать место под баннер, отдать главный кадр без лишнего скрипта и убрать слой, который закрывает кнопку заказа. Иногда нужен более глубокий разбор [JavaScript SEO](/slovar/javascript-seo/) и клиентского рендера."
        }
      ]
    },
    {
      id: "documentaciya-en",
      title: "How to read Page Experience in English docs and reports",
      tocLabel: "Документация на английском",
      blocks: [
        {
          type: "p",
          text: "English docs usually treat page experience as a set of signals that describe how a person uses a result in Google Search, not as a single score you can buy. The core idea is simple: the content should be useful, and the page should also be usable. When field data say that LCP, INP or CLS is poor, the website has a real user experience problem on that template. Lab tools help you see why, but the search console report and other field sources are the ones that show how the live site behaves."
        },
        {
          type: "p",
          text: "A practical reading of the documentation looks like this. Page experience signals include Core Web Vitals and checks such as mobile friendly rendering, safe browsing and intrusive interstitials. Google Search may use these signals together with the quality of the result, not instead of it. A good page experience does not replace helpful content, and a green lab test does not hide a thin or misleading article. Site owners should improve the templates that get traffic, using Search Console, PageSpeed and Chrome field data, then give the new measurements time to update."
        },
        {
          type: "p",
          text: "Webmaster help and Search Central pages also talk about crawling and indexing, performance, and how results appear after a click. That does not mean you should stuff sitemaps or robots directives into a page-experience task. It means the page has to open, render and stay usable. If ads or overlays hide the main content, or if the mobile layout is hard to use, the experience is weak even when the text is decent. Test the real page on a phone, not only a desktop example, and make fixes where users actually land."
        },
        {
          type: "p",
          text: "Ranking effects are easy to overstate. An experience update once made these signals more visible in public discussion, but a later core update can still move results for content reasons. Use the reports to find weak URLs, improve speed, stability and interaction, and keep the content honest. This is how most teams work with the metric in practice: fix the site, track the field data, and do not expect one checker or one video guide to solve ranking on its own."
        }
      ]
    }
  ],
  modules: {
    id: "page-experience-titlo",
    title: "Какие инструменты Титло помогают следить за страницами, а не только за названием сигнала",
    intro: "Page Experience смотрят по своим URL: где проседают метрики, какие шаблоны неудобны на мобильном и не закрывает ли это рост по запросам.",
    items: [
      {
        slug: "monitoring-pozicii-sayta",
        title: "Мониторинг позиций",
        text: "Показывает, совпал ли сдвиг видимости с техническими проблемами шаблона или шёл отдельно от опыта страницы."
      },
      {
        slug: "audit-sajta",
        title: "Аудит сайта",
        text: "Помогает найти технические и мобильные дефекты, которые часто стоят рядом с плохим опытом: ошибки, тяжёлые страницы, сбои отображения."
      }
    ]
  },
  related: [
    "Core Web Vitals",
    "LCP",
    "INP",
    "CLS",
    "PageSpeed Insights",
    "Core Update",
    "Mobile-first индексация"
  ],
  takeaways: [
    "Page Experience — набор сигналов удобства страницы в Google, а не замена полезного содержания.",
    "Ядро сегодняшней практики — Core Web Vitals: LCP, INP и CLS, плюс мобильное удобство и отсутствие вредных перекрытий.",
    "Ориентир — полевые данные Search Console и PageSpeed, а не один лабораторный балл.",
    "Плохой опыт чинят по шаблону URL, затем ждут новых полевых замеров.",
    "Зелёные vitals не страхуют от Core Update: содержание и полезность результата по-прежнему решают больше."
  ],
  faq: [
    {
      q: "Page Experience — это отдельный алгоритм?",
      a: "Это скорее группа сигналов удобства, которые Google учитывает вместе с содержанием. Отдельные обновления могли усиливать внимание к этим сигналам, но сам опыт страницы не заменяет оценку полезности результата."
    },
    {
      q: "Что важнее — лабораторный PageSpeed или отчёт в Search Console?",
      a: "Для живого сайта важнее полевые данные. Лаборатория помогает найти причину на конкретном URL, но ранжирование и отчёт page experience опираются на реальные заходы."
    },
    {
      q: "Нужно ли ждать сто баллов в PageSpeed?",
      a: "Нет. Практичная цель — устойчиво пройти рекомендуемые пороги на важных шаблонах, особенно на мобильном. Погоня за лабораторным максимумом редко окупается, если field data уже спокойные."
    },
    {
      q: "Связан ли опыт страницы с Mobile-first индексацией?",
      a: "Да, в том смысле, что удобство чаще оценивают по мобильной версии. Если десктоп быстрый, а телефон неудобен, именно мобильный опыт обычно важнее. См. [Mobile-first индексация](/slovar/mobile-first-indeksatsiya/)."
    },
    {
      q: "Исправили метрики — когда ждать эффект в поиске?",
      a: "Полевые отчёты обновляются не сразу: нужно накопить новые визиты. Сдвиг позиций может прийти позже и не быть однозначным, если одновременно вышло широкое обновление или изменилась конкуренция по запросу."
    }
  ],
  datePublished: "2026-11-26",
  dateModified: "2026-11-26"
};
