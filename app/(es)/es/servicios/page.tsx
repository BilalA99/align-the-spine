import type { Metadata } from "next";

import { LocationFooter } from "@/components/layout/location-footer";
import { LocationIntro } from "@/components/layout/location-intro";
import { ContactSection } from "@/components/sections/contact-section";
import { DoctorProfile } from "@/components/sections/doctor-profile";
import { HeroReviewsCarousel } from "@/components/sections/hero-reviews-carousel";
import { HeroSolidPanel } from "@/components/sections/hero-solid-panel";
import { PatientReviews } from "@/components/sections/patient-reviews";
import { ServiceCatalog } from "@/components/sections/service-catalog";
import { JsonLd } from "@/components/seo/json-ld";
import { esLeadFormVariants } from "@/content/es/lead-forms";
import { esDoctorProfileContent, esServicesGrid, esServicesPage } from "@/content/es/pages";
import { getEsRoute } from "@/content/es/seo";
import { HREFLANG } from "@/content/i18n";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel, homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";
import { buildWebPage } from "@/lib/schema";
import { buildEsRouteMetadata } from "@/lib/seo/metadata";

const route = getEsRoute("/es/servicios");

export const metadata: Metadata = buildEsRouteMetadata(route);

/** /es/servicios — Spanish counterpart of /services.
 *
 * One difference from the English page beyond language: no per-service
 * `Service` JSON-LD. The English page emits one Service entity per card,
 * each `@id`'d to a /services#slug anchor. Emitting a second set pointed at
 * /es/servicios#slug would describe the same six services twice, as
 * separate entities, from one practice — schema noise rather than schema
 * coverage. The Spanish page instead emits a WebPage entity that declares
 * its language and points `about` at the single shared MedicalBusiness, so
 * the graph stays one connected practice across both languages.
 */
export default function EsServicesPage() {
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
          { name: esServicesPage.breadcrumb, path: route.path },
        ]}
        background={{
          src: "/figma-exports/dr-abe-neck.png",
          alt: "El Dr. Abe Nasser evaluando el cuello de un paciente",
        }}
        eyebrow={esServicesPage.hero.eyebrow}
        title={
          <>
            {esServicesPage.hero.titleLines[0]}
            <br />
            {esServicesPage.hero.titleLines[1]}
          </>
        }
        subhead={esServicesPage.hero.subhead}
        bilingualNote={esServicesPage.hero.bilingualNote}
        callPill={{
          eyebrow: esServicesPage.hero.callPillEyebrow,
          phone: `Llamar al ${siteConfig.business.phone}`,
        }}
        form={{
          heading: esServicesPage.hero.form.heading,
          submitLabel: esLeadFormVariants.heroEval.submitLabel,
          variant: esLeadFormVariants.heroEval.variant,
          fields: esLeadFormVariants.heroEval.fields,
          footerNote: esServicesPage.hero.form.footerNote,
        }}
      />
      <HeroReviewsCarousel testimonials={heroReviewsCarousel} locale="es" />
      <ServiceCatalog
        items={esServicesGrid}
        eyebrow={esServicesPage.catalog.eyebrow}
        heading={esServicesPage.catalog.heading}
        locale="es"
        // /conditions is English-only and its child pages are draft — a
        // Spanish reader following this link would land in English.
        conditionsLink={null}
      />
      <DoctorProfile
        variant="short"
        content={esDoctorProfileContent}
        doctorLink={{ href: "/es/dr-abe-nasser", label: "Conozca al Dr. Abe" }}
      />
      <PatientReviews
        featured={homeFeaturedTestimonial}
        reviews={homeReviews.slice(1, 4)}
        locale="es"
        reviewsLink={{ href: "/es/resenas", label: "Ver todas las reseñas" }}
      />
      <LocationIntro locale="es" />
      <LocationFooter locale="es" />
      <ContactSection locale="es" />
    </>
  );
}
