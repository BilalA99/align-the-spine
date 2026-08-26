"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

const IMPACT_VIDEO_SRC = "https://align-the-spine.b-cdn.net/car-accident.mp4";

/** Same three verified county datasets used in the service-area content
 * itself (lib access: county crash data sourced 2026-08-17, see the
 * sources cited on each city page) — kept here as the single place a
 * count matches what the page's own prose already states, so this visual
 * can never drift out of sync with the cited figure. */
const COUNTY_STATS: Record<
  string,
  { crashes: number; perDay: number; label: string; labelEs: string }
> = {
  "Miami-Dade": {
    crashes: 55530,
    perDay: 152,
    label: "Miami-Dade County, 2025",
    labelEs: "condado de Miami-Dade, 2025",
  },
  Broward: {
    crashes: 36871,
    perDay: 101,
    label: "Broward County, 2025",
    labelEs: "condado de Broward, 2025",
  },
  "Palm Beach": {
    crashes: 25349,
    perDay: 69,
    label: "Palm Beach County, 2025",
    labelEs: "condado de Palm Beach, 2025",
  },
};

/** Looping background video for the "why timing matters" card. Muted/loop/
 * playsInline so mobile browsers allow autoplay; preload/play are deferred
 * until the card actually scrolls into view (same warm-then-play
 * IntersectionObserver approach as SpineClip in spine-overview.tsx), so a
 * visitor who never reaches this section never pays for the download —
 * good for both Core Web Vitals and mobile data usage. Purely decorative
 * (aria-hidden, no captions needed) and paused outright for
 * prefers-reduced-motion rather than looping. */
function ImpactVideo({ className }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (reduceMotion) {
      video.preload = "auto";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            video.preload = "auto";
            void video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      { rootMargin: "200px 0px", threshold: 0.2 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <video
      ref={videoRef}
      src={IMPACT_VIDEO_SRC}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      className={className}
    />
  );
}

function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (!active || reduceMotion) return;
    const controls = animate(0, target, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [active, target, reduceMotion]);
  if (reduceMotion) return active ? target : 0;
  return value;
}

/** "Why timing matters" visual for service-area pages — the impact video
 * bleeds to the card's own edges (top strip on mobile, left panel on
 * desktop) and dissolves via a gradient into the same navy the stat/copy
 * side sits on, so it reads as one continuous surface rather than a video
 * bolted onto a card. Counts up the same county crash figures already
 * cited in the page's prose once scrolled into view — illustrative, not a
 * claim about this specific patient's accident; the numbers are the
 * county's own cited statistic, not a fabricated one. */
/** The four strings this card owns, per locale. The county `label` stays
 * in COUNTY_STATS and is localized here rather than duplicated, so the
 * figure and its caption can't drift apart. */
const COPY = {
  en: {
    eyebrow: "Why timing matters",
    crashes: (label: string) => `Traffic crashes — ${label}`,
    perDay: "Crashes every day, county-wide",
    body: "Whiplash and soft-tissue injuries from a collision often don't peak until a day or two later. Florida's PIP timing rules run on a clock regardless — an early evaluation is what creates the documentation your claim needs, whether or not you feel hurt yet.",
  },
  es: {
    eyebrow: "Por qué importa el tiempo",
    crashes: (label: string) => `Choques de tránsito — ${label}`,
    perDay: "Choques por día en todo el condado",
    body: "El latigazo cervical y las lesiones de tejidos blandos por una colisión a menudo no alcanzan su punto máximo hasta uno o dos días después. Las reglas de tiempo del PIP de Florida corren igual — una evaluación temprana es lo que crea la documentación que su reclamo necesita, se sienta lesionado o no.",
  },
} as const;

export function AccidentImpactVisual({
  county,
  locale = "en",
}: {
  county: string;
  locale?: "en" | "es";
}) {
  const stats = COUNTY_STATS[county];
  const copy = COPY[locale];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const crashes = useCountUp(stats?.crashes ?? 0, inView);
  const perDay = useCountUp(stats?.perDay ?? 0, inView);

  if (!stats) return null;

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-40 bg-navy-900 text-white lg:flex lg:items-stretch"
    >
      <div className="relative h-56 w-full overflow-hidden sm:h-64 lg:h-auto lg:w-[50%] lg:shrink-0 xl:w-[46%]">
        {/* scale-[1.8]: the source clip has letterboxing baked into the
         * footage itself (dark bars object-cover can't crop away on their
         * own, since they're part of the pixels, not empty space around
         * them, and on the portrait desktop panel object-cover crops the
         * *width* to fill height, leaving the full — barred — height
         * untouched). 1.5x still let a sliver of bar through at the top on
         * mobile (reported, confirmed via a real screenshot); 1.8x crops
         * enough off every edge, on both the near-16:9 mobile crop and the
         * portrait desktop crop, to clear it with margin. The desktop panel
         * is also widened (46/42% -> 50/46%) so that extra zoom doesn't
         * read as a tighter/more "cut off" crop than before — more of the
         * frame's width is still on screen even though it's more zoomed.
         *
         * The fade is a CSS mask on the video itself, not a separate
         * gradient <div> layered on top — two independently-rendered
         * elements can show a hairline seam where they meet (subpixel
         * rounding at fractional zoom levels), and masking is the one-layer
         * way to guarantee there's nothing to seam against. Mobile fades
         * top (video) -> bottom (solid navy, where the copy starts);
         * desktop fades left (video) -> right, into the copy column beside
         * it. The transition zone now starts early (10%) and runs the full
         * remaining width/height to 100% (was 20/25% -> 95%, which left a
         * flat fully-opaque lead-in and a flat fully-transparent tail on
         * either side of a comparatively short blend) — a longer, earlier
         * dissolve reads as a soft blend into the navy rather than a crop
         * line, on both breakpoints. */}
        <ImpactVideo className="absolute inset-0 h-full w-full scale-[1.8] object-cover [mask-image:linear-gradient(to_bottom,black_0%,black_10%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_10%,transparent_100%)] lg:[mask-image:linear-gradient(to_right,black_0%,black_10%,transparent_100%)] lg:[-webkit-mask-image:linear-gradient(to_right,black_0%,black_10%,transparent_100%)]" />
      </div>

      <div className="relative p-8 pt-6 sm:p-10 sm:pt-8 lg:flex-1 lg:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-300">
          {copy.eyebrow}
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-x-10 gap-y-4">
          <div>
            <p className="font-display text-5xl leading-none sm:text-6xl">
              {crashes.toLocaleString()}
            </p>
            <p className="mt-2 text-sm text-white">
              {copy.crashes(locale === "es" ? stats.labelEs : stats.label)}
            </p>
          </div>
          <div>
            <p className="font-display text-5xl leading-none sm:text-6xl">~{perDay}</p>
            <p className="mt-2 text-sm text-white">{copy.perDay}</p>
          </div>
        </div>
        <p className="mt-6 max-w-xl text-base leading-7 text-white">{copy.body}</p>
      </div>
    </div>
  );
}
