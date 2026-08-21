import type { ComponentType, SVGProps } from "react";

import { ActivityIcon } from "@/components/ui/icons/activity";
import { ExpandVerticalIcon } from "@/components/ui/icons/expand-vertical";
import { HandIcon } from "@/components/ui/icons/hand";
import { PinIcon } from "@/components/ui/icons/pin";
import { RingsIcon } from "@/components/ui/icons/rings";
import { WavesIcon } from "@/components/ui/icons/waves";
import { ZapIcon } from "@/components/ui/icons/zap";
import { isVerified, mapVerified, verified, type VerifiedValue } from "@/content/verified-value";

export interface Address {
  line1: string;
  suite: string;
  city: string;
  state: string;
  zip: string;
}

export interface DayHours {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  open: string;
  close: string;
}

export interface NavMenuItem {
  label: string;
  href: string;
  description: string;
  /** Preview photo shown in the dropdown's image panel while this item is
   * hovered/focused — reuses each page's own existing hero photo rather
   * than a new asset. */
  image: { src: string; alt: string };
  /** Icon shown in the mega-menu row next to the label. */
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export interface NavLink {
  label: string;
  href: string;
  /** Optional mega-menu items — when present, Navbar renders this link as
   * a hover-triggered dropdown (desktop) or expandable accordion (mobile)
   * instead of a plain link. `href` itself still navigates on click (it's
   * the group's closest "view all" destination), the dropdown/accordion
   * is purely an additional way in. */
  menu?: NavMenuItem[];
}

export interface SocialLink {
  platform: string;
  url: string;
  /** True only once marketing has confirmed this is the correct, live GBP/
   * social URL for the practice. lib/schema.ts's buildOrganization() omits
   * unverified entries from `sameAs` entirely rather than publish a guess. */
  verified: boolean;
}

export interface Geo {
  latitude: number;
  longitude: number;
}

export interface ReviewsRating {
  rating: number;
  count: number;
}

export interface SiteConfig {
  /** Canonical production origin (no trailing slash) — used for the
   * sitemap, robots.txt, metadataBase, and JSON-LD `url` fields. */
  siteUrl: string;
  business: {
    name: string;
    /** Shorter form of `name` for title-tag suffixes ("| {shortName}") —
     * the full "Align the Spine Chiropractic" pushed nearly every page
     * title in content/seo.ts past Google's ~60-character SERP truncation
     * point on its own, before the page-specific part was even counted. */
    shortName: string;
    phone: string;
    phoneHref: string;
    email: string;
    address: Address;
    /** Client-confirmed rooftop geocode for 811 SE 8th Ave Ste 101,
     * Deerfield Beach, FL 33441 (SEO Foundation Phase 1). */
    geo: Geo;
  };
  hours: DayHours[];
  /** True only once the client has confirmed these are the practice's
   * actual, current hours. lib/schema.ts's buildMedicalBusiness() omits
   * openingHoursSpecification entirely while this is false. */
  hoursVerified: boolean;
  nav: NavLink[];
  bookingCta: NavLink;
  footer: {
    tagline: string;
    links: NavLink[];
    copyrightName: string;
  };
  /** ATS-E4 (4.6): home-visit coverage area — was asserted as fixed fact
   * (6 named cities) with no confirmation it's actually accurate/current.
   * Gated until approved; ServiceAreas renders nothing meanwhile. */
  serviceAreas: string[];
  /** True only once the client has confirmed the service-areas list is
   * accurate/current. ServiceAreas and lib/seo/local-business.ts's
   * areaServed both omit this data entirely while this is false. */
  serviceAreasVerified: boolean;
  /** ATS-E4 (4.8): no real social URLs exist yet (both were "#"
   * placeholders). Nothing currently renders this field, but it's typed
   * as gated so a future renderer can't accidentally ship placeholder
   * links. */
  social: SocialLink[];
  /** SEO Foundation Phase 1: the old "Reviews 152 / Visits Same-day / When
   * it applies Home visits / Bilingual care EN/ES / Insurance $0 with PIP"
   * stat row was five unrelated claims gated by one shared boolean — which
   * is exactly how a stale `statsVerified: true` ended up publishing all
   * five at once, including a fabricated review count and a banned "$0 with
   * PIP" coverage claim, with nothing to catch it. Each claim now has its
   * own gate, so approving one can never leak the others. `pipHandling`
   * deliberately never states a dollar figure — under Fla. Stat.
   * 627.736(1)(a), PIP medical benefits are 80% of reasonable expenses
   * capped at $2,500 unless an MD/DO/dentist/PA/APRN certifies an emergency
   * medical condition, a determination a chiropractic physician isn't
   * authorized to make, so "$0" isn't a promise this practice can stand
   * behind. `reviewsRating` is the single source doctor-profile.ts's rating
   * badge reads from too, so the two can't drift into the same
   * contradiction a duplicated, independently-"verified" copy caused before. */
  sameDayAvailability: VerifiedValue<string>;
  homeVisitsAvailable: VerifiedValue<string>;
  bilingualCare: VerifiedValue<string>;
  pipHandling: VerifiedValue<string>;
  reviewsRating: VerifiedValue<ReviewsRating>;
}

const businessHours: DayHours[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
].map((day) => ({ day: day as DayHours["day"], open: "7:00 AM", close: "11:00 PM" }));

/** True only for actual Vercel production deploys. Local dev, CI, and
 * Vercel preview builds are all treated as non-production so metadata/
 * robots default to noindex — fail closed rather than risk a preview
 * leaking into search. */
export function isProduction(): boolean {
  return process.env.VERCEL_ENV === "production";
}

/** A missing SITE_URL must never silently fall back in an actual production
 * deploy — that's exactly how every canonical/sitemap/schema URL on this
 * site ended up pointing at the wrong (legacy) domain before. Local dev and
 * CI never set VERCEL_ENV=production, so they still get a safe, real-domain
 * fallback instead of failing every command that touches this module. */
export function resolveSiteUrl(): string {
  const envUrl = process.env.SITE_URL;
  if (envUrl) return envUrl;
  if (isProduction()) {
    throw new Error("content/site.ts: SITE_URL must be set in production — refusing to fall back.");
  }
  return "https://chirobackpain.com";
}

export const siteConfig: SiteConfig = {
  siteUrl: resolveSiteUrl(),
  business: {
    name: "Align the Spine Chiropractic",
    shortName: "Align the Spine",
    phone: "954-282-1801 ",
    phoneHref: "tel:+19542821801 ",
    email: "info@chirobackpain.com",
    address: {
      line1: "811 SE 8th Ave",
      suite: "Ste 101",
      city: "Deerfield Beach",
      state: "FL",
      zip: "33441",
    },
    geo: { latitude: 26.3067873, longitude: -80.0944778 },
  },
  hours: businessHours,
  // Public sources currently conflict. A design is not operational evidence;
  // omit hours from UI/schema until the owner or GBP record is confirmed.
  hoursVerified: false,
  nav: [
    {
      label: "Services",
      href: "/services",
      menu: [
        {
          label: "Chiropractic Adjustments",
          href: "/services/chiropractic-adjustments",
          description: "Restoring the motion a collision took away.",
          icon: ActivityIcon,
          image: {
            src: "/figma-exports/adjustments-hero.png",
            alt: "Dr. Abe performing a chiropractic adjustment",
          },
        },
        {
          label: "Spinal Decompression",
          href: "/services/spinal-decompression",
          description: "Gentle traction to relieve pressure on discs and nerves.",
          icon: ExpandVerticalIcon,
          image: {
            src: "/figma-exports/spinal-decompression-hero.png",
            alt: "Spinal decompression treatment",
          },
        },
        {
          label: "Massage / Soft-Tissue",
          href: "/services/soft-tissue-therapy",
          description: "Targeted therapy for muscle tension and scar tissue.",
          icon: HandIcon,
          image: {
            src: "/figma-exports/massage-soft-tissue-hero.png",
            alt: "Massage and soft-tissue therapy session",
          },
        },
        {
          label: "Cupping Therapy",
          href: "/services/cupping-therapy",
          description: "Localized suction for selected areas of muscle tension.",
          icon: RingsIcon,
          image: {
            src: "/figma-exports/cupping-drabe.png",
            alt: "Cupping therapy treatment",
          },
        },
      ],
    },
    {
      label: "Conditions",
      href: "/conditions",
      menu: [
        {
          label: "Lower Back Pain",
          href: "/conditions/back-pain",
          description: "Disc, muscle, and nerve pain after an accident.",
          icon: ActivityIcon,
          image: {
            src: "/figma-exports/drabe-backpain-front.png",
            alt: "Dr. Abe examining a patient's lower back",
          },
        },
        {
          label: "Neck Pain",
          href: "/conditions/neck-pain",
          description: "Stiffness and tension radiating into the shoulders.",
          icon: WavesIcon,
          image: {
            src: "/figma-exports/dr-abe-neck.png",
            alt: "Dr. Abe examining a patient's neck",
          },
        },
        {
          label: "Whiplash",
          href: "/conditions/whiplash",
          description: "The sudden-impact neck injury most accidents cause.",
          icon: ZapIcon,
          image: {
            src: "/figma-exports/drabe-whiplash-man.png",
            alt: "Dr. Abe treating a patient for whiplash",
          },
        },
        {
          label: "Sciatica",
          href: "/conditions/sciatica",
          description: "Radiating nerve pain down the leg.",
          icon: ZapIcon,
          image: {
            src: "/figma-exports/drabe-backpain-front.png",
            alt: "Dr. Abe examining a patient for sciatica",
          },
        },
        {
          label: "Concussion",
          href: "/conditions/concussion",
          description: "Brain injury that can happen without hitting your head.",
          icon: RingsIcon,
          image: {
            src: "/figma-exports/drabe-headache.png",
            alt: "Dr. Abe examining a patient after a car accident",
          },
        },
        {
          label: "Cervicogenic Headache",
          href: "/conditions/cervicogenic-headache",
          description: "Headaches that actually start in the neck.",
          icon: WavesIcon,
          image: {
            src: "/figma-exports/drabe-headache.png",
            alt: "Dr. Abe examining a patient for headache-related neck tension",
          },
        },
        {
          label: "TMJ / Jaw Pain",
          href: "/conditions/tmj-jaw-pain",
          description: "Jaw trauma the same impact that causes whiplash.",
          icon: RingsIcon,
          image: {
            src: "/figma-exports/drabe-headache.png",
            alt: "Dr. Abe examining a patient's jaw",
          },
        },
      ],
    },
    {
      label: "Resources",
      href: "/blog",
      menu: [
        {
          label: "Blog",
          href: "/blog",
          description: "Reviewed resources for accident care, mobility, and first visits.",
          icon: ActivityIcon,
          image: {
            src: "/figma-exports/interior-reception.png",
            alt: "Align the Spine reception area",
          },
        },
        {
          label: "About Dr. Abe",
          href: "/about",
          description: "Meet the chiropractor behind the Deerfield Beach practice.",
          icon: HandIcon,
          image: {
            src: "/figma-exports/portrait.png",
            alt: "Dr. Abe Nasser",
          },
        },
        {
          label: "Patient Reviews",
          href: "/reviews",
          description: "Read approved patient feedback about the practice.",
          icon: RingsIcon,
          image: {
            src: "/figma-exports/interior-table.png",
            alt: "Treatment room at Align the Spine Chiropractic",
          },
        },
      ],
    },
    {
      label: "Service Areas",
      href: "/service-areas",
      menu: [
        {
          label: "Lighthouse Point",
          href: "/service-areas/lighthouse-point",
          description: "Broward County home-visit eligibility for car-accident/PIP cases.",
          icon: PinIcon,
          image: {
            src: "https://align-the-spine.b-cdn.net/images/WhatsApp%20Image%202026-08-17%20at%2017.38.56%20(1).jpeg",
            alt: "Align the Spine treatment room",
          },
        },
        {
          label: "Fort Lauderdale",
          href: "/service-areas/fort-lauderdale",
          description: "Broward County home-visit eligibility for car-accident/PIP cases.",
          icon: PinIcon,
          image: {
            src: "https://align-the-spine.b-cdn.net/images/WhatsApp%20Image%202026-08-17%20at%2017.38.56%20(1).jpeg",
            alt: "Align the Spine treatment room",
          },
        },
        {
          label: "Hollywood",
          href: "/service-areas/hollywood",
          description: "Broward County home-visit eligibility for car-accident/PIP cases.",
          icon: PinIcon,
          image: {
            src: "https://align-the-spine.b-cdn.net/images/PHOTO-2026-08-17-17-38-56.jpg",
            alt: "Align the Spine office signage",
          },
        },
        {
          label: "Pompano Beach",
          href: "/service-areas/pompano-beach",
          description: "Broward County home-visit eligibility for car-accident/PIP cases.",
          icon: PinIcon,
          image: {
            src: "https://align-the-spine.b-cdn.net/images/WhatsApp%20Image%202026-08-17%20at%2017.38.56%20(1).jpeg",
            alt: "Align the Spine treatment room",
          },
        },
        {
          label: "Pembroke Pines",
          href: "/service-areas/pembroke-pines",
          description: "Broward County home-visit eligibility for car-accident/PIP cases.",
          icon: PinIcon,
          image: {
            src: "https://align-the-spine.b-cdn.net/images/PHOTO-2026-08-17-17-38-56.jpg",
            alt: "Align the Spine office signage",
          },
        },
        {
          label: "West Palm Beach",
          href: "/service-areas/west-palm-beach",
          description: "Palm Beach County home-visit eligibility for car-accident/PIP cases.",
          icon: PinIcon,
          image: {
            src: "https://align-the-spine.b-cdn.net/images/WhatsApp%20Image%202026-08-17%20at%2017.38.56%20(1).jpeg",
            alt: "Align the Spine treatment room",
          },
        },
        {
          label: "Boca Raton",
          href: "/service-areas/boca-raton",
          description: "Palm Beach County home-visit eligibility for car-accident/PIP cases.",
          icon: PinIcon,
          image: {
            src: "https://align-the-spine.b-cdn.net/images/PHOTO-2026-08-17-17-38-56.jpg",
            alt: "Align the Spine office signage",
          },
        },
        {
          label: "Miami",
          href: "/service-areas/miami",
          description: "Miami-Dade County home-visit eligibility for car-accident/PIP cases.",
          icon: PinIcon,
          image: {
            src: "https://align-the-spine.b-cdn.net/images/WhatsApp%20Image%202026-08-17%20at%2017.38.56%20(1).jpeg",
            alt: "Align the Spine treatment room",
          },
        },
        {
          label: "View all 19 service areas",
          href: "/service-areas",
          description: "The full list, plus the one verified Deerfield Beach office.",
          icon: WavesIcon,
          image: {
            src: "/figma-exports/exterior-img.png",
            alt: "Exterior of the Deerfield Beach office building",
          },
        },
      ],
    },
    { label: "Auto Accidents", href: "/car-accident-chiropractor" },
  ],
  // ATS-E3 (3.4): "Request" not "Book" — nothing auto-confirms a slot.
  bookingCta: { label: "Request Appointment", href: "/book-an-appointment" },
  footer: {
    tagline: "Chiropractic care in Deerfield Beach, from your first exam through recovery.",
    links: [
      { label: "Accident Care", href: "/car-accident-chiropractor" },
      { label: "About Dr. Abe", href: "/about" },
      { label: "Reviews", href: "/reviews" },
      { label: "Blog", href: "/blog" },
      { label: "Service Areas", href: "/service-areas" },
      // { label: "Contact Us", href: "/contact-us" },
    ],
    copyrightName: "Align the Spine Chiropractic",
  },
  // Client-confirmed 2026-08-17: Dr. Abe travels to these communities for
  // home-visit evaluations of eligible car-accident/PIP patients. This is
  // not a claim of a second physical office or general walk-in service in
  // every city — see components/sections/service-areas.tsx (gated on
  // serviceAreasVerified, rendered only on /home-visit-chiropractor) and
  // lib/schema.ts's buildServiceAreaSchema (per-page, home-visit-scoped).
  serviceAreas: [
    "Deerfield Beach",
    "Lighthouse Point",
    "Pompano Beach",
    "Fort Lauderdale",
    "Hollywood",
    "Pembroke Pines",
    "Davie",
    "Coral Springs",
    "Coconut Creek",
    "Margate",
    "Sunrise",
    "Tamarac",
    "Miami",
    "Hialeah",
    "Miami Beach",
    "Miami Gardens",
    "West Palm Beach",
    "Boca Raton",
    "Delray Beach",
    "Boynton Beach",
  ],
  serviceAreasVerified: true,
  social: [
    { platform: "Facebook", url: "#", verified: false },
    { platform: "Instagram", url: "#", verified: false },
  ],
  sameDayAvailability: verified<string>(
    "Same-day",
    "Client-confirmed (implementation brief update #4, 2026-08-11)",
    "2026-08-11",
  ),
  homeVisitsAvailable: verified<string>(
    "Home visits",
    "Client-confirmed (implementation brief update #4, 2026-08-11)",
    "2026-08-11",
  ),
  bilingualCare: verified<string>(
    "EN/ES",
    "Client-confirmed (implementation brief update #4, 2026-08-11)",
    "2026-08-11",
  ),
  pipHandling: verified<string>(
    "PIP accepted",
    "Client-confirmed (implementation brief update #4, 2026-08-11) — reworded off the original zero-dollar figure per Fla. Stat. 627.736(1)(a), see docs/CLAIMS_PENDING.md",
    "2026-08-11",
  ),
  reviewsRating: verified<ReviewsRating>(
    { rating: 5, count: 164 },
    "Client-confirmed (implementation brief update #4, 2026-08-11)",
    "2026-08-11",
  ),
};

export interface DisplayStat {
  label: string;
  value: string;
}

/** Collapses the individually-gated claims above into a display-ready list —
 * the single source both TopStatsBar and StatChipRow read from, so the two
 * can't diverge on which stats they show or how they're worded. */
export function getVerifiedStats(): DisplayStat[] {
  const claims: { label: string; claim: VerifiedValue<string> }[] = [
    { label: "Reviews", claim: mapVerified(siteConfig.reviewsRating, (r) => String(r.count)) },
    { label: "Visits", claim: siteConfig.sameDayAvailability },
    { label: "When it applies", claim: siteConfig.homeVisitsAvailable },
    { label: "Bilingual care", claim: siteConfig.bilingualCare },
    { label: "Insurance", claim: siteConfig.pipHandling },
  ];
  return claims.flatMap(({ label, claim }) =>
    isVerified(claim) ? [{ label, value: claim.value }] : [],
  );
}
