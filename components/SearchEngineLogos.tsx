type Props = {
  className?: string;
  variant?: "hero" | "light";
};

export function SearchEngineLogos({ className = "", variant = "hero" }: Props) {
  const chip =
    variant === "hero"
      ? "border-white/25 bg-white/10 text-white"
      : "border-slate-200 bg-slate-50 text-slate-700";

  return (
    <div className={`flex flex-wrap items-center gap-4 ${className}`}>
      <span className="text-xs font-semibold uppercase tracking-widest opacity-70">
        Анализ выдачи
      </span>
      <div className="flex flex-wrap gap-3">
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold tracking-tight ${chip}`}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#fc3f1d] text-xs font-black text-white">
            Я
          </span>
          Яндекс
        </span>
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold tracking-tight ${chip}`}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-black text-[#4285F4] shadow-sm">
            G
          </span>
          Google
        </span>
      </div>
    </div>
  );
}
