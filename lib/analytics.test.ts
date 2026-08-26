import { describe, expect, it } from "vitest";

import {
  isBookCtaLink,
  isPhoneLink,
  trackBookCtaClick,
  trackPageView,
  trackPhoneClick,
} from "./analytics";

describe("non-conversion analytics helpers", () => {
  it("matches phone and booking links", () => {
    expect(isPhoneLink("tel:+19542821801")).toBe(true);
    expect(isPhoneLink("mailto:office@example.com")).toBe(false);
    expect(isBookCtaLink("/book-an-appointment")).toBe(true);
    expect(isBookCtaLink("/book-an-appointment?ref=nav")).toBe(true);
    expect(isBookCtaLink("/booking")).toBe(false);
  });

  it("no-ops safely when gtag is unavailable", () => {
    expect(() => trackPhoneClick()).not.toThrow();
    expect(() => trackBookCtaClick()).not.toThrow();
    expect(() => trackPageView("/about")).not.toThrow();
  });
});
