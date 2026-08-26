# ATS-SEO-050 — Homepage SEO optimization audit

**Status:** Implementation complete, verified live. **Not yet committed.**

**Depends on:** ATS-SEO-004 (keyword map) — homepage's registered `primaryQuery`
("Deerfield Beach general chiropractic intent") matches the keyword map's broad-local cluster
destination, confirming the primary/secondary cluster is already correct.

## Findings and fixes

### 1. Title/H1 misalignment (fixed)

The `<title>` tag (`content/seo.ts`'s `""` route) already led with the intent phrase:
"Chiropractor in Deerfield Beach, FL | Align the Spine". The H1, however, led with the **brand
name**: "Align the Spine / Deerfield Beach / Chiropractor" — reversed order from the title, and
out of step with every other page's H1 (none of them lead with the brand; e.g.
`/car-accident-chiropractor`'s H1 is just "Car Accident Chiropractor", no brand at all).

**Fixed:** H1 rewritten to "Chiropractor in Deerfield Beach, FL" — now matches the title tag's
lead phrase exactly. Brand identity stays visible elsewhere on the page (logo/nav, hero call
pill, footer) without needing the H1 to carry it.

### 2. Missing contextual internal links (fixed — 5 links added)

The ticket requires links to Services, core publishable Conditions, the Accident page, About, and
Reviews. The global nav already covers all of these, but none of the homepage's own body content
linked to them — `ServicesSection`, `DoctorProfile`, and `PatientReviews` had zero outbound links
at all beyond the booking CTA; `AccidentInjuries`' only path to `/car-accident-chiropractor` was
an implicit per-card fallback link (from ATS-SEO-042), not an explicit, prominent one.

Added:

- **`ServicesSection`** (homepage-only component, no self-link risk): "View all services" →
  `/services`, "Conditions we treat" → `/conditions`.
- **`AccidentInjuries`**: "See our full car accident care page" → `/car-accident-chiropractor`,
  gated on the existing `isAccidentPage` prop so it never self-links on that page itself.
- **`DoctorProfile`**: "Meet Dr. Abe" → `/about`, gated on `variant === "short"` — `variant="long"`
  only ever renders on `/about` itself (verified: the only usage), so this can never self-link.
- **`PatientReviews`**: "Read all patient reviews" → `/reviews` — this component never renders on
  `/reviews` itself (13 usages checked, none of them that page), so no gating needed.

All 4 components are shared across other pages too (`DoctorProfile`: 14 usages,
`AccidentInjuries`: 7, `PatientReviews`: 13) — these links improve internal linking sitewide, not
just the homepage, with the self-link guards specifically verified for each.

### 3. Keep-broad / accident-prominence checks (verified, no change needed)

Homepage's own sections: Hero → HeroReviewsCarousel → Services → WhyChoose →
**AccidentInjuries** (1 section) → SpineOverview → DoctorProfile → PatientReviews → Location/
Contact. Only 1 of 9 content sections is accident-specific, plus one clause in the hero subhead
("with focused evaluations after car accidents") — the page is broad-first by construction, not
accident-dominated. The accident path is now more clearly signposted (see #2) without expanding
its footprint.

**Known, separate gap (not fixed here, out of this ticket's scope):** the homepage and
`/car-accident-chiropractor` still render `HeroReviewsCarousel`, `DoctorProfile`, and
`PatientReviews` with literally the same underlying content (not just the same component) — this
is the pre-existing "KNOWN GAP" flagged in `content/seo.ts`'s own `""` route justification,
pending ONPAGE-02's de-duplication work. ATS-SEO-050 doesn't depend on or block that ticket, and
its checklist doesn't ask for component-level de-duplication — flagging again here for visibility
since it's directly adjacent to this ticket's "accident path... does not dominate" criterion.

### 4. Keyword repetition (checked, no change needed)

Hero H1 + subhead + badge scanned for repetition: "Deerfield Beach" appears once in the H1 and
once in the subhead (normal local-SEO reinforcement across 2 distinct sentences, not stuffing);
no phrase repeats more than that anywhere in the hero block.

## Acceptance criteria

- [x] **One clear local H1** — "Chiropractor in Deerfield Beach, FL", single H1 confirmed via
      raw HTML (`grep -o '<h1...'` — exactly one match).
- [x] **Title / H1 / intro share the same broad-local intent** — H1 now matches the title tag's
      lead phrase verbatim; subhead elaborates on the same broad local-care intent.
- [x] **Accident path visible but does not dominate the entire page** — 1 of 9 content sections;
      now has an explicit, prominent link out to the dedicated accident page.
- [x] **No keyword stuffing** — checked above.
- [x] **Crawlable links to major sections** — Services, Conditions, Accident page, About, and
      Reviews are all now real `<a href>` anchors in the homepage's own body content (previously only
      the shared nav covered these).
- [x] **Raw HTML contains full core content** — verified via `curl` against the dev server: H1,
      title, and all 5 new links (with their visible label text) are present in the initial HTML
      response, not hydration-only.

## Verification

```
=== H1 ===
<h1 ...>Chiropractor in<br/>Deerfield Beach, FL</h1>
=== title ===
<title>Chiropractor in Deerfield Beach, FL | Align the Spine</title>
```

- `href="/services"`, `/conditions`, `/reviews`, `/about` each present in raw HTML.
- `href="/car-accident-chiropractor"` present (11 occurrences sitewide — nav, footer, services
  list "Car Accidents" row, injury-card fallbacks, and the new explicit link).
- Link label text ("View all services", "Conditions we treat", "Meet Dr. Abe",
  "Read all patient reviews", "See our full car accident care page") each confirmed present.
- Self-link guards verified live: `/car-accident-chiropractor` renders zero copies of "See our
  full car accident care page"; `/about` renders zero real `href="/about"` anchors from
  `DoctorProfile` (the one `href="/about"` present there is the nav's own "About Dr. Abe" link).
- Full test suite: 282/282 pass. `tsc --noEmit` clean. `eslint` clean on every touched file.

## Files touched (not yet committed)

- `app/page.tsx` — H1 rewrite.
- `components/sections/services-section.tsx` — 2 new links.
- `components/sections/accident-injuries.tsx` — 1 new gated link.
- `components/sections/doctor-profile.tsx` — 1 new gated link.
- `components/sections/patient-reviews.tsx` — 1 new link.
