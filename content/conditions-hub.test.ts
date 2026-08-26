import { describe, expect, it } from "vitest";

import { backPainHero } from "@/content/back-pain-page";
import { cervicogenicHeadacheHero } from "@/content/cervicogenic-headache-page";
import { concussionHero } from "@/content/concussion-page";
import {
  conditionsHubCards,
  conditionsHubHero,
  conditionsHubIntro,
} from "@/content/conditions-hub";
import { neckPainHero } from "@/content/neck-pain-page";
import { sciaticaHero } from "@/content/sciatica-page";
import { tmjJawPainHero } from "@/content/tmj-jaw-pain-page";
import { whiplashHero } from "@/content/whiplash-page";

/** ATS-SEO-040: /conditions hub — pins its card grid to the 7 existing
 * condition routes, sourced from each condition's own hero content (no new
 * medical claims), and confirms nothing here regressed to a thin
 * keyword-only list. */
describe("conditionsHubCards", () => {
  it("has exactly one card per /conditions/* route", () => {
    expect(conditionsHubCards).toHaveLength(7);
  });

  it("every card links to a real /conditions/* path", () => {
    for (const card of conditionsHubCards) {
      expect(card.href).toMatch(/^\/conditions\/[a-z-]+$/);
    }
  });

  it("card hrefs are unique — no route listed twice", () => {
    const hrefs = conditionsHubCards.map((card) => card.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("card summaries are sourced verbatim from each condition's own hero subhead, not new copy", () => {
    const bySlug = Object.fromEntries(conditionsHubCards.map((card) => [card.slug, card]));
    expect(bySlug["back-pain"]?.summary).toBe(backPainHero.subhead);
    expect(bySlug["neck-pain"]?.summary).toBe(neckPainHero.subhead);
    expect(bySlug["sciatica"]?.summary).toBe(sciaticaHero.subhead);
    expect(bySlug["whiplash"]?.summary).toBe(whiplashHero.subhead);
    expect(bySlug["concussion"]?.summary).toBe(concussionHero.subhead);
    expect(bySlug["cervicogenic-headache"]?.summary).toBe(cervicogenicHeadacheHero.subhead);
    expect(bySlug["tmj-jaw-pain"]?.summary).toBe(tmjJawPainHero.subhead);
  });
});

describe("conditionsHubHero / conditionsHubIntro", () => {
  it("hero H1 is not the /car-accident-chiropractor page's H1 (distinct intent)", () => {
    expect(conditionsHubHero.h1).not.toBe("Car Accident Chiropractor in Deerfield Beach, FL");
  });

  it("hero and intro copy are non-empty", () => {
    expect(conditionsHubHero.h1.length).toBeGreaterThan(0);
    expect(conditionsHubHero.subhead.length).toBeGreaterThan(0);
    expect(conditionsHubIntro.length).toBeGreaterThan(0);
  });
});
