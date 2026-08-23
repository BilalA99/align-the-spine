import { describe, expect, it } from "vitest";

import { serviceAreas } from "@/content/service-areas";

import { evaluatePublicationGates } from "./publication-gates";
import { contentBlocksSchema, faqsSchema, keyTakeawaysSchema, slugSchema } from "./schemas";
import type { ContentItem } from "./types";

/** Builds the same shape StaticServiceAreaRepository.toItem() produces, so
 * the gate check below exercises exactly what the app actually renders. */
function toGateCheckItem(entry: (typeof serviceAreas)[number]): ContentItem {
  return {
    id: `service-area-${entry.slug}`,
    contentType: "service_area",
    slug: entry.slug,
    title: entry.title,
    excerpt: entry.excerpt,
    blocks: entry.blocks,
    status: "published",
    featured: false,
    searchIntent: "informational",
    audience: "car-accident/PIP patients considering a home-visit evaluation",
    seoTitle: entry.seoTitle,
    metaDescription: entry.metaDescription,
    featuredImageDecorative: true,
    authorId: "a3c2e825-c7cd-4362-a7c4-1eba3e505fdd",
    medicalReviewRequired: entry.medicalReviewRequired,
    publishedAt: "2026-08-18T00:00:00.000Z",
    createdAt: "2026-08-18T00:00:00.000Z",
    updatedAt: "2026-08-18T00:00:00.000Z",
    noindex: false,
    version: 1,
    directAnswer: entry.directAnswer,
    keyTakeaways: entry.keyTakeaways,
    faqs: entry.faqs,
    emergencyGuidanceRelevant: false,
    categorySlugs: [],
    tagSlugs: [],
    relatedContentIds: entry.relatedSlugs,
    sources: [
      {
        id: "test-source",
        title: "test",
        publisher: "test",
        url: "https://example.com",
        sourceType: "other",
        accessedDate: "2026-08-17",
        claimSupported: "test",
        classification: "secondary",
        verificationStatus: "verified",
      },
    ],
    gateResult: { passed: false, blockers: [], recommendations: [], checkedAt: "" },
    serviceArea: entry.serviceArea,
    author: undefined,
  };
}

describe("content/service-areas.ts", () => {
  const slugs = serviceAreas.map((entry) => entry.slug);

  it("has no duplicate slugs", () => {
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every slug is well-formed", () => {
    for (const slug of slugs) {
      expect(slugSchema.safeParse(slug).success, `slug "${slug}" is invalid`).toBe(true);
    }
  });

  // ATS-SEO-021: same "no duplicate published-page titles/descriptions"
  // acceptance criterion content/seo.test.ts enforces for the static route
  // registry, applied here since these 19 pages are published content too.
  it("has no duplicate seoTitle across entries", () => {
    const titles = serviceAreas.map((entry) => entry.seoTitle);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("has no duplicate metaDescription across entries", () => {
    const descriptions = serviceAreas.map((entry) => entry.metaDescription);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it("no longer lists riviera-beach or homestead", () => {
    expect(slugs).not.toContain("riviera-beach");
    expect(slugs).not.toContain("homestead");
  });

  it("lists the newly added cities", () => {
    for (const slug of [
      "lighthouse-point",
      "coral-springs",
      "coconut-creek",
      "margate",
      "sunrise",
      "tamarac",
    ]) {
      expect(slugs).toContain(slug);
    }
  });

  it("every relatedSlugs entry resolves to a real entry in this file", () => {
    const slugSet = new Set(slugs);
    for (const entry of serviceAreas) {
      for (const related of entry.relatedSlugs) {
        expect(slugSet.has(related), `${entry.slug} relates to missing slug "${related}"`).toBe(
          true,
        );
      }
    }
  });

  it("blocks, key takeaways, and faqs pass the same zod schemas editorial content does", () => {
    for (const entry of serviceAreas) {
      expect(contentBlocksSchema.safeParse(entry.blocks).success, entry.slug).toBe(true);
      expect(keyTakeawaysSchema.safeParse(entry.keyTakeaways).success, entry.slug).toBe(true);
      expect(faqsSchema.safeParse(entry.faqs).success, entry.slug).toBe(true);
    }
  });

  // This blocker is permanent and by design, not a defect: none of these
  // pages claims an in-office location (only home-visit dispatch — see each
  // entry's relationship/inOfficeServiceVerified). Clinician review is no
  // longer a hard gate (owner direction 2026-08-18: removed along with the
  // reviewer-assignment UI). Any OTHER blocker showing up here means the
  // content itself has a real defect.
  const EXPECTED_BLOCKERS = ["In-office relevance for this community is not verified."];

  it("passes evaluatePublicationGates except for the one disclosed, by-design blocker", () => {
    for (const entry of serviceAreas) {
      const result = evaluatePublicationGates(toGateCheckItem(entry));
      expect([...result.blockers].sort(), `${entry.slug} has unexpected gate blockers`).toEqual(
        [...EXPECTED_BLOCKERS].sort(),
      );
    }
  });
});
