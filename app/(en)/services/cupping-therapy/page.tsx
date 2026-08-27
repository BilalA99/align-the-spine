import type { Metadata } from "next";
import Link from "next/link";

import { ConditionFaq } from "@/components/sections/condition-faq";
import { DoctorProfile } from "@/components/sections/doctor-profile";
import { HeroSolidPanel } from "@/components/sections/hero-solid-panel";
import { RelatedConditions } from "@/components/sections/related-conditions";
import { ServiceIntro } from "@/components/sections/service-intro";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import {
  cuppingTherapyFaq,
  cuppingTherapyHero,
  cuppingTherapyRelatedConfig,
} from "@/content/cupping-therapy-page";
import { doctorProfileContent } from "@/content/doctor-profile";
import { leadFormVariants } from "@/content/lead-forms";
import { buildRelatedLinks } from "@/content/related-links";
import { getRoute } from "@/content/seo";
import { siteConfig } from "@/content/site";
import { buildRouteMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildRouteMetadata(getRoute("/services/cupping-therapy"));

/** /services/cupping-therapy (IA-03). Deliberately lean, not a copy of the
 * other 3 /services/* pages' full Figma-sourced template (hero →
 * comparison table → doctor bio → accident banner → patient reviews →
 * FAQ) — cupping is a single technique with no Figma design and not enough
 * genuinely distinct content to fill that template without padding it out,
 * which is exactly the kind of sitewide-boilerplate problem UX-03 exists to
 * avoid. Section order: Hero → short explainer (linking to
 * /services/soft-tissue-therapy, which covers the other soft-tissue
 * techniques) → DoctorProfile (short, reused trust signal) → CTA band →
 * RelatedConditions (ATS-SEO-043 — this page previously had exactly one
 * outbound link in its whole body) → FAQ. */
export default function CuppingTherapyPage() {
  return (
    <>
      <HeroSolidPanel
        breadcrumbs={[
          { name: "Home", path: "" },
          { name: "Services", path: "/services" },
          { name: "Cupping Therapy", path: "/services/cupping-therapy" },
        ]}
        background={cuppingTherapyHero.backgroundImage}
        eyebrow={cuppingTherapyHero.eyebrowChip}
        title={cuppingTherapyHero.h1}
        subhead={cuppingTherapyHero.subhead}
        callPill={{ eyebrow: "Speak with us today", phone: `Call ${siteConfig.business.phone}` }}
        form={{
          heading: "Request Your Evaluation",
          submitLabel: leadFormVariants.heroEval.submitLabel,
          variant: leadFormVariants.heroEval.variant,
          fields: leadFormVariants.heroEval.fields,
          footerNote:
            "Serving Deerfield Beach, Boca Raton, Fort Lauderdale, and surrounding South Florida communities.",
        }}
      />

      <ServiceIntro
        eyebrow="Understanding the treatment"
        heading="Targeted suction for localized muscle tension"
        divider
        image={{
          src: "/figma-exports/cupping-drabe.png",
          alt: "Cupping therapy treatment",
        }}
      >
        Cupping applies localized suction to selected areas of muscle tension, drawing blood flow to
        the area to help it release. Dr. Abe includes it when appropriate alongside a broader
        evaluation — often together with other{" "}
        <Link href="/services/soft-tissue-therapy" className="underline">
          soft-tissue techniques
        </Link>{" "}
        like Graston or myofascial release, depending on what your exam finds.
      </ServiceIntro>

      <DoctorProfile variant="short" content={doctorProfileContent} />

      <Section spacing="none" className="bg-navy-900">
        <Container className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:py-14">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-h2 text-white font-normal">Ready when you are</h2>
            <p className="font-sans text-body-lg text-mute-300 w-[65%]">
              Request an evaluation and Dr. Abe will confirm whether cupping fits your case.
            </p>
          </div>
          <Button
            variant="teal"
            href={siteConfig.bookingCta.href}
            className="w-fit shrink-0 rounded-none!"
          >
            Request My Evaluation
          </Button>
        </Container>
      </Section>

      <RelatedConditions
        items={buildRelatedLinks({
          currentPath: "/services/cupping-therapy",
          ...cuppingTherapyRelatedConfig,
        })}
      />

      <ConditionFaq faq={cuppingTherapyFaq} />
    </>
  );
}
