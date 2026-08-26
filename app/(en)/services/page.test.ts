import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";

import { servicesGrid } from "@/content/services-grid";

import ServicesPage from "./page";

/** Regression guard for the bug where /services published Service JSON-LD
 * for content/services.ts (the homepage's dataset) while the page's
 * visible content — and its ServiceCard anchors — actually come from
 * content/services-grid.ts's servicesGrid. Calling the page (a synchronous
 * Server Component) directly is safe here: JSX just builds a plain React
 * element tree, it does not render/execute nested components, so this
 * needs no DOM/jsdom environment. If the Service JSON-LD import is ever
 * swapped back to content/services.ts, the @id fragments below stop
 * matching servicesGrid's slugs and this test fails. */
describe("ServicesPage JSON-LD", () => {
  it("emits one Service entity per servicesGrid item, keyed by servicesGrid's own slugs", () => {
    const page = ServicesPage() as ReactElement<{ children: unknown[] }>;
    const children = page.props.children;
    const serviceJsonLdElements = children.find((child): child is ReactElement[] =>
      Array.isArray(child),
    );

    if (!serviceJsonLdElements) {
      throw new Error("Expected to find the mapped array of Service JsonLd elements");
    }

    const idFragments = serviceJsonLdElements
      .map((element) => (element.props as { data: { "@id": string } }).data["@id"])
      .map((id) => id.split("#")[1]);

    expect(idFragments.sort()).toEqual(servicesGrid.map((service) => service.slug).sort());
    expect(idFragments).toHaveLength(servicesGrid.length);
  });
});
