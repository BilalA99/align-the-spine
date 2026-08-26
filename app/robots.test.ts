import { afterEach, describe, expect, it, vi } from "vitest";

import { siteConfig } from "@/content/site";

import robots from "./robots";

describe("robots", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("disallows everything when not production", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(robots().rules).toEqual({ userAgent: "*", disallow: "/" });
  });

  it("disallows everything when VERCEL_ENV is unset", () => {
    vi.stubEnv("VERCEL_ENV", undefined);
    expect(robots().rules).toEqual({ userAgent: "*", disallow: "/" });
  });

  it("allows crawling except /api/ and the thank-you pages in production", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    expect(robots().rules).toEqual({
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/preview/", "/thank-you", "/es/gracias"],
    });
  });

  // Guards the single most damaging way this file could break the Spanish
  // layer: a disallow rule broad enough to swallow /es. Every Spanish page
  // is primary content, not a duplicate of its English counterpart, so
  // nothing under /es may be blocked apart from the post-conversion page.
  it("never blocks the /es subtree in production", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    const rules = robots().rules as { disallow?: string[] };
    for (const rule of rules.disallow ?? []) {
      expect(rule === "/es" || rule === "/es/").toBe(false);
    }
    expect(rules.disallow).toContain("/es/gracias");
  });

  it("always references the canonical sitemap URL", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(robots().sitemap).toBe(`${siteConfig.siteUrl}/sitemap.xml`);
  });
});
