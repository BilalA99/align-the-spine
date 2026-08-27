"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { CloseIcon } from "@/components/ui/icons/close";
import { LeadForm } from "@/components/ui/lead-form";
import { esLeadFormVariants } from "@/content/es/lead-forms";
import { DEFAULT_LOCALE, type Locale } from "@/content/i18n";
import { leadFormVariants, type LeadFormVariant } from "@/content/lead-forms";

export interface LeadFormPopupProps {
  /** The trigger's own contents — callers keep their existing pill/button
   * markup (and hover treatment) via `triggerClassName` instead of this
   * component imposing one trigger look. */
  children: ReactNode;
  triggerClassName?: string;
  formHeading: string;
  /** Defaults to the car-accident variant — this component exists
   * specifically for the "start after a car accident" CTAs that used to
   * link out to /car-accident-chiropractor; other variants stay available
   * for future popup CTAs. */
  formVariant?: LeadFormVariant;
  submitLabel?: string;
  /** Language for the form inside the dialog and for the close button's
   * accessible name. Defaults to English. */
  locale?: Locale;
}

/** Modal lead-capture form (ATS-142): a CTA that used to navigate away now
 * opens the same LeadForm engine in a centered dialog instead, so a visitor
 * never loses their place on the page. Closes on Escape, backdrop click, or
 * the close button; locks body scroll while open. */
export function LeadFormPopup({
  children,
  triggerClassName,
  formHeading,
  formVariant = "carAccident",
  submitLabel,
  locale = DEFAULT_LOCALE,
}: LeadFormPopupProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // The Spanish presets carry the same variant keys and field names as the
  // English ones (see content/es/lead-forms.ts), so /api/lead validates a
  // Spanish submission with exactly the same schema.
  const preset =
    locale === "es" && formVariant in esLeadFormVariants
      ? esLeadFormVariants[formVariant as keyof typeof esLeadFormVariants]
      : leadFormVariants[formVariant];

  // The overlay markup, portaled straight to document.body below instead of
  // rendered where this component is called: every hero section on the site
  // (blog-hero.tsx, service-area-hero.tsx) wraps its content in a
  // `<section overflow-hidden>` for its own bleed/fade effects, and real
  // mobile WebKit has a long-documented bug where a `position: fixed`
  // DESCENDANT of an `overflow: hidden` ancestor doesn't reliably escape to
  // true viewport-fixed positioning — even though the spec says it should,
  // and even though this measured as correctly fixed in every DOM check run
  // in this dev environment's (desktop-engine) emulated viewport. On a real
  // phone that bug made the "fixed" overlay behave as if it were laid out
  // inline instead, so the page's own on-page form appeared to run directly
  // into the popup with no dimmed backdrop between them (reported,
  // screenshot from a real device). A portal removes the overlay from that
  // ancestor chain entirely, so this can't recur regardless of which page's
  // hero section the popup is triggered from.
  const overlay = open && (
    <div
      // top-[100px], not inset-0: the site's Navbar is a real, fixed,
      // opaque 100px header (see navbar.tsx's own h-[100px]) that sits at
      // z-50 — a wrapper spanning the FULL viewport centers the dialog
      // against all 100dvh, and centering math that ignores 100px of that
      // space being permanently occupied can place the dialog's own top
      // edge above y=100px, so the navbar visually covers it. Constraining
      // the wrapper itself to the space below the navbar makes every
      // calculation inside it (centering, max-height) correct by
      // construction instead of needing to separately account for the
      // navbar everywhere.
      // lead-popup-overlay: a marker class, not styling — globals.css keys
      // a body:has(.lead-popup-overlay) rule off its mere presence in the
      // DOM to hide each hero's own on-page form while this is open (no
      // shared state needed between this self-contained component and
      // every page that also renders an on-page form).
      className="lead-popup-overlay fixed inset-x-0 bottom-0 top-[100px] z-[100] flex items-center justify-center p-4"
    >
      {/* Neutral black, not navy/80 — navy/80 over an already-dark-navy
       * page (e.g. the blog/service-area heroes, both solid navy-900
       * panels) barely changes the color underneath, so the "backdrop"
       * became invisible there: the popup and the page's own content read
       * as two forms sitting side by side instead of one modal in front of
       * a dimmed page (reported, confirmed via screenshot). Black at high
       * opacity reliably dims any background color. */}
      <button
        type="button"
        aria-label="Close"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
      />
      {/* ring-1 white/15, not just shadow-card: a dark navy-900 card over a
       * near-black backdrop has almost no shadow to see — the only thing
       * that had separated the two before was the (now-fixed) backdrop
       * being too light to dim anything, so the card's own edges never
       * needed defining. A visible hairline border does that job
       * regardless of what's behind it.
       *
       * max-h-[calc(100dvh-140px)], not a vh percentage: `vh` units are
       * computed against the LARGEST possible mobile-browser viewport (as
       * if the address bar were hidden) on real phones, not the actually-
       * visible area — sizing a fixed dialog off `vh` there can make it
       * taller than what's really on screen, which reads as "cut off" even
       * though the CSS box model is internally consistent. `dvh` tracks the
       * real, dynamic visible viewport instead. The flat 140px subtraction
       * (100px navbar clearance + 40px breathing room) keeps this in sync
       * with the wrapper's own top-[100px] offset above, rather than
       * drifting out of sync as two independent percentages would.
       *
       * No max-width: capped at max-w-xl before, which on a desktop monitor
       * left the dimmed backdrop clearly visible on both sides, wide enough
       * that the page's own on-page form could still be seen sitting next
       * to it — reading as two forms rather than one modal covering the
       * page (reported: "make the desktop pop up form full width so it
       * covers the background"). w-full here fills the wrapper's own p-4
       * margin at any viewport width; the inner max-w-xl wrapper below
       * keeps the FIELDS themselves from stretching to an unreadable width
       * on a wide monitor — only the navy background spans full width. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={formHeading}
        className="relative max-h-[calc(100dvh-140px)] w-full overflow-y-auto rounded-30 bg-navy-900 p-6 shadow-card ring-1 ring-white/15 sm:p-8"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
        <div className="mx-auto max-w-xl">
          <LeadForm
            heading={formHeading}
            variant={preset.variant}
            fields={preset.fields}
            submitLabel={submitLabel ?? preset.submitLabel}
            locale={locale}
            submitVariant="white"
            fieldOutline
            labelCase="none"
            headingClassName="mb-2 mr-8 font-display text-h2 !leading-[1.15] text-white"
            className="gap-y-4"
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={triggerClassName}>
        {children}
      </button>
      {open && createPortal(overlay, document.body)}
    </>
  );
}
