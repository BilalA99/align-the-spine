import { NextResponse } from "next/server";

import { alertOperatorsOfStuckPendingBacklog, deliverLead } from "@/lib/lead-delivery";
import { countStuckPendingLeads, findStuckPendingLeads } from "@/lib/lead-store";

/** ATS-E5a Step 5: catches leads whose after() delivery attempt in
 * app/api/lead/route.ts never ran or never completed — a platform-level
 * miss (function crash/timeout), not a normal delivery failure. Normal
 * failures already resolve to `delivery_status: "failed"` via
 * lib/lead-delivery.ts's own 3-attempt retry loop and are never picked up
 * here; this route exists only for the rarer case where a lead is stuck at
 * the DB default `"pending"` with zero attempts recorded.
 *
 * Configure as a Vercel Cron (vercel.json, every 15 min) hitting this route
 * with `Authorization: Bearer $CRON_SECRET` — Vercel sends that header
 * automatically for cron-triggered requests when CRON_SECRET is set in the
 * project's env vars. Fails closed: a request without a valid bearer token
 * is rejected outright, and CRON_SECRET must be set at all (no "open when
 * unconfigured" fallback) since this route does real work (sends emails,
 * mutates lead rows) if it runs unauthenticated. */
const STUCK_PENDING_THRESHOLD_MS = 2 * 60 * 1000;
const ESCALATION_THRESHOLD_MS = 30 * 60 * 1000;
const MAX_LEADS_PER_RUN = 20;

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let stuckLeads;
  try {
    stuckLeads = await findStuckPendingLeads(STUCK_PENDING_THRESHOLD_MS, MAX_LEADS_PER_RUN);
  } catch (error) {
    console.error("[cron/retry-leads] failed to query stuck pending leads:", error);
    return NextResponse.json({ ok: false, error: "query_failed" }, { status: 503 });
  }

  // Sequential, not Promise.all — deliverLead() already does its own
  // 3-attempt retry with backoff per lead; running 20 of those concurrently
  // would hammer Resend all at once for no benefit, and this route's own
  // execution budget is generous (it's a background cron, not a
  // user-facing request).
  for (const lead of stuckLeads) {
    await deliverLead(lead);
  }

  let stillStuckCount = 0;
  try {
    stillStuckCount = await countStuckPendingLeads(ESCALATION_THRESHOLD_MS);
  } catch (error) {
    console.error("[cron/retry-leads] failed to run the reconciliation count:", error);
  }
  if (stillStuckCount > 0) {
    await alertOperatorsOfStuckPendingBacklog(stillStuckCount);
  }

  return NextResponse.json({
    ok: true,
    processed: stuckLeads.length,
    stillStuckAfter30Min: stillStuckCount,
  });
}
