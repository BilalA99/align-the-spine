-- ATS-E5a: adds what 0001_leads.sql's delivery_status/final_failure_state
-- didn't cover — a safe, queryable failure category (never a raw error
-- body/PII — see lib/lead-delivery.ts's categorizeDeliveryError()) and a
-- failed_at timestamp to sit alongside delivered_at.
alter table public.leads
  add column if not exists error_category text,
  add column if not exists failed_at timestamptz;

-- Reconciliation query (ATS-E5a Step 6): leads whose after() attempt never
-- ran/completed (a platform-level miss — Vercel's after() isn't a hard
-- guarantee under a function crash/timeout) stay 'pending' indefinitely
-- unless the retry cron (app/api/cron/retry-leads/route.ts) picks them up.
-- This index is what makes that query cheap.
create index if not exists leads_stuck_pending_idx on public.leads (created_at)
  where delivery_status = 'pending';
