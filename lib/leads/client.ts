"use client";

import { getStoredAttribution } from "@/lib/attribution";

import { LEAD_FORM_VERSION } from "./contracts";
import { isSubmissionId } from "./submission-id";
import { getTurnstileToken } from "./turnstile-client";

export interface LeadSubmitResult {
  /** The canonical technical submission UUID the server confirmed it durably
   * stored. Present only on a genuine lead — a direct honeypot POST answers
   * `{ ok: true }` with no ID, so callers can gate the conversion event on it
   * (see components/ui/lead-form.tsx → trackLeadSuccess). */
  submissionId?: string;
}

export async function submitLead(
  clientSubmissionId: string,
  formId: string,
  values: Record<string, string>,
  website = "",
): Promise<LeadSubmitResult> {
  // Fetched fresh per submit, after the honeypot short-circuit in every
  // caller (LeadForm/UnderlineForm/BookingForm) — a filled honeypot never
  // reaches here, so this never spends a token on an already-caught bot.
  // The one shared submission function every form on the site calls
  // through, so this is the single place the bot check needs to live.
  const turnstileToken = await getTurnstileToken();
  const response = await fetch("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clientSubmissionId,
      formId,
      formVersion: LEAD_FORM_VERSION,
      values,
      website,
      turnstileToken,
      attribution: getStoredAttribution(),
      sourcePagePath: window.location.pathname,
    }),
  });
  const result = (await response.json().catch(() => null)) as {
    ok?: boolean;
    submissionId?: unknown;
  } | null;
  if (!response.ok || !result?.ok) throw new Error("lead_submission_failed");
  // Only a durably-stored lead carries back a canonical submission ID; the
  // honeypot's fake-success 200 does not, so this stays undefined for it.
  return { submissionId: isSubmissionId(result.submissionId) ? result.submissionId : undefined };
}
