import type { Metadata } from "next";

import { LocationFooter } from "@/components/layout/location-footer";
import { LocationIntro } from "@/components/layout/location-intro";
import { Hero } from "@/components/sections/hero";
import { HeroReviewsCarousel } from "@/components/sections/hero-reviews-carousel";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { PracticeJsonLd } from "@/components/seo/practice-json-ld";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { bookFaqs } from "@/content/faqs";
import { leadFormVariants } from "@/content/lead-forms";
import { getRoute } from "@/content/seo";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel } from "@/content/testimonials";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata(getRoute("/contact-us"));

/** /contact-us page assembly (ATS-143) per the Figma "contact-us" frame:
 * Hero (condition variant, name/phone/email/message form) →
 * HeroReviewsCarousel (incl. TopStatsBar) → LocationIntro + LocationFooter
 * (shared with Home/Services/About/Book, "Send" overridden to jump back up
 * to the hero form here instead of the homepage's embedded contact section)
 * → "Quick answers" FAQ (same bookFaqs content/copy as /book). Navbar/
 * standard navy footer come from RootShell. */
export default function ContactUsPage() {
  return (
    <>
      <PracticeJsonLd />
      <div id="contact-hero-form">
        <Hero
          variant="condition"
          breadcrumbs={[
            { name: "Home", path: "" },
            { name: "Contact Us", path: "/contact-us" },
          ]}
          background={{
            src: "/figma-exports/interior-reception.png",
            alt: "Align the Spine reception area",
          }}
          eyebrow="CHIROPRACTIC CARE IN DEERFIELD BEACH"
          title="Contact Align the Spine Chiropractic"
          subhead="Visit 811 SE 8th Ave, Suite 101, in Deerfield Beach, or reach us directly with questions about an appointment, insurance, or accident claim."
          callPill={{ eyebrow: "Speak with us today", phone: `Call ${siteConfig.business.phone}` }}
          form={{
            heading: "Request Your Evaluation",
            submitLabel: leadFormVariants.contactUs.submitLabel,
            variant: leadFormVariants.contactUs.variant,
            fields: leadFormVariants.contactUs.fields,
          }}
        />
      </div>

      <HeroReviewsCarousel testimonials={heroReviewsCarousel} />

      <LocationIntro sendHref="#contact-hero-form" />
      <LocationFooter />

      <Section spacing="lg" className="container">
        <div className="flex flex-col gap-10">
          <SectionHeading eyebrow="Before you call" className="items-center text-center">
            Quick answers
          </SectionHeading>
          <FaqAccordion items={bookFaqs} />
          <FaqJsonLd items={bookFaqs} />
        </div>
      </Section>
    </>
  );
}
