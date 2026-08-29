import type { Metadata } from "next";
import Link from "next/link";

import { AccidentBanner } from "@/components/sections/accident-banner";
import { AccidentInjuries } from "@/components/sections/accident-injuries";
import { ComparisonTable } from "@/components/sections/comparison-table";
import { ConditionFaq } from "@/components/sections/condition-faq";
import { DoctorProfile } from "@/components/sections/doctor-profile";
import { HeroReviewsCarousel } from "@/components/sections/hero-reviews-carousel";
import { HeroSolidPanel } from "@/components/sections/hero-solid-panel";
import { PatientReviews } from "@/components/sections/patient-reviews";
import { ServiceIntro } from "@/components/sections/service-intro";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { adjustmentsFaq, adjustmentsHero, adjustmentsHowItWorks } from "@/content/adjustments-page";
import { autoAccidentAttorneyQuote } from "@/content/auto-accident";
import { autoAccidentCondition } from "@/content/conditions/auto-accident";
import { doctorProfileContent } from "@/content/doctor-profile";
import { leadFormVariants } from "@/content/lead-forms";
import { getRoute } from "@/content/seo";
import { servicesGrid } from "@/content/services-grid";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel, homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";
import { buildService } from "@/lib/schema";
import { buildRouteMetadata } from "@/lib/seo/metadata";

const service = servicesGrid.find((item) => item.slug === "adjustments")!;

export const metadata: Metadata = buildRouteMetadata(
  getRoute("/services/chiropractic-adjustments"),
);

/** /services/chiropractic-adjustments — dedicated, hand-built page, same
 * per-page pattern as the 4 condition pages (ATS-137) and /auto-accidents
 * (ATS-141) rather than a generic dynamic services template. Pulled from
 * the Figma `services-chiropractic-adjustements` frame (file
 * 3oNk0hDle8VMrPJQ0W0pDG, node 96:1228).
 *
 * Section order: Hero → HeroReviewsCarousel → Understanding intro
 * (heading/body with links to the 4 condition pages, photo right) → How
 * It Works (3-step, no photos per this frame — unlike HowWeHelpSteps'
 * photo cards) → AccidentInjuries ("Common accident injuries we treat" —
 * reused verbatim, this frame's grid is word-for-word identical) →
 * ComparisonTable (reused) → "Is it right for you?" (limitations, no
 * diagnosing) → DoctorProfile (reused — the Figma bio here has an
 * unverified "hundreds of accident cases"/attorney-referral claim, see
 * content/adjustments-page.ts) → AccidentBanner (reuses
 * autoAccidentCondition.accident — identical copy in this frame) →
 * PatientReviews (reused) → "Ready when you are" CTA band + attorney
 * quote strip (reuses autoAccidentAttorneyQuote, already
 * compliance-scrubbed) → FAQ (bespoke — this frame's FAQ is the same
 * sciatica-page copy-paste bug found elsewhere). No bottom
 * RelatedConditions pill row or LocationIntro/LocationFooter/
 * ContactSection — matches /auto-accidents' pattern, straight to the
 * standard footer via RootShell. */
export default function ChiropracticAdjustmentsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "" },
          { name: "Services", path: "/services" },
          { name: "Chiropractic Adjustments", path: "/services/chiropractic-adjustments" },
        ]}
      />
      <JsonLd data={buildService(service)} />
      <HeroSolidPanel
        breadcrumbs={[
          { name: "Home", path: "" },
          { name: "Services", path: "/services" },
          { name: "Chiropractic Adjustments", path: "/services/chiropractic-adjustments" },
        ]}
        background={adjustmentsHero.backgroundImage}
        eyebrow={adjustmentsHero.eyebrowChip}
        title={adjustmentsHero.h1}
        subhead={adjustmentsHero.subhead}
        callPill={{ eyebrow: "Speak with us today", phone: `Call ${siteConfig.business.phone}` }}
        form={{
          heading: "Request Your Evaluation",
          submitLabel: leadFormVariants.heroEval.submitLabel,
          variant: leadFormVariants.heroEval.variant,
          fields: leadFormVariants.heroEval.fields,
          footerNote:
            "One verified office in Deerfield Beach; call to confirm whether an office visit or limited eligible accident-related home visit fits.",
        }}
      />

      <HeroReviewsCarousel testimonials={heroReviewsCarousel} />

      <ServiceIntro
        eyebrow="Understanding the treatment"
        heading="Restoring the motion a collision took away"
        divider
        cta={{ href: "#how-it-works", label: "Understand Adjustments" }}
        image={{
          src: "https://align-the-spine.b-cdn.net/images/chiro-help.png",
          alt: "Dr. Abe performing a chiropractic adjustment",
        }}
      >
        A chiropractic adjustment uses precise, hands-on pressure to restore motion to a joint
        that&apos;s lost it after impact — what we call a fixation. When a vertebra stops moving
        properly after a collision, the surrounding muscles and nerves compensate, which is often
        the real source of pain in{" "}
        <Link href="/conditions/whiplash" className="underline">
          whiplash
        </Link>
        ,{" "}
        <Link href="/conditions/neck-pain" className="underline">
          neck pain
        </Link>
        ,{" "}
        <Link href="/conditions/back-pain" className="underline">
          back pain
        </Link>
        , and{" "}
        <Link href="/conditions/sciatica" className="underline">
          sciatica
        </Link>{" "}
        following an accident. An adjustment doesn&apos;t just relieve the ache — it restores the
        mechanics so your body stops working around the injury.
      </ServiceIntro>

      <div id="how-it-works" className="scroll-mt-[120px]">
        <Section>
          <Container className="flex flex-col gap-14">
            <SectionHeading eyebrow="How it works">
              From the collision to feeling like yourself again
            </SectionHeading>
            <div className="grid grid-cols-1 gap-10 border-t border-mute-300 pt-10 sm:grid-cols-3">
              {adjustmentsHowItWorks.map((step) => (
                <div key={step.title} className="group flex flex-col gap-3">
                  <h3 className="font-display text-3xl text-navy-900 transition-colors duration-200 group-hover:text-teal-500">
                    {step.title}
                  </h3>
                  <hr className="border-t border-navy-900 transition-colors duration-200 group-hover:border-teal-500" />
                  <p className="font-sans text-body-lg text-ink-500">{step.description}</p>
                  {step.learnMoreHref && (
                    <Link
                      href={step.learnMoreHref}
                      className="inline-flex w-fit items-center gap-2 pt-4 font-sans text-stat-label uppercase tracking-[1.25px] text-navy-900 transition-colors duration-300 hover:text-navy-700 underline decoration-transparent hover:decoration-navy-700 underline-offset-4 group-hover:text-teal-500 group-hover:decoration-teal-500 "
                    >
                      Learn more
                      <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </Container>
        </Section>
      </div>

      <AccidentInjuries />

      <ComparisonTable />

      <ServiceIntro
        eyebrow="Is it right for you?"
        heading="Right for most collision injuries — not every one"
        divider
        image={{
          src: "/figma-exports/adjustments-right-for-you.png",
          alt: "Dr. Abe adjusting a patient's neck in the clinic",
        }}
      >
        Adjustments are appropriate for most mechanical injuries from a collision — the majority of
        what we see. They&apos;re not the right first step for a fracture, dislocation, or Grade IV
        whiplash, which need emergency imaging before any hands-on care. For a severely herniated
        disc with significant nerve compression,{" "}
        <Link href="/services/spinal-decompression" className="underline">
          spinal decompression
        </Link>{" "}
        may be the better starting point, sometimes combined with adjustment once acute pressure is
        relieved. Florida PIP rules can involve time-sensitive initial-care requirements; coverage
        and eligibility depend on the policy and circumstances. An evaluation does not guarantee{" "}
        <Link href="/car-accident-chiropractor" className="underline">
          PIP benefits
        </Link>
        .
      </ServiceIntro>

      <DoctorProfile variant="short" content={doctorProfileContent} />

      <AccidentBanner accident={autoAccidentCondition.accident} />

      <PatientReviews
        featured={homeFeaturedTestimonial}
        reviews={homeReviews.slice(1, 4)}
        variant="light"
      />

      <Section spacing="sm" className="bg-[#E4F9F4]">
        <p className="container text-center font-sans text-body-lg text-navy-900">
          {autoAccidentAttorneyQuote}
        </p>
      </Section>

      <Section spacing="none" className="bg-navy-900">
        <Container className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:py-14">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-h2 text-white font-normal">Ready when you are</h2>
            <p className="font-sans text-body-lg text-mute-300 sm:w-[65%]">
              Same-day visits, seven days a week — no waiting room, no driving in pain.
            </p>
          </div>
          <Button variant="teal" href={siteConfig.bookingCta.href} className="w-fit shrink-0">
            Request My Evaluation
          </Button>
        </Container>
      </Section>

      <ConditionFaq faq={adjustmentsFaq} />
    </>
  );
}
