import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { captureAttribution, getStoredAttribution, sanitizeAttribution } from "./attribution";

let localStore: Map<string, string>;
let sessionStore: Map<string, string>;
let localUnavailable = false;
let sessionUnavailable = false;

function storage(store: Map<string, string>, unavailable: () => boolean) {
  return {
    getItem(key: string) {
      if (unavailable()) throw new Error("storage unavailable");
      return store.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      if (unavailable()) throw new Error("storage unavailable");
      store.set(key, value);
    },
    removeItem(key: string) {
      if (unavailable()) throw new Error("storage unavailable");
      store.delete(key);
    },
  };
}

function navigateTo(search: string) {
  (globalThis as { window?: unknown }).window = {
    location: { search },
    localStorage: storage(localStore, () => localUnavailable),
    sessionStorage: storage(sessionStore, () => sessionUnavailable),
  };
}

describe("attribution capture", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-26T12:00:00.000Z"));
    localStore = new Map();
    sessionStore = new Map();
    localUnavailable = false;
    sessionUnavailable = false;
    navigateTo("");
  });

  afterEach(() => {
    vi.useRealTimers();
    delete (globalThis as { window?: unknown }).window;
  });

  it("captures all whitelisted click IDs and UTMs, ignoring unknown fields", () => {
    navigateTo(
      "?gclid=g1&gbraid=b1&wbraid=w1&utm_source=google&utm_medium=cpc&utm_campaign=accident&utm_term=chiro&utm_content=ad1&reason=accident",
    );
    captureAttribution();
    expect(getStoredAttribution()).toEqual({
      gclid: "g1",
      gbraid: "b1",
      wbraid: "w1",
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "accident",
      utm_term: "chiro",
      utm_content: "ad1",
    });
    expect(localStore.get("ats_attribution_v3")).not.toContain("reason");
  });

  it("persists across reloads and a new session", () => {
    navigateTo("?gclid=abc123");
    captureAttribution();
    sessionStore.clear();
    navigateTo("");
    expect(getStoredAttribution()).toEqual({ gclid: "abc123" });
  });

  it("expires after 90 days", () => {
    navigateTo("?gclid=abc123");
    captureAttribution();
    vi.advanceTimersByTime(90 * 24 * 60 * 60 * 1_000 + 1);
    expect(getStoredAttribution()).toEqual({});
  });

  it("new non-empty values supersede corresponding old values without blank erasure", () => {
    navigateTo("?gclid=old&utm_source=google");
    captureAttribution();
    navigateTo("?gclid=&utm_campaign=next");
    captureAttribution();
    expect(getStoredAttribution()).toEqual({
      gclid: "old",
      utm_source: "google",
      utm_campaign: "next",
    });
    navigateTo("?gclid=new");
    captureAttribution();
    expect(getStoredAttribution().gclid).toBe("new");
  });

  it("handles malformed JSON without breaking capture", () => {
    localStore.set("ats_attribution_v3", "{bad");
    navigateTo("?wbraid=fresh");
    expect(() => captureAttribution()).not.toThrow();
    expect(getStoredAttribution()).toEqual({ wbraid: "fresh" });
  });

  it("falls back safely when localStorage is unavailable", () => {
    localUnavailable = true;
    navigateTo("?gbraid=session-only");
    expect(() => captureAttribution()).not.toThrow();
    expect(getStoredAttribution()).toEqual({ gbraid: "session-only" });
  });

  it("never breaks when all storage is unavailable", () => {
    localUnavailable = true;
    sessionUnavailable = true;
    navigateTo("?gclid=lost-but-safe");
    expect(() => captureAttribution()).not.toThrow();
    expect(getStoredAttribution()).toEqual({});
  });

  it.each(["ats_attribution", "ats_attribution_v2"])(
    "migrates and sanitizes the exact legacy session key %s",
    (key) => {
      sessionStore.set(key, JSON.stringify({ gclid: "legacy", email: "do-not-migrate" }));
      expect(getStoredAttribution()).toEqual({ gclid: "legacy" });
      expect(localStore.get("ats_attribution_v3")).not.toContain("email");
    },
  );
});

describe("sanitizeAttribution", () => {
  it("keeps only non-empty whitelisted strings and caps their length", () => {
    expect(
      sanitizeAttribution({
        gclid: "a".repeat(1000),
        gbraid: "",
        utm_source: "  google  ",
        reason: "accident",
      }),
    ).toEqual({ gclid: "a".repeat(512), utm_source: "google" });
  });

  it("rejects non-object and non-string input", () => {
    expect(sanitizeAttribution(null)).toEqual({});
    expect(sanitizeAttribution({ gclid: 123 })).toEqual({});
  });
});
