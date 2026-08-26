import { createHash } from "node:crypto";

import type { Attribution } from "@/lib/attribution";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

/** ATS-E5: durable first-party lead persistence. A lead exists here before
 * app/api/lead/route.ts ever returns success — notification delivery
 * (lib/lead-delivery.ts) is layered on top afterward and is never the
 * source of truth for whether a lead was captured. */

export type DeliveryStatus = "pending" | "delivered" | "failed";

export interface LeadRecord {
  id: string;
  idempotencyKey: string;
  variant: string;
  fields: Record<string, string>;
  attribution: Attribution;
  priority: string;
  deliveryStatus: DeliveryStatus;
  providerResponseId: string | null;
  providerResponseBody: string | null;
  retryCount: number;
  finalFailureState: boolean;
  deliveredAt: string | null;
  /** ATS-E5a: a safe category string (e.g. "provider_error",
   * "missing_api_key") — never a raw error body/response text, which is
   * exactly how PII leaks back in through a "debugging" side door. */
  errorCategory: string | null;
  failedAt: string | null;
  createdAt: string;
}

export interface PersistLeadInput {
  variant: string;
  values: Record<string, string>;
  attribution: Attribution;
  priority: string;
}

export interface PersistLeadResult {
  lead: LeadRecord;
  /** True when this submission's idempotency key already existed — the
   * returned `lead` is the ORIGINAL record (its original attribution is
   * preserved, 5.7), not a new row. */
  isDuplicate: boolean;
}

/** 10-minute buckets: two submissions with identical variant+values within
 * the same window dedupe as one lead; the same content submitted again
 * later (a legitimate repeat booking, not a double-click/retry) gets its
 * own new record instead of being dropped forever. */
const DEDUPE_WINDOW_MS = 10 * 60 * 1000;

/** Deterministic per the submission's own content + time bucket — NOT
 * random — so a client retry (network blip, double-click) of the exact same
 * submission always lands on the exact same key and safely no-ops against
 * the table's UNIQUE constraint, rather than depending on the client to
 * remember and resend an id from its first attempt. */
export function buildIdempotencyKey(variant: string, values: Record<string, string>): string {
  const sortedEntries = Object.entries(values)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  const bucket = Math.floor(Date.now() / DEDUPE_WINDOW_MS);
  return createHash("sha256").update(`${variant}|${sortedEntries}|${bucket}`).digest("hex");
}

interface LeadRow {
  id: string;
  idempotency_key: string;
  variant: string;
  fields: Record<string, string>;
  attribution: Attribution;
  priority: string;
  delivery_status: DeliveryStatus;
  provider_response_id: string | null;
  provider_response_body: string | null;
  retry_count: number;
  final_failure_state: boolean;
  delivered_at: string | null;
  error_category: string | null;
  failed_at: string | null;
  created_at: string;
}

function rowToRecord(row: LeadRow): LeadRecord {
  return {
    id: row.id,
    idempotencyKey: row.idempotency_key,
    variant: row.variant,
    fields: row.fields,
    attribution: row.attribution,
    priority: row.priority,
    deliveryStatus: row.delivery_status,
    providerResponseId: row.provider_response_id,
    providerResponseBody: row.provider_response_body,
    retryCount: row.retry_count,
    finalFailureState: row.final_failure_state,
    deliveredAt: row.delivered_at,
    errorCategory: row.error_category,
    failedAt: row.failed_at,
    createdAt: row.created_at,
  };
}

/** Persists a lead durably. Resolves once the row is confirmed written (or
 * confirmed already present via idempotency) — callers must not report
 * success to the visitor before this resolves, and must treat a rejection
 * as "the lead was not captured," not fall back to pretending it was. */
export async function persistLead(input: PersistLeadInput): Promise<PersistLeadResult> {
  const idempotencyKey = buildIdempotencyKey(input.variant, input.values);
  const supabase = getSupabaseAdmin();

  const { data: inserted, error: insertError } = await supabase
    .from("leads")
    .insert({
      idempotency_key: idempotencyKey,
      variant: input.variant,
      fields: input.values,
      attribution: input.attribution,
      priority: input.priority,
    })
    .select()
    .maybeSingle();

  if (!insertError && inserted) {
    return { lead: rowToRecord(inserted as LeadRow), isDuplicate: false };
  }

  // 23505 = unique_violation (Postgres) — the only error we treat as
  // "already persisted" rather than "persistence failed". Anything else
  // (network error, RLS misconfiguration, connection failure) propagates so
  // the caller correctly refuses to report success.
  const isConflict =
    insertError !== null &&
    typeof insertError === "object" &&
    "code" in insertError &&
    insertError.code === "23505";
  if (!isConflict) {
    throw new Error(
      `lib/lead-store.ts: persist failed — ${insertError?.message ?? "no row returned"}`,
    );
  }

  const { data: existing, error: selectError } = await supabase
    .from("leads")
    .select()
    .eq("idempotency_key", idempotencyKey)
    .single();
  if (selectError || !existing) {
    throw new Error(
      `lib/lead-store.ts: duplicate detected but original row not found — ${selectError?.message}`,
    );
  }

  return { lead: rowToRecord(existing as LeadRow), isDuplicate: true };
}

export interface DeliveryUpdate {
  deliveryStatus: DeliveryStatus;
  providerResponseId?: string | null;
  providerResponseBody?: string | null;
  retryCount: number;
  finalFailureState: boolean;
  /** ATS-E5a: safe category only (see LeadRecord.errorCategory's doc
   * comment) — set on final failure, left undefined on success. */
  errorCategory?: string | null;
}

/** Records delivery outcome on an already-durable lead (5.5) — called only
 * from lib/lead-delivery.ts, after persistLead has already resolved. */
export async function recordDeliveryOutcome(leadId: string, update: DeliveryUpdate): Promise<void> {
  const supabase = getSupabaseAdmin();
  const now = new Date().toISOString();
  const { error } = await supabase
    .from("leads")
    .update({
      delivery_status: update.deliveryStatus,
      provider_response_id: update.providerResponseId ?? null,
      provider_response_body: update.providerResponseBody ?? null,
      retry_count: update.retryCount,
      final_failure_state: update.finalFailureState,
      delivered_at: update.deliveryStatus === "delivered" ? now : null,
      error_category: update.deliveryStatus === "failed" ? (update.errorCategory ?? null) : null,
      failed_at: update.deliveryStatus === "failed" ? now : null,
    })
    .eq("id", leadId);

  if (error) {
    // The lead itself is already durably persisted regardless of this
    // write's outcome — losing a delivery-status update is a visibility gap
    // for operators, not a lost lead, so this logs rather than throwing.
    console.error(`[lead-store] failed to record delivery outcome for ${leadId}:`, error.message);
  }
}

/** ATS-E5a Step 5: leads whose after() delivery attempt never ran or never
 * completed — a platform-level miss (function crash/timeout), not a normal
 * delivery failure (those already resolve to 'failed' via
 * recordDeliveryOutcome and are never picked up here). `olderThanMs` avoids
 * racing a lead whose after() callback is still legitimately in flight.
 * Consumed by app/api/cron/retry-leads/route.ts. */
export async function findStuckPendingLeads(
  olderThanMs: number,
  limit = 20,
): Promise<LeadRecord[]> {
  const supabase = getSupabaseAdmin();
  const cutoff = new Date(Date.now() - olderThanMs).toISOString();
  const { data, error } = await supabase
    .from("leads")
    .select()
    .eq("delivery_status", "pending")
    .lt("created_at", cutoff)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    throw new Error(`lib/lead-store.ts: failed to query stuck pending leads — ${error.message}`);
  }
  return (data as LeadRow[]).map(rowToRecord);
}

/** ATS-E5a Step 6 (reconciliation): count of leads still pending well past
 * the retry cron's own cutoff — non-zero means either the cron isn't
 * running or Supabase itself is unreachable. Used for the escalation alert
 * distinct from findStuckPendingLeads()'s per-lead retry (this is "is the
 * safety net itself broken", not "retry this one lead"). */
export async function countStuckPendingLeads(olderThanMs: number): Promise<number> {
  const supabase = getSupabaseAdmin();
  const cutoff = new Date(Date.now() - olderThanMs).toISOString();
  const { count, error } = await supabase
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("delivery_status", "pending")
    .lt("created_at", cutoff);

  if (error) {
    throw new Error(`lib/lead-store.ts: failed to count stuck pending leads — ${error.message}`);
  }
  return count ?? 0;
}
