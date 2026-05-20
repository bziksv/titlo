/**
 * Парсер лендингов Kraken (redbox.su): h2.main1 и контент до следующего h2 (в порядке DOM).
 */

const SKIP_SECTION =
  /тарифные план|вопросы\s*\/?\s*ответ|приступим к регистрации|зарегистрироваться\s*$/i;
const SKIP_TEXT = /cookie|BITRIX|Модули сервиса|info@|телеграм:\s*https/i;
const CSS_GARBAGE = /^\.[\w-]+\s*\{|box-shadow:\s*0\s+9px/i;

function cleanText(t) {
  return t.replace(/\s+/g, " ").trim();
}

function isDecorativeSrc(src) {
  return !src || /kraken\/b91|favicon|logo/i.test(src);
}

export function absUploadUrl(src, site = "https://redbox.su") {
  if (!src || isDecorativeSrc(src)) return "";
  if (src.startsWith("http")) return src;
  if (src.startsWith("//")) return `https:${src}`;
  return `${site}${src.startsWith("/") ? "" : "/"}${src}`;
}

function pushParagraph(blocks, text) {
  const t = cleanText(text);
  if (t.length < 12 || SKIP_TEXT.test(t) || CSS_GARBAGE.test(t)) return;
  const last = blocks[blocks.length - 1];
  if (last?.type === "p" && last.text === t) return;
  blocks.push({ type: "p", text: t });
}

function pushList(blocks, items) {
  const clean = items.map((i) => cleanText(i)).filter((i) => i.length > 2 && !CSS_GARBAGE.test(i));
  if (clean.length < 2) {
    clean.forEach((i) => pushParagraph(blocks, i));
    return;
  }
  blocks.push({ type: "list", items: clean });
}

function pushImage(blocks, src, site) {
  const url = absUploadUrl(src, site);
  if (!url) return;
  const last = blocks[blocks.length - 1];
  if (last?.type === "img" && last.src === url) return;
  blocks.push({ type: "img", src: url, alt: "" });
}

function dedupeBlocks(blocks) {
  const out = [];
  const seen = new Set();
  for (const b of blocks) {
    const key =
      b.type === "p"
        ? `p:${b.text}`
        : b.type === "list"
          ? `l:${b.items.join("\n")}`
          : `i:${b.src}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(b);
  }
  return out;
}

/** Собрать блоки из узла */
function collectBlocks($, $root, blocks, site) {
  $root.find("ul, ol").each((_, list) => {
    const items = [];
    $(list)
      .children("li")
      .each((__, li) => {
        const t = cleanText($(li).text());
        if (t) items.push(t);
      });
    if (items.length) pushList(blocks, items);
  });

  $root.find("p").each((_, p) => {
    if ($(p).closest("ul, ol").length) return;
    pushParagraph(blocks, $(p).text());
  });

  if ($root.is(".descrip") || $root.hasClass("descrip")) {
    const clone = $root.clone();
    clone.find("p, ul, ol, script, img").remove();
    const direct = cleanText(clone.text());
    if (direct.length > 40) pushParagraph(blocks, direct);
  }

  if (!$root.find("p").length && !$root.find("ul, ol").length) {
    const t = cleanText($root.text());
    if (t.length > 40 && !SKIP_TEXT.test(t)) pushParagraph(blocks, t);
  }

  $root.find("[data-src*='upload'], img[src*='upload']").each((_, el) => {
    const src = $(el).attr("data-src") || $(el).attr("src");
    pushImage(blocks, src, site);
  });
}

const CONTENT_SELECTOR =
  "h2.main1, div.descrip, div.descriptive, div.content, div.advantages";

export function parseKrakenSections($, site = "https://redbox.su") {
  const sections = [];
  const seen = new Set();
  let current = null;

  const $scope = $("main").length ? $("main") : $("body");

  $scope
    .find(CONTENT_SELECTOR)
    .filter((_, el) => {
      const $el = $(el);
      if ($el.is("h2.main1")) return true;
      if ($el.is("div.descrip")) return !$el.parents("div.descriptive, div.content").length;
      if ($el.is("div.descriptive")) return $el.parents("div.descriptive").length === 0;
      if ($el.is("div.content, div.advantages")) {
        if ($el.parents("div.content").length > 0) return false;
        if ($el.find(".descriptive").length > 0) return false;
        return true;
      }
      return false;
    })
    .each((_, el) => {
    const $el = $(el);

    if ($el.is("h2.main1")) {
      if (current?.blocks?.length) {
        current.blocks = dedupeBlocks(current.blocks);
        const key = `${current.title}::${current.blocks.length}`;
        if (!seen.has(key)) {
          seen.add(key);
          sections.push(current);
        }
      }

      const title = cleanText($el.text());
      if (!title || title.length < 3 || SKIP_SECTION.test(title) || CSS_GARBAGE.test(title)) {
        current = null;
        return;
      }
      current = { title, blocks: [] };
      return;
    }

    if (!current) return;

    if ($el.is("div.descrip")) {
      collectBlocks($, $el, current.blocks, site);
      return;
    }

    if ($el.is("div.descriptive")) {
      collectBlocks($, $el, current.blocks, site);
      return;
    }

    if ($el.is("div.content, div.advantages")) {
      collectBlocks($, $el, current.blocks, site);
    }
    });

  if (current?.blocks?.length) {
    current.blocks = dedupeBlocks(current.blocks);
    const key = `${current.title}::${current.blocks.length}`;
    if (!seen.has(key)) sections.push(current);
  }

  return sections;
}

export function parseKrakenLead($, sections = []) {
  const first = sections[0]?.blocks?.find((b) => b.type === "p");
  if (first?.text) return first.text.slice(0, 500);

  const $lead = $("main .descrip, .page-content .descrip").first();
  const t = cleanText($lead.text());
  if (t.length > 30 && !SKIP_TEXT.test(t)) return t.slice(0, 500);

  const meta = $("meta[name='description']").attr("content")?.trim();
  if (meta && !meta.includes("| Инструменты для SEO |")) return meta;

  const h1 = $("h1").first().text().replace(/\s+/g, " ").trim();
  return h1 || "";
}

export function parseH1($) {
  return $("h1").first().text().replace(/\s+/g, " ").trim();
}
