import { leadFormVariants, type LeadFormVariant } from "@/content/lead-forms";

export const LEAD_FORM_VERSION = 1;
export const LEAD_CONSENT_VERSION = "web-lead-v1";
export const LEAD_CONSENT_WORDING =
  "By submitting this form, you agree that Align the Spine Chiropractic may contact you about your request. Do not include urgent or highly sensitive medical information.";

/** Spanish rendering of the SAME consent, recorded under the SAME
 * LEAD_CONSENT_VERSION — it is one consent shown in two languages, not a
 * second, weaker one. Keep the two strings semantically identical: if the
 * English wording changes, this must change with it and the version must be
 * bumped for both. A Spanish-speaking patient has to be agreeing to exactly
 * what an English-speaking one agrees to, and the stored version has to
 * identify that text. */
export const LEAD_CONSENT_WORDING_ES =
  "Al enviar este formulario, usted acepta que Align the Spine Chiropractic pueda comunicarse con usted sobre su solicitud. No incluya información médica urgente ni altamente sensible.";

export const SENSITIVE_FIELDS = new Set(["message", "accidentDate"]);

export function isLeadFormVariant(value: unknown): value is LeadFormVariant {
  return typeof value === "string" && value in leadFormVariants;
}

export function splitLeadFields(values: Record<string, string>) {
  const contactFields: Record<string, string> = {};
  const sensitiveFields: Record<string, string> = {};
  for (const [key, value] of Object.entries(values)) {
    if (SENSITIVE_FIELDS.has(key)) sensitiveFields[key] = value;
    else contactFields[key] = value;
  }
  return { contactFields, sensitiveFields };
}
