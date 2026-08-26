import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { AccidentBanner } from "@/components/sections/accident-banner";
import { ComparisonTable } from "@/components/sections/comparison-table";
import { ConditionFaq } from "@/components/sections/condition-faq";
import { ConditionTypesWithCauses } from "@/components/sections/condition-types-with-causes";
import { DoctorProfile } from "@/components/sections/doctor-profile";
import { HeroReviewsCarousel } from "@/components/sections/hero-reviews-carousel";
import { HeroSolidPanel } from "@/components/sections/hero-solid-panel";
import { HowWeTreat } from "@/components/sections/how-we-treat";
import { PatientReviews } from "@/components/sections/patient-reviews";
import { RelatedConditions } from "@/components/sections/related-conditions";
import { SymptomChecklist } from "@/components/sections/symptom-checklist";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Section } from "@/components/ui/section";
import { autoAccidentAttorneyQuote } from "@/content/auto-accident";
import {
  concussionCauseCategories,
  concussionFaq,
  concussionHero,
  concussionRelatedMidPageConfig,
  concussionRelatedMidPageHeading,
  concussionRelatedTypesConfig,
  concussionRelatedTypesHeading,
  concussionSupportItems,
  concussionSymptomNote,
  concussionSymptoms,
  concussionSymptomsHeading,
  concussionTypesHeading,
} from "@/content/concussion-page";
import { autoAccidentCondition } from "@/content/conditions/auto-accident";
import { doctorProfileContent } from "@/content/doctor-profile";
import { leadFormVariants } from "@/content/lead-forms";
import { buildRelatedLinks } from "@/content/related-links";
import { getRoute } from "@/content/seo";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel, homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";
import { buildRouteMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildRouteMetadata(getRoute("/conditions/concussion"));

/** /conditions/concussion — dedicated, hand-built page, same per-page
 * pattern as the other condition pages (ATS-137) and the /services/*
 * pages built this pass. Pulled from the Figma `Concussion` frame (file
 * 3oNk0hDle8VMrPJQ0W0pDG, node 251:771) — see content/concussion-page.ts
 * for the full content-fidelity notes (this frame, like
 * cervicogenic-headache's, reuses large chunks of other frames'
 * boilerplate, so several sections here are shared/reused or skipped
 * rather than bespoke).
 *
 * Section order: Hero → HeroReviewsCarousel → Understanding intro
 * (heading/body with a link to whiplash, photo right) → SymptomChecklist
 * (interactive "check your symptoms" widget, bespoke and genuinely
 * concussion-specific) → ConditionTypesWithCauses ("Types of concussion
 * trauma": symptoms list + related-condition pills left, "From an
 * accident"/"Everyday causes" card right — the section the Figma frame's
 * own copy had left unresolved when this page was first built) →
 * HowWeTreat (reuses back-pain's exact 4 treatment cards — the same
 * content flagged elsewhere as leftover/clinically-mismatched copy, but
 * the frame's own "HOW WE TREAT" section renders this verbatim, so it's
 * kept rather than invented) → ComparisonTable (reused) → RelatedConditions
 * mid-page band ("Often needed alongside other post-accident care", light
 * gray background) → DoctorProfile (reused — the Figma bio here is
 * leftover massage-page copy with an unverified PIP-billing claim) →
 * AccidentBanner (reused) → PatientReviews (reused) → attorney quote strip
 * (reused) → CTA band → FAQ (bespoke — the Figma FAQ here is literal
 * leftover massage-soft-tissue copy). No bottom RelatedConditions pill row
 * or LocationIntro/LocationFooter/ContactSection — matches the other
 * condition/services pages' pattern. */
export default function ConcussionPage() {
  return (
    <>
      <HeroSolidPanel
        breadcrumbs={[
          { name: "Home", path: "" },
          { name: "Concussion", path: "/conditions/concussion" },
        ]}
        background={concussionHero.backgroundImage}
        eyebrow={concussionHero.eyebrowChip}
        title={concussionHero.h1}
        subhead={concussionHero.subhead}
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
            <Eyebrow>Understanding concussion trauma</Eyebrow>
            <h2 className="font-display text-display font-normal text-navy-900">
              The injury a car accident
              <br className="hidden lg:inline" />
              can cause without you
              <br className="hidden lg:inline" />
              hitting your head.
            </h2>
            <p className="w-full font-sans text-body-lg text-ink-900">
              A concussion is a mild traumatic brain injury that can occur without losing
              consciousness or striking the head directly. Headache, dizziness, confusion, vomiting,
              weakness, or worsening symptoms after a collision need prompt medical assessment.
              Chiropractic care is not a substitute for emergency or neurological evaluation.
              Concussion and{" "}
              <Link href="/conditions/whiplash" className="underline">
                whiplash
              </Link>{" "}
              can occur together, so neck pain may need a separate musculoskeletal evaluation after
              medical clearance. Florida PIP generally requires initial services and care within{" "}
              <Link href="/car-accident-chiropractor" className="underline">
                14 days
              </Link>{" "}
              of a motor vehicle accident, with coverage depending on eligibility and policy terms.
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

      <SymptomChecklist
        heading="Check any symptoms you've noticed since your accident:"
        symptoms={concussionSymptoms}
        note={concussionSymptomNote}
      />

      <ConditionTypesWithCauses
        heading={concussionTypesHeading}
        symptomsHeading={concussionSymptomsHeading}
        symptoms={concussionSymptoms}
        relatedHeading={concussionRelatedTypesHeading}
        relatedLinks={buildRelatedLinks({
          currentPath: "/conditions/concussion",
          ...concussionRelatedTypesConfig,
        })}
        categories={concussionCauseCategories}
      />

      <HowWeTreat
        items={concussionSupportItems}
        heading="Concussion safety starts with medical evaluation."
      />

      <ComparisonTable />

      <RelatedConditions
        items={buildRelatedLinks({
          currentPath: "/conditions/concussion",
          ...concussionRelatedMidPageConfig,
        })}
        heading={concussionRelatedMidPageHeading}
        className="bg-[#F5F6F8]"
      />

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
          <Button variant="teal" href={siteConfig.bookingCta.href} className="w-fit shrink-0">
            Request My Evaluation
          </Button>
        </Container>
      </Section>

      <ConditionFaq faq={concussionFaq} />
    </>
  );
}
