# Changelog: Мониторинг сайтов

Модуль: `/site-monitoring` · config `cabinet-site-monitoring.php` · badge **v1.5.2s**

## 1.5.2s — 2026-05-26

- **Fix:** выбор срока публичной ссылки не блокируется; предупреждение, если нет таблицы `site_monitoring_public_shares`.
- **Проверка:** модалка статистики → список 30/90/180/365/бессрочно активен.

## 1.5.1s — 2026-05-26

- **Fix:** PDF — обложка «Мониторинг сайтов», не «Анализ текста» (`cover_rev` + тексты в `TextAnalyzerPdfBranding`).
- **Проверка:** скачать PDF из модалки статистики — первая страница.

## 1.5.0s — 2026-05-26

- **Публичная ссылка:** выбор срока **30 / 90 / 180 / 365 / бессрочно** (`public_share_ttl_days` в config).
- **БД:** `expires_at` nullable — `2026_05_26_170000_make_site_monitoring_public_shares_expires_at_nullable.php`.
- **Проверка:** модалка статистики → срок → «Создать публичную ссылку».

## 1.4.3s — 2026-05-26

- **UX:** PDF в модалке — компактная кнопка, скачивание через POST (fetch), без ошибки GET.
- **Проверка:** модалка статистики → «Скачать PDF-отчёт».

## 1.4.2s — 2026-05-26

- **Fix:** чекбокс — клик по всей высоте строки в первой колонке (label на весь `td`).

## 1.4.1s — 2026-05-26

- **Fix:** колонка чекбоксов — фиксированная ширина, клик по всей ячейке без схлопывания таблицы.
- **Проверка:** http://localhost:3002/site-monitoring

## 1.4.0s — 2026-05-26

- **Отчёт и шаринг:** в модалке «Лог и статистика» — **PDF** (эталон Datagon, [cabinet-pdf-report-template.md](./cabinet-pdf-report-template.md)) и **публичная ссылка** на 30 дней (`POST site-monitoring-public-share`, `GET /public/share/site-monitoring/{token}`).
- **БД:** миграция `2026_05_26_160000_create_site_monitoring_public_shares_table.php`.
- **Проверка:** статистика по проекту → «Скачать PDF» / «Создать публичную ссылку»; ссылка в инкогнито.

## 1.3.12s — 2026-05-26

- **Сброс статистики:** в «Состоянии» — «Ожидает проверки» вместо старых HTTP/uptime; после ручной проверки или cron — актуальные данные.
- **Проверка:** http://localhost:3002/site-monitoring → сброс → лупа по строке.

## 1.3.11s — 2026-05-26

- **UX:** чекбокс выбора проекта — клик по всей ячейке, галочка по центру.
- **Проверка:** http://localhost:3002/site-monitoring

## 1.3.10s — 2026-05-26

- **UX:** «Сбросить по всем» — спиннер на кнопке, быстрый bulk SQL, обновление колонки «Состояние» на всех страницах таблицы; пояснение в confirm (HTTP-код не сбрасывается).
- **Проверка:** http://localhost:3002/site-monitoring → после сброса в «Состоянии» меняется только строка «Доступность» (100% / 0%).

## 1.3.9s — 2026-05-26

- **Fix:** «Сбросить статистику по всем» — синтаксис JS (Blade `@json` + `__()`), обновление строк через DataTables API.
- **Проверка:** http://localhost:3002/site-monitoring

## 1.3.8s — 2026-05-26

- **Форма добавления:** навигация «Шаг 1–3» сверху, якоря к секциям, номера в заголовках блоков.
- **Проверка:** http://localhost:3002/add-site-monitoring

## 1.3.7s — 2026-05-26

- **Форма добавления:** подписи и подсказки только на русском (интервалы «каждые N мин.», без email/Telegram/URL в тексте).
- **Проверка:** http://localhost:3002/add-site-monitoring

## 1.3.6s — 2026-05-26

- **Форма добавления проекта:** переразметка — три секции без дублирующих «?» и простыней подсказок; сетка 2 колонки; одна карточка модуля.
- **Проверка:** http://localhost:3002/add-site-monitoring (Ctrl+F5)

## 1.3.5s — 2026-05-26

- **Fix:** «Сбросить статистику по всем» — обновление строк таблицы (числовые `id` проектов нельзя искать через `$('#123')`); toast/toastr при успехе.
- **Проверка:** http://localhost:3002/site-monitoring

## 1.3.4s — 2026-05-26

- **Модалка «Статистика доступности»:** пагинация истории проверок (25 записей на страницу, «« / »»); KPI «Проверок в логе» — по всей таблице лога, не только по странице.
- **Проверка:** http://localhost:3002/site-monitoring → «Лог и статистика»

## 1.3.3s — 2026-05-26

- **Админка** `/site-monitoring-config`: в реестре колонка «Последний визит» (`users.last_online_at`, относительное время).
- **Проверка:** http://localhost:3002/site-monitoring-config

## 1.3.2s — 2026-05-26

- **Список проектов:** кнопка «Сбросить статистику по всем» в панели действий (uptime/простой у всех проектов аккаунта, лог проверок сохраняется).
- **Проверка:** http://localhost:3002/site-monitoring

## 1.3.1s — 2026-05-26

- **Добавление проекта** (`/add-site-monitoring`): карточка BS5, подписи `form-text` и иконки-подсказки у полей (название, URL, интервал, таймаут, фраза, уведомления).
- **Проверка:** http://localhost:3002/add-site-monitoring

## 1.3.0s — 2026-05-26

- **Тариф Free:** автопроверка только раз в **60 минут**; в форме и списке — один интервал, на Free select заблокирован. Существующие проекты Free → `timing = 60` (миграция `2026_05_26_150000_set_free_tariff_domain_monitoring_timing_to_60.php`, плюс синхронизация при открытии `/site-monitoring`). `SiteMonitoringTiming`.
- **Проверка:** http://localhost:3002/site-monitoring (аккаунт Free) · `php artisan migrate` на сервере

## 1.2.9s — 2026-05-26

- **Админка** `/site-monitoring-config`: реестр — одна таблица (пользователь: email, имя, тариф; проект, статус), DataTables поиск и сортировка.
- **Проверка:** http://localhost:3002/site-monitoring-config

## 1.2.8s — 2026-05-26

- **Список проектов:** после ручной проверки — кнопки «Лог и статистика» (модалка: KPI, эпизоды сбоев, история) и «Сбросить статистику» (uptime/простой, лог сохраняется). Таблица `domain_monitoring_check_logs`, миграция `2026_05_26_140000_create_domain_monitoring_check_logs_table.php`.
- **Проверка:** http://localhost:3002/site-monitoring

## 1.2.7s — 2026-05-26

- **Админка** `/site-monitoring-config`: расширенная статистика (KPI, разбивка по интервалам) и реестр «какой сайт у какого пользователя» с поиском; `SiteMonitoringAdminStats`.
- **Проверка:** http://localhost:3002/site-monitoring-config (admin)

## 1.2.6s — 2026-05-26

- **Без Telegram:** подсказка на списке и при добавлении проекта; flash после сохранения, если внешних оповещений не будет (`User::receivesSiteMonitoringExternalAlerts`).
- **Проверка:** http://localhost:3002/add-site-monitoring · http://localhost:3002/site-monitoring

## 1.2.5s — 2026-05-26

- **Отступы:** единый `--cabinet-sm-gap` между nav, alert, toolbar, DataTables и таблицей; контролы «Показать / Поиск» на BS5 grid.
- **Проверка:** http://localhost:3002/site-monitoring (Ctrl+F5)

## 1.2.4s — 2026-05-26

- **Тариф Free:** email-оповещения мониторинга не отправляются (`User::canReceiveSiteMonitoringEmail`, `DomainMonitoring::sendNotifications`); Telegram — если бот подключён.
- Пометки в модуле, строка в «Сравнение возможностей» на `/tariff`, маркетинг `/tarify/` и `/monitoring-saytov/`.
- **Проверка:** http://localhost:3002/site-monitoring (пользователь Free) · http://localhost:3001/tarify/

## 1.2.3s — 2026-05-26

- **Выравнивание строк таблицы:** `align-middle`, обёртка `cabinet-sm-cell` (flex), одна высота полей; фраза — `input`, не textarea.
- **Проверка:** http://localhost:3002/site-monitoring (Ctrl+F5)

## 1.2.2s — 2026-05-26

- Nav: вкладка **«Проекты»** (без обрезки «Мониторинг сайтов»), pills как у competitor-analysis.
- Таблица: однострочные поля названия/URL, компактные `form-select-sm`, статус без яркого `text-info`, короткие заголовки колонок.
- Кнопка **«Добавить проект»**.
- **Проверка:** http://localhost:3002/site-monitoring

## 1.2.1s — 2026-05-26

- **RU:** перевод `Link` → «Ссылка»; `Uptime` → «Доступность»; в AJAX-статусе — без англ. `http code`.
- **Вёрстка:** модалки вне `<tbody>`; убран дубль CSS и `drawCallback` с лишним wrap (ломал таблицу).
- **Проверка:** http://localhost:3002/site-monitoring

## 1.2s — 2026-05-26

- **LTE4:** обёртка `cabinet-site-mon-page`, `cabinet-site-monitoring.css`, toolbar на BS5; таблица и JS без смены `#table`/toastr.
- **Навигация:** `module-nav` (nav-pills) как у competitor-analysis — «Мониторинг» / «Администрирование модуля», не текстовая ссылка.
- **Проверка:** http://localhost:3002/site-monitoring · http://localhost:3002/site-monitoring-config (admin)

## 1.1.1s — 2026-05-26

- **Визуал:** откат списка и формы добавления к проверенной вёрстке (Font Awesome, toastr, `#table`, inline JS, `plugins/site-monitoring/css`).
- Сохранены: badge версии, чекбокс `send_notification` на create, ссылка админа на `/site-monitoring-config`, глобальные настройки в админке.
- **Проверка:** http://localhost:3002/site-monitoring · http://localhost:3002/add-site-monitoring

## 1.1s — 2026-05-26

- **Уведомления:** документация на странице; глобальные настройки в админке (`site_monitoring_configs`): интервал повтора, email/Telegram, дефолт для новых проектов.
- **Навигация:** как у competitor-analysis — «Мониторинг» / «Администрирование модуля».
- **Проверка:** http://localhost:3002/site-monitoring · http://localhost:3002/site-monitoring-config (admin)

## 1.0s — 2026-05-25

- **Кабинет LTE4:** список проектов и форма добавления — AdminLTE 4, Bootstrap Icons, блок «Как работает», пустое состояние.
- **JS/CSS:** `cabinet-site-monitoring.js`, `cabinet-site-monitoring.css` — таблица, inline-редактирование, проверка, bulk-delete.
- **Демо:** `SiteMonitoringDemoWidget` на http://localhost:3001/monitoring-saytov/ — `POST api/demo/monitoring-saytov/run`, 5 проверок/сутки.
- **Проверка:** http://localhost:3002/site-monitoring · http://localhost:3001/monitoring-saytov/
