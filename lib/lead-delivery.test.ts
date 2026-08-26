import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { LeadRecord } from "@/lib/lead-store";
import { recordDeliveryOutcome } from "@/lib/lead-store";

vi.mock("@/lib/lead-store", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/lead-store")>();
  return { ...actual, recordDeliveryOutcome: vi.fn() };
});

/** ATS-E5 5.9: "E2E test: forced email failure" — with delivery forced to
 * fail on every attempt, prove (a) the already-durable lead is untouched,
 * (b) the operator-visible delivery state ends up 'failed', and (c) the
 * lead is never marked 'delivered' (so nothing downstream can count it as
 * delivered). Persistence itself is exercised separately in
 * lib/lead-store.test.ts — this file only forces the delivery side. */
describe("lib/lead-delivery: forced failure path", () => {
  const originalFetch = global.fetch;
  const originalKey = process.env.RESEND_API_KEY;

  const lead: LeadRecord = {
    id: "lead-forced-failure",
    idempotencyKey: "irrelevant-for-this-test",
    variant: "heroEval",
    fields: { name: "Jane Doe", phone: "5551234567" },
    attribution: {},
    priority: "normal",
    deliveryStatus: "pending",
    providerResponseId: null,
    providerResponseBody: null,
    retryCount: 0,
    finalFailureState: false,
    deliveredAt: null,
    errorCategory: null,
    failedAt: null,
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    process.env.RESEND_API_KEY = "test-key";
    vi.mocked(recordDeliveryOutcome).mockClear();
    // Every call to the provider — all MAX_ATTEMPTS retries, plus the
    // operator-alert email — fails. This is the "forced failure" the ticket
    // asks for. mockImplementation (not mockResolvedValue) — a Response
    // body can only be read once, and sendLeadEmail calls .text() on it, so
    // reusing one instance across all 4 calls made every attempt after the
    // first throw an unrelated "body already read" error instead of the
    // intended 500, masking the real failure category (ATS-E5a caught this).
    global.fetch = vi
      .fn()
      .mockImplementation(() =>
        Promise.resolve(new Response("simulated Resend outage", { status: 500 })),
      ) as unknown as typeof fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env.RESEND_API_KEY = originalKey;
  });

  it("(a)/(b) records a final failed delivery state on the already-durable lead, not a lost/silent one", async () => {
    const { deliverLead } = await import("@/lib/lead-delivery");
    await deliverLead(lead);

    expect(recordDeliveryOutcome).toHaveBeenCalledWith(
      lead.id,
      expect.objectContaining({ deliveryStatus: "failed", finalFailureState: true }),
    );
  });

  it("ATS-E5a: categorizes a provider 5xx as 'provider_outage', never the raw response body", async () => {
    const { deliverLead } = await import("@/lib/lead-delivery");
    await deliverLead(lead);

    expect(recordDeliveryOutcome).toHaveBeenCalledWith(
      lead.id,
      expect.objectContaining({ errorCategory: "provider_outage" }),
    );
    const call = vi
      .mocked(recordDeliveryOutcome)
      .mock.calls.find(([, update]) => update.deliveryStatus === "failed");
    expect(call?.[1].errorCategory).not.toContain("simulated Resend outage");
  });

  it("(c) never marks the lead 'delivered' when every attempt fails", async () => {
    const { deliverLead } = await import("@/lib/lead-delivery");
    await deliverLead(lead);

    const deliveredCalls = vi
      .mocked(recordDeliveryOutcome)
      .mock.calls.filter(([, update]) => update.deliveryStatus === "delivered");
    expect(deliveredCalls).toHaveLength(0);
  });

  it("retries before giving up, then alerts operators referencing only the leadId", async () => {
    const { deliverLead } = await import("@/lib/lead-delivery");
    await deliverLead(lead);

    const fetchMock = vi.mocked(global.fetch);
    // 3 delivery attempts + 1 operator-alert call.
    expect(fetchMock).toHaveBeenCalledTimes(4);

    const alertCall = fetchMock.mock.calls.at(-1);
    const alertBody = JSON.parse((alertCall?.[1]?.body as string) ?? "{}");
    expect(alertBody.text).toContain(lead.id);
    // The whole point of 5.6: no name/phone/etc. in the alert.
    expect(alertBody.text).not.toContain(lead.fields.name);
    expect(alertBody.text).not.toContain(lead.fields.phone);
  }, 10000);
});
