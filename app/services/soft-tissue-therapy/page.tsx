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
import { ServiceIntro } from "@/components/sections/service-intro";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { autoAccidentAttorneyQuote } from "@/content/auto-accident";
import { autoAccidentCondition } from "@/content/conditions/auto-accident";
import { doctorProfileContent } from "@/content/doctor-profile";
import { leadFormVariants } from "@/content/lead-forms";
import {
  massageConditions,
  massageFaq,
  massageSoftTissueHero,
  massageTechniques,
} from "@/content/massage-soft-tissue-page";
import { buildRelatedLinks } from "@/content/related-links";
import { getRoute } from "@/content/seo";
import { servicesGrid } from "@/content/services-grid";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel, homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";
import { cn } from "@/lib/cn";
import { buildService } from "@/lib/schema";
import { buildRouteMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildRouteMetadata(getRoute("/services/soft-tissue-therapy"));

const service = servicesGrid.find((item) => item.slug === "massage-soft-tissue")!;

// ATS-SEO-043: previously reused sciatica-page.ts's `sciaticaRelatedBottom`
// wholesale on this unrelated page (its own doc comment above already flags
// "No bottom RelatedConditions pill row or ... massage-specific ones" as a
// known gap) — now a real, page-specific list.
const relatedBottom = buildRelatedLinks({
  currentPath: "/services/soft-tissue-therapy",
  paths: [
    "/conditions/whiplash",
    "/conditions/neck-pain",
    "/conditions/back-pain",
    "/services",
    "/car-accident-chiropractor",
    "/blog",
    "/book-an-appointment",
  ],
  highlightPath: "/book-an-appointment",
});

/** /services/massage-soft-tissue — dedicated, hand-built page, same
 * per-page pattern as the condition pages (ATS-137) and
 * /services/chiropractic-adjustments and /services/spinal-decompression
 * (ATS-141 follow-ups). Pulled from the Figma
 * `services-massage-soft-tissue` frame (file 3oNk0hDle8VMrPJQ0W0pDG, node
 * 135:656).
 *
 * Section order: Hero → HeroReviewsCarousel → Understanding intro (3
 * technique rows: Graston/Trigger Point, Myofascial Release, Deep Tissue,
 * each with a "Book" pill) → short dark navy transition band → Conditions
 * soft tissue therapy relieves (bespoke 4-row list, reuses the condition
 * pages' existing anatomy diagrams + a shoulder photo) → ComparisonTable
 * (reused) → DoctorProfile (reused — the Figma bio here has an unverified
 * "billed directly to your PIP claim" claim, see
 * content/massage-soft-tissue-page.ts) → AccidentBanner (reuses
 * autoAccidentCondition.accident) → PatientReviews (reused) → attorney
 * quote strip (reused) → CTA band → FAQ (2 of the 4 Figma questions were
 * copy-pasted from the spinal-decompression page — replaced with real,
 * massage-specific ones). No bottom RelatedConditions pill row or
 * LocationIntro/LocationFooter/ContactSection — matches the other
 * /services/* pages' pattern. */
export default function MassageSoftTissuePage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "" },
          { name: "Services", path: "/services" },
          { name: "Massage & Soft-Tissue Therapy", path: "/services/soft-tissue-therapy" },
        ]}
      />
      <JsonLd data={buildService(service)} />
      <HeroSolidPanel
        breadcrumbs={[
          { name: "Home", path: "" },
          { name: "Services", path: "/services" },
          { name: "Massage & Soft Tissue", path: "/services/soft-tissue-therapy" },
        ]}
        background={massageSoftTissueHero.backgroundImage}
        eyebrow={massageSoftTissueHero.eyebrowChip}
        title={massageSoftTissueHero.h1}
        subhead={massageSoftTissueHero.subhead}
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
        heading="The soft-tissue damage a collision leaves behind"
        divider
        cta={{ href: "#techniques", label: "Explore the techniques" }}
        image={{
          src: "/figma-exports/drabe-softtissue.png",
          alt: "Dr. Abe performing soft-tissue therapy on a patient",
        }}
      >
        A crash doesn&apos;t only jar your joints — it overloads the muscles, tendons, and fascia
        that hold them together, leaving the spasm, guarding, and deep bruising behind the pain we
        see in{" "}
        <Link href="/conditions/whiplash" className="underline">
          whiplash
        </Link>
        ,{" "}
        <Link href="/conditions/neck-pain" className="underline">
          neck pain
        </Link>
        , and{" "}
        <Link href="/conditions/back-pain" className="underline">
          back pain
        </Link>{" "}
        after an accident. Massage and soft-tissue therapy work directly on that tissue — releasing
        the tension and restoring blood flow so the area can actually heal instead of tightening
        around the injury.
      </ServiceIntro>

      <Section id="techniques" className="scroll-mt-[120px]">
        <Container className="flex flex-col gap-14">
          <SectionHeading eyebrow="Our techniques">
            Three techniques, matched to what a collision actually did to your tissue.
          </SectionHeading>
          <div className="flex flex-col divide-y divide-navy-900/20 border-t border-navy-900">
            {massageTechniques.map((technique) => (
              <div
                key={technique.title}
                className="grid grid-cols-1 items-center gap-6 py-8 sm:grid-cols-[280px_1fr_auto] group"
              >
                <div className="relative aspect-4/3 w-full overflow-hidden sm:w-[280px]">
                  <Image
                    src={technique.image.src}
                    alt={technique.image.alt}
                    fill
                    sizes="280px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-3xl text-navy-900 group-hover:text-teal-500 transition-colors duration-300">
                    {technique.title}
                  </h3>
                  <p className="font-sans text-body-lg text-ink-500">{technique.description}</p>
                  <p className="font-sans text-sm text-ink-500">
                    <span className="font-medium text-navy-900">Best for:</span> {technique.bestFor}
                  </p>
                </div>
                <Button
                  variant="book"
                  href="/book-an-appointment"
                  className="w-fit shrink-0 self-start sm:self-center"
                >
                  Book
                </Button>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="none">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/figma-exports/massage-matched-to-injury-bg.png"
              alt="A therapist selecting massage tools from a bag of soft-tissue equipment"
              fill
              className="object-cover"
            />
          </div>
          <Container className="relative flex flex-col gap-3 py-16 md:py-20">
            <h2 className="font-display text-h2 font-normal text-white">
              Matched to your injury, not a routine
            </h2>
            <p className="max-w-2xl font-sans text-body-lg text-mute-300">
              We identify exactly which tissue was affected by the collision, then apply the
              technique built for it — not a generic massage sequence.
            </p>
          </Container>
        </div>
      </Section>

      <Section>
        <Container className="flex flex-col gap-14">
          <SectionHeading eyebrow="When it may fit">
            Conditions addressed with soft-tissue care
          </SectionHeading>
          <div className="flex flex-col divide-y divide-navy-900/20 border-t border-navy-900">
            {massageConditions.map((condition, idx) => (
              <div
                key={condition.name}
                className="grid grid-cols-1 items-center gap-6 py-8 sm:grid-cols-[200px_1fr_1fr] group"
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
                <h3
                  className={cn(
                    "font-display text-3xl font-normal text-ink-500 group-hover:text-navy-900 transition-colors duration-300",
                  )}
                >
                  {condition.name}
                </h3>
                <p
                  className={cn(
                    "font-sans text-body-lg text-ink-500 transition-colors duration-300 group-hover:text-navy-900",
                  )}
                >
                  {condition.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <ComparisonTable />

      <RelatedConditions
        items={relatedBottom}
        heading="Often needed alongside other post-accident care"
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

      <ConditionFaq faq={massageFaq} />
    </>
  );
}
