import { afterEach, describe, expect, it, vi } from "vitest";

import { isProduction, resolveSiteUrl, siteConfig } from "@/content/site";

describe("isProduction", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('is true only when VERCEL_ENV is exactly "production"', () => {
    vi.stubEnv("VERCEL_ENV", "production");
    expect(isProduction()).toBe(true);
  });

  it("is false for preview deploys", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(isProduction()).toBe(false);
  });

  it("is false when VERCEL_ENV is unset (local dev, CI)", () => {
    vi.stubEnv("VERCEL_ENV", undefined);
    expect(isProduction()).toBe(false);
  });
});

describe("resolveSiteUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses SITE_URL when set, regardless of environment", () => {
    vi.stubEnv("SITE_URL", "https://example.com");
    vi.stubEnv("VERCEL_ENV", "production");
    expect(resolveSiteUrl()).toBe("https://example.com");
  });

  it("falls back to the real production domain outside production when unset", () => {
    vi.stubEnv("SITE_URL", undefined);
    vi.stubEnv("VERCEL_ENV", undefined);
    expect(resolveSiteUrl()).toBe("https://www.chirobackpain.com");
  });

  it("throws in production when SITE_URL is unset — never falls back silently", () => {
    vi.stubEnv("SITE_URL", undefined);
    vi.stubEnv("VERCEL_ENV", "production");
    expect(() => resolveSiteUrl()).toThrow(/SITE_URL must be set/);
  });
});

describe("hoursVerified / social.verified gates", () => {
  it("fails closed while current public hours conflict", () => {
    expect(siteConfig.hoursVerified).toBe(false);
  });

  it("marks every current social link as unverified (all are '#' placeholders today)", () => {
    for (const social of siteConfig.social) {
      expect(social.verified).toBe(false);
    }
  });
});

/** ATS-SEO-040: the "Conditions" nav item used to click through to
 * /car-accident-chiropractor (borrowing the "Auto Accidents" item's href
 * because /conditions had no real hub page) — semantically misleading, and
 * it made the two nav entries indistinguishable by destination. Now that
 * /conditions is a real page, Conditions must own its own href. */
describe("Conditions nav item", () => {
  const conditions = siteConfig.nav.find((link) => link.label === "Conditions");
  const autoAccidents = siteConfig.nav.find((link) => link.label === "Auto Accidents");

  it("exists", () => {
    expect(conditions).toBeDefined();
  });

  it("points at the real /conditions hub, not the accident page", () => {
    expect(conditions?.href).toBe("/conditions");
  });

  it("no longer shares its href with the Auto Accidents nav item", () => {
    expect(conditions?.href).not.toBe(autoAccidents?.href);
  });
});
