import { describe, expect, it } from "vitest";

import { aboutHero } from "@/content/about-page";
import { doctorProfileContent } from "@/content/doctor-profile";

/** ATS-SEO-022: /about historically rendered a Services-style H1/hero
 * ("Chiropractic Services in Deerfield Beach, FL" with a sciatica-condition
 * eyebrow) despite doctor-focused metadata — title/H1/copy pointed at
 * different intents. These assertions pin the About hero to doctor/about
 * intent using only facts already established in content/doctor-profile.ts,
 * so a future edit can't silently reintroduce the Services copy. */
describe("aboutHero targets doctor/about intent, not the Services page's", () => {
  it("H1 is not the Services page's H1", () => {
    expect(aboutHero.h1).not.toContain("Chiropractic Services in Deerfield Beach");
  });

  it("H1 names Dr. Abe (about-page/doctor-entity intent)", () => {
    expect(aboutHero.h1).toContain("Dr. Abe Nasser");
  });

  it("eyebrow is not a condition-style hook", () => {
    expect(aboutHero.eyebrowChip).not.toMatch(/radiating|nerve pain|sciatica/i);
  });

  it("eyebrow matches the existing doctor-profile eyebrow already used elsewhere on /about", () => {
    expect(aboutHero.eyebrowChip).toBe(doctorProfileContent.eyebrow);
  });

  it("subhead reflects patient-centered, doctor-focused positioning", () => {
    expect(aboutHero.subhead).toContain("Dr. Abe Nasser");
    expect(aboutHero.subhead.toLowerCase()).toContain("patient-centered");
  });
});
