# LeadForm props contract (ATS-030)

`components/ui/lead-form.tsx` is the single config-driven form engine for every
lead form on the site. Page tickets consume it via the variant presets in
`content/lead-forms.ts` — do not build one-off forms.

## Quick start

```tsx
import { LeadForm } from "@/components/ui/lead-form";
import { leadFormVariants } from "@/content/lead-forms";

<LeadForm heading="Schedule Your Evaluation" {...leadFormVariants.heroEval} />;
```

Inside a Hero, pass fields through `HeroProps["form"]` instead (defaults to the
hero-eval variant when `fields` is omitted):

```tsx
<Hero form={{ heading, submitLabel, fields: leadFormVariants.carAccident.fields }} ... />
```

## `LeadFormProps`

| Prop                | Type                | Required | Notes                                                                                                                                                   |
| ------------------- | ------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `heading`           | `string`            | yes      | Rendered as an `<h2>` above the fields.                                                                                                                 |
| `variant`           | `string`            | no       | Variant key for server-side validation in `/api/lead`; defaults to `"heroEval"`. Presets include it.                                                    |
| `fields`            | `LeadFieldConfig[]` | yes      | Drives both rendering and the derived zod schema.                                                                                                       |
| `submitLabel`       | `string`            | yes      | CTA text on the submit button.                                                                                                                          |
| `successMessage`    | `string`            | no       | Inline success text used by the honeypot fake-success path. Defaults to "Thanks — we'll be in touch shortly."                                           |
| `fieldVariant`      | `"dark" \| "light"` | no       | Field styling surface; defaults to `"dark"` (hero panels).                                                                                              |
| `twoStep`           | `boolean`           | no       | Shows only `stepOneFieldNames` behind a "Continue" button first, revealing the rest once those validate. Defaults to `false` — full form in one screen. |
| `stepOneFieldNames` | `string[]`          | no       | Field names shown in step 1 when `twoStep` is true. Defaults to `["firstName", "phone"]`.                                                               |
| `className`         | `string`            | no       | Merged onto the `<form>`.                                                                                                                               |

`LeadFormValues` is `Record<string, string>` keyed by each field's `name`.

## `LeadFieldConfig`

| Key            | Type                                                            | Default  | Notes                                                                 |
| -------------- | --------------------------------------------------------------- | -------- | --------------------------------------------------------------------- |
| `name`         | `string`                                                        | —        | Key in the submitted values object.                                   |
| `label`        | `string`                                                        | —        | Visible field label.                                                  |
| `type`         | `"text" \| "tel" \| "email" \| "zip" \| "select" \| "textarea"` | `"text"` | `zip` renders a numeric text input with ZIP validation.               |
| `required`     | `boolean`                                                       | `true`   | Optional fields still format-validate (tel/email/zip) when filled in. |
| `half`         | `boolean`                                                       | `false`  | Half-width fields pair up side by side in the two-column grid.        |
| `options`      | `{ label: string; value: string }[]`                            | —        | Required for `type: "select"`.                                        |
| `placeholder`  | `string`                                                        | —        | For selects this becomes the disabled first option.                   |
| `autoComplete` | `string`                                                        | —        | Forwarded to the input.                                               |

## Variant presets (`content/lead-forms.ts`)

Each preset is `{ fields, submitLabel }`; spread it into `<LeadForm />`. Every
variant except `booking` carries a shared, optional `carAccident` select
("Is this related to a car accident?", Yes/No) — `booking`'s own "Reason for
Visit" select serves the same purpose via its "Accident" option instead of a
redundant second question. `lib/lead/priority.ts` privately classifies the
stored CRM lead for office triage. That classification is never sent in the
generic Google lead event.

| Variant        | Fields                                                                         | Submit label                        |
| -------------- | ------------------------------------------------------------------------------ | ----------------------------------- |
| `heroEval`     | First, Last, Phone, Email, car-accident?                                       | Schedule My Evaluation              |
| `accidentEval` | First, Last, Phone, Email, Date of Accident (no car-accident?)                 | Schedule My Evaluation              |
| `carAccident`  | First, Last, Phone, Email, car-accident?                                       | Schedule My Car Accident Evaluation |
| `contactUs`    | Name, Phone, Email, car-accident?, Message                                     | Send Message                        |
| `contact`      | First, Last, Email, Phone, Zip, car-accident?, Best Time to Contact (optional) | Contact Us                          |
| `eligibility`  | First, Last, Phone, Zip, car-accident? (no email)                              | Check Eligibility                   |
| `booking`      | First, Phone, Last, Reason for Visit (select, incl. "Accident")                | Schedule My Evaluation              |

The `booking` variant is consumed by the two-step `BookingForm`
(`components/sections/booking-form.tsx`) on /book rather than `<LeadForm />` —
same schema, same `/api/lead` pipeline.

## Validation & states

- Schema per variant is derived from its fields config via
  `buildLeadFormSchema` (zod + `@hookform/resolvers`, `lib/lead-form-schema.ts`):
  every field is trimmed and length-capped regardless of type; required
  fields must be non-empty after trimming. `tel` requires a real 10-digit US
  number (11 with a leading country code 1) — counted by digit, not just
  punctuation shape — and `components/ui/lead-form.tsx` formats it
  as-you-type via `lib/phone-format.ts`. `email` uses zod's built-in
  validator with a 254-char ceiling (this also closes an email-header-
  injection path through `/api/lead`'s `reply_to`). `zip` enforces
  5-digit/ZIP+4.
- Errors render inline under each field through the ATS-021 primitives
  (`Input` / `Select` / `Textarea`), with `aria-invalid` + `aria-describedby`.
- Submit button shows a loading spinner and is disabled while submitting; a
  failed durable submission renders a retryable error line.

## Submission pipeline (ATS-031)

A valid submit uses `submitLead()` to POST
`{ variant, values, submissionId, website, attribution }` to `/api/lead`.
The browser accepts success only when the response is 2xx and contains
`{ ok: true, submissionId: <valid UUID> }`. It then calls
`trackLeadSuccess(submissionId)`, which pushes only
`{ event: "ats_lead_success", submission_id }` to `window.dataLayer`, and
routes to `/thank-you`. Failures surface as an inline retryable error.

The route re-validates server-side with the same `buildLeadFormSchema`
(`lib/lead-form-schema.ts`) keyed by `variant`, re-checks the honeypot, and
enforces origin + body-size guards. It then **durably ingests** the lead
(`lib/lead/ingest.ts` → the `ingest_lead` RPC: lead + consent receipt + delivery
outbox rows, one transaction) and only then responds
`{ ok: true, submissionId }` — it never reports success before the lead is
stored, and never sends email synchronously.
Office/patient emails are delivered from the outbox by the worker
(`app/api/internal/deliver` + a post-response `after()` drain). If the durable
store is unconfigured/unavailable the route **fails closed (503)** rather than
dropping the lead. See `docs/lead-crm-email-architecture.md`.

## Form versioning

Each variant carries an optional `version` (default 1), recorded on every stored
lead as `form_version`. `eligibility` and `booking` are **v2** — they now
collect a validated email so those forms can also send the patient
acknowledgment. Their v1 (no-email) contracts remain as immutable history in
`lead_form_definitions`.

## Spam guard

A visually hidden "website" honeypot input sits outside react-hook-form. If a
bot fills it, the client fakes success without POSTing, and `/api/lead`
independently fakes success (200) for direct POSTs with a filled honeypot.
