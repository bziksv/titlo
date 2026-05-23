# Кабинет — аудит загрузки страниц (чек-лист)

Репозиторий: `cabinet.datagon.ru`, local: http://localhost:3002. БД: удалённая `178.250.157.140` (~300 ms на round-trip).

Связано: [cabinet-agent-map.md](./cabinet-agent-map.md) (где код, куда писать docs), [cabinet-reference.md](./cabinet-reference.md) (роуты, composers), [cabinet-servers.md](./cabinet-servers.md).

---

## Как устроены «страницы»

1. **Маршрут** — `routes/web.php` (группа `auth` + `verified`).
2. **Пункт меню** — не все страницы в меню. Сайдбар строится из таблицы **`main_projects`** (`show=1` для пользователей, все записи для админов) + фильтр ролей в `MenuComposer`.
3. **Вне `main_projects`** — отдельные ссылки: шапка (`news`, `balance`, `tariff`), сайдбар (`partners`), подстраницы модулей (`/history`, `/monitoring/{id}`, AI, админка).
4. **На каждую HTML-страницу** (layout `layouts.app`) вешаются view composers — см. § «Общая нагрузка».

Локально при `SKIP_HEAVY_WEB_MIDDLEWARE=true` отключены: `LimitsComposer`, `CountUnreadNewsComposer`, тяжёлые части `UserPanelComposer`; меню кэшируется в сессии (`cabinet_menu_modules_v4`).

---

## Методология проверки (для каждой строки чек-листа)

| Шаг | Действие |
|-----|----------|
| 1 | Войти под тестовым пользователем с нужной ролью/permission |
| 2 | DevTools → Network: **document** (TTFB + total), Disable cache |
| 3 | Laravel: `DB::enableQueryLog()` в контроллере или одноразовый скрипт через `Kernel::handle(Request::create(...))` |
| 4 | Записать: **время (ms)**, **число SQL**, **топ-3 повторяющихся запроса** |
| 5 | Отметить риск: `User::$with`, `::all()`, N+1, DataTables AJAX при первом GET |

**Пороги (ориентир, remote DB):**

| SQL | Оценка |
|-----|--------|
| ≤15 | нормально |
| 16–40 | стоит оптимизировать |
| 40+ | критично (как `/news` до фикса: ~167) |

**Скрипты** (репозиторий `cabinet.datagon.ru`, user id по умолчанию **4** = sv6@list.ru):

```bash
cd /Users/stanislav/Documents/projects/cabinet.datagon.ru
./scripts/profile-page.sh /news 4          # URI|HTTP|ms|SQL|bytes
./scripts/profile-full-audit.sh 4          # всё ниже (~5–8 мин), лог в /tmp/
./scripts/profile-limits-composer.sh 4     # limits|ms|SQL|keys (getUsedLimit, как на проде)
./scripts/profile-menu-pages.sh 4          # группа A + ключевые C
./scripts/profile-audit-extended.sh 4    # группы B, C (админка, подстраницы)
./scripts/profile-public-pages.sh        # /login, /register (без auth)
```

Ручной вариант — тот же `Kernel::handle` + `ob_start()` (см. `scripts/profile-page.sh`).

---

## Общая нагрузка (все страницы с layout)

| Источник | Что делает | Риск SQL | Local (`SKIP_HEAVY…`) |
|----------|------------|----------|------------------------|
| `MenuComposer` | `main_projects` + `menu_items_position` + `hasRole` по каждому пункту | средний | кэш сессии после 1-го захода |
| `UserPanelComposer` | user + тариф | низкий | тариф облегчён |
| `LimitsComposer` | лимиты по модулям | **высокий** | **выключен** |
| `CountUnreadNewsComposer` | `News::all()->count()` если нет notification | **высокий** | **выключен** |
| `DescriptionComposer` | `descriptions` по коду страницы | 1 запрос | 1 запрос |
| `StatisticsComposer` | только имя action | нет | нет |
| **`User::$with = ['pay','roles']`** | на **каждый** `User::find` / relation без `without()` | **высокий** | везде, где тянутся пользователи |

**Уже исправлено:** `/news` — eager load, `without(['pay','roles'])`, limit 15/5 local (~167 → ~12 SQL).

---

## A. В меню (`main_projects.show = 1`)

Путь local: `http://localhost:3002{path}` (ссылки в БД могут быть `lk.redbox.su` — `localize_cabinet_url` на local).

| ☐ | Путь | Permission / роль | Контроллер | Типичные SQL-риски | Аудит |
|---|------|-------------------|------------|-------------------|-------|
| ☑ | `/` | все | `HomeController@index` | кэш local | 5 SQL §G |
| ☑ | `/analyze-relevance` | релевантность | `RelevanceController@index` | тяжесть в POST | 8 SQL §G |
| ☑ | `/competitor-analysis` | Competitor | `SearchCompetitorsController@index` | | 9 SQL §G |
| ☑ | `/text-analyzer` | Text analyzer | `TextAnalyzerController@index` | | 8 SQL §G |
| ☑ | `/cluster` | Cluster | `ClusterController@index` | | 9 SQL §G |
| ☑ | `/behavior` | BF | `BehaviorController@index` | **fixed** N+1 | 7 SQL §G |
| ☑ | `/duplicates` | Duplicates | `PagesController@duplicates` | | 8 SQL §G |
| ☑ | `/list-comparison` | — | `ListComparisonController@index` | | 8 SQL §G |
| ☑ | `/unique` | — | `UniqueWordsController@index` | | 4 SQL §G |
| ☑ | `/counting-text-length` | Counting text length | `TextLengthController@index` | | 8 SQL §G |
| ☑ | `/html-editor` | HTML editor | `TextEditorController@index` | **fixed** eager | 10 SQL §G |
| ☑ | `/monitoring` | Monitoring | `MonitoringController@index` | таблица — AJAX | 9 SQL §G |
| ☑ | `/site-monitoring` | — | `MonitoringDomainController@index` | `orderByDesc('id')` | 8 SQL §G |
| ☑ | `/domain-information` | — | `DomainInformationController@index` | | 9 SQL §G |
| ☑ | `/meta-tags` | Meta tags | `MetaTagsController@index` | **fixed** список — `GET /meta-tags/projects` | 7 SQL §G |
| ☑ | `/backlink` | — | `BacklinkController@index` | | 9 SQL §G |
| ☑ | `/http-headers` | Http headers | `PagesController@httpHeaders` | | 8 SQL §G |
| ☑ | `/utm-marks` | Utm marks | `PagesController@utmMarks` | | 8 SQL §G |
| ☑ | `/password-generator` | — | `PasswordGeneratorController@index` | | 9 SQL §G |
| ☑ | `/keyword-generator` | Keyword generator | `PagesController@keywordGenerator` | | 8 SQL §G |
| ☑ | `/roi-calculator` | Roi calculator | `PagesController@roiCalculator` | short tags `<?` → 500 | **fixed** Blade + данные в контроллере |
| ☑ | `/configuration-menu` | — | `PositionMenuItemsController@index` | `MenuProjectRegistry` + sortMenu request-cache | |

---

## B. В `main_projects`, но скрыто из меню (`show = 0`)

Доступны по прямой ссылке (админы видят записи в `sortMenu` даже при `show=0`).

| ☐ | Путь | Назначение | SQL-риски |
|---|------|------------|-----------|
| ☑ | `/users` | CRUD пользователей | GET **fixed**; select2 AJAX `search-emails` | 5 SQL §G; AJAX 5 SQL |
| ☑ | `/main-projects` | Управление плитками меню | `Role::all()` только create/edit | 6 SQL §G |
| ☑ | `/manage-access` | Spatie permissions | **fixed** eager | 7 SQL §G |
| ☑ | `/tariff-settings` | Тарифы | **fixed** `with('fields')` | 6 SQL §G |
| ☑ | `/edit-policy-files` | Политики | | 4 SQL §G |
| ⏭ | Google Docs (id 17) | документация | внешняя ссылка — вне аудита |
| ⏭ | `/html/` (id 27) | шаблон LTE | статика AdminLTE, без layout auth |

---

## C. Не в `main_projects` — «неопубликованные в меню»

Обязательно включить в аудит: пользователь их не видит в сайдбаре, но роуты живые.

### C.1 Шапка / фиксированные ссылки

| ☐ | Путь | Где ссылка | Контроллер | SQL-риски | Статус |
|---|------|------------|------------|-----------|--------|
| ☑ | `/news` | `navigation/menu.blade.php` | `NewsController@index` | было N+1 + `User::$with` | **fixed** ~167→9 SQL |
| ☑ | `/balance` | `menu-right` | `BalanceController@index` | `balances()->get()` | ☑ 8 SQL / ~2.2s (user 4) |
| ☑ | `/tariff` | `menu-right` | `TariffPayController` | resource | ☑ 15 SQL / ~3.6s |
| ☑ | `/profile` | user panel | `ProfilesController@index` | user + pay/roles | **fixed** ~85→6 SQL |
| ☑ | `/partners` | **sidebar** (hardcode) | `PartnersController@partners` | | 6 SQL §G |

### C.2 Подстраницы релевантности

| ☐ | Путь | Назначение | SQL-риски |
|---|------|------------|-----------|
| ☑ | `/history` | История анализов | AJAX `/get-relevance-projects/` — **fixed** OOM (без `though.result`) |
| ☑ | `/create-queue` | Очередь | | 5 SQL §G |
| ☑ | `/show-history/{id}` | Детали | eager `projectRelevanceHistory` |
| ☑ | `/relevance-config` | Конфиг (admin) | | 5 SQL §G |
| ☑ | `/all-projects` | Все проекты (admin) | AJAX таблица | 15 SQL §G |
| ☑ | `/share-my-projects` | Шаринг | **fixed** eager | 8 SQL §G |
| ☑ | `/access-projects` | Гостевой доступ | eager item+owner | 10 SQL §G |

### C.3 Мониторинг (кроме `/monitoring`)

| ☐ | Путь | Назначение | SQL-риски |
|---|------|------------|-----------|
| ☑ | `/monitoring/{id}` | Проект show | 19 SQL ~6s; eager backlinks, `withCount` competitors, settings batch |
| ☑ | `/monitoring/{id}/table` | DataTable | **fixed** 137→14 SQL (project 41, 25 rows) |
| ☑ | `/monitoring/statistics` | Статистика | **fixed** 966→11 SQL |
| ☑ | `/monitoring/admin` | Админ | 5 SQL |
| ☑ | `/monitoring/stat` | Стат | **fixed** кэш виджетов 5 мин; user — select2 AJAX; cold ~23s → warm ~2.6s |
| ☑ | `/monitoring/permissions` | 11 SQL | ☑ |
| ☑ | `/monitoring/set-positions` | 5 SQL | ☑ |
| ☑ | `/monitoring/offset-positions` | 5 SQL | ☑ |
| ☑ | `/monitoring/top-100/{project}` | 12 SQL | ☑ |
| ☑ | `/monitoring/{id}/competitors` | 13 SQL | `keywords()->count()` вместо load all |
| ☑ | `/monitoring/{id}/prices` | 10 SQL | убран `$with` на Searchengine |

### C.4 Meta-tags, cluster, competitor (внутренние)

| ☐ | Путь | Назначение |
|---|------|------------|
| ☑ | `/meta-tags/settings` | admin settings | 6 SQL §G |
| ☑ | `/meta-tags/statistic` | admin statistic | 8 SQL §G |
| ☑ | `/meta-tags/history/{id}` | история | HTML без `data`; JSON — `GET …/history/{id}/data` |
| ☑ | `/meta-tags/history/{id}/compare/{id2}` | сравнение | 1 SQL владелец; ~15s / 9 SQL при 2× BLOB (user 4) |
| ☑ | `/competitors-config` | 7 SQL | ☑ |
| ☑ | `/cluster-projects` | 6 SQL | ☑ (ранее) |
| ☑ | `/cluster-configuration` | 6 SQL | ☑ |
| ☑ | `/meta-tags/settings` | 6 SQL | ☑ |
| ☑ | `/show-cluster-result/{id}` | 5 SQL ~1.2s; &gt; 40 MB → too-large + download (не OOM) |

### C.5 Чеклисты

| ☐ | Путь | SQL-риски |
|---|------|-----------|
| ☑ | `/checklist` | index | **fixed** batch stats | 5 SQL §G |
| ☑ | `/checklist-tasks/{checklist}` | tasks, kanban | | 8 SQL §G |
| ☑ | `/get-checklist-archive` | archive | | 2 SQL §G |

### C.6 AI-генерация

| ☐ | Путь |
|---|------|
| ☑ | `/ai-generation/story` | 4 SQL | ☑ |
| ☑ | `/ai-generation/all-history` | 5 SQL | ☑ |
| ☑ | `/ai-generation/prompt` | 5 SQL | ☑ |
| ☑ | `/ai-generation/stopwords` | 6 SQL | index без load words; AJAX datatable |
| ☑ | `/ai-macros` | 4 SQL | ☑ |
| ☑ | `/ai-stopwords/datatable` | 2 SQL | select + category |

### C.7 HTML-редактор (вне index)

| ☐ | Путь |
|---|------|
| ☑ | `/create-project` | | 7 SQL §G |
| ☑ | `/edit-project/{id}` | scope `user_id` | 7 SQL §G |
| ☑ | `/create-description`, `/edit-description/{id}` | scope join `projects` | 9 / 7 SQL §G |

### C.8 Новости (вне index)

| ☐ | Путь |
|---|------|
| ☑ | `/create-news` | | 4 SQL §G |
| ☑ | `/edit-news/{id}` | admin + `findOrFail` | 6 SQL §G |
| ☑ | POST `/get-count-new-news` | **`News::all()->count()`** | **fixed** `News::count()` |

### C.9 Прочая админка и статистика

| ☐ | Путь |
|---|------|
| ☑ | `/visits-statistics/` | **fixed** SUM + топ-500 | 8 SQL §G |
| ☑ | `/modules-statistics/` | **fixed** GROUP BY вместо `with(statistics)` | 7 SQL §G (было ~10s) |
| ☑ | `/visit-statistics/{user}` | | 9 SQL §G (user 4) |
| ☑ | `/main-projects/statistics/{project}` | default 30 дней; `user` select | 10 SQL §G |
| ☑ | `/get-user-jobs`, `/get-queue-count` | AJAX | 3 / 2 SQL §G |
| ☑ | `/remove-user-jobs` | truncate | admin only, редкий POST |
| ☑ | `/http-headers/settings` | | 5 SQL §G |
| ⏭ | `/test` | | dev-only (`local`); внешние XML API, не для прода |

### C.10 Публичные (без auth) — мини-аудит

`./scripts/profile-public-pages.sh` (2026-05-22):

| URI | HTTP | ms | SQL |
|-----|------|-----|-----|
| `/login` | 200 | 38 | 0 |
| `/register` | 200 | 18 | 0 |

`/personal-data/*`, `/privacy-policy/*`, `public/*` — по необходимости.

---

## D. Повторяющиеся анти-паттерны (что править системно)

| Паттерн | Где встречается | Как ускорить |
|---------|-----------------|--------------|
| ~~`User::$with = ['pay','roles']`~~ | было на каждом `User` | **снято**; `without()` в news/users; roles — middleware |
| `News::all()` / `->get()->count()` | `NewsController`, `CountUnreadNewsComposer` | **fixed** — `News::count()` / `where()->count()` |
| `MainProject::all()` | Home, Menu, configuration-menu | кэш; на local уже частично |
| `Role::all()` / `Permission::all()` | users, manage-access, main-projects | кэш config или один запрос на deploy |
| N+1 в циклах Blade | news (fixed), comments, monitoring table | `with()`, limit, lazy UI |
| DataTables «всё сразу» | monitoring, users, checklist | server-side paging только |
| Composers на каждую страницу | Limits, CountUnreadNews | local skip; prod **LimitsComposer**: MetaTagsPages/BacklinkLinks — 1 SQL каждый (было N+1) |
| `MenuItemsPosition::sortMenu()` ×2 | configuration-menu + layout | **fixed** request-cache + `select` колонок меню |

---

## E. Приоритет очереди оптимизации

1. **P0 — глобально:** `User::$with`; счётчик новостей — **fixed** в composer + AJAX.
2. **P1 — частые модули:** `/history`, `/meta-tags`, `/checklist`, `/monitoring/{id}/table`, `/users` (админ).
3. **P2 — лёгкие утилиты:** generators, utm, roi, duplicates — обычно &lt;15 SQL.
4. **P3 — редкие админ-страницы:** monitoring/admin, tariff-settings, policy files.

---

## F. Сводка: откуда берётся меню (для агента)

```
main_projects (БД)
    → MenuItemsPosition::sortMenu()  // show=1 или все для админа + user positions
    → MenuComposer::compose()        // filter hasRole(access)
    → navigation/sidebar.blade.php

НЕ из main_projects:
    → menu.blade.php: news
    → menu-right: balance, tariff (+ limits prod)
    → sidebar: partners (route partners)
```

Актуальный список записей `main_projects`: запрос к БД или `php` bootstrap + `MainProject::orderBy('position')->get(['link','show','title'])`.

---

## G. Результаты аудита (заполнять по мере проверки)

Тест: **user_id=4** (sv6@list.ru), local `SKIP_HEAVY_WEB_MIDDLEWARE=true`, БД remote.

**Полный прогон:** `./scripts/profile-full-audit.sh 4` — **2026-05-22 19:47**, ~5 мин, лог `/tmp/cabinet-full-audit-20260522-1947.log`.

**Outliers в пакете:** `/site-monitoring` ~35s (сетевой всплеск / remote DB); `/monitoring/stat` ~21s (**cold** кэш виджетов, повтор ~2.6s).

### Группа A + ключевые C (`profile-menu-pages.sh`, 2026-05-22 19:47)

| URI | HTTP | ms | SQL | Статус |
|-----|------|-----|-----|--------|
| `/` | 200 | 1501 | 6 | ☑ |
| `/analyze-relevance` | 200 | 2426 | 7 | ☑ |
| `/competitor-analysis` | 200 | 2726 | 8 | ☑ |
| `/text-analyzer` | 200 | 1821 | 7 | ☑ |
| `/cluster` | 200 | 2348 | 8 | ☑ |
| `/behavior` | 200 | 2507 | 8 | ☑ |
| `/duplicates` | 200 | 1615 | 7 | ☑ |
| `/list-comparison` | 200 | 1949 | 7 | ☑ |
| `/unique` | 200 | 1754 | 5 | ☑ |
| `/counting-text-length` | 200 | 1807 | 7 | ☑ |
| `/html-editor` | 200 | 2663 | 9 | ☑ |
| `/monitoring` | 200 | 2825 | 8 | ☑ |
| `/site-monitoring` | 200 | 34613 | 8 | ☑ outlier; единично ~2.8s |
| `/domain-information` | 200 | 2741 | 8 | ☑ |
| `/meta-tags` | 200 | 1811 | 7 | ☑ AJAX `/meta-tags/projects` |
| `/backlink` | 200 | 2077 | 8 | ☑ |
| `/http-headers` | 200 | 2012 | 7 | ☑ |
| `/utm-marks` | 200 | 2496 | 7 | ☑ |
| `/password-generator` | 200 | 1717 | 8 | ☑ |
| `/keyword-generator` | 200 | 2078 | 7 | ☑ |
| `/roi-calculator` | 200 | 2106 | 7 | ☑ |
| `/configuration-menu` | 200 | 1448 | 6 | ☑ |
| `/news` | 200 | 2254 | 10 | ☑ |
| `/profile/` | 200 | 2157 | 7 | ☑ |
| `/balance` | 200 | 1813 | 7 | ☑ |
| `/tariff` | 200 | 4872 | 16 | ☑ |
| `/partners` | 200 | 1913 | 7 | ☑ |
| `/history` | 200 | 2999 | 9 | ☑ |
| `/checklist` | 200 | 1874 | 6 | ☑ |
| `/checklist-tasks/23` | 200 | 1857 | 8 | ☑ fixed eager в `tasks()` |
| GET `/get-checklist-archive` | 200 | 511 | 2 | ☑ |
| `/show-history/86521` | 200 | 2780 | 7 | ☑ eager `projectRelevanceHistory` |
| `/ai-generation/all-history` | 200 | 6178 | 5 | ☑ `user:id,name,email` |
| POST `/get-checklist-kanban` | 200 | 764 | 3 | ☑ было ~11+ запросов; 1 SELECT задач + partition PHP |
| POST `checklist-tasks` (`getTasks`) | 200 | 1273 | 5 | ☑ пагинация корней + stats через GROUP BY |
| `/monitoring/statistics` | 200 | 28583 | 11 | ☑ было 500 + **966 SQL / ~286s**; виджеты: 1× settings, eager users |
| `/all-projects` | 200 | 3579 | 15 | ☑ убран `ProjectRelevanceHistory::get()` на GET (таблица — AJAX) |

### Группа B + C (`profile-audit-extended.sh`, 2026-05-22 19:47)

| URI | HTTP | ms | SQL | Заметки |
|-----|------|-----|-----|---------|
| `/create-queue` | 200 | 1793 | 6 | ☑ |
| `/relevance-config` | 200 | 2247 | 6 | ☑ |
| `/access-projects` | 200 | 2843 | 11 | ☑ |
| `/share-my-projects` | 200 | 2191 | 9 | ☑ |
| `/all-projects` | 200 | 4904 | 16 | ☑ |
| `/main-projects` | 200 | 1786 | 7 | ☑ |
| `/users` | 200 | 1588 | 5 | ☑ select2 AJAX |
| `/visits-statistics/` | 200 | 3570 | 9 | ☑ |
| `/modules-statistics/` | 200 | 2449 | 8 | ☑ |
| `/meta-tags/settings` | 200 | 1904 | 7 | ☑ |
| `/meta-tags/statistic` | 200 | 2391 | 9 | ☑ |
| `/create-project` | 200 | 2153 | 8 | ☑ |
| `/create-news` | 200 | 1456 | 5 | ☑ |
| `/edit-news/45` | 200 | 2403 | 6 | ☑ |
| `/edit-project/3` | 200 | 1745 | 7 | ☑ |
| `/meta-tags/history/7317` | 200 | 2290 | 8 | ☑ HTML без `data` |
| `/main-projects/statistics/37` | 200 | 4901 | 10 | ☑ 30 дней |
| `/http-headers/settings` | 200 | 1814 | 6 | ☑ |
| `/cluster-projects` | 200 | 2607 | 7 | ☑ |
| `/get-checklist-archive` | 200 | 937 | 2 | ☑ |
| `/checklist-tasks/23` | 200 | 3021 | 9 | ☑ |
| `/visit-statistics/4` | 200 | 2933 | 10 | ☑ |
| `/create-description` | 200 | 4322 | 9 | ☑ |
| `/edit-description/4` | 200 | 2376 | 7 | ☑ |
| `/get-user-jobs` | 200 | 1140 | 3 | ☑ |
| `/get-queue-count` | 200 | 536 | 2 | ☑ |
| `/competitors-config` | 200 | 2698 | 8 | ☑ |
| `/monitoring/admin` | 200 | 1266 | 6 | ☑ |
| `/monitoring/stat` | 200 | 21395 | 9 | ☑ cold cache; warm ~2.6s |
| `/cluster-configuration` | 200 | 2364 | 7 | ☑ |
| `/ai-generation/story` | 200 | 1511 | 5 | ☑ |

### C.10 + LimitsComposer (тот же прогон)

| URI / скрипт | HTTP | ms | SQL | Заметки |
|--------------|------|-----|-----|---------|
| `/login` | 200 | 15 | 0 | ☑ |
| `/register` | 200 | 14 | 0 | ☑ |
| `profile-limits-composer.sh` | — | 4435 | 16 | 22 ключа тарифа (как на проде) |

### Группа B (скрытое меню)

| URI | HTTP | ms | SQL | Заметки |
|-----|------|-----|-----|---------|
| `/users` GET | 200 | 2768 | 5 | **fixed** OOM; AJAX page (50) **5 SQL** |
| `/main-projects` | 200 | 2195 | 7 | ☑ |
| `/manage-access` | 200 | 3121 | 7 | **fixed** eager roles + не дергать `permissions` у Permission |
| `/tariff-settings` | 200 | 1327 | 6 | **fixed** `with('fields')` |
| `/edit-policy-files` | 200 | 1560 | 4 | ☑ |

### Исправления (детально)

| Дата | Страница | ms | SQL | Заметки |
|------|----------|-----|-----|---------|
| 2026-05-22 | `/news` | ~2200 | 9 | было ~45s / 167 SQL | NewsController eager load |
| 2026-05-22 | `/profile/` | ~1570 | 6 | было ~30s / 85 SQL | ProfilesController + тарифы |
| 2026-05-22 | `/behavior` | ~2158 | 7 | было ~7.6s / 26 SQL | withCount + DISTINCT |
| 2026-05-22 | `/html-editor` | ~2773 | 10 | было ~5.4s / 19 SQL | `with('descriptions')` |
| 2026-05-22 | `/roi-calculator` | ~1931 | 8 | было HTTP 500 | short tags → Blade |
| 2026-05-22 | `/users` GET | ~2–3s | 5 | select2 AJAX `users/search-emails` (email не в HTML) |
| 2026-05-22 | `User::$with` | — | — | удалён глобальный eager pay/roles |
| 2026-05-22 | `/manage-access` | 1903 | 7 | (повтор после $with) |
| 2026-05-22 | POST `/monitoring/41/table` | 3218 | 14 | было 35143 / 137 SQL |
| 2026-05-22 | `/history` AJAX | 2428 | 7 | было OOM; `historyListRelations()` без `though.result` |

### Следующий шаг (очередь)

1. **P0:** ~~`User::$with`~~ **снят** с `User.php`.
2. **P1:** `/share-my-projects` — **fixed** 130→8 SQL, ~39s→~2.4s.
3. **P2:** meta-tags при тысячах проектов; `get-all-relevance-projects` AJAX — fixed search `orWhere`.
4. **P1:** prod без `SKIP_HEAVY_WEB` — **LimitsComposer** MetaTagsPages + BacklinkLinks + `PositionLimit($user)` (**fixed**); на проде замерить любую страницу с layout (debugbar SQL).
5. **P2:** `/show-cluster-result/{id}` — guard 40 MB compressed → HTTP 413; полный streaming/API — позже.
6. ~~**P3:** `configuration-menu` — `MenuProjectRegistry`~~ **fixed**: один `main_projects` на страницу.
7. **P1:** после деплоя — замер layout на проде с `SKIP_HEAVY_WEB=false`.
8. **P2:** cluster result &gt; 40 MB — страница с ссылками XLS/CSV (**fixed**).
9. ~~**P2:** `/users` GET — select2 AJAX~~ **fixed** (`users/search-emails`, min 2 символа).
10. ~~**P3:** `/edit-project`, `/edit-news`, `/meta-tags/history/{id}`, `/main-projects/statistics/{project}`~~ **fixed** (eager/scope/select; см. §G).
11. ~~**P2:** `/meta-tags/history/{id}`~~ **fixed**: HTML без колонки `data`; Vue → `GET …/data` (npm production).
12. ~~**P2:** `/main-projects/statistics`~~ default **30** дней (было 90); полный диапазон — фильтр `from`/`to`.
13. ~~**C.7:** `/create-description`, `/edit-description`~~ scope + select проектов.
14. ~~**C.9:** `/get-user-jobs`, `/get-queue-count`~~ профиль ☑.
15. **P1:** prod layout с `SKIP_HEAVY_WEB=false` — после деплоя.
16. ~~**P2:** `/monitoring/stat`~~ **fixed**: `StatisticsAdmin::getDashboardStatistics()` (кэш 300s, 1× SUM); user select2; HTML ~62 KB.
17. ~~**P2:** `/meta-tags/history/…/data`~~ chunk `offset`/`limit` (Vue «Показать ещё»); узкое место — чтение BLOB из БД.
18. **P3:** миграция `2026_05_22_120000_add_created_at_index_to_monitoring_stats_table` — на проде `php artisan migrate --path=…` **по согласованию** (общая БД); ускорит cold `/monitoring/stat`.
19. ~~**P2:** `/meta-tags` index~~ **fixed**: проекты через AJAX, HTML без списка в Blade.
20. ~~**Прочее:** `showHistoryCompare`, `site-monitoring`~~ **fixed** (см. таблицу ниже).

### Прочее (2026-05-22)

| Что | Изменение |
|-----|-----------|
| `MetaTagsController@showHistoryCompare` | Проверка владельца одним запросом к `meta_tags` (без `with('project')`); уникальные `meta_tag_id` — сравнение двух снимков одного проекта |
| `MonitoringDomainController@index` | `orderByDesc('id')` |
| Деплой Vue | `npm ci && NODE_OPTIONS=--openssl-legacy-provider npm run production` или `public/js/app.js` из git — [cabinet-deploy.md](./cabinet-deploy.md) § FastPanel |

**Очередь после выкладки:** P1 prod layout (`SKIP_HEAVY_WEB_MIDDLEWARE=false`, замер SQL в шапке); опционально migrate индекса `monitoring_stats.created_at` и отдельный API для BLOB history (chunk уже есть).

### Исправления (дополнение 2026-05-22)

| Страница | ms | SQL | Заметки |
|----------|-----|-----|---------|
| `/manage-access` | 3121 | 7 | было 15913 / 58; `Role::with('permissions')`, Blade только для role |
| `/tariff-settings` | 1327 | 6 | было 6858 / 28; `with('fields')` |
| `/users` AJAX | 1321 | 5 | `without` + `with(pay active)` |
| `CountUnreadNewsComposer` + `calculateCountNewNews` | — | — | `News::count()` вместо `all()->get()->count()` |
| `/monitoring/41` | 5060 | 20 | index show (user 4) |
| CheckList `getChecklists` POST | — | 7 | batch monitoring stats вместо N+1 |
| CheckList `getChecklistsKanban` POST | 764 | 3 | 1 query задач + in-memory buckets |
| `/visits-statistics/` | 4098 | 8 | OOM (12k users) → SUM + топ-500 по `seconds` |
| `HistoryRelevanceController@show` | 2780 | 7 | eager project, 404 если нет записи |
| `/monitoring/statistics` | 28583 | 11 | widgets: `resolveByCode`, `monitoringWidgets` 1 query |
| `getAllProjects` AJAX | — | — | search в `where()`, `user:id,email,name` |
| POST `getTasks` | 1273 | 5 | пагинация корней + `GROUP BY status` |
| `/create-queue` | 1512 | 5 | ☑ |
| `/monitoring/top-100/41` | 4966 | 12 | ☑ |
| `/monitoring/permissions` | 3574 | 11 | ☑ |
| `/relevance-config` | 2199 | 5 | ☑ |
| `/share-my-projects` | 2350 | 8 | было 38705 / 130 SQL; eager tags+sharing.user |
| `/access-projects` | 4175 | 12 | eager item+owner |
| `/monitoring/admin` | 1278 | 5 | ☑ |
| `/monitoring/stat` | — | — | `User::all`/`Project::all` → select/distinct |
| `/ai-macros` | 1083 | 4 | ☑ |
| Сайдбар | — | — | `--cabinet-sidebar-inset`: лого и аватар 33px, один отступ |
| `/monitoring/41/competitors` | ~4s | 13 | `keywords()->count()` |
| `/monitoring/41/prices` | ~3s | 10 | `MonitoringSearchengine` без global `$with` |
| `/ai-generation/stopwords` | ~1.8s | 6 | index только categories |
| `MonitoringSearchengine` | — | — | удалён `$with=['location']`, eager явно |
| `/monitoring/41` show | 5944 | 19 | panel: `withCount` competitors, eager backlinks, settings 1 query |
| `/show-cluster-result/911` | 1250 | 5 | ☑ |
| `/checklist` | 1582 | 5 | ☑ index |
| `/edit-policy-files` | 1235 | 4 | ☑ |
| `LimitsComposer` (prod) | 5690 | 16 | 22 ключа тарифа; MetaTagsPages/BacklinkLinks — 1 SQL; `profile-limits-composer.sh` |
| `MenuItemsPosition::sortMenu` | — | — | request-cache; select id,title,link,icon,access,… |
| `PositionMenuItemsController` | — | — | синтаксис `edit`/`remove`; cache clear |
| `MenuProjectRegistry` | — | — | configuration-menu: 1 запрос вместо 3–4× `main_projects` |
| `/show-cluster-result` | — | — | &gt; 40 MB compressed → `cluster/too-large` + download XLS/CSV |
| `/modules-statistics/` | 2225 | 7 | было ~10.4s; `VisitStatistic` SUM GROUP BY `project_id` |
| `/main-projects` index | 1452 | 6 | `Role::all()` только create/edit |
| `/users` GET | 1171 | 4 | HTML ~43 KB (было ~700 KB); AJAX `search-emails` |
| `/edit-project/3` | 2470 | 6 | `where user_id` + `findOrFail` |
| `/edit-news/45` | 1198 | 5 | admin + `findOrFail` |
| `/meta-tags/history/7317` GET | 2276 | 8 | HTML без `data`; JSON `/data` ~11s / 2.3 MB отдельно |
| `/main-projects/statistics/37` | 8315 | 10 | default 30 дней (было 90 / ~20s); `user` select |
| `/create-description` | 5612 | 9 | `projects` только id+name |
| `/edit-description/4` | 3582 | 7 | join `projects.user_id` |
| `/get-user-jobs` | 982 | 3 | `user:id,name,last_name,email` |
| `/get-queue-count` | 792 | 2 | ☑ |
| `/meta-tags` GET | 1811 | 7 | HTML ~33 KB; AJAX `/meta-tags/projects` 3 SQL ~1s |
| `/meta-tags/projects` | 1041 | 3 | JSON списка проектов |
| `/monitoring/stat` cold | 23009 | 9 | кэш виджетов; HTML ~62 KB (было ~747 KB) |
| `/monitoring/stat` warm | 2618 | 6 | Cache::remember 300s |
| `/cluster-configuration` | — | 7 | ☑ extended |
| `/ai-generation/story` | — | 5 | ☑ extended |
| `/login` (public) | 38 | 0 | `profile-public-pages.sh` |
| `/register` (public) | 18 | 0 | ☑ |
| `/meta-tags/history/9451/compare/9448` | 200 | 15203 | 9 | ~3.3 MB HTML; 2× BLOB; владелец 1 SQL `meta_tags` |
| `/site-monitoring` (повтор) | 200 | 2536 | 8 | `orderByDesc('id')`; outlier ~35s — сеть/remote DB |
