# Тестовый сайт Site Audit — `test.titlo.ru`

**Назначение:** живой сайт с **намеренными, контролируемыми** косяками под каждый отчёт Site Audit.  
Не путать с **демо-фикстурой** в БД кабинета (`demo-audit.titlo.ru` / `SiteAuditDemoFixture`) — та только для витрины UI.

| | |
|--|--|
| **Домен** | `https://test.titlo.ru` (также `http://`, `www` — без принудительного 301) |
| **Путь на сервере (источник правды)** | `/var/www/titlo_ru_usr/data/www/test.titlo.ru` |
| **VPS** | `155.212.171.103`, пользователь `titlo_ru_usr` |
| **Док/чеклист** | `titlo.ru/docs/cabinet-site-audit-test-fixture-site.md` (только документация) |
| **Кабинет** | краул как обычный проект, без подмешивания demo meta |
| **Контент** | вымышленный; не бренд Titlo / клиентов |

> HTML стенда **не** храним в репозитории `titlo.ru/test.titlo.ru/`. Правки — сразу в каталоге на сервере.

---

## Обязательные правила

### 1. Плашка на каждой странице

Сверху (sticky / fixed), заметно, без двусмысленности:

> **Тестовый сайт Titlo.** Материал вымышленный и **не относится к реальности**.  
> Сайт нужен **только** для проверки механизмов Site Audit (поиск ошибок, отчёты, склейки).  
> Не используйте как источник фактов, цен, контактов или рекомендаций.

- Плашка **на всех** HTML-страницах (включая 4xx-заглушки, если отдаём HTML).
- В `<title>` / meta description — короткий маркер вроде `(тест Site Audit)`, чтобы сниппеты тоже не выглядели «живыми».
- `robots.txt`: по умолчанию **Allow** для краула кабинета; отдельная ветка `/blocked-by-robots/` — для отчётов robots.

### 2. Негатив / «взрослый» контент — осторожно

| Код | Политика |
|-----|----------|
| `negative_content` | **Не делать** «жёсткий» негатив. Если понадобится детектор — отдельный этап, мягкие нейтральные маркеры по согласованию, без оскорблений/угроз/ПДн. |
| `adult_content` | **Не публиковать.** Отчёт либо не покрываем сайтом, либо только изолированный offline-fixture в кабинете по явному решению. |
| Спам / тошнота | Допустимы **технические** переспамы ключами («насос насос насос»), без токсичных тем. |
| Плагиат | Только **свой** кросс-копипаст между URL сайта или явная «копия блока A→B», не чужие чужие тексты с веба. |

### 3. Не ломать демо и прод-краулы

- Тексты / TITLE / description **только** с этого сайта и из HTML при крауле.
- **Запрещено** заливать в meta findings реальных краулов строки из `SiteAuditDemoFixture` («Каталог насосов…» и т.п.).
- Demo UI (`crawl` demo / domain `demo-audit.titlo.ru`) — отдельно; smoke-качество детекторов — на `test.titlo.ru`.

---

## Зачем это нужно (урок)

Демо-фикстура удобна для UI, но патч «красивых» meta на **боевые** crawl id даёт ложные цитаты при верных URL/hash (кейс `duplicate_title` на prime-ltd / crawl #119).  
Источник правды для цитат TITLE/Description — **страница обхода**, не demo dictionary.

---

## Этапы работ

| Этап | Цель | Статус |
|------|------|--------|
| **0** | Каркас: `index.html`, плашка, `robots.txt`, минимальный `sitemap.xml`, README деплоя | ✅ |
| **1** | Доступность: 4xx / 5xx / unreachable / битые ссылки / soft 404 | ✅ |
| **2** | Meta / H1 / дубли title·description·URL / canonical | ✅ |
| **3** | Редиректы, www/http зеркала (нужна серверная конфигурация) | ✅ редиректы PHP; www + http/https оба 200 |
| **4** | Контент: thin, similar, duplicate_content, иерархия заголовков, spam | ✅ (thin был в этапе 2) |
| **5** | Картинки, mixed content, insecure form, assets | ✅ (краул с `https://`) |
| **6** | robots / sitemap / orphan / deep / noindex | ✅ (`robots_txt_closed` / `sitemap_missing` целиком — ⏸) |
| **7** | Security headers (ответ сервера) | ✅ missing_* по умолчанию; контроль `/headers/with-sec.php` |
| **8** | Коммерческие блоки / CTA (фаза C–D) — по необходимости | ✅ `/shop/`, `/uslugi/` |
| **9** | SERP / PSI / индексы — только то, что можно без «грязи» в поиске | 🟡 PSI-bait есть; SERP/индекс — ⏸ |

Дальше идём **по одному этапу**: сначала чеклист этапа → страницы/правила nginx → краул → сверка отчётов.

---

## Чеклист покрытия (матрица отчётов)

Легенда статуса на сайте: ⬜ не сделано · 🟡 частично / этап 0 · ✅ есть воспроизводимый кейс · ✖ сознательно не на сайте · ⏸ нужен сервер/DNS не только HTML.

### A — ядро (сначала)

| Код | Отчёт | Как воспроизвести на test.titlo.ru | Этап | Сайт |
|-----|-------|-------------------------------------|------|------|
| `http_4xx` | Ошибки 4xx | `/missing/page-1/` … `/missing/page-3/` → 404 | 1 | ✅ |
| `http_5xx` | Ошибки 5xx | `/error/500.php` → 500 (PHP) | 1 | ✅ |
| `unreachable` | Недоступные | `https://test.titlo.ru:59999/dead/` (порт закрыт; в sitemap + ссылка) | 1 | ✅ |
| `broken_internal_link` | Битые внутр. ссылки | ссылки с `/`, `/catalog/`, `/about/` на `/missing/…` | 1 | ✅ |
| `page_has_broken_links` | Страницы с битыми | главная, каталог, о магазине | 1 | ✅ |
| `soft_404` | Soft 404 | `/gone-soft/` → **200** + TITLE «Страница не найдена», мало текста | 1 | ✅ |
| `empty_title` | Пустой TITLE | `/meta/empty-title/` без `<title>` | 2 | ✅ |
| `empty_description` | Пустой Description | `/meta/empty-description/` без meta description | 2 | ✅ |
| `duplicate_title` | Дубли TITLE | `/meta/dup-title-a/` + `/meta/dup-title-b/` | 2 | ✅ |
| `duplicate_description` | Дубли Description | `/meta/dup-desc-a/` + `/meta/dup-desc-b/` | 2 | ✅ |
| `multiple_h1` | Несколько H1 | `/meta/multiple-h1/` | 2 | ✅ |
| `multiple_title_or_description` | Несколько title/desc | `/meta/multiple-title/`, `/meta/multiple-description/` | 2 | ✅ |
| `missing_h1` | Без H1 | `/meta/missing-h1/` | 2 | ✅ |
| `title_too_short` / `title_too_long` | Длина TITLE | `/meta/title-short/`, `/meta/title-long/` | 2 | ✅ |
| `description_too_short` / `description_too_long` | Длина Description | `/meta/desc-short/`, `/meta/desc-long/` | 2 | ✅ |
| `title_equals_h1` / `title_equals_description` / `description_equals_h1` | Равенства | `/meta/title-eq-h1/`, `title-eq-desc`, `desc-eq-h1` | 2 | ✅ |
| `thin_content` | Тощие | `/meta/thin/` | 2 | ✅ |
| `canonical_empty` / `pages_with_canonical` / `canonical_not_self` / `canonical_foreign` / `multiple_canonical` | Canonical | `/meta/canonical-*` | 2 | ✅ |
| `duplicate_url_variants` | Дубли URL | `/variants/Twin/` + `/variants/twin/` (один key, оба 200) | 2–3 | ✅ |
| `www_both_available` | www и без www | оба vhost 200 без 301 (`www.test.titlo.ru`) | 3 | ✅ |
| `http_https_both_available` | http и https | оба 200 без 301 (LE-сертификат есть) | 3 | ✅ |
| `redirect` / `redirect_chain_long` / `redirect_loop` | Редиректы | `/r/go.php`, `/r/long-1.php`, `/r/loop-a.php` | 3 | ✅ |
| `images_without_alt` | Img без alt | `/media/img-no-alt/` | 5 | ✅ |
| `page_too_large` | Большие страницы | `/content/large.php` (~1,7 МБ) | 4 | ✅ |
| `noindex` | noindex | `/seo/noindex/` | 6 | ✅ |

### B — расширение

| Код | Отчёт | Как воспроизвести | Этап | Сайт |
|-----|-------|-------------------|------|------|
| `duplicate_content` | Дубли контента | `/content/dup-a/` + `/content/dup-b/` | 4 | ✅ |
| `similar_pages` | Похожие | `/content/similar-a/` + `/content/similar-b/` | 4 | ✅ |
| `heading_hierarchy` | Иерархия H | `/content/heading-skip/`, `/content/heading-before/` | 4 | ✅ |
| `h1_equals_h2` | H1 = H2 | `/content/h1-eq-h2/` | 4 | ✅ |
| `h1_spam` / `meta_spam` / `text_*_spam` / `text_nausea` / `too_many_strong` | Переспам | `/content/h1-spam/`, `meta-spam`, `nausea`, `bigram`, `trigram`, `strong` | 4 | ✅ |
| `insecure_form` | Form action=http | `/media/insecure-form/` при крауле **https://** | 5 | ✅ |
| `mixed_content` | Mixed content | `/media/mixed/` при крауле **https://** | 5 | ✅ |
| `broken_image` / `heavy_image` / `no_unique_images` / `lost_file` | Картинки/файлы | `/media/broken-img/`, `heavy-img`, `no-imgs`, `lost-file` | 5 | ✅ |
| `broken_external_link` | Битые внешние | `/media/broken-ext/` → httpstat.us/404 | 5 | ✅ |
| `external_links` / `external_assets` / `links_nofollow` / `duplicate_links` | Ссылки | `/media/external/` | 5 | ✅ |
| `page_has_bad_links` | Плохие ссылки | `/media/bad-links/` | 5 | ✅ |
| `robots_txt_closed` / `robots_txt_error` / `robots_blocked` | robots | error + blocked есть; `robots_txt_closed` (Disallow:/ на весь сайт) — ⏸ | 6 | 🟡 |
| `sitemap_missing` / `sitemap_error` / `not_in_sitemap` / `sitemap_not_crawled` | Sitemap | error (`:59999` fetch_failed), not_in_sitemap, not_crawled (`/blocked-by-robots/listed/`); missing целиком — ⏸ | 6 | 🟡 |
| `orphan_pages` / `deep_pages` / `no_outbound_internal` | Граф | `/seo/orphan/`, `/seo/deep/1…5/`, `/seo/dead-end/` | 6 | ✅ |
| `text_in_noindex` | Текст в noindex | `/seo/text-noindex/` | 6 | ✅ |
| `meta_nofollow` | Nofollow meta | `/seo/nofollow-meta/` | 6 | ✅ |
| `pagination_param` / `risky_query_params` | Query | `/seo/pagination/?page=2`, `/seo/risky/?utm_…&sid=` | 6 | ✅ |
| `bad_doctype` / `missing_charset` / `pages_with_iframe` / `html_critical_errors` | HTML | + `/extra/html-critical/` | 4–5 | ✅ |
| `site_availability` / `error_spike` | Доступность | `/error/spike/1…6.php` (серия 500); availability — по доле ошибок в крауле | 1 | 🟡 |
| security headers (`missing_*`) | Заголовки | сайт без HSTS/CSP/… на HTTPS; контроль `/headers/with-sec.php` | 7 | ✅ |
| SERP / index / landing* | Выдача / посадочные | не засоряем индекс | 9 | ⏸ |

### C–D — с ограничениями

| Код | Политика |
|-----|----------|
| `adult_content` | ✅ только маркеры: `/risk/adult-markers/` (noindex; без «взрослого» контента) |
| `negative_content` | ✅ только маркеры: `/risk/negative-markers/` (noindex; без инструкций/деталей) |
| `probable_affiliate` / `ad_cannibalization` / `keyword_cannibalization` | `probable_affiliate` → `/extra/affiliate/`; cannibalization — ⏸ |
| `commercial_missing_*` | этап 8 — `/shop/product-bare/`, `/uslugi/chertezhi/` |
| `landing_plagiarism_external` | ✖ не копировать чужие сайты |
| `psi_*` | 🟡 `/extra/psi-bait/` (тяжёлая страница); SERP — ⏸ |

---

## Этап 0 — что сделано

- [x] Документ-чеклист (этот файл)
- [x] На сервере: `/var/www/titlo_ru_usr/data/www/test.titlo.ru/` — `index.html` (плашка), `robots.txt`, `sitemap.xml`
- [x] Cursor rule: не травить реальные краулы demo meta
- [x] Отдача по `http://` и `https://`, www и apex без 301
- [ ] Первый краул из кабинета на `https://test.titlo.ru`

### Контент главной (этап 0)

- Плашка-дисклеймер.
- Короткая легенда: вымышленный магазин «Северный Чертёж» (канцтовары / бумага) — нейтрально.
- Валидный один H1, уникальный TITLE с маркером теста.
- **Намеренно пока без** insecure form / mixed / adult / negative.

---

## Этап 1 — доступность (сделано)

Файлы на сервере:

| URL | Ожидание |
|-----|----------|
| `/catalog/`, `/about/` | 200, живые страницы со ссылками на битые URL |
| `/missing/page-1/` … `/page-3/` | **404** (файлов нет) |
| `/gone-soft/` | **200**, TITLE «Страница не найдена», тонкий текст → soft 404 |
| `/error/500.php` | **500** |

- [x] Плашка на всех HTML-страницах этапа
- [x] Битые ссылки с главной, каталога и «О магазине»
- [x] `sitemap.xml` — только живые URL (`/`, `/catalog/`, `/about/`)
- [ ] Краул кабинета + сверка: `http_4xx`, `http_5xx`, `broken_internal_link`, `page_has_broken_links`, `soft_404`
- [ ] `unreachable` — не делаем без отдельного решения

Smoke (Apache `:81`, Host `test.titlo.ru`): `/` `/catalog/` `/about/` `/gone-soft/` → 200; `/missing/page-1/` → 404; `/error/500.php` → 500.

---

## Этап 2 — meta / H1 / canonical (сделано)

Хаб: [http://test.titlo.ru/meta/](http://test.titlo.ru/meta/)

| URL | Ожидаемый отчёт |
|-----|-----------------|
| `/meta/empty-title/` | `empty_title` |
| `/meta/empty-description/` | `empty_description` |
| `/meta/dup-title-a/` + `…-b/` | `duplicate_title` |
| `/meta/dup-desc-a/` + `…-b/` | `duplicate_description` |
| `/meta/multiple-h1/` | `multiple_h1` |
| `/meta/multiple-title/`, `/meta/multiple-description/` | `multiple_title_or_description` |
| `/meta/missing-h1/` | `missing_h1` |
| `/meta/title-short/`, `/meta/title-long/` | `title_too_short` / `title_too_long` |
| `/meta/desc-short/`, `/meta/desc-long/` | `description_too_short` / `description_too_long` |
| `/meta/title-eq-h1/`, `title-eq-desc`, `desc-eq-h1` | равенства |
| `/meta/thin/` | `thin_content` |
| `/meta/canonical-self/` | `pages_with_canonical` |
| `/meta/canonical-empty/` | `canonical_empty` |
| `/meta/canonical-not-self/` → `/about/` | `canonical_not_self` |
| `/meta/canonical-foreign/` → `example.test` | `canonical_foreign` |
| `/meta/canonical-multiple/` | `multiple_canonical` |

- [x] Плашка на всех HTML этапа 2
- [x] Ссылки с главной / каталога / about → `/meta/`
- [x] `sitemap.xml` включает живые meta-URL (~28 loc)
- [ ] Краул кабинета + сверка отчётов этапа 2
- [ ] `duplicate_url_variants` — `/variants/Twin/` + `/variants/twin/` (сделано в доп.кейсах)

---

## Доп.кейсы (хвосты матрицы)

Хаб: [https://test.titlo.ru/extra/](https://test.titlo.ru/extra/)

| URL | Отчёт |
|-----|-------|
| `/extra/html-critical/` | `html_critical_errors` |
| `/extra/word-repeat/` | `word_repeat_in_sentence` |
| `/extra/affiliate/` | `probable_affiliate` |
| `/extra/unreachable/` | ссылка → `:59999` → `unreachable` |
| `/error/spike/` | шесть 500 → `error_spike` (префикс `/error/spike`) |
| `/variants/Twin/` + `/variants/twin/` | `duplicate_url_variants` (регистр пути) |
| `/blocked-by-robots/listed/` | в sitemap + Disallow → `sitemap_not_crawled` |

`robots.txt`: кривая строка + bad Sitemap + рабочий sitemap + `Sitemap: https://test.titlo.ru:59999/sitemap-dead.xml` (`sitemap_error` / fetch_failed).

Sitemap пересобран (~103 URL, нормальные переводы строк).

---

## Готовность к краулу

Стенд **готов** к проверке из кабинета:

1. Проект / URL: **`https://test.titlo.ru/`**
2. Лимит страниц: лучше ≥ **120**, чтобы забрать хабы и хвосты
3. Не включать 301 http→https / www на стенде (намеренно)
4. Этап 9 (SERP) и adult/negative — не на сайте

---

## Этап 3 — редиректы и зеркала (сделано)

Хаб: [http://test.titlo.ru/r/](http://test.titlo.ru/r/)

| URL | Ожидание |
|-----|----------|
| `/r/go.php` | 301 → `/about/` → `redirect` |
| `/r/long-1.php` … `long-6.php` → `/` | цепочка ≥5 hops → `redirect_chain_long` |
| `/r/loop-a.php` ↔ `/r/loop-b.php` | `redirect_loop` |

- [x] PHP Location (без nginx)
- [x] `www_both_available` — `www.test.titlo.ru` и apex, оба 200 без 301
- [x] `http_https_both_available` — LE-сертификат; http и https оба 200 без 301
- [ ] `duplicate_url_variants` — slash/nginx (по желанию)

---

## Этап 4 — контент (сделано)

Хаб: [http://test.titlo.ru/content/](http://test.titlo.ru/content/)

| URL | Отчёт |
|-----|-------|
| `/content/dup-a/` + `dup-b/` | `duplicate_content` |
| `/content/similar-a/` + `similar-b/` | `similar_pages` |
| `/content/heading-skip/`, `heading-before/` | `heading_hierarchy` |
| `/content/h1-eq-h2/` | `h1_equals_h2` |
| `/content/h1-spam/`, `meta-spam/` | `h1_spam` / `meta_spam` |
| `/content/nausea/`, `bigram/`, `trigram/` | `text_nausea` / bigram / trigram spam |
| `/content/strong/` | `too_many_strong` |
| `/content/large.php` | `page_too_large` (~1,7 МБ) |
| `/content/bad-doctype/`, `no-charset/`, `iframe/` | `bad_doctype` / `missing_charset` / `pages_with_iframe` |

- [x] Плашка на HTML
- [x] Ссылки с главной
- [x] `sitemap.xml` ~50 URL
- [ ] Краул + сверка

---

## Этап 5 — медиа / ссылки (сделано)

Хаб: [http://test.titlo.ru/media/](http://test.titlo.ru/media/)

| URL | Отчёт |
|-----|-------|
| `/media/img-no-alt/` | `images_without_alt` |
| `/media/broken-img/` | `broken_image` |
| `/media/heavy-img/` + `/media/heavy.php` (~620 КБ) | `heavy_image` |
| `/media/lost-file/` | `lost_file` |
| `/media/no-imgs/` | `no_unique_images` |
| `/media/bad-links/` | `page_has_bad_links` |
| `/media/external/` | external / nofollow / duplicate / assets |
| `/media/broken-ext/` | `broken_external_link` |
| `/media/insecure-form/`, `/media/mixed/` | `insecure_form` / `mixed_content` (краул с **https://**) |

---

## Этап 6 — robots / sitemap / граф (сделано)

Хаб: [http://test.titlo.ru/seo/](http://test.titlo.ru/seo/)

| URL | Отчёт |
|-----|-------|
| `/seo/noindex/` | `noindex` |
| `/seo/nofollow-meta/` | `meta_nofollow` |
| `/seo/text-noindex/` | `text_in_noindex` |
| `/seo/pagination/?page=2` | `pagination_param` |
| `/seo/risky/?utm_…&sid=` | `risky_query_params` |
| `/seo/deep/1/`…`/5/` | `deep_pages` (порог ≥4 клика; с `/map/` только `/seo/deep/1/`, дальше по цепочке) |
| `/seo/dead-end/` | `no_outbound_internal` |
| `/seo/orphan/` | `orphan_pages` (только sitemap; без `<a>` с `/map/` и HTML) |
| `/seo/not-in-sitemap/` | `not_in_sitemap` (не в sitemap) |
| `/blocked-by-robots/` | `robots_blocked` (`Disallow` в robots.txt) |

- [x] `robots.txt`: Allow `/` + Disallow `/blocked-by-robots/`
- [x] Краул + сверка: URL в sitemap есть; finding пишется при skip очереди (не при fetch)
- [ ] `robots_txt_closed` / `sitemap_error` — не ломаем весь стенд

---

## Этап 7 — security headers (сделано)

- По умолчанию HTTPS-ответы **без** HSTS / CSP / XFO / nosniff / Referrer-Policy / Permissions-Policy / COOP / COEP / CORP → отчёты `missing_*`.
- Контроль со всеми заголовками: [https://test.titlo.ru/headers/with-sec.php](https://test.titlo.ru/headers/with-sec.php)
- Хаб: [https://test.titlo.ru/headers/](https://test.titlo.ru/headers/)
- Краул проекта стартовать с **`https://test.titlo.ru/`**

---

## Этап 8 — коммерция (сделано)

| URL | Отчёты |
|-----|--------|
| `/shop/product-bare/` | `commercial_missing_price/delivery/payment/stock/reviews` + contacts/cta |
| `/shop/product-full/` | контроль (блоки есть) |
| `/uslugi/chertezhi/` | `commercial_missing_contacts`, `commercial_missing_cta` |

Хабы: [https://test.titlo.ru/shop/](https://test.titlo.ru/shop/), [https://test.titlo.ru/uslugi/](https://test.titlo.ru/uslugi/)

---

## Этап 9 — SERP / PSI

- SERP / индексные отчёты — ⏸ (не засоряем выдачу).
- PSI: [https://test.titlo.ru/extra/psi-bait/](https://test.titlo.ru/extra/psi-bait/) — тяжёлые img + блокирующий JS (при включённом PSI в крауле).

---

## Карта стенда

Человекочитаемый список URL: [https://test.titlo.ru/map/](https://test.titlo.ru/map/)

Дополнительно: `/seo/x-robots-noindex.php` — `noindex` только через `X-Robots-Tag`.

---

## Правки на сервере

```bash
ssh root@155.212.171.103
# или: ssh titlo_ru_usr@155.212.171.103
cd /var/www/titlo_ru_usr/data/www/test.titlo.ru
# править index.html / добавлять страницы этапов здесь
```

Не коммитить HTML стенда в git-репо titlo.ru — только чеклист в `docs/`.

---

## Changelog тестового сайта

| Дата | Что |
|------|-----|
| 2026-08-12 | Старт: док + чеклист; этап 0 на сервере (`index.html`, robots, sitemap); без каталога в репо |
| 2026-08-12 | Этап 1: `/catalog/`, `/about/`, `/gone-soft/`, `/error/500.php`, битые `/missing/page-*`; домен в доке → `http://` |
| 2026-08-12 | Этап 2: хаб `/meta/` + 23 кейса (пустой TITLE, дубли, длины, H1, canonical); sitemap ~28 URL |
| 2026-08-12 | Этап 3 (частично): `/r/` PHP — go/long/loop; www/https ⏸ |
| 2026-08-12 | Этап 4: хаб `/content/` — дубли/похожие/H/spam/strong/large/doctype/iframe; sitemap ~50 |
| 2026-08-12 | Этап 5: хаб `/media/` — img/alt/broken/heavy/lost/bad/ext; insecure+mixed 🟡 без HTTPS |
| 2026-08-12 | Этап 6: хаб `/seo/` + orphan/deep/noindex/query + Disallow `/blocked-by-robots/`; sitemap ~80 |
| 2026-08-12 | HTTPS/www уже в nginx (LE); этап 7 headers + этап 8 `/shop/` `/uslugi/`; sitemap → https ~87 |
| 2026-08-12 | Доп.кейсы `/extra/` + Twin/twin + robots bad_line; sitemap ~93 |
| 2026-08-12 | Fix sitemap newlines; unreachable :59999; error/spike×6; blocked listed; sitemap ~103; ready-to-crawl |
| 2026-08-12 | `/map/` инвентарь; X-Robots noindex; PSI-bait; broken-ext +410/500; sitemap ~106 |
| 2026-08-12 | Risk-маркеры `/risk/adult-markers/` + `/risk/negative-markers/` (словарь, noindex) |
| 2026-08-12 | `/risk/negative-markers/`: явный баннер — только тест детектора Site Audit `negative_content` |
| 2026-08-13 | `/media/broken-ext/`: цели 404/410/500 → `cabinet.titlo.ru/sa-fixture/http/*.php` (httpstat.us нестабилен) |
