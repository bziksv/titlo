# Мониторинг — сравнение бенчмарков (SER · Topvisor · Datagon v2)

**Дата:** 2026-05-27  
**Кабинет:** http://localhost:3002/monitoring-v2  
**Источники:** [cabinet-monitoring-benchmark-seranking.md](./cabinet-monitoring-benchmark-seranking.md), [cabinet-monitoring-benchmark-topvisor.md](./cabinet-monitoring-benchmark-topvisor.md)

## Уровни UX

| | SE Ranking | Topvisor | Datagon `/monitoring-v2` |
|---|------------|----------|---------------------------|
| Хаб (все проекты) | `admin.dashboard` — график + таблица | `/projects/` — таблица TOP buckets | Сводка Chart.js + таблица/плитки |
| Позиции проекта | `rankings#/detailed` | `project/dynamics/{id}/` | `/monitoring/{id}` (**3.5.0-dev:** обзор + detailed, KPI, toolbar) |
| Семантика | wizard / keywords | `project/keywords/{id}/` | ключи в проекте |
| Регионы в списке | expand child-rows | — | «Регионы и дни» (child-rows) |

## Список проектов

| Паттерн | SER | Topvisor | Datagon v2 (**3.0-dev**) |
|---------|-----|----------|---------------------------|
| Вид по умолчанию | Таблица | Таблица | **Таблица** |
| График портфеля | Мульти-метрика + период | Сводка на списке | **Один большой график** (3 режима) + 5 KPI сбоку |
| KPI в строке | TOP + дельта | TOP 10 / 30 / 100 | **Одна ячейка 10/30/100** + дельты |
| Быстрые действия | Меню ⋮ | «Проверить позиции» | **Позиции** + **Регионы** + ⋮ |
| Карточки | — | — | Hero KPI + ТОП + действия (3 колонки) |
| Группы/папки | Да | Да | Пока нет |
| Обновить список | Да | Да | **Обновить** (`refresh=1`) |

## Что не дублируем в v2

- Полная матрица ключ × дата — только внутри проекта (`/monitoring/{id}`), не на хабе.
- Аудит, AI-трекер, бэклинки — отдельные модули кабинета, не в списке v2.

## Проверка после правок

1. http://localhost:3002/monitoring-v2 — таблица по умолчанию (или сбросить `localStorage` ключ `cabinet-mon-v2-view`).
2. Карточки — полоска ТОП 10/30/100 под шапкой.
3. Дашборд — кнопки метрик на графике «Лидеры».
