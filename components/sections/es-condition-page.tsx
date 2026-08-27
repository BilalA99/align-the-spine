import Image from "next/image";

import { AccidentBanner } from "@/components/sections/accident-banner";
import { ComparisonTable } from "@/components/sections/comparison-table";
import { ConditionFaq } from "@/components/sections/condition-faq";
import { DoctorProfile } from "@/components/sections/doctor-profile";
import { HeroReviewsCarousel } from "@/components/sections/hero-reviews-carousel";
import { HeroSolidPanel } from "@/components/sections/hero-solid-panel";
import { PatientReviews } from "@/components/sections/patient-reviews";
import { RelatedConditions } from "@/components/sections/related-conditions";
import { ServiceIntro } from "@/components/sections/service-intro";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { esAutoAccidentAccident } from "@/content/es/auto-accident";
import { esConditionPageCopy, type EsCondition } from "@/content/es/conditions";
import { esLeadFormVariants } from "@/content/es/lead-forms";
import { esDoctorProfileContent } from "@/content/es/pages";
import { buildEsRelatedLinks } from "@/content/es/related-links";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel, homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";

/** Shared template for the seven `/es/condiciones/*` pages.
 *
 * The English condition pages are hand-built per Figma frame, so each
 * composes a slightly different section set. The Spanish pages are new and
 * don't inherit that history: they share this one template, driven by the
 * `EsCondition` objects in content/es/conditions.ts. Optional sections
 * (`list`, `feelsLike`, `howWeTreat`, `warning`) render only when a
 * condition supplies them, which is what lets one component serve pages as
 * different as back pain and concussion.
 *
 * Section order mirrors the English condition pages: hero → reviews strip →
 * understanding → symptom/cause list → what it feels like → how we treat →
 * red flags → comparison → doctor → accident/PIP banner → patient reviews →
 * CTA → related links → FAQ.
 *
 * The red-flag band sits ABOVE the booking CTA on purpose, exactly as on
 * the Spanish accident page: a page that invites someone to book has to say
 * plainly when booking is the wrong call first.
 */
export function EsConditionPage({ condition }: { condition: EsCondition }) {
  const breadcrumbs = [
    { name: "Inicio", path: "/es" },
    { name: "Condiciones", path: "/es/condiciones" },
    { name: condition.breadcrumb, path: condition.path },
  ];

  return (
    <>
      <HeroSolidPanel
        locale="es"
        breadcrumbs={breadcrumbs}
        background={condition.hero.backgroundImage}
        eyebrow={condition.hero.eyebrowChip}
        title={condition.hero.h1}
        subhead={condition.hero.subhead}
        callPill={{
          eyebrow: esConditionPageCopy.callEyebrow,
          phone: `Llamar al ${siteConfig.business.phone}`,
        }}
        form={{
          heading: "Solicite su evaluación",
          submitLabel: esLeadFormVariants.heroEval.submitLabel,
          variant: esLeadFormVariants.heroEval.variant,
          fields: esLeadFormVariants.heroEval.fields,
        }}
      />

      <HeroReviewsCarousel testimonials={heroReviewsCarousel} locale="es" />

      <ServiceIntro
        eyebrow={condition.understanding.eyebrow}
        heading={condition.understanding.heading}
        divider
        image={condition.understanding.image}
      >
        {condition.understanding.paragraphs.map((paragraph, index) => (
          <span key={index} className="mb-4 block last:mb-0">
            {paragraph}
          </span>
        ))}
      </ServiceIntro>

      {condition.list && (
        <Section>
          <Container className="flex flex-col gap-8">
            <SectionHeading as="h2">{condition.list.heading}</SectionHeading>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {condition.list.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 border-t border-mute-300 pt-4 font-sans text-body-lg text-ink-900"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 size-2 shrink-0 rounded-full bg-teal-500"
                  />
                  {item}
                </li>
              ))}
            </ul>
            {condition.list.note && (
              <p className="font-sans text-body-lg text-navy-900">{condition.list.note}</p>
            )}
          </Container>
        </Section>
      )}

      {condition.feelsLike && (
        <Section>
          <Container className="flex flex-col gap-14">
            <SectionHeading eyebrow="Síntomas" className="items-center text-center">
              {condition.feelsLike.heading}
            </SectionHeading>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {condition.feelsLike.items.map((item) => (
                <div key={item.title} className="flex flex-col gap-3">
                  <h3 className="font-display text-card-title text-navy-800">{item.title}</h3>
                  <hr className="border-t border-navy-900" />
                  <p className="font-sans text-card-body text-ink-900">{item.desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {condition.howWeTreat && (
        <Section>
          <Container className="flex flex-col gap-14">
            <SectionHeading eyebrow="Nuestro enfoque" className="items-center text-center">
              {condition.howWeTreat.heading}
            </SectionHeading>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {condition.howWeTreat.items.map((item) => (
                <div key={item.title} className="group flex flex-col gap-4">
                  <div className="relative aspect-[507/360] w-full overflow-hidden">
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-display text-card-title text-navy-800">{item.title}</h3>
                  <p className="font-sans text-card-body text-ink-900">{item.desc}</p>
                  <p className="font-sans text-stat-label uppercase tracking-[1.25px] text-mute-400">
                    {item.meta}
                  </p>
                  <Button variant="ghost" href={item.ctaHref} className="w-fit">
                    {item.ctaLabel}
                  </Button>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {condition.warning && (
        <Section spacing="sm" className="bg-[#FDF3F3]">
          <Container className="flex max-w-3xl flex-col gap-4">
            <Eyebrow>Señales de alarma</Eyebrow>
            <h2 className="font-display text-h2 font-normal text-navy-900">
              {condition.warning.heading}
            </h2>
            <ul className="flex list-disc flex-col gap-2 pl-5 font-sans text-body-lg text-ink-500">
              {condition.warning.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            <p className="font-sans text-small-print text-ink-500">
              Align the Spine no es un servicio de emergencias y no diagnostica por internet. Esta
              página es información general y no reemplaza la evaluación de un profesional de la
              salud.
            </p>
          </Container>
        </Section>
      )}

      <ComparisonTable locale="es" />

      <DoctorProfile
        variant="short"
        content={esDoctorProfileContent}
        doctorLink={{ href: "/es/dr-abe-nasser", label: "Conozca al Dr. Abe" }}
      />

      <AccidentBanner
        accident={esAutoAccidentAccident}
        locale="es"
        eyebrow={esConditionPageCopy.accidentEyebrow}
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
              {esConditionPageCopy.readyHeading}
            </h2>
            <p className="w-[65%] font-sans text-body-lg text-mute-300">
              {esConditionPageCopy.readyBody}
            </p>
          </div>
          <Button variant="teal" href="/es/solicitar-cita" className="w-fit shrink-0">
            {esConditionPageCopy.readyCta}
          </Button>
        </Container>
      </Section>

      <RelatedConditions
        heading={esConditionPageCopy.relatedHeading}
        items={buildEsRelatedLinks({
          currentPath: condition.path,
          ...condition.relatedConfig,
        })}
      />

      <ConditionFaq faq={condition.faq} locale="es" />
    </>
  );
}
