import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  classifyLeadPriority,
  consumePendingConversion,
  isBookCtaLink,
  isPhoneLink,
  stashPendingConversion,
  trackBookCtaClick,
  trackLeadConversion,
  trackPageView,
  trackPhoneClick,
} from "./analytics";

describe("isPhoneLink", () => {
  it("matches tel: links", () => {
    expect(isPhoneLink("tel:+19545737192")).toBe(true);
  });

  it("rejects non-tel links", () => {
    expect(isPhoneLink("/book-an-appointment")).toBe(false);
    expect(isPhoneLink("mailto:abe@example.com")).toBe(false);
  });
});

describe("isBookCtaLink", () => {
  it("matches /book and /book with a query or hash", () => {
    expect(isBookCtaLink("/book-an-appointment")).toBe(true);
    expect(isBookCtaLink("/book-an-appointment?ref=nav")).toBe(true);
    expect(isBookCtaLink("/book-an-appointment#form")).toBe(true);
  });

  it("rejects other paths, including /book-adjacent ones", () => {
    expect(isBookCtaLink("/booking")).toBe(false);
    expect(isBookCtaLink("/services")).toBe(false);
  });
});

describe("tracking helpers", () => {
  it("no-op safely without throwing when window/gtag isn't available", () => {
    expect(() => trackLeadConversion("heroEval")).not.toThrow();
    expect(() => trackLeadConversion("carAccident", { phone: "(954) 573-7192" })).not.toThrow();
    expect(() => trackPhoneClick()).not.toThrow();
    expect(() => trackBookCtaClick()).not.toThrow();
    expect(() => trackPageView("/about")).not.toThrow();
  });

  it("emits only non-PII lead dimensions", () => {
    const gtag = vi.fn();
    (globalThis as { window?: unknown }).window = { gtag };
    trackLeadConversion("heroEval", {
      email: "patient@example.com",
      phone: "9545737192",
      message: "private",
      carAccident: "yes",
    });
    const serialized = JSON.stringify(gtag.mock.calls);
    expect(serialized).toContain("generate_lead");
    expect(serialized).toContain("high");
    expect(serialized).not.toContain("patient@example.com");
    expect(serialized).not.toContain("9545737192");
    expect(serialized).not.toContain("private");
  });
});

afterEach(() => {
  delete (globalThis as { window?: unknown }).window;
});

/** No jsdom in this project — same minimal window/sessionStorage mock
 * pattern as lib/attribution.test.ts (which these two functions mirror). */
describe("stashPendingConversion / consumePendingConversion (IA-05/ATS-E7)", () => {
  let store: Map<string, string>;

  beforeEach(() => {
    store = new Map();
    (globalThis as { window?: unknown }).window = {
      sessionStorage: {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => {
          store.set(key, value);
        },
        removeItem: (key: string) => {
          store.delete(key);
        },
      },
    };
  });

  afterEach(() => {
    delete (globalThis as { window?: unknown }).window;
  });

  it("round-trips a stashed conversion payload", () => {
    stashPendingConversion("heroEval", { firstName: "Jane", phone: "5551234567" });
    expect(consumePendingConversion()).toEqual({
      variant: "heroEval",
      values: { firstName: "Jane", phone: "5551234567" },
    });
  });

  it("is read-once — a second call returns null so a refresh can't double-fire", () => {
    stashPendingConversion("heroEval", { firstName: "Jane" });
    consumePendingConversion();
    expect(consumePendingConversion()).toBeNull();
  });

  it("returns null when nothing was stashed (direct navigation to /thank-you)", () => {
    expect(consumePendingConversion()).toBeNull();
  });
});

describe("classifyLeadPriority", () => {
  it("trusts an explicit carAccident answer above everything else", () => {
    expect(classifyLeadPriority("heroEval", { carAccident: "yes" })).toBe("high");
    // Even on an accident-framed form, an explicit "no" overrides the
    // variant-based fallback — someone filling it out for an unrelated reason.
    expect(classifyLeadPriority("carAccident", { carAccident: "no" })).toBe("standard");
  });

  it("classifies /book's accident reason as high priority regardless of variant", () => {
    expect(classifyLeadPriority("booking", { reason: "accident" })).toBe("high");
  });

  it("falls back to accident-specific form variants when the field is left blank", () => {
    expect(classifyLeadPriority("carAccident", {})).toBe("high");
    expect(classifyLeadPriority("accidentEval", {})).toBe("high");
  });

  it("classifies everything else as standard priority", () => {
    expect(classifyLeadPriority("heroEval", {})).toBe("standard");
    expect(classifyLeadPriority("booking", { reason: "back-pain" })).toBe("standard");
    expect(classifyLeadPriority("contactUs", {})).toBe("standard");
  });
});
