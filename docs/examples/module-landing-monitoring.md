# Эталон: лендинг «Мониторинг позиций сайта»

Второй полный лендинг модуля по образцу [module-landing-relevance.md](./module-landing-relevance.md).

| Среда | URL |
|-------|-----|
| Локально | http://localhost:3001/monitoring-pozicii-sayta/ |
| Прод | https://datagon.ru/monitoring-pozicii-sayta/ |

Маршрут: `app/[slug]/page.tsx` → `MonitoringPoziciiLanding`.

## Контент и код

| Часть | Файл |
|-------|------|
| Тексты | `lib/content/monitoring-pozicii-page.ts` |
| Страница | `components/module-landings/MonitoringPoziciiLanding.tsx` |
| Технология (parallax) | `ModuleTechSection.tsx` + `MONITORING_TECH_*` |
| Блок «что даёт» | `ModuleInsightsSection.tsx` + `MONITORING_INSIGHTS_*` |
| Термины 2×2 | `ModulePlainSection.tsx` + `MONITORING_PLAIN` |

## Отличия от релевантности

- **4 режима** (`MONITORING_MODES`) вместо «трёх зон».
- Блок **доп. настроек** (`MONITORING_OPTIONS`) — список с галочками.
- Акцент на **позиции, Wordstat, история, экспорт**, а не на LSI/релевантность.

## Проверка

```bash
npm run dev
npm run verify:monitoring
BASE_URL=https://datagon.ru npm run verify:monitoring
```
