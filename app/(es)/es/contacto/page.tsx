import type { Metadata } from "next";

import { LocationFooter } from "@/components/layout/location-footer";
import { LocationIntro } from "@/components/layout/location-intro";
import { Hero } from "@/components/sections/hero";
import { HeroReviewsCarousel } from "@/components/sections/hero-reviews-carousel";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { JsonLd } from "@/components/seo/json-ld";
import { PracticeJsonLd } from "@/components/seo/practice-json-ld";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { esLeadFormVariants } from "@/content/es/lead-forms";
import { esContactPage } from "@/content/es/pages";
import { getEsRoute } from "@/content/es/seo";
import { HREFLANG } from "@/content/i18n";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel } from "@/content/testimonials";
import { buildWebPage } from "@/lib/schema";
import { buildEsRouteMetadata } from "@/lib/seo/metadata";

const route = getEsRoute("/es/contacto");

export const metadata: Metadata = buildEsRouteMetadata(route);

/** /es/contacto — Spanish counterpart of /contact-us.
 *
 * Emits PracticeJsonLd (Organization + WebSite + MedicalBusiness) for the
 * same reason the English contact page does: this is the page whose visible
 * content is the practice's name, address and phone, so it's where that
 * structured data actually matches what a reader sees. The entities carry
 * the same `@id`s as the English page's — one business, described from two
 * pages, not two businesses.
 *
 * NAP is rendered from siteConfig, untranslated and unreformatted, exactly
 * as on the English page. The phone number in particular keeps its
 * `siteConfig.business.phoneHref` tel: link so click-to-call behaves identically.
 */
export default function EsContactPage() {
  return (
    <>
      <PracticeJsonLd />
      <JsonLd
        data={buildWebPage({
          path: route.path,
          name: route.title,
          description: route.description,
          inLanguage: HREFLANG.es,
        })}
      />
      <div id="contact-hero-form">
        <Hero
          locale="es"
          breadcrumbs={[
            { name: "Inicio", path: "/es" },
            { name: esContactPage.breadcrumb, path: route.path },
          ]}
          variant="condition"
          background={{
            src: "/figma-exports/interior-reception.png",
            alt: "Área de recepción de Align the Spine en Deerfield Beach",
          }}
          eyebrow={esContactPage.hero.eyebrow}
          title={esContactPage.hero.h1}
          subhead={esContactPage.hero.subhead}
          callPill={{
            eyebrow: "Hablemos hoy",
            phone: `Llamar al ${siteConfig.business.phone}`,
          }}
          form={{
            heading: esContactPage.hero.formHeading,
            submitLabel: esLeadFormVariants.contactUs.submitLabel,
            variant: esLeadFormVariants.contactUs.variant,
            fields: esLeadFormVariants.contactUs.fields,
          }}
        />
      </div>

      <HeroReviewsCarousel testimonials={heroReviewsCarousel} locale="es" quoteLang="en-US" />

      <LocationIntro locale="es" sendHref="#contact-hero-form" />
      <LocationFooter locale="es" />

      <Section spacing="lg" className="container">
        <div className="flex flex-col gap-10">
          <SectionHeading eyebrow={esContactPage.faqEyebrow} className="items-center text-center">
            {esContactPage.faqHeading}
          </SectionHeading>
          <FaqAccordion items={esContactPage.faq} />
          <FaqJsonLd items={esContactPage.faq} />
        </div>
      </Section>
    </>
  );
}
