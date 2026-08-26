import type { Metadata } from "next";

import { ThankYouConversion } from "@/components/analytics/thank-you-conversion";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { CheckIcon } from "@/components/ui/icons/check";
import { Section } from "@/components/ui/section";
import { siteConfig } from "@/content/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: `Thank You | ${siteConfig.business.name}`,
  description: "We've received your request and will be in touch shortly.",
  path: "/thank-you",
  robots: { index: false },
});

/** Lead-form confirmation page (ATS-031). No Figma design exists for this
 * route — simple branded layout proposed per the ticket.
 *
 * IA-05: sets a concrete expectation instead of a generic "we'll reach out" —
 * who calls (our team), from what number (siteConfig.business.phone, the
 * same number a visitor can call back), and within what window. The window
 * is read from siteConfig.hours rather than hardcoded so it can never drift
 * from the hours the rest of the site displays (see content/site.ts's
 * businessHours — currently 7:00 AM–11:00 PM daily; the SEO task list's
 * confirmed-facts table says 9:00 AM–9:00 PM, an open discrepancy flagged
 * for the client, not resolved here). Keeps the conversation open with a
 * `tel:` link and directions, and never dead-ends the visitor.
 *
 * <ThankYouConversion /> fires the Ads/GA4 lead conversion event here, on
 * this page, instead of client-side in the form right before the redirect —
 * so it fires only once the visitor has actually landed on a real
 * confirmation of a durably-persisted lead (ATS-E5), not merely once the
 * form's fetch call resolved. The inline-success form variant (which never
 * navigates here) is unaffected — see lib/analytics.ts's
 * stashPendingConversion() doc comment. */
export default function ThankYouPage() {
  const todaysHours = siteConfig.hours[0];
  const hoursWindow = todaysHours ? `${todaysHours.open}–${todaysHours.close}` : null;

  return (
    <Section spacing="lg" className="container pt-40 md:pt-48">
      <ThankYouConversion />
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#58A0A0]">
          <CheckIcon className="h-8 w-8 text-white" />
        </span>

        <Eyebrow>Request received</Eyebrow>

        <h1 className="font-display text-display text-navy-900">Thank you!</h1>

        <p className="font-sans text-body-lg text-ink-500">
          Your request is in. A member of our {siteConfig.business.name} team will call you back
          from {siteConfig.business.phone}
          {hoursWindow ? ` today, within our business hours (${hoursWindow})` : " today"} to confirm
          your appointment. If you need us sooner, call that same number and we&apos;ll take care of
          you right away.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button href={siteConfig.business.phoneHref} variant="teal">
            Call {siteConfig.business.phone}
          </Button>
          <Button href="/contact-us" variant="primary">
            Get Directions
          </Button>
          <Button href="/" variant="primary">
            Back to Home
          </Button>
        </div>
      </div>
    </Section>
  );
}
