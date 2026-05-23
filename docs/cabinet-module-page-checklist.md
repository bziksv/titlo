# Новая/переделка страницы кабинета — чек-лист (~1.5 ч, без ping-pong)

Цель: **не повторить** историю анализа текста (jQCloud ↔ DataTables ↔ CSS-toggle, 40 микро-версий).

Эталон UI: http://localhost:3002/html/ → [cabinet-reference.md](./cabinet-reference.md) § «Эталон UI».

---

## 0. До кода (15 мин)

- [ ] **Definition of done** одним абзацем: что видит пользователь, что должно работать после F5, что **не** делаем (нет плагин-X).
- [ ] Открыть **`/html/`** — найти демо: форма (`forms/`), таблица (`tables/`), карточки (`widgets/`), switch (`forms/`).
- [ ] Найти **готовую страницу кабинета** с похожей задачей (баланс, профиль, support) — копировать паттерн, не изобретать.
- [ ] Зафиксировать **запреты v1.0**:
  - ❌ jQCloud, DataTables (core/responsive/buttons), ResizeObserver на тяжёлых блоках
  - ❌ `custom-control custom-switch` (LTE3) — только если осознанно + уже есть рабочий compat
  - ✅ нативная таблица + scroll + client search; облако — свой лёгкий JS/CSS; UI — BS5 из `/html/`

---

## 1. Разметка (20 мин)

- [ ] Blade в `resources/views/…`, layout уже **LTE4** (`component.card` или эталон модуля).
- [ ] **Toggle / switch** — разметка с http://localhost:3002/html/ (Bootstrap 5 `form-check form-switch`), не копировать из старого LK.
- [ ] **Таблицы** — `<table class="table">` + обёртка `.table-responsive` / фикс. `max-height` + overflow; поиск — `<input class="form-control form-control-sm">` + filter в JS.
- [ ] **KPI** — `info-box` из `/html/widgets/info-box.html` (см. баланс, анализ текста v3.9+).
- [ ] Иконки только из **Bootstrap Icons 1.13.1** (проверить класс в `public/html/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.css`).

---

## 2. JS (25 мин)

- [ ] Один файл `public/js/cabinet-<module>.js`, без 500+ строк inline в Blade.
- [ ] **Облако слов**: спираль/tag-cloud на чистом DOM (O(n), лимит ~100 слов), без jQCloud.
- [ ] **Chart.js** — `animation: false`, без бесконечных observers.
- [ ] Данные для клиента — **JSON в `<script type="application/json" id="…">`**, не сотни скрытых div в DOM.
- [ ] Нет `setInterval(refreshAllMethods, 500)` и подобного — только делегирование событий.

---

## 3. Бэкенд и session (15 мин)

- [ ] POST → redirect → GET (PRG); flash для одноразового показа результата.
- [ ] Export/snapshot — отдельно от flash, явный контракт (как `text_analyzer.export_snapshot`).
- [ ] PHP **7.4** — без union types в сигнатурах контроллера.
- [ ] KPI и таблицы считаются из **одного и того же** отфильтрованного текста (один проход).

---

## 4. Smoke до «красоты» (15 мин)

- [ ] `bash scripts/dev-local.sh detach` → `/login` **200**.
- [ ] Скрипт или php smoke: POST анализа → GET страницы → нет `jquery.dataTables`, нет `jqcloud` в HTML.
- [ ] **Dealmed или тяжёлый URL**: страница **кликабельна** через 3 с, F5 — форма без залипшего результата (если так задумано).
- [ ] Playwright опционально; минимум — php smoke + ручной клик по toggle/табам.

---

## 5. Только потом — polish (остаток)

- [ ] CSS в `public/css/cabinet-<module>.css`, scope `.cabinet-<module>-page`.
- [ ] Badge версии в config + строка в changelog (если модуль версионируется).
- [ ] Переводы в `resources/lang/ru.json`.
- [ ] **Не** менять три вещи по кругу: если toggle ок — не трогать; если облако ок — не возвращать jQCloud.

---

## Антипаттерны (красный флаг)

| Симптом | Стоп | Делать |
|--------|------|--------|
| «Снова поставим jQCloud, но с delayedMode» | Стоп | Свой cloud или только tag-list |
| DataTables «только для пагинации» | Стоп | Scroll + search |
| Toggle «поправим margin в CSS» 3+ раза | Стоп | Перенести разметку из `/html/` |
| v1.7, v1.8… v4.2 за день | Стоп | Выполнить чек-лист §0–§4, потом v1.0 |

---

## Референсы в репо

| Задача | Смотреть |
|--------|----------|
| LTE4 форма + KPI | `cabinet.datagon.ru` — text-analyzer v4.2, balance, profile |
| Таблица без DataTables | `text-analyse/partials/results.blade.php`, `cabinet-text-analyzer.js` |
| Облако | `paintSpiralCloud()` в `cabinet-text-analyzer.js` |
| Smoke | `scripts/smoke-text-analyzer.sh` |
| Журнал «как не надо» | [cabinet-text-analyzer-changelog.md](./cabinet-text-analyzer-changelog.md) |
