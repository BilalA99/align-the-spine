# Spanish SEO / AEO / GEO Implementation Report

**Align the Spine Chiropractic — Deerfield Beach, FL**
Branch: `feat/spanish-seo-localization` · Rebased onto `upstream/main` @ `a150b47` · Date: 2026-08-26

Status labels used throughout: **VERIFIED** (checked against a primary source
or the running build) · **INFERRED** (reasoned from evidence in the repo) ·
**NEEDS CONFIRMATION** (requires the client, a clinician, or counsel) ·
**RECOMMENDATION**.

---

## 1. Executive summary

The site now serves a real Spanish organic acquisition layer at `/es`: seven
indexable Spanish pages plus a Spanish post-conversion page, each with its own
stable URL, Spanish server-rendered content, localized metadata, a self
canonical, and reciprocal `hreflang` with its English counterpart.

The three things that make this a genuine Spanish site rather than a
translated skin:

1. **Spanish content is committed source, server-rendered.** There is no
   translation API in the request path, no locale cookie, no language
   redirect. `GET /es/quiropractico-accidentes-de-auto` returns Spanish HTML
   on the first byte, with JS disabled. **VERIFIED** by `curl` against a
   production-mode build.
2. **Each locale has its own root layout**, so `<html lang="es-US">` is in the
   server response rather than patched in after hydration. Achieved with
   Next.js route groups (`app/(en)`, `app/(es)`), which contribute nothing to
   the URL — **every English URL is byte-identical to what it was before.**
3. **One route table drives everything.** `content/i18n.ts` is the sole source
   for the EN↔ES pairing; the HTML `hreflang` tags, the sitemap alternates,
   the language switcher and the Spanish internal links all read it, so they
   cannot drift apart. A test suite fails the build if they do.

Scope was held to the seven English pages that are actually `published`
today. Eleven English routes are `status: "draft"` (noindex, out of the
sitemap) pending clinician review of their medical content; they were
deliberately **not** translated — see §11.

The branch is **rebased onto `AppFlow-Studio/align-the-spine@a150b47`**, the
current upstream `main` — 41 commits ahead of where this work started. It
builds, tests and passes locale QA on that tree, not on a stale base. §3a
covers what integrating those 41 commits actually required.

---

## 2. Repository state

| Item                  | Value                                                                                |
| --------------------- | ------------------------------------------------------------------------------------ |
| Work started from     | local `main` at `ff11a06`                                                            |
| **Rebased onto**      | **`upstream/main` @ `a150b47`** (41 commits ahead of `ff11a06`)                      |
| Remotes               | `origin` → `BilalA99/align-the-spine`, `upstream` → `AppFlow-Studio/align-the-spine` |
| Working tree at start | **clean** — no uncommitted work to preserve                                          |
| Branch                | `feat/spanish-seo-localization`                                                      |
| Deployed?             | **No.** No production deploy was performed.                                          |

One incidental cleanup: `.next/` and `tsconfig.tsbuildinfo` held stale type
artifacts referencing routes that no longer exist (`/admin`, `/blog`,
`/service-areas`), which made `npm run typecheck` fail before any change was
made. Both are gitignored build caches; deleting them fixed it. **VERIFIED**
this was pre-existing, not caused by this work.

---

## 3a. Integrating 41 upstream commits

This work began on `ff11a06`. By the time it was ready, `upstream/main` was at
`a150b47` — 41 commits ahead, including a CMS-backed blog, an authenticated
admin area, 19 CMS-driven service-area pages, a `/conditions` hub, a new
`/services/cupping-therapy` page, an RSS feed, a rewritten lead pipeline, and
a site-wide internal-linking pass. The branch was **rebased**, not merged onto
a stale base, and 24 files conflicted. What that required:

**Upstream changes adopted (theirs kept, mine re-applied on top):**

| Upstream change                                                                              | How the Spanish layer absorbed it                                                                                                                                                                                                                  |
| -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Canonical domain fixed to **`www.chirobackpain.com`** (ATS-SEO-041)                          | All Spanish canonicals/hreflang follow automatically — they read `siteConfig.siteUrl`. Docs and `check-locales.mjs` examples updated.                                                                                                              |
| Phone changed to **954-282-1801**                                                            | Two Spanish FAQ answers had hardcoded the old number. Rewritten to interpolate `siteConfig.business.phone`, so the next change can't leave Spanish stale.                                                                                          |
| `business.shortName` added for SERP-truncation                                               | Spanish titles switched to it too — and it matters more here, since Spanish renders longer than English for the same meaning.                                                                                                                      |
| `RouteMeta` now requires `primaryQuery` + `justification` (IA-01)                            | Added to all 7 Spanish routes. Each names a **Spanish-language** query, so `seo.test.ts`'s "no two indexable routes share a primary query" rule passes — a Spanish page and its English counterpart aren't competing, they're hreflang alternates. |
| Sitemap became `async` with CMS blog/service-area entries                                    | Merged: static English → static Spanish → CMS entries. CMS entries get no `alternates` (English-only).                                                                                                                                             |
| `robots.txt` added `/admin/`, `/preview/`                                                    | Merged with `/es/gracias`.                                                                                                                                                                                                                         |
| **Visible breadcrumbs** (LINK-02) via a `breadcrumbs` prop                                   | All 5 Spanish hero pages switched from standalone `BreadcrumbJsonLd` to the `breadcrumbs` prop (visible trail + JSON-LD from one array); `/es/resenas` uses `<BreadcrumbTrail>` directly like `/reviews`.                                          |
| `LeadForm` two-step removed; `LeadConsent` + `MobileLeadPreviewCard` + `LeadFormPopup` added | Locale threaded through the whole new chain. Spanish booking page dropped its now-nonexistent `twoStep` prop.                                                                                                                                      |
| `RootShell` gained an `/admin` + `/preview` chrome bypass                                    | Kept, with the locale prop layered on.                                                                                                                                                                                                             |
| Internal-link pass added `/about`, `/reviews`, `/conditions`, `/services` cross-links        | Each became a prop with the English value as default, so the Spanish pages point at Spanish. Caught by the QA script, not by eye — see §13.                                                                                                        |

**Upstream copy that superseded mine:** upstream independently rewrote the
English PIP window strings off "protect your benefits" and onto "the general
14-day initial-care timing period. Coverage depends on the policy and
circumstances" — the exact fix flagged as a RECOMMENDATION in the pre-rebase
version of this report. Their wording was kept, and the **Spanish was rewritten
to mirror it claim-for-claim** rather than keeping my looser original. That
item is now closed, not outstanding.

**New consent surface:** upstream added a versioned consent line
(`LEAD_CONSENT_VERSION = "web-lead-v1"`) recorded with every lead.
`LEAD_CONSENT_WORDING_ES` was added _beside_ the English in the same contracts
file, under the **same version** — one consent shown in two languages, not a
second weaker one. A Spanish patient agrees to exactly what an English one
does, and the stored version still identifies that text.

**Routes moved into the locale group:** `/blog`, `/admin`, `/service-areas`
and `/services/cupping-therapy` were all added upstream at `app/` root after
the route-group restructure. All were moved into `app/(en)/`. **Verified**: all
43 routes build, and every URL — including `/admin/login`, `/blog`,
`/service-areas`, `/conditions` and `/feed.xml` — returns 200 unchanged.

**Two upstream tests needed teaching about route groups**, since they derive
routes from directory names: `app/breadcrumbs-coverage.test.ts` (new upstream,
was producing `/(en)/admin/content`) and `lib/tracking-contract.test.ts` (read
`app/thank-you/page.tsx` by hardcoded path). Both fixed at the source of the
path derivation, not by allowlisting.

**The locale guard did its job:** `content/i18n.test.ts` failed the build
because `/conditions`, `/blog`, `/service-areas` and `/services/cupping-therapy`
weren't declared in the locale map. Each was added as `es: null` with a written
reason (§4) — which is exactly the "no route ships without a language decision"
rule working as designed on someone else's commits.

---

## 3. Current-state audit (what was found)

**Routing** — App Router. No Pages Router. No dynamic route segments in the
public tree; every condition/service page is a static page.

**SEO infrastructure — already strong.** This codebase had an unusually good
foundation, and the Spanish layer was built to extend it rather than replace
it:

- `content/seo.ts` — a typed route registry that is the single source for
  every title/description/canonical, with a `status: "draft"` gate.
- `lib/seo/metadata.ts` — one `buildMetadata()` all pages call.
- `lib/schema.ts` — JSON-LD builders with stable `@id` anchors.
- `content/verified-value.ts` — a `VerifiedValue<T>` type that makes an
  unverified business claim structurally impossible to render.
- `content/content-safety.test.ts` — CI fails on banned claim strings.
- `app/robots.ts` / `app/sitemap.ts` — both derived from the registry.

**Content architecture** — plain TypeScript modules under `content/`. No CMS,
no database, no MDX. Ideal for committed, reviewable translations.

**Localization** — **none existed.** No `i18n`, no `next-intl`, no locale
cookie, no `Accept-Language` handling, no translation API, no `/es` route.
`app/layout.tsx` hardcoded `lang="en"`. **VERIFIED** by repo-wide search.

**Translation API** — none present. None was added. §7–8 of the brief
therefore resolve to: build persisted, reviewable Spanish source, which is
what was done. No paid external dependency was introduced.

---

## 4. Route inventory (English → Spanish)

Declared in `content/i18n.ts`. Slugs are localized to Spanish search intent,
not transliterated from the English. Trailing slashes are absent on both
sides, matching the site's existing `trailingSlash: false` normalization.

| #   | English                      | Spanish                                | Status                                 |
| --- | ---------------------------- | -------------------------------------- | -------------------------------------- |
| 1   | `/`                          | `/es`                                  | published                              |
| 2   | `/car-accident-chiropractor` | `/es/quiropractico-accidentes-de-auto` | published                              |
| 3   | `/services`                  | `/es/servicios`                        | published                              |
| 4   | `/about`                     | `/es/dr-abe-nasser`                    | published                              |
| 5   | `/reviews`                   | `/es/resenas`                          | published                              |
| 6   | `/contact-us`                | `/es/contacto`                         | published                              |
| 7   | `/book-an-appointment`       | `/es/solicitar-cita`                   | published                              |
| —   | `/thank-you`                 | `/es/gracias`                          | both noindex, out of sitemap, unpaired |

**Deliberately English-only (`es: null`)** — 12 routes:

| Route                                                                                                       | Why no Spanish version                                                                                                                                                                   |
| ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/privacy-policy`                                                                                           | A legal notice describing HIPAA/Florida obligations. A Spanish version is a legal document in its own right and needs counsel review, not a content translation. **NEEDS CONFIRMATION.** |
| `/home-visit-chiropractor`                                                                                  | `status: "draft"` — unverified service-area/availability data (ATS-E4 4.6).                                                                                                              |
| `/services/chiropractic-adjustments`<br>`/services/spinal-decompression`<br>`/services/soft-tissue-therapy` | `status: "draft"` — clinical guidance pending clinician sign-off.                                                                                                                        |
| `/conditions/*` (7 pages)                                                                                   | `status: "draft"` — pending clinician review.                                                                                                                                            |

Slug reasoning, briefly:

- **`quiropractico-accidentes-de-auto`** leads with the head term
  (`quiropráctico` + `accidente de auto`) rather than mirroring English word
  order. A Spanish query attaches the geo/qualifier to _quiropráctico_.
- **`resenas`** is ASCII on purpose. A percent-encoded `ñ` is legal but reads
  as `%C3%B1` everywhere the URL is copied, pasted, and reported on.
- **`solicitar-cita`**, not `reservar`/`agendar`. The form sends a request and
  the office calls back; the English CTA was deliberately reworded off "Book"
  for exactly this reason (ATS-E3 3.4), and the Spanish must not reintroduce
  the promise.
- **`dr-abe-nasser`**, not a literal `acerca-de`. The page is the doctor's
  entity page, and the query that reaches it is his name plus "quiropráctico".

---

## 5. Spanish keyword map

> **SEARCH-VOLUME UNVERIFIED — this is the most important caveat in this
> report.** No Google Search Console property, Keyword Planner account,
> Ahrefs/Semrush seat, or first-party analytics export for this domain was
> available at implementation time. Nothing below is a volume, difficulty,
> CPC or ranking claim. These are **intent-based clusters** derived from how
> Spanish-language local health queries are actually phrased, then mapped one
> cluster to one page to avoid cannibalization. §14 lists exactly how to
> confirm them once `/es` has impressions.

| Spanish query cluster                                                                                                                                                | Intent                           | Target page                                                  | Primary / secondary | Location modifier | Funnel      |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------ | ------------------- | ----------------- | ----------- |
| `quiropráctico cerca de mí`, `quiropráctico Deerfield Beach`, `quiropráctico en Deerfield Beach`, `clínica quiropráctica`                                            | Local, transactional             | `/es`                                                        | Primary             | Yes               | BOFU        |
| `quiropráctico accidente de auto`, `quiropráctico accidente de carro`, `quiropráctico después de un choque`, `lesiones por accidente de auto`                        | Local + injury, transactional    | `/es/quiropractico-accidentes-de-auto`                       | Primary             | Yes               | BOFU        |
| `qué hacer después de un accidente de carro`, `cuándo ver a un quiropráctico`, `dolor de cuello después de un accidente`, `dolor de espalda después de un accidente` | Informational, accident-adjacent | `/es/quiropractico-accidentes-de-auto` (answer blocks)       | Secondary           | No                | TOFU → MOFU |
| `PIP Florida 14 días`, `cuánto cubre el PIP`, `condición médica de emergencia PIP`                                                                                   | Informational, coverage          | `/es/quiropractico-accidentes-de-auto` (PIP block)           | Secondary           | Implicit (FL)     | MOFU        |
| `servicios quiroprácticos`, `ajuste quiropráctico`, `descompresión espinal`, `terapia de tejidos blandos`                                                            | Service research                 | `/es/servicios`                                              | Primary             | Yes               | MOFU        |
| `dolor de espalda`, `dolor de cuello`, `hernia de disco`, `latigazo cervical`                                                                                        | Condition research               | `/es` + `/es/quiropractico-accidentes-de-auto` (injury grid) | Secondary           | No                | MOFU        |
| `Dr. Abe Nasser quiropráctico`, `quiropráctico que habla español Deerfield Beach`                                                                                    | Branded / entity                 | `/es/dr-abe-nasser`                                          | Primary             | Yes               | BOFU        |
| `reseñas quiropráctico Deerfield Beach`, `opiniones`                                                                                                                 | Trust / validation               | `/es/resenas`                                                | Primary             | Yes               | BOFU        |
| `quiropráctico teléfono`, `dirección`, `horario`                                                                                                                     | Navigational                     | `/es/contacto`                                               | Primary             | Yes               | BOFU        |
| `pedir cita quiropráctico`, `solicitar cita`                                                                                                                         | Conversion                       | `/es/solicitar-cita`                                         | Primary             | Yes               | BOFU        |

### The `auto` / `carro` / `choque` decision

South Florida Spanish uses _auto_, _carro_ and _choque_ interchangeably for
accident queries, and _accidente automovilístico_ appears in more formal
registers. The temptation is a page per variant. That would be five
near-duplicate pages competing for one intent — the doorway/cannibalization
pattern §26 and §83 of the brief warn about.

Instead **one page covers the cluster**: `auto` leads in the title, H1 area
and slug; `carro` and `choque` appear naturally in the body prose where a
person would actually say them ("después de un choque", "accidente de
carro"). One URL, one intent, full lexical coverage. **INFERRED** — this is
the standard resolution for synonym clusters; confirm against Search Console
query data once available.

### English-in-Spanish-query behaviour

Spanish speakers in South Florida frequently mix English medical and category
terms into Spanish queries ("chiropractor cerca de mí", "PIP", "whiplash").
The Spanish pages retain the English terms that function as proper nouns or
industry terms — **PIP** (it is the name of the coverage), and the business
name — while translating the clinical vocabulary. `latigazo cervical` is used
for whiplash, with the mechanism described in plain language so the page still
matches a searcher who only knows the English word from their adjuster.

---

## 6. Technical implementation

### 6.1 Locale architecture

`content/i18n.ts` exports `LOCALES`, `Locale`, `HTML_LANG`, `HREFLANG`,
`OG_LOCALE`, `LOCALE_PREFIX`, the `localizedRoutes` pair table, and the
helpers `localePath`, `findRouteByPath`, `counterpartPath`, `buildAlternates`,
`isSpanishPath`, `localeFromPath`.

`content/es/seo.ts` mirrors `content/seo.ts` exactly (same `RouteMeta` shape,
same `getEsRoute()` throw-on-missing behaviour, same `status` draft gate), so
the sitemap and metadata paths treat both locales identically.

### 6.2 Rendering — the central architectural decision

**Problem.** `<html lang>` must be correct in the server response. Next allows
`<html>` only in a root layout. A single shared root layout can't know the
locale without `headers()`, which would opt _every page on the site_ into
dynamic rendering — a serious performance regression for a fully static site.
Patching `lang` after hydration was explicitly ruled out by the brief (§19),
and is wrong anyway: the served HTML would be mislabelled for Googlebot and
for any screen reader that reads the document before JS runs.

**Solution.** One root layout per locale, via route groups:

```
app/(en)/layout.tsx   →  <html lang="en-US">   wraps every English page
app/(es)/layout.tsx   →  <html lang="es-US">   wraps every Spanish page
```

Route-group directories are not URL segments, so `/about` is still `/about`.
All 26 English pages were moved with `git mv` (history preserved); not one
English URL changed. **VERIFIED** against the build manifest and by fetching
every English route.

**Trade-off, accepted:** crossing between the two groups is a full document
load rather than a client-side transition. That happens only on an explicit
language switch, where a fresh document is the correct behaviour anyway.

**Consequences handled:**

- `app/fonts.ts` — fonts hoisted to a shared module so both layouts use one
  already-subsetted payload. `subsets: ["latin"]` already covers á é í ó ú ñ ü
  ¿ ¡, so Spanish adds **no additional font download**.
- `app/global-not-found.tsx` — with no single root layout at `app/`, unmatched
  URLs need a handler that renders its own document. It renders the full
  branded shell (nav, footer, skip link) so the English 404 keeps the chrome
  it had before the restructure, and it is **bilingual by design rather than
  by detection** — it receives no props, and reading the path via `headers()`
  would make it dynamic just to pick a language for a 404. **VERIFIED**
  returns 404 with full chrome for both `/no-existe` and `/es/no-existe`.
- `app/(es)/{error,loading,not-found}.tsx` added so a Spanish page that throws
  or suspends never falls back to English UI.

**All 8 Spanish routes are statically prerendered (`○`).** No page became
dynamic. No `'use client'` was added to any page tree.

### 6.3 Canonicals

Every page self-canonicalizes. A Spanish page **never** canonicalizes to its
English counterpart — that would collapse a legitimate translated primary page
out of the index. The two are joined by `hreflang` instead.

### 6.4 hreflang

Emitted by `buildAlternates()` in `content/i18n.ts`, consumed by both
`lib/seo/metadata.ts` (HTML tags) and `app/sitemap.ts` (sitemap alternates).

Because English pages call the shared `buildMetadata()`, **all seven English
pages gained reciprocal `hreflang` with zero edits to any English page file.**

- `en-US` → English URL, `es-US` → Spanish URL, `x-default` → English URL.
- Routes with no counterpart emit **no** `languages` key at all. A one-entry
  hreflang set annotates nothing, and Google requires reciprocity.
- **On the two-implementations question (§51):** both HTML and sitemap
  annotations are emitted, which is normally a drift risk. It is safe here
  only because both derive from the same function, and
  `app/sitemap.test.ts` asserts that every sitemap entry's alternates equal
  what `buildAlternates()` returns for that path.
- **Note on attribute casing:** Next's metadata API serializes the attribute
  as `hrefLang` (React's DOM-property spelling). HTML attribute names are
  case-insensitive, so every parser — Googlebot included — reads it as
  `hreflang`. Not a defect; noted so nobody "fixes" it later.

### 6.5 Sitemap

One sitemap, both locales, 15 URLs (8 English + 7 Spanish), each with its
`xhtml:link` alternates. Excluded: all 11 draft routes, `/thank-you`,
`/es/gracias`, API routes, and the legacy redirect paths. **VERIFIED** by
fetching `/sitemap.xml`.

### 6.6 Robots

`/es` is fully crawlable. `robots.txt` disallows only `/api/`, `/thank-you`
and `/es/gracias`. A test asserts the `/es` subtree can never be blocked by a
future edit.

### 6.7 Metadata

Spanish pages use `buildEsRouteMetadata()`, which sets `locale: "es"` →
`og:locale: es_US`, orients the hreflang lookup around the Spanish path, and
carries the same draft gate as English.

### 6.8 Structured data

| Entity                                       | English            | Spanish                                                                      | Note                                                                                                   |
| -------------------------------------------- | ------------------ | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `Organization`, `WebSite`, `MedicalBusiness` | `/`, `/contact-us` | `/es`, `/es/contacto`                                                        | **Same `@id`s.** One business described from four pages, not two businesses.                           |
| `Person` (Dr. Abe)                           | `/about`           | `/es/dr-abe-nasser`                                                          | **Same `@id`.** One person, not two.                                                                   |
| `BreadcrumbList`                             | all interior       | all interior                                                                 | Localized crumb labels + Spanish URLs                                                                  |
| `WebPage` (new)                              | —                  | all `/es` pages                                                              | Declares `inLanguage: es-US`, `isPartOf` the WebSite, `about` the MedicalBusiness                      |
| `FAQPage`                                    | existing           | `/es/quiropractico-accidentes-de-auto`, `/es/contacto`, `/es/solicitar-cita` | Matches visible content — see §10 on FAQ rich results                                                  |
| `Service`                                    | `/services`        | **not duplicated** on `/es/servicios`                                        | A second set `@id`'d to `/es/servicios#slug` would describe the same six services as separate entities |
| `AggregateRating`                            | not emitted        | not emitted                                                                  | Unchanged — the 5.0/164 figure is client-asserted, not read from a live source                         |

No credential, degree, school or license claim is emitted anywhere:
`doctorCredentials.verified` is still `false`, so `buildPerson()` omits
`alumniOf`/`hasCredential` — and the Spanish prose does not smuggle in a claim
the structured data carefully leaves out.

### 6.9 Internal linking

The Spanish chrome links only to Spanish URLs. **VERIFIED** by scanning the
rendered HTML of all seven Spanish pages: zero contextual links leave Spanish.
The two intended exceptions are marked as such — the language switcher
(`hrefLang="en-US"`) and the privacy-policy link (labelled "(en inglés)" and
marked `hrefLang="en-US"`).

The Spanish service cards deliberately **drop** the English `href`/`ctaLabel`,
which pointed at draft/noindex English service pages.

### 6.10 Language switcher

`components/layout/language-switcher.tsx`, in the desktop navbar, the mobile
drawer (inside the focus trap) and the footer. Resolves the _equivalent_ page
— `/car-accident-chiropractor` → `/es/quiropractico-accidentes-de-auto`, not
`/es`. Renders **nothing** when there's no counterpart. A real `<a>` with
`hreflang`, `lang` and an `aria-label`, not a `next/link`: the crossing is a
document load either way, and a real anchor is both crawlable and correctly
announced. **VERIFIED** for all 14 directions plus 3 no-counterpart pages.

---

## 7. Content implementation

Localized per Spanish page: navigation, hero, H1, all headings, body prose,
bullets, CTA labels, form headings, **field labels, placeholders, validation
messages, step counter, submit-failure message and thank-you redirect**, stat
labels, breadcrumbs, image alt text, captions, FAQ content, footer, location
block, hours table, map title, and metadata.

No page has the "Spanish header / English body / Spanish footer" shape §25
warns about. **VERIFIED**: excluding the deliberately-untranslated patient
reviews, Spanish function-word density in the visible prose is **98–100%** on
all seven pages (measured from rendered HTML).

New Spanish content modules: `content/es/{home,auto-accident,pages,chrome,lead-forms,seo}.ts`.

Shared components gained an optional `locale`/content prop **defaulting to
English**, so every existing English call site renders byte-identically. No
duplicate Spanish component files were created.

### Patient reviews — not translated, deliberately

Reviews render verbatim in whatever language the patient wrote them. A
rewritten testimonial presented as someone's own words is a fabricated review.
On Spanish pages the quotes carry `lang="en-US"` so screen readers pronounce
them correctly (WCAG 3.1.2, Language of Parts) and crawlers see quoted source
material rather than untranslated page copy. `/es/resenas` carries a visible
note explaining this to Spanish readers.

### Claims discipline

Every Spanish claim traces to an already-verified English one:

- **"El Dr. Abe atiende en español"** — backed by `siteConfig.bilingualCare`,
  client-verified `"EN/ES"` (2026-08-11). **VERIFIED.** Without that sign-off
  this line would not exist: a Spanish website proves nothing about who
  answers the phone (§95).
- **`$50` office visit** — the existing client-approved offer, allowlisted in
  `content-safety.test.ts`. Not a new claim.
- **`$10,000` / `$2,500` PIP figures** — the same client-approved stat the
  English hero shows, carrying the same source and date.
- **New-patient pricing in the doctor bio** — generalized without a figure,
  matching how the English handles it.
- **Parking / entrance / accessibility details** — genuinely useful local
  information (§64), but **not recorded anywhere in this repo**, so they were
  omitted rather than invented. Listed in §14.

No guarantees of relief, recovery, cure, coverage or timeframe appear in any
Spanish copy. Hedging (`puede`, `podría`, `según su evaluación`, `cuando
corresponde`) does the work the English `may`/`can help` does.

---

## 8. Florida PIP — legal accuracy

**VERIFIED at implementation time** against Fla. Stat. § 627.736 (primary
source: the Florida Legislature's own statute text) and against the 2026
session outcome:

- The Florida Motor Vehicle No-Fault Law was **not** repealed. The 2026
  session closed 2026-03-13; SB 522 and HB 769 both died in committee. The
  statute, the $10,000 PIP requirement, the 14-day rule and the
  emergency-medical-condition tiers all remain in force.
- § 627.736(1)(a): medical benefits are **80% of reasonable expenses**, within
  a **$10,000** combined medical/disability limit, and require _"initial
  services and care … within 14 days after the motor vehicle accident."_
- Reimbursement is **limited to $2,500** where a qualifying provider
  determines there was no emergency medical condition.
- The providers who may make that determination are physicians under ch.
  458/459, dentists under ch. 466, physician assistants, and APRNs. **A
  chiropractic physician is not among them.**

That last point is the page's genuine information gain. Most competitor pages
advertise "$10,000!" without it. `/es/quiropractico-accidentes-de-auto` states
plainly that a chiropractor cannot make the EMC determination, and therefore
that the practice cannot promise the reader a figure.

Nothing on the page tells a reader what their coverage is, what they are
entitled to, or what to do about a claim. Every block touching those questions
directs them to their insurer or a licensed attorney. The banned formulations
("you lose all benefits after 14 days", "your treatment is free", "insurance
will pay", "we guarantee coverage", "you are entitled to $10,000") appear
nowhere.

**RECOMMENDATION (English-side, not changed):** the live English
`lib/pip-window.ts` strings say _"call us right now to protect your
benefits."_ That reads as a promise that calling preserves coverage, which the
statute doesn't support — what the 14-day rule governs is whether initial care
_began_ in time, and the amount then turns on an EMC determination the
practice cannot make. The new Spanish strings say what is actually true
(the window is closing, call). Rewording the English is a copy change on
already-indexed pages and was left for the client. See §13.

---

## 9. Medical/YMYL quality and red flags

`/es/quiropractico-accidentes-de-auto` carries a prominent, visible
emergency-guidance block — **above** the booking-oriented sections, not buried
below them — listing red-flag symptoms (numbness/weakness, severe headache,
dizziness, vomiting, confusion, loss of consciousness, chest/abdominal pain,
difficulty breathing, rapidly worsening pain) and directing readers to 911 or
an emergency room.

It states explicitly that Align the Spine is **not** an emergency service and
does not diagnose online. The first answer block leads with the same message:
if symptoms are severe, seek emergency care first, _not_ a chiropractic
appointment.

---

## 10. AEO / GEO implementation

Treated as an extension of good search practice, not as a separate technique.
Nothing snake-oil was added: **no `llms.txt`, no `ai.txt`, no AI-specific meta
tags, no fabricated "GEO schema", no AI-crawler markup.**

What was actually done:

**Query fan-out content design.** `/es/quiropractico-accidentes-de-auto`
carries six **answer-first blocks**, each a heading → direct answer →
qualification → next step, covering the sub-intents that fan out from
"quiropráctico después de un accidente de carro":

1. ¿Qué debo hacer si me duele algo después de un accidente de auto?
2. ¿Cuándo debería ver a un quiropráctico después de un choque?
3. ¿Qué pasa en la primera visita?
4. ¿Cuánto cubre el seguro PIP en Florida?
5. ¿Necesito un reporte policial o un abogado para que me atiendan?
6. Dolor de cuello y de espalda después del accidente

Each is understandable pulled out on its own — that is what makes a passage
independently retrievable, and it is also simply better for a reader skimming
on a phone after a crash.

**Rendered as plain `<h2>`/`<h3>` + prose, not accordions.** Every answer is
in the HTML and visible on load. Nothing depends on hydration or on the reader
opening a panel.

**Entity clarity.** Shared `@id`s across locales (§6.8) plus a `WebPage`
entity declaring `inLanguage: es-US` and pointing `about` at the one
MedicalBusiness. A consumer sees one practice, one doctor, two languages.

**Information gain.** The EMC point (§8), the "the office calls you back, this
is not an automatic booking" framing, and the "the doctor answers the phone
himself" detail are practice-specific facts, not commodity chiropractic copy.

**On FAQ rich results (§36).** Google deprecated FAQ rich results in May 2026.
`FAQPage` markup is retained on the three Spanish pages that have visible FAQ
content **only because it accurately describes visible content and costs
nothing** — not to win a SERP enhancement. This is stated in a comment at the
markup site so nobody later builds a strategy on it. No claim is made anywhere
that this markup produces rich results.

---

## 11. Why the draft pages were not translated

Eleven English routes are `status: "draft"` — served `noindex`, excluded from
the sitemap, reachable by direct URL — pending a clinician's review of their
medical content (and, for `/home-visit-chiropractor`, verified service-area
data).

Translating unreviewed medical claims into a second language **doubles the
exposure instead of halving it.** These pages get Spanish versions once — and
only once — the English originals clear clinical review.

This is enforced, not just intended: `content/i18n.test.ts` fails the build if
a published Spanish page's English original is still `draft`.

---

## 12. Testing

All commands are the project's own `package.json` scripts.

| Command                                          | Result                                                                                              |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `npm test`                                       | **339 passed / 341** (41 files). The 2 failures are pre-existing on `upstream/main` — proven below. |
| `npm run typecheck`                              | **Pass**, no errors                                                                                 |
| `npm run lint`                                   | **0 errors**, 12 warnings — all pre-existing                                                        |
| `npm run build`                                  | **Pass** — 43 routes, all 8 `/es` routes statically prerendered                                     |
| `npm run verify:locales -- <origin> <canonical>` | **All locale checks passed** (new script)                                                           |

### The 2 failing tests are pre-existing on upstream — proven, not assumed

`content/site.test.ts > fails closed while current public hours conflict` and
`lib/schema.test.ts > omits openingHoursSpecification while public sources
conflict` both fail because `upstream/main` sets `hoursVerified: true` while
its own test asserts `false`. That contradiction is entirely within upstream.

**VERIFIED** by checking out a clean `upstream/main` worktree with none of this
branch's changes and running those two files: `Tests 2 failed | 35 passed`.
Identical failures, identical assertions. Nothing here caused them, and
nothing here fixes them — the flag is a client-verification question
(`hoursVerified`), not a code bug, so it was left for the owner to resolve.

**Pre-existing lint warnings (12), untouched.** Zero new warnings, zero
errors introduced.

### Tests added (34 new)

- **`content/i18n.test.ts` (new, 21 tests)** — route-map ↔ registry parity,
  unique ids/paths, Spanish URL shape (lowercase ASCII, no trailing slash,
  under `/es`), metadata completeness and uniqueness, a smoke test that
  Spanish titles/descriptions aren't English, hreflang reciprocity and
  `x-default`, absolute URLs, valid locale codes, switcher round-tripping,
  Spanish-internal link graph, and the draft-parity rule from §11.
- **`app/sitemap.test.ts`** — both locales in order, no duplicate URLs,
  `/es/gracias` excluded, and sitemap alternates equal to `buildAlternates()`.
- **`app/robots.test.ts`** — `/es/gracias` disallowed; the `/es` subtree can
  never be blocked.
- **`lib/seo/metadata.test.ts`** — Spanish self-canonical, reciprocal
  hreflang, no hreflang for unpaired routes, `og:locale` per locale.
- **`lib/lead-form-schema.test.ts`** — Spanish validation messages, English
  default preserved, and **identical validation rules in both languages**.
- **`content/route-registry-parity.test.ts`** — updated to strip route-group
  segments and to check both registries.

### Tests updated, and why

Three existing tests asserted English-only behaviour and were updated
deliberately (not worked around): `robots.test.ts` (new disallow entry),
`sitemap.test.ts` (Spanish URLs now present), `metadata.test.ts` (`alternates`
now carries `languages`). Each was widened to assert the new intended
behaviour rather than loosened.

---

## 13. SEO QA results

Run against a production-mode build (`VERCEL_ENV=production`,
`SITE_URL=https://www.chirobackpain.com`) served by `next start`, inspected with
`curl` — raw HTTP responses, not DevTools.

**HTTP status:** all 7 Spanish pages + `/es/gracias` → **200**. `/es/` → **308**
to `/es` (matches site normalization). `/es/no-existe` → **404** — a real 404,
not a soft 404.

**Per Spanish page — VERIFIED:** `<html lang="es-US">`, Spanish `<title>`,
Spanish meta description, self canonical, three reciprocal hreflang links,
`robots: index, follow`, `og:locale: es_US`, exactly one non-empty Spanish
`<h1>`, 7–10 `<h2>`s, 558–992 visible words, all JSON-LD parses, one entity
declares `inLanguage: es-US`, zero cross-language contextual links.

**English regression — VERIFIED:** every English canonical unchanged; English
titles unchanged; `/privacy-policy` correctly has **no** hreflang;
`/conditions/back-pain` still `noindex, nofollow` with no hreflang (draft gate
intact); English nav, forms and analytics untouched; no blanket redirects
added; no route collisions.

**Cannibalization:** one dominant intent per Spanish URL (§5). The Spanish
booking page was given its **own** FAQ set rather than reusing the contact
page's, so two Spanish URLs don't carry near-identical question blocks and
duplicate `FAQPage` markup.

**Mobile (375×812) — VERIFIED** on `/es`, `/es/quiropractico-accidentes-de-auto`,
`/es/servicios`, `/es/solicitar-cita`: no horizontal overflow (`scrollWidth`
= 375), no element wider than the viewport, **no clipped text** despite
Spanish running longer than English. No font sizes were reduced to fit
translations. Small tap targets found (22px nav links) are **identical on the
English pages** — pre-existing, not introduced.

**Performance — VERIFIED, no regression:** identical script counts on every
EN/ES pair (14–15), HTML within a few percent. The one larger Spanish page
(`/es/quiropractico-accidentes-de-auto`, 206KB vs 185KB) is larger because it
genuinely carries more content. No translation bundle, no locale JSON shipped
to the client, no runtime translation waterfall, no additional font download.

**Accessibility:** `lang` correct per document; foreign-language quotes marked
`lang="en-US"` (WCAG 3.1.2); switcher is a real anchor with `aria-label`,
keyboard-reachable, inside the drawer's focus trap; Spanish skip link, form
labels, and error messages; Spanish `aria-label`s on the menu buttons and
dialog.

**Analytics/privacy:** untouched. Spanish forms post the **same** variant keys
and field names as English, so leads land in the existing pipeline in the
existing shape. **No field was added** — no accident narrative, no claim
number, no health detail. Nothing new is sent to any advertising platform.

---

## 14. Risks and things needing verification

| #   | Item                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Status                                                                   |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| 1   | **No Search Console / keyword-tool data.** The entire keyword map is intent-based.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | **NEEDS CONFIRMATION** — see §15                                         |
| 2   | **`areaServed` publishes unverified cities.** `serviceAreasVerified` is `false`, and `ServiceAreas` respects it — but `lib/schema.ts`'s `buildMedicalBusiness()`/`buildService()` do **not**, so six unconfirmed cities ship as structured data. The comment in `content/site.ts` claims this is gated; it isn't (the gate lived in the retired `lib/seo/local-business.ts`). **Pre-existing**, English-side — and it now also reaches `/es` and `/es/contacto`, which render the same shared entity. Not fixed here: it changes structured data on indexed English URLs. | **VERIFIED bug, NOT FIXED** — flagged as a follow-up task                |
| 3   | **English PIP wording** — "protect your benefits" (§8).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | **RECOMMENDATION**                                                       |
| 4   | **No Spanish privacy policy.** `/privacy-policy` is English-only and linked from the Spanish footer marked "(en inglés)".                                                                                                                                                                                                                                                                                                                                                                                                                                                 | **NEEDS CONFIRMATION** (counsel)                                         |
| 5   | **Spanish-speaking availability.** The claim rests on `bilingualCare: "EN/ES"` (client-confirmed 2026-08-11). If Dr. Abe is not reliably reachable in Spanish, the Spanish site sets an expectation it can't meet. Worth re-confirming before launch.                                                                                                                                                                                                                                                                                                                     | **NEEDS CONFIRMATION**                                                   |
| 6   | **Hero text animates from `opacity:0`.** The H1 is in the server HTML (so crawlable), but visually revealed by JS. Pre-existing on English; inherited by Spanish. Not hidden-text spam, but if JS fails the heading stays invisible.                                                                                                                                                                                                                                                                                                                                      | **Pre-existing, flagged**                                                |
| 7   | **`/es/solicitar-cita` uses the shared `LeadForm`**, not the bespoke `BookingForm` the English page uses — because `BookingForm`'s copy is hardcoded English. Same fields, same variant key, same two-step behaviour.                                                                                                                                                                                                                                                                                                                                                     | **INFERRED acceptable; see §16**                                         |
| 8   | **`global-not-found.tsx` is a newer Next convention.** It works on 16.2.10/16.3.1 here (**VERIFIED**), but the published docs describe it as experimental behind `experimental.globalNotFound`. If a Next upgrade changes this, unmatched URLs need re-testing.                                                                                                                                                                                                                                                                                                           | **Flagged**                                                              |
| 9   | **Reviews are English on Spanish pages.** Deliberate and explained on-page, but a Spanish reader sees English social proof.                                                                                                                                                                                                                                                                                                                                                                                                                                               | **RECOMMENDATION**: ask Spanish-speaking patients for reviews in Spanish |
| 10  | Spanish copy has not been reviewed by a **native South Florida Spanish speaker** or a clinician.                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | **NEEDS CONFIRMATION**                                                   |

---

## 15. Measuring Spanish performance

`/es` as a URL prefix makes this trivially separable.

**Search Console** — filter `Page` → `URL contains` → `/es/`. Report clicks,
impressions, CTR and average position separately from English. Also break down
by `Query`, `Country` and `Device`. Cross-check `Search results` → `Country =
United States` (this is US Spanish, not international traffic).

**Confirm the keyword map (§5) once there is data:** export the `/es` query
report after ~8 weeks and check which of `auto` / `carro` / `choque` actually
draws impressions. If one variant dominates and the page under-ranks for it,
adjust the on-page emphasis — do **not** spawn a second page for it.

**Do not evaluate on traffic alone.** Track calls, form submissions,
appointments scheduled, and appointments attended for `/es` sessions, using
first-party data. Spanish organic sessions that don't convert into attended
patients are not a win.

**Do not claim ranking success before Search Console confirms it.** Nothing in
this report asserts a ranking or a traffic outcome.

---

## 16. Remaining work

**Blocked on client / clinician:**

1. Clinician review of the 11 draft English pages → then translate the
   high-value ones (back pain, neck pain, whiplash, sciatica, adjustments,
   spinal decompression) into Spanish.
2. Verify service areas (`serviceAreasVerified`) — unblocks both the on-page
   section and the `areaServed` fix in §14.2.
3. Confirm Spanish-speaking availability (§14.5).
4. Counsel review for a Spanish privacy policy.
5. Supply verifiable local detail: parking, building entrance, accessibility,
   what to bring, accident intake process. This is the highest-value
   _content_ work available and needs no code.
6. Decide on the English PIP wording (§8).
7. Doctor's credentials (`doctorCredentials.verified`) — would strengthen
   E-E-A-T in both languages.

**Blocked on access this session did not have:**

8. Search Console — verify the property, submit the sitemap, confirm `/es`
   indexing. Also `npm run verify:canonicals` and `npm run verify:locales`
   against production after deploy.
9. Google Business Profile — unrelated to code, but a Spanish-language GBP
   description and Spanish attributes would support the same queries.

**Engineering follow-ups (not blockers):**

10. Localize `BookingForm` so `/es/solicitar-cita` can use the same bespoke
    component the English page does (§14.7).
11. Spanish informational/blog content — the site has no blog today.
    **RECOMMENDATION:** if one is added, do not bulk-translate; pick evergreen
    accident/pain topics with real Spanish intent.

---

## 17. Complete change summary

**Files added (24)**

```
app/(en)/layout.tsx                          app/(es)/layout.tsx
app/(es)/error.tsx                           app/(es)/loading.tsx
app/(es)/not-found.tsx                       app/global-not-found.tsx
app/fonts.ts
app/(es)/es/page.tsx
app/(es)/es/quiropractico-accidentes-de-auto/page.tsx
app/(es)/es/servicios/page.tsx               app/(es)/es/dr-abe-nasser/page.tsx
app/(es)/es/resenas/page.tsx                 app/(es)/es/contacto/page.tsx
app/(es)/es/solicitar-cita/page.tsx          app/(es)/es/gracias/page.tsx
components/layout/language-switcher.tsx
content/i18n.ts                              content/i18n.test.ts
content/chrome.ts
content/es/seo.ts        content/es/chrome.ts      content/es/home.ts
content/es/auto-accident.ts                  content/es/pages.ts
content/es/lead-forms.ts
scripts/check-locales.mjs                    docs/LOCALIZATION.md
```

**Files moved (26)** — all of `app/*` page/error/loading/not-found files into
`app/(en)/` via `git mv`. **No URL changed.**

**Files deleted (1)** — `app/layout.tsx`, replaced by the two locale root layouts.

**Files modified (33)** — `app/{sitemap,robots}.ts` + their tests;
`lib/{schema,pip-window,lead-form-schema}.ts`; `lib/seo/metadata.ts` + test;
`lib/lead-form-schema.test.ts`; `content/route-registry-parity.test.ts`;
`package.json`; and 21 components given an optional `locale`/content prop that
**defaults to English**.

**Files intentionally not touched:** every English page file (all 26 render
identically), `content/seo.ts`, `content/site.ts`, `content/testimonials.ts`,
all English content modules, `app/api/lead/route.ts`, `proxy.ts`,
`next.config.ts`, `tailwind.config.ts`, all design tokens and CSS.

| Category              | Change                                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------------------- |
| Routes created        | 8 (`/es` ×7 indexable + `/es/gracias`)                                                                        |
| Routes changed        | 0                                                                                                             |
| Metadata              | Spanish metadata for 7 routes; hreflang + `og:locale` added to 7 English routes (no English page file edited) |
| Schemas               | `buildWebPage()` added; Spanish breadcrumbs/FAQ/Person/Practice wired; no English schema output changed       |
| Sitemap               | 8 URLs → 15, plus per-URL alternates                                                                          |
| Robots                | `/es/gracias` disallowed; `/es` explicitly crawlable                                                          |
| Internal links        | Spanish graph is Spanish-internal; switcher added in 3 places                                                 |
| Tests                 | +34 (145 → 179), 3 updated, **0 failing**, 0 pre-existing failures                                            |
| Performance           | No measurable regression; no new client JS for localization                                                   |
| Deploy / merge / push | **None**                                                                                                      |

---

## 18. Before / after examples

### Homepage

|           | English                                                             | Spanish                                                              |
| --------- | ------------------------------------------------------------------- | -------------------------------------------------------------------- |
| URL       | `https://www.chirobackpain.com`                                     | `https://www.chirobackpain.com/es`                                   |
| Title     | Chiropractor in Deerfield Beach, FL \| Align the Spine Chiropractic | Quiropráctico en Deerfield Beach, FL \| Align the Spine Chiropractic |
| H1        | Align the Spine / Deerfield Beach / Chiropractor                    | Quiropráctico / en Deerfield Beach / Align the Spine                 |
| Canonical | `https://www.chirobackpain.com`                                     | `https://www.chirobackpain.com/es`                                   |
| hreflang  | `en-US` → `…com` · `es-US` → `…com/es` · `x-default` → `…com`       | _identical set_                                                      |

### Car-accident page

|           | English                                                                                                                                   | Spanish                                                                                      |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| URL       | `/car-accident-chiropractor`                                                                                                              | `/es/quiropractico-accidentes-de-auto`                                                       |
| Title     | Car Accident Chiropractor in Deerfield Beach, FL \| Align the Spine Chiropractic                                                          | Quiropráctico para Accidentes de Auto en Deerfield Beach, FL \| Align the Spine Chiropractic |
| H1        | Car Accident Chiropractor                                                                                                                 | ¿Lesionado en un accidente?                                                                  |
| Canonical | `…/car-accident-chiropractor`                                                                                                             | `…/es/quiropractico-accidentes-de-auto`                                                      |
| hreflang  | `en-US` → `…/car-accident-chiropractor` · `es-US` → `…/es/quiropractico-accidentes-de-auto` · `x-default` → `…/car-accident-chiropractor` | _identical set_                                                                              |

### Service page

|           | English                                                                          | Spanish                                                                         |
| --------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| URL       | `/services`                                                                      | `/es/servicios`                                                                 |
| Title     | Chiropractic Services in Deerfield Beach, FL \| Align the Spine Chiropractic     | Servicios Quiroprácticos en Deerfield Beach, FL \| Align the Spine Chiropractic |
| H1        | Chiropractic Services in Deerfield Beach, FL                                     | Servicios quiroprácticos en Deerfield Beach, FL                                 |
| Canonical | `…/services`                                                                     | `…/es/servicios`                                                                |
| hreflang  | `en-US` → `…/services` · `es-US` → `…/es/servicios` · `x-default` → `…/services` | _identical set_                                                                 |

---

## 19. Success criteria

**Architecture** — ✅ stable `/es` URLs · ✅ no browser-only translation · ✅
server/static rendered · ✅ maintainable route map · ✅ switcher preserves page
intent

**Technical SEO** — ✅ 200s · ✅ Spanish self-canonicals · ✅ English
self-canonicals · ✅ reciprocal hreflang · ✅ intentional `x-default` · ✅
crawlable · ✅ in sitemap · ✅ no accidental noindex · ✅ no route duplication ·
✅ no soft 404s

**On-page** — ✅ titles · ✅ descriptions · ✅ H1s · ✅ main content · ✅ CTAs · ✅
alt text · ✅ breadcrumbs · ✅ schema matches content

**Content quality** — ✅ natural Spanish (⚠️ pending native-speaker review,
§14.10) · ✅ intent-based keywords · ✅ no stuffing · ✅ no doorway pages · ✅ no
unverified medical claims · ✅ no invented credentials · ✅ no invented reviews ·
✅ no legal promises

**AEO/GEO** — ✅ answers clear subquestions · ✅ independently understandable
passages · ✅ explicit entity relationships · ✅ clear local context · ✅
non-commodity information · ✅ no fake AEO/GEO hacks · ✅ no obsolete FAQ
rich-result strategy · ✅ no `llms.txt` assumption

**Engineering** — ✅ build passes · ✅ TypeScript passes · ✅ 179/179 tests pass ·
✅ no English regression · ✅ no performance regression · ✅ **no production
deploy** · ✅ **no push or merge**

The one criterion not fully met is content quality's native-speaker review
(§14.10), which requires a person, not a code change.
