# Эталонные примеры

Перед версткой или новым компонентом — **сначала этот каталог**, затем код по ссылке.

**Главный эталон лендинга модуля:** [module-landing-relevance.md](./module-landing-relevance.md) — страница http://localhost:3001/analiz-relevantnosti/ (подложки, секции, CTA, parallax, отчёт). Новое с нуля — только после просмотра неё.

## Каталог

| Эталон | Документ | Код | Статус |
|--------|----------|-----|--------|
| **Лендинг модуля (полный)** | [module-landing-relevance.md](./module-landing-relevance.md) | `AnalizRelevantnostiLanding` | ✅ |
| **Лендинг модуля: мониторинг** | [module-landing-monitoring.md](./module-landing-monitoring.md) | `MonitoringPoziciiLanding` | ✅ |
| **Лендинг: мониторинг v2 (NEW)** | [module-landing-monitoring-v2.md](./module-landing-monitoring-v2.md) | `MonitoringPoziciiV2Landing` — концепция «Центр управления» | ✅ |
| **Лендинг: все модули v2 (публичный)** | [module-landing-v2-universal.md](./module-landing-v2-universal.md) | `ModuleV2Landing` на `/<slug>/`; LAB `*-v1/v2/v3` в robots | ✅ |
| **Лендинг: мониторинг v3 (LAB)** | [module-landing-monitoring-v3.md](./module-landing-monitoring-v3.md) | `MonitoringPoziciiV3Landing` — «Пульс позиций», иммерсив | ✅ |
| **Лендинг: все модули v3 (LAB)** | [module-landing-v3-universal.md](./module-landing-v3-universal.md) | `ModuleV3Landing` + `lib/content/module-v3/` | ✅ |
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
| **Лендинг: уникальные слова** | [module-landing-unique-words.md](./module-landing-unique-words.md) | `VydelenieUnikalnykhSlovLanding` | ✅ |
| **Лендинг: отслеживание ссылок** | [module-landing-link-track.md](./module-landing-link-track.md) | `OtslezhivanieSsylokLanding` | ✅ |
| **Лендинг: срок регистрации доменов** | [module-landing-domain-expiry.md](./module-landing-domain-expiry.md) | `OtslezhivanieSrokaRegistratsiiDomenovLanding` | ✅ |
| **Лендинг: анализ текста** | [module-landing-text-analysis.md](./module-landing-text-analysis.md) | `AnalizTekstaLanding` | ✅ |
| **Лендинг: кластеризатор** | [module-landing-clusterizer.md](./module-landing-clusterizer.md) | `KlasterizatorKlyuchevykhSlovLanding` | ✅ |
| **PDF-отчёт кабинета (mPDF)** | [cabinet-pdf-report-template.md](../cabinet-pdf-report-template.md) | `TextAnalyzerPdfService`, `TextAnalyzerPdfBranding`, `pdf-body.blade.php` | ✅ v6.9s |
| **Справочник UI-эффектов (референсы)** | [visual-effects-agency-reference.md](./visual-effects-agency-reference.md) | 9 агентств + **30+ кейсов** (прогон 2), волны внедрения | 📋 |
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
