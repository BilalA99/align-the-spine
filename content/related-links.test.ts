import { describe, expect, it } from "vitest";

import { buildRelatedLinks } from "@/content/related-links";

/** ATS-SEO-043: replaces the hand-typed `ConditionRelatedLink[]` arrays that
 * had drifted into real bugs across condition/service pages — self-links
 * (a page linking to itself in its own "related" row), mismatched anchor
 * text (e.g. a pill labeled "Cervicogenic Headache" that actually linked to
 * /conditions/neck-pain), and direct links to draft pages. Driving labels
 * and hrefs from one small map + the route registry makes those specific
 * bugs structurally impossible: the label and href can never point at two
 * different routes, because they're resolved from the same input path. */
describe("buildRelatedLinks", () => {
  it("resolves a known, published path to its registered label and href", () => {
    const links = buildRelatedLinks({ currentPath: "/conditions/whiplash", paths: ["/blog"] });
    expect(links).toEqual([{ label: "Patient Resources", href: "/blog", highlighted: false }]);
  });

  it("excludes the current page from its own related-links list (no self-links)", () => {
    const links = buildRelatedLinks({
      currentPath: "/conditions/back-pain",
      paths: ["/conditions/back-pain", "/blog"],
    });
    expect(links.map((l) => l.href)).toEqual(["/blog"]);
  });

  it("excludes a path whose route is still draft, rather than linking to a noindex page", () => {
    // /conditions/sciatica is status: "draft" in content/seo.ts today.
    const links = buildRelatedLinks({
      currentPath: "/conditions/whiplash",
      paths: ["/conditions/sciatica", "/blog"],
    });
    expect(links.map((l) => l.href)).toEqual(["/blog"]);
  });

  it("marks the highlightPath entry as highlighted, and nothing else", () => {
    const links = buildRelatedLinks({
      currentPath: "/conditions/whiplash",
      paths: ["/blog", "/book-an-appointment"],
      highlightPath: "/book-an-appointment",
    });
    expect(links.find((l) => l.href === "/blog")?.highlighted).toBe(false);
    expect(links.find((l) => l.href === "/book-an-appointment")?.highlighted).toBe(true);
  });

  it("throws for a path that isn't a registered route at all — fails the build instead of silently dropping a typo", () => {
    expect(() =>
      buildRelatedLinks({ currentPath: "/conditions/whiplash", paths: ["/does-not-exist"] }),
    ).toThrow(/no route registered/);
  });

  it("throws for a registered, published route with no label mapped — fails the build instead of shipping a blank pill", () => {
    // "/reviews" is a real published route but deliberately not in
    // RELATED_LINK_LABELS (not a condition/service/blog/CTA destination).
    expect(() =>
      buildRelatedLinks({ currentPath: "/conditions/whiplash", paths: ["/reviews"] }),
    ).toThrow(/no label registered/);
  });

  it("preserves the given path order", () => {
    const links = buildRelatedLinks({
      currentPath: "/conditions/whiplash",
      paths: ["/book-an-appointment", "/blog", "/car-accident-chiropractor"],
    });
    expect(links.map((l) => l.href)).toEqual([
      "/book-an-appointment",
      "/blog",
      "/car-accident-chiropractor",
    ]);
  });
});
