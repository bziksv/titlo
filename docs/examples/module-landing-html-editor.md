# Эталон: лендинг «HTML-редактор»

| Среда | URL |
|-------|-----|
| Локально | http://localhost:3001/html-redaktor/ |
| Прод | https://datagon.ru/html-redaktor/ |

Маршрут: `HtmlRedaktorLanding` · контент: `lib/content/html-redaktor-page.ts`.

Модуль про **визуальный редактор → HTML**, не SEO-аналитику: акцент на проекты, экспорт кода, обучение разметке.

**Демо:** `HtmlEditorDemoWidget` — CKEditor + split-view как в кабинете, пресеты, без лимита символов; единственное ограничение — нет сохранения (регистрация → `/html-editor`).

Проверка: `npm run verify:html-editor` · http://localhost:3001/html-redaktor/
