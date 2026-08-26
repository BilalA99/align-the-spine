declare global {
  interface Window {
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
