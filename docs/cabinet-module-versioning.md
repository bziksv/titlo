# Кабинет — реестр версий модулей

Правило для агентов: `.cursor/rules/redbox-cabinet-module-version.mdc`.

При изменении UI/JS/поведения страницы модуля — **bump `version`**, строка в **changelog**, **badge** в шапке. Суффикс **`s`** (как `2.9.1s`, `6.9s`) — зафиксированная stable-линия; следующие правки — +0.1 или `-dev`.

## Реестр

| Модуль | URI | Config | Changelog | Badge |
|--------|-----|--------|-----------|-------|
| Анализ текста | `/text-analyzer` | `cabinet.datagon.ru/config/cabinet-text-analyzer.php` | [cabinet-text-analyzer-changelog.md](./cabinet-text-analyzer-changelog.md) | шапка карточки |
| Анализ конкурентов | `/competitor-analysis` | `config/cabinet-competitor-analysis.php` | [cabinet-competitor-analysis-changelog.md](./cabinet-competitor-analysis-changelog.md) | шапка карточки (`vX.Ys` = stable) |
| Доска идей | `/ideas` | `config/cabinet-ideas.php` | [cabinet-ideas-changelog.md](./cabinet-ideas-changelog.md) | hero / заголовок |
| Служба поддержки | `/support` | `config/cabinet-support.php` | [cabinet-support-changelog.md](./cabinet-support-changelog.md) | `support/layout` |
| Кластеризатор | `/cluster`, `/show-cluster-result/{id}`, `/edit-clusters/{id}` | `config/cabinet-cluster.php` | [cabinet-cluster-changelog.md](./cabinet-cluster-changelog.md) | шапка карточки |
| Удаление дубликатов | `/duplicates` | `config/cabinet-duplicates.php` | [cabinet-duplicates-changelog.md](./cabinet-duplicates-changelog.md) | шапка карточки |
| Сравнение списков | `/list-comparison` | `config/cabinet-list-comparison.php` | [cabinet-list-comparison-changelog.md](./cabinet-list-comparison-changelog.md) | шапка карточки |
| Уникальные слова | `/unique` | `config/cabinet-unique.php` | [cabinet-unique-changelog.md](./cabinet-unique-changelog.md) | шапка карточки (**v1.1s**) |
| Подсчёт длины текста | `/counting-text-length` | `config/cabinet-text-length.php` | [cabinet-text-length-changelog.md](./cabinet-text-length-changelog.md) | шапка карточки (**v1.0s**) |
| Генератор паролей | `/password-generator` | `config/cabinet-password-generator.php` | [cabinet-password-generator-changelog.md](./cabinet-password-generator-changelog.md) | шапка карточки (**v1.0**) |
| Генератор слов | `/keyword-generator` | `config/cabinet-keyword-generator.php` | [cabinet-keyword-generator-changelog.md](./cabinet-keyword-generator-changelog.md) | шапка карточки (**v1.6.1**) |
| HTML-редактор | `/html-editor` | `config/cabinet-html-editor.php` | [cabinet-html-editor-changelog.md](./cabinet-html-editor-changelog.md) | шапка карточки (**v1.5.4s**) |
| Мониторинг позиций (UI v2) | `/monitoring-v2` | `config/cabinet-monitoring.php` | [cabinet-monitoring-changelog.md](./cabinet-monitoring-changelog.md) | шапка (**v2.0-dev**) |
| Мониторинг сайтов | `/site-monitoring` | `config/cabinet-site-monitoring.php` | [cabinet-site-monitoring-changelog.md](./cabinet-site-monitoring-changelog.md) | шапка карточки (**v1.6.9s**) |
| Срок регистрации доменов | `/domain-information` | `config/cabinet-domain-information.php` | [cabinet-domain-information-changelog.md](./cabinet-domain-information-changelog.md) | шапка карточки (**v1.0.0s**) |
| Мониторинг мета-тегов | `/meta-tags` | `config/cabinet-meta-tags.php` | [cabinet-meta-tags-changelog.md](./cabinet-meta-tags-changelog.md) | шапка карточки (**v1.2.17s**) |
| HTTP-заголовки | `/http-headers` | `config/cabinet-http-headers.php` | [cabinet-http-headers-changelog.md](./cabinet-http-headers-changelog.md) | шапка карточки (**v1.0.0s**) |
| UTM-метки | `/utm-marks` | `config/cabinet-utm-marks.php` | [cabinet-utm-marks-changelog.md](./cabinet-utm-marks-changelog.md) | шапка карточки (**v1.0.1s**) |
| Калькулятор ROI | `/roi-calculator` | `config/cabinet-roi-calculator.php` | [cabinet-roi-calculator-changelog.md](./cabinet-roi-calculator-changelog.md) | шапка карточки (**v1.1**) |
| Управление прокси Telegram (админ) | `/admin/telegram-proxy` | `config/cabinet-telegram-proxy.php` | [cabinet-telegram-proxy-changelog.md](./cabinet-telegram-proxy-changelog.md) | заголовок (**v1.1.2s**) |
| Управление рассылками (админ) | `/admin/notifications` | `config/cabinet-notifications-admin.php` | [cabinet-notifications-admin-changelog.md](./cabinet-notifications-admin-changelog.md) | заголовок (**v1.2.1s**) |
| Пользователи (админ) | `/users` | `config/cabinet-users.php` | [cabinet-users-changelog.md](./cabinet-users-changelog.md) | заголовок (**v1.2.2s**) |
| Управление меню (админ) | `/main-projects` | `config/cabinet-main-projects.php` | [cabinet-main-projects-changelog.md](./cabinet-main-projects-changelog.md) | заголовок (**v1.0.0s**) |
| Управление доступами (админ) | `/manage-access` | `config/cabinet-manage-access.php` | [cabinet-manage-access-changelog.md](./cabinet-manage-access-changelog.md) | заголовок (**v1.0.0s**) |
| Управление политиками (админ) | `/edit-policy-files` | `config/cabinet-policy-files.php` | [cabinet-policy-files-changelog.md](./cabinet-policy-files-changelog.md) | card-title (**v1.0.0s**) |
| Тарифы и ограничения (админ) | `/tariff-settings` | `config/cabinet-tariff-settings.php` | [cabinet-tariff-settings-changelog.md](./cabinet-tariff-settings-changelog.md) | заголовок (**v1.0.0s**) |
| Управление XML (админ) | `/admin/xml-providers` | `config/cabinet-xml-providers.php` | [cabinet-xml-providers-changelog.md](./cabinet-xml-providers-changelog.md) | заголовок (**v1.0.0s**) |
| Управление БД (админ) | `/admin/database` | `config/cabinet-database-admin.php` | [cabinet-database-admin-changelog.md](./cabinet-database-admin-changelog.md) | заголовок (**v1.1.3s**) |
| Управление очередями (админ) | `/admin/queues` | `config/cabinet-queue-admin.php` | [cabinet-queue-admin-changelog.md](./cabinet-queue-admin-changelog.md) | заголовок (**v1.0.0s**) |

**Не версионируем:** «Шаблон LTE» (`/html/`, демо AdminLTE) — статический каталог, не продуктовая страница кабинета.

Пункты **шестерёнки** (`CabinetAdminMenu`) и прочие `/admin/…` — тот же цикл: `config/cabinet-<slug>.php`, changelog, badge в шапке.

## Шаблон нового модуля

1. `cabinet.datagon.ru/config/cabinet-<slug>.php`:

```php
<?php
return [
    'version' => '1.0',
];
```

2. `datagon.ru/docs/cabinet-<slug>-changelog.md` — первая запись с датой и URL проверки.

3. Blade (рядом с заголовком модуля):

```blade
<span class="badge text-bg-secondary ms-1 align-middle">v{{ config('cabinet-<slug>.version', '1.0') }}</span>
```

4. Строка в таблице выше.

## Формат changelog

```markdown
## 1.1 — 2026-05-24

- Что изменено (1–3 пункта).
- **Проверка:** http://localhost:3002/…
```
