# Кабинет: приём крипты и подписки (исследование)

**Статус:** исследование / кандидаты, **код ещё не внедрён**.  
**Сейчас в кабинете:** только Robokassa (`cabinet.titlo.ru`: `config/payment.php`, `app/Classes/Pay/Robokassa/`, `TariffPayController`).  
**Дата фиксации:** 2026-08-07.

Документацию по кандидатам **храним в git** (`titlo.ru/docs/`), не выбрасываем.

---

## ТЗ (что хотим)

| Требование | Нужно |
|------------|--------|
| Подписка / рекуррент | да |
| Вывод на крипто-кошелёк мерчанта | да |
| Карты (Visa/MC) | желательно |
| Онбординг физика / без тяжёлого KYB | желательно (уточнить юр. статус) |

---

## 1. Inqud — кандидат №1 по «настоящей» подписке

| | |
|--|--|
| **Продукт** | [Рекуррентные крипто-платежи](https://inqud.com/ru/recurring-payments) |
| **Доки** | [docs.inqud.com — Crypto Recurring](https://docs.inqud.com/crypto-recurring/get-started/step-1.-account-verification) |
| **Компания** | Inqud, Kraków (Польша), fintech; заявлена лицензия **RDWW-853** |
| **Модель** | Web3 автоплатежи: клиент **привязывает кошелёк**, дальше списания как у карты |
| **Сети** | Tron, Bitcoin, Solana, Optimism, Arbitrum (+ другие по запросу) |
| **Монеты** | BTC, ETH, TRX, BNB, MATIC, USDT, USDC и др. |
| **Планы** | Fixed subscription + on-demand |
| **Интеграция** | Hosted redirect **или** SDK/кастомный UI |
| **Онбординг мерчанта** | Регистрация → телефон → **KYB (компания)**, до **1–7 раб. дней** |
| **Доп. продукты** | Crypto widget, payment URL, on-ramp «карта → крипта» для плательщика, high-risk acquiring |

### Подходит ли нам?

| Критерий | Оценка |
|----------|--------|
| SaaS-подписка с автосписанием крипты | **Да** — ближе всего к «как карта» |
| Вывод мерчанту в крипту / автоконверт | **Да** (по продуктовым страницам) |
| Карты как способ оплаты подписки мерчанту | **Частично**: у плательщика — on-ramp «карта→крипта»; полноценный card-acquiring — отдельный продукт + KYB |
| Физическое лицо без компании | **Скорее нет** — для merchant recurring нужен **KYB компании** |
| Репутация vs Cryptomus | Сильнее как regulated EU fintech; без FINTRAC-штрафа в публичном профиле Cryptomus |

**Вердикт:** продукт по подписке **подходит** для кабинета Титло **если** есть юрлицо / KYB.  
Как единственный шлюз «карты + крипта на паспорт» — **не закрывает**.  
Для физика без ИП — сначала уточнить у менеджера Inqud, принимают ли sole trader / personal merchant.

---

## 2. Cryptomus — кандидат №2 (проще старт, выше риск)

| | |
|--|--|
| **Сайт** | [cryptomus.com/ru](https://cryptomus.com/ru) |
| **Доки recurring** | [doc.cryptomus.com — Recurrence create](https://doc.cryptomus.com/merchant-api/recurring/creating) |
| **Юрлицо** | **Xeltox Enterprises Ltd.** (Канада, Vancouver); FINTRAC MSB |
| **Модель подписки** | Recurring API: план → клиент подтверждает → дальше по расписанию (не классический Web3 allowance как у Inqud) |
| **Комиссия** | от ~0.4% (заявлено) |
| **Онбординг** | Легче для физлиц / малого бизнеса; KYC по риску |
| **Риски** | FINTRAC: штраф ~**CAD 176M** (окт 2025, оспаривают); расследования (TRM, Krebs) — Russia-linked; связанный бренд **Heleket** в аналитике |

### Подходит ли нам?

| Критерий | Оценка |
|----------|--------|
| Быстрый старт / физик | **Да** |
| Подписка | **Да**, но модель ближе к recurring invoices / их балансу, не Web3 auto-pull |
| Вывод на крипто-кошелёк | **Да** |
| Карты | On-ramp «купить крипту картой» у них есть; не полноценный эквайринг как Robokassa |
| Регуляторика / репутация | **Слабо** для «белого» SaaS |

**Вердикт:** технически можно, юридически/репутационно — **осторожно**. Для Титло лучше держать как запасной / сравнение, не как основной «белый» канал без юр. оценки.

---

## 3. Сравнение коротко

| | **Inqud** | **Cryptomus** |
|--|-----------|---------------|
| Автоподписка Web3 | сильнее | слабее / другая модель |
| Старт без компании | слабо | проще |
| Регуляторика | Польша / EU | Канада + риски |
| Карты мерчанту | через отдельные продукты / on-ramp | on-ramp |
| Документация API | [docs.inqud.com](https://docs.inqud.com/) | [doc.cryptomus.com](https://doc.cryptomus.com/) |

---

## 4. Текущий код кабинета (якорь)

- `config/payment.php` — Robokassa
- `app/Classes/Pay/Pay.php`, `app/Classes/Pay/Robokassa/RobokassaPay.php`
- `app/Http/Controllers/TariffPayController.php`, `app/TariffPay.php`

Крипто-драйвера **нет**. При внедрении: отдельный driver рядом с Robokassa + webhook → продление тарифа / баланс (как сейчас Result URL у Robokassa).

---

## 5. Следующие шаги (когда решим внедрять)

1. Зафиксировать юр. статус мерчанта (ООО / ИП / только физлицо).
2. Написать в Inqud: KYB для РФ/ИП, settle на USDT (сеть), комиссии, sandbox.
3. Параллельно не коммитить секреты; ключи только в `.env`.
4. Спека интеграции: create plan → checkout → webhook `paid/failed` → `TariffPay` / лимиты.
5. Robokassa оставить для карт/фиата, пока Inqud не закроет card-acquiring под наш KYB.

---

## Ссылки (не выкидывать)

- https://inqud.com/ru/recurring-payments  
- https://docs.inqud.com/crypto-recurring/get-started/step-1.-account-verification  
- https://cryptomus.com/ru  
- https://doc.cryptomus.com/merchant-api/recurring/creating  
