import { getRouteHref } from "@/content/seo";

export interface Service {
  slug: string;
  name: string;
  duration: string;
  summary: string;
  image: { src: string; alt: string };
  /** ATS-E4 (4.13): true for offers/equipment claims that need separate
   * sign-off beyond "this is a real service" — e.g. X-ray availability and
   * new-patient pricing. Filtered out of `services` (the exported, rendered
   * list) until that verification lands; see `allServices` for the full
   * source list including gated entries. */
  needsVerification?: boolean;
  /** IA-03: the dedicated page that owns this service's treatment intent.
   * Every homepage-listed service should end up with one (see
   * content/seo.ts's primaryQuery for the corresponding route). Resolved
   * through getRouteHref() below rather than hardcoded, so a service whose
   * owning page is still `status: "draft"` (pending clinician sign-off,
   * IA-02) renders with no link instead of pointing at a noindex route —
   * see LINK-01's "no link to a draft or noindex route" rule. */
  href?: string;
  ctaLabel?: string;
}

const allServices: Service[] = [
  {
    slug: "new-patient-special",
    name: "New Patient Special (includes XRAY)",
    duration: "1 hr",
    summary: "New patient special includes adjustment and x-ray.",
    image: {
      src: "/figma-exports/drabe-xray-newpt.png",
      alt: "New patient exam and X-ray evaluation",
    },
    // Bundles an X-ray-equipment claim and a pricing offer — neither has
    // client sign-off (ATS-E4 4.9/4.13). Omitted from `services` below
    // until both are verified.
    needsVerification: true,
  },
  {
    slug: "myofascial-release-trigger-point",
    name: "Myofascial Release/Trigger Point",
    duration: "1 hr",
    summary:
      "Dr. Abe uses a Graston tool and targeted pressure to address muscle tension and restricted soft-tissue movement, similar to a focused deep-tissue technique.",
    image: {
      src: "/figma-exports/drabe-releasetool.png",
      alt: "Myofascial release and trigger point therapy with a Graston tool",
    },
    // IA-03: owning page is /services/soft-tissue-therapy, which already
    // covers this technique (see content/massage-soft-tissue-page.ts's
    // "Graston Technique / Trigger Point" row) — not a new page.
    href: "/services/soft-tissue-therapy",
    ctaLabel: "Learn more",
  },
  {
    slug: "cupping-therapy",
    name: "Cupping Therapy",
    duration: "1 hr",
    summary:
      "Cupping applies localized suction to selected areas of muscle tension and may be included when appropriate for neck, back, or other soft-tissue concerns.",
    image: { src: "/figma-exports/cupping-drabe.png", alt: "Cupping therapy treatment" },
    // IA-03: owns its own page (lean, no Figma source — see
    // app/services/cupping-therapy/page.tsx's doc comment).
    href: "/services/cupping-therapy",
    ctaLabel: "Learn more",
  },
  {
    slug: "adjustment",
    name: "Adjustment",
    duration: "1 hr",
    summary:
      "Chiropractic adjustments use controlled pressure to improve motion in selected joints of the neck, mid back, or lower back after an appropriate evaluation.",
    image: {
      src: "/figma-exports/drabeadjust.png",
      alt: "Dr. Abe performing a chiropractic adjustment",
    },
    href: "/services/chiropractic-adjustments",
    ctaLabel: "Learn more",
  },
  {
    slug: "traction-decompression",
    name: "Traction/Decompression",
    duration: "1 hr",
    summary:
      "Spinal traction and decompression use a controlled pull for selected neck or lower-back concerns. Settings are based on the evaluation and adjusted to the patient.",
    image: {
      src: "/figma-exports/drabe-traction_compression.png",
      alt: "Spinal traction and decompression therapy",
    },
    href: "/services/spinal-decompression",
    ctaLabel: "Learn more",
  },
  {
    slug: "car-accidents",
    name: "Car Accidents",
    duration: "1 hr",
    summary:
      "After a car accident, request a chiropractic evaluation for neck pain, back pain, stiffness, whiplash symptoms, and other musculoskeletal concerns.",
    image: {
      src: "/figma-exports/drabe-consult.png",
      alt: "Car accident consultation with Dr. Abe",
    },
    href: "/car-accident-chiropractor",
    ctaLabel: "Learn more",
  },
];

/** Rendered list — excludes any entry still pending verification
 * (ATS-E4 4.13), and drops `href` for any service whose owning page isn't
 * published yet (getRouteHref returns null for a draft/unregistered route —
 * see the `href` field's doc comment above). */
export const services: Service[] = allServices
  .filter((service) => !service.needsVerification)
  .map((service) => ({
    ...service,
    href: service.href ? (getRouteHref(service.href) ?? undefined) : undefined,
  }));
