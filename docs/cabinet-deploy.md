# Деплой cabinet.datagon.ru (Laravel)

**Сервер:** `155.212.171.103`  
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
chmod -R ug+rwx "$APP/storage"
```

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

## Связанные документы

- [cabinet-servers.md](./cabinet-servers.md) — IP, БД, порты
- [cabinet-git.md](./cabinet-git.md) — git, Mac, 419 на локали
- [deploy.md](./deploy.md) — маркетинг datagon.ru
