"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { InfoIcon } from "@/components/ui/icons/info";
import { Section } from "@/components/ui/section";
import { siteConfig } from "@/content/site";

/** App-wide error boundary (Epic 12 §2). No Figma design exists for this route —
 * simple branded layout proposed per the ticket, matching app/thank-you/page.tsx's shell.
 * No external error-reporting service exists in this repo yet, so this only
 * consoles the error rather than forwarding it anywhere. */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Section spacing="lg" className="container pt-40 md:pt-48">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-navy-900">
          <InfoIcon className="h-8 w-8 text-white" />
        </span>

        <h1 className="font-display text-display text-navy-900">Something went wrong</h1>

        <p className="font-sans text-body-lg text-ink-500">
          We hit an unexpected error loading this page. You can try again, head back home, or give
          us a call and we&apos;ll take care of you right away.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button variant="primary" onClick={reset}>
            Try again
          </Button>
          <Button href="/" variant="ghost">
            Back to Home
          </Button>
          <Button href={siteConfig.business.phoneHref} variant="teal">
            Call {siteConfig.business.phone}
          </Button>
        </div>
      </div>
    </Section>
  );
}
