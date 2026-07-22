/** Иконки модулей (категории SEO-инструментов) */
const ICONS: Record<string, string> = {
  "analiz-relevantnosti": "📊",
  "analiz-konkurentov": "🔍",
  "monitoring-pozicii-sayta": "📈",
  "monitoring-pozicii-v2": "📈",
  "monitoring-pozicii-v3": "📈",
  "monitoring-saytov": "🛡️",
  "proverka-meta-tegov-online": "🏷️",
  generator_slov: "✨",
  "podschet-dliny-teksta": "📝",
  "generator-paroley": "🔐",
  "sravnenie-spiskov-klyuchevykh-fraz": "📋",
  "udalenie-dublikatov": "🧹",
  "utm-metki": "📎",
  "kalkulyator-roi": "💰",
  "http-headers": "🌐",
  "audit-sajta": "🧭",
  "proverka-indeksacii": "🔎",
  "proverka-teksta-esenin": "🛡️",
  "sbor-poiskovykh-podskazok": "💡",
  "zapisi-domena": "🛰️",
  "tipy-saitov-v-vydache": "🧭",
  "geo-lokalizaciya-kommerciya": "📍",
  "html-redaktor": "⌨️",
  "vydelenie-unikalnykh-slov-v-tekste": "💬",
  "otslezhivanie-ssylok": "🔗",
  "otslezhivanie-sroka-registratsii-domenov": "📅",
  "analiz-teksta": "📄",
  "klasterizator-klyuchevykh-slov": "🗂️",
};

export function getModuleIcon(href: string): string {
  const slug = href.replace(/^\/|\/$/g, "");
  return ICONS[slug] ?? "⚡";
}

/** Компактная иконка для пунктов меню */
export function NavMenuIcon({
  href,
  size = "md",
}: {
  href: string;
  size?: "sm" | "md";
}) {
  const box = size === "sm" ? "h-7 w-7 text-sm rounded-md" : "h-8 w-8 text-base rounded-lg";
  return (
    <span
      className={`flex shrink-0 items-center justify-center bg-brand-50 ${box}`}
      aria-hidden
    >
      {getModuleIcon(href)}
    </span>
  );
}

export function ModuleIcon({ href, className = "" }: { href: string; className?: string }) {
  return (
    <span
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-2xl ${className}`}
      aria-hidden
    >
      {getModuleIcon(href)}
    </span>
  );
}
