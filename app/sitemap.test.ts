import { describe, expect, it } from "vitest";

import { esRoutes } from "@/content/es/seo";
import { buildAlternates } from "@/content/i18n";
import { isPublished, routes } from "@/content/seo";
import { siteConfig } from "@/content/site";

import sitemap from "./sitemap";

describe("sitemap", () => {
  it("returns absolute URLs under siteConfig.siteUrl for every entry", async () => {
    for (const entry of await sitemap()) {
      expect(entry.url.startsWith(siteConfig.siteUrl)).toBe(true);
    }
  });

  it("excludes utility and legacy redirect routes", async () => {
    const paths = (await sitemap()).map((entry) => entry.url.replace(siteConfig.siteUrl, ""));
    expect(paths).not.toContain("/thank-you");
    expect(paths).not.toContain("/book");
    expect(paths).not.toContain("/auto-accident");
    expect(paths).not.toContain("/auto-accidents");
    expect(paths).not.toContain("/home-visits");
    expect(paths).not.toContain("/services/massage-soft-tissue");
  });

  it("gives every entry a truthy lastModified", async () => {
    for (const entry of await sitemap()) {
      expect(entry.lastModified).toBeTruthy();
    }
  });

  it("includes every published English route exactly once", async () => {
    const paths = (await sitemap()).map((entry) => entry.url.replace(siteConfig.siteUrl, ""));
    for (const route of routes.filter(isPublished)) {
      expect(paths.filter((path) => path === route.path)).toHaveLength(1);
    }
  });

  it("includes every published Spanish route exactly once", async () => {
    const paths = (await sitemap()).map((entry) => entry.url.replace(siteConfig.siteUrl, ""));
    for (const route of esRoutes.filter(isPublished)) {
      expect(paths.filter((path) => path === route.path)).toHaveLength(1);
    }
  });

  it("lists the static routes English-first, then Spanish", async () => {
    // CMS-driven blog/service-area entries are appended after both, so this
    // only pins the ordering of the two static registries relative to each
    // other.
    const paths = (await sitemap()).map((entry) => entry.url.replace(siteConfig.siteUrl, ""));
    const staticCount = routes.filter(isPublished).length + esRoutes.filter(isPublished).length;
    expect(paths.slice(0, staticCount)).toEqual([
      ...routes.filter(isPublished).map((route) => route.path),
      ...esRoutes.filter(isPublished).map((route) => route.path),
    ]);
  });

  it("lists no URL twice", async () => {
    const urls = (await sitemap()).map((entry) => entry.url);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("excludes the Spanish post-conversion page", async () => {
    const paths = (await sitemap()).map((entry) => entry.url.replace(siteConfig.siteUrl, ""));
    expect(paths).not.toContain("/es/gracias");
  });

  // The sitemap's per-URL hreflang and the HTML <link rel="alternate">
  // tags are both generated from content/i18n.ts's buildAlternates(). This
  // asserts the sitemap really does read that source rather than carrying
  // its own copy — two independently-maintained hreflang sets drifting
  // apart is the specific failure this guards against.
  it("annotates each entry with the same alternates buildAlternates() returns", async () => {
    for (const entry of await sitemap()) {
      const path = entry.url.replace(siteConfig.siteUrl, "");
      const isSpanish = path === "/es" || path.startsWith("/es/");
      const expected = buildAlternates(siteConfig.siteUrl, path, isSpanish ? "es" : "en");
      if (expected) {
        expect(entry.alternates).toEqual({ languages: expected.languages });
      } else {
        expect(entry.alternates).toBeUndefined();
      }
    }
  });

  // ATS-E4 (4.12/4.14) / ATS-E3 (3.7): these routes are draft (noindex,
  // out of the sitemap) until their respective approvals land — condition
  // pages need a clinician reviewer, /home-visits needs verified
  // service-area/availability data. /reviews flipped to published
  // 2026-08-12 once real reviews landed (content/testimonials.ts) — see
  // content/seo.ts. This test intentionally fails once any of the
  // remaining routes flips to "published" without also being removed from
  // this list, as a reminder to update the assertion deliberately rather
  // than let it silently pass.
  it("excludes routes still pending approval", async () => {
    const paths = (await sitemap()).map((entry) => entry.url.replace(siteConfig.siteUrl, ""));
    for (const path of [
      "/conditions/back-pain",
      "/conditions/neck-pain",
      "/conditions/sciatica",
      "/conditions/whiplash",
      "/conditions/cervicogenic-headache",
      "/conditions/concussion",
      "/conditions/tmj-jaw-pain",
      "/home-visit-chiropractor",
      "/services/chiropractic-adjustments",
      "/services/spinal-decompression",
      "/services/soft-tissue-therapy",
    ]) {
      expect(paths).not.toContain(path);
    }
  });
});
