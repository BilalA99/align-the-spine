import type { ReactNode } from "react";
import Image from "next/image";

import type { HeroFormConfig } from "@/components/sections/hero";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { FadeIn } from "@/components/ui/fade-in";
import { CheckIcon } from "@/components/ui/icons/check";
import { PhoneIcon } from "@/components/ui/icons/phone";
import { LeadForm } from "@/components/ui/lead-form";
import { MobileLeadPreviewCard } from "@/components/ui/mobile-lead-preview-card";
import { Rating } from "@/components/ui/rating";
import { esLeadFormVariants } from "@/content/es/lead-forms";
import { DEFAULT_LOCALE, type Locale } from "@/content/i18n";
import { leadFormVariants, type LeadFormVariant } from "@/content/lead-forms";
import { getVerifiedStats, siteConfig } from "@/content/site";
import { isVerified } from "@/content/verified-value";
import type { BreadcrumbItemInput } from "@/lib/schema";

import { Container } from "../ui/container";

/** Trust-badge marquee: star rating + review count, plus whatever else is
 * verified (same-day, PIP accepted, etc.) as small pills, sliding slowly in
 * an endless loop. Renders nothing when nothing is verified yet, same as
 * every other verified-claim consumer. Pill treatment (bg-white/10,
 * rounded-full) reuses existing tokens — same glass-pill idea as Button's
 * "glass" variant and StatChipRow's bg-overlay-white-15, not a new visual
 * language. The track renders the pill set twice back-to-back
 * (aria-hidden on the second copy) and CSS-animates a translateX(-50%)
 * loop (globals.css's .animate-trust-marquee) — seamless as long as both
 * copies are identical, which they always are here. */
function HeroTrustLine({ className }: { className?: string }) {
  const reviews = siteConfig.reviewsRating;
  const otherStats = getVerifiedStats().filter((stat) => stat.label !== "Reviews");
  const hasReviews = isVerified(reviews);

  if (!hasReviews && otherStats.length === 0) return null;

  const pills = (
    <>
      {hasReviews && (
        <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-white/20 bg-white/10 py-1.5 pl-3 pr-3.5">
          <Rating
            value={reviews.value.rating}
            filledClassName="text-gold-400"
            emptyClassName="text-white/30"
          />
          <span className="font-sans text-stat-label text-white">
            {reviews.value.rating.toFixed(1)} ({reviews.value.count} reviews)
          </span>
        </span>
      )}
      {otherStats.map((stat) => (
        <span
          key={stat.label}
          className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-white/20 bg-white/10 py-1.5 pl-2.5 pr-3.5 font-sans text-stat-label text-white"
        >
          <CheckIcon className="h-3.5 w-3.5 shrink-0 text-teal-300" />
          {stat.value}
        </span>
      ))}
    </>
  );

  return (
    <div className={`trust-marquee-fade w-full overflow-hidden ${className ?? ""}`}>
      <div className="flex w-max animate-trust-marquee gap-3 motion-reduce:animate-none">
        <div className="flex shrink-0 gap-3 pr-3">{pills}</div>
        <div className="flex shrink-0 gap-3 pr-3" aria-hidden="true">
          {pills}
        </div>
      </div>
    </div>
  );
}

/** The handful of strings this component renders itself, rather than
 * receiving from its caller. */
const HERO_COPY: Record<Locale, { continueLabel: string; callNow: string; callPrefix: RegExp }> = {
  en: { continueLabel: "Request Appointment", callNow: "Call Now:", callPrefix: /^Call / },
  es: { continueLabel: "Solicitar cita", callNow: "Llame ahora:", callPrefix: /^Llamar al / },
};

export interface HeroSolidPanelProps {
  background: { src: string; alt: string };
  eyebrow?: string;
  /** Teal pill above the headline, e.g. "Office visits are $50". */
  badge?: string;
  title: ReactNode;
  subhead: ReactNode;
  callPill?: { eyebrow: string; phone: string };
  /** Condition-variant bilingual-care note below the call pill, e.g.
   * "¿Habla español? Dr. Abe habla su idioma." */
  bilingualNote?: string;
  /** Condition-page stat callout below the call pill (e.g. the
   * /auto-accidents Florida PIP coverage figure) — divider, large value,
   * descriptive line, matching Hero's condition variant. */
  stat?: { value: string; description: string };
  form?: HeroFormConfig;
  /** Replaces the default form entirely, same escape hatch as Hero's formSlot. */
  formSlot?: ReactNode;
  /** LINK-02: renders both the visible breadcrumb trail (BreadcrumbTrail)
   * and its matching BreadcrumbList JSON-LD (BreadcrumbJsonLd) from one
   * shared items array, so they can't drift. Omit on pages that don't need
   * one (currently just Home). Always starts with `{ name: "Home", path: "" }`. */
  breadcrumbs?: BreadcrumbItemInput[];
  /** Language for the embedded lead form (validation messages, step
   * counter, thank-you redirect) and for the labels this component renders
   * itself — the mobile call button's prefix and the desktop form's
   * "Continue". Defaults to English. */
  locale?: Locale;
}

/** Alternate Hero treatment ("homepage-round-buttons-new-hero" in Figma):
 * photo confined to a left column instead of bleeding full-width, and the
 * lead form sits in a solid navy panel instead of Hero's LiquidGlass card
 * — at `lg` and up. Shares Hero's background-bleed trick there (negative
 * top margin sized to TopStatsBar so the photo starts at the viewport's
 * true top, behind the fixed transparent Navbar) — see
 * docs/superpowers/specs/2026-07-15-hero-section-design.md.
 *
 * Below `lg` this is a genuinely different composition, not a squeezed
 * version of the desktop one: photo leads (matching the site's established
 * look) with the H1/subhead/trust-marquee/call-pill overlaid on it as
 * before, and the lead form lives in a compact LiquidGlass card that
 * overlaps the photo's bottom edge — same card treatment Hero.tsx already
 * uses for its own form, just floating instead of inline, showing every
 * field at once like every other form on the site (ATS-147: two-step forms
 * were removed sitewide — with only 3-5 fields per variant, splitting them
 * added friction without a real payoff). A full-width call button sits
 * right under the card as an equal-weight alternative. No negative-margin
 * bleed below `lg`: TopStatsBar is
 * `hidden` there (components/layout/root-shell.tsx), so the section
 * already starts at the viewport's true top with nothing to cancel out —
 * the H1's own pt-[120px] alone clears the fixed Navbar.
 *
 * Both columns' content is top-aligned (`justify-start`, not
 * `justify-center`) to the *same* `pt` at each breakpoint instead of being
 * vertically centered independently — centering meant the H1 and the form
 * panel's heading drifted apart depending on how tall each column's own
 * content happened to be (optional eyebrow/badge, footer note, etc.), so
 * they never actually lined up. Pinning both to one shared top offset is
 * what makes them align. */
export function HeroSolidPanel({
  background,
  eyebrow,
  badge,
  title,
  subhead,
  callPill,
  bilingualNote,
  stat,
  form,
  formSlot,
  breadcrumbs,
  locale = DEFAULT_LOCALE,
}: HeroSolidPanelProps) {
  const heroCopy = HERO_COPY[locale];
  const defaultFields =
    locale === "es" ? esLeadFormVariants.heroEval.fields : leadFormVariants.heroEval.fields;
  // Pages like /about pass no form/formSlot — don't render the empty navy
  // panel there; let the photo column (lg:flex-1) fill the full width instead.
  const hasForm = Boolean(formSlot || form);
  return (
    <section className="relative flex flex-col overflow-hidden lg:-mt-[176px] lg:min-h-[860px] lg:flex-row ">
      {breadcrumbs && <BreadcrumbJsonLd items={breadcrumbs} />}
      <div className="relative min-h-[620px] min-w-0 lg:min-h-full lg:flex-1 pt-10">
        <Image
          src={background.src}
          alt={background.alt}
          fill
          priority
          sizes="(min-width: 1024px) 62vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/50" />
        <Container>
          <div className="container relative z-10 flex h-full flex-col justify-start pt-[120px] pb-24 lg:pb-[60px] lg:pt-[220px] lg:pr-12">
            {breadcrumbs && <BreadcrumbTrail items={breadcrumbs} className="mb-4" />}
            {eyebrow && <Eyebrow variant="onDark">{eyebrow}</Eyebrow>}
            {badge && (
              <span className="mb-4 w-fit rounded-full bg-teal-500 px-6 py-3 font-sans text-button text-white">
                {badge}
              </span>
            )}

            <h1 className="font-display text-hero font-medium text-white">
              <FadeIn as="span">{title}</FadeIn>
            </h1>

            <p className="max-w-[560px] font-sans text-body-lg text-white mt-9">
              <FadeIn as="span" delay={0.15}>
                {subhead}
              </FadeIn>
            </p>

            {/* <HeroTrustLine className="mt-5" /> */}

            {callPill && (
              <a
                href={siteConfig.business.phoneHref}
                className="group flex items-start gap-4 mt-6 mb-2 lg:mt-10"
              >
                <PhoneIcon className="size-15 shrink-0 rounded-full bg-teal-500 p-2.5 text-white transition-colors duration-300 group-hover:bg-navy-700" />
                <span className="flex flex-col">
                  <span className="font-alt text-alt-label text-mute-300">{callPill.eyebrow}</span>
                  {/* Pinned to the ORIGINAL hero's h2 scale (max 35px). The
                   * site-wide `h2` token was later bumped to 48px max, which
                   * makes "Call (954) 573-7192" wrap on a 375px viewport. */}
                  <span className="font-display text-[length:clamp(24px,0.81vw_+_20.95px,35px)] text-white leading-10 underline decoration-transparent underline-offset-4 transition-colors duration-300 group-hover:decoration-current">
                    {callPill.phone}
                  </span>
                </span>
              </a>
            )}

            {bilingualNote && (
              <p className="font-alt text-alt-label text-mute-300">{bilingualNote}</p>
            )}

            {stat && (
              <div className="relative">
                <div className="absolute left-[-10%] h-px w-xl mt-3 bg-teal-300" />
                <div className="flex flex-row gap-4 pt-6">
                  <span className="mr-3 font-display text-[length:clamp(24px,0.81vw_+_20.95px,35px)] text-white">
                    {stat.value}
                  </span>
                  <span className="font-sans text-body-lg text-mute-300">{stat.description}</span>
                </div>
              </div>
            )}
          </div>
        </Container>
      </div>

      {/* Below `lg`: compact tap-to-expand preview card + call button,
       * overlapping the photo's bottom edge. Hidden at `lg`, where the full
       * navy panel below takes over instead. Owner direction 2026-08-19
       * (matching a reference client's mobile CRO pattern): a mobile
       * visitor now sees a two-field preview and one CTA, not every field
       * at once — tapping it opens the exact same validated LeadForm in
       * the site's existing popup (ATS-142), so nothing about submission,
       * validation, or delivery changes, only how much is visible before
       * the visitor commits to filling anything in. `formSlot` callers
       * (e.g. /book-an-appointment's BookingForm, which brings its own
       * card styling) are unaffected — this only replaces the generic
       * `form` config path. `form.onSubmit` has no current call site
       * (grepped repo-wide); if one is ever added, it needs its own
       * inline-form escape hatch here rather than silently being dropped
       * by the popup path. */}
      <div className="relative z-10 -mt-16 flex flex-col gap-4 px-4 sm:px-8 lg:hidden">
        {formSlot ? (
          <div className="rounded-3xl bg-navy-900 p-6 shadow-card">{formSlot}</div>
        ) : (
          form && (
            <MobileLeadPreviewCard
              heading={form.heading}
              formVariant={form.variant as LeadFormVariant}
              submitLabel={form.submitLabel}
              locale={locale}
            />
          )
        )}

        {callPill && (
          <Button
            variant="teal"
            href={siteConfig.business.phoneHref}
            className="w-full justify-center mb-4"
          >
            {heroCopy.callNow} {callPill.phone.replace(heroCopy.callPrefix, "")}
          </Button>
        )}
      </div>

      {hasForm && (
        <div className="relative hidden flex-col justify-start bg-navy-900 px-6 pb-16 sm:px-10 lg:flex lg:w-[640px] lg:shrink-0 lg:px-16 lg:pb-[60px] lg:pt-[210px] xl:w-[760px] 2xl:w-[800px]">
          {formSlot ??
            (form && (
              <LeadForm
                heading={form.heading}
                variant={form.variant}
                fields={form.fields ?? defaultFields}
                submitLabel={form.submitLabel}
                onSubmit={form.onSubmit}
                locale={locale}
                submitVariant="teal"
                fieldOutline
                labelCase="none"
                headingClassName="mb-2 font-display text-h2 !leading-[1.15] text-white"
                headingAs="p"
                className="gap-y-4"
              />
            ))}
          {form?.footerNote && (
            <p className="mt-6 font-sans text-body-lg text-white">{form.footerNote}</p>
          )}
        </div>
      )}
    </section>
  );
}
