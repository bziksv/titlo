# Кластеризатор — журнал версий

Config: `cabinet.datagon.ru/config/cabinet-cluster.php`  
Проверка: http://localhost:3002/cluster · `/show-cluster-result/{id}` · `/edit-clusters/{id}` · badge в шапке

## 2.37 — 2026-05-30

- **Защита от вечного `cluster_wait`:** если нет новых строк в `cluster_queue_array` дольше **30 мин** (`CLUSTER_WAIT_STALE_MINUTES`) или анализ идёт дольше **6 ч** (`CLUSTER_WAIT_MAX_HOURS`) — wait job останавливается, прогресс помечается failed, poll UI показывает ошибку.
- **Админ:** `/admin/queues` — отмена зависшей кластеризации одной кнопкой.
- **Проверка:** http://localhost:3002/admin/queues , http://localhost:3002/cluster — badge **v2.37**.

## 2.36 — 2026-05-26

- **Telegram:** плашка «Без Телеграм оповещения не придут» вверху `/cluster`, если бот не подключён (рядом с чекбоксом уведомления по завершении).
- **Проверка:** http://localhost:3002/cluster, badge **v2.36**.

## 2.35 — 2026-05-26

- **Отступы по краям:** горизонтальный padding у шапки и тела шагов (`--clv2-step-pad-x`), чуть больше поля у обёртки страницы на десктопе; степпер не «липнет» к границе карточки.
- **Проверка:** http://localhost:3002/cluster (жёсткое обновление CSS), badge **v2.35**.

## 2.34 — 2026-05-26

- Кнопка пресета на шаге 1: **Пресет Демо** (ранее «Пресет KAWE»); toast «Пресет Демо применён».
- **Проверка:** http://localhost:3002/cluster (admin), badge **v2.34**.

## 2.33 — 2026-05-26

- **Выравнивание `/cluster`:** единый отступ страницы (без двойного padding card-body), вкладки и шаги по одной вертикали, степпер на всю ширину, тулбар фраз без «разъезда» по краям, дублирующий круг «1» в шаге скрыт при степпере.
- **Проверка:** http://localhost:3002/cluster (жёсткое обновление CSS), badge **v2.33**.

## 2.32 — 2026-05-26

- **Один URL:** анализатор → `/cluster` (описание/видео модуля на path `cluster` в БД не трогаем). Редиректы 301: `/cluster-v2`, `/show-cluster-result-v2/*`, `/edit-clusters-v2/*`.
- **Просмотр и редактор** — на `/show-cluster-result/{id}` и `/edit-clusters/{id}` (новый UI). В меню без бейджей «v2»; версия только в badge модуля (**v2.32**).
- **Проверка:** http://localhost:3002/cluster , http://localhost:3002/show-cluster-result/917 , http://localhost:3002/edit-clusters/917 .

## 2.31 — 2026-05-26

- **Просмотр проекта v2:** карточки кластеров, заголовок группы, один URL на группу (rowspan), компактная панель копирования/конкурентов, зебра строк, липкая шапка таблицы.
- **Проверка:** `/show-cluster-result-v2/{id}`, badge **v2.31**.

## 2.30 — 2026-05-26

- **Удалено:** `/cluster-v2/projects` (ошибочный список карточек).
- **Проект v2:** `/show-cluster-result-v2/{id}` — тот же отчёт, UI как у анализатора v2 (сводка, скролл таблицы). Старый `/show-cluster-result/{id}` редиректит на v2; classic — `?classic=1`.
- **Проверка:** http://localhost:3002/show-cluster-result-v2/917, badge **v2.30**.

## 2.29 — 2026-05-26

- **Навигация:** страницы результата и редактора v1 используют общий `module-nav` — в меню видны **Анализатор v2** и **Проекты v2**.
- **Проверка:** `/show-cluster-result/{id}` → вкладка «Проекты v2», http://localhost:3002/cluster-v2/projects.

## 2.28 — 2026-05-25

- **Меню:** «Мой проект» / «Мои проекты» → **Проект** / **Проекты** (кластеризатор).
- **Проекты v2:** `/cluster-v2/projects` — карточки, поиск, автосохранение комментария/домена; «Повторить» открывает анализатор v2 с подстановкой параметров (`?from_project=`).
- **Проверка:** http://localhost:3002/cluster-v2/projects, badge **v2.28**.

## 2.27 — 2026-05-25

- **Демо на datagon.ru:** `POST /api/demo/klasterizator-klyuchevykh-slov/run|poll` — до 10 фраз, classic Soft/Light, без Wordstat; jobs в очереди кластера, `demo=true` без списания лимитов.
- **Проверка:** `php scripts/verify-cluster-demo.php`, лендинг http://localhost:3001/klasterizator-klyuchevykh-slov/, badge **v2.27**.

## 2.26 — 2026-05-25

- **Редактор v2 (fix DnD):** при перетаскивании фраз — зеркало-клон вместо `position:absolute` на `<tr>`; исчезли смещения таблицы и большие синие «дыры» между группами.
- **Проверка:** `/edit-clusters-v2/915` — drag за ⋮⋮, placeholder по высоте строки, badge **v2.26**.

## 2.25 — 2026-05-25

- **Редактор v2:** drag-and-drop фраз за ⋮⋮ на группу в sidebar слева (подсветка цели при наведении).
- **Проверка:** `/edit-clusters-v2/915` — перетащить фразу на название кластера в «Группы», badge **v2.25**.

## 2.24 — 2026-05-25

- **Редактор v2:** боковая панель «Группы» — sticky при прокрутке (как рабочая область в v1), список групп с внутренним скроллом.
- **Проверка:** `/edit-clusters-v2/915` — прокрутить таблицы вниз, sidebar «Группы» остаётся на экране, badge **v2.24**.

## 2.23 — 2026-05-25

- **Редактор v2:** боковая панель «Группы» (как v1) — оглавление, релевантность, чекбоксы + «Объединить выбранные»; drag-and-drop фраз за ⋮⋮ между группами.
- **Проверка:** `/edit-clusters-v2/915` — sidebar, перетаскивание, merge 2+ групп, badge **v2.23**.

## 2.22 — 2026-05-25

- **Нейминг:** ручное редактирование — **v1** (`/edit-clusters/`, classic) и **v2** (`/edit-clusters-v2/`); в навигации и «Мои проекты» две кнопки с подсказками.
- **Проверка:** вкладки и title карточки, badge **v2.22**.

## 2.21 — 2026-05-25

- **Редактор v2:** Select2 на «Переместить в…» — поиск по вводу в выпадающем списке; верхний поиск фильтрует фразы/кластеры/URL по `input`, счётчик «Найдено: N».
- **Проверка:** `/edit-clusters-v2/915` — в select начать вводить название кластера; в шапке — фильтр таблицы, badge **v2.21**.

## 2.20 — 2026-05-25

- **Ручное редактирование v2:** `/edit-clusters-v2/{id}` — таблицы по кластерам, перемещение фраз через `<select>` (без «рабочей области» и стрелок). Переименование группы в шапке карточки. Классический `/edit-clusters/` сохранён.
- **Проверка:** http://localhost:3002/edit-clusters-v2/915 — выбрать другой кластер в списке → toast + перезагрузка, badge **v2.20**.

## 2.19 — 2026-05-25

- **Прогресс (fix):** `queue_count=0` при ожидании воркера — jobs уже в `local_child_cluster`, но фраза ещё не обработана. `ClusterProgress`: `phrases_done/pending/total`, UI «Ожидание воркера N / 61».
- **Dev:** 4 параллельных queue worker (`CLUSTER_QUEUE_WORKERS`, default 4) — один воркер ~25 с/фраза → 61 фраза ~25 мин.
- **Проверка:** debug-log `phrases_pending>0`, прогресс-бар не застревает на 0, badge **v2.19**.

## 2.18 — 2026-05-25

- **Частотность (fix local):** при `APP_ENV=local` jobs уходят в очереди `local_main_cluster`, `local_child_cluster`, `local_cluster_wait` — прод-воркер lk.redbox.su их не забирает. `ClusterQueues` + префикс в `config/cabinet-cluster.php` (`CLUSTER_QUEUE_PREFIX` для переопределения).
- **Проверка:** `dev-local.sh detach` → `dev-cluster-queue.sh status` (очереди с префиксом `local_`) → новый анализ (не #915) → ненулевая частотность, badge **v2.18**.

## 2.17 — 2026-05-25

- **Частотность (fix dev):** jobs из :3002 уходили в БД на `178.250.157.140`, их забирал **прод-воркер** со старым `/wordstat/json` → нули. Локально: `scripts/dev-cluster-queue.sh` (очереди `main_cluster,child_cluster,cluster_wait`), автостарт из `dev-fpm.sh`.
- **RiverFacade:** retry 101/110/115/500 ([Wordstat New](https://xmlriver.com/apiwordstatnew/apiwn-errors/)), лог `river.wordstat.*` в admin debug, пауза между запросами в `ClusterQueue`.
- **Проверка:** перезапуск `dev-local.sh detach` → пресет KAWE → анализ → в логе `job.phrase.done` with `based>0`, badge **v2.17**.

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
