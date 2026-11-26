import type { GlossaryTerm } from "../types";

/**
 * Бриф: кабинет #428 «CLS».
 * Google MSK TOP-20, history 103927, запрос «cumulative layout shift», 19.11.2026.
 */
export const CLS: GlossaryTerm = {
  slug: "cls",
  term: "CLS",
  aliases: [
    "cls",
    "cumulative layout shift",
    "метрика cls",
    "cumulative layout shift cls"
  ],
  categoryId: "tekhnicheskiy-seo-i-indeksatsiya",
  h1: "CLS: что такое Cumulative Layout Shift и как убрать неожиданные сдвиги вёрстки",
  seoTitle: "CLS: что такое Cumulative Layout Shift, как измерять и как снизить сдвиги макета",
  seoDescription: "CLS (Cumulative Layout Shift) — метрика Core Web Vitals о визуальной стабильности страницы. Что считается layout shift, как смотреть cls score и какие приёмы обычно убирают сдвиги.",
  short: "CLS (Cumulative Layout Shift) — это метрика [Core Web Vitals](/slovar/core-web-vitals/), которая показывает, насколько страница визуально «прыгает», пока пользователь её читает или собирается нажать. Если изображение, баннер, шрифт или вставленный блок сдвигают уже видимый контент, растёт layout shift score. Для SEO и удобства важен не сам факт анимации, а неожиданный сдвиг без действия человека.",
  definition: "CLS суммирует неожиданные сдвиги видимых элементов за время загрузки и использования страницы. Входит в Core Web Vitals вместе с [LCP](/slovar/lcp/) и [INP](/slovar/inp/). Хорошим ориентиром считают пороги, которые публикует Google для полевых данных: смотрят долю реальных заходов, а не только лабораторный тест на одном быстром компьютере.",
  sections: [
    {
      id: "chto-takoe",
      title: "Что такое Cumulative Layout Shift",
      tocLabel: "Определение",
      blocks: [
        {
          type: "p",
          text: "Cumulative Layout Shift отвечает на простой вопрос: остаётся ли видимая область стабильной, или элементы внезапно смещаются. Браузер фиксирует layout shift, когда видимый элемент меняет своё положение без предшествующего действия пользователя. Несколько таких сдвигов складываются в итоговый cls score."
        },
        {
          type: "p",
          text: "Важно отличать ожидаемое движение от неожиданного. Если человек сам раскрыл аккордеон, открыл меню или нажал «показать ещё», последующее смещение обычно не считают проблемой метрики. Неожиданный layout shift возникает, когда контент сдвигается сам: подгрузилось изображение без размеров, вставилась реклама, подключился web font другого метрического размера, сверху появился баннер согласия."
        }
      ]
    },
    {
      id: "kak-schitaetsya",
      title: "Как считается layout shift и cls score",
      tocLabel: "Как считается",
      blocks: [
        {
          type: "p",
          text: "Каждый сдвиг оценивают по двум составляющим: какая доля видимой области сдвинулась и на какое расстояние. Затем отдельные unexpected layout shifts за сессию складывают. Поэтому один крупный прыжок героя может испортить показатель сильнее, чем несколько мелких подёргиваний в подвале, которые пользователь почти не заметил."
        },
        {
          type: "p",
          text: "В полевых данных смотрят не «идеальный» лабораторный кадр, а то, как страница ведёт себя у реальных людей: на разных экранах, с разной сетью и с разным набором баннеров. Лаборатория полезна как лупа: она помогает воспроизвести cause layout shift, но не заменяет real user monitoring и отчёт Core Web Vitals."
        },
        {
          type: "callout",
          variant: "tip",
          text: "CLS — про визуальную стабильность, а не про «скорость загрузки вообще». Страница может быстро показать основной контент по LCP и при этом сильно прыгать, если ниже или выше него догружаются блоки без зарезервированного места."
        }
      ]
    },
    {
      id: "typichnye-prichiny",
      title: "Что обычно вызывает unexpected layout shifts",
      tocLabel: "Типичные причины",
      blocks: [
        {
          type: "p",
          text: "Чаще всего виноваты не «магические алгоритмы», а конкретные детали вёрстки и загрузки."
        },
        {
          type: "ul",
          items: [
            "Изображения, видео и iframe без ширины и высоты: браузер сначала рисует текст, затем image loads и push content вниз.",
            "Баннеры, встраиваемая реклама и динамические вставки, которые появляются после первого кадра и не имеют резерва места.",
            "Web fonts и font loading: fallback font меняется на основной, строка становится длиннее или короче, заголовок прыгает. Помогают font display и близкий fallback.",
            "Dynamic content, который вставляют над уже видимым блоком: уведомление, бар акции, отложенная шапка.",
            "Lazy loading, который применяют неаккуратно: плейсхолдер меньше реального файла, и при подгрузке контент сдвигается.",
            "Клиентский рендер и поздние компоненты в [JavaScript SEO](/slovar/javascript-seo/): блок появляется только после скрипта и раздвигает соседние элементы."
          ]
        },
        {
          type: "flow",
          caption: "Как обычно разбирают плохой CLS",
          steps: [
            {
              label: "Смотрят полевые данные",
              note: "какая доля визитов получает высокий cls score"
            },
            {
              label: "Находят сдвигающийся элемент",
              note: "какой блок, изображение или шрифт даёт layout shift"
            },
            {
              label: "Проверяют резерв места",
              note: "есть ли width and height, aspect-ratio, место под баннер"
            },
            {
              label: "Смотрят шрифты и поздние вставки",
              note: "font loading, font display, dynamic content после загрузки"
            },
            {
              label: "Перепроверяют на реальных устройствах",
              note: "особенно на мобильной вёрстке и медленной сети"
            }
          ]
        }
      ]
    },
    {
      id: "kak-izmerit",
      title: "Как измерять CLS",
      tocLabel: "Как измерять",
      blocks: [
        {
          type: "p",
          text: "Для живого сайта смотрят полевые данные: отчёт Core Web Vitals в [PageSpeed Insights](/slovar/pagespeed-insights/) и Search Console, иногда свою телеметрию real user monitoring. Лаборатория хороша, чтобы увидеть конкретный сдвиг в записи: какой элемент уехал, на каком этапе page load это случилось, был ли это post load cls после взаимодействия или сдвиг во время первой отрисовки."
        },
        {
          type: "p",
          text: "Если лабораторный балл спокойный, а полевые данные плохие, часто виноваты реальные баннеры, A/B-виджеты, web fonts на слабых устройствах или другой набор блоков в мобильной вёрстке. [Адаптивная вёрстка](/slovar/adaptivnaya-verstka/) здесь важна не меньше, чем «оптимизация скорости»: на узком экране тот же баннер даёт более заметный shift metric."
        },
        {
          type: "table",
          caption: "Что чаще всего портит CLS и куда смотреть",
          head: [],
          rows: [
            [
              "Причина",
              "Что происходит",
              "Как это обычно видно",
              "Что делать в первую очередь"
            ],
            [
              "Картинка или видео без размеров",
              "элемент появляется позже и раздвигает текст",
              "layout shift в момент, когда image loads",
              "заранее задать width and height или соотношение сторон"
            ],
            [
              "Реклама и встраиваемые блоки",
              "iframe или баннер вставляется в готовую колонку",
              "поздний сдвиг в середине статьи или в шапке",
              "зарезервировать место под слот, не вставлять выше видимого текста"
            ],
            [
              "Web fonts другого размера",
              "fallback font сменяется основным",
              "прыжок заголовка и абзацев после font loading",
              "подобрать близкий запасной шрифт, аккуратно использовать font display"
            ],
            [
              "Dynamic content сверху",
              "уведомление или бар выталкивает контент вниз",
              "сдвиг сразу после page load или post load",
              "резерв места либо наложение, которое не двигает основной поток"
            ],
            [
              "Неаккуратный lazy loading",
              "плейсхолдер меньше реального блока",
              "сдвиг, когда loading content догружается",
              "держать ту же высоту, не откладывать элементы первого экрана"
            ]
          ],
          textOnly: true,
          note: "Сначала находят сам сдвигающийся элемент, потом уже спорят о «производительности сайта вообще»."
        }
      ]
    },
    {
      id: "kak-uluchshit",
      title: "Как снизить CLS на практике",
      tocLabel: "Как улучшить",
      blocks: [
        {
          type: "p",
          text: "Практичный набор приёмов обычно короче, чем кажется из длинных гайдов. Для изображений и встраиваемых блоков задают размеры или aspect-ratio, чтобы браузер заранее reserve space. Для рекламы оставляют минимальную высоту слота, даже если креатив ещё не пришёл. Для шрифтов выбирают fallback близкого размера и не полагаются на резкую смену гарнитуры в первом экране; осторожно применяют font-display, чтобы текст не «прыгал» после подключения файла."
        },
        {
          type: "p",
          text: "Новый контент лучше не вставлять над тем, что человек уже видит, если он сам этого не запросил. Анимации трансформацией обычно безопаснее, чем сдвиг соседних блоков изменением высоты. Если шаблон собирается скриптами, критичные контейнеры должны иметь высоту уже в исходном HTML, а не появляться пустыми и затем раздуваться."
        },
        {
          type: "p",
          text: "Перепроверка обязательна в поле: после правок смотрят не только лабораторную запись, но и то, как изменился cls score у реальных пользователей. Иногда «починили» десктоп, а мобильная карточка товара по-прежнему прыгает из-за галереи."
        }
      ]
    },
    {
      id: "angliyskie-terminy",
      title: "Как читать англоязычные формулировки вокруг CLS",
      tocLabel: "Англоязычные формулировки",
      blocks: [
        {
          type: "p",
          text: "В документации и отчётах по web performance чаще встречаются английские словосочетания. Их полезно понимать буквально, а не заучивать как «секреты ранжирования»."
        },
        {
          type: "table",
          caption: "Какие английские термины встречаются в отчётах по CLS",
          head: [],
          rows: [
            [
              "Термин",
              "Что обычно имеют в виду",
              "Где смотрят",
              "Что с этим делать"
            ],
            [
              "Cumulative Layout Shift, CLS",
              "сумма неожиданных сдвигов видимых элементов",
              "Chrome, PageSpeed, field data",
              "measure CLS на реальной page, не только в лаборатории"
            ],
            [
              "layout shift / unexpected layout shifts",
              "конкретное смещение блока без действия пользователя",
              "performance panel, запись загрузки",
              "найти element, который cause layout shift"
            ],
            [
              "cls score / layout shift score",
              "числовая оценка стабильности",
              "web vitals отчёт, Search Console",
              "сравнивать field data, а не один лабораторный прогон"
            ],
            [
              "width and height attributes",
              "заранее заданные размеры медиа",
              "html, css, шаблон",
              "reserve space, чтобы image loads не push content"
            ],
            [
              "web fonts, font loading, font display",
              "смена шрифта после загрузки файла",
              "network, computed styles",
              "ближе fallback font, аккуратный font display"
            ],
            [
              "dynamic content, lazy loading",
              "поздние вставки и отложенная загрузка",
              "запись после page load и post load cls",
              "не вставлять блоки над видимым контентом без места"
            ],
            [
              "Core Web Vitals, user experience",
              "набор метрик удобства, включая visual stability",
              "отчёты Google и Chrome",
              "смотреть CLS вместе с LCP и INP"
            ],
            [
              "real user monitoring, web performance",
              "полевые данные реальных заходов",
              "RUM, CrUX, Search Console",
              "чинить то, что видно пользователям, не только lab score"
            ]
          ],
          textOnly: true,
          note: "Английские формулировки описывают тот же сдвиг вёрстки, а не отдельную «секретную» метрику."
        },
        {
          type: "p",
          text: "В лабораторных инструментах часто пишут про best practices: задайте width and height attributes, не допускайте, чтобы ads или embed push content, проверяйте font loading и critical fonts первого экрана. Это рабочие инженерные советы, а не список «факторов Google», который можно закрыть галочками в чек-листе."
        }
      ]
    },
    {
      id: "svyaz-s-seo",
      title: "Как CLS связан с SEO и опытом страницы",
      tocLabel: "Связь с SEO",
      blocks: [
        {
          type: "p",
          text: "Google использует сигналы опыта страницы, и CLS входит в Core Web Vitals как мера визуальной стабильности. Это не значит, что одна «зелёная» цифра гарантирует рост позиций. Скорее, нестабильная вёрстка мешает человеку читать и кликать, повышает случайные нажатия и ухудшает впечатление от страницы. Поэтому метрику смотрят вместе с содержанием, удобством на мобильном и другими web vitals, а не как единственный рычаг ранжирования."
        },
        {
          type: "p",
          text: "Практичный ориентир такой: если полевой cls score систематически плохой на важных шаблонах, это чинят как дефект интерфейса. Если лаборатория ругается на редкий виджет, который почти не встречается в реальных визитах, сначала сверяют field data."
        }
      ]
    },
    {
      id: "documentaciya-en",
      title: "How teams read CLS in English reports and docs",
      tocLabel: "Документация на английском",
      blocks: [
        {
          type: "p",
          text: "Reports and docs usually talk about Cumulative Layout Shift as a visual stability metric, not as a generic speed score. A good page can render the main content quickly and still fail CLS if late banners, web fonts or unsized media push content after the first paint. When you measure CLS, compare field data from real users with a lab recording that shows which element moves and when the layout shift happens."
        },
        {
          type: "p",
          text: "A practical debug path looks like this. First see whether the cls score is poor on the live website or only in one lab run. Then use the performance panel or similar tools to find the element that causes unexpected layout shifts. If an image or embed has no size, add width and height attributes or another way to reserve space before the resource loads. If font loading changes the text metrics, pick a closer fallback and be careful with font display. If dynamic content is added at the top of the page, do not let it push content that the user already started to read."
        },
        {
          type: "p",
          text: "These best practices show up again and again in web performance writing: reserve space for media and ads, avoid inserting blocks above existing content, test font loading, and re-check the fix on a real mobile page. Lighthouse and other lab tools can help you reproduce issues, but they do not replace real user monitoring. Google uses field data when it looks at Core Web Vitals, so a free local test is only a starting point."
        },
        {
          type: "p",
          text: "You can also learn which layout changes happen after load. Some cls issues appear during the initial page load, while post load cls happens later, when a banner, cookie bar or lazy block is added. In both cases the site should keep the visible container stable. Animations that move a box by transforming it are often less harmful than height changes that shift everything below. If you need to inject new content, do it after a click or in a reserved container so the rest of the text does not jump."
        },
        {
          type: "p",
          text: "For editorial and product teams this is a user experience problem first. A late layout shift can cause a mis-click, hide the main text, or make a form feel unstable. SEO teams still watch the metric because it is part of Core Web Vitals, but the fix is engineering: dimensions, space, fonts, and late injections. Optimize the template that real users see, then wait for new field data instead of chasing one lab example."
        },
        {
          type: "p",
          text: "Common lab notes also mention the browser, the URL of the shifting resource, and how images, video and iframes get their size. If the img or video element has no dimensions, the website cannot reserve a stable box, and later rendering will have a visible impact. Set width and height, or a CSS aspect ratio, so the container does not change when the file arrives. This prevents a late shift during scroll and makes the page easier to use on a small device."
        },
        {
          type: "p",
          text: "Teams that track Core Web Vitals often ask why the lab result and the field result look different. The answer is usually more than one issue at a time: ads, embeds, cookie UI, web fonts and client rendering all can move the layout. Improve the template that most users open, support the same fix on mobile, and give the new field data time to update. Do not treat a single Lighthouse example as the whole picture, even if the tool is useful to reproduce the bug."
        },
        {
          type: "p",
          text: "A short checklist helps editors and developers talk about the same issues. Ensure images have a placeholder of the expected size. Do not swap a fallback font for a much larger one in the first screen. Reduce unexpected movement around a button or a form, because a late shift can affect visitors and cause a mis-click. Layout shifts occur at some distance from the trigger, so calculate which container actually moved, not only the element that loaded. These are common, practical steps; they do not require a special blog of “secret CLS solutions”, just careful rendering on the pages people use."
        }
      ]
    }
  ],
  modules: {
    id: "cls-titlo",
    title: "Какие инструменты Титло помогают не забыть о стабильности вёрстки",
    intro: "CLS считают по реальным заходам и по лаборатории. На сайте полезно найти, какой блок сдвигает контент, и не оставлять «прыгающие» шаблоны без резерва места.",
    items: [
      {
        slug: "audit-sajta",
        title: "Аудит сайта",
        text: "Помогает увидеть технические проблемы шаблона, которые часто соседствуют со сдвигами: тяжёлые страницы, ошибки, нестабильные блоки."
      },
      {
        slug: "http-headers",
        title: "HTTP-заголовки",
        text: "Полезно проверить кэширование шрифтов и статики: от повторной загрузки web fonts нередко зависит, появится ли сдвиг при отрисовке текста."
      }
    ]
  },
  related: [
    "Core Web Vitals",
    "LCP",
    "INP",
    "PageSpeed Insights",
    "Адаптивная вёрстка",
    "JavaScript SEO"
  ],
  takeaways: [
    "CLS измеряет неожиданные сдвиги видимых элементов, а не любую анимацию и не скорость загрузки вообще.",
    "В итоговом cls score важнее крупные прыжки без действия пользователя, чем мелкие движения после клика.",
    "Частые причины — медиа без размеров, баннеры, web fonts и dynamic content, вставленный сверху.",
    "Смотрят и лабораторию, и полевые данные: реальные баннеры и мобильная вёрстка часто расходятся с тестовым прогоном.",
    "Для SEO метрика входит в Core Web Vitals, но её чинят как проблему удобства, а не как единственный фактор позиций."
  ],
  faq: [
    {
      q: "Чем CLS отличается от LCP и INP?",
      a: "LCP говорит, когда появился основной контент, INP — насколько отзывчива страница на действия, CLS — не прыгает ли уже видимая вёрстка. Это разные стороны опыта: скорость появления, реакция на ввод и визуальная стабильность."
    },
    {
      q: "Считается ли сдвиг, если пользователь сам нажал кнопку?",
      a: "Ожидаемое движение после явного действия обычно не портит метрику так, как внезапный прыжок без запроса человека. Проблема — unexpected layout shifts: баннер, картинка или шрифт, которые сдвигают текст сами."
    },
    {
      q: "Нужно ли убирать lazy loading, чтобы исправить CLS?",
      a: "Не обязательно. Lazy loading вредит, когда плейсхолдер меньше реального блока или когда так откладывают элементы первого экрана. Если место зарезервировано и высота стабильна, отложенная загрузка сама по себе не обязана давать сдвиг."
    },
    {
      q: "Почему в лаборатории CLS хороший, а в Search Console — нет?",
      a: "В поле могут быть другие баннеры, шрифты, A/B-виджеты и мобильные шаблоны. Лаборатория не всегда воспроизводит post load cls и реальную рекламу. Ориентир для живого сайта — field data и real user monitoring."
    },
    {
      q: "Поможет ли CLS, если просто поставить всем картинкам ширину и высоту?",
      a: "Это один из самых полезных шагов, но не единственный. Остаются web fonts, вставки над контентом, iframe и динамические блоки. Сначала находят, какой элемент даёт сдвиг, и уже под него reserve space."
    }
  ],
  datePublished: "2026-11-26",
  dateModified: "2026-11-26"
};
