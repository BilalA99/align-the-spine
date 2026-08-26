import type { Metadata } from "next";

import { FitChecklist } from "@/components/sections/fit-checklist";
import { HeroSolidPanel } from "@/components/sections/hero-solid-panel";
import { HowWeHelpSteps } from "@/components/sections/how-we-help-steps";
import { ReviewsStrip } from "@/components/sections/reviews-strip";
import { ServiceAreas } from "@/components/sections/service-areas";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { Button } from "@/components/ui/button";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { homeVisitFaqs } from "@/content/faqs";
import { homeVisitFitChecklist, homeVisitSteps } from "@/content/home-visits";
import { leadFormVariants } from "@/content/lead-forms";
import { getRoute } from "@/content/seo";
import { siteConfig } from "@/content/site";
import { featuredTestimonial } from "@/content/testimonials";
import { buildRouteMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildRouteMetadata(getRoute("/home-visit-chiropractor"));

/** /home-visits page assembly (ATS-110) per the Home-visits-v2 artboard
 * (96:1950): condition hero with the eligibility LeadForm, ServiceAreas +
 * FitChecklist (ATS-111) under a shared heading, a mid-page eligibility CTA
 * banner, HowWeHelpSteps, and a "Quick answers" FAQ. Navbar/TopStatsBar and
 * the standard navy footer come from RootShell. */
export default function HomeVisitsPage() {
  return (
    <>
      <HeroSolidPanel
        breadcrumbs={[
          { name: "Home", path: "" },
          { name: "Home Visit Chiropractor", path: "/home-visit-chiropractor" },
        ]}
        background={{
          src: "/figma-exports/home-visits-hero.png",
          alt: "Dr. Abe Nasser setting up a treatment table in a patient's living room",
        }}
        eyebrow="Too hurt to drive to us?"
        title={
          <>
            The clinic,
            <br />
            at your door
          </>
        }
        subhead="Full exam and hands-on treatment, wherever you're most comfortable — when it's the right fit for your case and location."
        callPill={{ eyebrow: "Speak with us today", phone: `Call ${siteConfig.business.phone}` }}
        form={{
          heading: "Check home-visit eligibility",
          submitLabel: leadFormVariants.eligibility.submitLabel,
          variant: leadFormVariants.eligibility.variant,
          fields: leadFormVariants.eligibility.fields,
          footerNote:
            "One verified office in Deerfield Beach; home visits are limited to eligible car-accident/PIP circumstances and require case and location confirmation.",
        }}
      />

      <Section spacing="sm" className="container">
        <ReviewsStrip testimonial={featuredTestimonial} />
      </Section>

      <Section spacing="lg" className="container">
        <div className="flex flex-col gap-14">
          <SectionHeading
            eyebrow="A better way to recover"
            className="items-center text-center"
            sub={
              <p className="mx-auto max-w-2xl">
                We&apos;re upfront about this because it matters: a home visit is offered based on
                your case and location, not guaranteed for every visit. Here&apos;s the honest
                breakdown.
              </p>
            }
          >
            Home visits fit some cases better than others
          </SectionHeading>

          <ServiceAreas
            image={{
              src: "/figma-exports/home-visits-fit-checklist.png",
              alt: "Dr. Abe Nasser setting up a treatment table in a patient's home",
            }}
          />

          <FitChecklist rows={homeVisitFitChecklist} />
        </div>
      </Section>

      <Section spacing="none" className="container">
        <div className="flex flex-col gap-6 bg-navy-900 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-14">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-h2 text-white">Ready to check eligibility</h2>
            <p className="font-sans text-body-lg text-mute-300 w-[65%]">
              Takes two minutes — we&apos;ll tell you honestly whether a home visit fits your case.
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
        </div>
      </Section>

      <Section spacing="lg" className="container">
        <HowWeHelpSteps
          heading="Three steps, no waiting room"
          steps={homeVisitSteps}
          cta={{ label: "Book an appointment", href: siteConfig.bookingCta.href }}
        />
      </Section>

      <Section spacing="lg" className="container">
        <div className="flex flex-col gap-10">
          <SectionHeading eyebrow="Frequently asked questions" className="items-center text-center">
            Everything you need to know about home visits
          </SectionHeading>
          <FaqAccordion items={homeVisitFaqs} />
          <FaqJsonLd items={homeVisitFaqs} />
        </div>
      </Section>
    </>
  );
}
