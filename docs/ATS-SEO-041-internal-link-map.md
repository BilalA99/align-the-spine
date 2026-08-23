# ATS-SEO-041 — Contextual internal-link map audit

**Status:** Implementation complete for every relationship that's currently actionable.
**Not yet committed.**

## Critical bug found (via the requested Ahrefs re-crawl): every page was non-indexable

Not part of this ticket's own checklist, but found while gathering the QA evidence this ticket
asked for. A fresh Ahrefs Site Audit crawl came back with **Indexable: 0, Non-indexable: 40** —
every single crawled page. Cause: Vercel's production project only has `www.chirobackpain.com`
attached as a domain (confirmed via the project's Environments settings), but `SITE_URL` — which
builds every canonical tag, sitemap URL, and OG/Twitter URL (`lib/seo/metadata.ts`) — was
documented in `.env.example` (and, per the crawl evidence, set in production) as
`https://chirobackpain.com`, no `www`. Every page's canonical tag pointed cross-host to a domain
Ahrefs (and Google) never actually crawled as itself — textbook non-self-referencing canonical,
which is exactly why 28 pages showed "Canonicalized" and 8 showed "Canonicalized + Noindex,"
summing to all 36 HTML pages crawled.

**Fixed the code side:** `content/site.ts`'s `resolveSiteUrl()` non-production fallback and
`.env.example`'s documented value both updated to `https://www.chirobackpain.com`. Verified live
via `curl`: canonical, `og:url`, and every sitemap `<loc>` now correctly resolve to the `www`
host. **Still needs a manual step from you:** update the actual `SITE_URL` environment variable
in Vercel's production settings to match — I can't do that myself, it's outside the repo. Once
that's updated and redeployed, ask for another Site Audit crawl to confirm `Indexable` jumps from
0 to the real page count.

This predates this session's commits (the Ahrefs report's "Compare with: 20 Aug" column showed
zero change), so it isn't a regression from ATS-SEO-041's own work — it was just invisible until
this ticket's QA-evidence step asked for a real crawl.

## Bug found: `/contact-us` was a genuine orphan indexable page

`content/seo.ts` registers `/contact-us` as published (priority 0.6, in the sitemap), with its
own justification calling it "the canonical location block." But its footer link
(`content/site.ts`) was **commented out**, it isn't in the main nav, and a full-repo grep found
**zero** inbound links from any published page — the only references were a legacy redirect
destination and a link from `/thank-you` (itself noindex, not in the route registry). This
directly violated "no orphan indexable pages."

**Fixed:** uncommented the footer link. `footer.tsx` renders `siteConfig.footer.links`
server-side with no client gating, so this immediately gives every page on the site a real,
crawlable `<a href="/contact-us">` in raw HTML — verified via `curl` against the homepage.

## Per-relationship audit

| Relationship                                                             | Status before this ticket                                              | Action                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home → Services                                                          | ✅ (ATS-SEO-050)                                                       | none                                                                                                                                                                                                                                                                                                                                                                                                    |
| Home → core published Conditions                                         | ✅ (ATS-SEO-050)                                                       | none                                                                                                                                                                                                                                                                                                                                                                                                    |
| Home → Accident page                                                     | ✅ (ATS-SEO-050 + nav)                                                 | none                                                                                                                                                                                                                                                                                                                                                                                                    |
| Home → About                                                             | ✅ (ATS-SEO-050)                                                       | none                                                                                                                                                                                                                                                                                                                                                                                                    |
| Home → Reviews                                                           | ✅ (ATS-SEO-050)                                                       | none                                                                                                                                                                                                                                                                                                                                                                                                    |
| Services → related Conditions                                            | ❌ `ServiceCatalog` had zero outbound links                            | **Added** "See the conditions we treat" → `/conditions`, in `ServiceCatalog` (used only on `/services` — no self-link risk).                                                                                                                                                                                                                                                                            |
| Conditions → related Services                                            | ✅ already present                                                     | Every condition page I checked (whiplash, back-pain, neck-pain, sciatica, cervicogenic-headache, concussion, tmj-jaw-pain) already links inline to relevant `/services/*` pages. No change needed.                                                                                                                                                                                                      |
| Conditions → Accident page, collision-relevant only                      | ✅ already present, correctly scoped                                   | whiplash/back-pain/neck-pain/cervicogenic-headache/concussion/tmj-jaw-pain (all genuinely accident-adjacent) link to `/car-accident-chiropractor`; sciatica does not (least accident-specific of the 7) — matches "only when collision relevance is natural." No change needed.                                                                                                                         |
| Accident page → Whiplash/Neck Pain/Back Pain, when publishable           | ⏸️ **Deliberately not added**                                          | All 3 target routes are still `status: "draft"`. Per this ticket's own rule ("no link to a draft page unless intentional UX requires it"), I did not add these — they're literally conditioned on "when publishable" in the ticket text itself. Revisit once ATS-E4's clinician sign-off lands on any of the 3.                                                                                         |
| Blog → relevant service/condition/commercial page                        | ✅ code path verified, content is editorial                            | `content-article.tsx`'s closing CTA already links to `/book-an-appointment`; in-body contextual links depend on each post's CMS content blocks, which is editorial, not something a static code change can audit or fix. Out of this ticket's scope.                                                                                                                                                    |
| Service-area pages → Deerfield Beach office / home-visit / accident page | ❌ zero links in 19 pages                                              | **Added** a link row (`/contact-us`, `/car-accident-chiropractor`) to `app/service-areas/[slug]/page.tsx` — scoped to that page specifically, not `content-article.tsx` (shared with `/blog/[slug]`), so blog posts are unaffected.                                                                                                                                                                     |
| About → Services / Accident care                                         | ❌ zero page-specific links                                            | **Added** "Explore our services" → `/services`, "Car accident care with Dr. Abe" → `/car-accident-chiropractor`.                                                                                                                                                                                                                                                                                        |
| Reviews → Appointment request / contact                                  | ⚠️ only an in-page form + `tel:` link, no real page-to-page `<a href>` | **Added** "Request an appointment" → `/book-an-appointment`, "Contact our Deerfield Beach office" → `/contact-us`. (The existing "Request an appointment" button is a `<button onClick>` scroll-to-form, not a link — kept as-is, it's a legitimate same-page UX pattern per its own doc comment, not a violation of "no JS-only navigation for critical links," which is about inter-page navigation.) |
| Service pages → closely related condition content                        | ✅ already present (3 of 4)                                            | chiropractic-adjustments, spinal-decompression, and soft-tissue-therapy all link to relevant `/conditions/*` pages. `cupping-therapy` doesn't (it's a general modality without one obvious matching condition) — left as-is rather than forcing an unnatural link, per "descriptive natural anchors."                                                                                                   |

## Implementation rules

- [x] **Descriptive natural anchors** — every new link uses distinct, context-specific text
      ("Explore our services," "Car accident care with Dr. Abe," "Our verified Deerfield Beach
      office," "Contact our Deerfield Beach office," etc.) — no generic "click here" or bare
      exact-match repeats.
- [x] **Do not repeat the same exact-match anchor unnaturally** — checked: no two new links
      share identical anchor text, even where they point to the same destination from different pages.
- [x] **Avoid sitewide footer spam for condition keywords** — deliberately did _not_ add a
      condition link to the shared `content-article.tsx` (which would've spammed every blog post
      regardless of topic); scoped the service-area fix to that one page instead.
- [x] **No JavaScript-only navigation for critical links** — every new link is a real Next.js
      `<Link>`/`<a>`; verified in raw HTML via `curl` for every touched page (below).
- [x] **Links must exist as `<a href>` in raw HTML** — same verification.
- [x] **No link to a draft page unless intentional UX requires it** — none of the new links
      target a draft route; the one relationship that would require it (Accident page → Whiplash/
      Neck Pain/Back Pain) was deliberately left unfixed per the ticket's own "when publishable"
      condition.
- [x] **No orphan indexable pages** — `/contact-us` was the one confirmed orphan; fixed.

## Acceptance criteria

- [x] **Every indexable priority page has at least one relevant inbound internal link** —
      `/contact-us` fixed; every other published route already had inbound links via nav/footer/body
      content, confirmed during this audit.
- [x] **Every priority page links to at least one logical next step** — booking CTAs already
      present everywhere; the pages missing a _topical_ next step (About, Services, Reviews,
      service-areas) now have one.
- [ ] **Ahrefs / internal crawl shows no priority orphan** — I can't run Ahrefs myself; this needs
      a fresh crawl from you to confirm post-fix. The static-code audit above is as far as I can
      verify without it.
- [x] **Raw HTML proves links are crawlable** — verified via `curl` for every touched page, see
      below.

## Verification

```
=== /contact-us now linked from homepage footer ===
href="/contact-us">Contact Us<

=== /about ===
href="/car-accident-chiropractor">Car accident care with Dr. Abe<
href="/services">Explore our services<

=== /services ===
href="/conditions">See the conditions we treat<

=== /reviews ===
href="/book-an-appointment">Request an appointment<
href="/contact-us">Contact our Deerfield Beach office<

=== /service-areas/boca-raton ===
href="/car-accident-chiropractor">Car accident chiropractic care<
href="/contact-us">Our verified Deerfield Beach office<
```

Self-link guards checked live: `/car-accident-chiropractor` shows zero copies of "See our full
car accident care page" (the homepage-shared `AccidentInjuries` link from ATS-SEO-050, still
correctly gated). `/contact-us` itself returns 200.

Full test suite: 282/282 pass. `tsc --noEmit` clean. `eslint` clean on every touched file.

## Files touched (not yet committed)

- `content/site.ts` — uncommented the `/contact-us` footer link (fixes the orphan sitewide);
  fixed `resolveSiteUrl()`'s fallback domain (the critical canonical-mismatch bug above).
- `content/site.test.ts` — updated the fallback-domain test to match.
- `.env.example` — documented the corrected `SITE_URL` value.
- `app/about/page.tsx` — 2 new links.
- `app/reviews/page.tsx` — 2 new links.
- `app/service-areas/[slug]/page.tsx` — 2 new links (scoped to this page, not the shared
  `content-article.tsx`).
- `components/sections/service-catalog.tsx` — 1 new link.

**Manual step still needed from you (outside the repo):** update the `SITE_URL` environment
variable in Vercel's production project settings to `https://www.chirobackpain.com`, then
redeploy and re-run the Ahrefs crawl.
