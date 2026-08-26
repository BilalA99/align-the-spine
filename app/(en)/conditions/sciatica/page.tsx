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
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { Section } from "@/components/ui/section";
import { doctorProfileContent } from "@/content/doctor-profile";
import { leadFormVariants } from "@/content/lead-forms";
import { pointToWhereItHurtsContent } from "@/content/point-to-where-it-hurts";
import { buildRelatedLinks } from "@/content/related-links";
import {
  sciaticaAccident,
  sciaticaFaq,
  sciaticaFeelsLike,
  sciaticaHero,
  sciaticaHowWeTreat,
  sciaticaRelatedBottomConfig,
  sciaticaRelatedMidPageConfig,
  sciaticaSymptoms,
  sciaticaWarning,
} from "@/content/sciatica-page";
import { getRoute } from "@/content/seo";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel, homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";
import { buildRouteMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildRouteMetadata(getRoute("/conditions/sciatica"));

const sciaticaTypes = [
  {
    items: [
      {
        name: "Herniated disc",
        description: (
          <>
            A{" "}
            <Link href="/services/spinal-decompression" className="underline">
              herniated or bulging disc
            </Link>{" "}
            pressing directly on the nerve root. The most common cause.
          </>
        ),
      },
      {
        name: "Stenotic sciatica",
        description:
          "Spinal stenosis narrows the canal and compresses the nerve. More common with age.",
      },
      {
        name: "Piriformis syndrome",
        description:
          "The piriformis muscle compresses the nerve — not a disc issue. Common in athletes and people who sit all day.",
      },
      {
        name: "Lumbar radiculopathy",
        description:
          'Nerve root compression specifically at L4–L5 or L5–S1. The clinical diagnosis behind most sciatica cases — when a doctor says "sciatica," this is usually what they mean.',
      },
    ],
  },
];

/** /conditions/sciatica — dedicated, hand-built page (ATS-137 full-fidelity
 * rework, third condition off the generic [slug] template after back-pain
 * and neck-pain). whiplash stays on the old [slug] template until its own
 * screenshots arrive.
 *
 * Section order per the Figma `sciatica` frame (file 4mb4VDHszsaj2KEZzyjOjf,
 * node 96:813), verified against 12 design screenshots: Hero →
 * HeroReviewsCarousel → Understanding intro (heading/body/diagram) →
 * CausesAndTypes (Classic Sciatica Symptoms + Related pills left, a FLAT
 * Types list right — no "From an accident"/"Everyday causes" subheadings
 * like neck-pain has, just 4 items with one highlighted) → ComparisonTable
 * → HowWeTreat → FeelsLike (+ warning card) → AccidentBanner →
 * PatientReviews → DoctorProfile → PointToWhereItHurts → AccidentInjuries
 * → "Still have questions?" band → RelatedConditions → FAQ. No
 * LocationIntro/LocationFooter/ContactSection — same as the other
 * dedicated condition pages, the Figma frame goes straight to the standard
 * footer (rendered by RootShell).
 *
 * Unlike back-pain/neck-pain, this frame's accident-banner and FAQ copy is
 * NOT a mismatch (this genuinely is the Sciatica page) — kept verbatim,
 * see content/sciatica-page.ts's header comment. */
export default function SciaticaPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "" },
          { name: "Sciatica", path: "/conditions/sciatica" },
        ]}
      />
      <HeroSolidPanel
        breadcrumbs={[
          { name: "Home", path: "" },
          { name: "Sciatica", path: "/conditions/sciatica" },
        ]}
        background={sciaticaHero.backgroundImage}
        eyebrow={sciaticaHero.eyebrowChip}
        title={sciaticaHero.h1}
        subhead={sciaticaHero.subhead}
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
            <Eyebrow>How sciatica escalates</Eyebrow>
            <h2 className="font-display text-display font-normal text-navy-900">
              Sciatica isn&apos;t a condition on
              <br className="hidden lg:inline" />
              its own — it&apos;s a symptom of
              <br className="hidden lg:inline" />
              nerve pressure
            </h2>
            <div className="flex flex-col gap-4 lg:ml-[10vw]">
              <p className="max-w-2xl font-sans text-body-lg text-ink-900">
                Sciatica describes pain or other symptoms along the sciatic nerve. After a car
                accident, Dr. Abe Nasser evaluates possible musculoskeletal contributors and
                documents relevant findings for a PIP claim when applicable. Possible causes include
                a{" "}
                <Link href="/services/spinal-decompression" className="underline">
                  herniated disc
                </Link>{" "}
                or{" "}
                <Link href="/services/spinal-decompression" className="underline">
                  spinal stenosis
                </Link>{" "}
                that irritates or compresses a nerve root, whether symptoms followed an impact or
                developed over time.
              </p>
              <div className="w-full h-px bg-mute-350" />
              <a
                href="#types-of-sciatica"
                className="group inline-flex w-fit items-center gap-2 pt-4 font-sans text-stat-label uppercase tracking-[1.25px] text-navy-900 transition-colors duration-300 hover:text-navy-700 underline decoration-transparent hover:decoration-navy-700 underline-offset-4"
              >
                Understand Sciatica
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
          <div className="relative mx-auto aspect-639/770 w-full max-w-lg overflow-hidden lg:mr-[5vw]">
            <Image
              src="/figma-exports/sciatica-anatomy-diagram.png"
              alt="Illustration of the lumbar spine and sciatic nerve pathway highlighting the sacroiliac joint, pelvis, and femur"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain"
            />
          </div>
        </Container>
      </Section>

      <div id="types-of-sciatica" className="scroll-mt-[120px]">
        <CausesAndTypes
          causesHeading="Classic Sciatica Symptoms"
          causes={sciaticaSymptoms}
          relatedHeading="Related Sciatica Conditions"
          relatedLinks={buildRelatedLinks({
            currentPath: "/conditions/sciatica",
            ...sciaticaRelatedMidPageConfig,
          })}
          typesHeading="Types"
          categories={sciaticaTypes}
        />
      </div>

      <ComparisonTable />

      <HowWeTreat items={sciaticaHowWeTreat} />

      <FeelsLike
        items={sciaticaFeelsLike}
        heading="Four signs it's sciatica, not just soreness."
        warning={sciaticaWarning}
      />

      <AccidentBanner accident={sciaticaAccident} />

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
          currentPath: "/conditions/sciatica",
          ...sciaticaRelatedBottomConfig,
        })}
      />

      <ConditionFaq faq={sciaticaFaq} />
    </>
  );
}
