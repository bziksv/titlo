# Страницы и URL

Полный чеклист: **[migration-checklist.md](./migration-checklist.md)** (~57 URL).

## Статус миграции

| Путь | Статус |
|------|--------|
| `/` | ✅ |
| `/about/`, `/contact/`, `/tarify/`, `/services/`, `/faq/` | ✅ фаза 2 |
| 18 модулей, 30 новостей | ✅ |
| `/analiz-relevantnosti/` | ✅ кастомный лендинг; термины — `RelevancePlainSection` (4 пункта 2×2, без дубля 3+2 карточек) |
| `/demo/` | ✅ виджет + BFF `/api/lk/*` |
| `/legal/personal-data/`, `/legal/privacy/`, `/legal/offer/` | ✅ |
| `sitemap.xml`, `robots.txt` | ✅ |

## Редиректы (уже в `next.config.ts`)

- `/main/` → `/`
- `/catalog/` → `/services/`
- `/cart/` → `/`

## SEO

- `metadata` на каждой публичной странице.
- `sitemap.xml`, `robots.txt` — через Next (когда подключено).

## Внешние ссылки

- Вход: `https://lk.redbox.su/login`
- Регистрация / полный доступ: `https://lk.redbox.su/...` (уточнить в `api-lk.md`)
