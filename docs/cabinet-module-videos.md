# Кабинет — self-host обучающих роликов

**Зачем:** у части пользователей YouTube в браузере не открывается; блоки «Познакомьтесь с модулем…» (`descriptions` + `#video-course`) перестают работать.

**Решение:** MP4 и постер на своём домене (`/media/module-videos/{youtube_id}.mp4`), без git.

## Папка (не в git)

```
cabinet.datagon.ru/public/media/module-videos/
  H_wcnUFxHRw.mp4
  H_wcnUFxHRw.jpg
  …
```

На VPS: залить ту же папку (rsync/scp). Каталога в git нет — **сначала создать на сервере**:

```bash
ssh root@155.212.171.103 'mkdir -p /var/www/cabinet_data_usr/data/www/cabinet.datagon.ru/public/media/module-videos && chown -R cabinet_data_usr:cabinet_data_usr /var/www/cabinet_data_usr/data/www/cabinet.datagon.ru/public/media'

rsync -av --progress \
  /Users/stanislav/Documents/projects/cabinet.datagon.ru/public/media/module-videos/ \
  root@155.212.171.103:/var/www/cabinet_data_usr/data/www/cabinet.datagon.ru/public/media/module-videos/
```

Проверка: `https://cabinet.datagon.ru/media/module-videos/H_wcnUFxHRw.mp4` → 200.

## Скачать локально

```bash
brew install yt-dlp jq   # один раз
cd /Users/stanislav/Documents/projects/cabinet.datagon.ru
bash scripts/download-module-videos.sh
```

Список ID: `scripts/module-videos-manifest.json` (26 роликов из БД `descriptions`).

## Код

- `app/Support/ModuleVideos.php` — постер/URL, перепись HTML описания
- `config/cabinet-module-videos.php` — `CABINET_MODULE_VIDEOS_ENABLED` (по умолчанию `true`)
- `resources/views/description/main.blade.php` — вывод через `rewriteDescriptionHtml`
- `layouts/app.blade.php` — клик по превью → `<video>`; повторный клик по плееру не пересоздаёт элемент (пауза/seek — нативные controls)

## Проверка

1. Скачать хотя бы `H_wcnUFxHRw.mp4` (модуль «Анализ текста»).
2. http://localhost:3002/text-analyzer — клик по превью → плеер с `/media/module-videos/…`, без запросов к youtube.com.
3. Воспроизведение → клик по области видео ставит на паузу (не сбрасывает в начало).
4. Удалить один mp4 — для этого ID снова fallback на YouTube по клику.
