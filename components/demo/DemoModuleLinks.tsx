type LinkItem = {
  href: string;
  label: string;
};

type Props = {
  title?: string;
  links: LinkItem[];
};

export function DemoModuleLinks({ title = "Дальше по пайплайну", links }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="inline-flex rounded-lg border border-brand-200 bg-brand-50/60 px-3 py-1.5 text-sm font-medium text-brand-800 transition hover:bg-brand-100"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
