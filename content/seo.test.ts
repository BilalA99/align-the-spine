import { describe, expect, it } from "vitest";

import { getRoute, getRouteHref, isPublished, routes } from "@/content/seo";

describe("routes registry", () => {
  it("has no duplicate paths", () => {
    const paths = routes.map((route) => route.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("gives every route a non-empty title and description", () => {
    for (const route of routes) {
      expect(route.title.length).toBeGreaterThan(0);
      expect(route.description.length).toBeGreaterThan(0);
    }
  });

  it("keeps every priority within Next's valid 0-1 range", () => {
    for (const route of routes) {
      expect(route.priority).toBeGreaterThanOrEqual(0);
      expect(route.priority).toBeLessThanOrEqual(1);
    }
  });

  it("gives every route an ISO lastModified date, not a runtime Date", () => {
    for (const route of routes) {
      expect(route.lastModified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("excludes /thank-you, /404, and API routes", () => {
    const paths = routes.map((route) => route.path);
    expect(paths).not.toContain("/thank-you");
    expect(paths).not.toContain("/404");
    expect(paths.some((path) => path.startsWith("/api"))).toBe(false);
  });

  it("excludes the legacy /auto-accident route", () => {
    expect(routes.map((route) => route.path)).not.toContain("/auto-accident");
  });
});

describe("IA-01: every route has a recorded, justified indexing decision", () => {
  it("gives every route a non-empty justification", () => {
    for (const route of routes) {
      expect(route.justification.length).toBeGreaterThan(0);
    }
  });

  it("gives every route a non-empty primaryQuery", () => {
    for (const route of routes) {
      expect(route.primaryQuery.length).toBeGreaterThan(0);
    }
  });

  it("never lets two indexable routes target the same primary query", () => {
    const indexableQueries = routes
      .filter((route) => isPublished(route))
      .map((route) => route.primaryQuery);
    expect(new Set(indexableQueries).size).toBe(indexableQueries.length);
  });
});

/** ATS-SEO-021: acceptance criteria "no duplicate published-page titles" /
 * "no duplicate published-page descriptions unless deliberately justified"
 * — structurally enforced the same way IA-01 enforces primaryQuery
 * uniqueness above, so a future route can't silently ship a copy-pasted
 * title/description. Draft routes are excluded (same as primaryQuery) since
 * they're noindex/out of the sitemap — not competing for a SERP slot. */
describe("ATS-SEO-021: metadata uniqueness across published routes", () => {
  it("never lets two published routes share a title", () => {
    const publishedTitles = routes.filter(isPublished).map((route) => route.title);
    expect(new Set(publishedTitles).size).toBe(publishedTitles.length);
  });

  it("never lets two published routes share a description", () => {
    const publishedDescriptions = routes.filter(isPublished).map((route) => route.description);
    expect(new Set(publishedDescriptions).size).toBe(publishedDescriptions.length);
  });
});

describe("getRoute", () => {
  it("returns the matching route", () => {
    expect(getRoute("/services").path).toBe("/services");
  });

  it("throws for an unregistered path instead of silently returning nothing", () => {
    expect(() => getRoute("/does-not-exist")).toThrow(/no route registered/);
  });
});

describe("getRouteHref", () => {
  it("returns the path for a published route", () => {
    expect(getRouteHref("/services")).toBe("/services");
  });

  it("returns null for a draft route — makes linking to it impossible", () => {
    expect(getRouteHref("/home-visit-chiropractor")).toBeNull();
  });

  it("returns null for an unregistered path", () => {
    expect(getRouteHref("/does-not-exist")).toBeNull();
  });
});
