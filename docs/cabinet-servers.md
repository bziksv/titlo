# Кабинет (Laravel): серверы и миграция на cabinet.datagon.ru

**Статус (май 2026): переходный.** Код скопирован на новый VPS, **база данных пока на старом сервере** (объём большой, перенос отложен).

## Сводка

| Что | Старый (прод сейчас) | Новый (файлы уже здесь) |
|-----|----------------------|-------------------------|
| **IP** | `178.250.157.140` | `155.212.171.103` |
| **Домен** | **lk.redbox.su** | **cabinet.datagon.ru** |
| **Порт приложения** | (nginx → php-fpm / как настроено на старом VPS) | **`3002`** — backend за nginx для поддомена |
| **Путь на диске** | `/var/www/redbox.su/data/www/lk.redbox.su` | `/var/www/cabinet_data_usr/data/www/cabinet.datagon.ru` |
| **Файлы приложения** | источник (был live) | скопированы с `178.250.157.140` (`rsync`) |
| **MySQL / БД** | **здесь** — работаем с БД отсюда | **нет** — подключение к БД на `178.250.157.140` |

Пока БД не переехала:

- **Прод-кабинет для пользователей** — по-прежнему **https://lk.redbox.su** на `178.250.157.140`.
- **cabinet.datagon.ru** на `155.212.171.103` — подготовка/тест; для работы нужен `.env` с хостом БД на старый сервер (и доступ MySQL с нового IP).

Маркетинг **datagon.ru** (Next) в `.env` пока указывает API на **lk.redbox.su** — см. [api-lk.md](./api-lk.md). После cutover кабинета — сменить на `https://cabinet.datagon.ru`.

## Схема (переходный период)

```text
datagon.ru (Next, 155.212.x / datagon.ru VPS)
    └─ BFF /api/* ──► lk.redbox.su (Laravel, 178.250.157.140) ──► MySQL на 178.250.157.140

cabinet.datagon.ru (Laravel, 155.212.171.103) — :3002 за nginx
    └─ .env DB_HOST ──► 178.250.157.140 (удалённая БД, пока не мигрировали)
```

**Порты на одном VPS (не путать):**

| Сервис | Домен | Порт |
|--------|--------|------|
| Маркетинг Next | datagon.ru | **3001** — [deploy.md](./deploy.md) |
| Кабинет Laravel | cabinet.datagon.ru | **3002** |

Проверка на сервере `155.212.171.103`:

```bash
curl -sI http://127.0.0.1:3002/ | head -5
curl -sI https://cabinet.datagon.ru/ | head -5
```

Nginx для поддомена проксирует на `127.0.0.1:3002` (PM2 / `php artisan serve` / unit — как поднято на s3). Пример: [nginx-cabinet.example.conf](./nginx-cabinet.example.conf).

## Что сделано

- [x] Копирование файлов `lk.redbox.su` → `cabinet.datagon.ru` (сервер → сервер, без скачивания на Mac).
- [x] Git: [bziksv/cabinet.datagon.ru](https://github.com/bziksv/cabinet.datagon.ru) — [cabinet-git.md](./cabinet-git.md).
- [x] Поддомен **cabinet.datagon.ru** слушает приложение на порту **3002**.

## Что ещё не сделано

- [ ] Перенос / реплика MySQL на `155.212.171.103` (или отдельный DB-хост).
- [ ] DNS и SSL для **cabinet.datagon.ru** как основного кабинета.
- [ ] Cutover: `APP_URL`, сессии, очереди, cron, бэкапы на новом окружении.
- [ ] Обновить `LK_API_BASE_URL` / `NEXT_PUBLIC_LK_URL` на **datagon.ru** после готовности API на новом домене.

## Настройка `.env` на новом сервере (пока БД на старом)

На `155.212.171.103` в `/var/www/cabinet_data_usr/data/www/cabinet.datagon.ru`:

```env
APP_URL=https://cabinet.datagon.ru

DB_HOST=178.250.157.140   # старый VPS, БД здесь
DB_PORT=3306
DB_DATABASE=lk_redbox_su_db
DB_USERNAME=lk_redbox_su_usr
DB_PASSWORD=…
```

**Локально на Mac** в скачанном `.env` заменить `DB_HOST=127.0.0.1` → `178.250.157.140` (те же `DB_*`, что на lk).

**На старом сервере** для MySQL:

- разрешить подключение с IP `155.212.171.103` (bind-address / `bind-address`, firewall, `GRANT …@'155.212.171.103'` или `%` по политике);
- не открывать 3306 в интернет без VPN/SSH-туннеля, если можно обойтись туннелем.

Альтернатива: SSH-туннель с нового VPS на `178.250.157.140:3306`, тогда `DB_HOST=127.0.0.1` и локальный порт туннеля.

## Команды (справка)

Копирование файлов (уже выполнено; для повтора — с нового сервера):

```bash
rsync -avz --progress \
  -e "ssh" \
  USER@178.250.157.140:/var/www/redbox.su/data/www/lk.redbox.su/ \
  /var/www/cabinet_data_usr/data/www/cabinet.datagon.ru/
```

После смены только кода на новом хосте:

```bash
cd /var/www/cabinet_data_usr/data/www/cabinet.datagon.ru
composer install --no-dev --optimize-autoloader
php artisan config:cache
# права storage/, bootstrap/cache/ — как на старом lk
```

## Репозиторий Git

- **GitHub:** [github.com/bziksv/cabinet.datagon.ru](https://github.com/bziksv/cabinet.datagon.ru)
- **Первый push / клон на Mac:** [cabinet-git.md](./cabinet-git.md)
- Локальная папка: `/Users/stanislav/Documents/projects/cabinet.datagon.ru`

Исторический upstream Laravel: [neeil1990/redbox](https://github.com/neeil1990/redbox) (импорт с lk.redbox.su, не основной remote для Датагон).

## Связанные документы

- [architecture.md](./architecture.md) — домены и границы Next / Laravel
- [api-lk.md](./api-lk.md) — прокси datagon.ru → кабинет
- [deploy.md](./deploy.md) — деплой только маркетинг-сайта (Next)
