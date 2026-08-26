import type { Metadata } from "next";
import Link from "next/link";

import { AccidentBanner } from "@/components/sections/accident-banner";
import { AccidentInjuries } from "@/components/sections/accident-injuries";
import { ComparisonTable } from "@/components/sections/comparison-table";
import { ConditionFaq } from "@/components/sections/condition-faq";
import { DoctorProfile } from "@/components/sections/doctor-profile";
import { HeroReviewsCarousel } from "@/components/sections/hero-reviews-carousel";
import { HeroSolidPanel } from "@/components/sections/hero-solid-panel";
import { PatientReviews } from "@/components/sections/patient-reviews";
import { RelatedConditions } from "@/components/sections/related-conditions";
import { ServiceIntro } from "@/components/sections/service-intro";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  esAutoAccidentAccident,
  esAutoAccidentCoordinationQuote,
} from "@/content/es/auto-accident";
import { esAccidentInjuries, esHomeSections } from "@/content/es/home";
import { esLeadFormVariants } from "@/content/es/lead-forms";
import { esDoctorProfileContent } from "@/content/es/pages";
import { buildEsRelatedLinks } from "@/content/es/related-links";
import { getEsRoute } from "@/content/es/seo";
import {
  esAdjustmentsFaq,
  esAdjustmentsHero,
  esAdjustmentsHowItWorks,
  esAdjustmentsRelatedConfig,
  esServicePageCopy,
} from "@/content/es/services-pages";
import { HREFLANG } from "@/content/i18n";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel, homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";
import { buildWebPage } from "@/lib/schema";
import { buildEsRouteMetadata } from "@/lib/seo/metadata";

const route = getEsRoute("/es/servicios/ajustes-quiropracticos");

export const metadata: Metadata = buildEsRouteMetadata(route);

const breadcrumbs = [
  { name: "Inicio", path: "/es" },
  { name: "Servicios", path: "/es/servicios" },
  { name: "Ajustes quiroprácticos", path: route.path },
];

/** /es/servicios/ajustes-quiropracticos — Spanish counterpart of
 * /services/chiropractic-adjustments, section-for-section.
 *
 * Two deliberate differences from the English page:
 *
 *  1. No per-service `Service` JSON-LD. The English page emits one, `@id`'d
 *     to /services#adjustments. Emitting a second entity for the same
 *     service under an /es id would describe one service twice. The
 *     WebPage entity below declares the language and points `about` at the
 *     single shared MedicalBusiness instead.
 *  2. The prose links to Spanish destinations only. Where the English body
 *     links to condition pages that have no Spanish version yet, the
 *     Spanish sentence keeps the clinical point and drops the link rather
 *     than sending a Spanish reader into English mid-paragraph.
 *
 * `status: "draft"` in content/es/seo.ts, mirroring the English original —
 * noindex and out of the sitemap until a clinician signs off on the
 * medical content, but reachable from the Spanish nav.
 */
export default function EsAdjustmentsPage() {
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
        breadcrumbs={breadcrumbs}
        background={esAdjustmentsHero.backgroundImage}
        eyebrow={esAdjustmentsHero.eyebrowChip}
        title={esAdjustmentsHero.h1}
        subhead={esAdjustmentsHero.subhead}
        callPill={{ eyebrow: "Hablemos hoy", phone: `Llamar al ${siteConfig.business.phone}` }}
        form={{
          heading: "Solicite su evaluación",
          submitLabel: esLeadFormVariants.heroEval.submitLabel,
          variant: esLeadFormVariants.heroEval.variant,
          fields: esLeadFormVariants.heroEval.fields,
          footerNote:
            "Un solo consultorio verificado en Deerfield Beach; llame para confirmar si corresponde una visita al consultorio o una visita a domicilio relacionada con un accidente.",
        }}
      />

      <HeroReviewsCarousel testimonials={heroReviewsCarousel} locale="es" />

      <ServiceIntro
        eyebrow="Entender el tratamiento"
        heading="Devolver el movimiento que se llevó la colisión"
        divider
        cta={{ href: "#como-funciona", label: "Entender los ajustes" }}
        image={{
          src: "https://align-the-spine.b-cdn.net/images/chiro-help.png",
          alt: "El Dr. Abe realizando un ajuste quiropráctico",
        }}
      >
        Un ajuste quiropráctico aplica presión manual precisa para devolver el movimiento a una
        articulación que lo perdió tras el impacto — lo que llamamos una fijación. Cuando una
        vértebra deja de moverse bien después de una colisión, los músculos y nervios de alrededor
        compensan, y eso suele ser el verdadero origen del dolor en el latigazo cervical, el dolor
        de cuello, el dolor de espalda y la ciática después de un{" "}
        <Link href="/es/quiropractico-accidentes-de-auto" className="underline">
          accidente
        </Link>
        . Un ajuste no solo alivia la molestia: restaura la mecánica para que su cuerpo deje de
        trabajar esquivando la lesión.
      </ServiceIntro>

      <div id="como-funciona" className="scroll-mt-[120px]">
        <Section>
          <Container className="flex flex-col gap-14">
            <SectionHeading eyebrow="Cómo funciona">
              De la colisión a sentirse usted mismo otra vez
            </SectionHeading>
            <div className="grid grid-cols-1 gap-10 border-t border-mute-300 pt-10 sm:grid-cols-3">
              {esAdjustmentsHowItWorks.map((step) => (
                <div key={step.title} className="group flex flex-col gap-3">
                  <h3 className="font-display text-3xl text-navy-900 transition-colors duration-200 group-hover:text-teal-500">
                    {step.title}
                  </h3>
                  <hr className="border-t border-navy-900 transition-colors duration-200 group-hover:border-teal-500" />
                  <p className="font-sans text-body-lg text-ink-500">{step.description}</p>
                  {step.learnMoreHref && (
                    <Link
                      href={step.learnMoreHref}
                      className="inline-flex w-fit items-center gap-2 pt-4 font-sans text-stat-label uppercase tracking-[1.25px] text-navy-900 underline decoration-transparent underline-offset-4 transition-colors duration-300 hover:text-navy-700 hover:decoration-navy-700 group-hover:text-teal-500 group-hover:decoration-teal-500"
                    >
                      Más información
                      <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </Container>
        </Section>
      </div>

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

      <ComparisonTable locale="es" />

      <ServiceIntro
        eyebrow={esServicePageCopy.isItRightHeading}
        heading="Apropiado para la mayoría de las lesiones por colisión — no para todas"
        divider
        image={{
          src: "/figma-exports/adjustments-right-for-you.png",
          alt: "El Dr. Abe ajustando el cuello de un paciente en el consultorio",
        }}
      >
        Los ajustes son apropiados para la mayoría de las lesiones mecánicas de una colisión, que es
        lo que más vemos. No son el primer paso adecuado ante una fractura, una luxación o un
        latigazo cervical de grado IV, que requieren estudios de imagen urgentes antes de cualquier
        tratamiento manual. Para una hernia de disco severa con compresión nerviosa significativa,
        la{" "}
        <Link href="/es/servicios/descompresion-espinal" className="underline">
          descompresión espinal
        </Link>{" "}
        puede ser un mejor punto de partida, a veces combinada con el ajuste una vez aliviada la
        presión aguda. Las reglas del PIP de Florida pueden incluir requisitos de tiempo para
        iniciar la atención; la cobertura y la elegibilidad dependen de la póliza y de las
        circunstancias. Una evaluación no garantiza{" "}
        <Link href="/es/quiropractico-accidentes-de-auto" className="underline">
          los beneficios del PIP
        </Link>
        .
      </ServiceIntro>

      <DoctorProfile
        variant="short"
        content={esDoctorProfileContent}
        doctorLink={{ href: "/es/dr-abe-nasser", label: "Conozca al Dr. Abe" }}
      />

      <AccidentBanner
        accident={esAutoAccidentAccident}
        locale="es"
        eyebrow="¿Fue por un accidente?"
      />

      <PatientReviews
        featured={homeFeaturedTestimonial}
        reviews={homeReviews.slice(1, 4)}
        variant="light"
        locale="es"
        reviewsLink={{ href: "/es/resenas", label: "Ver todas las reseñas" }}
      />

      <Section spacing="sm" className="bg-[#E4F9F4]">
        <p className="container text-center font-sans text-body-lg text-navy-900">
          {esAutoAccidentCoordinationQuote}
        </p>
      </Section>

      <Section spacing="none" className="bg-navy-900">
        <Container className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:py-14">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-h2 font-normal text-white">
              {esServicePageCopy.readyHeading}
            </h2>
            <p className="w-[65%] font-sans text-body-lg text-mute-300">
              {esServicePageCopy.readyBody}
            </p>
          </div>
          <Button variant="teal" href="/es/solicitar-cita" className="w-fit shrink-0 rounded-none!">
            {esServicePageCopy.readyCta}
          </Button>
        </Container>
      </Section>

      <RelatedConditions
        heading={esServicePageCopy.relatedHeading}
        items={buildEsRelatedLinks({ currentPath: route.path, ...esAdjustmentsRelatedConfig })}
      />

      <ConditionFaq faq={esAdjustmentsFaq} locale="es" />
    </>
  );
}
