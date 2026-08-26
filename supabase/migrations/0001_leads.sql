-- ATS-E5: durable first-party lead datastore.
--
-- A lead must exist here BEFORE app/api/lead/route.ts ever returns success —
-- notification delivery (Resend) is a separate, best-effort concern layered
-- on top, never the source of truth. See lib/lead-store.ts / lib/lead-delivery.ts.
--
-- idempotency_key is computed server-side from (variant + sanitized field
-- values + a 10-minute time bucket) — see lib/lead-store.ts's
-- buildIdempotencyKey(). A UNIQUE constraint on it, combined with
-- `ON CONFLICT DO NOTHING`, is what makes a double-click or a client retry
-- of the same submission a no-op instead of a duplicate row (5.7) — the
-- ORIGINAL row's attribution is preserved because the conflicting insert
-- simply doesn't happen.
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  idempotency_key text not null,
  variant text not null,
  fields jsonb not null,
  attribution jsonb not null default '{}'::jsonb,
  priority text not null default 'normal',

  -- Delivery is tracked separately from persistence — a lead can be
  -- 'pending'/'failed' here and still be a fully durable, reconcilable
  -- record (5.5).
  delivery_status text not null default 'pending'
    check (delivery_status in ('pending', 'delivered', 'failed')),
  provider_response_id text,
  provider_response_body text,
  retry_count integer not null default 0,
  final_failure_state boolean not null default false,
  delivered_at timestamptz,

  -- 5.8: set by a server-side reconciliation job/webhook, never the browser.
  crm_status text,
  crm_reconciled_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists leads_idempotency_key_key on public.leads (idempotency_key);
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_delivery_status_idx on public.leads (delivery_status)
  where delivery_status != 'delivered';

-- Only the server (service_role, which bypasses RLS) ever touches this
-- table — RLS is enabled with zero policies so the anon/publishable key can
-- never read or write leads even if it's ever used from a browser context.
alter table public.leads enable row level security;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
  before update on public.leads
  for each row
  execute function public.set_updated_at();
