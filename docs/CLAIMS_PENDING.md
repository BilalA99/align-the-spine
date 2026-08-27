# Claims pending

Non-blocking log of items worth the client's attention but not worth gating the site on. Per implementation-brief update #4 (2026-08-11): if something looks worth a second look, it goes here and the build keeps moving — it does not get deleted, hedged, or held back.

## Google Business Profile hours mismatch

The site now states **8:00 AM – 9:00 PM, Monday–Sunday** (`content/site.ts`, `hoursVerified: true`, client-directed 2026-08-26). Whatever the Google Business Profile listing currently shows, it needs to match this: Google's local-pack "open now" filter reads the GBP listing, not this site, so any window where the two disagree will show the practice as closed even though the site (correctly) says it's open. These hours also feed `openingHoursSpecification` in the LocalBusiness JSON-LD (08:00–21:00), so a mismatch is visible to Google twice over. The client should update the GBP listing to 8:00 AM – 9:00 PM. Not a code fix — flagged here for follow-up.

## `reviewsRating` (5.0 / 164) sourcing

`content/site.ts`'s `reviewsRating` and the derived doctor-profile star badge are marked `verified` with source "Client-confirmed (implementation brief update #4, 2026-08-11)" — i.e. asserted directly in a brief document, not an independently-checkable record (a Places API response, a GBP screenshot, a client email). This is fine to ship per the client's explicit confirmation, but is worth reconciling against a live source once the `/reviews` page's Places API integration ships (see the main brief §9) — at that point `reviewsRating` should switch to reading the live-fetched count/rating rather than this static value, so the two can never drift apart.

## `pipHandling` wording

Reworded from the original "$0 with PIP" to "PIP accepted" specifically to avoid stating a dollar figure — see `content/site.ts`'s comment for the Fla. Stat. 627.736(1)(a) reasoning. If the practice wants a more specific insurance-billing claim on the site later, it should go through the same verification path, not reintroduce a coverage guarantee.
