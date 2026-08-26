import { describe, expect, it } from "vitest";

import { accidentInjuries, buildAccidentInjuries } from "@/content/accident-injuries";
import { getRoute, isPublished } from "@/content/seo";

/** ATS-SEO-042: every card in this grid used to fall straight through to
 * the generic booking CTA whenever its ideal destination (a condition/
 * service page) was still draft — every one of them currently is, so in
 * practice all 6 cards pointed at the same appointment-request link. Cards
 * should instead fall back to the published /car-accident-chiropractor
 * page — a real, topically relevant destination — reserving the booking
 * CTA for actual conversion, not informational browsing. */
describe("accidentInjuries (default export, used on non-accident pages)", () => {
  const accidentPageHref = getRoute("/car-accident-chiropractor").path;

  it("is published, so this fallback destination is safe to link to", () => {
    expect(isPublished(getRoute("/car-accident-chiropractor"))).toBe(true);
  });

  it("every card resolves to a real href — none silently fall through to undefined", () => {
    for (const card of accidentInjuries) {
      expect(card.href).toBeTruthy();
    }
  });

  it("cards without a live specific destination fall back to the accident page, not the booking CTA", () => {
    for (const card of accidentInjuries) {
      expect(card.href).not.toBe("/book-an-appointment");
    }
  });

  it("not every card resolves to the exact same booking destination (no duplicate generic appointment link)", () => {
    const bookingHrefs = accidentInjuries.filter((card) => card.href === "/book-an-appointment");
    expect(bookingHrefs).toHaveLength(0);
  });

  it("a card falling back to the accident page carries a CTA label describing that destination, not a mismatched specific-treatment label", () => {
    const fallbackCards = accidentInjuries.filter((card) => card.href === accidentPageHref);
    expect(fallbackCards.length).toBeGreaterThan(0);
    for (const card of fallbackCards) {
      expect(card.ctaLabel).toBeTruthy();
      expect(card.ctaLabel?.toLowerCase()).toContain("accident");
    }
  });
});

describe("buildAccidentInjuries({ skipAccidentPageFallback: true }) — used on /car-accident-chiropractor itself", () => {
  it("never links a card back to the page it's already rendered on", () => {
    const cards = buildAccidentInjuries({ skipAccidentPageFallback: true });
    for (const card of cards) {
      expect(card.href).not.toBe("/car-accident-chiropractor");
    }
  });
});
