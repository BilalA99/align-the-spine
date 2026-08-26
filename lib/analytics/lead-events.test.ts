import { afterEach, describe, expect, it } from "vitest";

import { trackLeadSuccess } from "./lead-events";

describe("trackLeadSuccess", () => {
  afterEach(() => {
    delete (globalThis as { window?: unknown }).window;
  });

  it("pushes exactly one generic event for a canonical submission UUID", () => {
    const dataLayer: unknown[] = [];
    (globalThis as { window?: unknown }).window = { dataLayer };
    const id = "11111111-1111-4111-8111-111111111111";

    trackLeadSuccess(id);
    trackLeadSuccess(id);

    expect(dataLayer).toEqual([{ event: "ats_lead_success", submission_id: id }]);
  });

  it("contains no priority, form, intake, or contact fields", () => {
    const dataLayer: unknown[] = [];
    (globalThis as { window?: unknown }).window = { dataLayer };
    trackLeadSuccess("22222222-2222-4222-8222-222222222222");

    const serialized = JSON.stringify(dataLayer);
    for (const prohibited of [
      "lead_priority",
      "lead_form_variant",
      "carAccident",
      "reason",
      "email",
      "phone",
      "values",
      "medical",
    ]) {
      expect(serialized).not.toContain(prohibited);
    }
  });

  it("does not track an invalid or missing server identifier", () => {
    const dataLayer: unknown[] = [];
    (globalThis as { window?: unknown }).window = { dataLayer };
    trackLeadSuccess("");
    trackLeadSuccess("not-a-uuid");
    expect(dataLayer).toEqual([]);
  });
});
