import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { alertOperatorsOfStuckPendingBacklog, deliverLead } from "@/lib/lead-delivery";
import { countStuckPendingLeads, findStuckPendingLeads } from "@/lib/lead-store";

vi.mock("@/lib/lead-store", () => ({
  findStuckPendingLeads: vi.fn(),
  countStuckPendingLeads: vi.fn(),
}));
vi.mock("@/lib/lead-delivery", () => ({
  deliverLead: vi.fn(),
  alertOperatorsOfStuckPendingBacklog: vi.fn(),
}));

function makeRequest(authHeader?: string): Request {
  return new Request("http://localhost/api/cron/retry-leads", {
    headers: authHeader ? { authorization: authHeader } : {},
  });
}

describe("GET /api/cron/retry-leads (ATS-E5a Step 5/6)", () => {
  const originalSecret = process.env.CRON_SECRET;

  beforeEach(() => {
    process.env.CRON_SECRET = "test-secret";
    vi.mocked(findStuckPendingLeads).mockReset().mockResolvedValue([]);
    vi.mocked(countStuckPendingLeads).mockReset().mockResolvedValue(0);
    vi.mocked(deliverLead).mockReset();
    vi.mocked(alertOperatorsOfStuckPendingBacklog).mockReset();
  });

  afterEach(() => {
    process.env.CRON_SECRET = originalSecret;
  });

  it("rejects a request with no bearer token", async () => {
    const { GET } = await import("@/app/api/cron/retry-leads/route");
    const response = await GET(makeRequest());
    expect(response.status).toBe(401);
    expect(findStuckPendingLeads).not.toHaveBeenCalled();
  });

  it("rejects a request with the wrong secret", async () => {
    const { GET } = await import("@/app/api/cron/retry-leads/route");
    const response = await GET(makeRequest("Bearer wrong-secret"));
    expect(response.status).toBe(401);
  });

  it("fails closed when CRON_SECRET itself isn't configured", async () => {
    delete process.env.CRON_SECRET;
    const { GET } = await import("@/app/api/cron/retry-leads/route");
    const response = await GET(makeRequest("Bearer anything"));
    expect(response.status).toBe(401);
  });

  it("retries every stuck-pending lead found, in order", async () => {
    const leads = [{ id: "lead-1" }, { id: "lead-2" }] as never;
    vi.mocked(findStuckPendingLeads).mockResolvedValue(leads);

    const { GET } = await import("@/app/api/cron/retry-leads/route");
    const response = await GET(makeRequest("Bearer test-secret"));
    const body = (await response.json()) as { ok: boolean; processed: number };

    expect(response.status).toBe(200);
    expect(body).toMatchObject({ ok: true, processed: 2 });
    expect(deliverLead).toHaveBeenCalledTimes(2);
  });

  it("escalates when leads are still stuck past the 30-minute reconciliation threshold", async () => {
    vi.mocked(countStuckPendingLeads).mockResolvedValue(3);

    const { GET } = await import("@/app/api/cron/retry-leads/route");
    await GET(makeRequest("Bearer test-secret"));

    expect(alertOperatorsOfStuckPendingBacklog).toHaveBeenCalledWith(3);
  });

  it("does NOT escalate when nothing is stuck past the threshold", async () => {
    vi.mocked(countStuckPendingLeads).mockResolvedValue(0);

    const { GET } = await import("@/app/api/cron/retry-leads/route");
    await GET(makeRequest("Bearer test-secret"));

    expect(alertOperatorsOfStuckPendingBacklog).not.toHaveBeenCalled();
  });
});
