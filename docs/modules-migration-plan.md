# План: лендинги модулей vs redbox.su

Источник: [redbox.su](https://redbox.su/). Цель: порядок секций как на live, текст из `h2.main1` + `.descrip`, скриншоты в `public/modules/assets/`.

**Легенда:** ☐ · 🔄 · ✅

| # | URL | Секций (live≈) | Картинки | Статус |
|---|-----|----------------|----------|--------|
| 1 | `/analiz-relevantnosti/` | 8 | 6 | ✅ |
| 2 | `/analiz-konkurentov/` | 12 | 10 | ✅ |
| 3 | `/monitoring-pozicii-sayta/` | 7 | 17 | ✅ |
| 4 | `/monitoring-saytov/` | 6 | 7 | ✅ |
| 5 | `/proverka-meta-tegov-online/` | 6 | 5 | ✅ |
| 6 | `/generator_slov/` | 3 | 7 | ✅ |
| 7 | `/podschet-dliny-teksta/` | 4 | 9 | ✅ |
| 8 | `/generator-paroley/` | 3 | 8 | ✅ |
| 9 | `/sravnenie-spiskov-klyuchevykh-fraz/` | 4 | 7 | ✅ |
| 10 | `/udalenie-dublikatov/` | 2 | 3 | ✅ |
| 11 | `/utm-metki/` | 5 | 5 | ✅ |
| 12 | `/kalkulyator-roi/` | 4 | 5 | ✅ |
| 13 | `/http-headers/` | 7 | 12 | ✅ |
| 14 | `/html-redaktor/` | 3 | 7 | ✅ |
| 15 | `/vydelenie-unikalnykh-slov-v-tekste/` | 5 | 6 | ✅ |
| 16 | `/otslezhivanie-ssylok/` | 10 | 11 | ✅ |
| 17 | `/otslezhivanie-sroka-registratsii-domenov/` | 4 | 11 | ✅ |
| 18 | `/analiz-teksta/` | 3 | 11 | ✅ |
| 19 | `/klasterizator-klyuchevykh-slov/` | 8 | — | ✅ |

## Что сделано в коде

1. `scripts/lib/kraken-parse.mjs` — парсинг `.descrip`, без дублей с обрезанными заголовками, блоки `p` / `list` / `img`, пропуск «Тарифы» и «Вопросы».
2. `components/ContentSections.tsx` — рендер картинок и списков.
3. `npm run scrape:modules` — зеркало в `/modules/assets/`.

## Проверка

```bash
npm run scrape:modules
npm run build
# визуально 2–3 модуля vs redbox.su
npm run audit:pages   # BASE_URL=http://localhost:3001
```

## Не переносим с live

- Блок «Тарифные планы» на лендинге → ссылка `/tarify/`.
- FAQ на лендинге → `/faq/`.
- Виджет демо внизу → `ModuleVideos` + lk.
