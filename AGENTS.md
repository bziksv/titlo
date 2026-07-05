# AGENTS.md — Датагон (datagon.ru)

Репозиторий маркетинга в папке **`datagon.ru`**: **titlo.ru** → [bziksv/titlo](https://github.com/bziksv/titlo) (локально `:3003`, `npm run dev:titlo`); legacy datagon.ru → [site_seo_datagon](https://github.com/bziksv/site_seo_datagon) (`:3001`). Кабинет → [bziksv/cabinet.datagon.ru](https://github.com/bziksv/cabinet.datagon.ru) (позже `cabinet.titlo.ru`) — [docs/cabinet-servers.md](./docs/cabinet-servers.md).

## Обязательно перед задачей

1. `.cursor/rules/*.mdc` (особенно `redbox-project`, `redbox-cabinet-dev`, `redbox-docs-sync`, **`redbox-cabinet-notifications-registry`**)
2. `docs/README.md` и раздел по теме задачи; **кабинет** → [docs/cabinet-agent-map.md](./docs/cabinet-agent-map.md)
3. `docs/examples/README.md` — при UI маркетинга; лендинг модуля → [module-landing-relevance.md](./docs/examples/module-landing-relevance.md) и http://localhost:3001/analiz-relevantnosti/
4. **Кабинет (:3002)** — UI только из эталона http://localhost:3002/html/ ([cabinet-reference.md](./docs/cabinet-reference.md) → «Эталон UI кабинета»)
5. **БД / прод кабинета** — журнал отложенного: [cabinet-pending-db-and-deploy.md](./docs/cabinet-pending-db-and-deploy.md)

## Поведение

- **Кнопки AJAX/POST в кабинете:** сразу спиннер + `disabled` + блок повторного клика — `cabinet-button-busy.js`, правило `redbox-cabinet-button-busy.mdc`
- Отвечать **коротко и по существу**
- Обновлять **`docs/`** вместе с кодом
- **Версии модулей кабинета:** при правке UI/JS страницы — bump `config/cabinet-<slug>.php`, changelog, badge ([cabinet-module-versioning.md](./docs/cabinet-module-versioning.md), правило `redbox-cabinet-module-version.mdc`)
- **Рассылки кабинета (TG / email / модалки):** новое оповещение → реестр `/admin/notifications` + тесты в `NotificationAdminTestService` ([cabinet-notifications-admin-changelog.md](./docs/cabinet-notifications-admin-changelog.md), правило `redbox-cabinet-notifications-registry.mdc`)
- Маркетинг (:3001) — эталоны в **`docs/examples/`**; кабинет (:3002) — UI из **`/html/`** (AdminLTE 4 в `cabinet.datagon.ru/public/html/`)

## Стек

Next.js (`datagon.ru`) + Laravel (**cabinet.datagon.ru** / пока **lk.redbox.su**).
