"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { RevealOnScroll } from "@/components/module-landings/RevealOnScroll";
import { MonitoringV2SectionHeader } from "@/components/module-landings/monitoring-v2/MonitoringV2SectionHeader";
import { ModuleLeadCta } from "@/components/ModuleLeadCta";

type Act = {
  act: string;
  title: string;
  lead: string;
  image: string;
  imageAlt: string;
  imageFocus?: string;
  points: readonly string[];
};

function actImageClass(image: string) {
  if (image.includes("518ec")) return "aspect-[1024/260] min-h-[200px]";
  // Кабинетные скрины — без фиксированного кропа (см. actFigure ниже)
  if (
    image.includes("text-anal-shot") ||
    image.includes("site-audit-shot") ||
    image.includes("relevance-shot") ||
    image.includes("phrase-commerce-shot") ||
    image.includes("pw-gen-shot") ||
    image.includes("domain-records-shot") ||
    image.includes("domain-reg-shot") ||
    image.includes("link-track-shot") ||
    image.includes("text-length-shot") ||
    image.includes("list-compare-shot") ||
    image.includes("dedup-shot") ||
    image.includes("site-types-shot") ||
    image.includes("html-editor-shot") ||
    image.includes("http-headers-shot") ||
    image.includes("utm-shot") ||
    image.includes("esenin-shot") ||
    image.includes("cluster-shot") ||
    image.includes("meta-tags-shot") ||
    image.includes("monitoring-v2-shot")
  )
    return "";
  return "aspect-[739/385] min-h-[240px]";
}

function isCabinetShot(image: string) {
  return (
    image.includes("text-anal-shot") ||
    image.includes("site-audit-shot") ||
    image.includes("relevance-shot") ||
    image.includes("phrase-commerce-shot") ||
    image.includes("pw-gen-shot") ||
    image.includes("domain-records-shot") ||
    image.includes("domain-reg-shot") ||
    image.includes("link-track-shot") ||
    image.includes("text-length-shot") ||
    image.includes("list-compare-shot") ||
    image.includes("dedup-shot") ||
    image.includes("site-types-shot") ||
    image.includes("html-editor-shot") ||
    image.includes("http-headers-shot") ||
    image.includes("utm-shot") ||
    image.includes("esenin-shot") ||
    image.includes("cluster-shot") ||
    image.includes("meta-tags-shot") ||
    image.includes("monitoring-v2-shot")
  );
}

type StorySection = {
  id: string;
  eyebrow: string;
  title: string;
  lead: string;
  midCta?: { title: string; lead?: string };
};

export function MonitoringV2StoryActs({
  acts,
  section = {
    id: "monitoring-v2-story",
    eyebrow: "Три акта",
    title: "От ядра до отчёта — один непрерывный сценарий",
    lead: "Прокрутите сюжет или выберите этап — навигация синхронизирована со скроллом.",
  },
}: {
  acts: readonly Act[];
  section?: StorySection;
}) {
  const midCta = section.midCta ?? (
    acts.some(
      (a) =>
        a.image.includes("site-audit-shot") ||
        a.image.includes("relevance-shot") ||
        a.image.includes("phrase-commerce-shot") ||
        a.image.includes("pw-gen-shot") ||
        a.image.includes("domain-records-shot") ||
        a.image.includes("domain-reg-shot") ||
        a.image.includes("link-track-shot") ||
        a.image.includes("text-length-shot") ||
        a.image.includes("list-compare-shot") ||
        a.image.includes("dedup-shot") ||
        a.image.includes("site-types-shot") ||
        a.image.includes("html-editor-shot") ||
        a.image.includes("http-headers-shot") ||
        a.image.includes("utm-shot") ||
        a.image.includes("esenin-shot") ||
        a.image.includes("cluster-shot") ||
        a.image.includes("meta-tags-shot")
    )
      ? {
          title: acts.some((a) => a.image.includes("pw-gen-shot"))
            ? "Попробовать генератор?"
            : acts.some((a) => a.image.includes("cluster-shot"))
              ? "Посмотреть готовые кластеры?"
              : acts.some((a) => a.image.includes("meta-tags-shot"))
                ? "Посмотреть готовый снимок?"
              : acts.some((a) => a.image.includes("html-editor-shot"))
              ? "Открыть HTML-редактор?"
              : acts.some((a) => a.image.includes("http-headers-shot"))
              ? "Посмотреть ответ сервера?"
              : acts.some((a) => a.image.includes("utm-shot"))
              ? "Собрать UTM-ссылку?"
              : acts.some((a) => a.image.includes("esenin-shot"))
              ? "Посмотреть готовый разбор?"
              : acts.some((a) => a.image.includes("dedup-shot"))
              ? "Посмотреть готовую очистку?"
              : acts.some((a) => a.image.includes("site-types-shot"))
              ? "Посмотреть готовый срез типов?"
              : acts.some((a) => a.image.includes("list-compare-shot"))
              ? "Посмотреть готовую сверку?"
              : acts.some((a) => a.image.includes("text-length-shot"))
              ? "Посмотреть готовый подсчёт?"
              : acts.some((a) => a.image.includes("link-track-shot"))
              ? "Посмотреть демо-проект со ссылками?"
              : acts.some((a) => a.image.includes("domain-reg-shot"))
              ? "Посмотреть список доменов?"
              : acts.some((a) => a.image.includes("domain-records-shot"))
              ? "Посмотреть готовый снимок?"
              : "Посмотреть готовый отчёт?",
          lead: acts.some((a) => a.image.includes("pw-gen-shot"))
            ? "На этой странице — без лимитов. История с комментариями — в кабинете после регистрации."
            : acts.some((a) => a.image.includes("cluster-shot"))
              ? "В демо кабинета уже есть разобранное ядро: таблица кластеров и ручной редактор."
              : acts.some((a) => a.image.includes("meta-tags-shot"))
                ? "В демо кабинета уже есть снимок titlo.ru и сравнение двух проверок."
              : acts.some((a) => a.image.includes("html-editor-shot"))
              ? "В демо уже есть текст посадочной: визуал, HTML и готовые пресеты."
              : acts.some((a) => a.image.includes("http-headers-shot"))
              ? "В демо уже есть ответ titlo.ru: код 200, заголовки и HTML без нового запроса."
              : acts.some((a) => a.image.includes("utm-shot"))
              ? "В демо уже заполнена посадочная demo-shop.ru — метки и готовая ссылка без сборки с нуля."
              : acts.some((a) => a.image.includes("esenin-shot"))
              ? "В демо уже есть текст про ремонт фасада — баллы, подсветка и параметры без нового запуска."
              : acts.some((a) => a.image.includes("dedup-shot"))
              ? "В демо уже есть список с повторами — результат и KPI без ручной чистки."
              : acts.some((a) => a.image.includes("site-types-shot"))
              ? "В демо уже есть разбор «купить диван»: вердикт, доли типов и таблица доменов."
              : acts.some((a) => a.image.includes("list-compare-shot"))
              ? "В демо уже есть два списка и пересечение — без ручного VLOOKUP."
              : acts.some((a) => a.image.includes("text-length-shot"))
              ? "В демо уже есть текст и SEO-поля — символы, слова и лимиты title/description."
              : acts.some((a) => a.image.includes("link-track-shot"))
              ? "В демо уже есть проект demo-shop.ru: таблица ссылок, статусы и сводка проблемных."
              : acts.some((a) => a.image.includes("domain-reg-shot"))
              ? "В демо уже есть titlo.ru и demo-shop.ru — сроки, DNS и сводка рисков."
              : acts.some((a) => a.image.includes("domain-records-shot"))
              ? "В демо кабинета уже есть карточка titlo.ru: WHOIS, DNS и соседи по IP."
              : acts.some((a) => a.image.includes("phrase-commerce-shot"))
              ? "В демо кабинета уже есть разбор по гео, локализации и коммерции — без нового прогона."
              : acts.some((a) => a.image.includes("relevance-shot"))
                ? "В демо уже есть разбор посадочной с облаками и TLP — без запуска анализа."
                : "В демо уже есть проверка с ошибками по важности — без запуска обхода.",
        }
      : {
          title: "Готовы к первому срезу?",
          lead: "Создайте проект и загрузите ядро — проверка займёт минуты.",
        }
  );
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const i = refs.current.indexOf(visible[0].target as HTMLElement);
          if (i >= 0) setActive(i);
        }
      },
      { rootMargin: "-30% 0px -30% 0px", threshold: [0, 0.25, 0.5] }
    );
    refs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [acts]);

  return (
    <section id={section.id} className="scroll-mt-20 overflow-x-clip bg-slate-50 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <MonitoringV2SectionHeader
          eyebrow={section.eyebrow}
          title={section.title}
          lead={section.lead}
        />
      </div>

      {/* Mobile: горизонтальные табы — скролл внутри блока, не на всю страницу */}
      <div className="mx-auto mt-8 min-w-0 max-w-6xl px-4 lg:hidden">
        <div className="-mx-4 overflow-x-auto overscroll-x-contain px-4 [scrollbar-width:thin]">
          <div className="flex w-max max-w-none gap-2 pb-2">
          {acts.map((a, i) => (
            <button
              key={a.act}
              type="button"
              onClick={() => refs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                active === i
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              {a.act} {a.title.split(" ")[0]}
            </button>
          ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 grid min-w-0 max-w-6xl gap-10 px-4 lg:mt-14 lg:grid-cols-[minmax(0,300px)_1fr] lg:gap-16">
        <div className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
          <nav aria-label="Этапы сценария" className="relative pl-8">
            <div className="absolute bottom-2 left-[11px] top-2 w-0.5 bg-brand-100" aria-hidden />
            <div
              className="absolute left-[11px] w-0.5 bg-brand-600 transition-all duration-300"
              style={{
                top: "0.5rem",
                height: `calc(${((active + 0.5) / acts.length) * 100}% - 0.5rem)`,
              }}
              aria-hidden
            />
            <ul className="space-y-6">
              {acts.map((a, i) => (
                <li key={a.act}>
                  <button
                    type="button"
                    onClick={() => refs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" })}
                    className={`group relative block w-full text-left transition ${
                      active === i ? "opacity-100" : "opacity-45 hover:opacity-75"
                    }`}
                  >
                    <span
                      className={`absolute -left-8 top-1.5 h-3 w-3 rounded-full border-2 transition ${
                        active === i ? "border-brand-600 bg-brand-600 scale-110" : "border-slate-300 bg-white"
                      }`}
                      aria-hidden
                    />
                    <span className="font-mono text-sm text-brand-600">{a.act}</span>
                    <span className="mt-1 block text-lg font-bold text-slate-900">{a.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="min-w-0 space-y-20 md:space-y-28">
          {acts.map((a, i) => (
            <RevealOnScroll key={a.act} delayMs={i * 80}>
              <article
                ref={(el) => {
                  refs.current[i] = el;
                }}
                className="min-w-0 scroll-mt-28"
              >
                <p className="font-mono text-sm text-brand-600 lg:hidden">{a.act}</p>
                <h3 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">{a.title}</h3>
                <p className="mt-3 max-w-xl text-slate-600 leading-relaxed">{a.lead}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {a.points.map((p) => (
                    <li
                      key={p}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm"
                    >
                      {p}
                    </li>
                  ))}
                </ul>
                <figure className="mt-8 max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl ring-1 ring-slate-900/5">
                  {isCabinetShot(a.image) ? (
                    <img
                      src={a.image}
                      alt={a.imageAlt}
                      width={1600}
                      height={900}
                      className="block h-auto w-full"
                      loading="eager"
                      decoding="async"
                    />
                  ) : (
                    <div className={`relative max-w-full bg-slate-100 ${actImageClass(a.image)}`}>
                      <Image
                        src={a.image}
                        alt={a.imageAlt}
                        fill
                        className="object-cover p-0.5"
                        style={{ objectPosition: a.imageFocus ?? "left top" }}
                        sizes="(max-width: 1024px) 100vw, 720px"
                      />
                    </div>
                  )}
                </figure>
              </article>
            </RevealOnScroll>
          ))}

          <div className="rounded-2xl border border-brand-200 bg-brand-50 p-6 md:flex md:items-center md:justify-between md:gap-8">
            <div>
              <p className="text-sm font-semibold text-brand-700">{midCta.title}</p>
              {midCta.lead ? <p className="mt-1 text-slate-600">{midCta.lead}</p> : null}
            </div>
            <div className="mt-4 shrink-0 md:mt-0 md:min-w-[260px]">
              <ModuleLeadCta variant="card" idPrefix="monitoring-v2-acts" title="Открыть панель" hint="Бесплатный старт после регистрации." />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
