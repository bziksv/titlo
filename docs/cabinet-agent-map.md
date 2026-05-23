# Кабинет — карта для агента

**Назначение:** быстро понять, **где лежит код**, **какой документ обновлять** после правок, **что не трогать**.  
Читать **вместе с** [cabinet-reference.md](./cabinet-reference.md) (детали) и [cabinet-performance-audit.md](./cabinet-performance-audit.md) (SQL/страницы).

---

## 1. Два репозитория

| | **datagon.ru** | **cabinet.datagon.ru** |
|---|----------------|-------------------------|
| **Путь на Mac** | `/Users/stanislav/Documents/projects/datagon.ru` | `/Users/stanislav/Documents/projects/cabinet.datagon.ru` |
| **Порт local** | **3001** (Next) | **3002** (nginx + php-fpm) |
| **Роль** | Маркетинг, демо UI, BFF `app/api/lk`, `app/api/demo` | Продукт: auth, модули, БД, лимиты |
| **Документация** | `docs/` (в т.ч. этот файл) | Код; описание — в `datagon.ru/docs/cabinet-*` |
| **Git** | site_seo_datagon | [bziksv/cabinet.datagon.ru](https://github.com/bziksv/cabinet.datagon.ru) |

**Правило:** бизнес-логику модулей **не дублировать в Next** — только прокси и UI демо ([architecture.md](./architecture.md), [api-lk.md](./api-lk.md)).

---

## 2. С чего начать (по типу задачи)

| Задача | Сначала открыть | Код |
|--------|-----------------|-----|
| Новая/сломанная **страница кабинета** | [cabinet-performance-audit.md](./cabinet-performance-audit.md) (есть ли URI в чек-листе) → `routes/web.php` | `app/Http/Controllers/*`, `resources/views/` |
| **Вёрстка / UI** кабинета | [cabinet-reference.md](./cabinet-reference.md) → «Эталон UI» → http://localhost:3002/html/ | `resources/views/`, `public/html/` |
| **Медленная страница / SQL** | [cabinet-performance-audit.md](./cabinet-performance-audit.md) §D–G | контроллер + composers (§8 reference) |
| **Меню / плитки модулей** | §3 ниже | `main_projects` (БД), `MenuComposer`, `MenuItemsPosition` |
| **Лимиты тарифа (prod)** | `LimitsComposer`, `profile-limits-composer.sh` | `app/Classes/Tariffs/`, `app/Http/ViewComposers/LimitsComposer.php` |
| **Демо на datagon.ru** | [api-lk.md](./api-lk.md), `docs/examples/demo-widget.md` | Next: `app/api/demo/`, `lib/lk-api.ts` |
| **PDF-отчёт модуля (mPDF)** | **[cabinet-pdf-report-template.md](./cabinet-pdf-report-template.md)** — эталон v6.9s, не пересобирать layout | `TextAnalyzerPdfService`, `TextAnalyzerPdfBranding`, `resources/views/*/export/pdf-body.blade.php` |
| **Лендинг модуля (Next)** | `docs/examples/module-landing-relevance.md` | `components/module-landings/`, `app/**/page.tsx` |
| **Деплой кабинета** | [cabinet-deploy.md](./cabinet-deploy.md) (§ **FastPanel** / Troubleshooting), [cabinet-servers.md](./cabinet-servers.md) | VPS s3: **FastPanel**, PHP **7.4** (`/opt/php74/bin/php`), FPM; PM2 — только если vhost на :3002 |
| **БД / что на прод, миграции** | **[cabinet-pending-db-and-deploy.md](./cabinet-pending-db-and-deploy.md)** | журнал: local vs prod, `migrate`, удаление behavior, support |
| **Локальный запуск** | `.cursor/rules/redbox-cabinet-dev.mdc` | `scripts/dev-local.sh` |

---

## 3. Меню и «где страница в UI»

```
main_projects (MySQL)
    → MenuItemsPosition::sortMenu()
    → MenuComposer (filter Spatie roles)
    → resources/views/navigation/sidebar.blade.php

НЕ из main_projects (жёстко в Blade):
    → navigation/menu.blade.php — news
    → menu-right — balance, tariff, limits
    → sidebar — partners
```

- Список модулей в БД: `MainProject` (`show=1` в меню, `show=0` — скрытые, но роут жив).
- Соответствие slug маркетинга ↔ URI кабинета: [cabinet-reference.md](./cabinet-reference.md) §6.3.
- Страницы **вне меню** — [cabinet-performance-audit.md](./cabinet-performance-audit.md) §C (обязательны в аудите).

---

## 4. Где лежит код кабинета

```
cabinet.datagon.ru/
├── routes/web.php              # почти весь UI (~550 строк) — первый поиск URI
├── routes/api.php              # cron, location, telegram (не layout)
├── app/Http/Controllers/       # ~70 контроллеров, имя ≈ модуль
├── app/Http/ViewComposers/     # Menu, Limits, News count, …
├── app/Http/Middleware/
├── app/Classes/                # Tariffs, Monitoring, Cron, Xml, …
├── app/Providers/ComposerServiceProvider.php
├── resources/views/            # Blade по модулю (meta-tags/, monitoring/, …)
├── resources/js/               # Vue (Mix) — meta-tags, duplicates, …
├── public/js/app.js            # сборка: npm run production (NODE_OPTIONS=--openssl-legacy-provider)
├── scripts/                    # dev-local.sh, profile-*.sh
└── storage/logs/laravel-*.log
```

### Типовые контроллеры по URI-префиксу

| Префикс URI | Контроллер(ы) | Views |
|-------------|---------------|-------|
| `/monitoring` | `MonitoringController`, `MonitoringAdminController`, `MonitoringStatisticsController`, … | `resources/views/monitoring/` |
| `/analyze-relevance`, `/history`, `/show-history` | `RelevanceController`, `HistoryRelevanceController` | `relevance-analysis/` |
| `/meta-tags` | `MetaTagsController` (`/meta-tags/projects` AJAX) | `meta-tags/` |
| `/cluster` | `ClusterController` | `cluster/` |
| `/html-editor` | `TextEditorController` | `html-editor/` |
| `/users`, `/manage-access` | `UsersController`, Spatie | `users/` |
| `/main-projects` | `MainProjectsController` | `main-projects/` |
| `/news` | `NewsController` | `news/` |
| `/checklist` | `CheckListController` | `checklist/` |
| `/ai-generation` | AI-контроллеры | `ai-generation/` |

Точный handler: `rg "Route::.*'/your-uri" routes/web.php` → имя контроллера.

---

## 5. Глобальная нагрузка (каждая страница с layout)

См. [cabinet-reference.md](./cabinet-reference.md) §8.

| Источник | Файл | Local (`SKIP_HEAVY_WEB_MIDDLEWARE=true`) |
|----------|------|------------------------------------------|
| Меню | `MenuComposer` | кэш сессии после 1-го захода |
| Лимиты шапки | `LimitsComposer` | **выключен** |
| Счётчик новостей | `CountUnreadNewsComposer` | **выключен** |
| Тариф в панели | `UserPanelComposer` | облегчён |

**Prod:** без `SKIP_HEAVY_WEB` — замерять `profile-limits-composer.sh` и debugbar SQL.

**Уже снято глобально:** `User::$with` для pay/roles — при новых запросах к `User` явно `select()` / `with()`.

---

## 6. Скрипты профилирования (cabinet.datagon.ru)

```bash
cd /Users/stanislav/Documents/projects/cabinet.datagon.ru
export PATH="/opt/homebrew/opt/php@7.4/bin:$PATH"

./scripts/profile-page.sh /news 4              # одна страница → URI|HTTP|ms|SQL|bytes
./scripts/profile-full-audit.sh 4               # ~5–8 мин, лог в /tmp/
./scripts/profile-menu-pages.sh 4               # группа A
./scripts/profile-audit-extended.sh 4           # группы B, C
./scripts/profile-public-pages.sh                 # /login, /register
./scripts/profile-limits-composer.sh 4          # как LimitsComposer на проде
```

Тестовый пользователь по умолчанию: **id=4** (sv6@list.ru). БД remote → высокий ms нормален; смотреть **SQL** (пороги в performance-audit §методология).

---

## 7. Куда писать документацию после правок

**В той же задаче**, что и код ([redbox-docs-sync](../.cursor/rules/redbox-docs-sync.mdc)).

| Что изменили | Обновить |
|--------------|----------|
| Роут, контроллер, middleware, composer | [cabinet-reference.md](./cabinet-reference.md) §5–8; при новом модуле — §6.2/6.3 |
| Оптимизация страницы, SQL, скрипт profile | [cabinet-performance-audit.md](./cabinet-performance-audit.md) — строка чек-листа ☑ + §G (ms/SQL) |
| `scripts/dev-*.sh`, nginx, `.env` local | [cabinet-reference.md](./cabinet-reference.md) §2, §4; [redbox-cabinet-dev.mdc](../.cursor/rules/redbox-cabinet-dev.mdc) |
| Деплой, VPS, БД | [cabinet-deploy.md](./cabinet-deploy.md), [cabinet-servers.md](./cabinet-servers.md) |
| Демо / прокси Next → lk | [api-lk.md](./api-lk.md), `docs/examples/demo-widget.md` |
| Лендинг модуля Next | `docs/examples/`, [pages.md](./pages.md) |
| **PDF-отчёт кабинета** (новый модуль / правки layout) | [cabinet-pdf-report-template.md](./cabinet-pdf-report-template.md); changelog модуля |
| Новый эталон UI маркетинга | `docs/examples/README.md` + файл эталона |
| Архитектура / домены | [architecture.md](./architecture.md) |
| **Новый паттерн для агентов** (где что лежит) | **этот файл** §4–7 |

Формат правки: **что / зачем / как проверить** (URL или команда).

---

## 8. datagon.ru — где что (маркетинг)

| Область | Путь |
|---------|------|
| Страницы | `app/**/page.tsx` |
| API BFF | `app/api/lk/[...path]/route.ts`, `app/api/demo/**` |
| Клиент lk | `lib/lk-api.ts` |
| Лендинги модулей | `components/module-landings/` |
| Демо | `components/demo/`, `lib/demo/` |
| Эталоны UI | `docs/examples/` |
| Правила Cursor | `.cursor/rules/*.mdc`, `AGENTS.md` |

---

## 9. Локальный .env кабинета (напоминание)

```
APP_URL=http://127.0.0.1:3002
DB_HOST=178.250.157.140
SKIP_HEAVY_WEB_MIDDLEWARE=true
HTTP_HEADERS_CLEANUP_ON_REQUEST=false
SESSION_DRIVER=file
```

Полный список: [cabinet-reference.md](./cabinet-reference.md) §4.

---

## 10. Очередь performance-audit (май 2026)

Почти все URI в [cabinet-performance-audit.md](./cabinet-performance-audit.md) §A–C — ☑. Полный прогон: `./scripts/profile-full-audit.sh 4` (~5 мин).

**После деплоя на prod:** `SKIP_HEAVY_WEB_MIDDLEWARE=false`, замер layout (LimitsComposer ~16 SQL). **Опционально:** migrate `2026_05_22_120000_add_created_at_index_to_monitoring_stats_table.php` (общая БД — по согласованию). Vue: [cabinet-deploy.md](./cabinet-deploy.md) — `npm run production` или `public/js/app.js` из git.

---

## 11. Чеклист агента перед сдачей задачи

**Новая или переделка страницы модуля:** [cabinet-module-page-checklist.md](./cabinet-module-page-checklist.md) (~1.5 ч, без jQCloud/DataTables ping-pong).

1. Код в **правильном репо** (кабинет vs datagon.ru).
2. После правок кабинета — **перезапуск** `dev-local.sh detach` (см. redbox-cabinet-dev).
3. Если меняли Vue — `npm run production` с `NODE_OPTIONS=--openssl-legacy-provider`.
4. Обновлены строки из §7.
5. Для perf — прогон `profile-page.sh` / `profile-full-audit.sh` или отметка в §G performance-audit.

---

*Создано для агентов (май 2026). При изменении структуры репо или ключевых путей — обновлять этот файл в той же задаче.*
