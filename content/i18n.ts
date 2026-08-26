/** Locale architecture (Spanish SEO layer).
 *
 * One source of truth for the English ↔ Spanish URL pairing. Everything
 * language-related derives from `localizedRoutes` below: the `<link
 * rel="alternate" hreflang>` tags (lib/seo/metadata.ts), the sitemap's
 * per-URL alternates (app/sitemap.ts), the navbar/footer language switcher
 * (components/layout/language-switcher.tsx), and breadcrumb/internal-link
 * targets. Nothing may hardcode an `/es/...` string anywhere else — a pair
 * that only exists in one of those places is exactly how hreflang stops
 * being reciprocal and Google quietly drops the annotation.
 *
 * Deliberate non-goals:
 *  - No middleware, no Accept-Language/IP redirect. Both locales stay
 *    directly reachable at their own URL (a forced redirect would hide one
 *    language from users and from Googlebot, which crawls from the US with
 *    no language preference).
 *  - No runtime translation. Spanish copy is committed source under
 *    content/es/, server-rendered like the English copy, so a Spanish URL
 *    returns Spanish HTML on the first response with no JS and no API call.
 */

export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];

/** English is the site's primary language and the hreflang x-default
 * target — the practice is a US business whose default audience is
 * English-speaking, and every Spanish page has an English counterpart
 * while the reverse isn't true. */
export const DEFAULT_LOCALE: Locale = "en";

/** `<html lang>` value per locale. es-US (not es-ES/es-MX): the audience is
 * Spanish-speaking South Florida, and US Spanish is what the copy under
 * content/es/ is written in. */
export const HTML_LANG: Record<Locale, string> = { en: "en-US", es: "es-US" };

/** hreflang codes — same language-region pairs as HTML_LANG. */
export const HREFLANG: Record<Locale, string> = { en: "en-US", es: "es-US" };

/** OpenGraph `og:locale` uses underscores, not the hyphens hreflang uses. */
export const OG_LOCALE: Record<Locale, string> = { en: "en_US", es: "es_US" };

/** Path prefix owned by a locale. English lives at the site root (its URLs
 * predate this work and must not move — see SPANISH_SEO_IMPLEMENTATION_REPORT.md
 * §English site safety), Spanish under /es. */
export const LOCALE_PREFIX: Record<Locale, string> = { en: "", es: "/es" };

export interface LocalizedRoute {
  /** Stable identifier — the thing that stays constant when a slug in
   * either language changes. Link internally by id, never by literal path. */
  id: string;
  /** English path from the site root. "" is the English home page. */
  en: string;
  /** Spanish path, or null when no Spanish page exists for this route yet.
   * null is a deliberate, documented state, not an omission: a Spanish URL
   * that 200s with English content would be worse than no Spanish URL at
   * all (Google treats it as a duplicate, and a Spanish-speaking visitor
   * gets a page they can't read). */
  es: string | null;
}

/** English ↔ Spanish route pairs.
 *
 * Spanish slugs are localized, not transliterated, and were chosen against
 * Spanish search intent rather than by translating the English slug word
 * for word (see the keyword map in SPANISH_SEO_IMPLEMENTATION_REPORT.md):
 *  - "quiropractico-accidentes-de-auto" carries the head term
 *    ("quiropráctico" + "accidente de auto") rather than mirroring the
 *    English word order of /car-accident-chiropractor.
 *  - "resenas" is deliberately ASCII (no ñ) — a percent-encoded ñ in a
 *    canonical URL is legal but reads as %C3%B1 everywhere it's copied,
 *    pasted, and reported on.
 *  - "solicitar-cita" ("request an appointment"), not "reservar"/"agendar":
 *    the form requests a callback, it does not confirm a slot, and the
 *    Spanish slug shouldn't promise something the English one deliberately
 *    stopped promising (see content/seo.ts on /book-an-appointment).
 *  - "dr-abe-nasser" rather than a literal "acerca-de": the page is the
 *    doctor's entity page, and the Spanish query that reaches it is his
 *    name plus "quiropráctico", not an abstract "about us".
 *
 * Trailing slashes are absent on both sides because the existing English
 * routes have none (Next's default `trailingSlash: false`) — Spanish URLs
 * follow the site's existing normalization rather than introducing a
 * second convention (see §URL normalization in the report).
 */
export const localizedRoutes: LocalizedRoute[] = [
  { id: "home", en: "", es: "/es" },
  {
    id: "carAccident",
    en: "/car-accident-chiropractor",
    es: "/es/quiropractico-accidentes-de-auto",
  },
  { id: "services", en: "/services", es: "/es/servicios" },
  { id: "about", en: "/about", es: "/es/dr-abe-nasser" },
  { id: "reviews", en: "/reviews", es: "/es/resenas" },
  { id: "contact", en: "/contact-us", es: "/es/contacto" },
  { id: "bookAppointment", en: "/book-an-appointment", es: "/es/solicitar-cita" },

  // --- English-only, deliberately (es: null) ---------------------------
  // Every route below is either noindex today or unsafe to translate
  // without sign-off. Each keeps `es: null` so no hreflang pair is
  // emitted, no sitemap entry appears, and the language switcher hides
  // itself rather than dumping a Spanish reader onto an English page.
  //
  // /privacy-policy: a legal notice describing HIPAA and Florida privacy
  // obligations. A Spanish version is a legal document in its own right
  // and needs counsel review, not a content translation — see the report's
  // "Remaining work".
  { id: "privacyPolicy", en: "/privacy-policy", es: null },
  // /conditions now has a Spanish hub, because its children do too — the
  // hub follows its children. /blog and /service-areas stay English-only:
  // both are CMS-driven with no Spanish records.
  { id: "conditionsHub", en: "/conditions", es: "/es/condiciones" },
  // The blog is CMS-driven (dynamic /blog/[slug]); there is no Spanish
  // editorial pipeline and no Spanish posts. Bulk-translating posts is
  // explicitly out of scope — see the report's "Remaining work".
  { id: "blog", en: "/blog", es: null },
  // Service-area pages are also CMS-driven (/service-areas/[slug]) and are
  // the exact "city page" surface that turns into doorway content when
  // spun up per locale without distinct, verified local information.
  { id: "serviceAreas", en: "/service-areas", es: null },
  // The routes below are `status: "draft"` in content/seo.ts — noindex and
  // out of the sitemap pending a clinician's review of their medical
  // content. Translating unreviewed medical claims into a second language
  // doubles the exposure instead of halving it; they get Spanish pages
  // once (and only once) the English originals clear clinical review.
  { id: "homeVisit", en: "/home-visit-chiropractor", es: null },
  // The four service pages now have Spanish counterparts. Both sides stay
  // `status: "draft"` in their registries (noindex, out of the sitemap)
  // until a clinician signs off on the English originals — the Spanish
  // pages exist so the Spanish nav's Servicios dropdown has real Spanish
  // destinations, not so unreviewed medical copy gets indexed.
  // content/i18n.test.ts enforces that a Spanish page can't be published
  // while its English original is draft.
  {
    id: "serviceAdjustments",
    en: "/services/chiropractic-adjustments",
    es: "/es/servicios/ajustes-quiropracticos",
  },
  {
    id: "serviceDecompression",
    en: "/services/spinal-decompression",
    es: "/es/servicios/descompresion-espinal",
  },
  {
    id: "serviceSoftTissue",
    en: "/services/soft-tissue-therapy",
    es: "/es/servicios/terapia-de-tejidos-blandos",
  },
  {
    id: "serviceCupping",
    en: "/services/cupping-therapy",
    es: "/es/servicios/terapia-de-ventosas",
  },
  { id: "conditionBackPain", en: "/conditions/back-pain", es: "/es/condiciones/dolor-de-espalda" },
  { id: "conditionNeckPain", en: "/conditions/neck-pain", es: "/es/condiciones/dolor-de-cuello" },
  { id: "conditionSciatica", en: "/conditions/sciatica", es: "/es/condiciones/ciatica" },
  { id: "conditionWhiplash", en: "/conditions/whiplash", es: "/es/condiciones/latigazo-cervical" },
  {
    id: "conditionCervicogenic",
    en: "/conditions/cervicogenic-headache",
    es: "/es/condiciones/dolor-de-cabeza-cervicogenico",
  },
  {
    id: "conditionConcussion",
    en: "/conditions/concussion",
    es: "/es/condiciones/conmocion-cerebral",
  },
  {
    id: "conditionTmj",
    en: "/conditions/tmj-jaw-pain",
    es: "/es/condiciones/dolor-de-mandibula-atm",
  },
];

/** Looks a pair up by its stable id — throws rather than returning
 * undefined so a typo in a link fails at build time, matching
 * content/seo.ts's getRoute(). */
export function getLocalizedRoute(id: string): LocalizedRoute {
  const route = localizedRoutes.find((entry) => entry.id === id);
  if (!route) throw new Error(`content/i18n.ts: no localized route registered for id "${id}"`);
  return route;
}

/** The path for `id` in `locale`, or null when that locale has no page for
 * it. Call sites that render a link must handle null explicitly (skip the
 * link, or fall back to the English URL with an explicit hrefLang) rather
 * than silently linking a Spanish reader to English. */
export function localePath(id: string, locale: Locale): string | null {
  return getLocalizedRoute(id)[locale];
}

/** The English home page is registered as "" (so `${siteUrl}${path}` yields
 * a bare origin, the convention content/seo.ts has always used), but every
 * runtime source of a path — usePathname(), a request URL, a link href —
 * spells it "/". Normalizing here is what lets the same route table answer
 * lookups from both. Without it the language switcher silently disappeared
 * on both home pages, which is exactly the sort of null-returns-quietly bug
 * this table's `null` convention makes easy to miss. */
function normalizePath(path: string): string {
  return path === "/" ? "" : path.replace(/\/$/, "");
}

/** Reverse lookup: the pair that owns `path` in `locale`, or null if the
 * path isn't a registered route for that locale. */
export function findRouteByPath(path: string, locale: Locale): LocalizedRoute | null {
  const normalized = normalizePath(path);
  return localizedRoutes.find((entry) => entry[locale] === normalized) ?? null;
}

/** The equivalent page in the other language, for the language switcher.
 *
 * Returns the counterpart's path, or null when this page has no
 * counterpart. Deliberately never falls back to the other locale's home
 * page: sending someone who asked for "this page in Spanish" to /es
 * instead is a worse answer than not offering the switch, and it's how
 * a language switcher ends up looking broken. Callers hide the control
 * when this returns null.
 */
export function counterpartPath(path: string, from: Locale, to: Locale): string | null {
  const route = findRouteByPath(path, from);
  if (!route) return null;
  return route[to];
}

/** Absolute URL for a path, using the configured production origin. */
export function absoluteUrl(siteUrl: string, path: string): string {
  // The home page is "" (not "/"), which would produce a bare origin with
  // no trailing slash — fine and canonical for a root URL, and consistent
  // with what app/sitemap.ts already emitted for English before this work.
  return `${siteUrl}${path}`;
}

export interface AlternateLinks {
  /** hreflang code -> absolute URL, including "x-default". */
  languages: Record<string, string>;
}

/** Builds the reciprocal hreflang set for whichever locale is rendering.
 *
 * Returns null when the route has no counterpart in the other language —
 * a one-entry hreflang set annotates nothing, and Google requires the
 * annotations to be reciprocal, so a lone self-referential alternate is
 * noise at best. Both the HTML `<link rel="alternate">` tags and the
 * sitemap's per-URL alternates read this same function, so the two can
 * never describe different pairings.
 *
 * x-default points at the English URL: it's the version to serve a user
 * whose language doesn't match either annotated locale.
 */
export function buildAlternates(
  siteUrl: string,
  path: string,
  locale: Locale,
): AlternateLinks | null {
  const route = findRouteByPath(path, locale);
  if (!route) return null;
  if (route.es === null) return null;

  return {
    languages: {
      [HREFLANG.en]: absoluteUrl(siteUrl, route.en),
      [HREFLANG.es]: absoluteUrl(siteUrl, route.es),
      "x-default": absoluteUrl(siteUrl, route.en),
    },
  };
}

/** True when `path` belongs to the Spanish subtree. Used by the chrome
 * components to pick their locale without threading a prop through every
 * intermediate client component. */
export function isSpanishPath(path: string): boolean {
  return path === LOCALE_PREFIX.es || path.startsWith(`${LOCALE_PREFIX.es}/`);
}

/** The locale a URL path belongs to. */
export function localeFromPath(path: string): Locale {
  return isSpanishPath(path) ? "es" : "en";
}
