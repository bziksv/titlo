# Аудит: контент, бренд и мелочи vs redbox.su (май 2026)

Сверка **live** [redbox.su](https://redbox.su/) с кодом Next.js в репозитории.

## 3. Контент и бренд

| Пункт | Live (Битрикс) | Next (сейчас) | Вердикт |
|-------|----------------|---------------|---------|
| **Юр. тексты** | ИП Виленская, `redbox.su`, `info@redbox.su` | То же (`legal.generated.ts`) | ✅ Соответствует источнику |
| **Бренд «Датагон» в UI** | В title/meta ещё **RedBox** (2×), в тексте redbox | Шапка, meta, FAQ, about — **Датагон** | ⚠️ Ребренд только в UI, не в юр. и не на live |
| **Оферта §1.2** | Опечатка **`redbox.su.ru`** | `scrape-legal` нормализует → `redbox.su` | ✅ |
| **Домен datagon.ru** | Не используется | `SITE.siteUrl` = `https://redbox.su`, email `info@redbox.su` | ✅ Сознательно не меняли |
| **Визуал** | Kraken, слайдеры, плотная вёрстка, favicon PNG | Tailwind, градиент brand, SVG favicon, упрощённые блоки | ⚠️ Другой дизайн (ожидаемо) |

### Детали по юр. страницам

- `/legal/personal-data/`, `/legal/privacy/`, `/legal/offer/` — только `redbox.su`, без «Датагон».
- Реквизиты ИП в privacy/offer совпадают с `/contact/`.
- `info@kargo24.su` на live заменяется при скрапе на `info@redbox.su` (`normalizeLegalHtml`).

## 4. Мелочи vs старый сайт

| Пункт | Live | Next | Вердикт |
|-------|------|------|---------|
| **Аналитика (Метрика/GA)** | В Kraken JS: **ym(54591493)** | `components/Analytics.tsx` в layout; GA через `NEXT_PUBLIC_GA_ID` | ✅ Метрика; GA опционально |
| **Форма на контактах** | Форма Bitrix **«Задать вопрос»** | `ContactForm` + `POST /api/contact/` (lk / webhook / dev) | ✅ |
| **Картинки в новостях** | Превью `data-src` на `/news/` | `public/news/assets/` + `npm run scrape:news` | ✅ (2 статьи без превью — файлы 404 на [redbox.su](https://redbox.su), карточка без фото) |
| **Тело новостей** | YouTube iframe в статьях | `blocks[]` (p / img / embed) + `NewsArticle` | ✅ |
| **Демо на лендингах** | YouTube на 14 из 18 модулей | `module-videos.generated.ts` + `npm run scrape:module-videos` | ✅ |

## Рекомендуемые задачи (осталось)

1. **Юр. тексты** — бренд «Датагон» в оферте/политиках (бизнес-решение; сейчас как у ИП на live).
2. **Визуал** — отдельный эпик (близость к Kraken).
3. **lk API** — `POST api/public/contact` для формы на production (сейчас dev/webhook).
4. **Деплой** — VPS, nginx, DNS с Bitrix на Next ([deploy.md](./deploy.md), staging smoke).

Обновлять этот файл после закрытия пунктов.
