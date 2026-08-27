import type { ReactNode } from "react";
import Image from "next/image";

import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { FadeIn } from "@/components/ui/fade-in";
import { LeadForm, type LeadFieldConfig, type LeadFormValues } from "@/components/ui/lead-form";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { MobileLeadPreviewCard } from "@/components/ui/mobile-lead-preview-card";
import { esLeadFormVariants } from "@/content/es/lead-forms";
import { DEFAULT_LOCALE, type Locale } from "@/content/i18n";
import { leadFormVariants, type LeadFormVariant } from "@/content/lead-forms";
import { siteConfig } from "@/content/site";
import { cn } from "@/lib/cn";
import type { BreadcrumbItemInput } from "@/lib/schema";

export interface HeroCta {
  label: string;
  href: string;
  variant?: "primary" | "teal" | "cta";
}

export interface HeroFormConfig {
  heading: string;
  submitLabel: string;
  /** Variant key for server-side validation; defaults to "heroEval". */
  variant?: string;
  /** Defaults to the hero-eval variant (First/Last/Phone/Email). */
  fields?: LeadFieldConfig[];
  footerNote?: string;
  onSubmit?: (values: LeadFormValues) => Promise<void>;
}

export interface HeroProps {
  variant: "home" | "condition";
  background: { src: string; alt: string };
  spineOverlay?: boolean;
  eyebrow?: string;
  title: ReactNode;
  subhead: ReactNode;
  conditionChip?: string;
  badge?: string;
  ctas?: HeroCta[];
  callPill?: { eyebrow: string; phone: string };
  bilingualNote?: string;
  /** Condition-variant-only stat callout below the bilingual note (e.g. the
   * /auto-accidents Florida PIP coverage figure) — a divider line, a large
   * value, and a descriptive line next to it. */
  stat?: { value: string; description: string };
  form?: HeroFormConfig;
  /** Replaces the default LeadForm card entirely (e.g. the /book two-step
   * BookingForm, which brings its own card styling). */
  formSlot?: ReactNode;
  /** LINK-02: same contract as HeroSolidPanel's `breadcrumbs` prop — renders
   * both the visible trail and its matching BreadcrumbList JSON-LD from one
   * shared items array. */
  breadcrumbs?: BreadcrumbItemInput[];
  /** Language for the embedded lead form. Defaults to English. */
  locale?: Locale;
}

/** Renders in normal flow (not absolutely offset) so it reflows with the
 * headline at every breakpoint — see the ATS-073 responsive-pass note on
 * why this replaced a fixed-pixel `absolute` offset that only lined up
 * with the headline at the 1728px desktop canvas width and overlapped the
 * headline/subhead text at 375–1023px. Bleeds to the container's true left
 * edge via a negative margin matching `.container`'s own gutter per
 * breakpoint (globals.css), and overlaps up into the headline's reserved
 * bottom margin via a small negative top margin. */
function HeroChip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "-ml-4 -mt-3 flex w-fit items-center bg-[#58A0A0] px-6 py-3 font-sans text-button text-white sm:-ml-6 sm:-mt-4 lg:-ml-8 lg:-mt-6",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Shared 2-column hero shell (Home + Condition variants) per
 * condition-page-spec §B1. Pulls itself above TopStatsBar via a
 * breakpoint-tuned negative top margin so its background bleeds to the
 * viewport's true top, behind the fixed transparent Navbar — see
 * docs/superpowers/specs/2026-07-15-hero-section-design.md. */
export function Hero({
  variant,
  background,
  spineOverlay = true,
  eyebrow,
  title,
  subhead,
  conditionChip,
  badge,
  ctas,
  callPill,
  bilingualNote,
  stat,
  form,
  formSlot,
  breadcrumbs,
  locale = DEFAULT_LOCALE,
}: HeroProps) {
  const defaultFields =
    locale === "es" ? esLeadFormVariants.heroEval.fields : leadFormVariants.heroEval.fields;

  return (
    // Margins pull Hero up to bleed behind TopStatsBar/Navbar. TopStatsBar's
    // rendered height isn't constant within a breakpoint tier — it shrinks a
    // lot (460px -> 312px) as its 5-stat grid-cols-2 text stops wrapping
    // between ~320-428px, well before the sm tier boundary at 640px. The
    // base -mt was originally sized to the *tallest* case (320px, 460px
    // bar) and applied all the way to 639px, which overlapped the fixed
    // Navbar by up to ~84px at wider still-mobile widths (~412-639px) where
    // the bar is actually only 312px tall — ATS-093 (mobile hero overlaps
    // header). Split into two sub-steps matching where the bar's height
    // actually drops (measured, not guessed): 460px up to 399px viewport
    // width, 392px from 400-639px (the tallest bar in that sub-range, so
    // TopStatsBar still fully disappears behind Hero with no visible sliver
    // at either step, unlike a single worst-case-for-the-whole-tier value).
    // sm/md/lg unchanged — already safe. Recompute (real-browser
    // measurement, not guessed) if siteConfig.stats content changes enough
    // to alter wrapping — see
    // docs/superpowers/specs/2026-07-15-hero-section-design.md.
    <section className="relative -mt-[460px] min-h-[975px] overflow-hidden min-[400px]:-mt-[392px] sm:-mt-[304px] md:-mt-[240px] lg:-mt-[176px]">
      {breadcrumbs && <BreadcrumbJsonLd items={breadcrumbs} />}
      <Image
        src={background.src}
        alt={background.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* <div className="absolute inset-0 bg-black/[.47]" /> */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/50" />

      <div className="container relative z-10 grid gap-10 pt-[220px] lg:grid-cols-2 lg:items-center lg:gap-16 lg:pt-[350px]">
        <div className="flex flex-col gap-6">
          {breadcrumbs && <BreadcrumbTrail items={breadcrumbs} className="-mb-2" />}
          {variant === "condition" && conditionChip && (
            <HeroChip className="mt-0">{conditionChip}</HeroChip>
          )}
          {eyebrow && <Eyebrow variant="onDark">{eyebrow}</Eyebrow>}

          <h1
            className={cn(
              "font-display text-hero text-white",
              variant === "home" && badge ? "mb-10" : "mb-8 lg:mb-20",
            )}
          >
            <FadeIn as="span">{title}</FadeIn>
          </h1>
          {variant === "home" && badge && <HeroChip>{badge}</HeroChip>}
          <p className="font-sans text-white text-[22px] max-w-[720px]">
            <FadeIn as="span" delay={0.15}>
              {subhead}
            </FadeIn>
          </p>

          {callPill && (
            <Button
              variant="glass"
              href={siteConfig.business.phoneHref}
              eyebrow={callPill.eyebrow}
              className="w-fit"
            >
              {callPill.phone}
            </Button>
          )}

          {variant === "condition" && bilingualNote && (
            <p className="font-alt text-alt-label text-mute-300">{bilingualNote}</p>
          )}

          {variant === "condition" && stat && (
            <div className="flex flex-col gap-4 border-t border-white/30 pt-6">
              <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-display text-h2 text-white">{stat.value}</span>
                <span className="font-sans text-body-lg text-mute-300">{stat.description}</span>
              </p>
            </div>
          )}

          {variant === "home" && Boolean(ctas?.length) && (
            <div className="flex flex-wrap items-center gap-4">
              {ctas?.map((cta) => (
                <Button key={cta.label} href={cta.href} variant={cta.variant ?? "primary"}>
                  {cta.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="flex w-full flex-col items-end gap-6">
          {/* Below `lg`: compact tap-to-expand preview card, same pattern
           * and reasoning as HeroSolidPanel's own mobile block (owner
           * direction 2026-08-19) — a mobile visitor sees two field
           * previews and one CTA, not the full form, until they tap to
           * open it in the site's existing popup (ATS-142). `formSlot`
           * callers keep their own markup unconditionally, same as before.
           * `form.onSubmit` has no current call site (grepped repo-wide);
           * see hero-solid-panel.tsx's identical note. */}
          {formSlot ? (
            formSlot
          ) : (
            <>
              {form && (
                <div className="w-full lg:hidden">
                  <MobileLeadPreviewCard
                    heading={form.heading}
                    formVariant={form.variant as LeadFormVariant}
                    submitLabel={form.submitLabel}
                    locale={locale}
                  />
                </div>
              )}
              {form && (
                <LiquidGlass className="hidden w-full p-8 shadow-card sm:w-4/5 lg:block">
                  <LeadForm
                    heading={form.heading}
                    variant={form.variant}
                    fields={form.fields ?? defaultFields}
                    submitLabel={form.submitLabel}
                    onSubmit={form.onSubmit}
                    locale={locale}
                  />
                </LiquidGlass>
              )}
            </>
          )}
          {form?.footerNote && (
            <p className="hidden font-sans text-body-lg text-white sm:w-4/5 lg:block">
              {form.footerNote}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
