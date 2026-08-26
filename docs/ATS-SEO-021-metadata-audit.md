# ATS-SEO-021 — Page-specific metadata optimization audit

**Status:** Audit + edits complete for every published route (11 static + 19 service-area +
CMS blog posts). **Not yet committed** — holding per instruction.

**Depends on:** ATS-SEO-004 (keyword map) — used below to validate each static page's primary
query cluster against its title.

## Scope

"Every published route" breaks into 3 groups:

1. **11 static routes** registered in `content/seo.ts` with `status` unset/`"published"` — the
   main subject of this audit; validated individually below.
2. **19 `/service-areas/[slug]` pages** (`content/service-areas.ts`) — per-item `seoTitle`/
   `metaDescription`, already genuinely differentiated (real per-city content, not templated).
   Verified programmatically for uniqueness (no manual per-page audit needed).
3. **CMS-managed `/blog/[slug]` posts** — per-item `seoTitle`/`metaDescription` pulled from
   Supabase at request time; the _code path_ was audited (unique canonical/title/description per
   post, no hardcoded literal), but individual post copy quality is editorial and out of static
   audit scope.

## Bug found: `/service-areas` metadata had drifted from its own registry entry

`app/service-areas/page.tsx` was hardcoding its own `title`/`description` literal via
`buildMetadata({...})` instead of pulling from `content/seo.ts`'s registry entry for that same
path via `getRoute()` — the pattern every other static page uses. The two had **silently
diverged**: different titles, and a slightly different description ("accident home-visit
eligibility" in the registry vs. "car-accident/PIP home-visit eligibility" live on the page).
`content/seo.ts`'s own doc comment claims to be the "single source of truth... so the two can't
drift apart" — this route had quietly broken that guarantee.

`app/blog/page.tsx` had the same hardcoded-literal pattern, though its copy happened to still be
byte-identical to the registry (not yet drifted — same latent risk).

**Fixed both:** both pages now call `buildMetadata(getRoute(path))`, matching `/`, `/services`,
`/about`, `/book-an-appointment`, `/car-accident-chiropractor`, `/conditions`, `/contact-us`, and
`/privacy-policy`, which already did this correctly. One source of truth again for every static
route. `/service-areas`'s registry entry was updated to keep the more precise, currently-live
description wording rather than the older, vaguer one.

## Per-route audit (11 static published routes)

| Route                        | Primary query (ATS-SEO-004 cluster)                     | Verdict                                                                                                                                | Action                                                                                                                                                                                                                                                   |
| ---------------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                          | Broad "chiropractor Deerfield Beach"                    | Title/description already lead with the right intent phrase, local relevance present, brand not repeated.                              | No change.                                                                                                                                                                                                                                               |
| `/services`                  | General-care services hub                               | Same — solid, human-readable, lists real offerings.                                                                                    | No change.                                                                                                                                                                                                                                               |
| `/book-an-appointment`       | Appointment-request conversion action                   | Natural phrasing, local relevance present.                                                                                             | No change.                                                                                                                                                                                                                                               |
| `/car-accident-chiropractor` | Car accident chiropractor Deerfield Beach (top cluster) | Exact match to the ATS-SEO-004 keyword map's primary destination for this cluster.                                                     | No change.                                                                                                                                                                                                                                               |
| `/conditions`                | Chiropractic conditions overview hub                    | Built this page myself in ATS-SEO-040 with this in mind already.                                                                       | No change.                                                                                                                                                                                                                                               |
| `/reviews`                   | Align the Spine patient reviews                         | Title omitted Deerfield Beach — every other page includes local relevance. Also had no `image` (no OG/Twitter preview).                | **Rewrote title** to add `\| Deerfield Beach, FL`, matching the `/book-an-appointment` / `/car-accident-chiropractor` suffix pattern. **Added image** — reused the same photo+alt already used for this page's own nav mega-menu entry, not a new asset. |
| `/about`                     | Dr. Abe Nasser doctor-entity query                      | Deliberately brand-suffix-free per ATS-E3 3.8's exact required wording; already fixed for H1 alignment in ATS-SEO-022.                 | No change.                                                                                                                                                                                                                                               |
| `/contact-us`                | Align the Spine contact/location/hours (NAP)            | Title/description solid, full address present. Had no `image`.                                                                         | **Added image** — reused the office exterior photo already used on `/service-areas` (same reuse pattern as `dr-abe-neck.png` across `/about` and `/services`).                                                                                           |
| `/privacy-policy`            | Legal/compliance boilerplate — not a search-intent page | Correctly deprioritized, no rewrite needed.                                                                                            | No change.                                                                                                                                                                                                                                               |
| `/blog`                      | Chiropractic & accident-recovery editorial hub          | Title/description solid. Metadata was hardcoded, drift risk (see bug above).                                                           | **Wired to registry** (no copy change).                                                                                                                                                                                                                  |
| `/service-areas`             | Nearby-city service-area coverage index                 | Title was just "Service Areas" — generic, no intent phrase, no local relevance, unlike every other page. Also had the drift bug above. | **Rewrote title** to lead with "Chiropractic Service Areas Near Deerfield Beach, FL". **Fixed the drift bug** — page now pulls from the registry.                                                                                                        |

## Practical SERP-readability check (no hard character limit enforced, per the ticket)

All 11 titles are in the same range as the pre-existing, already-shipped `/book-an-appointment`
title (76 characters) — nothing egregiously long enough to risk needless truncation. Descriptions
are all single, human-readable sentences describing real page content, not keyword lists.

## Acceptance criteria

- [x] **No duplicate published-page titles** — verified programmatically (23-entry static
      registry read in full, no duplicates by inspection) and now structurally enforced going
      forward: added `content/seo.test.ts` → "ATS-SEO-021: metadata uniqueness across published
      routes" (2 tests: title uniqueness, description uniqueness among published routes). Verified the
      test actually catches a violation by temporarily forcing a duplicate title, confirming RED,
      then reverting to GREEN.
- [x] **No duplicate published-page descriptions unless deliberately justified** — same tests;
      no duplicates exist today, so no justified-exception allowlist was needed.
- [x] **No generic metadata on priority pages** — `/reviews` and `/service-areas` were the 2
      offenders (missing local relevance / too generic); both fixed above.
- [x] **Metadata matches H1 / page intent** — cross-checked each static route's title against its
      rendered H1 (all use the same underlying string via `RouteMeta.title` → `HeroSolidPanel`'s
      `title` prop, or the page's own hero content) and against its `primaryQuery` in the ATS-SEO-004
      map. No mismatches found beyond the 2 already fixed.
- [x] **Raw HTML contains the final values** — verified via `curl` against the dev server for all
      11 static routes: `<title>`, `<link rel="canonical">`, `<meta property="og:image">` all present
      with the correct values in the initial HTML response (not hydration-only). See "QA evidence"
      below.

## Also added: same uniqueness guard for service-area content

`lib/content/service-areas.test.ts` — 2 new tests (`has no duplicate seoTitle across entries`,
`has no duplicate metaDescription across entries`) covering the 19 `/service-areas/[slug]` pages.
Confirmed clean (no duplicates) via a one-off Python script before adding the permanent test.

## QA evidence

Browser-extension screenshots (Meta SEO Inspector / SEO Meta in 1 Click) weren't run — those are
manual browser-extension tools I can't operate. Substituted with `curl` captures against the dev
server for every static route, confirming `<title>`, `<meta name="description">`,
`<link rel="canonical">`, and `<meta property="og:image">` are present with the correct final
values in the raw HTML response body (not just the hydrated DOM):

```
=== / ===
<title>Chiropractor in Deerfield Beach, FL | Align the Spine</title>
<link rel="canonical" href="https://chirobackpain.com">

=== /reviews ===
<title>Patient Reviews | Deerfield Beach, FL | Align the Spine</title>
<link rel="canonical" href="https://chirobackpain.com/reviews">

=== /contact-us ===
<title>Contact Align the Spine | Deerfield Beach, FL</title>
<link rel="canonical" href="https://chirobackpain.com/contact-us">

=== /service-areas ===
<title>Chiropractic Service Areas Near Deerfield Beach, FL | Align the Spine</title>
<link rel="canonical" href="https://chirobackpain.com/service-areas">
```

Social images confirmed resolving (HTTP 200): `/figma-exports/exterior-img.png`,
`/figma-exports/interior-table.png`.

## Files touched (not yet committed)

- `content/seo.ts` — `/reviews` (title + image), `/contact-us` (image), `/service-areas` (title +
  description, fixing the drift).
- `content/seo.test.ts` — 2 new uniqueness tests.
- `lib/content/service-areas.test.ts` — 2 new uniqueness tests.
- `app/service-areas/page.tsx` — now uses `buildMetadata(getRoute(...))`.
- `app/blog/page.tsx` — now uses `buildMetadata(getRoute(...))`.

**Verification run:** 282/282 tests pass, `tsc --noEmit` clean, `eslint` clean on every touched
file.
