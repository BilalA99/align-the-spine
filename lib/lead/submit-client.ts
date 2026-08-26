import { getStoredAttribution } from "@/lib/attribution";
import { isSubmissionId } from "@/lib/lead/submission-id";

export interface LeadSubmitInput {
  variant: string;
  values: Record<string, string>;
  submissionId: string;
  website?: string;
}

export interface LeadSubmitSuccess {
  ok: true;
  submissionId: string;
}

/** POSTs a lead and accepts success only when the server proves durable storage. */
export async function submitLead(input: LeadSubmitInput): Promise<LeadSubmitSuccess> {
  const response = await fetch("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      variant: input.variant,
      values: input.values,
      submissionId: input.submissionId,
      website: input.website ?? "",
      attribution: getStoredAttribution(),
    }),
  });

  if (!response.ok) {
    throw new Error(`Lead submission failed with status ${response.status}`);
  }

  let result: unknown;
  try {
    result = await response.json();
  } catch {
    throw new Error("Lead submission returned an invalid response");
  }

  if (
    typeof result !== "object" ||
    result === null ||
    (result as { ok?: unknown }).ok !== true ||
    !isSubmissionId((result as { submissionId?: unknown }).submissionId)
  ) {
    throw new Error("Lead submission was not durably confirmed");
  }

  return result as LeadSubmitSuccess;
}
