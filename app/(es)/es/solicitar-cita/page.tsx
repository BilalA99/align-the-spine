import type { Metadata } from "next";

import { LocationFooter } from "@/components/layout/location-footer";
import { LocationIntro } from "@/components/layout/location-intro";
import { HeroReviewsCarousel } from "@/components/sections/hero-reviews-carousel";
import { HeroSolidPanel } from "@/components/sections/hero-solid-panel";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { esLeadFormVariants } from "@/content/es/lead-forms";
import { esBookingPage } from "@/content/es/pages";
import { getEsRoute } from "@/content/es/seo";
import { HREFLANG } from "@/content/i18n";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel } from "@/content/testimonials";
import { buildWebPage } from "@/lib/schema";
import { buildEsRouteMetadata } from "@/lib/seo/metadata";

const route = getEsRoute("/es/solicitar-cita");

export const metadata: Metadata = buildEsRouteMetadata(route);

/** /es/solicitar-cita — Spanish counterpart of /book-an-appointment.
 *
 * One composition difference from the English page, deliberate: the English
 * hero swaps in the bespoke <BookingForm/> via `formSlot`; this page uses
 * HeroSolidPanel's own LeadForm with the Spanish `booking` variant instead.
 * Same fields and the same variant key (so /api/lead validates it
 * identically) — but every label, validation message, consent line and
 * button routes through the localized LeadForm rather than through a
 * component whose copy is hardcoded English. Localizing BookingForm as well
 * would be the tidier long-term answer and is noted in the report's
 * "Remaining work"; this keeps the Spanish conversion path fully Spanish
 * today without touching the English booking page.
 *
 * The page says plainly, in the subhead, the footer note and the "Cómo
 * funciona" steps, that submitting sends a request and the office calls
 * back. The English page was deliberately reworded off "Book" for that
 * reason (ATS-E3 3.4) and the Spanish must not undo it.
 */
export default function EsBookingPage() {
  return (
    <>
      <JsonLd
        data={buildWebPage({
          path: route.path,
          name: route.title,
          description: route.description,
          inLanguage: HREFLANG.es,
        })}
      />
      <HeroSolidPanel
        locale="es"
        breadcrumbs={[
          { name: "Inicio", path: "/es" },
          { name: esBookingPage.breadcrumb, path: route.path },
        ]}
        eyebrow={esBookingPage.hero.eyebrow}
        background={{
          src: "/figma-exports/phone-mockup.png",
          alt: "Paciente llamando a Align the Spine para solicitar una cita",
        }}
        title={esBookingPage.hero.h1}
        subhead={esBookingPage.hero.subhead}
        callPill={{ eyebrow: "Hablemos hoy", phone: `Llamar al ${siteConfig.business.phone}` }}
        form={{
          heading: esBookingPage.hero.formHeading,
          submitLabel: esLeadFormVariants.booking.submitLabel,
          variant: esLeadFormVariants.booking.variant,
          fields: esLeadFormVariants.booking.fields,
          footerNote: esBookingPage.hero.footerNote,
        }}
      />
      <HeroReviewsCarousel testimonials={heroReviewsCarousel} locale="es" quoteLang="en-US" />

      <Section spacing="lg">
        <Container className="flex flex-col gap-10">
          <SectionHeading eyebrow={esBookingPage.whatHappensNext.eyebrow}>
            {esBookingPage.whatHappensNext.heading}
          </SectionHeading>
          <ol className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {esBookingPage.whatHappensNext.steps.map((step, index) => (
              <li key={step.title} className="flex flex-col gap-3">
                <span
                  aria-hidden="true"
                  className="flex size-10 items-center justify-center rounded-full bg-teal-500 font-sans text-button text-white"
                >
                  {index + 1}
                </span>
                <h3 className="font-display text-card-title text-navy-800">{step.title}</h3>
                <p className="font-sans text-card-body text-ink-900">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <LocationIntro locale="es" />
      <LocationFooter locale="es" />

      <Section spacing="lg" className="container">
        <div className="flex flex-col gap-10">
          <SectionHeading eyebrow={esBookingPage.faqEyebrow} className="items-center text-center">
            {esBookingPage.faqHeading}
          </SectionHeading>
          <FaqAccordion items={esBookingPage.faq} />
          <FaqJsonLd items={esBookingPage.faq} />
        </div>
      </Section>
    </>
  );
}
