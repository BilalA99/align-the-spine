"use client";

import { useEffect } from "react";

import { consumePendingConversion, trackLeadConversion } from "@/lib/analytics";

/** IA-05/ATS-E7: mounted only on /thank-you. Fires the Ads/GA4 lead
 * conversion event exactly once, using whatever LeadForm/BookingForm stashed
 * right before redirecting here (lib/analytics.ts's stashPendingConversion).
 * consumePendingConversion() deletes the stashed value as it reads it, so
 * StrictMode's double-invoke in dev and a manual refresh of this page both
 * fire at most once. Renders nothing — this is a tracking-only side effect,
 * not a component with any visual output. */
export function ThankYouConversion() {
  useEffect(() => {
    const pending = consumePendingConversion();
    if (pending) trackLeadConversion(pending.variant, pending.values);
  }, []);

  return null;
}
