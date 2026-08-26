# Lead CRM + dual transactional email — architecture & operations

Durable lead capture + independently-retryable office/patient email for Align
the Spine. Built additively on the existing config-driven `LeadForm` pipeline.

> **Status:** the application/code + SQL migrations are complete and pass
> typecheck, lint, 206 tests, and a production build. The steps under
> **Remaining manual actions** (provision Supabase, verify Resend domain, DNS,
> Google Workspace) must be done against the real accounts before this is
> deployed. Until `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` are set, `/api/lead`
> **fails closed (503)** by design — it will not fake success or lose a lead.

## Flow

```
Browser form ──POST /api/lead──▶ validate (zod + honeypot + origin + size)
                                       │
                                       ▼
                          ingest_lead() RPC  (ONE transaction)
                          ├─ leads row (contact cols + raw_fields + attribution)
                          ├─ lead_consent_receipts row (disclosure ver, ip HASH)
                          ├─ outbox: office_notification         (always)
                          ├─ outbox: patient_acknowledgment      (valid email only)
                          └─ outbox: google_sheets               (if configured)
                                       │  success → 200 { ok:true, submissionId }
                                       ▼
              after() best-effort drain  +  cron GET /api/internal/deliver
                                       │
                                       ▼
                 claim_lead_deliveries() (FOR UPDATE SKIP LOCKED)
                   → render template → Resend (stable Idempotency-Key)
                   → complete_lead_delivery() (retry/backoff/dead-letter)
                                       │
   Resend ──POST /api/webhooks/resend (svix-verified, idempotent)──▶ delivery_state
                   (bounce/complaint/suppression → status 'suppressed', never resent)
```

## Data model (migrations `supabase/migrations/2026081800014`)

- **`leads`** — durable lead. Typed contact columns + `raw_fields` (all
  non-sensitive values) + `attribution` (gclid/utm) + `form_variant`/
  `form_version` + `sensitive_payload` (AES-256-GCM ciphertext, base64) +
  `sensitive_present`. `submission_id` is UNIQUE (idempotency).
- **`lead_consent_receipts`** — append-only; disclosure version, keyed **hash**
  of IP (never raw), user agent.
- **`lead_form_definitions`** — versioned, immutable contract history; FK target
  of `leads(form_variant, form_version)`. Seeded v1 for every variant + v2 for
  `eligibility`/`booking` (which add a required email).
- **`lead_delivery_outbox`** — one row per `(submission_id, destination,
delivery_purpose)` (unique). Send lifecycle in `status`; webhook-reported
  outcome in `delivery_state`. Stable `idempotency_key`.
- **`lead_delivery_attempts`** — per-attempt audit (sanitized errors only).
- **`resend_webhook_events`** — idempotent event log keyed on svix message id.
- **RPCs:** `ingest_lead`, `claim_lead_deliveries`, `complete_lead_delivery`.
- **RLS:** enabled with **no** anon/authenticated policies → only the
  server-side service-role key can touch lead data.

## Privacy controls

- Sensitive fields (`message`, `accidentDate`) are AES-256-GCM encrypted in the
  app; the key (`LEAD_ENCRYPTION_KEY`) never enters the DB. They are stripped
  from `raw_fields` and from all logs.
- `LEAD_EMAIL_INCLUDE_SENSITIVE` **fails closed** — sensitive data is decrypted
  into the office email only when it is exactly `"true"`.
- No PII in email subjects; office subject is `form label | short-id`.
- Office CRM button links to `/admin/leads/{uuid}` — opaque id only.
- No open/click tracking, no tracking pixel, no UTM/lead ids on links.
- Provider errors are scrubbed of email addresses before storage/logging.
- Analytics: only after this durable response, the browser pushes
  `{ event: "ats_lead_success", submission_id }` to `dataLayer`. GTM owns
  GA4/Google Ads lead tags. No intake classification, PII, email delivery, or
  Resend identifier is sent in that event.

## Remaining manual actions (authorization-gated — not performed here)

1. **Rotate/relocate the Resend key.** A real key was pasted into `.env.example`
   (now removed, uncommitted). Put the real key in `.env.local` (gitignored),
   not the template. Rotate it if it was shared anywhere.
2. **Provision a dedicated Supabase project** for this site (the MCP-connected
   Supabase is an unrelated restaurant POS — do **not** use it). Set
   `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`.
3. **Apply migrations in order** (`202608180001` → `4`) to that project
   (`supabase db push` or psql). Rollback scripts are in `supabase/rollback/`.
4. **Generate secrets:** `LEAD_ENCRYPTION_KEY`
   (`node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`),
   `LEAD_DELIVERY_WORKER_SECRET`, `ADMIN_DASHBOARD_PASSWORD`.
5. **Verify `chirobackpain.com` in Resend** (SPF/DKIM/return-path records in
   GoDaddy per Resend's GoDaddy guide). Keep Resend on a `send`-style subdomain
   so it never competes with Google Workspace inbound MX.
6. **Google Workspace mailbox** `appointments@chirobackpain.com` (interactive
   login only — never paste the Google password anywhere). MX/SPF/DKIM/DMARC
   (`p=none` first). AB must approve any paid license first.
7. **Resend webhook:** point it at `POST /api/webhooks/resend`; set
   `RESEND_WEBHOOK_SECRET` to its signing secret. Do **not** enable Resend
   inbound on the root domain.
8. **Schedule the worker:** a cron (Vercel Cron or external) hitting
   `GET /api/internal/deliver` every few minutes with
   `Authorization: Bearer $LEAD_DELIVERY_WORKER_SECRET`. Immediate sends already
   happen via `after()`; cron is the retry safety net.
9. **Set email env:** `LEAD_EMAIL_FROM`, `LEAD_EMAIL_REPLY_TO`,
   `LEAD_NOTIFICATION_TO=appointments@chirobackpain.com`.
10. Optional: `LEAD_GOOGLE_SHEETS_WEBHOOK_URL` to enable the Sheets mirror.

## Rollback

- Code: revert the branch `feat/lead-crm-email-infra`.
- DB: run `supabase/rollback/*.down.sql` in reverse order (children first). v1
  form-definition rows are retained while any lead references them.
