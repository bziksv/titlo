# Деплой marketing-сайта (Next.js)

Продукт (Laravel) — **lk.redbox.su** (прод, БД на `178.250.157.140`); **cabinet.datagon.ru** на `155.212.171.103`, порт **3002** — деплой **отдельно**: [cabinet-deploy.md](./cabinet-deploy.md). Этот файл — только маркетинг (Next), порт **3001**.

## Сборка

```bash
npm ci
npm run build
npm run start   # standalone, http://localhost:3001 (после build)
```

Переменные окружения — см. `.env.example` (`NEXT_PUBLIC_LK_URL`, `LK_API_BASE_URL` для BFF, `NEXT_PUBLIC_YM_ID` для Метрики; по умолчанию в коде `54591493` с live Kraken).

В `next.config.ts` включён **`output: "standalone"`** — один `server.js` для Docker/VPS.

## Docker (рекомендуется для VPS)

```bash
# Сборка и запуск
npm run docker:up

# Или вручную
docker compose build
docker compose up -d
```

Проверка:

```bash
curl http://localhost:3001/api/health/
npm run smoke
```

Остановка: `docker compose down`.

Перед `npm run build` остановите `npm run dev` (иначе возможны ошибки сборки).

### Локальный dev: типичные проблемы

| Симптом | Решение |
|--------|---------|
| `EADDRINUSE :::3001` | Уже запущен старый dev/PM2: `npm run dev:stop`, затем `npm run dev` |
| `Cannot find module './873.js'` | Битый `.next`: `npm run dev:stop`, `rm -rf .next`, `npm run dev` или `npm run dev:fresh` |
| Страница 500 после правок | Hard refresh; при необходимости `dev:fresh` |

`npm run dev` и `npm run start` — **разные режимы** (hot reload vs production standalone). Не держите оба на порту 3001.

## Smoke-тест URL

После `npm run build && npm run start` или деплоя:

```bash
npm run smoke
# другой хост:
BASE_URL=https://staging.example.com npm run smoke
```

Проверяются **все** модули (18), новости (30), юр. страницы, sitemap/robots и редиректы Битрикса.

### Сверка с sitemap Битрикса

Пока live ещё на Битриксе — проверить, что новый билд покрывает все URL из их sitemap:

```bash
BASE_URL=http://localhost:3001 npm run compare:sitemap
```

### Nginx

Пример прокси на порт 3001: [nginx-redbox.example.conf](./nginx-redbox.example.conf) (подставьте `datagon.ru` или `redbox.su` в `server_name`).

## VPS: git + PM2 (production)

Репозиторий: [github.com/bziksv/site_seo_datagon](https://github.com/bziksv/site_seo_datagon).

**titlo.ru** (целевой маркетинг): [titlo-deploy.md](./titlo-deploy.md), git [bziksv/titlo](https://github.com/bziksv/titlo).

Репозиторий legacy **datagon.ru**: [github.com/bziksv/site_seo_datagon](https://github.com/bziksv/site_seo_datagon).

### Первый деплой

```bash
cd /var/www/datagon_ru_usr/data/www/datagon.ru
git clone https://github.com/bziksv/site_seo_datagon.git .
cp .env.example .env.local
nano .env.local   # SMTP, LK, PORT=3001
npm ci
npm run build
pm2 start npm --name datagon-site -- start
pm2 save
curl http://127.0.0.1:3001/api/health/
```

### Обновление после `git push`

```bash
cd /var/www/datagon_ru_usr/data/www/datagon.ru
git fetch origin
git checkout main
git reset --hard origin/main
npm ci
npm run build
pm2 restart datagon-site
pm2 status
```

### Если на сайте «старая» страница модуля

Симптом: на https://datagon.ru/analiz-relevantnosti/ видны блоки **«Инструкция по работе с модулем»** / **«Принцип работы сервиса»** (скрап), а не **«Как устроена технология»** и кастомный hero.

На **сервере** по шагам:

```bash
cd /var/www/datagon_ru_usr/data/www/datagon.ru

# 1. Тот ли коммит (должен быть с AnalizRelevantnostiLanding)
git rev-parse HEAD
git log -1 --oneline
grep AnalizRelevantnosti app/\[slug\]/page.tsx || echo "НЕТ в page.tsx — git pull не доехал"

# 2. Чистая сборка (обязательно после pull)
npm run dev:stop 2>/dev/null || true
rm -rf .next
npm ci
npm run build

# 3. Перезапуск standalone (не next dev)
pm2 delete datagon-site 2>/dev/null || true
pm2 start npm --name datagon-site -- start
pm2 save

# 4. Сначала localhost — без nginx
curl -s http://127.0.0.1:3001/analiz-relevantnosti/ | grep -o "Как устроена технология" | head -1
# должна быть строка; если пусто — build/PM2 всё ещё старые

# 5. С Mac после деплоя
BASE_URL=https://datagon.ru npm run verify:relevance
BASE_URL=https://datagon.ru npm run verify:monitoring
BASE_URL=https://datagon.ru npm run verify:competitor
BASE_URL=https://datagon.ru npm run verify:html-editor
BASE_URL=https://datagon.ru npm run verify:http-headers
BASE_URL=https://datagon.ru npm run verify:roi
BASE_URL=https://datagon.ru npm run verify:utm
BASE_URL=https://datagon.ru npm run verify:list-compare
BASE_URL=https://datagon.ru npm run verify:password-gen
BASE_URL=https://datagon.ru npm run verify:text-length
BASE_URL=https://datagon.ru npm run verify:dedup
BASE_URL=https://datagon.ru npm run verify:word-gen
BASE_URL=https://datagon.ru npm run verify:meta-mon
BASE_URL=https://datagon.ru npm run verify:site-mon
```

Частые причины: **сборка не запускали** или упала с ошибкой; **PM2 крутит dev** или старый процесс на `:3001`; **не тот каталог** (не `datagon.ru`); на порту 3001 **два процесса** — nginx попадает не в тот.

На Mac перед этим:

```bash
cd /Users/stanislav/Documents/projects/datagon.ru
git add -A
git commit -m "update all files"
git push origin main
```

**Важно:** нужен полный `npm ci` и `npm run build` (не только `npm ci --omit=dev`). Секреты — только в `.env.local` на сервере, не в git.

## Vercel / аналог

- Build: `npm run build`
- Env: `NEXT_PUBLIC_LK_URL=https://lk.redbox.su`, `LK_API_BASE_URL=https://lk.redbox.su`
- Standalone не обязателен на Vercel (платформа собирает сама).

## CI

Шаблон workflow: [ci-workflow.yml.example](./ci-workflow.yml.example) — скопировать в `.github/workflows/ci.yml` при необходимости (`lint` + `build`). Для push через PAT нужен scope **workflow** (или добавить файл вручную на GitHub).

## Переключение домена (redbox.su / datagon.ru)

1. Поднять staging (`docker compose` или preview), выполнить `BASE_URL=… npm run smoke`.
2. DNS `redbox.su` → новый хост (A/CNAME), SSL на edge.
3. Повторить smoke на production URL.
4. Отключить Битрикс (или read-only для отката).

Редиректы наследия — `next.config.ts`.

## Обновление контента

| Что | Команда |
|-----|---------|
| Новости (+ картинки в `public/news/assets/`) | `npm run scrape:news` |
| Только зеркало картинок новостей | `npm run mirror:news-images` |
| Юр. тексты | `npm run scrape:legal` |
| YouTube на лендингах | `npm run scrape:module-videos` |
| Тексты и скриншоты модулей | `npm run scrape:modules` → `public/modules/assets/` |

После скрапа — commit `*.generated.ts`, `public/news/assets/*` и redeploy.

## Staging перед cutover

```bash
# 1. Сборка
npm ci && npm run build && npm run start

# 2. Smoke на staging-хосте
BASE_URL=https://staging.redbox.su npm run smoke
BASE_URL=https://staging.redbox.su npm run compare:sitemap

# 3. Форма (нужен SMTP — см. .env.example, или lk / CONTACT_WEBHOOK_URL)
curl -sS -X POST "$BASE_URL/api/contact/" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test","email":"t@example.com","message":"Smoke test contact","agree":true}'
```

Форма на production: см. [lk-contact-api.md](./lk-contact-api.md).
