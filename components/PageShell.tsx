import type { ReactNode } from "react";

type Props = {
  title: string;
  lead?: string;
  children: ReactNode;
  /** Компактный заголовок без большого hero */
  compact?: boolean;
};

export function PageShell({ title, lead, children, compact }: Props) {
  if (compact) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">{title}</h1>
        {lead && <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">{lead}</p>}
        <div className="mt-6">{children}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="border-b border-slate-200 bg-gradient-to-br from-white via-brand-50/30 to-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
            {title}
          </h1>
          {lead && (
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600 md:text-xl">{lead}</p>
          )}
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">{children}</div>
    </div>
  );
}
