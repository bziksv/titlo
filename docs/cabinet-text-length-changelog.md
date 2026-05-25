# Кабинет — подсчёт длины текста (changelog)

Модуль: `/counting-text-length` · config `cabinet-text-length.php` · badge **v1.0s**

## 1.0s — 2026-05-25

- **LTE4 UI:** шаги 1–3, KPI (символы/слова/строки/пробелы), поля Title / Description / H1, отчёт SEO и структуры текста.
- **Сервис:** `TextLengthAnalysisService` — единая логика с демо на datagon.ru.
- **Лимит:** до 38 600 символов за проверку (`config/cabinet-text-length.php`).
- **localStorage:** сохранение текста и SEO-полей между сессиями.
- **Проверка:** http://localhost:3002/counting-text-length · демо: http://localhost:3001/podschet-dliny-teksta/
