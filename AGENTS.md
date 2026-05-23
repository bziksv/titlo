# AGENTS.md — Датагон (datagon.ru)

Репозиторий маркетинга в папке **`datagon.ru`** (порт **3001**). Кабинет: **lk.redbox.su** (прод, БД `178.250.157.140`) → **cabinet.datagon.ru** (`155.212.171.103`, порт **3002**, БД пока на старом) — [docs/cabinet-servers.md](./docs/cabinet-servers.md). Git: [bziksv/cabinet.datagon.ru](https://github.com/bziksv/cabinet.datagon.ru).

## Обязательно перед задачей

1. `.cursor/rules/*.mdc` (особенно `redbox-project`, `redbox-cabinet-dev`, `redbox-docs-sync`)
2. `docs/README.md` и раздел по теме задачи; **кабинет** → [docs/cabinet-agent-map.md](./docs/cabinet-agent-map.md)
3. `docs/examples/README.md` — при UI маркетинга; лендинг модуля → [module-landing-relevance.md](./docs/examples/module-landing-relevance.md) и http://localhost:3001/analiz-relevantnosti/
4. **Кабинет (:3002)** — UI только из эталона http://localhost:3002/html/ ([cabinet-reference.md](./docs/cabinet-reference.md) → «Эталон UI кабинета»)
5. **БД / прод кабинета** — журнал отложенного: [cabinet-pending-db-and-deploy.md](./docs/cabinet-pending-db-and-deploy.md)

## Поведение

- Отвечать **коротко и по существу**
- Обновлять **`docs/`** вместе с кодом
- Маркетинг (:3001) — эталоны в **`docs/examples/`**; кабинет (:3002) — UI из **`/html/`** (AdminLTE 4 в `cabinet.datagon.ru/public/html/`)

## Стек

Next.js (`datagon.ru`) + Laravel (**cabinet.datagon.ru** / пока **lk.redbox.su**).
