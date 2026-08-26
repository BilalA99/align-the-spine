import { getRouteHref } from "@/content/seo";

export interface BodyRegion {
  id: string;
  name: string;
  description: string;
  /** Condition-route deep link, when one exists. Falls back to siteConfig.bookingCta.href. */
  href?: string;
  /** Percentage position within the square image container. */
  position: { x: number; y: number };
  /** Hotspot diameter in px (52-128 per spec). */
  size: number;
  labelSide: "left" | "right";
  /** Connector-line width (Tailwind class, e.g. "w-24") to push this region's
   * label further off the diagram. Defaults to "w-16" — used for hotspots that
   * sit over a wide part of the body (e.g. Sciatica) where the label would
   * otherwise read on top of the illustration. */
  labelLineWidth?: string;
}

export interface PointToWhereItHurtsContent {
  eyebrow: string;
  heading: string;
  instruction: string;
  /** Straightened last frame — the resting state, shown once the clip finishes
   * (and the still fallback when there's no clip or reduced motion). */
  image: { src: string; alt: string };
  /** Optional posture clip on the desktop diagram. It plays once, hunched→
   * aligned, the first time the diagram scrolls into view, then rests on
   * `image`; the hotspots stay hidden until it settles. See PointToWhereItHurts. */
  video?: string;
  /** Poster shown before the clip plays — the hunched first frame, so playback
   * starts with no jump. Defaults to `image.src` (the straightened frame). */
  videoPoster?: string;
  regions: BodyRegion[];
  ctaLabel: string;
}

/** "Point to where it hurts" body-diagram copy (Epic 4). Reuses the same body illustration
 * SpineAnatomy used, which this section replaces on the Home page. */
export const pointToWhereItHurtsContent: PointToWhereItHurtsContent = {
  eyebrow: "Understanding the spine",
  heading: "Point to where it hurts",
  instruction: "Select a highlighted region on the diagram to see what might be causing your pain.",
  image: {
    src: "/figma-exports/spine-straight-poster.jpg",
    alt: "A spine straightening from a hunched posture to an upright, aligned one",
  },
  video: "https://align-the-spine.b-cdn.net/images/spine-straight.mp4",
  videoPoster: "/figma-exports/spine-hunched-poster.jpg",
  ctaLabel: "Request Now",
  regions: [
    {
      id: "headaches",
      name: "Headaches",
      description:
        "Tension and cervicogenic headaches often trace back to misalignment in the upper neck.",
      // LINK-01: falls back to the booking CTA while /conditions/cervicogenic-headache
      // stays draft (IA-02) — getRouteHref() returns null until sign-off lands.
      href: getRouteHref("/conditions/cervicogenic-headache") ?? undefined,
      position: { x: 52, y: 14 },
      size: 40,
      labelSide: "right",
    },
    {
      id: "whiplash",
      name: "Whiplash",
      description: "Neck strain, stiffness, and reduced range of motion from sudden impact.",
      href: getRouteHref("/conditions/whiplash") ?? undefined,
      position: { x: 52, y: 25 },
      size: 48,
      labelSide: "right",
    },
    {
      id: "shoulder-pain",
      name: "Shoulder Pain",
      description: "Tightness and restricted movement from postural strain or old injuries.",
      // No dedicated shoulder-pain page exists — stays on the booking CTA
      // rather than a fabricated target (same rule as the accident-injuries
      // "Shoulder & Extremity" card).
      position: { x: 27, y: 44 },
      size: 56,
      labelSide: "left",
    },
    {
      id: "back-pain",
      name: "Back Pain",
      description:
        "Aching or sharp pain along the mid and lower back, often tied to posture or overuse.",
      href: getRouteHref("/conditions/back-pain") ?? undefined,
      position: { x: 58, y: 45 },
      size: 62,
      labelSide: "right",
    },
    {
      id: "herniated-disc",
      name: "Herniated Disc",
      description:
        "A bulging or ruptured disc pressing on nearby nerves, causing pain that radiates outward.",
      href: getRouteHref("/services/spinal-decompression") ?? undefined,
      position: { x: 52, y: 60 },
      size: 72,
      labelSide: "left",
    },
    {
      id: "sciatica",
      name: "Sciatica",
      description: "Sharp, radiating pain down the leg from nerve compression in the lower spine.",
      href: getRouteHref("/conditions/sciatica") ?? undefined,
      position: { x: 52, y: 74 },
      size: 60,
      labelSide: "right",
      labelLineWidth: "w-24",
    },
  ],
};
