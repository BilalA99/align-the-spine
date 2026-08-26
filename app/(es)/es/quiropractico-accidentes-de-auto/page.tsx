import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { AccidentBanner } from "@/components/sections/accident-banner";
import { AccidentInjuries } from "@/components/sections/accident-injuries";
import { ComparisonTable } from "@/components/sections/comparison-table";
import { DoctorProfile } from "@/components/sections/doctor-profile";
import { HeroReviewsCarousel } from "@/components/sections/hero-reviews-carousel";
import { HeroSolidPanel } from "@/components/sections/hero-solid-panel";
import { HowWeHelpSteps } from "@/components/sections/how-we-help-steps";
import { PatientReviews } from "@/components/sections/patient-reviews";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  esAutoAccidentAccident,
  esAutoAccidentAnswers,
  esAutoAccidentCoordinationQuote,
  esAutoAccidentCtaBands,
  esAutoAccidentFaq,
  esAutoAccidentFaqHeading,
  esAutoAccidentHero,
  esAutoAccidentRedFlags,
  esAutoAccidentSteps,
  esAutoAccidentStepsHeading,
  esPipStat,
} from "@/content/es/auto-accident";
import { esAccidentInjuries, esHomeSections } from "@/content/es/home";
import { esLeadFormVariants } from "@/content/es/lead-forms";
import { esDoctorProfileContent } from "@/content/es/pages";
import { getEsRoute } from "@/content/es/seo";
import { HREFLANG } from "@/content/i18n";
import { siteConfig } from "@/content/site";
import { heroReviewsCarousel, homeFeaturedTestimonial, homeReviews } from "@/content/testimonials";
import { isVerified } from "@/content/verified-value";
import { buildWebPage } from "@/lib/schema";
import { buildEsRouteMetadata } from "@/lib/seo/metadata";

const FaqAccordion = dynamic(() =>
  import("@/components/ui/faq-accordion").then((m) => m.FaqAccordion),
);

const route = getEsRoute("/es/quiropractico-accidentes-de-auto");

const faqItems = esAutoAccidentFaq.map((item) => ({ question: item.q, answer: item.a }));

// Same treatment as the English page: the hero subhead links its "seguro PIP"
// phrase down to the calculator. Split on the exact phrase declared in the
// content module so the two can't drift.
const [subheadBeforePip, subheadAfterPip] = esAutoAccidentHero.subhead.split(
  esAutoAccidentHero.pipLinkPhrase,
);

const pipStat = isVerified(esPipStat) ? esPipStat.value : undefined;

export const metadata: Metadata = buildEsRouteMetadata(route);

/** /es/quiropractico-accidentes-de-auto — the Spanish site's primary
 * acquisition page, and the Spanish counterpart of
 * /car-accident-chiropractor.
 *
 * The composition mirrors the English accident page, with two additions
 * that exist only here:
 *
 *  1. An answer-first Q&A block (`esAutoAccidentAnswers`) between the
 *     comparison table and the PIP banner. Each block is a heading, a
 *     direct answer, and its qualification — written so a single block is
 *     useful pulled out on its own, which is what makes the page a
 *     candidate to be retrieved for the adjacent questions in the cluster
 *     ("cuándo ver a un quiropráctico", "qué pasa en la primera visita",
 *     "cuánto cubre el PIP") rather than only for the head term.
 *  2. A visible emergency/red-flag block. The English page carries its
 *     red-flag guidance inside the condition template; this page states it
 *     directly, because a page that invites accident victims to book an
 *     appointment has to say plainly when an appointment is the wrong call.
 *
 * Neither addition changes the English page. Both are covered in the
 * report's §AEO/GEO implementation.
 */
export default function EsAutoAccidentPage() {
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
          { name: "Accidentes de Auto", path: route.path },
        ]}
        background={{
          src: "/figma-exports/interior-corridor.png",
          alt: "Pasillo de recepción de Align the Spine en Deerfield Beach",
        }}
        eyebrow={esAutoAccidentHero.eyebrowChip}
        title={
          <>
            {esAutoAccidentHero.titleLines[0]}
            <br />
            {esAutoAccidentHero.titleLines[1]}
          </>
        }
        subhead={
          <>
            {subheadBeforePip}
            <a href="#pip-calculator" className="underline">
              {esAutoAccidentHero.pipLinkPhrase}
            </a>
            {subheadAfterPip}
          </>
        }
        callPill={{
          eyebrow: esAutoAccidentHero.callPillEyebrow,
          phone: `Llamar al ${siteConfig.business.phone}`,
        }}
        bilingualNote={esAutoAccidentHero.bilingualNote}
        stat={pipStat}
        form={{
          heading: esAutoAccidentHero.form.heading,
          submitLabel: esLeadFormVariants.accidentEval.submitLabel,
          variant: esLeadFormVariants.accidentEval.variant,
          fields: esLeadFormVariants.accidentEval.fields,
          footerNote: esAutoAccidentHero.form.footerNote,
        }}
      />

      <HeroReviewsCarousel testimonials={heroReviewsCarousel} locale="es" quoteLang="en-US" />

      <ComparisonTable variant="auto-accident" locale="es" />

      {/* Answer-first blocks. Plain <h2>/<h3> + prose, no accordion: every
       * answer stays in the rendered HTML and visible on load, so nothing
       * here depends on hydration or on a visitor opening a panel. */}
      <Section spacing="lg" className="container">
        <div className="flex flex-col gap-10">
          <SectionHeading eyebrow="Después de un accidente" className="max-w-3xl">
            Lo que la gente nos pregunta después de un choque
          </SectionHeading>
          <div className="flex flex-col gap-10 lg:gap-12">
            {esAutoAccidentAnswers.map((block) => (
              <article key={block.heading} className="flex max-w-3xl flex-col gap-3">
                <h3 className="font-display text-h2 font-normal text-navy-900">{block.heading}</h3>
                <p className="font-sans text-body-lg font-medium text-navy-900">{block.answer}</p>
                <p className="font-sans text-body-lg text-ink-500">{block.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </Section>

      {/* Emergency guidance, above the booking-oriented sections rather than
       * below them — it has to be seen before the CTA, not after it. */}
      <Section spacing="sm" className="bg-[#FDF3F3]">
        <Container className="flex max-w-3xl flex-col gap-4">
          <h2 className="font-display text-h2 font-normal text-navy-900">
            {esAutoAccidentRedFlags.heading}
          </h2>
          <p className="font-sans text-body-lg text-navy-900">{esAutoAccidentRedFlags.intro}</p>
          <ul className="flex list-disc flex-col gap-2 pl-5 font-sans text-body-lg text-ink-500">
            {esAutoAccidentRedFlags.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sans text-small-print text-ink-500">
            {esAutoAccidentRedFlags.footnote}
          </p>
        </Container>
      </Section>

      <div id="pip-calculator">
        <AccidentBanner
          accident={esAutoAccidentAccident}
          locale="es"
          eyebrow="¿Fue por un accidente?"
        />
      </div>

      <Section spacing="lg" className="container">
        <HowWeHelpSteps heading={esAutoAccidentStepsHeading} steps={esAutoAccidentSteps} />
      </Section>

      <Section spacing="sm" className="bg-[#E4F9F4]">
        <p className="container text-center font-sans text-body-lg text-navy-900">
          {esAutoAccidentCoordinationQuote}
        </p>
      </Section>

      <Section spacing="none" className="bg-navy-900">
        <Container className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:py-14">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-h2 font-normal text-white">
              {esAutoAccidentCtaBands.ready.heading}
            </h2>
            <p className="w-[65%] font-sans text-body-lg text-mute-300">
              {esAutoAccidentCtaBands.ready.body}
            </p>
          </div>
          <Button variant="teal" href="/es/solicitar-cita" className="w-fit shrink-0">
            {esAutoAccidentCtaBands.ready.cta}
          </Button>
        </Container>
      </Section>

      <PatientReviews
        featured={homeFeaturedTestimonial}
        reviews={homeReviews.slice(1, 4)}
        variant="light"
        quoteLang="en-US"
        reviewsLink={{ href: "/es/resenas", label: "Ver todas las reseñas" }}
      />

      <DoctorProfile
        variant="short"
        content={esDoctorProfileContent}
        doctorLink={{ href: "/es/dr-abe-nasser", label: "Conozca al Dr. Abe" }}
      />

      <AccidentInjuries
        items={esAccidentInjuries}
        eyebrow={esHomeSections.accidentInjuriesEyebrow}
        heading={esHomeSections.accidentInjuriesHeading}
        locale="es"
        isAccidentPage
      />

      <Section spacing="none" className="bg-navy-900">
        <Container className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:py-14">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-h2 text-white">
              {esAutoAccidentCtaBands.call.heading}
            </h2>
            <p className="w-[65%] font-sans text-body-lg text-mute-300">
              {esAutoAccidentCtaBands.call.body}
            </p>
          </div>
          <Button
            variant="glass"
            href={siteConfig.business.phoneHref}
            eyebrow={esAutoAccidentCtaBands.call.eyebrow}
            className="w-fit shrink-0"
          >
            {esAutoAccidentCtaBands.call.cta}
          </Button>
        </Container>
      </Section>

      <Section spacing="lg" className="container">
        <div className="flex flex-col gap-10">
          <SectionHeading
            eyebrow={esAutoAccidentFaqHeading.eyebrow}
            className="items-center text-center"
          >
            {esAutoAccidentFaqHeading.headingLead} <br /> {esAutoAccidentFaqHeading.headingTail}
          </SectionHeading>
          <FaqAccordion items={faqItems} />
          {/* FAQPage markup describing exactly the FAQs rendered above.
           * Google retired FAQ rich results in May 2026, so this is NOT here
           * to win a SERP enhancement and shouldn't be described as such —
           * it's retained because it accurately describes visible content
           * and costs nothing. See §FAQ in the report. */}
          <FaqJsonLd items={faqItems} />
        </div>
      </Section>
    </>
  );
}
