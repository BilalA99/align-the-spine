"use client";

import { useEffect, useState } from "react";

import { TopStatsBar } from "@/components/layout/top-stats-bar";
import { StarIcon } from "@/components/ui/icons/star";
import { DEFAULT_LOCALE, type Locale } from "@/content/i18n";
import type { Testimonial } from "@/content/testimonials";
import { cn } from "@/lib/cn";
import { highlightReviewKeywords } from "@/lib/highlight-review-keywords";

export interface HeroReviewsCarouselProps {
  testimonials: Testimonial[];
  /** Language for the embedded TopStatsBar's labels. Without this the
   * Spanish pages rendered the English stat row ("Reviews / Visits / When
   * it applies / ...") under Spanish headings. */
  locale?: Locale;
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
}

const AUTO_ADVANCE_MS = 7000;

/** Floating review-card carousel that overlaps Hero's bottom edge, per the
 * homepage artboard: a rotating star-rated quote + author (dot pagination)
 * over the same five-stat row TopStatsBar renders (Reviews/Visits/When it
 * applies/Bilingual care/Insurance) — TopStatsBar itself stays hidden behind
 * Hero's negative top margin on every page, so this is what actually makes
 * that stat row visible. Quote/author slide via a translateX track (current
 * exits left, next enters from the right) — pagination dots sit outside the
 * sliding viewport so they never move. */
export function HeroReviewsCarousel({
  testimonials,
  locale = DEFAULT_LOCALE,
  quoteLang,
}: HeroReviewsCarouselProps) {
  const [index, setIndex] = useState(0);
  // WCAG 2.2.2 (Pause, Stop, Hide): auto-advance stops while a pointer or
  // keyboard focus is anywhere in the carousel, and never starts at all for
  // prefers-reduced-motion (ATS-134).
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (testimonials.length <= 1 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [testimonials.length, paused]);

  return (
    <div
      className="bg-white py-2 relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-white via-white/80 to-transparent"
      />

      <div className="container">
        <div className="bg-white py-8">
          {/* ATS-E4 (4.11): omitted entirely when there are no real,
           * client-approved testimonials — an empty bordered row with
           * nothing in it read as a layout bug, not "nothing to show yet". */}
          {testimonials.length > 0 && (
            <div className="flex flex-col gap-4 border-b border-mute-300 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative min-w-0 flex-1 overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    width: `${testimonials.length * 100}%`,
                    transform: `translateX(-${index * (100 / testimonials.length)}%)`,
                  }}
                >
                  {testimonials.map((testimonial, i) => (
                    <div
                      key={i}
                      className="flex shrink-0 flex-col gap-2 pr-4 sm:flex-row sm:items-center sm:gap-3"
                      style={{ width: `${100 / testimonials.length}%` }}
                    >
                      <span className="inline-flex shrink-0 gap-1" aria-hidden="true">
                        {Array.from({ length: 5 }, (_, s) => (
                          <StarIcon key={s} className="h-4 w-4 text-yellow-400" />
                        ))}
                      </span>
                      <p className="min-w-0 font-sans text-card-body text-ink-900" lang={quoteLang}>
                        &ldquo;{highlightReviewKeywords(testimonial.quote)}&rdquo;
                      </p>
                      <span className="shrink-0 font-sans text-stat-label uppercase text-mute-400 sm:ml-auto">
                        –{testimonial.author}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {testimonials.length > 1 && (
                <div
                  className="flex shrink-0 items-center justify-center gap-1.5 sm:justify-start"
                  role="tablist"
                  aria-label="Featured reviews"
                >
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      role="tab"
                      aria-selected={i === index}
                      aria-label={`Show review ${i + 1}`}
                      onClick={() => setIndex(i)}
                      className={cn(
                        "h-1.5 w-1.5 rounded-full transition-colors",
                        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500",
                        i === index ? "bg-navy-900" : "bg-mute-300",
                      )}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <TopStatsBar locale={locale} className="pt-6" />
        </div>
      </div>
    </div>
  );
}
