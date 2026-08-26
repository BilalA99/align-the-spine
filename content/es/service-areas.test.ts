import { describe, expect, it } from "vitest";

import { esRoutes } from "@/content/es/seo";
import { esServiceAreaGroups } from "@/content/es/service-areas";
import { localizedRoutes } from "@/content/i18n";
import { serviceAreas } from "@/content/service-areas";

describe("Spanish service-area coverage", () => {
  it("lists every English service-area community exactly once", () => {
    const listed = esServiceAreaGroups.flatMap((group) =>
      group.communities.map((community) => community.href),
    );
    const expected = serviceAreas.map((entry) => `/service-areas/${entry.slug}`);
    expect([...listed].sort()).toEqual([...expected].sort());
    expect(new Set(listed).size).toBe(listed.length);
  });

  it("uses each community's real name and county from the English data", () => {
    const byHref = new Map(
      serviceAreas.map((entry) => [`/service-areas/${entry.slug}`, entry.serviceArea]),
    );
    for (const group of esServiceAreaGroups) {
      for (const community of group.communities) {
        const evidence = byHref.get(community.href);
        expect(evidence, community.href).toBeDefined();
        expect(community.name).toBe(evidence?.communityName);
        expect(group.county).toBe(evidence?.county);
      }
    }
  });

  it("pairs the hub, and only the hub", () => {
    const hub = localizedRoutes.find((entry) => entry.id === "serviceAreas");
    expect(hub?.es).toBe("/es/areas-de-servicio");

    // The nineteen city pages must have no Spanish counterpart registered.
    // This is the guard on the whole decision: the moment someone adds
    // `/es/areas-de-servicio/miami` to either registry, this fails.
    for (const entry of localizedRoutes) {
      expect(entry.en.startsWith("/service-areas/")).toBe(false);
    }
    for (const route of esRoutes) {
      expect(
        route.path.startsWith("/es/areas-de-servicio/"),
        `${route.path}: per-city Spanish service-area pages are deliberately not built — see content/es/service-areas.ts`,
      ).toBe(false);
    }
  });
});

/** The measurement behind that decision, kept as a live test rather than a
 * comment: if someone ever genuinely differentiates the English city pages,
 * this fails and the Spanish decision is worth revisiting. It also documents
 * the gap between the declared `similarityScore` and the real one.
 *
 * Compares the visible prose of every pair of city pages. Node has no
 * difflib, so this uses a token-level Jaccard/containment measure — a
 * different statistic than the SequenceMatcher ratio quoted in
 * content/es/service-areas.ts, but measuring the same thing and landing in
 * the same place. */
function proseOf(entry: (typeof serviceAreas)[number]): string {
  const parts: string[] = [entry.excerpt, entry.directAnswer];
  for (const block of entry.blocks) {
    if ("text" in block && typeof block.text === "string") parts.push(block.text);
    if ("items" in block && Array.isArray(block.items)) parts.push(...block.items);
  }
  for (const faq of entry.faqs) parts.push(faq.question, faq.answer);
  return parts.join(" ");
}

function tokens(text: string): Set<string> {
  return new Set(text.toLowerCase().match(/[a-záéíóúñ']+/g) ?? []);
}

describe("the English service-area pages are near-duplicates (why there is one Spanish hub)", () => {
  const prose = serviceAreas.map((entry) => ({ slug: entry.slug, tokens: tokens(proseOf(entry)) }));

  it("every entry still declares the same hand-typed similarityScore", () => {
    // Not a measurement — a constant. That's the point: the publication
    // gate's `similarityScore > 40` check is reading this, not the prose.
    const declared = new Set(serviceAreas.map((entry) => entry.serviceArea?.similarityScore));
    expect(declared).toEqual(new Set([22]));
  });

  it("but the actual prose overlap between every pair is far above it", () => {
    let min = 1;
    let minPair = "";
    for (let i = 0; i < prose.length; i += 1) {
      for (let j = i + 1; j < prose.length; j += 1) {
        const a = prose[i].tokens;
        const b = prose[j].tokens;
        let shared = 0;
        for (const token of a) if (b.has(token)) shared += 1;
        const overlap = shared / Math.min(a.size, b.size);
        if (overlap < min) {
          min = overlap;
          minPair = `${prose[i].slug} vs ${prose[j].slug}`;
        }
      }
    }
    // Even the LEAST similar pair shares the overwhelming majority of its
    // vocabulary. If this ever drops below 0.7, the city pages have been
    // genuinely differentiated and per-city Spanish pages become a real
    // question again — see content/es/service-areas.ts.
    expect(min, `least-similar pair: ${minPair} at ${(min * 100).toFixed(1)}%`).toBeGreaterThan(
      0.7,
    );
  });
});
