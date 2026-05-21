type Props = {
  eyebrow: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  dark?: boolean;
};

export function MonitoringV2SectionHeader({ eyebrow, title, lead, align = "left", dark = false }: Props) {
  const alignClass = align === "center" ? "text-center mx-auto" : "";
  const eyebrowClass = dark ? "text-brand-200" : "text-brand-600";
  const titleClass = dark ? "text-white" : "text-slate-900";
  const leadClass = dark ? "text-brand-100/90" : "text-slate-600";

  return (
    <header className={`max-w-2xl ${alignClass}`}>
      <p className={`text-sm font-semibold uppercase tracking-widest ${eyebrowClass}`}>{eyebrow}</p>
      <h2 className={`mt-2 text-3xl font-bold md:text-4xl ${titleClass}`}>{title}</h2>
      {lead && <p className={`mt-4 leading-relaxed ${leadClass}`}>{lead}</p>}
    </header>
  );
}
