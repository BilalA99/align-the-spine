import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Page Not Found | Align the Spine Chiropractic",
  description: "The page you're looking for doesn't exist or may have moved.",
  path: "/404",
  robots: { index: false },
});

/** App-wide 404 (Epic 12 §2). No Figma design exists for this route — simple
 * branded layout proposed per the ticket, matching app/thank-you/page.tsx's shell. */
export default function NotFound() {
  return (
    <Section spacing="lg" className="container pt-40 md:pt-48">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        <p
          aria-hidden="true"
          className="font-display text-[clamp(80px,14vw,160px)] leading-none text-navy-900/10"
        >
          404
        </p>

        <h1 className="font-display text-display text-navy-900">Page not found</h1>

        <p className="font-sans text-body-lg text-ink-500">
          The page you&apos;re looking for doesn&apos;t exist or may have moved. Let&apos;s get you
          back on track.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button href="/book-an-appointment" variant="teal">
            Request Appointment
          </Button>
          <Button href="/" variant="primary">
            Back to Home
          </Button>
        </div>
      </div>
    </Section>
  );
}
