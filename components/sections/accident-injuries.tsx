import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceGrid } from "@/components/ui/service-grid";
import { accidentInjuries, buildAccidentInjuries } from "@/content/accident-injuries";

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
export function AccidentInjuries({ isAccidentPage = false }: { isAccidentPage?: boolean } = {}) {
  const items = isAccidentPage
    ? buildAccidentInjuries({ skipAccidentPageFallback: true })
    : accidentInjuries;
  return (
    <Section>
      <Container className="flex flex-col gap-14">
        <div className="flex flex-col items-center gap-4">
          <SectionHeading
            eyebrow="What we treat"
            className="items-center font-semibold text-center"
          >
            Common accident injuries we treat
          </SectionHeading>
          {!isAccidentPage && (
            <Link
              href="/car-accident-chiropractor"
              className="font-sans text-card-body text-navy-900 underline underline-offset-4"
            >
              See our full car accident care page
            </Link>
          )}
        </div>
        <ServiceGrid items={items} />
      </Container>
    </Section>
  );
}
