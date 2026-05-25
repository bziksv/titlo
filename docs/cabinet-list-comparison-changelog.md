# Сравнение списков — журнал версий

Config: `cabinet.datagon.ru/config/cabinet-list-comparison.php`  
Проверка: http://localhost:3002/list-comparison

## 1.0s — 2026-05-25

- **LTE4 / UI:** legacy `comparison/index` (FA4, jQuery AJAX, BS4 radios) → `pages/list-comparison.blade.php` + `cabinet-list-comparison.js/css`.
- **UX:** шаги 1–4, KPI (A / B / результат / пересечение), пресеты режимов, опции trim/пустые/регистр/сортировка.
- **Функции:** клиентское сравнение (мгновенно), swap A↔B, undo Ctrl+Z, localStorage, drag & drop .txt, скачивание .txt через Blob, ссылка на `/duplicates`.
- **Проверка:** http://localhost:3002/list-comparison — badge **v1.0s**, два списка → «Обработать» → KPI + результат.
