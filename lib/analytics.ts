declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Client-exposed GA4/Google Ads IDs (ATS-132). Set these in .env.local (see
 * .env.example) to turn analytics on; every helper below no-ops when its ID
 * is unset, so local dev without them stays silent instead of erroring. */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
export const GOOGLE_ADS_CONVERSION_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;
/** Separate from GA4/Ads above — the client's own GTM container, installed
 * verbatim per their install instructions (ATS-132). Kept independent so
 * whoever manages the GTM container can add other tags (ad-platform pixels,
 * etc.) without touching the direct GA4/Ads gtag.js install below. */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

function gtag(...args: unknown[]) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag(...args);
}

export type LeadPriority = "high" | "standard";

/** Form variants whose entire framing is accident-specific — the
 * /auto-accidents hero and the homepage's accident-framed default form. */
const HIGH_PRIORITY_VARIANTS = new Set(["carAccident", "accidentEval"]);

/** Classifies a lead as "high" priority (accident-related, the primary
 * commercial goal) vs "standard" (general chiropractic). Checks, in order:
 * (1) the explicit "Is this related to a car accident?" field every lead
 * form carries (content/lead-forms.ts's carAccidentField) — the most
 * reliable signal since it's a direct answer, not an inference; (2) /book's
 * "Reason for Visit" select being set to "accident", which serves the same
 * purpose on that one form instead of a redundant second question; (3)
 * which form variant it came through, for the two forms whose entire page
 * framing is already accident-specific and might leave the explicit field
 * blank. Read by trackLeadConversion to differentiate the Ads conversion
 * event, and by /api/lead's email so office staff can triage without
 * opening every message. Exported (not "use client") so the server route
 * can reuse the same classification instead of re-deriving it. */
export function classifyLeadPriority(
  variant: string,
  values: Record<string, string> = {},
): LeadPriority {
  if (values.carAccident === "yes") return "high";
  if (values.reason === "accident") return "high";
  if (values.carAccident === "no") return "standard";
  if (HIGH_PRIORITY_VARIANTS.has(variant)) return "high";
  return "standard";
}

/** Fires on every successful lead-form submit — both the POST-then-redirect
 * path (LeadForm/UnderlineForm/BookingForm's default) and the inline-success
 * `onSubmit` override path (the homepage contact form) — since both already
 * call this one function. Keeping the Ads conversion here, rather than only
 * on /thank-you, means the inline-success form (which never navigates to
 * /thank-you) still counts as a conversion.
 *
 * `values` is used only for local priority classification. No contact field,
 * sensitive value, or user_data payload is ever sent to analytics. */
export function trackLeadConversion(variant: string, values: Record<string, string> = {}) {
  const priority = classifyLeadPriority(variant, values);

  gtag("event", "generate_lead", { lead_form_variant: variant, lead_priority: priority });
  if (GOOGLE_ADS_ID && GOOGLE_ADS_CONVERSION_LABEL) {
    gtag("event", "conversion", {
      send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_CONVERSION_LABEL}`,
      lead_priority: priority,
    });
  }
}

const PENDING_CONVERSION_KEY = "ats_pending_conversion";

interface PendingConversion {
  variant: string;
  values: Record<string, string>;
}

/** IA-05/ATS-E7: the POST-then-redirect submit path (LeadForm/BookingForm's
 * default, i.e. everything that lands on /thank-you) stashes the conversion
 * payload here instead of calling trackLeadConversion() itself — the actual
 * gtag call now happens once, on /thank-you
 * (components/analytics/thank-you-conversion.tsx), so the conversion
 * genuinely "fires here" per the ticket instead of firing a page earlier,
 * before persistence was even confirmed. The inline-success `onSubmit`
 * override path (which never navigates to /thank-you) is UNCHANGED — it
 * still calls trackLeadConversion() directly, since nothing downstream would
 * ever consume a stashed value for it. sessionStorage (not state/a query
 * param) survives the full-page-ish client navigation and clears itself the
 * moment consumePendingConversion() reads it, so a refresh of /thank-you
 * can't double-fire. */
export function stashPendingConversion(variant: string, values: Record<string, string>): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(PENDING_CONVERSION_KEY, JSON.stringify({ variant, values }));
  } catch {
    // Storage can throw in private-browsing/storage-restricted contexts —
    // losing the conversion event isn't worth breaking the redirect over.
  }
}

/** Read-once: removes the stashed payload as soon as it's read, so a
 * duplicate mount/refresh of /thank-you never fires a second conversion for
 * the same lead. Returns null if there's nothing pending (e.g. someone
 * navigates to /thank-you directly). */
export function consumePendingConversion(): PendingConversion | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(PENDING_CONVERSION_KEY);
    if (!raw) return null;
    window.sessionStorage.removeItem(PENDING_CONVERSION_KEY);
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      typeof (parsed as PendingConversion).variant !== "string" ||
      typeof (parsed as PendingConversion).values !== "object"
    ) {
      return null;
    }
    return parsed as PendingConversion;
  } catch {
    return null;
  }
}

export function trackPhoneClick() {
  gtag("event", "phone_click");
}

export function trackBookCtaClick() {
  gtag("event", "book_cta_click");
}

/** Fires a GA4 page_view for the given path. gtag's automatic pageview only
 * fires once, on the initial hard load (see AnalyticsScripts' `send_page_view:
 * false`) — client-side route changes in the App Router need this called
 * manually, from AnalyticsListeners' pathname effect. */
export function trackPageView(path: string) {
  gtag("event", "page_view", { page_path: path });
}

export function isPhoneLink(href: string): boolean {
  return href.startsWith("tel:");
}

export function isBookCtaLink(href: string): boolean {
  return (
    href === "/book-an-appointment" ||
    href.startsWith("/book-an-appointment?") ||
    href.startsWith("/book-an-appointment#")
  );
}
