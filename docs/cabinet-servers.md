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
| **Панель / ОС** | панель не указана; ОС в снимке не снята | **FASTPANEL**, Ubuntu **24.04.3 LTS** |
| **CPU / RAM / диск** | **4 vCPU**, **~7.6 GiB RAM**, **180 GiB** `/` (**62%**) — § «Железо lk» | **8 vCPU**, **~10 GiB RAM**, **138 GiB** `/` (**85%**) — § «Железо s3» |

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

## Железо lk (`178.250.157.140`, lk.redbox.su + MySQL)

**SSH:** `root@178.250.157.140` (промпт `root@server`). **Прод для пользователей**, локальная **MySQL**, **supervisor + cron** (очереди, мониторинг, кластер).

Снимок **`root@server`**, **2026-05-30** (время сессии не указано):

| Параметр | Значение |
|----------|----------|
| **CPU** | **4** vCPU, Intel Core **i9-10900K** @ 3.70 GHz, 4 cores / socket, 1 thread/core |
| **RAM** | **7.6 GiB** total; used **6.0 GiB**, free **786 MiB**, available **~1.1 GiB** |
| **Swap** | **5.9 GiB** total; used **3.4 GiB**, free **2.5 GiB** |
| **Диск /** | **180 GiB**, **111 GiB** used, **69 GiB** free (**62%**) — `/dev/vda2` |

Повторная проверка:

```bash
ssh root@178.250.157.140
lscpu | grep -E 'Model name|CPU\(s\)|Thread|Core'
free -h
df -h /
uptime
```

## Железо VPS s3 (`155.212.171.103`, cabinet.datagon.ru)

**SSH:** `root@s3` (алиас в доках деплоя). Панель: **FASTPANEL** — конфиги nginx/apache **не править руками** (`/etc/nginx/fastpanel2-available`, `/etc/apache2/fastpanel2-available`).

Снимок **`root@s3`**, **2026-05-30 ~13:28** (uptime ~23 сут):

| Параметр | Значение |
|----------|----------|
| **ОС** | Ubuntu 24.04.3 LTS |
| **CPU** | **8** vCPU, AMD EPYC 7763 (вирт. @ 2.0 GHz), 8 cores / socket, 1 thread/core |
| **RAM** | **9.6 GiB** total; used **7.7 GiB**, available **~2.0 GiB** (с учётом cache) |
| **Swap** | **4.0 GiB** — на снимке **заполнен** (~4.0 GiB used, ~72 KiB free) |
| **Диск /** | **138 GiB**, **112 GiB** used, **20 GiB** free (**85%**) — `/dev/vda3` |
| **Load avg** | 1.34, 1.25, 1.38 (1 / 5 / 15 min) |

Повторная проверка:

```bash
ssh root@155.212.171.103   # или root@s3
lscpu | grep -E 'Model name|CPU\(s\)|Thread|Core'
free -h
df -h /
uptime
```

## Сравнение снимков (май 2026)

| | **lk** `178.250.157.140` | **s3** `155.212.171.103` |
|--|--------------------------|---------------------------|
| CPU | 4 vCPU (i9-10900K) | 8 vCPU (EPYC 7763) |
| RAM | 7.6 GiB | 9.6 GiB |
| Swap used | ~3.4 / 5.9 GiB | ~4.0 / 4.0 GiB (**полный**) |
| Диск `/` | 62% (111 / 180 GiB) | 85% (112 / 138 GiB) |
| Роль | прод + MySQL + очереди | cabinet.datagon.ru, БД удалённо |

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

## Окружения: где что проверять (БД общая)

**MySQL одна** — `178.250.157.140`, база `lk_redbox_su_db`. Локаль (:3002), **cabinet.datagon.ru** (155.212.171.103) и **lk.redbox.su** (178.250.157.140) видят **одни и те же** таблицы `jobs`, `failed_jobs`, `cluster_queue_array`, пользователей и т.д.

| Окружение | Код / URL | IP | Фоновые процессы (очереди) | Префикс очередей кластера |
|-----------|-----------|-----|----------------------------|---------------------------|
| **Прод для пользователей** | https://lk.redbox.su | `178.250.157.140` | **cron + supervisor** (`queue:work`, мониторинг, позиции, …) | нет (`cluster_wait`, `child_cluster`, …) |
| **Новый кабинет (тест/прод файлы)** | https://cabinet.datagon.ru | `155.212.171.103` | пока только **`schedule:run`** в crontab (раз в минуту) — **нет** постоянных `queue:work` | **production** → те же имена, что на lk |
| **Локаль на Mac** | http://127.0.0.1:3002 | Mac | `./scripts/dev-local.sh` + **`scripts/dev-cluster-queue.sh`** (4 воркера) | **`local_`** (`local_cluster_wait`, …) при `APP_ENV=local` |
| **Маркетинг** | datagon.ru :3001 | отдельный VPS | BFF к lk/cabinet, **своей БД нет** | — |

### Что это значит на практике

1. **Админка `/admin/database`, превью `failed_jobs`** — смотреть можно **с любого** окружения, подключённого к `DB_HOST=178.250.157.140` (Mac, cabinet, lk). Данные одни.

2. **Очистка `jobs` / `failed_jobs`**
   - **`local_*`** (например `local_cluster_wait`) — почти всегда мусор **локальной разработки** на Mac; чистить на Mac после `dev-cluster-queue.sh stop` **относительно безопасно** для прода.
   - **Без префикса** (`cluster_wait`, `default`, `position_low`, …) — это **прод lk** (supervisor). **Не удалять** с Mac без согласования: заденете живой lk.redbox.su.
   - На **cabinet.datagon.ru** сейчас **нет** своих воркеров очереди → запуск кластера с этого домена пишет в **общую** таблицу `jobs`, но обрабатывать может только **lk** (supervisor на 178.250.157.140), если имена очередей production.

3. **`cluster_queue_array` (~31k строк)** — общая таблица. `truncate` только если договорились, что это хвосты тестов; иначе влияет на все окружения.

4. **Исправление кода** (кластер, лимит wait-job) — правим в репо `cabinet.datagon.ru`, деплой на **155.212.171.103**; на **lk** — отдельно, пока там основной прод. До cutover на cabinet — не дублировать supervisor на двух VPS на одной БД ([cabinet-deploy.md](./cabinet-deploy.md) § Cron / очереди).

### Cron на cabinet.datagon.ru (155.212.171.103)

Сейчас в crontab (проверено):

```cron
* * * * * cd /var/www/cabinet_data_usr/data/www/cabinet.datagon.ru && /opt/php74/bin/php artisan schedule:run >> /dev/null 2>&1
```

Этого **недостаточно** для кластеризатора и Laravel-очередей: нужны постоянные воркеры (`queue:work` / supervisor), как на lk — **после cutover**, не параллельно с lk.

На **lk.redbox.su** — полный набор cron + supervisor (мониторинг, позиции, relevance, …). Список задач: `app/Console/Kernel.php` + конфиги supervisor на `178.250.157.140` (на Mac не копируется автоматически).

### Локаль: кластер

```bash
cd /Users/stanislav/Documents/projects/cabinet.datagon.ru
bash scripts/dev-cluster-queue.sh status   # local_main_cluster, local_child_cluster, local_cluster_wait
```

Без воркеров jobs с префиксом `local_` копятся в общей БД; прод-воркер lk их **не** забирает ([cabinet-cluster-changelog.md](./cabinet-cluster-changelog.md) § 2.17–2.18).

### Чек-лист «где смотреть проблему»

| Вопрос | Где смотреть |
|--------|-------------|
| Размер таблиц, сироты, даты | https://cabinet.datagon.ru/admin/database или local :3002/admin/database |
| Последние ошибки очереди | Превью таблицы `failed_jobs` на той же странице |
| Завал wait-кластера **локально** | `jobs` WHERE `queue` LIKE 'local_%' |
| Завал **прод** очереди | SSH **178.250.157.140**, supervisor + `jobs` без `local_` |
| Работает ли schedule на новом VPS | SSH **155.212.171.103**, crontab, `storage/logs/` |

---

## Связанные документы

- [architecture.md](./architecture.md) — домены и границы Next / Laravel
- [api-lk.md](./api-lk.md) — прокси datagon.ru → кабинет
- [deploy.md](./deploy.md) — деплой только маркетинг-сайта (Next)
- [cabinet-deploy.md](./cabinet-deploy.md) — деплой cabinet, cron, FastPanel
