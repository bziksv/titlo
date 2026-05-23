# Эталон: демо-виджет модуля

## Назначение

Частичный результат на лендинге → регистрация в lk за полным доступом.

**Пилоты:**
- [подсчёт длины текста](http://localhost:3001/podschet-dliny-teksta/) — секция «Попробовать бесплатно»
- [анализ текста](http://localhost:3001/analiz-teksta/) — KPI + топ слов, остальное в кабинете

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
| BFF к lk | `app/api/lk/[...path]/route.ts`, `lib/lk-api.ts` |
| Guest cookie | `lib/demo/guest-session.ts` |

Старый виджет `/demo` (локальный подсчёт): `components/demo/TextLengthTool.tsx` — `/demo` редиректит на `/`.

## Поток

1. Пользователь жмёт «Посчитать в демо».
2. `POST /api/lk/api/demo/podschet-dliny-teksta/run` → lk; иначе fallback Next.
3. Показаны 5 базовых метрик; SEO/extended — blur + CTA.
4. `upgrade.register_url` → `lk…/register?module=…&from=demo&guest=…`

Контракт: [api-lk.md](../api-lk.md#demo-api-пилот-подсчёт-длины-текста).

## Расширение

Новый модуль: тип в `lib/demo/types.ts`, виджет в `components/demo/`, endpoint в lk + строка в `ALLOWED_PREFIXES`.
