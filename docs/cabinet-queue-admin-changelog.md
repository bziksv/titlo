# Кабинет — управление очередями (changelog)

**Модуль:** `/admin/queues`  
**Config:** `cabinet.datagon.ru/config/cabinet-queue-admin.php`  
**Версия:** `1.0.3s`

## 1.0.3s — 2026-05-30

- Статус **«Брошено»** (0 / ?, старт 2022–2023): сессия так и не собрала фразы; не «Идёт».
- Готовые кластеры (`cluster_results`) **убраны** из таблицы.
- «Очистить мусор» — все dead-сессии (мусор + брошенные + зависшие без jobs).

## 1.0.2s — 2026-05-30

- Кластеры: статус **«Мусор»** (orphan) — фразы 447/447, но нет `cluster_results` и jobs; раньше ошибочно «Идёт».
- Пояснение, почему пользователь «—»; кнопка **Очистить мусор** (bulk delete `cluster_queue_array`).

## 1.0.1s — 2026-05-30

- Исправлен запрос к `monitoring_projects`: колонка **`url`**, не `host` (страница падала с 42S22).
- **`failed_jobs`:** без колонки `uuid` (старый Laravel) — выборка `id`, `connection`, `queue`, `failed_at`, `exception`.
- Blade: confirm в формах через `@php`/`{!! json_encode() !!}` (без `@json` + `substr(..., 8)` — ломало компилятор).

## 1.0.0s — 2026-05-30

- Пункт **«Управление очередями»** в меню шестерёнки (`CabinetAdminMenu`).
- Сводка: jobs по очередям (total / reserved / age), зависшие кластеры, backlog `monitoring_helper`, активные отчёты «Динамика конкурентов», недавние `failed_jobs`.
- Действия: обновить снимок, **очистить очередь** (whitelist), **отменить кластер** (удаляет `cluster_wait` / `child_cluster` jobs и строки `cluster_queue_array`), **отменить отчёт** динамики.
- Фильтры: всё / очереди warn+ / зависшие кластеры / running / reserved.

### Проверка

1. Admin → шестерёнка → **Управление очередями**.
2. http://localhost:3002/admin/queues — badge **v1.0.0s**, карточки и таблицы.
3. Зависший кластер gorexpert — кнопка **Отменить** (progress `66042078…`).

### Связанные правки кластера (v2.37)

- `WaitClusterAnalyseQueue`: abort при простое > `wait_stale_minutes` (30) или общем ожидании > `wait_max_hours` (6).
- Poll UI `/cluster` показывает ошибку вместо бесконечного ожидания.
