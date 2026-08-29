import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { GoogleIcon } from "@/components/ui/icons/google";
import { Rating } from "@/components/ui/rating";
import { Section } from "@/components/ui/section";
import { DEFAULT_LOCALE, type Locale } from "@/content/i18n";
import { resolveTestimonialQuote, type Testimonial } from "@/content/testimonials";
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
  /** Language this block renders in. On "es" each review shows its Spanish
   * translation (content/testimonials.ts's `quoteEs`) with a visible
   * "traducidas del inglés" note beneath, falling back to the untouched
   * English original where no translation exists. */
  locale?: Locale;
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
  locale = DEFAULT_LOCALE,
  reviewsLink = { href: "/reviews", label: "Read all patient reviews" },
}: PatientReviewsProps) {
  if (!featured && reviews.length === 0) return null;

  const dark = variant === "dark";
  const featuredQuote = featured ? resolveTestimonialQuote(featured, locale) : null;
  const cardQuotes = reviews.map((review) => resolveTestimonialQuote(review, locale));
  // Shown once under the block, not per quote: the reader has to know these
  // are translations rather than the reviewers' own wording, but repeating
  // that on every card would drown the reviews themselves.
  const showsTranslations =
    Boolean(featuredQuote?.translated) || cardQuotes.some((quote) => quote.translated);

  return (
    <Section spacing="lg" className={dark ? "bg-navy-900" : "bg-white"}>
      <Container className="flex flex-col items-center gap-14">
        {featured && (
          <div className="flex max-w-3xl flex-col items-center gap-6 text-center">
            <Eyebrow variant={dark ? "onDark" : "default"}>Patient success</Eyebrow>
            <p
              className={cn(
                "font-sans text-xl md:text-2xl leading-tight",
                dark ? "text-white" : "text-navy-900",
              )}
              lang={featuredQuote?.lang}
            >
              {highlightReviewKeywords(featuredQuote?.text ?? "")}
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
          {reviews.map((review, index) => (
            <div
              key={`${review.author}-${index}`}
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
                lang={cardQuotes[index].lang}
              >
                &ldquo;{highlightReviewKeywords(cardQuotes[index].text)}&rdquo;
              </p>
            </div>
          ))}
        </div>

        {/* ATS-SEO-050: this component never renders on /reviews itself
         * (13 usages, none of them that page), so this is never a
         * same-page self-link. */}
        {showsTranslations && (
          <p
            className={cn(
              "max-w-2xl text-center font-sans text-small-print",
              dark ? "text-mute-300" : "text-ink-500",
            )}
          >
            Reseñas traducidas del inglés. El texto original es el que escribió cada paciente.
          </p>
        )}

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
