/**
 * Durable, transactional lead ingestion — the server-side entry point /api/lead
 * calls before it reports success. Maps validated form values onto the
 * ingest_lead RPC (which writes the lead + consent receipt + delivery outbox
 * rows atomically), splitting the sensitive fields out for encryption so they
 * never reach the DB (or logs) in plaintext.
 */
import { leadFormVariants, type LeadFormVariant } from "@/content/lead-forms";
import type { Attribution } from "@/lib/attribution";
import { classifyLeadPriority } from "@/lib/lead/priority";

import { encryptSensitive, hashIp } from "./crypto";
import { isEncryptionConfigured } from "./env";
import { getServiceSupabase } from "./supabase";

/** Fields that must never be stored or emailed in plaintext. Kept here as the
 * single source of truth the ingestion, worker, and tests all reference. */
export const SENSITIVE_FIELD_NAMES = ["message", "accidentDate"] as const;

/** Bumped whenever the privacy/consent disclosure copy shown near the submit
 * button changes, so each consent receipt records exactly what the person saw. */
export const CONSENT_DISCLOSURE_VERSION = "2026-08-18";

export interface IngestContext {
  /** Raw client IP — hashed here (keyed), never stored raw. */
  ip?: string | null;
  userAgent?: string | null;
  /** Page path WITHOUT query string. */
  sourcePath?: string | null;
  /** When true, also enqueue a Google Sheets mirror delivery. */
  googleSheetsEnabled?: boolean;
}

export interface IngestResult {
  leadId: string;
  isNew: boolean;
  /** Whether a patient acknowledgment delivery was enqueued. */
  patientAckQueued: boolean;
}

function variantVersion(variant: LeadFormVariant): number {
  const config = leadFormVariants[variant] as { version?: number };
  return config.version ?? 1;
}

/** A non-empty email value is already format-validated by buildLeadFormSchema
 * (email-typed fields carry a .email() check), so presence implies validity. */
function hasValidEmail(values: Record<string, string>): boolean {
  return typeof values.email === "string" && values.email.trim() !== "";
}

export async function ingestLead(
  submissionId: string,
  variant: LeadFormVariant,
  values: Record<string, string>,
  attribution: Attribution,
  ctx: IngestContext = {},
): Promise<IngestResult> {
  const priority = classifyLeadPriority(variant, values);
  const patientAck = hasValidEmail(values);

  // Split sensitive fields out of the non-sensitive record.
  const rawFields: Record<string, string> = {};
  const sensitive: Record<string, string> = {};
  for (const [key, value] of Object.entries(values)) {
    if ((SENSITIVE_FIELD_NAMES as readonly string[]).includes(key)) {
      if (value) sensitive[key] = value;
    } else if (value) {
      rawFields[key] = value;
    }
  }

  // Encrypt sensitive fields, or — if no key is configured — drop them rather
  // than ever persisting plaintext. The lead (contact info) is still stored.
  let sensitivePayload: string | null = null;
  let sensitivePresent = false;
  if (Object.keys(sensitive).length > 0) {
    if (isEncryptionConfigured()) {
      sensitivePayload = encryptSensitive(sensitive);
      sensitivePresent = true;
    } else {
      console.warn(
        "[lead] sensitive fields present but LEAD_ENCRYPTION_KEY unset — dropping sensitive payload to avoid storing plaintext.",
      );
    }
  }

  const supabase = getServiceSupabase();
  const { data, error } = await supabase.rpc("ingest_lead", {
    p_submission_id: submissionId,
    p_form_variant: variant,
    p_form_version: variantVersion(variant),
    p_priority: priority,
    p_first_name: values.firstName ?? null,
    p_last_name: values.lastName ?? null,
    p_full_name: values.name ?? null,
    p_email: values.email ?? null,
    p_phone: values.phone ?? null,
    p_zip: values.zip ?? null,
    p_best_time: values.bestTime ?? null,
    p_reason: values.reason ?? null,
    p_car_accident: values.carAccident ?? null,
    p_raw_fields: rawFields,
    p_attribution: attribution,
    p_source_path: ctx.sourcePath ?? null,
    p_sensitive_payload: sensitivePayload,
    p_sensitive_present: sensitivePresent,
    p_disclosure_version: CONSENT_DISCLOSURE_VERSION,
    p_ip_hash: hashIp(ctx.ip),
    p_user_agent: ctx.userAgent ?? null,
    p_create_patient_ack: patientAck,
    p_create_google_sheets: Boolean(ctx.googleSheetsEnabled),
  });

  if (error) {
    // Surface a sanitized error; the route turns this into a 503 so the client
    // is told to retry rather than shown a false success.
    throw new Error(`lead ingestion failed: ${error.message}`);
  }

  const result = (data ?? {}) as { lead_id?: string; is_new?: boolean };
  if (!result.lead_id) {
    throw new Error("lead ingestion returned no lead id");
  }

  return {
    leadId: result.lead_id,
    isNew: result.is_new ?? false,
    patientAckQueued: patientAck,
  };
}
