#!/usr/bin/env node
/**
 * Locale QA against a running build (local `next start`, a preview deploy,
 * or production). content/i18n.test.ts already checks the route map, the
 * registries and the hreflang pairs as *data* at build time; this checks
 * what a crawler actually receives over HTTP:
 *
 *   - every Spanish URL returns 200, and an unknown /es URL returns 404
 *     (no soft 404s under /es)
 *   - each page self-canonicalizes to its own URL
 *   - reciprocal hreflang is present in the HTML on both sides of a pair,
 *     and the two sides agree
 *   - <html lang> matches the locale of the URL
 *   - a Spanish page has a Spanish <title>, description and <h1>
 *   - the sitemap lists every published Spanish URL
 *
 * Usage:
 *   node scripts/check-locales.mjs <fetchOrigin> [canonicalOrigin]
 *
 *   # against production, where the two origins are the same
 *   npm run verify:locales -- https://www.chirobackpain.com
 *
 *   # against a local build, which still emits production canonicals
 *   npm run verify:locales -- http://localhost:3000 https://www.chirobackpain.com
 *
 * `canonicalOrigin` defaults to `fetchOrigin`. They differ whenever the
 * build is served from somewhere other than its configured SITE_URL: a
 * canonical and an hreflang href must always name the production origin,
 * never the host the request happened to arrive on, so the checker has to
 * be told what to expect rather than assuming the two match.
 *
 * Note: run against a build with VERCEL_ENV=production if you also want the
 * robots meta tag to read "index, follow" — every nonproduction build
 * deliberately serves noindex (content/site.ts's isProduction()).
 */

const fetchArg = process.argv[2];
const canonicalArg = process.argv[3];

if (!fetchArg) {
  console.error("Usage: node scripts/check-locales.mjs <fetchOrigin> [canonicalOrigin]");
  console.error(
    "Example: npm run verify:locales -- http://localhost:3000 https://www.chirobackpain.com",
  );
  process.exit(1);
}

const fetchOrigin = fetchArg.replace(/\/$/, "");
/** What canonicals and hreflang hrefs are expected to point at. */
const origin = (canonicalArg ?? fetchArg).replace(/\/$/, "");

/** English path -> Spanish path. Mirrors content/i18n.ts's localizedRoutes;
 * content/i18n.test.ts is what keeps that file honest, and this list is the
 * over-the-wire spot check of the same pairs. */
const PAIRS = [
  ["/", "/es"],
  ["/car-accident-chiropractor", "/es/quiropractico-accidentes-de-auto"],
  ["/services", "/es/servicios"],
  ["/about", "/es/dr-abe-nasser"],
  ["/reviews", "/es/resenas"],
  ["/contact-us", "/es/contacto"],
  ["/book-an-appointment", "/es/solicitar-cita"],
  ["/conditions", "/es/condiciones"],
  // Draft on both sides (noindex, out of the sitemap) but still a real
  // hreflang pair — the annotation has to be reciprocal regardless of
  // indexing status, so these are checked like any other pair. The sitemap
  // assertion below deliberately only covers the published ones.
  ["/conditions/back-pain", "/es/condiciones/dolor-de-espalda"],
  ["/conditions/neck-pain", "/es/condiciones/dolor-de-cuello"],
  ["/conditions/sciatica", "/es/condiciones/ciatica"],
  ["/conditions/whiplash", "/es/condiciones/latigazo-cervical"],
  ["/conditions/cervicogenic-headache", "/es/condiciones/dolor-de-cabeza-cervicogenico"],
  ["/conditions/concussion", "/es/condiciones/conmocion-cerebral"],
  ["/conditions/tmj-jaw-pain", "/es/condiciones/dolor-de-mandibula-atm"],
  ["/services/chiropractic-adjustments", "/es/servicios/ajustes-quiropracticos"],
  ["/services/spinal-decompression", "/es/servicios/descompresion-espinal"],
  ["/services/soft-tissue-therapy", "/es/servicios/terapia-de-tejidos-blandos"],
  ["/services/cupping-therapy", "/es/servicios/terapia-de-ventosas"],
];

/** Pairs whose Spanish half is published and therefore must appear in the
 * sitemap. The draft pairs above are deliberately absent from it. */
const SITEMAP_PAIRS = PAIRS.filter(
  ([, es]) => !es.startsWith("/es/condiciones/") && !es.startsWith("/es/servicios/"),
);

/** Pages that must NOT advertise a Spanish alternate. */
const ENGLISH_ONLY = ["/privacy-policy", "/home-visit-chiropractor", "/blog", "/service-areas"];

const failures = [];

function fail(message) {
  failures.push(message);
}

async function get(path) {
  const response = await fetch(`${fetchOrigin}${path}`, { redirect: "manual" });
  const html = response.status === 200 ? await response.text() : "";
  return { status: response.status, html };
}

function attr(html, pattern) {
  const match = html.match(pattern);
  return match ? match[1] : null;
}

/** Next renders the metadata API's alternates as `hrefLang` (React's DOM
 * property spelling). HTML attribute names are case-insensitive, so a
 * parser — Googlebot's included — sees `hreflang`; this matches either. */
function hreflangs(html) {
  const found = {};
  const re = /<link rel="alternate" href[Ll]ang="([^"]+)" href="([^"]+)"\s*\/?>/g;
  let match;
  while ((match = re.exec(html)) !== null) found[match[1]] = match[2];
  return found;
}

function textOf(html, tag) {
  const match = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return match
    ? match[1]
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim()
    : null;
}

async function checkPage(path, locale, expectedAlternates) {
  const { status, html } = await get(path);
  if (status !== 200) {
    fail(`${path}: expected HTTP 200, got ${status}`);
    return;
  }

  const expectedLang = locale === "es" ? "es-US" : "en-US";
  const lang = attr(html, /<html lang="([^"]+)"/);
  if (lang !== expectedLang) fail(`${path}: <html lang> is "${lang}", expected "${expectedLang}"`);

  const canonical = attr(html, /<link rel="canonical" href="([^"]+)"/);
  const expectedCanonical = `${origin}${path === "/" ? "" : path}`;
  if (canonical !== expectedCanonical) {
    fail(`${path}: canonical is "${canonical}", expected "${expectedCanonical}"`);
  }

  const title = textOf(html, "title");
  if (!title) fail(`${path}: no <title>`);
  const description = attr(html, /<meta name="description" content="([^"]*)"/);
  if (!description) fail(`${path}: no meta description`);

  const h1Count = (html.match(/<h1[\s>]/g) || []).length;
  if (h1Count !== 1) fail(`${path}: expected exactly one <h1>, found ${h1Count}`);
  const h1 = textOf(html, "h1");
  if (!h1) fail(`${path}: empty <h1>`);

  const alternates = hreflangs(html);
  if (expectedAlternates === null) {
    if (Object.keys(alternates).length > 0) {
      fail(`${path}: expected no hreflang annotations, found ${JSON.stringify(alternates)}`);
    }
  } else {
    for (const [code, url] of Object.entries(expectedAlternates)) {
      if (alternates[code] !== url) {
        fail(`${path}: hreflang ${code} is "${alternates[code]}", expected "${url}"`);
      }
    }
  }

  return { title, description, h1, alternates };
}

console.log(`Fetching from        ${fetchOrigin}`);
console.log(`Expecting canonicals ${origin}\n`);

for (const [en, es] of PAIRS) {
  const enUrl = `${origin}${en === "/" ? "" : en}`;
  const esUrl = `${origin}${es}`;
  const expected = { "en-US": enUrl, "es-US": esUrl, "x-default": enUrl };

  const enResult = await checkPage(en, "en", expected);
  const esResult = await checkPage(es, "es", expected);

  // Reciprocity: both sides must describe the same set, or Google discards
  // the annotation entirely.
  if (enResult && esResult) {
    const a = JSON.stringify(enResult.alternates);
    const b = JSON.stringify(esResult.alternates);
    if (a !== b) fail(`${en} <-> ${es}: hreflang sets disagree\n    ${a}\n    ${b}`);
    if (enResult.title === esResult.title) {
      fail(`${es}: title is identical to the English page's — not localized`);
    }
    if (enResult.h1 === esResult.h1) {
      fail(`${es}: <h1> is identical to the English page's — not localized`);
    }
  }

  console.log(`  ${enResult && esResult ? "OK  " : "FAIL"} ${en}  <->  ${es}`);
}

for (const path of ENGLISH_ONLY) {
  await checkPage(path, "en", null);
  console.log(`  OK   ${path} (English-only, no alternates expected)`);
}

// An unknown Spanish URL must 404, not resolve to a 200 shell.
const unknown = await get("/es/esta-pagina-no-existe");
if (unknown.status !== 404) {
  fail(`/es/esta-pagina-no-existe: expected HTTP 404, got ${unknown.status} (soft 404 under /es)`);
}
console.log(`  ${unknown.status === 404 ? "OK  " : "FAIL"} unknown /es URL returns 404`);

// Every published Spanish URL must be discoverable in the sitemap.
const sitemapResponse = await fetch(`${fetchOrigin}/sitemap.xml`);
if (!sitemapResponse.ok) {
  fail(`sitemap.xml: HTTP ${sitemapResponse.status}`);
} else {
  const xml = await sitemapResponse.text();
  for (const [, es] of SITEMAP_PAIRS) {
    if (!xml.includes(`<loc>${origin}${es}</loc>`)) fail(`sitemap.xml: missing ${es}`);
  }
  // The draft Spanish pages carry reciprocal hreflang but must NOT be
  // listed — being annotated as a language alternate and being submitted
  // for indexing are two different things.
  for (const [, es] of PAIRS.filter((pair) => !SITEMAP_PAIRS.includes(pair))) {
    if (xml.includes(`<loc>${origin}${es}</loc>`)) fail(`sitemap.xml: lists draft page ${es}`);
  }
  if (xml.includes("/es/gracias")) fail("sitemap.xml: contains the noindex /es/gracias page");
  console.log("  OK   sitemap.xml lists published Spanish URLs and omits the draft ones");
}

console.log("");
if (failures.length > 0) {
  console.error(`${failures.length} check(s) failed:\n`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log("All locale checks passed.");
