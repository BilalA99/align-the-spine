import type { LeadPriority } from "./types";

/** Accident-specific forms remain useful first-party CRM triage signals. */
const HIGH_PRIORITY_VARIANTS = new Set(["carAccident", "accidentEval"]);

/**
 * Private operational classification. This value may be stored in the ATS CRM,
 * but it must never be added to GA4, Google Ads, GTM, or another outbound
 * analytics event.
 */
export function classifyLeadPriority(
  variant: string,
  values: Record<string, string> = {},
): LeadPriority {
  if (values.carAccident === "yes") return "high";
  if (values.reason === "accident") return "high";
  if (values.carAccident === "no") return "standard";
  if (HIGH_PRIORITY_VARIANTS.has(variant)) return "high";
  return "standard";
}
