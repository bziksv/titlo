# Эталон: лендинг «Анализ текста»

| Среда | URL |
|-------|-----|
| Локально | http://localhost:3001/analiz-teksta/ |
| Прод | https://datagon.ru/analiz-teksta/ |

`AnalizTekstaLanding` · `lib/content/analiz-teksta-page.ts`.

Акцент: **частотность, словоформы, URL, облака, закон Ципфа, стоп-слова**.

**Демо:** секция `TextAnalyzerDemoWidget` после полосы статистики — `POST /api/demo/analiz-teksta/run` (см. [demo-widget.md](./demo-widget.md)).

Публичный URL `/analiz-teksta/` рендерит **ModuleV2Landing**; демо — через `ModuleV2DemoSection` **до** блока «Три акта» (`demoWidget` в `build-config.ts`).

Скрины LK без сайдбара: `text-anal-shot-*.jpg` (`node scripts/capture-analiz-teksta-screenshots.mjs` — граница сайдбара по пикселям, не фиксированные 168px; исходники `0d20bf…`, `a2c300…`, `474da29…`, график — `db844d36…`, кроп только блока Ципфа).

Проверка: `npm run verify:text-analysis` (порт **3001**)
