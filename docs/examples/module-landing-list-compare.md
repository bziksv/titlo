# Эталон: лендинг «Сравнение списков ключевых фраз»

| Среда | URL |
|-------|-----|
| Локально | http://localhost:3001/sravnenie-spiskov-klyuchevykh-fraz/ |
| Прод | https://datagon.ru/sravnenie-spiskov-klyuchevykh-fraz/ |

`SravnenieSpiskovLanding` · `lib/content/sravnenie-spiskov-page.ts`.

**Демо:** `ListComparisonDemoWidget` на v2 (`ModuleV2DemoSection`, `demoWidget: "list-comparison"`) и в классическом лендинге — сравнение **в браузере**, без API; лимит **3 000 символов** на каждый список (см. [demo-widget.md](./demo-widget.md)).

Акцент: **2 столбца, 4 типа сравнения, пересечение семантики, копирование и DOC**.

Проверка: `npm run verify:list-compare` (порт **3001**)

Скрины: `9477ce6ca4e29a36.jpg` (1200×717, тип сравнения), не `9564df8825f713fc.jpg` (баннер «Оба списка…», 300×53).
