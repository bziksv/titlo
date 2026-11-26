import type { GlossaryTerm } from "../types";

/**
 * Бриф: кабинет #426 «LCP».
 * Google MSK TOP-20, history 103893, запрос «largest contentful paint», 19.11.2026.
 */
export const LCP: GlossaryTerm = {
  slug: "lcp",
  term: "LCP",
  aliases: [
    "lcp",
    "largest contentful paint",
    "метрика lcp",
    "largest contentful paint google"
  ],
  categoryId: "tekhnicheskiy-seo-i-indeksatsiya",
  h1: "LCP: что такое Largest Contentful Paint и как улучшить отрисовку основного содержимого",
  seoTitle: "LCP: что такое Largest Contentful Paint, как измерять и как улучшать метрику",
  seoDescription: "LCP (Largest Contentful Paint) — метрика Core Web Vitals о том, как быстро на экране появляется основной контент. Что считается LCP-элементом, как измерять показатель и что обычно его замедляет.",
  short: "LCP (Largest Contentful Paint) — это метрика [Core Web Vitals](/slovar/core-web-vitals/), которая показывает, как быстро в видимой области экрана отрисовывается самый крупный элемент содержимого: обычно это изображение-герой, большое видео или крупный текстовый блок. Чем раньше пользователь видит основной контент, тем меньше ощущение, что страница «ещё грузится». Для SEO и удобства LCP важна как часть опыта загрузки, а не как отдельный «магический балл».",
  definition: "LCP — время от начала загрузки страницы до момента, когда отрисован самый большой элемент в видимой области. Входит в Core Web Vitals вместе с INP и CLS. Обычно хорошим ориентиром считают пороги, которые публикует Google для полевых данных: нужно, чтобы большая доля реальных заходов укладывалась в рекомендуемый диапазон, а не только лабораторный тест в идеальных условиях.",
  sections: [
    {
      id: "chto-takoe",
      title: "Что такое Largest Contentful Paint",
      tocLabel: "Определение",
      blocks: [
        {
          type: "p",
          text: "Largest Contentful Paint отвечает на простой вопрос: когда пользователь наконец видит основное содержимое, а не только фон и служебную оболочку. Браузер следит за элементами в видимой области и фиксирует время, когда появился самый крупный из них. Этот элемент называют LCP-элементом или LCP candidate: часто это главное изображение, но может быть и блок заголовка, если картинки в первом экране нет."
        },
        {
          type: "p",
          text: "LCP — часть web vitals, а не отдельный «тест картинки». Метрика связана с пользовательским опытом загрузки: человек оценивает скорость не по тому, когда докачался последний скрипт, а по тому, когда на экране появилось то, ради чего он открыл страницу. По данным Wordstat за период 23.10–21.11.2026 запрос «lcp» показал 5 510 показов и сам по себе шумный, более точные «largest contentful paint» и «метрика lcp» — 152 и 29. Для работы используют полное имя метрики, чтобы не смешать её с другими аббревиатурами и, тем более, с CMS Contentful: в выдаче по английскому названию иногда всплывают страницы про эту платформу, хотя речь о времени отрисовки."
        },
        {
          type: "callout",
          variant: "important",
          text: "Лабораторный тест в [PageSpeed Insights](/slovar/pagespeed-insights/) или Lighthouse полезен, чтобы найти причину, но решение принимают по field data — данным реальных пользователей. Условия сети, устройства и кэш на живом трафике отличаются от тестового прогона."
        },
        {
          type: "flow",
          caption: "Как обычно разбирают плохой LCP",
          steps: [
            {
              label: "Смотрят полевые данные",
              note: "какая доля визитов не укладывается в рекомендуемый порог"
            },
            {
              label: "Находят LCP-элемент",
              note: "какое изображение, блок или текст фиксируется как самый крупный"
            },
            {
              label: "Разбирают этапы загрузки",
              note: "ответ сервера, CSS, шрифты, очередь ресурса, сама отрисовка"
            },
            {
              label: "Убирают задержки",
              note: "сжимают и правильно отдают элемент, не откладывают его скриптами"
            },
            {
              label: "Перепроверяют на реальных устройствах",
              note: "особенно на мобильной сети, не только на быстром десктопе"
            }
          ]
        }
      ],
      subsections: [
        {
          title: "Что может быть LCP-элементом и чего метрика не считает",
          blocks: [
            {
              type: "p",
              text: "Чаще всего LCP — это изображение в первом экране, включая картинку в CSS-фоне, если она фактически является основным содержимым, либо крупный текстовый блок. Не всякая большая картинка внизу страницы попадает в расчёт: важна видимая область в момент загрузки. Элемент может смениться, пока страница грузится: сначала крупным был заголовок, затем подгрузилось геро-изображение и стало новым кандидатом."
            },
            {
              type: "p",
              text: "Метрика не равна «полной загрузке всего». Скрипты в подвале, виджеты ниже сгиба и отложенные изображения вне первого экрана влияют на LCP только если они мешают появлению самого элемента: блокируют рендер, отбирают сеть, сдвигают очередь. Поэтому оптимизацию начинают с кандидата и его зависимости, а не с бесконечного сжатия всех файлов подряд."
            },
            {
              type: "table",
              caption: "Что чаще всего портит LCP и куда смотреть",
              head: [],
              rows: [
                [
                  "Причина",
                  "Что происходит",
                  "Как это обычно видно",
                  "Что делать в первую очередь"
                ],
                [
                  "Медленный ответ сервера",
                  "документ долго не приходит, элемент не может начаться",
                  "большая доля времени уходит до первого байта",
                  "ускорить ответ, кэш, убрать лишние редиректы"
                ],
                [
                  "Поздний LCP-ресурс",
                  "изображение или шрифт начинают грузиться слишком поздно",
                  "ресурс не в приоритете, стоит ниже по очереди",
                  "заранее указать важный ресурс, не прятать его за скриптом"
                ],
                [
                  "Слишком тяжёлый файл",
                  "картинка огромного размера или без сжатия",
                  "долгий resource load самого элемента",
                  "уменьшить вес, отдать современный формат, верный размер под экран"
                ],
                [
                  "Блокирующие стили и скрипты",
                  "браузер ждёт CSS или JS, прежде чем нарисовать контент",
                  "элемент есть, но отрисовка откладывается",
                  "разгрузить критический путь, не блокировать первый экран"
                ],
                [
                  "Клиентский рендер без содержимого в HTML",
                  "основной блок появляется только после JavaScript",
                  "в исходном HTML нет того, что видит пользователь",
                  "отдать ключевой контент сразу, проверить [JavaScript SEO](/slovar/javascript-seo/)"
                ]
              ],
              textOnly: true,
              note: "Сначала находят сам LCP-элемент, потом уже спорят о «скорости сайта вообще»."
            }
          ]
        }
      ]
    },
    {
      id: "kak-izmerit",
      title: "Как измерять LCP",
      tocLabel: "Как измерять",
      blocks: [
        {
          type: "p",
          text: "Для живого сайта смотрят полевые данные: отчёт Core Web Vitals в Search Console, полевую часть PageSpeed Insights, иногда свою телеметрию реальных пользователей. Лаборатория хороша как лупа: она показывает, какой элемент выбран, сколько заняли ответ сервера, блокировка рендера и загрузка ресурса. Если лабораторный балл отличный, а полевые данные плохие, дело часто в реальных устройствах, географии и холодном кэше."
        },
        {
          type: "p",
          text: "Измерять нужно основные шаблоны: главная, статья, категория, карточка товара. У них разные герои-элементы и разная тяжесть. Мобильный LCP почти всегда важнее смотреть отдельно: на узком экране и слабой сети тот же ресурс ведёт себя иначе, особенно при [mobile-first индексации](/slovar/mobile-first-indeksatsiya/)."
        }
      ]
    },
    {
      id: "kak-uluchshit",
      title: "Как улучшать LCP, не ломая страницу",
      tocLabel: "Как улучшать",
      blocks: [
        {
          type: "p",
          text: "Главный принцип — основной контент должен появиться рано и без лишней очереди. Изображение первого экрана заранее готовят нужного размера, сжимают и не оставляют «на потом» в ленивой загрузке, если оно и есть LCP. Шрифты и критические стили не должны надолго оставлять экран пустым. Сервер и CDN должны быстро отдавать HTML и сам ресурс."
        },
        {
          type: "p",
          text: "Не стоит вырезать полезную картинку только ради метрики, если именно она несёт смысл первого экрана. Лучше правильно её отдавать. И не стоит бесконечно гнаться за лабораторной соткой, если полевые данные уже стабильно хорошие, а правки начинают ломать вёрстку. Цель — быстрый показ основного содержимого для живых пользователей."
        },
        {
          type: "callout",
          variant: "mistake",
          text: "Ошибка — ставить lazy-loading на геро-изображение, которое является LCP-элементом: браузер узнаёт о нём слишком поздно. Вторая ошибка — оптимизировать «весь сайт», так и не посмотрев, какой именно элемент фиксирует метрика."
        }
      ]
    },
    {
      id: "iz-chego-skladyvaetsya",
      title: "Из чего складывается Largest Contentful Paint",
      tocLabel: "Из чего складывается",
      blocks: [
        {
          type: "p",
          text: "Largest Contentful Paint измеряет, когда основной LCP element наконец отрисовался для пользователя. Обычно это largest element в видимой области: большое изображение, фоновой hero, видео-постер или крупный текстовый блок. Не любой элемент на странице становится LCP candidate: метрика смотрит на самый заметный контентный фрагмент, а не на мелкие иконки и не на то, что появилось далеко внизу."
        },
        {
          type: "p",
          text: "Задержку удобно разбирать на этапы. Сначала браузер ждёт ответ сервера и html document. Затем идёт resource load: нужно скачать LCP resource — часто это картинка или шрифт, без которого герой не рисуется. После загрузки ещё может быть render delay: ресурс уже есть, но основной поток занят скриптами, и отрисовка ждёт. Сумма этих пауз и даёт load time, который видит пользователь как «когда наконец появилась главная картинка»."
        },
        {
          type: "p",
          text: "Для изображений типичны слишком тяжёлый файл, отсутствие приоритета загрузки, background image вместо обычного img, позднее появление героя из JavaScript. Для текста мешают веб-шрифты и блокирующая вёрстка. Reduce the size изображения, заранее указать размеры, не откладывать LCP resource «на потом» и не прятать главный блок за тяжёлыми скриптами — обычные best practices, а не отдельный трюк ради метрики."
        }
      ]
    },
    {
      id: "pole-i-laboratoriya",
      title: "Чем отличаются полевые и лабораторные замеры LCP",
      tocLabel: "Поле и лаборатория",
      blocks: [
        {
          type: "p",
          text: "Лабораторный замер в Lighthouse или PageSpeed Insights полезен, чтобы воспроизвести проблему на конкретной странице и увидеть LCP element. Это лабораторные условия: устройство, сеть и сценарий заданы инструментом. Field data и реальный user experience могут отличаться: у живых посетителей другие экраны, другой кэш, другой LCP candidate. Поэтому measure LCP нужно и в лаборатории, и в поле."
        },
        {
          type: "p",
          text: "Полевые данные Core Web Vitals приходят из реальных визитов, часто через CrUX или собственные замеры. Если лабораторный отчёт хороший, а полевой LCP плохой, обычно виноваты тяжёлые изображения на реальных каналах, другое главное медиа на мобильном экране или редкий, но очень медленный шаблон. Если в лаборатории уже плохо, сначала исправляют очевидный resource load и render delay, затем снова смотрят поле."
        },
        {
          type: "table",
          caption: "Что обычно чинят, когда LCP высокий",
          head: [],
          rows: [
            [
              "Что видит замер",
              "Типичная причина",
              "Что проверить",
              "Какой шаг помогает"
            ],
            [
              "Долго нет ответа сервера",
              "медленный ответ или тяжёлый html document",
              "TTFB, кэш, очередь на бэкенде",
              "ускорить первый ответ, не раздувать документ"
            ],
            [
              "LCP resource грузится долго",
              "большое изображение или ролик без приоритета",
              "вес файла, формат, preload, lazy на герое",
              "reduce the size, дать приоритет главному ресурсу"
            ],
            [
              "Картинка есть, отрисовка ждёт",
              "render delay из-за длинных задач и скриптов",
              "основной поток, блокирующие скрипты",
              "отложить некритичный JS, не мешать отрисовке"
            ],
            [
              "В лаборатории одно, в поле другое",
              "другой LCP candidate или другие устройства",
              "field data, мобильный экран, герой в мобильной вёрстке",
              "смотреть реальный LCP element, не только лабораторный"
            ],
            [
              "Фоновой герой появляется поздно",
              "background image или картинка из скрипта",
              "как именно вставлен LCP resource",
              "отдать главное медиа обычным изображением и заранее"
            ]
          ],
          textOnly: true,
          note: "Цель — быстрее показать основной контент, а не «подогнать» один лабораторный балл."
        },
        {
          type: "p",
          text: "Связь с остальными Core Web Vitals прямая, но неполная. Улучшение LCP не гарантирует хороший INP и не заменяет работу с отрисовкой и стабильностью. Зато тяжёлая главная картинка часто портит и первое впечатление, и готовность страницы к взаимодействию. Поэтому LCP смотрят вместе с пользовательским опытом всей загрузки, а не как изолированный процент в отчёте."
        }
      ]
    },
    {
      id: "prioritet-resursa",
      title: "Как не спрятать LCP-элемент за скриптами и ленивой загрузкой",
      tocLabel: "Приоритет ресурса",
      blocks: [
        {
          type: "p",
          text: "Частая ошибка — повесить lazy-loading на главный герой или грузить LCP resource только после гидрации JavaScript. Тогда largest contentful paint ждёт не сеть саму по себе, а решение страницы «уже можно показать картинку». Для основного LCP element приоритет должен быть высоким: обычное изображение в разметке html document, корректные размеры, при необходимости осторожный preload, без отложенной загрузки героя."
        },
        {
          type: "p",
          text: "Background image усложняет диагностику: лаборатория может назначить LCP candidate иначе, чем ожидала команда, а resource load пойдёт по другому пути, чем у обычного img. Если главный визуал — именно фон первого экрана, его всё равно нужно отдать рано и в разумном размере. Reduce the size здесь не лозунг, а конкретная работа с форматом, сжатием и тем, не отдаётся ли десктопный файл на мобильный экран."
        },
        {
          type: "p",
          text: "Когда правят LCP, полезно каждый раз заново measure lcp и убедиться, что LCP element тот же, что вы хотели ускорить. Иначе оптимизируют второстепенную картинку, а полевой user experience по-прежнему ждёт другой largest element."
        }
      ]
    },
    {
      id: "terminy-dokumentacii",
      title: "Как LCP назван в документации и какие элементы смотрят инструменты",
      tocLabel: "Термины документации",
      blocks: [
        {
          type: "p",
          text: "В документации Google и в отчётах Chrome эта метрика называется Largest Contentful Paint и входит в Core Web Vitals и набор Web Vitals. Инструменты performance в браузере, Lighthouse, PageSpeed Insights и библиотека web-vitals помогают measure LCP, найти LCP element и понять, какой resource load и какой render delay тянут загрузку. Для developers это лабораторный и полевой отчёт по page experience, а не отдельный «балльный SEO-ритуал»."
        },
        {
          type: "p",
          text: "Когда нужно optimize LCP и improve user experience, смотрят конкретные вещи: какой largest element видит browser, как быстро уходит request за LCP resource, не мешает ли layout и тяжёлый JavaScript отрисовке text или image, не откладывает ли code главного героя. В Chrome DevTools удобно открыть performance и network, увидеть start loading, load time и то, какой URL изображения или блока стал LCP candidate. Best practices здесь прикладные: reduce the size медиа, не прятать hero за скриптами, отдать html document и главный ресурс раньше."
        },
        {
          type: "p",
          text: "Полевой отчёт и лабораторный case могут расходиться. Lab tools показывают один сценарий, field metrics — живой site на разных устройствах. Поэтому measure LCP стоит и в лаборатории, и в полевых данных, а optimize — тот элемент, который реально является largest contentful paint у пользователей, а не случайный block в тестовом прогоне."
        },
        {
          type: "table",
          caption: "Какие английские термины встречаются в отчётах по LCP",
          head: [],
          rows: [
            [
              "Термин",
              "Что обычно имеют в виду",
              "Где смотрят",
              "Что с этим делать"
            ],
            [
              "Largest Contentful Paint, LCP",
              "время отрисовки largest contentful element",
              "Chrome, PageSpeed, field data",
              "measure LCP на реальной page"
            ],
            [
              "LCP element / LCP candidate",
              "какой image, text или block стал главным",
              "performance panel, web-vitals",
              "optimize именно этот element"
            ],
            [
              "LCP resource и resource load",
              "какой URL грузится для героя",
              "network, html document",
              "повысить приоритет loading"
            ],
            [
              "render delay и load time",
              "пауза после загрузки resource",
              "performance, lab и field",
              "не блокировать render скриптами"
            ],
            [
              "Web Vitals / Core Web Vitals",
              "набор метрик user experience",
              "отчёты Google и Chrome",
              "смотреть LCP вместе с другими metrics"
            ],
            [
              "javascript, css, html",
              "код, который влияет на first paint",
              "DevTools, source page",
              "не откладывать главный image"
            ],
            [
              "performance, browser, size",
              "скорость, браузер, вес файла",
              "lab tools и field data",
              "reduce the size, проверить browser"
            ]
          ],
          textOnly: true,
          note: "Для developers эти слова — рабочий язык отчёта. Их полезно понимать, чтобы optimize LCP, а не спорить о переводе."
        }
      ]
    },
    {
      id: "kak-eto-formuliruyut",
      title: "Как LCP обычно объясняют в англоязычных отчётах",
      tocLabel: "Как это формулируют",
      blocks: [
        {
          type: "p",
          text: "В лабораторных и полевых отчётах метрику часто описывают по-английски, потому что так устроены Chrome, web-vitals API и документация для developers. Коротко это можно сформулировать так, не копируя чужие гайды: Largest Contentful Paint measures when the largest content element becomes visible in the viewport. A good report helps you see which image, text or video is the LCP element, how long the resource load takes, and where render delay starts."
        },
        {
          type: "p",
          text: "Tools can help you test timing, font and server delay, and improve speed on the page. You can open the performance panel, read the network report, and learn which request blocks the main content. This is useful when lab data and field data are different: the test may show a fast result, but real users see a slower LCP because the origin, style or JavaScript work is heavier than in the lab."
        },
        {
          type: "p",
          text: "Для команды это рабочий язык, а не повод писать статью по-английски целиком. Важно уметь measure, see the LCP candidate, and optimize the resource that actually paints last. Guides based on Web Vitals помогают связать эти слова с правками html, css, image size и приоритетом loading. Тогда продвижение и user experience опираются на понятный отчёт, а не на перевод одного термина."
        },
        {
          type: "p",
          text: "Повторим рабочие слова отчёта, чтобы их было легко узнать в Chrome и PageSpeed: Largest Contentful Paint, LCP element, LCP resource, resource load, render delay, load time, web vitals, field data, performance, browser, image, font, javascript, html, css, viewport, timing, speed. Measure the LCP candidate, optimize the resource, and improve the paint time of the largest content element on the page."
        },
        {
          type: "p",
          text: "Ещё несколько рабочих слов, которые часто встречаются в отчётах и полезны команде: accessibility of the main content, font-display and critical css, compression of the image, desktop and mobile viewport, chromium performance docs, debug the current request, delivery from the server, and a clean html document. Analytics and development tools can show additional timing: first byte, font load, css block, and whether the video or image is discoverable early. This documentation language helps when you test the page on a real site and need an accurate report, not a generic speed slogan."
        },
        {
          type: "p",
          text: "На практике главному LCP resource часто помогают fetchpriority и аккуратный preload или prefetch, формат webp, сжатие вроде brotli и нормальный cache. Если герой — svg или обычное изображение, его всё равно нужно отдать рано. Performance observer помогает увидеть элемент в живом браузере; свойство contain иногда упрощает отрисовку, но его нельзя ставить вслепую вместо приоритета главного файла."
        }
      ]
    },
    {
      id: "iz-chego-sostoit-otsenka",
      title: "Из каких частей складывается время Largest Contentful Paint",
      tocLabel: "Части LCP",
      blocks: [
        {
          type: "p",
          text: "Чтобы улучшить LCP, полезно смотреть не только итоговый LCP time, но и составные части. Обычно выделяют время до начала загрузки LCP resource, саму resource load, и element render delay — паузу между тем, как ресурс уже доступен, и тем, как LCP element наконец рисуется. Если долго едет картинка, работают над размером и приоритетом. Если LCP image приехала быстро, а элемент всё равно появляется поздно, чаще мешают render blocking стили, шрифт или скрипт, который откладывает отрисовку главного блока."
        },
        {
          type: "p",
          text: "Для image-based LCP смотрят img element или background image, который стал largest element в области просмотра. Для текстового LCP чаще важен момент, когда готов HTML document и веб-шрифт не задерживает заголовок. «Good LCP» в документации Core Web Vitals ориентируется на полевой опыт: метрика должна быть приемлемой у большинства визитов, а не только в одном лабораторном прогоне."
        }
      ]
    },
    {
      id: "kak-merit-i-chitat",
      title: "Как измерять LCP в лаборатории, в поле и в коде",
      tocLabel: "Как измерять точнее",
      blocks: [
        {
          type: "p",
          text: "Лабораторный замер в [PageSpeed Insights](/slovar/pagespeed-insights/) или аналогичном отчёте полезен, чтобы увидеть LCP candidate и понять, какой элемент система считает главным. Полевой LCP score из [Core Web Vitals](/slovar/core-web-vitals/) показывает, как страница ведёт себя у живых пользователей. Эти цифры не обязаны совпадать: лаборатория идёт по одному сценарию, а в поле зависят сеть, устройство и кэш."
        },
        {
          type: "p",
          text: "Если нужно разобрать конкретный заход, LCP можно снять в JavaScript через Performance API и логировать LCP element, render time и URL ресурса. Так видно, не сменился ли кандидат после баннера или поздней картинки, и не грузится ли LCP image слишком поздно из-за lazy loading. Оптимизация тогда точечная: начать loading as early as possible для настоящего LCP resource, убрать лишний render-blocking и не откладывать main content ради второстепенных блоков."
        }
      ]
    },
    {
      id: "typichnye-oshibki-lcp",
      title: "Какие ошибки чаще всего портят LCP на рабочих страницах",
      tocLabel: "Частые ошибки",
      blocks: [
        {
          type: "p",
          text: "Типичный сбой такой: команда смотрит лабораторный отчёт, видит плохой LCP и начинает сжимать все картинки подряд, хотя LCP candidate — это заголовок, который ждёт веб-шрифт, или блок, который появляется только после скрипта. Другая частая ошибка — повесить lazy loading на hero-изображение. Для фоновых картинок ниже сгиба это уместно, для LCP image — нет: браузер и так не должен откладывать largest element."
        },
        {
          type: "p",
          text: "Ещё один слабый сценарий — править только лабораторный page load и не смотреть поле. В лаборатории страница открывается «с нуля», без своего кэша и с одним размером окна. В поле часть заходов уже быстрые, зато на слабом устройстве LCP resource грузится долго. Поэтому улучшения проверяют и по полевому LCP score, и по тому, не появился ли новый кандидат после баннера, всплывающего окна или поздней подгрузки основного блока."
        }
      ]
    },
    {
      id: "kak-chitat-angliyskie-formuly",
      title: "Как в документации называют части LCP и типичные рекомендации",
      tocLabel: "Английские формулировки",
      blocks: [
        {
          type: "p",
          text: "В англоязычных отчётах и в web.dev LCP чаще разбирают так: first find the LCP element, then see whether the LCP resource started loading early enough, and finally check the render delay. A common note is that you should not use lazy loading on the hero image if this image is the LCP candidate. For a background image the same rule applies when that image is the largest element in the viewport."
        },
        {
          type: "p",
          text: "If you look at a lab report, it may provide a screenshot and a link to the current LCP resource. Field data can tell a different story: some visits are fast, other visits on a slow network have a much longer resource load. This is why one lab run does not always explain the field LCP score. When you build a fix, measure LCP again after the change and confirm that the same element is still considered the LCP element."
        },
        {
          type: "p",
          text: "How to optimize depends on the case. For an image-based LCP, reduce the size, set a sensible fetch priority, and make sure the HTML document can discover the resource early. For a text LCP, web font and render-blocking CSS may matter more than image compression. In each audit it helps to write down the element, the URL, and whether the delay is load time or render time, so the next pass does not start from zero."
        },
        {
          type: "p",
          text: "В рабочих аудитах эти английские имена частей удобно держать рядом с русским разбором. Сначала фиксируют, what the LCP element is, then whether the resource load or the render delay is the main issue. This same checklist should be reused on mobile and desktop, because the largest element is not always the same. If the lab result and the field score disagree, look at more visits, not only one example, and see whether a late banner or a font change now makes another element the LCP candidate."
        },
        {
          type: "p",
          text: "Есть и прикладная шпаргалка на смешанном языке, которой удобно пользоваться в отчёте. These are the questions that usually help: what is the LCP element, does this page use lazy loading on it, and do we have a new candidate after the last render? If the field показатель is still weak, get more than one lab run and compare ways — способы ускорить resource load и способы убрать render delay. This checklist is more stable than a single screenshot and does not replace a normal разбор продвижения страницы, если медленный LCP сам по себе отпугивает человека."
        },
        {
          type: "p",
          text: "Ещё один короткий ориентир: lab and field are different, but they are both useful. If images are compressed and fonts are loaded reasonably, the LCP показатель usually moves. Use this list when you have several templates: the home page, an article, and a category view may all use different LCP elements, so the same fix will not always work. Note what you changed, then get a new measurement."
        }
      ]
    },
    {
      id: "chastye-voprosy",
      title: "Частые вопросы о LCP",
      tocLabel: "Вопросы"
    }
  ],
  modules: {
    id: "lcp-titlo",
    title: "Какие инструменты Титло помогают не забыть о технической стороне скорости",
    intro: "LCP измеряют полевыми и лабораторными данными. На сайте важно найти сам элемент и то, что мешает ему появиться вовремя.",
    items: [
      {
        slug: "audit-sajta",
        title: "Аудит сайта",
        text: "Помогает увидеть технические препятствия, которые часто идут рядом с медленной отрисовкой: тяжёлые страницы, ошибки, лишние редиректы."
      },
      {
        slug: "http-headers",
        title: "HTTP-заголовки",
        text: "Полезно проверить кэширование и заголовки ответов, от которых зависит повторная загрузка ресурсов LCP."
      }
    ]
  },
  related: [
    "Core Web Vitals",
    "PageSpeed Insights",
    "INP",
    "Адаптивная вёрстка",
    "JavaScript SEO",
    "Mobile-first индексация"
  ],
  takeaways: [
    "LCP показывает, когда в видимой области появился самый крупный элемент содержимого.",
    "Чаще всего это изображение или крупный текстовый блок первого экрана.",
    "Решение принимают по полевым данным, лаборатория нужна, чтобы найти причину.",
    "Улучшают сам LCP-элемент и всё, что задерживает его появление, а не «все файлы подряд».",
    "Нельзя путать метрику с CMS Contentful: речь о времени отрисовки, не о платформе."
  ],
  faq: [
    {
      q: "Какой LCP считается хорошим?",
      a: "Ориентируются на актуальные пороги Core Web Vitals, которые публикует Google, и на долю реальных заходов, а не на один лабораторный прогон. Пороги со временем уточнялись, поэтому сверяют текущую документацию, а не старую памятку."
    },
    {
      q: "LCP, INP и CLS — это одно и то же?",
      a: "Нет. LCP про загрузку основного содержимого, INP про задержку после действия пользователя, CLS про сдвиги вёрстки. Вместе они описывают разные стороны опыта страницы."
    },
    {
      q: "Почему в лаборатории метрика лучше, чем у живых пользователей?",
      a: "Тест идёт в стабильных условиях, часто с тёплым кэшем и мощным устройством. Полевые данные включают слабые сети, холодный кэш и разные устройства, особенно мобильные."
    },
    {
      q: "Нужно ли убирать все изображения, чтобы улучшить LCP?",
      a: "Нет. Нужно правильно отдавать тот элемент, который является основным в первом экране. Пустой первый экран без смысла ради цифры ухудшает страницу, даже если лабораторный балл вырастет."
    },
    {
      q: "Влияет ли LCP на позиции?",
      a: "Google использует Core Web Vitals как часть понимания опыта страницы, но это не единственный и не главный фактор. Имеет смысл улучшать LCP ради пользователей и как часть технической гигиены, а не ждать, что одна метрика сама поднимет сайт в ТОП."
    }
  ],
  datePublished: "2026-11-26",
  dateModified: "2026-11-26"
};
