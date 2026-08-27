"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { ArrowButton } from "@/components/ui/arrow-button";
import { GoogleIcon } from "@/components/ui/icons/google";
import { QuoteIcon } from "@/components/ui/icons/quote";
import { Rating } from "@/components/ui/rating";
import { DEFAULT_LOCALE, type Locale } from "@/content/i18n";
import { resolveTestimonialQuote, type Testimonial } from "@/content/testimonials";
import { cn } from "@/lib/cn";
import { highlightReviewKeywords } from "@/lib/highlight-review-keywords";

export interface ReviewsCarouselProps {
  reviews: Testimonial[];
  className?: string;
  /** Language this carousel renders in. On "es" each review shows its
   * Spanish translation (content/testimonials.ts's `quoteEs`) marked
   * `lang="es-US"`, with a visible "traducidas del inglés" note — falling
   * back to the untouched English original where no translation exists. */
  locale?: Locale;
}

const AUTO_ADVANCE_MS = 6500;
const SWIPE_THRESHOLD_PX = 60;
/** How far (as a % of the card's own width) the flanking cards sit from
 * center — tuned so they clearly read as distinct cards, not a sliver. */
const SIDE_OFFSET_PERCENT = 68;

/** Signed distance from `index` to `i`, wrapped to the shorter direction
 * around the loop (e.g. with 7 reviews, going from index 6 to 0 is offset
 * +1, not -6) — without this, wraparound would fling the card across the
 * whole track instead of advancing one step like every other transition. */
function circularOffset(i: number, index: number, length: number): number {
  let d = i - index;
  if (d > length / 2) d -= length;
  if (d < -length / 2) d += length;
  return d;
}

/** Single review card. Position/scale/blur are driven entirely by the
 * `animate` prop based on `offset` from the active index — every card stays
 * mounted the whole time (no AnimatePresence enter/exit) so motion just
 * interpolates smoothly between states on every index change, including
 * the flanking cards sliding into and out of the center slot. */
function ReviewCard({
  review,
  offset,
  reduceMotion,
  draggable,
  onDragEnd,
  locale,
}: {
  review: Testimonial;
  offset: number;
  reduceMotion: boolean;
  draggable: boolean;
  onDragEnd: (offsetX: number) => void;
  locale: Locale;
}) {
  const isCenter = offset === 0;
  const isAdjacent = Math.abs(offset) === 1;
  const quote = resolveTestimonialQuote(review, locale);

  return (
    <motion.div
      className={cn(
        "absolute inset-0 mx-auto flex w-full max-w-xl flex-col items-center justify-center gap-4 rounded-30 bg-navy-900 px-6 py-8 text-center shadow-card sm:px-14 sm:py-10",
        isCenter ? "z-20" : "z-10",
        // Flanking cards are a `sm`-and-up flourish — below that there's
        // not enough width for a peek to read as anything but clutter, so
        // mobile just gets the single centered card sliding in and out.
        !isCenter && "hidden sm:flex",
      )}
      style={{ pointerEvents: isCenter ? "auto" : "none" }}
      animate={{
        x: `${offset * SIDE_OFFSET_PERCENT}%`,
        scale: isCenter ? 1 : 0.82,
        opacity: isCenter ? 1 : isAdjacent ? 0.45 : 0,
        filter: isCenter ? "blur(0px)" : "blur(3px)",
      }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      drag={draggable ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.15}
      onDragEnd={(_event, info) => onDragEnd(info.offset.x)}
      aria-hidden={!isCenter}
    >
      <QuoteIcon
        aria-hidden="true"
        className="absolute left-6 top-6 h-8 w-8 text-teal-500/40 sm:left-10 sm:top-10 sm:h-10 sm:w-10"
      />
      <Rating value={5} filledClassName="text-yellow-400" emptyClassName="text-white/20" />
      <p
        className="line-clamp-7 max-w-lg font-display text-xl !leading-snug text-white sm:text-2xl"
        lang={quote.lang}
      >
        &ldquo;{highlightReviewKeywords(quote.text)}&rdquo;
      </p>
      <span className="inline-flex items-center gap-2 font-sans text-stat-label uppercase tracking-wide text-mute-300">
        {review.author}
        <GoogleIcon className="h-4 w-4" />
      </span>
    </motion.div>
  );
}

/** Three-card "coverflow" review spotlight for /reviews (UI-05/UI-08's
 * smaller, approved-scope cousin — not the full Places-API/tag-filter/chart
 * build from UI-08, which is still AWAITING APPROVAL). The active review
 * sits sharp and full-size in the center; the previous/next reviews peek in
 * from either side, smaller and blurred, so the rotation reads as physical
 * cards on a track rather than a flat slideshow. Same pause-on-hover/focus
 * and prefers-reduced-motion discipline as HeroReviewsCarousel (WCAG
 * 2.2.2). No photos/dates per content brief — quote + author only. */
export function ReviewsCarousel({
  reviews,
  className,
  locale = DEFAULT_LOCALE,
}: ReviewsCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = Boolean(useReducedMotion());

  useEffect(() => {
    if (reviews.length <= 1 || paused || reduceMotion) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % reviews.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [reviews.length, paused, reduceMotion]);

  if (reviews.length === 0) return null;

  function goTo(next: number) {
    setIndex((next + reviews.length) % reviews.length);
  }

  return (
    <div
      className={cn("relative mx-auto w-full", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* No overflow-hidden here on purpose — the flanking cards should
       * show in full, not get hard-clipped at an arbitrary box edge (that
       * read as broken/glitchy, not intentional). body's global
       * `overflow-x: clip` (globals.css) is the only backstop, so on very
       * narrow viewports a peek card's outer sliver may run to the actual
       * screen edge instead of a visible inner boundary — acceptable,
       * since it's a soft viewport crop rather than a hard box line. */}
      <div className="relative mx-auto h-[420px] max-w-5xl sm:h-[400px]">
        {reviews.map((review, i) => (
          <ReviewCard
            key={i}
            review={review}
            offset={circularOffset(i, index, reviews.length)}
            reduceMotion={reduceMotion}
            draggable={circularOffset(i, index, reviews.length) === 0 && reviews.length > 1}
            onDragEnd={(offsetX) => {
              if (offsetX < -SWIPE_THRESHOLD_PX) goTo(index + 1);
              else if (offsetX > SWIPE_THRESHOLD_PX) goTo(index - 1);
            }}
            locale={locale}
          />
        ))}
      </div>

      {reviews.length > 1 && (
        <div className="mt-8 flex items-center justify-center gap-6">
          <ArrowButton
            label="Previous review"
            size="sm"
            onClick={() => goTo(index - 1)}
            className="[&_svg]:rotate-180"
          />

          <div className="flex items-center gap-2" role="tablist" aria-label="Reviews">
            {reviews.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show review ${i + 1}`}
                onClick={() => goTo(i)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500",
                  i === index ? "w-6 bg-navy-900" : "w-2 bg-mute-300",
                )}
              />
            ))}
          </div>

          <ArrowButton label="Next review" size="sm" onClick={() => goTo(index + 1)} />
        </div>
      )}
    </div>
  );
}
