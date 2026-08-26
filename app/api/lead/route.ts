import { after, NextResponse } from "next/server";

import { leadFormVariants, type LeadFormVariant } from "@/content/lead-forms";
import { resolveSiteUrl } from "@/content/site";
import { sanitizeAttribution } from "@/lib/attribution";
import { buildLeadFormSchema } from "@/lib/lead-form-schema";
import { isSupabaseConfigured } from "@/lib/lead/env";
import { ingestLead } from "@/lib/lead/ingest";
import { isSubmissionId } from "@/lib/lead/submission-id";
import { runDeliveryWorker } from "@/lib/lead/worker";

/** Hard ceiling on the raw request body. Individual fields are already
 * length-capped by the zod schema; this stops an oversized blob from being
 * parsed/stored at all. */
const MAX_BODY_BYTES = 25_000;

interface LeadPayload {
  variant?: unknown;
  values?: unknown;
  /** Stable per-submission idempotency key (client-generated). */
  submissionId?: unknown;
  /** Honeypot field — humans never fill it. */
  website?: unknown;
  /** gclid/utm_* captured client-side (lib/attribution.ts). */
  attribution?: unknown;
}

function isVariant(value: unknown): value is LeadFormVariant {
  return typeof value === "string" && value in leadFormVariants;
}

/** Same-origin guard: a cross-site POST (with a mismatched Origin) is rejected
 * before any storage/email work. A missing Origin (some same-origin clients,
 * server-to-server) is allowed — we only reject a present, mismatched one. */
function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const allowedHosts = new Set<string>();
  try {
    allowedHosts.add(new URL(resolveSiteUrl()).host);
  } catch {
    /* resolveSiteUrl throws only in prod with no SITE_URL — handled elsewhere */
  }
  const host = request.headers.get("host");
  if (host) allowedHosts.add(host);
  try {
    return allowedHosts.has(new URL(origin).host);
  } catch {
    return false;
  }
}

/** Path only, no query string — attribution/PII in the query never reaches the
 * CRM's source_path. */
function sourcePathFromReferer(request: Request): string | null {
  const referer = request.headers.get("referer");
  if (!referer) return null;
  try {
    return new URL(referer).pathname;
  } catch {
    return null;
  }
}

/** First hop of X-Forwarded-For (the client), used only to compute a keyed hash
 * for the consent receipt — the raw value is never stored. */
function clientIp(request: Request): string | null {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || null;
  return request.headers.get("x-real-ip");
}

/** Receives LeadForm submissions. Re-validates with the same zod schema the
 * client used, enforces honeypot + origin + size server-side, then DURABLY
 * ingests the lead (lead + consent + delivery outbox, one transaction) before
 * reporting success. Email is never sent synchronously here — the delivery
 * worker drains the outbox after the response (and again on cron), so a slow or
 * down email provider can never delay the visitor or lose a lead. */
export async function POST(request: Request) {
  // Size guard (declared length first, then actual parsed size).
  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (declaredLength > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "Payload too large" }, { status: 413 });
  }

  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ ok: false, error: "Forbidden origin" }, { status: 403 });
  }

  const rawBody = await request.text();
  if (rawBody.length > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "Payload too large" }, { status: 413 });
  }

  let payload: LeadPayload;
  try {
    payload = JSON.parse(rawBody) as LeadPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Spam guard: pretend success so bots learn nothing — and create no lead/email.
  if (typeof payload.website === "string" && payload.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  if (!isVariant(payload.variant)) {
    return NextResponse.json({ ok: false, error: "Unknown form variant" }, { status: 400 });
  }

  const schema = buildLeadFormSchema(leadFormVariants[payload.variant].fields);
  const parsed = schema.safeParse(payload.values);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", issues: formatIssues(parsed.error) },
      { status: 422 },
    );
  }

  const variant = payload.variant;
  const attribution = sanitizeAttribution(payload.attribution);
  if (!isSubmissionId(payload.submissionId)) {
    return NextResponse.json({ ok: false, error: "Invalid submission ID" }, { status: 400 });
  }
  const submissionId = payload.submissionId;

  // Fail closed: without the durable store we cannot honor "no lead is ever
  // lost", so we refuse rather than silently dropping to email or faking success.
  if (!isSupabaseConfigured()) {
    console.error("[lead] SUPABASE_URL/SERVICE_ROLE_KEY unset — refusing lead to avoid data loss.");
    return NextResponse.json(
      { ok: false, error: "Lead intake temporarily unavailable" },
      { status: 503 },
    );
  }

  try {
    await ingestLead(submissionId, variant, parsed.data, attribution, {
      ip: clientIp(request),
      userAgent: request.headers.get("user-agent"),
      sourcePath: sourcePathFromReferer(request),
      googleSheetsEnabled: Boolean(process.env.LEAD_GOOGLE_SHEETS_WEBHOOK_URL),
    });
  } catch (error) {
    // Never log form values/PII — only the error message (already sanitized).
    console.error(
      "[lead] durable ingestion failed:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      { ok: false, error: "Lead intake temporarily unavailable" },
      { status: 503 },
    );
  }

  // Lead is safely stored. Best-effort immediate delivery of its outbox rows
  // after the response — failures here never affect the stored lead, and cron
  // reprocesses anything still pending.
  after(async () => {
    try {
      await runDeliveryWorker({ maxJobs: 5, workerId: "api-lead-after" });
    } catch (error) {
      console.error(
        "[lead] post-response delivery drain failed:",
        error instanceof Error ? error.message : error,
      );
    }
  });

  return NextResponse.json({ ok: true, submissionId });
}

function formatIssues(error: { issues: { path: PropertyKey[]; message: string }[] }) {
  return error.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message }));
}
