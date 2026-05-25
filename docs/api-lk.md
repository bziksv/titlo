# Интеграция с lk.redbox.su

> **Деплой кабинета:** прод-API пока **https://lk.redbox.su** (`178.250.157.140`, БД там же). **cabinet.datagon.ru** на `155.212.171.103` — файлы скопированы; смена `LK_API_BASE_URL` после cutover — [cabinet-servers.md](./cabinet-servers.md).

## Роль Next

Браузер обращается к **`/api/...` на redbox.su**; Next проксирует на Laravel.

## Env (пример)

```env
LK_API_BASE_URL=https://lk.redbox.su
# Секреты только на сервере Next, не NEXT_PUBLIC_
```

## Демо

### Сейчас (без guest API в lk)

- `/demo` — виджет **«Подсчёт длины текста»** (`components/demo/TextLengthTool.tsx`), расчёт в браузере.
- CTA → `lk.redbox.su/register`.

### BFF-прокси (готово к подключению lk)

- Маршрут: `GET|POST /api/lk/{path}` → `LK_API_BASE_URL/{path}`.
- Allowlist: `lib/lk-api.ts` → `ALLOWED_PREFIXES`.
- Env: см. `.env.example`.

### Форма контактов

`POST /api/contact/` — см. [lk-contact-api.md](./lk-contact-api.md).

1. **SMTP** (если задан `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS`) → письмо на `info@datagon.ru` и `sv6@list.ru`.
2. Иначе `POST {LK_API_BASE_URL}/api/public/contact`.
3. Иначе `CONTACT_WEBHOOK_URL`.
4. Dev без SMTP — лог в консоль; production — 503.

### Demo API (пилот: подсчёт длины текста)

Клиент: `lib/demo/run-text-length-client.ts` — сначала `POST /api/lk/api/demo/podschet-dliny-teksta/run`, при 404/502 — `POST /api/demo/podschet-dliny-teksta/run` (временный fallback на Next).

**Пока lk не реализовал endpoint** — работает только локальный маршрут Next. После реализации в Laravel — убрать fallback в клиенте (или оставить только для dev).

#### `POST /api/demo/podschet-dliny-teksta/run`

Тело:

```json
{
  "text": "строка (обязательно, до 2000 символов в демо)",
  "title": "опционально",
  "description": "опционально",
  "h1": "опционально"
}
```

Ответ **200**:

```json
{
  "demo": true,
  "module": "podschet-dliny-teksta",
  "remaining": 4,
  "limits": { "max_chars": 2000, "max_runs_per_day": 5, "full_max_chars": 38600 },
  "result": {
    "summary": {
      "chars_with_spaces": 120,
      "chars_no_spaces": 100,
      "words": 18,
      "lines": 3,
      "spaces": 20
    },
    "seo": null,
    "extended": null,
    "locked": ["seo", "extended"]
  },
  "upgrade": {
    "register_url": "https://lk.redbox.su/register?module=podschet-dliny-teksta&from=demo&guest=…",
    "login_url": "https://lk.redbox.su/login"
  }
}
```

Ошибки: **422** валидация, **429** лимит (5 прогонов/сутки/guest-cookie).

Cookies (Next fallback): `datagon_demo_guest`, `datagon_demo_runs`.

UI: `components/demo/TextLengthDemoWidget.tsx` на `/podschet-dliny-teksta/`.

#### Задача для lk

Реализовать тот же контракт на `POST /api/demo/podschet-dliny-teksta/run`; в полной версии отдавать `seo` и `extended` (не null) для авторизованных; для guest — как в таблице выше.

| Метод | Путь lk | Назначение |
|-------|---------|------------|
| POST | `api/public/contact` | Форма «Задать вопрос» |
| POST | `api/demo/podschet-dliny-teksta/run` | Демо подсчёта текста (пилот, Next fallback) |
| POST | `api/demo/analiz-teksta/run` | **Демо анализа текста** (Laravel, `TextAnalyzer::analyze`) |
| POST | `api/demo/analiz-konkurentov/run` | **Демо анализа конкурентов** (SERP ТОП-10, Яндекс, 1 фраза) |
| *(добавить)* | `api/demo/session` | Единая guest-session для всех модулей |

### Demo API: анализ текста

Клиент: `lib/demo/run-text-analyzer-client.ts` — `POST /api/lk/api/demo/analiz-teksta/run`, при 404/502 — `POST /api/demo/analiz-teksta/run` (прокси на кабинет, env `CABINET_DEMO_API_URL` или `LK_API_BASE_URL`).

Логика **только в Laravel** (`App\Services\Demo\TextAnalyzerDemoService` → `TextAnalyzer::analyze` с флагом `demo`, без списания тарифа).

#### `POST /api/demo/analiz-teksta/run`

Тело:

```json
{
  "mode": "text",
  "text": "строка (100–3000 символов в демо)",
  "url": "https://example.com/page",
  "exclude_stop_words": true,
  "no_index": false,
  "hidden_text": false,
  "compare_competitor": false,
  "competitor_url": "https://competitor.example/page"
}
```

`mode`: `"text"` (поле `text`) или `"url"` (поле `url`). В режиме URL работают `no_index` и `hidden_text`.

Ответ **200** (фрагмент):

```json
{
  "demo": true,
  "module": "analiz-teksta",
  "remaining": 4,
  "limits": {
    "max_chars": 3000,
    "min_chars": 100,
    "max_runs_per_day": 5,
    "full_max_chars": 38600,
    "top_words": 20
  },
  "result": {
    "general": { "textLength": 520, "countSpaces": 80, "lengthWithOutSpaces": 440, "countWords": 72 },
    "words": { "rows": […], "total": 45, "shown": 10 },
    "zipf": { "graph": […], "rows": […], "total": 20, "shown": 10 },
    "phrases": { "rows": […], "total": 30, "shown": 10 },
    "cloud": { "text": […], "text_total": 80, "text_shown": 35 },
    "comparison": null,
    "locked": ["cloud_links", "cloud_both", "export", "word_forms", "url", "compare_zipf", "compare_cloud"]
  },
  "upgrade": {
    "register_url": "https://lk.redbox.su/register?module=analiz-teksta&from=demo&guest=…",
    "login_url": "https://lk.redbox.su/login"
  }
}
```

Ошибки: **422** валидация, **429** лимит (5/сутки, cookie `datagon_demo_*`).

UI: `components/demo/TextAnalyzerDemoWidget.tsx` на `/analiz-teksta/`.

Проверка кабинета: `php scripts/verify-text-analyzer-demo.php`.

### Demo API: анализ конкурентов

Клиент: `lib/demo/run-competitor-analysis-client.ts` — `POST /api/lk/api/demo/analiz-konkurentov/run`, fallback `POST /api/demo/analiz-konkurentov/run`.

Логика в Laravel: `CompetitorAnalysisDemoService` → `SimplifiedXmlFacade` (только XML/SERP, без `scanSites`).

#### `POST /api/demo/analiz-konkurentov/run`

Тело:

```json
{
  "phrase": "отоскоп купить",
  "region_id": "213",
  "search_engine": "yandex",
  "compare_region_id": "193"
}
```

`search_engine`: `yandex` | `google`. `compare_region_id` — опционально, второй город → `result.geo` (геозависимость).

Ответ **200**: `result.serp` (`rows` — прямые конкуренты, `excluded_rows` — маркетплейсы/агрегаторы с исходной позицией в SERP), `result.geo`, `limits.*`. Фильтр доменов — `CompetitorSerpDomainFilter` (как в кабинете). В демо съём только **ТОП-10**; 20/30 — в кабинете.

Лимиты (config `cabinet-competitor-analysis.demo`): 3 запуска/сутки, 1 фраза до 120 символов, ТОП-10, регионы `213,2,193,65,54`.

UI: `CompetitorAnalysisDemoWidget.tsx` на `/analiz-konkurentov/` (ModuleV2DemoSection).

Проверка кабинета: `php scripts/verify-competitor-analysis-demo.php`.

### Demo API: кластеризатор

Клиент: `lib/demo/run-cluster-demo-client.ts` — `POST /api/demo/klasterizator-klyuchevykh-slov/run` + poll `/poll`, прокси на кабинет (`CABINET_DEMO_API_URL` / `127.0.0.1:3002`).

Логика в Laravel: `ClusterDemoService` → очереди `main_cluster` / `child_cluster` (classic, ТОП-10, без Wordstat).

#### `POST /api/demo/klasterizator-klyuchevykh-slov/run`

Тело:

```json
{
  "phrases": "фраза1\nфраза2\nфраза3",
  "region_id": "213",
  "clustering_level": "soft"
}
```

Ответ **200** (фрагмент): `{ "demo": true, "status": "pending", "progress_id": "…", "progress": { "phrases_total": 8, … }, "remaining": 1, "limits": { … } }`.

#### `POST /api/demo/klasterizator-klyuchevykh-slov/poll`

Тело: `{ "progress_id": "…" }`. Ответ: `status: pending|complete`, при complete — `result.groups[]`, `result.singles[]`.

Лимиты (`config/cabinet-cluster.demo`): 2 запуска/сутки, 3–10 фраз, classic Soft/Light, регионы `213,2,193,65,54`.

**Локально:** кабинет `:3002` + `bash scripts/dev-cluster-queue.sh status` (воркеры очередей).

UI: `ClusterDemoWidget.tsx` на http://localhost:3001/klasterizator-klyuchevykh-slov/

Проверка: `php scripts/verify-cluster-demo.php` (cabinet.datagon.ru).

### Demo API: удаление дубликатов

Клиент: `lib/demo/run-dedup-demo-client.ts` — `POST /api/lk/api/demo/udalenie-dublikatov/run`, fallback `POST /api/demo/udalenie-dublikatov/run`.

Обработка на Next (та же логика, что `cabinet-duplicates.js`); lk-endpoint опционален.

#### `POST /api/demo/udalenie-dublikatov/run`

Тело:

```json
{
  "text": "строка1\nстрока1\nстрока2",
  "options": {
    "removeDuplicates": true,
    "trim": true,
    "removeEmptyRows": false,
    "lowerCase": false,
    "removeExtraSpace": false,
    "replaceTabWithSpace": false,
    "replaceUmlaut": false
  }
}
```

Ответ **200**: `result.text`, `result.metrics` (`before`, `after`, `dupRemoved`, `emptyRemoved`), `remaining`, `upgrade.register_url`.

Лимиты демо: **20 000** символов, **1000** непустых строк, **10** запусков/сутки (cookie `datagon_demo_*`).

В демо **нет**: dedup без учёта регистра, сортировка, символы начала/конца, пресеты, split до/после, .txt — только в кабинете (`/duplicates`).

UI: `DuplicatesDemoWidget.tsx` на `/udalenie-dublikatov/`.

## Документировать при изменениях

- путь Laravel-эндпоинта;
- тело запроса / ответ;
- коды ошибок и лимиты демо.
