# PDF-отчёт кабинета — эталонный шаблон (v6.9s)

**Зачем:** один раз отработанный mPDF-шаблон для модулей. Новый PDF — **копируем паттерн**, меняем только контент (Blade + данные), **не** пересобираем обложку/поля/логотип с нуля.

**Эталонная реализация:** модуль «Анализ текста» (`/text-analyzer`), версия **6.9s** (`config/cabinet-text-analyzer.php`).

Changelog модуля: [cabinet-text-analyzer-changelog.md](./cabinet-text-analyzer-changelog.md).

---

## 1. Файлы эталона (cabinet.datagon.ru)

| Роль | Путь |
|------|------|
| **Сборка PDF** (обложка → pagebreak → header/footer → body) | `app/Services/TextAnalyzerPdfService.php` → метод `renderBinary()` |
| **Брендинг, обложка GD, графики PNG** | `app/Support/TextAnalyzerPdfBranding.php` |
| **HTML тела отчёта** (только контент модулей) | `resources/views/text-analyse/export/pdf-body.blade.php` |
| **Точка входа** (кнопка «Скачать PDF») | `app/Exports/TextAnalyzer/TextAnalyzerReportPdfExport.php` + контроллер |
| **Автопроверка** | `scripts/verify-text-analyzer-pdf.php` (входит в `scripts/smoke-text-analyzer.sh`) |
| **Логотип (не трогать автогеном)** | `public/img/logo-icon-pdf.png` (175×175 RGBA, от дизайна) |
| **Фон обложки** (кэш GD) | `public/img/pdf-cover-bg.png` |
| **Временные PNG** | `storage/app/mpdf-tmp/` |

Устаревшие/не использовать для новых модулей: `pdf-cover.blade.php`, `report-pdf.blade.php` (старый HTML-путь).

---

## 2. Архитектура (не менять без согласования)

```
┌─────────────────────────────────────────────────────────────┐
│ Стр. 1 — обложка                                            │
│   GD → один PNG 210×297 mm                                  │
│   mPDF: <img width="210mm" height="297mm">                  │
│   margins = 0, header/footer OFF                            │
├─────────────────────────────────────────────────────────────┤
│ <pagebreak margin-left/right=14mm margin-top=22mm …>        │
├─────────────────────────────────────────────────────────────┤
│ Стр. 2+ — тело отчёта                                       │
│   SetHTMLHeader / SetHTMLFooter                             │
│   SetMargins(14, 14, 22), footer 18 mm                      │
│   Blade pdf-body: @page + .sec / .tbl / .kpi-*              │
└─────────────────────────────────────────────────────────────┘
```

### Константы layout (эталон)

| Параметр | Значение |
|----------|----------|
| Формат | A4, `dejavusans`, UTF-8 |
| Поля тела | left/right **14 mm**, top **22 mm**, bottom **18 mm** |
| Header/footer offset | header **8 mm**, footer **10 mm** |
| Шрифт тела | **9 pt**, заголовки секций **12 pt** |
| Цвета | primary `#2f5de0`, текст `#334155`, slate `#0f172a` |

Код эталона — `TextAnalyzerPdfService::renderBinary()` (строки ~75–152).

---

## 3. Что копировать в новый модуль

### A. Сервис `{Module}PdfService`

1. Скопировать **`renderBinary()`** и **`downloadResponse()`** из `TextAnalyzerPdfService` **как есть** (обложка + pagebreak + header/footer).
2. Заменить только:
   - `buildViewData()` — подготовка данных модуля;
   - view: `{module}/export/pdf-body.blade.php`;
   - строки в header/footer (название отчёта, `source_label`);
   - `SetTitle()` / переводы.

### B. Support-класс брендинга

**Вариант 1 (быстро):** переиспользовать `TextAnalyzerPdfBranding` — методы `coverPageImagePath()`, `logoIconPath()`, `viewData()`, `ensureCoverAssets()`. В `$meta` передать свой **`cover_rev`** (иначе подтянется кэш чужого модуля) и тексты обложки: `cover_kicker`, `cover_title`, `cover_lead`, `cover_footer` + `source_label`, `generated_at`, `version`. Эталон: `SiteMonitoringPdfService::renderBinary()`.

**Вариант 2 (отдельный модуль):** скопировать класс → `{Module}PdfBranding`, оставить общие константы `BRAND_*`, `coverPageImagePath` / `writeCoverPagePng` без изменений логики.

### C. Blade `pdf-body.blade.php`

Скопировать **блок `<style>`** из эталона (классы `.sec`, `.sec-h`, `.tbl`, `.kpi-t`, `.kpi-v`, `.tag-*`, `.page-break`). Контент секций — свой.

Графики/диаграммы — **GD PNG + `<img>`**, не inline SVG и не Chart.js в PDF. Пример: `TextAnalyzerPdfBranding::zipfChartImagePath()`.

### D. Verify-скрипт

Скопировать `scripts/verify-text-analyzer-pdf.php` → `scripts/verify-{module}-pdf.php`:

- минимальный прогон модуля (реальные или фикстурные данные);
- `renderBinary()`;
- проверки: `%PDF`, `>= 2` страниц, обложка = full-page raster, текст со 2-й страницы, `verifyCoverPng` + `verifyLogoIconPng`;
- подключить в smoke модуля.

---

## 4. Запреты (ломали прод и Preview)

| Нельзя | Почему |
|--------|--------|
| `mPDF::Image()` + `AddPage()` для обложки | первая страница пустая или футер «плавает» |
| `SetHTMLHeader` **до** `<pagebreak>` | шапка на обложке |
| HTML/CSS-обложка вместо GD-PNG | белые полосы, сброс полей, нестабильный layout |
| `@page` в body **без** `margin-left/right` | сброс боковых полей на всех страницах |
| Перегенерировать `logo-icon-pdf.png` через GD/qlmanage | белые уголки, «не тот» логотип — файл **committed**, менять только вручную |
| Растягивать графики без фикс. mm | битая вёрстка; UTF-8 подписи — только **imagettftext + DejaVu** |
| CTA-блок на обложке | убран в v6.9s, не возвращать |

---

## 5. Мета для обложки и колонтитулов

```php
$meta = [
    'generated_at' => date('d.m.Y H:i'),
    'source_label'   => 'https://example.com/page', // или название проекта
    'version'        => config('cabinet-{module}.version'),
];
```

Обложка кэшируется: `storage/app/mpdf-tmp/cover-{md5(payload)}.png`. При смене layout обложки — bump `cover_rev` в payload (`TextAnalyzerPdfBranding`, сейчас `'16'`).

---

## 6. Ассеты бренда

| Файл | Назначение |
|------|------------|
| `public/img/logo-icon-pdf.png` | иконка в header и на обложке (**эталон, не автоген**) |
| `public/img/logo-icon.svg` | источник для UI, не для PDF напрямую |
| `public/img/pdf-cover-bg.png` | градиент + сетка (GD, автосоздание) |
| `public/img/pdf-cover-logo.png` | блок «иконка + Датагон» на обложке (GD) |

---

## 7. Проверка

```bash
cd /Users/stanislav/Documents/projects/cabinet.datagon.ru
export PATH="/opt/homebrew/opt/php@7.4/bin:$PATH"

php scripts/verify-text-analyzer-pdf.php   # verify_pdf: OK
bash scripts/smoke-text-analyzer.sh      # полный smoke модуля
```

Ручная: `/text-analyzer` → анализ → «Скачать PDF» → обложка тёмная с логотипом, со 2-й страницы белый фон и поля 14 mm.

---

## 8. Версионирование

- Стабильная база layout/branding: **6.9s** — менять только с bump версии в `config/cabinet-{module}.php` и записью в changelog.
- Эксперименты с обложкой/полями — отдельная dev-версия (`6.9s-dev`, `7.0-dev`), не трогать `6.9s` без явного запроса.

---

## 9. Чеклист нового PDF-модуля

1. [ ] `{Module}PdfService` — `renderBinary()` скопирован из эталона
2. [ ] `{Module}PdfBranding` или reuse `TextAnalyzerPdfBranding`
3. [ ] `resources/views/{module}/export/pdf-body.blade.php` — стили из эталона
4. [ ] Кнопка экспорта + snapshot/session как в text-analyzer
5. [ ] `scripts/verify-{module}-pdf.php` + строка в smoke
6. [ ] Запись в `docs/cabinet-*` (этот файл + changelog модуля)
7. [ ] Badge версии в UI модуля совпадает с config

---

*Зафиксировано: май 2026, эталон v6.9s «Анализ текста».*
