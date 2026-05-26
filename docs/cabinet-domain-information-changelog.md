# Changelog: Отслеживание срока регистрации доменов

Модуль: `/domain-information` · config `cabinet-domain-information.php` · badge **v1.0.0s**

## 1.1.5s — 2026-05-26

- **Список:** KPI-блок (info-box) — всего доменов, в порядке, требуют внимания, истекают ≤ 30 дн.
- **Проверка:** http://localhost:3002/domain-information

## 1.1.4s — 2026-05-26

- **Демо API:** `POST api/demo/otslezhivanie-sroka-registratsii-domenov/run` — разовая WHOIS-проверка (`DomainInformation::probe`), 5 запусков/сутки, guest cookie.
- **Маркетинг:** демо-виджет и блок «После регистрации» на http://localhost:3001/otslezhivanie-sroka-registratsii-domenov/
- **Проверка:** `curl -X POST http://127.0.0.1:3002/api/demo/otslezhivanie-sroka-registratsii-domenov/run -H 'Content-Type: application/json' -d '{"domain":"datagon.ru"}'`

## 1.1.3 — 2026-05-26

- **Тарифы:** маркетинг `/tarify/` и кабинет `/tariff` — строка «Отслеживание срока регистрации доменов: оповещения» (как у мониторинга сайтов: Free — Telegram, платные — email + Telegram).

## 1.1.2s — 2026-05-26

- **Страница добавления:** шаги 1–3 (домен → DNS → срок + запуск), навигация как у site-monitoring; подсказки про Telegram, почту и bulk.
- **Проверка:** http://localhost:3002/add-domain-information

## 1.1.1s — 2026-05-26

- **Fix:** обложка PDF — длинный заголовок «Отслеживание срока регистрации доменов» переносится на 2 строки (общий `TextAnalyzerPdfBranding::resolveCoverTitleLayout`).
- **Проверка:** скачать PDF из модалки — заголовок целиком на обложке.

## 1.1.0s — 2026-05-26

- **Таблица:** отдельные колонки **DNS** и **Срок регистрации** (в БД: `dns` и `domain_information`).
- **Fix:** ложные оповещения DNS — сравнение нормализованного набора NS (lowercase, без точки на конце, сортировка); перестановка строк не считается изменением.
- **Проверка:** http://localhost:3002/domain-information — ручная проверка домена без смены NS не шлёт Telegram/email.

## 1.0.1s — 2026-05-26

- **Fix:** 500 на списке доменов — в Blade для DataTables использовался `+` вместо `.` при склейке строк переводов.
- **Проверка:** http://localhost:3002/domain-information

## 1.0.0s — 2026-05-26

- **UI (AdminLTE 4):** таблица, тулбар, переключатели Telegram/почта, модалка истории.
- **Лог проверок:** таблица `domain_information_check_logs`, кнопка «Лог проверок» у каждого домена.
- **PDF и публичная ссылка** в модалке (как site-monitoring): 30/90/180/365/бессрочно.
- **Почта:** только платный тариф (`canReceiveDomainInformationEmail`); на Free — alert и disabled.
- **Проверка:** http://localhost:3002/domain-information (badge **v1.0.0s** в шапке).

**Миграции (прод):**

- `2026_05_26_180000_create_domain_information_check_logs_table.php`
- `2026_05_26_180100_create_domain_information_public_shares_table.php`
