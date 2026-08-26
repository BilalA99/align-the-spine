import type { LeadFieldConfig } from "@/lib/lead-form-schema";

export interface LeadFormVariantConfig {
  /** Key the server uses to pick the validation schema in /api/lead. */
  variant: string;
  fields: LeadFieldConfig[];
  submitLabel: string;
}

const baseFields: LeadFieldConfig[] = [
  { name: "firstName", label: "First Name", half: true, autoComplete: "given-name" },
  { name: "lastName", label: "Last Name", half: true, autoComplete: "family-name" },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
];

const zipField: LeadFieldConfig = {
  name: "zip",
  label: "Zip Code",
  type: "zip",
  autoComplete: "postal-code",
};

/** Shared across every lead form on the site so a lead can always be
 * filtered/prioritized by whether it's accident-related, and so every form
 * captures the same core field set — lib/analytics.ts's classifyLeadPriority
 * reads this field first, ahead of any page/variant-based inference. Owner
 * direction 2026-08-19: required on every form, no exceptions, including
 * accidentEval (which also collects a specific accident date alongside it). */
const carAccidentField: LeadFieldConfig = {
  name: "carAccident",
  label: "Is this related to a car accident?",
  type: "select",
  placeholder: "Select one",
  options: [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ],
};

/** /car-accident-chiropractor-only — replaces carAccidentField there since
 * "is this related to a car accident?" is redundant on a page the visitor
 * only reached because it is one; the date narrows Florida's 14-day PIP
 * evaluation window instead, which is actually new information. Native
 * <input type="date"> enforces the format (no free-text parsing), and
 * lib/lead-form-schema.ts's isNotFutureDate refine rejects a date after
 * today server-side too. */
const accidentDateField: LeadFieldConfig = {
  name: "accidentDate",
  label: "Date of Accident",
  type: "date",
  autoComplete: "off",
};

/** ATS-030 variant presets. Every lead form on the site is one of these
 * configs spread into <LeadForm />:
 *
 *   <LeadForm heading="..." {...leadFormVariants.heroEval} />
 */
export const leadFormVariants = {
  heroEval: {
    variant: "heroEval",
    fields: [...baseFields, carAccidentField],
    submitLabel: "Request a Chiropractic Appointment",
  },
  /** /car-accident-chiropractor hero form: First/Last/Phone/Email plus
   * BOTH accidentDateField (narrows Florida's 14-day PIP window — see that
   * field's own doc comment) and carAccidentField (uniform across every
   * form site-wide, owner direction 2026-08-19). */
  accidentEval: {
    variant: "accidentEval",
    fields: [...baseFields, accidentDateField, carAccidentField],
    submitLabel: "Schedule My Evaluation",
  },
  /** /contact-us hero form. Owner direction 2026-08-19: same First/Last
   * split as every other form (previously a single Name field, matching
   * the original Figma hero card) plus Phone, Email, and a Message
   * textarea. */
  contactUs: {
    variant: "contactUs",
    fields: [
      ...baseFields,
      carAccidentField,
      { name: "message", label: "Message", type: "textarea" },
    ],
    submitLabel: "Send Message",
  },
  // ATS-E3 (3.1): no claim-number field — the ticket forbids collecting
  // it on this form (broad accident qualifier only, no case-detail
  // fields).
  carAccident: {
    variant: "carAccident",
    fields: [...baseFields, carAccidentField],
    submitLabel: "Request My Evaluation",
  },
  /** /reviews hero form — same fields as heroEval, own variant key purely
   * so leads from this placement are distinguishable in the /api/lead log
   * and any future funnel analysis, same reasoning as carAccident
   * duplicating heroEval's fields below. */
  reviewsEval: {
    variant: "reviewsEval",
    fields: [...baseFields, carAccidentField],
    submitLabel: "Request a Chiropractic Appointment",
  },
  contact: {
    variant: "contact",
    fields: [
      { name: "firstName", label: "First Name", half: true, autoComplete: "given-name" },
      { name: "lastName", label: "Last Name", half: true, autoComplete: "family-name" },
      { name: "email", label: "Email", type: "email", autoComplete: "email" },
      { name: "phone", label: "Phone", type: "tel", half: true, autoComplete: "tel" },
      { ...zipField, half: true },
      carAccidentField,
      { name: "bestTime", label: "Best Time to Contact", required: false },
    ],
    submitLabel: "Contact Us",
  },
  /** ATS-110's original design omitted email (name/phone/zip only). Owner
   * direction 2026-08-19: every form now collects the same core field set,
   * so email is included here too, alongside the zip this form still
   * uniquely needs for the home-visit-eligibility check itself. */
  eligibility: {
    variant: "eligibility",
    fields: [...baseFields, zipField, carAccidentField],
    submitLabel: "Check Eligibility",
  },
  /** Single-step /book form: first name, last name, email, phone, and the
   * same carAccidentField every other full form uses — no free-text
   * "reason" select, no two-step gating. */
  booking: {
    variant: "booking",
    fields: [...baseFields, carAccidentField],
    submitLabel: "Schedule My Evaluation",
  },
} satisfies Record<string, LeadFormVariantConfig>;

export type LeadFormVariant = keyof typeof leadFormVariants;
