# Полный чеклист страниц redbox.su → Next.js

**Легенда:** ✅ ок · ⚠️ частично · ❌ нет · ⏭ не переносим

**Критерии на страницу:**
| Критерий | Что проверяем |
|----------|----------------|
| **Текст** | Полный контент с live (скрап Kraken), не заготовка |
| **Фото** | Только `/public/...`, без hotlink `redbox.su/upload` |
| **Видео** | YouTube embed там, где на live |
| **Визуал** | Карточки, иконки, отступы, hero, CTA |
| **SEO** | title, description, h1 |
| **Ссылка lk** | Вход / регистрация |

Запуск автосверки: `npm run audit:pages` → `docs/page-audit-report.json`

---

## Ядро (8)

| URL | Текст | Фото | Визуал | Статус |
|-----|-------|------|--------|--------|
| `/` | site-pages + модули | — | hero, stats, новости | ⚠️ |
| `/about/` | scrape + timeline 7 | — | карточки истории | ⚠️ |
| `/contact/` | scrape + реквизиты | — | форма + блоки | ⚠️ |
| `/tarify/` | `scrape:tariffs` + таблица сравнения | — | карточки + группы лимитов | ✅ |
| `/services/` | scrape-services | иконки emoji | сетка 18 | ⚠️ |
| `/faq/` | 8 Q&A про Датагон (`lib/content/faq.ts`) | — | аккордеон | ✅ |
| `/demo/` | ⏭ 301 → `/` | — | — | демо на лендингах |
| `/news/` | 30 статей | `/news/assets/` | NewsCard | ⚠️ |

## Модули (18)

План и статус: **[modules-migration-plan.md](./modules-migration-plan.md)**. Контент: `npm run scrape:modules` → `modules.generated.ts`, картинки `public/modules/assets/`.

| URL | Текст (sections) | Видео | Визуал |
|-----|------------------|-------|--------|
| `/analiz-relevantnosti/` | 8 секций + img | 4 | ModuleLanding + ContentSections |
| `/analiz-konkurentov/` | 12 секций + img | — | 🔄 |
| `/monitoring-pozicii-sayta/` | ✓ | 4 | ✓ |
| `/monitoring-saytov/` | проверить | 1 | ✓ |
| `/proverka-meta-tegov-online/` | ✓ | 1 | ✓ |
| `/generator_slov/` | ✓ | — | ✓ |
| `/podschet-dliny-teksta/` | ✓ | 1 | ✓ |
| `/generator-paroley/` | ✓ | — | ✓ |
| `/sravnenie-spiskov-klyuchevykh-fraz/` | ✓ | 1 | ✓ |
| `/udalenie-dublikatov/` | ✓ | — | ✓ |
| `/utm-metki/` | ✓ | 1 | ✓ |
| `/kalkulyator-roi/` | ✓ | 1 | ✓ |
| `/http-headers/` | ✓ | — | ✓ |
| `/html-redaktor/` | проверить | 1 | ✓ |
| `/vydelenie-unikalnykh-slov-v-tekste/` | проверить | 1 | ✓ |
| `/otslezhivanie-ssylok/` | ✓ | 1 | ✓ |
| `/otslezhivanie-sroka-registratsii-domenov/` | ✓ | 1 | ✓ |
| `/analiz-teksta/` | ✓ | 1 | ✓ |
| `/klasterizator-klyuchevykh-slov/` | ✓ | 1 | ✓ |

## Новости (32)

| URL | Текст | Превью | Тело img |
|-----|-------|--------|----------|
| `/news/` | список | local | — |
| `/news/istoriya-kompanii/` | фильтр | — | — |
| `/news/detail/*` ×30 | blocks | local | local |

## Юридические (3)

| URL | Текст | Фото |
|-----|-------|------|
| `/legal/personal-data/` | legal.generated | — |
| `/legal/privacy/` | ✓ | — |
| `/legal/offer/` | ✓ | — |
| cookies PNG | — | `/legal/cookies.png` |

## Редиректы (⏭)

`/main/`, `/blog/`, `/action/`, `/catalog/`, `/cart/`, `/search/`, `/404.php`, cookies PNG

## Внешние (⏭)

`lk.redbox.su/login`, `lk.redbox.su/register`

---

## Команды контента

```bash
npm run scrape:modules
npm run scrape:site-pages
npm run scrape:services
npm run scrape:news          # + mirror images
npm run scrape:legal
npm run scrape:module-videos
npm run audit:pages
```

Обновлять статусы после `audit:pages` и ручной проверки.
