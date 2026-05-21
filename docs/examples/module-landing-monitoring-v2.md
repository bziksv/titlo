# Эталон: лендинг «Мониторинг позиций» v2 — концепция NEW

| Среда | URL |
|-------|-----|
| Локально | http://localhost:3001/monitoring-pozicii-v2/ |
| Классика (не трогать) | http://localhost:3001/monitoring-pozicii-sayta/ |

`MonitoringPoziciiV2Landing` · `lib/content/monitoring-pozicii-v2-page.ts`.

## Концепция: «Центр управления выдачей»

**Не** клон `MonitoringPoziciiLanding`. Другая логика страницы:

| Блок | Смысл |
|------|--------|
| `MonitoringV2CommandHero` | Тёмный full-viewport hero, слои скринов как «панель», заголовок «Где вы в выдаче — по ключам» |
| `MonitoringV2PainGain` | Сплит «без системы» / «с панелью Датагон» |
| `MonitoringV2StoryActs` | Sticky-навигация + 3 акта scroll-story (ядро → проверка → отчёт) |
| `MonitoringV2MetricWall` | Bento-стена цифр + count-up при скролле |
| `MonitoringV2Orbit` | Орбита на desktop, сетка на mobile |
| `MonitoringV2Footer` | Опции, plain, видео, FAQ-аккордеон, CTA |

Общее: `MonitoringV2SectionHeader`, `MonitoringV2CountUp`, `RevealOnScroll` на секциях.

Компоненты: `components/module-landings/monitoring-v2/`.

## Проверка

```bash
npm run verify:monitoring-v2
```

Порт **3001**. В HTML **не** должно быть секций классики («Режимы в одной платформе», «Как устроен мониторинг»).
