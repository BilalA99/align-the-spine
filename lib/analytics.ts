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
 * blank. This is a PRIVATE operational triage signal only: it is read
 * server-side (lib/leads/request.ts) to classify the stored CRM lead and by
 * /api/lead's office email, and MUST never be added to GA4, Google Ads, GTM,
 * or any other outbound analytics event. Exported (not "use client") so the
 * server route can reuse the same classification instead of re-deriving it. */
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
