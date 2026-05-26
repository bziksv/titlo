# Эталон: демо-виджет модуля

## Назначение

Частичный результат на лендинге → регистрация в lk за полным доступом.

**Пилоты:**
- [подсчёт длины текста](http://localhost:3001/podschet-dliny-teksta/) — полный отчёт (символы, SEO, структура); лимит 2k символов и 5 запусков/сутки в демо
- [анализ текста](http://localhost:3001/analiz-teksta/) — KPI + топ слов, остальное в кабинете
- [анализ конкурентов](http://localhost:3001/analiz-konkurentov/) — ТОП-10 Яндекса по одной фразе
- [кластеризатор](http://localhost:3001/klasterizator-klyuchevykh-slov/) — до 10 фраз, classic Soft, живые кластеры
- [удаление дубликатов](http://localhost:3001/udalenie-dublikatov/) — 7 фильтров + KPI; расширенные опции в кабинете
- [сравнение списков](http://localhost:3001/sravnenie-spiskov-klyuchevykh-fraz/) — 4 режима + опции; лимит только по символам (3k на список)
- [HTML-редактор](http://localhost:3001/html-redaktor/) — CKEditor + split-view; лимит только на сохранение
- [мониторинг сайтов](http://localhost:3001/monitoring-saytov/) — разовая HTTP-проверка в демо; проекты и оповещения в кабинете
- [отслеживание срока регистрации доменов](http://localhost:3001/otslezhivanie-sroka-registratsii-domenov/) — разовая WHOIS в демо; мониторинг и оповещения в кабинете
- [мониторинг мета-тегов](http://localhost:3001/proverka-meta-tegov-online/) — разовая проверка title/description/H1 в демо; проекты и история в кабинете

## Файлы (пилот)

| Часть | Путь |
|-------|------|
| UI | `components/demo/TextLengthDemoWidget.tsx`, `components/demo/DemoWidgetShell.tsx` |
| Секция на v2-лендинге | `components/module-landings/ModuleV2DemoSection.tsx` — тёмный фон, белая карточка виджета |
| Панель CTA | `components/demo/DemoUpgradePanel.tsx` |
| Клиент API | `lib/demo/run-text-length-client.ts` |
| Контракт / лимиты | `lib/demo/text-length-demo.ts`, `lib/demo/types.ts` |
| Fallback API (Next) | `app/api/demo/podschet-dliny-teksta/run/route.ts` |
| **Анализ текста — UI** | `TextAnalyzerDemoWidget.tsx`, `TextAnalyzerSpiralCloud.tsx` (спиральное облако как в кабинете) |
| **Анализ текста — клиент** | `lib/demo/run-text-analyzer-client.ts` |
| **Анализ текста — прокси lk** | `app/api/demo/analiz-teksta/run/route.ts`, `lib/demo/proxy-cabinet-demo.ts` |
| **Анализ текста — lk** | `cabinet…/Api/Demo/TextAnalyzerDemoController`, `Services/Demo/TextAnalyzerDemoService` |
| **Анализ конкурентов — UI** | `CompetitorAnalysisDemoWidget.tsx`, `CompetitorAnalysisDemoReport.tsx` |
| **Анализ конкурентов — клиент** | `lib/demo/run-competitor-analysis-client.ts` |
| **Анализ конкурентов — прокси** | `app/api/demo/analiz-konkurentov/run/route.ts` |
| **Анализ конкурентов — lk** | `CompetitorAnalysisDemoController`, `CompetitorAnalysisDemoService` |
| **Кластеризатор — UI** | `ClusterDemoWidget.tsx`, `ClusterDemoReport.tsx`, `ClusterDemoCapabilities.tsx` |
| **Кластеризатор — клиент** | `lib/demo/run-cluster-demo-client.ts` |
| **Кластеризатор — прокси** | `app/api/demo/klasterizator-klyuchevykh-slov/run|poll/route.ts` |
| **Кластеризатор — lk** | `ClusterDemoController`, `ClusterDemoService` |
| **Удаление дубликатов — UI** | `DuplicatesDemoWidget.tsx` |
| **Удаление дубликатов — клиент** | `lib/demo/run-dedup-demo-client.ts` |
| **Удаление дубликатов — логика** | `lib/demo/dedup-process.ts`, `lib/demo/dedup-demo.ts` |
| **Удаление дубликатов — API** | `app/api/demo/udalenie-dublikatov/run/route.ts` |
| **Сравнение списков — UI** | `ListComparisonDemoWidget.tsx` |
| **Сравнение списков — логика** | `lib/demo/list-comparison-process.ts`, `lib/demo/list-comparison-demo.ts` (клиент, без API) |
| **Уникальные слова — UI** | `UniqueWordsDemoWidget.tsx` |
| **Уникальные слова — клиент** | `lib/demo/run-unique-words-demo-client.ts`, `lib/demo/unique-words-demo.ts` |
| **Уникальные слова — прокси** | `app/api/demo/vydelenie-unikalnykh-slov-v-tekste/run/route.ts` |
| **Уникальные слова — lk** | `UniqueWordsDemoController`, `UniqueWordsAnalysisService` |
| BFF к lk | `app/api/lk/[...path]/route.ts`, `lib/lk-api.ts` |
| Guest cookie | `lib/demo/guest-session.ts` |
| **Домены — UI** | `DomainInformationDemoWidget.tsx` |
| **Домены — клиент** | `lib/demo/run-domain-information-demo-client.ts`, `lib/demo/domain-information-demo.ts` |
| **Домены — прокси** | `app/api/demo/otslezhivanie-sroka-registratsii-domenov/run/route.ts` |
| **Домены — lk** | `DomainInformationDemoController`, `DomainInformationDemoService`, `DomainInformation::probe` |
| **Мета-теги — UI** | `MetaTagsDemoWidget.tsx` |
| **Мета-теги — клиент** | `lib/demo/run-meta-tags-demo-client.ts`, `lib/demo/meta-tags-demo.ts` |
| **Мета-теги — прокси** | `app/api/demo/proverka-meta-tegov-online/run/route.ts` |
| **Мета-теги — lk** | `MetaTagsDemoController`, `MetaTagsDemoService` |

Старый виджет `/demo` (локальный подсчёт): `components/demo/TextLengthTool.tsx` — `/demo` редиректит на `/`.

## Поток

1. Пользователь жмёт «Посчитать в демо».
2. `POST /api/lk/api/demo/podschet-dliny-teksta/run` → lk; иначе fallback Next.
3. Показаны 5 базовых метрик; SEO/extended — blur + CTA.
4. `upgrade.register_url` → `lk…/register?module=…&from=demo&guest=…`

Контракт: [api-lk.md](../api-lk.md#demo-api-пилот-подсчёт-длины-текста).

## Расширение

Новый модуль: тип в `lib/demo/types.ts`, виджет в `components/demo/`, endpoint в lk + строка в `ALLOWED_PREFIXES`.
