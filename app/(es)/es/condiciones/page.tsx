import type { Metadata } from "next";

import { LocationFooter } from "@/components/layout/location-footer";
import { LocationIntro } from "@/components/layout/location-intro";
import { ContactSection } from "@/components/sections/contact-section";
import { HeroSolidPanel } from "@/components/sections/hero-solid-panel";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { ServiceCardItem } from "@/components/ui/service-card";
import { ServiceGrid } from "@/components/ui/service-grid";
import { esConditions } from "@/content/es/conditions";
import { getEsRoute } from "@/content/es/seo";
import { HREFLANG } from "@/content/i18n";
import { siteConfig } from "@/content/site";
import { buildWebPage } from "@/lib/schema";
import { buildEsRouteMetadata } from "@/lib/seo/metadata";

const route = getEsRoute("/es/condiciones");

export const metadata: Metadata = buildEsRouteMetadata(route);

/** /es/condiciones — Spanish counterpart of the /conditions hub.
 *
 * Built entirely from each Spanish condition page's own hero content, the
 * same way content/conditions-hub.ts builds the English hub: no new medical
 * claims, no thin keyword list, just a real directory of the seven Spanish
 * condition pages.
 *
 * That directory matters more in Spanish than it looks. The Condiciones
 * mega-menu is client-rendered on hover and absent from raw HTML (true of
 * the English nav too — see components/layout/navbar-dropdown.tsx), so
 * without this hub the seven Spanish condition pages would have no
 * crawlable path into them at all.
 *
 * Every card links directly to a `status: "draft"` page, exactly as the
 * English hub does. That's the established, deliberate decision documented
 * in content/conditions-hub.ts: these are real, finished pages awaiting
 * clinical review, not broken ones, and their own `draft` status still
 * forces noindex on each target — so linking here can't make an unreviewed
 * page rank.
 *
 * This hub is itself `published`, matching the English /conditions hub. A
 * directory page introduces no medical claims of its own. It also has to
 * be: the English hub is indexable and carries an hreflang alternate
 * pointing here, and an indexable page must not annotate a noindex URL as
 * its language alternate (content/i18n.test.ts enforces that both halves of
 * a pair share publication status).
 */
const cards: ServiceCardItem[] = esConditions.map((condition) => ({
  slug: condition.slug,
  name: condition.hero.h1,
  duration: "",
  summary: condition.hero.subhead,
  image: condition.hero.backgroundImage,
  href: condition.path,
  ctaLabel: "Más información",
}));

export default function EsConditionsHubPage() {
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
          { name: "Condiciones", path: route.path },
        ]}
        background={{
          src: "/figma-exports/dr-abe-neck.png",
          alt: "El Dr. Abe Nasser evaluando el cuello de un paciente",
        }}
        eyebrow="Condiciones que evaluamos y tratamos"
        title="Condiciones que Tratamos en Deerfield Beach, FL"
        subhead="El Dr. Abe Nasser evalúa y trata distintas condiciones quiroprácticas en Deerfield Beach, desde lesiones por accidente de auto hasta el dolor de espalda y de cuello cotidiano."
        callPill={{ eyebrow: "Hablemos hoy", phone: `Llamar al ${siteConfig.business.phone}` }}
      />

      <Section>
        <Container className="flex flex-col gap-10">
          <div className="max-w-3xl">
            <SectionHeading as="h2" className="text-left">
              Condiciones que tratamos
            </SectionHeading>
            <p className="mt-4 font-sans text-body-lg text-ink-900">
              Explore las condiciones que el Dr. Abe Nasser evalúa y trata en Align the Spine
              Chiropractic, en Deerfield Beach. Cada página explica qué se evalúa, qué esperar en la
              visita y qué cambia cuando hay un accidente de auto de por medio.
            </p>
          </div>
          <ServiceGrid items={cards} locale="es" />
        </Container>
      </Section>

      <LocationIntro locale="es" />
      <LocationFooter locale="es" />
      <ContactSection locale="es" />
    </>
  );
}
