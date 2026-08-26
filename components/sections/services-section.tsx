import Link from "next/link";

import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceListRow } from "@/components/ui/service-list-row";
import { StaggerGroup, StaggerItem } from "@/components/ui/stagger-reveal";
import { DEFAULT_LOCALE, type Locale } from "@/content/i18n";
import { services, type Service } from "@/content/services";

/** Homepage services list per Figma (file NHwBqbGepOspY0GrCnECnj, node
 * 96:155, "Online Appointment" section): left-aligned heading (no eyebrow),
 * then rows fed by content/services.ts — each row carries its own Divider
 * under the title (see ServiceListRow), not between rows. Heading fades in
 * on its own; rows reveal as a subtle stagger once the list scrolls into
 * view (see components/ui/stagger-reveal.tsx).
 *
 * ATS-SEO-050: this component only ever renders on the homepage (the only
 * page that imports it), so the /services and /conditions links below are
 * never a same-page self-link — no gating needed, unlike DoctorProfile's
 * /about link or AccidentInjuries' /car-accident-chiropractor link. */
export interface ServicesSectionProps {
  items?: Service[];
  heading?: string;
  /** Hub links beside the heading. Defaults to the English /services and
   * /conditions hubs; the Spanish home page passes only its own
   * /es/servicios hub, since /conditions is English-only. */
  hubLinks?: { href: string; label: string }[];
  locale?: Locale;
}

export function ServicesSection({
  items = services,
  heading = "Chiropractic Services",
  hubLinks = [
    { href: "/services", label: "View all services" },
    { href: "/conditions", label: "Conditions we treat" },
  ],
  locale = DEFAULT_LOCALE,
}: ServicesSectionProps = {}) {
  return (
    <Section reveal={false}>
      <Container className="flex flex-col gap-2">
        <FadeIn
          whenInView
          className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2"
        >
          <SectionHeading tone="navy-800">{heading}</SectionHeading>
          <div className="flex gap-6 font-sans text-card-body">
            {hubLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-navy-900 underline underline-offset-4"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </FadeIn>
        <StaggerGroup className="flex flex-col gap-2">
          {items.map((service) => (
            <StaggerItem key={service.slug}>
              <ServiceListRow item={service} locale={locale} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </Section>
  );
}
