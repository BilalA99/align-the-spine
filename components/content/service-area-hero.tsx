import type { ReactNode } from "react";
import Image from "next/image";

import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { CheckIcon } from "@/components/ui/icons/check";
import { LeadForm } from "@/components/ui/lead-form";
import { MobileLeadPreviewCard } from "@/components/ui/mobile-lead-preview-card";
import { esLeadFormVariants } from "@/content/es/lead-forms";
import type { Locale } from "@/content/i18n";
import { leadFormVariants } from "@/content/lead-forms";
import { siteConfig } from "@/content/site";
import type { BreadcrumbItemInput } from "@/lib/schema";

/** Local-office-toned hero for /service-areas and each city page — a
 * full-bleed, edge-to-edge two-tone split at `lg`+ (dark photo left, solid
 * navy-900 panel right for the eligibility form), matching HeroSolidPanel's
 * homepage treatment rather than the earlier single-photo/frosted-glass-card
 * look (owner direction 2026-08-18: "have the blue section for the form
 * like the homepage"). Not a straight reuse of HeroSolidPanel itself —
 * that component has no slot for this page's trust-chip checklist or
 * Office/Call row, and duplicating its JSX here keeps this rewrite isolated
 * to the two pages that use it instead of risking the shared component's
 * three other call sites (home, /car-accident-chiropractor, conditions).
 *
 * Two colors meeting the next section directly below would read as an
 * abrupt, unplanned cut, so both columns carry their own bottom fade toward
 * the SAME target color (panel-100) — by the very bottom edge both columns
 * have already converged to one color, so there's no seam left to show by
 * the time the next section starts. A hairline teal/white gradient rule
 * sits right at that converged edge as a deliberate "this is where the
 * section ends" mark, rather than leaving the fade to imply it on its own.
 *
 * Below `lg` there's no side-by-side split to reconcile — instead a compact
 * tap-to-expand eligibility card (MobileLeadPreviewCard) sits in normal
 * document flow inside the photo column itself, between the Call button and
 * the Office/Call row (owner direction 2026-08-19, repositioned there for
 * visibility — see that block's own comment for why flow placement also
 * resolved an old overlap bug this file used to work around here). */
export function ServiceAreaHero({
  eyebrow,
  title,
  subhead,
  cityName,
  county,
  children,
  breadcrumbs,
  locale = "en",
}: {
  eyebrow: string;
  title: ReactNode;
  subhead: ReactNode;
  /** Drives the form heading and trust chips; omit on the hub (no single city). */
  cityName?: string;
  county?: string;
  children?: ReactNode;
  /** LINK-02: same contract as HeroSolidPanel/Hero's `breadcrumbs` prop —
   * renders the visible trail here; pair with a BreadcrumbJsonLd call fed
   * the same items array so the two can't drift. */
  breadcrumbs?: BreadcrumbItemInput[];
  /** Drives every string this component owns, plus which lead-form
   * variant it submits. The Spanish hub (/es/areas-de-servicio) is the
   * only `es` caller today; the nineteen city pages are English-only by
   * design — see content/es/service-areas.ts. */
  locale?: Locale;
}) {
  const { address, phone, phoneHref } = siteConfig.business;
  const es = locale === "es";
  const form = es ? esLeadFormVariants.eligibility : leadFormVariants.eligibility;

  const trustChips = es
    ? [
        cityName
          ? `Visitas a domicilio consideradas para ${cityName}`
          : "Elegibilidad para visita a domicilio, caso por caso",
        // "14 días" is the Florida PIP initial-care deadline
        // (Fla. Stat. 627.736(1)(a)) — the same claim the English chip
        // makes, not a stronger one.
        "Orientación sobre el plazo de 14 días del PIP en Florida",
        county ? `Condado de ${county}` : "Consultorio en Deerfield Beach",
      ]
    : [
        cityName ? `Home visits considered for ${cityName}` : "Case-by-case home-visit eligibility",
        "Florida 14-day PIP timing guidance",
        county ? `${county} County` : "Deerfield Beach office",
      ];

  const eligibilityHeading = es
    ? cityName
      ? `Verifique su elegibilidad en ${cityName}`
      : "Verifique su elegibilidad para visita a domicilio"
    : cityName
      ? `Check eligibility in ${cityName}`
      : "Check home-visit eligibility";

  const mobileMicrocopy = es
    ? "Se considera disponibilidad el mismo día — sin compromiso."
    : "Same-day availability considered — no obligation.";

  const officeLabel = es ? "Consultorio" : "Office";
  const callLabel = es ? "Llamar" : "Call";

  const panelDisclaimer = es
    ? "Un solo consultorio verificado en Deerfield Beach; las visitas a domicilio se limitan a circunstancias elegibles de accidente de auto con cobertura PIP y requieren confirmar el caso y la ubicación."
    : "One verified office in Deerfield Beach; home visits are limited to eligible car-accident/PIP circumstances and require case and location confirmation.";

  const formFields = (headingAs: "h2" | "p") => (
    <LeadForm
      heading={eligibilityHeading}
      variant={form.variant}
      fields={form.fields}
      submitLabel={form.submitLabel}
      locale={locale}
      submitVariant="white"
      fieldOutline
      labelCase="none"
      headingClassName="mb-2 font-display text-h2 !leading-[1.15] text-white"
      // The fixed-height bottom fade (see the h-64 divs below) means this
      // form's own consent line — its lowest text before the submit
      // button — sits inside a background that's already faded most of
      // the way to white by the time it renders, not solid navy; the
      // default grey (tuned for solid navy) reads as low-contrast against
      // that near-white backdrop (reported, confirmed via screenshot).
      consentClassName="text-ink-900"
      headingAs={headingAs}
      className="gap-y-4"
    />
  );

  return (
    <section className="relative -mt-[100px] overflow-hidden lg:-mt-[176px] lg:flex lg:min-h-[820px]">
      <div className="relative min-h-[700px] sm:min-h-[760px] lg:min-h-full lg:flex-1">
        <Image
          src="https://align-the-spine.b-cdn.net/images/WhatsApp%20Image%202026-08-17%20at%2017.38.56%20(1).jpeg"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="object-cover object-[70%_center]"
        />
        {/* Diagonal darkening tint (left-to-right, matching HeroSolidPanel's
         * own photo treatment) composited with the bottom fade-to-panel-100
         * as layers of ONE background — see accident-impact-visual.tsx and
         * blog-hero.tsx for why one painted element beats two stacked divs
         * here (no edge for them to disagree on). */}
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(10,14,36,0.88)_10%,rgba(10,14,36,0.7)_55%,rgba(10,14,36,0.35)_100%)]" />
        {/* Fade-to-panel-100, split out from the diagonal tint above into
         * its own fixed-height layer (not a percentage of this column's
         * own, dynamic height) specifically so it can share an EXACT pixel
         * height with the navy panel's matching fade below — two fades
         * measured as different percentages of two independently-sized
         * boxes drift out of sync and visibly disagree at the shared
         * bottom edge; two fades of the same fixed height, sharing that
         * same bottom edge (flex stretch keeps both columns equal-height),
         * converge at the same rate and reach solid panel-100 at the same
         * point — nothing left to seam. The `lg:h-64` value stays
         * cross-synced with the desktop navy panel's own matching fade (see
         * that div below) — do not change it. `h-40` below is mobile-only
         * (this section hides the navy panel entirely below `lg`, so
         * nothing there depends on it) — shrunk to `h-28` (owner-reported:
         * the Office/Call row below was landing inside the washed-out
         * portion of this fade, reading as low-contrast against it). */}
        <div className="absolute inset-x-0 bottom-0 z-[1] h-28 bg-gradient-to-b from-transparent via-[#f6f6f6]/60 to-[#f6f6f6] sm:h-52 lg:h-64" />
        {/* pb-24, not pb-16: extra clearance between the Office/Call row
         * (this container's last child) and the fade zone above — same
         * contrast fix as the shrunk fade height, applied from the other
         * direction. lg:pb-[60px] unchanged (desktop's Office/Call row
         * lives in the separate navy panel below, not this photo column). */}
        <div className="container relative z-10 pb-24 pt-[224px] lg:pb-[60px] lg:pt-[276px] lg:pr-10">
          {breadcrumbs && <BreadcrumbTrail items={breadcrumbs} className="mb-4" />}
          <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-teal-300 backdrop-blur-sm">
            {eyebrow}
          </span>
          <h1 className="mt-5 font-display text-4xl leading-[1.08] text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white">{subhead}</p>

          {/* hidden below `lg` (owner direction 2026-08-19): freed-up
           * vertical space so the mobile card below (which replaces this
           * information anyway — the same eligibility/PIP/county framing
           * lives in its own heading + form) isn't competing with it for
           * room above the fold. Desktop keeps it — that column has the
           * separate navy form panel instead, so this is still useful
           * context there. */}
          <ul className="mt-6 hidden flex-wrap gap-x-6 gap-y-2 lg:flex">
            {trustChips.map((chip) => (
              <li key={chip} className="flex items-center gap-2 text-sm font-medium text-white">
                <CheckIcon className="h-4 w-4 shrink-0 text-teal-300" />
                {chip}
              </li>
            ))}
          </ul>

          {children}

          {/* Mobile-only compact tap-to-expand card, in NORMAL DOCUMENT
           * FLOW between the Call button and the Office/Call block below —
           * owner direction 2026-08-19: "more visible and accessible"
           * than its previous position at the very bottom of the mobile
           * layout, after the whole hero. Being real flow (not a
           * negative-margin overlap) also fully resolves the old ATS-145
           * overlap risk this file used to document here: a flow element
           * can never overlap the content before or after it regardless of
           * either one's height, unlike the negative-offset approach that
           * caused that bug. No separate "Call Now" button here (the old
           * mobile-only block below the card had one) — the Call button
           * immediately above and the Office/Call block immediately below
           * already cover it; a third call CTA sandwiching this card
           * would work against the same "more accessible" goal. */}
          <div id="eligibility-form-mobile" className="mt-6 lg:hidden">
            <MobileLeadPreviewCard
              heading={eligibilityHeading}
              formVariant={form.variant as "eligibility"}
              submitLabel={form.submitLabel}
              locale={locale}
              microcopy={mobileMicrocopy}
            />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/15 pt-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-teal-300">
                {officeLabel}
              </p>
              <p className="mt-1 text-white">
                {address.line1}, {address.suite}, {address.city}, {address.state} {address.zip}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-teal-300">
                {callLabel}
              </p>
              <a
                href={phoneHref}
                className="mt-1 block font-semibold text-white underline-offset-4 hover:underline"
              >
                {phone}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop-only solid navy panel — flex's default align-items:stretch
       * (no override here) makes it match the photo column's own height
       * automatically, so it reads as one continuous split, not a box of
       * its own floating height. justify-start + the SAME pt-[276px] the
       * photo column's content uses (not justify-center): centering placed
       * the form heading's vertical midpoint using this panel's *full*
       * stretched height, which extends up behind the fixed Navbar+
       * TopStatsBar (the -mt-[176px] bleed) — on a tall page that pushed
       * the heading itself up behind the navbar, clipping it (reported,
       * confirmed via screenshot). Starting at the same offset the photo
       * column's own content uses keeps both columns' content aligned to
       * the same visible top edge instead. */}
      <div
        id="eligibility-form-desktop"
        className="relative hidden flex-col justify-start bg-navy-900 px-10 pb-16 pt-[224px] lg:flex lg:w-[440px] lg:shrink-0 lg:pb-[60px] lg:pt-[276px] xl:w-[500px]"
      >
        {/* Exact same fixed-height fade as the photo column's — see that
         * div's comment for why matching pixel heights (not percentages)
         * is what makes the two sides converge in sync. */}
        <div className="absolute inset-x-0 bottom-0 z-[1] h-64 bg-gradient-to-b from-transparent via-[#f6f6f6]/60 to-[#f6f6f6]" />
        <div className="relative z-10">
          {formFields("p")}
          {/* text-ink-900, not text-white/80: this paragraph sits below
           * the whole form, deeper into the bottom fade than the form's
           * own consent line (see formFields' consentClassName comment
           * above) — by this point the background has faded almost all
           * the way to white, so white/80 text there is just as
           * low-contrast as the grey it replaced (reported: "this text
           * same issue"). */}
          <p className="mt-4 text-sm leading-6 text-ink-900">{panelDisclaimer}</p>
        </div>
      </div>

      {/* Hairline mark at the converged edge — a deliberate "section ends
       * here" seam instead of leaving the fade to imply it silently. Full
       * width so it reads as one mark across both the photo and the navy
       * panel below `lg`... */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden h-px bg-gradient-to-r from-transparent via-teal-300/50 to-transparent lg:block" />
    </section>
  );
}
