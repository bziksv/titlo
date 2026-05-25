# Кластеризатор — журнал версий

Config: `cabinet.datagon.ru/config/cabinet-cluster.php`  
Проверка: http://localhost:3002/cluster-v2 (новый UI), http://localhost:3002/cluster (classic)

## 2.16 — 2026-05-25

- **Частотность (fix):** `RiverFacade` переведён на XMLRiver **Wordstat New** (`/wordstat/new/json`, `pagetype=history`, `totalValue`); старый `/wordstat/json` отдавал code 101 «Сбор старого вордстата больше не доступен» → нули при включённых галочках.
- **Таблица v2:** скрыты служебные колонки `#`/`##`, подсказка если частотность снова нулевая; в debug-log — флаги частотности и значения `based/phrased/target` на фразу.
- **Проверка:** http://localhost:3002/cluster-v2 — пресет KAWE, все галочки частотности → в таблице ненулевые «Базовая»/«Фразовая»/«!Точная», badge **v2.16**.

## 2.15 — 2026-05-25

- **Fix (admin):** лог и прогресс не появлялись после «Анализировать» — `TypeError` при `lines = lines.concat(...)` в strict mode; прогресс-бар перенесён в панель запуска (шаг 3).
- **Проверка:** http://localhost:3002/cluster-v2 — запуск под admin → прогресс над кнопкой, лог с server/browser строками, Poll ≥ 1, badge **v2.15**.

## 2.14 — 2026-05-25

- **Пресет KAWE (admin):** кнопка «Пресет KAWE» на шаге 1 — 61 фраза, домен `kawe.su`, все виды частотности, релевантность, сохранение и Telegram; данные в `resources/data/cluster-v2-preset-kawe.txt`, config `cabinet-cluster.presets.kawe`.
- **Проверка:** http://localhost:3002/cluster-v2 под admin → «Пресет KAWE», badge **v2.14**.

## 2.13 — 2026-05-25

- **Таблица результатов v2:** карточка AdminLTE (заголовок, CSV/XLS, счётчик кластеров/фраз), компактная колонка действий, стили nested-таблицы, релевантность, tooltips; без правок legacy `render-result-table_v2.js`.
- **Проверка:** http://localhost:3002/cluster-v2 — запуск анализа → блок «Таблица кластеров» с прокруткой и chip-кнопками копирования, badge **v2.13**.

## 2.12 — 2026-05-25

- **Admin debug log:** расширенный лог прогресса для админов — как `/competitor-analysis` (панель, Copy/Clear, server + browser); `ClusterAnalysisDebugLog`, config `debug_log`.
- **Проверка:** http://localhost:3002/cluster-v2 под admin — запуск анализа → панель «Расширенный лог прогресса», badge **v2.12**.

## 2.11 — 2026-05-25

- **Домен:** автонормализация — `site.ru`, `http://…`, `https://…` приводятся к `https://…` (blur + перед запуском + на API).
- **Проверка:** http://localhost:3002/cluster-v2 — ввести `site.ru`, убрать фокус → `https://site.ru`, badge **v2.11**.

## 2.10 — 2026-05-25

- **Регион (fix):** убран `keyword-generator/style.css` — он ставил `.select2-dropdown { z-index: 1 }` и ломал клик/выбор; Select2 как в competitor-analysis (`dropdownParent: body`, defaults после загрузки).
- **Проверка:** http://localhost:3002/cluster-v2 — клик по региону → поиск → выбор города, badge **v2.10**.

## 2.9 — 2026-05-25

- **Релевантность:** убран выбор поисковой системы — подбор страницы всегда через **Яндекс**; подсказка под чекбоксом.
- **Проверка:** http://localhost:3002/cluster-v2 — badge **v2.9**, блок «Релевантность и домен» без Google.

## 2.8 — 2026-05-25

- **Регион:** Select2 с темой bootstrap4, стили как в competitor-analysis; в поле — название («Москва»), в списке — «Москва [213]»; убран конфликт `form-select` + `overflow:hidden`.
- **Проверка:** http://localhost:3002/cluster-v2 — badge **v2.8**.

## 2.7 — 2026-05-25

- **Регион:** Select2 с поиском по полному справочнику Yandex LR (`GET /cluster-v2/regions`), подписи вида «Москва [213]» — как в `/competitor-analysis`.
- **Проверка:** http://localhost:3002/cluster-v2 — клик по региону, поиск «Санкт», badge **v2.7**.

## 2.6 — 2026-05-25

- **Шаг 3:** аккордеон заменён на **три всегда видимые секции** (частотность, релевантность, сохранение) — без «открытого» только «Сохранение» и без скрытых опций.
- **Проверка:** http://localhost:3002/cluster-v2 — badge **v2.6**, все три блока развёрнуты.

## 2.5 — 2026-05-25

- **`/cluster-v2`:** форма разбита на **шаги 1–2–3** — фразы → регион/режим/Pro → опции + панель запуска; навигация сверху; partial `step-head.blade.php`.
- **Проверка:** http://localhost:3002/cluster-v2 — badge **v2.5**, три блока с номерами шагов.

## 2.4 — 2026-05-25

- **Telegram:** поле «Уведомить в телеграме» всегда видно; при выборе **Да** — проверка подписки (`GET /cluster-telegram-status`), предупреждение + ссылка на профиль; повторная проверка перед запуском; 422 на API если бот не подключён.
- **Проверка:** http://localhost:3002/cluster-v2 — «Да» без Telegram → сброс на «Нет» и alert.

## 2.3 — 2026-05-25

- **`/cluster-v2`:** реальный новый UX (не копия `/cluster`): фразы первым блоком; регион + уровень в одной строке; редкие опции в **аккордеоне** (Pro / частотность / релевантность / сохранение); справа **панель запуска** — режим, множитель лимитов, чипы опций, CTA; прогресс-бар; одна форма для Classic+Pro (без дубля DOM как в legacy).
- **Проверка:** http://localhost:3002/cluster-v2 — badge **v2.3**.

## 2.2 — 2026-05-25

- **`/cluster-v2`:** упрощённый UI как у `/cluster` — одна колонка (max 42rem), переключатель Classic/Pro кнопками, лимиты рядом с «Анализировать», без карточек/summary sidebar; подсказки `?` у уровня кластеризации и сохранения.
- **Проверка:** http://localhost:3002/cluster-v2 — badge **v2.2**.

## 2.1 — 2026-05-25

- **`/cluster-v2`:** русские подписи — переводы в `ru.json` (intro, карточки режимов, summary, прогресс, toast); уровни кластеризации с процентами как в config.
- **Проверка:** http://localhost:3002/cluster-v2 — интерфейс на русском, badge **v2.1**.

## 2.0 — 2026-05-25

- **`/cluster-v2`:** новый интерфейс анализатора — карточки Classic/Pro, секции формы, sticky summary с расчётом лимитов, прогресс и таблица результатов (те же API и `render-result-table_v2`).
- Assets: `public/css/cabinet-cluster-v2.css`, `public/js/cabinet-cluster-v2.js`, `resources/views/cluster-v2/`.
- Legacy `/cluster` сохранён; в nav — ссылка «Analyzer v2».
- **Проверка:** http://localhost:3002/cluster-v2 — режимы, запуск (dry: фразы + регион), badge `v2.0`.

## 1.2 — 2026-05-25

- **`/cluster-projects`:** карточка со списком, компактная таблица (sm textarea, badge режима), действия — primary + icon group; empty state; модал «Повторить» — `modal-lg`, footer BS5.
- **Проверка:** http://localhost:3002/cluster-projects

## 1.1 — 2026-05-25

- **`/cluster-configuration`:** layout как у `/competitors-config` — формы слева (Pro / Classic / автоудаление), справа KPI: анализы за месяц + уникальные user_id за 30/60/90 дн. (`ClusterResults`).
- BS5: `form-label`, `info-box`, карточки `card-outline`, кнопки сохранения `btn-primary`.
- **Проверка:** http://localhost:3002/cluster-configuration (admin).

## 1.0 — 2026-05-25

- Вёрстка модуля на **AdminLTE 4 / BS5**: общий `cabinet-cluster.css`, nav-partial без вложенной LTE3-карточки, `form-label` / `mb-3`, `btn-close`, `btn-outline-secondary`.
- Badge версии в шапке карточки (`v1.0`).
- **Проверка:** http://localhost:3002/cluster — вкладки «Анализатор / Мои проекты», Classic/Pro, форма и модалка URL.
