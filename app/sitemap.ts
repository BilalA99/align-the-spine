import type { MetadataRoute } from "next";

import { esRoutes } from "@/content/es/seo";
import { esServiceAreaPages } from "@/content/es/service-areas-cities";
import { buildAlternates, type Locale } from "@/content/i18n";
import { isPublished, routes, type RouteMeta } from "@/content/seo";
import { siteConfig } from "@/content/site";
import { listPublicContent } from "@/lib/content/public-content";

/** Sitemap (ATS-131): sourced entirely from the route registries, so a new
 * static or condition page doesn't also need a second, separate sitemap
 * entry. /thank-you, /404, /auto-accident, and API routes are absent
 * because they're not in the registry — see content/seo.ts. As of ATS-137,
 * every /conditions/* route is a static page registered there directly —
 * there's no more dynamic [slug] route to append separately. ATS-E4
 * (4.12): routes marked `status: "draft"` (pending clinician review — see
 * content/seo.ts) are excluded here too. Blog posts and service-area pages
 * are appended from the CMS at the end.
 *
 * Spanish (content/es/seo.ts) is appended through the same filter and the
 * same shape, so /es URLs are discoverable without a separate sitemap or a
 * sitemap index.
 *
 * Per-URL `alternates.languages` comes from content/i18n.ts's
 * buildAlternates() — the identical function lib/seo/metadata.ts uses for
 * the HTML `<link rel="alternate" hreflang>` tags. Emitting hreflang in
 * both places is only safe because both derive from that one source and
 * content/i18n.test.ts asserts they agree; two independently-maintained
 * copies would drift. A route with no counterpart in the other language
 * gets no `alternates` key at all rather than a useless one-entry set —
 * which covers every CMS-driven entry below, since blog posts and
 * service-area pages exist only in English today.
 */
function toSitemapEntry(route: RouteMeta, locale: Locale): MetadataRoute.Sitemap[number] {
  const alternates = buildAlternates(siteConfig.siteUrl, route.path, locale);
  return {
    url: `${siteConfig.siteUrl}${route.path}`,
    lastModified: route.lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    ...(alternates ? { alternates: { languages: alternates.languages } } : {}),
  };
}

/** Sitemap entry for a path that isn't in either static registry — the
 * service-area city pages in both languages. Same alternates treatment
 * toSitemapEntry() gives registry routes: `buildAlternates` is the single
 * source of truth, and a path with no counterpart gets no `alternates` key
 * rather than a useless one-entry set. */
function dynamicEntry(
  path: string,
  locale: Locale,
  lastModified: string,
): MetadataRoute.Sitemap[number] {
  const alternates = buildAlternates(siteConfig.siteUrl, path, locale);
  return {
    url: `${siteConfig.siteUrl}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
    ...(alternates ? { alternates: { languages: alternates.languages } } : {}),
  };
}

/** The Spanish city pages are a committed data file with no per-entry
 * timestamp, so they share the date that file was last revised. */
const ES_AREAS_LAST_MODIFIED = "2026-08-26";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    ...routes.filter(isPublished).map((route) => toSitemapEntry(route, "en")),
    ...esRoutes.filter(isPublished).map((route) => toSitemapEntry(route, "es")),
  ];

  const [posts, areas] = await Promise.all([
    listPublicContent({ contentType: "blog_post", pageSize: 24 }),
    listPublicContent({ contentType: "service_area", pageSize: 24 }),
  ]);
  const dynamicEntries: MetadataRoute.Sitemap = [
    ...posts.items.map((item) => ({
      url: `${siteConfig.siteUrl}/blog/${item.slug}`,
      lastModified: item.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...areas.items.map((item) => dynamicEntry(`/service-areas/${item.slug}`, "en", item.updatedAt)),
    // The nineteen Spanish city pages. Sourced from the committed data file
    // rather than the content repository (which holds English records
    // only), but emitted through the same helper, so both halves of each
    // city pair carry reciprocal hreflang exactly as the static routes do.
    ...esServiceAreaPages.map((page) => dynamicEntry(page.path, "es", ES_AREAS_LAST_MODIFIED)),
  ];

  return [...staticEntries, ...dynamicEntries];
}
