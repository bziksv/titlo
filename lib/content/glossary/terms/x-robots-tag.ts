import type { GlossaryTerm } from "../types";

/**
 * Бриф: кабинет #484 «X-Robots-Tag».
 * Google MSK TOP-20, history 98060, запрос «x-robots-tag», 19.11.2026.
 */
export const X_ROBOTS_TAG: GlossaryTerm = {
  slug: "x-robots-tag",
  term: "X-Robots-Tag",
  aliases: [
    "X-Robots-Tag",
    "заголовок X-Robots-Tag",
    "HTTP-заголовок robots",
    "x robots tag noindex",
    "X-Robots-Tag header"
  ],
  categoryId: "tekhnicheskiy-seo-i-indeksatsiya",
  h1: "Что такое X-Robots-Tag",
  seoTitle: "X-Robots-Tag: HTTP-заголовок для управления индексацией, директивы и примеры настройки",
  seoDescription: "X-Robots-Tag — HTTP-заголовок, который передаёт поисковым роботам правила индексации: noindex, nofollow, nosnippet и другие. Чем отличается от meta robots и robots.txt, как закрыть от индексации PDF и изображения, примеры для Apache и Nginx, как проверить.",
  short: "HTTP-заголовок ответа сервера, через который сайт передаёт поисковым роботам правила индексации и показа в поиске — как мета-тег robots, но для любых файлов, включая PDF и изображения.",
  definition: "X-Robots-Tag — это HTTP-заголовок, который сервер отправляет вместе с ответом на запрос страницы или файла. В нём указываются те же директивы, что и в мета-теге robots: noindex, nofollow, nosnippet, noarchive и другие. Главное отличие — заголовок работает для любого типа контента: HTML-страниц, PDF-документов, изображений, видео и других файлов, в которые нельзя добавить мета-тег. Директивы X-Robots-Tag поддерживают Google и Яндекс.",
  sections: [
    {
      id: "prostymi-slovami",
      title: "Что такое X-Robots-Tag простыми словами",
      tocLabel: "Суть",
      blocks: [
        {
          type: "p",
          text: "Когда поисковый робот запрашивает страницу или файл, сервер отправляет ему не только содержимое, но и набор служебных строк — [HTTP-заголовков](/slovar/http-zagolovki/). В них передаётся код ответа, тип контента, дата, настройки кэширования. X-Robots-Tag — один из таких заголовков: в нём сайт сообщает роботу правила индексации, например «не добавлять этот файл в поиск» или «не переходить по ссылкам»."
        },
        {
          type: "p",
          text: "По смыслу X-Robots-Tag — это тот же [мета-тег robots](/slovar/meta-teg-robots/), только передаётся он не в HTML-коде страницы, а в ответе сервера. Поэтому его можно использовать там, где мета-тег добавить нельзя: для PDF-документов, изображений, видео, файлов Word и Excel, архивов. Кроме того, заголовок удобно задавать сразу для группы файлов или целого раздела сайта через конфигурацию сервера."
        },
        {
          type: "flow",
          caption: "Как робот получает правила из X-Robots-Tag",
          steps: [
            {
              label: "Запрос",
              note: "поисковый робот запрашивает URL — страницу, PDF или изображение"
            },
            {
              label: "Ответ сервера",
              note: "сервер отдаёт код ответа, HTTP-заголовки и содержимое файла"
            },
            {
              label: "Чтение заголовков",
              note: "робот находит X-Robots-Tag и считывает директивы"
            },
            {
              label: "Применение правил",
              note: "файл не индексируется, не показывается в результатах поиска или показывается без сниппета"
            }
          ]
        },
        {
          type: "callout",
          variant: "important",
          text: "X-Robots-Tag работает, только если робот может загрузить файл. Если адрес закрыт в [robots.txt](/slovar/robots-txt/) через Disallow, робот не сделает запрос, не увидит заголовок и не узнает о noindex."
        }
      ]
    },
    {
      id: "primer",
      title: "Как выглядит заголовок в ответе сервера",
      tocLabel: "Пример",
      blocks: [
        {
          type: "p",
          text: "Заголовок передаётся в ответе сервера вместе с другими заголовками. Вот пример HTTP response для PDF-файла, который закрыт от индексации:"
        },
        {
          type: "table",
          caption: "Пример ответа сервера",
          head: [
            "Заголовок",
            "Значение"
          ],
          rows: [
            [
              "HTTP/1.1",
              "200 OK"
            ],
            [
              "Date",
              "Tue, 17 Nov 2026 10:00:00 GMT"
            ],
            [
              "Content-Type",
              "application/pdf"
            ],
            [
              "X-Robots-Tag",
              "noindex, nofollow"
            ]
          ],
          textOnly: true
        },
        {
          type: "p",
          text: "Директив может быть несколько — они перечисляются через запятую. Можно задать правила для конкретного робота: сначала указывается имя user-agent, затем двоеточие и директивы. Например, строка X-Robots-Tag: googlebot: nofollow применяется только к роботу Google, а X-Robots-Tag: otherbot: noindex, nofollow — к другому роботу. Если имя робота не указано, правило применяется ко всем поисковым системам."
        },
        {
          type: "p",
          text: "Ответ может содержать несколько заголовков X-Robots-Tag — роботы объединяют все правила. Если правила противоречат друг другу, поисковики обычно выбирают более строгое ограничение."
        }
      ]
    },
    {
      id: "direktivy",
      title: "Директивы X-Robots-Tag",
      tocLabel: "Директивы",
      blocks: [
        {
          type: "p",
          text: "В заголовке можно использовать те же директивы, что и в мета-теге robots. Основные из них поддерживают и Google, и Яндекс, но часть правил работает только в одной поисковой системе."
        },
        {
          type: "table",
          caption: "Основные директивы",
          head: [
            "Директива",
            "Что делает",
            "Поддержка"
          ],
          rows: [
            [
              "noindex",
              "запрещает показывать страницу или файл в результатах поиска",
              "Google, Яндекс"
            ],
            [
              "nofollow",
              "запрещает переходить по ссылкам на странице",
              "Google, Яндекс"
            ],
            [
              "none",
              "равно noindex, nofollow",
              "Google, Яндекс"
            ],
            [
              "all",
              "нет ограничений, значение по умолчанию",
              "Google, Яндекс"
            ],
            [
              "noarchive",
              "запрещает показывать сохранённую копию",
              "Яндекс, поддержка в Google снижена"
            ],
            [
              "nosnippet",
              "запрещает показывать сниппет и видео-превью в выдаче",
              "Google"
            ],
            [
              "max-snippet",
              "ограничивает длину текстового сниппета числом символов",
              "Google"
            ],
            [
              "max-image-preview",
              "задаёт размер превью изображения: none, standard или large",
              "Google"
            ],
            [
              "max-video-preview",
              "ограничивает длину превью видео в секундах",
              "Google"
            ],
            [
              "noimageindex",
              "запрещает индексировать изображения на странице",
              "Google"
            ],
            [
              "unavailable_after",
              "дата, после которой файл не нужно показывать в поиске",
              "Google"
            ],
            [
              "indexifembedded",
              "разрешает индексировать контент, встроенный через iframe, при noindex",
              "Google"
            ],
            [
              "notranslate",
              "не предлагать перевод страницы в результатах поиска",
              "Google"
            ]
          ],
          note: "Если правило не указано, поисковик считает, что ограничений нет. Неизвестные директивы роботы игнорируют."
        },
        {
          type: "callout",
          variant: "tip",
          text: "Для управления видом сниппета в Google удобно сочетать max-snippet, max-image-preview и max-video-preview. Например, значение max-image-preview: large разрешает показывать большие изображения в поиске и в Google Discover. Подробнее о сниппетах — в статье про [расширенный сниппет](/slovar/rasshirennyy-snippet/)."
        }
      ],
      subsections: [
        {
          title: "Описание правил в справке Google",
          blocks: [
            {
              type: "p",
              text: "Ниже — краткие формулировки правил так, как они описаны в англоязычной документации Google Search Central, с пояснением на русском. Это помогает сверить настройки с первоисточником, когда вы читаете guide для разработчиков или отчёт Search Console."
            },
            {
              type: "table",
              caption: "Правила и их описание в документации",
              head: [
                "Rule",
                "Формулировка в документации",
                "Пояснение"
              ],
              rows: [
                [
                  "all",
                  "There are no restrictions for indexing or serving. This rule is the default value and has no effect if explicitly listed.",
                  "значение по умолчанию, ограничений нет"
                ],
                [
                  "noindex",
                  "Do not show this page, media, or resource in search results. If you don't specify this rule, the page may be indexed and shown in search results.",
                  "страница или файл не показывается в выдаче"
                ],
                [
                  "nofollow",
                  "Do not follow the links on this page. If you don't specify this rule, Google may use the links on the page to discover those linked pages.",
                  "робот не переходит по ссылкам"
                ],
                [
                  "none",
                  "Equivalent to noindex, nofollow.",
                  "оба запрета сразу"
                ],
                [
                  "nosnippet",
                  "Do not show a text snippet or video preview in the search results for this page. A static image thumbnail may still be visible.",
                  "без описания в выдаче"
                ],
                [
                  "indexifembedded",
                  "Google is allowed to index the content of a page if it's embedded in another page through iframes or similar HTML elements, despite a noindex rule.",
                  "работает только вместе с noindex"
                ],
                [
                  "max-snippet: number",
                  "Use a maximum of number characters as a textual snippet for this search result. If no number is specified, the rule is ignored.",
                  "ограничение длины сниппета"
                ],
                [
                  "max-image-preview: setting",
                  "Set the maximum size of an image preview for this page in search results. Values: none, standard, large.",
                  "размер превью картинки"
                ],
                [
                  "max-video-preview: number",
                  "Use a maximum of number seconds as a video snippet for videos on this page in search results.",
                  "длина превью видео"
                ],
                [
                  "notranslate",
                  "Don't offer translation of this page in search results.",
                  "без ссылки на перевод"
                ],
                [
                  "noimageindex",
                  "Do not index images on this page.",
                  "картинки страницы не индексируются"
                ],
                [
                  "unavailable_after: date",
                  "Do not show this page in search results after the specified date or time. The date must be specified in a widely adopted format.",
                  "файл исчезает из поиска после даты"
                ]
              ],
              textOnly: true,
              note: "Формулировки сокращены. Полный список правил и примеры — в разделе Robots meta tag, data-nosnippet, and X-Robots-Tag specifications документации Google Search Central."
            },
            {
              type: "p",
              text: "Как сказано в той же справке, the X-Robots-Tag can be used to specify rules for a specific crawler: for example, X-Robots-Tag: googlebot: nofollow. Multiple rules can be combined in a comma-separated list or specified in multiple headers. When rules conflict, the more restrictive rule applies. Для Яндекса аналогичные правила описаны в справке Вебмастера в разделе о мета-теге robots и HTTP-заголовке X-Robots-Tag."
            }
          ]
        }
      ]
    },
    {
      id: "sravnenie",
      title: "X-Robots-Tag, meta robots и robots.txt: в чём разница",
      tocLabel: "Сравнение",
      blocks: [
        {
          type: "p",
          text: "Все три способа управляют тем, как поисковые системы работают с сайтом, но решают разные задачи. robots.txt управляет сканированием, а мета-тег robots и X-Robots-Tag — индексацией и показом в поиске."
        },
        {
          type: "table",
          caption: "Сравнение способов",
          head: [
            "Параметр",
            "robots.txt",
            "meta robots",
            "X-Robots-Tag"
          ],
          rows: [
            [
              "Что управляет",
              "сканированием",
              "индексацией и показом",
              "индексацией и показом"
            ],
            [
              "Где задаётся",
              "файл в корне сайта",
              "тег в HTML-коде страницы",
              "HTTP-заголовок ответа сервера"
            ],
            [
              "Типы файлов",
              "любые URL",
              "только HTML",
              "любые файлы"
            ],
            [
              "Массовая настройка",
              "по шаблонам путей",
              "через шаблон CMS",
              "через конфигурацию сервера"
            ],
            [
              "Убирает из индекса",
              "не гарантирует",
              "да, после обхода",
              "да, после обхода"
            ]
          ]
        },
        {
          type: "compare",
          items: [
            {
              title: "robots.txt",
              text: "Используйте, когда нужно сэкономить ресурсы робота и запретить обход служебных разделов. Не подходит, чтобы убрать страницу из поиска."
            },
            {
              title: "meta robots",
              text: "Используйте для отдельных HTML-страниц, когда доступ к шаблону есть, а к настройкам сервера нет."
            },
            {
              title: "X-Robots-Tag",
              text: "Используйте для файлов без HTML, для массовых правил по типу файлов и когда нужно задать правила на уровне сервера."
            }
          ]
        },
        {
          type: "callout",
          variant: "mistake",
          text: "Закрыть PDF-файлы в robots.txt и добавить им X-Robots-Tag: noindex. Робот не может загрузить файл, не видит заголовок, и документ остаётся в индексе без описания. Сначала разрешите сканирование, дождитесь удаления из индекса, а уже потом решайте, нужен ли запрет в robots.txt."
        }
      ]
    },
    {
      id: "nastroyka",
      title: "Как настроить X-Robots-Tag",
      tocLabel: "Настройка",
      blocks: [
        {
          type: "p",
          text: "Заголовок добавляют в конфигурации веб-сервера или в коде сайта. Способ зависит от того, на каком сервере работает сайт и какие файлы нужно закрыть."
        },
        {
          type: "table",
          caption: "Примеры настройки",
          head: [
            "Где",
            "Задача",
            "Пример"
          ],
          rows: [
            [
              "Apache, файл .htaccess",
              "закрыть от индексации все PDF",
              "<FilesMatch \"\\.pdf$\"> Header set X-Robots-Tag \"noindex, nofollow\" </FilesMatch>"
            ],
            [
              "Apache, файл .htaccess",
              "закрыть изображения",
              "<FilesMatch \"\\.(png|jpe?g|gif)$\"> Header set X-Robots-Tag \"noindex\" </FilesMatch>"
            ],
            [
              "Nginx, конфигурация сервера",
              "закрыть PDF",
              "location ~* \\.pdf$ { add_header X-Robots-Tag \"noindex, nofollow\"; }"
            ],
            [
              "Nginx, конфигурация сервера",
              "закрыть тестовый поддомен целиком",
              "add_header X-Robots-Tag \"noindex, nofollow\" always;"
            ],
            [
              "PHP",
              "закрыть отдельную страницу",
              "header(\"X-Robots-Tag: noindex\", true);"
            ],
            [
              "Next.js или другой фреймворк",
              "правило для группы URL",
              "заголовок задаётся в настройке headers для нужного пути"
            ]
          ],
          textOnly: true
        },
        {
          type: "p",
          text: "Для Apache нужен включённый модуль mod_headers. После изменения конфигурации Nginx сервер нужно перезагрузить. Если сайт работает на CMS, заголовок можно добавить через плагин SEO или в функции темы, но для файлов, которые сервер отдаёт напрямую, надёжнее настройка на уровне сервера."
        },
        {
          type: "callout",
          variant: "important",
          text: "Будьте осторожны с правилами для всего сайта. Строка Header set X-Robots-Tag \"noindex\", добавленная в корневой .htaccess без условия, закроет от индексации все страницы. Такая ошибка часто остаётся после разработки на тестовом сервере и переносится на рабочий сайт."
        }
      ]
    },
    {
      id: "kogda-ispolzovat",
      title: "Когда использовать X-Robots-Tag",
      tocLabel: "Применение",
      blocks: [
        {
          type: "ul",
          items: [
            "PDF и документы: прайсы, инструкции, договоры, которые не должны конкурировать в поиске с HTML-страницами.",
            "Изображения и видео: служебные картинки, превью, файлы, которые не нужны в поиске по картинкам.",
            "Тестовые и staging-версии сайта: закрыть весь поддомен одной строкой в конфигурации сервера.",
            "Служебные файлы: выгрузки фидов, файлы для партнёров, технические страницы, которые отдаёт API.",
            "Страницы без доступа к HTML: когда шаблон менять сложно, а конфигурацию сервера — можно.",
            "Управление сниппетами: ограничить длину описания или размер превью в результатах поиска Google.",
            "Не используйте X-Robots-Tag, чтобы скрыть страницу с конфиденциальной информацией: файл остаётся доступен по прямой ссылке. Для этого нужна защита паролем или ограничение доступа."
          ],
          style: "cards"
        }
      ]
    },
    {
      id: "kak-proverit",
      title: "Как проверить X-Robots-Tag",
      tocLabel: "Проверка",
      blocks: [
        {
          type: "p",
          text: "Заголовок не виден на странице, поэтому при SEO-аудите его проверяют отдельно. Особенно важно сделать это после переезда, обновления CMS или изменений в настройках сервера."
        },
        {
          type: "steps",
          items: [
            {
              title: "Инструменты разработчика",
              text: "откройте страницу в браузере, нажмите F12, перейдите на вкладку Network, выберите первый запрос и посмотрите Response Headers."
            },
            {
              title: "Командная строка",
              text: "выполните curl -I с адресом страницы — сервер вернёт только заголовки ответа."
            },
            {
              title: "Онлайн-сервис",
              text: "введите URL в [проверку HTTP-заголовков](/modules/http-headers/) — сервис покажет все заголовки, включая X-Robots-Tag."
            },
            {
              title: "Google Search Console",
              text: "инструмент проверки URL покажет, разрешена ли индексация и не мешает ли ей noindex в заголовке."
            },
            {
              title: "Яндекс Вебмастер",
              text: "инструмент «Проверить статус URL» и отчёт об исключённых страницах покажут, если страница исключена из-за запрета."
            }
          ]
        },
        {
          type: "callout",
          variant: "tip",
          text: "При аудите проверяйте не только HTML-страницы, но и файлы: PDF, изображения, документы. Сканер, который читает заголовки ответа, найдёт адреса, где noindex появился по ошибке. Подробнее о проверках — в статье про [индексацию сайта](/slovar/indeksatsiya/)."
        }
      ]
    },
    {
      id: "terminy",
      title: "Термины X-Robots-Tag в англоязычной документации",
      tocLabel: "Термины",
      blocks: [
        {
          type: "p",
          text: "Основная документация по заголовку — на английском: справка Google Search Central для разработчиков и справочник MDN Web Docs. Чтобы было проще читать первоисточники, вот как переводятся ключевые термины и фразы, которые там встречаются."
        },
        {
          type: "table",
          caption: "Англоязычные термины и их значение",
          head: [
            "Термин в документации",
            "Перевод",
            "Что означает"
          ],
          rows: [
            [
              "robots meta tag",
              "мета-тег robots",
              "тег meta name=\"robots\" content=\"noindex\" в разделе head HTML-страницы"
            ],
            [
              "X-Robots-Tag HTTP header",
              "HTTP-заголовок X-Robots-Tag",
              "правила индексации в ответе сервера (HTTP response header)"
            ],
            [
              "indexing and serving rules",
              "правила индексации и показа",
              "директивы, которые определяют, будет ли page, media or resource indexed and shown in search results"
            ],
            [
              "crawlers, search engine crawlers",
              "поисковые роботы",
              "программы, которые загружают страницы: Googlebot, YandexBot и другие bots"
            ],
            [
              "crawling and indexing",
              "сканирование и индексирование",
              "crawl — загрузка URL, indexing — добавление в индекс поисковой системы"
            ],
            [
              "search results",
              "результаты поиска",
              "все формы выдачи: web search, images, video, Google Discover"
            ],
            [
              "snippet, text snippet",
              "сниппет",
              "описание страницы в выдаче; управляется через nosnippet и max-snippet"
            ],
            [
              "data-nosnippet",
              "атрибут data-nosnippet",
              "HTML attribute для элемента span, div или section, текст которого нельзя показывать в сниппете"
            ],
            [
              "user agent token",
              "имя робота",
              "значение вроде googlebot, которое указывают перед директивами для конкретного робота"
            ],
            [
              "non-HTML files",
              "файлы без HTML",
              "PDF, image files, video, документы, к которым нельзя добавить meta tag"
            ],
            [
              "configuration files",
              "файлы конфигурации",
              ".htaccess и httpd.conf в Apache, nginx.conf в Nginx"
            ],
            [
              "rule applies to all",
              "правило для всех роботов",
              "если user agent не указан, правило применяется ко всем поисковым системам"
            ],
            [
              "if omitted",
              "если не указано",
              "значение по умолчанию — all, то есть ограничений нет"
            ]
          ],
          textOnly: true
        },
        {
          type: "p",
          text: "Типичная фраза из справки Google: «The X-Robots-Tag can be used as an element of the HTTP header response for a given URL. Any rule that can be used in a robots meta tag can also be specified as an X-Robots-Tag». Её смысл: любое правило, которое можно указать в мета-теге robots, можно передать и в заголовке X-Robots-Tag. Ещё одно важное замечание из документации: rules are ignored if the page is blocked by robots.txt — если URL закрыт для сканирования, робот не увидит правила индексации."
        },
        {
          type: "callout",
          variant: "tip",
          text: "В MDN Web Docs заголовок описан в разделе HTTP headers. Там же есть таблица directives с пометками о поддержке и примеры синтаксиса — удобно, если вы настраиваете заголовки для нескольких поисковых систем сразу."
        }
      ]
    },
    {
      id: "kraulingovyy-byudzhet",
      title: "X-Robots-Tag и краулинговый бюджет",
      tocLabel: "Краулинговый бюджет",
      blocks: [
        {
          type: "p",
          text: "Частое заблуждение — что noindex в заголовке экономит краулинговый бюджет. На самом деле, чтобы увидеть X-Robots-Tag, робот должен загрузить файл, поэтому запрос всё равно тратится. Со временем поисковики реже обходят адреса с noindex, но полностью сэкономить ресурсы робота помогает только запрет в robots.txt."
        },
        {
          type: "compare",
          items: [
            {
              title: "Нужно убрать файл из поиска",
              text: "Используйте X-Robots-Tag: noindex и оставьте файл доступным для сканирования. После того как документ пропадёт из индекса, при необходимости можно добавить Disallow."
            },
            {
              title: "Нужно экономить обход",
              text: "Используйте Disallow в robots.txt для служебных разделов, фильтров и параметров, которые не должны индексироваться и не находятся в поиске."
            },
            {
              title: "Нужно и то и другое",
              text: "Сначала noindex, дождаться удаления из выдачи, потом Disallow. Порядок важен: обратный вариант оставит адреса в индексе."
            }
          ]
        },
        {
          type: "p",
          text: "Для крупных проектов — интернет-магазинов с тысячами файлов и страниц фильтров — правильный выбор между этими способами напрямую влияет на скорость индексации важных страниц и, как следствие, на продвижение и рост позиций."
        }
      ]
    },
    {
      id: "seo",
      title: "X-Robots-Tag в SEO-продвижении",
      tocLabel: "SEO",
      blocks: [
        {
          type: "p",
          text: "Для SEO-специалистов X-Robots-Tag — инструмент технической оптимизации, который помогает держать в индексе только полезные страницы. Когда в поиске оказываются PDF-дубли каталога, служебные изображения или тестовые страницы, они конкурируют с основными страницами сайта, размывают релевантность и мешают пользователям находить нужный контент."
        },
        {
          type: "ul",
          items: [
            "Закройте PDF-версии страниц, которые дублируют HTML-контент: прайсы, каталоги, карточки товаров в формате документа",
            "Оставьте в индексе полезные документы, по которым ищут клиенты: инструкции, сертификаты, технические описания",
            "Закройте тестовые версии сайта и поддомены разработки на уровне сервера",
            "Управляйте видом сниппета в Google через max-snippet и max-image-preview, чтобы повысить кликабельность",
            "Регулярно проверяйте заголовки при аудите и после каждого релиза, чтобы случайный noindex не обрушил трафик"
          ],
          style: "check"
        },
        {
          type: "p",
          text: "Для интернет-магазина типичная задача — закрыть от индексации архивы прайсов и служебные списков товаров в формате документа, но оставить в поиске страницы каталога с ценами и описаниями. Анализ индекса с помощью оператора site: и отчётов Вебмастера показывает, какие файлы уже попали в поиск. Затем SEO-специалист составляет полный список правил, команда разработки добавляет их в конфигурацию, а после обновления проводится контроль: проверяются заголовки и через пару недель — изменения в индексе. Такой простой процесс даёт понятный результат и помогает сохранить релевантность основных страниц по ключевым фразам."
        },
        {
          type: "p",
          text: "Отдельный вопрос — роботы сервисов на основе искусственного интеллекта. Многие из них ориентируются на robots.txt и собственные user agent, а поддержка правил из X-Robots-Tag у разных ботов разная. Если нужно ограничить использование контента такими сервисами, проверьте документацию каждого из них."
        }
      ]
    },
    {
      id: "drugie-zagolovki",
      title: "Другие HTTP-заголовки, важные для SEO",
      tocLabel: "Другие заголовки",
      blocks: [
        {
          type: "p",
          text: "X-Robots-Tag — не единственный заголовок ответа сервера, который влияет на работу поисковых роботов. При техническом анализе сайта полезно проверять весь набор: часть заголовков управляет индексацией, часть — кэшированием, языком и доступом к ресурсам."
        },
        {
          type: "table",
          caption: "Заголовки рядом с X-Robots-Tag",
          head: [
            "Заголовок",
            "Пример",
            "Для чего"
          ],
          rows: [
            [
              "Link",
              "Link: <https://site.ru/page/>; rel=\"canonical\"",
              "указывает канонический URL для PDF и других файлов без HTML"
            ],
            [
              "Content-Type",
              "Content-Type: text/html; charset=utf-8",
              "тип контента и кодировка: от него зависит, как робот обработает файл"
            ],
            [
              "Content-Language",
              "Content-Language: ru",
              "язык контента, дополнительный сигнал для поисковиков"
            ],
            [
              "Cache-Control",
              "Cache-Control: max-age=3600",
              "правила кэширования, влияют на скорость загрузки"
            ],
            [
              "Last-Modified",
              "Last-Modified: Tue, 17 Nov 2026 10:00:00 GMT",
              "дата изменения, помогает роботу понять, обновился ли файл"
            ],
            [
              "Content-Security-Policy",
              "Content-Security-Policy: default-src 'self'",
              "политика безопасности, какие ресурсы может загружать страница"
            ],
            [
              "Access-Control-Allow-Origin",
              "Access-Control-Allow-Origin: *",
              "правила CORS — кросс-доменный доступ к ресурсам из JavaScript"
            ]
          ],
          textOnly: true
        },
        {
          type: "p",
          text: "Заголовок Link с rel=\"canonical\" особенно полезен в паре с X-Robots-Tag. Если PDF дублирует HTML-страницу, можно не закрывать его noindex, а указать каноническую страницу — тогда поисковик склеит дубли и передаст сигналы основной странице. Подробнее о заголовках ответа — в статье про [HTTP-заголовки](/slovar/http-zagolovki/), а о кодах — про [код ответа сервера](/slovar/kod-otveta-servera/)."
        }
      ]
    },
    {
      id: "javascript",
      title: "X-Robots-Tag и сайты на JavaScript",
      tocLabel: "JavaScript",
      blocks: [
        {
          type: "p",
          text: "На сайтах, где контент формируется скриптами, правила индексации иногда пытаются менять через JavaScript: например, добавлять мета-тег robots после загрузки страницы. С заголовком так не получится — X-Robots-Tag отдаётся сервером до выполнения скриптов. Это делает его надёжнее: робот получает правило сразу при загрузке, до рендеринга."
        },
        {
          type: "ul",
          items: [
            "Если в заголовке стоит noindex, Google может не выполнять рендеринг страницы, и удалить запрет через JavaScript уже не получится.",
            "Для SPA и сайтов на фреймворках правила лучше задавать на уровне сервера или в настройке headers фреймворка для нужных маршрутов.",
            "При серверном рендеринге проверяйте, что заголовок одинаковый для всех вариантов ответа — для робота и для пользователя."
          ],
          style: "cards"
        },
        {
          type: "callout",
          variant: "mistake",
          text: "Отдавать роботу и пользователю разные заголовки или менять правила в зависимости от user agent без необходимости. Это усложняет контроль и может привести к тому, что важные страницы выпадут из индекса."
        }
      ]
    },
    {
      id: "pereezd",
      title: "X-Robots-Tag при разработке и переезде сайта",
      tocLabel: "Переезд",
      blocks: [
        {
          type: "p",
          text: "Заголовок удобен, чтобы закрыть от индексации тестовую версию на время разработки: одна строка в конфигурации сервера закрывает весь домен или поддомен, и не нужно менять шаблоны. Но именно здесь чаще всего случается неправильное использование — после переноса на рабочий домен правило забывают удалить."
        },
        {
          type: "steps",
          items: [
            {
              title: "На тестовом сервере",
              text: "добавьте X-Robots-Tag: noindex, nofollow для всего поддомена, а лучше — закройте его паролем."
            },
            {
              title: "Перед запуском",
              text: "проверьте конфигурацию рабочего сервера и убедитесь, что глобального noindex нет."
            },
            {
              title: "После переезда",
              text: "проверьте заголовки главной, разделов и нескольких карточек через сервис проверки HTTP-заголовков."
            },
            {
              title: "В первые недели",
              text: "следите за отчётами Вебмастера и Search Console: рост числа исключённых страниц — сигнал проверить правила."
            }
          ]
        },
        {
          type: "p",
          text: "Для команды разработки полезно добавить проверку заголовков в список шагов при каждом релизе. Мониторинг заголовков на ключевых страницах помогает вовремя заметить проблему, пока она не повлияла на позиции и трафик."
        }
      ]
    },
    {
      id: "summary",
      title: "Краткая памятка для разработчиков на английском",
      tocLabel: "Памятка",
      blocks: [
        {
          type: "p",
          text: "Если сайтом занимается международная команда или подрядчик-разработчик, удобно передать ему короткую памятку на английском. Её можно скопировать в задачу или документацию проекта."
        },
        {
          type: "ul",
          items: [
            "X-Robots-Tag is an HTTP response header that tells search engine crawlers how to index a file and whether it should be shown in search results. It works for any file type, including PDF, image files and other non-HTML resources.",
            "Use it when you need to prevent indexing of documents, block certain file types from search, or set rules for a whole website or local development server at the server level.",
            "To make the rule work, the crawler must be able to fetch the URL. Do not block the same file in robots.txt, otherwise the crawler will never see the header.",
            "Check the header after every new release: open the developer tools, find the request in the Network tab and see the response headers, or run curl -I for the page. A tool that shows all HTTP headers also works.",
            "Combine rules in one comma-separated list. Specify a user agent token before the rules only when you want them to apply to one bot; otherwise the rule applies to all crawlers.",
            "Read the official documentation in Google Search Central and the MDN reference to learn which features and values each search engine supports, and keep the settings in your server configuration under version control."
          ]
        }
      ]
    },
    {
      id: "generator",
      title: "Как составить строку заголовка: пошаговые шаги",
      tocLabel: "Как составить",
      blocks: [
        {
          type: "p",
          text: "Специальный генератор для X-Robots-Tag не нужен — строку несложно собрать вручную. Достаточно ответить на несколько вопросов и разместить результат в конфигурации сервера."
        },
        {
          type: "steps",
          items: [
            {
              title: "Что закрыть",
              text: "определите файлы или раздел: все PDF, изображения определённого каталога, тестовый поддомен или конкретную страницу."
            },
            {
              title: "Какие правила",
              text: "выберите директивы: noindex, чтобы убрать из поиска; nofollow, чтобы не передавать ссылки; nosnippet или max-snippet, чтобы управлять описанием."
            },
            {
              title: "Для какого робота",
              text: "если правило нужно только для одной поисковой системы, укажите имя робота перед директивами."
            },
            {
              title: "Где разместить",
              text: "Apache — .htaccess или конфигурация виртуального хоста, Nginx — блок server или location, CMS — плагин или код темы."
            },
            {
              title: "Проверить",
              text: "откройте несколько адресов в сервисе проверки заголовков и убедитесь, что правило есть только там, где оно нужно."
            }
          ]
        },
        {
          type: "p",
          text: "Для каждой новой задачи лучше создавать отдельное правило с понятным комментарием в конфигурации. Так через год команда сможет понять, почему конкретный раздел закрыт от индексации, и не удалит нужную строку случайно."
        }
      ]
    },
    {
      id: "oshibki",
      title: "Частые ошибки с X-Robots-Tag",
      tocLabel: "Ошибки",
      blocks: [
        {
          type: "ul",
          items: [
            "Глобальный noindex в конфигурации сервера, оставшийся после разработки, — весь сайт пропадает из поиска.",
            "Файл закрыт в robots.txt, поэтому робот не видит заголовок с noindex.",
            "Противоречивые правила: в мета-теге index, в заголовке noindex — поисковик выберет более строгое правило.",
            "Ошибка в синтаксисе: директивы без запятой или с опечаткой робот проигнорирует.",
            "Правило задано для неверного типа файлов из-за ошибки в регулярном выражении FilesMatch или location.",
            "Заголовок отдаётся только для части ответов: например, в Nginx без параметра always он не добавляется к ответам с ошибкой."
          ],
          style: "mistakes"
        }
      ]
    },
    {
      id: "chek-list",
      title: "Чек-лист настройки X-Robots-Tag",
      tocLabel: "Чек-лист",
      blocks: [
        {
          type: "ul",
          items: [
            "Понятно, какие файлы и разделы нужно закрыть, а какие должны индексироваться",
            "Правила заданы для нужных типов файлов и проверены на нескольких адресах",
            "Важные страницы не получают noindex из конфигурации сервера",
            "Закрытые файлы не запрещены в robots.txt, чтобы робот увидел заголовок",
            "Правила в заголовке не противоречат мета-тегу robots",
            "Заголовок проверен через инструменты разработчика, curl или онлайн-сервис",
            "После изменений статус URL проверен в Вебмастере и Search Console"
          ],
          style: "check"
        }
      ]
    }
  ],
  modules: {
    id: "x-robots-tag-titlo",
    title: "Какие инструменты Титло помогают с X-Robots-Tag",
    intro: "Заголовок не виден на странице, поэтому его стоит проверять отдельно — особенно после изменений в настройках сервера.",
    items: [
      {
        slug: "http-headers",
        title: "Проверка HTTP-заголовков",
        text: "Показывает все заголовки ответа сервера для URL, включая X-Robots-Tag, и помогает найти случайный noindex."
      },
      {
        slug: "proverka-meta-tegov-online",
        title: "Проверка мета-тегов",
        text: "Проверяет мета-тег robots на странице, чтобы сравнить его с правилами из заголовка."
      },
      {
        slug: "audit-sajta",
        title: "Аудит сайта",
        text: "Сканирует страницы и находит адреса, закрытые от индексации через мета-теги и заголовки."
      }
    ]
  },
  related: [
    "Мета-тег robots",
    "Robots.txt",
    "Noindex",
    "HTTP-заголовки",
    "Индексация сайта",
    "Директива Disallow",
    "Код ответа сервера",
    "Поисковый робот",
    "Сканирование",
    "Расширенный сниппет"
  ],
  takeaways: [
    "X-Robots-Tag — HTTP-заголовок с правилами индексации, который работает для любых файлов, а не только для HTML.",
    "Директивы такие же, как у мета-тега robots: noindex, nofollow, nosnippet, noarchive, max-snippet и другие.",
    "Настраивается в конфигурации сервера (Apache, Nginx) или в коде сайта.",
    "Робот увидит заголовок, только если файл не закрыт в robots.txt: запрет сканирования не даёт прочитать noindex.",
    "Проверить заголовок можно в инструментах разработчика браузера, через curl или сервис проверки HTTP-заголовков."
  ],
  faq: [
    {
      q: "Что такое X-Robots-Tag простыми словами?",
      a: "Это служебная строка в ответе сервера, которая говорит поисковым роботам, можно ли индексировать файл и показывать его в поиске. Пользователь её не видит, а робот читает вместе с содержимым страницы."
    },
    {
      q: "Чем X-Robots-Tag отличается от мета-тега robots?",
      a: "Мета-тег robots добавляется в код HTML-страницы, а X-Robots-Tag передаётся в HTTP-заголовке ответа сервера. Директивы у них одинаковые, но заголовок работает и для файлов без HTML: PDF, изображений, документов. Ещё заголовок удобно задавать сразу для группы файлов через настройки сервера."
    },
    {
      q: "Как закрыть PDF от индексации?",
      a: "Добавьте для PDF-файлов заголовок X-Robots-Tag: noindex в настройках сервера. В Apache это делается через блок FilesMatch в .htaccess, в Nginx — через add_header в блоке location для файлов с расширением pdf."
    },
    {
      q: "Можно ли использовать X-Robots-Tag вместе с robots.txt?",
      a: "Можно, но для одного и того же файла не стоит закрывать сканирование в robots.txt, если вы хотите, чтобы сработал noindex. Робот не загрузит запрещённый файл и не увидит заголовок, поэтому адрес может остаться в индексе."
    },
    {
      q: "Поддерживает ли Яндекс X-Robots-Tag?",
      a: "Да. Яндекс учитывает директивы noindex, nofollow, none, noarchive и другие в заголовке X-Robots-Tag так же, как в мета-теге robots. Набор поддерживаемых правил у Яндекса и Google немного отличается."
    },
    {
      q: "Как проверить X-Robots-Tag на странице?",
      a: "Откройте инструменты разработчика в браузере, вкладку Network, выберите запрос и посмотрите заголовки ответа. Также можно выполнить curl -I с адресом страницы или проверить URL в онлайн-сервисе проверки HTTP-заголовков."
    }
  ],
  datePublished: "2026-11-19",
  dateModified: "2026-11-19"
};
