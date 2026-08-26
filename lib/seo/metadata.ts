import type { Metadata } from "next";

import { buildAlternates, DEFAULT_LOCALE, OG_LOCALE, type Locale } from "@/content/i18n";
import { isPublished, type RouteMeta } from "@/content/seo";
import { isProduction, siteConfig } from "@/content/site";

export interface BuildMetadataInput {
  /** Full page title, e.g. "Book an Appointment | Align the Spine Chiropractic". */
  title: string;
  description: string;
  /** Route path from the site root, e.g. "/services". Use "" for the home page. */
  path: string;
  /** Social preview image. Omit for routes with no natural hero image (e.g. /privacy-policy) —
   * OpenGraph/Twitter degrade gracefully to a text-only card. */
  image?: { src: string; alt: string };
  robots?: Metadata["robots"];
  /** Which language this page is rendered in. Defaults to English so every
   * existing English call site keeps working untouched. */
  locale?: Locale;
}

/** Builds the title/description/canonical/OpenGraph/Twitter metadata shared by every
 * route, so each page only supplies its own copy. Image `src` may be relative —
 * `metadataBase` on the root layout (app/layout.tsx) resolves it to an absolute URL
 * for OG/Twitter. `title` is wrapped in `{ absolute }` because every caller already
 * bakes the full "X | Align the Spine Chiropractic" string into `title` themselves —
 * `{ absolute }` opts out of the root layout's `title.template` so it doesn't get
 * suffixed a second time. Forces noindex outside production (see
 * content/site.ts's isProduction()) regardless of what a page passes in, so a
 * preview deploy can never ship an indexable page by omission. */
export function buildMetadata({
  title,
  description,
  path,
  image,
  robots,
  locale = DEFAULT_LOCALE,
}: BuildMetadataInput): Metadata {
  const url = `${siteConfig.siteUrl}${path}`;
  const effectiveRobots: Metadata["robots"] = isProduction()
    ? robots
    : { index: false, follow: false };

  // Every page self-canonicalizes — a Spanish page must never canonicalize
  // to its English counterpart (that would collapse two legitimate primary
  // pages into one and discard the Spanish version from the index). The two
  // are connected by hreflang instead, below.
  //
  // `alternates.languages` is emitted only for routes that actually have a
  // counterpart in the other language (buildAlternates returns null
  // otherwise), so English-only pages like /privacy-policy are untouched by
  // this and keep emitting a bare canonical exactly as before. app/sitemap.ts
  // reads the same buildAlternates() for its per-URL <xhtml:link> alternates,
  // so the HTML annotations and the sitemap annotations cannot disagree.
  const alternates = buildAlternates(siteConfig.siteUrl, path, locale);

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      ...(alternates ? { languages: alternates.languages } : {}),
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.business.name,
      type: "website",
      locale: OG_LOCALE[locale],
      images: image ? [{ url: image.src, alt: image.alt }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image.src] : undefined,
    },
    ...(effectiveRobots ? { robots: effectiveRobots } : {}),
  };
}

/** ATS-E4 (4.12/4.14): wraps buildMetadata() for a content/seo.ts route
 * entry, forcing noindex whenever the route isn't `status: "published"` —
 * on top of (not instead of) buildMetadata's own outside-production
 * noindex gate. Use this instead of `buildMetadata(getRoute(path))`
 * directly for any route that can be draft (currently the 4 condition
 * pages, pending clinician review). */
export function buildRouteMetadata(route: RouteMeta): Metadata {
  return buildMetadata({
    title: route.title,
    description: route.description,
    path: route.path,
    image: route.image,
    robots: isPublished(route) ? undefined : { index: false, follow: false },
  });
}

/** Spanish counterpart of buildRouteMetadata() — the only thing a page
 * under app/(es)/ should call. Passing `locale: "es"` is what switches
 * `og:locale` to es_US and orients buildAlternates()'s reciprocal hreflang
 * lookup around the Spanish path, so the Spanish page self-canonicalizes to
 * its own /es URL and points at the English one as the alternate (never the
 * other way round). Draft-gating works identically to English: a Spanish
 * route that isn't `status: "published"` is served noindex. */
export function buildEsRouteMetadata(route: RouteMeta): Metadata {
  return buildMetadata({
    title: route.title,
    description: route.description,
    path: route.path,
    image: route.image,
    robots: isPublished(route) ? undefined : { index: false, follow: false },
    locale: "es",
  });
}
