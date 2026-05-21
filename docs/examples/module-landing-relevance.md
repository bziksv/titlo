# Эталон: лендинг модуля «Анализ релевантности»

## Правило

Перед версткой **нового** лендинга модуля, блока или «подложки» — **сначала** открыть живую страницу и этот документ, **потом** код по ссылкам. Не придумывать паттерны с нуля, пока не проверили, что на эталоне уже нет готового решения.

| Среда | URL |
|-------|-----|
| Локально | http://localhost:3001/analiz-relevantnosti/ |
| Прод | https://datagon.ru/analiz-relevantnosti/ |

Подключение маршрута: `app/[slug]/page.tsx` → при `slug === "analiz-relevantnosti"` рендерится `AnalizRelevantnostiLanding`, не общий `ModuleLanding`.

## Что зафиксировано на странице

Сверху вниз — типовые **подложки** (фон секции) и **блоки**:

| # | Секция | Подложка / стиль | Где смотреть |
|---|--------|------------------|--------------|
| 1 | Hero | `bg-brand-800`, градиент, parallax-декор | `AnalizRelevantnostiLanding.tsx` + `ParallaxMonoScene`, `HeroParallaxMedia` |
| 2 | Статистика | белая полоса, сетка `gap-px` на `bg-slate-200` | `RELEVANCE_STATS` |
| 3 | Технология | тёмная `brand-800`, parallax сетки/карточек | `ModuleTechSection.tsx` |
| 4 | Как это работает | `bg-slate-50`, 4 карточки `01–04` | `RELEVANCE_STEPS` в landing |
| 5 | Три зоны | карточки с **цветной шапкой** (gradient) | `RELEVANCE_ZONES` |
| 6 | Что в отчёте | **brand-остров** (рамка + белая карточка) | `ModuleInsightsSection.tsx` |
| 7 | Скриншоты | 2 колонки, `figure` + caption | `RELEVANCE_SCREENSHOTS` |
| 8 | Термины простым языком | 2×2, номера в `brand-100` | `ModulePlainSection.tsx` |
| 9 | Логотипы ПС | центр, `SearchEngineLogos` light | `SearchEngineLogos.tsx` |
| 10 | Преимущества | 3 колонки, иконки | `RELEVANCE_ADVANTAGES` |
| 11 | Видео | одна плитка + плейлист | `ModuleVideoGallery.tsx` |
| 12 | FAQ | `dl`, белые карточки | `RELEVANCE_FAQ` |
| 13 | CTA | `gradient brand-600→700` + форма | `ModuleLeadCta` variant `card` |
| 14 | Хлебные / ссылка на каталог | в hero и внизу | landing |

## Переиспользуемые компоненты

| Компонент | Назначение | Файл |
|-----------|------------|------|
| `ModuleLeadCta` | Email → lk, hero и footer | `components/ModuleLeadCta.tsx` |
| `ModuleVideoGallery` | 1 плеер + список роликов | `components/ModuleVideoGallery.tsx` |
| `SearchEngineLogos` | Яндекс / Google, `hero` \| `light` | `components/SearchEngineLogos.tsx` |
| `ModuleIcon` | Иконка модуля в hero | `lib/module-icons.tsx` |
| `ParallaxMonoScene` | Декор на тёмном/hero фоне | `components/module-landings/ParallaxMonoScene.tsx` |
| `HeroParallaxMedia` | Лёгкий parallax скрина | `components/module-landings/HeroParallaxMedia.tsx` |
| `useParallaxOffset` | Смещение от `rect.top` | `lib/hooks/useParallaxOffset.ts` |
| `ModuleTechSection` | Тёмный блок с parallax (общий) | `components/module-landings/ModuleTechSection.tsx` |
| `ModuleInsightsSection` | Brand-остров «что в отчёте» | `components/module-landings/ModuleInsightsSection.tsx` |
| `ModulePlainSection` | Термины 2×2 | `components/module-landings/ModulePlainSection.tsx` |

Контент (не скрап): `lib/content/analiz-relevantnosti-page.ts`.  
Второй полный лендинг: [module-landing-monitoring.md](./module-landing-monitoring.md).

## Типографика и акценты (повторять, не выдумывать)

- Eyebrow: `text-sm font-semibold uppercase tracking-widest text-brand-600`
- Заголовок секции: `text-2xl font-bold text-slate-900 md:text-3xl`
- Карточка: `rounded-2xl border border-slate-200 bg-white shadow-sm`
- Hover карточки шагов: `hover:border-brand-200 hover:shadow-md`
- Номер шага: `font-mono text-3xl font-bold text-brand-200`
- Секция на сером: обёртка `bg-slate-50` + `max-w-6xl px-4 py-14 md:py-20`

## Чего избегать (уроки с этой страницы)

- Две сетки подряд с одинаковыми белыми карточками и длинным текстом (было 3+2 «простыни»).
- Дублировать блок «шагов» и блок «отчёта» (оба с `01–04`).
- Второй скриншот в «отчёте», если ниже уже есть «Интерфейс модуля».
- Пёстрый футер отчёта (тёмная полоса с бейджами) — итог только три спокойные карточки.
- Parallax со **второй колонкой** карточек поверх текста — только фон/декор и лёгкий stagger карточек (`ModuleTechSection`).

## Новый модуль по этому образцу

1. Скопировать структуру `AnalizRelevantnostiLanding` → `components/module-landings/<Slug>Landing.tsx`.
2. Контент вынести в `lib/content/<slug>-page.ts`.
3. В `app/[slug]/page.tsx` добавить ветку `if (slug === "...")`.
4. Секции переиспользовать из таблицы выше или вынести в общий компонент после второго модуля.
5. Обновить строку в `docs/examples/README.md` и при необходимости этот файл.

## Проверка

```bash
npm run dev          # http://localhost:3001/analiz-relevantnosti/
npm run verify:relevance   # маркеры кастомного лендинга на BASE_URL
```

После деплоя: `BASE_URL=https://datagon.ru npm run verify:relevance` — см. [deploy.md](../deploy.md).
