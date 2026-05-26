import type { ModuleV2PostReg } from "@/lib/content/module-v2/types";

type Props = { data: ModuleV2PostReg };

export function ModuleV2PostRegSection({ data }: Props) {
  return (
    <section className="border-b border-slate-200 bg-white py-14 md:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-brand-600">{data.eyebrow}</p>
        <h2 className="mt-2 text-center text-2xl font-bold text-slate-900 md:text-3xl">{data.title}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">{data.lead}</p>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((item) => (
            <li
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm transition hover:border-brand-200 hover:bg-white"
            >
              <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
