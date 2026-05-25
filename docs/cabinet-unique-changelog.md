# Выделение уникальных слов — журнал версий

Config: `cabinet.datagon.ru/config/cabinet-unique.php`  
Проверка: http://localhost:3002/unique

## 1.1s — 2026-05-25

- **UX:** undo (Ctrl+Z) после фильтра по вхождениям и удаления строк; поиск по таблице с подсветкой.
- **Пример:** кнопка «Заполнить примером»; спиннер «Обработка…» на кнопке.
- **Пайплайн:** ссылки на `/list-comparison` и `/duplicates` под результатом.
- **Legacy:** `POST /unique-words` → тот же API, что `/unique`; download-роуты → redirect.
- **Демо (лендинг):** пример одним кликом, CSV, поиск, блок «Дальше по пайплайну».
- **Проверка:** http://localhost:3002/unique — badge **v1.1s**.

## 1.0s — 2026-05-25

- **LTE4 / UI:** legacy `unique/index` (inline jQuery, DataTables, Toastr) → `pages/unique.blade.php` + `cabinet-unique.js/css`.
- **UX:** шаги 1–3, KPI (фразы / уникальные слова / сумма вхождений), сортировка таблицы, видимость колонок, фильтр по вхождениям, удаление строк.
- **Функции:** phpMorphy + shingles на сервере; copy/CSV через клиент; drag & drop .txt, localStorage; redirect `/unique-words` → `/unique`.
- **Демо API:** `POST api/demo/vydelenie-unikalnykh-slov-v-tekste/run` — лимит 3 000 символов, без дневного лимита прогонов.
- **Проверка:** http://localhost:3002/unique — badge **v1.0s**, список фраз → «Обработать» → KPI + таблица.
