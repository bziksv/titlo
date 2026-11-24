# Отчёт batch 7: 20 терминов SEO-словаря titlo.ru

Дата: 20.11.2026 (Europe/Moscow). Исполнитель: Гермес.

## Итог

- Терминов: **20**, все опубликованы на `https://titlo.ru/slovar/<slug>/`.
- Приёмка метрик: **20 из 20** проходят порог Рекомендации × 0,95 по всем шести показателям на **живом URL статьи**.
- `npm run build` — EXIT 0; `tsc --noEmit` — 0 ошибок; `verify-glossary` — **142 страницы PASS**.
- SHA на проде: **2c14d72** (последний коммит текста, задеплоен 20.11.2026 ~17:15 MSK).
- HEAD `main`: **2c14d72**.

## Таблица по терминам

Порядок метрик: балл / охват важных / охват tf / ширина / плотность / символов. Источник — интерфейс анализатора, посадочная = живой URL статьи, Google, Москва, ТОП-20.

| # | id | slug | живой URL | коммит | history id | Рекомендации | Наш URL | ≥×0,95 | Wordstat |
|---|----|------|-----------|--------|-----------|--------------|---------|--------|----------|
| 1 | 212 | `chpu` | https://titlo.ru/slovar/chpu/ | 023fc4b | 99118 | 94.6 / 55.4 / 57.2 / 100 / 39 / 21924 | 100 / 62.3 / 65.2 / 100 / 49 / 31068 | да | `briefs/wordstat-full/chpu.md` |
| 2 | 210 | `khlebnye-kroshki` | https://titlo.ru/slovar/khlebnye-kroshki/ | 6669663 | 99119 | 95.9 / 53.9 / 58.8 / 100 / 35.4 / 21832 | 100 / 59.4 / 65.4 / 100 / 44 / 31305 | да | `briefs/wordstat-full/khlebnye-kroshki.md` |
| 3 | 211 | `paginatsiya` | https://titlo.ru/slovar/paginatsiya/ | 755322e | 99121 | 82.5 / 45.7 / 49.8 / 100 / 29.2 / 18673 | 100 / 54.1 / 60.4 / 100 / 39 / 28310 | да | `briefs/wordstat-full/paginatsiya.md` |
| 4 | 318 | `tz-na-tekst` | https://titlo.ru/slovar/tz-na-tekst/ | 83a3f45 | 99190 | 95.8 / 54.2 / 59 / 100 / 38.6 / 28704 | 100 / 55.2 / 58.6 / 100 / 41 / 30239 | да | `briefs/wordstat-full/tz-na-tekst.md` |
| 5 | 172 | `kombinatorika-klyuchevykh-fraz` | https://titlo.ru/slovar/kombinatorika-klyuchevykh-fraz/ | 1db6a49 | 99120 | 64.6 / 35.8 / 34.4 / 100 / 27.8 / 17719 | 82.3 / 43.5 / 45 / 100 / 35 / 19252 | да | `briefs/wordstat-full/kombinatorika-klyuchevykh-fraz.md` |
| 6 | 541 | `monitoring-obratnykh-ssylok` | https://titlo.ru/slovar/monitoring-obratnykh-ssylok/ | 6398622 | 99127 | 84.1 / 48.7 / 54.9 / 100 / 34.2 / 23646 | 100 / 58.6 / 64.4 / 100 / 46 / 33225 | да | `briefs/wordstat-full/monitoring-obratnykh-ssylok.md` |
| 7 | 371 | `hreflang` | https://titlo.ru/slovar/hreflang/ | 4d31698 | 99126 | 77.2 / 40.8 / 54.2 / 100 / 31.6 / 17605 | 100 / 55.6 / 71.1 / 100 / 48 / 33132 | да | `briefs/wordstat-full/hreflang.md` |
| 8 | 372 | `open-graph` | https://titlo.ru/slovar/open-graph/ | 112a7c3 | 99125 | 85.4 / 43.2 / 55.9 / 100 / 29.6 / 14939 | 91.4 / 44.8 / 58.3 / 100 / 34 / 18929 | да | `briefs/wordstat-full/open-graph.md` |
| 9 | 506 | `ssl-sertifikat` | https://titlo.ru/slovar/ssl-sertifikat/ | fc08186 | 99168 | 77.1 / 41.7 / 46.4 / 100 / 28.2 / 21315 | 90 / 47.3 / 51.8 / 100 / 36 / 28510 | да | `briefs/wordstat-full/ssl-sertifikat.md` |
| 10 | 557 | `yuzabiliti` | https://titlo.ru/slovar/yuzabiliti/ | f1d0efe | 99169 | 99.5 / 60.9 / 62.2 / 100 / 41.6 / 31919 | 100 / 67.2 / 68.5 / 100 / 52 / 43172 | да | `briefs/wordstat-full/yuzabiliti.md` |
| 11 | 433 | `adaptivnaya-verstka` | https://titlo.ru/slovar/adaptivnaya-verstka/ | 30f77bc | 99131 | 94.1 / 52.6 / 55.7 / 100 / 36.4 / 25521 | 99.1 / 52.6 / 56.1 / 100 / 40 / 32317 | да | `briefs/wordstat-full/adaptivnaya-verstka.md` |
| 12 | 431 | `pagespeed-insights` | https://titlo.ru/slovar/pagespeed-insights/ | 31d4a99 | 99148 | 74.8 / 39.9 / 44 / 100 / 29.2 / 18566 | 93.7 / 48.1 / 53.5 / 100 / 39 / 28590 | да | `briefs/wordstat-full/pagespeed-insights.md` |
| 13 | 443 | `keshirovanie` | https://titlo.ru/slovar/keshirovanie/ | 7a4d523 | 99130 | 88.9 / 49.7 / 52.9 / 100 / 34 / 23386 | 100 / 57.8 / 62.4 / 100 / 46 / 31016 | да | `briefs/wordstat-full/keshirovanie.md` |
| 14 | 482 | `oshibki-500-503` | https://titlo.ru/slovar/oshibki-500-503/ | a18755c | 99132 | 90.1 / 49.1 / 55.1 / 100 / 32.4 / 22053 | 100 / 52.4 / 61.2 / 100 / 40 / 33759 | да | `briefs/wordstat-full/oshibki-500-503.md` |
| 15 | 98 | `trast-sayta` | https://titlo.ru/slovar/trast-sayta/ | ba015ef | 99137 | 82.1 / 47.9 / 51.1 / 100 / 35.2 / 26918 | 98.3 / 52.6 / 54.9 / 100 / 40 / 29486 | да | `briefs/wordstat-full/trast-sayta.md` |
| 16 | 509 | `satellit` | https://titlo.ru/slovar/satellit/ | 24c8089 | 99139 | 67.9 / 36.9 / 38.5 / 100 / 26.4 / 13949 | 87.8 / 45.6 / 50.2 / 100 / 36 / 20904 | да | `briefs/wordstat-full/satellit.md` |
| 17 | 516 | `ankor-list` | https://titlo.ru/slovar/ankor-list/ | 8948f3b | 99141 | 87 / 47.8 / 54.4 / 100 / 30.6 / 19867 | 100 / 53.9 / 60.6 / 100 / 39 / 27962 | да | `briefs/wordstat-full/ankor-list.md` |
| 18 | 273 | `vebvizor` | https://titlo.ru/slovar/vebvizor/ | 5fc8dec | 99140 | 97.1 / 56.5 / 59.3 / 100 / 37.4 / 21382 | 100 / 61.4 / 64.9 / 100 / 47 / 33901 | да | `briefs/wordstat-full/vebvizor.md` |
| 19 | 103 | `zerkalo-sayta` | https://titlo.ru/slovar/zerkalo-sayta/ | db5161c | 99138 | 80.5 / 41.7 / 49.4 / 100 / 30.4 / 15193 | 100 / 50.8 / 60.9 / 100 / 42 / 25345 | да | `briefs/wordstat-full/zerkalo-sayta.md` |
| 20 | 96 | `pesochnitsa` | https://titlo.ru/slovar/pesochnitsa/ | e165d2c | 99142 | 71.9 / 39.9 / 44.2 / 100 / 24.6 / 14226 | 92 / 49.2 / 52.9 / 100 / 36 / 21551 | да | `briefs/wordstat-full/pesochnitsa.md` |

## Что изменилось после разбора

### Тексты (20 коммитов `glossary: fix <slug> (batch7 review)`)

- Убраны нерезолвящиеся имена из `related`: `URL` (chpu), `Мобильная версия` и `Скорость загрузки` (adaptivnaya-verstka, заменено на PageSpeed Insights), `Скорость загрузки` (pagespeed-insights), `Хостинг` (oshibki-500-503, заменено на Uptime), `Возраст домена` (trast-sayta, заменено на Срок регистрации домена).
- Добавлен обязательный блок `flow`: khlebnye-kroshki, paginatsiya.
- Таблицы khlebnye-kroshki доведены до пяти строк: «Типы хлебных крошек» и «Что даёт разметка крошек в выдаче».
- Убраны неподкреплённые отсылки: «Исследования показывают» (satellit, vebvizor), география «В Петербурге и Москве…» (pesochnitsa) — переписаны без вымышленного источника и без правил вида «в регионе дольше».
- `tz-na-tekst` расширен до 30 239 символов (было 25 750), запас по важным и tf выведен из зоны порога.

### Длина статей

Сжатие воды и дублирующих хвостовых секций во всех статьях, кроме `tz-na-tekst`. Было 1,42–2,30 от рекомендации, стало:

- `tz-na-tekst` — ×1.05
- `kombinatorika-klyuchevykh-fraz` — ×1.09
- `trast-sayta` — ×1.10
- `adaptivnaya-verstka` — ×1.27
- `open-graph` — ×1.27
- `keshirovanie` — ×1.33
- `ssl-sertifikat` — ×1.34
- `yuzabiliti` — ×1.35
- `monitoring-obratnykh-ssylok` — ×1.41
- `ankor-list` — ×1.41
- `chpu` — ×1.42
- `khlebnye-kroshki` — ×1.43
- `satellit` — ×1.50
- `pesochnitsa` — ×1.51
- `paginatsiya` — ×1.52
- `oshibki-500-503` — ×1.53
- `pagespeed-insights` — ×1.54
- `vebvizor` — ×1.59
- `zerkalo-sayta` — ×1.67
- `hreflang` — ×1.88

Ниже коридора ×1,2–1,4 остались `tz-na-tekst` (её по заданию нужно было расширять, а не сжимать) и статьи, у которых рекомендация в этом прогоне оказалась низкой: `tz-na-tekst` ×1.05, `kombinatorika-klyuchevykh-fraz` ×1.09, `trast-sayta` ×1.10.
Выше ×1,55: `vebvizor` ×1.59, `zerkalo-sayta` ×1.67, `hreflang` ×1.88. Причина — разброс самой рекомендации между прогонами: по одному и тому же URL она меняется в зависимости от набора конкурентов, попавших в ТОП-20 (например, у `hreflang` в разных прогонах 17 605 и 26 314 символов). Все показатели при этом выше порога ×0,95.

## Повторный прогон анализатора

После сжатия и правок выполнен новый прогон по всем 20 живым URL: Google, Москва, ТОП-20, посадочная = URL статьи. Итог — 20 из 20 PASS. Новые history id и обе строки метрик — в таблице выше. CSV прогона: `briefs/batch7-csv-live/`.

У `yuzabiliti` и `ssl-sertifikat` первый запуск дал таблицу конкурентов из одной строки — рекомендации в нём считались по самой странице, поэтому оба термина перезапущены; в отчёт вошли повторные запуски (99169 и 99168).

## Бэклог

`briefs/topic-backlog.md`, раздел «Смежные темы из Wordstat batch 7 (20.11.2026)». Файл ведётся накопительно, раздел добавлен в конец.

Дописан Wordstat в существующие карточки кабинета (заметки): 535 «Абсолютная ссылка», 348 «Генеративный контент», 228 «Скорость загрузки», 493 «Домен», 272 «Яндекс Метрика». У термина `satellit` спрос «сайт сателлит» — 2 589 — внесён в заметки его карточки, отдельная карточка не заводилась.

Новые пункты: «Кэш браузера» (кэш браузера — 109 943; как очистить кэш браузера — 37 760), «Проверка ссылок онлайн» (проверить ссылку онлайн — 2 460), «Веб-страница» (веб страница — 115 712, приоритет низкий).

## Кабинет

Раздел «Маркетинг сайта» обновлён: все 20 карточек переведены в `published`, заполнены `slug`, `url`, `main_query`, `modules`, `related_terms`, `intent`, `format`, заметка со строкой Wordstat (метка 20.11.2026) и бриф с id запуска анализатора. Код кабинета, база и сервер не трогались — только поля карточек через интерфейс.

## Отклонения и замечания

### Wordstat: пустые колонки

24 запроса из 60 Wordstat отдал без разбивки: общее число есть, а таблицы «Запросы со словами» и «Похожие запросы» пустые с пометкой «Нет подходящих запросов». Проверено вручную: смена региона, переключение режимов и повторный ввод не помогают. По ТЗ зафиксированы общее число и пометка «пусто».

### Этап А и посадочная

На этапе А будущие URL отдавали 404, запуск с ними зависал на «Парсинг сайтов 0%». Использована оговорка §2.2 ТЗ — посадочная `https://titlo.ru/slovar/`. Рекомендации от посадочной не зависят, поэтому тексты писались по ним. Строка «наш сайт» тех запусков относится к хабу и в отчёт не берётся; в таблице выше — только живые запуски этапа Д.

### Файлы приёмки

Рабочего каталога `/workspace/briefs/` на этой машине нет, создать его нельзя (нет прав на `/workspace`). Все файлы лежат в `briefs/` репозитория titlo: `batch7-report.md`, `batch7-csv/` (этап А), `batch7-csv-live/` (этап Д), `analyzer-raw/`, `analyzer-raw-live/`, `wordstat-full/`, `topic-backlog.md`, `batch7-terms.json`, `batch7-stories.json`, `batch7-live-stories.json`, `batch7-live-final.json`.

### Запас по метрикам

Минимальный запас над порогом — у `tz-na-tekst`: tf 58,58 при пороге 56,06. Остальные статьи превышают порог с запасом от 1,5 до 12 п.п. по охвату важных слов.