import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { AccidentBanner } from "@/components/sections/accident-banner";
import { AccidentInjuries } from "@/components/sections/accident-injuries";
import { CausesAndTypes } from "@/components/sections/causes-and-types";
import { ComparisonTable } from "@/components/sections/comparison-table";
import { ConditionFaq } from "@/components/sections/condition-faq";
import { DoctorProfile } from "@/components/sections/doctor-profile";
import { FeelsLike } from "@/components/sections/feels-like";
import { HeroReviewsCarousel } from "@/components/sections/hero-reviews-carousel";
import { HeroSolidPanel } from "@/components/sections/hero-solid-panel";
import { HowWeTreat } from "@/components/sections/how-we-treat";
import { PatientReviews } from "@/components/sections/patient-reviews";
import { PointToWhereItHurts } from "@/components/sections/point-to-where-it-hurts";
import { RelatedConditions } from "@/components/sections/related-conditions";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { Section } from "@/components/ui/section";
import { doctorProfileContent } from "@/content/doctor-profile";
import { leadFormVariants } from "@/content/lead-forms";
import {
  neckPainAccident,
  neckPainCauses,
  neckPainFaq,
  neckPainFeelsLike,
  neckPainHero,
  neckPainHowWeTreat,
  neckPainRelatedBottomConfig,
  neckPainRelatedMidPageConfig,
  neckPainWarning,
} from "@/content/neck-pain-page";
import { pointToWhereItHurtsContent } from "@/content/point-to-where-it-hurts";
import { buildRelatedLinks } from "@/content/related-links";
import { getRoute } from "@/content/seo";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel, homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";
import { buildRouteMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildRouteMetadata(getRoute("/conditions/neck-pain"));

const neckPainTypeCategories = [
  {
    label: "From an accident",
    items: [
      {
        name: "Post-traumatic neck pain",
        description:
          "Neck pain following a collision or sudden impact — often delayed in onset, sometimes accompanied by headaches or restricted motion that builds over the days after",
      },
      {
        name: "Cervical herniated disc",
        description:
          "A disc in the neck pressing on a nerve root, which can happen from the force of a collision — may cause pain radiating into the shoulder or arm.",
        highlighted: true,
      },
      {
        name: "Facet joint syndrome",
        description:
          "Joint inflammation from impact or wear — a common source of persistent neck pain after a collision that doesn't resolve on its own.",
      },
    ],
  },
  {
    label: "Everyday causes",
    items: [
      {
        name: "Cervical muscle strain",
        description:
          "The most common type — tension from posture, stress, or sleep position. Responds well to adjustment and soft-tissue work.",
      },
      {
        name: "Cervical stenosis",
        description:
          "Narrowing of the spinal canal in the neck, often age-related — more common with age but can be aggravated by trauma.",
      },
    ],
  },
];

/** /conditions/neck-pain — dedicated, hand-built page (ATS-137 full-fidelity
 * rework, second condition off the generic [slug] template after
 * back-pain). whiplash/sciatica stay on the old [slug] template until
 * their own screenshots arrive.
 *
 * Section order per the Figma `neck-pain` frame (file 4mb4VDHszsaj2KEZzyjOjf,
 * node 96:3094), verified against 10 design screenshots: Hero →
 * HeroReviewsCarousel → Understanding intro (heading/body/diagram) →
 * CausesAndTypes (causes+related pills left, category-grouped Types right —
 * neck-pain has no separate When-to-see section, unlike back-pain) →
 * ComparisonTable → HowWeTreat → FeelsLike (+ warning card) →
 * AccidentBanner → PatientReviews → DoctorProfile → PointToWhereItHurts →
 * AccidentInjuries → "Still have questions?" band → RelatedConditions →
 * FAQ. No LocationIntro/LocationFooter/ContactSection — same as
 * /auto-accidents and /conditions/back-pain, the Figma frame goes straight
 * to the standard footer (rendered by RootShell). */
export default function NeckPainPage() {
  return (
    <>
      <HeroSolidPanel
        breadcrumbs={[
          { name: "Home", path: "" },
          { name: "Neck Pain", path: "/conditions/neck-pain" },
        ]}
        background={neckPainHero.backgroundImage}
        eyebrow={neckPainHero.eyebrowChip}
        title={neckPainHero.h1}
        subhead={neckPainHero.subhead}
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
        <Container className="flex flex-col justify-between gap-10 lg:flex-row lg:items-start">
          <div className="flex flex-col gap-6">
            <Eyebrow>Understanding Neck Pain</Eyebrow>
            <h2 className="font-display text-display font-normal text-navy-900">
              Neck pain ranges from a
              <br className="hidden lg:inline" />
              stiff morning to something
              <br className="hidden lg:inline" />
              worth a real evaluation.
            </h2>
            <p className="max-w-2xl font-sans text-body-lg text-ink-900 lg:ml-[10vw]">
              Neck pain after a car accident needs a different evaluation than an everyday stiff
              morning. If your neck pain started after a collision, Florida gives you{" "}
              <Link href="/car-accident-chiropractor" className="underline">
                14 days
              </Link>{" "}
              for initial services and care under Florida PIP, with coverage depending on policy
              terms. Accident-related neck pain may involve{" "}
              <Link href="/conditions/whiplash" className="underline">
                whiplash
              </Link>{" "}
              or something structural in the{" "}
              <Link href="/services#adjustments" className="underline">
                cervical spine
              </Link>
              . Neck pain can also involve muscle tension from posture, stress, or sleep position,
              so an evaluation helps determine the likely source and appropriate next step.
            </p>
            <div className="h-[1px] bg-black lg:ml-[10vw]" />
            <a
              href="#types-of-neck-pain"
              className="group lg:ml-[10vw] inline-flex w-fit items-center gap-2 pt-4 font-sans text-stat-label uppercase tracking-[1.25px] text-navy-900 transition-colors duration-300 hover:text-navy-700 underline decoration-transparent hover:decoration-navy-700 underline-offset-4"
            >
              Understand Neck Pain
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
          <div className="relative mx-auto aspect-411/737 w-full max-w-sm overflow-hidden lg:mr-[5vw]">
            <Image
              src="https://align-the-spine.b-cdn.net/images/neck-pain.png"
              alt="Illustration of the cervical spine highlighting the cervical nerves, muscle strain/spasm, and neck pain pathway into the shoulder"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain"
            />
          </div>
        </Container>
      </Section>

      <div id="types-of-neck-pain" className="scroll-mt-[120px]">
        <CausesAndTypes
          causesHeading="Common Causes"
          causes={neckPainCauses}
          relatedHeading="Related Neck Pain conditions"
          relatedLinks={buildRelatedLinks({
            currentPath: "/conditions/neck-pain",
            ...neckPainRelatedMidPageConfig,
          })}
          typesHeading="Types"
          categories={neckPainTypeCategories}
        />
      </div>

      <ComparisonTable />

      <HowWeTreat items={neckPainHowWeTreat} />

      <FeelsLike
        items={neckPainFeelsLike}
        heading="More than just a stiff morning"
        warning={neckPainWarning}
      />

      <AccidentBanner accident={neckPainAccident} />

      <PatientReviews
        featured={homeFeaturedTestimonial}
        reviews={homeReviews.slice(1, 4)}
        variant="light"
      />

      <DoctorProfile variant="short" content={doctorProfileContent} />

      <PointToWhereItHurts content={pointToWhereItHurtsContent} />

      <AccidentInjuries />

      <Section spacing="none" className="bg-navy-900">
        <Container className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:py-14">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-h2 text-white">Still have questions? Just Call</h2>
            <p className="font-sans text-body-lg text-mute-300 w-[65%]">
              Dr. Abe Answers the phone. No call center, no hold music.
            </p>
          </div>
          <Button
            variant="glass"
            href={siteConfig.business.phoneHref}
            eyebrow="Speak with us today"
            className="w-fit shrink-0"
          >
            Call {siteConfig.business.phone}
          </Button>
        </Container>
      </Section>

      <RelatedConditions
        items={buildRelatedLinks({
          currentPath: "/conditions/neck-pain",
          ...neckPainRelatedBottomConfig,
        })}
      />

      <ConditionFaq faq={neckPainFaq} />
    </>
  );
}
