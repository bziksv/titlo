# Эталон: лендинг «Подсчёт длины текста»

| Среда | URL |
|-------|-----|
| Локально | http://localhost:3001/podschet-dliny-teksta/ |
| Прод | https://datagon.ru/podschet-dliny-teksta/ |

`PodschetDlinyTekstaLanding` · `lib/content/podschet-dliny-teksta-page.ts`.

Акцент: **символы с/без пробелов, слова, до 38 600 знаков, title/description**.

**Демо:** секция `TextLengthDemoWidget` — тот же отчёт, что в кабинете `/counting-text-length` (v1.0s); лимит 2k символов в демо, 38 600 в кабинете.

Проверка: `npm run verify:text-length` (порт **3001**); демо вручную — вставить текст → «Посчитать в демо».

Скрины: `a5f1bfd79fcdf76a.png` + кропы `text-length-capture-*.png` (`node scripts/capture-text-length-screenshots.mjs`). Иконки `b936643…` / `c09f2e3…` / `554245b…` — номера 1–3, 50 px.
