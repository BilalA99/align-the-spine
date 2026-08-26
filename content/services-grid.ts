import type { ServiceCardItem } from "@/components/ui/service-card";
import { getRouteHref } from "@/content/seo";

/** "/services" ServiceGrid content (ATS-081): 8 service cards. Reuses
 * ServiceGrid/ServiceCard like the homepage's AccidentInjuries grid does
 * (duration is unused by the card). Separate from content/services.ts, which
 * feeds the homepage's ServiceListRow list and its own distinct copy.
 *
 * LINK-01: every `href` here is resolved through getRouteHref() rather than
 * hardcoded. The 3 original cards (adjustments, spinal-decompression,
 * massage-soft-tissue) previously hardcoded their target path even though
 * those pages are `status: "draft"` (pending clinician sign-off, IA-02) —
 * a live violation of "no link may point to a route where indexable: false
 * or status: draft." Fixed here alongside the "Car Accidents" and "Cupping
 * Therapy" cards (added under IA-03) and "Headache & Migraine" (newly
 * mapped to /conditions/cervicogenic-headache). Every one of these falls
 * back to "Book now" until its target actually publishes. */
export const servicesGrid: ServiceCardItem[] = [
  {
    slug: "adjustments",
    name: "Adjustments",
    duration: "",
    summary:
      "Hands-on chiropractic adjustments using controlled pressure to improve joint motion in the neck, mid back, or lower back when appropriate.",
    image: {
      src: "/figma-exports/drabeadjust.png",
      alt: "Dr. Abe performing a chiropractic adjustment",
    },
    href: getRouteHref("/services/chiropractic-adjustments") ?? undefined,
    ctaLabel: "Learn more",
  },
  {
    slug: "sports-injury",
    name: "Sports Injury",
    duration: "",
    summary:
      "Assessment and hands-on treatment for strains, sprains, and overuse injuries, with a plan built around getting you back to your sport.",
    image: {
      src: "/figma-exports/abe-back-turn.png",
      alt: "Sports injury assessment and treatment",
    },
    // No dedicated sports-injury page exists — no invented target
    // (IA-03's "do not invent services" rule).
  },
  {
    slug: "posture-corrective",
    name: "Posture & Corrective",
    duration: "",
    summary:
      "Chiropractic evaluation and care for postural strain that can build from desk work, driving, or repetitive movement.",
    image: { src: "/figma-exports/drabe-spine.png", alt: "Posture and corrective spinal care" },
    // No dedicated posture/corrective page exists either — same rule.
  },
  {
    slug: "spinal-decompression",
    name: "Spinal Decompression",
    duration: "",
    summary:
      "Controlled, traction-based spinal decompression for selected disc, joint, and radiating nerve-pain concerns after a full evaluation.",
    image: {
      src: "/figma-exports/drabe-traction_compression.png",
      alt: "Spinal traction and decompression therapy",
    },
    href: getRouteHref("/services/spinal-decompression") ?? undefined,
    ctaLabel: "Learn more",
  },
  {
    slug: "headache-migraine",
    name: "Headache & Migraine",
    duration: "",
    summary:
      "Neck-focused evaluation and chiropractic care for headaches with a possible musculoskeletal or cervical component.",
    image: { src: "/figma-exports/drabe-headache.png", alt: "Headache and migraine treatment" },
    href: getRouteHref("/conditions/cervicogenic-headache") ?? undefined,
    ctaLabel: "Learn more",
  },
  {
    slug: "massage-soft-tissue",
    name: "Massage/Soft-Tissue",
    duration: "",
    summary:
      "Myofascial release and targeted soft-tissue care for muscle tension, restricted motion, and injury-related soreness.",
    image: { src: "/figma-exports/drabe-soft-tissue.png", alt: "Massage and soft-tissue therapy" },
    href: getRouteHref("/services/soft-tissue-therapy") ?? undefined,
    ctaLabel: "Learn more",
  },
  {
    slug: "car-accidents",
    name: "Car Accidents",
    duration: "",
    summary:
      "After a car accident, request a chiropractic evaluation for neck pain, back pain, stiffness, whiplash symptoms, and other musculoskeletal concerns.",
    image: {
      src: "/figma-exports/drabe-consult.png",
      alt: "Car accident consultation with Dr. Abe",
    },
    href: getRouteHref("/car-accident-chiropractor") ?? undefined,
    ctaLabel: "Learn more",
  },
  {
    slug: "cupping-therapy",
    name: "Cupping Therapy",
    duration: "",
    summary:
      "Cupping applies localized suction to selected areas of muscle tension and may be included when appropriate for neck, back, or other soft-tissue concerns.",
    image: { src: "/figma-exports/cupping-drabe.png", alt: "Cupping therapy treatment" },
    href: getRouteHref("/services/cupping-therapy") ?? undefined,
    ctaLabel: "Learn more",
  },
];
