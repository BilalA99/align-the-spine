import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceGrid } from "@/components/ui/service-grid";
import { servicesGrid } from "@/content/services-grid";

/** "/services" ServiceGrid section (ATS-081): reuses ServiceGrid/ServiceCard
 * — same pattern as the homepage's AccidentInjuries grid — fed by
 * content/services-grid.ts's 6 core services.
 *
 * ATS-SEO-041: this component only ever renders on /services (the only
 * page that imports it), so the /conditions link below is never a
 * same-page self-link. */
export function ServiceCatalog() {
  return (
    <Section>
      <Container className="flex flex-col gap-14">
        <div className="flex flex-col items-center gap-4 text-center">
          <SectionHeading eyebrow="Our services" className="items-center text-center">
            Comprehensive care, tailored to you
          </SectionHeading>
          <Link href="/conditions" className="font-sans text-card-body text-navy-900 underline">
            See the conditions we treat
          </Link>
        </div>
        <ServiceGrid items={servicesGrid} />
      </Container>
    </Section>
  );
}
