# Localization (English / Spanish)

How the `/es` layer works and how to change it without breaking search.

The site serves two languages from one codebase: English at the site root and
Spanish under `/es`. Both are **primary content** — Spanish pages are written
Spanish source, committed to the repo and server-rendered, not machine
translations produced at request time. There is no translation API in the
request path, no locale cookie, and no language redirect.

---

## The one file that matters

**`content/i18n.ts`** is the single source of truth for the English ↔ Spanish
URL pairing. Everything language-related derives from its `localizedRoutes`
table:

| Consumer                                  | What it takes from `content/i18n.ts`            |
| ----------------------------------------- | ----------------------------------------------- |
| `lib/seo/metadata.ts`                     | `<link rel="alternate" hreflang>` on every page |
| `app/sitemap.ts`                          | per-URL `<xhtml:link>` alternates               |
| `components/layout/language-switcher.tsx` | where the EN/ES toggle points                   |
| `content/chrome.ts`                       | the Spanish nav/footer link targets             |

**Never hardcode an `/es/...` string anywhere else.** A pair that exists in one
of those places but not the table is exactly how hreflang stops being
reciprocal and Google silently drops the annotation.

A route with `es: null` is a deliberate, documented "English-only" — not an
omission. `content/i18n.test.ts` fails the build if a route is missing from the
table entirely, so the choice always has to be made explicitly.

---

## Where things live

```
app/
  (en)/…                  English pages + English root layout (<html lang="en-US">)
  (es)/es/…               Spanish pages + Spanish root layout (<html lang="es-US">)
  global-not-found.tsx    404 for URLs matching neither tree
  fonts.ts                shared next/font instances (both layouts import these)
  sitemap.ts robots.ts    both locales

content/
  i18n.ts                 locale constants + the EN↔ES route table
  seo.ts                  English route registry (titles, descriptions, status)
  chrome.ts               locale accessors for nav/footer/stat labels
  es/
    seo.ts                Spanish route registry — same RouteMeta shape
    chrome.ts             Spanish nav, footer, UI strings
    home.ts               Spanish home-page content
    auto-accident.ts      Spanish accident-page content
    pages.ts              Spanish services/doctor/reviews/contact/booking content
    lead-forms.ts         Spanish form field labels
```

`(en)` and `(es)` are **route groups**: the parentheses mean they contribute
nothing to the URL. `/about` is still `/about`. They exist so each locale can
have its own root layout, which is the only place Next allows an `<html>` tag
— and therefore the only way to get a correct `lang` attribute into the
server-rendered response without making every page dynamic.

---

## How to…

### Add a Spanish version of an existing English page

1. **Add the pair** in `content/i18n.ts`, changing `es: null` to the new slug.
   Localize the slug for Spanish search intent — don't transliterate the
   English one (see the comments in that file for the reasoning behind each
   existing slug).
2. **Register the route** in `content/es/seo.ts` with a Spanish `title`,
   `description`, `changeFrequency`, `priority` and `lastModified`. Write the
   title and description against Spanish query intent; do not translate the
   English ones sentence by sentence.
3. **Write the content** in a module under `content/es/`.
4. **Create the page** at `app/(es)/es/<slug>/page.tsx`. Use
   `buildEsRouteMetadata(getEsRoute("/es/<slug>"))` for metadata — never
   `buildMetadata` directly, or the page loses its draft gating.
5. **Pass `locale="es"`** to every shared component that takes it
   (`HeroSolidPanel`, `LeadForm`, `LocationIntro`, `LocationFooter`,
   `ContactSection`, `ComparisonTable`, `ServiceGrid`, `HeroReviewsCarousel`,
   `TopStatsBar`, `AccidentBanner`, `PipCalculator`). Missing one is how an
   English button ends up on a Spanish page.
6. **Add the nav/footer link** in `content/es/chrome.ts` if it belongs there.
7. Run `npm test` — `content/i18n.test.ts` will tell you what you missed.

`hreflang`, the sitemap entry and the language switcher all start working the
moment step 1 and step 2 are done. There is nothing else to wire up.

### Update Spanish copy

Edit the relevant module under `content/es/`. Bump `lastModified` on that
route in `content/es/seo.ts` **by hand** — it tracks meaningful content
changes and must never be derived from build time.

### Add a new UI string to the shared chrome

Add it to `esChromeLabels`/`enChromeLabels` in `content/es/chrome.ts` and read
it through `getChromeLabels(locale)` in `content/chrome.ts`. Don't inline an
English string in a component that both locales render.

### Take a Spanish page out of the index

Set `status: "draft"` on its entry in `content/es/seo.ts`. It'll be served
`noindex` and dropped from the sitemap, but stay reachable by URL — the same
gate the English condition pages use.

---

## Rules that are enforced, not just documented

`content/i18n.test.ts` fails the build on any of these:

- a route in the map whose English or Spanish path isn't in the matching registry
- a registry route with no pair in the map
- a duplicate id or path
- a Spanish path that isn't lowercase ASCII under `/es`, or has a trailing slash
- a missing/duplicate/over-long Spanish title or description
- a Spanish title or description that still reads as English
- non-reciprocal hreflang, a bad `x-default`, or an invalid locale code
- a Spanish nav/footer link pointing outside `/es`
- **a published Spanish page whose English original is still `draft`**

`scripts/check-locales.mjs` checks the same guarantees over HTTP against a
running build (status codes, canonicals, `<html lang>`, hreflang reciprocity,
sitemap membership, and that an unknown `/es` URL really 404s):

```bash
npm run verify:locales -- http://localhost:3000 https://www.chirobackpain.com
```

Pass the production origin as the second argument whenever you're fetching
from somewhere other than production — canonicals always name the configured
`SITE_URL`, never the host the request arrived on.

---

## Things that are deliberate — please don't "fix" them

- **No language redirect.** Both locales stay directly reachable. Redirecting
  by `Accept-Language` or IP hides one language from users who want the other,
  and from Googlebot, which crawls from the US with no language preference.
- **Spanish pages self-canonicalize.** A Spanish page must never canonicalize
  to its English counterpart — that collapses a legitimate translated page out
  of the index. The two are joined by `hreflang`, not by a canonical.
- **`x-default` points at English.** English is the site's primary language and
  the only one with a page for every route.
- **Patient reviews are never translated.** They render verbatim in whatever
  language the patient wrote them, marked `lang="en-US"` on a Spanish page
  (WCAG 3.1.2). A rewritten testimonial presented as someone's own words is a
  fabricated review. `/es/resenas` carries a visible note explaining this.
- **The business name, address and phone are never translated or reformatted.**
  They're the practice's NAP and its search entity; they must read identically
  in both languages.
- **The Spanish nav is flat.** The English mega-menus point at pages that are
  `draft` (noindex, pending clinician review) and exist only in English.
- **`/es/gracias` is noindex** and absent from both registries and the sitemap,
  exactly like `/thank-you`.
- **Spanish form variants reuse the English `variant` keys and field `name`s.**
  `/api/lead` picks its server-side schema by variant; a separate Spanish key
  would 400 every Spanish lead. Only labels and messages are localized.

---

## Adding a third language later

The architecture supports it without a rewrite, but it isn't built for it yet:
`Locale` is a two-member union, and several accessors branch on
`locale === "es"`. Adding e.g. `pt-BR` means widening `LOCALE_PREFIX`,
`HTML_LANG`, `HREFLANG`, `OG_LOCALE`, adding a `pt` field to
`LocalizedRoute`, a `app/(pt)/` root layout, and turning those binary branches
into record lookups. Deliberately not done pre-emptively — see the note at the
top of `content/i18n.ts`.
