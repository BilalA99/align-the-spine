import { afterEach, describe, expect, it, vi } from "vitest";

import { siteConfig } from "@/content/site";

import { buildMetadata } from "./metadata";

describe("buildMetadata", () => {
  it("builds a canonical URL from siteConfig.siteUrl and the given path", () => {
    const metadata = buildMetadata({
      title: "Title",
      description: "Description",
      path: "/services",
    });
    expect(metadata.alternates?.canonical).toBe(`${siteConfig.siteUrl}/services`);
  });

  // /services has a Spanish counterpart registered in content/i18n.ts, so
  // it gets reciprocal hreflang alongside its self-canonical.
  it("adds reciprocal hreflang for a route that has a counterpart in the other language", () => {
    const metadata = buildMetadata({
      title: "Title",
      description: "Description",
      path: "/services",
    });
    expect(metadata.alternates?.languages).toEqual({
      "en-US": `${siteConfig.siteUrl}/services`,
      "es-US": `${siteConfig.siteUrl}/es/servicios`,
      "x-default": `${siteConfig.siteUrl}/services`,
    });
  });

  // A Spanish page must self-canonicalize to its own /es URL — canonicalizing
  // it to the English page would collapse a legitimate translated primary
  // page out of the index.
  it("self-canonicalizes a Spanish page and points x-default at the English one", () => {
    const metadata = buildMetadata({
      title: "Título",
      description: "Descripción",
      path: "/es/servicios",
      locale: "es",
    });
    expect(metadata.alternates?.canonical).toBe(`${siteConfig.siteUrl}/es/servicios`);
    expect(metadata.alternates?.languages).toEqual({
      "en-US": `${siteConfig.siteUrl}/services`,
      "es-US": `${siteConfig.siteUrl}/es/servicios`,
      "x-default": `${siteConfig.siteUrl}/services`,
    });
  });

  // /privacy-policy is English-only (es: null in content/i18n.ts). A
  // one-entry hreflang set annotates nothing, so none is emitted.
  it("omits hreflang entirely for a route with no counterpart", () => {
    const metadata = buildMetadata({
      title: "Title",
      description: "Description",
      path: "/privacy-policy",
    });
    expect(metadata.alternates?.canonical).toBe(`${siteConfig.siteUrl}/privacy-policy`);
    expect(metadata.alternates?.languages).toBeUndefined();
  });

  it("sets og:locale from the page's locale", () => {
    expect(
      buildMetadata({ title: "T", description: "D", path: "/services" }).openGraph?.locale,
    ).toBe("en_US");
    expect(
      buildMetadata({ title: "T", description: "D", path: "/es/servicios", locale: "es" }).openGraph
        ?.locale,
    ).toBe("es_US");
  });

  it("wraps title in { absolute } so the root layout's title.template can't double-suffix it", () => {
    const metadata = buildMetadata({
      title: "Book an Appointment | Align the Spine Chiropractic",
      description: "Description",
      path: "/book-an-appointment",
    });
    expect(metadata.title).toEqual({
      absolute: "Book an Appointment | Align the Spine Chiropractic",
    });
  });

  it("mirrors title/description/url into openGraph and twitter", () => {
    const metadata = buildMetadata({
      title: "Title",
      description: "Description",
      path: "/book-an-appointment",
    });
    expect(metadata.openGraph).toMatchObject({
      title: "Title",
      description: "Description",
      url: `${siteConfig.siteUrl}/book-an-appointment`,
      siteName: siteConfig.business.name,
    });
    expect(metadata.twitter).toMatchObject({ title: "Title", description: "Description" });
  });

  it("includes an OG/Twitter image and upgrades the Twitter card when one is given", () => {
    const metadata = buildMetadata({
      title: "Title",
      description: "Description",
      path: "/about",
      image: { src: "/figma-exports/dr-abe-neck.png", alt: "Dr. Abe Nasser" },
    });
    expect(metadata.openGraph?.images).toEqual([
      { url: "/figma-exports/dr-abe-neck.png", alt: "Dr. Abe Nasser" },
    ]);
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      images: ["/figma-exports/dr-abe-neck.png"],
    });
  });

  it("falls back to a text-only summary card when no image is given", () => {
    const metadata = buildMetadata({
      title: "Title",
      description: "Description",
      path: "/privacy-policy",
    });
    expect(metadata.openGraph?.images).toBeUndefined();
    expect(metadata.twitter).toMatchObject({ card: "summary" });
  });
});

describe("buildMetadata production gating", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("forces noindex when VERCEL_ENV is not production, even if the caller didn't ask for it", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    const metadata = buildMetadata({ title: "Title", description: "Description", path: "/about" });
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it("clobbers permissive robots overrides in non-production", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    const metadata = buildMetadata({
      title: "Title",
      description: "Description",
      path: "/about",
      robots: { index: true, follow: true },
    });
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it("respects the caller's robots value in production", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    const metadata = buildMetadata({
      title: "Title",
      description: "Description",
      path: "/thank-you",
      robots: { index: false },
    });
    expect(metadata.robots).toEqual({ index: false });
  });

  it("omits robots in production when the caller didn't pass one", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    const metadata = buildMetadata({ title: "Title", description: "Description", path: "/about" });
    expect(metadata.robots).toBeUndefined();
  });
});
