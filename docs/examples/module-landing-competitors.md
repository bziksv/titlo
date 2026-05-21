# Эталон: лендинг «Анализ конкурентов»

Третий полный лендинг по паттерну [module-landing-relevance.md](./module-landing-relevance.md).

| Среда | URL |
|-------|-----|
| Локально | http://localhost:3001/analiz-konkurentov/ |
| Прод | https://datagon.ru/analiz-konkurentov/ |

Маршрут: `app/[slug]/page.tsx` → `AnalizKonkurentovLanding`.

## Файлы

| Часть | Путь |
|-------|------|
| Контент | `lib/content/analiz-konkurentov-page.ts` |
| Страница | `components/module-landings/AnalizKonkurentovLanding.tsx` |
| Общие блоки | `ModuleTechSection`, `ModuleInsightsSection`, `ModulePlainSection` |

## Особенности

- **4 среза** (`COMPETITOR_SLICES`): ТОП, мета, вложенность, % в ТОП.
- **4 скриншота** в сетке 2×2: `1bf0b32d708e156e.png` (форма LK, с [redbox.su](https://redbox.su/analiz-konkurentov/)), `518ec5eeb1bee67f.jpg`, `442df9bc371ac5d8.png`, `3d7d72c85b4af88c.jpg`. Старые iblock PNG на redbox отдают 404 — при появлении файлов: `node scripts/capture-competitor-screenshots.mjs`.
- Блок **связанных модулей** (мониторинг, релевантность, мета).
- Видео нет в `module-videos.generated` — секция роликов не добавлена.

## Проверка

```bash
npm run verify:competitor
```
