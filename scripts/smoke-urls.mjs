/**
 * Smoke-тест URL после деплоя / локального start.
 * BASE_URL=http://localhost:3001 node scripts/smoke-urls.mjs
 */
import {
  loadLegalPaths,
  loadModulePaths,
  loadNewsDetailPaths,
} from "./lib/load-paths.mjs";

const BASE = (process.env.BASE_URL ?? "http://localhost:3001").replace(/\/$/, "");

const CORE_200 = [
  "/",
  "/about/",
  "/contact/",
  "/tarify/",
  "/services/",
  "/faq/",
  "/news/",
  "/news/istoriya-kompanii/",
  "/sitemap.xml",
  "/robots.txt",
  "/api/health/",
  "/legal/doc/cookies-policy/",
  "/legal/doc/privacy-policy/",
  "/legal/doc/recommendation-rules/",
  "/legal/privacy-policy.pdf",
  "/legal/cookies-policy.pdf",
  "/legal/recommendation-rules.pdf",
];

const REDIRECTS = [
  { path: "/main/", expect: "/" },
  { path: "/catalog/", expect: "/services/" },
  { path: "/blog/", expect: "/news/" },
  { path: "/cart/", expect: "/" },
  { path: "/search/", expect: "/" },
  { path: "/404.php", expect: "/" },
  {
    path: "/upload/politika-ispolzovanija-cookies-redbox.png",
    expect: "/legal/doc/cookies-policy/",
  },
  { path: "/legal/cookies.png", expect: "/legal/doc/cookies-policy/" },
];

function buildPages200() {
  return [
    ...CORE_200,
    ...loadModulePaths(),
    ...loadLegalPaths(),
    ...loadNewsDetailPaths(),
  ];
}

async function check200(path) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, { redirect: "manual" });
  if (res.status !== 200) {
    throw new Error(`${path} → ${res.status} (expected 200)`);
  }
}

async function checkRedirect(path, expectPath) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, { redirect: "manual" });
  const loc = res.headers.get("location") ?? "";
  const ok =
    (res.status === 301 || res.status === 308 || res.status === 307) &&
    (loc.endsWith(expectPath) || loc.includes(expectPath));
  if (!ok) {
    throw new Error(`${path} → ${res.status} location=${loc} (expected ${expectPath})`);
  }
}

async function main() {
  const pages = buildPages200();
  console.log(`Smoke test: ${BASE}`);
  console.log(`Pages: ${pages.length}, redirects: ${REDIRECTS.length}\n`);

  let failed = 0;
  let ok = 0;

  for (const path of pages) {
    try {
      await check200(path);
      ok++;
    } catch (e) {
      console.error(`  FAIL ${e.message}`);
      failed++;
    }
  }
  console.log(`  OK 200 × ${ok}`);

  console.log("");
  for (const { path, expect } of REDIRECTS) {
    try {
      await checkRedirect(path, expect);
      console.log(`  OK redirect ${path} → ${expect}`);
    } catch (e) {
      console.error(`  FAIL ${e.message}`);
      failed++;
    }
  }

  console.log(failed ? `\n${failed} failure(s)` : "\nAll checks passed.");
  process.exit(failed ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
