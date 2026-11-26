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
    },
    {
      id: "english-page-experience",
      title: "How Google describes page experience and Core Web Vitals in English",
      tocLabel: "English-language notes",
      blocks: [
        {
          type: "p",
          text: "Page experience is Google’s way of talking about how it feels to use a page, not only what the page says. The current core of that story is Core Web Vitals: Largest Contentful Paint for loading, Interaction to Next Paint for responsiveness, and Cumulative Layout Shift for visual stability. HTTPS, mobile-friendly layout and the absence of intrusive interstitials still matter as basic hygiene. Introducing a single “page experience score” in Search Console was an earlier reporting idea; teams now usually look at the vitals and the field data themselves."
        },
        {
          type: "p",
          text: "The useful habit is to read lab and field together. A lab run can show which element is slow or which banner shifts the layout. Field data and Chrome User Experience Report numbers show what real users hit on slow devices and real networks. If the lab looks good and the field does not, the live page is the source of truth. Links to official documentation help the team agree on definitions, but they do not replace fixing the template."
        },
        {
          type: "p",
          text: "How a team uses these indicators in practice is straightforward. They pick key templates, measure them on a regular cadence, and treat regressions as product bugs. Introducing a new widget without reserved space, a heavy hero image or a script that blocks input will show up in the vitals. The goal is not a screenshot of a green report. The goal is a page that opens quickly, stays stable and responds when a person taps."
        }
      ]
    },
    {
      id: "kak-svyazat-s-seo",
      title: "Как связан опыт страницы с SEO и почему его чинят как продуктовую задачу",
      tocLabel: "Связь с SEO",
      blocks: [
        {
          type: "p",
          text: "Для поиска опыт страницы — один из сигналов, а не единственный фактор позиций. Слабые vitals чаще мешают на конкурентных запросах и портят поведение: человек не ждет, возвращается в выдачу, не успевает прочитать ответ. Поэтому работу лучше встраивать в релизный цикл, а не устраивать разовый «проект по Page Experience». Показатели смотрят по шаблонам: карточка, статья, листинг, форма. Если сломалась только рекламная вставка, чинят её, а не переписывают весь сайт."
        },
        {
          type: "p",
          text: "Практичный набор такой. Есть ответственный за скорость и верстку, есть короткий список контролируемых URL, есть проверка после крупных релизов, есть полевые данные, а не только лабораторный балл. Introducing новых промо-блоков без этой проверки обычно возвращает те же проблемы через месяц. Когда команда так работает, опыт страницы перестает быть отдельной «SEO-метрикой» и становится обычным качеством сайта."
        }
      ]
    },
    {
      id: "field-lab-and-templates",
      title: "How to work with field data, lab tests and templates without chasing a vanity score",
      tocLabel: "Field, lab and templates",
      blocks: [
        {
          type: "p",
          text: "A practical page-experience program is built around templates, not around a single URL that happened to look green last week. The home page, a category, a product or article template, a form and a landing page often behave differently. A lab test on a clean profile can miss a consent banner, a personalization block or a late ad that real users see. That is why field data from CrUX or your own RUM, and a lab trace, should be read together. If they disagree, believe the field and go find the live difference."
        },
        {
          type: "p",
          text: "Core Web Vitals give the conversation a shared language. Largest Contentful Paint asks whether the main content appeared in time. Interaction to Next Paint asks whether the page responded to taps and clicks. Cumulative Layout Shift asks whether the layout jumped while the person was already looking at it. None of these replace relevance, but all three can waste a click that the snippet had already won. Introducing new front-end features without a vitals check is one of the most common ways a “finished” template slowly becomes worse."
        },
        {
          type: "p",
          text: "Teams also need a sense of proportion. A slightly amber metric on a rare template is not the same problem as a red LCP on the main money page. Fix the pages that get the most search traffic and the most user frustration first. Then keep the component library clean so the next campaign does not reintroduce the same banner, font or slideshow problem. Links to official docs are useful for definitions; the work itself is in the template, the images, the scripts and the release checklist."
        }
      ]
    },
    {
      id: "chto-chinit-v-pervuyu",
      title: "Что чинить в первую очередь, если опыт страницы просел",
      tocLabel: "Что чинить в первую очередь",
      blocks: [
        {
          type: "p",
          text: "Если полевые данные просели, сначала ищут не «штраф за Page Experience», а конкретный шаблон и конкретный элемент. Часто это тяжелое изображение в шапке, шрифт без резерва, скрипт, который долго не отдает управление, всплывающее окно, рекламный слот без высоты, нестабильная шапка на мобильной ширине. Показатели сами подсказывают направление: медленный LCP — первый экран, плохой INP — обработчики и тяжелый главный поток, плохой CLS — поздние вставки и шрифты."
        },
        {
          type: "p",
          text: "Дальше работает обычная продуктовая дисциплина. Изменение проверяют до релиза и после него. Если эксперимент маркетинга ломает метрики, его не оставляют «потому что кампания уже запущена» без запасного варианта. Для поиска это выглядит как забота о человеке на странице, а для команды — как правило не ухудшать то, что уже открывается нормально. Так опыт страницы остается рабочей темой, а не разовой презентацией про Core Web Vitals."
        }
      ]
    },
    {
      id: "instrumenty-i-ocherednost",
      title: "Какими инструментами пользоваться и в каком порядке чинить опыт страницы",
      tocLabel: "Инструменты и очередность",
      blocks: [
        {
          type: "p",
          text: "Набор инструментов известный: полевые отчеты по Core Web Vitals, лабораторный прогон, трассировка загрузки, проверка удобства на телефоне, веб-виталс в кабинете поиска, собственные данные по реальному пользователю, если они есть. Важнее порядка, чем количество дашбордов. Сначала смотрят поле: есть ли проблема у людей. Затем лабораторно находят элемент. Затем чинят шаблон. Затем проверяют, что полевые данные через время тоже сдвинулись, а не только лабораторный балл."
        },
        {
          type: "p",
          text: "Очередность страниц тоже важна. Сначала шаблоны с наибольшим поисковым трафиком и с худшими метриками. Потом общие компоненты, которые портят сразу много URL: шапка, шрифты, баннер, виджет отзыва, скрипт чата, система согласий. Если чинить по одной «проблемной ссылке» из отчета, можно бесконечно лечить симптомы и не тронуть причину в компоненте. Для команды это обычная инженерная работа, просто триггером для неё стали поисковые показатели опыта."
        },
        {
          type: "p",
          text: "Не стоит ждать, что после правок позиции вырастут мгновенно. Опыт страницы — сопутствующий сигнал и фактор удержания клика, а не рубильник выдачи. Зато ухудшение шаблона человек замечает сразу, и это уже достаточная причина чинить. Если смотреть на задачу так, споры «влияет или не влияет на ранжирование» мешают меньше: стабильная, быстрая, отзывчивая страница нужна в любом случае, а поиск это дополнительно учитывает."
        }
      ]
    },
    {
      id: "english-program",
      title: "How to run a page-experience program with tools, reviews and design changes",
      tocLabel: "Running the program",
      blocks: [
        {
          type: "p",
          text: "A durable page-experience program is closer to product work than to a one-off SEO audit. Identify the templates that matter, review field and lab data, and prioritize fixes that remove real friction. Tools can help you see a slow image, a long task on the main thread, or a layout shift, but someone still has to change the code. Design and engineering should take the same report: the page is too slow, too jumpy or too slow to respond, and this is where it happens."
        },
        {
          type: "p",
          text: "Learn to provide reserved space for late banners, to remove unused scripts, and to enhance the first viewport without bringing every marketing pixel in at once. A business team may want a large promo, a chat widget or a newsletter modal; the page-experience owner should be able to answer what that change does to LCP, INP or CLS. If the change causes a regression, it should not ship as is. Evaluating the trade-off is part of the job, not a blocker invented by SEO."
        },
        {
          type: "p",
          text: "Support documentation and Search documentation are useful when you need a definition, but they will not fix your website. Webmaster tools, a lab trace and a field report are enough to start. Video walkthroughs and blog posts can help a wider team understand the metrics. The important habit is the review itself: after each release, visit key pages, view the vitals, and add a note if a new event, a new banner or a new script changed the experience. Coming back to the same template three months later should not feel like starting from zero."
        },
        {
          type: "p",
          text: "Changes that usually help are not mysterious. Compress and size images, reduce blocking work, keep typography stable, make taps respond quickly, and avoid interstitials that cover the content a person came to read. Aligns the work with the user journey and you also align it with what Search is trying to reward. Hacked or broken pages are a separate emergency; they hurt experience and trust at the same time and should be handled first."
        },
        {
          type: "p",
          text: "Для команды это означает простую дисциплину. Используйте одни и те же шаблоны в проверке, не гонитесь за разовой зеленой оценкой, и не путайте реклама или активность в сетях с работой над скоростью и стабильностью. Взаимодействия на странице должны оставаться быстрыми и предсказуемыми, даже когда маркетинг добавляет новый блок. Так опыт страницы остается управляемым, а не случайным побочным эффектом релизов."
        },
        {
          type: "p",
          text: "Keeping the program alive is the part most teams skip. A good quarter is not a reason to stop measuring. New ads, a new design system, a new A/B test or a new third-party tag can undo the previous work in a week. The checker you use matters less than the habit: after a release, look at the same templates, compare the new field data with the last period, and help engineering see a concrete URL rather than a slogan about “Core Web Vitals.” If more than one template moved in the wrong direction, start with the shared component."
        },
        {
          type: "p",
          text: "Webmaster reports and site-wide averages can hide a single heavy website section. A blog may look fine while the checkout or the article template is not. Are the worst pages also the pages that get Search traffic? If they are, they go first. If they are not, they still deserve a fix, but they should not jump the queue ahead of the main landing experience. Tools are there to help you see that difference, not to produce a badge for a slide."
        },
        {
          type: "p",
          text: "SEO still matters in this conversation, because a delayed or jumpy page wastes the click that a snippet just earned. But the language that works with designers is the user’s language: the page is slow, the button is late, the banner pushes the text down. Translate the metric into that language and the work gets done faster. Video demos of a shift or a slow paint are often more persuasive than a table. Use them when a debate gets stuck."
        }
      ]
    },
    {
      id: "crawling-indexing-and-vitals",
      title: "How crawling, indexing and page experience work together on a real website",
      tocLabel: "Crawling, indexing and vitals",
      blocks: [
        {
          type: "p",
          text: "Page experience does not replace crawling and indexing, and it does not start before the page can be fetched. If sitemaps, robots rules or a blocked resource prevent a template from being rendered as a user would see it, the lab and the field will tell different stories. Webmaster tools can show whether Search can still get the page; the vitals then show how that page behaves. Improve the fetch first if the template is not reliably available, then improve the experience."
        },
        {
          type: "p",
          text: "A site with a clean information architecture is easier to keep fast. Fewer duplicate URLs, a stable canonical, and a predictable template mean less surprise work for both crawling and the browser. Links inside the website should point to the same templates you actually measure. If marketing lands traffic on a one-off event page that was never in the checker, the ranking conversation becomes noisy. All important entry pages should be in the regular review."
        },
        {
          type: "p",
          text: "Video, large carousels and third-party tags are common reasons a website feels heavier than the design file suggested. They can still be used, but they should not block the main content or push it down after the first paint. Help the user see the answer first, then enhance. For the business this is also a conversion topic: a late banner can hurt both the vital and the first click on the page. The best ranking outcome is a side effect of that discipline, not a substitute for it."
        },
        {
          type: "p",
          text: "Для пользователя тот же принцип звучит проще. Страница должна быстро показать смысл, не прыгать и откликаться на действие. Если это есть, и поиск, и человек получают лучшего входа. Если нет, сначала чинят шаблон, а не ищут отдельный «фактор page experience» в отрыве от верстки."
        }
      ]
    },
    {
      id: "reliznyy-ritm",
      title: "Как встроить проверку опыта страницы в обычный релизный ритм",
      tocLabel: "Релизный ритм",
      blocks: [
        {
          type: "p",
          text: "Релизный ритм здесь важнее отдельного audita. Перед выкладкой большого изменения шаблона смотрят лабораторный прогон ключевых URL, после выкладки — полевые данные и несколько живых устройств. Если метрики поехали, изменение откатывают или чинят в том же цикле, а не оставляют «до следующего спринта». Так опыт страницы перестает быть аварийной темой раз в полгода и становится обычной гигиеной, как проверка форм или авторизации."
        },
        {
          type: "p",
          text: "Для продуктовой команды полезно держать короткий список неразрушаемых правил: не закрывать основной контент окном без крайней нужды, не грузить главный экран тяжелым медиа без размера, не блокировать ввод долгим скриптом, не сдвигать уже видимый текст поздним баннером. Эти правила понятны без специальной SEO-лексики и обычно закрывают большую часть регрессов. Когда они соблюдаются, и лабораторные, и полевые показатели ведут себя спокойнее, а человеку проще пользоваться страницей, на которую он пришел из поиска."
        },
        {
          type: "p",
          text: "Такую дисциплину стоит закрепить в рабочем соглашении между редакций, разработкой и маркетингом: кто может добавить виджет, кто проверяет шаблон, что считается блокирующим регрессом, и как быстро его откатывают. Когда это соглашение работает, опыт страницы перестает зависеть от героизма одного специалиста и начинает держаться сам. Для поиска и для людей результат один и тот же — страница открывается предсказуемо и не мешает прочитать ответ, ради которого человек пришел."
        },
        {
          type: "p",
          text: "На практике достаточно одного общего чек-листа на релиз и одного короткого разбора после выкладки. Если оба шага входят в привычку, отдельные «проекты по page experience» почти не нужны. Нужны только исключения: крупный редизайн, смена рекламной сетки, новый конструктор баннеров. Их заранее включают в тот же контур проверки, а не разбирают постфактум, когда полевые данные уже просели и часть аудитории успела уйти обратно в выдачу."
        },
        {
          type: "p",
          text: "Именно поэтому эту тему лучше держать рядом с релизным процессом, а не в отдельной презентации «когда будет время». Время появляется само, если проверка уже стоит в чек-листе. Если её каждый раз приходится назначать отдельно, она снова выпадет на первом же срочном баннере. Спокойный, повторяемый порядок здесь ценнее любого разового рывка к зеленому отчету."
        },
        {
          type: "p",
          text: "В таком режиме даже крупный редизайн перестает быть сюрпризом: его заранее раскладывают по шаблонам, проверяют до выкладки и оставляют короткий план отката, если полевые данные пойдут не туда. Это обычная инженерная осторожность, просто поводом для неё стали сигналы опыта страницы и то, как человек встречает результат поиска."
        },
        {
          type: "p",
          text: "Так команда сохраняет контроль над темой и не возвращается к ней только после жалоб на «внезапно медленный сайт»."
        },
        {
          type: "p",
          text: "Это и есть рабочий результат: предсказуемая страница и спокойный процесс вокруг неё."
        },
        {
          type: "p",
          text: "Именно к этому обычно и стоит идти."
        }
      ]
    },
    {
      id: "bannery-i-skripty",
      title: "Как баннеры, согласие на cookie и сторонние скрипты бьют по опыту страницы",
      tocLabel: "Баннеры и скрипты",
      blocks: [
        {
          type: "p",
          text: "Часто шаблон страницы сам по себе относительно спокоен, а опыт портится слоями поверх него. Баннер согласия на cookie, рекламные слоты, чат, виджет обратного звонка, инструмент A/B-тестов и длинная цепочка в диспетчере тегов приходят уже после того, как человек открыл результат из поиска. Именно эти слои чаще всего объясняют, почему лабораторный прогон выглядит терпимо, а полевые данные по [Core Web Vitals](/slovar/core-web-vitals/) — нет."
        },
        {
          type: "p",
          text: "Баннер согласия особенно коварен, если он появляется с задержкой и сдвигает основной текст. Тогда растёт [CLS](/slovar/cls/): человек уже начал читать, а блок внезапно отъезжает. Если баннер большой и перекрывает первый экран, он может задержать [LCP](/slovar/lcp/). Если поверх текста нельзя кликнуть, пока не закроется слой, страдает [INP](/slovar/inp/). То же бывает с рекламой без заранее зарезервированной высоты: креатив дорисовывается позже и толкает абзац вниз."
        },
        {
          type: "p",
          text: "Сторонние скрипты конкурируют за основной поток браузера. В лаборатории часто отключают часть расширений и режут набор тегов, а у живого посетителя из поиска контейнер уже полный. Поэтому полевая отзывчивость почти всегда жёстче лабораторной. Прежде чем добавить ещё один маркетинговый пиксель на посадочную, которую ведут из выдачи, стоит спросить, что этот код сделает с первым экраном и с первым действием человека — прокруткой, закрытием баннера, нажатием на пункт меню."
        },
        {
          type: "callout",
          variant: "important",
          text: "Нельзя судить об опыте страницы только по «чистому» лабораторному профилю, если в продакшене посетитель из поиска всегда получает баннер, рекламу и чат. Смотрят ту сборку, которую реально отдаёт сайт."
        },
        {
          type: "table",
          caption: "Какие надстройки чаще всего портят сигналы опыта страницы",
          textOnly: true,
          head: ["Источник", "Какой сигнал чаще страдает", "Что проверить первым"],
          rows: [
            ["Баннер согласия, который дорисовывается после текста", "Стабильность вёрстки", "Есть ли место под баннер заранее и не скачет ли текст после ответа человека"],
            ["Рекламный блок без зарезервированной высоты", "Стабильность вёрстки", "Стоит ли каркас слота до загрузки креатива"],
            ["Тяжёлый чат или виджет звонка на первом экране", "Отзывчивость", "Можно ли подгружать его после жеста, а не сразу всем"],
            ["Диспетчер тегов с длинной цепочкой пикселей", "Отрисовка и отзывчивость", "Что реально стреляет на посадочной из поиска, а не в пустом шаблоне"],
            ["Веб-шрифты и герой-изображение без приоритета", "Отрисовка основного содержимого", "Не блокирует ли шрифт текст и указан ли приоритет главному изображению"],
            ["Видео или карусель, которые стартуют сами", "Отрисовка и отзывчивость", "Можно ли отложить тяжёлое до действия человека"]
          ]
        },
        {
          type: "p",
          text: "Практический порядок здесь простой. Сначала смотрят, что видит человек в первые секунды после перехода из поиска: не перекрыт ли основной контент, не прыгает ли текст, не занят ли поток браузера чужими скриптами. Затем уже разбирают тонкую настройку шаблона. Если новый баннер или пиксель нужны маркетингу, их добавляют так, чтобы место было зарезервировано, а тяжёлый код не встречал каждого посетителя на первом экране. Иначе команда снова будет чинить [page experience](/slovar/page-experience/), который сломала не вёрстка, а набор надстроек."
        }
      ]
    },
    {
      id: "kak-prioritizirovat-url",
      title: "Как выбрать, какие адреса чинить сначала, если опыт страницы просел не везде",
      tocLabel: "Какие URL чинить сначала",
      blocks: [
        {
          type: "p",
          text: "Отчёт опыта страницы в Search Console и полевые группы показывают не один балл «на весь сайт», а срезы по шаблонам, устройствам и наборам адресов. Среднее по домену может быть спокойным, пока именно категории, карточки товара или статьи, которые получают клики из поиска, остаются слабыми. Чинить «весь сайт сразу» в такой ситуации обычно значит распылить усилия и не сдвинуть то, что реально видно в search results."
        },
        {
          type: "p",
          text: "Сначала берут шаблоны с заметным поисковым трафиком и плохими полевыми данными на телефоне — именно их чаще открывают из выдачи. Редкий внутренний URL в красной зоне менее срочен, чем шаблон раздела или карточки, который открывают каждый день. Лабораторный прогон [PageSpeed Insights](/slovar/pagespeed-insights/) помогает понять причину на конкретном шаблоне, но вывод «мы починили опыт» делают по полевым данным, когда наберётся достаточно визитов. Один лабораторный снимок после релиза этого не заменяет."
        },
        {
          type: "p",
          text: "Имеет смысл держать короткий список шаблонов, а не бесконечный реестр всех слабых URL. Для каждого шаблона фиксируют, какой сигнал просел, какая надстройка или элемент вёрстки это объясняет, и что меняют в коде. После выкладки смотрят, не разъехался ли тот же шаблон на мобильном и на десктопе по-разному. Если полевые данные позже подтверждают улучшение, шаблон можно убрать из срочного списка и не возвращаться к нему, пока не появится новый баннер, шрифт или виджет."
        },
        {
          type: "p",
          text: "Опыт страницы не отменяет обход и индексацию: слабую по удобству страницу поиск может по-прежнему найти. Но человеку из выдачи с такой страницей чаще хочется вернуться к результатам. Поэтому приоритет — у адресов, которые уже получают показы и клики, а не у тех, которые команда только собирается «дожать» лабораторным баллом. Так работа над page experience остаётся продуктовой и поисковой сразу, а не отдельным конкурсом на красивый отчёт."
        },
        {
          type: "flow",
          caption: "Как обычно собирают очередь на ремонт опыта страницы",
          steps: [
            { label: "Смотрят полевые группы по шаблонам и устройствам", note: "не один средний балл на весь домен" },
            { label: "Берут шаблоны с кликами из поиска и слабыми сигналами", note: "сначала то, что уже видно в выдаче" },
            { label: "Прогоняют типичный URL шаблона в лаборатории", note: "чтобы понять причину, а не чтобы получить самоцель из ста баллов" },
            { label: "Чинят шаблон и связанные надстройки", note: "баннер, слот, шрифт, скрипт, изображение" },
            { label: "Ждут обновления полевых данных", note: "лабораторный прогон сразу после релиза ещё не доказывает эффект" }
          ]
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
    },
    {
      q: "Нужно ли отдельно оптимизировать рекламные посадочные под опыт страницы?",
      a: "Если на эти страницы люди тоже приходят из поиска, да: для них действуют те же сигналы, что и для органических посадочных. Если страница живёт только в рекламе, опыт всё равно влияет на отказ и конверсию, но это уже не отчёт Page Experience в Search Console. Практично держать общий стандарт шаблона, а не плодить «облегчённую» рекламную копию, которая потом случайно начнёт ранжироваться."
    }
  ],
  datePublished: "2026-11-26",
  dateModified: "2026-11-27"
};
