# Документация datagon.ru (маркетинг)

Локальная папка репозитория: `datagon.ru` (ранее `redbox.su`). Прод: **https://datagon.ru**.

Перед изменениями читать нужный раздел и **`.cursor/rules/`**.  
Задачи по **кабинету** — сначала **[cabinet-agent-map.md](./cabinet-agent-map.md)** (где код, куда писать доку).

## Разделы

| Документ | О чём |
|----------|--------|
| **[cabinet-agent-map.md](./cabinet-agent-map.md)** | **Кабинет для агента:** 2 репо, карта кода, куда обновлять docs |
| [architecture.md](./architecture.md) | Стек, домены, границы Next vs Laravel |
| [cabinet-servers.md](./cabinet-servers.md) | **Кабинет:** VPS, пути, БД на старом сервере, миграция lk → cabinet |
| [cabinet-git.md](./cabinet-git.md) | **Кабинет:** push с VPS → GitHub → clone на Mac |
| [cabinet-deploy.md](./cabinet-deploy.md) | **Кабинет:** деплой на VPS `155.212.171.103` (git + composer + PM2 :3002) |
| [cabinet-reference.md](./cabinet-reference.md) | **Кабинет:** роуты, middleware, логи, troubleshooting |
| [cabinet-pending-db-and-deploy.md](./cabinet-pending-db-and-deploy.md) | **Кабинет:** что не на проде, миграции БД, журнал между диалогами |
| [cabinet-performance-audit.md](./cabinet-performance-audit.md) | **Кабинет:** чек-лист страниц, SQL-аудит, страницы вне меню |
| [cabinet-pdf-report-template.md](./cabinet-pdf-report-template.md) | **Кабинет:** эталон PDF-отчёта mPDF (v6.9s) — layout, копирование в новые модули |
| [nginx-cabinet.example.conf](./nginx-cabinet.example.conf) | Nginx: cabinet.datagon.ru → **:3002** |
| [pages.md](./pages.md) | Маршруты, SEO, редиректы с Битрикса |
| [api-lk.md](./api-lk.md) | Прокси Next → lk, env |
| [lk-contact-api.md](./lk-contact-api.md) | Форма контактов: SMTP, lk, webhook |
| [deploy.md](./deploy.md) | Docker, VPS `/var/www/datagon_ru_usr/...`, PM2, smoke |
| [migration-checklist.md](./migration-checklist.md) | Чеклист миграции с Битрикса |
| [examples/README.md](./examples/README.md) | **Эталонные** UI и паттерны (обязательно смотреть перед версткой) |
| [examples/module-landing-relevance.md](./examples/module-landing-relevance.md) | Эталон лендинга модуля: `/analiz-relevantnosti/` |

Репозиторий: [github.com/bziksv/site_seo_datagon](https://github.com/bziksv/site_seo_datagon).

## Как вести документацию

1. Меняем код → в той же задаче обновляем соответствующий `.md`.
2. Новый переиспользуемый UI → эталон в `docs/examples/` + строка в каталоге.
3. Кратко: что, зачем, как проверить (URL, команда).

## Агентам

- Ответы пользователю: **коротко, по существу**.
- Не дублировать логику `lk` на Next — только BFF и UI.
