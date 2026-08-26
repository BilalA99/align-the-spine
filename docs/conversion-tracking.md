# Conversion tracking contract

## Conversion source of truth

The core online conversion is a lead that has been durably stored in the ATS
Supabase CRM. A click, form start, valid client form, attempted request, React
state change, or thank-you page view is not a conversion.

```text
lead form
  -> POST /api/lead
  -> server validation and anti-bot checks
  -> transactional Supabase ingest
  -> { ok: true, submissionId: <canonical UUID> }
  -> window.dataLayer.push({ event: "ats_lead_success", submission_id: UUID })
  -> GTM
```

The server returns `submissionId` only after the transactional ingestion
succeeds. Honeypot traffic receives `{ ok: true }` with no UUID, so it cannot
pass the client success contract or create an advertising conversion.

## Browser -> GTM contract

Event name: `ats_lead_success`

Event payload:

```js
{
  event: "ats_lead_success",
  submission_id: "<uuid>"
}
```

`submission_id` is the stable technical idempotency key generated once per
form instance and accepted/returned by the server. It contains no patient or
intake meaning. A retry uses the same ID.

Meaning: a real lead was successfully persisted. The event does not disclose
whether the person reported an accident, symptom, condition, injury, insurance
status, or any other healthcare/intake classification.

## GTM setup (manual, not performed by the application)

- `DLV | ATS | Submission ID`: Data Layer Variable, name `submission_id`.
- `Trigger | ATS | Lead Success`: Custom Event, name `ats_lead_success`.
- `GA4 Event | ATS | generate_lead`: fire `generate_lead` on that trigger.
- `Google Ads | ATS | Website Lead`: fire the website-lead conversion on that
  trigger.
- Google Ads Transaction ID: `{{DLV | ATS | Submission ID}}`.

GTM is the primary outbound controller for the lead conversion. The application
does not also call `gtag("event", "generate_lead")` or
`gtag("event", "conversion")` for the same lead.

The `/thank-you` route owns no conversion code. Direct entry, refresh, and
browser history navigation therefore create zero lead conversions.

## Privacy and attribution

The CRM privately retains validated lead fields, attribution, form variant, and
operational priority. The Google lead event contains only `submission_id`.

Attribution storage is limited to `gclid`, `gbraid`, `wbraid`, and the five
`utm_*` fields. It uses a version-3 localStorage envelope with a 90-day expiry
and exact-key migration from legacy `ats_attribution` and
`ats_attribution_v2` sessionStorage records. Server sanitization remains
authoritative.

## Enhanced Conversions

Enhanced Conversions infrastructure and the
`NEXT_PUBLIC_GOOGLE_ADS_ENHANCED_CONVERSIONS` environment contract are
intentionally preserved in `lib/analytics/enhanced-conversions.ts`.

It is currently **not invoked by ATS healthcare lead conversions**. ATS forms
must not send name, email, phone, address, patient information, medical
information, accident status, symptoms, injury details, reason for visit, or
insurance/PIP information through Google Ads `user_data`. Do not activate it
for ATS without a future Google policy, privacy, and compliance review.
