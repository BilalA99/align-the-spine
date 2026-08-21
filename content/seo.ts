import type { MetadataRoute } from "next";

import { adjustmentsHero } from "@/content/adjustments-page";
import { backPainHero } from "@/content/back-pain-page";
import { cervicogenicHeadacheHero } from "@/content/cervicogenic-headache-page";
import { concussionHero } from "@/content/concussion-page";
import { conditionsHubHero } from "@/content/conditions-hub";
import { cuppingTherapyHero } from "@/content/cupping-therapy-page";
import { massageSoftTissueHero } from "@/content/massage-soft-tissue-page";
import { neckPainHero } from "@/content/neck-pain-page";
import { sciaticaHero } from "@/content/sciatica-page";
import { siteConfig } from "@/content/site";
import { spinalDecompressionHero } from "@/content/spinal-decompression-page";
import { tmjJawPainHero } from "@/content/tmj-jaw-pain-page";
import { whiplashHero } from "@/content/whiplash-page";

export interface RouteMeta {
  /** Route path from the site root, e.g. "/services". "" is the home page. */
  path: string;
  title: string;
  description: string;
  image?: { src: string; alt: string };
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
  /** ISO date (YYYY-MM-DD) tied to this route's last meaningful content
   * change. Bump it by hand when the page's content changes — never derive
   * it from build time. */
  lastModified: string;
  /** ATS-E4 (4.12/4.14): defaults to "published" for ordinary static
   * pages. Condition-page routes must carry `reviewer` + `lastReviewed`
   * (a clinician sign-off, not this route's own `lastModified`) before
   * they can be "published" — until then they stay "draft": excluded from
   * the sitemap and served noindex, but still reachable directly (these
   * are real, finished pages awaiting clinical review, not broken ones —
   * a hard 404 would be the wrong signal). See isPublished(). */
  status?: "draft" | "published";
  /** Clinician who reviewed this page's medical content (ATS-E4 4.14/4.16). */
  reviewer?: string;
  /** ISO date (YYYY-MM-DD) of that clinician review — distinct from
   * `lastModified`, which tracks content edits, not medical sign-off. */
  reviewerLastReviewed?: string;
  /** IA-01: the specific search intent this route owns, in a few words
   * ("Deerfield Beach general chiropractic intent"). Not free-form —
   * seo.test.ts asserts no two indexable routes share the same value, so a
   * new route that would cannibalize an existing one fails the build
   * instead of shipping. */
  primaryQuery: string;
  /** IA-01: one line explaining why this route's indexing decision
   * (derived from `status` via isPublished/isIndexable) is correct — what
   * query it owns, and confirmation no other route already owns it. Not
   * "because it's a page." Required on every route so "we'll decide later"
   * can't ship an orphan. */
  justification: string;
}

/** A route may render/be linked from the sitemap only once it's
 * `"published"` (the default for routes that don't opt into gating) —
 * see RouteMeta.status's doc comment. This is also the route's IA-01
 * indexing decision — see isIndexable, its alias below. */
export function isPublished(route: RouteMeta): boolean {
  return (route.status ?? "published") === "published";
}

/** IA-01 vocabulary: "indexable" is the term the route-map ticket uses for
 * exactly the decision isPublished() already makes. Kept as a thin alias
 * rather than a second stored boolean so the two can never drift apart. */
export const isIndexable = isPublished;

/** Single source of truth for every statically-indexable route: app/sitemap.ts
 * maps straight over this, and each static page's own metadata export pulls
 * its entry by path via getRoute() instead of re-declaring title/description,
 * so the two can't drift apart. As of ATS-137, every /conditions/* route is
 * a dedicated static page registered here directly — there's no more
 * dynamic /conditions/[slug] route. /thank-you and /404 are intentionally
 * absent — both are noindex and neither belongs in the sitemap.
 * /auto-accident is absent too — it 308s to /auto-accidents (see
 * next.config.ts). */
export const routes: RouteMeta[] = [
  {
    path: "",
    title: `Chiropractor in Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Chiropractic care in Deerfield Beach for back pain, neck pain, mobility concerns, and injuries, with focused evaluations after car accidents.",
    image: { src: "/figma-exports/interior-reception.png", alt: "Align the Spine reception area" },
    changeFrequency: "weekly",
    priority: 1,
    lastModified: "2026-08-12",
    primaryQuery: "Deerfield Beach general chiropractic intent",
    // KNOWN GAP (flagged, not fixed by IA-01): this page and
    // /car-accident-chiropractor currently render four identical shared
    // blocks (HeroReviewsCarousel, AccidentInjuries, DoctorProfile,
    // PatientReviews — same underlying content, not just the same
    // component) — ONPAGE-02's de-duplication has not actually landed on
    // this branch yet, so the two pages still compete for accident-adjacent
    // queries. IA-01's own DoD item ("reviewed against ONPAGE-02 so / and
    // /auto-accidents decisions are consistent") is NOT satisfied until
    // ONPAGE-02 ships.
    justification:
      "Intended to own broad 'chiropractor Deerfield Beach' intent while /car-accident-chiropractor owns accident-specific intent, but the two pages still share 4 content blocks — see the KNOWN GAP note above.",
  },
  {
    path: "/services",
    title: `Chiropractic Services in Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Explore chiropractic services in Deerfield Beach, including adjustments, spinal decompression, soft-tissue care, and sports-injury care from Dr. Abe.",
    image: {
      src: "/figma-exports/dr-abe-neck.png",
      alt: "Dr. Abe Nasser treating a patient's neck",
    },
    changeFrequency: "monthly",
    priority: 0.9,
    lastModified: "2026-08-12",
    primaryQuery: "general-care services hub",
    justification:
      "Owns 'chiropractic services Deerfield Beach' hub intent; each individual service keeps its own page/query (IA-03) so this doesn't compete with them.",
  },
  {
    // ATS-E3 (3.4): renamed from "Book" — nothing on this form auto-confirms
    // a slot, it's a request that gets a callback, so "Book" overpromised.
    path: "/book-an-appointment",
    title: `Request a Chiropractic Appointment | Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Request a chiropractic appointment with Dr. Abe in Deerfield Beach. Ask whether an office evaluation or eligible home visit fits your needs.",
    image: {
      src: "/figma-exports/phone-mockup.png",
      alt: "Patient calling Align the Spine to request an appointment",
    },
    changeFrequency: "monthly",
    priority: 0.9,
    lastModified: "2026-08-12",
    primaryQuery: "appointment-request conversion action",
    justification:
      "Owns the booking-form intent itself, not a topical query — the CTA target every commercial page links to, so it can't cannibalize anything.",
  },
  {
    // ATS-E3 (3.1): "Auto" -> "Car" to match the ticket's specified title.
    path: "/car-accident-chiropractor",
    title: `Car Accident Chiropractor in Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "See Dr. Abe for a car accident chiropractic evaluation in Deerfield Beach, including care for neck pain, back pain, stiffness, and whiplash symptoms.",
    image: {
      src: "/figma-exports/interior-corridor.png",
      alt: "Align the Spine reception hallway",
    },
    changeFrequency: "monthly",
    priority: 0.9,
    lastModified: "2026-08-12",
    primaryQuery: "car accident chiropractor Deerfield Beach",
    justification:
      "The site's dedicated accident money page (ONPAGE-03) — intended to own accident-specific intent exclusively, but ONPAGE-02's de-duplication against the homepage has not shipped yet (see the KNOWN GAP note on the \"\" route above).",
  },
  // ATS-SEO-040: the crawlable discovery hub for the 7 condition routes
  // below. Not gated by clinician sign-off itself — it's a directory page
  // (existing summaries/links only, no medical claims of its own) — so it
  // stays published even while every page it links to is still draft.
  {
    path: "/conditions",
    title: `${conditionsHubHero.h1} | ${siteConfig.business.shortName}`,
    description: conditionsHubHero.subhead,
    image: conditionsHubHero.backgroundImage,
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: "2026-08-21",
    primaryQuery: "chiropractic conditions overview hub",
    justification:
      "Owns the conditions-directory intent — distinct from /car-accident-chiropractor (accident-specific money page), /services (treatment-modality hub), and each /conditions/[slug] page (its own condition-specific intent). Gives crawlers/users a real, linked path into the condition set instead of the 'Conditions' nav item borrowing /car-accident-chiropractor's href.",
  },
  // ATS-E4 (4.14): all 4 condition pages below have a red-flag/warning
  // section (confirmed present on each — RedFlagCard/ConditionWarning) but
  // no clinician `reviewer`/`reviewerLastReviewed` sign-off yet, so all 4
  // stay `status: "draft"` (noindex, excluded from the sitemap, still
  // reachable by direct URL) until a clinician reviews the medical content
  // and this file is updated with their name + review date.
  {
    path: "/conditions/back-pain",
    title: `${backPainHero.h1} | ${siteConfig.business.shortName}`,
    description: backPainHero.subhead,
    image: backPainHero.backgroundImage,
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: "2026-08-12",
    status: "draft",
    primaryQuery: "back pain chiropractor Deerfield Beach",
    justification:
      "Owns back-pain-specific patient intent (IA-02); kept draft/noindex until clinician sign-off lands — no other route targets this query.",
  },
  {
    path: "/conditions/neck-pain",
    title: `${neckPainHero.h1} | ${siteConfig.business.shortName}`,
    description: neckPainHero.subhead,
    image: neckPainHero.backgroundImage,
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: "2026-08-12",
    status: "draft",
    primaryQuery: "neck pain chiropractor Deerfield Beach",
    justification:
      "Owns neck-pain-specific patient intent (IA-02); kept draft/noindex until clinician sign-off lands — distinct from whiplash and cervicogenic headache.",
  },
  {
    path: "/conditions/sciatica",
    title: `${sciaticaHero.h1} | ${siteConfig.business.shortName}`,
    description: sciaticaHero.subhead,
    image: sciaticaHero.backgroundImage,
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: "2026-08-12",
    status: "draft",
    primaryQuery: "sciatica chiropractor Deerfield Beach",
    justification:
      "Owns sciatica/radiating-leg-pain intent (IA-02); kept draft/noindex until clinician sign-off lands — no other route targets this query.",
  },
  {
    path: "/conditions/whiplash",
    title: `${whiplashHero.h1} | ${siteConfig.business.shortName}`,
    description: whiplashHero.subhead,
    image: whiplashHero.backgroundImage,
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: "2026-08-12",
    status: "draft",
    primaryQuery: "whiplash chiropractor Deerfield Beach",
    justification:
      "Owns post-accident whiplash intent (IA-02); kept draft/noindex until clinician sign-off lands — distinct from neck pain and /car-accident-chiropractor's broader accident intent.",
  },
  {
    path: "/conditions/cervicogenic-headache",
    title: `${cervicogenicHeadacheHero.h1} | ${siteConfig.business.shortName}`,
    description: cervicogenicHeadacheHero.subhead,
    image: cervicogenicHeadacheHero.backgroundImage,
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: "2026-08-12",
    status: "draft",
    primaryQuery: "cervicogenic headache chiropractor Deerfield Beach",
    justification:
      "Owns headache-with-cervical-component intent (IA-02); kept draft/noindex until clinician sign-off lands — distinct from generic headache/migraine copy on the services hub.",
  },
  {
    path: "/conditions/concussion",
    title: `${concussionHero.h1} | ${siteConfig.business.shortName}`,
    description: concussionHero.subhead,
    image: concussionHero.backgroundImage,
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: "2026-08-12",
    status: "draft",
    primaryQuery: "concussion chiropractor Deerfield Beach",
    justification:
      "Owns post-concussion evaluation intent (IA-02). Stays draft/noindex regardless of clinician sign-off per the ticket's explicit instruction, not just pending review.",
  },
  {
    path: "/conditions/tmj-jaw-pain",
    title: `${tmjJawPainHero.h1} | ${siteConfig.business.shortName}`,
    description: tmjJawPainHero.subhead,
    image: tmjJawPainHero.backgroundImage,
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: "2026-08-12",
    status: "draft",
    primaryQuery: "TMJ / jaw pain chiropractor Deerfield Beach",
    justification:
      "Owns TMJ/jaw-pain intent (IA-02); kept draft/noindex until clinician sign-off lands — no other route targets this query.",
  },
  // Same reviewer-gate as the condition pages above — this page includes
  // clinical guidance ("not the right first step for a fracture,
  // dislocation..."), so it stays draft until a clinician signs off too.
  {
    path: "/services/chiropractic-adjustments",
    title: `${adjustmentsHero.h1} | ${siteConfig.business.shortName}`,
    description: adjustmentsHero.subhead,
    image: adjustmentsHero.backgroundImage,
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: "2026-08-12",
    status: "draft",
    primaryQuery: "chiropractic adjustments Deerfield Beach",
    justification:
      "Owns the adjustments treatment page for the homepage's 'adjustment' service (IA-03); kept draft/noindex until clinician sign-off lands.",
  },
  // Same reviewer-gate as the condition pages above — this page includes
  // clinical guidance about disc injuries and PIP claim timing, so it stays
  // draft until a clinician signs off too.
  {
    path: "/services/spinal-decompression",
    title: `${spinalDecompressionHero.h1} | ${siteConfig.business.shortName}`,
    description: spinalDecompressionHero.subhead,
    image: spinalDecompressionHero.backgroundImage,
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: "2026-08-12",
    status: "draft",
    primaryQuery: "spinal decompression Deerfield Beach",
    justification:
      "Owns the decompression treatment page for the homepage's 'traction-decompression' service (IA-03); kept draft/noindex until clinician sign-off lands.",
  },
  // Same reviewer-gate as the condition pages above — this page includes
  // clinical guidance about soft-tissue technique selection, so it stays
  // draft until a clinician signs off too.
  {
    path: "/services/soft-tissue-therapy",
    title: `${massageSoftTissueHero.h1} | ${siteConfig.business.shortName}`,
    description: massageSoftTissueHero.subhead,
    image: massageSoftTissueHero.backgroundImage,
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: "2026-08-12",
    status: "draft",
    primaryQuery: "massage / soft-tissue therapy Deerfield Beach",
    justification:
      "Owns the soft-tissue treatment page for the homepage's 'myofascial-release-trigger-point' service (IA-03); kept draft/noindex until clinician sign-off lands. Cupping owns its own page (/services/cupping-therapy) rather than sharing this one.",
  },
  // Lean, dedicated page — see app/services/cupping-therapy/page.tsx's doc
  // comment for why this doesn't copy the other /services/* pages' full
  // template. Same reviewer-gate as its siblings: includes treatment
  // guidance, so it stays draft until a clinician signs off.
  {
    path: "/services/cupping-therapy",
    title: `${cuppingTherapyHero.h1} | ${siteConfig.business.name}`,
    description: cuppingTherapyHero.subhead,
    image: cuppingTherapyHero.backgroundImage,
    changeFrequency: "monthly",
    priority: 0.6,
    lastModified: "2026-08-17",
    status: "draft",
    primaryQuery: "cupping therapy Deerfield Beach",
    justification:
      "Owns the cupping treatment page for the homepage's 'cupping-therapy' service (IA-03) — split out from /services/soft-tissue-therapy so every homepage-listed service gets its own page; kept draft/noindex until clinician sign-off lands.",
  },
  // ATS-E3 (3.7): unverified service-area/availability data (see
  // content/site.ts's `serviceAreas`, ATS-E4 4.6) — stays draft
  // (noindex, out of the sitemap) until that's confirmed.
  {
    path: "/home-visit-chiropractor",
    title: `Home Visit Chiropractor in Deerfield Beach, FL | ${siteConfig.business.shortName}`,
    description:
      "Ask about a chiropractic home visit from Dr. Abe when travel is difficult and the service fits your case and location. Check eligibility before booking.",
    image: {
      src: "/figma-exports/home-visits-hero.png",
      alt: "Dr. Abe Nasser setting up a treatment table in a patient's living room",
    },
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: "2026-08-12",
    status: "draft",
    primaryQuery: "home visit chiropractor Deerfield Beach",
    justification:
      "Owns home-visit intent; kept draft/noindex until service-area/availability data is verified (a standalone home-visits page is explicitly out of scope for the SEO task list, but this pre-existing route stays gated rather than deleted).",
  },
  // ATS-E3 (3.2): flipped to published once real, client-supplied reviews
  // landed in content/testimonials.ts (2026-08-12) — see ReviewsCarousel.
  {
    path: "/reviews",
    title: `Patient Reviews | ${siteConfig.business.shortName}`,
    description:
      "Verified patient reviews for Align the Spine Chiropractic in Deerfield Beach, FL.",
    changeFrequency: "monthly",
    priority: 0.6,
    lastModified: "2026-08-12",
    status: "published",
    primaryQuery: "Align the Spine patient reviews",
    justification:
      "IA-01: /reviews decision resolved — became a real page with genuine client-supplied reviews (ATS-E3 3.2) rather than pulled from nav; kept in nav since it now has substantive content.",
  },
  {
    // ATS-E3 (3.8): title set to the ticket's exact required wording.
    path: "/about",
    title: "Dr. Abe Nasser, D.C. | Deerfield Beach Chiropractor",
    description:
      "Meet Dr. Abe Nasser, the chiropractor behind Align the Spine Chiropractic in Deerfield Beach, and learn about his patient-centered approach to care.",
    image: {
      src: "/figma-exports/dr-abe-neck.png",
      alt: "Dr. Abe Nasser treating a patient's neck",
    },
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: "2026-08-12",
    primaryQuery: "Dr. Abe Nasser chiropractor doctor entity",
    justification:
      "Owns the doctor-entity query and every health page's Physician schema reference (ONPAGE-06); no other route asserts credential/bio content.",
  },
  {
    path: "/contact-us",
    title: `Contact ${siteConfig.business.shortName} | Deerfield Beach, FL`,
    description: `Contact Align the Spine Chiropractic at 811 SE 8th Ave, Suite 101, Deerfield Beach, FL, or call ${siteConfig.business.phone} about an appointment or visit.`,
    changeFrequency: "monthly",
    priority: 0.6,
    lastModified: "2026-08-12",
    primaryQuery: "Align the Spine contact / location / hours",
    justification:
      "Owns the local-entity/NAP query (ONPAGE-05) — the canonical location block lives here, not duplicated on other pages.",
  },
  {
    path: "/privacy-policy",
    title: `Privacy Policy | ${siteConfig.business.shortName}`,
    description:
      "How Align the Spine Chiropractic collects, uses, and protects your information, including HIPAA-protected health information.",
    changeFrequency: "yearly",
    priority: 0.3,
    lastModified: "2026-07-31",
    primaryQuery: "legal/compliance boilerplate — not a search-intent page",
    justification:
      "Required legal page, not built to rank; kept indexable (low priority) since noindexing a privacy policy has no SEO benefit and it's linked from the footer.",
  },
  {
    path: "/blog",
    title: `Chiropractic & Accident Recovery Resources | ${siteConfig.business.shortName}`,
    description:
      "Helpful, source-aware chiropractic, mobility, accident-care, and Florida PIP resources from Align the Spine Chiropractic in Deerfield Beach.",
    image: {
      src: "/figma-exports/interior-reception.png",
      alt: "Align the Spine Chiropractic reception area in Deerfield Beach",
    },
    changeFrequency: "weekly",
    priority: 0.8,
    lastModified: "2026-08-16",
    primaryQuery: "chiropractic & accident-recovery editorial hub",
    justification:
      "Owns long-tail informational/blog intent distinct from every commercial page — individual articles (/blog/[slug]) are the actual ranking targets, this index just lists them.",
  },
  {
    path: "/service-areas",
    title: `Service Areas | ${siteConfig.business.shortName}`,
    description:
      "See the verified Deerfield Beach office and how nearby in-office visits differ from limited, case-and-location-confirmed accident home-visit eligibility.",
    image: {
      src: "/figma-exports/exterior-img.png",
      alt: "Exterior of the Deerfield Beach office building",
    },
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: "2026-08-16",
    primaryQuery: "nearby-city service-area coverage index",
    justification:
      "Owns the coverage-area explainer; deliberately does not build thin near-duplicate per-city landing pages (see the SEO task list's explicit 'do not build thin near-duplicate city pages' rule) — individual /service-areas/[slug] pages must stay genuinely differentiated, not templated city swaps.",
  },
];

/** Looks up a route's registry entry by path — throws if missing rather than
 * silently falling back, so a page that forgets to register itself fails at
 * build time instead of shipping without a canonical. */
export function getRoute(path: string): RouteMeta {
  const route = routes.find((entry) => entry.path === path);
  if (!route) throw new Error(`content/seo.ts: no route registered for path "${path}"`);
  return route;
}

/** Returns `path` if it's registered and published, `null` otherwise —
 * makes linking to a draft/noindex/unregistered route structurally
 * impossible instead of relying on every call site to remember to check.
 * Callers that need to render a conditional link (e.g. `href={getRouteHref(...)  ?? undefined}`)
 * or skip rendering entirely when null is returned should do so explicitly;
 * this deliberately never falls back to the path anyway. Not yet wired into
 * every internal link — that's the internal-linking rebuild, a separate
 * phase — but the primitive exists now so that work has something safe to
 * build on. */
export function getRouteHref(path: string): string | null {
  const route = routes.find((entry) => entry.path === path);
  if (!route || !isPublished(route)) return null;
  return route.path;
}
