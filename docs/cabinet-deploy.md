# Деплой cabinet.datagon.ru (Laravel)

**Сервер:** `155.212.171.103` (**s3**, FASTPANEL, Ubuntu 24.04) — **8 vCPU**, **~10 GiB RAM**, диск **138 GiB** (снимок 2026-05-30: swap заполнен, `/` **85%**) — [cabinet-servers.md](./cabinet-servers.md) § «Железо VPS s3»  
**Путь:** `/var/www/cabinet_data_usr/data/www/cabinet.datagon.ru`  
**Git:** [github.com/bziksv/cabinet.datagon.ru](https://github.com/bziksv/cabinet.datagon.ru)  
**Порт приложения:** `3002` (nginx → `127.0.0.1:3002`)  
**БД:** пока на **`178.250.157.140`** — [cabinet-servers.md](./cabinet-servers.md)

Маркетинг **datagon.ru** деплоится **отдельно** — [deploy.md](./deploy.md) (`npm ci` + `build`, PM2 `datagon-site`, порт **3001**).

---

## Сравнение

| | datagon.ru (маркетинг) | cabinet.datagon.ru (кабинет) |
|---|------------------------|------------------------------|
| VPS / путь | datagon.ru на своём VPS | `155.212.171.103`, `/var/www/cabinet_data_usr/.../cabinet.datagon.ru` |
| Стек | Next.js | Laravel 6, PHP **7.4** |
| Сборка | `npm ci` + `npm run build` | `composer install` (+ при смене фронта `npm ci` + `npm run production`) |
| PM2 | `datagon-site` → порт **3001** | `cabinet-datagon` → порт **3002** |
| `.env` | `.env.local` на сервере | `.env` на сервере (не в git) |

---

## Первый раз (если ещё не настроено)

```bash
ssh root@155.212.171.103

cd /var/www/cabinet_data_usr/data/www/cabinet.datagon.ru

# git уже есть после push; если пусто — clone:
# git clone https://github.com/bziksv/cabinet.datagon.ru.git .

# .env — только на сервере (скопирован с lk или вручную)
nano .env
# APP_URL=https://cabinet.datagon.ru
# DB_HOST=178.250.157.140
# DB_* как на lk.redbox.su
# БД на 178.250.157.140 — отключить тяжёлую очистку http_headers на каждый запрос:
HTTP_HEADERS_CLEANUP_ON_REQUEST=false

# Прод: блок «Ваши лимиты» в шапке — НЕ отключать (на local в .env можно true):
SKIP_HEAVY_WEB_MIDDLEWARE=false

composer install --no-dev --optimize-autoloader
npm ci && npm run production   # если нужны свежие CSS/JS

php artisan config:cache
php artisan route:cache
php artisan view:cache

chown -R cabinet_data_usr:cabinet_data_usr storage bootstrap/cache
chmod -R ug+rwx storage bootstrap/cache

# PM2 (пример; имя можно другое, если уже создано)
sudo -u cabinet_data_usr bash -lc '
  cd /var/www/cabinet_data_usr/data/www/cabinet.datagon.ru
  pm2 delete cabinet-datagon 2>/dev/null || true
  pm2 start php --name cabinet-datagon -- artisan serve --host=127.0.0.1 --port=3002
  pm2 save
'

curl -sI http://127.0.0.1:3002/login | head -5
curl -sI https://cabinet.datagon.ru/login | head -5
```

Nginx: [nginx-cabinet.example.conf](./nginx-cabinet.example.conf) — **только если** кабинет на `artisan serve :3002`; на **FastPanel** обычно не нужен (см. ниже).

---

## FastPanel (s3 и аналоги)

На сервере с **FASTPANEL** PHP ставится **через панель**, не `add-apt-repository`. PM2 + `artisan serve :3002` чаще **не используют** — сайт отдаёт **nginx → PHP-FPM**.

Документация панели: [смена версии PHP](https://kb.fastpanel.direct/sites/how-to-change-php-version).

### 1. Установить PHP 7.4 в панели

1. Войти в FastPanel (URL из письма установки, обычно `https://IP:8888` или домен панели).
2. Раздел установки PHP-пакетов (часто **«Приложения» / PHP** или при редактировании сайта — **установить php74**).
3. Дождаться окончания установки.

Проверка по SSH **от root**:

```bash
/opt/php74/bin/php -v
# или
ls /opt/php*/bin/php
```

CLI-алиас на сервере: **`/opt/php74/bin/php`** (вместо `php7.4`).

### 2. Сайт `cabinet.datagon.ru` в панели

| Параметр | Значение |
|----------|----------|
| **PHP version** | **7.4** (php74) |
| **PHP mode** | **PHP-FPM** (рекомендуется) |
| **Document root** | `.../cabinet.datagon.ru/public` ← обязательно **`/public`** |
| Пользователь сайта | `cabinet_data_usr` |

Путь к коду: `/var/www/cabinet_data_usr/data/www/cabinet.datagon.ru`.

После смены версии / корня — перезапуск PHP-FPM из панели или:

```bash
# от root, имя пула может отличаться
systemctl reload php7.4-fpm 2>/dev/null || systemctl reload fp2-php74-fpm 2>/dev/null || true
```

### 3. PHP для SSH (composer, artisan)

`cabinet_data_usr` **не в sudoers** — это нормально. Деплой делает **root**; для CLI:

**В панели:** **Users** → `cabinet_data_usr` → **Edit** → **PHP (CLI) version** → **7.4** → сохранить → **переподключить SSH** (старая сессия оставит PHP 8.3).

Либо всегда явный путь (от root):

```bash
PHP=/opt/php74/bin/php
```

### 4. Деплой от root (FastPanel, без PM2)

**Важно:** блок ниже выполнять в сессии **`root@s3`**, не `cabinet_data_usr@s3` (иначе `chown` и git/composer в `vendor` дадут *Permission denied*).

```bash
APP=/var/www/cabinet_data_usr/data/www/cabinet.datagon.ru
PHP=/opt/php74/bin/php
cd "$APP"

git config --global --add safe.directory "$APP"
git fetch origin && git checkout main && git reset --hard origin/main

# от root: без интерактива (иначе «Continue as root/super user [yes]?»)
COMPOSER_ALLOW_SUPERUSER=1 $PHP "$(which composer)" install --no-dev --optimize-autoloader --no-interaction

chown -R cabinet_data_usr:cabinet_data_usr "$APP"
chmod -R ug+rwx "$APP/storage" "$APP/bootstrap/cache"

sudo -u cabinet_data_usr $PHP "$APP/artisan" config:clear
sudo -u cabinet_data_usr $PHP "$APP/artisan" config:cache
sudo -u cabinet_data_usr $PHP "$APP/artisan" route:cache
sudo -u cabinet_data_usr $PHP "$APP/artisan" view:cache

# новые миграции (тикеты, удаление behavior и т.д.) — по согласованию, общая БД:
# sudo -u cabinet_data_usr $PHP "$APP/artisan" migrate --force
```

Проверка:

```bash
curl -sI https://cabinet.datagon.ru/login | head -5
# или с сервера:
curl -sI -H "Host: cabinet.datagon.ru" http://127.0.0.1/login | head -5
```

**PM2 `cabinet-datagon`** на FastPanel обычно **не нужен**, если сайт уже в панели на PHP 7.4 FPM. Порт **3002** — только для схемы «прокси на artisan serve» из [nginx-cabinet.example.conf](./nginx-cabinet.example.conf); в панели чаще другой vhost.

### 5. Если `/opt/php74/bin/php` нет

В панели доустановить пакет **php74** для сайта (шаг 1). Не ставить Laravel на системный `php` **8.3** — `composer` будет ругаться на `^7.4`.

### 6. Права и git

Как в § Troubleshooting: `chown -R cabinet_data_usr:cabinet_data_usr`, `safe.directory` для git от root.

---

## Обновление после `git push`

### FastPanel (s3) — основной сценарий

**От root.** Не `composer` / `php artisan` без пути — на сервере по умолчанию PHP 8.3. Без PM2 (сайт на PHP-FPM).

```bash
APP=/var/www/cabinet_data_usr/data/www/cabinet.datagon.ru
PHP=/opt/php74/bin/php
cd "$APP"

git config --global --add safe.directory "$APP"
git fetch origin && git checkout main && git reset --hard origin/main

COMPOSER_ALLOW_SUPERUSER=1 $PHP "$(which composer)" install --no-dev --optimize-autoloader --no-interaction

# Vue / meta-tags / webpack — если в коммите менялись resources/js|sass или нет свежего public/js/app.js:
cd "$APP" && npm ci && NODE_OPTIONS=--openssl-legacy-provider npm run production
chown -R cabinet_data_usr:cabinet_data_usr "$APP/public/js" "$APP/public/css" "$APP/mix-manifest.json"
# иначе достаточно уже собранного public/js/app.js из git

chown -R cabinet_data_usr:cabinet_data_usr "$APP"
chmod -R ug+rwx "$APP/storage" "$APP/bootstrap/cache"

sudo -u cabinet_data_usr $PHP "$APP/artisan" config:clear
sudo -u cabinet_data_usr $PHP "$APP/artisan" config:cache
sudo -u cabinet_data_usr $PHP "$APP/artisan" route:cache
sudo -u cabinet_data_usr $PHP "$APP/artisan" view:cache

# php artisan migrate --force   # только по согласованию (общая БД с lk)

curl -sI https://cabinet.datagon.ru/login | head -5
```

Проверка: в панели у сайта PHP **7.4**, document root → **`.../public`**.

### Без FastPanel (PM2 + :3002)

Если кабинет поднят как `php artisan serve` на **3002** (не ваш случай на s3):

```bash
cd /var/www/cabinet_data_usr/data/www/cabinet.datagon.ru
git fetch origin && git checkout main && git reset --hard origin/main
php7.4 "$(which composer)" install --no-dev --optimize-autoloader
php7.4 artisan config:cache && php7.4 artisan route:cache && php7.4 artisan view:cache
pm2 restart cabinet-datagon
curl -sI http://127.0.0.1:3002/login | head -3
```

### От root (если `dubious ownership`)

```bash
git config --global --add safe.directory /var/www/cabinet_data_usr/data/www/cabinet.datagon.ru
```

Лучше деплой от **`cabinet_data_usr`**:

```bash
sudo -u cabinet_data_usr -H bash -l
cd /var/www/cabinet_data_usr/data/www/cabinet.datagon.ru
# … те же git / composer / pm2 …
```

---

## Mac → GitHub → сервер

```bash
cd /Users/stanislav/Documents/projects/cabinet.datagon.ru
git add -A && git commit -m "…" && git push origin main
# затем на VPS — блок «Обновление» выше
```

---

## Что не трогать при pull

| Файл / каталог | Причина |
|----------------|---------|
| `.env` | секреты, `DB_HOST=178.250.157.140` |
| `storage/` | логи, кэш, загрузки |
| `vendor/` | пересобирается `composer install` |

---

## Cron / очереди

**Схема окружений и общей БД** — [cabinet-servers.md](./cabinet-servers.md) § «Окружения: где что проверять».

Кратко: MySQL на **`178.250.157.140`**; **lk** крутит supervisor + cron; **cabinet.datagon.ru** сейчас только `schedule:run`; **Mac** — `dev-cluster-queue.sh` с очередями `local_*`. Не чистить прод-очереди (`cluster_wait`, `default`, …) с локали без согласования.

Если на **lk.redbox.su** были `crontab` / `supervisor` для Laravel — продублировать на новом VPS только после cutover на **cabinet.datagon.ru**, иначе дублирование задач на одной БД.

На сервере должен крутиться планировщик Laravel (иначе не сработают ночные задачи из `app/Console/Kernel.php`):

```cron
* * * * * cd /path/to/cabinet.datagon.ru && php artisan schedule:run >> /dev/null 2>&1
```

Среди прочего: **`DeleteUnverifiedUsers`** — ежедневно в **02:15** (только в эту минуту срабатывает `schedule:run`). Удаляет пользователей без `email_verified_at` старше **30** дней (`.env`: `DELETE_UNVERIFIED_USERS`, `DELETE_UNVERIFIED_USERS_DAYS`).

Проверка вручную (из каталога проекта, не из `~`):

```bash
cd /var/www/cabinet_data_usr/data/www/cabinet.datagon.ru
/opt/php74/bin/php artisan users:prune-unverified --dry-run
/opt/php74/bin/php artisan users:prune-unverified
```

`schedule:run` в crontab с `>> /dev/null` **ничего не выводит**; в лог пишется строка, если есть кандидаты или удаления. Вне 02:15 задача через `schedule:run` **не запустится** — для теста используйте `users:prune-unverified`.

**Кластеризатор — автоудаление `cluster_results`:** ежедневно в **03:10** (`ClusterCleaningResults`), срок — `cluster_configuration.cleaning_interval` (страница `/cluster-configuration` → «Настройка автоудаления»). Ручная проверка:

```bash
cd /var/www/cabinet_data_usr/data/www/cabinet.datagon.ru
/opt/php74/bin/php artisan cluster:prune-results --dry-run
/opt/php74/bin/php artisan cluster:prune-results
```

В лог (`storage/logs/laravel-*.log`, уровень **info**) попадёт строка вида `ClusterCleaningResults: removed N of M cluster_results…`. Старый код писал только `Log::debug` — на проде с `LOG_LEVEL=info` удаление могло идти, но в логах было не видно.

---

## Troubleshooting после деплоя

### `Permission denied` на `.git/FETCH_HEAD`, `vendor/`, `chown: Operation not permitted`

**Симптом:** в приглашении SSH `cabinet_data_usr@s3`, а деплойный блок из § FastPanel не проходит — git, composer и `chown` падают с *Permission denied* / *Operation not permitted*.

**Причина:** репозиторий и `vendor/` когда-то обновляли от **root**; пользователь сайта не может ни перезаписать `vendor`, ни сделать `chown`.

**Исправление — один раз от root** (не под `cabinet_data_usr`):

```bash
ssh root@155.212.171.103   # или su - на s3

APP=/var/www/cabinet_data_usr/data/www/cabinet.datagon.ru
chown -R cabinet_data_usr:cabinet_data_usr "$APP"
chmod -R ug+rwx "$APP/storage" "$APP/bootstrap/cache"
```

Проверка:

```bash
ls -la "$APP/.git/FETCH_HEAD" "$APP/vendor" | head -3
# владелец: cabinet_data_usr
```

**Дальше деплой** — либо весь блок § FastPanel **от root** (как в доке: `git` + `composer` от root, `artisan` через `sudo -u cabinet_data_usr`), либо только под пользователем сайта:

```bash
sudo -u cabinet_data_usr -H bash -l
cd /var/www/cabinet_data_usr/data/www/cabinet.datagon.ru
# git / composer / artisan — см. «Канонический деплой» ниже
```

`cabinet_data_usr` **не в sudoers** — команда `chown` из его сессии **никогда** не сработает, это нормально.

### `dubious ownership` (git / composer)

Репозиторий когда-то трогали от **root** — у `cabinet_data_usr` git/composer отказываются работать.

```bash
# один раз от root:
chown -R cabinet_data_usr:cabinet_data_usr /var/www/cabinet_data_usr/data/www/cabinet.datagon.ru

# от cabinet_data_usr:
git config --global --add safe.directory /var/www/cabinet_data_usr/data/www/cabinet.datagon.ru
```

Дальше деплой **только** под `cabinet_data_usr`, не `root` — **или** весь цикл git/composer/chown от root, затем только `sudo -u cabinet_data_usr` для artisan.

### `your php version (8.3.6) does not satisfy ^7.4`

На s3 по умолчанию `php` = **8.3** — для кабинета **нельзя**. Нужен **PHP 7.4**:

```bash
php -v        # 8.3 — не использовать
php7.4 -v     # должен быть 7.4.x

composer install …   # так:  php7.4 $(which composer) install --no-dev --optimize-autoloader
# или:  php7.4 /usr/local/bin/composer install …
php7.4 artisan config:cache
```

Если `php7.4: command not found` — на s3 стоит только PHP 8.x. **Ставить 7.4 от root** (Ubuntu 22.04/24.04 — через PPA):

```bash
# только от root (ssh root@s3 или su -)
ls /usr/bin/php*    # что уже есть

apt update
apt install -y software-properties-common
add-apt-repository -y ppa:ondrej/php
apt update
apt install -y php7.4-cli php7.4-mysql php7.4-mbstring php7.4-xml php7.4-curl php7.4-zip php7.4-gd php7.4-bcmath php7.4-json

php7.4 -v
update-alternatives --config php   # по желанию; для кабинета всё равно вызывать php7.4 явно
```

Без root кабинет **не поднять** — `cabinet_data_usr` не в sudoers (это нормально).

**Ошибка:** залогинен как `cabinet_data_usr` и команда `sudo -u cabinet_data_usr …` — бессмысленна (sudo у этого пользователя нет). Нужен **`root@s3`**.

### `storage/logs/laravel.log` Permission denied

После деплоя от root файлы в `storage/` принадлежат root. Исправление:

```bash
sudo chown -R cabinet_data_usr:cabinet_data_usr storage bootstrap/cache
sudo chmod -R ug+rwx storage bootstrap/cache
```

### `Access denied for user 'lk_redbox_su_usr'@'127.0.0.1'`

**Симптом:** после деплоя на **cabinet.datagon.ru** (s3) — 500, в стеке `mysql:host=127.0.0.1`, запрос к `sessions`.

**Причина:** в `.env` на новом VPS остался **`DB_HOST=127.0.0.1`** (копия с lk на `178.250.157.140`). На s3 **нет** той же локальной MySQL с этим пользователем. БД по-прежнему на старом сервере — [cabinet-servers.md](./cabinet-servers.md).

**Исправление** (на s3, `.env` не в git):

```bash
APP=/var/www/cabinet_data_usr/data/www/cabinet.datagon.ru
PHP=/opt/php74/bin/php
nano "$APP/.env"
```

Минимум:

```env
APP_URL=https://cabinet.datagon.ru
DB_HOST=178.250.157.140
DB_PORT=3306
DB_DATABASE=lk_redbox_su_db
DB_USERNAME=lk_redbox_su_usr
DB_PASSWORD=<как на lk.redbox.su, не из git>
```

Рекомендуется (меньше запросов к удалённой БД на каждый хит):

```env
SESSION_DRIVER=file
```

Пересобрать кэш конфига (после правки `.env`):

```bash
sudo -u cabinet_data_usr $PHP "$APP/artisan" config:clear
sudo -u cabinet_data_usr $PHP "$APP/artisan" config:cache
```

Проверка с s3 (подставить пароль из `.env`):

```bash
mysql -h 178.250.157.140 -u lk_redbox_su_usr -p lk_redbox_su_db -e "SELECT 1"
```

Если **всё ещё** `Access denied` с `178.250.157.140` — на **старом VPS** MySQL не пускает IP `155.212.171.103`. Нужен `GRANT` для `lk_redbox_su_usr@'155.212.171.103'` (или `@'%'` по политике) и открытый 3306/firewall между серверами — см. [cabinet-servers.md](./cabinet-servers.md) § «Настройка .env».

**Безопасность:** если пароль БД попал в лог/скрин ошибки — сменить на MySQL и обновить `.env` на lk + cabinet.

### Редирект с cabinet.datagon.ru на lk.redbox.su

**Симптом:** открываете `http://cabinet.datagon.ru/` — браузер уходит на `https://lk.redbox.su/` (часто `/login`).

**Причина:** в `.env` на s3 осталось **`APP_URL=https://lk.redbox.su`** (копия с lk). Laravel для `redirect('/login')`, `route('login')` и т.п. собирает **абсолютный** URL из `config('app.url')`, не из текущего Host.

Проверка с Mac/сервера:

```bash
curl -sI http://cabinet.datagon.ru/ | grep -i location
# плохо: Location: http://lk.redbox.su/login
```

**Исправление** в `$APP/.env`:

```env
APP_URL=https://cabinet.datagon.ru
```

(если SSL только на https — не оставлять `http://` в APP_URL.)

```bash
sudo -u cabinet_data_usr $PHP "$APP/artisan" config:clear
sudo -u cabinet_data_usr $PHP "$APP/artisan" config:cache
curl -sI http://cabinet.datagon.ru/ | grep -i location
# ожидается: Location: https://cabinet.datagon.ru/login  (или относительный /login на том же хосте)
```

В коде нет отдельного «переключателя на lk» — только конфиг и кэш `config:cache`.

### Нет фото профиля / битая картинка в сайдбаре

**Причина:** аватары в `storage/app/public` (путь в БД, напр. `avatar/…`) лежат на **lk** (`178.250.157.140`). На s3 после rsync/git часто **нет** тех же файлов или нет симлинка `public/storage` — URL `https://cabinet.datagon.ru/storage/…` отдаёт 404.

**Исправление в `.env` на cabinet** (переходный период, пока файлы на lk):

```env
CABINET_STORAGE_URL=https://lk.redbox.su
```

Код подставляет `https://lk.redbox.su/storage/{path}`, если файла нет в `public/storage/` на s3.

```bash
sudo -u cabinet_data_usr $PHP "$APP/artisan" config:clear
sudo -u cabinet_data_usr $PHP "$APP/artisan" config:cache
```

**Дополнительно** (новые загрузки аватара уже на s3):

```bash
sudo -u cabinet_data_usr $PHP "$APP/artisan" storage:link
mkdir -p "$APP/storage/app/public/monitoring-favicons"
chmod -R ug+rwx "$APP/storage"
# Проверка: файл из storage отдаётся через PHP (обход 403 на /storage/ в nginx)
curl -sS -o /dev/null -w "%{http_code}\n" -b /tmp/cabinet.cookie \
  "https://cabinet.datagon.ru/monitoring-v2/favicon?project=ID"
```

**Мониторинг v2 — фавиконки:** в списке URL `/monitoring-v2/favicon?project={id}` (не `/storage/monitoring-favicons/` — на FastPanel часто **403**). PNG с lk на диск cabinet **один раз** (в `.env` ничего не оставляем).

**Важно:** не `php artisan` от root — системный `php` часто **8.3** → fatal `Collection::offsetExists` на Laravel 6. Только **`/opt/php74/bin/php`** от пользователя сайта:

```bash
APP=/var/www/cabinet_data_usr/data/www/cabinet.datagon.ru
PHP=/opt/php74/bin/php
cd "$APP"

sudo -u cabinet_data_usr $PHP -v   # должно быть PHP 7.4.x

sudo -u cabinet_data_usr $PHP artisan monitoring:import-favicons-from-legacy --from=https://lk.redbox.su --probe -v
# если probe → http_403: HTTP с lk не отдаёт /storage/ (как на cabinet). Копировать файлы по SSH/rsync:

# на сервере lk (путь уточнить), затем на s3:
# rsync -avz USER@LK_HOST:/var/www/.../storage/app/public/monitoring-favicons/ \
#   "$APP/storage/app/public/monitoring-favicons/"

sudo -u cabinet_data_usr $PHP artisan monitoring:import-favicons-from-legacy --from-disk="$APP/storage/app/public" --dry-run
# --from-disk = каталог storage/app/public *после* rsync (не URL)

# 211 проектов: в БД есть favicon_path, файла нет — не --missing, а --no-file:
sudo -u cabinet_data_usr $PHP artisan monitoring:refresh-favicons --no-file --limit=20
sudo -u cabinet_data_usr $PHP artisan monitoring:refresh-favicons --no-file

# --missing = только где favicon_path IS NULL (редкие кириллические домены)
sudo -u cabinet_data_usr $PHP artisan monitoring:refresh-favicons --missing
```

`CABINET_STORAGE_URL` — только для **аватаров/прочего** storage, не для фавиконок мониторинга.

После cutover и полного переноса `storage/` — убрать `CABINET_STORAGE_URL` или указать `https://cabinet.datagon.ru`.

### Composer: `Continue as root/super user [yes]?`

**Причина:** `composer install` запущен от **root** без флагов — Composer 2.x останавливается и ждёт ввод.

**Сейчас в сессии:** ввести `yes` и Enter — деплой продолжится. Либо `Ctrl+C` и перезапустить одну строку:

```bash
APP=/var/www/cabinet_data_usr/data/www/cabinet.datagon.ru
PHP=/opt/php74/bin/php
cd "$APP"
COMPOSER_ALLOW_SUPERUSER=1 $PHP "$(which composer)" install --no-dev --optimize-autoloader --no-interaction
```

**Лучше без root-предупреждения:** после `git reset` и если владелец каталога уже `cabinet_data_usr`:

```bash
sudo -u cabinet_data_usr $PHP "$(which composer)" install --no-dev --optimize-autoloader --no-interaction
```

(после `composer` от root всё равно нужен `chown -R cabinet_data_usr:cabinet_data_usr "$APP"`.)

### `composer: command not found`

У root часто нет composer в `PATH`. Варианты:

```bash
which composer          # или: ls /usr/local/bin/composer
# от пользователя сайта:
sudo -u cabinet_data_usr -H bash -l
cd /var/www/cabinet_data_usr/data/www/cabinet.datagon.ru
composer install --no-dev --optimize-autoloader
```

Если composer только как phar: `php7.4 /usr/local/bin/composer install …`

### `Collection::offsetExists` / Fatal на `artisan`

**Причина:** вызван **`php` 8.x**, а проект — **Laravel 6, только PHP 7.4**.

```bash
php -v                  # часто 8.1/8.2 — так нельзя
php7.4 -v               # должен быть 7.4.x
```

Все команды только через **php7.4**:

```bash
php7.4 artisan config:cache
php7.4 artisan route:cache
php7.4 artisan view:cache
```

PM2 тоже с 7.4 (см. ниже), не `pm2 start php -- …`.

### `[PM2][ERROR] Process … cabinet-datagon not found`

Процесс **ещё не создавали** (в `pm2 list` только `datagon-site` — это Next на :3001).

Первый запуск кабинета:

```bash
sudo -u cabinet_data_usr bash -lc '
  cd /var/www/cabinet_data_usr/data/www/cabinet.datagon.ru
  pm2 delete cabinet-datagon 2>/dev/null || true
  pm2 start php7.4 --name cabinet-datagon -- artisan serve --host=127.0.0.1 --port=3002
  pm2 save
'
pm2 list
curl -sI http://127.0.0.1:3002/login | head -5
```

Если бинарь называется иначе: `update-alternatives --list php` или `/usr/bin/php7.4`.

### Деплой от root (без пароля cabinet_data_usr)

Пароль пользователя сайта **не нужен**: с root вызываем `sudo -u cabinet_data_usr …` — sudo спрашивает только root.

```bash
APP=/var/www/cabinet_data_usr/data/www/cabinet.datagon.ru
cd "$APP"

# git (от root)
git config --global --add safe.directory "$APP"
git fetch origin && git checkout main && git reset --hard origin/main

# зависимости — PHP 7.4, не «php» 8.3
php7.4 -v || { echo "Нет php7.4 — apt install php7.4-cli …"; exit 1; }
php7.4 "$(which composer)" install --no-dev --optimize-autoloader

# владелец для веб/логов (после install)
chown -R cabinet_data_usr:cabinet_data_usr "$APP"
chmod -R ug+rwx "$APP/storage" "$APP/bootstrap/cache"

# artisan и PM2 — от имени сайта, без пароля
sudo -u cabinet_data_usr php7.4 "$APP/artisan" config:clear
sudo -u cabinet_data_usr php7.4 "$APP/artisan" config:cache
sudo -u cabinet_data_usr php7.4 "$APP/artisan" route:cache
sudo -u cabinet_data_usr php7.4 "$APP/artisan" view:cache

sudo -u cabinet_data_usr bash -lc "
  cd \"$APP\"
  pm2 delete cabinet-datagon 2>/dev/null || true
  pm2 start php7.4 --name cabinet-datagon -- artisan serve --host=127.0.0.1 --port=3002
  pm2 save
"

curl -sI http://127.0.0.1:3002/login | head -5
```

PM2 и `artisan` лучше всегда гонять через `sudo -u cabinet_data_usr`, чтобы логи и процесс не оставались на root.

---

### Канонический деплой на s3 (логин под cabinet_data_usr)

**Шаг 0 — один раз от root** (если раньше деплоили под root):

```bash
chown -R cabinet_data_usr:cabinet_data_usr /var/www/cabinet_data_usr/data/www/cabinet.datagon.ru
```

**Шаг 1 — под `cabinet_data_usr` (или через sudo -u с root):**

```bash
sudo -u cabinet_data_usr -H bash -l
cd /var/www/cabinet_data_usr/data/www/cabinet.datagon.ru

git config --global --add safe.directory /var/www/cabinet_data_usr/data/www/cabinet.datagon.ru

git fetch origin && git checkout main && git reset --hard origin/main

php7.4 -v   # обязательно 7.4; если нет — см. выше «8.3.6»

php7.4 $(which composer) install --no-dev --optimize-autoloader

chmod -R ug+rwx storage bootstrap/cache

php7.4 artisan config:clear
php7.4 artisan config:cache
php7.4 artisan route:cache
php7.4 artisan view:cache

pm2 delete cabinet-datagon 2>/dev/null || true
pm2 start php7.4 --name cabinet-datagon -- artisan serve --host=127.0.0.1 --port=3002
pm2 save
pm2 status

curl -sI http://127.0.0.1:3002/login | head -5
```

---

## Telegram: исходящий 443 с VPS (cabinet.datagon.ru / s3)

**Симптом:** в `storage/logs/laravel-*.log` — `Failed to connect to api.telegram.org port 443 ... Timeout`; кнопка «Тест Telegram» на `/backlink` и cron `scan-broken-links` не шлют сообщения. С сервера `curl https://api.telegram.org` — таймаут, при этом `curl https://google.com` может отвечать.

**Причина:** провайдер/VPS блокирует исходящие к Telegram. MTProto-прокси **не** подходит для Bot API (нужен обычный **SOCKS5** или HTTP-прокси).

**Диагностика по шагам** (все команды — **на s3**, подставить HOST/PORT/USER/PASS из панели прокси):

```bash
# 1) Доходит ли TCP до прокси? (должно: succeeded / Connected — за 1–3 с, не 15 с таймаут)
nc -vz -w 5 HOST PORT
# альтернатива:
timeout 5 bash -c 'echo >/dev/tcp/HOST/PORT' && echo "port open" || echo "port closed/timeout"

# 2) Прокси живой? (ожидается быстрый ответ 407 Proxy Authentication Required)
curl -sS --max-time 8 -v "http://HOST:PORT" 2>&1 | head -15

# 3) Telegram через SOCKS5 (ожидается 302, не 000)
curl -sS --max-time 15 -x "socks5://USER:PASS@HOST:PORT" -o /dev/null -w "%{http_code}\n" https://api.telegram.org/

# 4) Напрямую к Telegram с s3 (часто 000 — блокировка VPS)
curl -sS --max-time 8 -o /dev/null -w "%{http_code}\n" https://api.telegram.org/
```

**Если шаг 1 или 2 — таймаут 15 с / `000`:** с IP **155.212.171.103** до прокси **нет маршрута** (фаервол хостинга s3, фаервол у поставщика прокси, прокси только для «домашних» IP). Код кабинета тут не поможет — нужен другой прокси или **whitelist IP s3** у поставщика (`155.212.171.103`).

**Если шаг 2 быстрый (407), а шаг 3 — таймаут 15 с:** TCP до прокси есть, но туннель до Telegram не поднимается. На s3 по очереди:

```bash
curl -sS --max-time 15 -x "socks5h://USER:PASS@HOST:PORT" -o /dev/null -w "socks5h %{http_code}\n" https://api.telegram.org/
curl -sS --max-time 15 -x "http://USER:PASS@HOST:PORT" -o /dev/null -w "http %{http_code}\n" https://api.telegram.org/
curl -v --max-time 15 -x "socks5://USER:PASS@HOST:PORT" https://api.telegram.org/ 2>&1 | tail -20
```

В `.env` при успехе `socks5h` → `TELEGRAM_PROXY=socks5h://...` (не `socks5://`). Порт 8000 с ответом `407` на `http://HOST:PORT` — это **HTTP-прокси**; если сработает только `http://`, задать его в `TELEGRAM_PROXY`.

Если все три варианта — `000`/таймаут: у поставщика прокси **не пускает исходящий трафик к Telegram** с IP VPS `155.212.171.103` (нужен другой тариф/прокси «для серверов» или whitelist IP s3).

**Если с Mac прокси отвечает 302, а с s3 — нет:** типичный случай — прокси не пускает дата-центровые IP; проверка только с s3 (шаги 1–3).

**Один `.env` для local и s3:** везде **`socks5h://`** (Mac и s3 → curl **302**; `http://` с Mac часто таймаут; `https://` к прокси — не использовать).

```bash
curl -sS --max-time 15 -x "socks5h://USER:PASS@HOST:PORT" -o /dev/null -w "%{http_code}\n" https://api.telegram.org/
```

```env
TELEGRAM_BOT_TOKEN=...
TELEGRAM_PROXY=socks5h://USER:PASS@HOST:PORT
```

На s3 после копирования `.env`: `APP_URL=https://cabinet.datagon.ru`, `php7.4 artisan config:clear && php7.4 artisan config:cache`.

Код: `TelegramBotService` читает `config('app.telegram_proxy')` → `CURLOPT_PROXY`. Локально переменную можно не задавать.

**Проверка после деплоя:** админ → шестерёнка → **Управление прокси** (`/admin/telegram-proxy`) — статус «Через TELEGRAM_PROXY» OK, тестовое сообщение в Telegram. Чек-лист модулей: [cabinet-telegram-proxy.md](./cabinet-telegram-proxy.md).

---

## Связанные документы

- [cabinet-servers.md](./cabinet-servers.md) — IP, БД, порты
- [cabinet-git.md](./cabinet-git.md) — git, Mac, 419 на локали
- [deploy.md](./deploy.md) — маркетинг datagon.ru
