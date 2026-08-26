import { describe, expect, it } from "vitest";

import { accidentInjuries } from "@/content/accident-injuries";
import { pointToWhereItHurtsContent } from "@/content/point-to-where-it-hurts";
import { isPublished, routes } from "@/content/seo";
import { services } from "@/content/services";
import { servicesGrid } from "@/content/services-grid";

/** LINK-01: "no internal link points to a draft or noindex route" —
 * enforced structurally rather than trusted, so a future card/region that
 * hardcodes an href (bypassing getRouteHref()) fails the build instead of
 * quietly shipping a link to a noindex page. Checks every card/region
 * source this ticket touched; any `href` that's set (not undefined/the
 * booking fallback) must resolve to a route registered AND published in
 * content/seo.ts. */
function expectOnlyPublishedHrefs(label: string, items: { name: string; href?: string }[]) {
  for (const item of items) {
    if (!item.href) continue;
    const route = routes.find((r) => r.path === item.href);
    expect(
      route,
      `${label} "${item.name}" links to unregistered path "${item.href}"`,
    ).toBeDefined();
    expect(
      route && isPublished(route),
      `${label} "${item.name}" links to draft/noindex route "${item.href}"`,
    ).toBe(true);
  }
}

describe("LINK-01: internal links never point to a draft or noindex route", () => {
  it("accidentInjuries", () => {
    expectOnlyPublishedHrefs("accidentInjuries", accidentInjuries);
  });

  it("servicesGrid", () => {
    expectOnlyPublishedHrefs("servicesGrid", servicesGrid);
  });

  it("services (homepage list)", () => {
    expectOnlyPublishedHrefs("services", services);
  });

  it("point-to-where-it-hurts body-map regions", () => {
    expectOnlyPublishedHrefs("body-map region", pointToWhereItHurtsContent.regions);
  });
});
