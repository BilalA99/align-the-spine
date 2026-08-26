import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { runDeliveryWorker } from "./worker";

const {
  rpcMock,
  fromMock,
  sheetsFetchMock,
  sendResendEmailMock,
  getLeadEmailConfigMock,
  includeSensitiveMock,
} = vi.hoisted(() => ({
  rpcMock: vi.fn(),
  fromMock: vi.fn(),
  sheetsFetchMock: vi.fn(),
  sendResendEmailMock: vi.fn(),
  getLeadEmailConfigMock: vi.fn(),
  includeSensitiveMock: vi.fn(),
}));

vi.mock("./supabase", () => ({
  getServiceSupabase: () => ({ rpc: rpcMock, from: fromMock }),
}));

vi.mock("./env", () => ({
  getLeadEmailConfig: getLeadEmailConfigMock,
  includeSensitiveInEmail: includeSensitiveMock,
}));

vi.mock("./deliver", () => {
  class ResendSendError extends Error {
    permanent: boolean;
    status?: number;
    constructor(message: string, permanent: boolean, status?: number) {
      super(message);
      this.permanent = permanent;
      this.status = status;
    }
  }
  return {
    ResendSendError,
    sanitizeError: (value: string) => value,
    sendResendEmail: sendResendEmailMock,
  };
});

vi.mock("./email/office-notification", () => ({
  renderOfficeNotification: () => ({ subject: "office", html: "<p>office</p>", text: "office" }),
}));

vi.mock("./email/patient-acknowledgment", () => ({
  renderPatientAcknowledgment: () => ({
    subject: "patient",
    html: "<p>patient</p>",
    text: "patient",
  }),
}));

const lead = {
  id: "lead-1",
  submission_id: "11111111-1111-4111-8111-111111111111",
  created_at: "2026-08-26T12:00:00.000Z",
  updated_at: "2026-08-26T12:00:00.000Z",
  form_variant: "carAccident",
  form_version: 1,
  priority: "high" as const,
  first_name: "Jane",
  last_name: "Doe",
  full_name: null,
  email: "jane@example.com",
  phone: "9545550100",
  zip: "33441",
  best_time: "morning",
  reason: "accident",
  car_accident: "yes",
  raw_fields: {},
  attribution: {
    gclid: "gclid-1",
    gbraid: "gbraid-1",
    wbraid: "wbraid-1",
    utm_source: "google",
    utm_medium: "cpc",
    utm_campaign: "accident",
    utm_term: "chiropractor",
    utm_content: "ad-1",
  },
  source_path: "/car-accident-chiropractor",
  sensitive_payload: null,
  sensitive_present: false,
  status: "new",
};

function queue(rows: unknown[]) {
  rpcMock.mockImplementation(async (name: string) => {
    if (name === "claim_lead_deliveries") return { data: rows, error: null };
    if (name === "complete_lead_delivery") return { data: {}, error: null };
    throw new Error("unexpected rpc " + name);
  });
  fromMock.mockReturnValue({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: lead, error: null }),
      }),
    }),
  });
}

describe("delivery worker first-party regression contract", () => {
  beforeEach(() => {
    rpcMock.mockReset();
    fromMock.mockReset();
    sheetsFetchMock.mockReset();
    sendResendEmailMock.mockReset();
    getLeadEmailConfigMock.mockReturnValue({
      from: "Align <appointments@example.com>",
      replyTo: "appointments@example.com",
      notificationTo: "office@example.com",
      notificationCc: [],
    });
    includeSensitiveMock.mockReturnValue(false);
    sendResendEmailMock.mockResolvedValue({ externalId: "resend-1" });
    vi.stubGlobal("fetch", sheetsFetchMock);
    process.env.LEAD_GOOGLE_SHEETS_WEBHOOK_URL = "https://sheets.example/webhook";
  });

  afterEach(() => {
    delete process.env.LEAD_GOOGLE_SHEETS_WEBHOOK_URL;
    vi.unstubAllGlobals();
  });

  it("sends the unchanged complete Sheets CRM payload and completes asynchronously", async () => {
    queue([
      {
        id: "sheets-outbox",
        lead_id: "lead-1",
        submission_id: lead.submission_id,
        destination: "google_sheets",
        delivery_purpose: "google_sheets",
        idempotency_key: "ats/sheets/sheets-outbox",
      },
    ]);
    sheetsFetchMock.mockResolvedValue(new Response("ok", { status: 200 }));

    const summary = await runDeliveryWorker({ maxJobs: 5, workerId: "test" });
    expect(summary).toEqual({ claimed: 1, sent: 1, failed: 0 });
    expect(sheetsFetchMock).toHaveBeenCalledWith(
      "https://sheets.example/webhook",
      expect.objectContaining({ method: "POST" }),
    );
    const body = JSON.parse(sheetsFetchMock.mock.calls[0][1].body as string);
    expect(body).toEqual({
      submission_id: lead.submission_id,
      created_at: lead.created_at,
      form: "carAccident",
      version: 1,
      priority: "high",
      name: "Jane Doe",
      phone: lead.phone,
      email: lead.email,
      zip: lead.zip,
      reason: "accident",
      car_accident: "yes",
      source_path: lead.source_path,
    });
    expect(body).not.toHaveProperty("gclid");
    expect(rpcMock).toHaveBeenLastCalledWith(
      "complete_lead_delivery",
      expect.objectContaining({
        p_outbox_id: "sheets-outbox",
        p_success: true,
        p_external_id: null,
      }),
    );
  });

  it("keeps office and patient acknowledgments on their existing Resend paths and keys", async () => {
    queue([
      {
        id: "office-outbox",
        lead_id: "lead-1",
        submission_id: lead.submission_id,
        destination: "resend_email",
        delivery_purpose: "office_notification",
        idempotency_key: "ats/office-lead/office-outbox",
      },
      {
        id: "patient-outbox",
        lead_id: "lead-1",
        submission_id: lead.submission_id,
        destination: "resend_email",
        delivery_purpose: "patient_acknowledgment",
        idempotency_key: "ats/patient-ack/patient-outbox",
      },
    ]);

    const summary = await runDeliveryWorker();
    expect(summary).toEqual({ claimed: 2, sent: 2, failed: 0 });
    expect(sendResendEmailMock).toHaveBeenCalledTimes(2);
    expect(sendResendEmailMock.mock.calls.map(([input]) => input.idempotencyKey)).toEqual([
      "ats/office-lead/office-outbox",
      "ats/patient-ack/patient-outbox",
    ]);
    expect(sendResendEmailMock.mock.calls[0][0].to).toBe("office@example.com");
    expect(sendResendEmailMock.mock.calls[1][0].to).toBe("jane@example.com");
  });

  it("marks a Sheets network failure transient so the SQL outbox retry/backoff applies", async () => {
    queue([
      {
        id: "sheets-retry",
        lead_id: "lead-1",
        submission_id: lead.submission_id,
        destination: "google_sheets",
        delivery_purpose: "google_sheets",
        idempotency_key: "ats/sheets/sheets-retry",
      },
    ]);
    sheetsFetchMock.mockRejectedValue(new Error("network down"));

    const summary = await runDeliveryWorker();
    expect(summary).toEqual({ claimed: 1, sent: 0, failed: 1 });
    expect(rpcMock).toHaveBeenLastCalledWith(
      "complete_lead_delivery",
      expect.objectContaining({
        p_outbox_id: "sheets-retry",
        p_success: false,
        p_permanent: false,
      }),
    );
  });
});
