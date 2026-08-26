import { describe, expect, it } from "vitest";

import { esServiceAreaGroups } from "@/content/es/service-areas";
import { esServiceAreaPages } from "@/content/es/service-areas-cities";
import {
  buildAlternates,
  counterpartPath,
  localizedRoutes,
  serviceAreaLocalizedRoutes,
} from "@/content/i18n";
import { serviceAreas } from "@/content/service-areas";
import { siteConfig } from "@/content/site";

describe("Spanish service-area coverage", () => {
  it("lists every English service-area community exactly once", () => {
    const listed = esServiceAreaGroups.flatMap((group) =>
      group.communities.map((community) => community.href),
    );
    const expected = serviceAreas.map((entry) => `/es/areas-de-servicio/${entry.slug}`);
    expect([...listed].sort()).toEqual([...expected].sort());
    expect(new Set(listed).size).toBe(listed.length);
  });

  it("uses each community's real name and county from the English data", () => {
    const byHref = new Map(
      serviceAreas.map((entry) => [`/es/areas-de-servicio/${entry.slug}`, entry.serviceArea]),
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

  it("pairs the hub and all nineteen city pages", () => {
    const hub = localizedRoutes.find((entry) => entry.id === "serviceAreas");
    expect(hub?.es).toBe("/es/areas-de-servicio");

    // Every English city page has a Spanish counterpart and vice versa.
    // The pair table is derived (content/i18n.ts), so this is really a
    // check that the derivation covers the whole city set.
    const pairs = serviceAreaLocalizedRoutes;
    expect(pairs).toHaveLength(serviceAreas.length);
    for (const entry of serviceAreas) {
      const pair = pairs.find((candidate) => candidate.en === `/service-areas/${entry.slug}`);
      expect(pair, `no Spanish pair for /service-areas/${entry.slug}`).toBeDefined();
      expect(pair?.es).toBe(`/es/areas-de-servicio/${entry.slug}`);
    }
  });

  it("round-trips every city pair through the language switcher", () => {
    for (const pair of serviceAreaLocalizedRoutes) {
      expect(counterpartPath(pair.en, "en", "es")).toBe(pair.es);
      expect(counterpartPath(pair.es!, "es", "en")).toBe(pair.en);
    }
  });

  it("emits reciprocal hreflang for every city pair", () => {
    for (const pair of serviceAreaLocalizedRoutes) {
      const fromEn = buildAlternates(siteConfig.siteUrl, pair.en, "en");
      const fromEs = buildAlternates(siteConfig.siteUrl, pair.es!, "es");
      expect(fromEn).not.toBeNull();
      expect(fromEs?.languages).toEqual(fromEn?.languages);
      expect(fromEn?.languages["x-default"]).toBe(`${siteConfig.siteUrl}${pair.en}`);
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

/** The city pages are one translated template interpolated with per-city
 * facts (content/es/service-areas-cities.ts). These are the guards on what
 * that buys: the legally-sensitive claims must be byte-identical across all
 * nineteen, and the city-specific facts must actually differ. */
describe("Spanish city pages", () => {
  it("covers every English city exactly once", () => {
    expect(esServiceAreaPages.map((page) => page.slug).sort()).toEqual(
      serviceAreas.map((entry) => entry.slug).sort(),
    );
  });

  it("renders identical PIP, EMC and claim-denial text on every page", () => {
    // These four blocks carry the statutory claims. If one city's Spanish
    // ever differs from another's, a legal claim has drifted.
    const CLAIM_BLOCKS = ["block-4", "block-6", "block-14", "block-24"];
    for (const id of CLAIM_BLOCKS) {
      const texts = new Set(
        esServiceAreaPages.map((page) => {
          const block = page.blocks.find((candidate) => candidate.id === id);
          return block && "text" in block ? block.text : undefined;
        }),
      );
      expect(texts.size, `block ${id} differs across cities`).toBe(1);
      expect([...texts][0]).toBeTruthy();
    }
  });

  it("gives every page a unique title, description and H2", () => {
    for (const key of ["seoTitle", "metaDescription"] as const) {
      const values = esServiceAreaPages.map((page) => page[key]);
      expect(new Set(values).size, `duplicate ${key}`).toBe(values.length);
    }
    const h2s = esServiceAreaPages.map(
      (page) => page.blocks.find((block) => block.id === "block-1")?.["text" as never],
    );
    expect(new Set(h2s).size).toBe(h2s.length);
  });

  it("carries the same county crash figures the English pages cite", () => {
    const enByCounty = new Map<string, string>();
    for (const entry of serviceAreas) {
      const block = entry.blocks.find((candidate) => candidate.id === "block-8");
      const county = entry.serviceArea?.county;
      if (block && "text" in block && county) enByCounty.set(county, block.text);
    }
    for (const page of esServiceAreaPages) {
      const block = page.blocks.find((candidate) => candidate.id === "block-8");
      expect(block && "text" in block).toBe(true);
      const enText = enByCounty.get(page.county) ?? "";
      // Every comma-grouped figure in the English sentence must appear in
      // the Spanish one — a statistic that changes in translation is a
      // different claim.
      for (const figure of enText.match(/\d{1,3}(,\d{3})+/g) ?? []) {
        expect(
          block && "text" in block ? block.text : "",
          `${page.slug}: missing figure ${figure}`,
        ).toContain(figure);
      }
    }
  });

  it("keeps every Spanish city page inside Spanish", () => {
    for (const page of esServiceAreaPages) {
      expect(page.path.startsWith("/es/areas-de-servicio/")).toBe(true);
      for (const related of page.relatedSlugs) {
        expect(esServiceAreaPages.some((candidate) => candidate.slug === related)).toBe(true);
      }
    }
  });
});
