# Деплой cabinet.titlo.ru (Laravel, FastPanel s3)

**VPS:** `155.212.171.103` (**FastPanel**).  
**Путь к коду:** `/var/www/cabinet_titl_usr/data/www/cabinet.titlo.ru`  
**Git:** [github.com/bziksv/cabinet.titlo](https://github.com/bziksv/cabinet.titlo)  
**БД:** пока `178.250.157.140` — [cabinet-servers.md](./cabinet-servers.md)

Маркетинг **titlo.ru** (Next, PM2 :3003) — [titlo-deploy.md](./titlo-deploy.md).

---

## FastPanel — как у cabinet.datagon.ru (без PM2)

На **s3** кабинет отдаёт **nginx → PHP-FPM 7.4**, не `artisan serve` и **не PM2**.

| Параметр в панели | Значение |
|-------------------|----------|
| Домен | `cabinet.titlo.ru` |
| Пользователь | `cabinet_titl_usr` |
| **PHP version** | **7.4** (php74) |
| **PHP mode** | **PHP-FPM** |
| **Document root** | `/var/www/cabinet_titl_usr/data/www/cabinet.titlo.ru/public` ← **`/public`** |
| SSL | Let's Encrypt в панели |

Полная инструкция FastPanel: [cabinet-deploy.md](./cabinet-deploy.md) § FastPanel.

---

## Первый деплой (SSH root@s3)

```bash
APP=/var/www/cabinet_titl_usr/data/www/cabinet.titlo.ru
PHP=/opt/php74/bin/php
USER=cabinet_titl_usr

cd "$APP"
git config --global --add safe.directory "$APP"

# если ещё не клонировали:
# git clone https://github.com/bziksv/cabinet.titlo.git .

cp /var/www/cabinet_data_usr/data/www/cabinet.datagon.ru/.env "$APP/.env"
sed -i 's|APP_URL=.*|APP_URL=https://cabinet.titlo.ru|' "$APP/.env"
sed -i 's|APP_NAME=.*|APP_NAME=Титло|' "$APP/.env"

COMPOSER_ALLOW_SUPERUSER=1 $PHP "$(which composer)" install --no-dev --optimize-autoloader --no-interaction

cd "$APP" && npm ci && NODE_OPTIONS=--openssl-legacy-provider npm run production

chown -R $USER:$USER "$APP"
chmod -R ug+rwx "$APP/storage" "$APP/bootstrap/cache"

# storage/ не в git — скопировать с cabinet.datagon (или mkdir skeleton)
rsync -a /var/www/cabinet_data_usr/data/www/cabinet.datagon.ru/storage/ "$APP/storage/" \
  --exclude='logs/*.log' --exclude='debugbar'
mkdir -p "$APP/storage/framework/"{cache,sessions,views} "$APP/storage/logs"

sudo -u $USER $PHP "$APP/artisan" storage:link
sudo -u $USER $PHP "$APP/artisan" config:clear
sudo -u $USER $PHP "$APP/artisan" config:cache
sudo -u $USER $PHP "$APP/artisan" route:clear
sudo -u $USER $PHP "$APP/artisan" view:cache
```

**Убрать ошибочный PM2** (если запускали по старой инструкции):

```bash
pm2 delete cabinet-titlo 2>/dev/null || true
pm2 save
```

Проверка (через vhost панели, не порт 3004):

```bash
curl -sI https://cabinet.titlo.ru/login | head -5
# или до SSL:
curl -sI -H "Host: cabinet.titlo.ru" http://127.0.0.1/login | head -5
```

Cron (в панели или crontab пользователя сайта):

```cron
* * * * * cd /var/www/cabinet_titl_usr/data/www/cabinet.titlo.ru && /opt/php74/bin/php artisan schedule:run >> /dev/null 2>&1
```

---

## Обновление после `git push`

```bash
APP=/var/www/cabinet_titl_usr/data/www/cabinet.titlo.ru
PHP=/opt/php74/bin/php
USER=cabinet_titl_usr
cd "$APP"

git fetch origin && git checkout main && git reset --hard origin/main

COMPOSER_ALLOW_SUPERUSER=1 $PHP "$(which composer)" install --no-dev --optimize-autoloader --no-interaction

# если менялись resources/js|sass:
NODE_OPTIONS=--openssl-legacy-provider npm run production

chown -R $USER:$USER "$APP"

sudo -u $USER $PHP artisan config:clear
sudo -u $USER $PHP artisan config:cache
sudo -u $USER $PHP artisan route:clear
sudo -u $USER $PHP artisan view:cache

curl -sI https://cabinet.titlo.ru/login | head -3
```

---

## Частые ошибки на s3

| Симптом | Решение |
|---------|---------|
| `php ^7.4 but 8.3.6` | Только `$PHP=/opt/php74/bin/php`, не `php` |
| `digital envelope routines::unsupported` | `NODE_OPTIONS=--openssl-legacy-provider npm run production` |
| `vendor/autoload.php` missing | composer не прошёл — повторить с php74 |
| 500 / белая страница | Document root в панели → **`.../public`**, PHP **7.4 FPM** |
| PM2 `cabinet-titlo` | **Удалить** — на FastPanel не нужен |
| `route:cache` → Closure | Использовать **`route:clear`**, не `route:cache` |
| `storage/` missing | `rsync` с cabinet.datagon или `mkdir -p storage/framework/...` |

---

## Локально (Mac)

`./scripts/dev-serve.sh` → http://localhost:3002, `DB_HOST=178.250.157.140`.

## Cutover

DNS + SSL для `cabinet.titlo.ru`, проверка входа с titlo.ru.
