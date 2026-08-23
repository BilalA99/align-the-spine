import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { AccidentBanner } from "@/components/sections/accident-banner";
import { ComparisonTable } from "@/components/sections/comparison-table";
import { ConditionFaq } from "@/components/sections/condition-faq";
import { DoctorProfile } from "@/components/sections/doctor-profile";
import { HeroReviewsCarousel } from "@/components/sections/hero-reviews-carousel";
import { HeroSolidPanel } from "@/components/sections/hero-solid-panel";
import { PatientReviews } from "@/components/sections/patient-reviews";
import { RelatedConditions } from "@/components/sections/related-conditions";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Section } from "@/components/ui/section";
import { autoAccidentAttorneyQuote } from "@/content/auto-accident";
import { autoAccidentCondition } from "@/content/conditions/auto-accident";
import { doctorProfileContent } from "@/content/doctor-profile";
import { leadFormVariants } from "@/content/lead-forms";
import { buildRelatedLinks } from "@/content/related-links";
import { getRoute } from "@/content/seo";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel, homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";
import {
  tmjJawPainFaq,
  tmjJawPainHero,
  tmjJawPainRelatedBottomConfig,
} from "@/content/tmj-jaw-pain-page";
import { buildRouteMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildRouteMetadata(getRoute("/conditions/tmj-jaw-pain"));

/** /conditions/tmj-jaw-pain — dedicated, hand-built page, same per-page
 * pattern as the other condition pages (ATS-137) and the /services/*
 * pages built this pass. Pulled from the Figma `TMJ/Jawpain` frame (file
 * 3oNk0hDle8VMrPJQ0W0pDG, node 273:872) — see content/tmj-jaw-pain-page.ts
 * for the full content-fidelity notes (this frame, like
 * cervicogenic-headache's and concussion's, reuses large chunks of other
 * frames' boilerplate, so several sections here are shared/reused or
 * skipped rather than bespoke).
 *
 * Section order: Hero → HeroReviewsCarousel → Understanding intro
 * (heading/body with a link to whiplash, photo right) → ComparisonTable
 * (reused) → DoctorProfile (reused — the Figma bio here is leftover
 * massage-page copy with an unverified PIP-billing claim) → AccidentBanner
 * (reused) → PatientReviews (reused) → attorney quote strip (reused) →
 * CTA band → RelatedConditions (8-pill bottom row) → FAQ (bespoke — the
 * Figma FAQ here is literal leftover massage-soft-tissue copy). No
 * LocationIntro/LocationFooter/ContactSection — matches the other
 * condition/services pages' pattern. */
export default function TmjJawPainPage() {
  return (
    <>
      <HeroSolidPanel
        breadcrumbs={[
          { name: "Home", path: "" },
          { name: "TMJ / Jaw Pain", path: "/conditions/tmj-jaw-pain" },
        ]}
        background={tmjJawPainHero.backgroundImage}
        eyebrow={tmjJawPainHero.eyebrowChip}
        title={tmjJawPainHero.h1}
        subhead={tmjJawPainHero.subhead}
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
            <Eyebrow>Understanding TMJ trauma</Eyebrow>
            <h2 className="font-display text-display font-normal text-navy-900">
              The impact your jaw absorbed without you noticing.
            </h2>
            <p className="w-full font-sans text-body-lg text-ink-900">
              A concussion doesn&apos;t require losing consciousness or striking your head directly
              — the sudden whiplash motion of a car accident alone can cause the brain to move
              inside the skull, resulting in a mild traumatic brain injury. Post-concussion syndrome
              develops when symptoms like headaches, dizziness, or brain fog persist beyond the
              first few weeks. Because concussion and{" "}
              <Link href="/conditions/whiplash" className="underline">
                whiplash
              </Link>{" "}
              frequently occur together, treating only the neck while missing the concussion is a
              common gap in accident care. Florida gives you{" "}
              <Link href="/car-accident-chiropractor" className="underline">
                14 days
              </Link>{" "}
              to get evaluated and protect your{" "}
              <Link href="/car-accident-chiropractor" className="underline">
                PIP benefits
              </Link>
              .
            </p>
            <div className="w-full border-t border-mute-300" />
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

      <ComparisonTable />

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
            <h2 className="font-display text-h2 text-white">
              Still have questions about your accident claim?
            </h2>
            <p className="font-sans text-body-lg text-mute-300 w-[65%]">
              Same-day visits, seven days a week — no waiting room, no driving in pain.
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
          currentPath: "/conditions/tmj-jaw-pain",
          ...tmjJawPainRelatedBottomConfig,
        })}
      />

      <ConditionFaq faq={tmjJawPainFaq} />
    </>
  );
}
