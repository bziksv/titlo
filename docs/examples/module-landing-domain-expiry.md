# Эталон: лендинг «Отслеживание срока регистрации доменов»

| Среда | URL |
|-------|-----|
| Локально | http://localhost:3001/otslezhivanie-sroka-registratsii-domenov/ |
| Прод | https://datagon.ru/otslezhivanie-sroka-registratsii-domenov/ |

Публичный URL — **v2** (`ModuleV2Landing`); classic — `OtslezhivanieSrokaRegistratsiiDomenovLanding` (ссылка «Классический лендинг»). Контент: `lib/content/otslezhivanie-sroka-registratsii-domenov-page.ts`.

Акцент: **срок регистрации, DNS, список доменов, email/Telegram**.

**Демо:** `DomainInformationDemoWidget` после блока stats — WHOIS без входа (5/сутки). Секция **«После регистрации»** — `DOMAIN_REG_POST_REG` в `otslezhivanie-sroka-registratsii-domenov-page.ts`.

Скрины LK (зеркало redbox, не иконки 50×50): hero — `53464bf37c05d8bc.jpg` (1149×239); сетка — `25fdbbef9dfe903f.jpg` (855×313).

Проверка: `npm run verify:domain-expiry` (порт **3001**); демо — кабинет :3002 + `POST /api/demo/otslezhivanie-sroka-registratsii-domenov/run` (см. [demo-widget.md](./demo-widget.md), [api-lk.md](../api-lk.md)).
