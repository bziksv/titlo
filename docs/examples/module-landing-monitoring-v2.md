# Эталон: лендинг «Мониторинг позиций» v2 — концепция NEW

| Среда | URL |
|-------|-----|
| Публичный URL | http://localhost:3001/monitoring-pozicii-sayta/ |
| LAB v2 | http://localhost:3001/monitoring-pozicii-v2/ |
| Классика (не трогать) | http://localhost:3001/monitoring-pozicii-sayta/ |

`MonitoringPoziciiV2Landing` · `lib/content/monitoring-pozicii-v2-page.ts`.

## Концепция: «Центр управления выдачей»

**Не** клон `MonitoringPoziciiLanding`. Другая логика страницы:

| Блок | Смысл |
|------|--------|
| `MonitoringV2CommandHero` | Тёмный full-viewport hero, слои скринов как «панель», H1 «Проверка позиций сайта по ключевым запросам» |
| `MonitoringV2PainGain` | Сплит «Какие проблемы решает наш сервис» / «С панелью Титло» |
| `MonitoringV2StoryActs` | Sticky-навигация + 3 акта scroll-story (ядро → проверка → отчёт) |
| `MonitoringV2Orbit` | Орбита на desktop: стрелки **рисуются от центра** при скролле; при hover карточки/центра — поток по линии (карточки не сдвигаются). Mobile — сетка. Стена цифр (MetricWall) на этом лендинге **не** показывается — дубль. |
| `MonitoringV2CapabilityDeck` | Кадры `*-v6.png` с `sv6@list.ru`: ждём ≥5 строк таблицы, `#cabinet-mon-v2-admin-debug` скрыт. Пересъём: `node scripts/capture-monitoring-v2-ui.mjs` |
| `MonitoringV2Footer` | Опции, plain, видео, FAQ-аккордеон, финальный CTA (полоса `bg-brand-700`, белая карточка формы) |

Общее: `MonitoringV2SectionHeader`, `MonitoringV2CountUp`, `RevealOnScroll` на секциях.

Компоненты: `components/module-landings/monitoring-v2/`.

## Проверка

```bash
npm run verify:monitoring-v2
```

Порт **3001**. В HTML **не** должно быть секций классики («Режимы в одной платформе», «Как устроен мониторинг»).
