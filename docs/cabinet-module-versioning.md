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
| Кластеризатор | `/cluster`, `/cluster-v2` | `config/cabinet-cluster.php` | [cabinet-cluster-changelog.md](./cabinet-cluster-changelog.md) | шапка карточки |
| Удаление дубликатов | `/duplicates` | `config/cabinet-duplicates.php` | [cabinet-duplicates-changelog.md](./cabinet-duplicates-changelog.md) | шапка карточки |
| Сравнение списков | `/list-comparison` | `config/cabinet-list-comparison.php` | [cabinet-list-comparison-changelog.md](./cabinet-list-comparison-changelog.md) | шапка карточки |
| Уникальные слова | `/unique` | `config/cabinet-unique.php` | [cabinet-unique-changelog.md](./cabinet-unique-changelog.md) | шапка карточки (**v1.1s**) |
| Подсчёт длины текста | `/counting-text-length` | `config/cabinet-text-length.php` | [cabinet-text-length-changelog.md](./cabinet-text-length-changelog.md) | шапка карточки (**v1.0s**) |
| HTML-редактор | `/html-editor` | `config/cabinet-html-editor.php` | [cabinet-html-editor-changelog.md](./cabinet-html-editor-changelog.md) | шапка карточки (**v1.5.3s**) |

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
