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
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { esAutoAccidentAccident } from "@/content/es/auto-accident";
import { esLeadFormVariants } from "@/content/es/lead-forms";
import { esDoctorProfileContent } from "@/content/es/pages";
import { buildEsRelatedLinks } from "@/content/es/related-links";
import { getEsRoute } from "@/content/es/seo";
import {
  esMassageConditions,
  esMassageFaq,
  esMassageHero,
  esMassageRelatedConfig,
  esMassageTechniques,
  esServicePageCopy,
} from "@/content/es/services-pages";
import { HREFLANG } from "@/content/i18n";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel, homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";
import { buildWebPage } from "@/lib/schema";
import { buildEsRouteMetadata } from "@/lib/seo/metadata";

const route = getEsRoute("/es/servicios/terapia-de-tejidos-blandos");

export const metadata: Metadata = buildEsRouteMetadata(route);

const breadcrumbs = [
  { name: "Inicio", path: "/es" },
  { name: "Servicios", path: "/es/servicios" },
  { name: "Terapia de tejidos blandos", path: route.path },
];

/** /es/servicios/terapia-de-tejidos-blandos — Spanish counterpart of
 * /services/soft-tissue-therapy. `status: "draft"`, mirroring the English
 * original: it carries clinical guidance about technique selection that
 * hasn't had a clinician's sign-off. */
export default function EsSoftTissuePage() {
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
        background={esMassageHero.backgroundImage}
        eyebrow={esMassageHero.eyebrowChip}
        title={esMassageHero.h1}
        subhead={esMassageHero.subhead}
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
        heading="La técnica se elige según el tejido, no por rutina"
        divider
        cta={{ href: "#tecnicas", label: "Ver las técnicas" }}
        image={{
          src: "/figma-exports/massage-soft-tissue-hero.png",
          alt: "Sala de tratamiento de masaje y terapia de tejidos blandos",
        }}
      >
        Un masaje común busca relajación general. Esto es distinto: el trabajo se dirige al tejido
        concreto que afectó la colisión — tejido cicatricial, rigidez de la fascia o contusión
        profunda — y la técnica se elige a partir de su evaluación. Con frecuencia acompaña a un{" "}
        <Link href="/es/servicios/ajustes-quiropracticos" className="underline">
          ajuste quiropráctico
        </Link>{" "}
        cuando la articulación y el músculo están implicados a la vez. Si su caso viene de un{" "}
        <Link href="/es/quiropractico-accidentes-de-auto" className="underline">
          accidente de auto
        </Link>
        , cada sesión queda documentada para su reclamo.
      </ServiceIntro>

      <div id="tecnicas" className="scroll-mt-[120px]">
        <Section>
          <Container className="flex flex-col gap-14">
            <SectionHeading eyebrow="Cómo trabajamos" className="items-center text-center">
              {esServicePageCopy.techniquesHeading}
            </SectionHeading>
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
              {esMassageTechniques.map((technique) => (
                <div key={technique.title} className="group flex flex-col gap-4">
                  <div className="relative aspect-[507/360] w-full overflow-hidden">
                    <Image
                      src={technique.image.src}
                      alt={technique.image.alt}
                      fill
                      sizes="(min-width: 640px) 33vw, 100vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-display text-card-title text-navy-800">{technique.title}</h3>
                  <hr className="border-t border-navy-900" />
                  <p className="font-sans text-card-body text-ink-900">{technique.description}</p>
                  <p className="font-sans text-stat-label uppercase tracking-[1.25px] text-mute-400">
                    {esServicePageCopy.bestForLabel}: {technique.bestFor}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      </div>

      <Section>
        <Container className="flex flex-col gap-14">
          <SectionHeading eyebrow="Lo que tratamos" className="items-center text-center">
            {esServicePageCopy.conditionsHeading}
          </SectionHeading>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {esMassageConditions.map((condition) => (
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
        items={buildEsRelatedLinks({ currentPath: route.path, ...esMassageRelatedConfig })}
      />

      <ConditionFaq faq={esMassageFaq} locale="es" />
    </>
  );
}
