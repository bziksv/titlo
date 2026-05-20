# Чеклист миграции redbox.su → Next.js

Источник URL: sitemap Битрикса ([sitemap.xml](https://redbox.su/sitemap.xml)), обход [redbox.su](http://redbox.su/), статусы HTTP — май 2026.

**Легенда:** ☐ не начато · 🔄 в работе · ✅ готово · ⏭ редирект/не переносим

---

## Фазы

| Фаза | Содержание | Статус |
|------|------------|--------|
| **0** | Next.js, layout, конфиг, чеклист | ✅ |
| **1** | Главная `/`, шапка, подвал, cookie-баннер | ✅ |
| **2** | Компания: about, contact, tarify, services, faq | ✅ |
| **3** | 18 лендингов модулей | ✅ |
| **4** | Новости: список + detail (MD/API) | ✅ |
| **5** | Редиректы, sitemap, `/upload` → static | ✅ |
| **6** | `/demo` + BFF → lk | ✅ |
| **7** | Юридические страницы `/legal/*` | ✅ |
| **8** | Docker, CI (шаблон `docs/ci-workflow.yml.example`), smoke, `/api/health` | ✅ |
| **9** | Полный smoke, compare:sitemap, nginx example, порт 3001 | ✅ |
| **10** | Форма контактов, новости (img/embed), YouTube на лендинге | ✅ |
| **11** | Метрика 54591493, юр. нормализация, YouTube на 14 лендингах | ✅ |
| **12** | Зеркало картинок новостей, SMTP-форма, staging в deploy | ✅ |
| **13** | Полный page-audit, scrape:all, визуал UI, тексты модулей | ✅ |
| **14** | FAQ Датагон, scrape:tariffs, audit:pages, группы в TariffCard | ✅ |

См. **[page-audit-full.md](./page-audit-full.md)** — чеклист каждой страницы.

---

## Внешние (не переносим, только ссылки)

| URL | Назначение | Статус |
|-----|------------|--------|
| `https://lk.redbox.su/login` | Вход | ⏭ |
| `https://lk.redbox.su/register` | Регистрация | ⏭ |

---

## Ядро сайта

| URL | Назначение | HTTP | Фаза | Статус |
|-----|------------|------|------|--------|
| `/` | Главная | 200 | 1 | ✅ |
| `/about/` | О компании | 200 | 2 | ✅ |
| `/contact/` | Контакты | 200 | 2 | ✅ |
| `/tarify/` | Тарифы | 200 | 2 | ✅ |
| `/services/` | Услуги / обзор | 200 | 2 | ✅ |
| `/faq/` | FAQ | 200 | 2 | ✅ |
| `/demo` | 301 → `/` (демо на каждом лендинге) | ⏭ | 6 | ✅ |

---

## Модули сервиса (лендинги)

| URL | Модуль | Фаза | Статус |
|-----|--------|------|--------|
| `/analiz-relevantnosti/` | Анализ релевантности | 3 | ✅ |
| `/analiz-konkurentov/` | Анализ конкурентов | 3 | ✅ |
| `/monitoring-pozicii-sayta/` | Мониторинг позиций | 3 | ✅ |
| `/monitoring-saytov/` | Мониторинг сайтов | 3 | ✅ |
| `/proverka-meta-tegov-online/` | Мониторинг мета-тегов | 3 | ✅ |
| `/generator_slov/` | Генератор слов | 3 | ✅ |
| `/podschet-dliny-teksta/` | Подсчёт длины текста | 3 | ✅ |
| `/generator-paroley/` | Генератор паролей | 3 | ✅ |
| `/sravnenie-spiskov-klyuchevykh-fraz/` | Сравнение списков КФ | 3 | ✅ |
| `/udalenie-dublikatov/` | Удаление дубликатов | 3 | ✅ |
| `/utm-metki/` | UTM метки | 3 | ✅ |
| `/kalkulyator-roi/` | Калькулятор ROI | 3 | ✅ |
| `/http-headers/` | HTTP headers | 3 | ✅ |
| `/html-redaktor/` | HTML-редактор | 3 | ✅ |
| `/vydelenie-unikalnykh-slov-v-tekste/` | Уникальные слова в тексте | 3 | ✅ |
| `/otslezhivanie-ssylok/` | Отслеживание ссылок | 3 | ✅ |
| `/otslezhivanie-sroka-registratsii-domenov/` | Срок регистрации доменов | 3 | ✅ |
| `/analiz-teksta/` | Анализ текста | 3 | ✅ |
| `/klasterizator-klyuchevykh-slov/` | Кластеризатор | 3 | ✅ |

---

## Новости

| URL | Фаза | Статус |
|-----|------|--------|
| `/news/` | Список | 4 | ✅ |
| `/news/istoriya-kompanii/` | История компании | 4 | ✅ |

### `/news/detail/*` (30 статей)

| Slug | Статус |
|------|--------|
| `analizator-relevantnosti-stranitsy-dobavlena-vozmozhno-skachivat-spisok-tlps` | ✅ |
| `analizator-relevantnosti-stranitsy-obnovleno-opisanie-v-proekte-funktsionala` | ✅ |
| `bolshoe-obnovlenie-analiza-relevantnosti-stranitsy` | ✅ |
| `bolee-70-klientov-uzhe-sotrudnichayut-s-kompaniey-i-chast-iz-nikh-s-momenta-osnovaniya` | ✅ |
| `dobavlena-sistema-metok-dlya-analizatora-relevantnosti-stranitsy` | ✅ |
| `dobavleny-obuchayushchie-roliki-k-nekotorym-servisami` | ✅ |
| `dorabotki-modulya-analiz-relevantnosti-stranitsy` | ✅ |
| `god-osnovaniya-i-shtat-v-3-cheloveka` | ✅ |
| `ispravlen-bag-s-oblakami-slov` | ✅ |
| `izmenenie-politiki-otdachi-stranits-google` | ✅ |
| `izmeneniya-usloviya-raboty-s-yandeks-api` | ✅ |
| `k-komande-prisoedinyaetsya-pervyy-programmist` | ✅ |
| `monitoring-pozitsiy-novye-vozmozhnosti-redaktirovaniya-proektov` | ✅ |
| `my-napisali-sistemu-ucheta-klientov-dlya-vnutrennikh-nuzhd` | ✅ |
| `my-razrabatyvaem-sobstvennuyu-platformu-dlya-seo-spetsialistov-i-analitikov-i-zapuskaem-ee-pomodulno` | ✅ |
| `novoe-video-v-module-analiz-relevantnosti` | ✅ |
| `obnovlenie-modulya-analiz-teksta` | ✅ |
| `obnovlenie-modulya-monitoring-pozitsiy-analiz-top-100` | ✅ |
| `obnovlenie-v-module-monitoring-poziciy` | ✅ |
| `obnovlenie-v-module-monitoring-pozitsiy` | ✅ |
| `peredelan-modul-vydelenie-unikalnykh-slov-v-tekste` | ✅ |
| `poyavilos-video-v-servise-analiz-relevantnosti` | ✅ |
| `prakticheskiy-kurs-v-module-analiz-relevantnosti` | ✅ |
| `pravki-v-module-analiz-teksta` | ✅ |
| `problemy-s-videorolikami` | ✅ |
| `prodolzhaem-rabotu-nad-modulyami` | ✅ |
| `sredniy-srok-sotrudnichestva-prevysil-3-5-goda-nas-uzhe-bolee-20-chelovek-v-komande` | ✅ |
| `tarifnye-limity-v-module-monitoring-pozitsiy` | ✅ |
| `u-kompanii-bolee-50-klientov-na-seo-prodvizhenii-i-bolee-10-proektov-po-kontekstnoy-reklame` | ✅ |
| `vygruzka-rezultatov-v-module-http-headers` | ✅ |

---

## Служебные / наследие Битрикса

| URL | Действие | Статус |
|-----|----------|--------|
| `/main/` | 301 → `/` | ✅ `next.config` |
| `/blog/` | 301 → `/news/` | ✅ |
| `/action/` | 301 → `/news/` | ✅ |
| `/catalog/` | 301 → `/services/` | ✅ |
| `/cart/` | 301 → `/` | ✅ |
| `/search/` | 301 → `/` | ✅ |
| `/404.php` | 301 → `/` | ✅ |

---

## Статика и юридическое

| Ресурс | Действие | Статус |
|--------|----------|--------|
| `/upload/politika-ispolzovanija-cookies-redbox.png` | `public/legal/` | ✅ |
| Cookie-баннер (текст с главной) | Компонент | 1 | ✅ |
| `/legal/personal-data/` | Согласие на обработку ПДн | ✅ |
| `/legal/privacy/` | Политика конфиденциальности | ✅ |
| `/legal/offer/` | Договор-оферта | ✅ |
| `/upload/politika-…cookies…png` → `/legal/cookies.png` | 301 | ✅ |

---

## Итого

| Группа | Кол-во |
|--------|--------|
| Ядро | 6 |
| Модули | 18 |
| Новости | 32 URL |
| Редиректы | ~6 |
| **Всего к переносу** | **~57 страниц** |

Обновлять статусы в этом файле по мере фаз.
