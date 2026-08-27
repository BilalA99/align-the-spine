import { describe, expect, it } from "vitest";

import { esBookingCta, esFooter, esNav } from "@/content/es/chrome";
import { esRoutes } from "@/content/es/seo";
import {
  buildAlternates,
  counterpartPath,
  HREFLANG,
  LOCALES,
  localizedRoutes,
  serviceAreaLocalizedRoutes,
} from "@/content/i18n";
import { isPublished, routes } from "@/content/seo";
import { siteConfig } from "@/content/site";

/** Locale QA (§Content completeness check / §hreflang validation in
 * SPANISH_SEO_IMPLEMENTATION_REPORT.md).
 *
 * The whole Spanish layer hangs off content/i18n.ts's route pairs: the
 * hreflang tags, the sitemap alternates, the language switcher and the
 * Spanish internal links all read that one table. These tests are what stop
 * the table and the two route registries from drifting apart — the failure
 * mode where a Spanish page ships with a canonical but no reciprocal
 * hreflang partner, or a nav link points at a Spanish URL nothing serves,
 * and nothing notices until Search Console does.
 */

const enPaths = new Set(routes.map((route) => route.path));
const esPaths = new Set(esRoutes.map((route) => route.path));
const pairsWithSpanish = localizedRoutes.filter((route) => route.es !== null);

describe("locale route map ↔ route registries", () => {
  it("registers every pair's English path in content/seo.ts", () => {
    const missing = localizedRoutes.filter((route) => !enPaths.has(route.en));
    expect(missing.map((route) => route.id)).toEqual([]);
  });

  it("registers every pair's Spanish path in content/es/seo.ts", () => {
    const missing = pairsWithSpanish.filter((route) => !esPaths.has(route.es as string));
    expect(missing.map((route) => route.id)).toEqual([]);
  });

  it("pairs every route in the Spanish registry", () => {
    const paired = new Set(pairsWithSpanish.map((route) => route.es as string));
    const orphans = [...esPaths].filter((path) => !paired.has(path));
    expect(orphans).toEqual([]);
  });

  it("covers every English registry route, even the English-only ones", () => {
    // A route absent from the map has no *declared* language status — it
    // would silently emit no hreflang whether or not that was intended.
    // `es: null` is how "English-only, deliberately" gets recorded.
    const mapped = new Set(localizedRoutes.map((route) => route.en));
    const unmapped = [...enPaths].filter((path) => !mapped.has(path));
    expect(unmapped).toEqual([]);
  });

  it("uses unique ids and unique paths", () => {
    const ids = localizedRoutes.map((route) => route.id);
    expect(new Set(ids).size).toBe(ids.length);

    const en = localizedRoutes.map((route) => route.en);
    expect(new Set(en).size).toBe(en.length);

    const es = pairsWithSpanish.map((route) => route.es);
    expect(new Set(es).size).toBe(es.length);
  });
});

describe("Spanish URL shape", () => {
  it("puts every Spanish route under /es", () => {
    for (const route of esRoutes) {
      expect(route.path === "/es" || route.path.startsWith("/es/")).toBe(true);
    }
  });

  it("keeps Spanish paths lowercase, ASCII, and without a trailing slash", () => {
    for (const route of esRoutes) {
      // Follows the existing English normalization (Next's default
      // `trailingSlash: false`) rather than introducing a second convention.
      expect(route.path).toBe(route.path.toLowerCase());
      expect(route.path.endsWith("/")).toBe(false);
      // No accented characters in slugs: a percent-encoded ñ is legal but
      // reads as %C3%B1 everywhere the URL is copied, pasted or reported on.
      expect(/^[a-z0-9/-]+$/.test(route.path)).toBe(true);
    }
  });
});

describe("Spanish metadata completeness", () => {
  it("gives every Spanish route a title, description and lastModified", () => {
    for (const route of esRoutes) {
      expect(route.title.trim().length).toBeGreaterThan(0);
      expect(route.description.trim().length).toBeGreaterThan(0);
      expect(route.lastModified).toBeTruthy();
    }
  });

  it("keeps Spanish descriptions to a sensible length", () => {
    // Not a Google rule (there is no fixed limit) — a floor that catches a
    // stub description, and a ceiling that catches a paragraph pasted in.
    for (const route of esRoutes) {
      expect(route.description.length).toBeGreaterThanOrEqual(70);
      expect(route.description.length).toBeLessThanOrEqual(200);
    }
  });

  it("gives every Spanish route a unique title and description", () => {
    const titles = esRoutes.map((route) => route.title);
    expect(new Set(titles).size).toBe(titles.length);

    const descriptions = esRoutes.map((route) => route.description);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it("writes Spanish titles and descriptions in Spanish, not English", () => {
    // A cheap smoke test for the specific regression that matters: an /es
    // page shipping with its English title/description copied over. Looks
    // for English function words that would never appear in this copy.
    //
    // The business name is stripped first: "Align the Spine Chiropractic"
    // is the practice's registered name and its search entity, so it stays
    // English in both languages by design (NAP consistency across
    // locales) — the "the" inside it is not an untranslated string.
    const englishTells = /\b(the|and|your|with|after|our)\b/i;
    const withoutBrand = (value: string) => value.split("Align the Spine").join("");

    for (const route of esRoutes) {
      expect(englishTells.test(withoutBrand(route.title))).toBe(false);
      expect(englishTells.test(withoutBrand(route.description))).toBe(false);
    }
  });
});

describe("hreflang", () => {
  it("emits reciprocal annotations from both sides of every pair", () => {
    for (const route of pairsWithSpanish) {
      const fromEnglish = buildAlternates(siteConfig.siteUrl, route.en, "en");
      const fromSpanish = buildAlternates(siteConfig.siteUrl, route.es as string, "es");

      expect(fromEnglish).not.toBeNull();
      expect(fromSpanish).not.toBeNull();
      // Reciprocity: both pages must describe the same set of alternates,
      // or Google drops the annotation entirely.
      expect(fromEnglish).toEqual(fromSpanish);
    }
  });

  it("points x-default at the English URL and each locale at its own", () => {
    for (const route of pairsWithSpanish) {
      const alternates = buildAlternates(siteConfig.siteUrl, route.en, "en");
      expect(alternates?.languages).toEqual({
        [HREFLANG.en]: `${siteConfig.siteUrl}${route.en}`,
        [HREFLANG.es]: `${siteConfig.siteUrl}${route.es}`,
        "x-default": `${siteConfig.siteUrl}${route.en}`,
      });
    }
  });

  it("emits no annotations for a route with no counterpart", () => {
    for (const route of localizedRoutes.filter((entry) => entry.es === null)) {
      expect(buildAlternates(siteConfig.siteUrl, route.en, "en")).toBeNull();
    }
  });

  it("uses absolute URLs on the configured origin", () => {
    for (const route of pairsWithSpanish) {
      const alternates = buildAlternates(siteConfig.siteUrl, route.en, "en");
      for (const url of Object.values(alternates?.languages ?? {})) {
        // The English home page's path is "" (not "/"), so its URL is the
        // bare origin — which is what app/sitemap.ts has always emitted for
        // it, and what buildMetadata already sets as its canonical. Both
        // forms address the same resource; the point of this assertion is
        // that nothing relative or cross-origin slips into an alternate.
        expect(url === siteConfig.siteUrl || url.startsWith(`${siteConfig.siteUrl}/`)).toBe(true);
      }
    }
  });

  it("uses valid language-region codes", () => {
    for (const locale of LOCALES) {
      expect(/^[a-z]{2}-[A-Z]{2}$/.test(HREFLANG[locale])).toBe(true);
    }
  });
});

describe("language switcher targets", () => {
  it("round-trips English → Spanish → English for every pair", () => {
    for (const route of pairsWithSpanish) {
      const toSpanish = counterpartPath(route.en, "en", "es");
      expect(toSpanish).toBe(route.es);
      expect(counterpartPath(toSpanish as string, "es", "en")).toBe(route.en);
    }
  });

  it("returns null rather than falling back to a home page", () => {
    // Sending someone who asked for "this page in Spanish" to /es instead
    // is a worse answer than hiding the control, which is what null does.
    for (const route of localizedRoutes.filter((entry) => entry.es === null)) {
      expect(counterpartPath(route.en, "en", "es")).toBeNull();
    }
    expect(counterpartPath("/not-a-route", "en", "es")).toBeNull();
  });
});

describe("Spanish internal link graph", () => {
  // Includes mega-menu items, not just the top-level nav entries — the
  // Servicios dropdown's four destinations are exactly the kind of link
  // that can rot unnoticed, since nothing renders them until a hover.
  const spanishHrefs = [
    ...esNav.flatMap((link) => [link.href, ...(link.menu ?? []).map((item) => item.href)]),
    esBookingCta.href,
    ...esFooter.links.map((link) => link.href),
  ];

  // The Áreas de Servicio dropdown links the nineteen city pages, which
  // live in the derived pair table rather than the static Spanish registry
  // (see serviceAreaLocalizedRoutes in content/i18n.ts for why). They are
  // still real, registered Spanish routes — just registered elsewhere.
  const esCityPaths = new Set(
    serviceAreaLocalizedRoutes.map((entry) => entry.es).filter((path): path is string => !!path),
  );

  it("points every Spanish nav, CTA and footer link at a registered Spanish route", () => {
    for (const href of spanishHrefs) {
      expect(esPaths.has(href) || esCityPaths.has(href), `unregistered Spanish link: ${href}`).toBe(
        true,
      );
    }
  });

  it("keeps the Spanish chrome inside Spanish", () => {
    // The one deliberate exception is the privacy-policy link, which is
    // declared separately and rendered with an explicit hrefLang="en-US"
    // (see content/chrome.ts's getFooterConfig).
    for (const href of spanishHrefs) {
      expect(href.startsWith("/es")).toBe(true);
    }
    expect(esFooter.privacyPolicy.href).toBe("/privacy-policy");
  });
});

describe("publication parity", () => {
  /** Both directions, because each failure mode is real and different:
   *
   *  - Spanish published while English is draft would route around the
   *    clinician-review gate by indexing a translation of unreviewed
   *    medical copy.
   *  - English published while Spanish is draft makes the indexable
   *    English page advertise an hreflang alternate that points at a
   *    noindex URL. Google is being told "here is the Spanish version of
   *    this page" and then told not to index it. That's how /es/condiciones
   *    was caught: the English /conditions hub is published, so its sitemap
   *    entry carried an alternate to a Spanish hub still marked draft.
   */
  it("keeps both halves of every hreflang pair at the same publication status", () => {
    const mismatched = pairsWithSpanish
      .map((route) => {
        const en = routes.find((entry) => entry.path === route.en);
        const es = esRoutes.find((entry) => entry.path === route.es);
        if (!en || !es) return null;
        return isPublished(en) === isPublished(es)
          ? null
          : `${route.en} (${isPublished(en) ? "published" : "draft"}) <-> ${route.es} (${isPublished(es) ? "published" : "draft"})`;
      })
      .filter(Boolean);
    expect(mismatched).toEqual([]);
  });

  it("never publishes a Spanish page whose English original is still draft", () => {
    // The draft routes are noindex pending clinician review of their medical
    // content. Indexing a Spanish translation of unreviewed medical copy
    // would route around that gate rather than respect it.
    for (const route of pairsWithSpanish) {
      const en = routes.find((entry) => entry.path === route.en);
      const es = esRoutes.find((entry) => entry.path === route.es);
      if (es && isPublished(es)) {
        expect(en && isPublished(en)).toBe(true);
      }
    }
  });
});
