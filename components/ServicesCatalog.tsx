import Link from "next/link";
import { getModuleIcon } from "@/lib/module-icons";
import {
  SERVICE_CATEGORIES,
  SERVICE_ITEMS,
  serviceItemsByCategory,
  type ServiceItem,
} from "@/lib/content/services";
import { demoCabinetHref } from "@/lib/demo-cabinet";
import { LK_URL } from "@/lib/site";

function ModuleCard({ item }: { item: ServiceItem }) {
  return (
    <li className="min-h-0">
      <Link
        href={item.href}
        className="services-card group relative flex h-full min-h-[13.5rem] flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition duration-300 hover:-translate-y-1 hover:border-brand-400/45 hover:bg-white/[0.06] hover:shadow-[0_24px_60px_-28px_rgba(47,93,224,0.55)]"
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/50 to-transparent opacity-0 transition group-hover:opacity-100"
          aria-hidden
        />
        <div className="flex items-start gap-3">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-brand-600/20 text-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
            aria-hidden
          >
            {getModuleIcon(item.href)}
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <h3 className="min-h-[2.75rem] text-[0.98rem] font-semibold leading-snug text-white transition group-hover:text-brand-100">
              {item.title}
            </h3>
          </div>
        </div>
        <p className="mt-3 line-clamp-2 min-h-[2.6rem] text-sm leading-relaxed text-slate-400">
          {item.description}
        </p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-brand-300 transition group-hover:gap-2.5 group-hover:text-white">
          Открыть
          <span aria-hidden>→</span>
        </span>
      </Link>
    </li>
  );
}

function FlagshipCard({ item }: { item: ServiceItem }) {
  return (
    <Link
      href={item.href}
      className="services-flagship group relative block overflow-hidden rounded-[1.35rem] border border-brand-400/30 bg-gradient-to-br from-[#0d1830] via-[#0a1224] to-[#070d1a] p-6 shadow-[0_30px_80px_-40px_rgba(47,93,224,0.8)] transition duration-500 hover:border-brand-300/50 md:p-8 lg:p-10"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl transition duration-700 group-hover:bg-brand-400/30"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-sky-500/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />

      <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/15 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-amber-200">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_10px_rgba(252,211,77,0.9)]" aria-hidden />
              Флагман
            </span>
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-300">
              Центр управления контентом
            </span>
          </div>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-[2.6rem] lg:leading-[1.12]">
            {item.title}
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300 md:text-lg">
            {item.description}
          </p>
          <span className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-brand-800 transition group-hover:bg-brand-50">
            Смотреть модуль
            <span aria-hidden className="transition group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </div>

        <div className="relative hidden min-h-[11rem] lg:block">
          <div className="absolute inset-y-2 right-0 w-[92%] rotate-2 rounded-2xl border border-white/10 bg-[#111827]/80 p-4 shadow-2xl backdrop-blur-sm transition duration-500 group-hover:rotate-1">
            <div className="mb-3 flex gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-400/80" />
              <span className="h-2 w-2 rounded-full bg-amber-400/80" />
              <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
            </div>
            <div className="space-y-2">
              <div className="h-2.5 w-3/4 rounded bg-white/15" />
              <div className="h-2.5 w-full rounded bg-white/10" />
              <div className="h-2.5 w-5/6 rounded bg-white/10" />
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="h-12 rounded-lg bg-brand-500/25 ring-1 ring-brand-400/30" />
                <div className="h-12 rounded-lg bg-emerald-500/20 ring-1 ring-emerald-400/20" />
                <div className="h-12 rounded-lg bg-sky-500/20 ring-1 ring-sky-400/20" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-[70%] -rotate-3 rounded-xl border border-white/10 bg-[#0b1220] p-3 shadow-xl transition duration-500 group-hover:-rotate-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-300">TLP · облака · зоны</p>
            <p className="mt-1 text-xs text-slate-400">Посадочная vs ТОП в одном отчёте</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ServicesCatalog() {
  const flagship = SERVICE_ITEMS.find((item) => item.flagship);
  const count = SERVICE_ITEMS.length;

  return (
    <div className="services-catalog -mx-[max(0px,calc((100vw-100%)/2))] w-screen max-w-[100vw] overflow-x-clip bg-[#05070f] text-white">
      <section className="relative overflow-hidden border-b border-white/5">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(ellipse 55% 45% at 70% 20%, rgba(47, 93, 224, 0.28), transparent 65%),
              radial-gradient(ellipse 40% 35% at 15% 80%, rgba(30, 63, 158, 0.18), transparent 60%)`,
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
          aria-hidden
        />

        <div className="relative mx-auto max-w-6xl px-4 py-14 md:py-20">
          <p className="text-sm text-slate-400">
            <Link href="/" className="hover:text-white">
              Главная
            </Link>
            <span className="mx-2 opacity-50">/</span>
            <span className="text-slate-200">Модули</span>
          </p>
          <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-200">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" aria-hidden />
            Каталог платформы
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
            Модули Титло —{" "}
            <span className="bg-gradient-to-r from-white via-brand-100 to-sky-200 bg-clip-text text-transparent">
              один кабинет
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
            {count} SEO-инструментов с демо на сайте. Полный доступ — после регистрации в личном кабинете.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`${LK_URL}/register`}
              className="inline-flex rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-800 transition hover:bg-brand-50"
            >
              Получить доступ
            </a>
            <a
              href={`${LK_URL}/login`}
              className="inline-flex rounded-xl border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Уже есть кабинет →
            </a>
          </div>
        </div>
      </section>

      <div className="relative mx-auto max-w-6xl px-4 py-12 md:py-16">
        {flagship ? (
          <div className="mb-14 md:mb-16">
            <FlagshipCard item={flagship} />
          </div>
        ) : null}

        <div className="space-y-14 md:space-y-16">
          {SERVICE_CATEGORIES.filter((cat) => cat.id !== "flagship").map((cat) => {
            const items = serviceItemsByCategory(cat.id);
            if (!items.length) return null;
            return (
              <section key={cat.id} aria-labelledby={`services-cat-${cat.id}`}>
                <div className="mb-6 flex flex-col gap-1 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2
                      id={`services-cat-${cat.id}`}
                      className="text-xl font-bold tracking-tight text-white md:text-2xl"
                    >
                      {cat.title}
                    </h2>
                    <p className="mt-1 max-w-xl text-sm text-slate-400">{cat.lead}</p>
                  </div>
                  <p className="font-mono text-xs uppercase tracking-wider text-slate-500">
                    {items.length}{" "}
                    {items.length === 1 ? "модуль" : items.length < 5 ? "модуля" : "модулей"}
                  </p>
                </div>
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
                  {items.map((item) => (
                    <ModuleCard key={item.href} item={item} />
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        <div className="mt-16 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-8 text-center md:px-10">
          <p className="text-lg font-semibold text-white">Готовы работать в кабинете?</p>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-slate-400">
            Регистрация открывает все модули и лимиты по тарифу. Или зайдите в{" "}
            <a
              href={demoCabinetHref("/services/")}
              className="font-medium text-brand-300 underline decoration-brand-400/40 underline-offset-2 transition hover:text-brand-200 hover:decoration-brand-200"
            >
              демо‑кабинет
            </a>{" "}
            — без карты, с уже заполненными проектами.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`${LK_URL}/register`}
              className="inline-flex rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-500"
            >
              Создать аккаунт
            </a>
            <a
              href={demoCabinetHref("/services/")}
              className="inline-flex rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/35 hover:bg-white/10"
            >
              Демо кабинет
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
