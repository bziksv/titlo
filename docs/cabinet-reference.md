# cabinet.datagon.ru — справочник и troubleshooting

Локальная папка: `/Users/stanislav/Documents/projects/cabinet.datagon.ru`.  
Прод (пользователи): **https://lk.redbox.su**. Переходный хост: **cabinet.datagon.ru** (:3002) — [cabinet-servers.md](./cabinet-servers.md).

Связанные документы: [cabinet-agent-map.md](./cabinet-agent-map.md) (карта для агента) · [cabinet-performance-audit.md](./cabinet-performance-audit.md) · [cabinet-git.md](./cabinet-git.md) · [cabinet-deploy.md](./cabinet-deploy.md) · [api-lk.md](./api-lk.md).

---

## 1. Стек и структура

| | |
|---|---|
| Framework | Laravel **6**, PHP **7.4** |
| UI | Blade, AdminLTE, jQuery, Semantic UI |
| Auth / роли | Laravel Auth + **Spatie Permission** (`permission:`, `role:`) |
| Frontend build | Laravel Mix (`webpack.mix.js`), `public/js/app.js` |
| Realtime | Laravel Echo / Pusher (на Mac отключено) |
| БД | MySQL; локально — **удалённо** `178.250.157.140` |

```
app/Http/Controllers/     # ~70 контроллеров
app/Http/Middleware/      # web-стек, local-обходы
app/Classes/              # Tariffs, Monitoring, Cron, …
routes/web.php            # основной UI (~550 строк)
routes/api.php            # cron, location, telegram bot
resources/views/        # Blade
config/                   # database, session, logging, permission
scripts/                  # dev-local.sh, diagnose, watchdog
storage/logs/             # laravel-YYYY-MM-DD.log
```

**Меню модулей** — не хардкод в routes: таблица `main_projects` + `MenuItemsPosition` → `MenuComposer` (`navigation.sidebar`). Ссылки в БД часто абсолютные на `lk.redbox.su`; в `local` подменяются через `localize_cabinet_url()` в `app/Helpers/helpers.php`.

---

## 2. Локальный запуск (канон)

**nginx + php-fpm** (16 воркеров) — параллельные запросы, много вкладок. Удалённая БД — как на ваших других проектах.

```bash
brew install nginx   # один раз
export PATH="/opt/homebrew/opt/php@7.4/bin:/opt/homebrew/opt/php@7.4/sbin:$PATH"
cd /Users/stanislav/Documents/projects/cabinet.datagon.ru
bash scripts/dev-local.sh stop
bash scripts/dev-local.sh detach
```

| Команда | Назначение |
|---------|------------|
| `bash scripts/dev-local.sh detach` | nginx+fpm в фоне |
| `bash scripts/dev-fpm.sh status` | health, режим |
| `bash scripts/dev-fpm.sh stop` | остановка |
| `bash scripts/dev-local.sh logs` | логи |
| `bash scripts/dev-cluster-queue.sh status` | воркеры кластера (`local_*`, по умолчанию **4** шт.) — **нужны для частотности** на :3002 |
| `CABINET_DEV_SERVE=1 … detach` | fallback: `artisan serve` |

**Не использовать** Next на :3002.

Раньше тормозило из‑за **`artisan serve`** (1 запрос за раз), не из‑за `DB_HOST=178.250.157.140`.

### Почему «висит» при открытии localhost:3002

| URL | Было | Сейчас (local + `SKIP_HEAVY_WEB_MIDDLEWARE`) |
|-----|------|-----------------------------------------------|
| `/` без входа | ~3–5 с (грузилась главная + `MainProject` с удалённой БД) | **302 → `/login` за ~0.03 с** |
| `/login` | ~0.03 с | ~0.01 с |
| `/` после входа | ~5 с (`MenuComposer`: десятки `hasRole` → MySQL) | 1-й заход: запросы к БД; дальше **кэш в сессии** (`cabinet_menu_modules`, `cabinet_home_projects`) |
| `/news` | ~45 с, **~167 SQL** (N+1: авторы, комментарии, лайки + `User::$with` → `tariff_pays`/`roles` на каждого) | **~4 с, ~12 SQL** — `NewsController::newsIndexRelations()`: eager load, `without(['pay','roles'])`, local limit 15 новостей / 5 комментариев |
| `/profile` | ~30 с, **~85 SQL** (конструкторы тарифов грузили `settings()` ×3 + N+1 `tariff_settings`) | **~2 с, ~9 SQL** — lazy price в `Tariff`, `with('property')` в `SettingsAbstract`, eager load в `ProfilesController` |

**Закладка:** `http://localhost:3002/login`, не корень `/`.

### Эталон UI кабинета (`/html/`, AdminLTE 4)

**Layout** (`layouts/app.blade.php`, `layouts/auth.blade.php`): **AdminLTE 4** из `public/html/` — Bootstrap **5**, `html/css/adminlte.min.css`, `html/js/adminlte.min.js`. Auth: `login-page bg-body-secondary`, `public/css/cabinet-auth.css`. Модули могут ещё использовать BS4 — `public/css/cabinet-bs4-compat.css`, `public/js/cabinet-bs5-shim.js` (`data-toggle` → `data-bs-toggle`, `data-card-widget` → `data-lte-toggle`).

**Активный модуль в сайдбаре:** `App\Support\CabinetSidebarActive` + класс `nav-link active` (подстраницы того же модуля тоже подсвечиваются). В режиме **sidebar-mini + sidebar-collapse** (≥992px) колонка grid зафиксирована на 4.6rem — при hover сайдбар раскрывается **поверх** контента (`public/css/custom.css`), без сдвига `app-main`.

**Бренд в UI:** сайдбар — `public/img/logo-icon.svg` + текст «Датагон» в `layouts/app.blade.php`; фавикон — `public/img/favicon.svg` (как на datagon.ru).

**Админ-меню:** у `admin` / `Super Admin` или legacy-роли (`User::isUserAdmin`) в блоке профиля — шестерёнка; список **не Bootstrap dropdown** (в сайдбаре обрезался): `users/panel.blade.php` + `position: fixed` в `layouts/app.blade.php` / `public/css/custom.css` (`.cabinet-admin-gear__menu`). Пункты `main_projects` id 16, 26, 29, 17, 27, 33, 31 (`App\Support\CabinetAdminMenu`) в основном меню не дублируются; id **17** (Documentation) в шестерёнке скрыт (`GEAR_HIDDEN_IDS`); id **33** — «Управление политиками» (`/edit-policy-files`, ключ `Policy management`). **Управление XML:** `/admin/xml-providers` (`XmlProvidersAdminController`) — балансы XMLStock / XMLProxy / XMLRiver, таблица «модуль → провайдеры»; config `cabinet-xml-providers.php`, сервис `App\Services\Xml\XmlProviderBalanceService`.

| | |
|---|---|
| **URL эталона** | http://localhost:3002/html/ (после `./scripts/sync-lte-html.sh --force`) |
| **Версия** | AdminLTE **4.0.0** — см. `public/html/VERSION.txt` |
| **Содержимое** | Демо-страницы: `index.html`, `pages/`, `forms/`, `tables/`, `widgets/`, `layout/`, `docs/`, картинки `assets/img/`, локальный `npm/` |

**Как работать**

1. Открыть `/html/` и найти **подходящую демо-страницу** (таблица, форма, карточки, сайдбар, модалка, FAQ, …).
2. Скопировать нужную **разметку и классы** в Blade (`resources/views/…`), под задачу кабинета.
3. Подключать стили/скрипты по образцу из той же страницы шаблона (пути в шаблоне — `./css/`, `./npm/…`; в Blade — `asset()` или общий layout).
4. Не тянуть произвольные UI-библиотеки, если аналог уже есть в `/html/`.

**Соответствие разделам шаблона (ориентир)**

| Задача в кабинете | Где смотреть в `/html/` |
|-------------------|-------------------------|
| Дашборд, виджеты | `index.html`, `index2.html`, `widgets/` |
| Таблицы, списки | `tables/`, `pages/` |
| Формы, поля | `forms/` |
| Карточки, кнопки, UI | `UI/` |
| Сайдбар / layout | `layout/`, `docs/layout.html` |
| Почта, файлы | `mailbox/`, `pages/file-manager.html` |
| Ошибки 404/500 | `pages/` (error pages) |

**Layout кабинета (2026-05):** `layouts/app.blade.php` + `layouts/auth.blade.php` на **AdminLTE 4** (`app-wrapper`, ассеты из `public/html/`). **jQuery** остаётся для legacy-скриптов и Vue. BS5 JS: `layouts/partials/lte4-scripts.blade.php` → `public/html/npm/bootstrap@5.3.8` (в репозитории нет `bootstrap@5.3.7`; при 404 nginx отдаёт HTML вместо JS — ломаются вкладки, dropdown, modal).

**Совместимость BS4 (пока не все Blade переписаны):**

| Файл | Назначение |
|------|------------|
| `public/css/cabinet-bs4-compat.css` | `ml-*`/`mr-*`, `custom-select`, `btn-block`, `input-group-append`, `btn-default`, DataTables length/filter, `.post .user-block` |
| `public/js/cabinet-bs5-shim.js` | `data-toggle`→`data-bs-toggle` (кроме `datetimepicker`), `data-target` только для `#…` (collapse/modal), `href="#…"` для collapse; `data-card-widget`→`data-lte-toggle`; **MutationObserver** |
| `public/js/cabinet-lte3-widgets.js` | `data-widget="expandable-table"` (LTE3, нет в LTE4 JS) |
| `public/js/cabinet-jquery-modal-bridge.js` | jQuery `.modal('show'/'hide')` → Bootstrap 5 Modal (monitoring, DataTables responsive, формы в модалках) |
| `public/css/cabinet-select2-bs5.css` | `select2-bootstrap4-theme` на BS5 (цвета/радиусы через CSS variables) |
| `public/css/cabinet-tempusdominus-bs5.css` | виджет **tempusdominus-bootstrap-4** поверх BS5 |
| `public/css/cabinet-modals-bs5.css` | `.modal-header .close` (legacy) на BS5 |
| `layouts/partials/vendor-datatables-*.blade.php` | DataTables: `rb-min`, `rb-css`, `rb-css-editor`, `rb-min-editor`, `buttons-min`, `monitoring-index`, `editor`, `responsive-core-min` |
| `public/js/cabinet-select2-defaults.js` | глобально `theme: 'bootstrap4'` для Select2 (совместимость с BS5 CSS) |
| `public/css/cabinet-auth.css` | login/register |

**Массовая правка Blade (2026-05-22):** во всех `resources/views/**/*.blade.php` — `data-bs-toggle`, `data-bs-dismiss`, `data-lte-toggle`, `data-bs-target="#…"`.

**Модуль monitoring (2026-05-22):** `custom-select` → `form-select`, `input-group-append`/`prepend` → BS5, `cabinet-lte3-widgets.js` (expandable-table).

**relevance-analysis + checklist (2026-05-22):** `custom-select` / `custom custom-select` → `form-select`, селекторы JS `.form-select.rounded-0.*`, `data-placement` → `data-bs-placement`. Кастомный `data-target` (статусы задач, лайки) не менялся. `cabinet-bs5-shim.js`: мост jQuery `.tooltip()` → Bootstrap 5 Tooltip.

**Остальные модули (2026-05-22):** пакетно по всем `resources/views/**/*.blade.php` — `form-select`, `input-group` BS5, `data-bs-placement`. Плагины (не-min): массово `data-bs-toggle`, `data-bs-target="#…"`. `scriptsV6/renderClouds.js`, `renderScannedSitesList.js`, `cluster/…min.js`.

**2026-05-22 (продолжение):** с **10 страниц** убран повторный `plugins/bootstrap/js/bootstrap.bundle.min.js` (BS4 перетирал BS5 из layout). Shim: collapse по `href="#…"`, не трогаем `data-target` без `#`. DataTables: CSS-правки в `cabinet-bs4-compat.css`; интеграция по-прежнему `datatables-bs4` + shim на length select.

**2026-05-22 (мосты):** `cabinet-jquery-modal-bridge.js` — legacy `$(…).modal()` на BS5. Export monitoring: `data-toggle="datetimepicker"` (tempusdominus). Shim дублирует `data-bs-toggle="datetimepicker"` → `data-toggle`. CSS: select2, tempusdominus. `bootstrap-modal-form-templates`: `data-bs-dismiss`, опечатка `model`→`modal`.

**2026-05-22 (DataTables/partials):** `vendor-datatables-css/js.blade.php` — единые bundle'ы; переведены monitoring/index, users/index, ai-generation/macros, пакетно `rb-min` в Blade. `responsive.bootstrap4.min.js`, summernote-bs4: `data-bs-dismiss` в модалках.

**2026-05-22 (DataTables финал):** все Blade без прямых `datatables-bs4/*` — только partial'ы; bundle'ы `rb-css-editor`, `rb-min-editor`, `buttons-min`. `cabinet-select2-defaults.js` в layout.

**2026-05-22 (Select2 + карточки):** из Blade убраны дубли `theme: 'bootstrap4'` (дефолт в `cabinet-select2-defaults.js`). `cabinet-bs4-compat.css`: `card-primary` / `card-outline` / `collapsed-card`. `component/card.blade.php`: события `collapsed.lte.card-widget` (LTE4).

**Остаётся на потом:** `datatables.net-bs5`; summernote `data-toggle="button"`; tempusdominus → BS5-форк.

**Новости:** лента в `resources/views/news/index.blade.php` — разметка Activity из `public/html/pages/profile.html`, стили `public/css/cabinet-news.css` (аватар 40px).

**Описание модуля:** `resources/views/description/main.blade.php` — тот же принцип (40px аватар). Раньше `.user-block img` без LTE3 CSS раздувало фото на страницах вроде «Баланс».

**Баланс:** `resources/views/balance/index.blade.php` + `public/css/cabinet-balance.css` — эталон `public/html/widgets/info-box.html` (три info-box одной высоты: иконка 70×70, третья строка `.info-box-meta`; шапка «История» — badge с total), форма и таблица как в `forms/` / `pages/invoice.html`. Проверка: http://localhost:3002/balance

**Тарифы:** `resources/views/tariff/index.blade.php` + `public/css/cabinet-tariff.css` — эталон `public/html/pages/pricing.html` (карточки планов, таблица сравнения, блок покупки). Названия планов — `__('Free'|'Optimal'|'Ultimate'|'Maximum')` в `resources/lang/ru.json` (как на datagon.ru/tarify). Проверка: http://localhost:3002/tariff

**Профиль:** `GET /profile` — `ProfilesController@index`, эталон `public/html/pages/profile.html`, CSS `public/css/cabinet-profile.css`. Вкладки BS5 (`data-bs-toggle="tab"`): данные, пароль, Telegram; у admin — тариф. Хеш `#password`, `#telegram`, `#tariff`. Проверка: http://localhost:3002/profile (переключение вкладок после загрузки `bootstrap@5.3.8`).

**Модалка Telegram (2026-05):** всем без `telegram_bot_active` + `chat_id` — BS5 modal в `layouts/partials/telegram-connect-prompt.blade.php`, composer `TelegramConnectPromptComposer`, CSS `cabinet-telegram-prompt.css`. «Напомнить через 2 недели» → `POST profile/telegram-connect-prompt/snooze` (`users.telegram_prompt_snoozed_until`). Миграция: `2026_05_22_120000_add_telegram_prompt_snoozed_until_to_users_table.php`.

**Главная `/`:** три макета (переключатель). Данные: `App\Support\HomeDashboard`. **V1** `/` — info-box + карточки (`home/`, `cabinet-home.css`). **V2** `/home/variant-2` — сайдбар + bento + список (`home-v2/`, `cabinet-home-v2.css`). **V3** `/home/variant-3` — KPI-полоса + поиск + сетка иконок + чипы действий (`home-v3/`, `cabinet-home-v3.css`). Проверка: http://localhost:3002/

**Служба поддержки (тикеты):** эталон `public/html/mailbox/` — layout `resources/views/support/layout.blade.php` (без лишней обёртки `component.card`). Маршруты `support/*`, `SupportTicketController`, CSS `public/css/cabinet-support.css`. Пользователь создаёт тикет и дописывает в открытом; ответ поддержки — `admin` / `Super Admin`. Статусы: `open` → `answered` → `closed`; **повторно открыть** — `PATCH support/{ticket}/reopen` (владелец тикета или staff). Поиск по теме, тексту сообщений и (для staff) email. **Бейдж в шапке** (`SupportInboxBadgeComposer`): staff — число тикетов `open`; пользователь — `answered` (есть ответ поддержки). Проверка: http://localhost:3002/support

**Анализ конкурентов (`/competitor-analysis`):** стабильная **v2.9.1s** (badge в шапке; демо, геозависимость, ТОП 30, Google-города) — журнал [cabinet-competitor-analysis-changelog.md](./cabinet-competitor-analysis-changelog.md). Config: `cabinet-competitor-analysis.php`; API `GET /competitor-analysis/regions?engine=…`.

**Версионирование модулей (общее):** [cabinet-module-versioning.md](./cabinet-module-versioning.md) — config + changelog + badge для каждого модуля с UI.

**Доска идей:** в шапке справа от «Служба поддержки» — **Идеи** (`ideas/*`, `FeatureIdeaController`). Пользователь предлагает идею → статус `pending`; staff (`admin` / `Super Admin`) публикует (`approved`) или отклоняет (`rejected`). Голосование — `POST ideas/{idea}/vote` (toggle), только за чужие опубликованные идеи. Таблицы `feature_ideas`, `feature_idea_votes`; CSS `public/css/cabinet-ideas.css`, JS `public/js/cabinet-ideas.js`. Миграция `2026_05_24_120000_create_feature_ideas_tables.php`. Проверка: http://localhost:3002/ideas

**Удалён модуль «Управление репутацией / накрутка поведенческих»** (2026-05-22) — код в репозитории; **миграции БД, прод, чеклисты:** [cabinet-pending-db-and-deploy.md](./cabinet-pending-db-and-deploy.md).

Сверка: [Migration v3→v4](https://adminlte.io/themes/v4/docs/migration.html).

**Обновление шаблона:** `./scripts/sync-lte-html.sh --force` → commit `public/html/` (~150 MB, в git для деплоя на сервер).

**jQuery:** подключается в `<head>` (`layouts/app.blade.php`), иначе сайдбар и меню падают с `$ is not defined` (в т.ч. во встроенном браузере Cursor).

При `SKIP_HEAVY_WEB_MIDDLEWARE=true` в local отключены тяжёлые composers: `LimitsComposer`, тариф в `UserPanelComposer`; счётчик новостей в шапке может быть 0, **счётчик комментариев для admin** — кэш 2 мин (`NewsBadge`). На `/news` — лимит 15 постов / 5 комментариев; при открытии страницы обновляются `last_check` и `last_comment_check`.

---

## 3. Логи — куда смотреть первым делом

| Симптом | Файл | Что искать |
|---------|------|------------|
| Не стартует / завис :3002 | `/tmp/cabinet-dev.log` | `Accepted` без `Closing`, `watchdog: перезапуск` |
| Watchdog | `/tmp/cabinet-watchdog.log` | перезапуски serve |
| Ошибки Laravel | `storage/logs/laravel-YYYY-MM-DD.log` | `QueryException`, `Maximum execution time` |
| PHP built-in server | тот же `/tmp/cabinet-dev.log` | строки `[Fri …] 127.0.0.1:… Accepted/Closing` |
| Старый режим 3 воркеров | `/tmp/cabinet-worker-1300*.log` | зависший воркер |
| Прокси (если parallel) | `/tmp/cabinet-proxy.log` | `EADDRINUSE`, failover |

**Быстрая диагностика:**

```bash
cd /Users/stanislav/Documents/projects/cabinet.datagon.ru
bash scripts/dev-local.sh status
bash scripts/cabinet-diagnose.sh
tail -50 /tmp/cabinet-dev.log
tail -30 storage/logs/laravel-$(date +%Y-%m-%d).log
```

**Проверка порта:**

```bash
lsof -i :3002 -sTCP:LISTEN    # ожидается php, не node
curl -sS -o /dev/null -w "%{http_code} %{time_total}s\n" --max-time 15 http://127.0.0.1:3002/login
```

---

## 4. `.env` для Mac (обязательно)

```env
APP_ENV=local
APP_URL=http://localhost:3002

DB_HOST=178.250.157.140
DB_PORT=3306
# DB_DATABASE, DB_USERNAME, DB_PASSWORD — с VPS, не коммитить

SESSION_DRIVER=file
LOG_CHANNEL=stderr

HTTP_HEADERS_CLEANUP_ON_REQUEST=false
SKIP_HEAVY_WEB_MIDDLEWARE=true
SKIP_EMAIL_VERIFICATION=true
```

| Переменная | Зачем |
|------------|--------|
| `DB_HOST=178.250.157.140` | не `127.0.0.1` — БД на старом VPS |
| `LOG_CHANNEL=stderr` | иначе 500 «Operation not permitted» на `storage/logs` |
| `HTTP_HEADERS_CLEANUP_ON_REQUEST=false` | иначе `DELETE` по `http_headers` на **каждый** запрос (минуты) |
| `SKIP_HEAVY_WEB_MIDDLEWARE=true` | пропуск тяжёлого middleware + composers (лимиты, новости, тариф, кэш меню) |
| `SKIP_EMAIL_VERIFICATION=true` | вход без verified-email |
| `SESSION_DRIVER=file` | сессии без лишних запросов к MySQL |
| `CABINET_STORAGE_URL=https://lk.redbox.su` | Mac и **cabinet на s3**: аватары/картинки из `storage/`, если файла нет локально |

`php artisan route:list` на Mac **может висеть** минутами — из‑за подключения к удалённой БД; для роутов смотреть `routes/web.php` напрямую.

---

## 5. Middleware (группа `web`)

Порядок в `app/Http/Kernel.php` → каждый HTTP-запрос:

| Middleware | Local | Prod | Риск |
|------------|-------|------|------|
| `VerifyCsrfToken` | **выключен** (`APP_ENV=local`) | вкл. | 419 если на :3002 не Laravel |
| `CheckHttpHeadersDataBase` | terminate skip | `DELETE http_headers` в terminate | **60s+** на prod если включено |
| `DeleteTariffByUsers` | skip при `SKIP_HEAVY…` | UPDATE тарифов/ролей | медленный DB |
| `DeleteUsersNoVerify` | no-op (закомментирован) | — | — |
| `LastOnline` | skip | UPDATE users | DB |
| `VisitStatistics` | skip | INSERT/UPDATE `visit_statistics` | DB на каждый клик |
| `EnsureEmailIsVerified` (`verified`) | skip при `SKIP_EMAIL…` | редирект на verify | блок `/` |
| `SetTeamContext` | всегда | контекст команды | редко |
| `SetLocaleToAuthUser` | всегда | локаль | — |

**Группа `verified`** — почти весь продукт после входа (`routes/web.php` с строки 46). Без `SKIP_EMAIL_VERIFICATION` не пустит на `/` до подтверждения email.

---

## 6. Роутинг `routes/web.php`

### 6.1 Без авторизации

| URI | Контроллер | Назначение |
|-----|------------|------------|
| `Auth::routes(['verify' => true])` | Auth/* | login, register, password |
| `public/http-headers/{id}` | PublicController | публичный просмотр HTTP-заголовков |
| `public/share/relevance/{token}` | RelevancePublicShareController | публичный просмотр проекта анализа релевантности (30 дней, только чтение) |
| `public/share/relevance/{token}/history/{id}` | RelevancePublicShareController | детальный просмотр проверки по публичной ссылке |
| `public/share/text-analyzer/{token}` | TextAnalyzerPublicShareController | публичный отчёт анализа текста (30 дней, read-only) |
| `public/share/html-editor/{token}` | HtmlEditorPublicShareController | публичный HTML-текст (30 дней, превью + код) |
| `public/share/site-monitoring/{token}` | SiteMonitoringPublicShareController | публичный отчёт мониторинга сайта (30 дней, read-only) |
| `support/*` | SupportTicketController | тикеты поддержки |
| `ideas/*` | FeatureIdeaController | доска идей: предложения, модерация, голоса |
| `balance-add/result` | BalanceAddController | callback оплаты |
| `personal-data/*`, `privacy-policy/*` | AccessController | политики |

### 6.2 После `verified` (основной кабинет)

| URI | Модуль |
|-----|--------|
| `/` | HomeController — плитки `main_projects` |
| `main-projects` | каталог/статистика модулей |
| `monitoring/*` | мониторинг позиций (крупнейший блок) |
| `analyze-relevance`, `history`, … | анализ релевантности — TF/IDF/score: `App\Support\TfidfMetrics`, расчёт в `App\Relevance` (агрегат конкурентов, IDF = log₁₀(N/df), облака «TF‑IDF score» по `weight = score`; «TF clouds» — частота через `TextAnalyzer::prepareCloud`) |
| `meta-tags/*` | мета-теги |
| `cluster/*` | кластеризатор — **`/cluster`** (анализатор), `/cluster/regions`, `/show-cluster-result/{id}`, `/edit-clusters/{id}`, `/cluster-projects`; views в `cluster-v2/`; редиректы с `*-v2` URL; описание модуля — `descriptions.code=cluster`; `/cluster-configuration` — KPI |
| `competitor-analysis` | анализ конкурентов — `public/css/cabinet-competitor-analysis.css`, nav pills; `/competitors-config` — KPI месяца + уникальные user_id за 30/60/90 дн. (`SearchCompetitors::countUniqueUsersSinceDays`) |
| `counting-text-length` | подсчёт длины текста — `cabinet-text-length.css/js`, badge **v1.0s**; changelog: [cabinet-text-length-changelog.md](./cabinet-text-length-changelog.md) |
| `list-comparison` | сравнение списков — `cabinet-list-comparison.css/js`, badge **v1.0s**; changelog: [cabinet-list-comparison-changelog.md](./cabinet-list-comparison-changelog.md) |
| `unique` | уникальные слова — `cabinet-unique.css/js`, phpMorphy + shingles, badge **v1.0s**; changelog: [cabinet-unique-changelog.md](./cabinet-unique-changelog.md) |
| `http-headers/{url?}` | HTTP-заголовки |
| `utm-marks`, `roi-calculator` | UTM, ROI |
| `password-generator` | генератор паролей |
| `duplicates` | удаление дубликатов — `cabinet-duplicates.css/js`, badge **v1.2s**; changelog: [cabinet-duplicates-changelog.md](./cabinet-duplicates-changelog.md) |
| `unique-words`, `unique` | уникальные слова |
| `text-analyzer` | анализ текста — badge **vX.Y**; **сравнение с конкурентом** (toggle + URL); публичная ссылка: `POST text-analyzer/public-share`, `GET public/share/text-analyzer/{token}`; **PDF:** эталон v6.9s → [cabinet-pdf-report-template.md](./cabinet-pdf-report-template.md); changelog: [cabinet-text-analyzer-changelog.md](./cabinet-text-analyzer-changelog.md); smoke: `scripts/smoke-text-analyzer.sh` |
| `html-editor` | HTML-редактор — поиск, пресеты, split, публичная ссылка, badge **v1.5.3s**; `POST html-editor/public-share`; changelog: [cabinet-html-editor-changelog.md](./cabinet-html-editor-changelog.md) |
| `site-monitoring` | мониторинг сайтов — LTE4, badge **v1.4.0s**; stats modal: PDF + публичная ссылка (`POST site-monitoring-export-pdf`, `POST site-monitoring-public-share`, `GET public/share/site-monitoring/{token}`); PDF эталон: [cabinet-pdf-report-template.md](./cabinet-pdf-report-template.md); админка `/site-monitoring-config`; changelog: [cabinet-site-monitoring-changelog.md](./cabinet-site-monitoring-changelog.md) |
| `domain-information` | срок регистрации доменов |
| `backlink` | отслеживание ссылок |
| `keyword-generator` | генератор слов |
| `news` | новости; шапка: жёлтый бейдж — новые посты, синий (admin) — новые комментарии → `#comment-{id}`; блокировка комментариев `users.news_comments_blocked_at` (иконка у комментария) |
| `tariff`, `balance` | тарифы, баланс |
| `profile/` | профиль |
| `users`, `manage-access` | админка; `/users` — график активности `UsersActivityDashboard::snapshotCached()` (10 мин), **не** отключается `SKIP_HEAVY_WEB_MIDDLEWARE`; фильтр **тарифа** — по Spatie-роли (`Maximum` / `Optimal` / `Ultimate`), с fallback на `tariff_pays.status=1`; `none` — без платных ролей; легенда **Верифицирован** / **Письмо прочитано**; cron `DeleteUnverifiedUsers`; `/users/{id}/edit`; визиты; `/manage-access` |
| `main-projects` | модули главной и сайдбара; `/main-projects/statistics/{id}` — KPI, сравнение с прошлым периодом, doughnut/будни, динамика Chart.js, топ со ссылкой на `visit.statistics`, аккордеон (фильтр, развернуть/пик), клики по кнопкам (`ModuleVisitStatisticsReport`, `cabinet-module-statistics.css`) (2026-05) |
| `tariff-settings` | лимиты тарифов — `public/css/cabinet-tariff-settings.css`, карточки по свойствам; значения — **карандаш**; справочник кодов `App\Support\TariffLimitRegistry` (нет в БД → обычно безлимит в модуле) (2026-05) |
| `checklist/*` | чеклисты |
| `ai-generation/*` | AI-генерация |

Полный список — в файле `routes/web.php` (~550 строк).

### 6.3 Маркетинг datagon.ru → кабинет (типовые URL)

| Slug на datagon.ru | URL в кабинете | Permission (пример) |
|--------------------|----------------|---------------------|
| `analiz-relevantnosti` | `/analyze-relevance` | релевантность |
| `monitoring-pozicii-sayta` | `/monitoring` | Monitoring |
| `podschet-dliny-teksta` | `/counting-text-length` | Counting text length · `cabinet-text-length` v1.0s |
| `proverka-meta-tegov-online` | `/meta-tags` | Meta tags |
| `klasterizator-klyuchevykh-slov` | `/cluster` | Cluster |
| `analiz-konkurentov` | `/competitor-analysis` | Competitor |
| `analiz-teksta` | `/text-analyzer` | Text analyzer |
| `html-redaktor` | `/html-editor` | HTML editor · `cabinet-html-editor` v1.5.3s |
| `http-headers` | `/http-headers` | Http headers |
| `utm-metki` | `/utm-marks` | Utm marks |
| `kalkulyator-roi` | `/roi-calculator` | Roi calculator |
| `generator-paroley` | `/password-generator` | — |
| `sravnenie-spiskov-klyuchevykh-fraz` | `/list-comparison` | List comparison |
| `udalenie-dublikatov` | `/duplicates` | Duplicates |
| `vydelenie-unikalnykh-slov-v-tekste` | `/unique` | `cabinet-unique` v1.0s, demo API |
| `otslezhivanie-ssylok` | `/backlink` | — |
| `monitoring-saytov` | `/site-monitoring` | Site monitoring · `cabinet-site-monitoring` v1.1s |
| `otslezhivanie-sroka-registratsii-domenov` | `/domain-information` | — |
| `generator_slov` | `/keyword-generator` | Keyword generator |

Точные `permission:` — в `routes/web.php` у каждого `Route::get`. Меню пользователя фильтруется по ролям Spatie (`MenuComposer`).

---

## 7. API `routes/api.php` (префикс `/api`)

| Method | URI | Назначение |
|--------|-----|------------|
| GET | `/api/backlink/scan-links` | cron |
| GET | `/api/backlink/scan-broken-links` | cron |
| GET | `/api/domain-monitoring/check-link-crone/{timing}` | cron |
| GET | `/api/domain-information/check-domain-crone/` | cron |
| GET | `/api/location` | подсказки локаций Yandex/Google |
| POST | `/api/bot` | Telegram bot |

**Нет** (пока) маршрутов `api/demo/*` и `api/public/contact` для маркетинга — демо на datagon.ru использует fallback Next (`app/api/demo/...`). Allowlist в Next: `lib/lk-api.ts`.

Throttle: `60` запросов/мин на группу `api`.

---

## 8. View Composers (нагрузка на каждую страницу)

`app/Providers/ComposerServiceProvider.php`:

| View | Composer | DB |
|------|----------|-----|
| `navigation.sidebar` | MenuComposer | `main_projects`, `menu_items_position` |
| `navigation.menu-right` | UserPanelComposer, LimitsComposer | user, лимиты тарифа |
| `layouts.app` | StatisticsComposer | статистика |
| `layouts.partials.app-header` | LimitsComposer | **в local пропущен** (`SKIP_HEAVY…`) |
| `layouts.partials.app-header` | CountUnreadNewsComposer, UserPanelComposer | новости, баланс/тариф |

**Главная `/`** тянет меню + проекты (+ лимиты на prod). В **local** dropdown «Ваши лимиты» отключён (`LimitsComposer`); **баланс и название тарифа** в шапке показываются. На **prod** в `.env`: `SKIP_HEAVY_WEB_MIDDLEWARE=false`, иначе нет блока лимитов.

### 8.1 Пропали «Баланс / Тариф / Лимиты» в шапке

| Симптом | Причина | Решение |
|---------|---------|---------|
| Нет всех трёх пунктов | Старый `menu-right`: обёртка `@if(isset($name))` + `name=null` при skip | обновить код; `UserPanelComposer` всегда отдаёт имя тарифа |
| Нет только «Ваши лимиты» | `SKIP_HEAVY_WEB_MIDDLEWARE=true` или `APP_ENV=local` | на **prod** в `.env`: `false`; local — норма |
| После деплоя | закэшированы views/config | `php7.4 artisan view:clear && config:clear && config:cache` |

### 8.2 Верхнее меню (шапка)

Файлы: `navigation/menu.blade.php` (слева), `menu-right.blade.php` (чипы баланс/тариф/лимиты), стили `.cabinet-header-*` в `public/css/custom.css`. Слева — ссылки с иконками; справа — чипы + toolbar (fullscreen, выход). Таблица лимитов — `.cabinet-header-limits-menu`; подсказка `#cabinet-header-limits-hint` скрыта до заполнения JS (`cabinet-layout-scripts.blade.php`).

---

## 9. Troubleshooting — симптом → причина → решение

### 9.1 Белый экран / бесконечная загрузка

| Причина | Решение |
|---------|---------|
| Один `artisan serve` занят долгим запросом к БД | Закрыть лишние вкладки :3002; `dev-local.sh stop && detach` |
| Открыт `/` вместо `/login` | Использовать http://localhost:3002/login |
| 3 воркера + parallel (старый режим) | Перейти на `dev-local.sh` |
| Next на :3002 | `cd datagon.ru && npm run dev:stop`, проверить `lsof -i :3002` |

В логе: `Accepted` без `Closing` > 30s → запрос к MySQL; смотреть `laravel-*.log`.

### 9.2 «Кабинет: воркеры не отвечают» / 502 текстом

| Причина | Решение |
|---------|---------|
| Режим `dev-parallel.sh` + зависший воркер 13004 | `dev-local.sh stop` (убивает parallel) + `detach` |
| Все воркеры в очереди | см. 9.1 |

### 9.3 419 Page Expired

| Причина | Решение |
|---------|---------|
| На :3002 не Laravel (Next) | Освободить 3002, запустить кабинет |
| Prod без local CSRF | Обычный CSRF: обновить страницу, cookie |

Local: CSRF отключён в `VerifyCsrfToken` при `APP_ENV=local`.

### 9.4 500 на `/login`

| Причина | Решение |
|---------|---------|
| `LOG_CHANNEL=stack`, нет прав на `storage/logs` | `LOG_CHANNEL=stderr` |
| `DB_HOST=127.0.0.1` | `DB_HOST=178.250.157.140` |
| Access denied MySQL | проверить `DB_*` с VPS, доступ IP Mac на 3306 |

### 9.5 `Maximum execution time of 60 seconds exceeded`

| Причина | Решение |
|---------|---------|
| Тяжёлый SQL к удалённой БД | Ожидание; не открывать `/` и тяжёлые модули до входа |
| `http_headers` cleanup | `HTTP_HEADERS_CLEANUP_ON_REQUEST=false` |
| Login POST | `LoginController` ставит `set_time_limit(300)` — ждать до 5 мин |

### 9.6 Меню ведёт на lk.redbox.su

| Причина | Решение |
|---------|---------|
| Ссылки из БД | `APP_ENV=local` + `APP_URL=http://localhost:3002` → `localize_cabinet_url()` |

### 9.7 WebSocket / Echo ошибки в консоли

| Причина | Решение |
|---------|---------|
| Нет websocket-сервера на Mac | `BROADCAST_DRIVER=log`, `window.__DISABLE_LARAVEL_ECHO__` в `layouts/app` (local) |

### 9.8 `npm run dev` (3001) «ломает» кабинет?

**Нет.** `npm run dev:stop` освобождает только **3001**. Кабинет на **3002** отдельно. Конфликт только если запустить `npm run dev:all` и нажать Ctrl+C (cleanup гасит кабинет) или случайно Next на 3002.

### 9.9 Аватар 404

Дефолт: `public/img/user-icon.svg`.

---

## 10. Авторизация

- Регистрация/логин: `Auth::routes` → `/login`, `/register`.
- После входа редирект: `LoginController::$redirectTo = '/'`.
- POST login: `set_time_limit(300)` — учёт медленной БД.
- Гость: middleware `guest` на LoginController.
- Прод: middleware `verified` на весь продукт.

Формы auth: `resources/views/auth/*`, layout `layouts/auth.blade.php` (LTE4, те же `lte4-head` / `lte4-scripts` что и app; в local без GTM/select2). Эталон: `public/html/examples/login-v2.html`.

---

## 11. Интеграция с datagon.ru (Next)

```
Браузер → datagon.ru:3001
           └─ /api/lk/*  →  LK_API_BASE_URL (lk.redbox.su)
           └─ /api/demo/* →  fallback на Next, пока нет endpoint в Laravel
```

См. [api-lk.md](./api-lk.md). После cutover кабинета — сменить `LK_API_BASE_URL` на `https://cabinet.datagon.ru`.

---

## 12. Прод и деплой

| | |
|---|---|
| Прод UI | https://lk.redbox.su |
| Новый VPS | 155.212.171.103, :3002, [cabinet-deploy.md](./cabinet-deploy.md) |
| Git | [cabinet-git.md](./cabinet-git.md) |

На проде **не** отключать CSRF; `HTTP_HEADERS_CLEANUP_ON_REQUEST` — по согласованию (на VPS часто `false`).

---

## 13. Полезные команды

Профилирование и полный аудит — [cabinet-agent-map.md](./cabinet-agent-map.md) §6.

```bash
# PHP 7.4
export PATH="/opt/homebrew/opt/php@7.4/bin:$PATH"

php artisan config:clear
php artisan cache:clear
composer install --no-dev

# Права (если 500 на storage)
chmod -R ug+rwx storage bootstrap/cache

# Поиск в коде
rg "permission:" routes/web.php
rg "class.*Controller" app/Http/Controllers --files-with-matches
```

---

## 14. Чеклист при новой ошибке

1. `bash scripts/dev-local.sh status`
2. `tail -50 /tmp/cabinet-dev.log` — есть ли зависший `Accepted`?
3. `tail -30 storage/logs/laravel-$(date +%Y-%m-%d).log`
4. `lsof -i :3002` — php или node?
5. Одна вкладка `/login`?
6. `.env`: `DB_HOST`, `LOG_CHANNEL`, `SKIP_*`, `HTTP_HEADERS_*`
7. Если меняли middleware/routes — `php artisan config:clear`

---

*Обновлено по коду cabinet.datagon.ru (май 2026). При изменении `scripts/dev-*.sh` или middleware — обновить этот файл и [cabinet-agent-map.md](./cabinet-agent-map.md) §4–6.*
