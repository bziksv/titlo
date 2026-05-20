import type { ContentBlock, Section } from "@/components/ContentSections";
import { publicCopy } from "@/lib/public-copy";

function blockKey(b: ContentBlock): string {
  if (b.type === "p") return `p:${b.text}`;
  if (b.type === "list") return `l:${b.items.join("\n")}`;
  return `i:${b.src}`;
}

/** Убрать дубли, склеить «• …» в списки, отфильтровать мусор */
export function normalizeSectionBlocks(blocks: ContentBlock[]): ContentBlock[] {
  const out: ContentBlock[] = [];
  const seen = new Set<string>();
  let bulletBuf: string[] = [];

  const flushBullets = () => {
    if (bulletBuf.length < 1) return;
    if (bulletBuf.length === 1) {
      pushUnique(out, seen, { type: "p", text: bulletBuf[0]! });
    } else {
      pushUnique(out, seen, { type: "list", items: [...bulletBuf] });
    }
    bulletBuf = [];
  };

  for (const b of blocks) {
    if (b.type === "p") {
      const t = b.text.trim();
      if (t.length < 8 || /^\.[\w-]+\s*\{/.test(t)) continue;

      if (/Знакомство с модулем/.test(t) && /Практическое занятие/.test(t)) {
        const parts = t.split(/(?=Знакомство с модулем|Практическое занятие)/).map((p) => p.trim()).filter(Boolean);
        if (parts.length > 1) {
          flushBullets();
          pushUnique(out, seen, { type: "list", items: parts });
          continue;
        }
      }

      const bullet = t.match(/^[•\-–]\s*(.+)$/);
      if (bullet) {
        bulletBuf.push(bullet[1]!);
        continue;
      }
      flushBullets();
      pushUnique(out, seen, { type: "p", text: t });
      continue;
    }
    flushBullets();
    if (b.type === "list") {
      const items = b.items.map((i) => i.trim()).filter((i) => i.length > 1);
      if (items.length) pushUnique(out, seen, { type: "list", items });
    }
    if (b.type === "img" && b.src) pushUnique(out, seen, b);
  }
  flushBullets();
  return out;
}

function pushUnique(out: ContentBlock[], seen: Set<string>, b: ContentBlock) {
  const k = blockKey(b);
  if (seen.has(k)) return;
  seen.add(k);
  out.push(b);
}

const TITLE_ALIASES: Record<string, string> = {
  "Наш инструмент разработан для анализа релевантности определенной страницы сайта по определенному ключевому запросу":
    "Как пользоваться",
};

export function displaySectionTitle(title: string): string {
  const t = publicCopy(title);
  if (TITLE_ALIASES[t]) return TITLE_ALIASES[t];
  if (TITLE_ALIASES[title]) return TITLE_ALIASES[title];
  if (t.length <= 56) return t;
  const cut = t.slice(0, 54).trim();
  const sp = cut.lastIndexOf(" ");
  return (sp > 28 ? cut.slice(0, sp) : cut) + "…";
}

function mapBlockPublic(b: ContentBlock): ContentBlock {
  if (b.type === "p") return { type: "p", text: publicCopy(b.text) };
  if (b.type === "list") return { type: "list", items: b.items.map(publicCopy) };
  return b;
}

export function prepareModuleSections(sections: Section[]): Section[] {
  return sections
    .map((s) => ({
      title: publicCopy(s.title),
      blocks: normalizeSectionBlocks(
        s.blocks?.length ? s.blocks : (s.paragraphs ?? []).map((text) => ({ type: "p" as const, text })),
      ).map(mapBlockPublic),
    }))
    .filter((s) => s.blocks.length > 0);
}

export function pickHeroImage(sections: Section[]): string | undefined {
  for (const s of sections) {
    for (const b of s.blocks ?? []) {
      if (b.type === "img" && b.src.startsWith("/")) return b.src;
    }
  }
  return undefined;
}
