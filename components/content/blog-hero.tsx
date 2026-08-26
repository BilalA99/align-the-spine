import type { ReactNode } from "react";
import Image from "next/image";

import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { LeadForm } from "@/components/ui/lead-form";
import { leadFormVariants } from "@/content/lead-forms";
import type { BreadcrumbItemInput } from "@/lib/schema";

/** Hero for /blog — mirrors ServiceAreaHero's structure exactly (owner
 * direction 2026-08-18: "mimic the hero section look on the service-areas
 * hub page"): full-bleed, edge-to-edge two-tone split at `lg`+ (dark photo
 * left, solid navy-900 panel right for the contact form), matching
 * HeroSolidPanel's homepage treatment. Not a straight reuse of
 * ServiceAreaHero itself — that component's trust-chip checklist and
 * Office/Call row are service-area-specific (this hub's own CTA row,
 * passed in as `children`, already covers the call affordance), so
 * duplicating just the shared shell here keeps this isolated from that
 * component's three other call sites.
 *
 * Two colors meeting the next section directly below would read as an
 * abrupt, unplanned cut, so both columns carry their own bottom fade toward
 * the SAME target color (panel-100) over the SAME fixed pixel height (not a
 * percentage of each column's own, differently-sized height — two fades
 * measured as different percentages of two independently-sized boxes drift
 * out of sync and visibly disagree at the shared bottom edge) — by the very
 * bottom edge both columns have already converged to one color, so there's
 * no seam left to show by the time the next section starts. A hairline
 * teal/white gradient rule sits right at that converged edge as a
 * deliberate "this is where the section ends" mark.
 *
 * Below `lg` there's no side-by-side split to reconcile (photo, then a
 * stacked solid-navy card, then the next section, all sequential) — the
 * card is solid navy-900 there too, in a plain positive-gap stack under the
 * photo (a positive gap, never a negative margin, is the only overlap-proof
 * option against this column's own variable height). Bleeds to the true
 * viewport top behind the fixed 100px Navbar pill; below `lg`, TopStatsBar
 * (root-shell.tsx) is `hidden`, so -mt-[100px] cancels exactly the Navbar's
 * own height — but at `lg`+ TopStatsBar renders its real stat row, so the
 * bleed needs the same lg:-mt-[176px]/lg:pt-[276px] pair every other hero
 * uses (100px Navbar + ~76px TopStatsBar), or that row shows through as a
 * white strip above the hero. */
export function BlogHero({
  eyebrow,
  title,
  subhead,
  children,
  breadcrumbs,
}: {
  eyebrow: string;
  title: ReactNode;
  subhead: ReactNode;
  children?: ReactNode;
  /** LINK-02: same contract as HeroSolidPanel/Hero's `breadcrumbs` prop —
   * renders the visible trail here; pair with a BreadcrumbJsonLd call fed
   * the same items array so the two can't drift. */
  breadcrumbs?: BreadcrumbItemInput[];
}) {
  // heroEval, not contactUs: a plain, standard request form (First/Last/
  // Phone/Email/car-accident?) matching every other hero's form on the
  // site, not a bespoke "ask us a question" form with its own Message
  // textarea — that extra field also made this panel tall enough to push
  // the consent disclaimer text down into the bottom fade-to-white zone,
  // where it read as unreadable grey-on-white (reported, confirmed via
  // screenshot); the shorter form keeps it safely inside the solid-navy
  // area above that fade.
  const formFields = (headingAs: "h2" | "p") => (
    <LeadForm
      heading="Schedule Your Evaluation"
      variant={leadFormVariants.heroEval.variant}
      fields={leadFormVariants.heroEval.fields}
      submitLabel={leadFormVariants.heroEval.submitLabel}
      submitVariant="white"
      fieldOutline
      labelCase="none"
      headingClassName="mb-2 font-display text-h2 !leading-[1.15] text-white"
      // Same fix as service-area-hero.tsx's formFields: the fixed-height
      // bottom fade means this form's consent line sits inside a
      // background that's already faded most of the way to white by the
      // time it renders, not solid navy — the default grey (tuned for
      // solid navy) reads as low-contrast there (reported).
      consentClassName="text-ink-900"
      headingAs={headingAs}
      className="gap-y-4"
    />
  );

  return (
    <section className="relative -mt-[100px] overflow-hidden lg:-mt-[176px] lg:flex lg:min-h-[760px]">
      <div className="relative min-h-[640px] sm:min-h-[680px] lg:min-h-full lg:flex-1">
        <Image
          src="https://align-the-spine.b-cdn.net/images/WhatsApp%20Image%202026-08-17%20at%2017.38.56%20(1).jpeg"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="object-cover object-[70%_center]"
        />
        {/* Diagonal darkening tint composited with the bottom fade-to-
         * panel-100 as layers of ONE background — see
         * accident-impact-visual.tsx for why one painted element beats two
         * stacked divs here (no edge for them to disagree on). */}
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(10,14,36,0.94)_20%,rgba(10,14,36,0.78)_55%,rgba(10,14,36,0.6)_100%)]" />
        {/* Fixed-height fade (not a percentage of this column's own height)
         * so it can share an exact pixel height with the navy panel's
         * matching fade — see the top-of-file comment for why. */}
        <div className="absolute inset-x-0 bottom-0 z-[1] h-40 bg-gradient-to-b from-transparent via-[#f6f6f6]/60 to-[#f6f6f6] sm:h-52 lg:h-64" />
        {/* pt-[224px], not pt-[168px]: this column sits inside the section's
         * -mt-[100px] bleed, so content here only actually clears the fixed
         * 100px Navbar once padding-top exceeds 100px — 168px only netted
         * 68px of real clearance, putting the eyebrow badge's whole height
         * (68-96px from the true viewport top) behind the opaque navbar,
         * invisible (reported: "I dont see 'Patient resources' ... on
         * mobile"). 224px matches ServiceAreaHero's own mobile value for
         * the identical bleed pattern — same 124px clearance there already
         * works safely. */}
        <div className="container relative z-10 pb-16 pt-[224px] lg:pb-[60px] lg:pt-[276px] lg:pr-10">
          {breadcrumbs && <BreadcrumbTrail items={breadcrumbs} className="mb-4" />}
          <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-teal-300 backdrop-blur-sm">
            {eyebrow}
          </span>
          <h1 className="mt-5 font-display text-4xl leading-[1.08] text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white">{subhead}</p>
          {children}
        </div>
      </div>

      {/* Desktop-only solid navy panel — flex's default align-items:stretch
       * (no override here) makes it match the photo column's own height
       * automatically. justify-start + the SAME pt-[276px] the photo
       * column's content uses (not justify-center — centering placed the
       * form heading's vertical midpoint using this panel's *full*
       * stretched height, which extends up behind the fixed Navbar +
       * TopStatsBar bleed, clipping the heading on a tall page). */}
      <div
        id="blog-form-desktop"
        className="relative hidden flex-col justify-start bg-navy-900 px-10 pb-16 pt-[168px] lg:flex lg:w-[440px] lg:shrink-0 lg:pb-[60px] lg:pt-[276px] xl:w-[500px]"
      >
        {/* Exact same fixed-height fade as the photo column's — matching
         * pixel heights (not percentages) is what makes the two sides
         * converge in sync. */}
        <div className="absolute inset-x-0 bottom-0 z-[1] h-64 bg-gradient-to-b from-transparent via-[#f6f6f6]/60 to-[#f6f6f6]" />
        <div className="relative z-10">{formFields("p")}</div>
      </div>

      {/* Hairline mark at the converged edge — a deliberate "section ends
       * here" seam instead of leaving the fade to imply it silently. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden h-px bg-gradient-to-r from-transparent via-teal-300/50 to-transparent lg:block" />

      {/* Mobile-only form card, right under the content column. Solid
       * navy-900, not glass — matching the desktop panel. */}
      <div className="container relative z-10 mt-3 flex flex-col gap-4 pb-10 lg:hidden">
        <div className="rounded-3xl bg-navy-900 p-6 shadow-card" id="blog-form-mobile">
          {formFields("h2")}
        </div>
      </div>
    </section>
  );
}
