# Эталон: лендинг «Мониторинг сайтов»

Не путать с [module-landing-monitoring.md](./module-landing-monitoring.md) (`/monitoring-pozicii-sayta/` — позиции в выдаче).

| Среда | URL |
|-------|-----|
| Локально | http://localhost:3001/monitoring-saytov/ |
| Прод | https://datagon.ru/monitoring-saytov/ |

`MonitoringSaytovLanding` · `lib/content/monitoring-saytov-page.ts`.

Акцент: **uptime, HTTP-код, лог проверок, PDF-отчёт, публичная ссылка (30/90/180/365/бессрочно), Telegram (Free) / email+Telegram (платные), несколько проектов**.

**Кабинет (`/site-monitoring`):** таблица проектов, ручная проверка, модалка статистики (KPI, инциденты, история), сброс uptime, массовое удаление, форма добавления по шагам.

**Тариф Free:** один проект, интервал **60 мин.**, письма не уходят; Telegram — при подключённом боте. См. `/tarify/`.

**Демо на лендинге:** `SiteMonitoringDemoWidget` — разовая HTTP-проверка (5/сутки). PDF, шаринг и постоянный мониторинг — только в кабинете.

Контент: `lib/content/monitoring-saytov-page.ts` (редакторский, v1.5+).

Проверка: `npm run verify:site-mon` (порт **3001**)
