# Документация redbox.su

Перед изменениями читать нужный раздел и **`.cursor/rules/`**.

## Разделы

| Документ | О чём |
|----------|--------|
| [architecture.md](./architecture.md) | Стек, домены, границы Next vs Laravel |
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
