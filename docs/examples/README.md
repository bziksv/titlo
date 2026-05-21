# Эталонные примеры

Перед версткой или новым компонентом — **сначала этот каталог**, затем код по ссылке.

**Главный эталон лендинга модуля:** [module-landing-relevance.md](./module-landing-relevance.md) — страница http://localhost:3001/analiz-relevantnosti/ (подложки, секции, CTA, parallax, отчёт). Новое с нуля — только после просмотра неё.

## Каталог

| Эталон | Документ | Код | Статус |
|--------|----------|-----|--------|
| **Лендинг модуля (полный)** | [module-landing-relevance.md](./module-landing-relevance.md) | `AnalizRelevantnostiLanding` | ✅ |
| **Лендинг модуля: мониторинг** | [module-landing-monitoring.md](./module-landing-monitoring.md) | `MonitoringPoziciiLanding` | ✅ |
| **Лендинг модуля: конкуренты** | [module-landing-competitors.md](./module-landing-competitors.md) | `AnalizKonkurentovLanding` | ✅ |
| **Лендинг модуля: HTML-редактор** | [module-landing-html-editor.md](./module-landing-html-editor.md) | `HtmlRedaktorLanding` | ✅ |
| **Лендинг: HTTP headers** | [module-landing-http-headers.md](./module-landing-http-headers.md) | `HttpHeadersLanding` | ✅ |
| **Лендинг: калькулятор ROI** | [module-landing-roi.md](./module-landing-roi.md) | `KalkulyatorRoiLanding` | ✅ |
| **Лендинг: UTM-метки** | [module-landing-utm.md](./module-landing-utm.md) | `UtmMetkiLanding` | ✅ |
| **Лендинг: сравнение списков** | [module-landing-list-compare.md](./module-landing-list-compare.md) | `SravnenieSpiskovLanding` | ✅ |
| **Лендинг: генератор паролей** | [module-landing-password-gen.md](./module-landing-password-gen.md) | `GeneratorParoleyLanding` | ✅ |
| **Лендинг: подсчёт текста** | [module-landing-text-length.md](./module-landing-text-length.md) | `PodschetDlinyTekstaLanding` | ✅ |
| **Лендинг: генератор слов** | [module-landing-word-gen.md](./module-landing-word-gen.md) | `GeneratorSlovLanding` | ✅ |
| **Лендинг: мета-теги** | [module-landing-meta-mon.md](./module-landing-meta-mon.md) | `ProverkaMetaTegovLanding` | ✅ |
| **Лендинг: мониторинг сайтов** | [module-landing-site-mon.md](./module-landing-site-mon.md) | `MonitoringSaytovLanding` | ✅ |
| **Лендинг: удаление дубликатов** | [module-landing-dedup.md](./module-landing-dedup.md) | `UdalenieDublikatovLanding` | ✅ |
| Оболочка (header, footer, cookie) | [layout-shell.md](./layout-shell.md) | `components/`, `app/layout.tsx` | ✅ |
| Демо-виджет `/demo` | [demo-widget.md](./demo-widget.md) | `components/demo/` | ✅ |
| Скелет модуля (скрап) | — | `ModuleLanding.tsx` | fallback, не эталон |

### Marketing (`docs/examples/marketing/`)

| Эталон | Документ | Код | Статус |
|--------|----------|-----|--------|
| Layout главной | — | — | planned |
| Карточка модуля | — | `ModuleCard.tsx` | частично |
| Блок новостей | — | — | planned |

### Demo (`docs/examples/demo/`)

| Эталон | Документ | Код | Статус |
|--------|----------|-----|--------|
| Оболочка страницы `/demo` | — | — | planned |
| Вызов API через BFF | — | `app/api/...` | planned |

## Как добавить эталон

1. Реализовать один раз в `components/` или `app/`.
2. Создать `docs/examples/<категория>/<имя>.md` с описанием и путём к файлу.
3. Добавить строку в таблицу выше.

## Правило

Не изобретать стиль «на глаз» — расширять только из зафиксированных примеров или после согласования нового эталона.
