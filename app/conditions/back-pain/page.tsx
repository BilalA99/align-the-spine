import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { AccidentBanner } from "@/components/sections/accident-banner";
import { AccidentInjuries } from "@/components/sections/accident-injuries";
import { CausesAndWhenToSee } from "@/components/sections/causes-and-when-to-see";
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
import { TypesGrid } from "@/components/sections/types-grid";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { Section } from "@/components/ui/section";
import {
  backPainAccident,
  backPainCauses,
  backPainFaq,
  backPainFeelsLike,
  backPainHero,
  backPainHowWeTreat,
  backPainRelatedBottomConfig,
  backPainRelatedMidPageConfig,
  backPainWarning,
  backPainWhenToSee,
} from "@/content/back-pain-page";
import { doctorProfileContent } from "@/content/doctor-profile";
import { leadFormVariants } from "@/content/lead-forms";
import { pointToWhereItHurtsContent } from "@/content/point-to-where-it-hurts";
import { buildRelatedLinks } from "@/content/related-links";
import { getRoute } from "@/content/seo";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel, homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";
import { buildRouteMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildRouteMetadata(getRoute("/conditions/back-pain"));

const backPainTypes = [
  {
    name: "Accident-related",
    description: (
      <>
        Back pain following a car accident or sudden impact, sometimes delayed in onset like{" "}
        <Link href="/conditions/whiplash" className="underline">
          whiplash
        </Link>
        . Florida gives you{" "}
        <Link href="/car-accident-chiropractor" className="underline">
          14 days
        </Link>{" "}
        to get evaluated and protect your{" "}
        <Link href="/car-accident-chiropractor" className="underline">
          PIP benefits
        </Link>
        .
      </>
    ),
  },
  {
    name: "Mechanical / Muscular",
    description:
      "The most common type — strain from posture, lifting, or overuse rather than nerve or disc involvement. Responds well to adjustment and soft-tissue work.",
  },
  {
    name: "Disc-related",
    description: (
      <>
        Pain originating from a bulging or herniated disc pressing on surrounding structures — may
        stay localized or radiate depending on severity. See{" "}
        <Link href="/services/spinal-decompression" className="underline">
          Spinal Decompression
        </Link>{" "}
        for how we treat it conservatively.
      </>
    ),
  },
  {
    name: "Acute",
    description:
      "Sudden onset from a specific strain, sprain, or impact. Usually resolves within a few weeks with the right treatment.",
  },
  {
    name: "Radicular (nerve-related)",
    description: (
      <>
        Pain that radiates from the lower back into the hip or leg, caused by a nerve being
        compressed or irritated — often from a{" "}
        <Link href="/services/spinal-decompression" className="underline">
          herniated disc
        </Link>
        . This pattern is specifically{" "}
        <Link href="/conditions/sciatica" className="underline">
          Sciatica
        </Link>
        .
      </>
    ),
  },
  {
    name: "Chronic",
    description:
      "Pain that persists beyond three months, often from degenerative changes, repeated strain, or an old injury that never fully healed — needs an ongoing management plan, not a single fix.",
    highlighted: true,
  },
];

/** /conditions/back-pain — dedicated, hand-built page (ATS-137 full-fidelity
 * rework) replacing the generic [slug] + Condition-schema template for this
 * route, per direct user request: every condition page gets its own set of
 * design screenshots and its own bespoke page (mirroring the /auto-accidents
 * pattern), instead of forcing every condition through one shared template.
 * neck-pain/whiplash/sciatica stay on the old [slug] template until their
 * own screenshots arrive.
 *
 * Section order per the Figma `back-pain` frame (file 4mb4VDHszsaj2KEZzyjOjf,
 * node 96:3517), verified against 10 design screenshots: Hero →
 * HeroReviewsCarousel → Understanding intro (heading/body/diagram) →
 * TypesGrid → ComparisonTable → CausesAndWhenToSee → HowWeTreat → FeelsLike
 * (+ warning card) → AccidentBanner → PatientReviews → DoctorProfile →
 * PointToWhereItHurts → AccidentInjuries → "Still have questions?" band →
 * RelatedConditions → FAQ. No LocationIntro/LocationFooter/ContactSection —
 * same as /auto-accidents, the Figma frame goes straight to the standard
 * footer (rendered by RootShell). */
export default function BackPainPage() {
  return (
    <>
      <HeroSolidPanel
        breadcrumbs={[
          { name: "Home", path: "" },
          { name: "Back Pain", path: "/conditions/back-pain" },
        ]}
        background={backPainHero.backgroundImage}
        eyebrow={backPainHero.eyebrowChip}
        title={backPainHero.h1}
        subhead={backPainHero.subhead}
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
            <Eyebrow>Understanding Back Pain</Eyebrow>
            <h2 className="font-display text-display font-normal text-navy-900">
              Back pain has a lot of possible
              <br className="hidden lg:inline" />
              causes. Finding yours is the
              <br className="hidden lg:inline" />
              first step to fixing it.
            </h2>
            <p className="max-w-2xl font-sans text-body-lg text-ink-900 lg:ml-[10vw]">
              Back pain has a lot of possible causes — finding yours is the first step to fixing it.
              If a car accident is involved, Florida gives you{" "}
              <Link href="/car-accident-chiropractor" className="underline">
                14 days
              </Link>{" "}
              to get evaluated and protect your{" "}
              <Link href="/car-accident-chiropractor" className="underline">
                PIP benefits
              </Link>
              , since sudden impact can cause the same{" "}
              <Link href="/services/spinal-decompression" className="underline">
                herniated disc
              </Link>{" "}
              or{" "}
              <Link href="/services/soft-tissue-therapy" className="underline">
                muscle strain
              </Link>{" "}
              that shows up in everyday cases — sometimes with pain that radiates down the leg, a
              distinct pattern worth reading about on our{" "}
              <Link href="/conditions/sciatica" className="underline">
                Sciatica page
              </Link>
              . Everyday back pain follows a similar pattern: sudden strain from lifting or a bad
              movement, or pain that&rsquo;s been building for months from structural wear.
            </p>
            <div className="h-[1px] bg-black lg:ml-[10vw]" />
            <a
              href="#types-of-back-pain"
              className="group inline-flex w-fit items-center gap-2 pt-4 font-sans text-stat-label uppercase tracking-[1.25px] text-navy-900 transition-colors duration-300 hover:text-navy-700 underline decoration-transparent hover:decoration-navy-700 underline-offset-4 lg:ml-[10vw]"
            >
              Understand Back Pain
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
          <div className="relative mx-auto aspect-551/660 w-full max-w-md overflow-hidden lg:mr-[5vw]">
            <Image
              src="/figma-exports/back-pain-anatomy-diagram.png"
              alt="Illustration of the lumbar spine and sciatic nerve pathway highlighting the sacroiliac joint, pelvis, and femur"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain"
            />
          </div>
        </Container>
      </Section>

      <div id="types-of-back-pain" className="scroll-mt-[120px]">
        <TypesGrid heading="Types of Back Pain" items={backPainTypes} />
      </div>

      <ComparisonTable />

      <CausesAndWhenToSee
        causesHeading="Common Causes"
        causes={backPainCauses}
        relatedHeading="Related Back Pain Conditions"
        relatedLinks={buildRelatedLinks({
          currentPath: "/conditions/back-pain",
          ...backPainRelatedMidPageConfig,
        })}
        whenToSee={backPainWhenToSee}
      />

      <HowWeTreat items={backPainHowWeTreat} />

      <FeelsLike
        items={backPainFeelsLike}
        heading="Not all back pain feels the same"
        warning={backPainWarning}
      />

      <AccidentBanner accident={backPainAccident} />

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
          currentPath: "/conditions/back-pain",
          ...backPainRelatedBottomConfig,
        })}
      />

      <ConditionFaq faq={backPainFaq} />
    </>
  );
}
