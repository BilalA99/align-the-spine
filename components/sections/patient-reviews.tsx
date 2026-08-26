import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { GoogleIcon } from "@/components/ui/icons/google";
import { Rating } from "@/components/ui/rating";
import { Section } from "@/components/ui/section";
import type { Testimonial } from "@/content/testimonials";
import { cn } from "@/lib/cn";
import { highlightReviewKeywords } from "@/lib/highlight-review-keywords";

export interface PatientReviewsProps {
  /** ATS-E4 (4.11): both optional/possibly-empty — content/testimonials.ts
   * has no real, client-approved reviews yet. Renders nothing at all when
   * there's no featured quote and no review cards. */
  featured?: Testimonial;
  reviews: Testimonial[];
  /** "dark" (default) is the original navy-900/white homepage treatment;
   * "light" is white/navy-900 (used on /auto-accidents). */
  variant?: "dark" | "light";
  /** Language of the review text itself.
   *
   * Patient reviews are published verbatim, in whatever language the patient
   * wrote them — they are never translated (a rewritten testimonial presented
   * as someone's own words is a fabricated one). Today every review in
   * content/testimonials.ts is English, so on a Spanish page these quotes are
   * a foreign-language passage inside an `es-US` document. Marking them keeps
   * a screen reader from reading English words with Spanish pronunciation
   * (WCAG 3.1.2, Language of Parts) and tells a crawler the passage is quoted
   * source material rather than untranslated page copy.
   *
   * Undefined on English pages: the quotes match the document language there,
   * and a redundant `lang` would just be noise. */
  quoteLang?: string;
  /** The "read all reviews" cross-link. Defaults to the English /reviews
   * page; the Spanish pages pass /es/resenas. */
  reviewsLink?: { href: string; label: string };
}

/** Full-bleed "PATIENT SUCCESS" reviews band per homepage artboard (Group 10,
 * 96:347–96:394): a large centered featured quote over a three-column row of
 * verified-review cards. */
export function PatientReviews({
  featured,
  reviews,
  variant = "dark",
  quoteLang,
  reviewsLink = { href: "/reviews", label: "Read all patient reviews" },
}: PatientReviewsProps) {
  if (!featured && reviews.length === 0) return null;

  const dark = variant === "dark";

  return (
    <Section spacing="lg" className={dark ? "bg-navy-900" : "bg-white"}>
      <Container className="flex flex-col items-center gap-14">
        {featured && (
          <div className="flex max-w-3xl flex-col items-center gap-6 text-center">
            <Eyebrow variant={dark ? "onDark" : "default"}>Patient success</Eyebrow>
            <p
              className={cn(
                "font-sans text-lg md:text-2xl leading-tight",
                dark ? "text-white" : "text-navy-900",
              )}
              lang={quoteLang}
            >
              {highlightReviewKeywords(featured.quote)}
            </p>
            <div className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  "inline-flex items-center gap-2 font-sans text-stat-label uppercase",
                  dark ? "text-white" : "text-navy-900",
                )}
              >
                – {featured.author}
                <GoogleIcon className="h-4 w-4" />
              </span>
              <span
                className={cn("font-sans text-stat-label", dark ? "text-mute-300" : "text-ink-500")}
              >
                Verified Google review
              </span>
            </div>
          </div>
        )}

        <div className="grid w-full grid-cols-1 gap-10 sm:grid-cols-3">
          {reviews.map((review, i) => (
            <div
              key={`${review.author}-${i}`}
              className={cn(
                "flex flex-col gap-3 border-t pt-6",
                dark ? "border-white/20" : "border-mute-300",
              )}
            >
              <span
                className={cn(
                  "inline-flex items-center gap-2 font-sans text-stat-label uppercase",
                  dark ? "text-mute-300" : "text-navy-900",
                )}
              >
                {review.author}
                <GoogleIcon className="h-4 w-4" />
              </span>
              {dark ? (
                <Rating
                  value={5}
                  filledClassName="text-yellow-400"
                  emptyClassName="text-white/30"
                />
              ) : (
                <Rating value={5} />
              )}
              <p
                className={cn("font-sans text-card-body", dark ? "text-mute-300" : "text-ink-900")}
                lang={quoteLang}
              >
                &ldquo;{highlightReviewKeywords(review.quote)}&rdquo;
              </p>
            </div>
          ))}
        </div>

        {/* ATS-SEO-050: this component never renders on /reviews itself
         * (13 usages, none of them that page), so this is never a
         * same-page self-link. */}
        <Link
          href={reviewsLink.href}
          className={cn(
            "font-sans text-card-body underline underline-offset-4",
            dark ? "text-white" : "text-navy-900",
          )}
        >
          {reviewsLink.label}
        </Link>
      </Container>
    </Section>
  );
}
