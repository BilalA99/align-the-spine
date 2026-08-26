import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { ServiceCardItem } from "@/components/ui/service-card";
import { ServiceGrid } from "@/components/ui/service-grid";
import { DEFAULT_LOCALE, type Locale } from "@/content/i18n";
import { servicesGrid } from "@/content/services-grid";

/** "/services" ServiceGrid section (ATS-081): reuses ServiceGrid/ServiceCard
 * — same pattern as the homepage's AccidentInjuries grid — fed by
 * content/services-grid.ts's 6 core services.
 *
 * ATS-SEO-041: this component only ever renders on /services (the only
 * page that imports it), so the /conditions link below is never a
 * same-page self-link. */
export interface ServiceCatalogProps {
  items?: ServiceCardItem[];
  eyebrow?: string;
  heading?: string;
  /** The "see the conditions we treat" link. Omitted on Spanish pages —
   * /conditions is an English-only hub whose child pages are draft. */
  conditionsLink?: { href: string; label: string } | null;
  locale?: Locale;
}

export function ServiceCatalog({
  items = servicesGrid,
  eyebrow = "Our services",
  heading = "Comprehensive care, tailored to you",
  conditionsLink = { href: "/conditions", label: "See the conditions we treat" },
  locale = DEFAULT_LOCALE,
}: ServiceCatalogProps = {}) {
  return (
    <Section>
      <Container className="flex flex-col gap-14">
        <div className="flex flex-col items-center gap-4 text-center">
          <SectionHeading eyebrow={eyebrow} className="items-center text-center">
            {heading}
          </SectionHeading>
          {conditionsLink && (
            <Link
              href={conditionsLink.href}
              className="font-sans text-card-body text-navy-900 underline"
            >
              {conditionsLink.label}
            </Link>
          )}
        </div>
        <ServiceGrid items={items} locale={locale} />
      </Container>
    </Section>
  );
}
