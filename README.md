# datagon.ru — Датагон (маркетинг)

Локальная папка проекта: **`datagon.ru`** (кабинет — **`cabinet.datagon.ru`**, см. [docs/cabinet-servers.md](./docs/cabinet-servers.md)).

Маркетинговый сайт **Датагон** на **Next.js**. Кабинет (Laravel): прод **lk.redbox.su** + БД на `178.250.157.140`; файлы **cabinet.datagon.ru** на `155.212.171.103`, БД пока на старом сервере.

Бренд: логотип и favicon — `public/favicon.svg` (из [p.datagon.ru](../p.datagon.ru/public/favicon.svg)).

## Репозиторий

[github.com/bziksv/site_seo_datagon](https://github.com/bziksv/site_seo_datagon)

## Документация

| Раздел | Файл |
|--------|------|
| Оглавление | [docs/README.md](docs/README.md) |
| Архитектура | [docs/architecture.md](docs/architecture.md) |
| Страницы и URL | [docs/pages.md](docs/pages.md) |
| API к lk | [docs/api-lk.md](docs/api-lk.md) |
| Форма контактов (SMTP) | [docs/lk-contact-api.md](docs/lk-contact-api.md) |
| Деплой (VPS datagon.ru, PM2) | [docs/deploy.md](docs/deploy.md) |
| Эталоны UI | [docs/examples/README.md](docs/examples/README.md) |

## Быстрый старт

**Оба проекта одной командой** (маркетинг :3001 + кабинет :3002):

```bash
cd /Users/stanislav/Documents/projects/datagon.ru
npm run dev:all
```

С очисткой `.next` (ошибки чанков): `npm run dev:all:fresh`. Остановка: `Ctrl+C` (кабинет на :3002 тоже гасится).

**Только маркетинг:**

```bash
cd /Users/stanislav/Documents/projects/datagon.ru
npm run dev:stop
rm -rf .next          # если была ошибка с чанками
npm run dev           # http://localhost:3001
```

**Только кабинет:** [cabinet.datagon.ru/README.md](../cabinet.datagon.ru/README.md) → `./scripts/dev-serve.sh` → http://127.0.0.1:3002

Если `EADDRINUSE` или `Cannot find module './873.js'` — то же: `dev:stop`, `rm -rf .next`, `npm run dev`. Короче: `npm run dev:fresh`.

**В терминале не пишите `# комментарий` в той же строке** после `npm run` — zsh ломает команду. Комментарий — отдельной строкой выше.

**3001 «не обновляется»:** дождитесь `Ready` в терминале, затем Hard Refresh (Cmd+Shift+R). Первый заход на `/contact/` компилируется 3–10 с.

**3002 «висит»:** закройте все вкладки `127.0.0.1:3002` и Cursor preview, потом только `dev:all` или `./scripts/dev-serve.sh`.

```bash
npm run build && npm run start
npm run smoke        # после start — все ~57 URL
npm run compare:sitemap  # сверка с sitemap Битрикса
npm run check        # lint + build
npm run docker:up    # production в Docker
```

## Миграция

Чеклист: [docs/migration-checklist.md](docs/migration-checklist.md)

Импорт с live-сайта: `npm run scrape:news`, `npm run scrape:legal`.
