import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { AccidentBanner } from "@/components/sections/accident-banner";
import { ComparisonTable } from "@/components/sections/comparison-table";
import { ConditionFaq } from "@/components/sections/condition-faq";
import { DoctorProfile } from "@/components/sections/doctor-profile";
import { FeelsLikeBand } from "@/components/sections/feels-like-band";
import { HeroReviewsCarousel } from "@/components/sections/hero-reviews-carousel";
import { HeroSolidPanel } from "@/components/sections/hero-solid-panel";
import { PatientReviews } from "@/components/sections/patient-reviews";
import { RelatedConditions } from "@/components/sections/related-conditions";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { autoAccidentAttorneyQuote } from "@/content/auto-accident";
import {
  cervicogenicHeadacheConditions,
  cervicogenicHeadacheFaq,
  cervicogenicHeadacheFeelsLike,
  cervicogenicHeadacheHero,
  cervicogenicHeadacheRelatedBottomConfig,
} from "@/content/cervicogenic-headache-page";
import { autoAccidentCondition } from "@/content/conditions/auto-accident";
import { doctorProfileContent } from "@/content/doctor-profile";
import { leadFormVariants } from "@/content/lead-forms";
import { buildRelatedLinks } from "@/content/related-links";
import { getRoute } from "@/content/seo";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel, homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";
import { buildRouteMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildRouteMetadata(getRoute("/conditions/cervicogenic-headache"));

/** /conditions/cervicogenic-headache — dedicated, hand-built page, same
 * per-page pattern as the other condition pages (ATS-137) and the 3
 * /services/* pages built this pass. Pulled from the Figma
 * `Cervicogenic Headache` frame (file 3oNk0hDle8VMrPJQ0W0pDG, node
 * 138:462) — see content/cervicogenic-headache-page.ts for the full
 * content-fidelity notes (this frame reuses most of the
 * massage-soft-tissue frame's boilerplate, so several sections below are
 * shared/reused rather than bespoke).
 *
 * Section order: Hero → HeroReviewsCarousel → Understanding intro
 * (heading/body with links to whiplash/neck-pain, photo right) → FeelsLike
 * (4-card "what it feels like" grid, bespoke and genuinely
 * headache-specific) → ComparisonTable (reused) → DoctorProfile (reused
 * — the Figma bio here is leftover massage-page copy with an unverified
 * PIP-billing claim) → AccidentBanner (reused) → PatientReviews (reused)
 * → attorney quote strip (reused) → CTA band → RelatedConditions (8-pill
 * bottom row) → FAQ (bespoke — the Figma FAQ here is literal leftover
 * massage-soft-tissue copy). No LocationIntro/LocationFooter/
 * ContactSection — matches the other condition/services pages' pattern. */
export default function CervicogenicHeadachePage() {
  return (
    <>
      <HeroSolidPanel
        breadcrumbs={[
          { name: "Home", path: "" },
          { name: "Cervicogenic Headache", path: "/conditions/cervicogenic-headache" },
        ]}
        background={cervicogenicHeadacheHero.backgroundImage}
        eyebrow={cervicogenicHeadacheHero.eyebrowChip}
        title={cervicogenicHeadacheHero.h1}
        subhead={cervicogenicHeadacheHero.subhead}
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

      <Section>
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[3fr_2fr] lg:items-start lg:gap-16">
          <div className="flex flex-col gap-6">
            <Eyebrow>Understanding cervicogenic headache</Eyebrow>
            <h2 className="font-display text-display font-normal text-navy-900">
              The headache a car accident leaves behind
            </h2>
            <p className="font-sans text-body-lg text-ink-900">
              A cervicogenic headache is pain referred from structures in the neck. It may be felt
              at the base of the skull, on one side of the head, or with limited neck motion. A car
              accident can strain the neck, but new, severe, or worsening headaches need prompt
              medical evaluation to rule out other causes. Florida PIP generally requires initial
              services and care within{" "}
              <Link href="/car-accident-chiropractor" className="underline">
                14 days
              </Link>{" "}
              of a motor vehicle accident, with coverage depending on eligibility and policy terms.
              If headaches followed the collision,{" "}
              <Link href="/conditions/whiplash" className="underline">
                whiplash
              </Link>{" "}
              and neck pain may need to be assessed alongside the headache.
            </p>
            <a
              href="#how-it-feels"
              className="group inline-flex w-fit items-center gap-2 border-t border-mute-300 pt-4 font-sans text-stat-label uppercase tracking-[1.25px] text-navy-900 transition-colors hover:text-navy-700"
            >
              Understand Cervicogenic Headache
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
          <div className="relative mx-auto aspect-5/6 w-full max-w-md overflow-hidden lg:mx-0">
            <Image
              src="/figma-exports/dr-abe-neck.png"
              alt="Dr. Abe Nasser examining a patient's neck"
              fill
              sizes="(min-width: 1024px) 32vw, 100vw"
              className="object-cover"
            />
          </div>
        </Container>
      </Section>

      <div id="how-it-feels" className="scroll-mt-[120px]">
        <FeelsLikeBand
          eyebrow="What it feels like"
          heading="A headache that started after impact"
          items={cervicogenicHeadacheFeelsLike}
          background={{
            src: "/figma-exports/whiplash-feels-band-bg.png",
            alt: "Close-up of a hand reaching toward a shoulder in soft, warm light",
          }}
        />
      </div>

      <Section>
        <Container className="flex flex-col gap-14">
          <SectionHeading eyebrow="Related conditions">
            Conditions that may overlap with cervicogenic headache
          </SectionHeading>
          <div className="flex flex-col divide-y divide-mute-300 border-t border-mute-300">
            {cervicogenicHeadacheConditions.map((condition) => (
              <div
                key={condition.name}
                className="group grid grid-cols-1 items-center gap-6 py-8 sm:grid-cols-[200px_1fr_1fr]"
              >
                <div className="relative aspect-3/2 w-full overflow-hidden sm:w-50">
                  <Image
                    src={condition.image.src}
                    alt={condition.image.alt}
                    fill
                    sizes="200px"
                    className="object-cover transition-[filter] duration-500 sm:grayscale sm:brightness-75 sm:group-hover:grayscale-0 sm:group-hover:brightness-100"
                  />
                </div>
                <h3 className="font-display text-h2 text-ink-500 transition-colors duration-300 group-hover:text-navy-900">
                  {condition.name}
                </h3>
                <p className="font-sans text-body-lg text-ink-500 transition-colors duration-300 group-hover:text-navy-900">
                  {condition.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <ComparisonTable />

      <DoctorProfile variant="short" content={doctorProfileContent} />

      <AccidentBanner accident={autoAccidentCondition.accident} />

      <PatientReviews
        featured={homeFeaturedTestimonial}
        reviews={homeReviews.slice(1, 4)}
        variant="light"
      />

      <Section spacing="sm" className="bg-[#E4F9F4]">
        <p className="container text-center font-sans font-medium text-body-lg text-navy-900">
          {autoAccidentAttorneyQuote}
        </p>
      </Section>

      <Section spacing="none" className="bg-navy-900">
        <Container className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:py-14">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-h2 text-white">
              Still have questions about your accident claim?
            </h2>
            <p className="font-sans text-body-lg text-mute-300 w-[65%]">
              Same-day visits, seven days a week — no waiting room, no driving in pain.
            </p>
          </div>
          <Button variant="teal" href={siteConfig.bookingCta.href} className="w-fit shrink-0">
            Request My Evaluation
          </Button>
        </Container>
      </Section>

      <RelatedConditions
        items={buildRelatedLinks({
          currentPath: "/conditions/cervicogenic-headache",
          ...cervicogenicHeadacheRelatedBottomConfig,
        })}
      />

      <ConditionFaq faq={cervicogenicHeadacheFaq} />
    </>
  );
}
