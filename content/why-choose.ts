import type { DoctorRating } from "@/content/doctor-profile";
import { siteConfig } from "@/content/site";
import { verified, type VerifiedValue } from "@/content/verified-value";

export interface WhyChooseContent {
  /** Rendered as separate lines (one <br /> between each) rather than a
   * single wrapped string — design's fixed "Why Choose / Align the Spine /
   * Chiropractic" 3-line split is uneven (2/3/1 words), which CSS wrapping
   * can't reproduce on its own. */
  headingLines: [string, string, string];
  body: string;
  cta: { label: string; href: string };
  rating: VerifiedValue<DoctorRating>;
  image: { src: string; alt: string };
}

/** WhyChoose copy + image per homepage artboard (96:496–96:503), ATS-072.
 * ATS-E4 (4.5): "All major insurance accepted" and an unconfirmed "15
 * years" tenure claim were removed from `body` — neither has client
 * approval. */
export const whyChooseContent: WhyChooseContent = {
  headingLines: ["Why Choose", "Align the Spine", "Chiropractic"],
  body: "From everyday back pain and sports injuries to complex accident recovery, Align the Spine was built around one belief: great chiropractic care should be accessible to everyone. Transparent pricing, explained clearly. And a doctor who actually knows your name — because at Align the Spine, you always see Dr. Abe.",
  cta: { label: "Book an appointment", href: siteConfig.bookingCta.href },
  // Reuses the same approved 152-review figure already live in
  // siteConfig.stats and DoctorProfile (content/doctor-profile.ts) rather
  // than asserting a new unverified claim.
  rating: verified<DoctorRating>(
    { value: 5, count: 164, location: "Deerfield Beach, Florida" },
    "Matches the already-verified review count in siteConfig.stats",
    "2026-08-12",
  ),
  image: { src: "/figma-exports/interior-table.png", alt: "Align the Spine treatment room" },
};
