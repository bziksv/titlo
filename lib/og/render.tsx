import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

const FONT_DIR = path.join(process.cwd(), "lib/og/fonts");

async function loadFonts() {
  // Сабсеты Inter под разными именами: иначе satori для weight 700 берёт латиницу bold,
  // а кириллицу — из regular. fontFamily ниже перечисляет оба семейства.
  const files = [
    ["inter-latin-400-normal.woff", "Inter", 400],
    ["inter-latin-700-normal.woff", "Inter", 700],
    ["inter-cyrillic-400-normal.woff", "InterCyr", 400],
    ["inter-cyrillic-700-normal.woff", "InterCyr", 700],
  ] as const;
  return Promise.all(
    files.map(async ([file, name, weight]) => ({
      name,
      data: await readFile(path.join(FONT_DIR, file)),
      weight,
      style: "normal" as const,
    }))
  );
}

type OgInput = { eyebrow: string; title: string; subtitle?: string };

/** Превью 1200×630 в стиле hero лендингов (тёмный фон, бренд-синий акцент). Шрифт Inter (OFL) с кириллицей. */
export async function renderOgImage({ eyebrow, title, subtitle }: OgInput) {
  const host = SITE.siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundColor: "#070d1a",
          backgroundImage:
            "radial-gradient(ellipse 60% 55% at 78% 35%, rgba(47,93,224,0.35), transparent 70%), radial-gradient(ellipse 45% 40% at 10% 85%, rgba(30,63,158,0.25), transparent 65%)",
          color: "#fff",
          fontFamily: "Inter, InterCyr",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              backgroundColor: "#2f5de0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            Т
          </div>
          <div style={{ fontSize: 34, fontWeight: 700 }}>{SITE.name}</div>
          <div style={{ fontSize: 26, color: "#94a3b8", marginLeft: 8 }}>SEO-инструменты</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: "#93b4ff", textTransform: "uppercase", letterSpacing: 2 }}>
            {eyebrow}
          </div>
          <div style={{ marginTop: 18, fontSize: title.length > 40 ? 60 : 72, fontWeight: 700, lineHeight: 1.08 }}>
            {title}
          </div>
          {subtitle ? (
            <div style={{ marginTop: 22, fontSize: 30, color: "#cbd5e1", lineHeight: 1.35, maxWidth: 1000 }}>
              {subtitle}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#94a3b8" }}>
          <div>Яндекс · Google · отчёты для клиентов</div>
          <div style={{ color: "#fff" }}>{host}</div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await loadFonts() }
  );
}
