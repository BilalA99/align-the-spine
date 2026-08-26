import type { Metadata } from "next";

import { LocationFooter } from "@/components/layout/location-footer";
import { LocationIntro } from "@/components/layout/location-intro";
import { ContactSection } from "@/components/sections/contact-section";
import { HeroSolidPanel } from "@/components/sections/hero-solid-panel";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceGrid } from "@/components/ui/service-grid";
import {
  conditionsHubCards,
  conditionsHubHero,
  conditionsHubIntro,
} from "@/content/conditions-hub";
import { getRoute } from "@/content/seo";
import { siteConfig } from "@/content/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata(getRoute("/conditions"));

/** ATS-SEO-040: crawlable discovery hub for the 7 /conditions/* routes.
 * Previously the only path into them was the "Conditions" nav mega-menu,
 * which is client-side-rendered (absent from raw HTML until hover/focus)
 * and whose own trigger link pointed at /car-accident-chiropractor instead
 * of a real hub — see navbar-dropdown.tsx and content/site.ts's nav entry.
 * Hero → concise intro → ServiceGrid (reused as-is; its own doc comment
 * anticipated exactly this use) → LocationIntro/LocationFooter (shared
 * with Home/Services/About/Book) → contact LeadForm. */
export default function ConditionsPage() {
  return (
    <>
      <HeroSolidPanel
        breadcrumbs={[
          { name: "Home", path: "" },
          { name: "Conditions", path: "/conditions" },
        ]}
        background={conditionsHubHero.backgroundImage}
        eyebrow={conditionsHubHero.eyebrowChip}
        title={conditionsHubHero.h1}
        subhead={conditionsHubHero.subhead}
        callPill={{ eyebrow: "Speak with us today", phone: `Call ${siteConfig.business.phone}` }}
      />
      <Section>
        <Container className="flex flex-col gap-10">
          <div className="max-w-3xl">
            <SectionHeading as="h2" className="text-left">
              Conditions we treat
            </SectionHeading>
            <p className="mt-4 font-sans text-body-lg text-ink-900">{conditionsHubIntro}</p>
          </div>
          <ServiceGrid items={conditionsHubCards} />
        </Container>
      </Section>
      <LocationIntro />
      <LocationFooter />
      <ContactSection />
    </>
  );
}
