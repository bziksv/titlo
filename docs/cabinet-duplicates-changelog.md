# Удаление дубликатов — журнал версий

Config: `cabinet.datagon.ru/config/cabinet-duplicates.php`  
Проверка: http://localhost:3002/duplicates

## 1.2s — 2026-05-25

- **UX:** шаги 1–3 (вставить → опции → обработать); «Сравнить до/после» — под полем ввода, снимок «до» ниже переключателя.
- **Проверка:** http://localhost:3002/duplicates — badge **v1.2s**.

## 1.1.1s — 2026-05-25

- **Fix:** кнопка «Снять все» — лишняя `"` в `data-dup-deselect-all"` ломала разметку (`""="">`).
- **Проверка:** http://localhost:3002/duplicates — три кнопки в шапке опций без артеfact.

## 1.1s — 2026-05-25

- **P1:** пустые строки — полноценное удаление; ё/Ё → е; KPI: отдельно «дубликаты» и «пустые строки».
- **P2:** «Снять все», пресеты (только дубли / SEO), dedup без регистра, сортировка А→Я, Undo (Ctrl+Z).
- **P3:** localStorage (текст + галочки), drag & drop .txt, split «до/после», tooltips у опций.
- **Проверка:** http://localhost:3002/duplicates — badge **v1.1s**.

## 1.0s — 2026-05-25

- **LTE4 / UI:** Vue + jQuery-хаки заменены на Blade + `cabinet-duplicates.js/css` (AdminLTE 4, BS5).
- **UX:** KPI info-box (было / стало / удалено), live-счётчик строк, Copy/Clear, «Выбрать все» / «По умолчанию», Ctrl+Enter.
- **Fix:** экранирование спецсимволов в полях «символы в начале/конце слова»; убран нерабочий `axios.get('/duplicates/{length}')`.
- **Проверка:** http://localhost:3002/duplicates — badge **v1.0s**, вставить список с дублями → «Удалить дубликаты» → KPI обновляются.
