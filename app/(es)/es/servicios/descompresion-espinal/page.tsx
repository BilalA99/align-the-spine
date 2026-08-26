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
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { esAutoAccidentAccident } from "@/content/es/auto-accident";
import { esLeadFormVariants } from "@/content/es/lead-forms";
import { esDoctorProfileContent } from "@/content/es/pages";
import { buildEsRelatedLinks } from "@/content/es/related-links";
import { getEsRoute } from "@/content/es/seo";
import {
  esDecompressionConditions,
  esDecompressionFaq,
  esDecompressionHero,
  esDecompressionHowItWorks,
  esDecompressionRelatedConfig,
  esServicePageCopy,
} from "@/content/es/services-pages";
import { HREFLANG } from "@/content/i18n";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel, homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";
import { buildWebPage } from "@/lib/schema";
import { buildEsRouteMetadata } from "@/lib/seo/metadata";

const route = getEsRoute("/es/servicios/descompresion-espinal");

export const metadata: Metadata = buildEsRouteMetadata(route);

const breadcrumbs = [
  { name: "Inicio", path: "/es" },
  { name: "Servicios", path: "/es/servicios" },
  { name: "Descompresión espinal", path: route.path },
];

/** /es/servicios/descompresion-espinal — Spanish counterpart of
 * /services/spinal-decompression. `status: "draft"`, mirroring the English
 * original: it carries clinical guidance about disc injuries and PIP claim
 * timing that hasn't had a clinician's sign-off. */
export default function EsSpinalDecompressionPage() {
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
        background={esDecompressionHero.backgroundImage}
        eyebrow={esDecompressionHero.eyebrowChip}
        title={esDecompressionHero.h1}
        subhead={esDecompressionHero.subhead}
        callPill={{ eyebrow: "Hablemos hoy", phone: `Llamar al ${siteConfig.business.phone}` }}
        form={{
          heading: "Solicite su evaluación",
          submitLabel: esLeadFormVariants.heroEval.submitLabel,
          variant: esLeadFormVariants.heroEval.variant,
          fields: esLeadFormVariants.heroEval.fields,
        }}
      />

      <HeroReviewsCarousel testimonials={heroReviewsCarousel} locale="es" />

      <ServiceIntro
        eyebrow="Entender el tratamiento"
        heading="Quitarle presión al disco, no solo al músculo"
        divider
        cta={{ href: "#como-funciona", label: "Entender la descompresión" }}
        image={{
          src: "/figma-exports/spinal-decompression-hero.png",
          alt: "Sala de tratamiento preparada para terapia de descompresión espinal",
        }}
      >
        La descompresión espinal aplica una tracción lenta y sostenida que genera presión negativa
        dentro del disco, en lugar del impulso rápido de un{" "}
        <Link href="/es/servicios/ajustes-quiropracticos" className="underline">
          ajuste quiropráctico
        </Link>
        . Eso la hace apropiada cuando el problema está en el disco mismo y no solo en el tejido
        blando que lo rodea — por ejemplo cuando el dolor se irradia hacia un brazo o una pierna
        después de un{" "}
        <Link href="/es/quiropractico-accidentes-de-auto" className="underline">
          accidente de auto
        </Link>
        . Una evaluación, y la revisión de los estudios de imagen que correspondan, determina si es
        adecuada para su caso.
      </ServiceIntro>

      <div id="como-funciona" className="scroll-mt-[120px]">
        <Section>
          <Container className="flex flex-col gap-14">
            <SectionHeading eyebrow="Cómo funciona">
              Del choque a moverse sin que le duela
            </SectionHeading>
            <div className="grid grid-cols-1 gap-10 border-t border-mute-300 pt-10 sm:grid-cols-3">
              {esDecompressionHowItWorks.map((step) => (
                <div key={step.title} className="group flex flex-col gap-3">
                  <h3 className="font-display text-3xl text-navy-900 transition-colors duration-200 group-hover:text-teal-500">
                    {step.title}
                  </h3>
                  <hr className="border-t border-navy-900 transition-colors duration-200 group-hover:border-teal-500" />
                  <p className="font-sans text-body-lg text-ink-500">{step.description}</p>
                  {step.learnMoreHref && step.learnMoreHref !== route.path && (
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

      <Section>
        <Container className="flex flex-col gap-14">
          <SectionHeading eyebrow="Lo que evaluamos" className="items-center text-center">
            {esServicePageCopy.conditionsHeading}
          </SectionHeading>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {esDecompressionConditions.map((condition) => (
              <div key={condition.name} className="group flex flex-col gap-4">
                <div className="relative aspect-[507/360] w-full overflow-hidden">
                  <Image
                    src={condition.image.src}
                    alt={condition.image.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-display text-card-title text-navy-800">{condition.name}</h3>
                <p className="font-sans text-card-body text-ink-900">{condition.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <ComparisonTable locale="es" />

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
        items={buildEsRelatedLinks({ currentPath: route.path, ...esDecompressionRelatedConfig })}
      />

      <ConditionFaq faq={esDecompressionFaq} locale="es" />
    </>
  );
}
