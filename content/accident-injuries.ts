import type { ServiceCardItem } from "@/components/ui/service-card";
import { getRouteHref } from "@/content/seo";

/** "Common accident injuries we treat" grid per homepage artboard (Group 17,
 * 96:292–96:325). Reuses ServiceGrid/ServiceCard (duration is unused by the
 * card — condition cards have no session length).
 *
 * LINK-01: these are 6 of the audit finding's "twelve topic cards" that
 * previously linked to `/book` regardless of which injury they described —
 * each now points at the condition/service page that actually owns that
 * injury's treatment intent, with a descriptive CTA instead of a generic
 * "Book now". `href` is resolved through getRouteHref() so a target still
 * `status: "draft"` (pending clinician sign-off, IA-02) never links to a
 * noindex route (LINK-01's "no link to a draft or noindex route" rule).
 *
 * ATS-SEO-042: a draft target used to fall all the way through to the
 * booking CTA — since all 6 condition/service targets below are currently
 * draft, every card pointed at appointment-request regardless of label,
 * turning "Book now" into a duplicate generic destination instead of an
 * actual conversion CTA. Cards now fall back to the published
 * /car-accident-chiropractor page instead — a real, topically relevant
 * destination (it already covers whiplash/back-pain/neck-pain/stiffness
 * symptoms) — with a CTA label describing that destination rather than
 * carrying over a specific-treatment label the fallback link doesn't
 * match. Booking stays reachable from that page's own CTA, not from every
 * informational card. */
const ACCIDENT_PAGE_PATH = "/car-accident-chiropractor";
const ACCIDENT_PAGE_FALLBACK_CTA = "Accident Care Overview";

const accidentInjuriesSource: (ServiceCardItem & { targetRoute?: string })[] = [
  {
    slug: "whiplash",
    name: "Whiplash",
    duration: "",
    summary: "Neck strain, stiffness, and reduced range of motion from sudden impact.",
    image: { src: "/figma-exports/drabe-whiplash.png", alt: "Whiplash treatment" },
    targetRoute: "/conditions/whiplash",
    ctaLabel: "Whiplash Treatment",
  },
  {
    slug: "lower-back-pain",
    name: "Lower Back Pain",
    duration: "",
    summary:
      "Structural alignment to address lumbar spine compression and muscular spasms from rear-end collisions.",
    image: { src: "/figma-exports/drabe-backpain.png", alt: "Lower back pain treatment" },
    targetRoute: "/conditions/back-pain",
    ctaLabel: "Back Pain Treatment",
  },
  {
    slug: "herniated-disc",
    name: "Herniated Disc",
    duration: "",
    summary:
      "Specialized decompression techniques to relieve pressure on nerves from disc displacement.",
    image: { src: "/figma-exports/drabe-herniated%20disc.png", alt: "Herniated disc treatment" },
    targetRoute: "/services/spinal-decompression",
    ctaLabel: "Spinal Decompression",
  },
  {
    slug: "shoulder-extremity",
    name: "Shoulder & Extremity",
    duration: "",
    summary:
      "Treatment for seatbelt-related shoulder trauma and joint injuries in the arms and legs.",
    image: { src: "/figma-exports/drabe-shoulder.png", alt: "Shoulder and extremity treatment" },
    // No dedicated shoulder/extremity page exists — IA-03's "do not invent
    // services" rule applies here too, so this stays on the booking CTA
    // rather than getting a fabricated target.
  },
  {
    slug: "headaches",
    name: "Headaches",
    duration: "",
    summary: "Upper cervical adjustments to alleviate post-traumatic headaches and tension.",
    image: { src: "/figma-exports/drabe-headache.png", alt: "Headache treatment" },
    targetRoute: "/conditions/cervicogenic-headache",
    ctaLabel: "Headache Treatment",
  },
  {
    slug: "soft-tissue",
    name: "Soft tissue",
    duration: "",
    summary: "Myofascial release for deep muscle bruising and ligament strain throughout the body.",
    image: { src: "/figma-exports/drabe-soft-tissue.png", alt: "Soft tissue treatment" },
    targetRoute: "/services/soft-tissue-therapy",
    ctaLabel: "Soft Tissue Therapy",
  },
];

/** Builds the card list. `skipAccidentPageFallback` is for the one page
 * that already *is* the fallback destination (/car-accident-chiropractor)
 * — without it, a still-draft card there would link right back to the
 * page it's rendered on. On every other page, omitting it (the default)
 * is correct. */
export function buildAccidentInjuries({
  skipAccidentPageFallback = false,
}: { skipAccidentPageFallback?: boolean } = {}): ServiceCardItem[] {
  const accidentPageHref = getRouteHref(ACCIDENT_PAGE_PATH);
  return accidentInjuriesSource.map(({ targetRoute, ...item }) => {
    const specificHref = targetRoute ? getRouteHref(targetRoute) : undefined;
    if (specificHref) {
      return { ...item, href: specificHref };
    }
    if (skipAccidentPageFallback || !accidentPageHref) {
      return { ...item, href: undefined, ctaLabel: undefined };
    }
    return { ...item, href: accidentPageHref, ctaLabel: ACCIDENT_PAGE_FALLBACK_CTA };
  });
}

export const accidentInjuries: ServiceCardItem[] = buildAccidentInjuries();
