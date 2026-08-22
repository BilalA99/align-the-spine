# ATS-SEO-004 — Keyword-to-Page Map

**Status:** Draft — page-architecture mapping complete; Ahrefs-sourced fields (volume, KD, traffic
potential, CPC, local-pack/AI Overview presence, competitor ranking URLs) pending the ATS-SEO-003
export.

**Depends on:** ATS-SEO-003 (Ahrefs competitor export — in progress, data not yet available)

**Built from:** `content/seo.ts` (route registry), `content/service-areas.ts` (18 service-area
pages), condition/service page H1s, and the existing `seo.test.ts` primary-query-uniqueness
enforcement already in the codebase.

## How to read this doc

Every seed keyword below has a **recommended Align destination** based on current page
architecture and the mapping rules in the ticket. The Ahrefs-only columns (volume, KD, traffic
potential, CPC, parent topic, current ranking URL, SERP features, competitor URLs) are marked
`TBD` — fill these in directly from the ATS-SEO-003 export once it lands, and re-run the
cannibalization checks below against the real intent/volume data, since Ahrefs's own "parent
topic" grouping may reshape a few of these assignments.

---

## Broad local cluster

| Keyword                                 | Recommended Align destination        | Status                                 | Notes                                                                                                                                                                                                            |
| --------------------------------------- | ------------------------------------ | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| chiropractor deerfield beach            | `/` (home)                           | published                              | Owns broad brand+city intent. Closest Ahrefs match ("chiropractor in deerfield beach"): vol 60, KD 25, CPC $2.35 — Bartell ranks pos 11 for it (ATS-SEO-003).                                                    |
| deerfield beach chiropractor            | `/` (home)                           | published                              | Word-order variant of above — same page                                                                                                                                                                          |
| chiropractor near me                    | `/` (home)                           | published                              | Geo-modified variant of broad intent                                                                                                                                                                             |
| chiropractic care deerfield beach       | `/` (home)                           | published                              | Synonym of broad intent                                                                                                                                                                                          |
| chiropractic adjustment deerfield beach | `/services/chiropractic-adjustments` | **draft** (clinician sign-off pending) | Owns treatment-specific intent, not the hub                                                                                                                                                                      |
| spinal decompression deerfield beach    | `/services/spinal-decompression`     | **draft** (clinician sign-off pending) |                                                                                                                                                                                                                  |
| back pain chiropractor deerfield beach  | `/conditions/back-pain`              | **draft** (clinician sign-off pending) | Non-accident back pain. Closest Ahrefs match ("back pain deerfield"): vol 60, KD 0 — Bartell's `/back-pain-2/` ranks pos 10 for it, direct proof this query is winnable even by a weak competitor (ATS-SEO-003). |
| neck pain chiropractor deerfield beach  | `/conditions/neck-pain`              | **draft** (clinician sign-off pending) | Non-accident neck pain — see cannibalization note vs. whiplash below                                                                                                                                             |
| sciatica chiropractor deerfield beach   | `/conditions/sciatica`               | **draft** (clinician sign-off pending) |                                                                                                                                                                                                                  |

## Car accident cluster

| Keyword                                    | Recommended Align destination                                                                  | Status                                 | Notes                                                                                                                                                                                                      |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| car accident chiropractor deerfield beach  | `/car-accident-chiropractor`                                                                   | published                              | Primary accident money page                                                                                                                                                                                |
| auto accident chiropractor deerfield beach | `/car-accident-chiropractor`                                                                   | published                              | Synonym                                                                                                                                                                                                    |
| car accident chiropractor broward          | `/car-accident-chiropractor`, secondary `/service-areas`                                       | published                              | No single Broward-wide page exists by design (avoids thin near-duplicate city pages); `/car-accident-chiropractor` is the primary target, `/service-areas` is the discovery hub into individual city pages |
| chiropractor after car accident            | `/car-accident-chiropractor`                                                                   | published                              |                                                                                                                                                                                                            |
| whiplash chiropractor                      | `/conditions/whiplash`                                                                         | **draft** (clinician sign-off pending) |                                                                                                                                                                                                            |
| whiplash treatment deerfield beach         | `/conditions/whiplash`                                                                         | **draft**                              |                                                                                                                                                                                                            |
| neck pain after car accident               | `/conditions/whiplash`                                                                         | **draft**                              | **Not** `/conditions/neck-pain` — see cannibalization note below                                                                                                                                           |
| back pain after car accident               | `/car-accident-chiropractor`                                                                   | published                              | No dedicated "accident back pain" page exists or is warranted per the "don't create a page because a keyword exists" rule — this should be a well-covered subsection of the accident page, not a new URL   |
| PIP chiropractor                           | `/car-accident-chiropractor`                                                                   | published                              | PIP/insurance messaging already lives on this page and on service-area pages; no standalone PIP page needed                                                                                                |
| car accident home visit chiropractor       | `/car-accident-chiropractor` (broad) / `/service-areas/[slug]` (per-city, non–Deerfield-Beach) | published / published                  | Deerfield Beach itself doesn't have a dedicated "car accident + home visit" page — `/home-visit-chiropractor` is general-home-visit and currently draft (see cannibalization note)                         |

## Supporting patient-language terms (validate variants)

These read informational-first. Default destination is the relevant condition page for direct
symptom synonyms; anything genuinely educational (not "find a provider") routes to `/blog`
instead of forcing a commercial page.

| Keyword                                         | Recommended Align destination                                 | Notes                                                                                                                                       |
| ----------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| pinched nerve                                   | `/conditions/sciatica`                                        | Direct patient-language synonym for radiating nerve pain                                                                                    |
| slipped disc                                    | `/conditions/sciatica`                                        | Secondary relevance to `/conditions/back-pain` if no leg-pain component — validate against actual search intent once Ahrefs SERP data is in |
| radiating leg pain                              | `/conditions/sciatica`                                        | Direct synonym                                                                                                                              |
| lower back pain                                 | `/conditions/back-pain`                                       | Direct synonym                                                                                                                              |
| stiff neck                                      | `/conditions/neck-pain` (non-accident)                        | If SERP intent skews accident-related, reroute to `/conditions/whiplash` instead — check once volume/intent data lands                      |
| headaches after accident                        | `/conditions/cervicogenic-headache`                           | Dedicated accident-triggered headache page already exists for this exact intent                                                             |
| when to see a chiropractor after a car accident | `/blog` (new article) → CTA into `/car-accident-chiropractor` | Informational query, not commercial — belongs in editorial content, not a money page                                                        |
| chiropractic care after a collision             | `/car-accident-chiropractor`                                  | Near-duplicate of the car-accident cluster                                                                                                  |

---

## Mapping rules — compliance check

- [x] **One primary intent per landing page** — enforced structurally today: `seo.test.ts` fails
      the build if two indexable routes share a `primaryQuery`.
- [x] **One primary keyword cluster per landing page** — reflected in the tables above.
- [x] **Secondary variations share a page when intent is the same** — e.g. "chiropractor deerfield
      beach" / "deerfield beach chiropractor" / "chiropractor near me" all route to `/`.
- [x] **Do not create a page because a keyword exists** — applied to "back pain after car
      accident," "PIP chiropractor," and "car accident home visit chiropractor" (Deerfield Beach): all
      route to an existing page rather than spawning a new URL.
- [x] **Do not create city pages for near-identical intent** — already the explicit design of
      `/service-areas` (see its `justification` in `content/seo.ts`): the 18 existing
      `/service-areas/[slug]` pages differentiate via local crash-data, named intersections, and
      county-specific PIP framing rather than templated city swaps. Worth re-validating this holds up
      once Ahrefs shows whether any pair of these pages is actually competing for the same query.
- [ ] **Identify potential cannibalization** — see below; not fully resolved.
- [ ] **Identify pages whose current title/H1/content target different intents** — partially
      checked; one confirmed issue below, condition-page content bodies not yet fully audited.
- [x] **Record recommended internal-link anchors** — see below.

### Cannibalization risks found

1. **`/` (home) vs. `/car-accident-chiropractor`** — already flagged inside `content/seo.ts`
   itself as a **KNOWN GAP**: both pages currently render four identical shared content blocks
   (`HeroReviewsCarousel`, `AccidentInjuries`, `DoctorProfile`, `PatientReviews`), so they compete
   for accident-adjacent queries even though their `primaryQuery` values are distinct on paper.
   Fix is tracked as ONPAGE-02 and has not shipped yet. **This is the single highest-priority
   cannibalization risk in the whole keyword set** — flag it loudly in the final report; several
   seed keywords above ("chiropractor after car accident," "car accident chiropractor deerfield
   beach") are at risk until ONPAGE-02 lands.

2. **`/conditions/neck-pain` vs. `/conditions/whiplash` vs. `/car-accident-chiropractor`** — three
   pages touch neck pain. Current design intent (per each route's `justification`) is: neck-pain
   = non-accident neck pain, whiplash = post-accident neck pain, car-accident-chiropractor = the
   accident hub. This only holds if `/conditions/neck-pain`'s actual body copy never discusses
   accidents/collisions — **not yet verified against the live page content**, only against the
   route registry's stated intent. Recommend a manual content pass before publish.

3. **`/home-visit-chiropractor` vs. the 18 `/service-areas/[slug]` pages** — both are "home visit"
   pages. Low real risk since the service-area pages are accident-specific and city-scoped outside
   Deerfield Beach, while `/home-visit-chiropractor` is general-purpose and Deerfield-Beach-scoped
   — and it's currently `draft` (gated on service-area/availability verification per ATS-E3 3.7)
   so it isn't indexed yet anyway. Re-check once it publishes.

4. **`/conditions/back-pain` vs. `/car-accident-chiropractor`** for "back pain after car
   accident" — `/conditions/back-pain`'s registered `primaryQuery` is generic, non-accident back
   pain. The accident-flavored variant should stay on `/car-accident-chiropractor` rather than
   bleed into the condition page; confirm the condition page's copy doesn't already claim
   accident-related back pain as its own angle.

### Pages where title/H1 may not match assigned intent

- **`/` and `/car-accident-chiropractor`** (see cannibalization #1) — the home page's title/H1
  target broad "chiropractor Deerfield Beach" intent, but shared content blocks currently pull
  page _content_ toward accident intent that duplicates the dedicated accident page. This is the
  one confirmed instance; a full content audit of the remaining pages (condition pages especially)
  should happen before this map is treated as final, since I have not read every page body in
  full — only route registry metadata (title/H1/`primaryQuery`/`justification`).

### Recommended internal-link anchors

| Destination                          | Suggested anchor text                                    | Link from                                                         |
| ------------------------------------ | -------------------------------------------------------- | ----------------------------------------------------------------- |
| `/`                                  | "chiropractor in Deerfield Beach"                        | Blog articles, service-area pages, footer                         |
| `/car-accident-chiropractor`         | "car accident chiropractor" / "after a car accident"     | Home, service-area pages, blog accident articles                  |
| `/conditions/back-pain`              | "back pain chiropractor" / "lower back pain care"        | Home services grid, blog                                          |
| `/conditions/neck-pain`              | "neck pain chiropractor"                                 | Home services grid, blog                                          |
| `/conditions/sciatica`               | "sciatica treatment" / "pinched nerve care"              | Home body-map region, blog                                        |
| `/conditions/whiplash`               | "whiplash treatment" / "neck pain after a car accident"  | `/car-accident-chiropractor`, service-area pages, blog            |
| `/conditions/cervicogenic-headache`  | "headaches after a car accident"                         | `/car-accident-chiropractor`, service-area pages                  |
| `/services/chiropractic-adjustments` | "chiropractic adjustments"                               | `/services` hub, home                                             |
| `/services/spinal-decompression`     | "spinal decompression"                                   | `/services` hub, `/conditions/sciatica`, `/conditions/back-pain`  |
| `/services/soft-tissue-therapy`      | "soft-tissue therapy" / "massage therapy"                | `/services` hub                                                   |
| `/services/cupping-therapy`          | "cupping therapy"                                        | `/services` hub                                                   |
| `/home-visit-chiropractor`           | "home visit chiropractor"                                | `/car-accident-chiropractor`, service-area pages (once published) |
| `/service-areas/[slug]`              | "[city] car accident chiropractor" / "[city] home visit" | `/service-areas` hub, `/car-accident-chiropractor`                |
| `/book-an-appointment`               | "request an appointment"                                 | Every commercial page's CTA                                       |

Note: `getRouteHref()` in `content/seo.ts` already makes it structurally impossible to link to a
draft/unpublished route (returns `null`), and `content/internal-links.test.ts` (LINK-01) already
enforces that every checked card/region only links to published routes. Anchors for currently
`draft` destinations above should not go live until those pages publish.

---

## Ahrefs fields — partially filled in from ATS-SEO-003

ATS-SEO-003's competitor exports (docs/ATS-SEO-003-competitor-organic-research.md) landed 2 real
data points, folded into the tables above — but they only cover keywords a _researched
competitor happens to already rank for_; they don't give volume/KD/CPC for the rest of this doc's
seed list. The following remain **not yet available** for most rows: `volume`, `KD`,
`traffic potential`, `CPC`, `parent topic`, `current ranking URL if any`, `top ranking page
types`, `local-pack presence`, `AI Overview / other SERP-feature presence`, `competitor URLs
ranking`. `intent` has been inferred manually above (commercial vs. informational) but should be
confirmed against Ahrefs's own intent classification.

Closing this fully needs a direct **Keywords Explorer** pull on this doc's own seed list (not
another competitor export) — see ATS-SEO-003's cross-reference note for why competitor exports
can't substitute for that.

**Also pending:** the "expand in Ahrefs" instruction on the seed clusters — this doc only covers
the seed keywords listed in the ticket. Once Ahrefs data is available, expand each cluster with
its actual keyword variants/volumes and re-run this mapping, since real search volume may surface
additional clusters not in the seed list (or reveal that a seed keyword has negligible volume and
shouldn't drive a page decision).

## Acceptance criteria status

- [ ] Final keyword map covers every indexable commercial/condition page — **partial**: all
      current indexable routes have an assigned cluster above; blog `/blog/[slug]` articles are not
      individually enumerated since blog content is CMS-managed, not static — informational seed terms
      route to `/blog` as a hub, not to specific article URLs.
- [x] No two pages intentionally target the same primary cluster without a documented reason —
      true today per `seo.test.ts`'s primary-query uniqueness check; the one _unintentional_ overlap
      (home vs. car-accident-chiropractor, cannibalization #1) is explicitly flagged, not silently
      accepted.
- [ ] Keyword map is included in the final report / route matrix (ATS-SEO-131) — pending that
      ticket.
