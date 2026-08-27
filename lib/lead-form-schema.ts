import { z } from "zod";

/** Shared (client + server) LeadForm field config and validation. Kept free of
 * "use client" so the /api/lead route can enforce the same schema server-side. */

export type LeadFieldType = "text" | "tel" | "email" | "zip" | "date" | "select" | "textarea";

export interface LeadFieldOption {
  label: string;
  value: string;
}

export interface LeadFieldConfig {
  /** Key in the submitted values object. */
  name: string;
  label: string;
  /** Defaults to "text". "zip" renders a numeric text input with ZIP validation. */
  type?: LeadFieldType;
  /** Defaults to true. */
  required?: boolean;
  /** Half-width fields pair up side by side in the two-column grid. */
  half?: boolean;
  /** Options for `type: "select"`. */
  options?: LeadFieldOption[];
  placeholder?: string;
  autoComplete?: string;
}

const ZIP_PATTERN = /^\d{5}(-\d{4})?$/;
// The browser's native <input type="date"> always submits this exact
// YYYY-MM-DD shape (ISO 8601, zero-padded) regardless of the visitor's
// locale/display format — this just confirms nothing bypassed that (a
// direct API request, a browser that mishandles the input type, etc.).
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Max raw-input length per field type — a hard ceiling independent of
 * format validation, so a field can't be used to submit an arbitrarily long
 * string (junk data, a crude DoS attempt against the email pipeline, etc.).
 * "text"/"select" here means the fallback for any type not listed below. */
const MAX_LENGTHS: Partial<Record<LeadFieldType, number>> = {
  tel: 20,
  email: 254, // RFC 5321 practical max
  zip: 10,
  date: 10, // YYYY-MM-DD
  textarea: 2000,
};
const DEFAULT_MAX_LENGTH = 100;

/** Strips everything but digits and requires a real 10-digit US number (or
 * 11 with a leading country code 1) — rejects short numbers, padded/too-long
 * numbers, and letters, rather than just checking punctuation shape the way
 * a loose character-class regex would. */
function isValidUsPhone(raw: string): boolean {
  const digits = raw.replace(/\D/g, "");
  return digits.length === 10 || (digits.length === 11 && digits.startsWith("1"));
}

/** An accident date can't be in the future — compares calendar dates only
 * (no time-of-day/timezone edge cases), so "today" always passes regardless
 * of the visitor's or server's clock time. */
function isNotFutureDate(raw: string): boolean {
  const today = new Date();
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return raw <= todayIso;
}

/** Validation messages, so a Spanish form reports errors in Spanish.
 *
 * Only the wording is localized — every rule (formats, length caps, the
 * not-in-the-future accident date) is identical in both languages, so a
 * Spanish submission can never pass validation an English one would fail.
 * /api/lead re-validates server-side with the English defaults; those
 * messages aren't shown to the visitor, they're for the server's own
 * rejection path. */
export interface LeadFormMessages {
  required: string;
  tooLong: string;
  email: string;
  zip: string;
  date: string;
  phone: string;
  futureDate: string;
}

export const enLeadFormMessages: LeadFormMessages = {
  required: "Required",
  tooLong: "Too long",
  email: "Enter a valid email",
  zip: "Enter a valid ZIP code",
  date: "Enter a valid date",
  phone: "Enter a valid 10-digit phone number",
  futureDate: "Date can't be in the future",
};

export const esLeadFormMessages: LeadFormMessages = {
  required: "Campo obligatorio",
  tooLong: "Demasiado largo",
  email: "Ingrese un correo electrónico válido",
  zip: "Ingrese un código postal válido",
  date: "Ingrese una fecha válida",
  phone: "Ingrese un número de teléfono válido de 10 dígitos",
  futureDate: "La fecha no puede ser futura",
};

/** Each variant's schema is derived from its fields config: every field is
 * trimmed and length-capped regardless of type; required fields must be
 * non-empty after trimming; tel/email/zip enforce their format whenever
 * there's a value (always for required fields, only when non-empty for
 * optional ones). */
export function buildLeadFormSchema(
  fields: LeadFieldConfig[],
  messages: LeadFormMessages = enLeadFormMessages,
) {
  const shape: Record<string, z.ZodType<string>> = {};

  for (const field of fields) {
    const type = field.type ?? "text";
    const required = field.required !== false;
    const maxLength = MAX_LENGTHS[type] ?? DEFAULT_MAX_LENGTH;

    let schema = z.string().trim().max(maxLength, messages.tooLong);
    if (required) schema = schema.min(1, messages.required);
    if (type === "email") schema = schema.email(messages.email);
    else if (type === "zip") schema = schema.regex(ZIP_PATTERN, messages.zip);
    else if (type === "date") schema = schema.regex(DATE_PATTERN, messages.date);

    let fieldSchema: z.ZodType<string> = schema;
    if (type === "tel") {
      fieldSchema = schema.refine(isValidUsPhone, messages.phone);
    } else if (type === "date") {
      fieldSchema = schema.refine(isNotFutureDate, messages.futureDate);
    }

    shape[field.name] = required ? fieldSchema : z.literal("").or(fieldSchema);
  }

  return z.object(shape).strict();
}
