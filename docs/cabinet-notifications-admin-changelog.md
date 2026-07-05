`/admin/notifications` · `config/cabinet-notifications-admin.php` · **v1.2.1s**

## 1.2.1s — 2026-05-30

- Предпросмотр «Новости»: кнопка «Открыть раздел Новости»; правило агента **`redbox-cabinet-notifications-registry.mdc`** — новые TG/email/модалки → реестр + тесты.

## 1.2.0s — 2026-05-30

- **Табличное представление** всех событий (модуль, когда, кому, каналы).
- **Живые тесты:** кнопка TG → реальное сообщение админу в бот; конверт → HTML-предпросмотр письма; самолётик → отправка на email админа; окно → модалка как в кабинете.
- `NotificationAdminTestService`, routes `test/telegram`, `test/email`, `preview/modal`, `preview/email`.
- **Проверка:** http://localhost:3002/admin/notifications — TG (профиль #telegram), email preview в новой вкладке.

## 1.1.1s — 2026-05-30

- UI как у остальной админки: **callout** + **info-box KPI**, правила каналов в info-box, аккордеон с иконками модулей.
- События — `card-outline`, три плитки «Когда / Кому / Тариф», превью TG/email/модалки цветными блоками вместо `<pre>`.
- **Проверка:** http://localhost:3002/admin/notifications — обновить с Ctrl+F5.

## 1.1.0s — 2026-05-30

- Страница переписана «для воробьёв»: правила по тарифам, пошаговая инструкция, аккордеон **событий по модулям** (когда → кому → каналы → **пример текста**).
- Реестр событий — `config/cabinet-users-notifications.php` (`events`, `rules`); матрица галочек спрятана в «Для разработчика».
- **Проверка:** http://localhost:3002/admin/notifications — раскрыть «Мониторинг сайтов», сверить примеры TG/email; блок dev collapsed по умолчанию.

## 1.0.0s — 2026-05-30

- Отдельная админ-страница **«Управление рассылками»**: каналы (модалки, Telegram, почтовые уведомления, сервисные письма), модалки `CabinetModalQueue`, таблица модулей, чек-лист Telegram из `config/cabinet-telegram.php`.
- Пункт в шестерёнке (`CabinetAdminMenu`); реестр — `config/cabinet-users-notifications.php`, `UserNotificationsRegistry`.
- **Проверка:** http://localhost:3002/admin/notifications (роль admin); шестерёнка → «Управление рассылками».
