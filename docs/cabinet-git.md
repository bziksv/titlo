# Git: cabinet.datagon.ru

Репозиторий: **[github.com/bziksv/cabinet.datagon.ru](https://github.com/bziksv/cabinet.datagon.ru)**.

**Прод-поддомен:** `cabinet.datagon.ru` → приложение на **`127.0.0.1:3002`** (маркетинг datagon.ru — **3001**, не смешивать).

Код на сервере: `155.212.171.103` → `/var/www/cabinet_data_usr/data/www/cabinet.datagon.ru`.  
Локально: `/Users/stanislav/Documents/projects/cabinet.datagon.ru`.

Деплой и БД на старом сервере — [cabinet-servers.md](./cabinet-servers.md).

---

## 1. Первый push с VPS (155.212.171.103)

SSH на новый сервер. **Не от root**, если каталог принадлежит пользователю сайта — иначе `dubious ownership`:

```bash
# вариант A (предпочтительно): от владельца каталога
sudo -u cabinet_data_usr -H bash -l
cd /var/www/cabinet_data_usr/data/www/cabinet.datagon.ru
```

Если уже под **root**:

```bash
git config --global --add safe.directory /var/www/cabinet_data_usr/data/www/cabinet.datagon.ru
cd /var/www/cabinet_data_usr/data/www/cabinet.datagon.ru
```

Дальше:

```bash
cd /var/www/cabinet_data_usr/data/www/cabinet.datagon.ru

# Не коммитить секреты и тяжёлое
test -f .gitignore || cat > .gitignore <<'EOF'
/.phpunit.cache
/node_modules
/public/hot
/public/storage
/storage/*.key
/storage/logs/*
!/storage/logs/.gitignore
/storage/framework/cache/*
!/storage/framework/cache/.gitignore
/storage/framework/sessions/*
!/storage/framework/sessions/.gitignore
/storage/framework/views/*
!/storage/framework/views/.gitignore
/vendor
.env
.env.*
!.env.example
.phpunit.result.cache
Homestead.json
Homestead.yaml
auth.json
npm-debug.log
yarn-error.log
/.fleet
/.idea
/.vscode
EOF

git init
git add -A
git status   # убедиться: нет .env и vendor/

git commit -m "Initial import from lk.redbox.su (cabinet.datagon.ru VPS)"

git branch -M main
git remote add origin https://github.com/bziksv/cabinet.datagon.ru.git
git push -u origin main
```

### Авторизация GitHub с сервера

- **HTTPS + PAT:** при `git push` логин `bziksv`, пароль — [Personal Access Token](https://github.com/settings/tokens) с правом `repo`.
- **SSH:** `git remote set-url origin git@github.com:bziksv/cabinet.datagon.ru.git` и ключ `~/.ssh/id_ed25519` добавлен в GitHub.

Если репозиторий на GitHub уже с README/LICENSE — перед push:

```bash
git pull origin main --allow-unrelated-histories
# разрешить конфликты, если есть
git push -u origin main
```

---

## 2. Клон на Mac (локальная папка проекта)

После успешного `git push` на сервере:

```bash
cd /Users/stanislav/Documents/projects

# В папке только наш README — проще пересоздать каталог
mv cabinet.datagon.ru/README.md /tmp/cabinet-datagon-readme.md 2>/dev/null || true
rm -rf cabinet.datagon.ru

git clone https://github.com/bziksv/cabinet.datagon.ru.git cabinet.datagon.ru

cd cabinet.datagon.ru
cp /tmp/cabinet-datagon-readme.md README.md 2>/dev/null || true
# или оставить README из репо, если добавите его в git на сервере

composer install
cp .env.example .env   # если есть example; реальный .env — только локально, не в git
php artisan key:generate
```

Открыть в Cursor multi-root workspace: `datagon.ru` + `cabinet.datagon.ru`.

### Обновление после изменений на сервере или в git

```bash
cd /Users/stanislav/Documents/projects/cabinet.datagon.ru
git pull origin main
export PATH="/opt/homebrew/opt/php@7.4/bin:$PATH"   # Laravel 6, нужен PHP 7.4
composer install --no-dev
./scripts/dev-local.sh detach   # http://localhost:3002 (nginx+php-fpm; нужен brew install nginx)
```

### Локально на Mac (проверено)

| Шаг | Статус |
|-----|--------|
| Файл с VPS должен называться **`.env`**, не `env` | переименовать вручную |
| PHP **7.4** (`brew install shivammathur/php/php@7.4`) | PHP 8.3 ломает Laravel 6 |
| `composer install` | OK на 7.4 |
| `storage/`, `php artisan storage:link` | создать при отсутствии |
| `APP_URL=http://localhost:3002` | в `.env` |
| `LOG_CHANNEL=stderr` | на Mac, если 500 и «Operation not permitted» на `storage/logs` |
| Ссылки в меню с БД | в `local` подменяются с `lk.redbox.su` на `APP_URL` (`localize_cabinet_url`) |
| WebSocket в консоли | локально `BROADCAST_DRIVER=log`, Echo отключён (не нужен `laravel-websockets` на Mac) |
| Аватар 404 | дефолт `public/img/user-icon.svg` |
| MySQL | в скачанном `.env` было `DB_HOST=127.0.0.1` — для Mac заменить на **`178.250.157.140`** (БД на старом VPS; порт 3306 с Mac открыт) |

```env
DB_HOST=178.250.157.140
DB_PORT=3306
LOG_CHANNEL=stderr
```

Туннель нужен только если firewall закроет 3306 с вашего IP.

**Порты на Mac:** маркетинг `datagon.ru` — `npm run dev` → **3001**; кабинет — `./scripts/dev-local.sh` / `dev-serve.sh` → **3002**. Не путать: Next на 3002 даёт **419** на логине Laravel.

**Логи локального кабинета:**

| Файл | Содержимое |
|------|------------|
| `/tmp/cabinet-dev.log` | запуск serve, health-check, вывод `artisan serve` |
| `storage/logs/cabinet-dev.log` | копия того же |
| `storage/logs/laravel-YYYY-MM-DD.log` | ошибки Laravel (таймауты БД на `178.250.157.140` и т.д.) |

```bash
tail -f /tmp/cabinet-dev.log
bash scripts/dev-local.sh status
bash scripts/cabinet-diagnose.sh   # снимок в /tmp/cabinet-dev.log
```

`npm run dev:all` поднимает кабинет через **`dev-local.sh`** (один процесс на :3002, без 3 воркеров — они зависали на удалённой БД).

Полный справочник (роуты, middleware, ошибки): **[cabinet-reference.md](./cabinet-reference.md)**.

```bash
# маркетинг
cd /Users/stanislav/Documents/projects/datagon.ru
npm run dev:stop && rm -rf .next && npm run dev

# кабинет (другой терминал)
cd /Users/stanislav/Documents/projects/cabinet.datagon.ru
./scripts/dev-serve.sh
```

### 419 Page Expired при логине

В `APP_ENV=local` CSRF отключён в `VerifyCsrfToken`. Если 419 всё же есть — на порту **3002** крутится не Laravel, а Next (`npm run dev` на 3001/3002): остановить маркетинг, перезапустить `./scripts/dev-serve.sh`.

Адрес в браузере должен совпадать с `APP_URL` (обычно `http://localhost:3002`). Не смешивать **localhost** и **127.0.0.1** — разные cookies. Очистить cookies для обоих хостов → снова http://localhost:3002/login .

### «Maximum execution time of 60 seconds exceeded» после входа

Middleware `CheckHttpHeadersDataBase` на **каждый** запрос делает `DELETE` по таблице `http_headers` на удалённой БД — долго. В `.env`:

```env
HTTP_HEADERS_CLEANUP_ON_REQUEST=false
APP_ENV=local
```

Перезапустить `./scripts/dev-serve.sh`. На VPS cabinet — то же в `.env`, если БД на `178.250.157.140`.

### Чёрный экран / «не грузится» после входа

Удалённая БД + тяжёлые middleware на **каждый** запрос (`DeleteTariffByUsers`, `VisitStatistics`, очистка `http_headers`). В `.env` для Mac:

```env
HTTP_HEADERS_CLEANUP_ON_REQUEST=false
SKIP_HEAVY_WEB_MIDDLEWARE=true
SESSION_DRIVER=file
```

`./scripts/dev-serve.sh` (PHP 300 сек). Страница может грузиться **10–20 сек** — подождите; не обрывайте загрузку в браузере.

### Не пускает дальше формы логина / «никуда не уходит»

**Запуск:** `./scripts/dev-serve.sh` или `./scripts/dev-parallel.sh` — три воркера (`13002–13004`) и прокси на **:3002** (параллельные запросы). Старый одиночный `artisan serve` на 3002 больше не используется.

```bash
./scripts/dev-parallel.sh stop
./scripts/dev-parallel.sh
```

Если зависло: `./scripts/dev-parallel.sh stop` и снова старт. Логи: `/tmp/cabinet-proxy.log`, `/tmp/cabinet-worker-*.log`.

1. `curl -I http://localhost:3002/login` → 200.
2. После «Войти» ждать **до 2 мин** (БД `178.250.157.140`).
3. В `.env`: `SKIP_EMAIL_VERIFICATION=true`, `SKIP_HEAVY_WEB_MIDDLEWARE=true`.
4. Опционально (после `brew install nginx`): `./scripts/dev-fpm.sh` — nginx + php-fpm.

Для проверки пароля без локальной очереди — **https://lk.redbox.su** .

### Деплой с git на VPS (после настройки)

```bash
cd /var/www/cabinet_data_usr/data/www/cabinet.datagon.ru
git pull origin main
composer install --no-dev --optimize-autoloader
php artisan migrate --force   # когда БД будет локальной
php artisan config:cache
```

`.env` на сервере **не в git** — править только на VPS.

---

## Troubleshooting

### `GH001: File db.sql is 1835 MB` / push rejected

Дамп БД **нельзя** в GitHub. На сервере:

```bash
cd /var/www/cabinet_data_usr/data/www/cabinet.datagon.ru

echo -e "db.sql\n*.sql.gz\n/vendor/\n.env" >> .gitignore

# Репозиторий ещё не на GitHub (push отклонён) — проще пересоздать .git:
rm -rf .git
git init
git add -A
git status   # нет db.sql, vendor/, .env
git commit -m "Initial import from lk.redbox.su (no db dump, no vendor)"
git branch -M main
git remote add origin https://github.com/bziksv/cabinet.datagon.ru.git
git push -u origin main
```

`db.sql` остаётся **только на диске VPS**, в git не коммитить.

### `fatal: detected dubious ownership`

Каталог создан/принадлежит `cabinet_data_usr`, git запущен от `root`. Решения:

1. `git config --global --add safe.directory /var/www/cabinet_data_usr/data/www/cabinet.datagon.ru` (от root), затем повторить commit/push.
2. Или все git-команды от `sudo -u cabinet_data_usr -H bash -l` (лучше для деплоя).

Проверка владельца: `ls -la /var/www/cabinet_data_usr/data/www/ | grep cabinet`.

---

## 3. Что не должно попасть в git

| Путь | Причина |
|------|---------|
| `.env` | секреты, `DB_HOST=178.250.157.140` |
| `db.sql`, `*.sql` | дампы БД (гигабайты, лимит GitHub 100 MB) |
| `vendor/` | `composer install` |
| `node_modules/` | `npm ci` |
| `storage/logs/*` | runtime |
| загруженные user files в `storage/app/` | по политике (часто исключают) |

Перед первым commit на сервере: `git status` и `git check-ignore -v .env`.

---

## Связанные документы

- [cabinet-servers.md](./cabinet-servers.md) — IP, пути, БД на старом сервере
