import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { LocationFooter } from "@/components/layout/location-footer";
import { LocationIntro } from "@/components/layout/location-intro";
import { AccidentInjuries } from "@/components/sections/accident-injuries";
import { ContactSection } from "@/components/sections/contact-section";
import { DoctorProfile } from "@/components/sections/doctor-profile";
import { HeroReviewsCarousel } from "@/components/sections/hero-reviews-carousel";
import { HeroSolidPanel } from "@/components/sections/hero-solid-panel";
import { PatientReviews } from "@/components/sections/patient-reviews";
import { ServicesSection } from "@/components/sections/services-section";
import { WhyChoose } from "@/components/sections/why-choose";
import { JsonLd } from "@/components/seo/json-ld";
import { PracticeJsonLd } from "@/components/seo/practice-json-ld";
import {
  esAccidentInjuries,
  esHomeHero,
  esHomeSections,
  esServices,
  esSpineOverviewContent,
  esWhyChooseContent,
} from "@/content/es/home";
import { esLeadFormVariants } from "@/content/es/lead-forms";
import { esDoctorProfileContent } from "@/content/es/pages";
import { getEsRoute } from "@/content/es/seo";
import { HREFLANG } from "@/content/i18n";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel, homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";
import { buildWebPage } from "@/lib/schema";
import { buildEsRouteMetadata } from "@/lib/seo/metadata";

/** Code-split, same as the English home page: not needed until scrolled to. */
const SpineOverview = dynamic(() =>
  import("@/components/sections/spine-overview").then((m) => m.SpineOverview),
);

const route = getEsRoute("/es");

export const metadata: Metadata = buildEsRouteMetadata(route);

/** /es (Spanish home).
 *
 * Section-for-section the same composition as the English home page
 * (app/(en)/page.tsx) — same components, same order, same design. What
 * differs is only the content passed in, which is Spanish source committed
 * under content/es/ and server-rendered, not translated in the browser.
 *
 * Positioning follows the English page deliberately: this is the practice's
 * broad Spanish landing page (everyday pain, mobility, injuries, the
 * doctor, the location), with the accident pathway prominent but not
 * turned into the whole page — the dedicated accident page at
 * /es/quiropractico-accidentes-de-auto carries that intent.
 *
 * PatientReviews/HeroReviewsCarousel render the same real reviews the
 * English page does, in the language each patient wrote them. They are
 * deliberately NOT translated: a rewritten review presented as the
 * patient's own words isn't their review any more. /es/resenas carries a
 * visible note explaining that to Spanish readers.
 */
export default function EsHome() {
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
      <HeroSolidPanel
        locale="es"
        background={{
          src: "/figma-exports/interior-reception.png",
          alt: "Área de recepción de Align the Spine en Deerfield Beach",
        }}
        title={
          <>
            {esHomeHero.titleLines[0]}
            <br />
            {esHomeHero.titleLines[1]}
            <br />
            {esHomeHero.titleLines[2]}
          </>
        }
        badge={esHomeHero.badge}
        bilingualNote={esHomeHero.bilingualNote}
        subhead={esHomeHero.subhead}
        callPill={{
          eyebrow: esHomeHero.callPillEyebrow,
          phone: `Llamar al ${siteConfig.business.phone}`,
        }}
        form={{
          heading: esHomeHero.form.heading,
          submitLabel: esHomeHero.form.submitLabel,
          variant: esLeadFormVariants.heroEval.variant,
          fields: esLeadFormVariants.heroEval.fields,
          footerNote: esHomeHero.form.footerNote,
        }}
      />
      <HeroReviewsCarousel testimonials={heroReviewsCarousel} locale="es" quoteLang="en-US" />
      <ServicesSection
        items={esServices}
        heading={esHomeSections.servicesHeading}
        locale="es"
        // Only the Spanish services hub. /conditions is an English-only hub
        // whose child pages are all draft, so linking it here would push a
        // Spanish reader into English on their first click.
        hubLinks={[{ href: "/es/servicios", label: "Ver todos los servicios" }]}
      />
      <WhyChoose content={esWhyChooseContent} />
      <AccidentInjuries
        items={esAccidentInjuries}
        eyebrow={esHomeSections.accidentInjuriesEyebrow}
        heading={esHomeSections.accidentInjuriesHeading}
        locale="es"
        accidentPageLink={{
          href: "/es/quiropractico-accidentes-de-auto",
          label: "Vea nuestra página completa de accidentes de auto",
        }}
      />
      <SpineOverview content={esSpineOverviewContent} />
      <DoctorProfile
        variant="short"
        content={esDoctorProfileContent}
        doctorLink={{ href: "/es/dr-abe-nasser", label: "Conozca al Dr. Abe" }}
      />
      {/* slice(1, 4), not (0, 3) — see app/(en)/page.tsx: homeFeaturedTestimonial
       * is homeReviews[0], so the grid starts from the next review instead of
       * repeating her as both the featured quote and the first card. */}
      <PatientReviews
        featured={homeFeaturedTestimonial}
        reviews={homeReviews.slice(1, 4)}
        quoteLang="en-US"
        reviewsLink={{ href: "/es/resenas", label: "Ver todas las reseñas" }}
      />
      <LocationIntro locale="es" />
      <LocationFooter locale="es" />
      <ContactSection locale="es" />
    </>
  );
}
