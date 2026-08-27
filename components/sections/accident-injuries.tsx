import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { ServiceCardItem } from "@/components/ui/service-card";
import { ServiceGrid } from "@/components/ui/service-grid";
import { accidentInjuries, buildAccidentInjuries } from "@/content/accident-injuries";
import { DEFAULT_LOCALE, type Locale } from "@/content/i18n";

/** "Common accident injuries we treat" grid per homepage artboard (Group 17,
 * 96:292–96:325): reuses ServiceGrid/ServiceCard, fed by
 * content/accident-injuries.ts.
 *
 * ATS-SEO-042: a still-draft card falls back to linking the
 * /car-accident-chiropractor page — pass `isAccidentPage` on that one page
 * itself so a card doesn't link back to the page it's already on.
 *
 * ATS-SEO-050: same `isAccidentPage` guard now also gates the explicit
 * "full car accident care page" link below — keeps the accident path a
 * clearly signposted, distinct destination from wherever this section
 * renders, without ever linking a page to itself. */
export interface AccidentInjuriesProps {
  isAccidentPage?: boolean;
  /** Localized cards. Defaults to the English set, so every existing
   * English call site renders exactly as before. The Spanish pages pass
   * their own — which is also why the fallback-link logic above is skipped
   * for them: the Spanish cards carry no `href` at all (the English
   * service/condition pages they'd point at are draft and English-only). */
  items?: ServiceCardItem[];
  eyebrow?: string;
  heading?: string;
  accidentPageLink?: { href: string; label: string };
  locale?: Locale;
}

export function AccidentInjuries({
  isAccidentPage = false,
  items: itemsProp,
  eyebrow = "What we treat",
  heading = "Common accident injuries we treat",
  accidentPageLink = {
    href: "/car-accident-chiropractor",
    label: "See our full car accident care page",
  },
  locale = DEFAULT_LOCALE,
}: AccidentInjuriesProps = {}) {
  const items =
    itemsProp ??
    (isAccidentPage ? buildAccidentInjuries({ skipAccidentPageFallback: true }) : accidentInjuries);
  return (
    <Section>
      <Container className="flex flex-col gap-14">
        <div className="flex flex-col items-center gap-4">
          <SectionHeading eyebrow={eyebrow} className="items-center font-semibold text-center">
            {heading}
          </SectionHeading>
          {!isAccidentPage && (
            <Link
              href={accidentPageLink.href}
              className="font-sans text-card-body text-navy-900 underline underline-offset-4"
            >
              {accidentPageLink.label}
            </Link>
          )}
        </div>
        <ServiceGrid items={items} locale={locale} />
      </Container>
    </Section>
  );
}
