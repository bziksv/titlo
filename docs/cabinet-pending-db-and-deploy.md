# Кабинет — отложенное: БД, прод, сверка с локалью

**Назначение:** один журнал того, что сделано в коде, что **ещё не** выкатили на прод, и **какие миграции** трогают общую БД.  
Новые диалоги/задачи **дописываются сюда** (новая секция или строка в таблице) — не пытаемся уместить всю историю чатов в одну модель.

**Сейчас:** работаем **в локали** (`:3002`, БД `178.250.157.140` из `.env`). Прод **cabinet.datagon.ru** — отдельный шаг по [cabinet-deploy.md](./cabinet-deploy.md).

### Мониторинг позиций — формулировка лимита — 2026-05-26

Лимит `monitoring` в `tariff_setting_values` — **число проверок в месяц** (счётчик `monitoring_limits`), не ключевых фраз. В БД: `tariff_settings.name` → «Мониторинг позиций (проверок/мес)»; Free = **50**, Optimal 20 000, Ultimate 50 000, Maximum 120 000. Маркетинг: `/tarify/`, сноска в `TariffComparison.tsx`.

### Цены платных тарифов — 2026-05-26

В `tariff_setting_values` (`code = price`, **₽/день**): Optimal **65**, Ultimate **129**, Maximum **194** (оплата за 1 календарный месяц ≈ 2 015 / 3 999 / 6 014 ₽). Маркетинг — округлённые **2 000 / 4 000 / 6 000 ₽/мес**: `lib/content/tariffs.generated.ts`, http://localhost:3001/tarify/

### Лимиты Free (SEO-модули) — 2026-05-26

На общей БД для тарифа `Free` в `tariff_setting_values` выставлено **3** для `RelevanceAnalysis`, `TextAnalyzer`, `CompetitorAnalysisPhrases` (было 10). `Clusters` для Free — **50** (было 20). Маркетинг: http://localhost:3001/tarify/ (`lib/content/tariffs.generated.ts`). **Прод:** при необходимости повторить те же `UPDATE` на `178.250.157.140` или через админку «Настройки тарифов».

**Когда спросить «что делаем с БД»** — читать этот файл целиком: §2 (миграции), §3 (удаление behavior), §4 (чеклисты).

---

## 1. Режим работы

| Среда | Статус | Примечание |
|-------|--------|------------|
| Local `:3002` | активная разработка | `cabinet.datagon.ru` + `scripts/dev-local.sh` |
| БД `178.250.157.140` | **общая** с lk / prod | любая `migrate --force` — только **по согласованию** |
| Прод `cabinet.datagon.ru` | код через `git push` → деплой | **2026-05-22:** после деплоя 500 — в `.env` на s3 был `DB_HOST=127.0.0.1` → исправить на `178.250.157.140`, `config:cache` — [cabinet-deploy.md](./cabinet-deploy.md) § Troubleshooting |

---

## 2. Миграции (журнал)

Проверка, что применено:

```bash
cd /Users/stanislav/Documents/projects/cabinet.datagon.ru
php artisan migrate:status | grep 2026_05_22
```

| Миграция | Файл | Что делает | Local (БД .env) | Prod |
|----------|------|------------|-----------------|------|
| Индекс monitoring | `2026_05_22_120000_add_created_at_index_to_monitoring_stats_table.php` | `index` на `monitoring_stats.created_at` | уточнить `migrate:status` | ⏳ |
| Удаление behavior | `2026_05_22_120000_drop_behavior_module.php` | см. §3 (только `controller` с BehaviorController) | применялась* | ⏳ |
| **Меню: behavior в main_projects** | `2026_05_22_150000_cleanup_behavior_main_projects.php` | удаляет `main_projects` с `link` `/behavior`, чистит `menu_items_position` | local ✓ | ⏳ |
| Тикеты поддержки | `2026_05_22_140000_create_support_tickets_tables.php` | `support_tickets`, `support_ticket_messages` | применялась в dev-сессии* | ⏳ |
| Telegram prompt snooze | `2026_05_22_120000_add_telegram_prompt_snoozed_until_to_users_table.php` | `users.telegram_prompt_snoozed_until` (модалка подключения бота) | local ✓ | ⏳ |
| Публичный шаринг анализа текста | `2026_05_23_200000_create_text_analyzer_public_shares_table.php` | `text_analyzer_public_shares` (token, payload JSON, 30 дней) | local ✓ | ⏳ |
| HTML-редактор: пресеты пользователя | `2026_05_25_220000_create_html_editor_presets_table.php` | `html_editor_presets` (user_id, name, html) | local ✓ | ⏳ |
| HTML-редактор: публичные ссылки | `2026_05_25_223000_create_html_editor_public_shares_table.php` | `html_editor_public_shares` (description_id, token, payload, 30 дней) | local ✓ | ⏳ |
| Мониторинг сайтов: настройки уведомлений | `2026_05_26_120000_create_site_monitoring_configs_table.php` | `site_monitoring_configs` (интервал повтора, каналы) | local ⏳ | ⏳ |
| Лог проверок мониторинга сайтов | `2026_05_26_140000_create_domain_monitoring_check_logs_table.php` | `domain_monitoring_check_logs` (история проверок, модалка на `/site-monitoring`) | local ⏳ | ⏳ |
| Free: интервал мониторинга 60 мин | `2026_05_26_150000_set_free_tariff_domain_monitoring_timing_to_60.php` | `domain_monitoring.timing = 60` для пользователей с ролью Free | local ⏳ | ⏳ |
| Мониторинг сайтов: публичные ссылки | `2026_05_26_160000_create_site_monitoring_public_shares_table.php` | `site_monitoring_public_shares` (domain_monitoring_id, token, payload) | local ⏳ | ⏳ |
| Мониторинг сайтов: срок ссылки nullable | `2026_05_26_170000_make_site_monitoring_public_shares_expires_at_nullable.php` | `expires_at` NULL = бессрочно | local ⏳ | ⏳ |
| Срок доменов: лог проверок | `2026_05_26_180000_create_domain_information_check_logs_table.php` | `domain_information_check_logs` (`/domain-information`) | local ✓ | ⏳ |
| Срок доменов: публичные ссылки | `2026_05_26_180100_create_domain_information_public_shares_table.php` | `domain_information_public_shares` | local ✓ | ⏳ |
| Мониторинг позиций v2: публичные ссылки | `2026_05_28_120000_create_monitoring_public_shares_table.php` | `monitoring_public_shares` (monitoring_project_id, token, payload JSON, TTL) | local ⏳ | ⏳ |
| **Удаление модуля чеклистов** | `2026_05_27_180000_drop_checklist_module.php` | DROP 7 таблиц (`checklist_*`, `check_lists_labels`); код `/checklist` удалён | local ✓ | ⏳ |
| **Заглушка связки мониторинг↔чеклист (legacy lk)** | `2026_06_01_120000_restore_checklist_relation_with_monitoring_stub.php` | Пустая `checklist_relation_with_monitoring` без FK — пока на **lk.redbox.su** старый `MonitoringController` | общая БД ✓ | ✓ (lk) |
| **Заглушка checklist_projects (legacy lk)** | `2026_06_01_121000_restore_checklist_projects_stub.php` | Пустая `checklist_projects` — `monitoring/show.blade.php` (модалка чеклиста) | общая БД ✓ | ✓ (lk) |
| **Меню: мониторинг v2** | `2026_05_27_190000_add_monitoring_v2_main_project_menu.php` | `main_projects` id≈38 + вставка в `menu_items_position` под id=32 | local ✓ | ⏳ |
| **Фавиконки проектов мониторинга** | `2026_05_27_230000_add_favicon_to_monitoring_projects_table.php` | `monitoring_projects.favicon_path`, `favicon_host`, `favicon_updated_at`; файлы `storage/.../monitoring-favicons/{id}.png` | local ✓ | ⏳ cutover: `monitoring:import-favicons-from-legacy --from=https://lk.redbox.su` (один раз, **без** `CABINET_STORAGE_URL` в `.env`) |
| **Настройки столбцов monitoring-v2** | `2026_05_27_231500_create_monitoring_v2_user_preferences_table.php` | `monitoring_v2_user_preferences` (`user_id`, `list_columns` JSON) | ⏳ | ⏳ |

\* В отдельных сессиях агента миграции уже гоняли на `DB_HOST` из local `.env` — **перед продом** сверить `migrate:status` на сервере и в локали.

### Удаление SEO-чеклистов (`/checklist`) — 2026-05-27

Модуль снят с кода: контроллер, views, cron (каждую минуту), кнопка «План продвижения» в мониторинге. Таблицы: `checklist_projects`, `checklist_tasks`, `checklists_stubs`, `checklist_notification`, `checklist_project_checklist_label`, `check_lists_labels`, `checklist_relation_with_monitoring`. Перед деплоем на прод — `migrate --path=.../2026_05_27_180000_drop_checklist_module.php --force`.

**На проде (после деплоя кода с `main`):** от **root**, PHP 7.4, пользователь artisan — `cabinet_data_usr`:

```bash
APP=/var/www/cabinet_data_usr/data/www/cabinet.datagon.ru
PHP=/opt/php74/bin/php

# все три разом (если в main есть все файлы):
sudo -u cabinet_data_usr $PHP "$APP/artisan" migrate --force

# или по одной:
sudo -u cabinet_data_usr $PHP "$APP/artisan" migrate --path=database/migrations/2026_05_22_120000_drop_behavior_module.php --force
sudo -u cabinet_data_usr $PHP "$APP/artisan" migrate --path=database/migrations/2026_05_22_150000_cleanup_behavior_main_projects.php --force
sudo -u cabinet_data_usr $PHP "$APP/artisan" migrate --path=database/migrations/2026_05_22_140000_create_support_tickets_tables.php --force
sudo -u cabinet_data_usr $PHP "$APP/artisan" migrate --path=database/migrations/2026_05_22_120000_add_created_at_index_to_monitoring_stats_table.php --force
```

`migrate:status` на проде — обязательно **до** и **после**.

---

## 3. Удаление модуля «Управление репутацией / накрутка поведенческих»

### Код (в git, локаль)

- Удалены маршруты `/behavior`, `public/behavior/*`, контроллер, модели, views, `prime.visit.js`.
- `SupportAccess` / лимиты: case `behavior` убран из `LimitsComposer`.
- Документация: [cabinet-reference.md](./cabinet-reference.md) (маршрут `behavior` убран из таблицы).

### БД (миграции behavior)

**Удаляет данные без отката** (`down()` пустой).

**Первая** — `drop_behavior_module`: таблицы, тариф, permission, `main_projects` только если в `controller` есть `BehaviorController`.

**Важно:** в БД пункт меню часто с **`controller = null`** и `link` вида `…/behavior`, `title` = «Behavioral factors management» — он **не попадал** в первую миграцию. Поэтому вторая:

**Вторая** — `cleanup_behavior_main_projects`: удаляет `main_projects` по `link`/`title`, чистит JSON в `menu_items_position` от id удалённого модуля.

| Объект | Действие |
|--------|----------|
| `behaviors`, `behaviors_phrases` | `DROP TABLE` |
| `tariff_settings` где `code = behavior` | DELETE + связанные значения |
| permission `Behavior` | DELETE |
| `main_projects` (behavior) | DELETE + `visit_statistics` |
| `menu_items_position` | убрать id модуля из сохранённого порядка меню |

### Проверка после миграции (local или prod)

| Проверка | Ожидание |
|----------|----------|
| http://localhost:3002/behavior | **404** |
| Главная кабинета | нет плитки модуля в меню |
| http://localhost:3002/tariff | нет строки лимита «репутация / поведенческие» в сравнении тарифов |
| `SELECT COUNT(*) FROM behaviors` | ошибка «table doesn't exist» или 0 до drop |

---

## 4. Функции в коде (без отдельной миграции или с миграцией)

Краткий список для сверки «что уже в main» — детали UI в [cabinet-reference.md](./cabinet-reference.md).

| Тема | Local | Prod | БД |
|------|-------|------|-----|
| AdminLTE 4 / BS5, sidebar collapse | ✓ | по деплою | — |
| Баланс `/balance` (виджеты, история 10+пагинация) | ✓ | по деплою | — |
| Тарифы `/tariff`, названия RU | ✓ | по деплою | — |
| Тикеты `/support` | ✓ | по деплою | §2 `create_support_tickets_tables` |
| Удаление behavior | ✓ | по деплою | §3 |
| Маркетинг `tariffs.generated.ts` — убраны строки репутации | datagon.ru | отдельный деплой :3001 | — |

---

## 5. Прод: деплой кода (без миграций)

См. [cabinet-deploy.md](./cabinet-deploy.md) — блок **от `root@s3`**, не `cabinet_data_usr` (права на `.git` / `vendor`).

После `git pull` / `composer`:

```bash
sudo -u cabinet_data_usr $PHP "$APP/artisan" config:cache
sudo -u cabinet_data_usr $PHP "$APP/artisan" route:cache
sudo -u cabinet_data_usr $PHP "$APP/artisan" view:cache
curl -sI https://cabinet.datagon.ru/login | head -5
```

Миграции — **не** в том же breath без явного решения (§2).

---

## 6. Локальная проверка (чеклист)

```bash
cd /Users/stanislav/Documents/projects/cabinet.datagon.ru
bash scripts/dev-local.sh detach
php artisan migrate:status
```

| URL | Что смотреть |
|-----|----------------|
| http://localhost:3002/balance | info-box, история, пополнение |
| http://localhost:3002/tariff | карточки RU, без репутации |
| http://localhost:3002/support | inbox, новый тикет |
| http://localhost:3002/behavior | 404 |
| http://localhost:3002/configuration-menu | только сортировка меню (без дампа маршрутов) |
| Свёрнутое меню | только аватар, без налезания на контент |

---

## 7. Новые задачи (дописывать сюда)

Формат для следующих диалогов:

```markdown
### YYYY-MM-DD — краткое название
- **Код:** …
- **Миграция:** `database/migrations/….php` или «нет»
- **БД риск:** низкий / средний / высокий (общая БД)
- **Local:** сделано / в работе
- **Prod:** ⏳
- **Проверка:** URL или команда
```

---

## 8. Связанные документы

| Документ | Зачем |
|----------|--------|
| [cabinet-deploy.md](./cabinet-deploy.md) | git, composer, права root vs cabinet_data_usr |
| [cabinet-reference.md](./cabinet-reference.md) | роуты, UI-эталоны, troubleshooting |
| [cabinet-servers.md](./cabinet-servers.md) | IP, БД, порты |
| [cabinet-agent-map.md](./cabinet-agent-map.md) | куда класть новые записи в docs |
