# ATS-SEO-043 — Related-content modules audit

**Status:** Implementation complete. **Not yet committed.**

**Depends on:** ATS-SEO-041 (link map) — used to decide which paths belong in each page's related
row (conditions, services, accident-care, blog, next-step CTA).

## What was actually wrong (found during the audit)

The existing `RelatedConditions` component (reused, not rebuilt — see "Build or reuse" below) was
already wired into 8 pages, fed by hand-typed `ConditionRelatedLink[]` arrays
(`{ label, href, highlighted? }`) in each condition/service page's content file. Auditing all of
them turned up concrete, live bugs:

- **Self-links.** `back-pain-page.ts`'s and `neck-pain-page.ts`'s own "bottom" related-link rows
  each included a pill linking back to the very page it renders on ("Lower Back Pain" →
  `/conditions/back-pain`, on the back-pain page itself).
- **Mismatched anchor text and destination.** `whiplash-page.ts`'s mid-page row had 3 pills whose
  _label_ named one condition while the _href_ pointed somewhere else entirely: "Cervicogenic
  Headache" → `/conditions/neck-pain`, "TMJ / Jaw Pain from Trauma" → `/services#adjustments`,
  "Concussion / Post-Concussion Syndrome" → `/car-accident-chiropractor`.
- **Direct links to draft pages.** Every "bottom" row across 5 condition pages plus
  `spinal-decompression` included "Home Visit Care" → `/home-visit-chiropractor`, which is
  `status: "draft"` — a noindex page linked as if it were live.
- **Copy-pasted, unrelated content.** `soft-tissue-therapy`'s page reused
  `sciaticaRelatedBottom` (sciatica's own related-links array) wholesale — a massage-therapy page
  showing sciatica's related links. Its own doc comment already flagged this as a known gap.
- **Documented but never built.** `cervicogenic-headache`'s page doc comment described a
  "RelatedConditions (8-pill bottom row)" in its stated section order — no such component was
  actually rendered anywhere in the page.
- **Genuinely thin.** `cupping-therapy`'s entire page body had exactly one outbound link, to
  `/services/soft-tissue-therapy` — no accident-care, condition, or blog link at all.

All of this is the direct root cause of this ticket's "audit shows weak contextual links"
condition — not a hypothetical, a confirmed, load-bearing bug across 6+ pages.

## Fix: `content/related-links.ts` — `buildRelatedLinks()`

Reuses the existing `RelatedConditions` render component (pill row, `highlighted` support already
built in for the next-step CTA) — only the _data_ layer was broken, so only the data layer needed
rebuilding, per the ticket's "Build or reuse" framing.

`buildRelatedLinks({ currentPath, paths, highlightPath })`:

- Resolves each path's label from one small map (`RELATED_LINK_LABELS`), and its href from
  `content/seo.ts`'s route registry — the same input path drives both, so a label can never point
  at a different destination than what it says (structurally impossible now, not just
  "remembered").
- Drops `currentPath` from its own result (no self-links, ever).
- Drops any path whose route is `status: "draft"` (`isPublished()` check) — the row just gets
  shorter, never links to a noindex page.
- Throws for a path that isn't a registered route at all — a typo fails the build instead of
  silently vanishing.

7 tests in `content/related-links.test.ts`, including one that deliberately checks the throw
behavior and one confirming self-link exclusion.

**Circular-import note:** `content/seo.ts` imports `xHero` from each condition/service content
file to build its route registry — so those same files can't import `related-links.ts` (which
itself imports `content/seo.ts`) without creating a cycle. Worked around by keeping each content
file's export a **plain path-config object** (`{ paths, highlightPath }`, no function call, no
`related-links.ts` import) and calling `buildRelatedLinks()` from the page component instead,
which isn't on `content/seo.ts`'s import graph. Documented inline at every site this applies.

## Categories covered per page (the ticket's 5 requirements)

Each touched page's related-content row now draws from all 5, where a path is currently
published:

- **Related conditions** — e.g. whiplash ↔ cervicogenic-headache/neck-pain.
- **Related services** — e.g. back-pain → spinal-decompression.
- **Accident-care resource** — `/car-accident-chiropractor` on every condition/service page.
- **Relevant blog resources** — `/blog` (the hub; individual-post targeting is CMS-editorial, out
  of static-code scope — same conclusion as ATS-SEO-021's blog-metadata audit).
- **Next-step CTA** — `/book-an-appointment`, rendered as the highlighted (solid) pill.

**Important, honest caveat:** every specific condition page (7 of 7) and every specific service
page (4 of 4) is currently `status: "draft"`. `buildRelatedLinks()` correctly excludes all of
them today, so most pages' "related conditions/services" pills currently render as just the
`/conditions` and `/services` hub links plus the 3 always-published categories — not because the
curated path lists are wrong, but because almost nothing specific is publishable yet. Once any
condition/service page publishes, its pills will start appearing everywhere it's listed as a
related path, automatically, with no further code change.

## Pages fixed

| Page                                 | Before                                                                                                           | After                                                                                                            |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `/conditions/back-pain`              | Self-link + 2 draft links in "bottom" row                                                                        | Corrected, self-link-free, draft-safe                                                                            |
| `/conditions/neck-pain`              | Self-link + 2 draft links                                                                                        | Corrected                                                                                                        |
| `/conditions/whiplash`               | 3 mismatched label/href pills + draft links                                                                      | Corrected — the mismatch bug is now structurally impossible                                                      |
| `/conditions/sciatica`               | Draft-only mid-page row, generic bottom row                                                                      | Corrected                                                                                                        |
| `/conditions/concussion`             | Mislabeled "Related concussion conditions" (not actually concussion types) + draft links                         | Corrected                                                                                                        |
| `/conditions/tmj-jaw-pain`           | Draft links (Home Visit Care, etc.)                                                                              | Corrected                                                                                                        |
| `/conditions/cervicogenic-headache`  | **Documented but never implemented**                                                                             | Added                                                                                                            |
| `/services/spinal-decompression`     | Self-link ("Spinal Decompression" → itself) + draft links                                                        | Corrected                                                                                                        |
| `/services/soft-tissue-therapy`      | Reused sciatica's unrelated array wholesale                                                                      | Now has its own, page-specific list                                                                              |
| `/services/cupping-therapy`          | **1 link in the entire page body**                                                                               | Added a full related-content row                                                                                 |
| `/services/chiropractic-adjustments` | Already has 6 real inline prose links (whiplash/neck-pain/back-pain/sciatica/spinal-decompression/accident page) | **Left alone** — adding a redundant pill row would duplicate existing, working links and read as a keyword cloud |

## Implementation rules

- [x] **Server-rendered links** — `RelatedConditions` renders plain `<Link>`s, no client-side
      gating; verified in raw HTML via `curl` for every touched page.
- [x] **Route-aware** — every href is resolved from `content/seo.ts`'s registry, not hand-typed.
- [x] **Only includes existing routes/data** — `getRoute()` throws for anything unregistered.
- [x] **Excludes draft/unavailable destinations** — `isPublished()` check; verified live (no
      `/home-visit-chiropractor`, no draft condition/service path appears anywhere in the new rows).
- [x] **Descriptive anchor text** — one label per path, sourced from the same map every page uses,
      no vague "click here."
- [x] **Does not become a keyword cloud** — each page's path list is curated (topically adjacent
      conditions/services only, 5-7 items), not every route dumped on every page; and
      `chiropractic-adjustments` was deliberately left alone rather than padded with a redundant row.

## Acceptance criteria

- [x] **Component improves linking on at least the condition/service/blog page families where
      audit shows weak contextual links** — 9 condition/service pages fixed or newly added; blog's
      existing `RelatedContent`/CMS mechanism was audited and found adequate (ATS-SEO-021's prior
      conclusion still holds).
- [x] **No broken/draft links** — verified live via `curl`: only `/conditions`, `/services`,
      `/car-accident-chiropractor`, `/blog`, `/book-an-appointment`, and any currently-published
      specific condition/service appear in the new rows on any page.
- [x] **Visible links exist in raw HTML** — same `curl` verification, real anchor text + href
      pairs present in the initial HTML response.

## Verification

Full test suite: 289/289 pass (7 new tests in `content/related-links.test.ts`). `tsc --noEmit`
clean. `eslint` clean on every touched file. `curl`-verified live against the dev server for all
10 touched pages — self-link exclusion and draft-link exclusion both confirmed with zero
exceptions.

## Files touched (not yet committed)

- `content/related-links.ts` (new) + `content/related-links.test.ts` (new).
- `content/back-pain-page.ts`, `content/neck-pain-page.ts`, `content/sciatica-page.ts`,
  `content/concussion-page.ts`, `content/tmj-jaw-pain-page.ts`, `content/whiplash-page.ts`,
  `content/cervicogenic-headache-page.ts`, `content/cupping-therapy-page.ts` — related-link
  arrays replaced with plain path-config objects.
- `app/conditions/back-pain/page.tsx`, `app/conditions/neck-pain/page.tsx`,
  `app/conditions/sciatica/page.tsx`, `app/conditions/concussion/page.tsx`,
  `app/conditions/tmj-jaw-pain/page.tsx`, `app/conditions/whiplash/page.tsx`,
  `app/conditions/cervicogenic-headache/page.tsx` (new usage),
  `app/services/spinal-decompression/page.tsx`, `app/services/soft-tissue-therapy/page.tsx`,
  `app/services/cupping-therapy/page.tsx` (new usage) — now call `buildRelatedLinks()`.
