import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { trackLeadSuccess } from "@/lib/analytics/lead-events";

import { submitLead } from "./submit-client";

const submissionId = "33333333-3333-4333-8333-333333333333";
const input = { variant: "contactUs", values: { name: "Jane" }, submissionId };

describe("submitLead", () => {
  beforeEach(() => {
    (globalThis as { window?: unknown }).window = {
      location: { search: "" },
      localStorage: {
        getItem: () => null,
        setItem: () => undefined,
        removeItem: () => undefined,
      },
      sessionStorage: {
        getItem: () => null,
        setItem: () => undefined,
        removeItem: () => undefined,
      },
      dataLayer: [],
    };
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete (globalThis as { window?: unknown }).window;
  });

  it("returns the canonical UUID only for explicit durable success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: true, submissionId }), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      ),
    );
    await expect(submitLead(input)).resolves.toEqual({ ok: true, submissionId });
  });

  it.each([400, 403, 413, 422, 503])(
    "rejects HTTP %s and cannot create a conversion",
    async (status) => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(
          new Response(JSON.stringify({ ok: false }), {
            status,
            headers: { "content-type": "application/json" },
          }),
        ),
      );
      await expect(submitLead(input)).rejects.toThrow(String(status));
      expect(window.dataLayer ?? []).toEqual([]);
    },
  );

  it("rejects honeypot-style fake success without a trackable UUID", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      ),
    );
    await expect(submitLead(input)).rejects.toThrow(/not durably confirmed/);
    expect(window.dataLayer).toEqual([]);
  });

  it("uses the same transaction ID across a retry and browser tracking deduplicates it", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: false }), { status: 503 }))
      .mockImplementation(() =>
        Promise.resolve(
          new Response(JSON.stringify({ ok: true, submissionId }), {
            status: 200,
            headers: { "content-type": "application/json" },
          }),
        ),
      );
    vi.stubGlobal("fetch", fetchMock);

    await expect(submitLead(input)).rejects.toThrow("503");
    const firstSuccess = await submitLead(input);
    const retrySuccess = await submitLead(input);
    trackLeadSuccess(firstSuccess.submissionId);
    trackLeadSuccess(retrySuccess.submissionId);

    const sentBodies = fetchMock.mock.calls.map(
      ([, init]) => JSON.parse(String((init as RequestInit).body)) as { submissionId: string },
    );
    expect(sentBodies.map((body) => body.submissionId)).toEqual([
      submissionId,
      submissionId,
      submissionId,
    ]);
    expect(window.dataLayer).toEqual([{ event: "ats_lead_success", submission_id: submissionId }]);
  });
});
