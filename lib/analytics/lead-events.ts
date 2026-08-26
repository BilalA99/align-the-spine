import { isSubmissionId } from "@/lib/leads/submission-id";

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

const trackedSubmissionIds = new Set<string>();

/**
 * Announces one durably stored lead to GTM. The technical UUID is the entire
 * contract: no form variant, intake answer, priority, or contact data belongs
 * in this event.
 */
export function trackLeadSuccess(submissionId: string): void {
  if (typeof window === "undefined" || !isSubmissionId(submissionId)) return;
  if (trackedSubmissionIds.has(submissionId)) return;

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    event: "ats_lead_success",
    submission_id: submissionId,
  });
  trackedSubmissionIds.add(submissionId);
}
