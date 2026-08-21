import type { ServiceCardItem } from "@/components/ui/service-card";
import { backPainHero } from "@/content/back-pain-page";
import { cervicogenicHeadacheHero } from "@/content/cervicogenic-headache-page";
import { concussionHero } from "@/content/concussion-page";
import { neckPainHero } from "@/content/neck-pain-page";
import { sciaticaHero } from "@/content/sciatica-page";
import { tmjJawPainHero } from "@/content/tmj-jaw-pain-page";
import { whiplashHero } from "@/content/whiplash-page";

/** ATS-SEO-040: /conditions hub content. Built entirely from each
 * condition page's own already-published hero content (h1/subhead/image) —
 * no new medical claims, no thin keyword list, just a real directory of the
 * 7 condition pages that otherwise had no crawlable path into them (the
 * only prior route was the "Conditions" nav mega-menu, which is
 * client-side-only-rendered and absent from raw HTML — see
 * components/layout/navbar-dropdown.tsx).
 *
 * Hrefs are hardcoded (not routed through getRouteHref()) deliberately:
 * every one of these 7 routes is currently `status: "draft"` in
 * content/seo.ts pending clinician sign-off, but each is, per that file's
 * own doc comment, "a real, finished page awaiting clinical review, not a
 * broken one." The site's nav already links directly to all 7 today — this
 * hub makes that same, already-established direct-discovery decision
 * crawlable, it doesn't introduce a new one. `status: "draft"` still forces
 * noindex/nositemap on each target page itself (via buildRouteMetadata),
 * so linking here can't make an unreviewed page rank. */
export const conditionsHubHero = {
  eyebrowChip: "Conditions we evaluate and treat",
  h1: "Conditions We Treat in Deerfield Beach, FL",
  subhead:
    "Dr. Abe Nasser evaluates and treats a range of chiropractic conditions in Deerfield Beach, from car-accident-related injuries to everyday back and neck pain.",
  backgroundImage: {
    src: "/figma-exports/dr-abe-neck.png",
    alt: "Dr. Abe Nasser treating a patient's neck",
  },
};

export const conditionsHubIntro =
  "Explore the specific conditions Dr. Abe Nasser evaluates and treats at Align the Spine Chiropractic in Deerfield Beach. Each page below covers what's evaluated, what to expect, and when a car accident is involved.";

export const conditionsHubCards: ServiceCardItem[] = [
  {
    slug: "back-pain",
    name: backPainHero.h1,
    duration: "",
    summary: backPainHero.subhead,
    image: backPainHero.backgroundImage,
    href: "/conditions/back-pain",
    ctaLabel: "Learn more",
  },
  {
    slug: "neck-pain",
    name: neckPainHero.h1,
    duration: "",
    summary: neckPainHero.subhead,
    image: neckPainHero.backgroundImage,
    href: "/conditions/neck-pain",
    ctaLabel: "Learn more",
  },
  {
    slug: "sciatica",
    name: sciaticaHero.h1,
    duration: "",
    summary: sciaticaHero.subhead,
    image: sciaticaHero.backgroundImage,
    href: "/conditions/sciatica",
    ctaLabel: "Learn more",
  },
  {
    slug: "whiplash",
    name: whiplashHero.h1,
    duration: "",
    summary: whiplashHero.subhead,
    image: whiplashHero.backgroundImage,
    href: "/conditions/whiplash",
    ctaLabel: "Learn more",
  },
  {
    slug: "concussion",
    name: concussionHero.h1,
    duration: "",
    summary: concussionHero.subhead,
    image: concussionHero.backgroundImage,
    href: "/conditions/concussion",
    ctaLabel: "Learn more",
  },
  {
    slug: "cervicogenic-headache",
    name: cervicogenicHeadacheHero.h1,
    duration: "",
    summary: cervicogenicHeadacheHero.subhead,
    image: cervicogenicHeadacheHero.backgroundImage,
    href: "/conditions/cervicogenic-headache",
    ctaLabel: "Learn more",
  },
  {
    slug: "tmj-jaw-pain",
    name: tmjJawPainHero.h1,
    duration: "",
    summary: tmjJawPainHero.subhead,
    image: tmjJawPainHero.backgroundImage,
    href: "/conditions/tmj-jaw-pain",
    ctaLabel: "Learn more",
  },
];
