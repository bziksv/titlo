"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ModuleIcon } from "@/lib/module-icons";
import { NewsCard } from "@/components/NewsCard";
import { RevealOnScroll } from "@/components/module-landings/RevealOnScroll";
import { HomeEcosystemOrbit } from "@/components/home/HomeEcosystemOrbit";
import type { NewsItem } from "@/lib/content/news";
import { HOME_MODULES, LK_URL, NAV_MODULES, SITE } from "@/lib/site";

const ROTATOR = [
  "SEO-специалиста",
  "маркетолога",
  "агентства",
  "владельца сайта",
  "копирайтера",
] as const;

const MARQUEE = [
  "релевантность",
  "позиции",
  "кластеры",
  "конкуренты",
  "мета-теги",
  "HTTP",
  "ROI",
  "UTM",
  "uptime",
  "индексация",
  "семантика",
  "отчёты",
] as const;

const STATS = [
  { value: 19, suffix: "", label: "модулей в платформе" },
  { value: 24, suffix: "/7", label: "мониторинг и алерты" },
  { value: 100, suffix: "+", label: "параметров в отчётах" },
  { value: 0, suffix: "₽", label: "старт после регистрации" },
] as const;

const PIPELINE = [
  {
    step: "01",
    title: "Соберите семантику",
    lead: "Генератор, кластеризатор, очистка дубликатов — ядро без Excel.",
    href: "/generator_slov/",
    chips: ["ядро", "Wordstat", "CSV"],
  },
  {
    step: "02",
    title: "Сравните с выдачей",
    lead: "Релевантность, конкуренты, мета и техника URL — в одной панели.",
    href: "/analiz-relevantnosti/",
    chips: ["ТОП‑10", "правки", "отчёт"],
  },
  {
    step: "03",
    title: "Контролируйте результат",
    lead: "Позиции, uptime, индексация — история и алерты для команды и клиента.",
    href: "/monitoring-pozicii-sayta/",
    chips: ["XLS", "Telegram", "24/7"],
  },
] as const;

const BENTO = [
  {
    href: "/analiz-relevantnosti/",
    title: "Анализ релевантности",
    desc: "ТОП, облака слов и список правок для копирайтера.",
    chips: ["ТОП‑10/20", "TLP"],
    image: "/modules/assets/9980661a65746246.png",
  },
  {
    href: "/monitoring-pozicii-sayta/",
    title: "Мониторинг позиций",
    desc: "Яндекс и Google, история срезов.",
    chips: ["2 ПС", "отчёт"],
    image: "/modules/assets/3d7d72c85b4af88c.jpg",
  },
  {
    href: "/klasterizator-klyuchevykh-slov/",
    title: "Кластеризатор",
    desc: "Группировка по пересечению URL в выдаче.",
    chips: ["CSV", "ТОП"],
    image: "/modules/assets/7ba8fc0938346394.png",
  },
  {
    href: "/analiz-konkurentov/",
    title: "Анализ конкурентов",
    desc: "Матрица доменов по ключам и региону.",
    chips: ["ТОП‑10", "мета"],
    image: "/modules/assets/1bf0b32d708e156e.png",
  },
  {
    href: "/monitoring-saytov/",
    title: "Мониторинг сайтов",
    desc: "Uptime и оповещения в Telegram.",
    chips: ["24/7", "алерт"],
    image: null,
  },
  {
    href: "/analiz-teksta/",
    title: "Анализ текста",
    desc: "Тошнота, вода и список слов.",
    chips: ["10+ метрик"],
    image: null,
  },
  {
    href: "/proverka-meta-tegov-online/",
    title: "Мониторинг мета-тегов",
    desc: "Title, description и контроль изменений.",
    chips: ["проекты", "страницы"],
    image: null,
  },
  {
    href: "/otslezhivanie-ssylok/",
    title: "Отслеживание ссылок",
    desc: "Проверка размещения и алерты, если ссылка пропала.",
    chips: ["ежедневно", "алерт"],
    image: null,
  },
] as const;

const BENTO_HREFS = new Set<string>(BENTO.map((item) => item.href));

/** Нижний ряд — остальные модули из меню, без дублей «Популярного». */
const HOME_MODULES_MORE = [
  ...HOME_MODULES.filter((mod) => !BENTO_HREFS.has(mod.href)),
  ...NAV_MODULES.filter(
    (mod) =>
      !BENTO_HREFS.has(mod.href) &&
      !HOME_MODULES.some((h) => h.href === mod.href)
  ).map((mod) => ({
    href: mod.href,
    title: mod.label,
    description: "Открыть модуль на сайте",
  })),
].slice(0, 8);


const PAIN_GAIN = {
  painTitle: "Без единой платформы",
  pains: [
    "Семантика в Excel, позиции — в другом сервисе, отчёт клиенту — в третьем",
    "Просадку по money-запросам замечаете, когда уже упал трафик",
    "Ночная сборка XLS из десятка вкладок перед созвоном",
  ],
  gainTitle: `С ${SITE.name}`,
  gains: [
    "19 модулей в одном кабинете — от ядра до мониторинга",
    "История проверок, экспорт и алерты без ручного пинга",
    "Связка модулей: релевантность → конкуренты → позиции",
  ],
} as const;

type Props = {
  heroTitle: string;
  aboutTitle?: string;
  aboutLead?: string;
  ctaTitle?: string;
  ctaLead?: string;
  news: readonly NewsItem[];
};

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const fn = () => setReduce(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return reduce;
}

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        const t0 = performance.now();
        const dur = 1400;
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / dur);
          const eased = 1 - (1 - p) ** 3;
          setN(Math.round(target * eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.disconnect();
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="tabular-nums">
      {n}
      {suffix}
    </span>
  );
}

function HeroDashboard({ reduceMotion, mouse }: { reduceMotion: boolean; mouse: { x: number; y: number } }) {
  return (
    <div
      className="home-panel-float relative mx-auto mt-12 w-full max-w-md overflow-hidden rounded-2xl border border-white/20 bg-white/[0.08] shadow-2xl backdrop-blur-xl lg:mx-0 lg:mt-0 lg:max-w-none"
      style={
        reduceMotion
          ? undefined
          : { transform: `rotateX(${mouse.y * 0.35}deg) rotateY(${mouse.x * 0.4}deg)` }
      }
    >
      <div className="home-hero-scan pointer-events-none absolute inset-0 z-10 opacity-30" aria-hidden />
      <div className="relative z-20 border-b border-white/10 px-4 py-3 font-mono text-xs text-slate-400">
        <span className="text-emerald-400">●</span> titlo · панель проекта
      </div>
      <div className="relative z-20 space-y-3 p-4">
        <div className="flex flex-wrap gap-2">
          {["ТОП‑10", "Яндекс · Google", "отчёт XLS"].map((chip) => (
            <span
              key={chip}
              className="home-float-chip rounded-lg border border-emerald-400/30 bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-100"
            >
              {chip}
            </span>
          ))}
        </div>
        <div className="home-sparkline relative h-28 overflow-hidden rounded-xl bg-gradient-to-t from-brand-600/50 to-brand-900/20 p-3">
          <svg viewBox="0 0 200 60" className="h-full w-full" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke="rgba(96,165,250,0.95)"
              strokeWidth="2.5"
              points="0,52 20,45 40,40 60,32 80,36 100,22 120,26 140,14 160,18 180,8 200,10"
              className="home-line-draw"
            />
            <polyline
              fill="none"
              stroke="rgba(52,211,153,0.5)"
              strokeWidth="1.5"
              points="0,48 30,42 70,38 110,28 150,20 200,15"
              className="home-line-draw"
              style={{ animationDelay: "0.4s" }}
            />
          </svg>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          {[
            { v: "+12", l: "ТОП‑3", c: "text-white" },
            { v: "847", l: "ключей", c: "text-white" },
            { v: "OK", l: "uptime", c: "text-emerald-300" },
          ].map((cell) => (
            <div key={cell.l} className="rounded-lg bg-white/10 py-2.5 backdrop-blur-sm">
              <span className={`block text-lg font-bold ${cell.c}`}>{cell.v}</span>
              <span className="text-slate-400">{cell.l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TitloHome({ heroTitle, aboutTitle, aboutLead, ctaTitle, ctaLead, news }: Props) {
  const reduceMotion = usePrefersReducedMotion();
  const [rotIdx, setRotIdx] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [pipelineStep, setPipelineStep] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => setRotIdx((i) => (i + 1) % ROTATOR.length), 2800);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => setPipelineStep((s) => (s + 1) % PIPELINE.length), 4500);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setMouse({
        x: ((e.clientX - cx) / cx) * 8,
        y: ((e.clientY - cy) / cy) * 6,
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduceMotion]);

  return (
    <div className="home-showcase overflow-x-clip">
      {/* Hero */}
      <section className="home-hero relative min-h-[min(100svh,960px)] overflow-hidden bg-[#05070f] text-white">
        <div className="home-hero-grid pointer-events-none absolute inset-0 opacity-[0.4]" aria-hidden />
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="home-orb home-orb-a absolute -left-32 top-16 h-[28rem] w-[28rem] rounded-full bg-brand-500/30 blur-[120px]" />
          <div className="home-orb home-orb-b absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-violet-500/25 blur-[100px]" />
          <div className="home-orb home-orb-c absolute left-1/4 top-1/3 h-72 w-72 rounded-full bg-emerald-500/20 blur-[90px]" />
        </div>

        <div className="relative z-10 mx-auto grid min-h-[min(100svh,960px)] max-w-6xl items-center gap-12 px-4 pb-20 pt-16 lg:grid-cols-[1fr_minmax(300px,420px)] lg:gap-10 lg:pb-24 lg:pt-20">
          <div>
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-200 backdrop-blur-md">
              <span className="home-pulse-dot h-2 w-2 rounded-full bg-emerald-400" />
              Платформа {SITE.name}
            </p>

            <h1 className="mt-8 text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl lg:text-[3.5rem]">
              {heroTitle}
              <span className="mt-3 block text-brand-300">
                для{" "}
                <span key={rotIdx} className="home-rotator-word inline-block text-white">
                  {ROTATOR[rotIdx]}
                </span>
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
              Анализ, мониторинг и семантика в одном кабинете — отчёты для клиента без ночной сборки в Excel.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`${LK_URL}/register`}
                className="home-cta-primary rounded-2xl bg-white px-8 py-4 text-base font-bold text-brand-800 shadow-xl shadow-brand-900/40 transition hover:scale-[1.02] hover:bg-brand-50"
              >
                Начать бесплатно
              </a>
              <Link
                href="/services/"
                className="rounded-2xl border border-white/25 bg-white/[0.06] px-8 py-4 font-semibold backdrop-blur-md transition hover:border-brand-400/50 hover:bg-white/10"
              >
                Все 19 модулей
              </Link>
            </div>

            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400" aria-hidden>
                  ✓
                </span>
                Яндекс и Google
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400" aria-hidden>
                  ✓
                </span>
                Старт 0 ₽
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400" aria-hidden>
                  ✓
                </span>
                Экспорт XLS / PDF
              </li>
            </ul>
          </div>

          <HeroDashboard reduceMotion={reduceMotion} mouse={mouse} />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-2 pb-8 text-slate-500">
          <span className="text-xs uppercase tracking-widest">листайте</span>
          <span className="home-scroll-hint block h-10 w-px bg-gradient-to-b from-brand-400 to-transparent" />
        </div>
      </section>

      {/* Marquee */}
      <div className="home-marquee-wrap border-y border-slate-800/80 bg-[#0a0f1c] py-5">
        <div className="home-marquee-track flex gap-12 whitespace-nowrap text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
          {[...MARQUEE, ...MARQUEE].map((word, i) => (
            <span key={`${word}-${i}`} className="text-slate-500">
              {word}
              <span className="mx-5 text-brand-500/80">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* Pain / Gain */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl lg:grid-cols-2">
          <RevealOnScroll className="border-b border-slate-200 bg-slate-50 px-6 py-14 md:px-10 lg:border-b-0 lg:border-r">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500">
              {PAIN_GAIN.painTitle}
            </h2>
            <ul className="mt-8 space-y-5">
              {PAIN_GAIN.pains.map((p) => (
                <li key={p} className="flex gap-4 text-slate-700">
                  <span
                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-600"
                    aria-hidden
                  >
                    −
                  </span>
                  <span className="text-base leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </RevealOnScroll>
          <RevealOnScroll delayMs={120} className="bg-brand-800 px-6 py-14 text-white md:px-10">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-brand-200">
              {PAIN_GAIN.gainTitle}
            </h2>
            <ul className="mt-8 space-y-5">
              {PAIN_GAIN.gains.map((g) => (
                <li key={g} className="flex gap-4">
                  <span
                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white"
                    aria-hidden
                  >
                    ✓
                  </span>
                  <span className="text-base leading-relaxed text-brand-50">{g}</span>
                </li>
              ))}
            </ul>
          </RevealOnScroll>
        </div>
      </section>

      {/* Pipeline */}
      <section className="bg-gradient-to-b from-white to-slate-50 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <RevealOnScroll>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Сценарий</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
              От ядра до отчёта — три шага
            </h2>
          </RevealOnScroll>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {PIPELINE.map((step, i) => (
              <RevealOnScroll key={step.step} delayMs={i * 100}>
                <Link
                  href={step.href}
                  className={`home-pipeline-card group relative block h-full overflow-hidden rounded-2xl border p-6 transition ${
                    pipelineStep === i
                      ? "border-brand-400 bg-white shadow-lg shadow-brand-100/50"
                      : "border-slate-200 bg-white shadow-sm hover:border-brand-200"
                  }`}
                >
                  <span className="font-mono text-sm font-bold text-brand-600">{step.step}</span>
                  <h3 className="mt-3 text-xl font-bold text-slate-900 group-hover:text-brand-700">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.lead}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {step.chips.map((c) => (
                      <span
                        key={c}
                        className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                  <span className="mt-6 inline-flex text-sm font-semibold text-brand-600">
                    Модуль →
                  </span>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <HomeEcosystemOrbit />

      {/* Bento */}
      <section className="mx-auto max-w-6xl px-4 py-20 md:py-28">
        <RevealOnScroll>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Популярное</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
                Модули с сильнейшей отдачей
              </h2>
            </div>
            <Link href="/services/" className="font-semibold text-brand-600 hover:text-brand-700">
              Все модули →
            </Link>
          </div>
        </RevealOnScroll>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENTO.map((item, i) => (
            <RevealOnScroll key={item.href} delayMs={i * 60}>
              <Link
                href={item.href}
                className="home-bento-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl"
              >
                {item.image && (
                  <div className="relative h-32 overflow-hidden bg-slate-900 lg:h-36">
                    <Image
                      src={item.image}
                      alt=""
                      width={400}
                      height={240}
                      className="h-full w-full object-cover object-top opacity-90 transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                  </div>
                )}
                <div className="relative flex flex-1 flex-col p-5">
                  <ModuleIcon
                    href={item.href}
                    className={`mb-3 ${item.image ? "h-9 w-9 text-lg" : "h-11 w-11 text-2xl"}`}
                  />
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-700">
                    {item.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                    {item.desc}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.chips.map((c) => (
                      <span
                        key={c}
                        className="rounded-md bg-brand-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-700"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>

        {HOME_MODULES_MORE.length > 0 && (
          <RevealOnScroll delayMs={200}>
            <div className="mt-14">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                Ещё из каталога
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {HOME_MODULES_MORE.map((mod) => (
                  <Link
                    key={mod.href}
                    href={mod.href}
                    className="home-module-tile group rounded-xl border border-slate-100 bg-slate-50/90 p-5 transition hover:border-brand-200 hover:bg-white hover:shadow-md"
                  >
                    <ModuleIcon href={mod.href} className="h-9 w-9 text-lg" />
                    <p className="mt-3 text-sm font-bold text-slate-900 group-hover:text-brand-700">
                      {mod.title}
                    </p>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">
                      {mod.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        )}
      </section>

      {aboutTitle && (
        <section className="border-y border-slate-200 bg-gradient-to-br from-slate-50 via-white to-brand-50/30 py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-4">
            <RevealOnScroll>
              <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">{aboutTitle}</h2>
              {aboutLead && (
                <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-600">{aboutLead}</p>
              )}
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/about/"
                  className="inline-flex font-semibold text-brand-600 hover:text-brand-700"
                >
                  О компании →
                </Link>
                <Link
                  href="/tarify/"
                  className="inline-flex font-semibold text-slate-600 hover:text-brand-700"
                >
                  Тарифы →
                </Link>
              </div>
            </RevealOnScroll>
          </div>
        </section>
      )}

      {/* Stats */}
      <section className="relative overflow-hidden bg-brand-800 py-20 text-white md:py-28">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15), transparent 45%), radial-gradient(circle at 80% 20%, rgba(139,92,246,0.2), transparent 40%)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4">
          <RevealOnScroll>
            <h2 className="text-center text-3xl font-bold md:text-4xl">Платформа в цифрах</h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-brand-100">
              Реальные лимиты и возможности — без маркетингового тумана.
            </p>
          </RevealOnScroll>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <RevealOnScroll key={s.label} delayMs={i * 80}>
                <div className="border-l-2 border-emerald-400/60 pl-6">
                  <p className="text-4xl font-bold md:text-5xl">
                    <CountUp target={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mt-2 text-sm text-brand-100">{s.label}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Tariffs teaser */}
      <section className="border-b border-slate-200 bg-white py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 text-center md:flex-row md:text-left">
          <RevealOnScroll className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Тарифы</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Free для старта, Pro для масштаба</h2>
            <p className="mt-2 text-slate-600">
              Лимиты по модулям — прозрачно на странице тарифов, без скрытых условий.
            </p>
          </RevealOnScroll>
          <Link
            href="/tarify/"
            className="shrink-0 rounded-xl bg-brand-600 px-8 py-3 font-semibold text-white shadow-md transition hover:bg-brand-700"
          >
            Сравнить тарифы
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20 md:py-28">
        <RevealOnScroll>
          <div className="home-cta-glow relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-violet-900 px-8 py-16 text-center text-white md:px-16 md:py-20">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_55%)]" />
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" aria-hidden />
            <h2 className="relative text-3xl font-bold md:text-4xl">{ctaTitle ?? "Приступим?"}</h2>
            <p className="relative mx-auto mt-4 max-w-2xl text-lg text-brand-50">
              {ctaLead ?? `Инструменты ${SITE.name} — в одном кабинете.`}
            </p>
            <div className="relative mt-10 flex flex-wrap justify-center gap-4">
              <a
                href={`${LK_URL}/register`}
                className="inline-block rounded-2xl bg-white px-10 py-4 font-bold text-brand-800 shadow-xl transition hover:scale-[1.02]"
              >
                Зарегистрироваться бесплатно
              </a>
              <a
                href={`${LK_URL}/login`}
                className="inline-block rounded-2xl border border-white/30 px-8 py-4 font-semibold backdrop-blur-sm transition hover:bg-white/10"
              >
                Вход в кабинет
              </a>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* News */}
      <section className="bg-slate-100 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <RevealOnScroll>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Новости</h2>
              <Link href="/news/" className="font-semibold text-brand-600">
                Все →
              </Link>
            </div>
          </RevealOnScroll>
          <ul className="mt-8 space-y-4">
            {news.slice(0, 5).map((item, i) => (
              <RevealOnScroll key={item.slug} delayMs={i * 50}>
                <NewsCard item={item} />
              </RevealOnScroll>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
