"use client";

import Link from "next/link";
import { ModuleIcon } from "@/lib/module-icons";
import { NewsCard } from "@/components/NewsCard";
import { RevealOnScroll } from "@/components/module-landings/RevealOnScroll";
import { HomeHeroStage } from "@/components/home/HomeHeroStage";
import type { NewsItem } from "@/lib/content/news";
import { HOME_MODULES, LK_URL, NAV_MODULES, SITE } from "@/lib/site";

const FEATURED = [
  {
    href: "/analiz-relevantnosti/",
    title: "Анализ релевантности",
    desc: "Страница рядом с ТОП‑10: каких слов не хватает, где переспам, что отдать копирайтеру списком.",
    cta: "Сравнить с ТОП выдачи",
    image: "/modules/assets/home-card-relevance-v2.png",
  },
  {
    href: "/monitoring-pozicii-sayta/",
    title: "Мониторинг позиций",
    desc: "Яндекс и Google по своим ключам, история срезов, выгрузка к созвону с клиентом.",
    cta: "Смотреть динамику позиций",
    image: "/modules/assets/home-card-positions-v2.png",
  },
  {
    href: "/klasterizator-klyuchevykh-slov/",
    title: "Кластеризатор",
    desc: "Ядро по пересечению URL в выдаче — структура сайта без ручной разметки в Excel.",
    cta: "Собрать кластеры из ядра",
    image: "/modules/assets/home-card-cluster-v2.png",
  },
  {
    href: "/analiz-konkurentov/",
    title: "Анализ конкурентов",
    desc: "Кто сидит в ТОП по вашим фразам, какие у них посадочные и мета.",
    cta: "Кто в ТОП по вашим фразам",
    image: "/modules/assets/home-card-competitors-v2.png",
  },
  {
    href: "/analiz-teksta/",
    title: "Анализ текста",
    desc: "Тошнота, вода, уникальность — до публикации, а не после просадки.",
    cta: "Проверить текст до публикации",
    image: "/modules/assets/home-card-text-v2.png",
  },
  {
    href: "/monitoring-saytov/",
    title: "Мониторинг сайтов",
    desc: "Uptime и алерт в Telegram, когда страница или весь сайт перестали отвечать.",
    cta: "Поймать падение сайта",
    image: "/modules/assets/home-card-sites-v2.png",
  },
  {
    href: "/proverka-meta-tegov-online/",
    title: "Мониторинг мета-тегов",
    desc: "Title и description по проекту: кто поменял и что уехало.",
    cta: "Кто поменял title",
    image: "/modules/assets/home-card-meta-v2.png",
  },
  {
    href: "/otslezhivanie-ssylok/",
    title: "Отслеживание ссылок",
    desc: "Ежедневная проверка размещения: ссылка пропала — приходит уведомление.",
    cta: "Ссылка пропала — узнать сразу",
    image: "/modules/assets/home-card-links-v2.png",
  },
] as const;

const FEATURED_HREFS = new Set<string>(FEATURED.map((item) => item.href));

const MORE_MODULES = [
  ...HOME_MODULES.filter((mod) => !FEATURED_HREFS.has(mod.href)),
  ...NAV_MODULES.filter(
    (mod) =>
      !FEATURED_HREFS.has(mod.href) &&
      !HOME_MODULES.some((h) => h.href === mod.href)
  ).map((mod) => ({
    href: mod.href,
    title: mod.label,
    description: "",
  })),
].slice(0, 10);

const JOBS = [
  {
    title: "Ядро без пяти вкладок Wordstat",
    text: "Собрали фразы, сняли дубли, разложили по кластерам — и сразу видно, какие посадочные нужны.",
    href: "/klasterizator-klyuchevykh-slov/",
  },
  {
    title: "Правки под ТОП, а не «кажется, мало ключей»",
    text: "Релевантность сравнивает страницу с выдачей и отдаёт конкретный список: добавить / убрать / не трогать.",
    href: "/analiz-relevantnosti/",
  },
  {
    title: "Просадка и простой — раньше, чем клиент в чат",
    text: "Позиции, uptime, мета и ссылки с историей. Если что-то уехало — письмо или Telegram, не «ой, вчера упали».",
    href: "/monitoring-pozicii-sayta/",
  },
] as const;

type Props = {
  news: readonly NewsItem[];
};

export function TitloHome({ news }: Props) {
  return (
    <div className="home-human overflow-x-clip">
      <section className="home-human-hero relative min-h-[min(100svh,920px)] overflow-hidden text-white">
        <div className="home-human-hero__bg pointer-events-none absolute inset-0" aria-hidden />
        <div className="home-human-hero__grid pointer-events-none absolute inset-0 opacity-[0.35]" aria-hidden />

        <div className="relative z-10 mx-auto grid min-h-[min(100svh,920px)] max-w-6xl items-center gap-12 px-4 pb-24 pt-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(300px,1fr)] lg:gap-10 lg:pb-28 lg:pt-20">
          <div className="home-human-copy">
            <p className="home-human-brand font-semibold tracking-tight text-white">
              {SITE.name}
            </p>
            <h1 className="mt-5 max-w-xl text-3xl font-bold leading-[1.12] tracking-tight text-white md:text-4xl lg:text-[2.85rem]">
              Кабинет, в котором мы сами закрываем SEO‑проекты
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-300">
              Позиции по Яндексу и Google, сверка с ТОП, конкуренты, семантика и алерты —
              без ночной склейки из пяти сервисов в один Excel.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={`${LK_URL}/register`}
                className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-3.5 text-base font-bold text-brand-800 transition hover:bg-brand-50"
              >
                Начать бесплатно
              </a>
              <Link
                href="/services/"
                className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/5 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition hover:border-white/50 hover:bg-white/10"
              >
                Все модули
              </Link>
            </div>
            <p className="mt-8 text-sm text-slate-400">
              Free после регистрации · демо‑кабинет без карты · Яндекс и Google
            </p>
          </div>

          <div className="home-human-shot relative pb-8 lg:pb-4">
            <HomeHeroStage />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <RevealOnScroll>
            <h2 className="max-w-2xl text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Зачем нам свой кабинет, если можно жить в Excel
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
              Мы ведём клиентские проекты маркетингом и пишем модули под свою же рутину.
              Не «19 инструментов на витрине», а цепочка: ядро → сверка с выдачей → контроль.
            </p>
          </RevealOnScroll>

          <ol className="mt-12 space-y-0 border-t border-slate-200">
            {JOBS.map((job, i) => (
              <RevealOnScroll key={job.href} delayMs={i * 80}>
                <li className="border-b border-slate-200">
                  <Link
                    href={job.href}
                    className="group grid gap-3 py-7 transition md:grid-cols-[3rem_1fr_auto] md:items-baseline md:gap-8"
                  >
                    <span className="font-mono text-sm font-semibold text-brand-600">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-700 md:text-xl">
                        {job.title}
                      </h3>
                      <p className="mt-2 max-w-2xl text-base leading-relaxed text-slate-600">
                        {job.text}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-brand-600 opacity-0 transition group-hover:opacity-100 md:justify-self-end">
                      Открыть →
                    </span>
                  </Link>
                </li>
              </RevealOnScroll>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <RevealOnScroll>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                  С чего обычно заходят
                </h2>
                <p className="mt-3 max-w-xl text-base text-slate-600">
                  Дальше в каталоге — UTM, HTTP, аудит сайта, записи домена и остальное.
                </p>
              </div>
              <Link
                href="/services/"
                className="font-semibold text-brand-600 hover:text-brand-700"
              >
                Все модули →
              </Link>
            </div>
          </RevealOnScroll>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED.map((item, i) => (
              <RevealOnScroll key={item.href} delayMs={i * 40}>
                <Link
                  href={item.href}
                  className="home-human-card group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-brand-300"
                >
                  {item.image ? (
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <img
                        src={item.image}
                        alt=""
                        width={800}
                        height={500}
                        loading="eager"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover object-[center_30%] transition duration-500 group-hover:scale-[1.03]"
                      />
                      <span className="pointer-events-none absolute bottom-2.5 left-2.5 max-w-[calc(100%-1.25rem)] rounded-md bg-[#111827]/92 px-2.5 py-1.5 text-[11px] font-semibold leading-snug tracking-wide text-white shadow-sm backdrop-blur-[2px]">
                        {item.cta}
                        <span className="ml-1 opacity-80 transition-transform duration-300 group-hover:translate-x-0.5 inline-block">
                          →
                        </span>
                      </span>
                    </div>
                  ) : (
                    <div className="flex h-40 items-center justify-center bg-gradient-to-br from-brand-50 to-slate-100">
                      <ModuleIcon href={item.href} className="h-12 w-12 text-2xl" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-700">
                      {item.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                      {item.desc}
                    </p>
                  </div>
                </Link>
              </RevealOnScroll>
            ))}
          </div>

          {MORE_MODULES.length > 0 && (
            <RevealOnScroll delayMs={120}>
              <div className="mt-12">
                <p className="text-sm font-semibold text-slate-500">Ещё в кабинете</p>
                <ul className="mt-4 flex flex-wrap gap-x-1 gap-y-2">
                  {MORE_MODULES.map((mod) => (
                    <li key={mod.href}>
                      <Link
                        href={mod.href}
                        className="inline-flex rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-white hover:text-brand-700"
                      >
                        {mod.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </RevealOnScroll>
          )}
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <RevealOnScroll>
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                  Пишем под то, чем сами пользуемся на клиентах
                </h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
                  Не обёртка над чужим API. Ведём проекты и докручиваем модули:
                  срезы, экспорт, алерты, сравнение с выдачей — когда это всплывает в работе.
                </p>
                <div className="mt-8 flex flex-wrap gap-6">
                  <Link href="/about/" className="font-semibold text-brand-600 hover:text-brand-700">
                    О компании →
                  </Link>
                  <Link href="/tarify/" className="font-semibold text-slate-600 hover:text-brand-700">
                    Тарифы и лимиты →
                  </Link>
                </div>
              </div>
              <div className="home-human-aside rounded-xl border border-slate-200 bg-slate-50 px-6 py-7">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Старт
                </p>
                <p className="mt-3 text-3xl font-bold text-slate-900">0&nbsp;₽</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  После регистрации — бесплатный тариф с лимитами.
                  Платный, когда нужно больше проверок и проектов.
                </p>
                <a
                  href={`${LK_URL}/register`}
                  className="mt-6 inline-flex font-semibold text-brand-600 hover:text-brand-700"
                >
                  Создать аккаунт →
                </a>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-brand-800 py-16 text-white md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <RevealOnScroll>
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl">
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                  Зайдите и прогоните свой домен
                </h2>
                <p className="mt-3 text-base leading-relaxed text-brand-100">
                  Без карты. Или сначала{" "}
                  <a
                    href={`${LK_URL}/demo-cabinet`}
                    className="underline decoration-white/40 underline-offset-2 hover:decoration-white"
                  >
                    демо‑кабинет
                  </a>
                  .
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`${LK_URL}/register`}
                  className="inline-flex rounded-xl bg-white px-7 py-3.5 font-semibold text-brand-800 transition hover:bg-brand-50"
                >
                  Регистрация
                </a>
                <a
                  href={`${LK_URL}/login`}
                  className="inline-flex rounded-xl border border-white/30 px-7 py-3.5 font-semibold transition hover:bg-white/10"
                >
                  Вход
                </a>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="bg-slate-50 py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <RevealOnScroll>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-slate-900">Что нового</h2>
              <Link href="/news/" className="font-semibold text-brand-600">
                Все новости →
              </Link>
            </div>
          </RevealOnScroll>
          <ul className="mt-8 space-y-4">
            {news.slice(0, 5).map((item, i) => (
              <RevealOnScroll key={item.slug} delayMs={i * 40}>
                <NewsCard item={item} priority={i === 0} />
              </RevealOnScroll>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
