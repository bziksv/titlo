# Деплой titlo.ru (маркетинг)

**VPS:** `155.212.171.103` (тот же, что datagon.ru / cabinet.datagon.ru).  
**Путь:** `/var/www/titlo_ru_usr/data/www/titlo.ru`  
**Порт Node:** **3003** (datagon.ru — 3001, cabinet.datagon.ru — 3002).  
**Кабинет (ссылки и BFF):** `https://cabinet.titlo.ru` — поднимается отдельно ([cabinet-deploy.md](./cabinet-deploy.md), позже).

Репозиторий: [github.com/bziksv/titlo](https://github.com/bziksv/titlo) (маркетинг titlo.ru).  
Legacy datagon.ru: [site_seo_datagon](https://github.com/bziksv/site_seo_datagon).

## Порты на сервере

| Домен | PM2 | Порт |
|-------|-----|------|
| datagon.ru | `datagon-site` | 3001 |
| cabinet.datagon.ru | `cabinet-datagon` | 3002 |
| **titlo.ru** | **`titlo-site`** | **3003** |
| cabinet.titlo.ru | (позже) | TBD |

## Первый push в GitHub (с Mac)

Репозиторий пустой — один раз с локальной папки `datagon.ru`:

```bash
cd /Users/stanislav/Documents/projects/datagon.ru
git remote add titlo https://github.com/bziksv/titlo.git   # если ещё нет
git push -u titlo main
```

Дальше на сервере — `git clone` / `git pull` из **bziksv/titlo**.

## Первый деплой

SSH на `155.212.171.103`, пользователь **`titlo_ru_usr`** (или root + `sudo -u titlo_ru_usr`):

```bash
cd /var/www/titlo_ru_usr/data/www/titlo.ru

git clone https://github.com/bziksv/titlo.git .
cp .env.example .env.local
nano .env.local
```

Минимальный `.env.local`:

```env
PORT=3003
NEXT_PUBLIC_SITE_URL=https://titlo.ru
NEXT_PUBLIC_LK_URL=https://cabinet.titlo.ru
LK_API_BASE_URL=https://cabinet.titlo.ru

# SMTP — как на datagon.ru (или свои)
SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
SMTP_FROM=noreply@titlo.ru
CONTACT_TO=info@titlo.ru,sv6@list.ru

# Метрика — новый счётчик или тот же на переходный период
# NEXT_PUBLIC_YM_ID=54591493
```

Сборка и PM2:

```bash
npm ci
npm run build
pm2 start npm --name titlo-site -- start
pm2 save

curl -s http://127.0.0.1:3003/api/health/
curl -sI http://127.0.0.1:3003/ | head -5
```

Nginx: [nginx-titlo.example.conf](./nginx-titlo.example.conf) → `server_name titlo.ru`, upstream **3003**. SSL через Let's Encrypt / панель хостинга.

Проверка с Mac после DNS:

```bash
BASE_URL=https://titlo.ru npm run smoke
```

## Обновление после `git push`

```bash
cd /var/www/titlo_ru_usr/data/www/titlo.ru
git fetch origin
git checkout main
git reset --hard origin/main
npm ci
npm run build
pm2 restart titlo-site
curl -s http://127.0.0.1:3003/api/health/
```

## Локальная разработка (Mac)

```bash
cd /Users/stanislav/Documents/projects/datagon.ru
NEXT_PUBLIC_SITE_URL=http://localhost:3003 \
NEXT_PUBLIC_LK_URL=http://localhost:3002 \
LK_API_BASE_URL=http://localhost:3002 \
npm run dev:titlo
# → http://localhost:3003
# остановка: npm run dev:titlo:stop
```

datagon.ru по-прежнему: `npm run dev` → **:3001** (можно держать оба одновременно).

## Зависимость от cabinet.titlo.ru

Пока кабинет не поднят на `cabinet.titlo.ru`, BFF (`/api/lk/*`) и форма через LK API могут отдавать ошибки — это нормально до деплоя Laravel. SMTP-форма работает независимо.

После деплоя кабинета убедиться, что в Laravel разрешён origin `https://titlo.ru` для публичных API (если есть CORS / allowlist).

## Cutover (позже)

1. Редирект `datagon.ru` → `titlo.ru` (nginx или `next.config.ts`).
2. Остановить `datagon-site`, освободить :3001 при необходимости.
3. Удалить старый маркетинг и кабинет datagon с VPS.
