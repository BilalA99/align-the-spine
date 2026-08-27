import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/** LINK-02: "breadcrumbs render on every non-home page." Source-scanning
 * check (same convention as content/route-registry-parity.test.ts) rather
 * than a rendered-output test — this repo has no jsdom/testing-library
 * setup. Confirms presence (`breadcrumbs={` passed to HeroSolidPanel/Hero,
 * or a direct <BreadcrumbTrail> for the two pages with bespoke hero
 * markup), not the exact hierarchy — that's covered by construction, since
 * BreadcrumbTrail and BreadcrumbJsonLd are always fed from the same items
 * array (see components/seo/breadcrumb-trail.tsx's doc comment). */
const appDir = join(__dirname);

/** /thank-you is deliberately excluded — noindex, post-conversion,
 * intentionally minimal (see app/thank-you/page.tsx's own doc comment) —
 * a breadcrumb trail back to pages the visitor just finished with adds
 * nothing there. Not in content/seo.ts's registry either, for the same
 * reason (see that file's own comment). /admin/* is internal, auth-gated
 * tooling, not part of the site's public SEO structure — LINK-02 is about
 * crawlable pages, and admin routes are neither crawlable nor meant to be.
 * /es and /es/gracias are the Spanish home page and the Spanish
 * post-conversion page — excluded for exactly the same reasons as their
 * English counterparts. */
const EXCLUDED_ROUTES = new Set(["", "/thank-you", "/es", "/es/gracias"]);
const EXCLUDED_PREFIXES = ["/admin"];

/** /blog/[slug] genuinely renders visible breadcrumbs, just through nested
 * components (ContentArticle → BlogArticleHero, or ContentArticle's own
 * fallback nav when there's no featured image) that this source-scanning
 * check can't see into — the page itself never types `breadcrumbs={` or
 * `<BreadcrumbTrail` literally. Verified directly in both components'
 * source rather than assumed. */
const NESTED_BREADCRUMB_ALLOWLIST = new Set([
  "/blog/[slug]",
  // The seven Spanish condition pages compose one shared template
  // (components/sections/es-condition-page.tsx), which builds the
  // breadcrumb trail from the condition's own `path`/`breadcrumb` fields
  // and passes it to HeroSolidPanel's `breadcrumbs` prop. Same situation as
  // /blog/[slug]: real, rendered breadcrumbs this source-scanning check
  // can't see into, because the page files never type `breadcrumbs={`
  // literally. Verified in the template's source and in the rendered HTML,
  // not assumed.
  "/es/condiciones/dolor-de-espalda",
  "/es/condiciones/dolor-de-cuello",
  "/es/condiciones/ciatica",
  "/es/condiciones/latigazo-cervical",
  "/es/condiciones/dolor-de-cabeza-cervicogenico",
  "/es/condiciones/conmocion-cerebral",
  "/es/condiciones/dolor-de-mandibula-atm",
]);

function collectPageFiles(dir: string, routePath = ""): { route: string; file: string }[] {
  const found: { route: string; file: string }[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "api") continue; // route handlers, not pages
      // Route groups — a directory wrapped in parentheses, e.g. `(en)` /
      // `(es)` — are organizational only and contribute nothing to the URL.
      // The app uses them to give each locale its own root layout (and so
      // its own `<html lang>`) without changing a single URL; see
      // app/(en)/layout.tsx.
      const isRouteGroup = entry.name.startsWith("(") && entry.name.endsWith(")");
      const nextPath = isRouteGroup ? routePath : `${routePath}/${entry.name}`;
      found.push(...collectPageFiles(fullPath, nextPath));
    } else if (entry.name === "page.tsx") {
      found.push({ route: routePath, file: fullPath });
    }
  }
  return found;
}

describe("LINK-02: breadcrumbs render on every non-home page", () => {
  const pages = collectPageFiles(appDir).filter(
    ({ route }) =>
      !EXCLUDED_ROUTES.has(route) &&
      !EXCLUDED_PREFIXES.some((prefix) => route.startsWith(prefix)) &&
      !NESTED_BREADCRUMB_ALLOWLIST.has(route),
  );

  it.each(pages)("$route has breadcrumbs wired in", ({ file }) => {
    const source = readFileSync(file, "utf8");
    const hasBreadcrumbs = /breadcrumbs=\{/.test(source) || /<BreadcrumbTrail\b/.test(source);
    expect(hasBreadcrumbs, `${file} has no breadcrumbs prop or <BreadcrumbTrail>`).toBe(true);
  });

  it("keeps the nested-breadcrumb allowlist free of stale entries", () => {
    const routes = new Set(collectPageFiles(appDir).map((p) => p.route));
    for (const route of NESTED_BREADCRUMB_ALLOWLIST) {
      expect(routes.has(route), `${route} no longer exists — remove it from the allowlist`).toBe(
        true,
      );
    }
  });
});
