import type { Metadata } from "next";
import Link from "next/link";

import { ConditionFaq } from "@/components/sections/condition-faq";
import { DoctorProfile } from "@/components/sections/doctor-profile";
import { HeroSolidPanel } from "@/components/sections/hero-solid-panel";
import { RelatedConditions } from "@/components/sections/related-conditions";
import { ServiceIntro } from "@/components/sections/service-intro";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { esLeadFormVariants } from "@/content/es/lead-forms";
import { esDoctorProfileContent } from "@/content/es/pages";
import { buildEsRelatedLinks } from "@/content/es/related-links";
import { getEsRoute } from "@/content/es/seo";
import {
  esCuppingFaq,
  esCuppingHero,
  esCuppingRelatedConfig,
  esServicePageCopy,
} from "@/content/es/services-pages";
import { HREFLANG } from "@/content/i18n";
import { siteConfig } from "@/content/site";
import { buildWebPage } from "@/lib/schema";
import { buildEsRouteMetadata } from "@/lib/seo/metadata";

const route = getEsRoute("/es/servicios/terapia-de-ventosas");

export const metadata: Metadata = buildEsRouteMetadata(route);

const breadcrumbs = [
  { name: "Inicio", path: "/es" },
  { name: "Servicios", path: "/es/servicios" },
  { name: "Terapia de ventosas", path: route.path },
];

/** /es/servicios/terapia-de-ventosas — Spanish counterpart of
 * /services/cupping-therapy.
 *
 * Deliberately the leanest of the four Spanish service pages, exactly as
 * the English one is: cupping is a single technique, not a full treatment
 * category, so this doesn't carry the comparison table, accident banner or
 * reviews band the other three do. Copy stays close to the already-verified
 * summary in content/es/home.ts's `esServices` rather than introducing new
 * clinical claims.
 *
 * `status: "draft"` in content/es/seo.ts, mirroring the English original. */
export default function EsCuppingTherapyPage() {
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
        background={esCuppingHero.backgroundImage}
        eyebrow={esCuppingHero.eyebrowChip}
        title={esCuppingHero.h1}
        subhead={esCuppingHero.subhead}
        callPill={{ eyebrow: "Hablemos hoy", phone: `Llamar al ${siteConfig.business.phone}` }}
        form={{
          heading: "Solicite su evaluación",
          submitLabel: esLeadFormVariants.heroEval.submitLabel,
          variant: esLeadFormVariants.heroEval.variant,
          fields: esLeadFormVariants.heroEval.fields,
        }}
      />

      <ServiceIntro
        eyebrow="Entender el tratamiento"
        heading="Succión localizada para zonas concretas de tensión"
        divider
        image={{
          src: "/figma-exports/cupping-drabe.png",
          alt: "Sesión de terapia de ventosas",
        }}
      >
        La terapia de ventosas coloca copas sobre la piel para aplicar succión en zonas
        seleccionadas de tensión muscular. Puede incluirse junto con otro trabajo de{" "}
        <Link href="/es/servicios/terapia-de-tejidos-blandos" className="underline">
          tejidos blandos
        </Link>{" "}
        cuando corresponde para molestias de cuello, espalda u otras zonas. El Dr. Abe decide si
        encaja en su caso a partir de la evaluación, no de una rutina fija — y le dirá cuándo otra
        técnica es un mejor punto de partida. Si su caso viene de un{" "}
        <Link href="/es/quiropractico-accidentes-de-auto" className="underline">
          accidente de auto
        </Link>
        , cada sesión queda documentada para su reclamo.
      </ServiceIntro>

      <DoctorProfile
        variant="short"
        content={esDoctorProfileContent}
        doctorLink={{ href: "/es/dr-abe-nasser", label: "Conozca al Dr. Abe" }}
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
        items={buildEsRelatedLinks({ currentPath: route.path, ...esCuppingRelatedConfig })}
      />

      <ConditionFaq faq={esCuppingFaq} locale="es" />
    </>
  );
}
