# Эталон: оболочка сайта

## Назначение

Шапка, подвал, cookie-баннер, карточка модуля на главной.

## Код

| Элемент | Файл |
|---------|------|
| Header + меню | `components/Header.tsx` |
| Лендинг модуля | `components/ModuleLanding.tsx`, `components/ModuleContent.tsx` |
| Footer (копирайт из даты) | `components/Footer.tsx`, `getCopyrightText()` в `lib/site.ts` |
| Карта офиса на контактах | `components/OfficeYandexMap.tsx` |
| Cookie banner | `components/CookieBanner.tsx` |
| Карточка модуля | `components/ModuleCard.tsx` |
| Навигация / константы | `lib/site.ts` |
| Layout | `app/layout.tsx` |

## Использование

Новые страницы — только контент в `<main>`, без дублирования header/footer.
