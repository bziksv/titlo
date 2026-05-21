# Страницы и URL

Полный чеклист: **[migration-checklist.md](./migration-checklist.md)** (~57 URL).

## Статус миграции

| Путь | Статус |
|------|--------|
| `/` | ✅ |
| `/about/`, `/contact/`, `/tarify/`, `/services/`, `/faq/` | ✅ фаза 2 |
| 18 модулей, 30 новостей | ✅ |
| `/analiz-relevantnosti/` | ✅ эталон #1 — [module-landing-relevance.md](./examples/module-landing-relevance.md) |
| `/monitoring-pozicii-sayta/` | ✅ [module-landing-monitoring.md](./examples/module-landing-monitoring.md) |
| `/monitoring-pozicii-v2/` | ✅ [module-landing-monitoring-v2.md](./examples/module-landing-monitoring-v2.md) (NEW, улучшенный дизайн) |
| `/analiz-konkurentov/` | ✅ [module-landing-competitors.md](./examples/module-landing-competitors.md) |
| `/html-redaktor/` | ✅ [module-landing-html-editor.md](./examples/module-landing-html-editor.md) |
| `/http-headers/` | ✅ [module-landing-http-headers.md](./examples/module-landing-http-headers.md) |
| `/kalkulyator-roi/` | ✅ [module-landing-roi.md](./examples/module-landing-roi.md) |
| `/utm-metki/` | ✅ [module-landing-utm.md](./examples/module-landing-utm.md) |
| `/sravnenie-spiskov-klyuchevykh-fraz/` | ✅ [module-landing-list-compare.md](./examples/module-landing-list-compare.md) |
| `/generator-paroley/` | ✅ [module-landing-password-gen.md](./examples/module-landing-password-gen.md) |
| `/podschet-dliny-teksta/` | ✅ [module-landing-text-length.md](./examples/module-landing-text-length.md) |
| `/generator_slov/` | ✅ [module-landing-word-gen.md](./examples/module-landing-word-gen.md) |
| `/proverka-meta-tegov-online/` | ✅ [module-landing-meta-mon.md](./examples/module-landing-meta-mon.md) |
| `/monitoring-saytov/` | ✅ [module-landing-site-mon.md](./examples/module-landing-site-mon.md) |
| `/udalenie-dublikatov/` | ✅ [module-landing-dedup.md](./examples/module-landing-dedup.md) |
| `/vydelenie-unikalnykh-slov-v-tekste/` | ✅ [module-landing-unique-words.md](./examples/module-landing-unique-words.md) |
| `/otslezhivanie-ssylok/` | ✅ [module-landing-link-track.md](./examples/module-landing-link-track.md) |
| `/otslezhivanie-sroka-registratsii-domenov/` | ✅ [module-landing-domain-expiry.md](./examples/module-landing-domain-expiry.md) |
| `/analiz-teksta/` | ✅ [module-landing-text-analysis.md](./examples/module-landing-text-analysis.md) |
| `/klasterizator-klyuchevykh-slov/` | ✅ [module-landing-clusterizer.md](./examples/module-landing-clusterizer.md) |

Справочник визуальных приёмов с референс-сайтов: [examples/visual-effects-agency-reference.md](./examples/visual-effects-agency-reference.md).
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
