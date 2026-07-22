# Site Audit (Titlo) — чеклист реализации (полный)

**Статус:** живой чеклист · **обновлять после каждой закрытой задачи**  
**Связано:** [live-map](./cabinet-site-audit-labrika-live-map.md) · [benchmark](./cabinet-site-audit-benchmark-labrika.md)

> **Важно:** первая версия чеклиста была каркасом платформы (инфра/краул/MVP).  
> Ниже — **полная карта экранов Labrika** (тех + SEO + UX-паритет + факторы с витрины).  
> Каждый отчёт = отдельный deliverable: detector → finding code → API → UI → badge → «Описание» → CSV.

**Инфра (целевая):** UI/тарифы на cabinet · воркеры + audit DB + HTML.gz на **proxy2** · краул **не** через LTE/3proxy.  
**Но proxy2 подключаем не с первого дня** — см. § «Этапность» ниже.

**Легенда фазы отчётов:** `A` MVP tech · `B` SEO lite · `C` тяжёлое · `D` экосистема  
**Легенда статуса:** `⬜` · `🟡` · `✅` · `⏸` · `✖`  
**Где крутится:** `💻 local/cabinet` · `🖥️ proxy2` · `📄 docs only`

**DoD одного отчёта (повторять для каждой строки матрицы):**
1. [ ] Finding `code` + severity + текст «Описание»
2. [ ] Detector (parse / aggregate / внешний job)
3. [ ] Запись в `site_audit_findings` (sparse) + count для бейджа
4. [ ] API: list URL (+ meta), пагинация, сортировка
5. [ ] UI: пункт меню/сайдбар + таблица + пустое состояние
6. [ ] CSV export
7. [ ] Участие в 4 корзинах сводки (если severity задан)
8. [ ] Smoke на пилотном сайте + запись в Changelog

---

# ЭТАПНОСТЬ (когда что и когда proxy2)

Это **главный порядок работ**. Номера этапов внутри частей — детали; волны ниже — закон.

## Волна 0 — Решение ✅ `📄`

- Исследование Labrika, доки, этот чеклист.
- **proxy2 не трогаем** (кроме уже сделанного: SSH/пароль по желанию владельца).

## Волна 1 — Спека ✅ `📄`

| Что | Этап | proxy2? | Статус |
|-----|------|---------|--------|
| Лимиты тарифов | 1 | Нет | ✅ SiteAudit 500/5k/20k/50k · SiteAuditCrawls 1/4/8/12 |
| UX: `/site-audit` + кнопка мониторинга | 1 | Нет | ✅ |
| Реестр finding codes фазы A | 1 | Нет | ✅ `config/site_audit.php` |
| Работа **только локально** до cutover | — | Нет | ✅ зафиксировано |

## Волна 2 — Разработка на cabinet / локально ✅ `💻`

> **MVP A закрыт** (local smoke). На prod: добавить группу supervisor `cabinet-titlo-site-audit` из example-conf.
| Что | Этап | Где | Статус |
|-----|------|-----|--------|
| Миграции `site_audit_*` (временно можно в **основной** MySQL) | 3 | cabinet DB | 🟡 3a ✅ |
| Ядро краула discover/fetch/parse/aggregate | 4 | local/cabinet workers | 🟡 parse signals ✅; robots+virtual robots ✅; tempfile/HTML → Wave 4 |
| Очередь `site_audit` + supervisor **на cabinet** (2 proc) | 5a | cabinet | ✅ conf+deploy+prod restart |
| UI shell + отчёты фазы **A** | 7 + 6(A) | cabinet | ✅ UI + DoD A; batch domains + virtual robots |
| Тарифные лимиты / письма | 8 | cabinet | ✅ |
| Smoke ≤1–2k URL | 12a | cabinet | ✅ |

**Выход волны 2 (MVP A):** ✅ закрыт. Prod: supervisor `cabinet-titlo-site-audit` работает. tempfile/HTML → Wave 4.  
**Сейчас (2026-07-22):** обкатка **Волны 5** на cabinet (B/C / UX / маркетинг).  
**proxy2: ЗАМОРОЖЕН** — не готовим, не cutover, не HTML.gz; гоняем краул на cabinet как есть и наблюдаем. Волны 3–4 не стартуем, пока явно не снимем freeze.

**proxy2:** не используем (или только SSH «лежит и ждёт»).  
**HTML.gz:** выключен или пишется во временный local path (не прод-хранилище).

## Волна 3 — Подготовка внешнего сервера ⏸ `🖥️` · **в самую последнюю очередь**

> **Решение 2026-07-22:** proxy2 **заморожен полностью** — только local/cabinet, наблюдаем.  
> Remote/SSH/MySQL audit/HTML.gz **не трогаем**, пока модуль не обкатан и freeze не снят явно.  
> Сначала допиливаем UX/отчёты/стабильность тут → потом одним заходом infra (волны 3–4).  
> Не начинать этап 2/3b/5b/9 «потому что сервер уже есть».

> Делаем **только когда** волна 2 обкатана и явно решено «пора remote».

| Что | Этап | proxy2? |
|-----|------|---------|
| Harden SSH, user, PHP, composer, supervisor | 2 | **Да, настройка** |
| MySQL audit **на proxy2** (отдельная БД) | 2 + 3b | **Да** |
| Dir `/var/lib/titlo-site-audit/html/` + LVM | 2 | **Да** |
| Сеть: workers → DB, cabinet → snapshot API | 2 | **Да** |
| Deploy кода на proxy2, healthcheck | 2 | **Да** |
| Supervisor `site_audit` **переносим** с cabinet → proxy2 | 5b | **Да** |
| Cabinet `.env`: `SITE_AUDIT_DB_*`, queue remote/redis | 5b | cabinet+proxy2 |

**Триггер «пора волна 3» (все сразу, не раньше):**  
- MVP A обкатан на cabinet/local; **и**  
- явное «ок, заводим remote»; **и**  
- (опционально) упираемся в RAM/CPU / нужны HTML / отдельная БД.

## Волна 4 — Cutover на proxy2 + HTML ⏸ `🖥️` · после волны 3

| Что | Этап | Где |
|-----|------|-----|
| Все fetch/parse jobs только на proxy2 | 5b | proxy2 |
| Данные аудита в remote MySQL | 3b | proxy2 |
| HTML.gz по флагу | 9 | **только proxy2** |
| Пилот 5–20k, 10 crawl в очереди, Kraken regression | 12b | proxy2 |
| Deploy runbook: restart supervisor **на proxy2** | 12 | docs |

**С этого момента** внешний сервер — **основное** место парсинга и хранения аудитов/HTML.  
Cabinet = UI + dispatch + чтение отчётов.  
**Сейчас (2026-07-21):** не стартуем — обкатка только local/cabinet.

## Волна 5 — Расширение продукта 🟡 `💻` (proxy2 не нужен пока)

| Что | Этап | Где | Статус |
|-----|------|-----|--------|
| SEO lite отчёты B | 10 | cabinet | ✅ B закрыт (SERP-сниппеты gate); C/D в дереве с v0.3.9 |
| UX parity (share, schedule, xlsx, …) | 14 | cabinet | 🟡 почти ✅; HTML-мониторинг ⏸ (нужен html.gz/proxy2) |
| Тяжёлое C (links, PSI, plagiarism…) | 11 | cabinet→позже proxy2 | 🟡 11.1–11.4 + 11.6 ✅; 11.5 headless ⏸ (решение: не MVP) |
| Маркетинг / демо | 13 | titlo.ru + demo | 🟡 rich landing + tariff + demo seed ✅ |
| Склейка модулей Titlo | 15 | cabinet | ✅ deep-links: конкуренты · индекс · meta · Есенин · HTTP headers; HTML-мониторинг ⏸ |

```
Волна1 spec ──► Волна2 код+A на cabinet ──► Волна3 готовим proxy2
                                              │
                                              ▼
                                    Волна4 cutover + HTML
                                              │
                                              ▼
                                    Волна5 отчёты B/C + маркетинг
```

### Когда именно задействуем proxy2 — одной фразой

| Момент | proxy2 |
|--------|--------|
| Сейчас / спека / первые отчёты A | **Не нужен** |
| После рабочего MVP A на cabinet | **Готовим** (волна 3) |
| Перед большими краулами / HTML / отдельной БД | **Обязателен** (волна 4) |
| Фазы B/C в проде | **Уже основная площадка** |

---

# ЧАСТЬ I — Платформа (детали этапов)

## Сводка платформенных этапов

| # | Этап | Волна | Где | Статус |
|---|------|-------|-----|--------|
| 0 | Исследование | 0 | 📄 | ✅ |
| 1 | Спека, лимиты, реестр отчётов | 1 | 📄 | ✅ |
| 3 | Схема БД (сначала main, потом remote) | 2→4 | 💻→🖥️ | 🟡 3a ✅ |
| 4 | Ядро краула | 2 | 💻 | 🟡 fetch/parse ✅; body tempfile + HTML storage → Wave 4 |
| 5a | Очереди на cabinet (временно) | 2 | 💻 | ✅ queue + conf×2 + deploy + `site-audit:failed` |
| 7 | UI shell | 2 | 💻 | ✅ + share + SEO tab + schedule + tree search/presets + help + badge colors + dup groups |
| 8 | Тарифы / письма | 2 | 💻 | ✅ LimitsComposer + header + dual /tariff + email crawl-done |
| 6A | Отчёты tech фазы A | 2 | 💻 | ✅ DoD A (30 codes + сводка/динамика/Показать); B-lite сверх |
| 12a | Smoke пилот малый | 2 | 💻 | ✅ crawl #2–#10 titlo.ru |
| **2** | **Инфра proxy2** | **3** | **🖥️** | ⏸ последняя очередь |
| **5b** | **Перенос воркеров на proxy2** | **3–4** | **🖥️** | ⏸ |
| **3b** | **Audit MySQL на proxy2** | **3–4** | **🖥️** | ⏸ |
| **9** | **HTML-снимки** | **4** | **🖥️** | ⏸ |
| 12b | Большой пилот / hardening | 4 | 🖥️ | ⬜ |
| 10 | SEO B | 5 | 💻+🖥️ | 🟡 shell SEO + simhash (волна 2) |
| 11 | Тяжёлое C | 5 | 🖥️ | ⬜ |
| 14 | UX parity | 5 | 💻+🖥️ | ⬜ |
| 13 | Маркетинг / демо | 5 | 📄+💻 | 🟡 ✅ landing |
| 15 | Интеграции модулей Titlo | 5 | 💻 | ⬜ |

Отчёты подробно — **Часть II**.

---

## Этап 0 — Исследование ✅

- [x] Обход Labrika tech + SEO
- [x] live-map + benchmark
- [x] Сигналы + sparse findings; очереди; proxy2; HTML.gz remote; Kraken-safe
- [x] Чеклист v1
- [x] Чеклист v2 — полная матрица экранов Labrika

---

## Этап 1 — Спека и лимиты ⬜

### 1.1. Продукт

- [ ] Утвердить: отдельный раздел vs кнопка `SiteAuditButtons`
- [ ] UX: project → crawl → summary → report tree (как Labrika)
- [ ] Язык приоритетов: Грубые / Прочие / Предупреждения / Инфо
- [ ] Out-of-scope v1 зафиксировать письменно (не «забудем»)

### 1.2. Лимиты тарифов

- [ ] Страниц / краул (F/O/U/M)
- [ ] Краулов / мес
- [ ] N хранимых детальных crawl
- [ ] HTML quota (off default)
- [ ] Max 1 active crawl / user
- [ ] Registry + `/tariff` + маркетинг

### 1.3. Реестр finding codes

- [ ] Заполнить codes **по всей матрице Части II** (даже если detector позже)
- [ ] Маппинг code → корзина
- [ ] Черновики «Описание» (можно коротко)

**Готово когда:** лимиты + полный реестр кодов (статус detector может быть ⬜).

---

## Этап 2 — Инфра proxy2 ⬜ · **Волна 3** (не раньше стабильного MVP A)

> **Не начинать «с нуля проекта».** Сначала волна 2 на cabinet.  
> Триггер: A работает / не хватает ресурсов / нужны HTML или отдельная БД.

- [ ] SSH harden (ключ, не слабый пароль на 22)
- [ ] Firewall / whitelist
- [ ] User `titlo-audit`
- [ ] PHP = majoir cabinet + ext (xml, curl, mbstring, mysql, zlib)
- [ ] Composer, Git, Supervisor
- [ ] MySQL audit на proxy2 (решение финальное)
- [ ] Dir HTML `/var/lib/titlo-site-audit/html/` + права
- [ ] LVM: расширить LV если планируем html=all
- [ ] Сеть: proxy2↔DB, cabinet↔snapshots API; **без** proxy модемов
- [ ] Healthcheck
- [ ] Deploy path + restart supervisor на proxy2 в runbook

---

## Этап 3 — БД ⬜ · Волна 2 (main) → Волна 4 (remote)

### 3a — старт на основной MySQL · Волна 2
- [ ] Миграции `site_audit_*` в текущей DB кабинета (быстрый старт)
- [ ] Модели / connection default
- [ ] Индексы, сидер

### 3b — вынос на proxy2 · Волна 3–4
- [ ] Second connection `site_audit` → MySQL на proxy2
- [ ] Миграции на remote, перенос/dual-write план
- [ ] Backup audit DB
- [ ] Prune + retention на remote

- [x] Поля pages под сигналы A–C (nullable ok)
- [x] Prune job + retention (уже на 3a) — `site-audit:prune` + auto после aggregate (`history_keep_per_project`)

---

## Этап 4 — Ядро краула ⬜

### Discovery
- [x] URL normalize
- [x] robots.txt (fetch + sanity + Disallow check; стартовая очередь + links)
- [x] sitemap (+ index) + дообход по внутренним ссылкам до лимита (всегда, без флага)
- [x] CSV/textarea import (seed_urls)
- [x] tariff truncate
- [x] exclude patterns (legacy в API; UI → виртуальный robots)
- [x] виртуальный robots.txt (подмена живого файла на краул)

### Fetch
- [x] Guzzle timeout/retry/UA (`SiteAuditFetcher` + UA session rotate)
- [x] redirect chain + limit
- [x] per-host throttle (`SiteAuditHostThrottle`)
- [x] headers + size (`size_bytes`, `page_too_large`)
- [ ] body tempfile only — ⏸ Wave 2: body in memory, discard after parse; tempfile/HTML sink → Wave 4

### Parse signals (база для многих отчётов)
- [x] title, description, h1(+count), h2 count
- [x] canonical, meta robots, x-robots-tag
- [x] word_count, text_len, content_hash / simhash
- [x] img_count, img_without_alt, unique_img_src_count
- [x] iframe/frame count
- [x] mixed content candidates (http resources)
- [x] internal/external links extract (internal → `out_links_json`; external → findings)
- [x] strong/em counts + detector `too_many_strong` (порог `site_audit.strong_max`)
- [x] charset / doctype sniff
- [x] HTML → discard после parse (`unset` body); storage pipeline → Wave 4 HTML.gz

### Pipeline jobs
- [x] Discover / FetchParse / Aggregate / Prune
- [x] Progress poll
- [x] Idempotent aggregate

**Готово когда (волна 2):** discover+fetch+parse+aggregate на local/cabinet; tempfile/HTML storage не блокер MVP A.

---

## Этап 5 — Очереди ⬜

### 5a — временно на cabinet · Волна 2 `💻`
- [x] Queue `site_audit` (+ aggregate jobs)
- [x] Supervisor 2 procs **на cabinet**: `cabinet-titlo-site-audit` в `deploy/supervisor/cabinet-titlo.conf.example` + restart в `deploy-titlo.sh`; local `scripts/dev-site-audit-queue.sh`
- [x] Max 1 crawl/user, per-host throttle (базово)
- [x] Failed jobs monitoring — `php artisan site-audit:failed` (+ `--json`)

### 5b — перенос на proxy2 · Волна 3–4 `🖥️`
- [ ] Supervisor 2–4 procs **на proxy2**
- [ ] Cabinet больше не обрабатывает `site_audit` (или standby=0)
- [ ] В `deploy-titlo.sh` / docs: restart **proxy2** site_audit
- [ ] Global cap, backpressure
- [ ] Проверка: краул не идёт через 3proxy/LTE

**Критерий 5a:** малый crawl A проходит на cabinet.  
**Критерий 5b:** тот же crawl проходит на proxy2; cabinet UI без изменений.

---

## Этап 7 — UI shell ⬜

Делается **до/параллельно** наполнению отчётов: один шаблон отчёта → все пункты матрицы подключаются.

- [x] Убрать «В разработке»
- [x] Routes + ACL + demo read-only
- [x] Project CRUD + settings (delete; firstOrCreate; virtual_robots / legacy exclude)
- [x] Start crawl + progress (**batch:** несколько доменов, по одному на строку)
- [x] **Сводный тех. аудит** shell (4 корзины)
- [x] **Сводный SEO-аудит** shell (4 корзины) — вкладка SEO
- [x] График динамики по датам crawl
- [x] Дерево отчётов (tech / seo) с бейджами
- [x] Шаблон страницы отчёта: таблица, фильтры, Описание, CSV, «Показать»
- [x] История crawl (+ delete + prune)
- [x] Шаринг отчёта (link) — как Labrika (`/public/share/site-audit/{token}`)
- [x] Экспорт XLSX (сводка + отчёт; CSV уже был)
- [x] Экспорт DOCX (сводка, OOXML без PhpWord)
- [x] Расписание полного аудита — weekly/biweekly/triweekly/monthly, только платный тариф; `site-audit:run-schedules` hourly

---

## Этап 8 — Тарифы / уведомления ⬜

- [ ] Registry limits
- [ ] Block start when exhausted
- [ ] LimitsComposer
- [ ] `/tariff` + marketing
- [ ] Email done + preferences

---

## Этап 9 — HTML.gz remote ⬜ · **только Волна 4** `🖥️`

> До cutover на proxy2 HTML в прод не включаем (максимум local dev path).

- [ ] save_html off|findings|landing|all
- [ ] Writer gzip/zstd на proxy2
- [ ] keys в pages; **не** в main DB blob
- [ ] UI open snapshot
- [ ] Prune files + disk alerts
- [ ] Bench 1k html=all

---

## Этап 12 — Пилот / hardening ⬜

- [ ] Pilot 1–2k / 5–20k
- [ ] 10 crawls queued stress
- [ ] Kraken regression
- [x] Incremental by content_hash — `content_unchanged` + skip/copy HEAD images/assets; `SITE_AUDIT_INCREMENTAL`
- [ ] Runbook deploy workers
- [x] Update this checklist continuously

---

## Этап 13 — Маркетинг / демо 🟡

- [x] Landing модуля — `/audit-sajta/` (`AuditSajtaLanding` + тарифы/FAQ/CTA демо)
- [x] Demo dataset — `DemoCabinetModuleSeeder::seedSiteAudit` + share `demo-site-audit-showcase`
- [x] Tariff copy — `siteAudit` / `siteAuditCrawls` в `tariffs.generated.ts` + card layout

---

# ЧАСТЬ II — Полная матрица отчётов = страницы Labrika

> Статус строки: платформа / detector / UI. Отчёт «готов», только если все три ✅ (или явно ⏸/✖).

**Колонки в работе ниже разбиты чекбоксами:** Spec · Detector · API/UI · CSV · в сводке.

---

## Этап 6 — Технический аудит (все пункты меню Labrika) ⬜

### 6.0. Сводка и оболочка tech

| Отчёт | Фаза | Spec | Detector | API/UI | CSV | Сводка |
|-------|------|------|----------|--------|-----|--------|
| Сводный тех. аудит | A | [x] | [x] | [x] | [x] | — |
| График динамики tech | A | [x] | [x] | [x] | — | — |
| Предупреждение «индекс ПС ≠ страниц сайта» | B | [x] | [x] | [x] | — | [x] |

### 6.1. Доступность / HTTP

| Отчёт (Labrika) | Фаза | Spec | Detector | API/UI | CSV | Сводка | Заметки |
|-----------------|------|------|----------|--------|-----|--------|---------|
| Анализ доступности сайта | B | [x] | [x] | [x] | [x] | [x] | `site_availability`: корень + fail-rate unreachable/5xx по краулу |
| Ошибки 4xx | A | [x] | [x] | [x] | [x] | [x] | |
| Ошибки 5xx | A | [x] | [x] | [x] | [x] | [x] | |
| Недоступные страницы | A | [x] | [x] | [x] | [x] | [x] | timeout/DNS/connect |
| Страницы, содержащие битые ссылки | C | [x] | [x] | [x] | [x] | [x] | lite: crawl 4xx + sample HEAD (`page_has_broken_links`) |
| Плохие ссылки | C | [x] | [x] | [x] | [x] | [x] | `page_has_bad_links`: empty/#/javascript:/unresolvable; ≠ HTTP-битые |
| Выбросы ошибок | C | [x] | [x] | [x] | [x] | [x] | `error_spike`: status/path cluster + delta vs прошлый краул |

### 6.2. HTML / разметка

| Отчёт | Фаза | Spec | Detector | API/UI | CSV | Сводка | Заметки |
|-------|------|------|----------|--------|-----|--------|---------|
| Критические ошибки HTML | C | [x] | [x] | [x] | [x] | [x] | `html_critical_errors`: libxml ERROR/FATAL + эвристики; сэмпл |
| Неверный HTML DOCTYPE | B | [x] | [x] | [x] | [x] | [x] | sniff |
| Страницы с frame/iframe | B | [x] | [x] | [x] | [x] | [x] | |
| Несколько title / description | A | [x] | [x] | [x] | [x] | [x] | count>1 |
| Ошибки robots.txt | B | [x] | [x] | [x] | [x] | [x] | parse + sanity |
| Потерянные файлы | C | [x] | [x] | [x] | [x] | [x] | `lost_file`: CSS/JS HEAD + referrer; `asset_srcs_json` |
| Страницы с rel=canonical | A | [x] | [x] | [x] | [x] | [x] | список + target |
| Canonical на чужой / пустой / конфликт | A | [x] | [x] | [x] | [x] | [x] | findings + `canonical_not_self` (B) |
| Очень большие страницы | A | [x] | [x] | [x] | [x] | [x] | порог bytes |
| Файлы с внешних сайтов | B | [x] | [x] | [x] | [x] | [x] | external assets |
| Редиректы | A | [x] | [x] | [x] | [x] | [x] | |
| Множественные редиректы | A | [x] | [x] | [x] | [x] | [x] | chain len |
| Смешанный контент | B | [x] | [x] | [x] | [x] | [x] | http on https |

### 6.3. Изображения

| Отчёт | Фаза | Spec | Detector | API/UI | CSV | Сводка | Заметки |
|-------|------|------|----------|--------|-----|--------|---------|
| Все изображения | C | [~] | [~] | [~] | [~] | — | page-level: alt + broken + heavy; без 100k rows |
| Страницы без уникальных изображений | B | [x] | [x] | [x] | [x] | [x] | `no_unique_images` |
| Изображения без alt | B | [x] | [x] | [x] | [x] | [x] | из parse (фаза A code) |
| Слишком тяжёлые изображения | C | [x] | [x] | [x] | [x] | [x] | `heavy_image` HEAD Content-Length; порог `heavy_image_bytes` |
| Битые изображения | C | [x] | [x] | [x] | [x] | [x] | `broken_image` HEAD-сэмпл; `img_srcs_json` |

### 6.4. Скорость / UX / безопасность

| Отчёт | Фаза | Spec | Detector | API/UI | CSV | Сводка | Заметки |
|-------|------|------|----------|--------|-----|--------|---------|
| Мобильные устройства (PSI-like) | C | [x] | [x] | [x] | [x] | [x] | `psi_mobile`; Google PSI v5; gate `SITE_AUDIT_PSI` |
| Компьютеры (PSI-like) | C | [x] | [x] | [x] | [x] | [x] | `psi_desktop`; strategy=desktop |
| Безопасность | C | [x] | [x] | [x] | [x] | [x] | `security_headers` + HSTS/XFO/XCTO/CSP/RP/PP + COOP/COEP/CORP; mixed/insecure_form |
| Sitemap (ветка) | B | [x] | [x] | [x] | [x] | [x] | `sitemap_*` / `not_in_sitemap` |

### 6.5. Доп. tech-факторы с витрины / типичный краул (если нет отдельного пункта UI — всё равно finding)

| Фактор | Фаза | Spec | Detector | API/UI | CSV | Сводка |
|--------|------|------|----------|--------|-----|--------|
| Страницы без title | A | [x] | [x] | [x] | [x] | [x] |
| Страницы без description | A | [x] | [x] | [x] | [x] | [x] |
| Страницы без H1 | A | [x] | [x] | [x] | [x] | [x] |
| Несколько H1 | A | [x] | [x] | [x] | [x] | [x] |
| Title слишком короткий / длинный | B | [x] | [x] | [x] | [x] | [x] |
| Description слишком короткий / длинный | B | [x] | [x] | [x] | [x] | [x] |
| Soft 404 (200 + мало контента / паттерн) | C | [x] | [x] | [x] | [x] | [x] |
| WWW / non-WWW / http→https нормализация | B | [x] | [x] | [x] | [x] | [x] | `unify_www` / `force_https` / slash |
| Дубли URL (trailing slash, register) | B | [x] | [x] | [x] | [x] | [x] | `duplicate_url_variants` + canonicalKey |
| Orphan pages (нет входящих) | C | [x] | [x] | [x] | [x] | [x] |
| Глубина клика | C | [x] | [x] | [x] | [x] | [x] | lite: `click_depth` + `deep_pages` (порог config) |
| Pagination / infinite params risk | C | [x] | [x] | [x] | [x] | [x] | lite: `pagination_param` + `risky_query_params` |

**Критерий этапа 6 (MVP-срез):** все строки с фазой **A** = ✅ по DoD. **Выполнено 2026-07-20.** Остальные B/C остаются в матрице.

---

## Этап 10 — SEO-аудит (все пункты меню Labrika) ⬜

### 10.0. Сводка SEO

| Отчёт | Фаза | Spec | Detector | API/UI | CSV | Сводка |
|-------|------|------|----------|--------|-----|--------|
| Сводный SEO-аудит | B | [x] | [x] | [x] | [x] | — |
| График динамики SEO | B | [x] | [x] | [x] | — | — | twin table из `counts_json` |

### 10.1. Пункты сайдбара SEO (live-map)

| Отчёт (Labrika) | Фаза | Spec | Detector | API/UI | CSV | Сводка | Заметки |
|-----------------|------|------|----------|--------|-----|--------|---------|
| Конкуренты сайта → сводные / Яндекс | D | [x] | [x] | [x] | — | — | deep-link `site_competitors` → `/competitor-analysis` (не краул) |
| SEO-ошибки META тегов | B | [x] | [x] | [x] | [x] | [x] | virtual `seo_meta_errors` + `multiple_canonical`; без MetaTagsController |
| Дубли TITLE | A | [x] | [x] | [x] | [x] | [x] | можно закрыть в этапе 6/A |
| Дубли Description | A | [x] | [x] | [x] | [x] | [x] | |
| Похожие страницы | B | [x] | [x] | [x] | [x] | [x] | simhash; сэмпл |
| Блокировки индексации | B | [x] | [x] | [x] | [x] | [x] | virtual: noindex+robots_* |
| Страницы с тегом noindex | A | [x] | [x] | [x] | [x] | [x] | |
| Тошнота слов на страницах | B | [x] | [x] | [x] | [x] | [x] | `text_nausea` (classic/academic lite) |
| Тощие страницы | B | [x] | [x] | [x] | [x] | [x] | |
| Поиск плагиата на посадочных | C | [x] | [x] | [x] | [x] | [x] | lite internal + вкладка «Антиплагиат» (внешний SERP/шинглы, выборочно) |
| Потерянные посадочные | B | [x] | [x] | [x] | [x] | [x] | `landing_not_crawled` ← monitoring.page |
| Изменения URL посадочных | B | [x] | [x] | [x] | [x] | [x] | `landing_url_changed` ← diff monitoring.page между краулами |
| «Взрослый» контент | C | [x] | [x] | [x] | [x] | [x] | `adult_content` keyword lite |
| Негативный контент | C | [x] | [x] | [x] | [x] | [x] | `negative_content` keyword lite |
| Каннибализация | C | [x] | [x] | [x] | [x] | [x] | `keyword_cannibalization` ← monitoring query в title/h1 чужих URL |
| Каннибализация рекламой | C | [x] | [x] | [x] | [x] | [x] | `ad_cannibalization` lite: promo/PPC-URL vs SEO-посадочная; Директ/SERP-ads позже |
| Каннибализация по сниппетам | B | [x] | [x] | [x] | [x] | [x] | `serp_snippet_cannibalization`: ТОП выдачи по запросу мониторинга, ≥2 своих URL; gate SERP_CANNIBALIZATION/SNIPPETS |

### 10.2. SEO-факторы с публичной витрины (часто отдельные отчёты/подпункты)

| Фактор | Фаза | Spec | Detector | API/UI | CSV | Сводка | Заметки |
|--------|------|------|----------|--------|-----|--------|---------|
| Число страниц в индексе Яндекс | B | [x] | [x] | [x] | — | [x] | `progress_json.serp_index` + finding при mismatch |
| Число страниц в индексе Google | B | [x] | [x] | [x] | — | [x] | то же |
| Закрытие robots.txt | B | [x] | [x] | [x] | [x] | [x] | Disallow: / для * |
| Nofollow (meta/links) | B | [x] | [x] | [x] | [x] | [x] | |
| Текст в noindex | B | [x] | [x] | [x] | [x] | [x] | `text_in_noindex` |
| Посадочные в sitemap | B | [x] | [x] | [x] | [x] | [x] | `landing_not_in_sitemap` ← monitoring.page |
| TITLE = DESCRIPTION | B | [x] | [x] | [x] | [x] | [x] | `title_equals_description` |
| TITLE = H1 | B | [x] | [x] | [x] | [x] | [x] | `title_equals_h1` |
| DESCRIPTION = H1 | B | [x] | [x] | [x] | [x] | [x] | `description_equals_h1` |
| H1 = H2 (и иерархия) | B | [x] | [x] | [x] | [x] | [x] | `h1_equals_h2` + `heading_hierarchy` (до H1 / skip уровня) |
| Переспам в META / H1 | B | [x] | [x] | [x] | [x] | [x] | `meta_spam` / `h1_spam` |
| Переспам в тексте / биграммы / триграммы | B | [x] | [x] | [x] | [x] | [x] | `text_bigram_spam` + `text_trigram_spam` |
| Много strong / спам заголовками | B | [x] | [x] | [x] | [x] | [x] | `too_many_strong` (порог `strong_max`) |
| Повторы слова в предложении | C | [x] | [x] | [x] | [x] | [x] | `word_repeat_in_sentence` |
| Внутренние ссылки на посадочные | C | [x] | [x] | [x] | [x] | [x] | `landing_no_inbound_internal` (0 inbound из краула) |
| Дубли одной ссылки на странице | B | [x] | [x] | [x] | [x] | [x] | `duplicate_links` |
| Исходящие на другие сайты | B | [x] | [x] | [x] | [x] | [x] | `external_links` (info) |
| Страницы без исходящих внутренних | C | [x] | [x] | [x] | [x] | [x] | `no_outbound_internal` | |
| Сниппеты Яндекс / Google | B | [x] | [x] | [x] | [x] | [x] | `serp_snippets` + mismatch/not_indexed; gate `SITE_AUDIT_SERP_SNIPPETS` |
| Подсветка источника сниппета | C | [x] | [x] | [x] | [x] | [x] | `serp_snippet_source` (title/h1/description ← SERP); gate SERP_SNIPPETS |
| Вероятные аффилиаты | C | [x] | [x] | [x] | [x] | [x] | `probable_affiliate` — исходящие на affiliate-сети |
| Телефон / адрес на коммерческих | C | [x] | [x] | [x] | [x] | [x] | `commercial_missing_contacts` (эвристика commercial + phone/address) |
| Соответствие запросов посадочным | D | [x] | [x] | [x] | [x] | [x] | `landing_query_mismatch` lite: query tokens vs title/h1/description; полный TF позже |
| Коммерческие факторы | D | [x] | [x] | [x] | [x] | [x] | lite pack `commercial_factors`: price/CTA/delivery/payment/stock/reviews + contacts; vs ТОП конкурентов — позже |

**Критерий этапа 10:** все **B** из §10.1 + ключевые B из §10.2 = ✅; A-дубли уже закрыты в этапе 6.

---

## Этап 11 — Тяжёлое / масштабные детекторы (фаза C) ⬜

Чеклист не «одна строка», а подпроекты:

### 11.1. Link graph
- [x] Спека хранения links (не взрывать БД) — `out_links_json` (cap 150 URL) + `img_srcs_json`/`asset_srcs_json` на page; полный graph table — не нужен на MVP
- [x] Extract on parse (lite)
- [x] Broken link checker lite (crawl status + sample HEAD, budget)
- [x] Отчёты lite: битые (`page_has_broken_links` / `broken_internal_link`), orphans; depth — `click_depth` / `deep_pages`
- [x] Плохие ссылки (`page_has_bad_links`) — empty/#/javascript:/unresolvable
- [ ] Пилот на ≤5k URL / полный graph queue

### 11.2. Images subsystem
- [x] Page-level agg: alt + broken + heavy (без 100k rows)
- [x] Optional sample asset HEAD (`broken_image_head_max`)
- [x] UI через findings-отчёты (не гигантская таблица всех img)
- [x] Полный каталог изображений / CDN-отчёт — ⏸ не на Волне 5 (page-level достаточно)

### 11.3. PSI / performance
- [x] Provider: Google PageSpeed Insights API v5 (`SiteAuditPsiProbe`)
- [x] Sample strategy: посадочные → home → crawl (cap `psi_max_urls`)
- [x] Mobile + Desktop reports (`psi_mobile` / `psi_desktop`)
- [x] Budget: gate `SITE_AUDIT_PSI` + optional API key; timeout/max URLs
- [ ] CrUX field data / полный audit pack — позже

### 11.4. Content risk
- [x] Plagiarism pipeline (посадочные) — lite internal + вкладка внешнего (Titlo TextUniqueness, выборочный запуск); сторонний Text.ru API — не нужен
- [x] Adult / negative classifiers — `adult_content` / `negative_content` (`SiteAuditContentRisk`, keyword lists)
- [x] False-positive review UX — через существующий ignore findings (+ help texts)
- [x] Word repeats in sentence — `word_repeat_in_sentence` (optional thresholds)

### 11.5. JS rendering
- [x] Нужен ли headless — **решение:** не на MVP/Волне 5; static HTML crawl достаточен для большинства сайтов; revisit при запросах SPA-клиентов
- [ ] Отдельная очередь / лимиты CPU на proxy2 — после решения «нужен headless»
- [ ] Не ломать Kraken RAM — N/A пока нет headless

### 11.6. Security report pack
- [x] Lite: HSTS / X-Frame-Options / X-Content-Type-Options (`missing_*` + virtual `security_headers`); mixed_content уже есть
- [x] HTTPS forms → `insecure_form` (form action=http на HTTPS-странице)
- [x] CSP / Referrer-Policy — `missing_csp` / `missing_referrer_policy` (+ virtual pack)
- [x] Permissions-Policy — `missing_permissions_policy` (+ Feature-Policy fallback)
- [x] Полный security audit pack — `missing_coop` / `missing_coep` / `missing_corp` (+ virtual pack)

---

## Этап 14 — UX-паритет Labrika (не «факторы», но отдельные страницы/фичи) ⬜

| Фича | Фаза | Spec | Backend | UI | Заметки |
|------|------|------|---------|-----|---------|
| 4 корзины приоритета | A | [x] | [x] | [x] | |
| Бейджи-счётчики в дереве | A | [x] | [x] | [x] | цвет: 0=зелёный; critical/other/warning/info |
| Кнопка «Описание» фактора | A | [x] | [x] | [x] | блок что/почему/как над фильтром |
| Кнопка «Показать» | A | [x] | [x] | [x] | hot-table → отчёт |
| Архив отчётов | B | [x] | [x] | [x] | модал на сводке краула + кнопка у проекта; не ZIP |
| Шаринг HTML-ссылкой клиенту | B | [x] | [x] | [x] | |
| Экспорт XLSX | B | [x] | [x] | [x] | |
| Экспорт DOCX | C | [x] | [x] | [x] | сводка краула (buckets + counts) |
| Печать | C | [x] | [x] | [x] | `@media print` + кнопка на сводке/отчёте/share |
| Расписание полного аудита | B | [x] | [x] | [x] | weekly…monthly; paid only |
| Задачи/to-do из аудита (ИИ) | D | [x] | [x] | [x] | `SiteAuditActionPlanBuilder`; modal «План работ»; optional DeepSeek резюме (paid) |
| Мониторинг изменений страниц (HTML+diff+screenshot) | D | [ ] | [ ] | [ ] | рядом с html.gz |
| Сравнение двух crawl (diff findings) | B | [x] | [x] | [x] | `SiteAuditCrawlDiff`; `/crawl/{id}/diff` |
| Комментарии/статус «исправлено» на finding | C | [x] | [x] | [x] | `site_audit_finding_notes`; fixed скрывается из counts |
| Игнор finding / false positive | B | [x] | [x] | [x] | project-level `site_audit_ignores`; URL или весь код |
| Мультидомен / поддомены в одном project | C | [x] | [x] | [x] | `extra_hosts` в settings + seed/internal; batch доменов = отдельные projects |
| White-label отчёт | D | [x] | [x] | [x] | публичный share без Titlo; brand_name/url/logo; paid only |

---

## Этап 15 — Переиспользование модулей Titlo (не дублировать краул) ⬜

| Модуль | Что встроить в аудит | Статус |
|--------|----------------------|--------|
| Index check (title+snippet) | сниппеты, каннибализация | [x] | lite в аудите + deep-link `site_index_check` → `/index-check`; SERP gate |
| HTTP Headers | сигналы headers / security | [x] | pack в аудите + deep-link `site_http_headers` → `/http-headers` |
| Meta tags monitoring | SEO META ошибки | [x] | virtual `seo_meta_errors` + deep-link `site_meta_tags` → `/meta-tags` |
| Мониторинг / ядро | потерянные посадочные, URL changes | [x] | `landing_not_*` + `landing_url_changed` |
| Есенин / text tools | тошнота, тощие, переспам | [x] | lite в аудите + deep-link `site_esenin` → `/esenin-text-check` (полный разбор — в модуле) |
| Анализ конкурентов | ветка «Конкуренты сайта» | [x] | deep-link `site_competitors` + баннер на SEO-сводке → `/competitor-analysis` |
| AI generation | задачи из findings (D) | [x] | план работ + optional DeepSeek резюме (`SITE_AUDIT_ACTION_PLAN_AI`) |

---

# Сводка покрытия (для контроля «не короткий ли список»)

Считать периодически:

| Группа | Пунктов в матрице (ориентир) | Закрыто DoD |
|--------|------------------------------|-------------|
| Tech UI Labrika (§6.0–6.4) | ~30+ | 0 |
| Tech extra factors (§6.5) | ~12 | 0 |
| SEO UI Labrika (§10.1) | ~17 | 0 |
| SEO vitрина (§10.2) | ~25 | 0 |
| UX parity (§14) | ~15 | 0 |
| Integrations (§15) | ~7 | 0 |
| **Итого отчётных единиц** | **~100+** | **0** |

Платформенные этапы 2–5, 7–9 — отдельные (~80 чекбоксов) и **не заменяют** матрицу отчётов.

---

## Порядок работ (= волны, не прыгать через proxy2)

```
Волна1  Спека (этап 1)                         ← без серверов
   ↓
Волна2  DB(main) + crawl + queue cabinet + UI + отчёты A + тарифы + smoke
        (этапы 3, 4, 5a, 7, 6A, 8, 12a)        ← proxy2 НЕ нужен
   ↓
Волна3  Готовим proxy2 (этап 2, 3b)            ← настройка внешнего сервера
   ↓
Волна4  Cutover workers + audit DB + HTML.gz   ← proxy2 ОСНОВНОЙ
        (этапы 5b, 9, 12b)
   ↓
Волна5  Отчёты B/C, UX parity, маркетинг       (10, 11, 14, 13, 15)
```

**Запрещено:** начинать этап 2/9 «потому что сервер уже купили», пока нет рабочего A на cabinet — иначе отладка краула смешается с сетью/Kraken/MySQL remote.

---

## Definition of Done (любая задача)

1. Код/конфиг в репо или серверный conf в доке  
2. Чекбокс `[x]` + Changelog  
3. Нет секретов в git  
4. Restart supervisor при деплое worker  
5. Smoke  

Для **отчёта** — полный DoD из шапки Части II.

---

## Changelog

| Дата | Что | Комментарий |
|------|-----|-------------|
| 2026-07-20 | v1 чеклист | платформа + MVP A |
| 2026-07-20 | v2 полный | матрица ~100+ отчётов Labrika |
| 2026-07-20 | v2.1 этапность | волны 0–5; proxy2 с волны 3–4 |
| 2026-07-20 | **Smoke local** | crawl #1–2 titlo.ru |
| 2026-07-20 | **Этап 7 UI shell** | list/crawl/report/CSV/poll |
| 2026-07-20 | **Этап 8 + 6A polish** | LimitsComposer/header/tariff dual; email; human meta; динамика |
| 2026-07-20 | **6A detectors + local sync** | thin/title/desc length/equals/alt; sync из UI; reaggregate #2 |
| 2026-07-20 | **Prune + robots B-lite + меню** | delete crawl; `site-audit:prune`; robots.txt probe; indexing_blocked virtual; main_projects + permission |
| 2026-07-20 | **B-lite HTML + exclude + project delete** | iframe/mixed/doctype; pages_with_canonical; exclude patterns; delete project; A-матрица synced |
| 2026-07-20 | **Share + SEO shell + simhash** | public `/public/share/site-audit/{token}`; вкладки tech/SEO; similar_pages + duplicate_content |
| 2026-07-20 | **BFS + nofollow/external + schedule** | CrawlEngine BFS; meta/links nofollow; external_assets; schedules daily/weekly |
| 2026-07-20 | **XLSX + soft404 + orphans** | Maatwebsite export сводки/отчёта; soft_404; orphan_pages по out_links |
| 2026-07-20 | **URL norm + broken links lite** | unify www/https/slash; duplicate_url_variants; out_links=URL; page_has_broken_links + HEAD sample; smoke #9 |
| 2026-07-20 | **Click depth + DOCX** | `click_depth` BFS; deep_pages; DOCX сводка (Zip/OOXML); smoke #10 |
| 2026-07-20 | **Дообход всегда** | убран чекбокс/флаг `bfs`; sitemap+links — ядро краула |
| 2026-07-20 | **UA ротация всегда** | убран чекбокс; sticky UA + смена после 403/429/503 |
| 2026-07-20 | **Расписание paid-only** | убран daily; weekly/2w/3w/month; Free нельзя включить |
| 2026-07-20 | **WWW/HTTP mirror probe** | `www_both_available` / `http_https_both_available` → critical; нормализация URL всегда on (без UI) |
| 2026-07-20 | **Broken links всегда** | убран switch; check_broken_links всегда true |
| 2026-07-20 | **Dup groups UI** | вид Группы/Список для title/desc/content; цветные карточки |
| 2026-07-20 | **Tree search + presets** | поиск отчёта; Все/С находками/Грубые/…; severity presets без нулей |
| 2026-07-20 | **Severity калибровка** | dup title/desc/content, multiple H1/title, long title/desc, alt → warning/critical по UX |
| 2026-07-20 | **Help tips** | SiteAuditFindingHelp: что/почему/как для всех codes; над умным фильтром |
| 2026-07-20 | **Badge colors** | 0=зелёный; грубые=красный; прочие=оранж; замечания=синий; инфо=серый |
| 2026-07-20 | **Parse signals + 5a supervisor** | h2/text_len/unique_img/charset/strong/em; migration; `cabinet-titlo-site-audit`×2; deploy restart; `dev-site-audit-queue.sh` |
| 2026-07-20 | **DoD фазы A закрыт** | сводка+динамика+[Показать]; audit 30 A-codes help/emit; `site-audit:failed`; этап 6A ✅ |
| 2026-07-21 | **proxy2 отложен** | волны 3–4 / этапы 2,3b,5b,9 = ⏸ «в самую последнюю очередь»; обкатка только local/cabinet |
| 2026-07-21 | **B-lite equals/links + SEO динамика** | `description_equals_h1`, `h1_equals_h2`, `too_many_strong`, `duplicate_links`, `external_links`; help/filter; twin динамика tech/SEO |
| 2026-07-21 | **Text metrics B-lite** | тошнота/биграммы/META+H1 spam/noindex text/no unique images; parse columns; `SiteAuditTextMetrics` |
| 2026-07-21 | **Crawl diff** | сравнение counts + URL appeared/fixed; UI `/crawl/{id}/diff`; кнопка на сводке |
| 2026-07-21 | **Ignore findings** | `site_audit_ignores` (project+code+url); кнопки в отчёте; counts/CSV/XLSX без игнора |
| 2026-07-21 | **Sitemap coverage** | probe+meta `urls_gz`; `sitemap_missing/error`, `not_in_sitemap`, `sitemap_not_crawled` |
| 2026-07-21 | **Landings ↔ monitoring** | `landing_not_in_sitemap` / `landing_not_crawled` из `monitoring_keywords.page` |
| 2026-07-21 | **Landing URL changes** | `landing_url_changed`: снимок `by_keyword` в progress_json, diff с прошлым done-краулом |
| 2026-07-21 | **Архив отчётов** | модал списка краулов проекта на сводке; кнопка «Архив» у проекта; `#sa-archive` |
| 2026-07-21 | **B: индекс / доступность / index-check lite** | `index_count_mismatch` (XML found, `SITE_AUDIT_SERP_INDEX`); `site_availability`; каннибализация lite = `duplicate_title` |
| 2026-07-21 | **META virtual + URL risks** | `seo_meta_errors` + `multiple_canonical`; `no_outbound_internal`; `risky_query_params` / `pagination_param` |
| 2026-07-21 | **Security headers lite + печать** | `missing_hsts`/XFO/XCTO + virtual `security_headers`; `missing_charset`; `@media print` + кнопка |
| 2026-07-21 | **canonical_not_self + insecure_form** | self≠canonical; form action=http на HTTPS; Есенин §15 = [~] lite |
| 2026-07-22 | **Prod deploy MVP A** | site-audit на cabinet.titlo; supervisor `cabinet-titlo-site-audit`; Blade foreach fix |
| 2026-07-22 | **Batch domains** | textarea «Домены» — N краулов за запуск; лимит месяца поштучно |
| 2026-07-22 | **Virtual robots.txt** | UI вместо exclude; probe+Disallow на queue/links; живой robots по умолчанию |
| 2026-07-22 | **Волна 5 фокус** | B почти закрыт; next candidates: SERP snippets · этап 11 C · маркетинг 13 |
| 2026-07-22 | **SERP snippets B** | `SiteAuditSerpSnippetsProbe` + `serp_snippets` / title_mismatch / not_indexed; `SITE_AUDIT_SERP_SNIPPETS`; §10.2 ✅ |
| 2026-07-22 | **C: bad links + images** | `page_has_bad_links`; `broken_image`/`heavy_image` + `img_srcs_json`; §6.1/6.3/11.1–11.2 |
| 2026-07-22 | **C: PSI mobile/desktop** | `SiteAuditPsiProbe` + `psi_mobile`/`psi_desktop`; `SITE_AUDIT_PSI` (+ API key); §6.4/11.3 |
| 2026-07-22 | **C: error spikes** | `error_spike` status/path cluster + crawl_delta; §6.1 |
| 2026-07-22 | **C: HTML + lost files** | `html_critical_errors`; `lost_file` + `asset_srcs_json`; §6.2 |
| 2026-07-22 | **C: content risk 11.4** | `adult_content` / `negative_content` / `word_repeat_in_sentence` / `landing_plagiarism_suspect`; v0.2.8 |
| 2026-07-22 | **§13 маркетинг lite + 11.6 CSP** | `/audit-sajta/`; tariff rows; demo seed+share; `missing_csp`/`missing_referrer_policy`; v0.2.9 |
| 2026-07-22 | **§14 notes + landing inbound** | `site_audit_finding_notes` (comment/fixed); `landing_no_inbound_internal`; v0.3.0 |
| 2026-07-22 | **Cannibal + contacts + rich landing** | `keyword_cannibalization`; `commercial_missing_contacts`; `AuditSajtaLanding`; 11.5 decision; v0.3.1 |
| 2026-07-22 | **Affiliates + snippet source + multi-host** | `probable_affiliate`; `serp_snippet_source`; `missing_permissions_policy`; `extra_hosts`; v0.3.2 |
| 2026-07-22 | **Ad cannibalization lite** | `ad_cannibalization` (promo/PPC vs SEO landing); v0.3.3 |
| 2026-07-22 | **Security pack COOP/COEP/CORP** | `missing_coop` / `missing_coep` / `missing_corp`; §11.6 ✅; v0.3.4 |
| 2026-07-22 | **White-label share lite** | публичный отчёт без Titlo; brand_name/url; paid; v0.3.5 |
| 2026-07-22 | **AI to-do / план работ** | `SiteAuditActionPlanBuilder` + modal; optional DeepSeek; v0.3.6 |
| 2026-07-22 | **Landing↔query match** | `landing_query_mismatch` (meta tokens); v0.3.7 |
| 2026-07-22 | **proxy2 freeze** | волны 3–4 / HTML.gz — заморожены; только cabinet + наблюдение |
| 2026-07-22 | **Commercial factors lite** | virtual `commercial_factors` + price/CTA/delivery/payment/stock/reviews; v0.3.8 |
| 2026-07-22 | **Tree C/D + competitors link** | дерево A–D (раньше C/D скрывались); `site_competitors` → `/competitor-analysis`; v0.3.9 |
| 2026-07-22 | **Trigram spam + bucket fix** | `text_trigram_spam`; UI-корзины без double-count virtual; v0.3.10 |
| 2026-07-22 | **Heading hierarchy** | `heading_hierarchy` (до H1 / skip уровня h1–h6); v0.3.11 |
| 2026-07-22 | **Incremental content_hash** | `content_unchanged`; skip HEAD img/assets + copy findings; v0.3.12 |
| 2026-07-22 | **White-label logo** | upload логотипа в share; публичный header; v0.3.13 |
| 2026-07-22 | **Beta banner** | баннер на UI: поддержка + CRM для замечаний |
| 2026-07-22 | **Index-check deep-link + unchanged UI** | `site_index_check` → `/index-check`; «без изменений N стр.»; v0.3.14 |
| 2026-07-22 | **Module deep-links pack** | meta / Есенин / HTTP headers + баннеры; §15 ✅; v0.3.15 |
| 2026-07-22 | **External plagiarism tab** | вкладка «Антиплагиат»: выборочные URL → TextUniqueness SERP; finding `landing_plagiarism_external`; v0.3.16 |
| 2026-07-22 | **SERP snippet cannibalization** | `serp_snippet_cannibalization`: ≥2 своих URL в ТОП по запросу мониторинга; v0.3.17 |
| 2026-07-22 | **Next (Волна 5)** | HTML-мониторинг ⏸ (html.gz/proxy2) · обкатка prod |
